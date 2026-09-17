/**
 * nova-landing's own SEO data contract — see the brief's §6. Deliberately richer than what WCM
 * currently supports (see cerebrum's WCM findings: `WebsiteSeoSettings` today is only
 * `{defaultMetaTitle, defaultMetaDescription, defaultSocialImageUrl, robotsIndexable}`, and
 * per-page SEO is only `{seoTitle?, seoDescription?}` — no canonical, no keywords, no OG type, no
 * structured data, no per-page robots override, no hreflang). This type is the target shape;
 * `mocks/seo.mock.ts` is the only file that needs to change once a real source fills it in.
 */
export interface LandingPageSeo {
  title: string;
  description: string;
  keywords?: string[];
  /** Absolute URL. */
  canonicalUrl: string;
  /** Absolute URL. */
  ogImageUrl?: string;
  noIndex?: boolean;
}
