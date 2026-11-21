// Figure v2: elegant illustrated adults (tall proportions, tapered limbs, hands, pleated robes, patterned hems,
// classical profile faces, strand-lined hair and beards). Same API, looks (WAR) and poses as warriors.js, which it replaces.
function taper(g, x0, y0, x1, y1, w0, w1, fill, ink = true) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  g.beginPath(); g.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); g.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2);
  g.arc(x1, y1, w1 / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, true);
  g.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); g.arc(x0, y0, w0 / 2, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, true); g.closePath();
  g.fillStyle = fill; g.fill(); if (ink) { g.lineWidth = 2.6; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); }
}
function hand(g, x, y, ang, s, skin, open = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  sh(g, 'M-8 -11 C6 -14 22 -10 26 -2 C28 4 22 10 8 11 C-4 12 -10 6 -10 0 Z', skin, 4.2);
  if (open > .5) { [-7, -2, 3, 8].forEach((yy, i) => line(g, [20, yy, 34 + (i === 1 || i === 2 ? 4 : 0), yy * 1.4], 5.5, skin)); [-7, -2, 3, 8].forEach((yy, i) => line(g, [20, yy, 34 + (i === 1 || i === 2 ? 4 : 0), yy * 1.4], 1.4, INK, 'round', true)); }
  else line(g, [12, -6, 20, -2, 14, 4], 2, 'rgba(40,25,30,.6)', 'round', true);
  sh(g, 'M0 -9 C6 -20 16 -22 18 -16 C16 -12 10 -9 6 -6 Z', skin, 3.6);
  g.restore();
}
function pattern(g, x0, x1, y, h, col, kind) { // hem border band
  g.save(); g.fillStyle = col; g.fillRect(x0, y, x1 - x0, h); g.strokeStyle = 'rgba(30,20,30,.75)'; g.lineWidth = 1.6;
  if (kind === 'meander') { for (let x = x0 + 4; x < x1 - 10; x += 16) { g.beginPath(); g.moveTo(x, y + h - 3); g.lineTo(x, y + 3); g.lineTo(x + 10, y + 3); g.lineTo(x + 10, y + h - 7); g.lineTo(x + 5, y + h - 7); g.stroke(); } }
  else if (kind === 'dots') { g.fillStyle = 'rgba(255,240,200,.9)'; for (let x = x0 + 6; x < x1 - 4; x += 12) { g.beginPath(); g.arc(x, y + h / 2, 2.2, 0, 7); g.fill(); } }
  else { for (let x = x0 + 4; x < x1 - 6; x += 12) { g.beginPath(); g.moveTo(x, y + h - 2); g.lineTo(x + 6, y + 2); g.lineTo(x + 12, y + h - 2); g.stroke(); } }
  g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.stroke(); g.restore();
}
const LONG = { father: 1, david: 1, ninKing: 1, jonah: 1, older: 0 };
warrior = function (g, o) {
  const look = typeof o.c === 'string' ? o.c : null;
  const C = Object.assign({ skin: '#b4784e', tunic: '#c9a57a', kilt: '#5a3a22', bulk: 1, head: 1, beardCol: '#24160e', hair: '#24160e', boots: '#4a2c1c', armorCol: '#8a5a32' }, look ? WAR[look] : o.c || {});
  const t = o.t || 0, pose = o.pose || 'stand', k = o.k ?? 1, ex = o.expr || 'neutral', b = C.bulk, ph = o.ph || 0, talk = o.talk || 0;
  const longRobe = C.long ?? (look ? LONG[look] : 0), trim = C.trim || mix(C.kilt, '#e0b648', .55), sd = mix(C.skin, '#2a1830', .28);
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  if (o.shadow !== false) { g.fillStyle = rg(g, 0, 0, 10, 170 * b, [[0, 'rgba(20,10,20,.32)'], [1, 'rgba(20,10,20,0)']]); g.beginPath(); g.ellipse(0, 2, 170 * b, 22, 0, 0, 7); g.fill(); }
  if (pose === 'fall') g.rotate(-eio(k) * 1.45);
  if (o.rot) { g.translate(0, -380); g.rotate(o.rot); g.translate(0, 380); }
  const kneel = ['kneel', 'faint', 'pray', 'sulk'].includes(pose);
  const lean = pose === 'charge' ? .16 : pose === 'thrust' ? .08 : pose === 'faint' ? -.05 : 0;
  const drop = kneel ? 150 : 0, br = Math.sin(t * (pose === 'faint' ? 3.2 : 1.7) + ph) * (pose === 'faint' ? 4 : 2);
  const hipY = -390 + drop, waistY = -455 + drop, shY = -620 + drop + br;
  const run = pose === 'stride' ? 5 : pose === 'charge' ? 10 : 0, p = t * run + ph;
  let feet;
  if (run) feet = [[-34 + Math.sin(p) * 95, -Math.max(0, Math.cos(p)) * 30], [40 - Math.sin(p) * 95, -Math.max(0, -Math.cos(p)) * 30]];
  else if (['raise', 'thrust', 'sling', 'preach'].includes(pose)) feet = [[-90, 0], [96, 0]];
  else if (kneel) feet = [[-150, 0], [80, 0]];
  else feet = [[-30, 0], [34, 0]];
  g.save(); g.rotate(lean);
  const sw = Math.sin(t * 2.2 + ph) * 18 + (run ? 30 : 0);
  // cloak behind
  if (C.cape) { const cw = Math.sin(t * 2.0 + ph) * 22 + (run ? 70 : 0); const path0 = `M${-46 * b} ${shY + 4} C${-120 * b - cw * .5} ${shY + 140} ${-150 * b - cw} ${hipY + 40} ${-120 * b - cw * 1.3} ${(longRobe ? -40 : hipY + 200)} L${-20 * b} ${(longRobe ? -60 : hipY + 120)} Z`;
    sh(g, path0, lg(g, 0, shY, 0, hipY + 200, [[0, C.cape], [1, mix(C.cape, '#10081a', .4)]]), 5); for (let i = 1; i < 4; i++) line(g, [-40 * b - i * 22, shY + 30, -60 * b - i * 26 - cw * .4, hipY + 20, -50 * b - i * 22 - cw, (longRobe ? -80 : hipY + 150)], 1.8, 'rgba(20,10,30,.35)', 'round', true); }
  // hands per pose
  const sx = 50 * b, sy = shY + 22;
  const hands = (() => {
    if (pose === 'raise') return [[-96 * b, hipY + 10], [lerp(sx + 70, sx - 10, eo(k)), lerp(sy + 140, sy - 270, eo(k))]];
    if (pose === 'thrust') return [[-120 * b, sy + 80], [sx + 210 * k, sy + 30]];
    if (pose === 'sling') { const an = t * 15; return [[-120 * b, sy + 120], [20 + Math.cos(an) * 30, sy - 220 + Math.sin(an) * 14]]; }
    if (pose === 'faint') return [[20, hipY + 30], [40, shY - 30]];
    if (pose === 'kneel') return [[60, hipY + 30], [120, sy + 130]];
    if (pose === 'pray') return [[80, sy - 160], [140, sy - 180]];
    if (pose === 'sulk') return [[56, sy + 80], [96, sy + 70]];
    if (pose === 'hug') return [[160, sy + 50], [196, sy + 20]];
    if (pose === 'cross') return [[66, sy + 100], [14, sy + 90]];
    if (pose === 'beg') return [[136, sy + 100], [176, sy + 80]];
    if (pose === 'flail') { const w = Math.sin(t * 9); return [[-160, sy - 130 + w * 40], [180, sy - 150 - w * 40]]; }
    if (pose === 'preach') return [[-96 * b, sy + 210], [sx + 130, sy - 170]];
    if (pose === 'charge') return [[-150 * b, sy + 130], [sx + 150, sy - 60]];
    if (run) return [[-64 * b - Math.sin(p) * 70, sy + 210], [sx + 34 + Math.sin(p) * 70, sy + 210]];
    return [[-70 * b, sy + 220], [sx + 30, sy + 215]];
  })();
  const [bh, fh] = hands;
  const arm = (sx0, h, back) => { const ex2 = (sx0 + h[0]) / 2 + (back ? -18 : 22), ey2 = (sy + h[1]) / 2 + 14; const col = back ? sd : C.skin;
    taper(g, sx0, sy + 4, ex2, ey2, 30 * b, 22 * b, col); taper(g, ex2, ey2, h[0], h[1], 22 * b, 15 * b, col);
    { const ux = sx0 + (ex2 - sx0) * .42, uy = sy + 4 + (ey2 - sy - 4) * .42; taper(g, sx0, sy - 2, ux, uy, 40 * b, 34 * b, back ? mix(C.tunic, '#20102a', .3) : C.tunic); }
    hand(g, h[0], h[1], Math.atan2(h[1] - ey2, h[0] - ex2), 1.05 * b, col, ['flail', 'preach', 'pray', 'beg', 'hug'].includes(pose) ? 1 : 0); };
  // back arm + shield
  arm(-44 * b, bh, true);
  if (C.shield) { const r = 84 * b, cx = bh[0] - 8, cy = bh[1] - 40; ell(g, cx, cy, r, r, C.shield === 'bronze' ? lg(g, cx - r, cy - r, cx + r, cy + r, [[0, '#f2cf78'], [.6, '#c08a36'], [1, '#7a4a18']]) : lg(g, cx - r, 0, cx + r, 0, [[0, '#8a6038'], [1, '#5a3a1e']]), 5);
    [.78, .55].forEach(q => ell(g, cx, cy, r * q, r * q, null, 2.6, 0, 'rgba(40,20,10,.55)')); ell(g, cx, cy, 15 * b, 15 * b, C.shield === 'bronze' ? '#fbe2a0' : '#b08a5a', 3);
    for (let i = 0; i < 8; i++) { const a2 = i / 8 * 6.28; ell(g, cx + Math.cos(a2) * r * .66, cy + Math.sin(a2) * r * .66, 3.5, 3.5, 'rgba(60,30,10,.6)'); } }
  // legs
  const leg = (hx, f, back) => { const kx = kneel ? (back ? -70 : 80) : (hx + f[0]) / 2 + 20, ky = kneel ? (back ? -10 : -170) : (hipY + f[1]) / 2 + 6, col = back ? sd : C.skin;
    taper(g, hx, hipY, kx, ky, 40 * b, 28 * b, col); taper(g, kx, ky, f[0], f[1] - 16, 28 * b, 17 * b, col);
    if (C.armor === 'scale' || C.greaves) { taper(g, kx + 2, ky + 14, f[0] + 1, f[1] - 34, 30 * b, 20 * b, back ? mix(C.armorCol, '#000', .3) : lg(g, kx - 20, 0, kx + 20, 0, [[0, C.armorCol], [1, mix(C.armorCol, '#000', .3)]])); }
    sh(g, `M${f[0] - 18 * b} ${f[1] - 20} Q${f[0] + 10} ${f[1] - 26} ${f[0] + 40 * b} ${f[1] - 6} Q${f[0] + 44 * b} ${f[1] + 2} ${f[0] + 36 * b} ${f[1] + 3} L${f[0] - 20 * b} ${f[1] + 3} Z`, col, 3.5);
    sh(g, `M${f[0] - 22 * b} ${f[1] - 2} L${f[0] + 40 * b} ${f[1] - 2} L${f[0] + 40 * b} ${f[1] + 5} L${f[0] - 22 * b} ${f[1] + 5} Z`, C.boots, 3); line(g, [f[0] - 10, f[1] - 18, f[0] + 6, f[1] - 4], 2.4, C.boots, 'round', true); line(g, [f[0] + 4, f[1] - 22, f[0] + 20, f[1] - 6], 2.4, C.boots, 'round', true); };
  leg(-24 * b, feet[0], true);
  if (!longRobe) leg(24 * b, feet[1], false);
  // garment
  const tw = 60 * b, ww = 44 * b, hem = longRobe ? (kneel ? -20 : -40) : hipY + 150, hw = longRobe ? 92 * b : 66 * b, swH = longRobe ? sw : sw * .4;
  const robe = `M${-tw} ${shY} C${-tw - 6} ${shY + 80} ${-ww - 4} ${waistY - 20} ${-ww} ${waistY} C${-ww - 20} ${waistY + 80} ${-hw - swH * .3} ${hem - 60} ${-hw - swH * .5} ${hem} Q0 ${hem + 14} ${hw - swH * .5} ${hem} C${hw - swH * .3} ${hem - 60} ${ww + 20} ${waistY + 80} ${ww} ${waistY} C${ww + 4} ${waistY - 20} ${tw + 6} ${shY + 80} ${tw} ${shY} Q0 ${shY - 22} ${-tw} ${shY} Z`;
  sh(g, robe, lg(g, -hw, 0, hw, 0, [[0, mix(C.tunic, '#20102a', .32)], [.55, C.tunic], [.8, mix(C.tunic, '#fff8e8', .12)], [1, mix(C.tunic, '#20102a', .2)]]), 4.5);
  g.save(); g.clip(path(robe));
  for (let i = -6; i <= 6; i++) { const x0 = i * 9 * b, x1 = i * (hw / 6) - swH * .45; line(g, [x0, waistY + 6, (x0 + x1) / 2 + Math.sin(i) * 3, (waistY + hem) / 2, x1, hem], 1.5, 'rgba(30,18,40,.32)', 'round', true); }
  for (let i = -3; i <= 3; i++) line(g, [i * 12 * b, shY + 6, i * 9 * b, waistY], 1.3, 'rgba(30,18,40,.25)', 'round', true);
  if (C.armor === 'scale') { for (let y = shY + 14; y < waistY + 8; y += 16) for (let x = -tw - 8 + ((y / 16 | 0) % 2) * 9; x < tw + 8; x += 18) sh(g, `M${x - 9} ${y} Q${x} ${y + 18} ${x + 9} ${y} Z`, mix(C.armorCol, '#fff6d8', ((x + 300 | 0) % 3) * .07), 1.6, 'rgba(50,25,8,.7)'); }
  else if (C.armor === 'leather') { sh(g, `M${-tw} ${shY + 26} L${tw} ${shY + 26} L${ww + 6} ${waistY} L${-ww - 6} ${waistY} Z`, lg(g, -tw, 0, tw, 0, [[0, mix(C.armorCol, '#000', .25)], [1, C.armorCol]])); for (let y = shY + 46; y < waistY; y += 26) line(g, [-tw, y, tw, y], 1.8, 'rgba(20,10,0,.35)', 'round', true); }
  pattern(g, -hw - 30, hw + 30, hem - 16, 13, trim, longRobe ? 'meander' : 'zig');
  g.restore(); sh(g, robe, null, 4.5);
  sh(g, `M${-ww - 6} ${waistY - 8} L${ww + 6} ${waistY - 8} L${ww + 6} ${waistY + 8} L${-ww - 6} ${waistY + 8} Z`, C.kilt, 3); pattern(g, -ww - 6, ww + 6, waistY - 4, 8, trim, 'dots');
  if (longRobe) { // feet peeking from the robe
    [feet[0], feet[1]].forEach((f, i) => sh(g, `M${f[0] - 16} ${f[1] - 10} Q${f[0] + 10} ${f[1] - 16} ${f[0] + 38} ${f[1] - 4} L${f[0] + 38} ${f[1] + 4} L${f[0] - 18} ${f[1] + 4} Z`, i ? C.skin : sd, 3)); }
  // head
  const hs = (C.head || 1) * .86, hy = shY - 62 * hs;
  g.save(); g.translate(14, hy); g.scale(hs, hs); if (o.headRot) g.rotate(o.headRot);
  taper(g, -4, 50, 0, 84, 30, 34, C.skin);
  const hairCol = C.hair || '#24160e';
  if (!C.helmet || C.helmet === 'crown' || C.helmet === 'cap') { sh(g, 'M-58 22 C-74 -40 -40 -84 12 -80 C52 -76 66 -48 60 -28 C30 -40 4 -36 -16 -14 L-30 46 Z', hairCol, 4); for (let i = 0; i < 6; i++) line(g, [-50 + i * 10, -60 + i * 4, -46 + i * 12, 10 + i * 4], 1.4, 'rgba(255,240,220,.18)', 'round', true); }
  // face: classical profile, straight brow-nose line
  const face = 'M-44 -24 C-48 -64 -10 -78 22 -70 C42 -64 52 -48 52 -30 L66 6 Q70 14 60 16 L56 20 Q60 26 54 30 Q56 40 46 46 C30 62 -10 66 -30 46 C-46 30 -46 6 -44 -24 Z';
  sh(g, face, lg(g, -44, 0, 66, 0, [[0, sd], [.45, C.skin], [1, mix(C.skin, '#fff2e0', .12)]]), 4);
  ell(g, -22, 4, 9, 14, sd, 3);
  // eye
  const blink = ((t * .6 + ph) % 4.1) < .1;
  if (ex === 'tired' || blink) line(g, [24, -14, 40, -12], 2.6);
  else { sh(g, `M22 -16 Q34 ${ex === 'shock' ? -28 : -24} 46 -14 Q34 -8 22 -16 Z`, '#f8f2e6', 2.4); ell(g, 39, -15, ex === 'roar' || ex === 'angry' ? 3 : 4, 4.5, '#1a1220'); line(g, [22, -16, 46, -15], 2.2); }
  const BR = { angry: [20, -34, 46, -22], roar: [18, -36, 46, -20], fierce: [18, -32, 46, -24], tired: [18, -26, 46, -30], shock: [18, -38, 46, -36], smile: [18, -30, 46, -30] }[ex] || [18, -29, 46, -28];
  line(g, [BR[0], BR[1], (BR[0] + BR[2]) / 2, Math.min(BR[1], BR[3]) - 4, BR[2], BR[3]], 3.6, hairCol === '#e8e4dc' || hairCol === '#d8d2c8' ? '#7a7068' : INK, 'round', true);
  if (ex === 'tired') { line(g, [24, -6, 40, -4], 1.4, 'rgba(60,30,30,.4)', 'round', true); const k2 = (t * .5) % 1; ell(g, -4, -24 + k2 * 40, 3.5, 6, 'rgba(170,215,240,.85)', 1.5); }
  // mouth + beard
  const op = Math.max(talk, ex === 'roar' ? .9 : ex === 'shock' ? .35 : 0);
  if (C.beard) { const bp = C.beard === 'long' ? 'M-30 16 C-36 70 -8 140 34 176 C42 132 60 80 58 26 C40 40 6 40 -30 16 Z' : 'M-30 18 C-32 52 -6 78 26 82 C46 72 60 52 58 26 C40 40 6 40 -30 18 Z';
    sh(g, bp, lg(g, 0, 0, 0, 170, [[0, C.beardCol], [1, mix(C.beardCol, '#000', .3)]]), 3.6); for (let i = 0; i < 7; i++) line(g, [-20 + i * 10, 26 + i * 2, -16 + i * 11, (C.beard === 'long' ? 120 : 64) - Math.abs(i - 3) * 6], 1.3, mix(C.beardCol, '#fff', .25), 'round', true); }
  if (op > .05) { ell(g, 46, 34 + op * 4, 9 + op * 3, 3 + op * 12, '#3a1418', 2.4); if (ex === 'roar') { line(g, [38, 28, 54, 28], 2.4, '#f4eee2', 'round', true); } }
  else line(g, ex === 'smile' ? [36, 32, 46, 37, 56, 31] : ex === 'tired' ? [38, 37, 46, 34, 54, 37] : [38, 34, 56, 33], 2.6);
  if (C.beard) sh(g, 'M30 22 Q46 14 62 24 Q48 30 38 28 Z', mix(C.beardCol, '#fff', .08), 2.2);
  // helmets
  if (C.helmet === 'feather') { for (let i = -7; i <= 7; i++) { const a = i * .1 - .12, len = 104 + Math.cos(i * .3) * 14, wob = Math.sin(t * 3 + i) * .02; g.save(); g.translate(-4, -56); g.rotate(a + wob); sh(g, `M-7 0 Q-11 ${-len * .6} 0 ${-len} Q11 ${-len * .6} 7 0 Z`, i % 2 ? '#f4ead6' : '#ddcdaa', 2.2); line(g, [0, -4, 0, -len + 8], 1, 'rgba(120,100,70,.6)', 'round', true); g.restore(); }
    sh(g, 'M-60 -36 Q0 -72 62 -38 L62 -18 Q0 -52 -60 -16 Z', lg(g, 0, -72, 0, -16, [[0, '#e8c460'], [1, '#a8782a']]), 3.4); [-40, -20, 0, 20, 40].forEach(x => ell(g, x, -32 + Math.abs(x) * .2, 4, 4, '#8a2a22')); line(g, [-48, -16, -34, 40, 10, 60], 2.4, '#5a3a1a', 'round', true); }
  if (C.helmet === 'bronze') { sh(g, 'M-64 12 C-70 -72 -18 -94 20 -90 C62 -84 72 -40 66 6 L52 2 L50 32 L38 32 L34 -12 C2 -22 -38 -14 -48 32 Z', lg(g, -64, -90, 66, 12, [[0, '#f6d07a'], [.5, '#c48a32'], [1, '#6a3e10']]), 4); const cw = Math.sin(t * 2.2) * 8; sh(g, `M-40 -82 C-58 -154 ${40 + cw} -172 ${112 + cw} -122 C${72 + cw} -114 30 -98 18 -90 Z`, lg(g, -40, -170, 110, -90, [[0, '#c8302a'], [1, '#7a1410']]), 3.4); for (let i = 0; i < 10; i++) line(g, [-34 + i * 14, -100 - i * 4, -18 + i * 15 + cw * .5, -142 - i * 1.6], 1.3, 'rgba(60,10,6,.55)', 'round', true); line(g, [-60, -22, 62, -22], 3, '#8a5a1e', 'round', true); }
  if (C.helmet === 'cap') { sh(g, 'M-60 -10 C-62 -68 -8 -86 26 -80 C60 -72 66 -40 62 -14 Q0 -36 -60 -10 Z', lg(g, 0, -86, 0, -10, [[0, '#9a6e44'], [1, '#5a3a20']]), 3.6); line(g, [-60, -12, 0, -34, 62, -14], 3, '#3a2414', 'round', true); }
  if (C.helmet === 'crown') { sh(g, 'M-48 -50 L-48 -98 L-30 -76 L-10 -112 L8 -78 L28 -108 L44 -74 L54 -96 L56 -48 Q0 -64 -48 -50 Z', lg(g, 0, -112, 0, -48, [[0, '#fff2b0'], [1, '#c0862a']]), 3.4); [-28, 4, 34].forEach(x => ell(g, x, -62, 5, 5, '#3a6ac8', 1.6)); glow(g, 0, -80, 80, 'rgba(255,220,120,1)', .25); }
  g.restore();
  // front arm + weapon
  if (C.weapon === 'spear') { const ang = pose === 'raise' ? lerp(0, 2.25, eo(k)) : pose === 'thrust' ? -1.45 : pose === 'charge' ? -1.2 : run ? -.08 : 0;
    g.save(); g.translate(fh[0], fh[1]); g.rotate(ang); const L0 = 500 * b, L1 = 300 * b; taper(g, 0, L1, 0, -L0, 11 * b, 9 * b, lg(g, -6, 0, 6, 0, [[0, '#8a6038'], [1, '#4a2e18']]));
    sh(g, `M${-15 * b} ${-L0} Q${-18 * b} ${-L0 - 60 * b} 0 ${-L0 - 130 * b} Q${18 * b} ${-L0 - 60 * b} ${15 * b} ${-L0} Z`, lg(g, -15, 0, 15, 0, [[0, '#fbe0a0'], [.5, '#d8a048'], [1, '#7a4a16']]), 3); line(g, [0, -L0 - 6, 0, -L0 - 118 * b], 1.2, 'rgba(90,50,10,.6)', 'round', true); g.restore(); }
  if (C.weapon === 'sword') { const ang = pose === 'raise' ? lerp(.3, -2.8, eo(k)) : pose === 'charge' ? -1.1 : pose === 'thrust' ? -1.5 : pose === 'faint' ? 2.4 : .25;
    g.save(); g.translate(fh[0], fh[1]); g.rotate(ang); sh(g, `M-8 -24 L-7 ${-210 * b} L0 ${-246 * b} L7 ${-210 * b} L8 -24 Z`, lg(g, -8, 0, 8, 0, [[0, '#fdfcf6'], [.5, '#d8dde2'], [1, '#8a929a']]), 3); line(g, [0, -28, 0, -206 * b], 1.2, 'rgba(90,100,110,.6)', 'round', true); sh(g, 'M-30 -28 L30 -28 L30 -16 L-30 -16 Z', '#c9a24a', 3); taper(g, 0, -16, 0, 20, 10, 10, '#5a3a1a'); g.restore(); }
  arm(46 * b, fh, false);
  if (o.hold && typeof HOLD !== 'undefined' && HOLD[o.hold]) HOLD[o.hold](g, fh, o, t, b);
  if (o.hold2 && typeof HOLD !== 'undefined' && HOLD[o.hold2]) HOLD[o.hold2](g, hands[0], o, t, b);
  if (C.weapon === 'sling') { const an = pose === 'sling' ? t * 15 : 0, sx2 = fh[0] + Math.cos(an) * 120, sy2 = fh[1] - 40 + Math.sin(an) * 50;
    line(g, [fh[0], fh[1], (fh[0] + sx2) / 2, (fh[1] + sy2) / 2 + 20, sx2, sy2], 2.4, '#5a3a1a', 'round', true); ell(g, sx2, sy2, 12, 12, lg(g, sx2 - 12, sy2 - 12, sx2 + 12, sy2 + 12, [[0, '#d8d0c4'], [1, '#6a625a']]), 3);
    if (pose === 'sling') { g.save(); g.globalAlpha = .35; g.beginPath(); g.ellipse(fh[0], fh[1] - 40, 120, 50, 0, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = '#fff2c8'; g.stroke(); g.restore(); } }
  g.restore();
  g.restore();
};
