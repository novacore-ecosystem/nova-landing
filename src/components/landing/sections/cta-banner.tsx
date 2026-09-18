"use client";

import { Button, Container, Heading, Text } from "@novacore/frontend-next-mui";
import MuiBox from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";

export interface CtaBannerProps {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
}

/**
 * Closing call to action over a real deep-indigo image. The banner is intentionally dark in both
 * themes (white text on a dark photo is the readable choice either way); only the brand tint and
 * outer glow are theme-derived so it sits naturally on the light and dark page backgrounds.
 */
export function CtaBanner({ title, subtitle, primaryLabel, secondaryLabel }: CtaBannerProps) {
  const theme = useTheme();
  const { primary, common } = theme.palette;

  return (
    <MuiBox component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <MuiBox
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 5,
            textAlign: "center",
            px: { xs: 3, md: 8 },
            py: { xs: 7, md: 10 },
            color: common.white,
            backgroundImage: `linear-gradient(135deg, ${alpha(primary.dark, 0.72)}, ${alpha(primary.main, 0.38)}), url("/images/cta-background.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: `0 40px 80px -30px ${alpha(primary.main, 0.7)}`,
          }}
        >
          <MuiBox
            aria-hidden
            sx={{
              position: "absolute",
              width: 360,
              height: 360,
              borderRadius: "50%",
              top: -140,
              right: -100,
              border: `1px solid ${alpha(common.white, 0.22)}`,
              boxShadow: `inset 0 0 80px ${alpha(common.white, 0.1)}`,
            }}
          />
          <MuiBox
            aria-hidden
            sx={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", bottom: -90, left: -60, border: `1px solid ${alpha(common.white, 0.18)}` }}
          />
          <MuiBox sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Heading size="h2" align="center" sx={{ color: "inherit" }}>
              {title}
            </Heading>
            <Text align="center" size="bodyLarge" sx={{ color: alpha(common.white, 0.85), maxWidth: 520 }}>
              {subtitle}
            </Text>
            <MuiBox sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
              <Button href="#" size="lg" sx={{ bgcolor: common.white, color: primary.dark, "&:hover": { bgcolor: alpha(common.white, 0.88) } }}>
                {primaryLabel}
              </Button>
              <Button href="#" size="lg" variant="outline" sx={{ color: common.white, borderColor: alpha(common.white, 0.55), "&:hover": { borderColor: common.white, bgcolor: alpha(common.white, 0.1) } }}>
                {secondaryLabel}
              </Button>
            </MuiBox>
          </MuiBox>
        </MuiBox>
      </Container>
    </MuiBox>
  );
}
