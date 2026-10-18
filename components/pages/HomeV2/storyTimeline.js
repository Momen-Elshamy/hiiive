/**
 * Scroll timeline for the home story, in section progress (0 = top of the
 * section, 1 = its last sticky frame). The three.js scene and the HTML copy
 * both read from here so they never drift apart.
 */
export const STORY = {
  heroOut: [0.12, 0.22], // scene 1 copy fades out
  settle: [0.16, 0.46], // aurora drifts down into a loose layer, camera tilts
  drop: [0.46, 0.6], // the spark falls
  wave: [0.6, 0.92], // ripple spreads, particles snap into the grid
  sparkIn: [0.63, 0.71], // scene 2 copy fades in
};

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const ramp = (p, [a, b]) => clamp01((p - a) / (b - a));
export const ease = (t) => t * t * (3 - 2 * t);
export const lerp = (a, b, t) => a + (b - a) * t;
