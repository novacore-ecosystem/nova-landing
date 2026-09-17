"use client";

import { createTranslator, DEFAULT_LOCALE, TRANSLATION_RESOURCES, type Translator } from "@novacore/frontend-foundation";
import * as React from "react";

import { LANDING_TRANSLATIONS } from "./resources";
import type { LandingLocale } from "./locale";

interface I18nContextValue {
  locale: LandingLocale;
  t: Translator;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  locale: LandingLocale;
  children: React.ReactNode;
}

/**
 * Client-side translation context for interactive components (Chat, forms, theme customizer).
 * `locale` comes from the `[locale]` route segment, not client state — there is no `setLocale`
 * here on purpose: changing language means navigating to the other locale's URL (see
 * `LocaleSwitcher`), which keeps every page's content crawlable and correctly server-rendered per
 * locale instead of swapped client-side after hydration.
 */
export function I18nProvider({ locale, children }: I18nProviderProps) {
  const value = React.useMemo<I18nContextValue>(() => {
    const t = createTranslator(
      { application: LANDING_TRANSLATIONS, fallback: TRANSLATION_RESOURCES },
      { locale, fallbackLocale: DEFAULT_LOCALE, onMissingKey: "key" },
    );
    return { locale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within <I18nProvider>");
  return ctx;
}
