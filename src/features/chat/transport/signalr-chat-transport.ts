import { createRealtimeClient, type RealtimeClient } from "@novacore/frontend-foundation/realtime";

import { env } from "@/shared/lib/env";
import type { ChatSession, ConversationLifecycleStatus, StartConversationInput } from "../types";
import { authenticatedChatService } from "./authenticated-chat.service";
import type { ChatTransport } from "./chat-transport";
import { ChatHub } from "./chat-hub-definition";

/**
 * Real live chat for authenticated end users — the first "logged-in end-user talks to support
 * over SignalR" consumer anywhere in the ecosystem (confirmed: no such feature exists in
 * nova-wcm/nova-console to copy). Built on `frontend-foundation`'s generic `RealtimeClient`/
 * `hub()` (`../transport/chat-hub-definition`) rather than a third hand-rolled singleton copy of
 * nova-wcm's `shared/lib/realtime/chat-hub.ts`.
 *
 * Auth rides the session's httpOnly cookie (`withCredentials: true`, the same fix that made this
 * possible — see `RealtimeClientOptions`'s doc comment in `frontend-foundation`), not a bearer
 * token — this ecosystem has no client-readable access token to hand a `tokenProvider`.
 *
 * Sender identity (visitor vs. agent) can't be resolved from `senderUserId` today: the backend
 * has no role split (confirmed — any authenticated JWT can call every conversation endpoint
 * identically, see `ChatHub.cs`'s doc comment) and there is still no `/me` endpoint anywhere in
 * the ecosystem to learn the current user's own id for comparison. Instead of guessing, this
 * tracks the server-issued `messageId` of every message *this transport itself* just sent
 * (`sendMessage`) and silently swallows the matching `ReceiveMessage` echo — everything else
 * genuinely came from the other party. This needs no identity at all and can't misfire.
 */
export class SignalRChatTransport implements ChatTransport {
  private client: RealtimeClient | null = null;
  private connectPromise: Promise<RealtimeClient> | null = null;
  private readonly ownMessageIds = new Set<string>();

  private ensureConnected(): Promise<RealtimeClient> {
    this.client ??= createRealtimeClient({ hubUrl: env.chatHubUrl, withCredentials: true });
    const client = this.client;
    this.connectPromise ??= client.connect().then(() => client);
    return this.connectPromise;
  }

  async startConversation(input: StartConversationInput): Promise<ChatSession> {
    const { conversationId } = await authenticatedChatService.createConversation(input.reason);
    const client = await this.ensureConnected();
    await client.forHub(ChatHub).invoke("JoinConversation", conversationId);
    return { conversationId };
  }

  async sendMessage(session: ChatSession, content: string): Promise<void> {
    const { messageId } = await authenticatedChatService.sendMessage(session.conversationId, content);
    this.ownMessageIds.add(messageId);
  }

  async getStatus(session: ChatSession): Promise<ConversationLifecycleStatus> {
    return authenticatedChatService.getStatus(session.conversationId);
  }

  onMessageReceived(handler: (content: string) => void): () => void {
    let unsubscribed = false;
    let unsubscribe: (() => void) | null = null;

    void this.ensureConnected().then((client) => {
      if (unsubscribed) return;
      unsubscribe = client.forHub(ChatHub).subscribe("ReceiveMessage", (message) => {
        if (this.ownMessageIds.delete(message.id)) return;
        handler(message.content);
      });
    });

    return () => {
      unsubscribed = true;
      unsubscribe?.();
    };
  }

  /** Tears down the connection entirely — called on logout (see `use-chat.ts`), not on a single conversation ending. */
  async disconnect(): Promise<void> {
    await this.client?.disconnect();
    this.client = null;
    this.connectPromise = null;
    this.ownMessageIds.clear();
  }
}
