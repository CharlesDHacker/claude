// Scene "jp": deep, layered, richly detailed worlds behind flat 2D characters, in the reference's look.
// Each set is a stack of layers at depths k (0 = sky, fixed to the screen; 1 = the actors' plane; >1 = foreground). Static
// layers are painted once into cached canvases (with their depth blur baked in) and composited with parallax: a layer at
// depth k follows the camera by (1-k) and zooms by z^k, so push-ins open the space up. Live layers (water glints, petals,
// fireflies, flames) draw every frame. Over everything: drifting haze, twinkling four-point sparkles, and a woven
// red-and-white cord border (mizuhiki) with gold knots at the corners.
const JPC = {};
function cacheLayer(key, draw, opt = {}) { if (JPC[key]) return JPC[key]; const x0 = opt.x0 ?? -700, y0 = opt.y0 ?? -700, w = opt.w ?? 2480, h = opt.h ?? 3400, sc = opt.sc ?? 1;
  const cv = document.createElement('canvas'); cv.width = Math.ceil(w * sc); cv.height = Math.ceil(h * sc); const x = cv.getContext('2d'); x.scale(sc, sc); x.translate(-x0, -y0);
  if (opt.blur) { const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; const y = tmp.getContext('2d'); y.scale(sc, sc); y.translate(-x0, -y0); draw(y); x.setTransform(1, 0, 0, 1, 0, 0); x.filter = `blur(${opt.blur * sc}px)`; x.drawImage(tmp, 0, 0); x.filter = 'none'; }
  else draw(x);
  return (JPC[key] = { cv, x0, y0, w, h }); }
function layerAt(g, c, k, fn) { const [cx, cy, z] = c.cam; g.save(); g.translate(cx, cy); g.scale(Math.pow(z, k - 1), Math.pow(z, k - 1)); g.translate(-cx, -cy); g.translate((cx - 540) * (1 - k), (cy - 1200) * (1 - k) * .8); fn(); g.restore(); }
function blit(g, L) { g.drawImage(L.cv, L.x0, L.y0, L.w, L.h); }
// ---------- painting helpers ----------
function starsF(g, n, seed, y1 = 1000, a = 1) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * 2400 - 680, y = r() * (y1 + 680) - 680, s = r() < .1 ? 2.6 : 1 + r() * 1.2; ell(g, x, y, s, s, `rgba(255,255,240,${(.4 + r() * .6) * a})`); } }
function moonF(g, x, y, r) { glow(g, x, y, r * 7, 'rgba(230,236,255,1)', .32); ell(g, x, y, r, r, rg(g, x - r * .3, y - r * .3, 2, r, [[0, '#fffef6'], [1, '#e2e0d2']])); [[.3, -.2, .18], [-.25, .25, .14], [.1, .4, .1], [-.4, -.3, .09]].forEach(([dx, dy, s]) => ell(g, x + dx * r, y + dy * r, s * r, s * r, 'rgba(180,176,160,.35)')); }
function ridge(g, y, amp, col, seed, opt = {}) { const r = rng(seed), x0 = -700, x1 = 1780, st = opt.step || 160, pts = []; for (let x = x0; x <= x1; x += st) pts.push([x, y - (opt.peaks ? (r() < .5 ? amp * (.6 + r() * .4) : amp * r() * .35) : amp * (.3 + r() * .7))]);
  let d = `M${x0} ${y + 1600} L${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i]; d += opt.sharp ? ` L${(p[0] + q[0]) / 2} ${Math.min(p[1], q[1]) - amp * .12 * r()} L${q[0]} ${q[1]}` : ` Q${(p[0] + q[0]) / 2} ${Math.min(p[1], q[1]) - amp * .25} ${q[0]} ${q[1]}`; } d += ` L${x1} ${y + 1600} Z`;
  sh(g, d, col, 0); if (opt.snow) { g.save(); g.clip(path(d)); for (const [px, py] of pts) if (py < y - amp * .55) sh(g, `M${px - 70} ${py + 70} L${px} ${py - 6} L${px + 70} ${py + 70} L${px + 40} ${py + 56} L${px + 14} ${py + 80} L${px - 14} ${py + 60} L${px - 40} ${py + 84} Z`, opt.snow, 0); g.restore(); }
  if (opt.rim) { g.save(); g.clip(path(d)); g.globalAlpha = .5; g.fillStyle = opt.rim; for (const [px, py] of pts) { g.beginPath(); g.ellipse(px - 40, py + 20, 60, 160, .4, 0, 7); g.fill(); } g.restore(); } return d; }
function fujiF(g, x, y, s, col, snow) { g.save(); g.translate(x, y); g.scale(s, s); const d = 'M-900 0 C-600 -120 -260 -380 -110 -560 L110 -560 C260 -380 600 -120 900 0 Z'; sh(g, d, col, 0);
  sh(g, 'M-110 -560 L110 -560 C150 -510 190 -470 230 -430 L190 -440 L150 -400 L110 -446 L60 -390 L20 -440 L-30 -396 L-80 -450 L-130 -404 L-170 -446 L-230 -430 C-190 -470 -150 -510 -110 -560 Z', snow, 0); g.restore(); }
function forestBand(g, y, n, h, col, seed, x0 = -700, x1 = 1780) { const r = rng(seed); sh(g, `M${x0} ${y} L${x1} ${y} L${x1} ${y + 800} L${x0} ${y + 800} Z`, col, 0);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), hh = h * (.6 + r() * .6), w = hh * .32; sh(g, `M${x - w} ${y + 4} L${x} ${y - hh} L${x + w} ${y + 4} Z`, mix(col, r() < .5 ? '#000' : '#fff', r() * .08), 0); } }
function cloudF(g, x, y, s, col, rim) { g.save(); g.translate(x, y); g.scale(s, s); const blobs = [[-150, 10, 80], [-70, -36, 100], [40, -54, 110], [140, -20, 90], [210, 16, 64], [0, 20, 120], [-210, 30, 54]];
  if (rim) blobs.forEach(([cx, cy, r]) => ell(g, cx, cy - 6, r, r * .62, rim)); blobs.forEach(([cx, cy, r]) => ell(g, cx, cy, r, r * .6, col)); g.restore(); }
function grassField(g, y0, y1, n, cols, seed, x0 = -700, x1 = 1780, hgt = 26) { const r = rng(seed); for (let i = 0; i < n; i++) { const y = y0 + Math.pow(r(), .8) * (y1 - y0), x = x0 + r() * (x1 - x0), d = (y - y0) / (y1 - y0), h = (8 + r() * hgt) * (.5 + d), c = cols[Math.floor(r() * cols.length)];
  line(g, [x, y, x - 4 - r() * 6, y - h], 1.6 + d * 2.4, c, 'round', true); line(g, [x + 3, y, x + 6 + r() * 6, y - h * .8], 1.6 + d * 2.4, c, 'round', true); } }
function flowersF(g, y0, y1, n, cols, seed, x0 = -700, x1 = 1780) { const r = rng(seed); for (let i = 0; i < n; i++) { const y = y0 + Math.pow(r(), .8) * (y1 - y0), x = x0 + r() * (x1 - x0), d = (y - y0) / (y1 - y0), s = 2 + d * 6;
  line(g, [x, y, x + (r() - .5) * 6, y - s * 4], 1.2 + d, 'rgba(60,90,50,.8)', 'round', true); ell(g, x, y - s * 4, s, s * .8, cols[Math.floor(r() * cols.length)]); } }
function pebbles(g, y0, y1, n, seed, cols = ['#8a8478', '#a8a296', '#6e6a62']) { const r = rng(seed); for (let i = 0; i < n; i++) { const y = y0 + r() * (y1 - y0), x = r() * 2400 - 680, d = (y - y0) / (y1 - y0), w = (5 + r() * 12) * (.6 + d); ell(g, x, y, w, w * .55, cols[i % cols.length], 1.2, 0, 'rgba(40,30,30,.5)'); ell(g, x - w * .3, y - w * .2, w * .4, w * .18, 'rgba(255,255,255,.25)'); } }
function waterF(g, y0, y1, top, bot, seed) { g.fillStyle = lg(g, 0, y0, 0, y1, [[0, top], [1, bot]]); g.fillRect(-700, y0, 2480, y1 - y0); const r = rng(seed); for (let i = 0; i < 160; i++) { const y = y0 + Math.pow(r(), 1.4) * (y1 - y0), x = r() * 2480 - 700, w = 10 + (y - y0) * .08 + r() * 30; line(g, [x, y, x + w, y], 1.4 + (y - y0) * .004, `rgba(255,255,255,${.12 + r() * .18})`, 'round', true); } }
function sakuraTree(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); const bark = '#4a3030';
  limb(g, [0, 0, -30, -180, 40, -330, 20, -520], 60, bark, 5); limb(g, [24, -330, 150, -400, 260, -470, 380, -500], 30, bark, 4); limb(g, [10, -440, -100, -520, -200, -600], 26, bark, 4); limb(g, [150, -400, 200, -540, 180, -640], 20, bark, 4); limb(g, [260, -470, 330, -560], 14, bark, 3);
  for (let i = 0; i < 6; i++) line(g, [-10 + i * 6, -40 - i * 60, -4 + i * 8, -80 - i * 60], 2, 'rgba(255,220,220,.18)', 'round', true);
  const r = rng(31), tips = [[380, -500], [330, -560], [180, -640], [-200, -600], [260, -470], [60, -560], [120, -620], [-60, -560], [300, -420], [-120, -480]];
  tips.forEach(([tx, ty], j) => { for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = r() * 110, cx = tx + Math.cos(a) * d * 1.2, cy = ty + Math.sin(a) * d * .7, rr = 22 + r() * 22; ell(g, cx, cy, rr, rr * .82, ['#f8c4d4', '#f2a8be', '#fbd8e2', '#e890aa', '#fff0f4'][(i + j) % 5], 2.2, 0, 'rgba(160,70,100,.5)'); }
    for (let i = 0; i < 10; i++) sakura(g, tx + (r() - .5) * 220, ty + (r() - .5) * 140, 7 + r() * 5, 'rgba(255,248,250,.95)'); });
  g.restore(); }
function shimenawa(g, x0, y0, x1, y1, sag) { const n = 16; let prev = null; for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag; if (prev) { line(g, [prev[0], prev[1], x, y], 22, '#c8b07a', 'round', true); line(g, [prev[0], prev[1], x, y], 22, 'rgba(60,40,20,.0)'); } prev = [x, y]; }
  for (let i = 0; i < n * 3; i++) { const u = i / (n * 3), x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag; line(g, [x - 8, y - 9, x + 8, y + 9], 2.2, 'rgba(110,80,40,.6)', 'round', true); }
  [.2, .4, .6, .8].forEach(u => { const x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag + 12; sh(g, `M${x - 12} ${y} L${x + 12} ${y} L${x + 4} ${y + 24} L${x + 16} ${y + 24} L${x + 6} ${y + 52} L${x - 8} ${y + 52} L${x + 2} ${y + 28} L${x - 12} ${y + 28} Z`, '#fbf8f0', 1.6, 'rgba(90,80,70,.6)'); }); }
// ---------- overlays ----------
function sparkles(g, T, n, seed, a = 1) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * 1080, y = r() * 1920, ph = r() * 6.28, sp = .8 + r() * 1.6, tw = Math.max(0, Math.sin(T * sp + ph)), s = (4 + r() * 9) * tw; if (s < .8) continue;
  g.save(); g.globalAlpha = a * tw * .9; g.fillStyle = '#fffdf2'; g.beginPath(); g.moveTo(x, y - s * 2); g.quadraticCurveTo(x, y, x + s * 2, y); g.quadraticCurveTo(x, y, x, y + s * 2); g.quadraticCurveTo(x, y, x - s * 2, y); g.quadraticCurveTo(x, y, x, y - s * 2); g.fill(); g.restore(); } }
let CORD = null;
function cordFrame(g) { if (!CORD) { const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920; const x = cv.getContext('2d'), m = 22, w = 26;
    x.fillStyle = '#1a1014'; x.fillRect(0, 0, 1080, m + w + 6); x.fillRect(0, 1920 - m - w - 6, 1080, m + w + 6); x.fillRect(0, 0, m + w + 6, 1920); x.fillRect(1080 - m - w - 6, 0, m + w + 6, 1920);
    const run = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 18), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
      for (let i = 0; i < n; i++) { const px = x0 + ux * i * 18, py = y0 + uy * i * 18; [0, 1].forEach(k => { x.save(); x.translate(px + ux * 9 * k, py + uy * 9 * k); x.rotate(Math.atan2(uy, ux) + (k ? .7 : -.7)); x.fillStyle = k ? '#d8342a' : '#f6efe2'; x.beginPath(); x.ellipse(0, 0, 13, 6, 0, 0, 7); x.fill(); x.lineWidth = 1.6; x.strokeStyle = '#3b2416'; x.stroke(); x.restore(); }); } };
    const a = m + w / 2; run(a, a, 1080 - a, a); run(a, 1920 - a, 1080 - a, 1920 - a); run(a, a, a, 1920 - a); run(1080 - a, a, 1080 - a, 1920 - a);
    x.strokeStyle = '#3b2416'; x.lineWidth = 5; x.strokeRect(m + w + 4, m + w + 4, 1080 - 2 * (m + w + 4), 1920 - 2 * (m + w + 4)); x.strokeStyle = 'rgba(232,184,74,.8)'; x.lineWidth = 2; x.strokeRect(m - 4, m - 4, 1080 - 2 * (m - 4), 1920 - 2 * (m - 4));
    [[a, a], [1080 - a, a], [a, 1920 - a], [1080 - a, 1920 - a], [540, a], [540, 1920 - a]].forEach(([px, py]) => { x.fillStyle = '#e8b84a'; x.beginPath(); x.arc(px, py, 22, 0, 7); x.fill(); x.lineWidth = 4; x.strokeStyle = '#3b2416'; x.stroke(); x.beginPath(); x.arc(px, py, 11, 0, 7); x.lineWidth = 4; x.stroke(); x.fillStyle = '#d8342a'; x.beginPath(); x.arc(px, py, 7, 0, 7); x.fill(); });
    // rounded inner corners: darken outside a rounded rect
    x.globalCompositeOperation = 'destination-over'; CORD = cv; }
  g.drawImage(CORD, 0, 0); }
// ---------- the scene ----------
SC.jp = (g, o, c) => { o = avAll(o, c.lt); const S = JSETS[o.set] || JSETS.shrine, T = c.T; c.under = () => (o.under || []).forEach(a => { if (a.k != null && a.k !== 1) layerAt(g, c, a.k, () => drawActor(g, a, c, {}, o)); else drawActor(g, a, c, {}, o); });
  S.back(g, o, c, T);
  const acts = o.actors || []; for (const a of acts) { if (a.k != null && a.k !== 1) layerAt(g, c, a.k, () => drawActor(g, a, c, {}, o)); else drawActor(g, a, c, {}, o); }
  if (S.front) S.front(g, o, c, T);
  if (o.front) o.front.forEach(a => drawActor(g, a, c, {}, o));
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (S.haze) S.haze(g, o, T);
  sparkles(g, T, o.sparkN ?? 46, 77, o.spark ?? .9);
  if (o.border !== false) cordFrame(g);
  g.restore(); };
const JSETS = {};
// ===== host set: a lakeside shrine at dusk, Fuji in the distance, a floating torii, sakura, lanterns =====
JSETS.shrine = {
  back(g, o, c, T) { const night = o.tod === 'night';
    layerAt(g, c, 0, () => blit(g, cacheLayer('shr_sky' + (night ? 'n' : ''), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, night ? [[0, '#070a20'], [.6, '#1e2450'], [1, '#4a3a6a']] : [[0, '#1c1c4a'], [.35, '#5a3a78'], [.65, '#d0687a'], [.85, '#f8a070'], [1, '#ffd6a0']]); x.fillRect(-700, -700, 2480, 3400);
      starsF(x, 220, 3, 700, night ? 1 : .7); moonF(x, 820, 120, 54);
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 520 + (i % 2) * 90, .9 + (i % 3) * .2, night ? 'rgba(60,60,110,.55)' : 'rgba(200,110,140,.45)', night ? null : 'rgba(255,200,170,.35)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('shr_far' + (night ? 'n' : ''), x => { fujiF(x, 620, 1240, 1.0, night ? '#3a3a6a' : '#7a6aa0', night ? '#c8cce8' : '#f6eef6'); ridge(x, 1250, 220, night ? '#2a2a52' : '#6a5a8a', 4, { snow: night ? '#9aa0c8' : '#e8dcec' }); }, { blur: 1.5 })));
    layerAt(g, c, .3, () => blit(g, cacheLayer('shr_mid' + (night ? 'n' : ''), x => { ridge(x, 1330, 140, night ? '#1c2040' : '#4a3a6a', 8); forestBand(x, 1330, 140, 110, night ? '#141a30' : '#2e2a4a', 9);
      waterF(x, 1340, 1640, night ? '#2a3466' : '#c8889a', night ? '#141c40' : '#5a4a7a', 12);
      // the floating torii in the lake, with its reflection
      torii(x, 700, 1450, .5); x.save(); x.globalAlpha = .35; x.translate(0, 2900); x.scale(1, -1); torii(x, 700, 1450, .5); x.restore(); }, { blur: .8 })));
    layerAt(g, c, .3, () => { for (let i = 0; i < 26; i++) { const y = 1350 + ((i * 37) % 280), x = ((i * 173 + T * 18) % 1700) - 400; line(g, [x, y, x + 30 + (i % 5) * 12, y], 2, 'rgba(255,230,210,.35)', 'round', true); } glow(g, 700, 1380, 260, 'rgba(255,170,110,1)', .25); });
    layerAt(g, c, .7, () => blit(g, cacheLayer('shr_near' + (night ? 'n' : ''), x => { sakuraTree(x, -260, 1720, 1.15, 0); [[60, 1640, 1.6], [1120, 1600, 1.8], [1000, 1560, 1.1]].forEach(([px, py, s]) => cedar(x, px, py, s, night ? '#141e1a' : '#1e3a2a'));
      x.fillStyle = lg(x, 0, 1620, 0, 2300, [[0, night ? '#3a3a4a' : '#8a7a7a'], [1, night ? '#1e1e28' : '#5a4a4a']]); x.fillRect(-700, 1620, 2480, 1200); }, { blur: .4 })));
    // live: lanterns flicker, petals fall, fireflies
    layerAt(g, c, .7, () => { lanternStone(g, 960, 1700, 1.0, T); glow(g, 960, 1470, 300, 'rgba(255,190,110,1)', .3); });
    layerAt(g, c, 1, () => { blit(g, cacheLayer('shr_ground' + (night ? 'n' : ''), x => { x.fillStyle = lg(x, 0, 1700, 0, 2600, [[0, night ? '#4a4652' : '#a89890'], [1, night ? '#24222a' : '#6a5a56']]); x.fillRect(-700, 1700, 2480, 1100);
      { let y = 1704, row = 0; while (y < 2700) { const d = (y - 1700) / 1000, hgt = 34 + d * 150, half = 230 + d * 420, n = 3 + (row % 2); const wSlab = half * 2 / n;
          for (let k = 0; k < n; k++) { const xa = 540 - half + k * wSlab + 6, xb = xa + wSlab - 12, j = ((row * 7 + k * 3) % 5) * .02; const col = night ? mix('#6a6674', '#8a8698', j * 10) : mix('#b8aa9c', '#d8cabc', j * 10);
            sh(x, `M${xa} ${y + 4} L${xb} ${y + 4} L${xb + 4} ${y + hgt - 6} L${xa - 4} ${y + hgt - 6} Z`, col, 2.6, 'rgba(70,50,40,.55)'); line(x, [xa + 6, y + 9, xb - 6, y + 9], 2, 'rgba(255,255,255,.35)', 'round', true); line(x, [xa - 2, y + hgt - 9, xb + 2, y + hgt - 9], 3, 'rgba(60,40,30,.25)', 'round', true); }
          y += hgt; row++; } }
      pebbles(x, 1700, 2500, 260, 7, night ? ['#5a5664', '#6e6a78', '#46424e'] : ['#8a8478', '#a8a296', '#6e6a62']); grassField(x, 1690, 1760, 900, night ? ['#2a4a3a', '#3a5a46', '#1e3a2e'] : ['#4a7a3a', '#5a8a46', '#3a6a2e'], 3);
      flowersF(x, 1690, 1770, 140, ['#f8c4d4', '#fff4f0', '#f2a8be', '#ffd870'], 4); }, { y0: 900, h: 2000 })); });
  },
  front(g, o, c, T) { layerAt(g, c, 1.3, () => blit(g, cacheLayer('shr_fg', x => { grassField(x, 2280, 2420, 260, ['#2a4a2a', '#3a5a36', '#1e3a22'], 11, -700, 1780, 90); flowersF(x, 2290, 2400, 40, ['#f8c4d4', '#fff4f0'], 12); }, { blur: 7, y0: 2000, h: 600 })));
    const r = rng(41); for (let i = 0; i < 16; i++) { const x = ((r() * 1300 + T * 40 + Math.sin(T + i) * 50) % 1300) - 110, y = ((r() * 2000 + T * (70 + r() * 40)) % 2000) - 40, s = 8 + r() * 6; g.save(); g.globalAlpha = .85; g.translate(x + c.cam[0] - 540, y + c.cam[1] - 960); g.rotate(T * (1 + r()) + i); sakura(g, 0, 0, s, '#f8c0d0'); g.restore(); }
    if (o.tod === 'night') embers(g, T, 20, 9); },
  haze(g, o, T) { g.fillStyle = lg(g, 0, 900, 0, 1500, [[0, 'rgba(255,190,170,0)'], [.5, 'rgba(255,190,170,.10)'], [1, 'rgba(255,190,170,0)']]); g.fillRect(0, 900, 1080, 600); },
};
// ===== Takamagahara: the plain of high heaven =====
function hallF(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s);
  sh(x, 'M-420 0 L420 0 L400 -30 L-400 -30 Z', '#a87a4a', 4); for (let i = -6; i <= 6; i++) { sh(x, `M${i * 60 - 10} -30 L${i * 60 + 10} -30 L${i * 60 + 10} -60 L${i * 60 - 10} -60 Z`, '#8a5a32', 2); }
  sh(x, 'M-340 -60 L340 -60 L340 -300 L-340 -300 Z', lg(x, 0, -300, 0, -60, [[0, '#f6e2b8'], [1, '#d8b888']]), 4); for (let k = -300; k <= 300; k += 60) line(x, [k, -300, k, -60], 8, '#b08458', 'butt', true);
  sh(x, 'M-60 -60 L60 -60 L60 -220 L-60 -220 Z', '#3a2a1e', 3); glow(x, 0, -140, 180, 'rgba(255,220,150,1)', .5);
  sh(x, 'M-430 -280 L0 -520 L430 -280 Q0 -300 -430 -280 Z', lg(x, 0, -520, 0, -280, [[0, '#f0c470'], [1, '#b0803a']]), 5); for (let i = 0; i < 18; i++) line(x, [-400 + i * 47, -288, -30 + i * 4, -500], 2, 'rgba(110,70,30,.35)', 'round', true);
  line(x, [-90, -560, 90, -470], 16, '#8a5a2a', 'round'); line(x, [90, -560, -90, -470], 16, '#8a5a2a', 'round');
  for (let i = -3; i <= 3; i++) { sh(x, `M${i * 56 - 18} -528 L${i * 56 + 18} -528 L${i * 56 + 18} -506 L${i * 56 - 18} -506 Z`, '#e8b84a', 3); ell(x, i * 56, -517, 5, 5, '#c8302a'); }
  [-1, 1].forEach(sd => { line(x, [sd * 360, -60, sd * 360, -360], 14, '#c8302a', 'butt', true); }); x.restore(); }
JSETS.takama = {
  back(g, o, c, T) { layerAt(g, c, 0, () => blit(g, cacheLayer('tk_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1600, [[0, '#f4d89a'], [.5, '#ffe4b0'], [1, '#fff6e0']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 760, 260, 900, 'rgba(255,250,220,1)', .6); ell(x, 760, 260, 120, 120, '#fffaf0'); })));
    layerAt(g, c, 0, () => rays(g, 760 + (c.cam[0] - 540), 260 + (c.cam[1] - 960), 2000, 20, 'rgba(255,240,200,.55)', .35, T));
    layerAt(g, c, .15, () => blit(g, cacheLayer('tk_far', x => { for (let i = 0; i < 9; i++) cloudF(x, -400 + i * 300, 980 + (i % 3) * 60, 1.3, '#fff2d8', 'rgba(255,200,130,.6)'); ridge(x, 1060, 120, 'rgba(255,236,200,.9)', 3); }, { blur: 2 })));
    layerAt(g, c, .4, () => blit(g, cacheLayer('tk_mid', x => { hallF(x, 380, 1260, .9); for (let i = 0; i < 6; i++) cloudF(x, -300 + i * 380, 1290 + (i % 2) * 40, 1.6, '#fff8ea', 'rgba(255,190,110,.6)');
      [[900, 1220], [-80, 1240]].forEach(([px, py]) => { line(x, [px, py, px, py - 300], 10, '#c8302a', 'butt', true); line(x, [px - 40, py - 290, px + 40, py - 290], 12, '#1e1418', 'butt', true); }); }, { blur: .6 })));
    layerAt(g, c, .55, () => { for (let i = 0; i < 4; i++) { const x = ((i * 380 + T * 22) % 1800) - 400, y = 620 + i * 90 + Math.sin(T + i) * 10, f = Math.sin(T * 5 + i) * 18; line(g, [x - 50, y - f, x - 18, y - 6, x, y], 6, '#fbf8f2', 'round', true); line(g, [x, y, x + 18, y - 6, x + 50, y - f], 6, '#fbf8f2', 'round', true); ell(g, x + 6, y - 2, 14, 6, '#fbf8f2'); ell(g, x + 20, y - 4, 4, 3, '#c8302a'); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('tk_floor', x => { x.fillStyle = lg(x, 0, 1880, 0, 2800, [[0, '#ffe8b8'], [1, '#e8b870']]); x.fillRect(-700, 1930, 2480, 900);
      for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) cloudF(x, -560 + i * 300 + (r % 2) * 150, 1880 + r * 150, 2.2 + r * .5, r % 2 ? '#fff0d0' : '#ffe6b8', 'rgba(230,150,70,.75)'); }, { y0: 1300, h: 1600 }))); },
  front(g, o, c, T) { layerAt(g, c, 1.25, () => blit(g, cacheLayer('tk_fg', x => { for (let i = 0; i < 6; i++) cloudF(x, -500 + i * 460, 2300, 3, 'rgba(255,248,236,.9)'); }, { blur: 8, y0: 1900, h: 900 }))); },
  haze(g) { g.fillStyle = 'rgba(255,240,210,.12)'; g.fillRect(0, 0, 1080, 1920); } };
// ===== Izumo: the Hi river valley (tod: day | dusk; red: 0..1 river of blood) =====
JSETS.izumo = {
  back(g, o, c, T) { const dusk = o.tod === 'dusk', red = clamp(o.red || 0), key = dusk ? 'd' : 'n';
    layerAt(g, c, 0, () => blit(g, cacheLayer('iz_sky' + key, x => { x.fillStyle = lg(x, 0, -700, 0, 1500, dusk ? [[0, '#2a2a5a'], [.5, '#c8607a'], [.8, '#f89a6a'], [1, '#ffd49a']] : [[0, '#6aa0d8'], [.6, '#bcd8ec'], [1, '#f4f0e0']]); x.fillRect(-700, -700, 2480, 3400);
      if (dusk) { starsF(x, 80, 5, 400, .6); glow(x, 800, 1050, 700, 'rgba(255,200,140,1)', .5); ell(x, 800, 1050, 90, 90, '#fff2d0'); } else { glow(x, 820, 160, 600, 'rgba(255,255,240,1)', .5); ell(x, 820, 160, 70, 70, '#fffef6'); }
      for (let i = 0; i < 6; i++) cloudF(x, -400 + i * 420, 360 + (i % 3) * 120, 1 + (i % 2) * .4, dusk ? 'rgba(220,130,150,.6)' : '#ffffff', dusk ? 'rgba(255,210,170,.5)' : 'rgba(200,220,240,.8)'); })));
    layerAt(g, c, .1, () => blit(g, cacheLayer('iz_far' + key, x => { ridge(x, 1150, 380, dusk ? '#7a6a9a' : '#9ab4cc', 2, { sharp: true, snow: dusk ? '#f0e0ea' : '#f4f8fc', peaks: true }); ridge(x, 1220, 240, dusk ? '#5a4a7a' : '#7a98b4', 4, { sharp: true }); }, { blur: 2 })));
    layerAt(g, c, .3, () => blit(g, cacheLayer('iz_mid' + key, x => { ridge(x, 1300, 200, dusk ? '#3e3a5a' : '#5a8070', 6); forestBand(x, 1290, 260, 130, dusk ? '#2a2a40' : '#3a6450', 7);
      x.save(); x.globalAlpha = .5; for (let i = 0; i < 4; i++) ell(x, -200 + i * 520, 1280 + (i % 2) * 30, 420, 30, dusk ? 'rgba(255,190,190,.6)' : 'rgba(255,255,255,.8)'); x.restore(); }, { blur: 1 })));
    if (c.under) c.under();
    // the river: narrow far away, wide in front; colour shifts to red
    layerAt(g, c, .65, () => { const rv = 'M520 1320 C570 1360 480 1430 530 1500 C620 1620 360 1720 300 1880 C250 2020 160 2300 120 2700 L1080 2700 C960 2300 880 2020 880 1880 C880 1720 720 1640 690 1520 C650 1420 660 1360 600 1320 Z';
      blit(g, cacheLayer('iz_banks' + key, x => { x.fillStyle = lg(x, 0, 1300, 0, 2600, dusk ? [[0, '#4a4a46'], [1, '#2a2a28']] : [[0, '#6a9a50'], [1, '#3e6a32']]); x.fillRect(-700, 1300, 2480, 1400);
        grassField(x, 1320, 1900, 2600, dusk ? ['#3a4a36', '#4a5a40', '#2a3a2a'] : ['#4a8a3a', '#5a9a46', '#3a7a2e', '#6aaa50'], 5); flowersF(x, 1400, 1900, 380, ['#fff4f0', '#ffd870', '#f8a8c0', '#c8b4f0'], 6);
        pine(x, -60, 1700, 1.3); pine(x, 1120, 1640, 1.2); cedar(x, 900, 1420, .5, dusk ? '#2a3a2e' : '#2a5a3e'); cedar(x, 120, 1440, .45, dusk ? '#2a3a2e' : '#2a5a3e'); [[180, 1880, 1], [930, 1900, .9], [760, 2050, 1.2]].forEach(([px, py, s]) => { ell(x, px, py, 90 * s, 40 * s, '#8a8478', 3, 0, 'rgba(40,30,30,.6)'); ell(x, px - 20 * s, py - 14 * s, 50 * s, 14 * s, 'rgba(255,255,255,.25)'); }); }, { y0: 1200, h: 1600 }));
      const wc = [mix(dusk ? '#6a6aa0' : '#8ab8dc', '#b8141a', red), mix(dusk ? '#2a2a5a' : '#3a78a8', '#5a0608', red)];
      sh(g, rv, lg(g, 0, 1320, 0, 2600, [[0, wc[0]], [1, wc[1]]]), 4, 'rgba(30,30,30,.6)'); g.save(); g.clip(path(rv));
      for (let i = 0; i < 46; i++) { const y = 1330 + ((i * 53 + T * 70) % 1300), w = 18 + (y - 1300) * .09, xx = 580 + Math.sin(i * 1.7) * (y - 1300) * .26; line(g, [xx - w, y, xx + w, y], 2.4 + (y - 1300) * .005, red > .5 ? 'rgba(255,140,120,.35)' : 'rgba(255,255,255,.45)', 'round', true); }
      g.restore(); }); },
  front(g, o, c, T) { layerAt(g, c, 1.3, () => blit(g, cacheLayer('iz_fg' + (o.tod === 'dusk' ? 'd' : 'n'), x => { grassField(x, 2260, 2420, 300, o.tod === 'dusk' ? ['#2a3a2a', '#3a4a36'] : ['#3a6a2a', '#4a7a36', '#2a5a22'], 13, -700, 1780, 110); }, { blur: 7, y0: 2000, h: 600 })));
    if (o.tod !== 'dusk') { const r = rng(52); for (let i = 0; i < 6; i++) { const x = (r() * 1080 + T * 30 + Math.sin(T * 2 + i) * 40) % 1080, y = 700 + r() * 600 + Math.sin(T * 3 + i) * 30, f = Math.sin(T * 14 + i) * .9; g.save(); g.translate(x + c.cam[0] - 540, y + c.cam[1] - 960); ell(g, -8, 0, 9, 6 * Math.abs(f) + 1, '#ffe080', 1.4, 0, 'rgba(90,60,20,.6)'); ell(g, 8, 0, 9, 6 * Math.abs(f) + 1, '#ffe080', 1.4, 0, 'rgba(90,60,20,.6)'); g.restore(); } } },
  haze(g, o) { g.fillStyle = lg(g, 0, 800, 0, 1300, [[0, 'rgba(255,255,255,0)'], [.6, o.tod === 'dusk' ? 'rgba(255,180,170,.12)' : 'rgba(255,255,255,.14)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(0, 800, 1080, 500); } };
// ===== the old couple's house at dusk =====
JSETS.house = {
  back(g, o, c, T) { layerAt(g, c, 0, () => blit(g, cacheLayer('hs_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#2a2a58'], [.45, '#8a4a7a'], [.75, '#f08a6a'], [1, '#ffd09a']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 90, 8, 500, .7); moonF(x, 260, 260, 40);
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 760 + (i % 2) * 80, 1.1, 'rgba(200,110,140,.5)', 'rgba(255,200,170,.4)'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('hs_far', x => { ridge(x, 1250, 300, '#6a4a7a', 3, { sharp: true, snow: '#f0d8e4', peaks: true }); ridge(x, 1320, 180, '#4a3a5a', 5); }, { blur: 1.6 })));
    layerAt(g, c, .45, () => blit(g, cacheLayer('hs_mid', x => { forestBand(x, 1420, 200, 120, '#2a2a3a', 9); x.fillStyle = lg(x, 0, 1420, 0, 1700, [[0, '#5a4a3a'], [1, '#4a3a2e']]); x.fillRect(-700, 1420, 2480, 500);
      for (let r = 0; r < 4; r++) { const y = 1440 + r * 46; sh(x, `M-700 ${y} L1780 ${y} L1780 ${y + 30} L-700 ${y + 30} Z`, r % 2 ? '#6a8a6a' : '#7a9a6a', 0); for (let k = -700; k < 1780; k += 18) line(x, [k, y + 28, k + 3, y + 8], 2, 'rgba(60,90,40,.7)', 'round', true); line(x, [-700, y + 30, 1780, y + 30], 3, 'rgba(255,200,170,.35)', 'round', true); } }, { blur: .6 })));
    layerAt(g, c, .8, () => blit(g, cacheLayer('hs_house', x => { hut(x, 720, 1720, 1.15); cedar(x, 1140, 1760, 1.5, '#1e2e22'); pine(x, 40, 1700, 1.25);
      // persimmon tree with fruit
      x.save(); x.translate(260, 1720); limb(x, [0, 0, -10, -200, 30, -360], 30, '#4a3022', 4); limb(x, [20, -260, 120, -330], 16, '#4a3022', 3); limb(x, [0, -300, -110, -380], 14, '#4a3022', 3); const r = rng(77); for (let i = 0; i < 16; i++) ell(x, -140 + r() * 300, -460 + r() * 180, 34 + r() * 20, 26 + r() * 14, '#3a5a36', 2.4, 0, 'rgba(20,30,20,.6)'); for (let i = 0; i < 12; i++) ell(x, -130 + r() * 280, -440 + r() * 170, 11, 10, '#f08a2a', 2, 0, 'rgba(90,40,10,.8)'); x.restore(); }, { y0: 900, h: 1200 })));
    layerAt(g, c, .8, () => { for (let i = 0; i < 3; i++) { const q = (T * .2 + i / 3) % 1; g.save(); g.globalAlpha = (1 - q) * .35; ell(g, 720 + Math.sin(T + i) * 30 + q * 40, 1080 - q * 320, 30 + q * 60, 20 + q * 30, '#d8d0d8'); g.restore(); } glow(g, 720, 1500, 260, 'rgba(255,170,90,1)', .4 + .05 * Math.sin(T * 7)); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('hs_ground', x => { x.fillStyle = lg(x, 0, 1740, 0, 2700, [[0, '#7a6a52'], [1, '#4a3e30']]); x.fillRect(-700, 1740, 2480, 1000); pebbles(x, 1760, 2600, 200, 21, ['#8a7a64', '#6a5a48', '#9a8a74']);
      grassField(x, 1740, 1800, 700, ['#4a5a36', '#5a6a40', '#3a4a2a'], 22); for (let k = -700; k < 1780; k += 54) { line(x, [k, 1790, k + 4, 1690], 7, '#6a4a2e', 'round'); } line(x, [-700, 1720, 1780, 1720], 5, '#5a3a22', 'round'); line(x, [-700, 1760, 1780, 1760], 5, '#5a3a22', 'round'); }, { y0: 1600, h: 1200 }))); },
  front(g, o, c, T) { layerAt(g, c, 1.3, () => blit(g, cacheLayer('hs_fg', x => grassField(x, 2280, 2420, 260, ['#2a3a22', '#3a4a2a'], 31, -700, 1780, 100), { blur: 7, y0: 2000, h: 600 })));
    const r = rng(9); for (let i = 0; i < 10; i++) { const x = ((r() * 1080 + Math.sin(T * .7 + i) * 60) % 1080), y = 900 + r() * 700 + Math.sin(T * .9 + i * 2) * 40, a = .5 + .5 * Math.sin(T * 3 + i * 1.7); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x + c.cam[0] - 540, y + c.cam[1] - 960, 24, 'rgba(220,255,120,1)', a * .8); g.restore(); } },
  haze(g) { g.fillStyle = lg(g, 0, 900, 0, 1500, [[0, 'rgba(255,170,150,0)'], [.5, 'rgba(255,170,150,.1)'], [1, 'rgba(255,170,150,0)']]); g.fillRect(0, 900, 1080, 600); } };
// ===== the trap at night: fence of eight gates, saké vats, torches; Orochi comes over the hills =====
JSETS.trap = {
  back(g, o, c, T) { const storm = !!o.storm;
    layerAt(g, c, 0, () => blit(g, cacheLayer('tr_sky' + (storm ? 's' : ''), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, storm ? [[0, '#0a0a14'], [.6, '#2a2236'], [1, '#5a2a2a']] : [[0, '#05081a'], [.6, '#141c40'], [1, '#2a2a50']]); x.fillRect(-700, -700, 2480, 3400);
      if (!storm) { starsF(x, 260, 13, 900); moonF(x, 820, 200, 50); } else for (let i = 0; i < 8; i++) cloudF(x, -400 + i * 320, 200 + (i % 3) * 140, 1.6, '#2a2232', 'rgba(140,110,160,.5)'); })));
    if (o.storm) layerAt(g, c, 0, () => { const q = (T * .7) % 1; if (q < .06) { g.save(); g.globalAlpha = (.06 - q) * 8; g.fillStyle = '#e8e8ff'; g.fillRect(-700, -700, 2480, 3400); g.restore(); } });
    layerAt(g, c, .12, () => blit(g, cacheLayer('tr_far' + (storm ? 's' : ''), x => { ridge(x, 1200, 340, storm ? '#1e1a28' : '#1a2040', 3, { sharp: true, peaks: true, snow: storm ? '#4a4258' : '#5a6488' }); ridge(x, 1290, 200, storm ? '#14121c' : '#11162c', 5); }, { blur: 1.4 })));
    if (c.under) c.under();
    layerAt(g, c, .35, () => blit(g, cacheLayer('tr_mid' + (storm ? 's' : ''), x => { forestBand(x, 1370, 260, 140, storm ? '#0e0c12' : '#0c1222', 9); x.save(); x.globalAlpha = .45; for (let i = 0; i < 4; i++) ell(x, -200 + i * 520, 1360, 420, 26, 'rgba(160,170,220,.5)'); x.restore(); }, { blur: .8 }))); },
  front(g, o, c, T) { layerAt(g, c, 1.3, () => blit(g, cacheLayer('tr_fg', x => grassField(x, 2280, 2420, 240, ['#141a14', '#1e241c'], 41, -700, 1780, 110), { blur: 7, y0: 2000, h: 600 }))); if (o.storm) ACT_RAIN(g, c, T); else embers(g, T, 18, 13); },
  haze(g, o) { g.fillStyle = lg(g, 0, 1100, 0, 1600, [[0, 'rgba(120,130,200,0)'], [.5, o.storm ? 'rgba(200,80,60,.12)' : 'rgba(120,130,200,.12)'], [1, 'rgba(120,130,200,0)']]); g.fillRect(0, 1100, 1080, 500); } };
function ACT_RAIN(g, c, T) { const r = rng(4); g.save(); g.globalAlpha = .45; for (let i = 0; i < 120; i++) { const x = ((r() * 1500 + T * 260) % 1500) - 210 + c.cam[0] - 540, y = ((r() * 2200 + T * 1700) % 2200) - 140 + c.cam[1] - 960; line(g, [x, y, x - 16, y + 70], 2.4, 'rgba(210,220,255,.8)', 'round', true); } g.restore(); }
// ===== ground for the trap: packed earth with torch light =====
JSETS.trap.ground = true;
const _trapBack = JSETS.trap.back; JSETS.trap.back = function (g, o, c, T) { _trapBack(g, o, c, T);
  layerAt(g, c, 1, () => { blit(g, cacheLayer('tr_ground', x => { x.fillStyle = lg(x, 0, 1500, 0, 2700, [[0, '#2e2a2a'], [1, '#141212']]); x.fillRect(-700, 1500, 2480, 1300); pebbles(x, 1520, 2600, 220, 61, ['#3a3636', '#4a4444', '#2a2626']); grassField(x, 1500, 1560, 500, ['#1e2a1e', '#2a3424'], 62); }, { y0: 1400, h: 1400 }));
    (o.torches || [[-60, 1560], [1140, 1560]]).forEach(([x, y]) => { line(g, [x, y + 240, x, y], 12, '#3a2418', 'round', true); sh(g, `M${x - 18} ${y} L${x + 18} ${y} L${x + 12} ${y - 20} L${x - 12} ${y - 20} Z`, '#2a1a12', 3); fire(g, x, y - 20, .7, T); glow(g, x, y - 40, 520, 'rgba(255,160,70,1)', .55 + .06 * Math.sin(T * 9)); }); }); };
// ===== the treasure hall: three sacred treasures on an altar, candlelight =====
JSETS.altar = {
  back(g, o, c, T) { layerAt(g, c, .2, () => blit(g, cacheLayer('al_back', x => { x.fillStyle = lg(x, 0, -700, 0, 2600, [[0, '#120a0c'], [.6, '#2a1614'], [1, '#3a2018']]); x.fillRect(-700, -700, 2480, 3400);
      for (let k = -600; k < 1800; k += 180) { sh(x, `M${k} 200 L${k + 40} 200 L${k + 40} 1900 L${k} 1900 Z`, '#3a1e16', 3); line(x, [k + 8, 220, k + 8, 1880], 3, 'rgba(255,190,120,.12)', 'round', true); }
      sh(x, 'M-700 360 L1780 360 L1780 420 L-700 420 Z', '#5a2a1e', 4); for (let k = -680; k < 1780; k += 120) sakura(x, k, 390, 12, 'rgba(232,184,74,.6)');
      x.save(); x.translate(540, 520); for (let i = 0; i < 8; i++) { x.rotate(Math.PI / 4); sh(x, 'M0 -10 L18 -150 L0 -170 L-18 -150 Z', 'rgba(232,184,74,.25)', 0); } ell(x, 0, 0, 60, 60, 'rgba(232,184,74,.3)'); x.restore(); }, { blur: 1.2 })));
    layerAt(g, c, 1, () => { blit(g, cacheLayer('al_floor', x => { x.fillStyle = lg(x, 0, 1600, 0, 2700, [[0, '#4a2a1e'], [1, '#1e100c']]); x.fillRect(-700, 1600, 2480, 1100); for (let k = -700; k < 1780; k += 90) line(x, [k, 1600, k * 1.6 - 400, 2700], 3, 'rgba(0,0,0,.3)', 'round', true); }, { y0: 1500, h: 1300 }));
      [[160, 1500], [920, 1500]].forEach(([x, y]) => { taper(g, x, y + 300, x, y, 26, 20, '#f6efe2'); fire(g, x, y - 6, .35, T); glow(g, x, y - 20, 380, 'rgba(255,190,110,1)', .55); }); }); },
  haze(g) { g.fillStyle = 'rgba(255,170,90,.06)'; g.fillRect(0, 0, 1080, 1920); } };
// ===== a dark storm void for close-ups (tail, sword) =====
JSETS.storm = {
  back(g, o, c, T) { layerAt(g, c, 0, () => blit(g, cacheLayer('st_sky', x => { x.fillStyle = rg(x, 540, 900, 50, 1600, [[0, '#3a2a3a'], [.6, '#16101c'], [1, '#08060a']]); x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 10; i++) cloudF(x, -500 + i * 300, 100 + (i % 3) * 300, 1.8, '#1e1824', 'rgba(130,100,150,.4)'); })));
    const q = (T * .55) % 1; if (q < .05) layerAt(g, c, 0, () => { g.save(); g.globalAlpha = (.05 - q) * 10; g.fillStyle = '#eef'; g.fillRect(-700, -700, 2480, 3400); g.restore(); }); },
  front(g, o, c, T) { if (o.rain !== false) ACT_RAIN(g, c, T); embers(g, T, 14, 33); },
  haze(g) { g.fillStyle = 'rgba(200,60,40,.05)'; g.fillRect(0, 0, 1080, 1920); } };
// big single head + neck for close-ups
Object.assign(JPA, { oroBig: (g, A, c) => { const T = c.T, s = A.s || 1, ph = A.ph || 0; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * s, s);
  const sway = Math.sin(T * 1.2 + ph) * 20, hx = (A.hx ?? 0) + sway, hy = (A.hy ?? -700) + Math.cos(T + ph) * 14;
  const pts = A.from === 'top' ? bez([A.bx ?? -300, A.by ?? -1700], [A.bx ?? -300, (A.by ?? -1700) + 600], [hx - 260, hy - 520], [hx, hy], 26) : bez([A.bx ?? -500, A.by ?? 400], [A.bx ?? -500, (A.by ?? 400) - 500], [hx - 420, hy + 260], [hx, hy], 26);
  serpentNeck(g, pts, A.w0 || 300, A.w1 || 210, false);
  if (A.breath) { for (let i = 0; i < 4; i++) { const q = (T * .7 + i / 4) % 1; g.save(); g.globalAlpha = (1 - q) * .35; ell(g, hx + 300 + q * 160, hy - 10 - q * 40, 30 + q * 70, 20 + q * 40, '#d8d4e0'); g.restore(); } }
  const gulp = A.gulp ? Math.sin(T * 5 + ph) * 10 : 0; oroHead(g, hx, hy + gulp, A.ang ?? .1, 1, A.jaw ?? (.4 + .3 * Math.max(0, Math.sin(T * 2.4 + ph))), A.eye ?? 1, A.glow ?? .6, T, ph, A.hs || 1.6);
  if (A.zz) for (let i = 0; i < 3; i++) { const q = ((T * .45 + i / 3 + ph * .1) % 1); g.save(); g.globalAlpha = (1 - q) * .9; g.scale(A.flip ? -1 : 1, 1); txt(g, 'z', (A.flip ? -1 : 1) * (hx + 120) + q * 50, hy - 140 - q * 160, 54 + q * 40, '#f6f0e0', '#141018'); g.restore(); }
  g.restore(); } });
// a sake vat drawn in two halves around a drinking head
Object.assign(JPA, { vatB: (g, A, c) => vat(g, A.x, A.y, A.s || 1, 'back', c.T), vatF: (g, A, c) => vat(g, A.x, A.y, A.s || 1, 'front', c.T) });
