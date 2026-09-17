import { NextResponse, type NextRequest } from "next/server";

/**
 * Deliberately NOT imported from `@/i18n/locale` (which re-exports `@novacore/frontend-foundation`)
 * — that package's root barrel also pulls in its `http`/`realtime` modules (axios, SignalR), which
 * use Node.js APIs unsupported by the Edge Runtime middleware executes in. Two small local
 * constants keep middleware genuinely edge-safe; `LANDING_LOCALES` in `src/i18n/locale.ts` remains
 * the source of truth everywhere else (Server/Client Components aren't edge-constrained).
 */
const LANDING_LOCALES = ["en", "vi"] as const;
type LandingLocale = (typeof LANDING_LOCALES)[number];
const DEFAULT_LOCALE: LandingLocale = "en";

const LOCALE_PREFIX_PATTERN = new RegExp(`^/(${LANDING_LOCALES.join("|")})(?:/|$)`);

/** Picks the first `Accept-Language` entry (already quality-sorted by the browser) that matches a locale we ship, falling back to the platform default. No third-party negotiator needed for a 2-locale set. */
function negotiateLocale(acceptLanguage: string | null): LandingLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const requested = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));

  for (const tag of requested) {
    const match = LANDING_LOCALES.find((locale) => tag === locale.toLowerCase() || tag.startsWith(`${locale.toLowerCase()}-`));
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

/**
 * SEO-motivated locale routing (see cerebrum's Decision Log — the rest of the NovaCore ecosystem
 * treats locale as client-only state; a public landing page needs real per-locale URLs instead).
 * Redirects `/` and any unprefixed path to `/{locale}/...`, negotiated from `Accept-Language` on
 * first visit. Already-prefixed paths (including a non-default locale) pass through untouched.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LOCALE_PREFIX_PATTERN.test(pathname)) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /* Skip Next.js internals, API routes, and files with an extension (static assets). */
    "/((?!_next|api|.*\\..*).*)",
  ],
};
