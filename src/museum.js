/* ============================================================
   MUSEUM  —  src/museum.js
   The glass pavilion on the beach: a concrete deck, a dark steel
   frame, transmissive glass walls (open toward the sea) and a flat
   roof. The galleries (display cases) are added separately.
   ============================================================ */

import * as THREE from 'three';
import { CONFIG, sectionZ } from './config.js';
import { makeTextTexture } from './util.js';

export function buildMuseum(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const frontZ = CONFIG.hallFrontZ; // -8 (entrance side)
  const backZ = sectionZ(6) + 8; // behind the last gallery
  const hw = CONFIG.hallHalfWidth; // 9
  const deckTop = CONFIG.deckY; // 0.6
  const roofY = CONFIG.roofY; // 9.5
  const glassTop = roofY - 0.25;

  /* ---------- Materials ---------- */
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fb6c4,
    metalness: 0,
    roughness: 0.04,
    transmission: 0.92,
    thickness: 0.6,
    ior: 1.4,
    transparent: true,
    side: THREE.DoubleSide,
    envMapIntensity: 1.4,
    clearcoat: 0.35,
    clearcoatRoughness: 0.1,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x20242a,
    metalness: 0.85,
    roughness: 0.35,
    envMapIntensity: 1.1,
  });
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xb8b0a3,
    roughness: 0.85,
    metalness: 0,
  });
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0xa79a86,
    roughness: 0.7,
    metalness: 0,
  });

  /* ---------- Deck (with a front terrace toward the sea) ---------- */
  const deckFrontZ = frontZ - 12;
  const deckLen = backZ + 3 - deckFrontZ;
  const deckCenterZ = (deckFrontZ + backZ + 3) / 2;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(hw * 2 + 6, 0.6, deckLen), deckMat);
  deck.position.set(0, deckTop - 0.3, deckCenterZ);
  deck.receiveShadow = true;
  group.add(deck);

  // plinth lip around the deck edge for a finished look
  const lip = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 6.6, 0.3, deckLen + 0.6),
    concreteMat,
  );
  lip.position.set(0, deckTop - 0.55, deckCenterZ);
  lip.receiveShadow = true;
  group.add(lip);

  // a runner "carpet" down the centre of the hall
  const runner = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, backZ - frontZ),
    new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.9 }),
  );
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, deckTop + 0.011, (frontZ + backZ) / 2);
  runner.receiveShadow = true;
  group.add(runner);

  /* ---------- Helpers ---------- */
  const beam = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), steelMat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  // glass panel spanning a length along z at a given x (a side wall)
  const glassZ = (x, z0, z1) => {
    const len = z1 - z0;
    const g = new THREE.Mesh(new THREE.BoxGeometry(0.12, glassTop - deckTop, len), glassMat);
    g.position.set(x, (deckTop + glassTop) / 2, (z0 + z1) / 2);
    group.add(g);
    return g;
  };
  // glass panel spanning a width along x at a given z (front/back wall)
  const glassX = (z, x0, x1) => {
    const len = x1 - x0;
    const g = new THREE.Mesh(new THREE.BoxGeometry(len, glassTop - deckTop, 0.12), glassMat);
    g.position.set((x0 + x1) / 2, (deckTop + glassTop) / 2, z);
    group.add(g);
    return g;
  };

  /* ---------- Side walls (glass) ---------- */
  glassZ(-hw, frontZ, backZ);
  glassZ(hw, frontZ, backZ);
  // back wall
  glassX(backZ, -hw, hw);
  // front returns either side of the central entrance opening (x: -3..3 open)
  glassX(frontZ, -hw, -3);
  glassX(frontZ, 3, hw);

  /* ---------- Steel frame: columns ---------- */
  const colH = roofY - deckTop;
  const colY = deckTop + colH / 2;
  const colZs = [];
  for (let z = frontZ; z <= backZ + 0.01; z += (backZ - frontZ) / 7) colZs.push(z);
  for (const z of colZs) {
    beam(0.4, colH, 0.4, -hw, colY, z);
    beam(0.4, colH, 0.4, hw, colY, z);
  }
  // entrance posts
  beam(0.45, colH, 0.45, -3, colY, frontZ);
  beam(0.45, colH, 0.45, 3, colY, frontZ);

  // top & bottom rails along the side walls
  beam(0.3, 0.3, backZ - frontZ, -hw, glassTop, (frontZ + backZ) / 2);
  beam(0.3, 0.3, backZ - frontZ, hw, glassTop, (frontZ + backZ) / 2);
  beam(0.3, 0.25, backZ - frontZ, -hw, deckTop + 0.1, (frontZ + backZ) / 2);
  beam(0.3, 0.25, backZ - frontZ, hw, deckTop + 0.1, (frontZ + backZ) / 2);

  /* ---------- Roof ---------- */
  const roofZ0 = frontZ - 2;
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 2, 0.5, backZ - roofZ0 + 2),
    steelMat,
  );
  roof.position.set(0, roofY, (roofZ0 + backZ) / 2 + 1);
  roof.castShadow = true;
  group.add(roof);

  // soffit underside (lighter) so the ceiling doesn't read pure black
  const soffit = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 1.4, 0.08, backZ - roofZ0 + 1.4),
    new THREE.MeshStandardMaterial({ color: 0x3a4048, roughness: 0.8 }),
  );
  soffit.position.set(0, roofY - 0.3, (roofZ0 + backZ) / 2 + 1);
  group.add(soffit);

  // front fascia + entrance sign
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(hw * 2 + 2, 1.2, 0.3), steelMat);
  fascia.position.set(0, roofY - 0.7, roofZ0);
  fascia.castShadow = true;
  group.add(fascia);

  const { texture: signTex, width, height } = makeTextTexture('NAADIR  DUGLAS', {
    width: 1024,
    height: 200,
    fontSize: 120,
    color: '#f1f4f7',
  });
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(7, (7 * height) / width),
    new THREE.MeshBasicMaterial({ map: signTex, transparent: true }),
  );
  sign.position.set(0, roofY - 0.7, roofZ0 - 0.17);
  sign.rotation.y = Math.PI; // face the approaching visitor (-z / sea side)
  group.add(sign);

  const { texture: subTex, width: sw, height: sh } = makeTextTexture('3D PORTFOLIO MUSEUM', {
    width: 1024,
    height: 120,
    fontSize: 64,
    color: '#9aa3ad',
  });
  const sub = new THREE.Mesh(
    new THREE.PlaneGeometry(5, (5 * sh) / sw),
    new THREE.MeshBasicMaterial({ map: subTex, transparent: true }),
  );
  sub.position.set(0, roofY - 1.45, roofZ0 - 0.17);
  sub.rotation.y = Math.PI;
  group.add(sub);

  /* ---------- Glass railing along the front terrace (sea side) ---------- */
  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 4, 1.1, 0.1),
    glassMat,
  );
  rail.position.set(0, deckTop + 0.55, deckFrontZ + 0.3);
  group.add(rail);
  beam(hw * 2 + 4.2, 0.12, 0.16, 0, deckTop + 1.12, deckFrontZ + 0.3);

  return { group, glassMat, steelMat };
}
