import { env } from "@/shared/lib/env";

/**
 * Renders a `<script type="application/ld+json">` block — server-rendered, present in the initial
 * HTML, no client JS involved. `dangerouslySetInnerHTML` is safe here because the payload is a
 * `JSON.stringify` of a plain object this app constructs itself, never user input.
 *
 * TODO: Add WCM backend support for structured-data fields (Organization name/logo/sameAs social
 * links, per-page schema type — Product/Article/FAQPage/BreadcrumbList) — see cerebrum's WCM
 * findings: no structured-data concept exists there today. `brandName`/`logoUrl` below are mock
 * placeholders until GeneralSettings (or its successor) is wired in.
 */
export function OrganizationJsonLd({ brandName }: { brandName: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: env.siteUrl,
    logo: `${env.siteUrl}/logo.png`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
