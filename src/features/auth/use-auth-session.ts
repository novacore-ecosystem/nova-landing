"use client";

import { createAuthSessionController, resolveLocale, type AuthSessionState } from "@novacore/frontend-foundation";
import { useSyncExternalStore } from "react";

import { httpClient } from "@/shared/lib/api/client";

/**
 * The one session controller for this app — `frontend-foundation`'s shared cookie-auth lifecycle
 * (login / logout / refresh / current user), not a landing-specific service. Only this file binds
 * it to the app (client) and to React.
 */
export const authSession = createAuthSessionController({
  httpClient,
  getErrorTranslationOptions: () => ({ locale: resolveLocale(document.documentElement.lang) }),
});

const SERVER_STATE: AuthSessionState = { status: "unknown", session: null, loading: false, error: null };

export function useAuthSession(): AuthSessionState {
  return useSyncExternalStore(authSession.subscribe, authSession.getState, () => SERVER_STATE);
}
