// Server-safe Puck blocks for the Studio / MVP Build landing page (Pencil
// node sHYRl). Complex graphics are Pencil-exported assets in /public/img;
// all copy is editable. Reuses HomeClientsBlock, DpHowBlock, DpFeatureBlock,
// DpPackagesBlock, DpFaqBlock and HomeCtaBlock for the shared sections.
// Defaults are merged at render (Puck only applies defaultProps in the editor).
import styles from "./mvpBlocks.module.css";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
const lines = (t) =>
  (t || "").split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
  ));

/* ================================================================== */
/* 1. Hero + live-build showcase                                       */
/* ================================================================== */
const HERO_D = {
  crumbParent: "Studio", crumbCurrent: "MVP Build",
  kicker: "Service 01 — MVP build",
  headline: "From idea to\na working MVP\nin 3 weeks.",
  subtitle: "Custom AI-powered MVP development for non-technical founders, startups and growing teams. One partner from strategy to launch — no hiring, no agency overhead.",
  primaryLabel: "Book a scoping call", primaryHref: "https://calendly.com/hiiive/get-to-know",
  secondaryLabel: "Try the cost estimator", secondaryHref: "/tools/mvp-cost-estimator",
  showcaseImage: "/img/mvp-showcase.png",
};

export const MvpHeroBlock = {
  label: "MVP · Hero",
  fields: {
    crumbParent: { type: "text" },
    crumbCurrent: { type: "text" },
    kicker: { type: "text" },
    headline: { type: "textarea" },
    subtitle: { type: "textarea" },
    primaryLabel: { type: "text" },
    primaryHref: { type: "text" },
    secondaryLabel: { type: "text" },
    secondaryHref: { type: "text" },
    showcaseImage: { type: "text" },
  },
  defaultProps: HERO_D,
  render: (raw) => {
    const p = { ...HERO_D, ...raw };
    return (
      <section className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.crumbs}>
            <span>{p.crumbParent}</span><span className={styles.crumbSep}>/</span><span className={styles.crumbCurrent}>{p.crumbCurrent}</span>
          </div>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.kicker}><span className={styles.kickerBar} /><span className={styles.kickerLabel}>{p.kicker}</span></div>
              <h1 className={styles.heroHeadline}>{lines(p.headline)}</h1>
              <p className={styles.heroSub}>{p.subtitle}</p>
              <div className={styles.ctaRow}>
                <a href={p.primaryHref || "#"} className={styles.btnPrimary}>{p.primaryLabel} <ArrowRight /></a>
                {p.secondaryLabel ? <a href={p.secondaryHref || "#"} className={styles.btnGhost}>{p.secondaryLabel}</a> : null}
              </div>
            </div>
            <img className={styles.showcaseImg} src={p.showcaseImage || "/img/mvp-showcase.png"} alt="Live build, week three — a real product, live" loading="lazy" />
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 2. Problem — six-months timeline + numbered points                  */
/* ================================================================== */
const PROBLEM_D = {
  headline: "Great ideas don't fail because they're bad.\nThey fail because they never launch.",
  subhead: "Most founders spend months trying to hire developers, manage freelancers, or build features customers never actually use.",
  timelineImage: "/img/mvp-timeline.png",
  quote: "Shipping your first product shouldn't take six months and most of your runway. That's why we built the 3-week MVP engagement.",
  points: [
    { num: "01", title: "Budget is exhausted", desc: "Spending gets locked into development before you ship anything usable." },
    { num: "02", title: "Roadmap keeps changing", desc: "Scope creep pushes the launch back month after month." },
    { num: "03", title: "Competitors moved faster", desc: "Others validated the market while you were still building." },
    { num: "04", title: "No real customer feedback", desc: "You're making product decisions without a single live user." },
  ],
};

export const MvpProblemBlock = {
  label: "MVP · Problem",
  fields: {
    headline: { type: "textarea" },
    subhead: { type: "textarea" },
    timelineImage: { type: "text" },
    quote: { type: "textarea" },
    points: {
      type: "array",
      getItemSummary: (i) => i.title || "Point",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "textarea" } },
      defaultItemProps: { num: "01", title: "Point", desc: "" },
    },
  },
  defaultProps: PROBLEM_D,
  render: (raw) => {
    const p = { ...PROBLEM_D, ...raw };
    return (
      <section className={styles.problem}>
        <div className={styles.inner}>
          <h2 className={styles.problemHead}>{lines(p.headline)}</h2>
          <p className={styles.problemSub}>{p.subhead}</p>
          <div className={styles.problemGrid}>
            <div>
              <img className={styles.timelineImg} src={p.timelineImage || "/img/mvp-timeline.png"} alt="Typical first build — how six months disappear" loading="lazy" />
              <p className={styles.problemQuote}>{p.quote}</p>
            </div>
            <div className={styles.points}>
              {(p.points || []).map((pt, i) => (
                <div key={i} className={styles.point}>
                  <span className={styles.pointNum}>{pt.num}</span>
                  <div>
                    <span className={styles.pointTitle}>{pt.title}</span>
                    <p className={styles.pointDesc}>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 3. Strategy Sprint (dark) + receive panel                           */
/* ================================================================== */
const SPRINT_D = {
  kicker: "Phase 01 — the Strategy Sprint",
  title: "Don't build before you\nknow what to build.",
  lead: "Five days that turn your idea into a validated, priced, build-ready plan — before a single line of code.",
  stats: [
    { value: "5 days", label: "Start to plan", accent: "no" },
    { value: "€500", label: "Flat · fixed", accent: "yes" },
    { value: "07", label: "Deliverables", accent: "no" },
  ],
  panelTitle: "What you receive",
  panelPill: "In 5 days",
  items: [
    { num: "01", text: "Validated product direction" },
    { num: "02", text: "Feature priorities for day one" },
    { num: "03", text: "Development roadmap" },
    { num: "04", text: "Project timeline" },
    { num: "05", text: "Budget estimate" },
    { num: "06", text: "Tech stack recommendation" },
    { num: "07", text: "Fixed-price MVP proposal" },
  ],
  footLeft: "A complete, build-ready plan.",
  footRight: "07 / 07",
};

export const MvpSprintBlock = {
  label: "MVP · Strategy Sprint",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    lead: { type: "textarea" },
    stats: {
      type: "array",
      getItemSummary: (i) => i.value || "Stat",
      arrayFields: { value: { type: "text" }, label: { type: "text" }, accent: { type: "select", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes" }] } },
      defaultItemProps: { value: "0", label: "Label", accent: "no" },
    },
    panelTitle: { type: "text" },
    panelPill: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (i) => i.text || "Item",
      arrayFields: { num: { type: "text" }, text: { type: "text" } },
      defaultItemProps: { num: "01", text: "Deliverable" },
    },
    footLeft: { type: "text" },
    footRight: { type: "text" },
  },
  defaultProps: SPRINT_D,
  render: (raw) => {
    const p = { ...SPRINT_D, ...raw };
    return (
      <section className={styles.sprint}>
        <div className={styles.inner}>
          <div className={styles.sprintGrid}>
            <div>
              <div className={styles.kicker}><span className={`${styles.kickerBar} ${styles.kickerBarAccent}`} /><span className={styles.kickerLabelRev}>{p.kicker}</span></div>
              <h2 className={styles.sprintTitle}>{lines(p.title)}</h2>
              <p className={styles.sprintLead}>{p.lead}</p>
              <div className={styles.statTiles}>
                {(p.stats || []).map((s, i) => (
                  <div key={i} className={styles.statTile}>
                    <span className={`${styles.statValue} ${s.accent === "yes" ? styles.statValueAccent : ""}`}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.receive}>
              <div className={styles.receiveHead}>
                <span className={styles.receiveTitle}>{p.panelTitle}</span>
                <span className={styles.receivePill}>{p.panelPill}</span>
              </div>
              <div className={styles.receiveList}>
                {(p.items || []).map((it, i) => (
                  <div key={i} className={styles.receiveItem}>
                    <span className={styles.receiveNum}>{it.num}</span>
                    <span className={styles.receiveText}>{it.text}</span>
                    <span className={styles.receiveCheck}><Check /></span>
                  </div>
                ))}
              </div>
              <div className={styles.receiveFoot}>
                <span>{p.footLeft}</span>
                <span className={styles.receiveFootRight}>{p.footRight}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 4. Comparison table + scope band                                    */
/* ================================================================== */
const COMPARE_D = {
  kicker: "Why founders pick us",
  title: "Your capital funds working software.\nNot agency overhead.",
  intro: "We stripped out the structural waste — layers of account managers, open-ended billing, endless scoping — so the budget goes into the product.",
  usLabel: "Hiiive",
  themLabel: "Traditional agency",
  rows: [
    { label: "Pricing", us: "Flat fixed fee — known before dev starts", them: "Hourly billing, scope creep" },
    { label: "Speed", us: "Idea to working software in weeks", them: "Months of scoping & handoffs" },
    { label: "For founders", us: "No technical knowledge required — guided every step", them: "You manage the tech decisions" },
    { label: "Workflow", us: "AI-powered development, faster without losing quality", them: "Traditional, slower cycles" },
    { label: "Architecture", us: "Built for future growth & expansion", them: "Often rebuilt as you scale" },
  ],
  scopeItems: [
    { text: "Product Strategy" }, { text: "UI/UX Design" }, { text: "Development" }, { text: "Testing" }, { text: "Launch Support" },
  ],
};

export const MvpCompareBlock = {
  label: "MVP · Comparison",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    intro: { type: "textarea" },
    usLabel: { type: "text" },
    themLabel: { type: "text" },
    rows: {
      type: "array",
      getItemSummary: (i) => i.label || "Row",
      arrayFields: { label: { type: "text" }, us: { type: "text" }, them: { type: "text" } },
      defaultItemProps: { label: "Aspect", us: "", them: "" },
    },
    scopeItems: {
      type: "array",
      getItemSummary: (i) => i.text || "Item",
      arrayFields: { text: { type: "text" } },
      defaultItemProps: { text: "Scope item" },
    },
  },
  defaultProps: COMPARE_D,
  render: (raw) => {
    const p = { ...COMPARE_D, ...raw };
    return (
      <section className={styles.compare}>
        <div className={styles.inner}>
          <div className={styles.compareHead}>
            <div>
              <span className={styles.kickerLabel}>{p.kicker}</span>
              <h2 className={styles.sectionTitle}>{lines(p.title)}</h2>
            </div>
            <p className={styles.compareIntro}>{p.intro}</p>
          </div>
          <div className={styles.table}>
            <div className={`${styles.tRow} ${styles.tHeadRow}`}>
              <span className={styles.tLabel} />
              <span className={styles.tHeadUs}>{p.usLabel}</span>
              <span className={styles.tHeadThem}>{p.themLabel}</span>
            </div>
            {(p.rows || []).map((r, i) => (
              <div key={i} className={styles.tRow}>
                <span className={styles.tLabel}>{r.label}</span>
                <span className={styles.tUs}><span className={styles.tCheck}><Check /></span>{r.us}</span>
                <span className={styles.tThem}>{r.them}</span>
              </div>
            ))}
          </div>
          {Array.isArray(p.scopeItems) && p.scopeItems.length ? (
            <div className={styles.scopeBand}>
              {p.scopeItems.map((s, i) => (
                <span key={i} className={styles.scopeItem}>
                  <span className={styles.scopeDot} />{s.text}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 5. All-in strip                                                     */
/* ================================================================== */
const ALLIN_D = { label: "All-in to launch", value: "€8,000 · ~4 weeks" };

export const MvpAllInBlock = {
  label: "MVP · All-in strip",
  fields: { label: { type: "text" }, value: { type: "text" } },
  defaultProps: ALLIN_D,
  render: (raw) => {
    const p = { ...ALLIN_D, ...raw };
    return (
      <section className={styles.allInWrap}>
        <div className={styles.inner}>
          <div className={styles.allIn}>
            <span className={styles.allInLabel}>{p.label}</span>
            <span className={styles.allInValue}>{p.value}</span>
          </div>
        </div>
      </section>
    );
  },
};

export const mvpBlocks = { MvpHeroBlock, MvpProblemBlock, MvpSprintBlock, MvpCompareBlock, MvpAllInBlock };
