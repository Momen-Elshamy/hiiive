"use client";
// Compact EN/DE language switcher. Preserves the current path when switching:
// /about -> /de/about, /de/blog/x -> /blog/x. Default locale (en) is unprefixed.
//
// Intentionally stateless (no useState/useEffect) so server and client render
// identically and it never triggers a hydration mismatch inside Puck's <Render>.
// Active state is derived purely from the URL prefix. Clicking sets the
// `premast_locale` cookie so switching back to the unprefixed default locale
// serves that locale (the server resolver reads header -> cookie).
import { usePathname } from "next/navigation";
import styles from "./HeaderBlock.module.css";

const LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "en";

function splitLocale(pathname) {
  const segs = (pathname || "/").split("/").filter(Boolean);
  if (segs.length > 0 && LOCALES.includes(segs[0].toLowerCase())) {
    return { current: segs[0].toLowerCase(), rest: segs.slice(1) };
  }
  return { current: DEFAULT_LOCALE, rest: segs };
}

function hrefFor(locale, rest) {
  const base = rest.length ? "/" + rest.join("/") : "";
  if (locale === DEFAULT_LOCALE) return base || "/";
  return "/" + locale + base;
}

function setLocaleCookie(locale) {
  document.cookie = `premast_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export default function LangSwitcher({ className }) {
  const { current, rest } = splitLocale(usePathname());

  return (
    <div className={`${styles.langSwitcher} ${className || ""}`} aria-label="Language">
      {LOCALES.map((loc, i) => (
        <span key={loc}>
          {i > 0 && <span className={styles.langSep} aria-hidden="true">/</span>}
          <a
            href={hrefFor(loc, rest)}
            onClick={() => setLocaleCookie(loc)}
            className={`${styles.langLink} ${loc === current ? styles.langActive : ""}`}
            aria-current={loc === current ? "true" : undefined}
          >
            {loc.toUpperCase()}
          </a>
        </span>
      ))}
    </div>
  );
}
