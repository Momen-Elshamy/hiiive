import * as THREE from "three";

/*
 * One scroll timeline for the whole home story. Positions are in "screens"
 * of scroll (1 = one viewport height). The three.js scene and the HTML copy
 * both read from here so they never drift apart.
 *
 * Scenes 1–2 (the pattern) play out on top of the AI lab; the camera then
 * pulls out of them until the whole factory is in view, and the stations
 * power on one by one while the stepper follows.
 */
export const SCREENS = {
  story: 4.2, // scenes 1–2 play over the first 4.2 screens (STORY progress 0–1)
  sparkOut: [4.2, 4.55], // the scene 2 copy leaves
  zoom: [4.3, 6.2], // the camera pulls out of the pattern to the whole factory
  copyIn: [5.9, 6.3], // the factory chapter and its stepper
  stations: [6.6, 7.5, 8.4, 9.3, 10.2], // each station powers on here and becomes the active step
  powerUp: 0.45, // screens it takes a station to power on
  cta: [11.0, 11.4],
  end: 11.7, // total scroll travel
};

// Scenes 1–2, in story progress (0–1 over SCREENS.story).
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

/** Power of station i at screen position `s`: 0 off, 1 on. */
export function stationPower(s, i) {
  const at = SCREENS.stations[i];
  return ramp(s, [at - SCREENS.powerUp / 2, at + SCREENS.powerUp / 2]);
}

/** Index of the active step (0–4), or -1 once the CTA takes over. */
export function activeStation(s) {
  if (s >= SCREENS.cta[0]) return -1;
  let active = 0;
  SCREENS.stations.forEach((at, i) => {
    if (s >= at - SCREENS.powerUp / 2) active = i;
  });
  return active;
}

/** Screen position to jump to for station i: just after it has powered on. */
export function stationScreen(i) {
  return SCREENS.stations[i] + SCREENS.powerUp;
}

// The factory's one fixed shot, once the camera has pulled out.
export const FACTORY_FOV = 20;
export const VIEW_DIR = new THREE.Vector3(-11.5, 13.5, 16.5).normalize(); // front-left, above
export const OVERVIEW = { target: new THREE.Vector3(2.1, 0.45, 1.0), dist: 24.2 };

// The line from the lab's left edge to the lane labels, in world units, and
// how far right of OVERVIEW.target its middle sits (seen along VIEW_DIR).
const LINE = { span: 10.4, offset: 0.58 };
// The copy column on desktop (HomeStory.module.css .chapter: left gutter + max-width).
const copyRight = (width) => Math.max(40, (width - 1280) / 2) + 440;

/**
 * The whole line, sized to the viewport: on desktop it fills the space right
 * of the copy column, on phones it sits in the top half above the copy.
 */
export function framing({ small, width, height }) {
  const forward = VIEW_DIR.clone().negate();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  if (small) {
    const dist = 56;
    return { target: new THREE.Vector3(2.2, 0.4, 1.4).addScaledVector(up, -dist * 0.05), dist };
  }
  const left = copyRight(width) + 30;
  const room = Math.max(320, width - left - 30);
  const pxPerUnit = room / LINE.span;
  const dist = THREE.MathUtils.clamp(height / (2 * Math.tan(THREE.MathUtils.degToRad(FACTORY_FOV) / 2) * pxPerUnit), 24, 60);
  const shift = (left + room / 2 - width / 2) / pxPerUnit - LINE.offset;
  return { target: OVERVIEW.target.clone().addScaledVector(right, -shift), dist };
}
