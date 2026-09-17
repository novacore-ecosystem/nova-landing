# Nova Landing

A production-quality, reusable NovaCore landing-page foundation — SEO-first, Bootstrap/WCM-driven,
bilingual (English/Vietnamese), with a first-class decoupled Chat subsystem. Built to demo well
today and to be cloned for a real customer tomorrow without a rewrite: customization is expected
to touch theme, branding, content, and Bootstrap/WCM configuration — not the underlying
architecture, providers, SEO plumbing, i18n, caching, or reusable sections.

## Stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript 5.7
- **UI:** [`@novacore/frontend-next-mui`](../common/frontend-nextjs/packages/mui) — the
  client-facing MUI component/theme package in the NovaCore frontend ecosystem
- **Foundation:** [`@novacore/frontend-foundation`](../common/frontend-foundation) — bootstrap
  contract, i18n resolver, HTTP client, permissions engine, shared platform utilities
- **Data:** TanStack Query (client-side interactive data only — see below), Zustand (chat/UI state
  only), Zod, react-hook-form

## Why this looks different from nova-console / nova-wcm

Every other NovaCore Next.js app is an authenticated admin tool: locale is client-side Zustand
state, Bootstrap is fetched client-side after mount, and there's no public SEO surface to protect.
nova-landing is a public, anonymous, SEO-first site, so two things are deliberately different:

- **Locale is a real URL segment** (`/en/...`, `/vi/...`), resolved by `middleware.ts` and
  `src/app/[locale]`, not a client store — search engines need distinct, crawlable, correctly
  server-rendered URLs per locale.
- **Bootstrap/tenant data is read server-side** (Server Components, `generateMetadata`), not via a
  client `useEffect`, so branding/content/SEO are present in the very first response.

Both decisions — and the rest of the architecture's reasoning — are recorded in this repo's
`.wolf/cerebrum.md` Decision Log.

## Structure

```
middleware.ts              locale detection/redirect (Accept-Language -> /{locale}/...)
src/
  app/
    [locale]/               layout (providers, metadata) + pages
    robots.ts, sitemap.ts   SEO metadata routes
    globals.css
  i18n/                     locale contract, server + client translators, en/vi resources
  shared/
    lib/                    env, TanStack Query client, generic helpers
    theme/                  nova-landing's own MUI ThemeConfig
  components/
    landing/                nav/footer + page sections (composable, config/mock-driven)
    seo/                    reusable SEO-safe interactive components (e.g. SeoAccordion) + JSON-LD
    chat/                   the one Chat UI component (everything else in features/chat)
  features/
    chat/                   transport/session/analytics/store — see its own doc comments
    seo/                    LandingPageSeo contract + Next.js Metadata builder
  mocks/                    isolated mock data for capabilities WCM doesn't support yet, each
                             file documenting the real backend/admin work it's standing in for
```

## Commands

```bash
yarn dev         # http://localhost:3000
yarn build
yarn start
yarn lint
yarn typecheck
```

## Mock data & TODOs

nova-wcm (the WCM/CMS admin this app is designed to be driven by) has no page-builder/section
model, shallow SEO fields, and no testimonials/FAQ/pricing content types today. Rather than block
on that, the relevant data is served from `src/mocks/*`, each file documenting exactly what
backend/admin capability it's standing in for via a `// TODO` comment. Swapping a mock for a real
source should only ever require changing that one file.
