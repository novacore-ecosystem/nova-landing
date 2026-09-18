import { Footer, FooterColumn, Link, Text } from "@novacore/frontend-next-mui";

import { getTranslator } from "@/i18n";
import type { LandingLocale } from "@/i18n/locale";
import { getBootstrap } from "@/shared/lib/bootstrap/get-bootstrap";

/** Fully server-rendered — no interaction here needs a client boundary. */
export async function SiteFooter({ locale }: { locale: LandingLocale }) {
  const t = await getTranslator(locale);
  const bootstrap = await getBootstrap();
  const brand = bootstrap?.tenant?.name ?? t("common.brand.name");
  const year = new Date().getFullYear();

  return (
    <Footer
      bottomBar={
        <>
          <Text size="bodySmall" color="muted">
            {t("footer.copyright", { year, brand })}
          </Text>
          <Text size="bodySmall" color="muted">
            {t("common.meta.poweredBy")}
          </Text>
        </>
      }
    >
      <FooterColumn title={t("footer.columns.product")}>
        <Link href="#features">{t("footer.links.features")}</Link>
        <Link href="#pricing">{t("footer.links.pricing")}</Link>
      </FooterColumn>
      <FooterColumn title={t("footer.columns.company")}>
        <Link href="#">{t("footer.links.about")}</Link>
        <Link href="#">{t("footer.links.careers")}</Link>
        <Link href="#">{t("footer.links.blog")}</Link>
      </FooterColumn>
      <FooterColumn title={t("footer.columns.resources")}>
        <Link href="#contact">{t("footer.links.contact")}</Link>
        <Link href="#faq">{t("nav.links.faq")}</Link>
      </FooterColumn>
      <FooterColumn title={t("footer.columns.legal")}>
        <Link href="#">{t("footer.links.privacy")}</Link>
        <Link href="#">{t("footer.links.terms")}</Link>
      </FooterColumn>
    </Footer>
  );
}
