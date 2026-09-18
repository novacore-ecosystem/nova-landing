import { create } from "zustand";

import type { CurrentUser, SessionStatus } from "@/features/auth/types";

interface SessionState {
  status: SessionStatus;
  user: CurrentUser | null;
  setAuthenticated: (user: CurrentUser) => void;
  setUnauthenticated: () => void;
}

/**
 * Mirrors nova-wcm's `useSessionStore` shape exactly — the one deliberate exception to "server
 * state lives in Query, not Zustand," written only by `useSessionBootstrapQuery` and the
 * login/logout mutations (`auth.queries.ts`). Every other component (header, chat) only reads it.
 */
export const useSessionStore = create<SessionState>((set) => ({
  status: "unknown",
  user: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
}));
