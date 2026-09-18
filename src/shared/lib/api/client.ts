import { createHttpClient } from "@novacore/frontend-foundation";

import { env } from "@/shared/lib/env";

/**
 * The app's single foundation `HttpClient`, configured the way `AuthEndpoints`' doc comment asks:
 * cookie auth (`withCredentials`) plus the per-deployment `X-Tenant-Client-Key`/`X-App-Key` default
 * headers. Also used server-side (Bootstrap fetch) — the `document` guard keeps that safe. Callers
 * use `httpClient.execute(endpoint, request)`, which already unwraps the `ApiResponse` envelope.
 */
export const httpClient = createHttpClient({
  baseUrl: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "X-Tenant-Client-Key": env.tenantClientKey,
    "X-App-Key": env.appCode,
  },
  interceptors: [
    {
      onRequest(request) {
        return {
          ...request,
          headers: {
            ...request.headers,
            "Accept-Language": typeof document !== "undefined" ? document.documentElement.lang : "en",
          },
        };
      },
    },
  ],
});
