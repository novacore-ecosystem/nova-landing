"use client";

import * as React from "react";

import { ConsoleChatAnalytics } from "./analytics/chat-analytics";
import { createLocalStorageChatSessionStorage } from "./session/chat-session-storage";
import { useChatStore } from "./store/chat-store";
import { RestChatTransport } from "./transport/rest-chat-transport";
import type { StartConversationInput } from "./types";

// Module-level singletons — same precedent as `httpClient`/`bootstrapCoordinator` elsewhere in
// the ecosystem (nova-wcm). Swapping the transport implementation (e.g. adding SignalR receive)
// is a one-line change here; nothing below or in the UI needs to know.
const transport = new RestChatTransport();
const analytics = new ConsoleChatAnalytics();
const sessionStorage = createLocalStorageChatSessionStorage();

/**
 * Orchestrates Chat's UI store + transport + analytics + session persistence. This is the one
 * place those four collaborate — `ChatWidget` and its children only ever call what this hook
 * returns, never `RestChatTransport`/`useChatStore` directly, so the UI stays ignorant of how
 * messages actually move.
 */
export function useChat() {
  const state = useChatStore();

  // Recover a persisted guest session on mount (mirrors nova-wcm's GuestChatWidget recovery flow).
  const [isRecovering, setIsRecovering] = React.useState(true);
  React.useEffect(() => {
    const stored = sessionStorage.get();
    if (!stored) {
      setIsRecovering(false);
      return;
    }
    transport
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
        sessionStorage.set(session);
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
    [state],
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
    [state],
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
