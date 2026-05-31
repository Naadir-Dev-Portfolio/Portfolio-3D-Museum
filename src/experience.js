/* ============================================================
   EXPERIENCE  —  src/experience.js
   The controller. Owns the camera journey: an establishing shot,
   waypoint-to-waypoint travel via clickable floor arrows, free
   look-around (OrbitControls), and the click-to-focus move that
   flies up to a project and reveals its screenshot + details.
   ============================================================ */

import * as THREE from 'three';
import { CONFIG } from './config.js';
import { tween, easeInOutCubic } from './util.js';

export function createExperience({ renderer, scene, camera, controls, galleries }) {
  const { eyeY, lookY, hallFrontZ, deckY } = CONFIG;

  /* ---------- Waypoints (entrance + one per gallery) ---------- */
  const waypoints = [
    {
      name: 'Beachfront Entrance',
      pos: new THREE.Vector3(0, eyeY, hallFrontZ - 8),
      target: new THREE.Vector3(0, lookY, hallFrontZ + 4),
    },
    ...galleries.sectionAnchors.map((a) => ({
      name: a.label,
      pos: new THREE.Vector3(0, eyeY, a.z),
      target: new THREE.Vector3(0, lookY, a.z + 6),
    })),
  ];

  let index = 0;
  let mode = 'intro'; // 'intro' | 'touring' | 'focused'
  let camLocked = false;
  let returnIndex = 0;

  /* ---------- Floor arrows ---------- */
  const arrowGroup = new THREE.Group();
  arrowGroup.visible = false; // hidden until the visitor enters
  scene.add(arrowGroup);
  // unlit so tone mapping can't mute it — reads vividly on any surface
  const arrowMat = () =>
    new THREE.MeshBasicMaterial({ color: 0x66e4ff, toneMapped: false, transparent: true });
  const makeArrow = (nav) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.62);
    shape.lineTo(0.52, 0.02);
    shape.lineTo(0.22, 0.02);
    shape.lineTo(0.22, -0.5);
    shape.lineTo(-0.22, -0.5);
    shape.lineTo(-0.22, 0.02);
    shape.lineTo(-0.52, 0.02);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
    const mesh = new THREE.Mesh(geo, arrowMat());
    mesh.rotation.x = Math.PI / 2; // lay flat, tip toward +z
    mesh.scale.setScalar(2.0);
    mesh.userData.nav = nav;
    mesh.userData.baseScale = 2.0;
    const g = new THREE.Group();
    g.add(mesh);
    g.userData.mesh = mesh;
    arrowGroup.add(g);
    return g;
  };
  const arrows = {
    forward: makeArrow('forward'),
    back: makeArrow('back'),
    left: makeArrow('left'),
    right: makeArrow('right'),
  };
  arrows.forward.rotation.y = 0;
  arrows.back.rotation.y = Math.PI;
  arrows.right.rotation.y = Math.PI / 2;
  arrows.left.rotation.y = -Math.PI / 2;
  let activeArrows = [];
  let arrowPulse = 0;

  function layoutArrows() {
    const wp = waypoints[index];
    const y = deckY + 0.1;
    const z = wp.pos.z;
    arrows.forward.position.set(0, y, z + 3.6);
    arrows.back.position.set(0, y, z - 3.6);
    arrows.left.position.set(-3.2, y, z + 0.4);
    arrows.right.position.set(3.2, y, z + 0.4);

    activeArrows = [];
    const show = (g, on) => {
      g.visible = on;
      if (on) activeArrows.push(g.userData.mesh);
    };
    const touring = mode === 'touring';
    show(arrows.forward, touring && index < waypoints.length - 1);
    show(arrows.back, touring && index > 0);
    show(arrows.left, touring);
    show(arrows.right, touring);
  }

  /* ---------- DOM ---------- */
  const areaLabel = document.getElementById('area-label');
  const navHint = document.getElementById('nav-hint');
  const card = document.getElementById('info-card');

  function setArea(name) {
    if (areaLabel) {
      areaLabel.textContent = name;
      areaLabel.classList.add('show');
    }
  }

  /* ---------- Camera movement ---------- */
  function moveCamera(pos, target, dur, onDone) {
    camLocked = true;
    const sp = camera.position.clone();
    const st = controls.target.clone();
    tween({
      duration: dur,
      ease: easeInOutCubic,
      onUpdate: (p) => {
        camera.position.lerpVectors(sp, pos, p);
        controls.target.lerpVectors(st, target, p);
        camera.lookAt(controls.target);
      },
      onComplete: () => {
        controls.target.copy(target);
        controls.update();
        camLocked = false;
        if (onDone) onDone();
      },
    });
  }

  function goToWaypoint(i) {
    if (camLocked) return;
    index = THREE.MathUtils.clamp(i, 0, waypoints.length - 1);
    const wp = waypoints[index];
    arrowGroup.visible = false;
    moveCamera(wp.pos.clone(), wp.target.clone(), 1.5, () => {
      layoutArrows();
      arrowGroup.visible = true;
    });
    setArea(wp.name);
  }

  // rotate the view ~55° to face the side cases without moving
  function lookSide(sign) {
    if (camLocked) return;
    const fwd = new THREE.Vector3().subVectors(controls.target, camera.position);
    fwd.y = 0;
    const dist = Math.max(fwd.length(), 3);
    fwd.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), sign * THREE.MathUtils.degToRad(55));
    const t = camera.position.clone().add(fwd.multiplyScalar(dist));
    t.y = lookY;
    moveCamera(camera.position.clone(), t, 0.8);
  }

  /* ---------- Focus a project ---------- */
  let focused = null;

  // ease the floating emblem out of the way so the screenshot is revealed
  function tuckEmblem(c, tuck) {
    const fromY = c.emblemBaseY;
    const toY = tuck ? c.emblemHomeY - 1.05 : c.emblemHomeY;
    const fromS = c.emblem.scale.x;
    const toS = tuck ? c.emblemHomeScale * 0.5 : c.emblemHomeScale;
    tween({
      duration: 0.7,
      onUpdate: (p) => {
        c.emblemBaseY = THREE.MathUtils.lerp(fromY, toY, p);
        c.emblem.scale.setScalar(THREE.MathUtils.lerp(fromS, toS, p));
      },
    });
  }

  function focusCase(c) {
    if (mode === 'focused' || camLocked) return;
    returnIndex = index;
    mode = 'focused';
    focused = c;
    arrowGroup.visible = false;
    activeArrows = [];
    moveCamera(c.focusPos.clone(), c.focusTarget.clone(), 1.3);
    tuckEmblem(c, true);
    setArea(`${c.section.label}  ·  ${c.project.title}`);
    showInfo(c.project);
  }

  function exitFocus() {
    if (mode !== 'focused') return;
    mode = 'touring';
    if (focused) tuckEmblem(focused, false);
    focused = null;
    hideInfo();
    const wp = waypoints[index];
    arrowGroup.visible = false;
    moveCamera(wp.pos.clone(), wp.target.clone(), 1.1, () => {
      layoutArrows();
      arrowGroup.visible = true;
    });
    setArea(wp.name);
  }

  function showInfo(p) {
    if (!card) return;
    const tags = (p.tags || []).map((t) => `<span>${t}</span>`).join('');
    const links = [];
    if (p.demo) links.push(`<a href="${p.demo}" target="_blank" rel="noreferrer" class="ic-btn ic-primary">Live demo ↗</a>`);
    if (p.details) links.push(`<a href="${p.details}" target="_blank" rel="noreferrer" class="ic-btn">View project ↗</a>`);
    card.innerHTML = `
      <button class="ic-close" id="ic-close">← Back to gallery</button>
      <div class="ic-tags">${tags}</div>
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
      <div class="ic-links">${links.join('')}</div>`;
    card.classList.add('show');
    document.getElementById('ic-close').onclick = exitFocus;
  }

  function hideInfo() {
    if (card) card.classList.remove('show');
  }

  /* ---------- Picking ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = null;

  function setNdc(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }

  function pick() {
    ray.setFromCamera(ndc, camera);
    const targets = [...activeArrows, ...galleries.clickables];
    const hits = ray.intersectObjects(targets, false);
    return hits.length ? hits[0].object : null;
  }

  function onPointerDown(e) {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  }
  function onPointerUp(e) {
    if (!down || camLocked || mode === 'intro') {
      down = null;
      return;
    }
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const dt = performance.now() - down.t;
    down = null;
    if (moved > 7 || dt > 600) return; // treat as a drag, not a click
    setNdc(e);
    const obj = pick();
    if (!obj) return;
    if (obj.userData.nav) {
      const nav = obj.userData.nav;
      if (nav === 'forward') goToWaypoint(index + 1);
      else if (nav === 'back') goToWaypoint(index - 1);
      else if (nav === 'left') lookSide(-1);
      else if (nav === 'right') lookSide(1);
    } else if (obj.userData.caseRef) {
      focusCase(obj.userData.caseRef);
    }
  }
  function onPointerMove(e) {
    if (camLocked || mode === 'intro') {
      renderer.domElement.style.cursor = '';
      return;
    }
    setNdc(e);
    renderer.domElement.style.cursor = pick() ? 'pointer' : 'grab';
  }
  function onKey(e) {
    if (e.key === 'Escape' && mode === 'focused') exitFocus();
    if (mode !== 'touring') return;
    if (e.key === 'ArrowUp' || e.key === 'w') goToWaypoint(index + 1);
    else if (e.key === 'ArrowDown' || e.key === 's') goToWaypoint(index - 1);
    else if (e.key === 'ArrowLeft' || e.key === 'a') lookSide(-1);
    else if (e.key === 'ArrowRight' || e.key === 'd') lookSide(1);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  window.addEventListener('keydown', onKey);

  /* ---------- Public API ---------- */
  function start() {
    // From the establishing shot, sweep down into the entrance.
    mode = 'touring';
    if (navHint) navHint.classList.add('show');
    moveCamera(waypoints[0].pos.clone(), waypoints[0].target.clone(), 3.2, () => {
      layoutArrows();
      arrowGroup.visible = true;
    });
    setArea(waypoints[0].name);
  }

  function update(dt) {
    galleries.update(dt);
    // pulse the arrows (opacity + gentle scale)
    arrowPulse += dt;
    const o = 0.7 + Math.sin(arrowPulse * 3) * 0.3;
    for (const k in arrows) {
      const m = arrows[k].userData.mesh;
      m.material.opacity = o;
      m.scale.setScalar(m.userData.baseScale * (1 + Math.sin(arrowPulse * 3) * 0.06));
    }
  }

  return { start, update, get locked() { return camLocked; }, get mode() { return mode; } };
}
