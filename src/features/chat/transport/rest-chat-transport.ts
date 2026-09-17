import { env } from "@/shared/lib/env";

import type { ChatSession, ConversationLifecycleStatus, StartConversationInput } from "../types";
import type { ChatTransport } from "./chat-transport";

const CHAT_BASE = `${env.apiBaseUrl}/chat`;
/** Chat.API status ordinal for "closed" (`ConversationStatus.Closed`), confirmed against nova-wcm's real integration. */
const CLOSED_STATUS = 4;
/** Chat.Domain `MessageType.Text` / `MessageFormat.PlainText` ordinals — the only combination a guest ever sends. */
const MESSAGE_TYPE_TEXT = 1;
const MESSAGE_FORMAT_PLAIN_TEXT = 1;

async function callChatService<T>(path: string, options: { method: "GET" | "POST"; token?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`${CHAT_BASE}${path}`, {
    method: options.method,
    credentials: "omit",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) throw new Error(`Chat Service request failed (${response.status})`);
  const envelope = (await response.json()) as { success: boolean; message: string; data: T };
  if (!envelope.success) throw new Error(envelope.message || "Chat Service request failed");
  return envelope.data;
}

/**
 * The real Chat Service, REST-only — matches nova-wcm's `GuestChatWidget` contract exactly
 * (`POST /chat/guests/conversations`, `POST /chat/conversations/{id}/messages`,
 * `GET /chat/conversations/{id}/status`). This is not a mock: the backend genuinely has this
 * shape today. `onMessageReceived` is a documented no-op — the guest side has no realtime receive
 * path yet (see `ChatTransport`'s doc comment); a future `SignalRChatTransport` (or a decorator
 * wrapping this one) is where that capability would live.
 */
export class RestChatTransport implements ChatTransport {
  async startConversation(input: StartConversationInput): Promise<ChatSession> {
    const response = await callChatService<{ contactId: string; conversationId: string; accessToken: string }>(
      "/guests/conversations",
      {
        method: "POST",
        body: {
          displayName: input.displayName.trim(),
          email: input.email?.trim() || undefined,
          phone: input.phone.trim() || undefined,
          reason: input.reason?.trim() || undefined,
        },
      },
    );
    return { conversationId: response.conversationId, accessToken: response.accessToken };
  }

  async sendMessage(session: ChatSession, content: string): Promise<void> {
    await callChatService(`/conversations/${session.conversationId}/messages`, {
      method: "POST",
      token: session.accessToken,
      body: { clientMessageId: crypto.randomUUID(), type: MESSAGE_TYPE_TEXT, content, format: MESSAGE_FORMAT_PLAIN_TEXT },
    });
  }

  async getStatus(session: ChatSession): Promise<ConversationLifecycleStatus> {
    const response = await callChatService<{ status: number }>(`/conversations/${session.conversationId}/status`, {
      method: "GET",
      token: session.accessToken,
    });
    return response.status === CLOSED_STATUS ? "closed" : "open";
  }

  onMessageReceived(): () => void {
    return () => {};
  }
}
