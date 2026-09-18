import type { ApiResponse } from "@novacore/frontend-foundation";

import type { LoginFormValues } from "@/features/auth/auth.schema";
import type { CurrentUser } from "@/features/auth/types";
import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import type { InitialAuthState } from "@/shared/lib/auth/initial-auth-state";
import { env } from "@/shared/lib/env";

const BASE_PATH = "/auth";

interface LoginRequestDto {
  email: string;
  password: string;
}

/** `POST /auth/login` response carries no token, only the tenant's Bootstrap `version` — sets HTTP-only session cookies. Mirrors nova-wcm's `LoginResponseDto`. */
interface LoginResponseDto {
  version: number | null;
}

async function login(request: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await httpClient.post<ApiResponse<LoginResponseDto>>(`${BASE_PATH}/login`, request, {
    headers: {
      "X-Tenant-Client-Key": env.tenantClientKey,
      "X-App-Key": env.appCode,
    },
  });
  return unwrapApiResponse(response);
}

/** `POST /auth/logout` — revokes the refresh token and clears session cookies. */
async function logout(): Promise<void> {
  const response = await httpClient.post<ApiResponse<object>>(`${BASE_PATH}/logout`);
  unwrapApiResponse(response);
}

/** `POST /auth/refresh-token` — reissues both cookies. Only called when `InitialAuthState.needsRefresh` says so. */
async function refreshToken(): Promise<LoginResponseDto> {
  const response = await httpClient.post<ApiResponse<LoginResponseDto>>(`${BASE_PATH}/refresh-token`, undefined, {
    headers: { "X-App-Key": env.appCode },
  });
  return unwrapApiResponse(response);
}

/**
 * DEV ADAPTER — same real-world limitation nova-wcm/nova-console document for their own
 * `getCurrentUser` stubs: no backend `/me` endpoint exists anywhere in the ecosystem yet, so
 * there is no way to fetch real identity after a page reload (only the login form's own
 * just-submitted values are ever available). Unlike nova-wcm (which assumes every session is
 * Root, correct for its admin-only context), nova-landing has real end-user visitors — so this
 * derives the only real signal available: the email just used to log in. `null` after a reload
 * with no fresh login means "we know a session cookie exists but not who it belongs to"; callers
 * must treat that as "authenticated, identity unknown" rather than falling back to guest.
 *
 * MUST be replaced with a real service call once the backend exposes a session/`/me` endpoint —
 * do not extend this stub with more invented fields.
 */
function currentUserFromLogin(email: string): CurrentUser {
  return { id: email, name: email.split("@")[0] ?? email, email };
}

export const authService = {
  async login(values: LoginFormValues) {
    const { version } = await login({ email: values.email, password: values.password });
    return { user: currentUserFromLogin(values.email), version };
  },
  async logout() {
    await logout();
  },
  /**
   * Resolves the current session, or null if none exists. Never throws. Only refreshes when
   * `initialAuthState.needsRefresh` says so — a true guest (neither cookie present) resolves
   * immediately with no network call. Identity is unknown after a refresh-only resolve (no
   * `/me` endpoint — see `currentUserFromLogin`'s doc comment) — `user` is a minimal placeholder
   * in that case, present only to signal "authenticated," not real profile data.
   */
  async bootstrapSession(initialAuthState: InitialAuthState) {
    if (!initialAuthState.hasAccessToken && !initialAuthState.hasRefreshToken) {
      return { user: null };
    }

    try {
      if (initialAuthState.needsRefresh) await refreshToken();
      return { user: { id: "session", name: "Account" } satisfies CurrentUser };
    } catch {
      return { user: null };
    }
  },
};
