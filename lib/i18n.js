// App-side i18n helpers (server components). The locale constants themselves
// live in @/lib/locales so the Edge middleware and client components can share
// them without pulling in site.config / mongoose.
import { siteConfig } from "@/site.config";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/locales";

export { LOCALES, DEFAULT_LOCALE, isLocale };

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
