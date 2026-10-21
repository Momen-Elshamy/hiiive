import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { createFactory, STATION_COUNT } from "./factory/factoryModel";
import { GrainShader, LIGHT } from "./factory/factoryView";
import { createStoryLayer, STORY_FOV, STORY_BLOOM } from "./storyLayer";
import { FACTORY_FOV, VIEW_DIR, OVERVIEW, framing } from "./homeFraming";
import { SCREENS, stationPower, clamp01, ramp, lerp } from "./homeTimeline";

/*
 * The home story's one scene: the software factory, standing on the pattern
 * from scenes 1–2 as its floor.
 *
 * The camera starts in the pattern (the story layer, laid out under the whole
 * factory with the spark landing in front of the AI lab) and then pulls out.
 * Its distance grows exponentially while the look-at point follows the
 * distance, so the spark stays centred until the camera is far enough out.
 * Meanwhile the factory rises out of the bead floor as an unlit silhouette;
 * once the whole line is in view its stations power on one by one.
 */

// Story units → world: the 22 × 14 field covers the factory's footprint, and
// the spark lands inside the loop track, in front of the AI lab.
const FLOOR = { scale: 0.9, position: new THREE.Vector3(0.7, 0.03, 1.45) };
const RISE = 1.9; // how far below the floor the factory starts (taller than the lab)
const FACTORY_BLOOM = { strength: 0.3, radius: 0.3, threshold: 1.0 };
const LIGHT_TARGET = OVERVIEW.target;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

let areaLightsReady = false;

export function createHomeScene(canvas, { spark = "yellow", reducedMotion = false, onCleared } = {}) {
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
    // Lets dev screenshots read the canvas; costs a little, so dev only.
    preserveDrawingBuffer: process.env.NODE_ENV !== "production",
  });
  renderer.setPixelRatio(dpr);
  // Pure black: with the composer's float targets three.js colour-converts a
  // non-black clear colour twice, which lifts the background to grey.
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Drawn by hand in render(): once a frame, only while the factory is lit
  // (not again for the AO pass, and not while the pattern plays).
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.NeutralToneMapping; // keeps the brand yellow saturated
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 28, 50); // the floor melts into black; follows the camera below
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0;

  const camera = new THREE.PerspectiveCamera(STORY_FOV, 1, 0.01, 200);

  // The factory's light rig (as on the look-dev page), off until the pull-out.
  const key = new THREE.RectAreaLight("#fffaf2", 0, 10, 10);
  key.position.set(-4, 11, 7);
  key.lookAt(LIGHT_TARGET);
  const back = new THREE.RectAreaLight("#c8d2ff", 0, 8, 4);
  back.position.set(9, 5, -9);
  back.lookAt(LIGHT_TARGET);
  const sun = new THREE.DirectionalLight("#ffffff", 0);
  sun.position.set(-4, 11, 7).normalize().multiplyScalar(20).add(LIGHT_TARGET);
  sun.target.position.copy(LIGHT_TARGET);
  sun.castShadow = true;
  sun.shadow.mapSize.set(small ? 2048 : 4096, small ? 2048 : 4096);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 5, far: 40 });
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.015;
  sun.shadow.radius = 3;
  const hemi = new THREE.HemisphereLight("#a8b2c8", "#0b0b0c", 0);
  scene.add(key, back, sun, sun.target, hemi);

  const factory = createFactory();
  factory.group.visible = false;
  scene.add(factory.group);
  // The factory's dark ground stays put (and hides the factory while it is
  // still below the floor); it is out of the way while the pattern plays.
  const ground = factory.ground;
  ground.visible = false;
  scene.add(ground);

  // Scenes 1–2, laid out as the factory's floor (just above the ground).
  const story = createStoryLayer({ small, spark });
  story.group.scale.setScalar(FLOOR.scale);
  story.group.position.copy(FLOOR.position);
  scene.add(story.group);
  story.group.updateMatrixWorld(true);

  // A warm lamp that follows the spark, so the factory rising around it
  // catches its light.
  const sparkLamp = new THREE.PointLight("#fff1c2", 0, 5, 2);
  scene.add(sparkLamp);

  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(dpr);
  composer.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, 1, 1);
  gtao.blendIntensity = 1;
  gtao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 2, thickness: 1, scale: 1.2 });
  gtao.enabled = false;
  composer.addPass(gtao);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), STORY_BLOOM.strength, STORY_BLOOM.radius, STORY_BLOOM.threshold);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grain = new ShaderPass(GrainShader);
  composer.addPass(grain);

  // The caller only draws while something moves, so it hears when the canvas
  // has lost its picture: after a resize, or once a lost WebGL context is back.
  const cleared = () => onCleared?.();
  canvas.addEventListener("webglcontextrestored", cleared);

  let width = 1;
  let height = 1;
  let shot = null; // the factory's framing, sized to the viewport
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    shot = framing({ small, width, height });
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    gtao.setSize(width * dpr, height * dpr);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cleared();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const storyPos = new THREE.Vector3();
  const storyLook = new THREE.Vector3();
  const startDir = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const storyPointer = { x: 0, y: 0 };
  const power = new Array(STATION_COUNT).fill(0);
  const projected = new THREE.Vector3();
  const anchors = factory.checkpoints.map(() => ({ x: 0, y: 0, a: 0 }));

  /**
   * Draws the frame at screen position `s` (see SCREENS) and returns where the
   * station checkpoints sit on screen, in CSS pixels.
   */
  function render(s, time, pointer) {
    const storyProgress = clamp01(s / SCREENS.story);
    const zoomRaw = ramp(s, SCREENS.zoom);
    const zoom = smoother(zoomRaw);
    const clock = reducedMotion ? 0 : time;

    // Camera. Inside the pattern it is the story camera, in world space.
    storyPointer.x = pointer.x * (1 - zoom);
    storyPointer.y = pointer.y * (1 - zoom);
    story.cameraAt(storyProgress, storyPointer, storyPos, storyLook);
    story.group.localToWorld(storyPos);
    story.group.localToWorld(storyLook);
    let dist = storyPos.distanceTo(storyLook);
    if (zoomRaw <= 0) {
      camera.position.copy(storyPos);
      lookAt.copy(storyLook);
    } else {
      // Pull out: distance grows exponentially; the look-at point follows the
      // distance travelled, so it barely moves while the camera is close.
      const startDist = dist;
      dist = startDist * Math.pow(shot.dist / startDist, zoom);
      lookAt.lerpVectors(storyLook, shot.target, (dist - startDist) / (shot.dist - startDist));
      startDir.subVectors(storyPos, storyLook).normalize();
      dir.copy(startDir).lerp(VIEW_DIR, smoother(clamp01(zoomRaw * 1.2))).normalize();
      camera.position.copy(lookAt).addScaledVector(dir, dist);
      // Once out, the pointer adds a little depth, as on the look-dev page.
      camera.position.x += pointer.x * 0.3 * zoom;
      camera.position.y += pointer.y * 0.2 * zoom;
    }
    camera.lookAt(lookAt);
    camera.fov = lerp(STORY_FOV, FACTORY_FOV, zoom);
    camera.near = Math.max(0.004, dist * 0.01);
    camera.far = dist * 6 + 60;
    camera.updateProjectionMatrix();
    scene.fog.near = dist + 4;
    scene.fog.far = dist + 26;

    // Scenes 1–2: the field settles into the factory floor; the spark goes
    // into the factory as it rises.
    const proj = (height * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    const sparkLeft = 1 - ramp(zoom, [0.3, 0.7]);
    const flash = story.update(storyProgress, clock, { camera, proj, spark: sparkLeft, floor: zoom });

    // Factory: hidden while the pattern plays, then it rises out of the floor
    // as a silhouette during the pull-out; once it is all in view the stations
    // power on in line order with the room light coming up.
    factory.group.visible = zoomRaw > 0;
    ground.visible = zoomRaw > 0;
    factory.group.position.y = -RISE * (1 - smoother(ramp(zoomRaw, [0.02, 0.62])));
    let total = 0;
    for (let i = 0; i < STATION_COUNT; i++) {
      power[i] = stationPower(s, i);
      total += power[i];
    }
    const silhouette = ramp(zoom, [0.15, 0.8]);
    const level = 0.12 * silhouette + 0.43 * power[0] + 0.45 * (total / STATION_COUNT);
    key.intensity = LIGHT.key * level;
    sun.intensity = LIGHT.sun * level;
    hemi.intensity = LIGHT.hemi * level;
    scene.environmentIntensity = LIGHT.env * level;
    back.intensity = LIGHT.back * silhouette;
    story.sparkWorld(sparkLamp.position);
    sparkLamp.intensity = 2.5 * ramp(zoomRaw, [0, 0.15]) * sparkLeft;
    factory.update(clock, power);

    // Post: the story's bloom inside the pattern, the product shot's outside.
    bloom.strength = lerp(STORY_BLOOM.strength + flash * 1.2, FACTORY_BLOOM.strength, zoom);
    bloom.radius = lerp(STORY_BLOOM.radius, FACTORY_BLOOM.radius, zoom);
    bloom.threshold = lerp(STORY_BLOOM.threshold, FACTORY_BLOOM.threshold, zoom);
    gtao.enabled = !small && zoom > 0.3;
    grain.enabled = zoom > 0; // no grain or vignette inside the pattern
    grain.uniforms.uGrain.value = 0.035 * zoom;
    grain.uniforms.uVignette.value = 0.45 * zoom;
    grain.uniforms.uTime.value = time;
    renderer.shadowMap.needsUpdate = factory.group.visible && sun.intensity > 0;
    composer.render();

    factory.checkpoints.forEach((checkpoint, i) => {
      projected.copy(checkpoint.position).project(camera);
      anchors[i].x = (projected.x * 0.5 + 0.5) * width;
      anchors[i].y = (-projected.y * 0.5 + 0.5) * height;
      anchors[i].a = projected.z < 1 ? 1 : 0;
    });
    return anchors;
  }

  /**
   * Compiles every shader the story needs up front (the hidden factory's too),
   * then draws one frame of the powered-up factory so its shadows, AO and glow
   * are ready as well: nothing stutters the first time it comes into view.
   * Runs behind the preloader; the frame loop then draws the real first frame.
   */
  async function warmUp() {
    try {
      await renderer.compileAsync(scene, camera);
    } catch {
      // Not fatal: the frame below compiles whatever is left.
    }
    render(SCREENS.stations[STATION_COUNT - 1], 0, { x: 0, y: 0 });
  }

  function dispose() {
    observer.disconnect();
    canvas.removeEventListener("webglcontextrestored", cleared);
    story.dispose();
    factory.dispose();
    environment.dispose();
    pmrem.dispose();
    target.dispose();
    composer.dispose();
    renderer.dispose();
    if (window.__home?.renderer === renderer) delete window.__home;
  }

  // Dev-only handle for inspecting frames from the console.
  if (process.env.NODE_ENV !== "production") window.__home = { renderer, scene, camera, composer, bloom, gtao, story, factory, render };

  return { render, warmUp, dispose };
}
