"use client";

import { useEffect, useRef } from "react";

/*
 * Halftone light, as on the reference cards (ref 09, Invertase): a grid of
 * dots whose size and brightness follow a light field. The field is the sum
 * of soft radial glows and, optionally, a sphere lit from the upper left with
 * a brand-yellow rim on its lower right (an eclipse). Drawn on a canvas once
 * per size; nothing animates.
 *
 * glows:  [{ x, y, r, color: [r, g, b], strength }] — x, y in card fractions,
 *         r as a fraction of the card's longer side.
 * sphere: { x, y, r, minWidth } — centre in card fractions, radius as a
 *         fraction of the card's height; skipped on cards narrower than
 *         minWidth (px), where it would run into the copy.
 * Pass module-level constants: a new object each render redraws the canvas.
 */

const SPHERE_BASE = [172, 178, 190];
const SPHERE_RIM = [247, 244, 44]; // --hv-accent

const normalize = (v) => {
  const length = Math.hypot(...v);
  return v.map((c) => c / length);
};
const LIGHT = normalize([-0.6, -0.75, 0.32]); // towards the light: upper left, a little in front
const RIM = normalize([0.5, 0.86]); // the rim faces lower right

export default function Halftone({ glows = [], sphere, spacing = 7, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    let frame = 0;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const size = Math.max(w, h);
      const maxDot = spacing * 0.44;
      const ball = sphere && w >= (sphere.minWidth ?? 0) ? sphere : null;
      const sx = ball ? ball.x * w : 0;
      const sy = ball ? ball.y * h : 0;
      const sr = ball ? ball.r * h : 1;

      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          let total = 0;
          let red = 0;
          let green = 0;
          let blue = 0;
          const add = (amount, [r, g, b]) => {
            total += amount;
            red += r * amount;
            green += g * amount;
            blue += b * amount;
          };

          for (const glow of glows) {
            const d = Math.hypot(x - glow.x * w, y - glow.y * h) / (glow.r * size);
            if (d < 1) add((1 - d) * (1 - d) * (glow.strength ?? 1), glow.color);
          }

          if (ball) {
            const dx = (x - sx) / sr;
            const dy = (y - sy) / sr;
            const d2 = dx * dx + dy * dy;
            const d = Math.sqrt(d2) || 1;
            const facing = Math.max(0, (dx / d) * RIM[0] + (dy / d) * RIM[1]);
            if (d2 < 1) {
              const nz = Math.sqrt(1 - d2);
              const lambert = Math.max(0, dx * LIGHT[0] + dy * LIGHT[1] + nz * LIGHT[2]);
              add(0.035 + 0.95 * lambert ** 2.2, SPHERE_BASE); // the whole disc faintly, the lit side strongly
              add(1.15 * (1 - nz) ** 2.2 * facing ** 1.4, SPHERE_RIM);
            } else {
              add(0.7 * Math.exp(-(d - 1) * 9) * facing ** 2, SPHERE_RIM); // halo just outside the rim
            }
          }

          if (total < 0.03) continue;
          const k = Math.min(1, total);
          ctx.fillStyle = `rgba(${(red / total) | 0}, ${(green / total) | 0}, ${(blue / total) | 0}, ${(0.28 + 0.72 * k).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, maxDot * k ** 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [glows, sphere, spacing]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
