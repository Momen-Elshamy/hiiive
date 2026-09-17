"use client";
// "Our flywheel" section (Pencil: Homepage → Process/gCXNa).
//
// Scroll position drives one full lap of the belt: the head travels from the
// deploy pad up the left flank to your company and back down the right, and each
// quarter-lap lights the matching step in the text column. The graphic is a
// single 2D canvas — no image, no library, ~6KB of drawing code — and the rAF
// loop only runs while the panel is on screen and the progress is still moving.
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomePageFallback.module.css";

const ACCENT = "#f7f42c";
const PANEL = "#1b1d1e";
const TRACK = "#41454f";
const FAINT = "#363a43";
const DIM = "#61666f";
const LABEL = "#a8acb5";

const TAU = Math.PI * 2;
const PULSE_MS = 700;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/* ---------------------------------------------------------------------------
   Isometric scene. Authored in ground space (gx, gy on the plane, gz up) and
   projected 2:1, so grid, track, beam and cube all share one perspective.

   Reading: the loop on the ground is the flywheel — deploy, co-develop,
   productize, scale. Every lap feeds the column of light at the hub, which
   rises into the cube overhead: your company, where the work actually runs.
   --------------------------------------------------------------------------- */
const ISO_X = Math.cos(Math.PI / 6);
const ISO_Y = Math.sin(Math.PI / 6);

const CUBE_R = 0.26;
const CUBE_Z = 1.02;

/** Rounded square (superellipse) traversed by `t` turns: 0 = front-left. */
function trackPoint(t) {
  const a = Math.PI / 2 + t * TAU;
  const round = (v) => Math.sign(v) * Math.pow(Math.abs(v), 0.5);
  return [round(Math.cos(a)), round(Math.sin(a))];
}

function drawGrid(ctx, P, span, step) {
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 5]);
  for (let i = -span; i <= span + 1e-6; i += step) {
    ctx.strokeStyle = FAINT;
    ctx.globalAlpha = 0.9 - (Math.abs(i) / span) * 0.65;
    ctx.beginPath();
    ctx.moveTo(...P(i, -span, 0));
    ctx.lineTo(...P(i, span, 0));
    ctx.moveTo(...P(-span, i, 0));
    ctx.lineTo(...P(span, i, 0));
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function tracePath(ctx, P, r, from, to, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    const [gx, gy] = trackPoint(t);
    const [x, y] = P(gx * r, gy * r, 0);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

/** Soft elliptical pool of light on the ground plane. */
function pool(ctx, x, y, r, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(247,244,44,${alpha})`);
  g.addColorStop(1, "rgba(247,244,44,0)");
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ISO_Y / ISO_X);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** Glowing column rising out of the hub, carrying the wordmark on its cap. */
function drawBeam(ctx, P, c, height, unit) {
  if (height <= 0.01) return;
  const top = [P(-c, -c, height), P(c, -c, height), P(c, c, height), P(-c, c, height)];
  const base = [P(-c, -c, 0), P(c, -c, 0), P(c, c, 0), P(-c, c, 0)];
  const [mx, my] = P(0, 0, height);

  const grad = ctx.createLinearGradient(0, top[2][1], 0, base[2][1]);
  grad.addColorStop(0, "rgba(247,244,44,0.30)");
  grad.addColorStop(1, "rgba(247,244,44,0.02)");
  for (const [a, b] of [[3, 2], [2, 1]]) {
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(...base[a]);
    ctx.lineTo(...base[b]);
    ctx.lineTo(...top[b]);
    ctx.lineTo(...top[a]);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = ACCENT;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const i of [1, 2, 3]) {
    ctx.moveTo(...base[i]);
    ctx.lineTo(...top[i]);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  pool(ctx, mx, my, unit * 1.5, 0.16);

  ctx.beginPath();
  ctx.moveTo(...top[0]);
  for (let i = 1; i < 4; i++) ctx.lineTo(...top[i]);
  ctx.closePath();
  ctx.fillStyle = "rgba(247,244,44,0.5)";
  ctx.fill();
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Wordmark printed on the cap. The matrix is the same ground-plane basis the
  // rest of the scene is projected with — baseline up the -gy edge, glyph
  // verticals along +gx — so the type genuinely lies in the face, sheared and
  // foreshortened exactly like the geometry around it.
  ctx.save();
  ctx.translate(mx, my);
  ctx.transform(ISO_X, -ISO_Y, ISO_X, ISO_Y, 0, 0);
  ctx.font = `700 ${Math.round(unit * 0.2)}px 'Big Shoulders', 'Big Shoulders Display', system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "1px";
  ctx.fillStyle = PANEL;
  ctx.globalAlpha = 0.85;
  ctx.fillText("HIIIVE", 0, 0);
  ctx.restore();
  ctx.globalAlpha = 1;
}

/** Wireframe cube over the hub — the client's company, lit once the beam lands. */
function drawCube(ctx, P, c, z, lit) {
  const lo = [P(-c, -c, z), P(c, -c, z), P(c, c, z), P(-c, c, z)];
  const hi = [P(-c, -c, z + 2 * c), P(c, -c, z + 2 * c), P(c, c, z + 2 * c), P(-c, c, z + 2 * c)];
  const face = (pts) => {
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
    ctx.closePath();
  };

  if (lit > 0.01) {
    for (const [a, b] of [[3, 2], [2, 1]]) {
      face([lo[a], lo[b], hi[b], hi[a]]);
      ctx.fillStyle = `rgba(247,244,44,${0.07 * lit})`;
      ctx.fill();
    }
    face(hi);
    ctx.fillStyle = `rgba(247,244,44,${0.22 * lit})`;
    ctx.fill();
  }

  ctx.strokeStyle = lit > 0.01 ? ACCENT : DIM;
  ctx.globalAlpha = lit > 0.01 ? 0.45 + 0.45 * lit : 0.7;
  ctx.lineWidth = 1;
  face(hi);
  ctx.stroke();
  ctx.beginPath();
  for (const i of [1, 2, 3]) {
    ctx.moveTo(...hi[i]);
    ctx.lineTo(...lo[i]);
  }
  ctx.moveTo(...lo[1]);
  ctx.lineTo(...lo[2]);
  ctx.lineTo(...lo[3]);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Draw canvas text shrunk to fit `maxWidth`, down to `min` px. Locale copy
    varies a lot in length (DE "PRODUKTISIERUNG" vs EN "PRODUCTIZE"), and the
    label gutter is narrow on small panels. */
function fitText(ctx, text, x, y, maxWidth, size, weight, min = 7.5) {
  let px = size;
  ctx.font = `${weight} ${px}px Inter, system-ui, sans-serif`;
  while (px > min && ctx.measureText(text).width > maxWidth) {
    px -= 0.5;
    ctx.font = `${weight} ${px}px Inter, system-ui, sans-serif`;
  }
  ctx.fillText(text, x, y);
}

function drawScene(ctx, w, h, progress, steps, activeAt, now, reduced) {
  ctx.clearRect(0, 0, w, h);

  const SPAN = 1.5;
  // The dashed grid is free to bleed off the sides; the track plus its label
  // gutters is what has to fit.
  const unit = Math.min((w - 210) / 3.46, h / 3.15, 155);
  const ox = w / 2;
  const oy = h / 2 + unit * 0.34;
  const P = (gx, gy, gz) => [
    ox + (gx - gy) * ISO_X * unit,
    oy + (gx + gy) * ISO_Y * unit - gz * unit,
  ];

  const active = clamp(Math.floor(progress * 4), 0, 3);
  const eased = progress * progress * (3 - 2 * progress);

  drawGrid(ctx, P, SPAN, SPAN / 4);
  pool(ctx, ...P(0, 0, 0), unit * 1.3, 0.07);

  // Dashed spine, so the hub and the cube read as one stack even at rest.
  ctx.strokeStyle = DIM;
  ctx.globalAlpha = 0.35;
  ctx.setLineDash([2, 5]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(...P(0, 0, 0));
  ctx.lineTo(...P(0, 0, CUBE_Z));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Track: outer and inner edge, so the loop reads as a band.
  for (const [r, alpha, width] of [[1, 1, 1.3], [0.86, 0.5, 1]]) {
    ctx.strokeStyle = TRACK;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.beginPath();
    tracePath(ctx, P, r, 0, 1, 160);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawBeam(ctx, P, 0.26, eased * CUBE_Z, unit);
  drawCube(ctx, P, CUBE_R, CUBE_Z, clamp((progress - 0.72) / 0.28, 0, 1));

  // Travelled band + comet tail riding the track.
  if (progress > 0.004) {
    ctx.lineCap = "round";
    ctx.strokeStyle = ACCENT;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    tracePath(ctx, P, 0.93, 0, progress, Math.max(6, Math.round(progress * 160)));
    ctx.stroke();

    const tail = 0.13;
    const segs = 20;
    for (let i = 0; i < segs; i++) {
      const f = i / segs;
      const t0 = Math.max(0, progress - tail * (1 - f));
      const t1 = Math.max(0, progress - tail * (1 - (i + 1) / segs));
      if (t1 <= t0) continue;
      ctx.globalAlpha = 0.08 + f * f * 0.92;
      ctx.lineWidth = 1.4 + f * 2.2;
      ctx.beginPath();
      tracePath(ctx, P, 0.93, t0, t1, 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  const [hgx, hgy] = trackPoint(progress);
  const [hx, hy] = P(hgx * 0.93, hgy * 0.93, 0);
  pool(ctx, hx, hy, 26, 0.32);
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.ellipse(hx, hy, 4.6, 3, 0, 0, TAU);
  ctx.fill();

  // Stations: an isometric plate per step, plus a leader line out to its label.
  for (let i = 0; i < 4; i++) {
    const [gx, gy] = trackPoint(i / 4);
    const [x, y] = P(gx * 0.93, gy * 0.93, 0);
    const on = i <= active;
    const plate = 0.075;

    if (!reduced && activeAt[i]) {
      const e = (now - activeAt[i]) / PULSE_MS;
      if (e >= 0 && e < 1) {
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = (1 - e) * 0.45;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(x, y, (10 + e * 34) * ISO_X, (10 + e * 34) * ISO_Y, 0, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const q = [
      P(gx * 0.93 - plate, gy * 0.93 - plate, 0),
      P(gx * 0.93 + plate, gy * 0.93 - plate, 0),
      P(gx * 0.93 + plate, gy * 0.93 + plate, 0),
      P(gx * 0.93 - plate, gy * 0.93 + plate, 0),
    ];
    ctx.beginPath();
    ctx.moveTo(...q[0]);
    for (let k = 1; k < 4; k++) ctx.lineTo(...q[k]);
    ctx.closePath();
    ctx.fillStyle = on ? "rgba(247,244,44,0.55)" : PANEL;
    ctx.fill();
    ctx.strokeStyle = on ? ACCENT : DIM;
    ctx.lineWidth = on ? 1.4 : 1;
    ctx.stroke();

    const right = gx - gy > 0;
    const lead = 26;
    const lx = x + (right ? lead : -lead);
    const ly = y - lead * 0.55;
    ctx.strokeStyle = on ? ACCENT : DIM;
    ctx.globalAlpha = on ? 0.6 : 0.45;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + (right ? 7 : -7), y - 4);
    ctx.lineTo(lx, ly);
    ctx.lineTo(lx + (right ? 12 : -12), ly);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const label = `${steps[i]?.num || ""} ${(steps[i]?.title || "").toUpperCase()}`.trim();
    const tx = lx + (right ? 17 : -17);
    const room = Math.max(40, (right ? w - tx : tx) - 6);
    ctx.fillStyle = on ? ACCENT : LABEL;
    ctx.globalAlpha = on ? 1 : 0.6;
    ctx.textBaseline = "middle";
    ctx.textAlign = right ? "left" : "right";
    fitText(ctx, label, tx, ly - 1, room, 10, "600");
    if (i === 0) {
      ctx.fillStyle = LABEL;
      ctx.globalAlpha = 0.6;
      fitText(ctx, "our engineers, your operation", tx, ly + 13, room, 11, "italic");
    }
    ctx.globalAlpha = 1;
  }

  // Pole annotations.
  ctx.font = "italic 11.5px Inter, system-ui, sans-serif";
  ctx.fillStyle = LABEL;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("your company", ...(([x, y]) => [x, y - 26])(P(0, 0, CUBE_Z + 2 * CUBE_R)));
  ctx.globalAlpha = 1;

}


export default function Flywheel({ kicker, title, subtitle, steps = [], note }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(0);

  const activeRef = useRef(0);
  const activeAt = useRef([0, 0, 0, 0]);

  const readProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // While the section is pinned, progress is simply how far into its extra
    // height we have scrolled. Below the pinning breakpoint the section is a
    // normal block again, so fall back to scrubbing across its viewport pass.
    const pinned = rect.height - vh;
    if (pinned > 40) return clamp(-rect.top / pinned, 0, 1);
    return clamp((vh * 0.85 - rect.top) / (vh * 0.7 + rect.height), 0, 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let shown = reduced ? readProgress() : 0;
    let raf = 0;
    let last = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (p, now) => {
      drawScene(ctx, w, h, p, steps, activeAt.current, now, reduced);
      const next = clamp(Math.floor(p * 4), 0, 3);
      if (next !== activeRef.current) {
        if (next > activeRef.current) activeAt.current[next] = now;
        activeRef.current = next;
        setActive(next);
      }
    };

    // One rAF pass: ease `shown` toward the scroll target, redraw, and park the
    // loop as soon as nothing is moving so an idle section costs nothing.
    // The easing is time-based, not per-frame, so it lands the same on a 60Hz
    // and a 120Hz display — and catches up in one frame after the tab has been
    // backgrounded (where rAF is suspended entirely).
    const frame = (now) => {
      const target = readProgress();
      const dt = last ? Math.min((now - last) / 1000, 0.3) : 1 / 60;
      last = now;
      const d = target - shown;
      shown += Math.abs(d) < 0.0006 ? d : d * (1 - Math.pow(0.0001, dt));
      paint(shown, now);
      const settling = activeAt.current.some((t) => t && now - t < PULSE_MS);
      if (visible && (Math.abs(target - shown) > 0.0006 || settling)) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        last = 0;
      }
    };

    const still = () => paint(reduced ? readProgress() : shown, performance.now());

    // Reduced motion gets no easing loop at all: scroll maps straight to the
    // drawn state, so nothing moves that the reader did not move themselves.
    const kick = () => {
      if (reduced) {
        if (visible) still();
        return;
      }
      if (!raf && visible) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    still();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(section);

    const ro = new ResizeObserver(() => {
      resize();
      still();
    });
    ro.observe(canvas);

    window.addEventListener("scroll", kick, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(still).catch(() => {});

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
    };
  }, [readProgress, steps]);

  return (
    <section className={styles.flywheel} ref={sectionRef}>
      <div className={styles.flywheelSticky}>
        <div className={`${styles.inner} ${styles.flywheelInner}`}>
        <div className={styles.fwText}>
          <span className={styles.kickerLabel}>{kicker}</span>
          <h2 className={styles.fwTitle}>{title}</h2>
          <p className={styles.fwSub}>{subtitle}</p>
          <ol className={styles.fwSteps}>
            {steps.map((s, i) => (
              <li key={i} className={`${styles.fwStep} ${i <= active ? styles.fwStepOn : ""}`}>
                <span className={styles.fwBar} />
                <div className={styles.fwStepBody}>
                  <span className={styles.fwStepTop}>
                    <span className={styles.fwStepNum}>{s.num}</span>
                    <span className={styles.fwStepTitle}>{s.title}</span>
                  </span>
                  <span className={styles.fwStepDesc}>{s.desc}</span>
                </div>
              </li>
            ))}
          </ol>
          {note ? <p className={styles.fwNote}>{note}</p> : null}
        </div>

        <div className={styles.fwPanel}>
          <canvas ref={canvasRef} className={styles.fwCanvas} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
