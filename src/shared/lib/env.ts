const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_SITE_URL = "http://localhost:3000";

/** Accepts a scheme-less `host:port` (easy to write in a `.env`) — without a scheme axios/SignalR treat the value as a relative or invalid URL and every request silently fails. */
function withScheme(value: string): string {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `http://${value}`;
}

/** Strips a trailing `/api` (or `/api/`) so a hub URL can be built off the gateway's bare origin. */
function gatewayOrigin(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

const apiBaseUrl = withScheme(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL);

export const env = {
  apiBaseUrl,
  /** This app's own canonical origin, no trailing slash — the base for absolute SEO/OG URLs. */
  siteUrl: withScheme(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, ""),
  /**
   * nova-landing's TenantClient public key (X-Tenant-Client-Key header) for the anonymous
   * Bootstrap fetch — deployment config, not a per-user secret. See shared/lib/bootstrap/.
   */
  tenantClientKey: process.env.NEXT_PUBLIC_TENANT_CLIENT_KEY ?? "",
  /**
   * This App's stable Code (`X-App-Key` login/register/refresh-token header — see Auth's
   * `LoginHandler.ResolveAppAsync`, same requirement nova-wcm's env module documents). Required
   * for login/refresh to resolve which App a session belongs to.
   */
  appCode: process.env.NEXT_PUBLIC_APP_CODE ?? "",
  /** `ChatHub`'s SignalR endpoint — same derivation rationale as nova-wcm's env module. */
  chatHubUrl: process.env.NEXT_PUBLIC_CHAT_HUB_URL
    ? withScheme(process.env.NEXT_PUBLIC_CHAT_HUB_URL)
    : `${gatewayOrigin(apiBaseUrl)}/hubs/chat`,
} as const;
