import { endpoint, HttpMethods } from "@novacore/frontend-foundation";

import { httpClient } from "@/shared/lib/api/client";

/** Chat.Domain `ConversationType.OneToOne` / `ConversationLifecycle.Session` — a fresh support chat, not a persistent group. */
const CONVERSATION_TYPE_ONE_TO_ONE = 1;
const CONVERSATION_LIFECYCLE_SESSION = 1;
const MESSAGE_TYPE_TEXT = 1;
const MESSAGE_FORMAT_PLAIN_TEXT = 1;
/** Chat.API status ordinal for "closed" (`ConversationStatus.Closed`). */
const CLOSED_STATUS = 4;

/**
 * Chat.API endpoints for an authenticated end user (`POST /conversations` is bare
 * `.RequireAuthorization()`, no role check) — declared with the foundation's `endpoint()` helper so
 * they run through the shared `HttpClient.execute` like every other call. The foundation has no
 * chat module yet, hence declared here.
 */
const ChatEndpoints = {
  createConversation: endpoint<
    { type: number; lifecycle: number; reason?: string },
    { conversationId: string }
  >({ method: HttpMethods.Post, path: "/chat/conversations" }),
  sendMessage: endpoint<
    { id: string; clientMessageId: string; type: number; content: string; format: number },
    { messageId: string; sequence: number }
  >({ method: HttpMethods.Post, path: "/chat/conversations/:id/messages" }),
  getStatus: endpoint<{ id: string }, { status: number }>({ method: HttpMethods.Get, path: "/chat/conversations/:id/status" }),
} as const;

export const authenticatedChatService = {
  createConversation(reason?: string): Promise<{ conversationId: string }> {
    return httpClient.execute(ChatEndpoints.createConversation, {
      type: CONVERSATION_TYPE_ONE_TO_ONE,
      lifecycle: CONVERSATION_LIFECYCLE_SESSION,
      reason: reason?.trim() || undefined,
    });
  },

  /** The created message is also broadcast via `ChatHub.ReceiveMessage` — see `signalr-chat-transport.ts` for why the returned `messageId` marks a message as "mine" when it echoes back. */
  sendMessage(conversationId: string, content: string): Promise<{ messageId: string }> {
    return httpClient.execute(ChatEndpoints.sendMessage, {
      id: conversationId,
      clientMessageId: crypto.randomUUID(),
      type: MESSAGE_TYPE_TEXT,
      content,
      format: MESSAGE_FORMAT_PLAIN_TEXT,
    });
  },

  async getStatus(conversationId: string): Promise<"open" | "closed"> {
    const { status } = await httpClient.execute(ChatEndpoints.getStatus, { id: conversationId });
    return status === CLOSED_STATUS ? "closed" : "open";
  },
};
