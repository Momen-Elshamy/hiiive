"use client";

import section from "./HomeSection.module.css";
import styles from "./HomeOutputs.module.css";
import { useInView } from "./useInView";

/*
 * "What we ship": a bento of the factory's outputs (the five Studio services
 * and the Lab products), each card with a small live UI mock instead of an
 * image. Numbers are the ones on the live site.
 */

const content = {
  kicker: "03 · What we ship",
  title: "Agents, products and services. All built on AI.",
  intro: "Everything that leaves the factory runs in production, inside real companies.",
  agents: {
    kicker: "AI software & internal tools",
    title: "AI that takes real work off your team.",
    body: "Custom systems and agents, built on your real operations and running in production.",
    run: {
      name: "Agent · Request triage",
      state: "Running",
      steps: [
        { text: "Read 214 new requests", kind: "done" },
        { text: "Sorted them by intent and urgency", kind: "done" },
        { text: "Drafted 162 replies for review", kind: "done" },
        { text: "Checked every draft against your rules", kind: "done" },
        { text: "Handed 9 to your team", kind: "handoff" },
      ],
    },
    tools: { label: "Runs inside your tools", items: ["Email", "CRM", "ERP", "Docs", "Chat"] },
    stat: { value: "12+", label: "internal tools shipped, in production and still running" },
    link: { label: "AI software & internal tools", href: "/studio#ai-software" },
  },
  products: {
    kicker: "SaaS products · Lab",
    title: "What proves itself becomes a product.",
    items: [
      { name: "Content OS", desc: "Agentic content operations, in daily use", status: "In production", live: true },
      { name: "Spoky", desc: "Validating with real users", status: "In validation" },
      { name: "Komplyo", desc: "Compliance workflows, automated", status: "In build" },
    ],
  },
  mvp: {
    kicker: "MVP design & build",
    title: "From idea to users in weeks.",
    weeks: 6,
    release: "First release",
    stat: { value: "6 wks", label: "median to a first release" },
    link: { label: "MVP design & build", href: "/studio/mvp-build" },
  },
  seo: {
    kicker: "SEO & GEO",
    title: "Found by people and by models.",
    engines: ["Google", "ChatGPT", "Perplexity"],
    stat: { value: "3.4×", label: "organic sessions in 12 months · Mindverse" },
    link: { label: "Organic visibility", href: "/studio/organic-visibility" },
  },
  funnels: {
    kicker: "Digital presence & funnels",
    title: "Traffic that turns into pipeline.",
    body: "Sites, funnels and conversion structure, measured and improved every month.",
    stages: [
      { label: "Visits", width: 100 },
      { label: "Leads", width: 64 },
      { label: "Calls", width: 38 },
      { label: "Clients", width: 22 },
    ],
    link: { label: "Digital presence & funnels", href: "/studio/digital-presence" },
  },
  consulting: {
    kicker: "AI transformation & consulting",
    title: "Change that actually sticks.",
    body: "Audit, roadmap and enablement for teams that are adopting AI.",
    steps: [
      { label: "Audit", done: true },
      { label: "Roadmap", done: true },
      { label: "Enablement", done: false },
    ],
    link: { label: "AI transformation & consulting", href: "/studio#consulting" },
  },
};

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** A bento card: a link when it has one, with the dot grid and corner glow behind its content. */
function Card({ className, glow, link, children }) {
  const Tag = link ? "a" : "div";
  return (
    <Tag className={`${styles.card} ${className}`} style={{ "--glow": glow }} href={link?.href}>
      <span className={styles.dots} aria-hidden="true" />
      <span className={styles.glow} aria-hidden="true" />
      {children}
      {link ? (
        <span className={styles.link}>
          {link.label} <Arrow />
        </span>
      ) : null}
    </Tag>
  );
}

function CardHead({ kicker, title, body }) {
  return (
    <div className={styles.cardHead}>
      <span className={styles.cardKicker}>{kicker}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      {body ? <p className={styles.cardBody}>{body}</p> : null}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function HomeOutputs() {
  const ref = useInView({ threshold: 0.15 });
  const { agents, products, mvp, seo, funnels, consulting } = content;

  return (
    <section ref={ref} className={`${section.section} ${styles.outputs}`} aria-labelledby="home-outputs-title">
      <div className={section.inner}>
        <div className={section.head}>
          <div className={section.headCopy}>
            <div className={section.kicker}>
              <span className={section.kickerDot} />
              {content.kicker}
            </div>
            <h2 id="home-outputs-title" className={section.title}>{content.title}</h2>
            <p className={section.intro}>{content.intro}</p>
          </div>
        </div>

        <div className={styles.grid}>
          <Card className={styles.agents} glow="var(--hv-accent)" link={agents.link}>
            <CardHead kicker={agents.kicker} title={agents.title} body={agents.body} />
            <div className={styles.run} aria-hidden="true">
              <div className={styles.runHead}>
                <span className={styles.liveDot} />
                <span className={styles.runName}>{agents.run.name}</span>
                <span className={styles.runState}>{agents.run.state}</span>
              </div>
              <ol className={styles.runSteps}>
                {agents.run.steps.map((step, i) => (
                  <li key={step.text} className={styles.runStep} data-kind={step.kind} style={{ "--i": i }}>
                    <span className={styles.runIcon}>{step.kind === "done" ? <Check /> : <Arrow />}</span>
                    {step.text}
                  </li>
                ))}
              </ol>
              <span className={styles.runBar}>
                <span className={styles.runFill} />
              </span>
            </div>
            <div className={styles.tools} aria-hidden="true">
              <span className={styles.toolsLabel}>{agents.tools.label}</span>
              <div className={styles.toolChips}>
                {agents.tools.items.map((tool, i) => (
                  <span key={tool} className={styles.toolChip} style={{ "--i": i }}>{tool}</span>
                ))}
              </div>
            </div>
            <Stat {...agents.stat} />
          </Card>

          <Card className={styles.products} glow="var(--hv-aurora-teal)">
            <CardHead kicker={products.kicker} title={products.title} />
            <ul className={styles.productList}>
              {products.items.map((item, i) => (
                <li key={item.name} className={styles.product} style={{ "--i": i }}>
                  <span className={styles.productName}>{item.name}</span>
                  <span className={styles.productDesc}>{item.desc}</span>
                  <span className={`${styles.pill} ${item.live ? styles.pillLive : ""}`}>{item.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className={styles.mvp} glow="var(--hv-aurora-steel)" link={mvp.link}>
            <CardHead kicker={mvp.kicker} title={mvp.title} />
            <div className={styles.weeks} aria-hidden="true">
              <div className={styles.weekTicks}>
                {Array.from({ length: mvp.weeks }, (_, i) => (
                  <span key={i} className={styles.weekTick}>W{i + 1}</span>
                ))}
              </div>
              <span className={styles.weekTrack}>
                <span className={styles.weekFill} />
                <span className={styles.weekFlag}>{mvp.release}</span>
              </span>
            </div>
            <Stat {...mvp.stat} />
          </Card>

          <Card className={styles.seo} glow="var(--hv-aurora-blue)" link={seo.link}>
            <CardHead kicker={seo.kicker} title={seo.title} />
            <div className={styles.engines} aria-hidden="true">
              {seo.engines.map((engine, i) => (
                <span key={engine} className={styles.engine} style={{ "--i": i }}>
                  <span className={styles.engineDot} />
                  {engine}
                </span>
              ))}
            </div>
            <Stat {...seo.stat} />
          </Card>

          <Card className={styles.funnels} glow="var(--hv-aurora-teal)" link={funnels.link}>
            <CardHead kicker={funnels.kicker} title={funnels.title} body={funnels.body} />
            <div className={styles.funnel} aria-hidden="true">
              {funnels.stages.map((stage, i) => (
                <div key={stage.label} className={styles.stage} style={{ "--i": i, "--w": `${stage.width}%` }}>
                  <span className={styles.stageLabel}>{stage.label}</span>
                  <span className={styles.stageBar} />
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.consulting} glow="var(--hv-aurora-steel)" link={consulting.link}>
            <CardHead kicker={consulting.kicker} title={consulting.title} body={consulting.body} />
            <ol className={styles.track} aria-hidden="true">
              {consulting.steps.map((step, i) => (
                <li key={step.label} className={styles.trackStep} data-done={step.done} style={{ "--i": i }}>
                  <span className={styles.trackNode}>{step.done ? <Check /> : null}</span>
                  {step.label}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </section>
  );
}
