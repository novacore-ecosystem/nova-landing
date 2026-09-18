"use client";

import { IconButton } from "@novacore/frontend-next-mui";
import { useClientTheme } from "@novacore/frontend-next-mui/theme";
import { Monitor, Moon, Sun } from "lucide-react";

import { useTranslation } from "@/i18n";
import { THEME_MODE_STORAGE_KEY } from "@/shared/theme/nova-landing-theme";

const MODE_CYCLE = ["light", "dark", "system"] as const;
type Mode = (typeof MODE_CYCLE)[number];

/**
 * Minimal 3-state icon toggle (light -> dark -> system -> ...), following `ThemeCustomizer`'s
 * `setThemeConfig(prev => ({...prev, mode}))` call pattern (`@novacore/frontend-next-mui`) but as
 * a single icon button rather than the full debug panel. `ClientProvider` itself persists
 * nothing (confirmed: no localStorage/cookie access anywhere in the package) — persistence is
 * this component's + `providers.tsx`'s job, see `THEME_MODE_STORAGE_KEY`'s doc comment.
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { config, effectiveMode, setThemeConfig } = useClientTheme();
  const mode: Mode = (config.mode as Mode | undefined) ?? "system";

  function cycle() {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(mode) + 1) % MODE_CYCLE.length]!;
    setThemeConfig((prev) => ({ ...prev, mode: next }));
    try {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — the choice just won't survive a reload.
    }
  }

  const label = `${t("auth.theme.toggleLabel")}: ${t(`auth.theme.${mode}`)}`;
  const Icon = mode === "system" ? Monitor : effectiveMode === "dark" ? Moon : Sun;

  return (
    <IconButton onClick={cycle} aria-label={label} size="sm">
      <Icon size={18} />
    </IconButton>
  );
}
