import { NextResponse } from "next/server";
import { createAuthMiddleware } from "@premast/site-core/auth";
import { DEFAULT_LOCALE, countryFromHeaders, localeFromCountry } from "@/lib/locales";

const authMiddleware = createAuthMiddleware({
  loginPath: "/admin/login",
});

// Matches things that look like an ISO locale code: "en", "ar", "pt-br".
// We can't query the DB from middleware (edge runtime), so we just
// pattern-match here and let the page component validate against the
// actual LocaleSetting collection.
const LOCALE_SHAPE = /^[a-z]{2}(-[a-z0-9]{2,8})?$/i;

// Anything in this set is definitely NOT a locale even if it matches
// the shape (e.g. "ui" if you ever add a /ui route).
const RESERVED_FIRST_SEGMENTS = new Set(["api", "admin", "_next", "favicon.ico"]);

// Cookie that records the visitor's locale — set by the language switcher, by
// visiting a locale-prefixed URL, and by the geo detection below. Its presence
// means "this visitor already has a locale", so geo detection never overrides
// an explicit choice.
const LOCALE_COOKIE = "premast_locale";
const LOCALE_COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
};

// Search engines must see a stable URL per locale, so never geo-redirect them —
// Google crawls mostly from US IPs and treats IP redirects as cloaking.
const BOT_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|pinterest|vkshare|whatsapp|telegram|discord|lighthouse|headlesschrome/i;

/**
 * Should this request get a one-time geo redirect to its country's locale?
 * Only plain HTML page loads from a visitor with no locale preference yet.
 */
function isGeoRedirectCandidate(request, firstSeg) {
  // /admin, /api, … keep their own URLs — never send an editor to /de/admin.
  if (firstSeg && RESERVED_FIRST_SEGMENTS.has(firstSeg)) return false;
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (request.cookies.get(LOCALE_COOKIE)) return false;
  if (!(request.headers.get("accept") || "").includes("text/html")) return false;
  if (BOT_UA.test(request.headers.get("user-agent") || "")) return false;
  return true;
}

export async function middleware(request) {
  // Auth gate for /admin runs first.
  const authResponse = await authMiddleware(request);
  if (authResponse) return authResponse;

  // Front-end locale prefix handling: /ar, /ar/about, /fr/blog/x …
  // Safe to leave in even if the i18n plugin isn't installed — it just
  // won't fire because there are no locale-prefixed URLs in single-locale
  // sites.
  const { pathname } = request.nextUrl;
  const firstSeg = pathname.split("/").filter(Boolean)[0];

  // Always strip any client-supplied x-premast-locale header before
  // forwarding the request — this header is meant to be set by the
  // middleware on locale-prefixed URLs. Without this strip, a malicious
  // client could spoof a locale and bypass URL-based detection.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-premast-locale");

  if (firstSeg && !RESERVED_FIRST_SEGMENTS.has(firstSeg) && LOCALE_SHAPE.test(firstSeg)) {
    // Set the trusted locale header so server components in the same
    // request can read the URL locale via next/headers.headers().
    requestHeaders.set("x-premast-locale", firstSeg.toLowerCase());

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    // Persist as a cookie so subsequent navigations without an explicit
    // prefix (e.g. clicking a non-localized link) keep the same locale.
    response.cookies.set(LOCALE_COOKIE, firstSeg.toLowerCase(), LOCALE_COOKIE_OPTS);
    return response;
  }

  // No locale prefix in the URL. For a first-time visitor we pick the locale
  // from the CDN's IP-country header and redirect once to the prefixed URL, so
  // the visitor ends up on a real, linkable, canonical locale URL. The cookie
  // is written either way, so this runs exactly once per visitor and any later
  // manual switch (which sets the same cookie) always wins.
  if (isGeoRedirectCandidate(request, firstSeg)) {
    const locale = localeFromCountry(countryFromHeaders(request.headers));

    if (locale !== DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
      const redirect = NextResponse.redirect(url, 307);
      redirect.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTS);
      // The redirect target depends on the visitor's IP, so it must never be
      // cached by Cloudflare or the browser and served to someone else.
      redirect.headers.set("Cache-Control", "no-store");
      return redirect;
    }

    // Default locale: no redirect needed, just remember the decision.
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, LOCALE_COOKIE_OPTS);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  // No URL locale prefix — forward with the cleaned headers so the
  // page/layout falls back to cookie or default locale.
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Front-end routes plus the existing admin matcher. We exclude
  // _next/* and api/* so the middleware doesn't run on every static
  // asset or API call.
  matcher: [
    "/admin/:path*",
    "/((?!api|_next|favicon.ico).*)",
  ],
};
