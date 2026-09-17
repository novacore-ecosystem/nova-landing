import { create } from "zustand";

import type { ChatMessage, ChatSession } from "../types";

export type ChatWidgetView = "closed" | "intro" | "conversation";

interface ChatState {
  view: ChatWidgetView;
  session: ChatSession | null;
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  setSession: (session: ChatSession | null) => void;
  appendMessage: (message: ChatMessage) => void;
  setSending: (isSending: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Pure client UI/session state — no transport or analytics calls happen here (those live in
 * `useChat`, which orchestrates this store + a `ChatTransport` + `ChatAnalytics`). Keeping the
 * store this thin is what makes it trivial to unit-test and to swap the transport without
 * touching state shape.
 */
export const useChatStore = create<ChatState>((set) => ({
  view: "closed",
  session: null,
  messages: [],
  isSending: false,
  error: null,
  open: () => set((state) => ({ view: state.session ? "conversation" : "intro" })),
  close: () => set({ view: "closed" }),
  setSession: (session) => set({ session }),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
}));
