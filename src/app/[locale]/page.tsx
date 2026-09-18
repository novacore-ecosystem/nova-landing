import MuiBox from "@mui/material/Box";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@novacore/frontend-next-mui";

import { getTranslator } from "@/i18n";
import { isLandingLocale, LANDING_LOCALES } from "@/i18n/locale";
import { SiteFooter } from "@/components/landing/navigation/site-footer";
import { SiteHeader } from "@/components/landing/navigation/site-header";
import { CtaBanner } from "@/components/landing/sections/cta-banner";
import { FeatureCards } from "@/components/landing/sections/feature-cards";
import { HeroBackground } from "@/components/landing/sections/hero-background";
import { HeroMedia } from "@/components/landing/sections/hero-media";
import { PricingSection } from "@/components/landing/sections/pricing-section";
import { SectionIntro } from "@/components/landing/sections/section-intro";
import { StatsBand } from "@/components/landing/sections/stats-band";
import { TestimonialCards } from "@/components/landing/sections/testimonial-cards";
import { PageBackdrop } from "@/components/landing/visual/page-backdrop";
import { Surface } from "@/components/landing/visual/surface";
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
    <PageBackdrop>
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
          media={<HeroMedia />}
        />

        <StatsBand items={getMockStats(locale)} />

        <div id="features">
          <FeatureCards
            intro={<SectionIntro eyebrow={t("sections.features.eyebrow")} title={t("sections.features.title")} subtitle={t("sections.features.subtitle")} />}
            items={getMockFeatures(locale)}
          />
        </div>

        <div id="testimonials">
          <TestimonialCards
            intro={<SectionIntro eyebrow={t("sections.testimonials.eyebrow")} title={t("sections.testimonials.title")} subtitle={t("sections.testimonials.subtitle")} />}
            items={getMockTestimonials(locale)}
          />
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

        <MuiBox id="faq" component="section" sx={{ py: { xs: 6, md: 10 } }}>
          <MuiBox sx={{ maxWidth: "md", mx: "auto", px: { xs: 2, md: 4 } }}>
            <SectionIntro eyebrow={t("sections.faq.eyebrow")} title={t("sections.faq.title")} subtitle={t("sections.faq.subtitle")} />
            <Surface sx={{ p: { xs: 1.5, md: 3 } }}>
              <SeoAccordion items={getMockFaqs(locale)} />
            </Surface>
          </MuiBox>
        </MuiBox>

        <div id="contact">
          <CtaBanner
            title={t("sections.cta.title")}
            subtitle={t("sections.cta.subtitle")}
            primaryLabel={t("sections.cta.primary")}
            secondaryLabel={t("sections.cta.secondary")}
          />
        </div>

        <SiteFooter locale={locale} />
      </main>
    </PageBackdrop>
  );
}
