import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/*
 * The Hiiive software factory, modelled like a product render: crisp edges
 * with small bevels, off-white powder-coat shells, a matte brand-yellow layer
 * under each top plate (painted, not glowing) and light only where light
 * would be, in thin slits inside the openings and in the parts and chips.
 *
 * Stations: intake tube → AI lab (wordmark plate) → glass build line →
 * quality gate → four output lanes. The line runs along +x; z faces the camera.
 */

const COLORS = {
  shell: "#d2d2ce",
  graphite: "#1f2124",
  track: "#111214",
  floor: "#060607",
  print: "#2a2c2f",
  printSoft: "#7d828b",
  accent: "#f7f42c",
  accentPaint: "#e6e22a",
  warm: "#fff1c2",
  steel: "#a9afb8",
};

const EDGE = 0.018; // bevel radius: crisp, but still catches a highlight

const LAB = { legX: 1.38, legWidth: 1.24, legHeight: 1.2, depth: 1.62, opening: 0.6, openingHeight: 0.76 };
const GATE = { x: 5.25, width: 1.7, depth: 1.7, legHeight: 1.2, opening: 0.68, openingHeight: 0.74 };
const PLATE = { layer: 0.13, thickness: 0.16 };
const LANE_ANGLES = [-0.42, -0.14, 0.14, 0.42];
const LANE_LABELS = ["SAAS", "AI AGENTS", "SOFTWARE", "SEO & GEO"];
const LANE_LENGTH = 3.6;

// ---------------------------------------------------------------------------
// Printed surfaces

function grainTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + (Math.random() - 0.5) * 46;
    image.data[i * 4] = image.data[i * 4 + 1] = image.data[i * 4 + 2] = v;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/** Radial gradient for emissive maps: bright centre, dimmer edges, like a diffuser. */
function ledTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.62);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.45, "#c9c9c9");
  gradient.addColorStop(1, "#3a3a3a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function printTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function label(ctx, text, x, y, { size = 30, align = "left", color = COLORS.print, alpha = 0.7, weight = 600 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${size * 0.16}px`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function labPrint() {
  return printTexture(2048, 930, (ctx, w, h) => {
    ctx.fillStyle = COLORS.print;
    ctx.font = `600 ${Math.round(h * 0.3)}px "Big Shoulders", "Big Shoulders Display", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HIIIVE", w * 0.54, h * 0.52);
    const s = h * 0.07;
    ctx.fillStyle = COLORS.accent;
    ctx.beginPath();
    ctx.roundRect(w * 0.54 - h * 0.56, h * 0.52 - h * 0.12, s, s, s * 0.2);
    ctx.fill();
    label(ctx, "▲ INPUT", 140, h - 120);
    label(ctx, "AI LAB · 02", w - 140, 120, { align: "right" });
    label(ctx, "MODELS & AGENTS ▸", w - 140, h - 120, { align: "right" });
  });
}

function gatePrint() {
  return printTexture(1024, 1024, (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.9;
    const inset = 170;
    // An open frame, like a target: four corner brackets.
    const arm = 140;
    [
      [inset, inset, 1, 1],
      [w - inset, inset, -1, 1],
      [inset, h - inset, 1, -1],
      [w - inset, h - inset, -1, -1],
    ].forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x + dx * arm, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * arm);
      ctx.stroke();
    });
    ctx.restore();
    label(ctx, "SHIP ▸", w - 170, 105, { size: 30, align: "right" });
    label(ctx, "▾ ITERATE", 170, h - 105, { size: 30 });
    label(ctx, "QUALITY GATE · 04", w / 2, h - 105, { size: 22, align: "center", alpha: 0.45 });
  });
}

function hazardPrint() {
  return printTexture(256, 96, (ctx, w, h) => {
    ctx.fillStyle = COLORS.accent;
    for (let i = 0; i < 3; i++) {
      const x = 40 + i * 62;
      ctx.beginPath();
      ctx.moveTo(x + 30, 10);
      ctx.lineTo(x + 52, 10);
      ctx.lineTo(x + 22, h - 10);
      ctx.lineTo(x, h - 10);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function floorPrint(text) {
  return printTexture(1024, 192, (ctx, w, h) => {
    label(ctx, text, w / 2, h / 2, { size: 60, align: "center", color: COLORS.printSoft, alpha: 0.85 });
  });
}

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float falloff = 1.0 - clamp(length(p), 0.0, 1.0);
    falloff *= falloff;
    gl_FragColor = vec4(uColor * falloff, falloff * uOpacity);
  }
`;

// Light pools that ride under instanced chips (same glow, per-instance matrix).
const instancedVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 p = vec4(position, 1.0);
    #ifdef USE_INSTANCING
      p = instanceMatrix * p;
    #endif
    gl_Position = projectionMatrix * modelViewMatrix * p;
  }
`;

const uvVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function roundedRect(w, h, r) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w / 2, h / 2 - r);
  shape.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

export function createFactory() {
  const group = new THREE.Group();
  const disposables = [];
  const keep = (thing) => {
    disposables.push(thing);
    return thing;
  };
  const updaters = [];
  const dummy = new THREE.Object3D();

  // Materials -------------------------------------------------------------------
  const grain = keep(grainTexture());
  const shell = keep(
    new THREE.MeshPhysicalMaterial({
      color: COLORS.shell,
      roughness: 1.3, // × grain ≈ 0.65 with a fine powder-coat variation
      roughnessMap: grain,
      bumpMap: grain,
      bumpScale: 0.05,
      clearcoat: 0.08,
      clearcoatRoughness: 0.5,
    }),
  );
  const paint = keep(new THREE.MeshPhysicalMaterial({ color: COLORS.accentPaint, roughness: 0.55, clearcoat: 0.2, clearcoatRoughness: 0.4 }));
  const graphite = keep(new THREE.MeshPhysicalMaterial({ color: COLORS.graphite, roughness: 0.5, metalness: 0.4 }));
  const track = keep(new THREE.MeshStandardMaterial({ color: COLORS.track, roughness: 0.7, metalness: 0.2 }));
  const floor = keep(new THREE.MeshStandardMaterial({ color: COLORS.floor, roughness: 0.86 }));
  const glass = keep(
    new THREE.MeshPhysicalMaterial({ color: "#f2f6f8", roughness: 0.06, transmission: 1, thickness: 0.3, ior: 1.45, envMapIntensity: 1 }),
  );
  const crystal = keep(
    new THREE.MeshPhysicalMaterial({
      color: "#e9eef4",
      roughness: 0.18,
      transmission: 0.75,
      thickness: 0.12,
      emissive: "#ffffff",
      emissiveIntensity: 0.08,
    }),
  );
  const slit = keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(COLORS.accent).multiplyScalar(3) }));
  const warmLight = keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(COLORS.warm).multiplyScalar(2) }));
  const chipLight = keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(COLORS.accent).multiplyScalar(2) }));

  const box = (w, h, d, material, r = EDGE) => {
    const mesh = new THREE.Mesh(keep(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2))), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const decal = (texture, w, h) => {
    const mesh = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(w, h)),
      keep(
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.6,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2,
        }),
      ),
    );
    mesh.receiveShadow = true;
    return mesh;
  };

  // Light spilling from a slit onto the floor, faked with an additive pool.
  const glowGeometry = keep(new THREE.PlaneGeometry(1, 1));
  const pool = (x, z, w, d, color, opacity, angle = 0) => {
    const mesh = new THREE.Mesh(
      glowGeometry,
      keep(
        new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
          vertexShader: uvVertex,
          fragmentShader: glowFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    mesh.rotation.set(-Math.PI / 2, 0, angle);
    mesh.scale.set(w, d, 1);
    mesh.position.set(x, 0.135, z);
    group.add(mesh);
    return mesh;
  };

  /** A leg with a rectangular tunnel through it (front to back), a lit slit inside the tunnel's top. */
  const leg = ({ width, height, depth, opening, openingHeight }) => {
    const part = new THREE.Group();
    const side = (width - opening) / 2;
    [-1, 1].forEach((s) => {
      const wall = box(side, height, depth, shell);
      wall.position.set(s * (opening / 2 + side / 2), height / 2, 0);
      part.add(wall);
      // Vents on the outer face: thin dark grooves.
      for (let v = 0; v < 4; v++) {
        const vent = box(0.012, 0.028, depth * 0.36, graphite, 0.004);
        vent.position.set(s * (width / 2 + 0.002), 0.32 + v * 0.07, -depth * 0.18);
        part.add(vent);
      }
    });
    const lintel = box(opening + 0.02, height - openingHeight, depth, shell);
    lintel.position.set(0, openingHeight + (height - openingHeight) / 2, 0);
    part.add(lintel);
    const ceiling = box(opening + 0.01, 0.012, depth - 0.02, graphite, 0.004);
    ceiling.position.set(0, openingHeight - 0.006, 0);
    part.add(ceiling);
    [-1, 1].forEach((s) => {
      const strip = new THREE.Mesh(keep(new THREE.BoxGeometry(opening * 0.88, 0.016, 0.016)), slit);
      strip.position.set(0, openingHeight - 0.02, s * (depth / 2 - 0.05));
      part.add(strip);
    });
    return part;
  };

  /** Matte yellow layer + top plate (+ print), sitting on top of `y`. */
  const cap = (w, d, y, print) => {
    const part = new THREE.Group();
    const layer = box(w - 0.04, PLATE.layer, d - 0.04, paint, 0.012);
    layer.position.y = y + PLATE.layer / 2;
    const plate = box(w, PLATE.thickness, d, shell);
    plate.position.y = y + PLATE.layer + PLATE.thickness / 2;
    part.add(layer, plate);
    const top = y + PLATE.layer + PLATE.thickness;
    if (print) {
      const printed = decal(print, w - 0.2, d - 0.2);
      printed.rotation.x = -Math.PI / 2;
      printed.position.y = top + 0.001;
      part.add(printed);
    }
    // Screw heads in the corners.
    const screwGeometry = keep(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 20));
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].forEach(([sx, sz]) => {
      const screw = new THREE.Mesh(screwGeometry, graphite);
      screw.position.set(sx * (w / 2 - 0.09), top + 0.004, sz * (d / 2 - 0.09));
      part.add(screw);
    });
    return { part, top };
  };

  // Floor --------------------------------------------------------------------------
  const ground = new THREE.Mesh(keep(new THREE.PlaneGeometry(80, 80)), floor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Loop track through the lab's legs, translucent studs riding on it -------------
  const loopShape = roundedRect(2 * LAB.legX + 0.46, 5.4, 1.1);
  loopShape.holes.push(roundedRect(2 * LAB.legX - 0.46, 4.48, 0.66));
  const loopGeometry = keep(
    new THREE.ExtrudeGeometry(loopShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }),
  );
  loopGeometry.rotateX(-Math.PI / 2);
  const loop = new THREE.Mesh(loopGeometry, track);
  loop.position.y = 0.012;
  loop.receiveShadow = true;
  loop.castShadow = true;
  group.add(loop);

  const loopPath = roundedRect(2 * LAB.legX, 4.94, 0.88);
  const studCount = 32;
  const studs = new THREE.InstancedMesh(keep(new RoundedBoxGeometry(0.13, 0.11, 0.13, 2, 0.012)), crystal, studCount);
  studs.castShadow = true;
  group.add(studs);
  updaters.push((time) => {
    for (let i = 0; i < studCount; i++) {
      const p = loopPath.getPointAt((((i / studCount + time * 0.018) % 1) + 1) % 1);
      dummy.position.set(p.x, 0.19, -p.y);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      studs.setMatrixAt(i, dummy.matrix);
    }
    studs.instanceMatrix.needsUpdate = true;
  });

  // AI lab ----------------------------------------------------------------------------
  [-1, 1].forEach((s) => {
    const part = leg({ width: LAB.legWidth, height: LAB.legHeight, depth: LAB.depth, opening: LAB.opening, openingHeight: LAB.openingHeight });
    part.position.x = s * LAB.legX;
    group.add(part);
    [-1, 1].forEach((f) => pool(s * LAB.legX, f * (LAB.depth / 2 + 0.28), 1.0, 0.9, COLORS.accent, 0.35));
  });
  const coreWidth = 2 * LAB.legX - LAB.legWidth - 0.02;
  const core = box(coreWidth, 0.95, 1.3, graphite);
  core.position.set(0, 0.475, 0);
  group.add(core);
  const coreSlit = new THREE.Mesh(keep(new THREE.BoxGeometry(coreWidth * 0.7, 0.014, 0.014)), warmLight);
  coreSlit.position.set(0, 0.62, 0.656);
  group.add(coreSlit);
  const labWidth = 2 * LAB.legX + LAB.legWidth + 0.12;
  const labCap = cap(labWidth, 2.0, LAB.legHeight, keep(labPrint()));
  group.add(labCap.part);
  const hazardTexture = keep(hazardPrint());
  [-1, 1].forEach((s) => {
    const hazard = decal(hazardTexture, 0.32, 0.12);
    hazard.position.set(s * (labWidth / 2 - 0.45), LAB.legHeight + PLATE.layer + PLATE.thickness / 2, 1.0 + 0.002);
    group.add(hazard);
  });
  const labButton = box(0.17, 0.07, 0.17, paint, 0.02);
  labButton.position.set(1.55, labCap.top + 0.035, -0.62);
  group.add(labButton);

  // Intake tube ---------------------------------------------------------------------
  const intakeEnd = new THREE.Vector3(-LAB.legX - LAB.legWidth / 2 - 0.01, 0.6, 0);
  const intakeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.8, 0.6, 2.3),
    new THREE.Vector3(-4.4, 0.6, 1.5),
    new THREE.Vector3(-3.1, 0.6, 0.45),
    intakeEnd,
  ]);
  const tube = new THREE.Mesh(keep(new THREE.TubeGeometry(intakeCurve, 160, 0.27, 40, false)), glass);
  group.add(tube);
  const collar = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.34, 0.34, 0.14, 48)), graphite);
  collar.rotation.z = Math.PI / 2;
  collar.position.copy(intakeEnd).add(new THREE.Vector3(-0.07, 0, 0));
  collar.castShadow = true;
  group.add(collar);

  const shardGeometry = keep(new THREE.TetrahedronGeometry(0.05));
  const shards = new THREE.InstancedMesh(shardGeometry, keep(new THREE.MeshStandardMaterial({ color: COLORS.steel, roughness: 0.35, metalness: 0.6 })), 170);
  const sparks = new THREE.InstancedMesh(shardGeometry, chipLight, 6);
  shards.castShadow = true;
  group.add(shards, sparks);
  const debris = (count) =>
    Array.from({ length: count }, () => ({
      u: Math.random() * 1.3 - 0.3,
      speed: 0.05 + Math.random() * 0.04,
      angle: Math.random() * Math.PI * 2,
      radius: Math.sqrt(Math.random()) * 0.18,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(4),
      scale: 0.6 + Math.random() * 0.9,
    }));
  const shardState = debris(170);
  const sparkState = debris(6);
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const mouth = intakeCurve.getPointAt(0);
  const mouthDir = intakeCurve.getTangentAt(0);
  const placeDebris = (mesh, state, time, dt) => {
    state.forEach((d, i) => {
      d.u += d.speed * dt;
      if (d.u > 1) d.u = -0.3;
      if (d.u >= 0) {
        intakeCurve.getPointAt(d.u, dummy.position);
        intakeCurve.getTangentAt(d.u, tangent);
        side.set(-tangent.z, 0, tangent.x).normalize();
        dummy.position.addScaledVector(side, Math.cos(d.angle) * d.radius);
        dummy.position.y += Math.sin(d.angle) * d.radius - 0.08;
      } else {
        const spread = -d.u * 2.2;
        dummy.position.copy(mouth).addScaledVector(mouthDir, d.u * 3.2);
        dummy.position.x += Math.cos(d.angle) * spread * 0.5;
        dummy.position.z += Math.sin(d.angle) * spread * 0.5;
        dummy.position.y += Math.sin(d.angle * 3) * spread * 0.25;
      }
      dummy.rotation.set(d.spin.x * time, d.spin.y * time, d.spin.z * time);
      dummy.scale.setScalar(d.scale * (1 - THREE.MathUtils.smoothstep(d.u, 0.92, 1.0)));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  updaters.push((time, dt) => {
    placeDebris(shards, shardState, time, dt);
    placeDebris(sparks, sparkState, time, dt);
  });

  // Build line: a glass channel with lit parts inside --------------------------------
  const channelStart = LAB.legX + LAB.legWidth / 2;
  const channelEnd = GATE.x - GATE.width / 2;
  const channelLength = channelEnd - channelStart;
  const channelX = (channelStart + channelEnd) / 2;
  const channel = box(channelLength + 0.04, 0.38, 0.46, glass, 0.02);
  channel.castShadow = false;
  channel.position.set(channelX, 0.6, 0);
  group.add(channel);
  const bed = box(channelLength, 0.05, 0.56, graphite, 0.01);
  bed.position.set(channelX, 0.385, 0);
  group.add(bed);
  const partCount = 12;
  const parts = new THREE.InstancedMesh(keep(new RoundedBoxGeometry(0.09, 0.05, 0.09, 2, 0.01)), warmLight, partCount);
  group.add(parts);
  updaters.push((time) => {
    for (let i = 0; i < partCount; i++) {
      const t = (i / partCount + time * 0.05) % 1;
      dummy.position.set(channelStart + 0.08 + t * (channelLength - 0.16), 0.44, i % 2 ? 0.08 : -0.08);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(Math.min(1, Math.min(t, 1 - t) * 14));
      dummy.updateMatrix();
      parts.setMatrixAt(i, dummy.matrix);
    }
    parts.instanceMatrix.needsUpdate = true;
  });
  pool(channelX, 0, channelLength, 1.2, COLORS.warm, 0.25);
  const channelLight = new THREE.PointLight(COLORS.warm, 0.5, 2.2, 2);
  channelLight.position.set(channelX, 0.6, 0);
  group.add(channelLight);

  // Quality gate ----------------------------------------------------------------------
  const gateLeg = leg({ width: GATE.width, height: GATE.legHeight, depth: GATE.depth, opening: GATE.opening, openingHeight: GATE.openingHeight });
  gateLeg.position.x = GATE.x;
  group.add(gateLeg);
  const gateCap = cap(GATE.width + 0.1, GATE.depth + 0.1, GATE.legHeight, keep(gatePrint()));
  gateCap.part.position.x = GATE.x;
  group.add(gateCap.part);
  const gateButton = box(0.22, 0.08, 0.22, paint, 0.02);
  gateButton.position.set(GATE.x, gateCap.top + 0.04, 0);
  group.add(gateButton);
  pool(GATE.x, GATE.depth / 2 + 0.3, 1.1, 1.0, COLORS.accent, 0.4);

  // Output lanes --------------------------------------------------------------------
  // Chips read as lights, not stickers: a diffuser gradient on every face (hot
  // centre, dim edges), a little shine on the lane, and a pool of light that
  // travels with each chip across the dark strip.
  const laneOrigin = new THREE.Vector3(GATE.x, 0, GATE.depth / 2 - 0.1);
  const chipGeometry = keep(new RoundedBoxGeometry(0.1, 0.028, 0.065, 2, 0.008));
  const led = keep(ledTexture());
  const ledMaterial = (color, intensity) =>
    keep(
      new THREE.MeshStandardMaterial({
        color: "#1c1c16",
        roughness: 0.3,
        metalness: 0.1,
        emissive: color,
        emissiveMap: led,
        emissiveIntensity: intensity,
      }),
    );
  const chipYellow = ledMaterial(COLORS.accent, 2.1);
  const chipWarm = ledMaterial(COLORS.warm, 1.7);
  const laneSurface = keep(new THREE.MeshStandardMaterial({ color: COLORS.track, roughness: 0.45, metalness: 0.18 }));
  const poolGeometry = keep(new THREE.PlaneGeometry(1, 1));
  const chipPool = (color, opacity) =>
    keep(
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
        vertexShader: instancedVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
  const poolYellow = chipPool(COLORS.accent, 0.6);
  const poolWarm = chipPool(COLORS.warm, 0.45);
  const lanes = LANE_ANGLES.map((angle, i) => {
    const dir = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
    const strip = box(0.3, 0.05, LANE_LENGTH, laneSurface, 0.012);
    strip.position.copy(laneOrigin).addScaledVector(dir, LANE_LENGTH / 2).setY(0.025);
    strip.rotation.y = angle;
    group.add(strip);
    const print = decal(keep(floorPrint(LANE_LABELS[i])), 1.5, 0.28);
    print.rotation.set(-Math.PI / 2, 0, angle);
    print.position.copy(laneOrigin).addScaledVector(dir, LANE_LENGTH + 0.42).setY(0.002);
    group.add(print);
    const yellow = i % 2 === 0;
    const chips = new THREE.InstancedMesh(chipGeometry, yellow ? chipYellow : chipWarm, 7);
    const pools = new THREE.InstancedMesh(poolGeometry, yellow ? poolYellow : poolWarm, 7);
    group.add(chips, pools);
    return { dir, angle, chips, pools, offset: i * 0.13 };
  });
  updaters.push((time) => {
    lanes.forEach(({ dir, angle, chips, pools, offset }) => {
      for (let k = 0; k < 7; k++) {
        const t = (k / 7 + time * 0.07 + offset) % 1;
        const fade = Math.min(1, (1 - t) * 6);
        dummy.position.copy(laneOrigin).addScaledVector(dir, 0.3 + t * (LANE_LENGTH - 0.4)).setY(0.065);
        dummy.rotation.set(0, angle, 0);
        dummy.scale.setScalar(fade);
        dummy.updateMatrix();
        chips.setMatrixAt(k, dummy.matrix);
        // Pool on the lane surface, stretched a little along the lane.
        dummy.position.y = 0.0515;
        dummy.rotation.set(-Math.PI / 2, 0, angle);
        dummy.scale.set(0.34 * fade, 0.5 * fade, 1);
        dummy.updateMatrix();
        pools.setMatrixAt(k, dummy.matrix);
      }
      chips.instanceMatrix.needsUpdate = true;
      pools.instanceMatrix.needsUpdate = true;
    });
  });

  // Checkpoints: where the + buttons sit -------------------------------------------
  const checkpoints = [
    { key: "intake", position: intakeCurve.getPointAt(0.35).add(new THREE.Vector3(0, 0.5, 0)) },
    { key: "lab", position: new THREE.Vector3(-1.75, labCap.top + 0.3, 0.7) },
    { key: "build", position: new THREE.Vector3(channelX, 1.0, 0.2) },
    { key: "gate", position: new THREE.Vector3(GATE.x + 0.6, gateCap.top + 0.25, 0.6) },
    { key: "output", position: laneOrigin.clone().add(new THREE.Vector3(0, 0.35, 2.4)) },
  ];

  let last = 0;
  function update(time) {
    const dt = Math.min(0.05, Math.max(0, time - last));
    last = time;
    updaters.forEach((fn) => fn(time, dt));
  }

  function dispose() {
    disposables.forEach((thing) => thing.dispose?.());
  }

  return { group, update, checkpoints, dispose };
}
