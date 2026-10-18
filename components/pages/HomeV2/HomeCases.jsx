"use client";

import { useEffect, useId, useRef, useState } from "react";
import buttons from "@/components/ui/buttons.module.css";
import section from "./HomeSection.module.css";
import styles from "./HomeCases.module.css";
import { useInView } from "./useInView";

/*
 * "Proof": the case studies as photo cards (ref 10, Harness) in a carousel
 * that runs from the content column out to the right edge of the screen.
 * Copy and numbers are the ones on the live /work page.
 */

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

const content = {
  kicker: "04 · Proof",
  title: "Proof, not promises.",
  intro: "Every project shipped to production and is still running. Numbers are measured and agreed with the client.",
  all: { label: "All case studies", href: "/work" },
  read: "Read the case study",
  cases: [
    {
      client: "Mindverse",
      logo: "/logos/mindverse.svg",
      tag: "SEO & digital presence",
      stat: "3.4×",
      statLabel: "organic sessions in 12 months",
      title: "The organic engine behind a leading German AI platform.",
      // No photo for this one: the card draws the growth itself, monthly
      // organic sessions rising to 3.4× (shape illustrative, end point real).
      chart: [1, 1.04, 1.12, 1.2, 1.33, 1.5, 1.62, 1.86, 2.1, 2.38, 2.72, 3.02, 3.4],
      href: "/work/mindverse-organic-engine",
    },
    {
      client: "ahead",
      tag: "Event game",
      stat: "2 wks",
      statLabel: "to build it for ahead's booth at FIBO 2026",
      title: "An offline-first big-screen game with a mobile control panel.",
      image: "/img/case-ahead.jpg",
      href: "/work/ahead-fibo-game",
    },
    {
      client: "Wavelr",
      logo: "/logos/wavelr.svg",
      tag: "MVP & SEO",
      stat: "8 wks",
      statLabel: "to a live marketplace, built from zero",
      title: "The verified-PV marketplace for the German solar market.",
      image: "/img/home-v2/case-wavelr.jpg",
      href: "/work/wavelr-pv-marketplace",
    },
  ],
  next: {
    kicker: "Next step",
    title: "Let's look at the work you shouldn't be doing.",
    body: "A 30-minute call. We map one workflow, tell you if AI is the answer, and what it would take. No deck.",
    cta: "Book a call",
    href: BOOK_A_CALL,
  },
};

function Arrow({ flip = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Organic sessions over 12 months, drawn as a glowing area chart behind the card. */
function GrowthChart({ values }) {
  const id = useId().replace(/:/g, "");
  const width = 400;
  const height = 500;
  const top = 120;
  const bottom = 390;
  const max = Math.max(...values);
  const points = values.map((v, i) => [(i / (values.length - 1)) * width, bottom - (v / max) * (bottom - top)]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [endX, endY] = points[points.length - 1];

  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--hv-aurora-teal)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--hv-aurora-teal)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--hv-aurora-blue)" />
          <stop offset="70%" stopColor="var(--hv-aurora-teal)" />
          <stop offset="100%" stopColor="var(--hv-accent)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} className={styles.chartGrid} x1="0" x2={width} y1={top + (bottom - top) * f} y2={top + (bottom - top) * f} />
      ))}
      <path className={styles.chartArea} d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id}-area)`} />
      <path className={styles.chartLine} d={line} stroke={`url(#${id}-line)`} pathLength="1" />
      <circle className={styles.chartEnd} cx={endX - 6} cy={endY} r="6" />
    </svg>
  );
}

export default function HomeCases() {
  const ref = useInView({ threshold: 0.15 });
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false, fits: false });

  useEffect(() => {
    const track = trackRef.current;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2, fits: max <= 2 });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Move by one card (its width plus the gap).
  const step = (direction) => {
    const track = trackRef.current;
    const slide = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section ref={ref} className={`${section.section} ${styles.cases}`} aria-labelledby="home-cases-title">
      <div className={section.inner}>
        <div className={section.head}>
          <div className={section.headCopy}>
            <div className={section.kicker}>
              <span className={section.kickerDot} />
              {content.kicker}
            </div>
            <h2 id="home-cases-title" className={section.title}>{content.title}</h2>
            <p className={section.intro}>{content.intro}</p>
          </div>
          <div className={styles.controls}>
            <a href={content.all.href} className={styles.all}>
              {content.all.label} <Arrow />
            </a>
            {edges.fits ? null : (
              <div className={styles.arrows}>
                <button type="button" className={styles.arrow} onClick={() => step(-1)} disabled={edges.start} aria-label="Previous case">
                  <Arrow flip />
                </button>
                <button type="button" className={styles.arrow} onClick={() => step(1)} disabled={edges.end} aria-label="Next case">
                  <Arrow />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ul ref={trackRef} className={styles.track}>
        {content.cases.map((c, i) => (
          <li key={c.client} className={styles.slide} style={{ "--i": i }}>
            <a href={c.href} className={`${styles.caseCard} ${c.chart ? styles.chartCard : ""}`}>
              {c.chart ? <GrowthChart values={c.chart} /> : <img className={styles.photo} src={c.image} alt="" loading="lazy" />}
              <span className={styles.shade} aria-hidden="true" />
              <div className={styles.top}>
                {c.logo ? (
                  <img className={styles.logo} src={c.logo} alt={c.client} />
                ) : (
                  <span className={styles.wordmark}>{c.client}</span>
                )}
                <span className={styles.tag}>{c.tag}</span>
              </div>
              <div className={styles.bottom}>
                <div className={styles.statRow}>
                  <span className={styles.stat}>{c.stat}</span>
                  <span className={styles.statLabel}>{c.statLabel}</span>
                </div>
                <h3 className={styles.caseTitle}>{c.title}</h3>
                <span className={styles.read}>
                  {content.read} <Arrow />
                </span>
              </div>
            </a>
          </li>
        ))}
        <li className={styles.slide} style={{ "--i": content.cases.length }}>
          <a href={content.next.href} className={`${styles.caseCard} ${styles.nextCard}`}>
            <span className={styles.nextDots} aria-hidden="true" />
            <span className={styles.nextGlow} aria-hidden="true" />
            <div className={styles.nextCopy}>
              <span className={styles.nextKicker}>{content.next.kicker}</span>
              <h3 className={styles.nextTitle}>{content.next.title}</h3>
              <p className={styles.nextBody}>{content.next.body}</p>
            </div>
            <span className={`${buttons.button} ${buttons.primary} ${styles.nextButton}`}>
              {content.next.cta} <Arrow />
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
