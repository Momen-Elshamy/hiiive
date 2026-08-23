// Server-safe Puck blocks for the About page (Pencil node v0diL).
// Content-editable; visual scaffolding fixed CSS. Reuses HomeClientsBlock
// and HomeCtaBlock for the shared sections.
import styles from "./aboutBlocks.module.css";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
function Sparkles() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}
const lines = (t) =>
  (t || "").split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>
  ));

/* ================================================================== */
/* 1. Hero — mission, split headline, imagery                          */
/* ================================================================== */
const HERO_D = {
  crumbParent: "hiiive",
  crumbCurrent: "About",
  mission: "We partner with founders and operators to build AI-native products and put forward-deployed engineers inside real companies.",
  kicker: "AI-Native Company Builder — Berlin.",
  line1: "Engineering",
  line2: "the future of",
  line3: "intelligence.",
  primaryLabel: "Book a call", primaryHref: "https://calendly.com/hiiive/dvision-potenzial",
  secondaryLabel: "See the work", secondaryHref: "/work",
  imageUrl: "/img/about-hero.jpg",
};

export const AboutHeroBlock = {
  label: "About · Hero",
  fields: {
    crumbParent: { type: "text" },
    crumbCurrent: { type: "text" },
    mission: { type: "textarea" },
    kicker: { type: "text" },
    line1: { type: "text" },
    line2: { type: "text" },
    line3: { type: "text" },
    primaryLabel: { type: "text" },
    primaryHref: { type: "text" },
    secondaryLabel: { type: "text" },
    secondaryHref: { type: "text" },
    imageUrl: { type: "text" },
  },
  defaultProps: HERO_D,
  render: (raw) => {
    const p = { ...HERO_D, ...raw };
    return (
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.missionBlock}>
            <div className={styles.crumbs}>
              <span>{p.crumbParent}</span><span className={styles.crumbSep}>/</span><span className={styles.crumbCurrent}>{p.crumbCurrent}</span>
            </div>
            <div className={styles.mission}>
              <span className={styles.missionIcon}><Sparkles /></span>
              <p className={styles.missionText}>{p.mission}</p>
            </div>
          </div>
          <div className={styles.headlineBlock}>
            <div className={styles.heroKicker}>
              <span className={styles.kickerBars}><i /><i /><i /></span>
              <span className={styles.heroKickerLabel}>{p.kicker}</span>
            </div>
            <h1 className={styles.heroH1}>
              <span className={styles.h1Ink}>{p.line1}</span>
              <span className={styles.h1Muted}>{p.line2}</span>
              <span className={styles.h1Ink}>{p.line3}</span>
            </h1>
            <div className={styles.ctaRow}>
              <a href={p.primaryHref || "#"} className={styles.btnSplit}>
                <span className={styles.btnSplitLabel}>{p.primaryLabel}</span>
                <span className={styles.btnSplitArrow}><ArrowRight /></span>
              </a>
              {p.secondaryLabel ? <a href={p.secondaryHref || "#"} className={styles.btnGhost}>{p.secondaryLabel}</a> : null}
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          {p.imageUrl ? <img src={p.imageUrl} alt="" /> : null}
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 2. Flywheel — dark section with infinity-loop graphic               */
/* ================================================================== */
const FLYWHEEL_D = {
  kicker: "Our flywheel — learn in the Lab, sell in the Studio",
  title: "We learn on our\nown products.\nYou get what works.",
  lead: "Every playbook the Studio brings into your company was tested on our own products first — our money, our risk, our scars. By the time it reaches you, it isn't theory anymore. It's knowledge that survived.",
  quote: "Nothing we recommend is untested. By the time an idea reaches a client, it has already earned its keep in our own P&L.",
  flowTop: "Lessons · Playbooks · Scars",
  flowBottom: "Real-world feedback flows back",
  labNum: "02 — Lab",
  labTitle: "Our own\nproducts",
  labSub: "Spoky · Komplyo\nour money, our risk",
  studioNum: "01 — Studio",
  studioTitle: "Your\ncompany",
  studioSub: "forward-deployed engineers\nknowledge, running live",
  loopImage: "/img/about-flywheel.png",
};

export const AboutFlywheelBlock = {
  label: "About · Flywheel",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    lead: { type: "textarea" },
    quote: { type: "textarea" },
    flowTop: { type: "text" },
    flowBottom: { type: "text" },
    labNum: { type: "text" },
    labTitle: { type: "textarea" },
    labSub: { type: "textarea" },
    studioNum: { type: "text" },
    studioTitle: { type: "textarea" },
    studioSub: { type: "textarea" },
    loopImage: { type: "text" },
  },
  defaultProps: FLYWHEEL_D,
  render: (raw) => {
    const p = { ...FLYWHEEL_D, ...raw };
    return (
      <section className={styles.flywheel}>
        <div className={`${styles.inner} ${styles.flyGrid}`}>
          <div>
            <div className={styles.kicker}>
              <span className={styles.kickerBarAccent} />
              <span className={styles.kickerLabelRev}>{p.kicker}</span>
            </div>
            <h2 className={styles.flyTitle}>{lines(p.title)}</h2>
            <p className={styles.flyLead}>{p.lead}</p>
            <p className={styles.flyQuote}>{lines(p.quote)}</p>
          </div>
          <div className={styles.loop}>
            {p.loopImage ? <img className={styles.loopImg} src={p.loopImage} alt="" /> : null}
            <div className={styles.loopFlowTop}>
              <span>{p.flowTop}</span><ArrowRight />
            </div>
            <div className={styles.loopNodeLab}>
              <span className={styles.loopNum}>{p.labNum}</span>
              <span className={styles.loopNodeTitle}>{lines(p.labTitle)}</span>
              <span className={styles.loopNodeSub}>{lines(p.labSub)}</span>
            </div>
            <div className={styles.loopNodeStudio}>
              <span className={styles.loopNum}>{p.studioNum}</span>
              <span className={styles.loopNodeTitle}>{lines(p.studioTitle)}</span>
              <span className={styles.loopNodeSub}>{lines(p.studioSub)}</span>
            </div>
            <div className={styles.loopFlowBottom}>
              <ArrowLeft /><span>{p.flowBottom}</span>
            </div>
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 3. Principles — three cards                                         */
/* ================================================================== */
const PRINCIPLES_D = {
  kicker: "What we stand for",
  title: "No tools. No theatre.\nJust what goes live.",
  cards: [
    { num: "01", title: "Impact, not hype", body: "Everything we build pays into measurable impact — a number someone answers for. If it doesn't move the number, it doesn't ship." },
    { num: "02", title: "Weeks, not quarters", body: "Working software inside real processes, live in weeks. We'd rather ship a running system than present a concept deck." },
    { num: "03", title: "Built for the busy 🐝", body: "Our clients and members are focused, ambitious and results-driven. We build for people who'd rather do than talk." },
  ],
};

export const AboutPrinciplesBlock = {
  label: "About · Principles",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    cards: {
      type: "array",
      getItemSummary: (i) => i.title || "Principle",
      arrayFields: { num: { type: "text" }, title: { type: "text" }, body: { type: "textarea" } },
      defaultItemProps: { num: "01", title: "Principle", body: "" },
    },
  },
  defaultProps: PRINCIPLES_D,
  render: (raw) => {
    const p = { ...PRINCIPLES_D, ...raw };
    return (
      <section className={styles.principles}>
        <div className={styles.inner}>
          <div className={styles.kicker}>
            <span className={styles.kickerBar} />
            <span className={styles.kickerLabel}>{p.kicker}</span>
          </div>
          <h2 className={styles.sectionTitle}>{lines(p.title)}</h2>
          <div className={styles.prinCards}>
            {(p.cards || []).map((c, i) => (
              <div key={i} className={styles.prinCard}>
                <span className={styles.prinNum}>{c.num}</span>
                <h3 className={styles.prinTitle}>{c.title}</h3>
                <p className={styles.prinBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 4. The Hive — office photo + copy + chips                           */
/* ================================================================== */
const HIVE_D = {
  imageUrl: "/img/about-office.jpg",
  kicker: "The Hive — Berlin-Spandau",
  title: "Rooms don't build.\nPeople do.",
  body: "Home base is Berlin-Spandau — but what makes this place isn't the address, it's who's inside. A senior crew that likes building side by side, because most things simply move faster in the same room. Our forward-deployed engineers spend phases embedded at the client. What counts is what goes live.",
  chips: [
    { text: "Senior-only crew" },
    { text: "Side by side" },
    { text: "At the client" },
    { text: "Hybrid & flexible" },
  ],
};

export const AboutHiveBlock = {
  label: "About · The Hive",
  fields: {
    imageUrl: { type: "text" },
    kicker: { type: "text" },
    title: { type: "textarea" },
    body: { type: "textarea" },
    chips: {
      type: "array",
      getItemSummary: (i) => i.text || "Chip",
      arrayFields: { text: { type: "text" } },
      defaultItemProps: { text: "" },
    },
  },
  defaultProps: HIVE_D,
  render: (raw) => {
    const p = { ...HIVE_D, ...raw };
    return (
      <section className={styles.hive}>
        <div className={`${styles.inner} ${styles.hiveGrid}`}>
          <div className={styles.hivePhoto}>
            {p.imageUrl ? <img src={p.imageUrl} alt="" /> : null}
          </div>
          <div>
            <div className={styles.kicker}>
              <span className={styles.kickerBar} />
              <span className={styles.kickerLabel}>{p.kicker}</span>
            </div>
            <h2 className={styles.sectionTitle}>{lines(p.title)}</h2>
            <p className={styles.hiveBody}>{p.body}</p>
            <div className={styles.chips}>
              {(p.chips || []).map((c, i) => <span key={i} className={styles.chip}>{c.text}</span>)}
            </div>
          </div>
        </div>
      </section>
    );
  },
};

/* ================================================================== */
/* 5. Team — member cards + hiring card                                */
/* ================================================================== */
const TEAM_D = {
  kicker: "The team — small by design",
  title: "The people\nbehind the work.",
  note: "A senior-only crew. No layers, no hand-offs —\nthe people you meet are the people who build.",
  members: [
    { name: "Jonas Weber", role: "Founder & CEO", image: "/img/team-jonas.jpg" },
    { name: "Lena Hoffmann", role: "Head of Engineering", image: "/img/team-lena.jpg" },
    { name: "Milan Petrović", role: "Forward-Deployed Engineer", image: "/img/team-milan.jpg" },
    { name: "Amira Khaled", role: "Product & Design", image: "/img/team-amira.jpg" },
  ],
  showHiring: "yes",
  hiringKicker: "Open role",
  hiringTitle: "+ You?",
  hiringLabel: "We're hiring engineers.",
  hiringHref: "mailto:hello@hiiive.ai",
};

export const AboutTeamBlock = {
  label: "About · Team",
  fields: {
    kicker: { type: "text" },
    title: { type: "textarea" },
    note: { type: "textarea" },
    members: {
      type: "array",
      getItemSummary: (i) => i.name || "Member",
      arrayFields: { name: { type: "text" }, role: { type: "text" }, image: { type: "text" } },
      defaultItemProps: { name: "Name", role: "Role", image: "" },
    },
    showHiring: {
      type: "select",
      options: [{ label: "yes", value: "yes" }, { label: "no", value: "no" }],
    },
    hiringKicker: { type: "text" },
    hiringTitle: { type: "text" },
    hiringLabel: { type: "text" },
    hiringHref: { type: "text" },
  },
  defaultProps: TEAM_D,
  render: (raw) => {
    const p = { ...TEAM_D, ...raw };
    return (
      <section className={styles.team}>
        <div className={styles.inner}>
          <div className={styles.teamHead}>
            <div>
              <div className={styles.kicker}>
                <span className={styles.kickerBar} />
                <span className={styles.kickerLabel}>{p.kicker}</span>
              </div>
              <h2 className={styles.sectionTitle}>{lines(p.title)}</h2>
            </div>
            <p className={styles.teamNote}>{lines(p.note)}</p>
          </div>
          <div className={styles.teamCards}>
            {(p.members || []).map((m, i) => (
              <div key={i} className={styles.memberCard}>
                <div className={styles.memberPhoto}>
                  {m.image ? <img src={m.image} alt={m.name} /> : null}
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberRole}>{m.role}</span>
                </div>
              </div>
            ))}
            {p.showHiring === "yes" ? (
              <a href={p.hiringHref || "#"} className={styles.hiringCard}>
                <span className={styles.hiringKicker}>{p.hiringKicker}</span>
                <span className={styles.hiringTitle}>{p.hiringTitle}</span>
                <span className={styles.hiringBottom}>
                  <span>{p.hiringLabel}</span><ArrowUpRight />
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  },
};
