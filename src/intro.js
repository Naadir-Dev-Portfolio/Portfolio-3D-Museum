/* ============================================================
   INTRO  —  src/intro.js
   The "Enter" splash. Fills in the identity text and, on click,
   fades the overlay out and hands control to the experience
   (which sweeps the camera down into the world).
   ============================================================ */

import { PROFILE } from './data.js';

export function setupIntro(onEnter) {
  const overlay = document.getElementById('intro');
  const btn = document.getElementById('enter-btn');

  document.getElementById('intro-name').textContent = PROFILE.name;
  document.getElementById('intro-role').textContent = PROFILE.role;
  document.getElementById('intro-tag').textContent = PROFILE.tagline;

  let entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    overlay.classList.add('hidden');
    // let the fade begin before the camera move
    setTimeout(onEnter, 120);
  }

  btn.addEventListener('click', enter);
}
