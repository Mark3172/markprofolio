import * as THREE from 'three';

/** Small canvas helpers so all 3D text is drawn at runtime (no font files to download). */

export function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function rrect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Draws wrapped text; returns the y after the last line. */
export function wrap(g, text, x, y, maxW, lineH, maxLines = 99) {
  const words = String(text).split(/\s+/);
  let line = '';
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (g.measureText(test).width > maxW && line) {
      lines++;
      if (lines === maxLines) {
        g.fillText(line.replace(/\s*\S*$/, '') + '…', x, y);
        return y + lineH;
      }
      g.fillText(line, x, y);
      y += lineH;
      line = words[i];
    } else line = test;
  }
  if (line) {
    g.fillText(line, x, y);
    y += lineH;
  }
  return y;
}

const DISPLAY = '"Space Grotesk", system-ui, sans-serif';
const BODY = 'Inter, system-ui, sans-serif';
export const fonts = { DISPLAY, BODY };

/** Floating camera-facing label. */
export function makeLabel(text, { sub = '', color = '#ffffff', scale = 1, accent = '#7cf5ff' } = {}) {
  const tex = canvasTexture(1024, 256, (g, w, h) => {
    g.textAlign = 'center';
    g.shadowColor = 'rgba(0,0,0,0.6)';
    g.shadowBlur = 18;
    if (sub) {
      g.font = `600 40px ${BODY}`;
      g.fillStyle = accent;
      g.fillText(sub.toUpperCase().split('').join(' '), w / 2, 70);
    }
    g.font = `700 104px ${DISPLAY}`;
    g.fillStyle = color;
    g.fillText(text, w / 2, sub ? 190 : 150, w - 40);
  });
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false });
  const s = new THREE.Sprite(mat);
  s.scale.set(8 * scale, 2 * scale, 1);
  return s;
}

export function chipRow(g, items, x, y, maxW, color) {
  g.font = `500 26px ${BODY}`;
  let cx = x;
  let cy = y;
  for (const it of items) {
    const w = g.measureText(it).width + 28;
    if (cx + w > x + maxW) {
      cx = x;
      cy += 48;
    }
    rrect(g, cx, cy, w, 38, 19);
    g.fillStyle = 'rgba(255,255,255,0.08)';
    g.fill();
    g.strokeStyle = color + '88';
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = '#e8eaff';
    g.fillText(it, cx + 14, cy + 27);
    cx += w + 10;
  }
}
