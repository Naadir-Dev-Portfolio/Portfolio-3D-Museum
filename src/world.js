/* ============================================================
   WORLD  —  src/world.js
   The beach itself: a physically-lit sky, an animated reflective
   sea (three.js Water), a sloping sand beach, warm sun light and
   a few palms and rocks for life. Also builds the image-based
   environment that makes the glass and metal reflect the sky.
   ============================================================ */

import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { CONFIG } from './config.js';

export function buildWorld(scene, renderer) {
  const sun = new THREE.Vector3();

  /* ---------- Sky ---------- */
  const sky = new Sky();
  sky.scale.setScalar(20000);
  scene.add(sky);
  const su = sky.material.uniforms;
  su['turbidity'].value = 8;
  su['rayleigh'].value = 2.2;
  su['mieCoefficient'].value = 0.005;
  su['mieDirectionalG'].value = 0.82;

  /* ---------- Sea ---------- */
  const waterNormals = new THREE.TextureLoader().load(CONFIG.waterNormalsUrl, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  });
  const water = new Water(new THREE.PlaneGeometry(20000, 20000), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xfff1d6,
    waterColor: 0x16323a,
    distortionScale: 3.4,
    fog: false,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = CONFIG.seaLevel;
  scene.add(water);

  /* ---------- Sun light + environment ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT = null;

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - CONFIG.sun.elevation);
    const theta = THREE.MathUtils.degToRad(CONFIG.sun.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    if (envRT) envRT.dispose();
    envRT = pmrem.fromScene(sky);
    scene.environment = envRT.texture;
  }
  updateSun();

  const dirLight = new THREE.DirectionalLight(0xffe6bd, 2.6);
  dirLight.position.copy(sun).multiplyScalar(160);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 400;
  const s = 70;
  dirLight.shadow.camera.left = -s;
  dirLight.shadow.camera.right = s;
  dirLight.shadow.camera.top = s;
  dirLight.shadow.camera.bottom = -s;
  dirLight.shadow.bias = -0.0004;
  dirLight.target.position.set(0, 0, 30);
  scene.add(dirLight);
  scene.add(dirLight.target);

  const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x6a5640, 0.75);
  scene.add(hemi);

  /* ---------- Sand beach ----------
     A wide plane, gently displaced into dunes, that slopes down to
     the sea at the front (toward -z). */
  const sandGeo = new THREE.PlaneGeometry(900, 900, 180, 180);
  const pos = sandGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const ly = pos.getY(i);
    // after sand.rotation.x = -PI/2, local +Y maps to world -Z
    const worldZ = -ly;
    let h = 0;
    // rolling dunes (cheap layered sine noise)
    h += Math.sin(lx * 0.05) * Math.cos(worldZ * 0.045) * 0.55;
    h += Math.sin(lx * 0.13 + 1.7) * Math.cos(worldZ * 0.11) * 0.22;
    // slope down into the sea in front of the entrance (toward -Z)
    if (worldZ < CONFIG.shoreZ) {
      const t = THREE.MathUtils.clamp((CONFIG.shoreZ - worldZ) / 16, 0, 1);
      h -= t * 4.5; // drops well below sea level so the water reads as sea
    }
    pos.setZ(i, h); // local +Z maps to world +Y (height)
  }
  sandGeo.computeVertexNormals();
  const sand = new THREE.Mesh(
    sandGeo,
    new THREE.MeshStandardMaterial({ color: 0xcdb38a, roughness: 0.96, metalness: 0 }),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0;
  sand.receiveShadow = true;
  scene.add(sand);

  /* ---------- Decor: palms + rocks ---------- */
  const decor = new THREE.Group();
  scene.add(decor);
  const palmSpots = [
    [-26, -6], [28, -2], [-34, 26], [34, 40], [-30, 64], [33, 78], [-24, 96],
  ];
  for (const [px, pz] of palmSpots) decor.add(makePalm(px, pz));
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2;
    const r = 40 + (i % 3) * 9;
    decor.add(makeRock(Math.cos(ang) * r, 30 + Math.sin(ang) * r * 0.7));
  }

  function update(dt) {
    water.material.uniforms['time'].value += dt;
  }

  return { sky, water, sun, dirLight, update, updateSun };
}

/* ---------- Procedural palm tree ---------- */
function makePalm(x, z) {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 0.9 });
  const segments = 6;
  let prev = new THREE.Vector3(0, 0, 0);
  const lean = (Math.random() - 0.5) * 0.5;
  for (let i = 0; i < segments; i++) {
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28 - i * 0.025, 0.34 - i * 0.025, 1.4, 8),
      trunkMat,
    );
    seg.position.set(prev.x, i * 1.35 + 0.7, prev.z);
    seg.rotation.z = lean * (i / segments);
    seg.castShadow = true;
    g.add(seg);
    prev = new THREE.Vector3(seg.position.x + lean * 0.6, 0, prev.z);
  }
  const crownY = segments * 1.35;
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x4f8f4a,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 8; i++) {
    const frond = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4.2, 4), frondMat);
    const a = (i / 8) * Math.PI * 2;
    frond.position.set(prev.x + Math.cos(a) * 1.4, crownY + 0.4, z * 0 + Math.sin(a) * 1.4);
    frond.rotation.z = Math.PI / 2.2;
    frond.rotation.y = a;
    frond.scale.set(1, 1, 0.18);
    frond.castShadow = true;
    g.add(frond);
  }
  // coconuts
  const cocoMat = new THREE.MeshStandardMaterial({ color: 0x5b4326, roughness: 0.8 });
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), cocoMat);
    c.position.set(prev.x + Math.cos(i * 2) * 0.5, crownY - 0.1, Math.sin(i * 2) * 0.5);
    g.add(c);
  }
  g.position.set(x, 0, z);
  g.rotation.y = Math.random() * Math.PI * 2;
  return g;
}

/* ---------- Procedural rock ---------- */
function makeRock(x, z) {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(
      i,
      p.getX(i) * (1 + (Math.random() - 0.5) * 0.4),
      p.getY(i) * (1 + (Math.random() - 0.5) * 0.4),
      p.getZ(i) * (1 + (Math.random() - 0.5) * 0.4),
    );
  }
  geo.computeVertexNormals();
  const rock = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: 0x7c7468, roughness: 1 }),
  );
  const sc = 0.6 + Math.random() * 1.4;
  rock.scale.set(sc, sc * 0.6, sc);
  rock.position.set(x, 0.1, z);
  rock.rotation.set(Math.random(), Math.random(), Math.random());
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}
