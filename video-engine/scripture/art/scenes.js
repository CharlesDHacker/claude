// Painted sets. Each scene(g, o, c) draws the background and its cast in world space (1080x1920 frame at zoom 1,
// generous margins for camera moves). o = the shot's options, c = {lt (time in shot), T (global time), d (shot length), V(who) voice level}.
const SC = {};
function skyGrad(g, top, mid, low, y0 = -400, y1 = 1000) { g.fillStyle = lg(g, 0, y0, 0, y1, [[0, top], [.6, mid], [1, low]]); g.fillRect(-1200, y0 - 2000, 3480, y1 - y0 + 4000); }
function hills(g, y, amp, col, seed, x0 = -900, x1 = 1980, step = 60) { const r = rng(seed); g.beginPath(); g.moveTo(x0, 4000); let yy = y; for (let x = x0; x <= x1; x += step) { yy = y + Math.sin(x * .004 + seed) * amp + Math.sin(x * .011 + seed * 2) * amp * .35 + (r() - .5) * amp * .15; g.lineTo(x, yy); } g.lineTo(x1, 4000); g.closePath(); g.fillStyle = col; g.fill(); }
function sun(g, x, y, r, col, a = 1) { glow(g, x, y, r * 6, col, .55 * a); ell(g, x, y, r, r, hexA('#fff6dc', a)); }
function birds(g, T, x0, y0, n, seed, col = 'rgba(60,40,50,.7)') { const r = rng(seed); for (let i = 0; i < n; i++) { const x = x0 + r() * 600 + T * (18 + r() * 14), y = y0 + r() * 160, f = Math.sin(T * 7 + i) * 7; line(g, [x - 14, y - f, x - 4, y, x, y + 2], 3, col); line(g, [x, y + 2, x + 4, y, x + 14, y - f], 3, col); } }
function grass(g, x, y, s, col = '#6e6a3a') { for (let i = -2; i <= 2; i++) line(g, [x + i * 5 * s, y, x + i * 12 * s, y - (40 - Math.abs(i) * 8) * s], 4 * s, col); }
function rock(g, x, y, w, h, col = '#a8876a') { sh(g, `M${x - w} ${y} Q${x - w * .9} ${y - h} ${x - w * .1} ${y - h * 1.05} Q${x + w * .8} ${y - h * .9} ${x + w} ${y} Z`, lg(g, 0, y - h, 0, y, [[0, col], [1, mix(col, '#3a2418', .35)]]), 5); }
function olive(g, x, y, s, col = '#6f7a4a', dark = '#4c5534') { g.save(); g.translate(x, y); g.scale(s, s); limb(g, [0, 0, -10, -60, 6, -120], 18, '#5b4330', 5); [[-60, -150, 70, 50], [40, -160, 76, 54], [-10, -200, 80, 56], [-80, -110, 50, 36], [70, -120, 56, 38]].forEach(([a, b, rx, ry]) => ell(g, a, b, rx, ry, dark, 5)); [[-50, -160, 50, 34], [36, -170, 54, 36], [-6, -210, 56, 36]].forEach(([a, b, rx, ry]) => ell(g, a, b, rx, ry, col)); g.restore(); }
function cypress(g, x, y, s, col = '#3f5236') { g.save(); g.translate(x, y); g.scale(s, s); sh(g, 'M0 -320 C40 -240 46 -80 24 0 L-24 0 C-46 -80 -40 -240 0 -320 Z', col, 5); g.restore(); }
function dust(g, T, n, seed, col = 'rgba(255,236,190,', area = [-200, 0, 1480, 1920]) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + ((r() * area[2] + T * (6 + r() * 10)) % area[2]), y = area[1] + ((r() * area[3] - T * (8 + r() * 14)) % area[3] + area[3]) % area[3], s = 2 + r() * 5, a = .15 + .35 * (0.5 + .5 * Math.sin(T * (1 + r()) + i)); ell(g, x, y, s, s, col + a.toFixed(2) + ')'); } }
function rope(g, a, b, sag = 60) { line(g, [a[0], a[1], (a[0] + b[0]) / 2, Math.max(a[1], b[1]) + sag, b[0], b[1]], 7, '#8a6a3a'); line(g, [a[0], a[1], (a[0] + b[0]) / 2, Math.max(a[1], b[1]) + sag, b[0], b[1]], 2, 'rgba(40,20,10,.5)'); }
function tent(g, x, y, s, col, dark) { g.save(); g.translate(x, y); g.scale(s, s); sh(g, 'M-60 0 L0 -60 L60 0 Z', col, 3); sh(g, 'M0 -60 L60 0 L18 0 Z', dark); sh(g, 'M-8 0 L0 -26 L8 0 Z', '#3a2418'); g.restore(); }
function fire(g, x, y, s, T, a = 1) { glow(g, x, y - 20 * s, 160 * s, 'rgba(255,150,50,1)', .55 * a); for (let i = 0; i < 5; i++) { const h = (60 + 26 * Math.sin(T * 9 + i * 2.1)) * s, w = (22 - i * 2) * s, dx = (i - 2) * 9 * s; sh(g, `M${x + dx - w} ${y} Q${x + dx - w * .6} ${y - h * .6} ${x + dx + Math.sin(T * 6 + i) * 6 * s} ${y - h} Q${x + dx + w * .6} ${y - h * .6} ${x + dx + w} ${y} Z`, i % 2 ? 'rgba(255,190,70,.95)' : 'rgba(255,120,40,.9)'); } }
function smoke(g, x, y, T, s = 1, col = 'rgba(70,60,70,') { for (let i = 0; i < 7; i++) { const k = ((T * .25 + i / 7) % 1), r = (30 + k * 90) * s; ell(g, x + Math.sin(k * 6 + i) * 30 * s + k * 60 * s, y - k * 420 * s, r, r * .8, col + (.35 * (1 - k)).toFixed(2) + ')'); } }

// ---------- present day: dusk road through the vineyards ----------
SC.road = (g, o, c) => {
  const T = c.T, late = o.late ? 1 : 0;
  skyGrad(g, mix('#6f5a8e', '#3d3462', late), mix('#e79a62', '#c76a52', late), mix('#f7d6a0', '#e9a57a', late), -300, 920);
  sun(g, 250, 870 + late * 30, 70, mix('#ffd9a0', '#ffb47a', late));
  birds(g, T, -100, 380, 6, 3);
  hills(g, 820, 40, mix('#9a7896', '#6e5478', late), 1); hills(g, 880, 26, mix('#b98a7c', '#8e6470', late), 2);
  // vineyard fields both sides of the road
  g.fillStyle = lg(g, 0, 900, 0, 1920, [[0, mix('#b9a06a', '#8a7058', late)], [1, mix('#9c7f4c', '#6c5038', late)]]); g.fillRect(-900, 900, 2880, 1400);
  for (let r = 0; r < 9; r++) { const y = 930 + Math.pow(r / 8, 1.8) * 760, s = .25 + Math.pow(r / 8, 1.8) * 1.2; for (let x = -700; x < 1800; x += 70 * s + 10) { if (Math.abs(x - 540) < 120 + r * 70) continue; ell(g, x, y, 26 * s, 14 * s, mix('#7c8a4a', '#53603e', late), 0); ell(g, x - 6 * s, y - 4 * s, 16 * s, 9 * s, mix('#9aa65a', '#6a7848', late)); } }
  cypress(g, -120, 960, .7); cypress(g, 1240, 980, .8); olive(g, 980, 1000, .9); olive(g, 60, 990, .8);
  // road
  sh(g, 'M500 905 L580 905 L1060 2400 L20 2400 Z', lg(g, 0, 905, 0, 1920, [[0, mix('#e2c08c', '#b88f6a', late)], [1, mix('#d1a56a', '#a87a52', late)]]));
  line(g, [530, 910, 380, 2000], 5, 'rgba(120,80,40,.25)'); line(g, [550, 910, 700, 2000], 5, 'rgba(120,80,40,.25)');
  rock(g, 120, 1780, 90, 60); rock(g, 990, 1700, 70, 50); grass(g, 230, 1840, 1.4); grass(g, 900, 1860, 1.6); grass(g, 60, 1700, 1.2);
  // the shimmer far down the road (end beat)
  if (o.shimmer) { const a = o.shimmer * (0.6 + .4 * Math.sin(T * 3)); glow(g, 545, 860, 130, 'rgba(255,230,160,1)', a); g.save(); g.globalAlpha = a * .7; angel(g, { x: 545, y: 910, s: .07, t: T }); g.restore(); }
  // cast
  const sp = o.selahPose || 'sit', sx = o.selahX ?? 860, sy = 1650, tx = o.tobyX ?? 280, ty = 1660;
  const walkK = o.walkOff ? eio(clamp((c.lt - o.walkOff) / 3)) : 0;
  const selah = { x: sx + walkK * 30, y: sy - walkK * 180, s: 1.0 - walkK * .45, flip: true, t: T, pose: o.walkOff && c.lt > o.walkOff ? 'stand' : sp, expr: o.selahExpr || 'calm', talk: c.V('selah'), look: o.selahLook || [.4, 0], walk: o.walkOff && c.lt > o.walkOff, ph: 1 };
  if (o.selahFlipBack && c.lt > o.walkOff) selah.flip = false;
  const tob = { x: tx + walkK * 120, y: ty - walkK * 190, s: 1.0 - walkK * .45, t: T, expr: o.tobyExpr || 'neutral', hands: o.tobyHands || 'rope', talk: c.V('toby'), look: o.tobyLook || [.5, 0], hop: o.tobyHop || 0, tear: o.tobyTear, tilt: o.tobyTilt || 0 };
  if (o.ropeOn !== false && !o.walkOff) rope(g, [tx + 175, ty - 205], [sx - (sp === 'sit' ? 326 : 346), sy - (sp === 'sit' ? 500 : 410)], 90);
  if (o.tobyFront) { donkey(g, selah); toby(g, tob); } else { toby(g, tob); donkey(g, selah); }
  dust(g, T, 26, 9);
};

// ---------- Moab: the king's hall ----------
SC.court = (g, o, c) => {
  const T = c.T;
  g.fillStyle = lg(g, 0, 0, 0, 1920, [[0, '#2e1416'], [.5, '#5a2222'], [1, '#3a1a14']]); g.fillRect(-900, -400, 2880, 2800);
  for (let x = -600; x < 1800; x += 420) { sh(g, `M${x} 300 L${x + 110} 300 L${x + 110} 1500 L${x} 1500 Z`, lg(g, x, 0, x + 110, 0, [[0, '#c69a6a'], [.6, '#a87a52'], [1, '#6e4a32']]), 5); sh(g, `M${x - 30} 270 L${x + 140} 270 L${x + 130} 310 L${x - 20} 310 Z`, '#d4a85e', 5); }
  line(g, [-900, 300, 1980, 300], 30, '#7a2e22'); [-700, -500, -300, -100, 100, 300, 500, 700, 900, 1100, 1300, 1500, 1700].forEach(x => sh(g, `M${x} 290 L${x + 40} 260 L${x + 80} 290 Z`, '#e0b648'));
  g.fillStyle = lg(g, 0, 1500, 0, 1920, [[0, '#6a3a26'], [1, '#3a1c12']]); g.fillRect(-900, 1500, 2880, 900);
  for (let x = -900; x < 1980; x += 160) line(g, [x, 1500, x - 200, 2400], 3, 'rgba(0,0,0,.2)');
  // throne dais + chest of gold
  sh(g, 'M560 1500 L1500 1500 L1500 1420 L620 1420 Z', '#8a5a3a', 5); sh(g, 'M620 1420 L1500 1420 L1500 1350 L680 1350 Z', '#a06c44', 5);
  sh(g, 'M900 1350 L900 820 Q1000 760 1100 820 L1100 1350 Z', lg(g, 900, 0, 1100, 0, [[0, '#d4a85e'], [1, '#8a6430']]), 6);
  [[-220, 1700], [1240, 1700]].forEach(([x, y]) => { sh(g, `M${x - 40} ${y} L${x + 40} ${y} L${x + 20} ${y - 260} L${x - 20} ${y - 260} Z`, '#8a6430', 5); sh(g, `M${x - 70} ${y - 260} L${x + 70} ${y - 260} L${x + 50} ${y - 300} L${x - 50} ${y - 300} Z`, '#c69a5a', 5); fire(g, x, y - 300, 1.2, T); });
  const cx = o.chestX ?? 680, cy = 1500; sh(g, `M${cx - 90} ${cy} L${cx + 90} ${cy} L${cx + 90} ${cy - 110} L${cx - 90} ${cy - 110} Z`, '#7a4a26', 6); line(g, [cx - 90, cy - 60, cx + 90, cy - 60], 10, '#e0b648');
  for (let i = 0; i < 18; i++) { const a = (i * 2.39) % 1, b = (i * .618) % 1; ell(g, cx - 80 + a * 160, cy - 112 - b * 40, 16, 7, i % 3 ? '#f2c14e' : '#ffe08a', 3); }
  glow(g, cx, cy - 140, 260, 'rgba(255,200,90,1)', .6 + .1 * Math.sin(T * 3));
  rays(g, cx, cy - 130, 380, 10, 'rgba(255,220,140,.6)', .25, T);
  balak(g, { x: 1000, y: 1350, s: 1.15, t: T, flip: true, offer: o.offer, talk: c.V('balak') });
  balaam(g, { x: o.balaamX ?? 300, y: 1560, s: 1.25, t: T, expr: o.balaamExpr || 'neutral', talk: c.V('balaam') });
  dust(g, T, 30, 4, 'rgba(255,200,140,');
};

// ---------- the road out: morning desert, Balaam riding ----------
function desert(g, c, o) {
  const T = c.T;
  skyGrad(g, '#9fb6c9', '#f1d9b0', '#f6e3c0', -400, 950);
  sun(g, 860, 520, 60, 'rgba(255,240,200,1)', .9);
  hills(g, 860, 60, '#c9a7a0', 5); hills(g, 900, 34, '#d8b48c', 6);
  // mesas
  sh(g, 'M-300 900 L-260 760 L-60 750 L-20 900 Z', '#c99a78', 4); sh(g, 'M1200 900 L1240 790 L1420 780 L1460 900 Z', '#c99a78', 4);
  g.fillStyle = lg(g, 0, 900, 0, 1920, [[0, '#e3c48e'], [1, '#c99c62']]); g.fillRect(-1600, 900, 4400, 1400);
  sh(g, 'M-1600 1420 L2800 1420 L2800 1640 L-1600 1640 Z', lg(g, 0, 1420, 0, 1640, [[0, '#d8b07a'], [1, '#caa06a']]));
  line(g, [-1600, 1420, 2800, 1420], 4, 'rgba(120,80,40,.25)'); line(g, [-1600, 1640, 2800, 1640], 4, 'rgba(120,80,40,.25)');
  const r = rng(11); for (let i = 0; i < 26; i++) { const x = -1500 + r() * 4200, y = 1000 + r() * 380; grass(g, x, y, .5 + r() * .5, '#9a8a4a'); }
  for (let i = 0; i < 10; i++) { const x = -1400 + r() * 4000; rock(g, x, 1780 + r() * 100, 40 + r() * 60, 30 + r() * 40, '#b08a66'); }
  olive(g, -500, 1180, .7); olive(g, 1500, 1150, .6); olive(g, 2200, 1200, .7); cypress(g, 300, 1120, .45);
}
function rider(g, x, y, s, T, o) { // Balaam on his donkey, facing right
  const dk = { x, y, s, t: T, c: ASS, expr: o.donkeyExpr || 'calm', walk: o.walking, walkRate: 5, pose: 'stand', look: o.donkeyLook || [.5, 0], eyeGlow: o.eyeGlow || 0, talk: o.dTalk || 0, ph: 2 };
  donkey(g, dk);
  balaam(g, { x: x - 30 * s, y: y - 232 * s, s: s * .95, t: T, pose: 'ride', expr: o.balaamExpr || 'neutral', talk: o.bTalk || 0, raiseK: o.raiseK, headRot: o.balaamHeadRot || 0 });
}
SC.ride = (g, o, c) => {
  const T = c.T; desert(g, c, o);
  const x = (o.x0 ?? 200) + (o.speed ?? 60) * c.lt;
  servant(g, { x: x - 330, y: 1560, s: 1.05, t: T, ph: 1, pack: true }); servant(g, { x: x - 520, y: 1600, s: 1.1, t: T, ph: 2.4, col: '#b8936a' });
  rider(g, x, 1600, 1.0, T, { walking: (o.speed ?? 60) > 10, balaamExpr: o.balaamExpr, donkeyExpr: o.donkeyExpr, donkeyLook: o.donkeyLook, eyeGlow: o.eyeGlowRamp ? smooth(0, 1, c.lt / 1.2) : 0 });
  if (o.angelHint) { const a = o.angelHint * (0.5 + .5 * Math.sin(T * 2.3)); glow(g, o.angelX ?? 1500, 1200, 240, 'rgba(255,235,180,1)', a * .6); }
  dust(g, T, 22, 7);
};
SC.angel = (g, o, c) => {
  const T = c.T; desert(g, c, o);
  const ax = o.angelX ?? 540;
  angel(g, { x: ax, y: 1560, s: o.angelS ?? 1.15, t: T, alpha: o.angelA ?? 1, rays: o.rays ?? .25, eyesOpen: o.eyesOpen, talk: c.V('angel') });
  if (o.rider) rider(g, o.riderX ?? -300 + 50 * c.lt, 1640, .7, T, { walking: true, balaamExpr: 'neutral', donkeyExpr: o.donkeyExpr || 'wide' });
  dust(g, T, 30, 5);
};

// ---------- the field: she swerves off the road ----------
SC.field = (g, o, c) => {
  const T = c.T; desert(g, c, o);
  // wheat in the foreground
  const r = rng(21); for (let i = 0; i < 140; i++) { const x = -800 + r() * 2700, y = 1500 + r() * 520, h = 90 + r() * 80, sw = Math.sin(T * 1.6 + x * .01) * 8; line(g, [x, y, x + sw, y - h], 4, '#c9a34a'); ell(g, x + sw, y - h, 6, 16, '#e0bc5c', 0, .1); }
  const k = clamp(c.lt / 1.2), x = 300 + eo(k) * 260, y = 1650 + Math.sin(k * Math.PI) * -40;
  g.save(); g.translate(x, y); g.rotate(-.12 * Math.sin(k * Math.PI)); g.translate(-x, -y);
  rider(g, x, y, 1.0, T, { walking: true, balaamExpr: c.lt > o.hitAt ? 'angry' : 'neutral', donkeyExpr: 'wide', raiseK: c.lt > o.hitAt - .5 ? eio((c.lt - o.hitAt + .5) / .4) : 0 });
  g.restore();
  for (let i = 0; i < 60; i++) { const x2 = -400 + r() * 1900, y2 = 1780 + r() * 300, h = 120 + r() * 90, sw = Math.sin(T * 1.6 + x2 * .01) * 8; line(g, [x2, y2, x2 + sw, y2 - h], 5, '#b8913c'); ell(g, x2 + sw, y2 - h, 7, 18, '#d8b04e', 0, .1); }
  dust(g, T, 16, 2);
};

// ---------- the vineyard path between two walls ----------
function wall(g, y, h, x0, x1, col, seed) { const r = rng(seed); sh(g, `M${x0} ${y} L${x1} ${y} L${x1} ${y - h} L${x0} ${y - h} Z`, col, 5); for (let yy = y - h + 40; yy < y; yy += 46) for (let xx = x0 + ((yy / 46) % 2) * 40; xx < x1; xx += 90 + r() * 20) sh(g, `M${xx} ${yy} l70 0 l0 -38 l-70 0 Z`, mix(col, r() > .5 ? '#ffffff' : '#3a2418', .12 + r() * .1), 3, 'rgba(60,40,30,.6)'); }
function vines(g, y, x0, x1, T, seed) { const r = rng(seed); for (let x = x0; x < x1; x += 80) { const yy = y + Math.sin(x * .03) * 12; ell(g, x, yy, 60, 40, '#5e7a3a', 4); ell(g, x - 10, yy - 8, 40, 26, '#7c9a48'); if (r() > .55) { for (let k = 0; k < 6; k++) ell(g, x + 20 + (k % 2) * 12, yy + 30 + k * 9, 9, 9, '#5a2e5e', 2); } } }
SC.vineyard = (g, o, c) => {
  const T = c.T;
  skyGrad(g, '#a9bccb', '#f0d8b0', '#f3dfbc', -400, 900);
  hills(g, 900, 40, '#c9a7a0', 8);
  g.fillStyle = '#d8b07a'; g.fillRect(-900, 900, 2880, 1400);
  wall(g, 1380, 360, -900, 1980, '#bfa07c', 3); vines(g, 1010, -880, 1980, T, 4);
  sh(g, 'M-900 1380 L1980 1380 L1980 1740 L-900 1740 Z', lg(g, 0, 1380, 0, 1740, [[0, '#d9b583'], [1, '#c79d68']]));
  const k = clamp(c.lt / .7), lean = o.squeeze ? eo(k) * .1 : 0, x = o.riderX ?? 520;
  g.save(); g.translate(x, 1660); g.rotate(lean); g.translate(-x, -1660);
  rider(g, x, 1660, 1.0, T, { walking: !o.squeeze, balaamExpr: o.balaamExpr || (o.squeeze && c.lt > o.hitAt ? 'pain' : 'neutral'), donkeyExpr: o.donkeyExpr || 'wide', raiseK: o.strike ? eio((c.lt - .2) / .4) * (1 - eio((c.lt - .9) / .3)) : 0 });
  g.restore();
  // front wall (low, close to camera) — she presses into it
  wall(g, 1950, 260, -900, 1980, '#a88a66', 5); vines(g, 1700, -880, 1980, T, 6);
  if (o.squeeze && c.lt > o.hitAt) { const q = clamp((c.lt - o.hitAt) / .35); g.save(); g.globalAlpha = 1 - q; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; line(g, [470 + Math.cos(a) * (30 + q * 40), 1690 + Math.sin(a) * (30 + q * 40), 470 + Math.cos(a) * (70 + q * 90), 1690 + Math.sin(a) * (70 + q * 90)], 9, '#fff1c0'); } g.restore(); }
  if (o.angelGlow) glow(g, 1500, 1200, 500, 'rgba(255,230,170,1)', o.angelGlow * (0.7 + .3 * Math.sin(T * 2)));
  dust(g, T, 20, 12);
};

// ---------- the narrow pass: no way left or right ----------
SC.narrow = (g, o, c) => {
  const T = c.T, full = o.full ? (o.fullK != null ? eo(clamp((c.lt - o.fullK) / 1.2)) : 1) : 0;
  skyGrad(g, mix('#a8b8c8', '#ffe9b8', full), mix('#ecd2a8', '#fff3d0', full), '#f2dcb8', -400, 1100);
  glow(g, 540, 900, 900, 'rgba(255,240,200,1)', .25 + full * .6);
  // the angel in the gap (seen by the donkey; to Balaam only when "full")
  const aa = o.angelA ?? (o.full ? 1 : .0);
  if (aa > 0) angel(g, { x: 540, y: 1480, s: o.angelS ?? (1.0 + full * .25), t: T, alpha: aa, rays: .2 + full * .45, eyesOpen: full > .5, talk: c.V('angel'), aura: 1 + full });
  // cliffs
  sh(g, 'M-900 -400 L180 -400 L240 300 L170 900 L300 1500 L240 2400 L-900 2400 Z', lg(g, -900, 0, 300, 0, [[0, '#5a3a2c'], [1, '#8a5e44']]), 6);
  sh(g, 'M1980 -400 L900 -400 L840 300 L910 900 L780 1500 L840 2400 L1980 2400 Z', lg(g, 780, 0, 1980, 0, [[0, '#8a5e44'], [1, '#5a3a2c']]), 6);
  [[60, 500, 120], [120, 1100, 90], [-60, 1500, 140], [960, 600, 110], [1000, 1200, 130], [1100, 1600, 100]].forEach(([x, y, w]) => line(g, [x - w, y, x, y + 40, x + w, y + 10], 6, 'rgba(40,20,10,.35)'));
  g.fillStyle = lg(g, 0, 1450, 0, 1920, [[0, '#d2aa78'], [1, '#b88a5a']]); sh(g, 'M300 1450 L780 1450 L1100 2400 L-20 2400 Z', lg(g, 0, 1450, 0, 2000, [[0, '#d8b383'], [1, '#b88a5a']]));
  // the donkey lying down; Balaam standing over her
  const dx = o.dX ?? 430, by = 1780;
  if (o.riding) rider(g, dx, by, 1.0, T, { walking: false, balaamExpr: o.balaamExpr || 'angry', donkeyExpr: o.donkeyExpr || 'fear', donkeyLook: [.8, -.4] });
  else if (o.bal !== 'none') {
    if (o.bal === 'prostrate') balaam(g, { x: o.balX ?? 360, y: 1800, s: 1.0, pose: 'prostrate' });
    donkey(g, { x: dx, y: by, s: o.dS ?? 1.0, t: T, c: ASS, pose: o.dPose || 'lie', expr: o.donkeyExpr || 'sad', talk: c.V('donkey'), mouthGlow: o.mouthGlow ? smooth(0, 1, c.lt / 1.2) * o.mouthGlow : 0, look: o.dLook || [.6, -.2], tear: o.dTear });
    if (o.bal !== 'prostrate') balaam(g, { x: o.balX ?? 200, y: 1840, s: 1.1, t: T, flip: false, pose: o.balPose || 'stand', expr: o.balaamExpr || 'angry', talk: c.V('balaam'), raiseK: o.balPose === 'raise' ? (o.strikeAt != null ? eio((c.lt - o.strikeAt) / .35) : 1) : 0 });
  }
  if (full) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = full * .1; g.fillStyle = '#ffe2a0'; g.fillRect(-900, -400, 2880, 2800); g.restore(); }
  dust(g, T, 30, 13, full ? 'rgba(255,240,190,' : 'rgba(255,236,190,');
};

// ---------- silhouette strike on white ----------
SC.sil = (g, o, c) => {
  const T = c.T;
  g.fillStyle = rg(g, 540, 960, 100, 1300, [[0, '#ffffff'], [.6, '#f5ede0'], [1, '#d9c8ae']]); g.fillRect(-900, -400, 2880, 2800);
  const k = eio((c.lt - .25) / .3);
  silhouette(g, 1, '#1a120e', x => { donkey(x, { x: 640, y: 1500, s: 1.05, t: T, c: ASS, pose: 'lie', expr: 'sad' }); balaam(x, { x: 300, y: 1560, s: 1.25, t: T, pose: 'raise', raiseK: 1 - k * .85, expr: 'angry' }); });
  line(g, [-900, 1560, 1980, 1560], 6, '#1a120e');
  if (c.lt > .5) { const q = clamp((c.lt - .5) / .4); g.save(); g.globalAlpha = 1 - q; [[560, 1300], [600, 1260]].forEach(([x, y]) => { for (let i = 0; i < 7; i++) { const a = -2.6 + i * .35; line(g, [x + Math.cos(a) * 40, y + Math.sin(a) * 40, x + Math.cos(a) * (90 + q * 80), y + Math.sin(a) * (90 + q * 80)], 8, '#1a120e'); } }); g.restore(); }
};

// ---------- the heights of Baal: altars over the camp of Israel ----------
SC.heights = (g, o, c) => {
  const T = c.T, n = o.night ? (o.nightK != null ? smooth(0, 1, (c.lt - o.nightK) / 1.6) : 1) : 0;
  skyGrad(g, mix('#7a5a7a', '#141a3a', n), mix('#e88a5a', '#2c2c5a', n), mix('#f6c890', '#5a4a6a', n), -400, 1000);
  if (n > 0) { const r = rng(31); for (let i = 0; i < 160; i++) { const x = -600 + r() * 2300, y = -300 + r() * 1100, s = 1 + r() * 3, tw = .5 + .5 * Math.sin(T * (1 + r() * 3) + i); ell(g, x, y, s, s, `rgba(255,250,230,${(n * tw * .9).toFixed(2)})`); if (r() > .93) glow(g, x, y, 24, 'rgba(255,240,200,1)', n * .5); } }
  sun(g, 760, 880 + n * 200, 64, 'rgba(255,200,140,1)', 1 - n);
  hills(g, 860, 50, mix('#8a6a86', '#2a2846', n), 9); hills(g, 960, 40, mix('#b07e70', '#3a3450', n), 10);
  // the valley camp: rows of tents
  g.fillStyle = mix('#c79a6e', '#4a4058', n); g.fillRect(-900, 1000, 2880, 400);
  for (let row = 0; row < 7; row++) { const y = 1030 + row * 42, s = .35 + row * .08; for (let x = -800 + (row % 2) * 40; x < 1900; x += 90 * s + 18) tent(g, x, y, s, mix(row % 2 ? '#e9d3ae' : '#dcc29a', '#8a7a98', n), mix('#b39270', '#5a4a6e', n)); }
  if (o.blessing) { const b = o.blessing * smooth(0, 1, c.lt / 1.5); glow(g, 540, 1150, 1100, 'rgba(255,225,150,1)', b * .7); rays(g, 540, 1150, 1600, 22, 'rgba(255,230,160,.6)', b * .6, T); for (let i = 0; i < 40; i++) { const r2 = rng(40 + i)(), x = -400 + r2 * 1900, y = 1160 - ((T * 60 + i * 47) % 600); ell(g, x, y, 4, 4, `rgba(255,236,170,${(b * .8).toFixed(2)})`); } }
  // foreground hilltop + seven altars
  sh(g, 'M-900 1500 Q-300 1340 300 1400 Q900 1360 1980 1480 L1980 2400 L-900 2400 Z', lg(g, 0, 1340, 0, 1920, [[0, mix('#9a6e4c', '#2e2638', n)], [1, mix('#6e4a32', '#1e1828', n)]]), 6);
  [[-150, 1450], [40, 1420], [220, 1405], [880, 1400], [1060, 1420], [1240, 1450], [1420, 1470]].forEach(([x, y], i) => { sh(g, `M${x - 50} ${y} L${x + 50} ${y} L${x + 40} ${y - 70} L${x - 40} ${y - 70} Z`, mix('#b9a084', '#4a4258', n), 4); fire(g, x, y - 70, .55, T + i); smoke(g, x, y - 110, T + i * .7, .5, n ? 'rgba(150,140,170,' : 'rgba(70,60,70,'); });
  balak(g, { x: o.balakX ?? 780, y: 1720, s: 1.0, t: T, flip: true, talk: c.V('balak') });
  balaam(g, { x: o.balaamX ?? 330, y: 1740, s: 1.15, t: T, pose: o.bless ? 'bless' : 'stand', expr: o.balaamExpr || 'neutral', talk: c.V('balaam'), staff: !o.bless });
  if (o.bless && o.mouthLight) { glow(g, o.balaamX ?? 330, 1060, 260, 'rgba(255,230,150,1)', o.mouthLight * (0.7 + .3 * Math.sin(T * 4))); }
  dust(g, T, 24, 17, n > .5 ? 'rgba(255,245,210,' : 'rgba(255,236,190,');
};
