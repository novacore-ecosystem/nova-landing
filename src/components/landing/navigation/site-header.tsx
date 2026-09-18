import { Box, Button, NavigationMenu, Text, type NavigationItem } from "@novacore/frontend-next-mui";
import { Sparkles } from "lucide-react";

import { getTranslator } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { getBootstrap } from "@/shared/lib/bootstrap/get-bootstrap";
import { AuthHeaderControl } from "@/components/auth/auth-header-control";
import { GlassHeader } from "@/components/landing/visual/glass-header";
import { Surface } from "@/components/landing/visual/surface";

import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

/**
 * Server component: builds nav copy/links from the translator (crawlable real `<a>` items via
 * `NavigationMenu`) and hands them to the header, the one client island in this subtree (it owns
 * mobile-drawer state). The nav links and their labels still exist in the server-rendered HTML —
 * only the drawer's open/close interaction, theme toggle, and auth control are client-side.
 */
export async function SiteHeader({ locale }: { locale: LandingLocale }) {
  const t = await getTranslator(locale);
  const bootstrap = await getBootstrap();
  const brand = bootstrap?.tenant?.name ?? t("common.brand.name");

  const items: NavigationItem[] = [
    { label: t("nav.links.features"), href: "#features" },
    { label: t("nav.links.pricing"), href: "#pricing" },
    { label: t("nav.links.testimonials"), href: "#testimonials" },
    { label: t("nav.links.faq"), href: "#faq" },
    { label: t("nav.links.contact"), href: "#contact" },
  ];

  // Same controls as the desktop bar — the header hides `actions` below `md`, so without this a
  // phone visitor could neither log in nor switch theme/language.
  const controls = (
    <>
      <ThemeToggle />
      <LocaleSwitcher />
      <AuthHeaderControl />
    </>
  );

  return (
    <GlassHeader
      logo={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Surface variant="tint" sx={{ width: 34, height: 34, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", boxShadow: "none" }}>
            <Sparkles size={18} />
          </Surface>
          <Text weight="bold" size="bodyLarge" as="span">
            {brand}
          </Text>
        </Box>
      }
      navigation={<NavigationMenu items={items} />}
      actions={
        <>
          {controls}
          <Button href="#contact" size="sm">
            {t("nav.cta")}
          </Button>
        </>
      }
      mobileNavigation={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <NavigationMenu items={items} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>{controls}</Box>
          <Button href="#contact" fullWidth>
            {t("nav.cta")}
          </Button>
        </Box>
      }
    />
  );
}
