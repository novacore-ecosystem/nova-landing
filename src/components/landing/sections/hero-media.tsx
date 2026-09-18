"use client";

import { Avatar, Box, Text } from "@novacore/frontend-next-mui";
import MuiBox from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import { MessageCircle, TrendingUp } from "lucide-react";

import { useTranslation } from "@/i18n";
import { Surface } from "@/components/landing/visual/surface";

/**
 * The hero's imagery: a real team photo in a glowing frame with two floating glass "product"
 * cards (live chat, growth stat) — shows what the page sells instead of leaving the hero as text
 * on a gradient. Copy comes from `hero.media.*` so it follows the translation priority like
 * everything else.
 */
export function HeroMedia() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { primary, secondary } = theme.palette;

  return (
    <MuiBox sx={{ position: "relative", maxWidth: 960, mx: "auto", pb: { xs: 4, md: 4 } }}>
      <MuiBox
        aria-hidden
        sx={{
          position: "absolute",
          inset: { xs: -8, md: -16 },
          borderRadius: 6,
          backgroundImage: `linear-gradient(135deg, ${alpha(primary.main, 0.55)}, ${alpha(secondary.main, 0.45)})`,
          filter: "blur(32px)",
          opacity: isDark ? 0.7 : 0.45,
        }}
      />
      <MuiBox
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: alpha(primary.main, isDark ? 0.4 : 0.25),
          aspectRatio: { xs: "4 / 3", md: "16 / 9" },
          boxShadow: `0 30px 60px -20px ${alpha(primary.main, isDark ? 0.6 : 0.4)}`,
        }}
      >
        <MuiBox
          component="img"
          src="/images/team-workspace.webp"
          alt={t("hero.media.alt")}
          width={1200}
          height={800}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: isDark ? "brightness(.82) saturate(1.05)" : "none" }}
        />
        <MuiBox
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(180deg, transparent 55%, ${alpha(theme.palette.background.default, isDark ? 0.65 : 0.25)})`,
          }}
        />
      </MuiBox>

      <Surface
        sx={{
          position: "absolute",
          left: { xs: 8, md: -28 },
          bottom: { xs: -8, md: 40 },
          p: 1.75,
          width: { xs: "calc(100% - 96px)", sm: 290 },
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          textAlign: "left",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar size="sm" fallback="N" alt={t("hero.media.chatName")} />
          <Box sx={{ minWidth: 0 }}>
            <Text weight="semibold" size="bodySmall">
              {t("hero.media.chatName")}
            </Text>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <MuiBox sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
              <Text size="bodySmall" color="muted">
                {t("hero.media.chatStatus")}
              </Text>
            </Box>
          </Box>
          <MessageCircle size={18} style={{ marginLeft: "auto", color: primary.main }} />
        </Box>
        <Surface variant="tint" sx={{ px: 1.5, py: 1, borderRadius: 2, boxShadow: "none" }}>
          <Text size="bodySmall">{t("hero.media.chatMessage")}</Text>
        </Surface>
      </Surface>

      <Surface
        sx={{
          position: "absolute",
          right: { xs: 8, md: -20 },
          top: { xs: -24, md: 32 },
          p: 1.75,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          textAlign: "left",
        }}
      >
        <Surface variant="tint" sx={{ width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", boxShadow: "none" }}>
          <TrendingUp size={20} />
        </Surface>
        <Box>
          <Text weight="bold" sx={{ fontSize: "1.25rem", lineHeight: 1.1 }}>
            {t("hero.media.statValue")}
          </Text>
          <Text size="bodySmall" color="muted">
            {t("hero.media.statLabel")}
          </Text>
        </Box>
      </Surface>
    </MuiBox>
  );
}
