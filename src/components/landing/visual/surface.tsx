"use client";

import MuiBox from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

export type SurfaceVariant = "glass" | "tint" | "solid";

export interface SurfaceProps {
  variant?: SurfaceVariant;
  /** Lifts and brightens the border on hover — for cards that read as interactive. */
  hoverable?: boolean;
  component?: "div" | "section" | "article" | "li";
  sx?: Record<string, unknown>;
  children: ReactNode;
}

/**
 * The one card/panel treatment every landing section shares (border, elevation, translucency),
 * derived entirely from the active MUI theme — light and dark get their own alpha/shadow tuning
 * rather than one mode being an inversion of the other. `frontend-next-mui`'s `sx` prop is typed
 * as a plain object (no theme callback), which is why this needs `useTheme()` in a client
 * component; children can still be server-rendered nodes.
 */
export function Surface({ variant = "glass", hoverable = false, component = "div", sx, children }: SurfaceProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { primary, background, divider } = theme.palette;

  const base =
    variant === "tint"
      ? { bgcolor: alpha(primary.main, isDark ? 0.14 : 0.07), borderColor: alpha(primary.main, isDark ? 0.35 : 0.22) }
      : variant === "solid"
        ? { bgcolor: background.paper, borderColor: divider }
        : {
            bgcolor: alpha(background.paper, isDark ? 0.55 : 0.72),
            borderColor: isDark ? alpha(primary.light, 0.22) : alpha(primary.main, 0.14),
            backdropFilter: "blur(16px) saturate(1.3)",
          };

  return (
    <MuiBox
      component={component}
      sx={{
        border: "1px solid",
        borderRadius: 3,
        boxShadow: `0 12px 36px -12px ${alpha(primary.main, isDark ? 0.45 : 0.22)}`,
        transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
        ...base,
        ...(hoverable && {
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: alpha(primary.main, 0.55),
            boxShadow: `0 20px 44px -12px ${alpha(primary.main, isDark ? 0.6 : 0.32)}`,
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MuiBox>
  );
}
