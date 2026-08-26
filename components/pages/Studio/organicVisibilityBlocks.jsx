// Server-safe Puck blocks for the Studio / Organic Visibility landing page
// (Pencil node a1TV10). Content-editable; visual scaffolding fixed CSS.
// Reuses HomeClientsBlock, DpFeatureBlock, DpPackagesBlock, DpFaqBlock,
// CaseStudyListBlock and HomeCtaBlock for the shared sections.
import styles from "./organicVisibilityBlocks.module.css";

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
/* 1. Hero + visibility scorecard                                      */
/* ================================================================== */
const HERO_D = {
    crumbParent: "Studio", crumbCurrent: "Organic Visibility",
    kicker: "Service 03 — Organic visibility",
    headline: "Be the answer,\nnot the tenth\nblue link.",
    subtitle: "Buyers now ask assistants before they ask Google. We make sure the answer they get is built from your site, your data and your language — and that it sends them to you.",
    primaryLabel: "Book a call", primaryHref: "https://calendly.com/hiiive/get-to-know",
    secondaryLabel: "Watch the 2-min explainer", secondaryHref: "#",
    cardKicker: "Visibility snapshot", cardDomain: "yourbrand.com",
    score: "18%", scoreLabel: "share of answer across 240 buying questions",
    rows: [
      { label: "ChatGPT", value: "22%", percent: 22 },
      { label: "Perplexity", value: "31%", percent: 31 },
      { label: "Google AI Overviews", value: "12%", percent: 12 },
      { label: "Classic search", value: "44%", percent: 44 },
    ],
    cardNote: "Sample output from the audit we run in week one.",
  };

export const OvHeroBlock = {
  label: "OV · Hero",
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
    cardKicker: { type: "text" },
    cardDomain: { type: "text" },
    score: { type: "text" },
    scoreLabel: { type: "text" },
    rows: {
      type: "array",
      getItemSummary: (i) => i.label || "Row",
      arrayFields: { label: { type: "text" }, value: { type: "text" }, percent: { type: "number" } },
      defaultItemProps: { label: "Engine", value: "0%", percent: 0 },
    },
    cardNote: { type: "text" },
  },
  defaultProps: HERO_D,
  render: (raw) => {
    // Stored pages may carry only an id — Puck merges defaultProps at
    // editor-insert time, not at render. Merge here so seeds stay lean.
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
          <div className={styles.scorecard}>
            <div className={styles.cardHead}>
              <span className={styles.cardKicker}>{p.cardKicker}</span>
              <span className={styles.cardDomain}>{p.cardDomain}</span>
            </div>
            <div className={styles.score}>{p.score}</div>
            <div className={styles.scoreLabel}>{p.scoreLabel}</div>
            <div className={styles.barRows}>
              {(p.rows || []).map((r, i) => (
                <div key={i} className={styles.barRow}>
                  <div className={styles.barRowTop}>
                    <span className={styles.barLabel}>{r.label}</span>
                    <span className={styles.barValue}>{r.value}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.min(100, Number(r.percent) || 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cardRule} />
            <div className={styles.cardNote}>{p.cardNote}</div>
          </div>
        </div>
      </div>
    </section>
  );
  },
};

/* ================================================================== */
/* 2. Problem — assistant answer mockup + numbered points              */
/* ================================================================== */
const PROBLEM_D = {
    headline: "Buyers ask assistants now. The answer cites\na handful of sources — or you're invisible.",
    subhead: "We rebuilt our whole visibility practice around one question: when a model answers, are you in the answer?",
    mockupLabel: "AI assistant · a buying question your customer asked today",
    question: "“What's the best inventory software for mid-size retailers?”",
    sourcesLabel: "Sources cited",
    sources: [
      { domain: "competitor-a.com", status: "cited" },
      { domain: "industry-review.com", status: "cited" },
      { domain: "competitor-b.com", status: "cited" },
      { domain: "yourbrand.com", status: "not-cited" },
    ],
    points: [
      { num: "01", title: "People ask, they don't search", desc: "Buyers describe a problem to an assistant and act on the one answer they get back." },
      { num: "02", title: "Answers cite few sources", desc: "Models pull from a small set of trusted sources. Being #4 on Google isn't being in the answer." },
      { num: "03", title: "Old metrics hide the loss", desc: "Rankings look stable while assistant answers quietly stop mentioning you." },
    ],
  };

export const OvProblemBlock = {
  label: "OV · Problem",
  fields: {
    headline: { type: "textarea" },
    subhead: { type: "textarea" },
    mockupLabel: { type: "text" },
    question: { type: "text" },
    sourcesLabel: { type: "text" },
    sources: {
      type: "array",
      getItemSummary: (i) => i.domain || "Source",
      arrayFields: {
        domain: { type: "text" },
        status: { type: "select", options: [{ label: "cited", value: "cited" }, { label: "not cited", value: "not-cited" }] },
      },
      defaultItemProps: { domain: "example.com", status: "cited" },
    },
    points: {
      type: "array",
      getItemSummary: (i) => i.title || "Point",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "textarea" } },
      defaultItemProps: { num: "01", title: "Point", desc: "" },
    },
  },
  defaultProps: PROBLEM_D,
  render: (raw) => {
    // Stored pages may carry only an id — Puck merges defaultProps at
    // editor-insert time, not at render. Merge here so seeds stay lean.
    const p = { ...PROBLEM_D, ...raw };
    return (
    <section className={styles.problem}>
      <div className={styles.inner}>
        <h2 className={styles.problemHead}>{lines(p.headline)}</h2>
        <p className={styles.problemSub}>{p.subhead}</p>
        <div className={styles.problemGrid}>
          <div className={styles.mockup}>
            <span className={styles.mockupLabel}>{p.mockupLabel}</span>
            <p className={styles.mockupQ}>{p.question}</p>
            <span className={styles.sourcesLabel}>{p.sourcesLabel}</span>
            <div className={styles.sources}>
              {(p.sources || []).map((s, i) => (
                <div key={i} className={`${styles.source} ${s.status === "not-cited" ? styles.sourceMiss : ""}`}>
                  <span className={styles.sourceDot} />
                  <span className={styles.sourceDomain}>{s.domain}</span>
                  <span className={styles.sourcePill}>{s.status === "not-cited" ? "not cited" : "cited"}</span>
                </div>
              ))}
            </div>
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
/* 3. The System (dark) — five parts + engines panel                   */
/* ================================================================== */
const SYSTEM_D = {
    kicker: "The system",
    title: "Five parts.\nOne visibility engine.",
    lead: "Run together as one system. Pulled apart, none of them move the number — that's why point-solution SEO stopped working.",
    parts: [
      { num: "01", title: "Entity & authority foundation", desc: "Schema, entity graph, consistent brand facts" },
      { num: "02", title: "AI-native content system", desc: "Question-first pages with answer blocks" },
      { num: "03", title: "Technical & render health", desc: "Crawlable, fast, readable by models" },
      { num: "04", title: "Citations & digital PR", desc: "Placement in sources models actually cite" },
      { num: "05", title: "Measurement that means something", desc: "Share of answer, assisted pipeline" },
    ],
    panelKicker: "Where you show up",
    panelMeta: "after 6 months",
    rows: [
      { label: "ChatGPT", value: "64% of tracked questions", percent: 64 },
      { label: "Perplexity", value: "55% of tracked questions", percent: 55 },
      { label: "Google AI Overviews", value: "46% of tracked questions", percent: 46 },
      { label: "Claude", value: "39% of tracked questions", percent: 39 },
      { label: "Classic search", value: "34% of tracked questions", percent: 34 },
    ],
    panelNote: "Share of answer across your 240 tracked buying questions — reported every month.",
  };

export const OvSystemBlock = {
  label: "OV · System",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    lead: { type: "textarea" },
    parts: {
      type: "array",
      getItemSummary: (i) => i.title || "Part",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "text" } },
      defaultItemProps: { num: "01", title: "Part", desc: "" },
    },
    panelKicker: { type: "text" },
    panelMeta: { type: "text" },
    rows: {
      type: "array",
      getItemSummary: (i) => i.label || "Row",
      arrayFields: { label: { type: "text" }, value: { type: "text" }, percent: { type: "number" } },
      defaultItemProps: { label: "Engine", value: "0% of tracked questions", percent: 0 },
    },
    panelNote: { type: "textarea" },
  },
  defaultProps: SYSTEM_D,
  render: (raw) => {
    // Stored pages may carry only an id — Puck merges defaultProps at
    // editor-insert time, not at render. Merge here so seeds stay lean.
    const p = { ...SYSTEM_D, ...raw };
    return (
    <section className={styles.system}>
      <div className={styles.inner}>
        <div className={styles.systemGrid}>
          <div>
            <div className={styles.kicker}><span className={`${styles.kickerBar} ${styles.kickerBarAccent}`} /><span className={styles.kickerLabelRev}>{p.kicker}</span></div>
            <h2 className={styles.systemTitle}>{lines(p.title)}</h2>
            <p className={styles.systemLead}>{p.lead}</p>
            <div className={styles.parts}>
              {(p.parts || []).map((s, i) => (
                <div key={i} className={styles.part}>
                  <span className={styles.partNum}>{s.num}</span>
                  <div>
                    <span className={styles.partTitle}>{s.title}</span>
                    <span className={styles.partDesc}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.engines}>
            <div className={styles.cardHead}>
              <span className={styles.cardKicker}>{p.panelKicker}</span>
              <span className={styles.cardDomain}>{p.panelMeta}</span>
            </div>
            <div className={`${styles.barRows} ${styles.barRowsLoose}`}>
              {(p.rows || []).map((r, i) => (
                <div key={i} className={styles.barRow}>
                  <div className={styles.barRowTop}>
                    <span className={styles.barLabel}>{r.label}</span>
                    <span className={styles.barValueMuted}>{r.value}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.min(100, Number(r.percent) || 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cardRule} />
            <div className={styles.cardNote}>{p.panelNote}</div>
          </div>
        </div>
      </div>
    </section>
  );
  },
};

/* ================================================================== */
/* 4. Engagement phases + loop strip                                   */
/* ================================================================== */
const PHASES_D = {
    kicker: "Engagement",
    title: "What the first six months look like.",
    intro: "Visibility compounds. The first release matters less than the system that keeps shipping after it.",
    phases: [
      { num: "01", weeks: "Weeks 1–2", title: "Audit", items: [{ text: "Share-of-answer baseline" }, { text: "Entity & schema gaps" }, { text: "Technical render report" }, { text: "240-question opportunity map" }] },
      { num: "02", weeks: "Weeks 3–6", title: "Foundation", items: [{ text: "Schema & entity graph" }, { text: "IA and internal linking" }, { text: "Render and speed fixes" }, { text: "llms.txt + agent rules" }] },
      { num: "03", weeks: "Weeks 7–14", title: "Content engine", items: [{ text: "Question-first page system" }, { text: "Original data assets" }, { text: "Answer blocks & FAQs" }, { text: "Editorial cadence live" }] },
      { num: "04", weeks: "Ongoing", title: "Compound", items: [{ text: "Citation & digital PR push" }, { text: "Monthly share-of-answer" }, { text: "Pipeline attribution" }, { text: "Quarterly strategy reset" }] },
    ],
    note: "Visibility compounds — every month builds on the last instead of starting over.",
    loopStrip: "Audit → Foundation → Content engine → Compound",
  };

export const OvPhasesBlock = {
  label: "OV · Phases",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    intro: { type: "textarea" },
    phases: {
      type: "array",
      getItemSummary: (i) => i.title || "Phase",
      arrayFields: {
        num: { type: "text" },
        weeks: { type: "text" },
        title: { type: "text" },
        items: { type: "array", getItemSummary: (i) => i.text || "Item", arrayFields: { text: { type: "text" } }, defaultItemProps: { text: "Deliverable" } },
      },
      defaultItemProps: { num: "01", weeks: "Weeks 1–2", title: "Phase", items: [] },
    },
    note: { type: "textarea" },
    loopStrip: { type: "text" },
  },
  defaultProps: PHASES_D,
  render: (raw) => {
    // Stored pages may carry only an id — Puck merges defaultProps at
    // editor-insert time, not at render. Merge here so seeds stay lean.
    const p = { ...PHASES_D, ...raw };
    return (
    <section className={styles.phasesWrap}>
      <div className={styles.inner}>
        <div className={styles.phasesHead}>
          <div>
            <span className={styles.kickerLabel}>{p.kicker}</span>
            <h2 className={styles.sectionTitle}>{p.title}</h2>
          </div>
          <p className={styles.phasesIntro}>{p.intro}</p>
        </div>
        <div className={styles.phases}>
          {(p.phases || []).map((ph, i) => (
            <div key={i} className={styles.phase}>
              <div className={styles.phaseTop}>
                <span className={styles.phaseNum}>{ph.num}</span>
                <span className={styles.phasePill}>{ph.weeks}</span>
              </div>
              <span className={styles.phaseTitle}>{ph.title}</span>
              <ul className={styles.phaseList}>
                {(ph.items || []).map((it, j) => (
                  <li key={j}><span className={styles.phaseCheck}><Check /></span>{it.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.phasesNote}>{p.note}</p>
        <div className={styles.loopStrip}>{p.loopStrip}</div>
      </div>
    </section>
  );
  },
};

export const organicVisibilityBlocks = { OvHeroBlock, OvProblemBlock, OvSystemBlock, OvPhasesBlock };
