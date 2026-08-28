// Server-safe Puck blocks mirroring the static HomePageFallback design.
// No "use client" — every section is static markup, so Puck's RSC <Render>
// can call these render() functions on the server. They reuse the same
// HomePageFallback.module.css so CMS-edited pages match the fallback exactly.
import styles from "./HomePageFallback.module.css";
import { Reveal, Stagger, StaggerItem } from "./motion";
import HeroVideo from "./HeroVideo";
import Flywheel from "./Flywheel";

/* ---------- shared bits ---------------------------------------------------- */
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const clientIcons = {
  hexagon: <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5z" />,
  circleDot: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  triangle: <path d="M12 3.5 21.5 20H2.5L12 3.5z" />,
  box: <><path d="M20.5 7.3 12 12l-8.5-4.7M12 12v9.5" /><path d="M3.5 7.3 12 2.5l8.5 4.8v9.4L12 21.5 3.5 16.7V7.3z" /></>,
  none: null,
};
const iconOptions = Object.keys(clientIcons).map((k) => ({ label: k, value: k }));

/* ================================================================== */
/* 1. Hero                                                             */
/* ================================================================== */
export const HomeHeroBlock = {
  label: "Home · Hero",
  fields: {
    kicker: { type: "text" },
    headline: { type: "textarea" },
    subtitle: { type: "textarea" },
    primaryLabel: { type: "text" },
    primaryHref: { type: "text" },
    secondaryLabel: { type: "text" },
    secondaryHref: { type: "text" },
    meta: { type: "text" },
    capabilities: { type: "text" },
    imageUrl: { type: "text" },
    videoUrl: { type: "text" },
  },
  defaultProps: {
    kicker: "AI-native company builder",
    headline: "The AI software your business should already run on.",
    subtitle:
      "Hiiive Studio is the tech partner for teams going AI-native — software, MVPs, visibility and funnels. Hiiive Lab turns what we learn into products of our own.",
    primaryLabel: "Book a call",
    primaryHref: "#contact",
    secondaryLabel: "See what we build",
    secondaryHref: "/work",
    meta: "First working version in weeks — not quarters.",
    capabilities: "Software, MVPs, Visibility, Funnels",
    imageUrl: "/img/hero-waves-poster.jpg",
    videoUrl: "/video/hero-waves.e2058d8a.mp4",
  },
  render: ({ kicker, headline, subtitle, primaryLabel, primaryHref, secondaryLabel, secondaryHref, meta, capabilities, imageUrl, videoUrl }) => (
    <section
      className={styles.hero}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <HeroVideo src={videoUrl} poster={imageUrl} />
      <div className={`${styles.inner} ${styles.heroInner}`}>
        <div className={styles.heroTop}>
          <div className={`${styles.headlineCol} ${styles.heroReveal1}`}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              <span className={styles.kickerLabel}>{kicker}</span>
            </div>
            <h1 className={styles.heroHeadline}>
              {(headline || "").split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
              ))}
            </h1>
          </div>
          <div className={`${styles.heroRight} ${styles.heroReveal2}`}>
            <p className={styles.heroSub}>{subtitle}</p>
            <div className={styles.heroCtaRow}>
              <a href={primaryHref || "#contact"} className={styles.btnPrimary}>
                {primaryLabel} <ArrowRight />
              </a>
              <a href={secondaryHref || "/work"} className={styles.btnSecondary}>{secondaryLabel}</a>
            </div>
            <p className={styles.heroMeta}>{meta}</p>
          </div>
        </div>
        <div className={`${styles.heroBottom} ${styles.heroReveal3}`}>
          <ul className={styles.heroCaps}>
            {(capabilities || "")
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
              .map((c) => (
                <li key={c} className={styles.heroCap}>{c}</li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 2. Clients                                                          */
/* ================================================================== */
export const HomeClientsBlock = {
  label: "Home · Clients",
  fields: {
    kicker: { type: "text" },
    note: { type: "text" },
    logos: {
      type: "array",
      getItemSummary: (item) => item.name || "Logo",
      arrayFields: {
        name: { type: "text" },
        icon: { type: "select", options: iconOptions },
        // Optional image logo (e.g. /logos/acme.svg). When set, it replaces
        // the icon+text rendering. `name` doubles as the alt text.
        image: { type: "text" },
      },
      defaultItemProps: { name: "CLIENT", icon: "none", image: "" },
    },
  },
  defaultProps: {
    kicker: "Trusted by operators in logistics, retail, fintech and health",
    note: "Client names shown with permission",
    logos: [
      { name: "NORTHWIND", icon: "hexagon" },
      { name: "MERIDIAN", icon: "circleDot" },
      { name: "ATLAS FOODS", icon: "none" },
      { name: "CIVIC BANK", icon: "triangle" },
      { name: "HELIA", icon: "none" },
      { name: "ORBIT", icon: "box" },
    ],
  },
  render: ({ kicker, note, logos }) => (
    <section className={styles.clients}>
      <div className={styles.inner}>
        <Reveal className={styles.clientsHead}>
          <div className={styles.kicker}>
            <span className={styles.kickerBar} />
            <span className={styles.kickerLabel}>{kicker}</span>
          </div>
          <span className={styles.clientsNote}>{note}</span>
        </Reveal>
        <div className={styles.rule} />
        <Stagger className={styles.logos}>
          {(logos || []).map((c, i) => (
            <StaggerItem as="span" key={i} className={styles.logo}>
              {c.image ? (
                <img className={styles.logoImg} src={c.image} alt={c.name || ""} loading="lazy" />
              ) : (
                <>
                  {clientIcons[c.icon] ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      {clientIcons[c.icon]}
                    </svg>
                  ) : null}
                  {c.name}
                </>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 3. Stats                                                            */
/* ================================================================== */
export const HomeStatsBlock = {
  label: "Home · Stats",
  fields: {
    kicker: { type: "text" },
    note: { type: "text" },
    stats: {
      type: "array",
      getItemSummary: (item) => item.label || "Stat",
      arrayFields: {
        label: { type: "text" },
        value: { type: "text" },
        desc: { type: "text" },
      },
      defaultItemProps: { label: "Label", value: "0", desc: "Description" },
    },
  },
  defaultProps: {
    kicker: "By the numbers",
    note: "Measured across client engagements · updated Jan 2026",
    stats: [
      { label: "Internal tools shipped", value: "12+", desc: "In production and still running." },
      { label: "Industries served", value: "4", desc: "Logistics, retail, fintech, health." },
      { label: "Time to first release", value: "6 wks", desc: "Median across our MVP builds." },
      { label: "Products in Lab", value: "2", desc: "One already in private beta." },
    ],
  },
  render: ({ kicker, note, stats }) => (
    <section className={styles.stats}>
      <div className={styles.inner}>
        <Reveal className={styles.statsHead}>
          <div className={styles.kicker}>
            <span className={styles.kickerBar} />
            <span className={styles.kickerLabel}>{kicker}</span>
          </div>
          <span className={styles.statsNote}>{note}</span>
        </Reveal>
        <div className={`${styles.rule} ${styles.ruleInk}`} />
        <Stagger className={styles.statsRow}>
          {(stats || []).map((s, i) => (
            <StaggerItem key={i} className={styles.stat}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statDesc}>{s.desc}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 4. Pillars (Studio + Lab)                                          */
/* ================================================================== */
export const HomePillarsBlock = {
  label: "Home · Pillars",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    note: { type: "textarea" },
    studioTag: { type: "text" },
    studioTitle: { type: "text" },
    studioLead: { type: "textarea" },
    services: {
      type: "array",
      getItemSummary: (item) => item.name || "Service",
      arrayFields: {
        num: { type: "text" },
        name: { type: "text" },
        desc: { type: "textarea" },
      },
      defaultItemProps: { num: "01", name: "Service", desc: "Description" },
    },
    studioLinkLabel: { type: "text" },
    studioLinkHref: { type: "text" },
    labTag: { type: "text" },
    labTitle: { type: "text" },
    labLead: { type: "textarea" },
    products: {
      type: "array",
      getItemSummary: (item) => item.name || "Product",
      arrayFields: {
        name: { type: "text" },
        desc: { type: "text" },
        status: { type: "text" },
      },
      defaultItemProps: { name: "PRODUCT", desc: "Description", status: "Concept" },
    },
    labLinkLabel: { type: "text" },
    labLinkHref: { type: "text" },
  },
  defaultProps: {
    kicker: "What HIIIVE is",
    title: "One company, two halves.",
    note: "Studio pays attention to your workflow. Lab pays attention to the patterns underneath it. Each one makes the other sharper.",
    studioTag: "Hiiive Studio — services",
    studioTitle: "Tech services, built the AI-native way.",
    studioLead: "From the software your team runs on to the funnel that fills it. One partner, working the way AI-native teams actually work — fast, measured, and owned by you.",
    services: [
      { num: "01", name: "AI software & internal tools", desc: "Custom systems and agents that take real work off your team." },
      { num: "02", name: "MVP design & build", desc: "From idea to a product in users' hands — weeks, not quarters." },
      { num: "03", name: "Organic visibility (SEO)", desc: "AI-native search: built to be found by people and by models." },
      { num: "04", name: "Digital presence & funnels", desc: "Sites, funnels and conversion structure that turn traffic into pipeline." },
      { num: "05", name: "AI transformation & consulting", desc: "Audit, roadmap and enablement — so the change actually sticks." },
    ],
    studioLinkLabel: "Explore Studio",
    studioLinkHref: "#work",
    labTag: "Hiiive Lab — products",
    labTitle: "We build our own software too.",
    labLead: "Lab is where recurring problems become products. It is also the proof: we ship and maintain real software, not decks about it.",
    products: [
      { name: "SPOKY", desc: "First Lab product — validating with real users", status: "In validation" },
      { name: "KOMPLYO", desc: "Compliance workflows, automated", status: "In build" },
    ],
    labLinkLabel: "See the Lab",
    labLinkHref: "#work",
  },
  render: (p) => (
    <section id="approach" className={styles.pillars}>
      <div className={styles.inner}>
        <Reveal className={styles.pillarsHead}>
          <div className={styles.pillarsHeadL}>
            <span className={styles.kickerLabel}>{p.kicker}</span>
            <h2 className={styles.sectionTitle}>{p.title}</h2>
          </div>
          <p className={styles.pillarsNote}>{p.note}</p>
        </Reveal>
        <Stagger className={styles.pillarRow}>
          <StaggerItem className={styles.studioCard}>
            <div className={styles.kicker}>
              <span className={styles.kickerBar} />
              <span className={styles.cardTag}>{p.studioTag}</span>
            </div>
            <h3 className={styles.cardTitle}>{p.studioTitle}</h3>
            <p className={styles.cardLead}>{p.studioLead}</p>
            <div className={styles.serviceList}>
              {(p.services || []).map((s, i) => (
                <div key={i} className={styles.serviceItem}>
                  <span className={styles.serviceNum}>{s.num}</span>
                  <div className={styles.serviceBody}>
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.serviceDesc}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href={p.studioLinkHref || "#work"} className={styles.arrowLink}>{p.studioLinkLabel} <ArrowRight /></a>
          </StaggerItem>
          <StaggerItem className={styles.labCard}>
            <div className={styles.labTop}>
              <div className={styles.kicker}>
                <span className={styles.kickerBar} />
                <span className={styles.cardTag}>{p.labTag}</span>
              </div>
              <h3 className={styles.cardTitle}>{p.labTitle}</h3>
              <p className={styles.cardLead}>{p.labLead}</p>
              <div className={styles.productList}>
                {(p.products || []).map((pr, i) => (
                  <div key={i} className={styles.productItem}>
                    <div className={styles.productBody}>
                      <span className={styles.productName}>{pr.name}</span>
                      <span className={styles.productDesc}>{pr.desc}</span>
                    </div>
                    <span className={styles.pill}>{pr.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <a href={p.labLinkHref || "#work"} className={`${styles.arrowLink} ${styles.labLink}`}>{p.labLinkLabel} <ArrowRight /></a>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 5. Process                                                         */
/* ================================================================== */
export const HomeProcessBlock = {
  label: "Home · Flywheel",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    subtitle: { type: "textarea" },
    steps: {
      type: "array",
      getItemSummary: (item) => item.title || "Step",
      arrayFields: {
        num: { type: "text" },
        title: { type: "text" },
        desc: { type: "textarea" },
      },
      defaultItemProps: { num: "01", title: "Step", desc: "Description" },
    },
  },
  defaultProps: {
    kicker: "Our flywheel",
    title: "We learn on our own products. You get what works.",
    subtitle:
      "Every playbook the Studio brings into your company was tested on our own products first — our money, our risk, our scars. By the time it reaches you, it isn't theory anymore.",
    steps: [
      { num: "01", title: "Lab", desc: "We build our own products — Spoky, Komplyo. Our money, our risk." },
      { num: "02", title: "Lessons", desc: "Running them live leaves playbooks and scars. Only what survives gets kept." },
      { num: "03", title: "Studio", desc: "Forward-deployed engineers bring that tested knowledge into your company." },
      { num: "04", title: "Feedback", desc: "Real-world results flow back and sharpen the next round of products." },
    ],
  },
  render: ({ kicker, title, subtitle, steps }) => (
    <Flywheel kicker={kicker} title={title} subtitle={subtitle} steps={steps || []} />
  ),
};

/* ================================================================== */
/* 6. Selected work                                                   */
/* ================================================================== */
export const HomeWorkBlock = {
  label: "Home · Work",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    linkLabel: { type: "text" },
    linkHref: { type: "text" },
    cases: {
      type: "array",
      getItemSummary: (item) => item.category || "Case",
      arrayFields: {
        category: { type: "text" },
        discipline: { type: "text" },
        stat: { type: "text" },
        line: { type: "textarea" },
        image: { type: "text" },
      },
      defaultItemProps: { category: "Category", discipline: "Discipline", stat: "0", line: "Result", image: "" },
    },
  },
  defaultProps: {
    kicker: "Selected work",
    title: "What it looks like in practice.",
    linkLabel: "All case studies",
    linkHref: "#work",
    cases: [
      { category: "Logistics operator", discipline: "AI software", stat: "−64%", line: "manual ticket handling after an internal agent took over triage.", image: "https://images.unsplash.com/photo-1653347094887-e1d2edbfad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
      { category: "B2B SaaS", discipline: "MVP build", stat: "7 wks", line: "from first workshop to a paid pilot in customers' hands.", image: "https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
      { category: "Regional retailer", discipline: "Visibility", stat: "3.2×", line: "organic sessions in five months with AI-native SEO.", image: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
    ],
  },
  render: ({ kicker, title, linkLabel, linkHref, cases }) => (
    <section id="work" className={styles.work}>
      <div className={styles.inner}>
        <Reveal className={styles.workHead}>
          <div className={styles.workHeadL}>
            <span className={styles.kickerLabel}>{kicker}</span>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>
          <a href={linkHref || "#work"} className={styles.arrowLink}>{linkLabel} <ArrowRight /></a>
        </Reveal>
        <Stagger className={styles.caseRow}>
          {(cases || []).map((c, i) => (
            <StaggerItem as="article" key={i} className={styles.caseCard}>
              {c.image ? <img className={styles.caseImage} src={c.image} alt="" loading="lazy" /> : <div className={styles.caseImage} />}
              <div className={styles.caseBody}>
                <div className={styles.caseTags}>
                  <span className={styles.caseCategory}>{c.category}</span>
                  <span className={styles.caseDot}>·</span>
                  <span className={styles.caseDiscipline}>{c.discipline}</span>
                </div>
                <span className={styles.caseStat}>{c.stat}</span>
                <span className={styles.caseLine}>{c.line}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 7. CTA band                                                        */
/* ================================================================== */
export const HomeCtaBlock = {
  label: "Home · CTA Band",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    subtitle: { type: "textarea" },
    buttonLabel: { type: "text" },
    buttonHref: { type: "text" },
    altText: { type: "text" },
  },
  defaultProps: {
    kicker: "Next step",
    title: "Let's look at the work\nyou shouldn't be doing.",
    subtitle: "A 30-minute call. We map one workflow, tell you if AI is the answer, and what it would take. No deck.",
    buttonLabel: "Book a call",
    buttonHref: "https://calendly.com/hiiive/get-to-know",
    altText: "or email hello@hiiive.ai",
  },
  render: ({ kicker, title, subtitle, buttonLabel, buttonHref, altText }) => (
    <section id="contact" className={styles.ctaBand}>
      <div className={`${styles.inner} ${styles.ctaInner}`}>
        <Reveal className={styles.ctaL}>
          <span className={styles.ctaKicker}>{kicker}</span>
          <h2 className={styles.ctaTitle}>
            {(title || "").split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
            ))}
          </h2>
          <p className={styles.ctaSub}>{subtitle}</p>
        </Reveal>
        <Reveal className={styles.ctaR} delay={0.12}>
          <a href={buttonHref || "https://calendly.com/hiiive/get-to-know"} className={styles.ctaBtn}>{buttonLabel} <ArrowRight /></a>
          <span className={styles.ctaAlt}>{altText}</span>
        </Reveal>
      </div>
    </section>
  ),
};

export const homeBlocks = {
  HomeHeroBlock,
  HomeClientsBlock,
  HomeStatsBlock,
  HomePillarsBlock,
  HomeProcessBlock,
  HomeWorkBlock,
  HomeCtaBlock,
};
