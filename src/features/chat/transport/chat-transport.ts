import type { ChatSession, ConversationLifecycleStatus, StartConversationInput } from "../types";

/**
 * The seam between Chat's UI/state and however messages actually move. Today's real backend
 * (Chat Service, confirmed live and already integrated by nova-wcm's `GuestChatWidget`) only
 * supports REST send for guests — no realtime receive for the guest side (see
 * `RestChatTransport`'s doc comment). This interface exists so that gap can close later
 * (SignalR receive, then AI suggestions, then behavior analytics) by adding a second
 * implementation, without the widget or the zustand store changing at all.
 *
 * `onMessageReceived` is optional by design: a transport that can only send (today's
 * `RestChatTransport`) simply never calls it; a future realtime-capable transport wires it to a
 * live push. Callers must treat "no realtime" as a normal, first-class transport capability, not
 * an error.
 */
export interface ChatTransport {
  startConversation(input: StartConversationInput): Promise<ChatSession>;
  sendMessage(session: ChatSession, content: string): Promise<void>;
  getStatus(session: ChatSession): Promise<ConversationLifecycleStatus>;
  /** Returns an unsubscribe function. No-op for transports with no realtime receive path. */
  onMessageReceived(handler: (content: string) => void): () => void;
}
