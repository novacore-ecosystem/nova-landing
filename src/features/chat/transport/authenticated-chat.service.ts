import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";

const BASE_PATH = "/chat";
/** Chat.Domain `ConversationType.OneToOne` / `ConversationLifecycle.Session` — a fresh support chat, not a persistent group. */
const CONVERSATION_TYPE_ONE_TO_ONE = 1;
const CONVERSATION_LIFECYCLE_SESSION = 1;
const MESSAGE_TYPE_TEXT = 1;
const MESSAGE_FORMAT_PLAIN_TEXT = 1;
/** Chat.API status ordinal for "closed" (`ConversationStatus.Closed`). */
const CLOSED_STATUS = 4;

/**
 * The authenticated end-user REST surface — `POST /conversations` (`Chat.API/Endpoints/
 * Conversations/CreateConversation.cs`, bare `.RequireAuthorization()`, no role check) plus the
 * same `sendMessage`/status endpoints nova-wcm's admin `support-chat.service.ts` already wraps
 * for the agent side. Not reusing that file directly: it's shaped around the admin workspace
 * (queue/claim/handover) this widget has no business calling, and lives in a different app
 * anyway — this is nova-landing's own thin slice of the identical real contract.
 */
export const authenticatedChatService = {
  async createConversation(reason?: string): Promise<{ conversationId: string }> {
    const response = await httpClient.post<ApiResponse<{ conversationId: string }>>(`${BASE_PATH}/conversations`, {
      type: CONVERSATION_TYPE_ONE_TO_ONE,
      lifecycle: CONVERSATION_LIFECYCLE_SESSION,
      reason: reason?.trim() || undefined,
    });
    return unwrapApiResponse(response);
  },

  /** The created message is also broadcast via `ChatHub.ReceiveMessage` — see `signalr-chat-transport.ts` for why the returned `messageId` (not this call) is what marks a message as "mine" when it echoes back. */
  async sendMessage(conversationId: string, content: string): Promise<{ messageId: string }> {
    const response = await httpClient.post<ApiResponse<{ messageId: string; sequence: number }>>(`${BASE_PATH}/conversations/${conversationId}/messages`, {
      clientMessageId: crypto.randomUUID(),
      type: MESSAGE_TYPE_TEXT,
      content,
      format: MESSAGE_FORMAT_PLAIN_TEXT,
    });
    return unwrapApiResponse(response);
  },

  async getStatus(conversationId: string): Promise<"open" | "closed"> {
    const response = await httpClient.get<ApiResponse<{ status: number }>>(`${BASE_PATH}/conversations/${conversationId}/status`);
    return unwrapApiResponse(response).status === CLOSED_STATUS ? "closed" : "open";
  },
};
