"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Preloader.module.css";

/*
 * Covers the home page until the story's scene can draw, so the page shows up
 * complete instead of piece by piece. `progress` is a ref the story moves from
 * 0 to 1 as its real loading steps finish (fonts, the 3D engine, the scene, its
 * shaders, the first frame). The bar eases after it and creeps on slowly while
 * a step is still running, so it never sits still; at 100% it fades out.
 *
 * data-preloader: "idle" as served (so without scripts nothing waits on it),
 * "loading" once the scripts run (the hero waits on this, see
 * HomeStory.module.css), "done" while it fades out; then it is removed.
 */

const HOLD = 250; // ms at 100% before fading out
const FADE = 1000; // ms the fade-out takes (see the CSS)

export default function Preloader({ progress }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const valueRef = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;
    // No scrolling while covered; the scrollbar keeps its space so nothing
    // shifts when the page is uncovered.
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable";
    const unlock = () => {
      html.style.overflow = "";
      html.style.scrollbarGutter = "";
    };
    root.dataset.preloader = "loading";

    let raf = 0;
    let timer = 0;
    let last = performance.now();
    let shown = 0;
    let percent = 0;

    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const reached = progress.current;
      // Catch up with the real progress fast (faster still to finish); while a
      // step is still running, creep on slowly towards 94% so the bar never
      // sits still.
      const caught = shown + (reached - shown) * (1 - Math.exp(-dt * (reached >= 1 ? 12 : 7)));
      const crept = reached < 1 ? shown + (0.94 - shown) * (1 - Math.exp(-dt * 0.2)) : 0;
      shown = Math.max(shown, caught, crept);
      if (reached >= 1 && shown > 0.995) shown = 1;

      barRef.current.style.setProperty("--p", shown.toFixed(4));
      const next = Math.floor(shown * 100);
      if (next !== percent) {
        percent = next;
        valueRef.current.textContent = `${percent}%`;
        root.setAttribute("aria-valuenow", String(percent));
      }

      if (shown < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      timer = setTimeout(() => {
        unlock();
        root.dataset.preloader = "done";
        timer = setTimeout(() => setGone(true), FADE);
      }, HOLD);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      unlock();
    };
  }, [progress]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={styles.preloader}
      data-preloader="idle"
      role="progressbar"
      aria-label="Loading the page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <noscript>
        <style>{"[data-preloader]{display:none}"}</style>
      </noscript>
      <div className={styles.inner}>
        <span className={styles.wordmark}>HIIIVE</span>
        <span ref={barRef} className={styles.track} aria-hidden="true">
          <span className={styles.fill} />
          <span className={styles.spark} />
        </span>
        <span className={styles.meta} aria-hidden="true">
          <span>Opening the lab</span>
          <span ref={valueRef} className={styles.value}>0%</span>
        </span>
      </div>
    </div>
  );
}
