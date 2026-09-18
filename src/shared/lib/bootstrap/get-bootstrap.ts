import { cache } from "react";
import { BootstrapEndpoints, type TenantBootstrapResponse } from "@novacore/frontend-foundation";

import { httpClient } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";

/**
 * Server-only, anonymous read of Auth's `GET /bootstrap` — `cache()`-wrapped so every Server
 * Component that needs it (layout, page, header, footer) can call it independently without
 * re-fetching within the same request, matching this codebase's existing pattern of each
 * component calling `getTranslator(locale)` on its own rather than prop-threading it.
 *
 * Deliberately NOT the full client-reactive Bootstrap layer nova-wcm has (localStorage cache,
 * version-refresh coordinator, cookie marker) — that's a separate, not-yet-needed quest (see
 * `.wolf/STATUS.md`'s next-phase item 4). This is just enough to satisfy this task's
 * Bootstrap-translation-priority and branding requirements.
 *
 * Must degrade gracefully: no `.env` values are provisioned for a live backend in local dev
 * (documented external blocker), and `generateStaticParams` means this can run at `next build`
 * time with no backend reachable at all — a failure here must never break the page or slow the
 * build past a short timeout, so every error (network, timeout, missing config) resolves to
 * `null` rather than throwing.
 */
export const getBootstrap = cache(async (): Promise<TenantBootstrapResponse | null> => {
  if (!env.tenantClientKey) return null;

  try {
    return await httpClient.execute(BootstrapEndpoints.get, undefined, {
      headers: { "X-Tenant-Client-Key": env.tenantClientKey },
      timeout: 2000,
    });
  } catch {
    return null;
  }
});
