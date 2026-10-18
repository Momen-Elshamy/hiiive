"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FactoryStory.module.css";
import { STATIONS } from "./stations";
import { TOUR, activeStation, ramp, stationProgress } from "./factoryTour";

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

function Kicker({ children }) {
  return (
    <div className={styles.kicker}>
      <span className={styles.kickerDot} />
      {children}
    </div>
  );
}

/**
 * Scene 3 of the home story: the software factory, toured station by station
 * on scroll. It sits right after the scene 1–2 story and overlaps its last
 * screen, so the factory fades in over the bead field instead of cutting.
 */
export default function FactoryStory() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const panelRef = useRef(null);
  const ctaRef = useRef(null);
  const pinRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Dev only: ?f=0.5 pins the factory tour to one frame, for review.
    const pinned = process.env.NODE_ENV !== "production" ? parseFloat(new URLSearchParams(window.location.search).get("f")) : NaN;

    let view = null;
    let raf = 0;
    let visible = false;
    let disposed = false;
    let target = Number.isFinite(pinned) ? pinned : 0;
    let current = target;
    let shown = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    // Where the copy sits on screen; pins that land on it are hidden.
    const copy = { phone: false, right: 0, bottom: 0, top: 0 };
    const measureCopy = () => {
      const rects = [panelRef.current, ctaRef.current].map((el) => el.getBoundingClientRect());
      copy.phone = window.innerWidth < 768;
      copy.right = Math.max(...rects.map((r) => r.right)) + 28;
      copy.bottom = Math.max(...rects.map((r) => r.bottom)) + 28;
      copy.top = Math.min(...rects.map((r) => r.top)) - 28;
    };
    const overCopy = ({ x, y }) => (copy.phone ? y > copy.top : x < copy.right && y < copy.bottom);

    const readScroll = () => {
      if (Number.isFinite(pinned)) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
    };
    const onResize = () => {
      readScroll();
      measureCopy();
    };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      current += (target - current) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      const fadeIn = ramp(current, TOUR.fadeIn);
      stage.style.opacity = String(fadeIn);
      stage.style.visibility = fadeIn > 0.01 ? "visible" : "hidden";
      const cta = ramp(current, TOUR.cta);
      panelRef.current.style.opacity = String(ramp(current, TOUR.copyIn) * (1 - cta));
      panelRef.current.style.visibility = cta < 0.99 ? "visible" : "hidden";
      ctaRef.current.style.opacity = String(cta);
      ctaRef.current.style.visibility = cta > 0.01 ? "visible" : "hidden";

      const station = activeStation(current);
      if (station !== shown) {
        shown = station;
        setActive(station);
      }

      if (!view || !visible || fadeIn <= 0.01) return;
      view.render(now / 1000, reducedMotion ? { x: 0, y: 0 } : pointer, current).forEach((anchor, i) => {
        const pin = pinRefs.current[i];
        if (!pin) return;
        const hidden = overCopy(anchor);
        pin.style.transform = `translate3d(${anchor.x}px, ${anchor.y}px, 0)`;
        pin.style.opacity = String(hidden ? 0 : anchor.a * (1 - cta * 0.5));
        pin.style.visibility = hidden ? "hidden" : "visible";
      });
    };

    (async () => {
      // The plates print the wordmark and labels with the site fonts.
      await Promise.all([
        document.fonts.load('600 200px "Big Shoulders"'),
        document.fonts.load('600 40px "Inter"'),
      ]).catch(() => {});
      const { createFactoryView } = await import("./factoryView");
      if (disposed) return;
      try {
        view = createFactoryView(canvasRef.current, { tour: true, reducedMotion });
        stage.dataset.ready = "true";
      } catch {
        stage.dataset.fallback = "true";
      }
    })();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(section);

    if (Number.isFinite(pinned)) {
      // Bring the pinned frame into view.
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + pinned * (section.offsetHeight - window.innerHeight));
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
      observer.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      view?.dispose();
    };
  }, []);

  // Jump the scroll to a station.
  const goTo = (i) => {
    const section = sectionRef.current;
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + stationProgress(i) * travel, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={styles.factory} aria-label="The Hiiive software factory">
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />

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

        <div ref={panelRef} className={styles.panel}>
          <Kicker>02 · The software factory</Kicker>
          <h2 className={styles.title}>Problems go in. Working software comes out.</h2>
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

        <div ref={ctaRef} className={styles.cta}>
          <Kicker>Your turn</Kicker>
          <h2 className={styles.title}>Bring us your hardest problem.</h2>
          <p className={styles.ctaBody}>Tell us what slows your team down. We&apos;ll show you what AI can do about it, and how fast.</p>
          <div className={styles.ctaRow}>
            <a href={BOOK_A_CALL} className={styles.btnPrimary}>Book a call</a>
            <a href="/work" className={styles.btnSecondary}>See what we build</a>
          </div>
        </div>
      </div>
    </section>
  );
}
