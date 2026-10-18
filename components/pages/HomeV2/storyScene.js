import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { STORY, OVERLAYS, ramp, ease, lerp, fade } from "./storyTimeline";
import { createCameraPath } from "./storyCamera";
import { createCore, insideHex, CORE } from "./storyCore";
import { createLightLine, createTrails } from "./storyTrails";
import { germanyDots, germanyCities } from "./storyGermany";

/*
 * The home story: one particle system that plays every scene.
 *
 * Each field particle owns a position for every chapter: a spot in the aurora
 * (1, noise), a cell in the bead field (2, the spark), the same cell folded up
 * into the gate's walls (3), a bead on one of the core's layers (4) and a dot
 * on the map of Germany, or the dust around it (5). Scroll blends from one to
 * the next, staggered per particle so they stream rather than jump. A denser
 * aurora-only haze adds detail to scene 1 and fades as the field settles.
 */

const FIELD = { width: 22, depth: 14 };
const GAP = 1.6; // half-width of the gate's floor
const CORE_CENTER = new THREE.Vector3(0, 0, -18);
const BERLIN = new THREE.Vector3(0, -0.6, -18); // the map lies on y = -0.6, Berlin under the core
const FOV = 38;
const BLOOM = { strength: 0.55 };

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
  steel: "#8d97ab",
  white: "#ffffff",
  mapDim: "#2c3442",
  mapLit: "#fff6d2",
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
  uniform float uFold;
  uniform float uCore;
  uniform float uExplode;
  uniform float uSpin;
  uniform float uMap;
  uniform float uLit;
  uniform float uSize;
  uniform float uCoreSize;
  uniform float uProj;
  uniform vec3 uCoreCenter;
  uniform vec3 uBerlin;
  uniform vec3 uDrop;
  uniform float uDropI;
  uniform vec3 uFillPos;

  attribute vec3 aGrid;
  attribute vec3 aCore; // x, layer index, z: local to the core
  attribute vec4 aMap; // world position on the map; w = 1 map dot, 0 dust
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
  varying float vCore;
  varying float vLayer;
  varying float vEdge;
  varying float vMapMix;
  varying float vLit;

  const float GAP = ${GAP.toFixed(2)};
  const float CORE_R = ${CORE.radius.toFixed(2)};

  ${auroraDrift}

  void main() {
    float t = uTime;
    vec3 a = auroraDrift(position, aRand, t);

    // 1 → 2: the aurora settles into a loose, restless layer over the field.
    vec3 g = aGrid;
    float d = length(g.xz);
    vec3 loose = g + vec3(
      sin(t * 0.35 + aRand.x * 6.283 + g.z * 0.6) * 0.45,
      0.35 + sin(t * 0.5 + aRand.y * 6.283 + g.x * 0.4) * 0.35 + aRand.z * 0.9,
      cos(t * 0.3 + aRand.z * 6.283 + g.x * 0.5) * 0.45
    );
    float settle = smoothstep(0.0, 1.0, clamp(uSettle * 1.6 - aRand.x * 0.6, 0.0, 1.0));
    vec3 p = mix(a, loose, settle);

    // 2: the spark's wave front snaps everything it has passed into the grid.
    float front = uWave * 16.0;
    float morph = (1.0 - smoothstep(front - 2.2, front, d)) * step(0.0001, uWave);
    float calm = 1.0 - uFold;
    float behind = (d - front) / 1.1; // pow() is undefined for negative bases
    float ring = exp(-behind * behind) * sin((d - front) * 3.2 - t * 2.0) * 0.35 * calm;
    float swell = sin(d * 1.6 - t * 1.4) * 0.05 * exp(-d * 0.08) * calm;

    // 3: the field folds up on two hinges into the walls of a gate.
    float hinge = uFold * 1.5707963;
    float rise = max(abs(g.x) - GAP, 0.0);
    float side = g.x < 0.0 ? -1.0 : 1.0;
    vec3 field = vec3(side * (min(abs(g.x), GAP) + rise * cos(hinge)), rise * sin(hinge) + ring + swell, g.z);
    p = mix(p, field, morph);

    // 4: everything streams into the core's three layers.
    float core = smoothstep(0.0, 1.0, clamp(uCore * 1.6 - aRand.y * 0.6, 0.0, 1.0));
    float cs = cos(uSpin);
    float sn = sin(uSpin);
    float layerY = aCore.y * mix(${CORE.compact.toFixed(2)}, ${CORE.exploded.toFixed(2)}, uExplode) + 0.02;
    vec3 coreLocal = vec3(aCore.x * cs + aCore.z * sn, layerY, -aCore.x * sn + aCore.z * cs);
    p = mix(p, uCoreCenter + coreLocal, core);
    p.y += sin(core * 3.14159) * 1.6;

    // 5: the core lets go and the particles rain down into Germany.
    float mapT = smoothstep(0.0, 1.0, clamp(uMap * 1.6 - aRand.z * 0.6, 0.0, 1.0));
    p = mix(p, aMap.xyz, mapT);
    p.y += sin(mapT * 3.14159) * 1.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = mix(mix(0.026, 0.05, aRand.y), mix(uSize, uCoreSize, core), morph);
    size = mix(size, aMap.w > 0.5 ? 0.06 : 0.03, mapT);
    size *= 1.0 - 0.45 * (sin(core * 3.14159) + sin(mapT * 3.14159)); // smaller mid-flight
    // Clamp, and fade out what flies right past the lens, so nothing balloons.
    gl_PointSize = min(size * uProj / -mv.z, 48.0);
    float nearFade = smoothstep(1.2, 4.0, -mv.z);

    vec3 toDrop = (viewMatrix * vec4(uDrop, 1.0)).xyz - mv.xyz;
    float d1 = length(toDrop);
    vL1 = toDrop / d1;
    vA1 = uDropI / (1.0 + d1 * d1 * 0.12);

    vec3 toFill = (viewMatrix * vec4(uFillPos, 1.0)).xyz - mv.xyz;
    float d2 = length(toFill);
    vL2 = toFill / d2;
    vA2 = 1.0 / (1.0 + d2 * d2 * 0.05);

    vColor = aColor;
    vBright = aRand.w;
    vMorph = morph * (1.0 - mapT);
    // Fade the field out at the sides and, harder, towards the horizon.
    float edge = 1.0 - smoothstep(6.0, 11.0, length(vec2(g.x * 0.75, g.z * (g.z < 0.0 ? 1.55 : 1.0))));
    float fadeV = mix(mix(1.0, edge, max(settle, morph)), 1.0, core);
    vFade = mix(fadeV, aMap.w > 0.5 ? 1.0 : 0.22, mapT) * nearFade;

    vCore = core * (1.0 - mapT);
    vLayer = aCore.y;
    float hexR = max(abs(aCore.z) / 0.866, (abs(aCore.x) * 0.866 + abs(aCore.z) * 0.5) / 0.866);
    vEdge = smoothstep(0.93, 1.0, hexR / CORE_R);
    vMapMix = mapT;
    float fromBerlin = length(aMap.xz - uBerlin.xz);
    vLit = (1.0 - smoothstep(uLit * 7.5 - 0.6, uLit * 7.5, fromBerlin)) * aMap.w;
  }
`;

const fieldFragmentShader = /* glsl */ `
  uniform vec3 uDropColor;
  uniform vec3 uFillColor;
  uniform float uFillI;
  uniform vec3 uBase;
  uniform vec3 uAmbient;
  uniform vec3 uEdgeColor;
  uniform vec3 uMapDim;
  uniform vec3 uMapLit;

  varying vec3 vColor;
  varying float vBright;
  varying float vMorph;
  varying float vFade;
  varying vec3 vL1;
  varying float vA1;
  varying vec3 vL2;
  varying float vA2;
  varying float vCore;
  varying float vLayer;
  varying float vEdge;
  varying float vMapMix;
  varying float vLit;

  void main() {
    vec2 uv = vec2(gl_PointCoord.x * 2.0 - 1.0, 1.0 - gl_PointCoord.y * 2.0);
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;
    float r = sqrt(r2);

    // Glowing dot: the aurora (1) and the map (5), which stays dim until the
    // light from Berlin reaches it.
    float glow = pow(1.0 - r, 1.6);
    vec3 dotCol = vColor * vBright * 1.6 * glow;
    dotCol = mix(dotCol, mix(uMapDim, uMapLit * 1.15, vLit) * glow, vMapMix);

    // Lit bead (2–4), with a sphere normal faked from the sprite.
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
    // On the core, the agents layer stays dim so its network reads, and every
    // layer's border picks up the yellow rim.
    float agents = step(0.5, vLayer) * step(vLayer, 1.5);
    bead *= 1.0 - agents * 0.55 * vCore;
    bead += uEdgeColor * vEdge * 0.15 * vCore;
    bead *= 1.0 - smoothstep(0.75, 1.0, r) * 0.6;

    vec3 col = mix(dotCol, bead, vMorph);
    float alpha = mix(glow, 1.0 - smoothstep(0.92, 1.0, r), vMorph) * vFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

const hazeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSettle;
  uniform float uProj;

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
    gl_PointSize = mix(0.018, 0.036, aRand.y) * uProj / -mv.z;
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

const uvVertexShader = /* glsl */ `
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

// The gate's walls of light: brightest along the floor, fading up and at both ends.
const sheetFragmentShader = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float lift = 1.0 - vUv.y;
    float ends = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
    float glow = lift * lift * ends;
    gl_FragColor = vec4(mix(uHigh, uLow, lift * lift * lift) * glow, glow * uOpacity);
  }
`;

function gaussian() {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
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
const white = new THREE.Color(COLORS.white);

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

/** Hex lattice of `count` points (x, z) on a core layer, densest that fits. */
function coreLattice(count) {
  const r = CORE.radius;
  const spacing = Math.sqrt((3 * r * r) / count) * 0.97;
  const points = [];
  for (let row = 0, z = -r; z <= r; row++, z += spacing * 0.866) {
    for (let x = -r + (row % 2) * spacing * 0.5; x <= r; x += spacing) {
      if (insideHex(x, z, r)) points.push([x, z]);
    }
  }
  shuffle(points);
  while (points.length < count) points.push(points[Math.floor(Math.random() * points.length)]);
  return { points: points.slice(0, count), spacing };
}

function buildField(cols, rows) {
  const count = cols * rows;
  const position = new Float32Array(count * 3);
  const grid = new Float32Array(count * 3);
  const core = new Float32Array(count * 3);
  const map = new Float32Array(count * 4);
  const color = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);

  const perLayer = Math.ceil(count / 3);
  const lattice = coreLattice(perLayer);
  const dots = germanyDots(0.11);
  const order = shuffle(Array.from({ length: count }, (_, i) => i));

  for (let i = 0; i < count; i++) {
    grid[i * 3] = ((i % cols) / (cols - 1) - 0.5) * FIELD.width;
    grid[i * 3 + 2] = (Math.floor(i / cols) / (rows - 1) - 0.5) * FIELD.depth;

    const layer = i % 3;
    const [cx, cz] = lattice.points[Math.floor(i / 3)];
    core[i * 3] = cx;
    core[i * 3 + 1] = layer;
    core[i * 3 + 2] = cz;

    writeAurora(i, position, color, rand, 0.08);
  }

  // A shuffled subset becomes the map; the rest settles as dust around it.
  order.forEach((particle, k) => {
    const o = particle * 4;
    if (k < dots.length) {
      map[o] = BERLIN.x + dots[k][0];
      map[o + 1] = BERLIN.y;
      map[o + 2] = BERLIN.z + dots[k][1];
      map[o + 3] = 1;
    } else {
      const a = Math.random() * Math.PI * 2;
      const r = 7 + Math.random() * 15;
      map[o] = BERLIN.x - 2 + Math.cos(a) * r;
      map[o + 1] = BERLIN.y + gaussian() * 0.15;
      map[o + 2] = BERLIN.z + 1.5 + Math.sin(a) * r;
      map[o + 3] = 0;
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aGrid", new THREE.BufferAttribute(grid, 3));
  geometry.setAttribute("aCore", new THREE.BufferAttribute(core, 3));
  geometry.setAttribute("aMap", new THREE.BufferAttribute(map, 4));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  return { geometry, coreSpacing: lattice.spacing };
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

function additiveMaterial(uniforms, vertexShader, fragmentShader, extra = {}) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    ...extra,
  });
}

/**
 * Builds the story into `canvas`. `render(progress, time, pointer)` draws one
 * frame and returns where the HTML overlays (orbit labels, hotspots, city
 * labels, Berlin) sit on screen, in CSS pixels, with their opacity.
 */
export function createStoryScene(canvas, { spark = "yellow", reducedMotion = false } = {}) {
  const small = window.innerWidth < 768;
  const cols = small ? 140 : 220;
  const rows = small ? 90 : 140;
  const spacing = FIELD.width / (cols - 1);
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
    // Lets dev screenshots read the canvas; costs a little, so dev only.
    preserveDrawingBuffer: process.env.NODE_ENV !== "production",
  });
  renderer.setPixelRatio(dpr);
  // Pure black: with the composer's float targets three.js colour-converts a
  // non-black clear colour twice, which lifts the background to grey.
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment; // soft reflections on the core's charcoal plates

  const tone = COLORS.spark[spark] ? spark : "yellow";
  const sparkColor = new THREE.Color(COLORS.spark[tone]);
  const sparkLight = new THREE.Color(COLORS.sparkLight[tone]);
  const accent = new THREE.Color(COLORS.edge);
  const steel = new THREE.Color(COLORS.steel);

  const { geometry: fieldGeometry, coreSpacing } = buildField(cols, rows);
  const shared = {
    uTime: { value: 0 },
    uSettle: { value: 0 },
    uProj: { value: 1 },
  };
  const uniforms = {
    ...shared,
    uWave: { value: 0 },
    uFold: { value: 0 },
    uCore: { value: 0 },
    uExplode: { value: 0 },
    uSpin: { value: 0 },
    uMap: { value: 0 },
    uLit: { value: 0 },
    uSize: { value: spacing * 0.82 },
    uCoreSize: { value: coreSpacing * 0.6 }, // gaps let the charcoal plate show through
    uCoreCenter: { value: CORE_CENTER.clone() },
    uBerlin: { value: BERLIN.clone() },
    uDrop: { value: new THREE.Vector3(0, 8, 0) },
    uDropI: { value: 0 },
    uDropColor: { value: sparkLight },
    uFillPos: { value: new THREE.Vector3(-7, 2.5, 1) },
    uFillColor: { value: new THREE.Color(COLORS.fill) },
    uFillI: { value: 0 },
    uBase: { value: new THREE.Color(COLORS.bead) },
    uAmbient: { value: new THREE.Color(COLORS.ambient) },
    uEdgeColor: { value: accent },
    uMapDim: { value: new THREE.Color(COLORS.mapDim) },
    uMapLit: { value: new THREE.Color(COLORS.mapLit) },
  };

  const fieldMaterial = additiveMaterial(uniforms, fieldVertexShader, fieldFragmentShader);
  const field = new THREE.Points(fieldGeometry, fieldMaterial);
  field.frustumCulled = false;
  scene.add(field);

  const hazeGeometry = buildHaze(small ? 50000 : 150000);
  const hazeMaterial = additiveMaterial(shared, hazeVertexShader, hazeFragmentShader);
  const haze = new THREE.Points(hazeGeometry, hazeMaterial);
  haze.frustumCulled = false;
  scene.add(haze);

  const dropGeometry = new THREE.PlaneGeometry(0.42, 2.6);
  // Put the head (not the plane centre) at the mesh origin.
  dropGeometry.translate(0, 2.6 * 0.36, 0);
  const dropMaterial = additiveMaterial(
    { uColor: { value: sparkColor }, uOpacity: { value: 0 }, uTail: { value: 1 } },
    uvVertexShader,
    dropFragmentShader,
  );
  const drop = new THREE.Mesh(dropGeometry, dropMaterial);
  drop.visible = false;
  scene.add(drop);

  // Scene 3: two walls of light along the gate, and the line the spark draws.
  const sheetGeometry = new THREE.PlaneGeometry(15, 6.5);
  const sheetMaterial = additiveMaterial(
    { uLow: { value: sparkLight }, uHigh: { value: steel }, uOpacity: { value: 0 } },
    uvVertexShader,
    sheetFragmentShader,
    { side: THREE.DoubleSide },
  );
  [-1, 1].forEach((side) => {
    const sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);
    sheet.position.set(side * (GAP + 0.05), 3.25, 0);
    sheet.rotation.y = (-side * Math.PI) / 2;
    scene.add(sheet);
  });
  const floorLine = createLightLine(
    new THREE.LineCurve3(new THREE.Vector3(0, 0.03, 8), new THREE.Vector3(0, 0.03, CORE_CENTER.z)),
    { radius: 0.012, segments: 200, color: accent, head: white },
  );
  scene.add(floorLine.mesh);

  // Scene 4: the core, lit from the spark inside it.
  const core = createCore({ charcoal: new THREE.Color(COLORS.bead), accent, steel, warm: sparkLight });
  scene.add(core.group);
  const coreLight = new THREE.PointLight(sparkLight, 0, 0, 2);
  scene.add(coreLight);
  scene.add(new THREE.AmbientLight(COLORS.white, 0.25));
  const fillLight = new THREE.DirectionalLight(COLORS.fill, 0.9);
  fillLight.position.set(-6, 8, -10);
  scene.add(fillLight);

  // Scene 5: trails from Berlin to the cities.
  const cities = germanyCities().map(
    (city) => new THREE.Vector3(BERLIN.x + city.offset[0], BERLIN.y + 0.02, BERLIN.z + city.offset[1]),
  );
  const trails = createTrails({
    origin: new THREE.Vector3(BERLIN.x, BERLIN.y + 0.02, BERLIN.z),
    cities: cities.map((pos) => ({ pos })),
    color: accent,
    head: white,
    range: STORY.lit,
  });
  scene.add(trails.group);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM.strength, 0.4, 0.35);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    shared.uProj.value = (height * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  const cameraPath = createCameraPath({ small });
  const camPos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const corePos = new THREE.Vector3();
  const berlinPin = new THREE.Vector3(BERLIN.x, BERLIN.y + 0.03, BERLIN.z);
  const fillScene2 = new THREE.Vector3(-7, 2.5, 1);
  const fillCore = new THREE.Vector3(-6, 5, -14);
  const projected = new THREE.Vector3();
  const toCamera = new THREE.Vector3();
  const fromCore = new THREE.Vector3();

  const orbitWorld = Array.from({ length: core.orbitLabels }, () => new THREE.Vector3());
  const hotspotWorld = Array.from({ length: 3 }, () => new THREE.Vector3());
  const arrivals = new Array(cities.length).fill(0);
  const overlays = {
    orbit: orbitWorld.map(() => ({ x: 0, y: 0, a: 0 })),
    hotspots: hotspotWorld.map(() => ({ x: 0, y: 0, a: 0 })),
    cities: cities.map(() => ({ x: 0, y: 0, a: 0 })),
    berlin: { x: 0, y: 0, a: 0 },
  };

  const toScreen = (world, out, alpha) => {
    projected.copy(world).project(camera);
    out.x = (projected.x * 0.5 + 0.5) * width;
    out.y = (-projected.y * 0.5 + 0.5) * height;
    out.a = projected.z < 1 ? alpha : 0;
  };

  function render(progress, time, pointer) {
    const settle = ease(ramp(progress, STORY.settle));
    const fall = ramp(progress, STORY.drop);
    const wave = ramp(progress, STORY.wave);
    const fold = ease(ramp(progress, STORY.fold));
    const corridor = ease(ramp(progress, STORY.corridor));
    const coreIn = ramp(progress, STORY.core);
    const explode = ease(ramp(progress, STORY.explode));
    const mapIn = ramp(progress, STORY.map);
    const lit = ramp(progress, STORY.lit);
    const impact = STORY.drop[1];
    const impacted = progress >= impact;
    const clock = reducedMotion ? 0 : time;

    cameraPath(progress, camPos, look);
    camPos.x += pointer.x * 0.35;
    camPos.y += pointer.y * 0.18;
    camera.position.copy(camPos);
    camera.lookAt(look);

    // The core: forms, explodes, then shrinks into a pin on Berlin.
    const shrink = ease(mapIn);
    const coreScale = lerp(1, 0.16, shrink);
    const gap = lerp(CORE.compact, CORE.exploded, explode);
    const spin = clock * 0.06 + progress * 2.0;
    const coreVisible = ramp(progress, [STORY.core[0] + 0.03, STORY.core[1]]);
    corePos.lerpVectors(CORE_CENTER, berlinPin, shrink);
    core.update({
      position: corePos,
      scale: coreScale,
      spin,
      gap,
      visible: coreVisible,
      orbitVisible: fade(progress, OVERLAYS.orbit),
      time: clock,
    });

    // The spark: falls, lands, leads through the gate, settles inside the core,
    // then hovers over Berlin as the source of the trails.
    let sparkY;
    let sparkZ = 0;
    if (!impacted) {
      sparkY = lerp(5.2, 0.25, fall * fall);
    } else {
      sparkY = lerp(0.25, 0.9, ease(ramp(progress, [impact, impact + 0.06])));
      sparkZ = lerp(0, CORE_CENTER.z, corridor);
      sparkY = lerp(sparkY, CORE_CENTER.y + gap * 0.5, corridor);
      sparkY = lerp(sparkY, BERLIN.y + 0.7, shrink);
    }
    drop.position.set(0, sparkY, sparkZ);
    drop.quaternion.copy(camera.quaternion);
    drop.visible = fall > 0;
    drop.scale.set(1, impacted ? 1 : 0.7 + fall * 0.6, 1);
    dropMaterial.uniforms.uOpacity.value = Math.min(1, fall * 6);
    dropMaterial.uniforms.uTail.value = impacted ? 1 - ramp(progress, [impact, impact + 0.02]) : 1;

    const flash = impacted ? Math.exp(-ramp(progress, [impact, STORY.wave[1]]) * 10) : 0;
    uniforms.uDrop.value.copy(drop.position);
    // Softer inside the core, where the beads sit close to the spark.
    const sparkPower = lerp(0.45 + fall * 0.35, 0.3, ease(coreIn));
    uniforms.uDropI.value = fall > 0 ? sparkPower + flash * 3 : 0;
    coreLight.position.copy(drop.position);
    coreLight.intensity = 6 * coreVisible * (1 - shrink * 0.7);
    uniforms.uFillPos.value.lerpVectors(fillScene2, fillCore, ease(coreIn));
    uniforms.uFillI.value = wave;

    // The gate's light, and the yellow line the spark leaves on its floor.
    sheetMaterial.uniforms.uOpacity.value = fold * 0.3 * (1 - ramp(progress, [STORY.core[0], STORY.core[0] + 0.06]));
    floorLine.material.uniforms.uProgress.value = Math.min(1, Math.max(0, (8 - sparkZ) / (8 - CORE_CENTER.z)));
    floorLine.material.uniforms.uOpacity.value =
      ramp(progress, [STORY.corridor[0], STORY.corridor[0] + 0.02]) * (1 - ramp(progress, [STORY.map[0], STORY.map[0] + 0.04]));

    trails.update(progress, ramp(progress, [STORY.lit[0], STORY.lit[0] + 0.01]), arrivals);

    uniforms.uWave.value = wave;
    uniforms.uFold.value = fold;
    uniforms.uCore.value = coreIn;
    uniforms.uExplode.value = explode;
    uniforms.uSpin.value = spin;
    uniforms.uMap.value = mapIn;
    uniforms.uLit.value = lit;
    shared.uSettle.value = settle;
    shared.uTime.value = clock;
    haze.visible = settle < 1;
    bloom.strength = BLOOM.strength + flash * 1.2;

    composer.render();

    // Where the HTML overlays sit this frame.
    const orbitAlpha = fade(progress, OVERLAYS.orbit);
    core.orbitAnchors(orbitWorld).forEach((world, i) => {
      // Labels on the far side of the ring fade back.
      toCamera.copy(camera.position).sub(corePos).normalize();
      fromCore.copy(world).sub(corePos).normalize();
      const front = 0.35 + 0.65 * Math.min(1, Math.max(0, toCamera.dot(fromCore) * 0.5 + 0.5));
      toScreen(world, overlays.orbit[i], orbitAlpha * front);
    });
    const hotspotAlpha = fade(progress, OVERLAYS.hotspots);
    core.hotspotAnchors(hotspotWorld).forEach((world, i) => toScreen(world, overlays.hotspots[i], hotspotAlpha));
    cities.forEach((world, i) => toScreen(world, overlays.cities[i], arrivals[i]));
    toScreen(berlinPin, overlays.berlin, ramp(progress, [STORY.map[1], STORY.map[1] + 0.02]));
    return overlays;
  }

  function dispose() {
    resizeObserver.disconnect();
    [fieldGeometry, fieldMaterial, hazeGeometry, hazeMaterial, dropGeometry, dropMaterial, sheetGeometry, sheetMaterial].forEach(
      (thing) => thing.dispose(),
    );
    floorLine.geometry.dispose();
    floorLine.material.dispose();
    core.dispose();
    trails.dispose();
    environment.dispose();
    pmrem.dispose();
    composer.dispose();
    renderer.dispose();
    if (window.__story?.renderer === renderer) delete window.__story;
  }

  // Dev-only handle for inspecting frames from the console.
  if (process.env.NODE_ENV !== "production") window.__story = { renderer, composer, bloom, uniforms, scene, render };

  return { render, dispose };
}
