"use client";

import { ClientProvider, useClientTheme } from "@novacore/frontend-next-mui/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import type { InitialAuthState, TranslationBundle } from "@novacore/frontend-foundation";

import { I18nProvider } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { authSession } from "@/features/auth/use-auth-session";
import { createQueryClient } from "@/shared/lib/query/client";
import { NOVA_LANDING_THEME, THEME_MODE_STORAGE_KEY } from "@/shared/theme/nova-landing-theme";

/**
 * Client-only and code-split from the main bundle — Chat must never compete with page content for
 * the loading race (see the brief's performance requirement). `providers.tsx` is already a client
 * component, so `ssr: false` is allowed here (it isn't inside a Server Component). No SEO content
 * lives in the widget, so skipping SSR for it costs nothing.
 */
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget").then((mod) => mod.ChatWidget), { ssr: false });

export interface ProvidersProps {
  locale: LandingLocale;
  initialAuthState: InitialAuthState;
  /** Bootstrap-provided tenant translations, read server-side (see `[locale]/layout.tsx`) — this provider can't fetch Bootstrap itself, it's a client component. */
  tenantTranslations?: TranslationBundle;
  children: ReactNode;
}

/** Resumes the session once per page load from the server's cookie hint — guests resolve locally with no request, so the page renders fully with zero auth errors. */
function SessionBootstrap({ initialAuthState }: { initialAuthState: InitialAuthState }) {
  useEffect(() => {
    void authSession.restore(initialAuthState);
  }, [initialAuthState]);
  return null;
}

/**
 * Applies a persisted theme mode choice once, after mount — deliberately NOT read synchronously
 * before first render (a lazy `useState` initializer reading `localStorage` would make the
 * client's first render diverge from the server-rendered HTML, a hydration mismatch). Server and
 * first client render always agree on `NOVA_LANDING_THEME`'s static `mode`; this then corrects it
 * shortly after mount, the same trade-off `ClientProvider` itself already makes and documents for
 * `mode: "system"` (a brief flash for correctness; not a bug to fix here).
 */
function ThemeModePersistence() {
  const { setThemeConfig } = useClientTheme();

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (storedMode === "light" || storedMode === "dark") {
        setThemeConfig((prev) => ({ ...prev, mode: storedMode }));
      }
    } catch {
      // Private browsing / storage disabled — nothing to restore.
    }
  }, [setThemeConfig]);

  return null;
}

/**
 * The full client provider tree for a public nova-landing page. Deliberately does NOT include
 * `RequireAuth`/`PermissionProvider`/`AccessControlProvider`/`TenantEntitlementProvider`/
 * `UserProfileProvider` (the admin-app pattern nova-wcm/nova-console use) — this is a public
 * surface where guests must render fine; session state is read reactively (`useAuthSession`)
 * wherever it's needed (header, chat) instead of gating the whole tree.
 */
export function Providers({ locale, initialAuthState, tenantTranslations, children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap initialAuthState={initialAuthState} />
      <I18nProvider locale={locale} tenantTranslations={tenantTranslations}>
        <ClientProvider theme={NOVA_LANDING_THEME}>
          <ThemeModePersistence />
          {children}
          <ChatWidget />
        </ClientProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
