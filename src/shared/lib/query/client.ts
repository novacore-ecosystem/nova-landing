import { QueryClient } from "@tanstack/react-query";

/**
 * Client-side query cache for interactive data only (chat, forms) — main page content is
 * server-fetched for SEO (see cerebrum's Decision Log), so it never goes through this cache.
 * `staleTime` is deliberately much higher than nova-wcm's 30s admin-tool default: nothing this
 * client cache holds changes second-to-second.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
