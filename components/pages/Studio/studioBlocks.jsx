// Server-safe Puck blocks for the Studio page. No "use client" — static markup
// rendered by Puck's RSC <Render>. Uses the global design tokens (--hv-*,
// --font-*) from app/globals.css so it matches the home design.
import styles from "./studioBlocks.module.css";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ================================================================== */
/* Studio · Hero                                                       */
/* ================================================================== */
export const StudioHeroBlock = {
  label: "Studio · Hero",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    subtitle: { type: "textarea" },
    primaryLabel: { type: "text" },
    primaryHref: { type: "text" },
    secondaryLabel: { type: "text" },
    secondaryHref: { type: "text" },
  },
  defaultProps: {
    kicker: "Hiiive Studio — services",
    title: "Tech services, built the AI-native way.",
    subtitle:
      "From the software your team runs on to the funnel that fills it. One partner, working the way AI-native teams actually work — fast, measured, and owned by you.",
    primaryLabel: "Book a call",
    primaryHref: "https://calendly.com/hiiive/dvision-potenzial",
    secondaryLabel: "See our work",
    secondaryHref: "/#work",
  },
  render: ({ kicker, title, subtitle, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) => (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.kicker}>
          <span className={styles.kickerBar} />
          <span className={styles.kickerLabel}>{kicker}</span>
        </div>
        <h1 className={styles.heroTitle}>
          {(title || "").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
          ))}
        </h1>
        <p className={styles.heroSub}>{subtitle}</p>
        <div className={styles.ctaRow}>
          <a href={primaryHref || "https://calendly.com/hiiive/dvision-potenzial"} className={styles.btnPrimary}>
            {primaryLabel} <ArrowRight />
          </a>
          {secondaryLabel ? (
            <a href={secondaryHref || "/#work"} className={styles.btnSecondary}>{secondaryLabel}</a>
          ) : null}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* Studio · Services (anchored sections)                               */
/* ================================================================== */
export const StudioServicesBlock = {
  label: "Studio · Services",
  fields: {
    services: {
      type: "array",
      getItemSummary: (item) => item.name || "Service",
      arrayFields: {
        anchorId: { type: "text" },
        num: { type: "text" },
        name: { type: "text" },
        lead: { type: "textarea" },
        bullets: {
          type: "array",
          getItemSummary: (item) => item.text || "Point",
          arrayFields: { text: { type: "text" } },
          defaultItemProps: { text: "What's included" },
        },
      },
      defaultItemProps: { anchorId: "service", num: "01", name: "Service", lead: "Description of this service.", bullets: [] },
    },
  },
  defaultProps: {
    services: [
      {
        anchorId: "ai-software", num: "01", name: "AI software & internal tools",
        lead: "Custom systems and agents that take real work off your team — built on your data, wired into the tools you already use.",
        bullets: [{ text: "Internal agents & copilots" }, { text: "Workflow automation" }, { text: "Data & integration plumbing" }],
      },
      {
        anchorId: "mvp", num: "02", name: "MVP design & build",
        lead: "From idea to a product in users' hands — weeks, not quarters. We ship a thin, real slice and iterate on evidence.",
        bullets: [{ text: "Product design & prototyping" }, { text: "Full-stack build" }, { text: "Launch & instrumentation" }],
      },
      {
        anchorId: "seo", num: "03", name: "Organic visibility (SEO)",
        lead: "AI-native search: built to be found by people and by models. Technical foundations plus content that compounds.",
        bullets: [{ text: "Technical SEO & structure" }, { text: "AI-search readiness" }, { text: "Content architecture" }],
      },
      {
        anchorId: "funnels", num: "04", name: "Digital presence & funnels",
        lead: "Sites, funnels and conversion structure that turn traffic into pipeline — measured against one number you care about.",
        bullets: [{ text: "Marketing sites" }, { text: "Conversion funnels" }, { text: "Analytics & experimentation" }],
      },
      {
        anchorId: "consulting", num: "05", name: "AI transformation & consulting",
        lead: "Audit, roadmap and enablement — so the change actually sticks. We leave your team able to run it without us.",
        bullets: [{ text: "AI opportunity audit" }, { text: "Roadmap & enablement" }, { text: "Team training" }],
      },
    ],
  },
  render: ({ services }) => (
    <div className={styles.services}>
      {(services || []).map((s, i) => (
        <section key={i} id={s.anchorId || undefined} className={styles.service}>
          <div className={`${styles.inner} ${styles.serviceGrid}`}>
            <div className={styles.serviceHead}>
              <span className={styles.serviceNum}>{s.num}</span>
              <h2 className={styles.serviceName}>{s.name}</h2>
            </div>
            <div className={styles.serviceBody}>
              <p className={styles.serviceLead}>{s.lead}</p>
              {Array.isArray(s.bullets) && s.bullets.length > 0 ? (
                <ul className={styles.bullets}>
                  {s.bullets.map((b, j) => (
                    <li key={j}>{b.text}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </div>
  ),
};

export const studioBlocks = { StudioHeroBlock, StudioServicesBlock };
