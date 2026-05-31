/* ============================================================
   DISPLAYS  —  src/displays.js
   Each project becomes a glass display case: a plinth, a glass
   vitrine, a backlit screenshot panel, a floating procedural
   "3D visual" emblem for its category, and a title label. Cases
   line the central walkway in section bays.
   ============================================================ */

import * as THREE from 'three';
import { CONFIG, sectionZ } from './config.js';
import { makeTextTexture, makeFallbackTexture, loadProjectTexture } from './util.js';

const PLINTH_W = 1.9;
const PLINTH_H = 1.4;
const PLINTH_D = 1.3;
const VITRINE_W = 2.5;
const VITRINE_H = 2.6;
const VITRINE_D = 1.5;

export function buildGalleries(scene, SECTIONS) {
  const root = new THREE.Group();
  scene.add(root);

  const cases = [];
  const clickables = [];
  const sectionAnchors = [];
  let clock = 0;

  SECTIONS.forEach((section, si) => {
    const cz = sectionZ(si);
    sectionAnchors.push({ id: section.id, label: section.label, z: cz });

    buildSectionBanner(root, section, cz, si);

    section.projects.forEach((project, pi) => {
      const side = pi % 2 === 0 ? -1 : 1; // left / right of the walkway
      const row = Math.floor(pi / 2);
      const rowsOnSide = Math.ceil(section.projects.length / 2);
      const zOff = (row - (rowsOnSide - 1) / 2) * 4.6;
      const x = side * CONFIG.caseRowX;
      const z = cz + zOff;
      const facing = new THREE.Vector3(-side, 0, 0); // points toward the walkway (x=0)
      const c = buildCase(root, project, section, x, z, facing);
      cases.push(c);
      clickables.push(c.hit);
    });
  });

  function update(dt) {
    clock += dt;
    for (const c of cases) {
      c.emblem.rotation.y += dt * 0.5;
      c.emblem.position.y = c.emblemBaseY + Math.sin(clock * 1.4 + c.phase) * 0.07;
      if (c.pulse) {
        const s = 1 + Math.sin(clock * 2 + c.phase) * 0.06;
        c.pulse.scale.setScalar(s);
      }
    }
  }

  return { root, cases, clickables, sectionAnchors, update };
}

/* ---------- One display case ---------- */
function buildCase(parent, project, section, x, z, facing) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = Math.atan2(facing.x, facing.z); // local +z -> facing
  parent.add(group);

  const accentHex = '#' + section.accent.toString(16).padStart(6, '0');
  const deckTop = CONFIG.deckY;
  const plinthTop = deckTop + PLINTH_H;
  const vitrineCenterY = plinthTop + VITRINE_H / 2;

  // Plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(PLINTH_W, PLINTH_H, PLINTH_D),
    new THREE.MeshStandardMaterial({ color: 0x14171a, roughness: 0.6, metalness: 0.2 }),
  );
  plinth.position.set(0, deckTop + PLINTH_H / 2, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // accent light strip near the top of the plinth
  const strip = new THREE.Mesh(
    new THREE.PlaneGeometry(PLINTH_W * 0.8, 0.08),
    new THREE.MeshBasicMaterial({ color: section.accent }),
  );
  strip.position.set(0, plinthTop - 0.12, PLINTH_D / 2 + 0.001);
  group.add(strip);

  // Backlit screenshot panel at the rear of the vitrine
  const screenMat = new THREE.MeshBasicMaterial({
    map: makeFallbackTexture(project.title, accentHex),
    toneMapped: false,
  });
  const screenW = 2.0;
  const screenH = 1.28;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), screenMat);
  screen.position.set(0, vitrineCenterY + 0.05, -VITRINE_D / 2 + 0.08);
  group.add(screen);
  // thin frame around the screen
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(screenW + 0.12, screenH + 0.12),
    new THREE.MeshBasicMaterial({ color: 0x05070a }),
  );
  frame.position.set(0, vitrineCenterY + 0.05, -VITRINE_D / 2 + 0.07);
  group.add(frame);

  // load the real screenshot (falls back gracefully)
  loadProjectTexture(project.img, project.title, accentHex).then((tex) => {
    screenMat.map = tex;
    screenMat.needsUpdate = true;
  });

  // Floating category emblem
  const emblem = makeEmblem(section.emblem, section.accent);
  const emblemBaseY = vitrineCenterY - 0.15;
  emblem.position.set(0, emblemBaseY, 0.18);
  group.add(emblem);

  // Glass vitrine (cheap transparent, reflects the environment)
  const vitrine = new THREE.Mesh(
    new THREE.BoxGeometry(VITRINE_W, VITRINE_H, VITRINE_D),
    new THREE.MeshStandardMaterial({
      color: 0xaecbd6,
      transparent: true,
      opacity: 0.1,
      roughness: 0.05,
      metalness: 0,
      envMapIntensity: 1.2,
      depthWrite: false,
    }),
  );
  vitrine.position.set(0, vitrineCenterY, 0);
  group.add(vitrine);
  // crisp frame edges
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(vitrine.geometry),
    new THREE.LineBasicMaterial({ color: 0x2a2f36 }),
  );
  edges.position.copy(vitrine.position);
  group.add(edges);

  // Title label above the vitrine
  const { texture: titleTex, width, height } = makeTextTexture(project.title, {
    width: 1400,
    height: 200,
    fontSize: 74,
    color: '#f1f4f7',
    maxLines: 2,
  });
  const labelW = 2.3;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(labelW, (labelW * height) / width),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true }),
  );
  label.position.set(0, plinthTop + VITRINE_H + 0.32, 0.1);
  group.add(label);

  // Invisible raycast target (a touch larger than the vitrine)
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(VITRINE_W + 0.2, PLINTH_H + VITRINE_H, VITRINE_D + 0.2),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hit.position.set(0, deckTop + (PLINTH_H + VITRINE_H) / 2, 0);
  group.add(hit);

  // World-space poses for the focus camera move
  const worldPos = new THREE.Vector3();
  group.getWorldPosition(worldPos);
  const focusTarget = new THREE.Vector3(worldPos.x, vitrineCenterY + 0.05, worldPos.z);
  const focusPos = focusTarget.clone().add(facing.clone().multiplyScalar(4.0));
  focusPos.y = vitrineCenterY + 0.25;

  const caseObj = {
    project,
    section,
    group,
    emblem,
    emblemBaseY,
    emblemHomeY: emblemBaseY,
    emblemHomeScale: emblem.scale.x,
    screenMat,
    hit,
    facing,
    focusPos,
    focusTarget,
    phase: Math.random() * Math.PI * 2,
    pulse: emblem.userData.pulse || null,
  };
  hit.userData.caseRef = caseObj;
  return caseObj;
}

/* ---------- Section banner mounted high on a side wall ----------
   Alternating walls per section so the labels never stack into one
   another down the open hall. */
function buildSectionBanner(parent, section, cz, si) {
  const { texture, width, height } = makeTextTexture(section.label.toUpperCase(), {
    width: 1024,
    height: 220,
    fontSize: 104,
    color: '#f1f4f7',
  });
  const side = si % 2 === 0 ? -1 : 1; // left wall / right wall
  const x = side * (CONFIG.hallHalfWidth - 0.3);
  const rotY = side < 0 ? Math.PI / 2 : -Math.PI / 2; // face into the hall
  const w = 5;
  const h = (w * height) / width;

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
  );
  banner.position.set(x, 6.9, cz);
  banner.rotation.y = rotY;
  parent.add(banner);

  const bar = new THREE.Mesh(
    new THREE.PlaneGeometry(w, 0.07),
    new THREE.MeshBasicMaterial({ color: section.accent }),
  );
  bar.position.set(x, 6.9 - h / 2 - 0.12, cz);
  bar.rotation.y = rotY;
  parent.add(bar);
}

/* ---------- Procedural category emblems ---------- */
function makeEmblem(type, color) {
  const g = new THREE.Group();
  const lit = (c, emissiveBoost = 0.6) =>
    new THREE.MeshStandardMaterial({
      color: c,
      emissive: c,
      emissiveIntensity: emissiveBoost,
      roughness: 0.3,
      metalness: 0.3,
    });
  const wire = (c) => new THREE.MeshBasicMaterial({ color: c, wireframe: true });

  switch (type) {
    case 'chart': {
      const heights = [0.5, 0.85, 0.65, 1.05];
      heights.forEach((h, i) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.22), lit(color, 0.7));
        bar.position.set((i - 1.5) * 0.32, -0.5 + h / 2, 0);
        g.add(bar);
      });
      break;
    }
    case 'orb': {
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), lit(color, 1.1));
      g.add(core);
      const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), wire(color));
      g.add(shell);
      g.userData.pulse = core;
      break;
    }
    case 'code': {
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.72, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x0c0e10, roughness: 0.4, metalness: 0.4 }),
      );
      g.add(monitor);
      for (let i = 0; i < 3; i++) {
        const line = new THREE.Mesh(
          new THREE.PlaneGeometry(0.6 - i * 0.12, 0.06),
          new THREE.MeshBasicMaterial({ color }),
        );
        line.position.set(-0.18 + i * 0.02, 0.16 - i * 0.18, 0.05);
        g.add(line);
      }
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.28, 8),
        lit(color, 0.3),
      );
      stand.position.y = -0.5;
      g.add(stand);
      break;
    }
    case 'browser': {
      const winMat = new THREE.MeshStandardMaterial({
        color: 0x12161a,
        roughness: 0.4,
        metalness: 0.3,
      });
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.78, 0.06), winMat);
      g.add(win);
      const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.16), lit(color, 0.7));
      bar.position.set(0, 0.31, 0.04);
      g.add(bar);
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(
          new THREE.CircleGeometry(0.025, 12),
          new THREE.MeshBasicMaterial({ color: 0x12161a }),
        );
        dot.position.set(-0.46 + i * 0.08, 0.31, 0.05);
        g.add(dot);
      }
      break;
    }
    case 'game': {
      const shapes = [
        new THREE.TetrahedronGeometry(0.3),
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.OctahedronGeometry(0.3),
      ];
      const cols = [color, 0xffffff, color];
      shapes.forEach((geo, i) => {
        const m = new THREE.Mesh(geo, lit(cols[i], 0.6));
        const a = (i / shapes.length) * Math.PI * 2;
        m.position.set(Math.cos(a) * 0.45, Math.sin(a) * 0.25, Math.sin(a) * 0.2);
        g.add(m);
      });
      break;
    }
    case 'phone': {
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 1.02, 0.09),
        new THREE.MeshStandardMaterial({ color: 0x0c0e10, roughness: 0.35, metalness: 0.5 }),
      );
      g.add(body);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.86), lit(color, 0.8));
      scr.position.z = 0.05;
      g.add(scr);
      break;
    }
    case 'puzzle':
    default: {
      const gear = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.12, 10, 18), lit(color, 0.7));
      g.add(gear);
      for (let i = 0; i < 8; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.16), lit(color, 0.7));
        const a = (i / 8) * Math.PI * 2;
        tooth.position.set(Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0);
        g.add(tooth);
      }
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x12161a, roughness: 0.4 });
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 12).rotateX(Math.PI / 2), hubMat));
      break;
    }
  }
  g.scale.setScalar(1.05);
  return g;
}
