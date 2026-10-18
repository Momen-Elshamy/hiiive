import * as THREE from "three";

/*
 * One continuous camera move for the whole story. Keyframes are story progress
 * + position + look-at target; a Catmull-Rom spline runs through them so the
 * flight never cuts. Repeated keyframes hold the camera still for a beat.
 */
export function createCameraPath({ small }) {
  // Desktop pushes the core and the map right so the copy column on the left
  // stays clear. Phones pull back and look lower, so the core and the map sit
  // in the top half above the copy.
  const core = small
    ? [{ pos: [0, 8.5, 1.5], look: [0, -1.2, -18] }, { pos: [1.5, 9, 0.5], look: [0, -1.2, -18] }]
    : [{ pos: [-3, 6.2, -5.6], look: [-3, 1.9, -18] }, { pos: [0.5, 6.8, -6.6], look: [-2.4, 2, -18] }];
  const map = small
    ? [{ pos: [-2.1, 15.5, -5.8], look: [-2.1, -0.6, -13.3] }, { pos: [-2.1, 16, -5.4], look: [-2.1, -0.6, -13.3] }]
    : [{ pos: [-4.7, 12.5, -8.6], look: [-4.7, -0.6, -16.4] }, { pos: [-4.7, 13, -8.2], look: [-4.7, -0.6, -16.4] }];
  const keys = [
    { p: 0, pos: [0, 0.6, 13], look: [0, -0.8, 0] }, // aurora, front on
    { p: 0.08, pos: [0, 0.6, 13], look: [0, -0.8, 0] },
    { p: 0.22, pos: [0, 2.4, 10.5], look: [0, 1.4, -0.6] }, // low over the field
    { p: 0.3, pos: [0, 2.4, 10.5], look: [0, 1.4, -0.6] },
    { p: 0.44, pos: [0, 2.1, 9.3], look: [0, 1.4, -0.6] }, // push in on the ripple
    { p: 0.53, pos: [0, 1.5, 8.2], look: [0, 1.7, -8] }, // line up with the gate
    { p: 0.63, pos: [0, 1.6, -3], look: [0, 1.8, -14] }, // fly through it
    { p: 0.72, ...core[0] }, // the core ahead
    { p: 0.8, ...core[1] }, // drift around it
    { p: 0.9, ...map[0] }, // rise over Germany
    { p: 1, ...map[1] },
  ];

  const toCurve = (key) => new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k[key])), false, "centripetal");
  const posCurve = toCurve("pos");
  const lookCurve = toCurve("look");
  const last = keys.length - 1;

  return function sample(progress, pos, look) {
    let i = 0;
    while (i < last - 1 && progress >= keys[i + 1].p) i++;
    const span = keys[i + 1].p - keys[i].p;
    const t = span > 0 ? Math.min(1, Math.max(0, (progress - keys[i].p) / span)) : 0;
    const u = (i + t) / last;
    posCurve.getPoint(u, pos);
    lookCurve.getPoint(u, look);
  };
}
