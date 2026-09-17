import { createTranslator, DEFAULT_LOCALE, TRANSLATION_RESOURCES, type Translator } from "@novacore/frontend-foundation";

import { LANDING_TRANSLATIONS } from "./resources";
import type { LandingLocale } from "./locale";

/**
 * Server-side translator factory — call directly in Server Components / `generateMetadata` /
 * route handlers. Resolution chain: nova-landing's own dictionary -> `frontend-foundation`'s
 * shared platform terminology (used sparingly here; most landing copy is section-specific) ->
 * `DEFAULT_LOCALE` fallback -> the raw key (never throws, so a missing key is visible, not fatal).
 *
 * Deliberately has no tenant-override layer yet — plug one in here once WCM ships a Translation
 * Management feature for content strings (see cerebrum's WCM findings: no such feature exists today).
 */
export function getTranslator(locale: LandingLocale): Translator {
  return createTranslator(
    { application: LANDING_TRANSLATIONS, fallback: TRANSLATION_RESOURCES },
    { locale, fallbackLocale: DEFAULT_LOCALE, onMissingKey: "key" },
  );
}
