"use client";

import { alpha, useTheme } from "@mui/material/styles";
import { HeroSection, type HeroSectionProps } from "@novacore/frontend-next-mui";

/**
 * Wraps `HeroSection` to apply the real downloaded background asset (`public/images/
 * hero-background.webp`) with a theme-aware scrim. `HeroSection`'s own `sx` prop is typed as a
 * plain object (`NovaSx = Record<string, unknown> | ...`, no function-sx support — see
 * `frontend-next-mui/lib/types.ts`), so the light/dark-aware gradient can't be computed inline at
 * the call site; this is a thin client boundary just for that, reading `useTheme()` so the
 * overlay tracks the *actual* app theme mode (including a manual toggle override), not just
 * `prefers-color-scheme`. Server-rendered `title`/`description`/`actions` content is still passed
 * through as props/children — only this background-styling wrapper is a client component.
 */
export function HeroBackground(props: HeroSectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <HeroSection
      {...props}
      sx={{
        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.default, isDark ? 0.82 : 0.72)} 0%, ${alpha(theme.palette.background.default, 0.94)} 65%, ${theme.palette.background.default} 100%), url("/images/hero-background.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
