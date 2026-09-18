import { Button, Header, NavigationMenu, Text, type NavigationItem } from "@novacore/frontend-next-mui";

import { getTranslator } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { getBootstrap } from "@/shared/lib/bootstrap/get-bootstrap";
import { AuthHeaderControl } from "@/components/auth/auth-header-control";

import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

/**
 * Server component: builds nav copy/links from the translator (crawlable real `<a>` items via
 * `NavigationMenu`) and hands them to `Header`, the one client island in this subtree (it owns
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

  return (
    <Header
      logo={
        <Text weight="bold" size="bodyLarge" as="span">
          {brand}
        </Text>
      }
      navigation={<NavigationMenu items={items} />}
      actions={
        <>
          <ThemeToggle />
          <LocaleSwitcher />
          <AuthHeaderControl />
          <Button href="#contact" size="sm">
            {t("nav.cta")}
          </Button>
        </>
      }
      mobileNavigation={<NavigationMenu items={items} />}
    />
  );
}
