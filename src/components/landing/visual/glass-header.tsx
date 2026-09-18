"use client";

import { Header, type HeaderProps } from "@novacore/frontend-next-mui";
import { alpha, useTheme } from "@mui/material/styles";

/** `Header` with a translucent, blurred bar so the page backdrop shows through while scrolling — theme-derived alpha, separate for Light and Dark. */
export function GlassHeader(props: HeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Header
      {...props}
      sx={{
        bgcolor: alpha(theme.palette.background.default, isDark ? 0.62 : 0.72),
        backdropFilter: "blur(18px) saturate(1.5)",
        borderColor: alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12),
      }}
    />
  );
}
