// Where a CMS redirect sends a visitor (used by app/(site)/[...path]). Redirects
// are stored per locale and without the language prefix; an unprefixed URL
// belongs to the default locale.
import { DEFAULT_LOCALE } from "./locales.js";

/** The locale a request's redirects are filed under. */
export const redirectLocale = (localePrefix) => localePrefix || DEFAULT_LOCALE;

/** The redirect's target, with the visitor's language prefix put back on. */
export function redirectTarget(toPath, localePrefix) {
  if (!localePrefix || toPath === `/${localePrefix}` || toPath.startsWith(`/${localePrefix}/`)) return toPath;
  return toPath === "/" ? `/${localePrefix}` : `/${localePrefix}${toPath}`; // "/de", not "/de/"
}
