import type { ChatSession } from "../types";

/** Same "you supply the storage" shape as `frontend-foundation`'s `BootstrapStorage` — kept local to Chat rather than reused directly since the two have no other relationship and forcing a shared generic here would be an abstraction with no real payoff. */
export interface ChatSessionStorage {
  get(): ChatSession | null;
  set(session: ChatSession | null): void;
}

const STORAGE_KEY = "nova-landing.chat-session";

export function createLocalStorageChatSessionStorage(): ChatSessionStorage {
  return {
    get() {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ChatSession) : null;
      } catch {
        return null;
      }
    },
    set(session) {
      if (typeof window === "undefined") return;
      try {
        if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        else window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage unavailable (quota, private mode) — session simply won't survive a reload.
      }
    },
  };
}
