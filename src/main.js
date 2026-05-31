/* ============================================================
   MAIN  —  src/main.js
   Boots the renderer, scene, camera and controls, assembles the
   world (beach + museum + galleries), wires up the intro and the
   experience controller, and runs the render loop.
   ============================================================ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { CONFIG } from './config.js';
import { SECTIONS } from './data.js';
import { updateTweens } from './util.js';
import { buildWorld } from './world.js';
import { buildMuseum } from './museum.js';
import { buildGalleries } from './displays.js';
import { createExperience } from './experience.js';
import { setupIntro } from './intro.js';

/* ---------- Renderer ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.72;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('app').appendChild(renderer.domElement);

/* ---------- Scene + camera ---------- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 30000);
camera.position.set(40, 34, -82); // establishing shot, off to the sea side
camera.lookAt(0, 6, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.rotateSpeed = 0.45;
controls.zoomSpeed = 0.7;
controls.minDistance = 1.5;
controls.maxDistance = 45;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2 - 0.04; // never dip below the floor
controls.target.set(0, 6, 10);
// slow orbit of the museum behind the intro overlay
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;

/* ---------- Build the world ---------- */
const world = buildWorld(scene, renderer);
buildMuseum(scene);
const galleries = buildGalleries(scene, SECTIONS);

const experience = createExperience({ renderer, scene, camera, controls, galleries });

/* ---------- Intro ---------- */
setupIntro(() => {
  controls.autoRotate = false;
  experience.start();
});

/* ---------- Resize ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- Render loop ---------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updateTweens(dt);
  world.update(dt);
  experience.update(dt);
  if (!experience.locked) controls.update();
  renderer.render(scene, camera);
}
animate();
