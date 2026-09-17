"use client";

import { ClientProvider } from "@novacore/frontend-next-mui/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

import { I18nProvider } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { createQueryClient } from "@/shared/lib/query/client";
import { NOVA_LANDING_THEME } from "@/shared/theme/nova-landing-theme";

/**
 * Client-only and code-split from the main bundle — Chat must never compete with page content for
 * the loading race (see the brief's performance requirement). `providers.tsx` is already a client
 * component, so `ssr: false` is allowed here (it isn't inside a Server Component). No SEO content
 * lives in the widget, so skipping SSR for it costs nothing.
 */
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget").then((mod) => mod.ChatWidget), { ssr: false });

export interface ProvidersProps {
  locale: LandingLocale;
  children: ReactNode;
}

/**
 * The full client provider tree for a public nova-landing page. Deliberately does NOT include
 * `PermissionProvider`/`AccessControlProvider`/`TenantEntitlementProvider`/`UserProfileProvider`
 * (the admin-app pattern nova-wcm/nova-console use) — this is a public, anonymous surface with no
 * authenticated area yet; add those back only if/when nova-landing grows one (see cerebrum's
 * Decision Log for the full reasoning).
 */
export function Providers({ locale, children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale}>
        <ClientProvider theme={NOVA_LANDING_THEME}>
          {children}
          <ChatWidget />
        </ClientProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
