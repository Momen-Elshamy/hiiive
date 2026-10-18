import * as THREE from "three";

/*
 * Scene 4: the Hiiive core. Three charcoal hex plates with glowing yellow
 * rims (the brand's charcoal cube, turned into a hive cell), stacked and then
 * exploded: Data at the bottom, Models & agents in the middle (a network of
 * nodes), Products & services on top (a soft glowing face). The field
 * particles land on the plates as beads; see storyScene.js.
 */

export const CORE = {
  radius: 3.3, // bead disc the particles land on
  plate: 3.5, // charcoal plate
  compact: 0.5, // layer spacing while stacked
  exploded: 1.9, // layer spacing once exploded
};

const ORBIT_RADIUS = 5.2;
const ORBIT_LABELS = 5;

const hexVertices = (r) => [0, 1, 2, 3, 4, 5].map((i) => [Math.cos((i * Math.PI) / 3) * r, Math.sin((i * Math.PI) / 3) * r]);

/** Is (x, z) inside the hexagon of circumradius r (vertices at 0°, 60°, …)? */
export function insideHex(x, z, r) {
  const ax = Math.abs(x);
  const az = Math.abs(z);
  return az <= r * 0.866 && ax * 0.866 + az * 0.5 <= r * 0.866;
}

class HexCurve extends THREE.Curve {
  constructor(r) {
    super();
    this.vertices = hexVertices(r);
  }

  getPoint(t, target = new THREE.Vector3()) {
    const s = (t % 1) * 6;
    const i = Math.floor(s);
    const f = s - i;
    const [x0, z0] = this.vertices[i % 6];
    const [x1, z1] = this.vertices[(i + 1) % 6];
    return target.set(x0 + (x1 - x0) * f, 0, z0 + (z1 - z0) * f);
  }
}

class CircleCurve extends THREE.Curve {
  constructor(r) {
    super();
    this.r = r;
  }

  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    return target.set(Math.cos(a) * this.r, 0, Math.sin(a) * this.r);
  }
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.6)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const faceVertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Products layer: a soft lit "screen" with faint concentric hex rings.
const faceFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vPos;
  void main() {
    float ax = abs(vPos.x);
    float az = abs(vPos.z);
    float hex = max(az / 0.866, (ax * 0.866 + az * 0.5) / 0.866) / ${CORE.plate.toFixed(2)};
    float body = (1.0 - smoothstep(0.0, 1.0, hex)) * 0.22;
    float rings = smoothstep(0.92, 1.0, sin(hex * 40.0) * 0.5 + 0.5) * 0.12 * (1.0 - hex);
    gl_FragColor = vec4(uColor * (body + rings), (body + rings) * uOpacity);
  }
`;

export function createCore({ charcoal, accent, steel, warm }) {
  // root follows position/scale; group (the plates) also spins; the orbit doesn't.
  const root = new THREE.Group();
  const group = new THREE.Group();
  root.add(group);
  const disposables = [];
  const keep = (thing) => {
    disposables.push(thing);
    return thing;
  };

  const shape = new THREE.Shape(hexVertices(CORE.plate).map(([x, z]) => new THREE.Vector2(x, z)));
  const plateGeometry = keep(
    new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.03, bevelSegments: 2 }),
  );
  plateGeometry.rotateX(-Math.PI / 2); // shape → xz plane, extrusion → +y
  plateGeometry.translate(0, -0.14, 0); // top face at y = 0
  const plateMaterial = keep(
    new THREE.MeshStandardMaterial({ color: charcoal, metalness: 0.6, roughness: 0.42, envMapIntensity: 0.4, transparent: true, opacity: 0 }),
  );

  // A thin line of yellow, like the brand cube's edge, not a neon tube.
  const rimGeometry = keep(new THREE.TubeGeometry(new HexCurve(CORE.plate + 0.005), 144, 0.009, 6, true));
  const rimMaterial = keep(
    new THREE.MeshBasicMaterial({ color: accent.clone().multiplyScalar(1.1), transparent: true, opacity: 0, depthWrite: false }),
  );

  const layers = [0, 1, 2].map(() => {
    const layer = new THREE.Group();
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.renderOrder = -2; // before the (additive) beads, so it hides only what is behind it
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.renderOrder = -1;
    layer.add(plate, rim);
    group.add(layer);
    return layer;
  });

  // Models & agents: a network of nodes on the middle layer.
  const nodes = [];
  while (nodes.length < 54) {
    const x = (Math.random() * 2 - 1) * CORE.radius;
    const z = (Math.random() * 2 - 1) * CORE.radius;
    if (insideHex(x, z, CORE.radius * 0.9)) nodes.push(new THREE.Vector3(x, 0.05, z));
  }
  const edges = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceTo(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => edges.push(node, nodes[j]));
  });
  const networkGeometry = keep(new THREE.BufferGeometry().setFromPoints(edges));
  const networkMaterial = keep(
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  layers[1].add(new THREE.LineSegments(networkGeometry, networkMaterial));

  const nodeGeometry = keep(new THREE.BufferGeometry().setFromPoints(nodes));
  const nodeTexture = keep(glowTexture());
  const nodeMaterial = keep(
    new THREE.PointsMaterial({
      color: accent,
      size: 0.28,
      map: nodeTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  layers[1].add(new THREE.Points(nodeGeometry, nodeMaterial));

  // Products & services: a soft glowing face on the top layer.
  const faceGeometry = keep(new THREE.ShapeGeometry(shape));
  faceGeometry.rotateX(-Math.PI / 2);
  const faceMaterial = keep(
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: warm }, uOpacity: { value: 0 } },
      vertexShader: faceVertexShader,
      fragmentShader: faceFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  const face = new THREE.Mesh(faceGeometry, faceMaterial);
  face.position.y = 0.04;
  layers[2].add(face);

  // Orbit ring the service labels ride on.
  const orbit = new THREE.Group();
  orbit.rotation.set(0.2, 0, -0.08);
  const ringMaterial = keep(new THREE.MeshBasicMaterial({ color: steel, transparent: true, opacity: 0, depthWrite: false }));
  orbit.add(new THREE.Mesh(keep(new THREE.TubeGeometry(new CircleCurve(ORBIT_RADIUS), 200, 0.007, 4, true)), ringMaterial));
  root.add(orbit);

  let orbitTurn = 0;
  let spacing = CORE.compact;

  function update({ position, scale, spin, gap, visible, orbitVisible, time }) {
    spacing = gap;
    root.position.copy(position);
    root.scale.setScalar(scale);
    group.rotation.y = spin;
    layers.forEach((layer, i) => {
      layer.position.y = i * gap;
    });
    orbit.position.y = gap;
    orbitTurn = time * 0.08;

    plateMaterial.opacity = visible;
    rimMaterial.opacity = visible;
    networkMaterial.opacity = visible * (0.35 + 0.15 * Math.sin(time * 2.0));
    nodeMaterial.opacity = visible;
    faceMaterial.uniforms.uOpacity.value = visible;
    ringMaterial.opacity = orbitVisible * 0.45;
    root.visible = visible > 0.001;
  }

  /** World positions of the orbit labels; fills `out` (Vector3s). */
  function orbitAnchors(out) {
    root.updateMatrixWorld();
    for (let i = 0; i < ORBIT_LABELS; i++) {
      const a = orbitTurn + (i * Math.PI * 2) / ORBIT_LABELS;
      out[i].set(Math.cos(a) * ORBIT_RADIUS, 0, Math.sin(a) * ORBIT_RADIUS);
      orbit.localToWorld(out[i]);
    }
    return out;
  }

  /** World positions of the per-layer hotspots, on the plates' camera-facing edge. */
  function hotspotAnchors(out) {
    for (let i = 0; i < 3; i++) {
      out[i].set(2.3, i * spacing + 0.1, 1.9).multiplyScalar(root.scale.x).add(root.position);
    }
    return out;
  }

  function dispose() {
    disposables.forEach((thing) => thing.dispose());
  }

  return { group: root, update, orbitAnchors, hotspotAnchors, dispose, orbitLabels: ORBIT_LABELS };
}
