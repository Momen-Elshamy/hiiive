// Case Study blocks.
//
// - CaseStudyHeroBlock: detail-page hero (used by the "Case Study" content
//   type template; each /work/<slug> item edits its own copy).
// - CaseStudyListBlock: dynamic listing. Its `items` are injected at public
//   render time by the beforePageRender hook in lib/case-studies.js, which
//   reads published Case Study ContentItems (metadata) from the DB — so
//   adding a case study in admin updates every page that shows the list.
//   The stored `items` act as the editor preview / offline fallback.
import dpStyles from "./digitalPresenceBlocks.module.css";
import styles from "./caseStudyBlocks.module.css";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
const lines = (t) =>
  (t || "").split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
  ));

/* ================================================================== */
/* Case Study · Hero (detail page)                                     */
/* ================================================================== */
export const CaseStudyHeroBlock = {
  label: "Case Study · Hero",
  fields: {
    crumbParent: { type: "text" },
    crumbHref: { type: "text" },
    tag: { type: "text" },
    stat: { type: "text" },
    statLabel: { type: "text" },
    title: { type: "textarea" },
    summary: { type: "textarea" },
  },
  defaultProps: {
    crumbParent: "Work",
    crumbHref: "/work",
    tag: "Segment · Discipline",
    stat: "+0.0 pts",
    statLabel: "what moved, and when",
    title: "Case study title",
    summary: "One-paragraph summary of the problem, what we shipped, and what it changed.",
  },
  render: (p) => (
    <section className={styles.csHero}>
      <div className={styles.inner}>
        <div className={styles.crumbs}>
          <a href={p.crumbHref || "/work"}>{p.crumbParent}</a>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{p.tag}</span>
        </div>
        <span className={styles.csTag}>{p.tag}</span>
        <h1 className={styles.csTitle}>{lines(p.title)}</h1>
        <div className={styles.csStatRow}>
          <span className={styles.csStat}>{p.stat}</span>
          <span className={styles.csStatLabel}>{p.statLabel}</span>
        </div>
        <p className={styles.csSummary}>{p.summary}</p>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* Case Study · List (dynamic)                                         */
/* ================================================================== */
export const CaseStudyListBlock = {
  label: "Case Study · List",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    linkLabel: { type: "text" },
    linkHref: { type: "text" },
    limit: { type: "number" },
    discipline: { type: "text" },
    anchorId: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (i) => i.tag || "Case study",
      arrayFields: {
        image: { type: "text" },
        tag: { type: "text" },
        stat: { type: "text" },
        body: { type: "textarea" },
        href: { type: "text" },
      },
      defaultItemProps: { image: "", tag: "Segment · Discipline", stat: "0", body: "", href: "/work" },
    },
  },
  defaultProps: {
    kicker: "Selected work",
    title: "What it looks like\nin practice.",
    linkLabel: "All case studies",
    linkHref: "/work",
    limit: 3,
    discipline: "",
    anchorId: "work",
    items: [],
  },
  render: ({ kicker, title, linkLabel, linkHref, items, anchorId }) => (
    <section id={anchorId || "work"} className={dpStyles.cases}>
      <div className={dpStyles.inner}>
        <div className={dpStyles.casesHead}>
          <div>
            <span className={dpStyles.kickerLabel}>{kicker}</span>
            <h2 className={dpStyles.sectionTitle}>{lines(title)}</h2>
          </div>
          {linkLabel ? (
            <a href={linkHref || "/work"} className={dpStyles.arrowLink}>{linkLabel} <ArrowRight /></a>
          ) : null}
        </div>
        <div className={`${styles.grid} ${styles.listGridSpace}`}>
          {(items || []).map((c, i) => (
            <a key={i} href={c.href || "/work"} className={styles.gridCard}>
              {c.image ? <img className={styles.gridImg} src={c.image} alt="" loading="lazy" /> : <div className={styles.gridImg} />}
              <div className={styles.gridBody}>
                <span className={styles.gridTag}>{c.tag}</span>
                <span className={styles.listStat}>{c.stat}</span>
                <p className={styles.gridLine}>{c.body}</p>
                <span className={styles.cardMore}>Read case study <ArrowRight /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* Work · Header (kicker, display title, intro, filter pills)          */
/* `filters` (labels + live counts) are injected by the hook.          */
/* ================================================================== */
export const WorkHeaderBlock = {
  label: "Work · Header",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    intro: { type: "textarea" },
    allLabel: { type: "text" },
    filters: {
      type: "array",
      getItemSummary: (i) => i.label || "Filter",
      arrayFields: { label: { type: "text" }, count: { type: "text" } },
      defaultItemProps: { label: "Filter", count: "0" },
    },
  },
  defaultProps: {
    kicker: "Portfolio",
    title: "Proof, not promises.",
    intro: "Every project below shipped to production and is still running. Numbers are measured, agreed with the client, and updated as they move.",
    allLabel: "All work",
    filters: [],
  },
  render: ({ kicker, title, intro, allLabel, filters, activeFilter, allHref }) => {
    const active = (activeFilter || "").toLowerCase();
    return (
      <section className={styles.workHeader}>
        <div className={styles.inner}>
          <div className={styles.kickerRow}>
            <span className={styles.kickerBar} />
            <span className={styles.kickerLabel}>{kicker}</span>
          </div>
          <div className={styles.workHeadRow}>
            <h1 className={styles.workTitle}>{lines(title)}</h1>
            <p className={styles.workIntro}>{intro}</p>
          </div>
          {Array.isArray(filters) && filters.length > 0 ? (
            <div className={styles.filters}>
              <a
                href={allHref || "/work"}
                className={`${styles.filter} ${!active ? styles.filterActive : ""}`}
                aria-current={!active ? "true" : undefined}
              >
                {allLabel} <span className={styles.filterCount}>{filters.reduce((s, f) => s + (Number(f.count) || 0), 0)}</span>
              </a>
              {filters.map((f, i) => {
                const isActive = active && (f.label || "").toLowerCase() === active;
                return (
                  <a
                    key={i}
                    href={isActive ? allHref || "/work" : f.href || "#"}
                    className={`${styles.filter} ${isActive ? styles.filterActive : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {f.label} <span className={styles.filterCount}>{f.count}</span>
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* Work · Featured (big split card — injected from the featured item)  */
/* ================================================================== */
export const WorkFeaturedBlock = {
  label: "Work · Featured",
  fields: {
    image: { type: "text" },
    tag: { type: "text" },
    title: { type: "textarea" },
    body: { type: "textarea" },
    metrics: {
      type: "array",
      getItemSummary: (i) => i.value || "Metric",
      arrayFields: { value: { type: "text" }, label: { type: "text" } },
      defaultItemProps: { value: "0", label: "metric" },
    },
    linkLabel: { type: "text" },
    href: { type: "text" },
  },
  defaultProps: {
    image: "",
    tag: "Segment · Discipline",
    title: "Featured case study.",
    body: "",
    metrics: [],
    linkLabel: "Read the case study",
    href: "/work",
  },
  render: (p) => p.hidden ? null : (
    <section className={styles.featuredWrap}>
      <div className={styles.inner}>
        <a href={p.href || "/work"} className={styles.featured}>
          {p.image ? <img className={styles.featuredImg} src={p.image} alt="" loading="lazy" /> : <div className={styles.featuredImg} />}
          <div className={styles.featuredBody}>
            <span className={styles.gridTag}>{p.tag}</span>
            <h2 className={styles.featuredTitle}>{lines(p.title)}</h2>
            <p className={styles.featuredText}>{p.body}</p>
            {Array.isArray(p.metrics) && p.metrics.length > 0 ? (
              <div className={styles.metricsRow}>
                {p.metrics.map((m, i) => (
                  <div key={i} className={styles.metric}>
                    <span className={styles.metricValue}>{m.value}</span>
                    <span className={styles.metricLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <span className={styles.cardMore}>{p.linkLabel} <ArrowRight /></span>
          </div>
        </a>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* Work · Grid (image cards — injected from non-featured items)        */
/* ================================================================== */
export const WorkGridBlock = {
  label: "Work · Grid",
  fields: {
    linkLabel: { type: "text" },
    loadMoreLabel: { type: "text" },
    limit: { type: "number" },
    items: {
      type: "array",
      getItemSummary: (i) => i.tag || "Case",
      arrayFields: {
        image: { type: "text" },
        tag: { type: "text" },
        stat: { type: "text" },
        line: { type: "textarea" },
        href: { type: "text" },
      },
      defaultItemProps: { image: "", tag: "Segment · Discipline", stat: "0", line: "", href: "/work" },
    },
  },
  defaultProps: {
    linkLabel: "View case",
    loadMoreLabel: "Load more work",
    limit: 6,
    items: [],
  },
  render: ({ linkLabel, loadMoreLabel, limit, items, hasMore }) => (
    <section className={styles.gridWrap}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {(items || []).map((c, i) => (
            <a key={i} href={c.href || "/work"} className={styles.gridCard}>
              {c.image ? <img className={styles.gridImg} src={c.image} alt="" loading="lazy" /> : <div className={styles.gridImg} />}
              <div className={styles.gridBody}>
                <span className={styles.gridTag}>{c.tag}</span>
                <span className={styles.gridStat}>{c.stat}</span>
                <p className={styles.gridLine}>{c.line}</p>
                <span className={styles.cardMore}>{linkLabel} <ArrowRight /></span>
              </div>
            </a>
          ))}
        </div>
        {hasMore ? (
          <div className={styles.loadMoreRow}>
            <span className={styles.loadMore}>{loadMoreLabel} <ArrowRight /></span>
          </div>
        ) : null}
      </div>
    </section>
  ),
};

export const caseStudyBlocks = {
  CaseStudyHeroBlock,
  CaseStudyListBlock,
  WorkHeaderBlock,
  WorkFeaturedBlock,
  WorkGridBlock,
};
