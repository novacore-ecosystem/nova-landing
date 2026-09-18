import MuiBox from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, CTASection, FeatureGrid, StatsSection, TestimonialSection } from "@novacore/frontend-next-mui";

import { HeroBackground } from "@/components/landing/sections/hero-background";

import { getTranslator } from "@/i18n";
import { isLandingLocale, LANDING_LOCALES } from "@/i18n/locale";
import { SiteFooter } from "@/components/landing/navigation/site-footer";
import { SiteHeader } from "@/components/landing/navigation/site-header";
import { PricingSection } from "@/components/landing/sections/pricing-section";
import { SeoAccordion } from "@/components/seo/seo-accordion";
import { FaqJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/features/seo/build-metadata";
import { getMockFaqs, getMockFeatures, getMockStats, getMockTestimonials } from "@/mocks/landing-page.mock";
import { getMockPricingPlans } from "@/mocks/pricing.mock";
import { getMockHomePageSeo } from "@/mocks/seo.mock";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LANDING_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLandingLocale(locale)) return {};
  return buildMetadata(await getMockHomePageSeo(locale), locale);
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLandingLocale(locale)) notFound();

  const t = await getTranslator(locale);

  return (
    <main id="main-content">
      <OrganizationJsonLd brandName={t("common.brand.name")} />
      <FaqJsonLd items={getMockFaqs(locale)} />

      <SiteHeader locale={locale} />

      <HeroBackground
        eyebrow={t("hero.eyebrow")}
        title={t("hero.headline")}
        description={t("hero.subheadline")}
        actions={
          <>
            <Button href="#contact" size="lg">
              {t("hero.primaryCta")}
            </Button>
            <Button href="#features" size="lg" variant="outline">
              {t("hero.secondaryCta")}
            </Button>
          </>
        }
      />

      <StatsSection items={getMockStats(locale)} />

      <div id="features">
        <FeatureGrid
          title={t("sections.features.title")}
          description={t("sections.features.subtitle")}
          items={getMockFeatures(locale)}
        />
      </div>

      <div id="testimonials">
        <TestimonialSection title={t("sections.testimonials.title")} items={getMockTestimonials(locale)} />
      </div>

      <div id="pricing">
        <PricingSection
          eyebrow={t("sections.pricing.eyebrow")}
          title={t("sections.pricing.title")}
          subtitle={t("sections.pricing.subtitle")}
          perMonthLabel={t("sections.pricing.perMonth")}
          mostPopularLabel={t("sections.pricing.mostPopular")}
          ctaLabel={t("sections.pricing.cta")}
          plans={getMockPricingPlans(locale)}
        />
      </div>

      <MuiBox id="faq" component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <MuiBox sx={{ maxWidth: "md", mx: "auto", px: { xs: 2, md: 4 } }}>
          <MuiBox sx={{ textAlign: "center", mb: 6 }}>
            <MuiBox component="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 700, m: 0 }}>
              {t("sections.faq.title")}
            </MuiBox>
            <MuiBox component="p" sx={{ color: "text.secondary", mt: 1.5 }}>
              {t("sections.faq.subtitle")}
            </MuiBox>
          </MuiBox>
          <SeoAccordion items={getMockFaqs(locale)} />
        </MuiBox>
      </MuiBox>

      <div id="contact">
        <CTASection
          title={t("sections.cta.title")}
          description={t("sections.cta.subtitle")}
          actions={
            <>
              <Button href="#" size="lg">
                {t("sections.cta.primary")}
              </Button>
              <Button href="#" size="lg" variant="outline">
                {t("sections.cta.secondary")}
              </Button>
            </>
          }
        />
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
