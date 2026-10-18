"use client";

import { useEffect, useRef, useState } from "react";
import buttons from "@/components/ui/buttons.module.css";
import styles from "./HomeStory.module.css";
import Preloader from "./Preloader";
import { STATIONS } from "./factory/stations";
import { SCREENS, STORY, activeStation, clamp01, ramp, stationScreen } from "./homeTimeline";

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

// How far the page has loaded once each step is done, as shown on the
// preloader's bar (the three.js chunk is the biggest download). The first
// frame drawn completes it.
const LOAD = { start: 0.06, fonts: 0.18, engine: 0.55, scene: 0.72, shaders: 0.92 };
// Don't hold the page back longer than this; a late scene fades in by itself.
const LOAD_TIMEOUT = 12000;

const copy = {
  hero: {
    kicker: "Hiiive · AI lab & tech house, Berlin",
    headline: "The lab where AI gets to work",
    accent: "on your hardest problems.",
    sub: "Smart people and smart systems, inventing AI products, agents and software, and putting them to work for real companies.",
    primary: { label: "Book a call", href: BOOK_A_CALL },
    secondary: { label: "See what we build", href: "/work" },
    capabilities: ["AI agents", "SaaS products", "Custom software", "AI-powered SEO & GEO"],
  },
  spark: {
    kicker: "01 · The spark",
    title: "We find the pattern in the noise.",
    body: "A senior crew of engineers and AI specialists. We spot the work companies keep doing by hand, and build the AI that does it for them.",
  },
  factory: {
    kicker: "02 · The software factory",
    title: "Problems go in. Working software comes out.",
  },
  cta: {
    kicker: "Your turn",
    title: "Bring us your hardest problem.",
    body: "Tell us what slows your team down. We'll show you what AI can do about it, and how fast.",
  },
};

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
  if (transform !== undefined) el.style.transform = transform;
}

/**
 * The home story as one scroll: the pattern (scenes 1–2) plays out on top of
 * the factory's AI lab, the camera pulls out to the whole factory, and its
 * stations power on one by one while the stepper follows. One canvas, one
 * scroll position (in screens, see homeTimeline.js) for the scene and the copy.
 */
export default function HomeStory() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const sparkRef = useRef(null);
  const hintRef = useRef(null);
  const shadeRef = useRef(null);
  const panelRef = useRef(null);
  const closingRef = useRef(null);
  const pinRefs = useRef([]);
  const loaded = useRef(0); // 0–1, read by <Preloader>
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const spark = params.get("spark") === "blue" ? "blue" : "yellow";
    // Dev only: ?s=5.2 pins the story to one moment (in screens), for review.
    const pinned = process.env.NODE_ENV !== "production" ? parseFloat(params.get("s")) : NaN;

    let scene = null;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let target = Number.isFinite(pinned) ? pinned : 0;
    let current = target;
    let shown = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const reach = (value) => {
      loaded.current = Math.max(loaded.current, value);
    };
    reach(LOAD.start);
    const giveUp = setTimeout(() => reach(1), LOAD_TIMEOUT);

    // Where the factory copy sits on screen; pins that land on it are hidden.
    const zone = { phone: false, right: 0, bottom: 0, top: 0 };
    const measureCopy = () => {
      const rects = [panelRef.current, closingRef.current].map((el) => el.getBoundingClientRect());
      zone.phone = window.innerWidth < 768;
      zone.right = Math.max(...rects.map((r) => r.right)) + 28;
      zone.bottom = Math.max(...rects.map((r) => r.bottom)) + 28;
      zone.top = Math.min(...rects.map((r) => r.top)) - 28;
    };
    // Also skip pins cut off by the screen edge or tucked under the header.
    const overCopy = ({ x, y }) =>
      x < 20 || x > window.innerWidth - 20 || y < 84 || (zone.phone ? y > zone.top : x < zone.right && y < zone.bottom);

    const readScroll = () => {
      if (Number.isFinite(pinned)) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? clamp01(-rect.top / travel) * SCREENS.end : 0;
    };
    const onResize = () => {
      readScroll();
      measureCopy();
    };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    // Copy is driven straight from the frame loop so it stays locked to the scene.
    const applyCopy = (s) => {
      const story = clamp01(s / SCREENS.story);
      const heroOut = ramp(story, STORY.heroOut);
      show(heroRef.current, 1 - heroOut, `translate3d(0, ${-heroOut * 40}px, 0)`);
      const sparkIn = ramp(story, STORY.sparkIn) * (1 - ramp(s, SCREENS.sparkOut));
      show(sparkRef.current, sparkIn, `translate3d(0, ${(1 - sparkIn) * 24}px, 0)`);
      hintRef.current.style.opacity = String(1 - ramp(story, [0, 0.04]));

      const cta = ramp(s, SCREENS.cta);
      show(panelRef.current, ramp(s, SCREENS.copyIn) * (1 - cta));
      show(closingRef.current, cta, `translate3d(0, ${(1 - cta) * 24}px, 0)`);
      shadeRef.current.style.opacity = String(ramp(s, SCREENS.zoom));

      const station = activeStation(s);
      if (station !== shown) {
        shown = station;
        setActive(station);
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      current += (target - current) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      applyCopy(current);
      if (!scene || !visible) return;
      const anchors = scene.render(current, now / 1000, reducedMotion ? NO_POINTER : pointer);
      if (!stage.dataset.ready) {
        stage.dataset.ready = "true";
        reach(1);
      }
      // Checkpoints show once the camera has pulled out to the whole factory.
      const pins = ramp(current, [SCREENS.zoom[1] - 0.3, SCREENS.zoom[1]]) * (1 - ramp(current, SCREENS.cta) * 0.5);
      anchors.forEach((anchor, i) => {
        const pin = pinRefs.current[i];
        if (!pin) return;
        const hidden = pins <= 0.01 || overCopy(anchor);
        pin.style.transform = `translate3d(${anchor.x}px, ${anchor.y}px, 0)`;
        pin.style.opacity = String(hidden ? 0 : anchor.a * pins);
        pin.style.visibility = hidden ? "hidden" : "visible";
      });
    };

    (async () => {
      // The factory's plates print the wordmark and labels with the site fonts.
      await Promise.all([
        document.fonts.load('600 200px "Big Shoulders"'),
        document.fonts.load('600 40px "Inter"'),
      ]).catch(() => {});
      reach(LOAD.fonts);
      let home = null;
      try {
        // three.js only loads on the client, in its own chunk.
        const { createHomeScene } = await import("./homeScene");
        if (disposed) return;
        reach(LOAD.engine);
        // Let the bar paint before building the scene blocks the main thread.
        await new Promise(requestAnimationFrame);
        home = createHomeScene(canvasRef.current, { spark, reducedMotion });
        reach(LOAD.scene);
        await home.warmUp();
      } catch {
        // No WebGL (or the chunk failed to load): the copy keeps a calm backdrop.
        home?.dispose();
        stage.dataset.fallback = "true";
        reach(1);
        return;
      }
      if (disposed) {
        home.dispose();
        return;
      }
      reach(LOAD.shaders);
      scene = home; // the frame loop draws the first frame, which completes the bar
      if (!visible) reach(1); // scrolled past the story: no frame to wait for
    })();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(section);

    if (Number.isFinite(pinned)) {
      // Bring the pinned moment into view.
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + (pinned / SCREENS.end) * (section.offsetHeight - window.innerHeight));
    }
    readScroll();
    measureCopy();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      observer.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
    };
  }, []);

  // Jump the scroll to a station.
  const goTo = (i) => {
    const section = sectionRef.current;
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (stationScreen(i) / SCREENS.end) * travel, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={styles.story} aria-label="The Hiiive story">
      {/* Outside the sticky stage, so it can sit over the site header. */}
      <Preloader progress={loaded} />
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div ref={shadeRef} className={styles.shade} aria-hidden="true" />

        {STATIONS.map((station, i) => (
          <div
            key={station.key}
            ref={(el) => (pinRefs.current[i] = el)}
            className={`${styles.pin} ${i === active ? styles.pinActive : ""}`}
          >
            <div className={styles.checkpoint}>
              <button type="button" className={styles.plus} aria-label={`${station.title}: ${station.body}`} onClick={() => goTo(i)}>
                +
              </button>
              <div className={styles.card} aria-hidden="true">
                <span className={styles.cardStep}>{station.step}</span>
                <span className={styles.cardTitle}>{station.title}</span>
                <span className={styles.cardBody}>{station.body}</span>
              </div>
            </div>
          </div>
        ))}

        <div ref={heroRef} className={styles.hero}>
          <Kicker>{copy.hero.kicker}</Kicker>
          <h1 className={styles.headline}>
            {copy.hero.headline} <span className={styles.headlineAccent}>{copy.hero.accent}</span>
          </h1>
          <p className={styles.sub}>{copy.hero.sub}</p>
          <div className={styles.ctaRow}>
            <a href={copy.hero.primary.href} className={`${buttons.button} ${buttons.primary}`}>{copy.hero.primary.label}</a>
            <a href={copy.hero.secondary.href} className={`${buttons.button} ${buttons.secondary}`}>{copy.hero.secondary.label}</a>
          </div>
          <ul className={styles.caps}>
            {copy.hero.capabilities.map((cap) => (
              <li key={cap} className={styles.cap}>{cap}</li>
            ))}
          </ul>
        </div>

        <div ref={sparkRef} className={styles.chapter}>
          <Kicker>{copy.spark.kicker}</Kicker>
          <h2 className={styles.chapterTitle}>{copy.spark.title}</h2>
          <p className={styles.chapterBody}>{copy.spark.body}</p>
        </div>

        <div ref={panelRef} className={styles.chapter}>
          <Kicker>{copy.factory.kicker}</Kicker>
          <h2 className={styles.chapterTitle}>{copy.factory.title}</h2>
          <ol className={styles.steps}>
            {STATIONS.map((station, i) => (
              <li key={station.key} className={`${styles.step} ${i === active ? styles.stepActive : ""}`}>
                <button type="button" className={styles.stepButton} onClick={() => goTo(i)}>
                  <span className={styles.stepNumber}>{station.step}</span>
                  <span className={styles.stepTitle}>{station.title}</span>
                </button>
                <p className={styles.stepBody}>{station.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div ref={closingRef} className={styles.chapter}>
          <Kicker>{copy.cta.kicker}</Kicker>
          <h2 className={styles.chapterTitle}>{copy.cta.title}</h2>
          <p className={styles.chapterBody}>{copy.cta.body}</p>
          <div className={`${styles.ctaRow} ${styles.ctaRowStart}`}>
            <a href={BOOK_A_CALL} className={`${buttons.button} ${buttons.primary}`}>Book a call</a>
            <a href="/work" className={`${buttons.button} ${buttons.secondary}`}>See what we build</a>
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
