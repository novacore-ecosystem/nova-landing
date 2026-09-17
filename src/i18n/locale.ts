export {
  DEFAULT_LOCALE,
  getLocaleMetadata,
  getSupportedLocales,
  isSupportedLocale,
  resolveLocale,
  type Locale,
  type LocaleMetadata,
} from "@novacore/frontend-foundation";

/**
 * The locales nova-landing actually ships content for — a subset of `frontend-foundation`'s
 * platform-wide `SUPPORTED_LOCALES` (which also includes `zh-CN`). Bilingual en/vi is the brief's
 * hard requirement; adding `zh-CN` later means adding `src/i18n/resources/zh-CN/*` and this one
 * array, nothing else.
 */
export const LANDING_LOCALES = ["en", "vi"] as const;
export type LandingLocale = (typeof LANDING_LOCALES)[number];

export function isLandingLocale(value: string): value is LandingLocale {
  return (LANDING_LOCALES as readonly string[]).includes(value);
}
