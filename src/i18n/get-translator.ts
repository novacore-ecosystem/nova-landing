import { createTranslator, DEFAULT_LOCALE, TRANSLATION_RESOURCES, type TranslationBundle, type TranslationDictionary, type Translator } from "@novacore/frontend-foundation";

import { getBootstrap } from "@/shared/lib/bootstrap/get-bootstrap";
import { LANDING_TRANSLATIONS } from "./resources";
import type { LandingLocale } from "./locale";

/** `TenantBootstrapResponse.translations[locale].dictionary` is already the tenant's effective (tenant-override-merged-over-fallback) copy for that locale — see that type's doc comment in `frontend-foundation`. Reshaped into the `{[locale]: dictionary}` bundle shape `createTranslator`'s `sources.tenant` expects. Exported for `[locale]/layout.tsx`, which needs the same bundle to hand to the client-side `I18nProvider`. */
export function toTenantBundle(bootstrap: Awaited<ReturnType<typeof getBootstrap>>): TranslationBundle | undefined {
  if (!bootstrap) return undefined;
  const entries = Object.entries(bootstrap.translations);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries.map(([locale, translation]) => [locale, translation.dictionary as TranslationDictionary]));
}

/**
 * Server-side translator factory — call directly (with `await`) in Server Components /
 * `generateMetadata` / route handlers. Resolution chain: Bootstrap-provided tenant translations
 * (highest priority, see `toTenantBundle`) -> nova-landing's own dictionary -> `frontend-foundation`'s
 * shared platform terminology -> `DEFAULT_LOCALE` fallback -> the raw key (never throws, so a
 * missing key is visible, not fatal). `getBootstrap()` is `cache()`-wrapped, so calling this from
 * several components in the same request does not re-fetch.
 */
export async function getTranslator(locale: LandingLocale): Promise<Translator> {
  const bootstrap = await getBootstrap();

  return createTranslator(
    { tenant: toTenantBundle(bootstrap), application: LANDING_TRANSLATIONS, fallback: TRANSLATION_RESOURCES },
    { locale, fallbackLocale: DEFAULT_LOCALE, onMissingKey: "key" },
  );
}
