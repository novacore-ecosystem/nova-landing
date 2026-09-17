import type { Metadata } from "next";

import { LANDING_LOCALES, type LandingLocale } from "@/i18n/locale";
import { env } from "@/shared/lib/env";

import type { LandingPageSeo } from "./types";

/**
 * Converts nova-landing's own `LandingPageSeo` contract into Next.js's `Metadata` shape —
 * the one place that mapping happens, so a page's `generateMetadata` never hand-builds this
 * object itself. Includes `alternates.languages` (hreflang) built from `LANDING_LOCALES` — every
 * page that uses this helper gets correct cross-locale SEO signaling for free.
 */
export function buildMetadata(seo: LandingPageSeo, locale: LandingLocale, pathWithoutLocale = ""): Metadata {
  const languages = Object.fromEntries(LANDING_LOCALES.map((candidate) => [candidate, `${env.siteUrl}/${candidate}${pathWithoutLocale}`]));

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
      languages,
    },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      locale,
      type: "website",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: seo.ogImageUrl ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  };
}
