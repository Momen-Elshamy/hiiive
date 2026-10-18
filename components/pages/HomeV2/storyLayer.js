import * as THREE from "three";
import { STORY, ramp, ease, lerp } from "./homeTimeline";

/*
 * Home story, scenes 1–2, as a layer of the home scene.
 *
 * The field particles play both scenes. Each owns two positions: a spot in
 * the aurora bands (scene 1, "noise") and a cell in the disc field (scene 2).
 * Scroll first lets the aurora settle into a loose layer above the field, then
 * the spark lands and its ripple snaps particles into the grid from the centre
 * outwards. A second, denser aurora-only layer adds detail to scene 1 and
 * fades away while the field particles settle.
 *
 * Everything is built in "story units" (the field is 22 × 14). The home scene
 * shrinks the layer onto the AI lab's top plate and renders it through its own
 * camera; `uScale` keeps point sizes and light falloff in story units.
 */

export const FIELD = { width: 22, depth: 14 };
export const STORY_FOV = 38;
export const STORY_BLOOM = { strength: 0.55, radius: 0.4, threshold: 0.35 };

// Brand: matte charcoal and one glowing line of HIIIVE yellow (#f7f42c, see
// --hv-accent). The aurora keeps cool curtains but burns yellow along its
// lower edge; the spark is yellow and lights charcoal beads.
const COLORS = {
  curtain: ["#2a46c8", "#2aa3c9", "#9fb4c8"],
  edge: "#f7f42c",
  dust: "#7d8596",
  bead: "#1b1d1e",
  ambient: "#3b3f47",
  fill: "#7f97c4",
  spark: { yellow: "#f7f42c", blue: "#8fc0ff" },
  // What the spark casts on the field: a warm white, so the yellow stays a
  // line of light (like the brand renders) instead of flooding the scene.
  sparkLight: { yellow: "#fff6cf", blue: "#8fc0ff" },
};

// Aurora bands are "smile" arcs: centre above, particles hang below it with a
// bright lower edge that fades upwards like a curtain.
const BANDS = [
  { cx: -0.6, cy: 5.6, cz: -1.0, radius: 9.2, span: 1.25, height: 0.55, depth: 0.25, twist: 0.6, hue: 0.0, weight: 0.32 },
  { cx: 0.8, cy: 6.4, cz: -2.4, radius: 10.4, span: 1.2, height: 0.9, depth: 0.4, twist: 0.9, hue: 0.18, weight: 0.28 },
  { cx: 1.6, cy: 5.0, cz: 0.2, radius: 8.4, span: 1.15, height: 0.35, depth: 0.15, twist: 0.4, hue: 0.32, weight: 0.16 },
  { cx: -1.8, cy: 7.4, cz: -4.5, radius: 12.0, span: 1.3, height: 1.4, depth: 0.6, twist: 1.2, hue: 0.5, weight: 0.24 },
];

// Shared by both particle layers so the aurora moves as one.
const auroraDrift = /* glsl */ `
  vec3 auroraDrift(vec3 a, vec4 rnd, float t) {
    a.x += sin(t * 0.15 + rnd.x * 6.283 + a.y * 0.3) * 0.12;
    a.y += sin(t * 0.22 + a.x * 0.35 + rnd.y * 6.283) * 0.14;
    a.z += cos(t * 0.18 + a.x * 0.25 + rnd.z * 6.283) * 0.2;
    return a;
  }
`;

const fieldVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSettle;
  uniform float uWave;
  uniform float uSize;
  uniform float uProj;
  uniform float uScale;
  uniform vec3 uDrop;
  uniform float uDropI;
  uniform vec3 uFillPos;

  attribute vec3 aGrid;
  attribute vec3 aColor;
  attribute vec4 aRand; // xyz: random, w: brightness

  varying vec3 vColor;
  varying float vBright;
  varying float vMorph;
  varying float vFade;
  varying vec3 vL1;
  varying float vA1;
  varying vec3 vL2;
  varying float vA2;

  ${auroraDrift}

  void main() {
    float t = uTime;
    vec3 a = auroraDrift(position, aRand, t);

    // Loose, restless layer hovering over the field.
    vec3 g = aGrid;
    float d = length(g.xz);
    vec3 loose = g + vec3(
      sin(t * 0.35 + aRand.x * 6.283 + g.z * 0.6) * 0.45,
      0.35 + sin(t * 0.5 + aRand.y * 6.283 + g.x * 0.4) * 0.35 + aRand.z * 0.9,
      cos(t * 0.3 + aRand.z * 6.283 + g.x * 0.5) * 0.45
    );

    // Staggered so the aurora streams down instead of jumping.
    float settle = smoothstep(0.0, 1.0, clamp(uSettle * 1.6 - aRand.x * 0.6, 0.0, 1.0));
    vec3 p = mix(a, loose, settle);

    // The spark's wave front aligns everything it has passed.
    float front = uWave * 16.0;
    float morph = (1.0 - smoothstep(front - 2.2, front, d)) * step(0.0001, uWave);
    float behind = (d - front) / 1.1; // pow() is undefined for negative bases
    float ring = exp(-behind * behind) * sin((d - front) * 3.2 - t * 2.0) * 0.35;
    float swell = sin(d * 1.6 - t * 1.4) * 0.05 * exp(-d * 0.08);
    p = mix(p, vec3(g.x, ring + swell, g.z), morph);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dotSize = mix(0.026, 0.05, aRand.y);
    gl_PointSize = mix(dotSize, uSize, morph) * uScale * uProj / -mv.z;

    // Lights are given in world space; falloff is measured in story units.
    vec3 toDrop = (viewMatrix * vec4(uDrop, 1.0)).xyz - mv.xyz;
    float d1 = length(toDrop);
    vL1 = toDrop / d1;
    float s1 = d1 / uScale;
    vA1 = uDropI / (1.0 + s1 * s1 * 0.12);

    vec3 toFill = (viewMatrix * vec4(uFillPos, 1.0)).xyz - mv.xyz;
    float d2 = length(toFill);
    vL2 = toFill / d2;
    float s2 = d2 / uScale;
    vA2 = 1.0 / (1.0 + s2 * s2 * 0.05);

    vColor = aColor;
    vBright = aRand.w;
    vMorph = morph;
    // Fade the field out at the sides and, harder, towards the horizon.
    float edge = 1.0 - smoothstep(6.0, 11.0, length(vec2(g.x * 0.75, g.z * (g.z < 0.0 ? 1.55 : 1.0))));
    vFade = mix(1.0, edge, max(settle, morph));
  }
`;

const fieldFragmentShader = /* glsl */ `
  uniform vec3 uDropColor;
  uniform vec3 uFillColor;
  uniform float uFillI;
  uniform vec3 uBase;
  uniform vec3 uAmbient;
  uniform float uFade;

  varying vec3 vColor;
  varying float vBright;
  varying float vMorph;
  varying float vFade;
  varying vec3 vL1;
  varying float vA1;
  varying vec3 vL2;
  varying float vA2;

  void main() {
    vec2 uv = vec2(gl_PointCoord.x * 2.0 - 1.0, 1.0 - gl_PointCoord.y * 2.0);
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;
    float r = sqrt(r2);

    // Scene 1: soft glowing dot.
    float glow = pow(1.0 - r, 1.6);
    vec3 dotCol = vColor * vBright * 1.6 * glow;

    // Scene 2: a small lit bead (sphere normal faked from the sprite).
    vec3 n = vec3(uv, sqrt(1.0 - r2));
    vec3 v = vec3(0.0, 0.0, 1.0);
    float dif1 = max(dot(n, vL1), 0.0);
    float spec1 = pow(max(dot(n, normalize(vL1 + v)), 0.0), 48.0);
    float dif2 = max(dot(n, vL2), 0.0);
    float spec2 = pow(max(dot(n, normalize(vL2 + v)), 0.0), 32.0);
    vec3 bead = uBase * (0.35 + dif1 * vA1 * 1.2)
      + uAmbient * (0.06 + 0.22 * pow(max(n.y, 0.0), 2.0))
      + uDropColor * (dif1 * 0.35 + spec1 * 1.8) * vA1
      + uFillColor * (dif2 * 0.25 + spec2 * 1.1) * vA2 * uFillI;
    bead *= 1.0 - smoothstep(0.75, 1.0, r) * 0.6;

    vec3 col = mix(dotCol, bead, vMorph);
    float alpha = mix(glow, 1.0 - smoothstep(0.92, 1.0, r), vMorph) * vFade * uFade;
    gl_FragColor = vec4(col * uFade, alpha);
  }
`;

const hazeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSettle;
  uniform float uProj;
  uniform float uScale;

  attribute vec3 aColor;
  attribute vec4 aRand;

  varying vec3 vColor;
  varying float vAlpha;

  ${auroraDrift}

  void main() {
    vec3 a = auroraDrift(position, aRand, uTime);
    a.y -= uSettle * (1.5 + aRand.z * 2.0); // sinks while it fades
    vec4 mv = modelViewMatrix * vec4(a, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(0.018, 0.036, aRand.y) * uScale * uProj / -mv.z;
    vColor = aColor * aRand.w * 0.7;
    vAlpha = 1.0 - smoothstep(0.0, 0.7, uSettle + aRand.x * 0.2);
  }
`;

const hazeFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r = length(uv);
    if (r > 1.0) discard;
    float glow = pow(1.0 - r, 1.6);
    gl_FragColor = vec4(vColor * 1.6 * glow, glow * vAlpha);
  }
`;

const dropVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Teardrop: bright head near the bottom, tail tapering upwards.
const dropFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTail;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float hy = p.y + 0.72;
    float head = exp(-(p.x * p.x * 28.0 + hy * hy * 30.0));
    float core = exp(-(p.x * p.x * 160.0 + hy * hy * 120.0));
    float w = mix(0.02, 0.16, smoothstep(1.0, -0.7, p.y));
    float tail = exp(-p.x * p.x / (w * w)) * smoothstep(1.0, -0.55, p.y) * smoothstep(-0.95, -0.7, p.y) * uTail;
    vec3 col = uColor * (head * 1.4 + tail * 0.9) + vec3(1.0) * core * 2.5;
    float a = clamp(head + tail * 0.8 + core, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(col, a);
  }
`;

function gaussian() {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function pickBand() {
  let x = Math.random();
  for (const band of BANDS) {
    if ((x -= band.weight) <= 0) return band;
  }
  return BANDS[BANDS.length - 1];
}

const curtainStops = COLORS.curtain.map((hex) => new THREE.Color(hex));
const edgeColor = new THREE.Color(COLORS.edge);
const dustColor = new THREE.Color(COLORS.dust);
const white = new THREE.Color("#ffffff");

/** Writes one aurora particle (position, colour, brightness) at index i. */
function writeAurora(i, position, color, rand, dustChance) {
  const c = new THREE.Color();
  let brightness;
  if (Math.random() < dustChance) {
    position[i * 3] = (Math.random() - 0.5) * 34;
    position[i * 3 + 1] = (Math.random() - 0.5) * 18;
    position[i * 3 + 2] = -3 - Math.random() * 14;
    c.copy(dustColor);
    brightness = 0.15 + Math.random() * 0.3;
  } else {
    const band = pickBand();
    const t = Math.random();
    const theta = (t * 2 - 1) * band.span;
    const fall = Math.abs(gaussian());
    const radius = band.radius - fall * band.height + gaussian() * 0.02;
    position[i * 3] = band.cx + Math.sin(theta) * radius;
    position[i * 3 + 1] = band.cy - Math.cos(theta) * radius;
    position[i * 3 + 2] = band.cz + gaussian() * band.depth + Math.sin(theta * 2 + band.hue * 10) * band.twist;

    const x = Math.min(1, Math.max(0, t * 0.85 + band.hue * 0.4 + gaussian() * 0.05)) * (curtainStops.length - 1);
    const s = Math.min(Math.floor(x), curtainStops.length - 2);
    c.copy(curtainStops[s]).lerp(curtainStops[s + 1], x - s);
    // The lower edge of every band glows brand yellow, like the brand's light line.
    c.lerp(edgeColor, Math.exp(-fall * 4.5) * 0.9);
    brightness = Math.exp(-fall * 1.4) * (0.6 + Math.random() * 0.4);
    if (Math.random() < 0.02) {
      c.lerp(white, 0.6);
      brightness = 1.4;
    }
  }
  color[i * 3] = c.r;
  color[i * 3 + 1] = c.g;
  color[i * 3 + 2] = c.b;
  rand[i * 4] = Math.random();
  rand[i * 4 + 1] = Math.random();
  rand[i * 4 + 2] = Math.random();
  rand[i * 4 + 3] = brightness;
}

function buildField(cols, rows) {
  const count = cols * rows;
  const position = new Float32Array(count * 3);
  const grid = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    grid[i * 3] = ((i % cols) / (cols - 1) - 0.5) * FIELD.width;
    grid[i * 3 + 2] = (Math.floor(i / cols) / (rows - 1) - 0.5) * FIELD.depth;
    writeAurora(i, position, color, rand, 0.08);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aGrid", new THREE.BufferAttribute(grid, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  return geometry;
}

function buildHaze(count) {
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) writeAurora(i, position, color, rand, 0.06);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  return geometry;
}

function additiveMaterial(uniforms, vertexShader, fragmentShader) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Builds scenes 1–2 into `group` (story units). The caller places and scales
 * the group, then each frame asks `cameraAt` where the story camera is and
 * calls `update` to animate the particles and the spark.
 */
export function createStoryLayer({ small = false, spark = "yellow" } = {}) {
  const cols = small ? 140 : 220;
  const rows = small ? 90 : 140;
  const spacing = FIELD.width / (cols - 1);
  const group = new THREE.Group();

  const tone = COLORS.spark[spark] ? spark : "yellow";
  const sparkColor = new THREE.Color(COLORS.spark[tone]);
  const sparkLight = new THREE.Color(COLORS.sparkLight[tone]);
  const shared = {
    uTime: { value: 0 },
    uSettle: { value: 0 },
    uProj: { value: 1 },
    uScale: { value: 1 },
  };
  const uniforms = {
    ...shared,
    uWave: { value: 0 },
    uSize: { value: spacing * 0.82 },
    uDrop: { value: new THREE.Vector3(0, 8, 0) },
    uDropI: { value: 0 },
    uDropColor: { value: sparkLight },
    uFillPos: { value: new THREE.Vector3(-7, 2.5, 1) },
    uFillColor: { value: new THREE.Color(COLORS.fill) },
    uFillI: { value: 0 },
    uBase: { value: new THREE.Color(COLORS.bead) },
    uAmbient: { value: new THREE.Color(COLORS.ambient) },
    uFade: { value: 1 },
  };

  const fieldGeometry = buildField(cols, rows);
  const fieldMaterial = additiveMaterial(uniforms, fieldVertexShader, fieldFragmentShader);
  const field = new THREE.Points(fieldGeometry, fieldMaterial);
  field.frustumCulled = false;
  group.add(field);

  const hazeGeometry = buildHaze(small ? 50000 : 150000);
  const hazeMaterial = additiveMaterial(shared, hazeVertexShader, hazeFragmentShader);
  const haze = new THREE.Points(hazeGeometry, hazeMaterial);
  haze.frustumCulled = false;
  group.add(haze);

  const dropGeometry = new THREE.PlaneGeometry(0.42, 2.6);
  // Put the head (not the plane centre) at the mesh origin.
  dropGeometry.translate(0, 2.6 * 0.36, 0);
  const dropMaterial = additiveMaterial(
    { uColor: { value: sparkColor }, uOpacity: { value: 0 }, uTail: { value: 1 } },
    dropVertexShader,
    dropFragmentShader,
  );
  const drop = new THREE.Mesh(dropGeometry, dropMaterial);
  drop.visible = false;
  group.add(drop);

  const fillLocal = new THREE.Vector3(-7, 2.5, 1);

  /** Story camera at `progress`, in story units: front view of the aurora → low over the field → slow push in. */
  function cameraAt(progress, pointer, position, look) {
    const settle = ease(ramp(progress, STORY.settle));
    const dolly = ease(ramp(progress, STORY.wave));
    position.set(
      pointer.x * 0.35,
      lerp(0.6, 2.4, settle) - dolly * 0.3 + pointer.y * 0.18,
      lerp(13, 10.5, settle) - dolly * 1.2,
    );
    // Low, near-horizontal view: field in the lower half, room above for the falling spark.
    look.set(0, lerp(-0.8, 1.4, settle), lerp(0, -0.6, settle));
  }

  /**
   * Animates scenes 1–2 at `progress`. `proj` converts sizes to pixels for the
   * current camera; `fade` dims the whole layer (the zoom-out). Returns the
   * impact flash (0–1) so the caller can push its bloom.
   */
  function update(progress, time, { camera, proj, fade = 1 }) {
    const settle = ease(ramp(progress, STORY.settle));
    const fall = ramp(progress, STORY.drop);
    const wave = ramp(progress, STORY.wave);
    const impact = STORY.drop[1];
    const impacted = progress >= impact;

    // The spark: accelerates down, lands, then hovers as the field's light.
    const afterImpact = ramp(progress, [impact, impact + 0.12]);
    const dropY = impacted ? lerp(0.25, 0.9, ease(afterImpact)) : lerp(5.2, 0.25, fall * fall);
    drop.position.set(0, dropY, 0);
    drop.quaternion.copy(camera.quaternion);
    drop.visible = fall > 0 && fade > 0.001;
    drop.scale.set(1, impacted ? 1 : 0.7 + fall * 0.6, 1);
    dropMaterial.uniforms.uOpacity.value = Math.min(1, fall * 6) * fade;
    dropMaterial.uniforms.uTail.value = impacted ? 1 - ramp(progress, [impact, impact + 0.03]) : 1;

    const flash = impacted ? Math.exp(-ramp(progress, [impact, STORY.wave[1]]) * 10) : 0;
    group.updateMatrixWorld();
    group.localToWorld(uniforms.uDrop.value.copy(drop.position));
    group.localToWorld(uniforms.uFillPos.value.copy(fillLocal));
    uniforms.uDropI.value = fall > 0 ? 0.45 + fall * 0.35 + flash * 3 : 0;
    uniforms.uFillI.value = wave;
    uniforms.uWave.value = wave;
    uniforms.uFade.value = fade;
    shared.uSettle.value = settle;
    shared.uTime.value = time;
    shared.uProj.value = proj;
    shared.uScale.value = group.scale.x;
    haze.visible = settle < 1;
    field.visible = fade > 0.001;
    return flash;
  }

  /** The spark's position in world space (for a real light that follows it). */
  function sparkWorld(target) {
    return group.localToWorld(target.copy(drop.position));
  }

  function dispose() {
    [fieldGeometry, fieldMaterial, hazeGeometry, hazeMaterial, dropGeometry, dropMaterial].forEach((thing) => thing.dispose());
  }

  return { group, cameraAt, update, sparkWorld, dispose };
}
