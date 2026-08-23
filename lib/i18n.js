// App-side i18n helpers. Keep the locale list in sync with the i18nPlugin
// options in site.config.js / puck.config.js.
import { siteConfig } from "@/site.config";

export const LOCALES = ["en", "de"];
export const DEFAULT_LOCALE = "en";

export function isLocale(seg) {
  return typeof seg === "string" && LOCALES.includes(seg.toLowerCase());
}

/**
 * Resolve the active locale for the current request (Server Component only).
 * Reads the trusted `x-premast-locale` header / `premast_locale` cookie via the
 * plugin helper, constrained to our enabled locales, defaulting to DEFAULT_LOCALE.
 */
export async function resolveLocale(models) {
  try {
    const { getRequestLocale } = await import("@premast/site-plugin-i18n/server");
    const { locale } = await getRequestLocale({ models, fallback: DEFAULT_LOCALE });
    return isLocale(locale) ? locale.toLowerCase() : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Find a published document for the requested locale, falling back to the
 * default-locale sibling when the localized copy doesn't exist yet
 * (fallbackStrategy: "default-locale").
 */
export async function findLocalized(Model, baseQuery, locale) {
  const localized = await Model.findOne({ ...baseQuery, locale }).lean();
  if (localized) return localized;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await Model.findOne({ ...baseQuery, locale: DEFAULT_LOCALE }).lean();
    if (fallback) return fallback;
  }
  // Legacy rows may predate the locale field / backfill.
  return Model.findOne(baseQuery).lean();
}

export { siteConfig };
