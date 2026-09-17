const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_SITE_URL = "http://localhost:3000";

/** Strips a trailing `/api` (or `/api/`) so a hub URL can be built off the gateway's bare origin. */
function gatewayOrigin(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  /** This app's own canonical origin, no trailing slash — the base for absolute SEO/OG URLs. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, ""),
  /**
   * nova-landing's TenantClient public key (X-Tenant-Client-Key header) for the anonymous
   * Bootstrap fetch — deployment config, not a per-user secret. See shared/lib/bootstrap/.
   */
  tenantClientKey: process.env.NEXT_PUBLIC_TENANT_CLIENT_KEY ?? "",
  /** `ChatHub`'s SignalR endpoint — same derivation rationale as nova-wcm's env module. */
  chatHubUrl:
    process.env.NEXT_PUBLIC_CHAT_HUB_URL ??
    `${gatewayOrigin(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL)}/hubs/chat`,
} as const;
