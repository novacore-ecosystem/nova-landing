import { Button, Header, NavigationMenu, Text, type NavigationItem } from "@novacore/frontend-next-mui";

import { getTranslator } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";

import { LocaleSwitcher } from "./locale-switcher";

/**
 * Server component: builds nav copy/links from the translator (crawlable real `<a>` items via
 * `NavigationMenu`) and hands them to `Header`, the one client island in this subtree (it owns
 * mobile-drawer state). The nav links and their labels still exist in the server-rendered HTML —
 * only the drawer's open/close interaction is client-side.
 */
export function SiteHeader({ locale }: { locale: LandingLocale }) {
  const t = getTranslator(locale);

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
          {t("common.brand.name")}
        </Text>
      }
      navigation={<NavigationMenu items={items} />}
      actions={
        <>
          <LocaleSwitcher />
          <Button href="#contact" size="sm">
            {t("nav.cta")}
          </Button>
        </>
      }
      mobileNavigation={<NavigationMenu items={items} />}
    />
  );
}
