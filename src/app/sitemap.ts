import type { MetadataRoute } from "next";

import { LANDING_LOCALES } from "@/i18n/locale";
import { env } from "@/shared/lib/env";

/**
 * One entry per locale for the homepage today — as real pages are added (per the brief's section
 * architecture), extend this the same way: one `MetadataRoute.Sitemap` entry per locale per route.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LANDING_LOCALES.map((locale) => ({
    url: `${env.siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}
