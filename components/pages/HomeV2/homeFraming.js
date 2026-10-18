import * as THREE from "three";

// The factory's camera framing. Only the 3D scene imports this (it loads in
// its own chunk), so three.js stays out of the page's first download.

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
