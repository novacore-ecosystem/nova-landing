import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslator } from "@/i18n";
import { isLandingLocale, LANDING_LOCALES } from "@/i18n/locale";
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

  const t = getTranslator(locale);
  const brand = t("common.brand.name");
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: brand, template: `%s · ${brand}` },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLandingLocale(locale)) notFound();

  const t = getTranslator(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          {t("accessibility.skipToContent")}
        </a>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
