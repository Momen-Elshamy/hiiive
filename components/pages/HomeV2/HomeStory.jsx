"use client";

import { useEffect, useRef, useState } from "react";
import buttons from "@/components/ui/buttons.module.css";
import styles from "./HomeStory.module.css";
import { SCREENS, STORY, activeStation, clamp01, ramp, stationScreen } from "./homeTimeline";

const NO_POINTER = { x: 0, y: 0 };

// Frames are only drawn while something moves: the scroll or the pointer
// easing in (at the display's rate), and the scene's own slow motion for a
// while after the last input (at 30 fps). Then the loop stops until the next
// scroll, pointer move or resize, so a page left open costs nothing.
const AWAKE = 4000; // ms the scene keeps moving after the last input
const INTRO = 6000; // ms it moves once it first shows, while it fades in
const DRIFT_FRAME = 1000 / 30; // ms between frames while only the scene's own motion runs

// Any of these starts building the scene; otherwise it starts once the
// browser is idle after load, at the latest this long after.
const START_EVENTS = ["scroll", "pointermove", "touchstart", "keydown"];
const IDLE_TIMEOUT = 2500; // ms

// Hands the main thread back (for input and paint) between the long steps of
// building the scene, so none of them blocks the page for long.
const yieldToMain = () =>
  globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((resolve) => setTimeout(resolve, 0));

function Kicker({ children }) {
  return (
    <div className={styles.kicker}>
      <span className={styles.kickerDot} />
      {children}
    </div>
  );
}

// Whether WebGL runs on a GPU: the browser refuses a context with
// failIfMajorPerformanceCaveat when it would only render in software.
function hasFastWebGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
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
export default function HomeStory({ copy }) {
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
    let raf = 0; // 0 while the loop is stopped
    let visible = true;
    let disposed = false;
    let target = Number.isFinite(pinned) ? pinned : 0;
    let current = target;
    let shown = 0;
    let dirty = true; // something changed that is not drawn yet
    let awake = 0; // the scene's own motion runs until then (ms)
    let last = 0; // the previous tick (ms), 0 once the loop has stopped
    let drawn = -Infinity; // when the last frame was drawn (ms)
    let clock = 0; // the scene's time (s); it stands still while the loop does
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

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

    // Asks for a frame and lets the scene move for `ms` more, starting the loop
    // if it has stopped; it stops by itself once nothing moves.
    const wake = (ms = AWAKE) => {
      dirty = true;
      awake = Math.max(awake, performance.now() + ms);
      if (!raf && visible && !document.hidden && !disposed) raf = requestAnimationFrame(tick);
    };

    const readScroll = () => {
      if (Number.isFinite(pinned)) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? clamp01(-rect.top / travel) * SCREENS.end : 0;
    };
    const onScroll = () => {
      readScroll();
      wake();
    };
    const onResize = () => {
      readScroll();
      measureCopy();
      wake();
    };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      if (!reducedMotion) wake();
    };
    const onVisibility = () => {
      if (!document.hidden) {
        wake();
        return;
      }
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
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
      raf = 0;
      if (!visible) {
        // Scrolled past the story: settle where the scroll is and stop.
        current = target;
        applyCopy(current);
        last = 0;
        return;
      }
      if (last && !reducedMotion) clock += Math.min(now - last, 100) / 1000;
      last = now;
      current += (target - current) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      // The easing is over once what is left of it is far below a pixel.
      const easing =
        Math.abs(target - current) > 1e-4 ||
        (!reducedMotion && Math.max(Math.abs(pointer.tx - pointer.x), Math.abs(pointer.ty - pointer.y)) > 1e-3);
      if (!easing) {
        current = target;
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      const moving = !reducedMotion && now < awake;
      if (easing || dirty || (moving && now - drawn >= DRIFT_FRAME - 4)) {
        draw();
        drawn = now;
        dirty = easing; // one more frame for where the easing snapped to
      }
      if (easing || dirty || moving) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    const draw = () => {
      applyCopy(current);
      if (!scene) return;
      const anchors = scene.render(current, clock, reducedMotion ? NO_POINTER : pointer);
      if (!stage.dataset.ready) stage.dataset.ready = "true"; // fades the canvas in
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

    const buildScene = async () => {
      // Without a GPU the scene would crawl: keep the calm backdrop and don't
      // download three.js at all.
      if (!hasFastWebGL()) {
        stage.dataset.fallback = "true";
        return;
      }
      // The factory's plates print the wordmark and labels with the site fonts.
      await Promise.all([
        document.fonts.load('600 200px "Big Shoulders"'),
        document.fonts.load('600 40px "Inter"'),
      ]).catch(() => {});
      let home = null;
      try {
        // three.js only loads on the client, in its own chunk.
        const { createHomeScene } = await import("./homeScene");
        if (disposed) return;
        await yieldToMain();
        home = createHomeScene(canvasRef.current, { spark, reducedMotion, onCleared: () => wake(0) });
        await yieldToMain();
        await home.warmUp();
        await yieldToMain();
      } catch {
        // No WebGL (or the chunk failed to load): the copy keeps a calm backdrop.
        home?.dispose();
        stage.dataset.fallback = "true";
        return;
      }
      if (disposed) {
        home.dispose();
        return;
      }
      scene = home; // the frame loop draws the first frame, which fades the canvas in
      wake(INTRO);
    };

    // The scene is built on the first scroll, touch, key or pointer move, or
    // once the browser is idle after the page has loaded, whichever comes
    // first, so building it never holds back the first paint.
    let started = false;
    let cancelIdle = () => {};
    const start = () => {
      if (started || disposed) return;
      started = true;
      START_EVENTS.forEach((type) => window.removeEventListener(type, start));
      window.removeEventListener("load", whenIdle);
      cancelIdle();
      buildScene();
    };
    const whenIdle = () => {
      if (window.requestIdleCallback) {
        const id = requestIdleCallback(start, { timeout: IDLE_TIMEOUT });
        cancelIdle = () => cancelIdleCallback(id);
      } else {
        const id = setTimeout(start, IDLE_TIMEOUT / 2); // Safari has no requestIdleCallback
        cancelIdle = () => clearTimeout(id);
      }
    };
    if (Number.isFinite(pinned)) start();
    else {
      START_EVENTS.forEach((type) => window.addEventListener(type, start, { passive: true, once: true }));
      if (document.readyState === "complete") whenIdle();
      else window.addEventListener("load", whenIdle, { once: true });
    }

    // Off screen, the loop stops; it starts again when the story scrolls back in.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    observer.observe(section);

    if (Number.isFinite(pinned)) {
      // Bring the pinned moment into view.
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + (pinned / SCREENS.end) * (section.offsetHeight - window.innerHeight));
    }
    readScroll();
    measureCopy();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    wake(0); // lays out the copy; the scene starts moving once it has loaded

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      START_EVENTS.forEach((type) => window.removeEventListener(type, start));
      window.removeEventListener("load", whenIdle);
      cancelIdle();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
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
    <section ref={sectionRef} className={styles.story} aria-label={copy.ariaLabel}>
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div ref={shadeRef} className={styles.shade} aria-hidden="true" />

        {copy.stations.map((station, i) => (
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
            {copy.stations.map((station, i) => (
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
            <a href={copy.cta.primary.href} className={`${buttons.button} ${buttons.primary}`}>{copy.cta.primary.label}</a>
            <a href={copy.cta.secondary.href} className={`${buttons.button} ${buttons.secondary}`}>{copy.cta.secondary.label}</a>
          </div>
        </div>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>{copy.hint}</span>
          <span className={styles.hintLine} />
        </div>
      </div>
    </section>
  );
}
