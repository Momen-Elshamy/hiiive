import styles from "./HomePageFallback.module.css";
import { Reveal, Stagger, StaggerItem } from "./motion";

/* ---------- inline icons ---------------------------------------------------- */
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

/* ---------- content --------------------------------------------------------- */
const clients = [
  { name: "NVIDIA Inception Program", image: "/logos/nvidia-inception.svg" },
  { name: "Telekom TechBoost", image: "/logos/techboost.jpg" },
  { name: "Berlin Partner", image: "/logos/berlin-partner.jpg" },
  { name: "KI", image: "/logos/ki.jpg" },
  { name: "Haas", image: "/logos/haas.png" },
  { name: "Mindverse", image: "/logos/mindverse.svg" },
  { name: "Wavelr", image: "/logos/wavelr.svg" },
  { name: "Wayra", image: "/logos/wayra.svg" },
];

const stats = [
  { label: "Internal tools shipped", value: "12+", desc: "In production and still running." },
  { label: "Industries served", value: "4", desc: "Logistics, retail, fintech, health." },
  { label: "Time to first release", value: "6 wks", desc: "Median across our MVP builds." },
  { label: "Products in Lab", value: "2", desc: "One already in private beta." },
];

const services = [
  { num: "01", name: "AI software & internal tools", desc: "Custom systems and agents that take real work off your team." },
  { num: "02", name: "MVP design & build", desc: "From idea to a product in users' hands — weeks, not quarters." },
  { num: "03", name: "Organic visibility (SEO)", desc: "AI-native search: built to be found by people and by models." },
  { num: "04", name: "Digital presence & funnels", desc: "Sites, funnels and conversion structure that turn traffic into pipeline." },
  { num: "05", name: "AI transformation & consulting", desc: "Audit, roadmap and enablement — so the change actually sticks." },
];

const products = [
  { name: "SPOKY", desc: "First Lab product — validating with real users", status: "In validation" },
  { name: "KOMPLYO", desc: "Compliance workflows, automated", status: "In build" },
];

const steps = [
  { num: "01", title: "Map", desc: "Two weeks inside your workflow. We find where hours, leads and revenue leak — and what AI can actually fix." },
  { num: "02", title: "Prototype", desc: "A working thin slice in front of real users within weeks. Decisions get made on software, not slides." },
  { num: "03", title: "Ship", desc: "Production build, wired into your stack and measured against one number you agreed up front." },
  { num: "04", title: "Hand over", desc: "Docs, training and a roadmap your team can run. We stay if you want us, not because you are stuck." },
];

const cases = [
  {
    category: "Logistics operator", discipline: "AI software", stat: "−64%",
    line: "manual ticket handling after an internal agent took over triage.",
    image: "https://images.unsplash.com/photo-1653347094887-e1d2edbfad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    category: "B2B SaaS", discipline: "MVP build", stat: "7 wks",
    line: "from first workshop to a paid pilot in customers' hands.",
    image: "https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    category: "Regional retailer", discipline: "Visibility", stat: "3.2×",
    line: "organic sessions in five months with AI-native SEO.",
    image: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const heroImage =
  "https://images.unsplash.com/photo-1735942059430-731ee39914b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600";

export default function HomePageFallback() {
  return (
    <div className={styles.page}>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className={`${styles.inner} ${styles.heroInner}`}>
          <div className={styles.heroTop}>
            <div className={`${styles.headlineCol} ${styles.heroReveal1}`}>
              <div className={styles.kicker}>
                <span className={styles.kickerDot} />
                <span className={styles.kickerLabel}>AI-native company builder</span>
              </div>
              <h1 className={styles.heroHeadline}>
                The AI software<br />
                your business<br />
                should already run on.
              </h1>
            </div>
            <div className={`${styles.heroRight} ${styles.heroReveal2}`}>
              <p className={styles.heroSub}>
                Hiiive Studio is the tech partner for teams going AI-native — software, MVPs,
                visibility and funnels. Hiiive Lab turns what we learn into products of our own.
              </p>
              <div className={styles.heroCtaRow}>
                <a href="#contact" className={styles.btnPrimary}>
                  Book a call <ArrowRight />
                </a>
                <a href="/work" className={styles.btnSecondary}>See what we build</a>
              </div>
              <p className={styles.heroMeta}>First working version in weeks — not quarters.</p>
            </div>
          </div>
          <img className={`${styles.heroImage} ${styles.heroReveal3}`} src={heroImage} alt="" loading="lazy" />
        </div>
      </section>

      {/* 2. Clients */}
      <section className={styles.clients}>
        <div className={styles.inner}>
          <Reveal className={styles.clientsHead}>
            <div className={styles.kicker}>
              <span className={styles.kickerBar} />
              <span className={styles.kickerLabel}>
                Trusted by clients, partners and programs
              </span>
            </div>
          </Reveal>
          <div className={styles.rule} />
          <Stagger className={styles.logos}>
            {clients.map((c) => (
              <StaggerItem as="span" key={c.name} className={styles.logo}>
                {c.image ? (
                  <img className={styles.logoImg} src={c.image} alt={c.name} loading="lazy" />
                ) : (
                  c.name
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 3. Stats strip */}
      <section className={styles.stats}>
        <div className={styles.inner}>
          <Reveal className={styles.statsHead}>
            <div className={styles.kicker}>
              <span className={styles.kickerBar} />
              <span className={styles.kickerLabel}>By the numbers</span>
            </div>
            <span className={styles.statsNote}>Measured across client engagements · updated Jan 2026</span>
          </Reveal>
          <div className={`${styles.rule} ${styles.ruleInk}`} />
          <Stagger className={styles.statsRow}>
            {stats.map((s) => (
              <StaggerItem key={s.label} className={styles.stat}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statDesc}>{s.desc}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 4. Pillars */}
      <section id="approach" className={styles.pillars}>
        <div className={styles.inner}>
          <Reveal className={styles.pillarsHead}>
            <div className={styles.pillarsHeadL}>
              <span className={styles.kickerLabel}>What HIIIVE is</span>
              <h2 className={styles.sectionTitle}>One company, two halves.</h2>
            </div>
            <p className={styles.pillarsNote}>
              Studio pays attention to your workflow. Lab pays attention to the patterns underneath
              it. Each one makes the other sharper.
            </p>
          </Reveal>
          <Stagger className={styles.pillarRow}>
            {/* Studio */}
            <StaggerItem className={styles.studioCard}>
              <div className={styles.kicker}>
                <span className={styles.kickerBar} />
                <span className={styles.cardTag}>Hiiive Studio — services</span>
              </div>
              <h3 className={styles.cardTitle}>Tech services, built the AI-native way.</h3>
              <p className={styles.cardLead}>
                From the software your team runs on to the funnel that fills it. One partner, working
                the way AI-native teams actually work — fast, measured, and owned by you.
              </p>
              <div className={styles.serviceList}>
                {services.map((s) => (
                  <div key={s.num} className={styles.serviceItem}>
                    <span className={styles.serviceNum}>{s.num}</span>
                    <div className={styles.serviceBody}>
                      <span className={styles.serviceName}>{s.name}</span>
                      <span className={styles.serviceDesc}>{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#work" className={styles.arrowLink}>Explore Studio <ArrowRight /></a>
            </StaggerItem>
            {/* Lab */}
            <StaggerItem className={styles.labCard}>
              <div className={styles.labTop}>
                <div className={styles.kicker}>
                  <span className={styles.kickerBar} />
                  <span className={styles.cardTag}>Hiiive Lab — products</span>
                </div>
                <h3 className={styles.cardTitle}>We build our own software too.</h3>
                <p className={styles.cardLead}>
                  Lab is where recurring problems become products. It is also the proof: we ship and
                  maintain real software, not decks about it.
                </p>
                <div className={styles.productList}>
                  {products.map((p) => (
                    <div key={p.name} className={styles.productItem}>
                      <div className={styles.productBody}>
                        <span className={styles.productName}>{p.name}</span>
                        <span className={styles.productDesc}>{p.desc}</span>
                      </div>
                      <span className={styles.pill}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="#work" className={`${styles.arrowLink} ${styles.labLink}`}>See the Lab <ArrowRight /></a>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* 5. Process */}
      <section className={styles.process}>
        <div className={styles.inner}>
          <Reveal className={styles.processHead}>
            <div className={styles.processHeadL}>
              <span className={styles.kickerLabel}>How we work</span>
              <h2 className={styles.sectionTitle}>Short loops. Real software. No theatre.</h2>
            </div>
            <p className={styles.processNote}>
              Every engagement runs the same four beats, whether it is an MVP, a rebuild of your
              funnel, or an AI transformation.
            </p>
          </Reveal>
          <Stagger className={styles.steps}>
            {steps.map((s, i) => (
              <StaggerItem key={s.num} className={styles.step}>
                <div className={`${styles.stepRule} ${i === 0 ? styles.stepRuleActive : ""}`} />
                <div className={styles.stepTop}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepDesc}>{s.desc}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 6. Selected work */}
      <section id="work" className={styles.work}>
        <div className={styles.inner}>
          <Reveal className={styles.workHead}>
            <div className={styles.workHeadL}>
              <span className={styles.kickerLabel}>Selected work</span>
              <h2 className={styles.sectionTitle}>What it looks like in practice.</h2>
            </div>
            <a href="#work" className={styles.arrowLink}>All case studies <ArrowRight /></a>
          </Reveal>
          <Stagger className={styles.caseRow}>
            {cases.map((c) => (
              <StaggerItem as="article" key={c.category} className={styles.caseCard}>
                <img className={styles.caseImage} src={c.image} alt="" loading="lazy" />
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

      {/* 7. CTA band */}
      <section id="contact" className={styles.ctaBand}>
        <div className={`${styles.inner} ${styles.ctaInner}`}>
          <Reveal className={styles.ctaL}>
            <span className={styles.ctaKicker}>Next step</span>
            <h2 className={styles.ctaTitle}>
              Let's look at the work<br />you shouldn't be doing.
            </h2>
            <p className={styles.ctaSub}>
              A 30-minute call. We map one workflow, tell you if AI is the answer, and what it would
              take. No deck.
            </p>
          </Reveal>
          <Reveal className={styles.ctaR} delay={0.12}>
            <a href="https://calendly.com/hiiive/get-to-know" className={styles.ctaBtn}>Book a call <ArrowRight /></a>
            <span className={styles.ctaAlt}>or email hello@hiiive.ai</span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
