import type { LandingLocale } from "../locale";
import { en } from "./en";
import { vi } from "./vi";

/** nova-landing's own dictionary, keyed by the locales it actually ships (see `LANDING_LOCALES`). Ready to hand to `createTranslator` as the `application` layer, with `frontend-foundation`'s `TRANSLATION_RESOURCES` as `fallback`. */
export const LANDING_TRANSLATIONS: Record<LandingLocale, typeof en> = { en, vi };

export type LandingDictionary = typeof en;
