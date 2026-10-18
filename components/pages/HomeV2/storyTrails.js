import * as THREE from "three";
import { ramp } from "./storyTimeline";

const lineVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A line of light drawn along a tube: lit behind its head, brightest at it.
const lineFragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uOpacity;
  uniform float uDone;
  uniform vec3 uColor;
  uniform vec3 uHead;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProgress) discard;
    // The head burns bright while travelling, then settles once it arrives.
    float head = smoothstep(uProgress - 0.14, uProgress, vUv.x) * (1.0 - uDone * 0.85);
    vec3 col = uColor * 0.55 + uHead * head * 2.2;
    gl_FragColor = vec4(col, (0.45 + head) * uOpacity);
  }
`;

// Arrival ping on the map: one expanding ring, then a steady dot.
const pingFragmentShader = /* glsl */ `
  uniform float uAge;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float k = (r - uAge) / 0.07;
    float ring = exp(-k * k) * (1.0 - uAge) * step(0.001, uAge);
    float dot = exp(-r * r * 90.0) * step(0.001, uAge);
    gl_FragColor = vec4(uColor * (ring * 1.5 + dot * 2.2), (ring + dot) * uOpacity);
  }
`;

function additive(uniforms, fragmentShader) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: lineVertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** A tube that draws itself as a line of light; drive uProgress / uOpacity. */
export function createLightLine(curve, { radius = 0.016, segments = 96, color, head }) {
  const geometry = new THREE.TubeGeometry(curve, segments, radius, 6, false);
  const material = additive(
    { uProgress: { value: 0 }, uOpacity: { value: 0 }, uDone: { value: 0 }, uColor: { value: color }, uHead: { value: head } },
    lineFragmentShader,
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return { mesh, material, geometry };
}

/**
 * Light trails arcing from an origin to each city, one after another across
 * `range` (story progress). Each arrival leaves a ping and a lit dot.
 */
export function createTrails({ origin, cities, color, head, range }) {
  const group = new THREE.Group();
  const duration = 0.035;
  const [from, to] = range;
  const pingGeometry = new THREE.PlaneGeometry(1.4, 1.4);
  pingGeometry.rotateX(-Math.PI / 2);

  const trails = cities.map((city, i) => {
    const distance = origin.distanceTo(city.pos);
    const control = origin.clone().lerp(city.pos, 0.5);
    control.y += distance * 0.32 + 0.4;
    const line = createLightLine(new THREE.QuadraticBezierCurve3(origin, control, city.pos), {
      radius: 0.018,
      segments: 64,
      color,
      head,
    });
    group.add(line.mesh);

    const pingMaterial = additive({ uAge: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: head } }, pingFragmentShader);
    const ping = new THREE.Mesh(pingGeometry, pingMaterial);
    ping.position.copy(city.pos).setY(city.pos.y + 0.02);
    group.add(ping);

    const start = from + ((to - from - duration) * i) / Math.max(1, cities.length - 1);
    return { line, pingMaterial, start, pos: city.pos };
  });

  /** Updates every trail; returns how far each city's arrival has faded in (0–1). */
  function update(progress, opacity, arrivals) {
    trails.forEach((trail, i) => {
      trail.line.material.uniforms.uProgress.value = ramp(progress, [trail.start, trail.start + duration]);
      trail.line.material.uniforms.uDone.value = ramp(progress, [trail.start + duration, trail.start + duration + 0.03]);
      trail.line.material.uniforms.uOpacity.value = opacity;
      trail.pingMaterial.uniforms.uAge.value = ramp(progress, [trail.start + duration, trail.start + duration + 0.025]);
      trail.pingMaterial.uniforms.uOpacity.value = opacity;
      arrivals[i] = ramp(progress, [trail.start + duration * 0.8, trail.start + duration + 0.01]) * opacity;
    });
    return arrivals;
  }

  function dispose() {
    pingGeometry.dispose();
    trails.forEach((trail) => {
      trail.line.geometry.dispose();
      trail.line.material.dispose();
      trail.pingMaterial.dispose();
    });
  }

  return { group, update, positions: trails.map((t) => t.pos), dispose };
}
