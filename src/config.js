/* ============================================================
   CONFIG  —  src/config.js
   Shared world coordinates so every module agrees on scale and
   placement. Tweak these to reshape the museum.
   ============================================================ */

export const CONFIG = {
  // Vertical reference planes
  seaLevel: -0.5,
  deckY: 0.6, // top surface of the museum floor

  // Camera posture while touring
  eyeY: 3.6, // absolute camera height at a waypoint
  lookY: 3.0, // height the camera aims at down the hall

  // Pavilion footprint (x = across, z = depth into the museum)
  hallHalfWidth: 9, // glass side walls sit at x = ±9
  hallFrontZ: -8, // open face toward the sea
  roofY: 9.5,

  // Gallery layout
  sectionSpacing: 13, // distance between section centres along z
  firstSectionZ: 4, // z of the first gallery
  caseRowX: 6.0, // free-standing cases line up at x = ±caseRowX

  // Beach / sea
  shoreZ: -34, // where the sand slopes into the water

  // Golden-hour sun (degrees) — low over the sea in front of the entrance
  sun: { elevation: 5, azimuth: 173 },

  // CDN base for the three.js example texture used by Water
  waterNormalsUrl:
    'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/textures/waternormals.jpg',
};

// z-position of section i (0-based)
export function sectionZ(i) {
  return CONFIG.firstSectionZ + i * CONFIG.sectionSpacing;
}
