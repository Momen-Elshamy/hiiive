"use client";

import { useEffect, useRef } from "react";
import styles from "./FactoryLookdev.module.css";
import { STATIONS } from "./stations";

export default function FactoryLookdev() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const pinRefs = useRef([]);

  useEffect(() => {
    let view = null;
    let raf = 0;
    let disposed = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      if (!view) return;
      view.render(now / 1000, pointer).forEach((anchor, i) => {
        const pin = pinRefs.current[i];
        if (!pin) return;
        pin.style.transform = `translate3d(${anchor.x}px, ${anchor.y}px, 0)`;
        pin.style.opacity = String(anchor.a);
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
        view = createFactoryView(canvasRef.current);
        stageRef.current.dataset.ready = "true";
      } catch {
        stageRef.current.dataset.fallback = "true";
      }
    })();

    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      view?.dispose();
    };
  }, []);

  return (
    <section className={styles.stage} ref={stageRef} aria-label="The Hiiive software factory">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.copy}>
        <div className={styles.kicker}>
          <span className={styles.kickerDot} />
          02 · The software factory
        </div>
        <h2 className={styles.title}>Problems go in. Working software comes out.</h2>
      </div>
      {STATIONS.map((station, i) => (
        <div key={station.key} ref={(el) => (pinRefs.current[i] = el)} className={styles.pin}>
          <div className={styles.checkpoint}>
            <button type="button" className={styles.plus} aria-label={`${station.title}: ${station.body}`}>
              +
            </button>
            <div className={styles.card} aria-hidden="true">
              <span className={styles.step}>{station.step}</span>
              <span className={styles.cardTitle}>{station.title}</span>
              <span className={styles.cardBody}>{station.body}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
