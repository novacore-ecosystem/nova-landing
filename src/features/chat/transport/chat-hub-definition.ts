import { hub } from "@novacore/frontend-foundation/realtime";

import type { RawChatMessageDto } from "./chat-messages.mapper";

/**
 * `hub()` definition for Chat.API's real `ChatHub` (`/hubs/chat`, see
 * `Chat.Infrastructure/SignalR/Hubs/ChatHub.cs`) — events/methods mirror nova-wcm's hand-rolled
 * `shared/lib/realtime/chat-hub.ts` verbatim, just declared through `frontend-foundation`'s
 * generic `hub()`/`RealtimeClient.forHub()` seam instead of a second hand-rolled singleton (see
 * the plan's Phase 3 decision).
 */
export interface ChatHubEvents extends Record<string, unknown> {
  ReceiveMessage: RawChatMessageDto;
  ConversationClosed: { conversationId: string; closedAt: string };
  UserTyping: { conversationId: string; userId: string };
  UserStoppedTyping: { conversationId: string; userId: string };
}

export interface ChatHubMethods extends Record<string, { request: unknown; response: unknown }> {
  JoinConversation: { request: string; response: void };
  LeaveConversation: { request: string; response: void };
  RecoverMessages: { request: [conversationId: string, afterSequence: number]; response: RawChatMessageDto[] };
}

export const ChatHub = hub<ChatHubEvents, ChatHubMethods>({ name: "ChatHub" });
