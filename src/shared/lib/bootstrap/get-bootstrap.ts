import { cache } from "react";
import { BootstrapEndpoints, type TenantBootstrapResponse } from "@novacore/frontend-foundation";

import { httpClient } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";

/**
 * Server-only, anonymous read of Auth's `GET /bootstrap` (tenant resolved by the client's default
 * `X-Tenant-Client-Key` header) — `cache()`-wrapped so every Server Component can call it without
 * re-fetching within a request. Not the client-reactive Bootstrap layer (see `.wolf/STATUS.md`).
 *
 * Must degrade gracefully: with no tenant key configured, or no backend reachable (also true at
 * `next build`), every failure resolves to `null` rather than throwing or stalling the page.
 */
export const getBootstrap = cache(async (): Promise<TenantBootstrapResponse | null> => {
  if (!env.tenantClientKey) return null;

  try {
    return await httpClient.execute(BootstrapEndpoints.get, undefined, { timeout: 2000 });
  } catch {
    return null;
  }
});
