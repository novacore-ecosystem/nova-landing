"use client";

import { alpha, useTheme } from "@mui/material/styles";
import { HeroSection, type HeroSectionProps } from "@novacore/frontend-next-mui";

/**
 * Wraps `HeroSection` to apply the real downloaded background asset (`public/images/
 * hero-background.webp`) with a theme-aware scrim, on a pseudo-element that fades out toward the
 * bottom so the hero melts into the page backdrop instead of ending in a hard edge. `HeroSection`'s
 * own `sx` prop is typed as a plain object (`NovaSx`, no function-sx support), so the light/dark
 * aware gradient can't be computed at the call site; this thin client boundary reads `useTheme()`
 * so the overlay tracks the *actual* theme mode. Server-rendered `title`/`description`/`actions`
 * content is still passed through as props — only this styling wrapper is a client component.
 */
export function HeroBackground(props: HeroSectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const scrim = alpha(theme.palette.background.default, isDark ? 0.62 : 0.8);
  const fade = `linear-gradient(to bottom, ${alpha(theme.palette.text.primary, 1)} 55%, transparent)`;

  return (
    <HeroSection
      {...props}
      sx={{
        position: "relative",
        isolation: "isolate",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: `linear-gradient(${scrim}, ${scrim}), url("/images/hero-background.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: fade,
          WebkitMaskImage: fade,
        },
      }}
    />
  );
}
