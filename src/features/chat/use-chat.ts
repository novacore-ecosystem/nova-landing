"use client";

import * as React from "react";

import { useSessionStore } from "@/features/auth/store/session-store";
import { ConsoleChatAnalytics } from "./analytics/chat-analytics";
import { createLocalStorageChatSessionStorage } from "./session/chat-session-storage";
import { useChatStore } from "./store/chat-store";
import { RestChatTransport } from "./transport/rest-chat-transport";
import { SignalRChatTransport } from "./transport/signalr-chat-transport";
import type { StartConversationInput } from "./types";

// Module-level singletons — same precedent as `httpClient`/`bootstrapCoordinator` elsewhere in
// the ecosystem (nova-wcm). Two transports, not one: guest visitors always get the REST-only
// contract (matches the real backend's guest endpoints exactly); authenticated visitors get the
// live SignalR transport (see `signalr-chat-transport.ts`). `useChat` below picks between them
// per render based on session status — the UI never imports either directly.
const restTransport = new RestChatTransport();
const signalRTransport = new SignalRChatTransport();
const analytics = new ConsoleChatAnalytics();
const sessionStorage = createLocalStorageChatSessionStorage();

/**
 * Orchestrates Chat's UI store + transport + analytics + session persistence. This is the one
 * place those collaborate — `ChatWidget` and its children only ever call what this hook returns,
 * never a transport/`useChatStore` directly, so the UI stays ignorant of how messages actually
 * move or which transport is currently active.
 */
export function useChat() {
  const state = useChatStore();
  const sessionStatus = useSessionStore((s) => s.status);
  const transport = sessionStatus === "authenticated" ? signalRTransport : restTransport;

  // Recover a persisted guest session on mount (mirrors nova-wcm's GuestChatWidget recovery flow).
  // Skipped once we already know the visitor is authenticated — a stored guest session can't be
  // resumed through the SignalR transport anyway (see the login/logout transition effect below).
  const [isRecovering, setIsRecovering] = React.useState(sessionStatus !== "authenticated");
  React.useEffect(() => {
    if (sessionStatus === "authenticated") {
      setIsRecovering(false);
      return;
    }
    const stored = sessionStorage.get();
    if (!stored) {
      setIsRecovering(false);
      return;
    }
    restTransport
      .getStatus(stored)
      .then((status) => {
        if (status === "closed") {
          sessionStorage.set(null);
        } else {
          state.setSession(stored);
        }
      })
      .catch(() => sessionStorage.set(null))
      .finally(() => setIsRecovering(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only recovery, mirrors nova-wcm's pattern
  }, []);

  // Login/logout mid-session: a guest conversation can't carry over into the authenticated
  // transport (and vice versa), and logging out must tear down the live SignalR connection —
  // never leave it dangling. Both sides reset to a clean "closed, no session" state rather than
  // erroring.
  const prevStatusRef = React.useRef(sessionStatus);
  React.useEffect(() => {
    if (prevStatusRef.current === sessionStatus) return;
    if (prevStatusRef.current === "authenticated") void signalRTransport.disconnect();
    prevStatusRef.current = sessionStatus;
    sessionStorage.set(null);
    state.setSession(null);
    state.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `state`'s setters are stable zustand actions
  }, [sessionStatus]);

  // Live receive: a permanent no-op for the guest REST transport (see `ChatTransport`'s doc
  // comment), real for the authenticated SignalR transport. Re-subscribes whenever the active
  // transport changes (login/logout).
  React.useEffect(() => {
    return transport.onMessageReceived((content) => {
      state.appendMessage({ id: crypto.randomUUID(), author: "agent", content, createdAt: new Date().toISOString() });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `state.appendMessage` is a stable zustand action
  }, [transport]);

  const open = React.useCallback(() => {
    state.open();
    analytics.track("chat_opened");
  }, [state]);

  const close = React.useCallback(() => {
    state.close();
    analytics.track("chat_closed", undefined, state.session?.conversationId);
  }, [state]);

  const startConversation = React.useCallback(
    async (input: StartConversationInput) => {
      state.setSending(true);
      state.setError(null);
      try {
        const session = await transport.startConversation(input);
        if (transport === restTransport) sessionStorage.set(session);
        state.setSession(session);
        analytics.track("conversation_started", undefined, session.conversationId);
        return true;
      } catch {
        state.setError("startFailed");
        return false;
      } finally {
        state.setSending(false);
      }
    },
    [state, transport],
  );

  const sendMessage = React.useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !state.session) return false;

      state.setSending(true);
      state.setError(null);
      try {
        await transport.sendMessage(state.session, trimmed);
        state.appendMessage({ id: crypto.randomUUID(), author: "visitor", content: trimmed, createdAt: new Date().toISOString() });
        analytics.track("message_sent", undefined, state.session.conversationId);
        return true;
      } catch {
        state.setError("sendFailed");
        return false;
      } finally {
        state.setSending(false);
      }
    },
    [state, transport],
  );

  return {
    view: state.view,
    session: state.session,
    messages: state.messages,
    isSending: state.isSending,
    isRecovering,
    error: state.error,
    open,
    close,
    startConversation,
    sendMessage,
  };
}
