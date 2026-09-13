// Dependency-free locale constants + IP-country detection.
//
// Kept free of any imports (no site.config / mongoose) so it can be used from
// three very different places: the Edge middleware, "use client" components,
// and server components. Keep the locale list in sync with the i18nPlugin
// options in site.config.js / puck.config.js.

export const LOCALES = ["en", "de"];
export const DEFAULT_LOCALE = "en";

export function isLocale(seg) {
  return typeof seg === "string" && LOCALES.includes(seg.toLowerCase());
}

/**
 * ISO-3166 alpha-2 country -> locale. Only countries that should NOT get the
 * default locale need an entry; everything else falls through to en.
 */
export const COUNTRY_TO_LOCALE = {
  DE: "de", // Germany
  AT: "de", // Austria
  CH: "de", // Switzerland (German is the largest language group)
  LI: "de", // Liechtenstein
  LU: "de", // Luxembourg
};

/**
 * Read the visitor's country from the edge/CDN headers.
 * The site runs behind Cloudflare (`cf-ipcountry`); the other names are
 * fallbacks so this keeps working if the host ever changes.
 * Returns an uppercase alpha-2 code, or null when unknown.
 */
export function countryFromHeaders(headers) {
  const raw =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-geo-country") ||
    headers.get("x-country-code") ||
    "";
  const code = raw.trim().toUpperCase();
  // Cloudflare uses "XX" for unknown and "T1" for Tor exit nodes.
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  return code;
}

/** Locale for an alpha-2 country code, defaulting to DEFAULT_LOCALE. */
export function localeFromCountry(country) {
  if (!country) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] || DEFAULT_LOCALE;
}
