import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { createFactory } from "./factoryModel";
import { createTour, OVERVIEW, VIEW_DIR } from "./factoryTour";

/*
 * Look-dev stage for the factory, lit like a product shot: a big soft area
 * light overhead-left (gentle gradients across the plates, darker sides), a
 * matching directional light only for crisp contact shadows, a faint cool
 * rim, ambient occlusion, bloom only on the slits, then film grain and a
 * vignette so it reads as a render, not a viewport.
 */

const FOV = 20;
const TARGET = OVERVIEW.target;

const GrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.035 },
    uVignette: { value: 0.45 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb += (rand(vUv * 1024.0 + fract(uTime)) - 0.5) * uGrain;
      float d = distance(vUv, vec2(0.5));
      color.rgb *= 1.0 - smoothstep(0.4, 0.95, d) * uVignette;
      gl_FragColor = color;
    }
  `,
};

let areaLightsReady = false;

/**
 * `tour: true` hands the camera to the scroll tour (render's `progress`);
 * otherwise it holds the overview, as on the look-dev page.
 */
export function createFactoryView(canvas, { tour = false, reducedMotion = false } = {}) {
  if (!areaLightsReady) {
    RectAreaLightUniformsLib.init();
    areaLightsReady = true;
  }
  const small = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // MSAA comes from the composer's target
    powerPreference: "high-performance",
    preserveDrawingBuffer: process.env.NODE_ENV !== "production",
  });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; // keeps the brand yellow saturated
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 28, 50); // the floor melts into black; follows the camera distance below
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.16;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 120);

  // Soft key: a large overhead panel, front-left.
  const key = new THREE.RectAreaLight("#fffaf2", 5.5, 10, 10);
  key.position.set(-4, 11, 7);
  key.lookAt(TARGET);
  scene.add(key);
  // Faint cool panel from the back-right, for edge separation.
  const back = new THREE.RectAreaLight("#c8d2ff", 2.2, 8, 4);
  back.position.set(9, 5, -9);
  back.lookAt(TARGET);
  scene.add(back);
  // Shadows only: same direction as the key, crisp near contact.
  const sun = new THREE.DirectionalLight("#ffffff", 0.9);
  sun.position.set(-4, 11, 7).normalize().multiplyScalar(20).add(TARGET);
  sun.target.position.copy(TARGET);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 2048 : 4096, small ? 2048 : 4096);
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  sun.shadow.camera.near = 5;
  sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.015;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight("#a8b2c8", "#0b0b0c", 0.12));

  const factory = createFactory();
  scene.add(factory.group);

  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, 1, 1);
  gtao.blendIntensity = 1;
  gtao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 2, thickness: 1, scale: 1.2 });
  gtao.enabled = !small; // phones skip AO
  composer.addPass(gtao);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.3, 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grain = new ShaderPass(GrainShader);
  composer.addPass(grain);

  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    gtao.setSize(width * dpr, height * dpr);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const projected = new THREE.Vector3();
  const anchors = factory.checkpoints.map(() => ({ x: 0, y: 0, a: 0 }));
  const tourPath = tour ? createTour({ small }) : null;
  const lookAt = new THREE.Vector3();

  function render(time, pointer, progress = 1) {
    const dist = tourPath ? tourPath(progress, lookAt) : OVERVIEW.dist;
    if (!tourPath) lookAt.copy(TARGET);
    camera.position.copy(lookAt).addScaledVector(VIEW_DIR, dist);
    scene.fog.near = dist + 4;
    scene.fog.far = dist + 26;
    // Parallax scales with distance so close-ups don't swing around.
    const sway = dist / OVERVIEW.dist;
    camera.position.x += pointer.x * 0.6 * sway;
    camera.position.y += pointer.y * 0.4 * sway;
    camera.lookAt(lookAt);
    factory.update(reducedMotion ? 0 : time);
    grain.uniforms.uTime.value = time;
    composer.render();

    factory.checkpoints.forEach((checkpoint, i) => {
      projected.copy(checkpoint.position).project(camera);
      anchors[i].x = (projected.x * 0.5 + 0.5) * width;
      anchors[i].y = (-projected.y * 0.5 + 0.5) * height;
      anchors[i].a = projected.z < 1 ? 1 : 0;
    });
    return anchors;
  }

  function dispose() {
    observer.disconnect();
    factory.dispose();
    environment.dispose();
    pmrem.dispose();
    target.dispose();
    composer.dispose();
    renderer.dispose();
  }

  if (process.env.NODE_ENV !== "production") window.__factory = { renderer, scene, camera, composer, gtao, bloom, key, back, sun, grain };

  return { render, dispose, checkpoints: factory.checkpoints };
}
