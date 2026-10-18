/**
 * Scroll timeline for the home story, in section progress (0 = top of the
 * section, 1 = its last sticky frame). The three.js scene and the HTML copy
 * both read from here so they never drift apart.
 */
export const STORY = {
  // Scene 1 — hero
  heroOut: [0.05, 0.11], // hero copy fades out
  settle: [0.08, 0.22], // aurora drifts down into a loose layer, camera tilts
  // Scene 2 — the spark
  drop: [0.22, 0.3], // the spark falls
  wave: [0.3, 0.44], // ripple spreads, particles snap into the grid
  // Scene 3 — the gate
  fold: [0.45, 0.54], // the field folds up into two walls of light
  corridor: [0.5, 0.64], // the spark leads through the gate, drawing a line
  // Scene 4 — the core
  core: [0.6, 0.71], // particles stream into the core's layers
  explode: [0.69, 0.78], // layers separate
  // Scene 5 — made for many
  map: [0.8, 0.87], // core shrinks to Berlin, particles spread into Germany
  lit: [0.85, 0.95], // Germany lights up from Berlin, trails fly out
};

// Overlay fades: [in start, in end, out start, out end]. -1 = visible from the
// start, 2 = never fades out.
export const COPY = {
  hero: [-1, -1, 0.05, 0.11],
  spark: [0.31, 0.35, 0.43, 0.46],
  gate: [0.48, 0.52, 0.6, 0.63],
  core: [0.7, 0.74, 0.8, 0.83],
  many: [0.85, 0.88, 0.94, 0.96],
  cta: [0.96, 0.985, 2, 2],
};

export const OVERLAYS = {
  orbit: [0.71, 0.75, 0.8, 0.83],
  hotspots: [0.73, 0.76, 0.8, 0.82],
  stats: [0.88, 0.9, 0.94, 0.96],
};

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const ramp = (p, [a, b]) => clamp01((p - a) / (b - a));
export const ease = (t) => t * t * (3 - 2 * t);
export const lerp = (a, b, t) => a + (b - a) * t;
export const fade = (p, [a, b, c, d]) => Math.min(a < 0 ? 1 : ramp(p, [a, b]), d > 1 ? 1 : 1 - ramp(p, [c, d]));
