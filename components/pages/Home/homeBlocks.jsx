// Server-safe Puck blocks converted from the static HomePageFallback design.
// No "use client" here — every section is static markup, so Puck's RSC <Render>
// can call these render() functions on the server. They reuse the original
// HomePageFallback.module.css so the rendered output is pixel-identical.
import styles from "./HomePageFallback.module.css";

/* ------------------------------------------------------------------ */
/* Shared icon set for the Portfolio block                             */
/* ------------------------------------------------------------------ */
const portfolioIcons = {
  network: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="4.5" r="1.7" />
      <circle cx="19" cy="8.3" r="1.7" />
      <circle cx="19" cy="15.7" r="1.7" />
      <circle cx="12" cy="19.5" r="1.7" />
      <circle cx="5" cy="15.7" r="1.7" />
      <circle cx="5" cy="8.3" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <path d="M12 6.2v4.1M13.5 13l4.1 2.1M10.5 13l-4.1 2.1M10.5 11L6.4 8.9M13.5 11l4.1-2.1M12 13.7v4.1" />
    </svg>
  ),
  cognitive: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5a7 7 0 0 0-7 7c0 2.7 1.5 4.3 2.7 5.5.9.9 1.3 1.5 1.3 2.5v1h6v-1c0-1 .4-1.6 1.3-2.5 1.2-1.2 2.7-2.8 2.7-5.5a7 7 0 0 0-7-7Z" />
      <path d="M10 20.5h4M11 8.5h2v4h-2zM8.2 10.5H10M14 10.5h1.8" />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19.5h16M6.5 16V11M10.5 16V8M14.5 16v-3M18.5 16V6" />
      <path d="m6 9.5 3.7-3.1 3.1 2.2 5.2-4.6" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 18.5 6v5.7c0 4.3-2.8 7-6.5 8.8-3.7-1.8-6.5-4.5-6.5-8.8V6z" />
    </svg>
  ),
  bio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4.5c2.2 0 2.8 2.5 4 3.7 1.2 1.2 1.8 3.1 1.8 3.8 0 .7-.6 2.6-1.8 3.8-1.2 1.2-1.8 3.7-4 3.7" />
      <path d="M16 4.5c-2.2 0-2.8 2.5-4 3.7-1.2 1.2-1.8 3.1-1.8 3.8 0 .7.6 2.6 1.8 3.8 1.2 1.2 1.8 3.7 4 3.7" />
      <path d="M8.7 7.2h6.6M8.7 16.8h6.6M9.5 12h5" />
    </svg>
  ),
  energy: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.2 3.5 6.8 12h4l-1 8.5 7.4-10h-4.1l1.1-7Z" />
    </svg>
  ),
};
const iconOptions = Object.keys(portfolioIcons).map((k) => ({ label: k, value: k }));

/* ================================================================== */
/* 1. Hero                                                             */
/* ================================================================== */
export const HomeHeroBlock = {
  label: "Home · Hero",
  fields: {
    title: { type: "text" },
    subtitle: { type: "text" },
    primaryLabel: { type: "text" },
    primaryHref: { type: "text" },
    secondaryLabel: { type: "text" },
    secondaryHref: { type: "text" },
  },
  defaultProps: {
    title: "HIIIVE",
    subtitle: "AI-first company builder · Berlin native incubator",
    primaryLabel: "Build With Us",
    primaryHref: "#contact",
    secondaryLabel: "Our Vision",
    secondaryHref: "#mission",
  },
  render: ({ title, subtitle, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) => (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.heroTitle}>{title}</p>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        <div className={styles.heroActions}>
          <a href={primaryHref || "#contact"} className={styles.primaryButton}>
            {primaryLabel}
          </a>
          <a href={secondaryHref || "#mission"} className={styles.secondaryButton}>
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 2. About / Mission                                                 */
/* ================================================================== */
export const HomeAboutBlock = {
  label: "Home · About",
  fields: {
    label: { type: "text" },
    headingLine1: { type: "text" },
    headingLine2: { type: "text" },
    headingLine3: { type: "text" },
    paragraph1: { type: "textarea" },
    paragraph2: { type: "textarea" },
  },
  defaultProps: {
    label: "Origin // Berlin",
    headingLine1: "We engineer the",
    headingLine2: "future of",
    headingLine3: "intelligence.",
    paragraph1:
      "HIIIVE is a Berlin-native incubator focused exclusively on AI-first companies. We do not just provide capital; we provide the neural architecture, the elite engineering talent, and the strategic foresight required to dominate the next industrial revolution.",
    paragraph2:
      "Born in the tech heart of Europe, we bridge the gap between academic breakthrough and market-ready infrastructure. Our mission is to accelerate the transition to an autonomous economy by building companies that think.",
  },
  render: ({ label, headingLine1, headingLine2, headingLine3, paragraph1, paragraph2 }) => (
    <section id="mission" className={styles.about}>
      <div className={styles.sectionInner}>
        <div className={styles.aboutLabel}>
          <span>{label}</span>
        </div>
        <div className={styles.aboutGrid}>
          <h2 className={styles.aboutHeading}>
            {headingLine1 ? <span>{headingLine1}</span> : null}
            {headingLine2 ? <span>{headingLine2}</span> : null}
            {headingLine3 ? <span>{headingLine3}</span> : null}
          </h2>
          <div className={styles.aboutCopy}>
            {paragraph1 ? <p>{paragraph1}</p> : null}
            {paragraph2 ? <p>{paragraph2}</p> : null}
          </div>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 3. Model                                                           */
/* ================================================================== */
export const HomeModelBlock = {
  label: "Home · Model",
  fields: {
    title: { type: "text" },
    meta: { type: "text" },
    cards: {
      type: "array",
      getItemSummary: (item) => item.title || "Card",
      arrayFields: {
        index: { type: "text" },
        title: { type: "text" },
        body: { type: "textarea" },
        points: {
          type: "array",
          getItemSummary: (item) => item.text || "Point",
          arrayFields: { text: { type: "text" } },
          defaultItemProps: { text: "Point" },
        },
      },
      defaultItemProps: {
        index: "00 / Section",
        title: "Title",
        body: "Body",
        points: [{ text: "Point" }],
      },
    },
  },
  defaultProps: {
    title: "Our model",
    meta: "End-to-end execution",
    cards: [
      {
        index: "01 / Venture Studio",
        title: "In-house Products",
        body:
          "We identify systemic inefficiencies in global markets and deploy proprietary AI agents to solve them. Our internal lab functions as an elite R&D center, engineering the foundations of the next intelligence layer from the ground up.",
        points: [
          { text: "Proprietary AI R&D" },
          { text: "Venture incubation" },
          { text: "Product development" },
        ],
      },
      {
        index: "02 / Enterprise Advisory",
        title: "AI Native Services",
        body:
          "We architect bespoke neural networks and integrate autonomous workflow systems into operating conglomerates. We ensure legacy systems can compete in an AI-first economy by transforming them into intelligence-driven organizations.",
        points: [
          { text: "Neural architecture design" },
          { text: "System integration" },
          { text: "Enterprise transformation" },
        ],
      },
    ],
  },
  render: ({ title, meta, cards }) => (
    <section id="model" className={styles.modelSection}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.darkTitle}>{title}</h2>
          <span className={styles.sectionMeta}>{meta}</span>
        </div>
        <div className={styles.modelGrid}>
          {(cards || []).map((card, i) => (
            <article key={i} className={styles.modelCard}>
              <p className={styles.cardIndex}>{card.index}</p>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
              <ul className={styles.cardList}>
                {(card.points || []).map((point, j) => (
                  <li key={j}>{point.text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 4. Metrics                                                         */
/* ================================================================== */
export const HomeMetricsBlock = {
  label: "Home · Metrics",
  fields: {
    metrics: {
      type: "array",
      getItemSummary: (item) => item.label || "Metric",
      arrayFields: {
        value: { type: "text" },
        label: { type: "text" },
      },
      defaultItemProps: { value: "0", label: "Metric" },
    },
  },
  defaultProps: {
    metrics: [
      { value: "12+", label: "Ventures built" },
      { value: "45M+", label: "Capital raised" },
      { value: "80+", label: "AI models deployed" },
      { value: "15", label: "Enterprise partners" },
    ],
  },
  render: ({ metrics }) => (
    <section className={styles.metricsSection}>
      <div className={styles.sectionInner}>
        <div className={styles.metricsGrid}>
          {(metrics || []).map((metric, i) => (
            <div key={i} className={styles.metricItem}>
              <p className={styles.metricValue}>{metric.value}</p>
              <p className={styles.metricLabel}>{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 5. Portfolio                                                       */
/* ================================================================== */
export const HomePortfolioBlock = {
  label: "Home · Portfolio",
  fields: {
    title: { type: "text" },
    meta: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (item) => item.title || "Venture",
      arrayFields: {
        icon: { type: "select", options: iconOptions },
        category: { type: "text" },
        title: { type: "text" },
        body: { type: "textarea" },
      },
      defaultItemProps: { icon: "network", category: "Category", title: "Venture", body: "Body" },
    },
  },
  defaultProps: {
    title: "Portfolio",
    meta: "Selected ventures // 2024",
    items: [
      { icon: "network", category: "Network", title: "NeuralFlow", body: "Distributed compute infrastructure for decentralized LLM training." },
      { icon: "cognitive", category: "Cognitive", title: "Cognitive Systems", body: "Autonomous decision engines for algorithmic global logistics." },
      { icon: "finance", category: "Finance", title: "Aether Markets", body: "AI-driven liquidity protocols for synthetic asset trading." },
      { icon: "security", category: "Security", title: "Sentinel AI", body: "Real-time threat detection for sovereign digital borders." },
      { icon: "bio", category: "Bio", title: "Helix Lab", body: "Generative protein folding models for accelerated drug discovery." },
      { icon: "energy", category: "Energy", title: "Grid Logic", body: "Smart grid orchestration using predictive AI for renewable balancing." },
    ],
  },
  render: ({ title, meta, items }) => (
    <section id="portfolio" className={styles.portfolioSection}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.lightTitle}>{title}</h2>
          <span className={styles.sectionMetaLight}>{meta}</span>
        </div>
        <div className={styles.portfolioGrid}>
          {(items || []).map((item, i) => (
            <article key={i} className={styles.portfolioItem}>
              <div className={styles.portfolioTop}>
                <span className={styles.portfolioIcon}>{portfolioIcons[item.icon] || portfolioIcons.network}</span>
                <p className={styles.portfolioCategory}>{item.category}</p>
              </div>
              <h3 className={styles.portfolioTitle}>{item.title}</h3>
              <p className={styles.portfolioBody}>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 6. Contact                                                         */
/* ================================================================== */
export const HomeContactBlock = {
  label: "Home · Contact",
  fields: {
    title: { type: "text" },
    body: { type: "textarea" },
    list: {
      type: "array",
      getItemSummary: (item) => item.strong || "Item",
      arrayFields: {
        strong: { type: "text" },
        span: { type: "text" },
      },
      defaultItemProps: { strong: "Title", span: "Description" },
    },
    nameLabel: { type: "text" },
    namePlaceholder: { type: "text" },
    emailLabel: { type: "text" },
    emailPlaceholder: { type: "text" },
    visionLabel: { type: "text" },
    visionPlaceholder: { type: "text" },
    buttonLabel: { type: "text" },
  },
  defaultProps: {
    title: "Build the intelligence layer of your enterprise.",
    body:
      "We partner with visionary leaders to architect and deploy custom AI solutions. Our process is rapid, deep-tech focused, and results-oriented.",
    list: [
      { strong: "Rapid prototyping", span: "From concept to MVP in under 8 weeks." },
      { strong: "Production-ready", span: "Scalable neural infrastructure built for scale." },
    ],
    nameLabel: "Full Name",
    namePlaceholder: "Type here...",
    emailLabel: "Company Email",
    emailPlaceholder: "email@enterprise.com",
    visionLabel: "Project Vision",
    visionPlaceholder: "Briefly describe your AI goals...",
    buttonLabel: "Initiate Project",
  },
  render: ({ title, body, list, nameLabel, namePlaceholder, emailLabel, emailPlaceholder, visionLabel, visionPlaceholder, buttonLabel }) => (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.sectionInner}>
        <div className={styles.contactGrid}>
          <div className={styles.contactIntro}>
            <h2 className={styles.contactTitle}>{title}</h2>
            <p className={styles.contactBody}>{body}</p>
            <ul className={styles.contactList}>
              {(list || []).map((item, i) => (
                <li key={i}>
                  <strong>{item.strong}</strong>
                  <span>{item.span}</span>
                </li>
              ))}
            </ul>
          </div>
          <form className={styles.contactForm}>
            <label className={styles.field}>
              <span>{nameLabel}</span>
              <input type="text" placeholder={namePlaceholder} />
            </label>
            <label className={styles.field}>
              <span>{emailLabel}</span>
              <input type="email" placeholder={emailPlaceholder} />
            </label>
            <label className={styles.field}>
              <span>{visionLabel}</span>
              <textarea placeholder={visionPlaceholder} rows="5" />
            </label>
            <button type="button" className={styles.formButton}>
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 7. FAQ                                                             */
/* ================================================================== */
export const HomeFaqBlock = {
  label: "Home · FAQ",
  fields: {
    title: { type: "text" },
    meta: { type: "text" },
    items: {
      type: "array",
      getItemSummary: (item) => item.question || "Question",
      arrayFields: {
        question: { type: "text" },
        answer: { type: "textarea" },
      },
      defaultItemProps: { question: "Question", answer: "Answer" },
    },
  },
  defaultProps: {
    title: "Inquiries",
    meta: "Common questions // FAQ",
    items: [
      {
        question: "What is HIIIVE’s incubation model?",
        answer:
          "We partner early, define a high-conviction problem, and build the technical, operational, and capital foundation required to launch AI-native companies.",
      },
      {
        question: "How do you select your enterprise partners?",
        answer:
          "We look for teams with deep operational access, a real deployment surface, and the willingness to rebuild workflows around intelligence rather than automation theater.",
      },
      {
        question: "Are you strictly Berlin-based?",
        answer:
          "Berlin is our operating base, but we work across markets when the opportunity and execution conditions are strong.",
      },
      {
        question: "How can engineers join HIIIVE?",
        answer:
          "We recruit builders who can operate across product, systems, and applied AI. The strongest candidates show ownership, range, and shipping discipline.",
      },
    ],
  },
  render: ({ title, meta, items }) => (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.sectionInnerNarrow}>
        <div className={styles.faqHeader}>
          <h2 className={styles.lightTitle}>{title}</h2>
          <p className={styles.faqMeta}>{meta}</p>
        </div>
        <div className={styles.faqList}>
          {(items || []).map((item, i) => (
            <details key={i} className={styles.faqItem}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  ),
};

/* ================================================================== */
/* 8. Bottom CTA                                                      */
/* ================================================================== */
export const HomeBottomCtaBlock = {
  label: "Home · Bottom CTA",
  fields: {
    title: { type: "text" },
    body: { type: "textarea" },
    buttonLabel: { type: "text" },
    buttonHref: { type: "text" },
  },
  defaultProps: {
    title: "Ready to scale intelligence?",
    body: "We are looking for elite engineers and visionary partners to join our ecosystem in Berlin.",
    buttonLabel: "Build With Us",
    buttonHref: "#contact",
  },
  render: ({ title, body, buttonLabel, buttonHref }) => (
    <section className={styles.bottomCta}>
      <div className={styles.bottomCtaInner}>
        <h2 className={styles.bottomCtaTitle}>{title}</h2>
        <p className={styles.bottomCtaBody}>{body}</p>
        <a href={buttonHref || "#contact"} className={styles.bottomCtaButton}>
          {buttonLabel}
        </a>
      </div>
    </section>
  ),
};

export const homeBlocks = {
  HomeHeroBlock,
  HomeAboutBlock,
  HomeModelBlock,
  HomeMetricsBlock,
  HomePortfolioBlock,
  HomeContactBlock,
  HomeFaqBlock,
  HomeBottomCtaBlock,
};
