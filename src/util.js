/* ============================================================
   UTILITIES  —  src/util.js
   Tiny tween engine, canvas-based text textures, and a safe
   image loader with a procedural fallback. No external deps.
   ============================================================ */

import * as THREE from 'three';

/* ---------- Easing ---------- */
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ---------- Tween engine ----------
   Each tween reports normalised progress (0..1) to onUpdate.
   Callers lerp their own values inside onUpdate, which keeps the
   engine agnostic about what is being animated. */
const tweens = new Set();

export function tween({ duration = 1, delay = 0, ease = easeInOutCubic, onUpdate, onComplete }) {
  const t = { elapsed: -delay, duration, ease, onUpdate, onComplete, alive: true };
  tweens.add(t);
  return t;
}

export function cancelTween(t) {
  if (t) tweens.delete(t);
}

export function updateTweens(dt) {
  for (const t of tweens) {
    t.elapsed += dt;
    if (t.elapsed < 0) continue; // still in delay
    const raw = t.duration <= 0 ? 1 : Math.min(t.elapsed / t.duration, 1);
    const p = t.ease(raw);
    if (t.onUpdate) t.onUpdate(p);
    if (raw >= 1) {
      tweens.delete(t);
      if (t.onComplete) t.onComplete();
    }
  }
}

/* ---------- Text rendered to a CanvasTexture ----------
   Returns { texture, width, height } where width/height are the
   canvas pixel dimensions so callers can size a plane by aspect. */
export function makeTextTexture(text, opts = {}) {
  const {
    width = 1024,
    height = 256,
    font = "600 textpx 'Inter', system-ui, sans-serif",
    fontSize = 96,
    color = '#f1f4f7',
    bg = 'rgba(0,0,0,0)',
    align = 'center',
    lineHeight = 1.18,
    maxLines = 4,
  } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = align;
  ctx.font = font.replace('textpx', `${fontSize}px`);

  // Word-wrap to fit the canvas width.
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  const pad = width * 0.06;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > width - pad * 2 && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);

  const x = align === 'left' ? pad : align === 'right' ? width - pad : width / 2;
  const lh = fontSize * lineHeight;
  let y = height / 2 - ((shown.length - 1) * lh) / 2;
  for (const l of shown) {
    ctx.fillText(l, x, y);
    y += lh;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return { texture, width, height };
}

/* ---------- Procedural fallback card ----------
   Used when a screenshot can't be fetched (offline, CORS, 404).
   Draws a tasteful gradient + the project title so the case is
   never blank. */
export function makeFallbackTexture(title, accent = '#9aa3ad') {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#171a1d');
  g.addColorStop(1, '#20242a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // accent corner glow
  const rg = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, w * 0.6);
  rg.addColorStop(0, hexToRgba(accent, 0.35));
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.fillStyle = '#edf0f3';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "700 72px 'Inter', system-ui, sans-serif";
  wrapText(ctx, title, w / 2, h / 2, w - 160, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function wrapText(ctx, text, cx, cy, maxWidth, lh) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  let y = cy - ((lines.length - 1) * lh) / 2;
  for (const l of lines) {
    ctx.fillText(l, cx, y);
    y += lh;
  }
}

export function hexToRgba(hex, a = 1) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ---------- Safe image loader ----------
   Loads a screenshot onto a material, swapping in a fallback card
   if the fetch fails. Resolves the texture either way. */
const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';

export function loadProjectTexture(url, title, accentHex) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(makeFallbackTexture(title, accentHex));
      return;
    }
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        resolve(tex);
      },
      undefined,
      () => resolve(makeFallbackTexture(title, accentHex)),
    );
  });
}
