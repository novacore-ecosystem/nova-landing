/**
 * Local reimplementation of `@novacore/frontend-next-shadcn`'s `buildInitialAuthState`/
 * `AUTH_COOKIE_NAMES` — nova-landing deliberately does not depend on that package (see
 * `.wolf/cerebrum.md`'s Decision Log: it broke `yarn install` on Windows and isn't needed for
 * anything else). This is the same ~20-line helper, unchanged in behavior: a server-side "does
 * this request already carry usable auth cookies" render hint, never an authorization decision —
 * nothing here verifies the access token's signature.
 */
export interface InitialAuthStateCookies {
  accessToken?: string;
  refreshToken?: string;
}

/** The exact cookie names Auth's `CurrentUserService` sets/reads — same names every NovaCore app reads by. */
export const AUTH_COOKIE_NAMES = {
  accessToken: "AccessToken",
  refreshToken: "RefreshToken",
} as const;

export interface InitialAuthState {
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  /** True when a refresh should happen before the app trusts it has a valid session. False for a true guest (neither cookie present). */
  needsRefresh: boolean;
}

function decodeJwtPayloadUnverified(token: string): Record<string, unknown> | null {
  const segments = token.split(".");
  if (segments.length !== 3) return null;

  try {
    const base64 = segments[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isAccessTokenExpired(accessToken: string): boolean {
  const payload = decodeJwtPayloadUnverified(accessToken);
  const exp = typeof payload?.exp === "number" ? payload.exp : undefined;
  return exp === undefined || exp * 1000 <= Date.now();
}

export function buildInitialAuthState({ accessToken, refreshToken }: InitialAuthStateCookies): InitialAuthState {
  const hasAccessToken = Boolean(accessToken);
  const hasRefreshToken = Boolean(refreshToken);

  if (!hasAccessToken) {
    return { hasAccessToken, hasRefreshToken, needsRefresh: hasRefreshToken };
  }

  return { hasAccessToken, hasRefreshToken, needsRefresh: isAccessTokenExpired(accessToken!) };
}
