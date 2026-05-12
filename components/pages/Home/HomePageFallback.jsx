import styles from "./HomePageFallback.module.css";

const modelCards = [
  {
    index: "01 / Venture Studio",
    title: "In-house Products",
    body:
      "We identify systemic inefficiencies in global markets and deploy proprietary AI agents to solve them. Our internal lab functions as an elite R&D center, engineering the foundations of the next intelligence layer from the ground up.",
    points: ["Proprietary AI R&D", "Venture incubation", "Product development"],
  },
  {
    index: "02 / Enterprise Advisory",
    title: "AI Native Services",
    body:
      "We architect bespoke neural networks and integrate autonomous workflow systems into operating conglomerates. We ensure legacy systems can compete in an AI-first economy by transforming them into intelligence-driven organizations.",
    points: ["Neural architecture design", "System integration", "Enterprise transformation"],
  },
];

const metrics = [
  { value: "12+", label: "Ventures built" },
  { value: "45M+", label: "Capital raised" },
  { value: "80+", label: "AI models deployed" },
  { value: "15", label: "Enterprise partners" },
];

const portfolioItems = [
  {
    category: "Network",
    title: "NeuralFlow",
    body: "Distributed compute infrastructure for decentralized LLM training.",
    icon: (
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
  },
  {
    category: "Cognitive",
    title: "Cognitive Systems",
    body: "Autonomous decision engines for algorithmic global logistics.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5a7 7 0 0 0-7 7c0 2.7 1.5 4.3 2.7 5.5.9.9 1.3 1.5 1.3 2.5v1h6v-1c0-1 .4-1.6 1.3-2.5 1.2-1.2 2.7-2.8 2.7-5.5a7 7 0 0 0-7-7Z" />
        <path d="M10 20.5h4M11 8.5h2v4h-2zM8.2 10.5H10M14 10.5h1.8" />
      </svg>
    ),
  },
  {
    category: "Finance",
    title: "Aether Markets",
    body: "AI-driven liquidity protocols for synthetic asset trading.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19.5h16M6.5 16V11M10.5 16V8M14.5 16v-3M18.5 16V6" />
        <path d="m6 9.5 3.7-3.1 3.1 2.2 5.2-4.6" />
      </svg>
    ),
  },
  {
    category: "Security",
    title: "Sentinel AI",
    body: "Real-time threat detection for sovereign digital borders.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 18.5 6v5.7c0 4.3-2.8 7-6.5 8.8-3.7-1.8-6.5-4.5-6.5-8.8V6z" />
      </svg>
    ),
  },
  {
    category: "Bio",
    title: "Helix Lab",
    body: "Generative protein folding models for accelerated drug discovery.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4.5c2.2 0 2.8 2.5 4 3.7 1.2 1.2 1.8 3.1 1.8 3.8 0 .7-.6 2.6-1.8 3.8-1.2 1.2-1.8 3.7-4 3.7" />
        <path d="M16 4.5c-2.2 0-2.8 2.5-4 3.7-1.2 1.2-1.8 3.1-1.8 3.8 0 .7.6 2.6 1.8 3.8 1.2 1.2 1.8 3.7 4 3.7" />
        <path d="M8.7 7.2h6.6M8.7 16.8h6.6M9.5 12h5" />
      </svg>
    ),
  },
  {
    category: "Energy",
    title: "Grid Logic",
    body: "Smart grid orchestration using predictive AI for renewable balancing.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.2 3.5 6.8 12h4l-1 8.5 7.4-10h-4.1l1.1-7Z" />
      </svg>
    ),
  },
];

const faqItems = [
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
];

export default function HomePageFallback() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroTitle}>HIIIVE</p>
          <p className={styles.heroSubtitle}>AI-first company builder · Berlin native incubator</p>
          <div className={styles.heroActions}>
            <a href="#contact" className={styles.primaryButton}>
              Build With Us
            </a>
            <a href="#mission" className={styles.secondaryButton}>
              Our Vision
            </a>
          </div>
        </div>
      </section>

      <section id="mission" className={styles.about}>
        <div className={styles.sectionInner}>
          <div className={styles.aboutLabel}>
            <span>Origin // Berlin</span>
          </div>
          <div className={styles.aboutGrid}>
            <h2 className={styles.aboutHeading}>We engineer the future of intelligence.</h2>
            <div className={styles.aboutCopy}>
              <p>
                HIIIVE is a Berlin-native incubator focused exclusively on AI-first companies. We do not just provide capital; we provide the neural architecture, the elite engineering talent, and the strategic foresight required to dominate the next industrial revolution.
              </p>
              <p>
                Born in the tech heart of Europe, we bridge the gap between academic breakthrough and market-ready infrastructure. Our mission is to accelerate the transition to an autonomous economy by building companies that think.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="model" className={styles.modelSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.darkTitle}>Our model</h2>
            <span className={styles.sectionMeta}>End-to-end execution</span>
          </div>
          <div className={styles.modelGrid}>
            {modelCards.map((card) => (
              <article key={card.title} className={styles.modelCard}>
                <p className={styles.cardIndex}>{card.index}</p>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBody}>{card.body}</p>
                <ul className={styles.cardList}>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.metricsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.metricsGrid}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricItem}>
                <p className={styles.metricValue}>{metric.value}</p>
                <p className={styles.metricLabel}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className={styles.portfolioSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.lightTitle}>Portfolio</h2>
            <span className={styles.sectionMetaLight}>Selected ventures // 2024</span>
          </div>
          <div className={styles.portfolioGrid}>
            {portfolioItems.map((item) => (
              <article key={item.title} className={styles.portfolioItem}>
                <div className={styles.portfolioTop}>
                  <span className={styles.portfolioIcon}>{item.icon}</span>
                  <p className={styles.portfolioCategory}>{item.category}</p>
                </div>
                <h3 className={styles.portfolioTitle}>{item.title}</h3>
                <p className={styles.portfolioBody}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.sectionInner}>
          <div className={styles.contactGrid}>
            <div className={styles.contactIntro}>
              <h2 className={styles.contactTitle}>Build the intelligence layer of your enterprise.</h2>
              <p className={styles.contactBody}>
                We partner with visionary leaders to architect and deploy custom AI solutions. Our process is rapid, deep-tech focused, and results-oriented.
              </p>
              <ul className={styles.contactList}>
                <li>
                  <strong>Rapid prototyping</strong>
                  <span>From concept to MVP in under 8 weeks.</span>
                </li>
                <li>
                  <strong>Production-ready</strong>
                  <span>Scalable neural infrastructure built for scale.</span>
                </li>
              </ul>
            </div>
            <form className={styles.contactForm}>
              <label className={styles.field}>
                <span>Full Name</span>
                <input type="text" placeholder="Type here..." />
              </label>
              <label className={styles.field}>
                <span>Company Email</span>
                <input type="email" placeholder="email@enterprise.com" />
              </label>
              <label className={styles.field}>
                <span>Project Vision</span>
                <textarea placeholder="Briefly describe your AI goals..." rows="5" />
              </label>
              <button type="button" className={styles.formButton}>
                Initiate Project
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.sectionInnerNarrow}>
          <div className={styles.faqHeader}>
            <h2 className={styles.lightTitle}>Inquiries</h2>
            <p className={styles.faqMeta}>Common questions // FAQ</p>
          </div>
          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details key={item.question} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <h2 className={styles.bottomCtaTitle}>Ready to scale intelligence?</h2>
          <p className={styles.bottomCtaBody}>
            We are looking for elite engineers and visionary partners to join our ecosystem in Berlin.
          </p>
          <a href="#contact" className={styles.bottomCtaButton}>
            Build With Us
          </a>
        </div>
      </section>
    </div>
  );
}
