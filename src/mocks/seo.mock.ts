import { getTranslator } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { env } from "@/shared/lib/env";

import type { LandingPageSeo } from "@/features/seo/types";

/**
 * Isolated mock SEO source, shaped after what WCM's `WebsiteSeoSettings` + per-page
 * `seoTitle`/`seoDescription` COULD grow into (see `LandingPageSeo`'s doc comment for the exact
 * gap). Swapping this for a real WCM/Bootstrap call later means changing this one function's body
 * — every caller already consumes the `LandingPageSeo` shape.
 *
 * TODO: Add WCM backend support for canonical URL overrides, a keywords array, an Open Graph image
 * per page, a per-page robots override (today WCM only has one tenant-wide boolean), and hreflang/
 * alternate-locale links driven by real per-locale content rather than this mock's static copy.
 */
export function getMockHomePageSeo(locale: LandingLocale): LandingPageSeo {
  const t = getTranslator(locale);

  return {
    title: t("hero.headline"),
    description: t("hero.subheadline"),
    canonicalUrl: `${env.siteUrl}/${locale}`,
    ogImageUrl: `${env.siteUrl}/og-image.png`,
    noIndex: false,
  };
}
