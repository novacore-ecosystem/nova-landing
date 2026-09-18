import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getTranslator, toTenantBundle } from "@/i18n";
import { isLandingLocale, LANDING_LOCALES } from "@/i18n/locale";
import { getBootstrap } from "@/shared/lib/bootstrap/get-bootstrap";
import { AUTH_COOKIE_NAMES, buildInitialAuthState } from "@/shared/lib/auth/initial-auth-state";
import { env } from "@/shared/lib/env";

import "../globals.css";
import { Providers } from "./providers";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LANDING_LOCALES.map((locale) => ({ locale }));
}

/** Reject any locale segment outside the ones nova-landing actually ships, even if middleware is bypassed (a direct request, a stale link, a crawler retry). */
export const dynamicParams = false;

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLandingLocale(locale)) return {};

  const t = await getTranslator(locale);
  const bootstrap = await getBootstrap();
  const brand = bootstrap?.tenant?.name ?? t("common.brand.name");
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: brand, template: `%s · ${brand}` },
    icons: bootstrap?.tenant?.faviconUrl ? { icon: bootstrap.tenant.faviconUrl } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLandingLocale(locale)) notFound();

  const t = await getTranslator(locale);

  const tenantTranslations = toTenantBundle(await getBootstrap());

  const cookieStore = await cookies();
  const initialAuthState = buildInitialAuthState({
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value,
  });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          {t("accessibility.skipToContent")}
        </a>
        <Providers locale={locale} initialAuthState={initialAuthState} tenantTranslations={tenantTranslations}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
