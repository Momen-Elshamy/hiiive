"use client";

import { useEffect, useId, useState } from "react";
import styles from "./isoArt.module.css";

/*
 * Isometric SVG illustrations for "Why Hiiive", in the software factory's
 * visual language (see factory/factoryModel.js): powder-coat modules with a
 * painted yellow band under a top plate, light only in slits and LEDs, on a
 * floor of beads.
 *
 * World axes: +x runs to the screen's upper right, +z to its lower right,
 * +y up. The visible faces of a box are its top, its x-min face ("left") and
 * its z-max face ("front"). Each illustration lists the points it must show
 * and is scaled to fill the frame.
 */

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const VIEW = { width: 640, height: 440, pad: 34 };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Projection scaled and centred so every point in `points` fits the frame. */
function fitIso(points) {
  const raw = points.map(([x, y, z]) => [(x + z) * COS, (z - x) * SIN - y]);
  const xs = raw.map((p) => p[0]);
  const ys = raw.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min((VIEW.width - VIEW.pad * 2) / (maxX - minX), (VIEW.height - VIEW.pad * 2) / (maxY - minY));
  const ox = (VIEW.width - (maxX - minX) * s) / 2 - minX * s;
  const oy = (VIEW.height - (maxY - minY) * s) / 2 - minY * s;
  const P = (x, y, z) => [ox + (x + z) * COS * s, oy + (z - x) * SIN * s - y * s];
  const fmt = ([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`;
  return {
    s,
    ox,
    oy,
    P,
    pts: (list) => list.map((q) => fmt(P(...q))).join(" "),
    path: (list) => `M${list.map((q) => fmt(P(...q))).join(" L")}`,
  };
}

/** The eight corners of a box, for fitting. */
function corners({ x, y = 0, z, w, h, d }) {
  const out = [];
  for (const dx of [0, w]) for (const dy of [0, h]) for (const dz of [0, d]) out.push([x + dx, y + dy, z + dz]);
  return out;
}

function boxFaces(iso, { x, y = 0, z, w, h, d }) {
  const t = y + h;
  return {
    top: iso.pts([[x, t, z], [x + w, t, z], [x + w, t, z + d], [x, t, z + d]]),
    left: iso.pts([[x, y, z], [x, y, z + d], [x, t, z + d], [x, t, z]]),
    front: iso.pts([[x, y, z + d], [x + w, y, z + d], [x + w, t, z + d], [x, t, z + d]]),
  };
}

function Box({ iso, tone = "shell", ...box }) {
  const f = boxFaces(iso, box);
  return (
    <g>
      <polygon points={f.left} fill={`var(--${tone}-left)`} />
      <polygon points={f.front} fill={`var(--${tone}-right)`} />
      <polygon points={f.top} fill={`var(--${tone}-top)`} />
    </g>
  );
}

/** SVG matrix that lays text flat on a top face, reading along +x. */
function topText(iso, x, y, z) {
  const [e, f] = iso.P(x, y, z);
  return `matrix(${COS} ${-SIN} ${COS} ${SIN} ${e.toFixed(1)} ${f.toFixed(1)})`;
}

/** SVG matrix for text on a front (z-max) wall, reading along +x. */
function frontText(iso, x, y, z) {
  const [e, f] = iso.P(x, y, z);
  return `matrix(${COS} ${-SIN} 0 1 ${e.toFixed(1)} ${f.toFixed(1)})`;
}

/** Soft contact shadow, thrown to the lower right (the key light is upper left). */
function Shadow({ iso, x, z, w, d, filter, spread = 0.3 }) {
  return (
    <polygon
      points={iso.pts([
        [x - 0.05, 0, z + spread * 0.3],
        [x + w, 0, z - 0.05],
        [x + w + spread, 0, z + d + spread],
        [x + spread * 0.3, 0, z + d + spread * 1.2],
      ])}
      fill="#000"
      opacity="0.6"
      filter={filter}
    />
  );
}

/** A pool of light on the floor, as under the factory's slits. */
function Pool({ iso, x, z, r, gradient, opacity = 0.35 }) {
  const [cx, cy] = iso.P(x, 0, z);
  const rx = r * iso.s * 1.25;
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.55} fill={`url(#${gradient})`} opacity={opacity} />;
}

/** Shared <defs>: glow and shadow filters, light pools, the bead floor and its fade. */
function Defs({ id, iso, fade }) {
  const step = 0.24;
  return (
    <defs>
      <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <radialGradient id={`${id}-pool`}>
        <stop offset="0%" stopColor="var(--light)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--light)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-poolWarm`}>
        <stop offset="0%" stopColor="var(--light-warm)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--light-warm)" stopOpacity="0" />
      </radialGradient>
      {/* Beads: a dot pattern laid on the floor plane (u = world x, v = world z). */}
      <pattern
        id={`${id}-beads`}
        patternUnits="userSpaceOnUse"
        width={step}
        height={step}
        patternTransform={`matrix(${COS * iso.s} ${-SIN * iso.s} ${COS * iso.s} ${SIN * iso.s} ${iso.ox} ${iso.oy})`}
      >
        <circle cx={step / 2} cy={step / 2} r={step * 0.2} fill="var(--bead)" />
      </pattern>
      <radialGradient id={`${id}-fade`} cx={fade.cx} cy={fade.cy} r={fade.r} gradientUnits="objectBoundingBox">
        <stop offset="30%" stopColor="#fff" />
        <stop offset="100%" stopColor="#000" />
      </radialGradient>
      <mask id={`${id}-floor`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW.width} height={VIEW.height}>
        <rect width={VIEW.width} height={VIEW.height} fill={`url(#${id}-fade)`} />
      </mask>
    </defs>
  );
}

function Floor({ id }) {
  return <rect width={VIEW.width} height={VIEW.height} fill={`url(#${id}-beads)`} mask={`url(#${id}-floor)`} />;
}

/**
 * A factory module: body, painted yellow band, top plate, a lit opening in
 * the front wall and a status LED on top. `light` is "on", "blink" or "off".
 */
function Module({ iso, x, z, w, d, body = 0.85, light = "on", label, labelSize = 13, sub, glow, ledClass, ledStyle }) {
  const band = 0.12;
  const plate = 0.15;
  const top = body + band + plate;
  const lit = light !== "off";
  const open = { x0: x + w * 0.32, x1: x + w * 0.68, y1: body * 0.6 };
  const [ledX, ledY] = iso.P(x + w * 0.86, top, z + d * 0.24);
  const lightClass = light === "blink" ? styles.blink : light === "on" ? styles.breathe : undefined;
  const ledR = Math.max(3.5, iso.s * 0.1);

  return (
    <g>
      <Box iso={iso} x={x} z={z} w={w} d={d} h={body} />
      <Box iso={iso} tone="band" x={x - 0.02} y={body} z={z - 0.02} w={w + 0.04} d={d + 0.04} h={band} />
      <Box iso={iso} x={x - 0.06} y={body + band} z={z - 0.06} w={w + 0.12} d={d + 0.12} h={plate} />
      <polygon
        points={iso.pts([
          [open.x0, 0, z + d],
          [open.x1, 0, z + d],
          [open.x1, open.y1, z + d],
          [open.x0, open.y1, z + d],
        ])}
        fill="#0b0b0c"
      />
      <path
        d={iso.path([
          [open.x0 + 0.05, open.y1 - 0.06, z + d],
          [open.x1 - 0.05, open.y1 - 0.06, z + d],
        ])}
        stroke={lit ? "var(--light)" : "#2b2d31"}
        strokeWidth="2"
        strokeLinecap="round"
        filter={lit ? glow : undefined}
        className={lit ? lightClass : undefined}
      />
      <ellipse
        cx={ledX}
        cy={ledY}
        rx={ledR}
        ry={ledR * 0.58}
        fill={lit ? "var(--light)" : "#55575c"}
        filter={lit ? glow : undefined}
        className={ledClass ?? (lit ? lightClass : undefined)}
        style={ledStyle}
      />
      {label ? (
        <text className={styles.label} fontSize={labelSize} transform={topText(iso, x + 0.24, top, z + d * 0.56)}>
          {label}
        </text>
      ) : null}
      {sub ? (
        <text className={styles.sub} fontSize={labelSize * 0.74} transform={topText(iso, x + 0.24, top, z + d * 0.86)}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** A module still in build: its outline, drawn with marching dashes. */
function GhostModule({ iso, x, z, w, d, body = 0.85, label, labelSize = 13, sub }) {
  const top = body + 0.27;
  const f = boxFaces(iso, { x, z, w, d, h: top });
  return (
    <g>
      <polygon points={f.left} className={styles.ghostLine} />
      <polygon points={f.front} className={styles.ghostLine} />
      <polygon points={f.top} className={styles.ghostLine} />
      {label ? (
        <text className={styles.faceLabel} fontSize={labelSize} transform={topText(iso, x + 0.24, top, z + d * 0.56)}>
          {label}
        </text>
      ) : null}
      {sub ? (
        <text className={styles.faceLabel} fontSize={labelSize * 0.74} opacity="0.7" transform={topText(iso, x + 0.24, top, z + d * 0.86)}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** A lit chip travelling along a path, looping; `begin` staggers chips. */
function Chip({ path, dur, begin, motion, glow }) {
  if (!motion) return null;
  return (
    <polygon points="-5.5,0 0,-3.2 5.5,0 0,3.2" fill="var(--light)" filter={glow} opacity="0">
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </polygon>
  );
}

/** A dark lane on the floor from a to b (world x, z), and the path chips ride along. */
function lane(iso, a, b, width = 0.26) {
  const vx = b.x - a.x;
  const vz = b.z - a.z;
  const len = Math.hypot(vx, vz);
  const nx = (-vz / len) * (width / 2);
  const nz = (vx / len) * (width / 2);
  return {
    strip: iso.pts([
      [a.x + nx, 0.01, a.z + nz],
      [b.x + nx, 0.01, b.z + nz],
      [b.x - nx, 0.01, b.z - nz],
      [a.x - nx, 0.01, a.z - nz],
    ]),
    path: iso.path([
      [a.x, 0.04, a.z],
      [b.x, 0.04, b.z],
    ]),
  };
}

function svgProps(title) {
  return {
    className: styles.art,
    viewBox: `0 0 ${VIEW.width} ${VIEW.height}`,
    role: "img",
    "aria-label": title,
  };
}

/* 01 · Our own products, running in our own factory --------------------------- */
export function OwnProductsArt({ title }) {
  const id = useSvgId();
  const motion = !useReducedMotion();
  const size = { w: 2.4, d: 1.6 };
  // Back to front: Komplyo (in build), Spoky (validating), Content OS (live).
  const products = [
    { key: "komplyo", x: 6.4, z: -0.4, label: "Komplyo", sub: "In build" },
    { key: "spoky", x: 3.2, z: 0.2, label: "Spoky", sub: "In validation", light: "blink" },
    { key: "content", x: 0, z: 0.8, label: "Content OS", sub: "In production", light: "on" },
  ];
  const out = { a: { x: 1.2, z: 2.45 }, b: { x: 1.2, z: 5.2 } };
  const iso = fitIso([
    ...products.flatMap((p) => corners({ x: p.x - 0.06, z: p.z - 0.06, w: size.w + 0.12, d: size.d + 0.12, h: 1.12 })),
    [out.b.x, 0, out.b.z + 0.3],
  ]);
  const glow = `url(#${id}-glow)`;
  const shadow = `url(#${id}-shadow)`;
  const exit = lane(iso, out.a, out.b, 0.4);

  return (
    <svg {...svgProps(title)}>
      <Defs id={id} iso={iso} fade={{ cx: "40%", cy: "62%", r: "62%" }} />
      <Floor id={id} />
      <Pool iso={iso} x={1.2} z={3.3} r={1.6} gradient={`${id}-pool`} opacity={0.28} />
      <Pool iso={iso} x={4.4} z={2.2} r={1.1} gradient={`${id}-poolWarm`} opacity={0.1} />
      <polygon points={exit.strip} fill="#111214" />
      {[0, 1.1, 2.2].map((begin) => (
        <Chip key={begin} path={exit.path} dur={3.3} begin={begin} motion={motion} glow={glow} />
      ))}
      {products.map((p) =>
        p.light ? (
          <g key={p.key}>
            <Shadow iso={iso} x={p.x} z={p.z} w={size.w} d={size.d} filter={shadow} />
            <Module iso={iso} x={p.x} z={p.z} w={size.w} d={size.d} light={p.light} label={p.label} sub={p.sub} glow={glow} />
          </g>
        ) : (
          <GhostModule key={p.key} iso={iso} x={p.x} z={p.z} w={size.w} d={size.d} label={p.label} sub={p.sub} />
        ),
      )}
    </svg>
  );
}

/* 02 · Built with one, made for many ---------------------------------------------- */
export function OneToManyArt({ title }) {
  const id = useSvgId();
  const motion = !useReducedMotion();
  const source = { x: 0, z: 0, w: 2.6, d: 1.9, body: 0.95 };
  const mini = { w: 1.15, d: 0.9, body: 0.42 };
  // The next companies, back to front so nearer ones paint over farther ones.
  const targets = [
    { x: 7.4, z: -2.6 },
    { x: 8.0, z: -0.2 },
    { x: 7.6, z: 2.2 },
    { x: 6.4, z: 4.3 },
    { x: 4.4, z: 5.8 },
  ];
  const start = { x: source.x + source.w * 0.5, z: source.z + source.d };
  const iso = fitIso([
    ...corners({ x: source.x - 0.06, z: source.z - 0.06, w: source.w + 0.12, d: source.d + 0.12, h: 1.25 }),
    ...targets.flatMap((t) => corners({ x: t.x - 0.05, z: t.z - 0.05, w: mini.w + 0.1, d: mini.d + 0.1, h: 0.72 })),
  ]);
  const glow = `url(#${id}-glow)`;
  const shadow = `url(#${id}-shadow)`;
  const lanes = targets.map((t) => lane(iso, start, { x: t.x + mini.w * 0.5, z: t.z + mini.d * 0.5 }));
  const travel = 2.4;
  const cycle = 4.8;

  return (
    <svg {...svgProps(title)}>
      <Defs id={id} iso={iso} fade={{ cx: "52%", cy: "58%", r: "62%" }} />
      <Floor id={id} />
      <Pool iso={iso} x={start.x} z={start.z + 0.6} r={1.7} gradient={`${id}-pool`} opacity={0.3} />
      {lanes.map((l, i) => (
        <polygon key={`lane-${i}`} points={l.strip} fill="#111214" />
      ))}
      {lanes.map((l, i) =>
        [0, cycle / 2].map((offset) => (
          <Chip key={`chip-${i}-${offset}`} path={l.path} dur={travel} begin={i * 0.35 + offset} motion={motion} glow={glow} />
        )),
      )}
      {targets.map((t, i) => (
        <g key={`target-${i}`}>
          <Shadow iso={iso} x={t.x} z={t.z} w={mini.w} d={mini.d} filter={shadow} spread={0.18} />
          <Module
            iso={iso}
            x={t.x}
            z={t.z}
            w={mini.w}
            d={mini.d}
            body={mini.body}
            light="on"
            glow={glow}
            ledClass={motion ? styles.switchOn : undefined}
            ledStyle={motion ? { "--delay": `${(i * 0.35 + travel * 0.9).toFixed(2)}s` } : undefined}
          />
        </g>
      ))}
      <Shadow iso={iso} x={source.x} z={source.z} w={source.w} d={source.d} filter={shadow} />
      <Module iso={iso} x={source.x} z={source.z} w={source.w} d={source.d} body={source.body} light="on" label="Built with one" labelSize={12} glow={glow} />
    </svg>
  );
}

/* 03 · Senior people, inside your team ---------------------------------------------- */
export function InsideTeamArt({ title }) {
  const id = useSvgId();
  const tray = { x: 0, z: 0, w: 6.6, d: 4.5, h: 0.34 };
  const cube = 0.82;
  const gap = 0.44;
  const cols = 5;
  const rows = 3;
  // Where Hiiive's people sit in the team (column, row).
  const ours = new Set(["1,0", "3,1", "2,2"]);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ c, r, x: 0.55 + c * (cube + gap), z: 0.5 + r * (cube + gap) });
  }
  cells.sort((a, b) => a.z - a.x - (b.z - b.x)); // back to front
  const iso = fitIso(corners({ x: tray.x, z: tray.z, w: tray.w, d: tray.d, h: tray.h + cube + 0.2 }));
  const glow = `url(#${id}-glow)`;
  const shadow = `url(#${id}-shadow)`;

  return (
    <svg {...svgProps(title)}>
      <Defs id={id} iso={iso} fade={{ cx: "50%", cy: "56%", r: "62%" }} />
      <Floor id={id} />
      <Shadow iso={iso} x={tray.x} z={tray.z} w={tray.w} d={tray.d} filter={shadow} spread={0.5} />
      <Box iso={iso} tone="graphite" x={tray.x} z={tray.z} w={tray.w} d={tray.d} h={tray.h} />
      <text className={styles.faceLabel} fontSize="11" transform={frontText(iso, tray.x + 0.4, tray.h * 0.3, tray.z + tray.d)}>
        Your team
      </text>
      {cells.map(({ c, r, x, z }) => {
        const key = `${c},${r}`;
        if (!ours.has(key)) {
          return <Box key={key} iso={iso} tone="graphite" x={x} y={tray.h} z={z} w={cube} d={cube} h={cube * 0.88} />;
        }
        const top = tray.h + cube * 0.62 + 0.1 + 0.12;
        const [lx, ly] = iso.P(x + cube * 0.5, top, z + cube * 0.5);
        const ledR = Math.max(3.5, iso.s * 0.1);
        return (
          <g key={key}>
            <Pool iso={iso} x={x + cube * 0.5} z={z + cube + 0.2} r={0.7} gradient={`${id}-pool`} opacity={0.22} />
            <Box iso={iso} x={x} y={tray.h} z={z} w={cube} d={cube} h={cube * 0.62} />
            <Box iso={iso} tone="band" x={x - 0.02} y={tray.h + cube * 0.62} z={z - 0.02} w={cube + 0.04} d={cube + 0.04} h={0.1} />
            <Box iso={iso} x={x - 0.04} y={tray.h + cube * 0.62 + 0.1} z={z - 0.04} w={cube + 0.08} d={cube + 0.08} h={0.12} />
            <ellipse cx={lx} cy={ly} rx={ledR} ry={ledR * 0.58} fill="var(--light)" filter={glow} className={styles.breathe} />
          </g>
        );
      })}
    </svg>
  );
}
