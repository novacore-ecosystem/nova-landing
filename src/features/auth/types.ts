export type SessionStatus = "unknown" | "authenticated" | "unauthenticated";

/**
 * No `/me` endpoint exists anywhere in the ecosystem yet (confirmed gap — nova-wcm's own
 * `getCurrentUser` is a hardcoded dev-stub for the same reason, see `auth.service.ts`'s doc
 * comment). Kept intentionally small: only what's actually derivable today.
 */
export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
}
