// Shared SEO helpers: canonical + hreflang alternates, Open Graph / Twitter
// defaults, and site-wide JSON-LD. Path arguments are locale-less ("" = home,
// "about", "work/mindverse-organic-engine"); the de URL is derived as /de/….
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://hiiive.ai").replace(/\/$/, "");
export const SITE_NAME = "HIIIVE";
export const DEFAULT_OG_IMAGE = "/og-image.png";

const OG_LOCALES = { en: "en_US", de: "de_DE" };

/** Absolute URL for a locale-less path in a given locale. */
export function localizedUrl(path, locale = DEFAULT_LOCALE) {
  const clean = String(path || "").replace(/^\/+/, "");
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${clean ? `/${clean}` : locale === DEFAULT_LOCALE ? "/" : ""}`;
}

/**
 * Build a full Next.js metadata object from a Puck root + URL info.
 * Editor-set root props (metaTitle, metaDescription, canonicalUrl, ogImage,
 * ogType, twitterCard, noIndex, structuredData) always win over defaults.
 */
export function buildPageMetadata({ root = {}, path = "", locale = DEFAULT_LOCALE, fallbackTitle }) {
  const title = root.metaTitle || fallbackTitle || SITE_NAME;
  const description = root.metaDescription || undefined;
  const canonical = root.canonicalUrl || localizedUrl(path, locale);
  const ogImage = root.ogImage || DEFAULT_OG_IMAGE;

  const meta = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localizedUrl(path, l)])),
        "x-default": localizedUrl(path, DEFAULT_LOCALE),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: root.ogType || "website",
      locale: OG_LOCALES[locale] || OG_LOCALES[DEFAULT_LOCALE],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: root.twitterCard || "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };

  if (root.noIndex === "true" || root.noIndex === true) {
    meta.robots = { index: false, follow: false };
  }
  return meta;
}

/** Site-wide Organization + WebSite JSON-LD (rendered once in the site layout). */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: "HIIIVE",
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
        image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        description:
          "AI-native company builder from Berlin. Studio for services — AI software, MVP builds, organic visibility, digital presence. Lab for products of our own.",
        email: "hello@hiiive.ai",
        foundingDate: "2024",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Berlin",
          addressRegion: "Berlin",
          addressCountry: "DE",
        },
        sameAs: ["https://www.linkedin.com/company/hiiive"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: LOCALES,
      },
    ],
  };
}
