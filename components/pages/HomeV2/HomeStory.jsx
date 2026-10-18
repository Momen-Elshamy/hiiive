"use client";

import { useEffect, useRef } from "react";
import styles from "./HomeStory.module.css";
import { STORY, COPY, OVERLAYS, ramp, fade } from "./storyTimeline";
import { germanyCities } from "./storyGermany";

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

const copy = {
  hero: {
    kicker: "HIIIVE · AI lab & tech house, Berlin",
    headline: "The lab where AI gets to work",
    accent: "on your hardest problems.",
    sub: "Smart people and smart systems, inventing AI products, agents and software, and putting them to work for real companies.",
    primary: { label: "Book a call", href: BOOK_A_CALL },
    secondary: { label: "See what we build", href: "/work" },
    capabilities: ["AI agents", "SaaS products", "Custom software", "AI-powered SEO & GEO"],
  },
  chapters: [
    {
      key: "spark",
      kicker: "01 · The spark",
      title: "We find the pattern in the noise.",
      body: "A senior crew of engineers and AI specialists. We spot the work companies keep doing by hand, and build the AI that does it for them.",
    },
    {
      key: "gate",
      kicker: "02 · Inside real work",
      title: "We build where the work happens.",
      body: "Our engineers sit inside your team, on your real data and processes. Agents, internal tools and custom software, live in production, not in a sandbox.",
    },
    {
      key: "core",
      kicker: "03 · The core",
      title: "Every build makes the lab smarter.",
      body: "What proves itself becomes a reusable core of data, models and agents, with products on top. Ready for the next company, and the next service.",
    },
    {
      key: "many",
      kicker: "04 · Made for many",
      title: "Built with one. Made for many.",
      body: "From Berlin across Germany, our SaaS products and AI-powered services carry what we learn to every company that needs it.",
    },
  ],
  stats: [
    { value: "12+", label: "AI systems in production" },
    { value: "6 wks", label: "to a first release" },
    { value: "4", label: "industries" },
  ],
  cta: {
    kicker: "Your turn",
    title: "Bring us your hardest problem.",
    body: "Tell us what slows your team down. We'll show you what AI can do about it, and how fast.",
    primary: { label: "Book a call", href: BOOK_A_CALL },
    secondary: { label: "See what we build", href: "/work" },
  },
  orbit: ["AI agents", "SaaS products", "Custom software", "SEO & GEO", "Internal tools"],
  // Bottom to top, matching the core's plates.
  layers: [
    { title: "Data", body: "Your systems, documents and history, connected." },
    { title: "Models & agents", body: "AI that reasons, decides and takes real work off your team." },
    { title: "Products & services", body: "SaaS, internal tools and AI-powered services like SEO and GEO." },
  ],
  berlin: "Berlin · HIIIVE",
};

const cityNames = germanyCities().map((city) => city.name);
const NO_POINTER = { x: 0, y: 0 };

function Kicker({ children }) {
  return (
    <div className={styles.kicker}>
      <span className={styles.kickerDot} />
      {children}
    </div>
  );
}

function show(el, opacity, transform) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  if (transform) el.style.transform = transform;
}

function place(els, anchors) {
  anchors.forEach((anchor, i) => show(els[i], anchor.a, `translate3d(${anchor.x}px, ${anchor.y}px, 0)`));
}

export default function HomeStory() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const hintRef = useRef(null);
  const chapterRefs = useRef([]);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const orbitRefs = useRef([]);
  const hotspotRefs = useRef([]);
  const cityRefs = useRef([]);
  const berlinRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const spark = params.get("spark") === "blue" ? "blue" : "yellow";
    // Dev only: ?p=0.6 pins the story to one frame, for reviewing a scene.
    const pinned = process.env.NODE_ENV !== "production" ? parseFloat(params.get("p")) : NaN;

    let scene = null;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let target = Number.isFinite(pinned) ? pinned : 0;
    let current = target;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const readScroll = () => {
      if (Number.isFinite(pinned)) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
    };

    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    // Copy is driven straight from the frame loop so it stays locked to the scene.
    const applyCopy = (p) => {
      const heroOut = ramp(p, STORY.heroOut);
      show(heroRef.current, 1 - heroOut, `translate3d(0, ${-heroOut * 40}px, 0)`);

      copy.chapters.forEach((chapter, i) => {
        const o = fade(p, COPY[chapter.key]);
        show(chapterRefs.current[i], o, `translate3d(0, ${(1 - o) * 24}px, 0)`);
      });
      show(statsRef.current, fade(p, OVERLAYS.stats));
      const cta = fade(p, COPY.cta);
      show(ctaRef.current, cta, `translate3d(0, ${(1 - cta) * 24}px, 0)`);

      hintRef.current.style.opacity = String(1 - ramp(p, [0, 0.02]));
    };

    const applyAnchors = (anchors) => {
      place(orbitRefs.current, anchors.orbit);
      place(hotspotRefs.current, anchors.hotspots);
      place(cityRefs.current, anchors.cities);
      place([berlinRef.current], [anchors.berlin]);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      current += (target - current) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      applyCopy(current);
      if (scene && visible) applyAnchors(scene.render(current, now / 1000, reducedMotion ? NO_POINTER : pointer));
    };

    // three.js only loads on the client, in its own chunk.
    import("./storyScene").then(({ createStoryScene }) => {
      if (disposed) return;
      try {
        scene = createStoryScene(canvasRef.current, { spark, reducedMotion });
        stageRef.current.dataset.ready = "true";
      } catch {
        stageRef.current.dataset.fallback = "true";
      }
    });

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(section);

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.story} aria-label="The Hiiive story">
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {/* Labels pinned to points in the 3D scene, positioned every frame. */}
        {copy.orbit.map((label, i) => (
          <div key={label} ref={(el) => (orbitRefs.current[i] = el)} className={styles.anchor} aria-hidden="true">
            <span className={styles.orbitLabel}>{label}</span>
          </div>
        ))}
        {copy.layers.map((layer, i) => (
          <div key={layer.title} ref={(el) => (hotspotRefs.current[i] = el)} className={`${styles.anchor} ${styles.hotspotAnchor}`}>
            <div className={styles.hotspot}>
              <button type="button" className={styles.hotspotButton} aria-label={`${layer.title}: ${layer.body}`}>
                +
              </button>
              <div className={styles.hotspotCard} aria-hidden="true">
                <span className={styles.hotspotTitle}>{layer.title}</span>
                <span className={styles.hotspotBody}>{layer.body}</span>
              </div>
            </div>
          </div>
        ))}
        {cityNames.map((name, i) => (
          <div key={name} ref={(el) => (cityRefs.current[i] = el)} className={`${styles.anchor} ${styles.cityAnchor}`} aria-hidden="true">
            <span className={styles.cityLabel}>{name}</span>
          </div>
        ))}
        <div ref={berlinRef} className={styles.anchor} aria-hidden="true">
          <span className={styles.berlinLabel}>{copy.berlin}</span>
        </div>

        <div ref={heroRef} className={styles.hero}>
          <Kicker>{copy.hero.kicker}</Kicker>
          <h1 className={styles.headline}>
            {copy.hero.headline} <span className={styles.headlineAccent}>{copy.hero.accent}</span>
          </h1>
          <p className={styles.sub}>{copy.hero.sub}</p>
          <div className={styles.ctaRow}>
            <a href={copy.hero.primary.href} className={styles.btnPrimary}>{copy.hero.primary.label}</a>
            <a href={copy.hero.secondary.href} className={styles.btnSecondary}>{copy.hero.secondary.label}</a>
          </div>
          <ul className={styles.caps}>
            {copy.hero.capabilities.map((cap) => (
              <li key={cap} className={styles.cap}>{cap}</li>
            ))}
          </ul>
        </div>

        {copy.chapters.map((chapter, i) => (
          <div key={chapter.key} ref={(el) => (chapterRefs.current[i] = el)} className={styles.chapter}>
            <Kicker>{chapter.kicker}</Kicker>
            <h2 className={styles.chapterTitle}>{chapter.title}</h2>
            <p className={styles.chapterBody}>{chapter.body}</p>
            {chapter.key === "many" ? (
              <dl ref={statsRef} className={styles.stats}>
                {copy.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dt className={styles.statValue}>{stat.value}</dt>
                    <dd className={styles.statLabel}>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ))}

        <div ref={ctaRef} className={`${styles.chapter} ${styles.ctaBlock}`}>
          <Kicker>{copy.cta.kicker}</Kicker>
          <h2 className={styles.chapterTitle}>{copy.cta.title}</h2>
          <p className={styles.chapterBody}>{copy.cta.body}</p>
          <div className={styles.ctaRow}>
            <a href={copy.cta.primary.href} className={styles.btnPrimary}>{copy.cta.primary.label}</a>
            <a href={copy.cta.secondary.href} className={styles.btnSecondary}>{copy.cta.secondary.label}</a>
          </div>
        </div>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>Scroll</span>
          <span className={styles.hintLine} />
        </div>
      </div>
    </section>
  );
}
