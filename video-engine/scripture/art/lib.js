// Shared drawing helpers for the scripture series (2D canvas, 1080x1920 world at zoom 1).
const W = 1080, H = 1920, INK = '#2a1a12';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = x => 1 - Math.pow(1 - clamp(x), 3), ei = x => Math.pow(clamp(x), 3);
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const P = {}; const path = d => P[d] || (P[d] = new Path2D(d));
// fill (and optionally ink-outline) an SVG path string in the current transform
function sh(g, d, fill, lw = 0, stroke = INK) { const p = path(d); if (fill) { g.fillStyle = fill; g.fill(p); } if (lw) { g.lineWidth = lw; g.strokeStyle = stroke; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(p); } }
function ell(g, x, y, rx, ry, fill, lw = 0, rot = 0, stroke = INK) { g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (lw) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); } }
function line(g, pts, lw, col = INK, cap = 'round') { g.beginPath(); g.moveTo(pts[0], pts[1]); if (pts.length === 4) g.lineTo(pts[2], pts[3]); else if (pts.length === 6) g.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); else g.bezierCurveTo(pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]); g.lineWidth = lw; g.strokeStyle = col; g.lineCap = cap; g.lineJoin = 'round'; g.stroke(); }
// a limb: ink outline stroke under a coloured stroke
function limb(g, pts, w, col, ink = 7) { line(g, pts, w + ink * 2, INK); line(g, pts, w, col); }
function lg(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
function rg(g, x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
function glow(g, x, y, r, col, a = 1) { g.save(); g.globalAlpha *= a; g.globalCompositeOperation = 'lighter'; g.fillStyle = rg(g, x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
function rays(g, x, y, r, n, col, a, t = 0, spread = .09) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const an = i / n * Math.PI * 2 + t * .05, w = spread * (0.6 + .4 * Math.sin(i * 2.3)); g.globalAlpha = a * (0.5 + .5 * Math.sin(i * 1.7 + t * .8)); g.fillStyle = rg(g, x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, an - w, an + w); g.closePath(); g.fill(); } g.restore(); }
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function mix(h1, h2, k) { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); const c = s => Math.round(lerp(a >> s & 255, b >> s & 255, k)); return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1); }
// draw fn into an offscreen layer, then optionally flatten it to a single colour (silhouettes) — returns the canvas
const LAYERS = [];
function layer(i) { if (!LAYERS[i]) { const c = document.createElement('canvas'); c.width = W; c.height = H; LAYERS[i] = c; } const c = LAYERS[i], x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; return [c, x]; }
function silhouette(g, i, col, fn) { const [c, x] = layer(i); x.setTransform(g.getTransform()); fn(x); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, W, H); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, 0); g.restore(); }
