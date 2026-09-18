/**
 * `ChatMessageDto` wire shape — verbatim subset of nova-wcm's `support-chat.mappers.ts` (Chat.API
 * returns Chat.Domain enums as raw numeric ordinals, camelCase properties; unverified against a
 * live response, same caveat nova-wcm's own file documents — Chat Service isn't wired into local
 * docker-compose/gateway yet). Only the `content` field is actually used today (see
 * `signalr-chat-transport.ts`'s doc comment on why sender identity can't be resolved yet) — kept
 * otherwise complete so extending the widget to show timestamps/sender later needs no wire-shape
 * changes here.
 */
export interface RawChatMessageDto {
  id: string;
  conversationId: string;
  senderUserId?: string | null;
  senderType: number;
  sequence: number;
  type: number;
  content: string;
  format: number;
  createdAt: string;
}
