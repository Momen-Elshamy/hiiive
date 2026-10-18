"use client";

import { useEffect, useRef } from "react";
import styles from "./HomeStory.module.css";
import { STORY, ramp } from "./storyTimeline";

const copy = {
  hero: {
    kicker: "HIIIVE · AI lab & tech house, Berlin",
    headline: "The lab where AI gets to work",
    accent: "on your hardest problems.",
    sub: "Smart people and smart systems, inventing AI products, agents and software, and putting them to work for real companies.",
    primary: { label: "Book a call", href: "#contact" },
    secondary: { label: "See what we build", href: "/work" },
    capabilities: ["AI agents", "SaaS products", "Custom software", "AI-powered SEO & GEO"],
  },
  spark: {
    kicker: "01 · The spark",
    title: "We find the pattern in the noise.",
    body: "A senior crew of engineers and AI specialists. We spot the work companies keep doing by hand, and build the AI that does it for them.",
  },
};

const NO_POINTER = { x: 0, y: 0 };

export default function HomeStory() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const sparkRef = useRef(null);
  const hintRef = useRef(null);

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
      heroRef.current.style.opacity = String(1 - heroOut);
      heroRef.current.style.transform = `translate3d(0, ${-heroOut * 40}px, 0)`;
      heroRef.current.style.visibility = heroOut >= 1 ? "hidden" : "visible";

      const sparkIn = ramp(p, STORY.sparkIn);
      sparkRef.current.style.opacity = String(sparkIn);
      sparkRef.current.style.transform = `translate3d(0, ${(1 - sparkIn) * 24}px, 0)`;

      hintRef.current.style.opacity = String(1 - ramp(p, [0, 0.04]));
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      current += (target - current) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      applyCopy(current);
      if (scene && visible) scene.render(current, now / 1000, reducedMotion ? NO_POINTER : pointer);
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

        <div ref={heroRef} className={styles.hero}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            {copy.hero.kicker}
          </div>
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

        <div ref={sparkRef} className={styles.chapter}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            {copy.spark.kicker}
          </div>
          <h2 className={styles.chapterTitle}>{copy.spark.title}</h2>
          <p className={styles.chapterBody}>{copy.spark.body}</p>
        </div>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>Scroll</span>
          <span className={styles.hintLine} />
        </div>
      </div>
    </section>
  );
}
