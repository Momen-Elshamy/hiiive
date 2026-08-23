// beforePageRender hook: fills the case-study blocks with published Case Study
// ContentItems from the DB (same mechanism the symbols plugin uses to inline
// reusable components). Card fields live in each item's `metadata`:
//   { tag, discipline, stat, statLabel, summary, image, featured, metrics }
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

const CT_SLUG = "case-study";
const HANDLED = ["CaseStudyListBlock", "WorkHeaderBlock", "WorkFeaturedBlock", "WorkGridBlock"];

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
          items: shown.map((c) => ({ image: c.image, tag: c.tag, stat: c.stat, line: c.body, href: c.href })),
          hasMore: limit > 0 && rest.length > limit,
        };
      }
    }
  } catch {
    /* DB offline — leave the stored fallback items untouched */
  }
  return data;
}
