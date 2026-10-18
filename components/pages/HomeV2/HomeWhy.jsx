"use client";

import section from "./HomeSection.module.css";
import styles from "./HomeWhy.module.css";
import { useInView } from "./useInView";
import Halftone from "./why/Halftone";
import Trails from "./why/Trails";

/*
 * "Why Hiiive": what sets the company apart. A plain row of the programs
 * Hiiive is part of, then a bento of four cards in the style of the
 * reference cards (ref 09, Invertase; ref 10, Harness): dark cards with
 * halftone light, one simple visual each, light type.
 */

// Halftone light per card (module-level so the canvases draw once).
const LIGHT = {
  statement: { glows: [{ x: 1, y: 0, r: 0.8, color: [96, 104, 230], strength: 0.7 }] },
  ourselves: {
    glows: [{ x: 0.34, y: -0.1, r: 0.42, color: [240, 186, 96], strength: 0.85 }],
    sphere: { x: 0.8, y: 0.58, r: 0.37, minWidth: 600 },
  },
  handover: {
    glows: [
      { x: 0, y: 1.05, r: 0.75, color: [42, 163, 201], strength: 0.7 },
      { x: 1, y: -0.05, r: 0.55, color: [96, 104, 230], strength: 0.45 },
    ],
  },
};

const content = {
  kicker: "Why Hiiive",
  title: "An AI lab, not an agency.",
  intro: "Agencies deliver a project and move on. We build our own products, run on our own AI, and keep building what we ship.",
  partners: {
    label: "Part of Germany's AI ecosystem",
    // White versions of /public/logos, made for the dark background. h is
    // each logo's height in px, set by eye so they carry the same weight.
    logos: [
      { name: "NVIDIA Inception", src: "/img/home-v2/partners/nvidia-inception.png", h: 34 },
      { name: "KI Bundesverband", src: "/img/home-v2/partners/ki-bundesverband.png", h: 34 },
      { name: "Telekom TechBoost", src: "/img/home-v2/partners/telekom-techboost.png", h: 36 },
      { name: "Berlin Partner", src: "/img/home-v2/partners/berlin-partner.png", h: 34 },
      { name: "Wayra", src: "/img/home-v2/partners/wayra.png", h: 31 },
    ],
  },
  statement: {
    lines: ["Built with one.", "Made for many."],
    body: "What we build with one company becomes a product the next one starts from, and every build makes it better.",
  },
  ourselves: {
    title: "We run it ourselves first.",
    body: "Content OS, Spoky and Komplyo, and the AI behind our services, run in our own company before they reach yours. Our money and our risk go first.",
    window: { name: "Content OS", status: "Running at Hiiive" },
    command: "$ ship content-os --to your-team",
  },
  team: {
    title: "Senior people, inside your team.",
    body: "The people you meet are the people who build. No layers, no hand-offs.",
    // Framing per photo so heads come out the same size on one eye line:
    // hf = head height (hair to chin) and ef = eye height, as fractions of
    // the photo's height; cx = face centre, as a fraction of its width.
    people: [
      { name: "Roman Rittmann", role: "Co-founder & MD", photo: "/img/team-roman.jpg", hf: 0.51, ef: 0.44, cx: "57%" },
      { name: "Noel Lorenz", role: "Co-founder & MD", photo: "/img/team-noel.jpg", hf: 0.46, ef: 0.25, cx: "51%" },
      { name: "Momen Elshamy", role: "CTO", photo: "/img/team-momen.jpg", hf: 0.92, ef: 0.48, cx: "51%" },
    ],
  },
  handover: {
    lines: ["Live is the start,", "not the handover."],
    body: "We stay on what we ship and keep improving it while your team uses it.",
    // Illustrative release notes, faint in the background.
    log: [
      "v2.4.0  new agent: invoice matching",
      "v2.3.2  faster replies in German",
      "v2.3.0  connected to your CRM",
      "v2.2.1  human review for edge cases",
      "v2.2.0  weekly report to your inbox",
      "v2.1.0  second team onboarded",
      "v2.0.0  live in production",
    ],
  },
};

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Branch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 7v10M18 11c0 4-6 3-11 6" />
    </svg>
  );
}

// A chevron drawn as a dot matrix, like the pixel arrows on ref 09.
const CHEVRON = [
  [0, 0],
  [1, 1],
  [2, 2],
  [1, 3],
  [0, 4],
  [1, 0],
  [2, 1],
  [3, 2],
  [2, 3],
  [1, 4],
];

function PixelArrows() {
  return (
    <svg className={styles.arrows} viewBox="0 0 86 20" aria-hidden="true">
      {[0, 1, 2, 3].map((n) => (
        <g key={n} className={styles.arrow} style={{ "--n": n }} transform={`translate(${n * 22} 0)`}>
          {CHEVRON.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x * 4} y={y * 4} width="2.6" height="2.6" rx="0.6" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function HomeWhy() {
  const ref = useInView({ threshold: 0.2 });
  const { partners, statement, ourselves, team, handover } = content;

  return (
    <section ref={ref} className={`${section.section} ${styles.why}`} aria-labelledby="home-why-title">
      <div className={section.inner}>
        <div className={section.head}>
          <div className={section.headCopy}>
            <div className={section.kicker}>
              <span className={section.kickerDot} />
              {content.kicker}
            </div>
            <h2 id="home-why-title" className={section.title}>{content.title}</h2>
            <p className={section.intro}>{content.intro}</p>
          </div>
        </div>

        <div className={styles.logoRow}>
          <p className={styles.logoLabel}>{partners.label}</p>
          <ul className={styles.logoList}>
            {partners.logos.map((logo) => (
              <li key={logo.name} className={styles.logoItem}>
                <img
                  className={styles.logo}
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  style={{ "--h": `${logo.h}px` }}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.grid}>
          {/* Built with one, made for many */}
          <article className={`${styles.card} ${styles.narrow} ${styles.statement}`}>
            <Halftone className={styles.halftone} glows={LIGHT.statement.glows} />
            <Trails className={styles.trails} />
            <div className={styles.statementCopy}>
              <h3 className={styles.statementText}>
                {statement.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className={styles.cardBody}>{statement.body}</p>
            </div>
          </article>

          {/* We run it ourselves first */}
          <article className={`${styles.card} ${styles.wide} ${styles.ourselves}`}>
            <Halftone className={styles.halftone} glows={LIGHT.ourselves.glows} sphere={LIGHT.ourselves.sphere} />
            <div className={styles.flow} aria-hidden="true">
              <div className={styles.window}>
                <span className={styles.windowDots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.windowName}>{ourselves.window.name}</span>
                <span className={styles.windowStatus}>
                  <span className={styles.liveDot} />
                  {ourselves.window.status}
                </span>
              </div>
              <span className={styles.connector} />
              <span className={styles.check}>
                <Check />
              </span>
              <span className={styles.connector} />
              <div className={styles.terminal}>
                <span className={styles.terminalIcon}>
                  <Branch />
                </span>
                <code className={styles.command} style={{ "--chars": ourselves.command.length }}>
                  {ourselves.command}
                </code>
                <span className={styles.caret} />
              </div>
            </div>
            <div className={styles.cardCopy}>
              <h3 className={styles.cardTitle}>{ourselves.title}</h3>
              <p className={styles.cardBody}>{ourselves.body}</p>
            </div>
          </article>

          {/* Senior people, inside your team */}
          <article className={`${styles.card} ${styles.wide} ${styles.team}`}>
            <ul className={styles.photos}>
              {team.people.map((person) => (
                <li key={person.name} className={styles.photo}>
                  <img
                    src={person.photo}
                    alt={person.name}
                    loading="lazy"
                    style={{ "--hf": person.hf, "--ef": person.ef, "--cx": person.cx }}
                  />
                  <span className={styles.person}>
                    <span className={styles.personName}>{person.name}</span>
                    <span className={styles.personRole}>{person.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <span className={styles.teamShade} aria-hidden="true" />
            <div className={styles.cardCopy}>
              <h3 className={styles.cardTitle}>{team.title}</h3>
              <p className={styles.cardBody}>{team.body}</p>
            </div>
          </article>

          {/* Live is the start, not the handover */}
          <article className={`${styles.card} ${styles.narrow} ${styles.handover}`}>
            <Halftone className={styles.halftone} glows={LIGHT.handover.glows} />
            <pre className={styles.log} aria-hidden="true">
              {/* Twice, so the slow scroll loops without a jump. */}
              <span className={styles.logTrack}>{[...handover.log, ...handover.log].join("\n")}</span>
            </pre>
            <div className={styles.handoverCopy}>
              <h3 className={styles.statementText}>
                {handover.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <PixelArrows />
              <p className={styles.cardBody}>{handover.body}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
