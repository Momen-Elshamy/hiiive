// beforePageRender hook: fills the case-study blocks with published Case Study
// ContentItems from the DB (same mechanism the symbols plugin uses to inline
// reusable components). Card fields live in each item's `metadata`:
//   { tag, discipline, stat, statLabel, summary, image, featured, metrics }
// The image alt is the item's own CaseStudyHeroBlock.cardImageAlt (metadata
// can't be edited in admin, the item's Puck content can); without one the
// cards fall back to the case title.
// Links are built from the content type's urlPrefix + item slug.
//
// Handled blocks:
//   CaseStudyListBlock  -> items (optionally filtered by props.discipline)
//   WorkHeaderBlock     -> filters (discipline labels + live counts)
//   WorkFeaturedBlock   -> the item flagged metadata.featured (or newest)
//   WorkGridBlock       -> all non-featured items (+ hasMore for the limit)
//
// Server-only. siteConfig is imported lazily inside the hook to avoid a
// module-init cycle (site.config.js registers this hook).
import { unstable_cache } from "next/cache";
import { isCmsDbEnabled } from "@/lib/cms-mode";

const CT_SLUG = "case-study";
const HANDLED = ["CaseStudyListBlock", "WorkHeaderBlock", "WorkFeaturedBlock", "WorkGridBlock"];

/** The card photo alt an editor set on a Case Study item (its hero block). */
export function cardImageAlt(item) {
  try {
    const hero = JSON.parse(item.content || "{}").content?.find((b) => b.type === "CaseStudyHeroBlock");
    return hero?.props?.cardImageAlt || "";
  } catch {
    return "";
  }
}

/**
 * The card photo alts of the published Case Study items with these slugs in a
 * locale, as { slug: alt } (for pages outside Puck, like the home). Empty when
 * the DB is off or unreachable; callers fall back to the case title. Cached
 * for 5 minutes, so the home doesn't query the DB on every visit for them.
 */
export const caseStudyImageAlts = unstable_cache(
  async (slugs, locale) => {
    if (!isCmsDbEnabled()) return {};
    try {
      const { siteConfig } = await import("@/site.config");
      const connectDB = await siteConfig.getConnectDB();
      await connectDB();
      const { ContentType, ContentItem } = await siteConfig.getModels();
      const ct = await ContentType.findOne({ slug: CT_SLUG }, { _id: 1 }).lean();
      if (!ct) return {};
      // Rows from before the locale field (locale: null) are English.
      const items = await ContentItem.find(
        { contentType: ct._id, slug: { $in: slugs }, published: true, locale: locale === "en" ? { $in: ["en", null] } : locale },
        { slug: 1, locale: 1, content: 1 },
      ).lean();
      // A legacy row first, so the locale's own row wins for the same slug.
      items.sort((a, b) => (a.locale ? 1 : 0) - (b.locale ? 1 : 0));
      return Object.fromEntries(items.map((it) => [it.slug, cardImageAlt(it)]).filter(([, alt]) => alt));
    } catch {
      return {};
    }
  },
  ["case-study-image-alts"],
  { revalidate: 300 },
);

export async function injectCaseStudies({ data, page }) {
  const blocks = (data?.content || []).filter((b) => HANDLED.includes(b.type));
  if (blocks.length === 0) return data;

  try {
    const { siteConfig } = await import("@/site.config");
    const models = await siteConfig.getModels();
    const { ContentType, ContentItem } = models;

    const ct = await ContentType.findOne({ slug: CT_SLUG }).lean();
    if (!ct) return data;

    // Prefer the page's locale; fall back to English/legacy items.
    const locale = page?.locale || "en";
    let items = await ContentItem.find({ contentType: ct._id, published: true, locale })
      .sort({ createdAt: -1 })
      .lean();
    if (items.length === 0 && locale !== "en") {
      items = await ContentItem.find({ contentType: ct._id, published: true, locale: "en" })
        .sort({ createdAt: -1 })
        .lean();
    }

    // Locale-prefix generated links so German pages link to /de/work/…
    const basePrefix = (ct.urlPrefix || "/work").replace(/\/$/, "");
    const prefix = locale !== "en" ? `/${locale}${basePrefix}` : basePrefix;
    const cards = items.map((it) => ({
      image: it.metadata?.image || "",
      imageAlt: cardImageAlt(it),
      tag: it.metadata?.tag || it.title,
      discipline: it.metadata?.discipline || "",
      stat: it.metadata?.stat || "",
      statLabel: it.metadata?.statLabel || "",
      body: it.metadata?.summary || "",
      title: it.metadata?.headline || it.title,
      metrics: Array.isArray(it.metadata?.metrics) ? it.metadata.metrics : [],
      featured: !!it.metadata?.featured,
      href: `${prefix}/${it.slug}`,
    }));

    // Active ?filter= from the /work page URL (threaded through by the route).
    const activeFilter = (page?.__filter || "").trim().toLowerCase();
    const matchesFilter = (c) => !activeFilter || (c.discipline || "").toLowerCase() === activeFilter;

    const featuredAll = cards.find((c) => c.featured) || cards[0] || null;
    // With a filter active, only feature an item that belongs to the filter.
    const featured = featuredAll && matchesFilter(featuredAll) ? featuredAll : null;
    const rest = cards.filter((c) => c !== featured && matchesFilter(c));

    for (const block of blocks) {
      if (block.type === "CaseStudyListBlock") {
        const discipline = (block.props?.discipline || "").trim().toLowerCase();
        let pool = discipline
          ? cards.filter((c) => (c.discipline || "").toLowerCase() === discipline)
          : cards;
        if (pool.length === 0) pool = cards; // never render an empty section
        const limit = Number(block.props?.limit) || 0;
        block.props = { ...block.props, items: limit > 0 ? pool.slice(0, limit) : pool };
      } else if (block.type === "WorkHeaderBlock") {
        const counts = new Map();
        for (const c of cards) {
          const d = c.discipline || "Other";
          counts.set(d, (counts.get(d) || 0) + 1);
        }
        block.props = {
          ...block.props,
          activeFilter: activeFilter,
          allHref: prefix,
          filters: [...counts.entries()].map(([label, count]) => ({
            label,
            count: String(count),
            href: `${prefix}?filter=${encodeURIComponent(label)}`,
          })),
        };
      } else if (block.type === "WorkFeaturedBlock") {
        block.props = featured
          ? {
              ...block.props,
              hidden: false,
              image: featured.image,
              imageAlt: featured.imageAlt,
              tag: featured.tag,
              title: featured.title,
              body: featured.body,
              metrics: featured.metrics,
              href: featured.href,
            }
          : { ...block.props, hidden: true };
      } else if (block.type === "WorkGridBlock") {
        const limit = Number(block.props?.limit) || 0;
        const shown = limit > 0 ? rest.slice(0, limit) : rest;
        block.props = {
          ...block.props,
          items: shown.map((c) => ({ image: c.image, imageAlt: c.imageAlt, title: c.title, tag: c.tag, stat: c.stat, line: c.body, href: c.href })),
          hasMore: limit > 0 && rest.length > limit,
        };
      }
    }
  } catch {
    /* DB offline — leave the stored fallback items untouched */
  }
  return data;
}
