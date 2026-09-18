"use client";

import { IconButton } from "@novacore/frontend-next-mui";
import { useClientTheme } from "@novacore/frontend-next-mui/theme";
import { Moon, Sun } from "lucide-react";

import { useTranslation } from "@/i18n";
import { THEME_MODE_STORAGE_KEY } from "@/shared/theme/nova-landing-theme";

/**
 * Light/dark switch over the shared `useClientTheme().setThemeConfig` (`@novacore/frontend-next-mui`)
 * — the landing page exposes exactly two states. `ClientProvider` persists nothing itself, so the
 * chosen mode is written to `localStorage` here and restored in `providers.tsx`.
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { effectiveMode, setThemeConfig } = useClientTheme();
  const next = effectiveMode === "dark" ? "light" : "dark";

  function toggle() {
    setThemeConfig((prev) => ({ ...prev, mode: next }));
    try {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private browsing) — the choice just won't survive a reload.
    }
  }

  return (
    <IconButton onClick={toggle} aria-label={`${t("auth.theme.toggleLabel")}: ${t(`auth.theme.${next}`)}`} size="sm">
      {effectiveMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
