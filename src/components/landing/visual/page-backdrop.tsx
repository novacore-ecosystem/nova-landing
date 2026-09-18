"use client";

import MuiBox from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

/**
 * Page-wide decorative layer behind every section: large soft brand-colour glows staggered down
 * the page plus a fading dot grid. All colours come from the theme palette with separate
 * light/dark opacities (glows read as bright washes in Light, as glowing light sources in Dark).
 */
export function PageBackdrop({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { primary, secondary, text } = theme.palette;

  const glow = (color: string, opacity: number) => `radial-gradient(closest-side, ${alpha(color, opacity)}, transparent)`;

  return (
    <MuiBox sx={{ position: "relative", isolation: "isolate" }}>
      <MuiBox
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          backgroundRepeat: "no-repeat",
          backgroundImage: [
            glow(primary.main, isDark ? 0.5 : 0.2),
            glow(secondary.main, isDark ? 0.4 : 0.14),
            glow(primary.main, isDark ? 0.4 : 0.14),
            glow(secondary.main, isDark ? 0.34 : 0.12),
            glow(primary.main, isDark ? 0.36 : 0.12),
          ].join(", "),
          backgroundSize: "1100px 1100px, 900px 900px, 1000px 1000px, 900px 900px, 1100px 1100px",
          backgroundPosition:
            "left -350px top -150px, right -300px top 650px, left -400px top 1500px, right -300px top 2400px, left -300px top 3200px",
        }}
      />
      <MuiBox
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${alpha(text.primary, isDark ? 0.16 : 0.12)} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: `linear-gradient(to bottom, ${alpha(text.primary, 1)}, transparent 1100px)`,
          WebkitMaskImage: `linear-gradient(to bottom, ${alpha(text.primary, 1)}, transparent 1100px)`,
        }}
      />
      {children}
    </MuiBox>
  );
}
