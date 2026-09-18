/**
 * Chat's own minimal message/session model — deliberately not the full admin `ConversationMessage`
 * shape nova-wcm's agent workspace uses (senderType enum, sequence, format, etc.). A visitor-facing
 * widget only ever needs "who said it and what" to render a bubble; anything else stays behind the
 * transport boundary so swapping REST-only for REST+SignalR later never touches UI/state code.
 */
export interface ChatMessage {
  id: string;
  author: "visitor" | "agent";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  conversationId: string;
  /** Set for the guest REST transport (Chat.API issues a short-lived guest token). Absent for the authenticated SignalR transport — auth rides the session's httpOnly cookie instead, see `SignalRChatTransport`. */
  accessToken?: string;
}

export interface StartConversationInput {
  displayName: string;
  phone: string;
  email?: string;
  reason?: string;
}

export type ConversationLifecycleStatus = "open" | "closed";
