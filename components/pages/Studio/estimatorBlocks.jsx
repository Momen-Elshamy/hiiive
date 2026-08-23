// MVP Cost Estimator page blocks (Pencil node ploD8).
// ToolHeroBlock + ToolMethodBlock are static; EstimatorBlock renders the
// interactive "use client" <MvpEstimator/> (same pattern as HeaderBlock).
import MvpEstimator, { ESTIMATOR_DEFAULTS } from "./MvpEstimator";
import styles from "./estimator.module.css";

const lines = (t) =>
  (t || "").split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
  ));

/* ================================================================== */
/* Tool · Hero                                                         */
/* ================================================================== */
const TH_D = {
  kicker: "Free tool — no sign-up",
  title: "What will your MVP actually cost?",
  subtitle: "Answer five questions and get the range we would quote, the timeline, and where the money goes.",
  meta: [{ text: "2 minutes" }, { text: "Instant range" }, { text: "No email required" }],
};

export const ToolHeroBlock = {
  label: "Tool · Hero",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    subtitle: { type: "textarea" },
    meta: {
      type: "array",
      getItemSummary: (i) => i.text || "Meta",
      arrayFields: { text: { type: "text" } },
      defaultItemProps: { text: "Fact" },
    },
  },
  defaultProps: TH_D,
  render: (raw) => {
    const p = { ...TH_D, ...raw };
    return (
      <section className={styles.toolHero}>
        <div className={styles.inner}>
          <div className={styles.kickerRow}><span className={styles.kickerDot} /><span className={styles.kickerLabel}>{p.kicker}</span></div>
          <h1 className={styles.toolTitle}>{lines(p.title)}</h1>
          <p className={styles.toolSub}>{p.subtitle}</p>
          <div className={styles.metaRow}>
            {(p.meta || []).map((m, i) => (
              <span key={i} className={styles.metaChip}><span className={styles.metaTick}>✓</span>{m.text}</span>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* Tool · Method                                                       */
/* ================================================================== */
const TM_D = {
  kicker: "Method",
  title: "How we get to the number.",
  note: "No rate card, no guesswork. The ranges come from projects we have already delivered.",
  cols: [
    { num: "01", title: "Real project data", desc: "Every range is anchored to what we actually billed on comparable builds — same stack, same scope pattern." },
    { num: "02", title: "Scope, not hours", desc: "We price an outcome and fix the scope. That is why the number does not drift three weeks in." },
    { num: "03", title: "What moves it most", desc: "Integrations, compliance and messy data move the price far more than the number of screens." },
  ],
};

export const ToolMethodBlock = {
  label: "Tool · Method",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    note: { type: "textarea" },
    cols: {
      type: "array",
      getItemSummary: (i) => i.title || "Column",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, desc: { type: "textarea" } },
      defaultItemProps: { num: "01", title: "Point", desc: "" },
    },
  },
  defaultProps: TM_D,
  render: (raw) => {
    const p = { ...TM_D, ...raw };
    return (
      <section className={styles.method}>
        <div className={styles.inner}>
          <div className={styles.methodHead}>
            <div>
              <span className={styles.kickerLabel}>{p.kicker}</span>
              <h2 className={styles.methodTitle}>{p.title}</h2>
            </div>
            <p className={styles.methodNote}>{p.note}</p>
          </div>
          <div className={styles.methodRow}>
            {(p.cols || []).map((c, i) => (
              <div key={i} className={styles.methodCol}>
                <span className={styles.methodNum}>{c.num}</span>
                <span className={styles.methodColTitle}>{c.title}</span>
                <p className={styles.methodColDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* Estimator (interactive)                                             */
/* ================================================================== */
export const EstimatorBlock = {
  label: "Tool · MVP Estimator",
  fields: {
    currency: { type: "text" },
    step1Title: { type: "text" },
    types: {
      type: "array",
      getItemSummary: (i) => i.label || "Type",
      arrayFields: {
        label: { type: "text" }, desc: { type: "text" },
        costLo: { type: "number" }, costHi: { type: "number" },
        weeksLo: { type: "number" }, weeksHi: { type: "number" },
      },
      defaultItemProps: { label: "Type", desc: "", costLo: 15, costHi: 25, weeksLo: 6, weeksHi: 8 },
    },
    step2Title: { type: "text" },
    step2Hint: { type: "text" },
    features: {
      type: "array",
      getItemSummary: (i) => i.label || "Feature",
      arrayFields: { label: { type: "text" }, costLo: { type: "number" }, costHi: { type: "number" } },
      defaultItemProps: { label: "Feature", costLo: 2, costHi: 3 },
    },
    step3Title: { type: "text" },
    step3Hint: { type: "text" },
    integrationCostLo: { type: "number" },
    integrationCostHi: { type: "number" },
    step4Title: { type: "text" },
    designs: {
      type: "array",
      getItemSummary: (i) => i.label || "Design",
      arrayFields: { label: { type: "text" }, desc: { type: "text" }, addLo: { type: "number" }, addHi: { type: "number" }, addWeeks: { type: "number" } },
      defaultItemProps: { label: "Option", desc: "", addLo: 0, addHi: 0, addWeeks: 0 },
    },
    step5Title: { type: "text" },
    speeds: {
      type: "array",
      getItemSummary: (i) => i.label || "Speed",
      arrayFields: { label: { type: "text" }, desc: { type: "text" }, multiplier: { type: "number" } },
      defaultItemProps: { label: "Option", desc: "", multiplier: 1 },
    },
    resultKicker: { type: "text" },
    resultNote: { type: "text" },
    factTimeline: { type: "text" },
    factTeam: { type: "text" },
    factBilling: { type: "text" },
    factBillingValue: { type: "text" },
    factIncludes: { type: "text" },
    factIncludesValue: { type: "text" },
    weeksUnit: { type: "text" },
    peopleUnit: { type: "text" },
    breakdownTitle: { type: "text" },
    breakdown: {
      type: "array",
      getItemSummary: (i) => i.label || "Row",
      arrayFields: { label: { type: "text" }, percent: { type: "number" } },
      defaultItemProps: { label: "Phase", percent: 25 },
    },
    ctaLabel: { type: "text" },
    ctaHref: { type: "text" },
    emailLabel: { type: "text" },
    emailTo: { type: "text" },
    emailSubject: { type: "text" },
    disclaimer: { type: "textarea" },
  },
  defaultProps: ESTIMATOR_DEFAULTS,
  // Strip Puck's internal non-serializable props (puck, editMode) before the
  // client boundary — passing them to a "use client" component 500s the RSC render.
  render: ({ puck, editMode, id, ...props }) => <MvpEstimator {...props} />,
};

export const estimatorBlocks = { ToolHeroBlock, ToolMethodBlock, EstimatorBlock };
