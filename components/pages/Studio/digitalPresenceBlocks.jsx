// Server-safe Puck blocks for the Studio / Digital Presence landing page.
// Content-editable (text, prices, list items via Puck); visual scaffolding is
// fixed CSS. Uses the global design tokens (--hv-*, --font-*) from globals.css.
import styles from "./digitalPresenceBlocks.module.css";

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
/* 1. Hero + live monitor                                              */
/* ================================================================== */
export const DpHeroBlock = {
  label: "DP · Hero",
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
    monitorUrl: { type: "text" },
    sessionLabel: { type: "text" },
    events: {
      type: "array",
      getItemSummary: (i) => i.text || "Event",
      arrayFields: { time: { type: "text" }, text: { type: "text" }, tone: { type: "select", options: [
        { label: "alert", value: "alert" }, { label: "warn", value: "warn" }, { label: "ok", value: "ok" },
      ] } },
      defaultItemProps: { time: "14:31", text: "Event", tone: "alert" },
    },
    kpiLabel: { type: "text" },
    kpiFrom: { type: "text" },
    kpiTo: { type: "text" },
    monitorImage: { type: "text" },
  },
  defaultProps: {
    crumbParent: "Studio", crumbCurrent: "Digital Presence & Funnels",
    kicker: "Service 04 — Digital presence & funnels",
    headline: "Your traffic is\nleaking. We own\nthe fix.",
    subtitle: "We take ownership of how your brand shows up online — measuring how people behave on your site, then shipping the fixes that turn traffic into pipeline.",
    primaryLabel: "Book a call", primaryHref: "https://calendly.com/hiiive/get-to-know",
    secondaryLabel: "Watch the 2-min explainer", secondaryHref: "#",
    monitorUrl: "LIVE · yourbrand.com", sessionLabel: "SESSION #4,203",
    events: [
      { time: "14:31", text: "Rage click detected — pricing table", tone: "alert" },
      { time: "14:32", text: "Drop-off spike — checkout step 2", tone: "warn" },
      { time: "14:33", text: "Fix shipped — form cut to 6 fields", tone: "ok" },
    ],
    kpiLabel: "Conversion, 90 days", kpiFrom: "1.2%", kpiTo: "1.6%",
  },
  render: (p) => (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.crumbs}>
          <span>{p.crumbParent}</span><span className={styles.crumbSep}>/</span><span className={styles.crumbCurrent}>{p.crumbCurrent}</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.kicker}><span className={styles.kickerBar} /><span className={styles.kickerLabel}>{p.kicker}</span></div>
            <h1 className={styles.heroHeadline}>{lines(p.headline)}</h1>
            <p className={styles.heroSub}>{p.subtitle}</p>
            <div className={styles.ctaRow}>
              <a href={p.primaryHref || "#"} className={styles.btnPrimary}>{p.primaryLabel} <ArrowRight /></a>
              {p.secondaryLabel ? <a href={p.secondaryHref || "#"} className={styles.btnGhost}>{p.secondaryLabel}</a> : null}
            </div>
          </div>
          <img className={styles.monitorImg} src={p.monitorImage || "/img/dp-monitor.png"} alt="Live session monitor — rage clicks, drop-offs and shipped fixes" loading="lazy" />
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 2. Problem — decay chart + cost card                               */
/* ================================================================== */
export const DpProblemBlock = {
  label: "DP · Problem",
  fields: {
    headline: { type: "textarea" },
    subhead: { type: "text" },
    chartTitle: { type: "text" },
    bars: {
      type: "array",
      getItemSummary: (i) => i.label || "Bar",
      arrayFields: { value: { type: "number" }, label: { type: "text" }, note: { type: "textarea" } },
      defaultItemProps: { value: 100, label: "Stage", note: "" },
    },
    costTitle: { type: "text" },
    costFigure: { type: "text" },
    costPeriod: { type: "text" },
    costBody: { type: "textarea" },
    whyTitle: { type: "text" },
    whyBody: { type: "textarea" },
    footLine: { type: "textarea" },
  },
  defaultProps: {
    headline: "You pay to bring people to your website —\nthen let them quietly leak away.",
    subhead: "The site goes live once. After that, nobody owns whether it actually converts.",
    chartTitle: "How a new site performs when nobody owns it",
    bars: [
      { value: 100, label: "Launch", note: "New site ships. Everyone celebrates." },
      { value: 88, label: "Month 3", note: "Small friction appears. Nobody is watching." },
      { value: 71, label: "Month 6", note: "The market moves. The site doesn't." },
      { value: 54, label: "Month 12", note: "You buy more traffic to cover the gap." },
    ],
    costTitle: "What the drop-off costs you",
    costFigure: "−€38,400", costPeriod: "/ year",
    costBody: "At 10,000 sessions a month and an €80 order value, sitting at 1.2% instead of 1.6% leaves this on the table — every year.",
    whyTitle: "Why it keeps happening",
    whyBody: "Nobody owns the number after launch, so the leak is never found — let alone fixed.",
    footLine: "We instrument every step, then fix the one that costs the most.",
  },
  render: (p) => {
    const max = Math.max(1, ...(p.bars || []).map((b) => Number(b.value) || 0));
    return (
      <section className={styles.problem}>
        <div className={styles.inner}>
          <h2 className={styles.problemHead}>{lines(p.headline)}</h2>
          <p className={styles.problemSub}>{p.subhead}</p>
          <div className={styles.problemGrid}>
            <div className={styles.chartCard}>
              <span className={styles.chartTitle}>{p.chartTitle}</span>
              <div className={styles.bars}>
                {(p.bars || []).map((b, i) => (
                  <div key={i} className={styles.barCol}>
                    <div className={styles.barTrack}>
                      <div className={`${styles.bar} ${i === 0 ? styles.barLead : ""}`} style={{ height: `${((Number(b.value) || 0) / max) * 100}%` }}>
                        <span className={styles.barVal}>{b.value}</span>
                      </div>
                    </div>
                    <span className={styles.barLabel}>{b.label}</span>
                    <span className={styles.barNote}>{b.note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.costCard}>
              <span className={styles.costTitle}>{p.costTitle}</span>
              <div className={styles.costFigure}>{p.costFigure} <span className={styles.costPeriod}>{p.costPeriod}</span></div>
              <p className={styles.costBody}>{p.costBody}</p>
              <div className={styles.costWhy}>
                <span className={styles.costWhyTitle}>{p.whyTitle}</span>
                <p className={styles.costWhyBody}>{p.whyBody}</p>
              </div>
            </div>
          </div>
          <p className={styles.problemFoot}>{lines(p.footLine)}</p>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 3. Meet HIIIVE (dark) + site surfaces                              */
/* ================================================================== */
export const DpMeetBlock = {
  label: "DP · Meet Hiiive",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    lead: { type: "textarea" },
    steps: {
      type: "array", getItemSummary: (i) => i.title || "Step",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "text" } },
      defaultItemProps: { num: "01", title: "Step", desc: "" },
    },
    quote: { type: "textarea" },
    diagramTitle: { type: "text" },
    surfacesTitle: { type: "text" },
    diagramImage: { type: "text" },
    surfaces: {
      type: "array", getItemSummary: (i) => i.title || "Surface",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "text" } },
      defaultItemProps: { num: "01", title: "Surface", desc: "" },
    },
  },
  defaultProps: {
    kicker: "The solution",
    title: "Meet Hiiive.\nOne team for the\nwhole channel.",
    lead: "An outsourced digital-presence team that owns your online channel end-to-end — measuring how people behave, then shipping the improvements every month.",
    steps: [
      { num: "01", title: "Measure", desc: "Behaviour data from every session, not guesses." },
      { num: "02", title: "Improve", desc: "Changes designed, shipped and QA'd every month." },
      { num: "03", title: "Prove", desc: "Before and after on the KPIs we agreed together." },
    ],
    quote: "One team, one channel, one number to answer for — instead of four agencies pointing at each other.",
    diagramTitle: "Your site",
    surfacesTitle: "Five surfaces we own",
    surfaces: [
      { num: "01", title: "Information architecture", desc: "Nav, sitemap and internal links" },
      { num: "02", title: "UX & UI", desc: "Layout, clarity and the path to action" },
      { num: "03", title: "Conversion paths", desc: "The steps between interest and checkout" },
      { num: "04", title: "Content & pages", desc: "What the journey is missing" },
      { num: "05", title: "Analytics & reporting", desc: "The numbers we answer for" },
    ],
  },
  render: (p) => (
    <section className={styles.meet}>
      <div className={styles.inner}>
        <div className={styles.meetGrid}>
          <div className={styles.meetLeft}>
            <div className={styles.kicker}><span className={`${styles.kickerBar} ${styles.kickerBarAccent}`} /><span className={styles.kickerLabelRev}>{p.kicker}</span></div>
            <h2 className={styles.meetTitle}>{lines(p.title)}</h2>
            <p className={styles.meetLead}>{p.lead}</p>
            <div className={styles.meetSteps}>
              {(p.steps || []).map((s, i) => (
                <div key={i} className={styles.meetStep}>
                  <span className={styles.meetStepNum}>{s.num}</span>
                  <div className={styles.meetStepBody}>
                    <span className={styles.meetStepTitle}>{s.title}</span>
                    <span className={styles.meetStepDesc}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.meetQuote}>{lines(p.quote)}</p>
          </div>
          <div className={styles.meetRight}>
            <img className={styles.diagramImg} src={p.diagramImage || "/img/dp-site-diagram.png"} alt="Your site — the five surfaces we own" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 4. How it works — monthly loop cards                               */
/* ================================================================== */
const HOW_D = {
  kicker: "How it works",
  title: "The monthly loop.",
  intro: "One team owns your whole online channel — on a monthly loop that compounds instead of restarting.",
  cards: [
    { num: "01", title: "Measure", visual: "/img/dp-loop-measure.png", body: "Week one: Hotjar, Clarity, PostHog & GA4 go live. Your funnel gets defined and every session becomes visible.", chips: [{ text: "Hotjar" }, { text: "PostHog" }, { text: "Clarity" }, { text: "GA4" }] },
    { num: "02", title: "Improve", visual: "/img/dp-loop-improve.png", body: "Friction found in real sessions becomes shipped, data-backed improvements — designed, built and QA'd by us.", chips: [{ text: "2–6 improvements / month" }] },
    { num: "03", title: "Prove", visual: "/img/dp-loop-prove.png", body: "Every report opens with your primary KPI, before vs. after. You see exactly what moved, and why.", chips: [{ text: "Live KPI dashboard" }] },
  ],
  loopNote: "A continuous loop — repeated every month, so improvement compounds instead of restarting.",
  loopStrip: "Collect → Analyse → Recommend → Implement → Prove",
};

export const DpHowBlock = {
  label: "DP · How it works",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    intro: { type: "textarea" },
    cards: {
      type: "array", getItemSummary: (i) => i.title || "Card",
      arrayFields: {
        num: { type: "text" }, title: { type: "text" }, visual: { type: "text" }, body: { type: "textarea" },
        chips: { type: "array", getItemSummary: (i) => i.text || "Chip", arrayFields: { text: { type: "text" } }, defaultItemProps: { text: "Tool" } },
      },
      defaultItemProps: { num: "01", title: "Step", visual: "", body: "", chips: [] },
    },
    loopNote: { type: "textarea" },
    loopStrip: { type: "text" },
  },
  defaultProps: HOW_D,
  render: (raw) => {
    const p = { ...HOW_D, ...raw };
    return (
    <section className={styles.how}>
      <div className={styles.inner}>
        <div className={styles.howHead}>
          <div className={styles.howHeadL}>
            <span className={styles.kickerLabel}>{p.kicker}</span>
            <h2 className={styles.sectionTitle}>{p.title}</h2>
          </div>
          <p className={styles.howIntro}>{p.intro}</p>
        </div>
        <div className={styles.howCards}>
          {(p.cards || []).map((c, i) => (
            <div key={i} className={styles.howCard}>
              {c.visual ? <img className={styles.howVisualImg} src={c.visual} alt="" loading="lazy" /> : null}
              <div className={styles.howCardBody}>
                <div className={styles.howTitleRow}>
                  <span className={styles.howNum}>{c.num}</span>
                  <span className={styles.howTitle}>{c.title}</span>
                </div>
                <p className={styles.howBody}>{c.body}</p>
                {Array.isArray(c.chips) && c.chips.length ? (
                  <div className={styles.chips}>{c.chips.map((ch, j) => <span key={j} className={styles.chip}>{ch.text}</span>)}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.loopStrip}>
          <span className={styles.loopNote}>
            <svg className={styles.loopIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" />
            </svg>
            {p.loopNote}
          </span>
          <span className={styles.loopChain}>{p.loopStrip}</span>
        </div>
      </div>
    </section>
  );
  },
};

/* ================================================================== */
/* 5. Image feature                                                   */
/* ================================================================== */
export const DpFeatureBlock = {
  label: "DP · Feature",
  fields: {
    chip: { type: "text" }, title: { type: "textarea" }, subtitle: { type: "textarea" },
    ctaLabel: { type: "text" }, ctaHref: { type: "text" }, imageUrl: { type: "text" },
  },
  defaultProps: {
    chip: "Real sessions · real friction · real fixes",
    title: "We watch how people\nactually use your site.",
    subtitle: "Not opinions. Not redesign roulette. Every change starts in a real session recording.",
    ctaLabel: "See it on your site", ctaHref: "mailto:hello@hiiive.ai",
    imageUrl: "https://images.unsplash.com/photo-1542744173-b3cd6377db95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  },
  render: (p) => (
    <section
      className={styles.feature}
      style={p.imageUrl ? {
        // Layer order mirrors the Pencil fill stack: bottom ink gradient →
        // slight ink tint → gray saturation-blend (desaturates) → photo.
        backgroundImage: `linear-gradient(180deg, rgba(27,29,30,0) 35%, rgba(27,29,30,0.8) 100%), linear-gradient(rgba(27,29,30,0.08), rgba(27,29,30,0.08)), linear-gradient(rgba(148,153,164,0.9), rgba(148,153,164,0.9)), url(${p.imageUrl})`,
        backgroundBlendMode: "normal, normal, saturation, normal",
      } : undefined}
    >
      <div className={`${styles.inner} ${styles.featureInner}`}>
        <span className={styles.featureChip}><span className={styles.featureChipBar} />{p.chip}</span>
        <div className={styles.featureBottom}>
          <div className={styles.featureL}>
            <h2 className={styles.featureTitle}>{lines(p.title)}</h2>
            <p className={styles.featureSub}>{p.subtitle}</p>
          </div>
          <a href={p.ctaHref || "#"} className={styles.btnAccent}>{p.ctaLabel} <ArrowRight /></a>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 6. Results — tiles + strip                                         */
/* ================================================================== */
export const DpResultsBlock = {
  label: "DP · Results",
  fields: {
    kicker: { type: "text" }, title: { type: "textarea" },
    tiles: {
      type: "array", getItemSummary: (i) => i.label || "Tile",
      arrayFields: { value: { type: "text" }, label: { type: "text" }, desc: { type: "textarea" } },
      defaultItemProps: { value: "0", label: "Label", desc: "" },
    },
    strip: { type: "textarea" },
  },
  defaultProps: {
    kicker: "What you get",
    title: "Not hours. Not reports.\nShipped improvements.",
    tiles: [
      { value: "WK 1", label: "Tracking live", desc: "Funnel defined, events tracked, baseline captured." },
      { value: "2–6", label: "Improvements / month", desc: "Designed, shipped and QA'd — or spec'd for your team." },
      { value: "DAY 30", label: "Your leak map", desc: "You'll know exactly where your site loses money." },
      { value: "1", label: "Primary KPI", desc: "Agreed in week 0. Every report opens with it." },
    ],
    strip: "By day 30 you'll know exactly where your site leaks — whether or not you continue.",
  },
  render: (p) => (
    <section className={styles.results}>
      <div className={styles.inner}>
        <span className={styles.kickerLabel}>{p.kicker}</span>
        <h2 className={styles.resultsTitle}>{lines(p.title)}</h2>
        <div className={styles.tiles}>
          {(p.tiles || []).map((t, i) => (
            <div key={i} className={styles.tile}>
              <span className={styles.tileValue}>{t.value}</span>
              <span className={styles.tileLabel}>{t.label}</span>
              <span className={styles.tileDesc}>{t.desc}</span>
            </div>
          ))}
        </div>
        <div className={styles.dayStrip}>{p.strip}</div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 7. Selected work                                                   */
/* ================================================================== */
export const DpCasesBlock = {
  label: "DP · Cases",
  fields: {
    kicker: { type: "text" }, title: { type: "textarea" }, linkLabel: { type: "text" }, linkHref: { type: "text" },
    cases: {
      type: "array", getItemSummary: (i) => i.tag || "Case",
      arrayFields: { tag: { type: "text" }, stat: { type: "text" }, statLabel: { type: "text" }, body: { type: "textarea" } },
      defaultItemProps: { tag: "SEGMENT · TYPE", stat: "0", statLabel: "", body: "" },
    },
  },
  defaultProps: {
    kicker: "Selected work", title: "What it looks like\nin practice.", linkLabel: "All case studies", linkHref: "/#work",
    cases: [
      { tag: "E-commerce · Checkout", stat: "+0.8 pts", statLabel: "conversion in 8 weeks", body: "Recordings showed a rage-click loop on the payment step. We rebuilt the checkout — conversion moved in eight weeks." },
      { tag: "B2B SaaS · Pricing page", stat: "−31%", statLabel: "exit rate on pricing", body: "Sessions kept dying on the plan table. We simplified it and rewrote the FAQ from questions real users asked." },
      { tag: "Lead-gen · Mobile forms", stat: "2.1×", statLabel: "form completions", body: "Fourteen fields, half off-screen on mobile. We cut them to six and moved the form above the fold." },
    ],
  },
  render: (p) => (
    <section className={styles.cases}>
      <div className={styles.inner}>
        <div className={styles.casesHead}>
          <div>
            <span className={styles.kickerLabel}>{p.kicker}</span>
            <h2 className={styles.sectionTitle}>{lines(p.title)}</h2>
          </div>
          <a href={p.linkHref || "#"} className={styles.arrowLink}>{p.linkLabel} <ArrowRight /></a>
        </div>
        <div className={styles.caseRow}>
          {(p.cases || []).map((c, i) => (
            <article key={i} className={styles.caseCard}>
              <span className={styles.caseTag}>{c.tag}</span>
              <span className={styles.caseStat}>{c.stat}</span>
              <span className={styles.caseStatLabel}>{c.statLabel}</span>
              <p className={styles.caseBody}>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 8. Packages — pricing                                              */
/* ================================================================== */
export const DpPackagesBlock = {
  label: "DP · Packages",
  fields: {
    kicker: { type: "text" }, title: { type: "text" }, intro: { type: "textarea" },
    plans: {
      type: "array", getItemSummary: (i) => i.name || "Plan",
      arrayFields: {
        name: { type: "text" }, badge: { type: "text" }, price: { type: "text" }, period: { type: "text" },
        desc: { type: "textarea" }, featuresIntro: { type: "text" },
        features: { type: "array", getItemSummary: (i) => i.text || "Feature", arrayFields: { text: { type: "text" } }, defaultItemProps: { text: "Feature" } },
        ctaLabel: { type: "text" }, ctaHref: { type: "text" },
        featured: { type: "select", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes" }] },
      },
      defaultItemProps: { name: "Plan", badge: "", price: "€0", period: "/ month", desc: "", featuresIntro: "", features: [], ctaLabel: "Get started", ctaHref: "https://calendly.com/hiiive/get-to-know", featured: "no" },
    },
  },
  defaultProps: {
    kicker: "Investment", title: "Two ways to work with us.",
    intro: "Both run the same monthly loop. The difference is volume — how many improvements ship each month.",
    plans: [
      { name: "Grow", badge: "", price: "€1,000", period: "/ month", desc: "For brands starting to take conversion seriously.", featuresIntro: "",
        features: [{ text: "2 shipped improvements per month" }, { text: "Full tracking setup — Hotjar, Clarity, PostHog & GA4" }, { text: "Weekly monitoring for friction and quick wins" }, { text: "Monthly insights report + live KPI dashboard" }, { text: "Monthly review call" }],
        ctaLabel: "Start with Grow", ctaHref: "https://calendly.com/hiiive/get-to-know", featured: "no" },
      { name: "Scale", badge: "Most popular", price: "€2,500", period: "/ month", desc: "For brands with the volume to make a 1% lift real money.", featuresIntro: "Everything in Grow, plus:",
        features: [{ text: "6 shipped improvements per month" }, { text: "A/B testing & experiment program" }, { text: "Landing pages & new journey pages built" }, { text: "Quarterly strategy roadmap" }, { text: "Priority Slack access to the team" }],
        ctaLabel: "Talk about Scale", ctaHref: "https://calendly.com/hiiive/get-to-know", featured: "yes" },
    ],
  },
  render: (p) => (
    <section className={styles.packages}>
      <div className={styles.inner}>
        <div className={styles.howHead}>
          <div className={styles.howHeadL}>
            <span className={styles.kickerLabel}>{p.kicker}</span>
            <h2 className={styles.sectionTitle}>{p.title}</h2>
          </div>
          <p className={styles.howIntro}>{p.intro}</p>
        </div>
        <div className={styles.plans}>
          {(p.plans || []).map((pl, i) => {
            const on = pl.featured === "yes";
            return (
              <div key={i} className={`${styles.plan} ${on ? styles.planFeatured : ""}`}>
                <div className={styles.planTop}>
                  <span className={styles.planName}>{pl.name}</span>
                  {pl.badge ? <span className={styles.planBadge}>{pl.badge}</span> : null}
                </div>
                <div className={styles.planPrice}>{pl.price} <span className={styles.planPeriod}>{pl.period}</span></div>
                <p className={styles.planDesc}>{pl.desc}</p>
                {pl.featuresIntro ? <span className={styles.planFeaturesIntro}>{pl.featuresIntro}</span> : null}
                <ul className={styles.planFeatures}>
                  {(pl.features || []).map((f, j) => (
                    <li key={j}><span className={styles.planCheck}><Check /></span>{f.text}</li>
                  ))}
                </ul>
                <a href={pl.ctaHref || "#"} className={on ? styles.btnAccent : styles.btnPrimary}>{pl.ctaLabel} <ArrowRight /></a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 9. FAQ                                                             */
/* ================================================================== */
export const DpFaqBlock = {
  label: "DP · FAQ",
  fields: {
    title: { type: "textarea" },
    items: {
      type: "array", getItemSummary: (i) => i.q || "Question",
      arrayFields: { q: { type: "text" }, a: { type: "textarea" } },
      defaultItemProps: { q: "Question", a: "Answer" },
    },
  },
  defaultProps: {
    title: "The questions that come up every time.",
    items: [
      { q: "Do you build changes yourselves, or hand them off?", a: "Either. We ship directly on most platforms — or deliver a build-ready spec to your dev team." },
      { q: "We already have GA4. Is that enough?", a: "Almost never. GA4 is usually installed but nothing is tracked beyond page views, and funnels aren't defined. We fix that in week one." },
      { q: "How is this different from a one-off redesign?", a: "A redesign is a bet placed once. We run a measured loop: every change is backed by behaviour data, shipped, and proven against your KPI." },
      { q: "Can we stop anytime?", a: "Yes. Monthly rolling, no long contract. The end of month 3 is a built-in decision point: continue or take the leak map and go." },
    ],
  },
  render: (p) => (
    <section className={styles.faq}>
      <div className={styles.inner}>
        <h2 className={styles.faqTitle}>{lines(p.title)}</h2>
        <div className={styles.faqList}>
          {(p.items || []).map((it, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQ}>{it.q}<span className={styles.faqPlus} aria-hidden="true" /></summary>
              <p className={styles.faqA}>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  ),
};

export const digitalPresenceBlocks = {
  DpHeroBlock, DpProblemBlock, DpMeetBlock, DpHowBlock, DpFeatureBlock,
  DpResultsBlock, DpCasesBlock, DpPackagesBlock, DpFaqBlock,
};
