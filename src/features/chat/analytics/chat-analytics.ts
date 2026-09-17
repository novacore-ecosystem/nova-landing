/**
 * Chat's event boundary — the seam the brief asks for toward AI/conversation-intelligence/
 * behavioral-analytics/CRM, without building any of those now. Chat UI/state only ever calls
 * `track()`; it has no idea whether events go to `console.debug`, a real analytics/CRM service, or
 * both. Kept intentionally tiny (one method) — this isn't a generic pub/sub system, it's a single
 * capability with one implementation to swap later.
 */
export type ChatEventName =
  | "chat_opened"
  | "chat_closed"
  | "conversation_started"
  | "message_sent"
  | "message_received"
  | "handoff_requested"
  | "conversation_completed";

export interface ChatEvent {
  name: ChatEventName;
  conversationId?: string;
  timestamp: string;
  properties?: Record<string, string | number | boolean>;
}

export interface ChatAnalytics {
  track(name: ChatEventName, properties?: ChatEvent["properties"], conversationId?: string): void;
}

/**
 * Default implementation — logs to the console in development, does nothing in production.
 * TODO: Connect chat analytics events to the customer behavior tracking / conversation
 * intelligence service once one exists. Every event this module ever emits already flows through
 * this single `track()` call, so wiring a real sink later is a one-file change.
 */
export class ConsoleChatAnalytics implements ChatAnalytics {
  track(name: ChatEventName, properties?: ChatEvent["properties"], conversationId?: string): void {
    if (process.env.NODE_ENV === "production") return;
    const event: ChatEvent = { name, conversationId, timestamp: new Date().toISOString(), properties };
    console.debug("[chat-analytics]", event);
  }
}
