import * as THREE from "three";

/*
 * The scroll tour through the factory, in factory-section progress (0–1).
 * The camera keeps one isometric viewing direction and only moves its target
 * and distance: it rests on each station in turn, then pulls back to show the
 * whole line. Each station "holds" for a stretch of scroll so it can be read.
 */

export const TOUR = {
  fadeIn: [0, 0.12], // crossfade in over the end of scene 2
  copyIn: [0.08, 0.16],
  stations: [
    { hold: [0.14, 0.24] }, // intake
    { hold: [0.3, 0.42] }, // AI lab
    { hold: [0.48, 0.58] }, // build line
    { hold: [0.64, 0.74] }, // quality gate
    { hold: [0.8, 0.88] }, // output
  ],
  overview: [0.95, 1],
  cta: [0.92, 0.97],
};

// Where the camera looks for each station (world space) and from how far.
const FOCUS = [
  { target: [-3.9, 0.6, 1.2], dist: 10.5 },
  { target: [0, 0.9, 0.3], dist: 12 },
  { target: [3.9, 0.6, 0.3], dist: 12.5 },
  { target: [5.25, 0.9, 0.4], dist: 10.5 },
  { target: [6.2, 0.1, 3.0], dist: 13 },
];

export const VIEW_DIR = new THREE.Vector3(-11.5, 13.5, 16.5).normalize(); // front-left, above
export const OVERVIEW = { target: new THREE.Vector3(2.1, 0.45, 1.0), dist: 24.2 };

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const ramp = (p, [a, b]) => clamp01((p - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);

/** Index of the station being shown (0–4), or -1 on the final overview. */
export function activeStation(progress) {
  const holds = TOUR.stations.map((s) => s.hold);
  for (let i = 0; i < holds.length; i++) {
    const next = holds[i + 1];
    const end = next ? (holds[i][1] + next[0]) / 2 : (holds[i][1] + TOUR.overview[0]) / 2;
    if (progress < end) return i;
  }
  return -1;
}

/** Scroll progress at the middle of a station's hold. */
export function stationProgress(i) {
  const [a, b] = TOUR.stations[i].hold;
  return (a + b) / 2;
}

export function createTour({ small }) {
  // Desktop looks a little left of each station so it sits right of centre,
  // clear of the copy column. Phones look a little below it so it sits in the
  // top half, clear of the copy at the bottom.
  const forward = VIEW_DIR.clone().negate();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  const zoom = small ? 2.1 : 1;
  const frame = (target, dist) =>
    small ? target.addScaledVector(up, -dist * 0.07) : target.addScaledVector(right, -dist * 0.12);
  const station = (i, scale = 1) => {
    const dist = FOCUS[i].dist * zoom * scale;
    return { target: frame(new THREE.Vector3(...FOCUS[i].target), dist), dist };
  };
  // The closing shot: the whole line, pulled back and pushed right on desktop
  // so the CTA on the left has clear space.
  const overview = small
    ? { target: frame(new THREE.Vector3(2.2, 0.4, 1.4), 56), dist: 56 }
    : { target: OVERVIEW.target.clone().addScaledVector(right, -2.7), dist: 31 };

  const keys = [{ q: 0, ...station(0, 1.3) }];
  TOUR.stations.forEach(({ hold }, i) => {
    const s = station(i);
    keys.push({ q: hold[0], ...s }, { q: hold[1], ...s });
  });
  keys.push({ q: TOUR.overview[0], ...overview }, { q: 1, ...overview });

  /** Writes the look-at target for `progress` into `target`; returns the camera distance. */
  return function sample(progress, target) {
    let i = 0;
    while (i < keys.length - 2 && progress >= keys[i + 1].q) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const t = ease(b.q > a.q ? clamp01((progress - a.q) / (b.q - a.q)) : 1);
    target.lerpVectors(a.target, b.target, t);
    return a.dist + (b.dist - a.dist) * t;
  };
}
