var FIG_HEAD = null;
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
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), (o.s || 1) * (C.tall || 1));
  if (o.shadow !== false) { g.fillStyle = rg(g, 0, 0, 10, 170 * b, [[0, 'rgba(20,10,20,.32)'], [1, 'rgba(20,10,20,0)']]); g.beginPath(); g.ellipse(0, 2, 170 * b, 22, 0, 0, 7); g.fill(); }
  if (pose === 'fall') g.rotate(-eio(k) * 1.45);
  if (o.rot) { g.translate(0, -380); g.rotate(o.rot); g.translate(0, 380); }
  const kneel = ['kneel', 'faint', 'pray', 'sulk', 'bow'].includes(pose);
  const lean = pose === 'charge' ? .16 : pose === 'thrust' ? .08 : pose === 'faint' ? -.05 : 0;
  const sit = pose === 'sit', drop = kneel ? 150 : sit ? 130 : 0, br = Math.sin(t * (pose === 'faint' ? 3.2 : 1.7) + ph) * (pose === 'faint' ? 4 : 2);
  const hipY = -390 + drop, waistY = -455 + drop, shY = -620 + drop + br;
  const walkMix = o.pose2 && !['stride', 'charge'].includes(o.pose2) ? eio(o.mix ?? 0) : 0;
  const run0 = pose === 'stride' ? (o.walkRate || 5) : pose === 'charge' ? 10 : 0, run = walkMix > .999 ? 0 : run0, p = t * run0 + ph;
  const FT = (pz, rn) => { const amp = longRobe ? 34 : 95;
    if (rn) return [[(longRobe ? 10 : -34) + Math.sin(p) * amp, -Math.max(0, Math.cos(p)) * (longRobe ? 12 : 30)], [(longRobe ? 26 : 40) - Math.sin(p) * amp, -Math.max(0, -Math.cos(p)) * (longRobe ? 12 : 30)]];
    if (['raise', 'thrust', 'sling', 'shout'].includes(pz)) return longRobe ? [[-6, 0], [40, 0]] : [[-60, 0], [64, 0]];
    if (['kneel', 'faint', 'pray', 'sulk', 'bow'].includes(pz)) return [[-150, 0], [80, 0]];
    if (pz === 'sit') return [[130, 0], [150, 0]];
    return longRobe ? [[8, 0], [30, 0]] : [[-12, 0], [16, 0]]; };
  let feet = FT(pose, run);
  if (o.pose2) { const m = eio(o.mix ?? 0), f2 = FT(o.pose2, ['stride', 'charge'].includes(o.pose2) ? run : 0); feet = feet.map((f, i) => [lerp(f[0], f2[i][0], m), lerp(f[1], f2[i][1], m)]); }
  const sway = (pose === 'sit' ? .004 : .012) * Math.sin(t * .9 + ph * 1.7), bob = run ? -Math.abs(Math.sin(p)) * (longRobe ? 8 : 14) * (1 - walkMix) : 0;
  g.save(); g.translate(0, bob); g.translate(0, hipY); g.rotate(lean + sway); g.translate(0, -hipY);
  const sw = Math.sin(t * 2.2 + ph) * 18 + (run ? 30 : 0);
  // cloak behind
  if (C.cape) { const cw = Math.sin(t * 2.0 + ph) * 22 + (run ? 70 : 0); const path0 = `M${-46 * b} ${shY + 4} C${-120 * b - cw * .5} ${shY + 140} ${-150 * b - cw} ${hipY + 40} ${-120 * b - cw * 1.3} ${(longRobe ? -40 : hipY + 200)} L${-20 * b} ${(longRobe ? -60 : hipY + 120)} Z`;
    sh(g, path0, lg(g, 0, shY, 0, hipY + 200, [[0, C.cape], [1, mix(C.cape, '#10081a', .4)]]), 5); for (let i = 1; i < 4; i++) line(g, [-40 * b - i * 22, shY + 30, -60 * b - i * 26 - cw * .4, hipY + 20, -50 * b - i * 22 - cw, (longRobe ? -80 : hipY + 150)], 1.8, 'rgba(20,10,30,.35)', 'round', true); }
  // hands per pose
  const sx = 14 * b, sy = shY + 22;
  const bo = x => { x = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }; // ease out with a little overshoot
  const beat = talk * (0.6 + 0.4 * Math.sin(t * 7.3 + ph)), bx = beat * 26, by = -beat * 34;   // speech-driven hand beats
  const H = (pz) => {
    const kk = pz === pose ? k : 1;
    if (pz === 'raise') return [[0, hipY + 46], [lerp(sx + 60, sx + 46, bo(kk)), lerp(sy + 140, sy - 290, bo(kk))]];
    if (pz === 'thrust') return [[-20, sy + 120], [sx + 210 * bo(kk), sy + 30]];
    if (pz === 'sit') return [[96, hipY - 34], [o.hold ? sx + 150 : 128 + bx * .6, o.hold ? sy + 70 : hipY - 30 + by * .5]];
    if (pz === 'sling') { const an = t * 15; return [[-120 * b, sy + 120], [20 + Math.cos(an) * 30, sy - 220 + Math.sin(an) * 14]]; }
    if (pz === 'faint') return [[20, hipY + 30], [40, shY - 30]];
    if (pz === 'kneel') return [[60, hipY + 30], [120, sy + 130]];
    if (pz === 'pray') return [[70, sy + 52], [92, sy + 44]];   // hands clasped at the chest, below the chin
    if (pz === 'worship') return [[96, sy - 20], [128, sy - 34]];
    if (pz === 'bow') return [[70, sy + 120], [110, sy + 110]];
    if (pz === 'sulk') return [[56, sy + 80], [96, sy + 70]];
    if (pz === 'hug') return [[160, sy + 50], [196, sy + 20]];
    if (pz === 'cross') return [[66, sy + 100], [14, sy + 90]];
    if (pz === 'beg') return [[118, sy + 110], [150, sy + 96]];
    if (pz === 'hips') return [[-30, sy + 150], [sx + 46, hipY - 30]];
    if (pz === 'flail') { const w = Math.sin(t * 9); return [[-160, sy - 130 + w * 40], [180, sy - 150 - w * 40]]; }
    // natural speaking gestures: forearm forward from the chest, hand around chest height, palm open
    if (pz === 'preach' || pz === 'gesture') return [[0, hipY + 46], [sx + 104 + bx, sy + 92 + by]];
    if (pz === 'explain') return [[34, sy + 150 + by * .4], [sx + 118 + bx, sy + 70 + by]];
    if (pz === 'shout') return [[0, hipY + 46], [sx + 128 + bx, sy + 10 + by]];
    if (pz === 'charge') return [[-150 * b, sy + 130], [sx + 150, sy - 60]];
    if (pz === 'stride' || pz === 'charge' || run) return [[-Math.sin(p) * 70, hipY + 40 - Math.abs(Math.sin(p)) * 14], [6 + Math.sin(p) * 70, hipY + 40 - Math.abs(Math.sin(p)) * 14]];
    return [[0, hipY + 46], [8 + bx * .5, hipY + 52 + by * .4]];
  };
  let hands = H(pose);
  if (o.pose2) { const m = eio(o.mix ?? 0), h2 = H(o.pose2); hands = hands.map((hh, i) => [lerp(hh[0], h2[i][0], m), lerp(hh[1], h2[i][1], m)]); }
  if (o.arm) hands = [hands[0], H(o.arm)[1]];   // front-arm override: e.g. walk while gesturing
  const [bh, fh] = hands;
  const openHand = ['flail', 'preach', 'pray', 'beg', 'hug', 'gesture', 'explain', 'shout'].includes(pose) || ['preach', 'gesture', 'explain', 'beg'].includes(o.pose2);
  const arm = (sx0, h, back) => { const hang = h[1] > sy + 160, up = h[1] < sy - 60, ex2 = (sx0 + h[0]) / 2 + (hang ? -10 : up ? -46 : back ? -18 : 22), ey2 = (sy + h[1]) / 2 + 14; const col = back ? sd : C.skin;
    const slv = C.longSleeve ? (back ? mix(C.tunic, '#20102a', .3) : C.tunic) : col; taper(g, sx0, sy + 4, ex2, ey2, 30 * b, 22 * b, slv); taper(g, ex2, ey2, h[0], h[1], 22 * b, 15 * b, slv);
    { const ux = sx0 + (ex2 - sx0) * .42, uy = sy + 4 + (ey2 - sy - 4) * .42; taper(g, sx0, sy - 2, ux, uy, 40 * b, 34 * b, back ? mix(C.tunic, '#20102a', .3) : C.tunic); }
    hand(g, h[0], h[1], Math.atan2(h[1] - ey2, h[0] - ex2), 1.05 * b, col, openHand ? 1 : 0); };
  // back arm + shield
  if (Math.abs(bh[0]) > 40 || bh[1] < sy + 160) arm(2 * b, bh, true);
  if (C.shield) { const r = 84 * b, cx = bh[0] - 8, cy = bh[1] - 40; ell(g, cx, cy, r, r, C.shield === 'bronze' ? lg(g, cx - r, cy - r, cx + r, cy + r, [[0, '#f2cf78'], [.6, '#c08a36'], [1, '#7a4a18']]) : lg(g, cx - r, 0, cx + r, 0, [[0, '#8a6038'], [1, '#5a3a1e']]), 5);
    [.78, .55].forEach(q => ell(g, cx, cy, r * q, r * q, null, 2.6, 0, 'rgba(40,20,10,.55)')); ell(g, cx, cy, 15 * b, 15 * b, C.shield === 'bronze' ? '#fbe2a0' : '#b08a5a', 3);
    for (let i = 0; i < 8; i++) { const a2 = i / 8 * 6.28; ell(g, cx + Math.cos(a2) * r * .66, cy + Math.sin(a2) * r * .66, 3.5, 3.5, 'rgba(60,30,10,.6)'); } }
  // legs
  const leg = (hx, f, back) => { const kx = kneel ? (back ? -70 : 80) : sit ? f[0] + 6 : (hx + f[0]) / 2 + 20, ky = kneel ? (back ? -10 : -170) : sit ? hipY + 10 : (hipY + f[1]) / 2 + 6, col = C.pants ? (back ? mix(C.pants, '#10081a', .3) : C.pants) : back ? sd : C.skin;
    taper(g, hx, hipY, kx, ky, 40 * b, 28 * b, col); taper(g, kx, ky, f[0], f[1] - 16, 28 * b, 17 * b, col);
    if (C.armor === 'scale' || C.greaves) { taper(g, kx + 2, ky + 14, f[0] + 1, f[1] - 34, 30 * b, 20 * b, back ? mix(C.armorCol, '#000', .3) : lg(g, kx - 20, 0, kx + 20, 0, [[0, C.armorCol], [1, mix(C.armorCol, '#000', .3)]])); }
    if (C.sneakers) { sh(g, `M${f[0] - 24 * b} ${f[1] - 26} Q${f[0] + 6} ${f[1] - 34} ${f[0] + 46 * b} ${f[1] - 8} L${f[0] + 48 * b} ${f[1] + 4} L${f[0] - 26 * b} ${f[1] + 4} Z`, '#f4f2ec', 3.5); sh(g, `M${f[0] - 26 * b} ${f[1] - 4} L${f[0] + 48 * b} ${f[1] - 4} L${f[0] + 48 * b} ${f[1] + 6} L${f[0] - 26 * b} ${f[1] + 6} Z`, C.sneakers, 3); line(g, [f[0] - 6, f[1] - 22, f[0] + 20, f[1] - 12], 4, C.sneakers, 'round', true); return; }
    sh(g, `M${f[0] - 18 * b} ${f[1] - 20} Q${f[0] + 10} ${f[1] - 26} ${f[0] + 40 * b} ${f[1] - 6} Q${f[0] + 44 * b} ${f[1] + 2} ${f[0] + 36 * b} ${f[1] + 3} L${f[0] - 20 * b} ${f[1] + 3} Z`, col, 3.5);
    sh(g, `M${f[0] - 22 * b} ${f[1] - 2} L${f[0] + 40 * b} ${f[1] - 2} L${f[0] + 40 * b} ${f[1] + 5} L${f[0] - 22 * b} ${f[1] + 5} Z`, C.boots, 3); line(g, [f[0] - 10, f[1] - 18, f[0] + 6, f[1] - 4], 2.4, C.boots, 'round', true); line(g, [f[0] + 4, f[1] - 22, f[0] + 20, f[1] - 6], 2.4, C.boots, 'round', true); };
  if (sit) { // thighs forward, shins down; a long robe drapes over the lap
    const lc = longRobe ? C.tunic : null; leg(-6 * b, feet[0], true); leg(6 * b, feet[1], false);
    if (longRobe) { const kx2 = feet[1][0] + 30, ky2 = hipY - 6, robeC = lg(g, 0, hipY - 60, 0, 0, [[0, mix(C.tunic, '#fff8e8', .08)], [.5, C.tunic], [1, mix(C.tunic, '#20102a', .32)]]);
      const lap = `M-50 ${hipY - 56} C0 ${hipY - 70} ${kx2 - 60} ${hipY - 54} ${kx2 + 6} ${ky2 - 44} Q${kx2 + 52} ${ky2 - 30} ${kx2 + 44} ${ky2 + 30} C${kx2 + 40} ${-150} ${kx2 + 52} ${-80} ${kx2 + 60} -16 Q${kx2} -6 ${kx2 - 84} -14 C${kx2 - 74} -100 ${kx2 - 66} ${hipY + 70} ${kx2 - 70} ${hipY + 46} L-54 ${hipY + 46} Z`;
      sh(g, lap, robeC, 4.5); g.save(); g.clip(path(lap)); for (let i = 0; i < 5; i++) line(g, [kx2 - 70 + i * 26, -20, kx2 - 58 + i * 22, ky2 + 40], 1.6, 'rgba(30,18,40,.3)', 'round', true); for (let i = 0; i < 4; i++) line(g, [-30 + i * 30, hipY - 40, kx2 - 10, ky2 - 30 + i * 12], 1.4, 'rgba(30,18,40,.25)', 'round', true); pattern(g, kx2 - 100, kx2 + 70, -30, 13, trim, 'meander'); g.restore(); sh(g, lap, null, 4.5);
      [feet[0], feet[1]].forEach((f, i) => { sh(g, `M${kx2 - 20 + i * 18} -8 Q${kx2 + 10 + i * 18} -20 ${kx2 + 44 + i * 18} -2 L${kx2 + 44 + i * 18} 4 L${kx2 - 22 + i * 18} 4 Z`, i ? C.skin : sd, 3); line(g, [kx2 - 20 + i * 18, 2, kx2 + 42 + i * 18, 2], 5, C.boots, 'butt', true); }); } }
  else if (longRobe && kneel) { /* the kneeling robe covers the legs; soles are drawn after it */ }
  else if (longRobe) { [feet[0], feet[1]].forEach((f, i) => { const [fx, fy] = f, c = i ? C.skin : sd;
      sh(g, `M${fx - 18} ${fy - 2} C${fx - 26} ${fy - 22} ${fx - 8} ${fy - 32} ${fx + 6} ${fy - 28} C${fx + 20} ${fy - 20} ${fx + 36} ${fy - 14} ${fx + 48} ${fy - 8} Q${fx + 56} ${fy - 2} ${fx + 48} ${fy + 3} L${fx - 16} ${fy + 3} Z`, c, 3);
      ell(g, fx + 2, fy - 16, 3.2, 3.2, mix(c, '#2a1830', .25)); line(g, [fx + 40, fy - 6, fx + 44, fy + 1], 1.6, 'rgba(40,20,20,.5)', 'round', true);
      line(g, [fx - 16, fy + 1, fx + 46, fy + 1], 5, C.boots, 'butt', true); line(g, [fx + 4, fy - 24, fx + 20, fy - 6], 3, C.boots, 'round', true); }); }
  else { leg(-8 * b, feet[0], true); leg(8 * b, feet[1], false); }
  // garment
  const kr = kneel && longRobe && pose !== 'faint';
  const tw = 50 * b, ww = 38 * b, hem = sit ? hipY + 40 : kr ? -8 : longRobe ? (kneel ? -20 : -12) : hipY + 150, hw = sit ? 56 * b : kr ? 140 : longRobe ? 70 * b : 58 * b, swH = kr ? 0 : longRobe ? sw * .6 : sw * .4;
  const robe = kr ? `M${-tw} ${shY} C${-tw - 6} ${shY + 80} ${-ww - 4} ${waistY - 20} ${-ww} ${waistY} C${-ww - 50} ${waistY + 60} -160 -130 -150 -6 L126 -4 C142 -40 132 -104 98 -126 C66 -146 ${ww + 24} ${waistY + 50} ${ww} ${waistY} C${ww + 4} ${waistY - 20} ${tw + 6} ${shY + 80} ${tw} ${shY} Q0 ${shY - 22} ${-tw} ${shY} Z` : `M${-tw} ${shY} C${-tw - 6} ${shY + 80} ${-ww - 4} ${waistY - 20} ${-ww} ${waistY} C${-ww - 20} ${waistY + 80} ${-hw - swH * .3} ${hem - 60} ${-hw - swH * .5} ${hem} Q0 ${hem + 14} ${hw - swH * .5} ${hem} C${hw - swH * .3} ${hem - 60} ${ww + 20} ${waistY + 80} ${ww} ${waistY} C${ww + 4} ${waistY - 20} ${tw + 6} ${shY + 80} ${tw} ${shY} Q0 ${shY - 22} ${-tw} ${shY} Z`;
  sh(g, robe, lg(g, -hw, 0, hw, 0, [[0, mix(C.tunic, '#20102a', .32)], [.55, C.tunic], [.8, mix(C.tunic, '#fff8e8', .12)], [1, mix(C.tunic, '#20102a', .2)]]), 4.5);
  g.save(); g.clip(path(robe));
  if (!C.modern) { // folds fan from the waist gather, tension folds pull diagonally, lit fold edges catch the light
    const foldC = 'rgba(25,15,40,.36)', gx = [-ww * .45, ww * .3];
    for (let f = 0; f < 9; f++) { const x1 = lerp(-hw + 10, hw - 10, f / 8) - swH * .45, sx0 = gx[f % 2] + (f - 4) * 3, cx = (sx0 + x1) / 2 + Math.sin(f * 2.3) * 14;
      line(g, [sx0, waistY + 12, cx, (waistY + hem) / 2 + Math.cos(f * 1.7) * 22, x1, hem - 4], f % 3 ? 1.7 : 2.4, foldC, 'round', true); }
    for (let f = 0; f < 4; f++) { const y0 = waistY + 50 + f * (hem - waistY) * .16; line(g, [-ww * .7 + f * 6, y0, ww * .55 - swH * .2, y0 + 60 + f * 12], 1.5, 'rgba(25,15,40,.24)', 'round', true); }
    for (let f = 0; f < 3; f++) line(g, [-14 + f * 24, waistY + 26, 4 + f * 30 - swH * .3, hem - 34], 6, 'rgba(255,250,235,.09)', 'round', true);
    for (let f = 0; f < 3; f++) line(g, [-tw * .6 + f * 18, shY + 18, -ww * .2 + f * 22, waistY - 8], 1.5, 'rgba(25,15,40,.26)', 'round', true); }
  if (C.stripes) for (let y = shY + 40; y < hem; y += 46) line(g, [-hw - 20, y, hw + 20, y + 4], 16, C.stripes, 'butt', true);
  if (C.hood) { sh(g, `M${-ww * .7} ${waistY + 60} L${ww * .7} ${waistY + 60} L${ww * .6} ${waistY + 130} L${-ww * .6} ${waistY + 130} Z`, mix(C.tunic, '#000', .12), 2.6); line(g, [-10, shY + 10, -14, shY + 120], 3, '#f4f0e8', 'round', true); line(g, [16, shY + 10, 20, shY + 116], 3, '#f4f0e8', 'round', true); }
  if (C.armor === 'scale') { for (let y = shY + 14; y < waistY + 8; y += 16) for (let x = -tw - 8 + ((y / 16 | 0) % 2) * 9; x < tw + 8; x += 18) sh(g, `M${x - 9} ${y} Q${x} ${y + 18} ${x + 9} ${y} Z`, mix(C.armorCol, '#fff6d8', ((x + 300 | 0) % 3) * .07), 1.6, 'rgba(50,25,8,.7)'); }
  else if (C.armor === 'leather') { sh(g, `M${-tw} ${shY + 26} L${tw} ${shY + 26} L${ww + 6} ${waistY} L${-ww - 6} ${waistY} Z`, lg(g, -tw, 0, tw, 0, [[0, mix(C.armorCol, '#000', .25)], [1, C.armorCol]])); for (let y = shY + 46; y < waistY; y += 26) line(g, [-tw, y, tw, y], 1.8, 'rgba(20,10,0,.35)', 'round', true); }
  if (!C.modern) pattern(g, -hw - 30, hw + 30, hem - 16, 13, trim, longRobe ? 'meander' : 'zig'); else line(g, [-hw - 10, hem - 8, hw + 10, hem - 8], 10, mix(C.tunic, '#000', .18), 'butt', true);
  g.restore(); sh(g, robe, null, 4.5);
  if (kr) [[-152, -12], [-130, -8]].forEach(([x, y], i) => sh(g, `M${x + 30} ${y - 8} Q${x + 2} ${y - 18} ${x - 22} ${y} Q${x - 6} ${y + 12} ${x + 30} ${y + 10} Z`, i ? C.skin : sd, 3));
  if (!C.modern && !sit && !kr) for (let x = -hw + 8; x < hw - 6; x += 11) { const xx = x - swH * .5, yy = hem + 7 * (1 - (x / hw) * (x / hw)) - 1; ell(g, xx, yy, 2.6, 2.6, trim, 1.2, 0, 'rgba(30,20,10,.6)'); }
  if (!C.modern) sh(g, `M${-ww - 6} ${waistY - 8} L${ww + 6} ${waistY - 8} L${ww + 6} ${waistY + 8} L${-ww - 6} ${waistY + 8} Z`, C.kilt, 3); if (!C.modern) pattern(g, -ww - 6, ww + 6, waistY - 4, 8, trim, 'dots');

  const armFirst = pose === 'raise' || (o.pose2 === 'raise' && (o.mix ?? 0) > .5);
  if (armFirst) { arm(10 * b, fh, false); if (o.hold && typeof HOLD !== 'undefined' && HOLD[o.hold]) HOLD[o.hold](g, fh, o, t, b); }
  // head
  const hs = (C.head || 1) * .86, hy = shY - 62 * hs;
  const nod = talk * (.05 * Math.sin(t * 8.6 + ph) + .03) + .02 * Math.sin(t * .7 + ph * 2.3), gl = Math.floor(t * .55 + ph * 3.1), glance = (((gl * 9301 + 49297) % 233280) / 233280 - .5) * 2;
  g.save(); g.translate(14, hy - talk * 4); g.scale(hs, hs); g.rotate((o.headRot || 0) - nod * .6 + (pose === 'bow' ? .38 : 0)); FIG_HEAD = g.getTransform();
  if (C.hood) sh(g, 'M-70 40 C-90 70 -60 110 0 112 C50 110 70 80 60 60 L20 70 L-40 60 Z', mix(C.tunic, '#000', .15), 3.6);
  taper(g, -4, 50, 0, 84, 30, 34, C.skin);
  if (C.headphones) { g.save(); g.beginPath(); g.arc(4, 92, 46, .2, Math.PI - .2); g.lineWidth = 9; g.strokeStyle = '#2a2a34'; g.stroke(); g.restore(); ell(g, 48, 104, 14, 20, '#2a2a34', 3); }
  const hairCol = C.hair || '#24160e';
  const HS = C.hairStyle || 'short', hairHi = 'rgba(255,240,220,.18)';
  if (!C.helmet || C.helmet === 'crown' || C.helmet === 'cap') {
    if (HS === 'long') { const sw2 = Math.sin(t * 1.4 + ph) * 4; sh(g, `M-60 10 C-78 -50 -40 -88 12 -84 C52 -80 66 -52 60 -30 C30 -40 4 -36 -16 -14 L-6 80 C-4 130 -14 170 ${-30 + sw2} 200 C-70 210 -100 190 ${-104 + sw2} 150 C-96 100 -84 60 -60 10 Z`, hairCol, 4);
      for (let i = 0; i < 5; i++) line(g, [-56 + i * 9, -40 + i * 6, -70 + i * 10 + sw2, 170 - i * 14], 1.6, 'rgba(255,240,220,.16)', 'round', true); }
    else if (HS === 'pony') { const sw2 = Math.sin(t * 2.2 + ph) * 8; sh(g, 'M-58 22 C-74 -40 -40 -84 12 -80 C52 -76 66 -48 60 -28 C30 -40 4 -36 -16 -14 L-30 46 Z', hairCol, 4);
      sh(g, `M-62 -36 C-110 -40 -120 20 ${-112 + sw2} 90 C-104 140 ${-120 + sw2} 170 ${-96 + sw2} 190 C-88 150 -80 110 -84 60 C-86 20 -76 -6 -56 -14 Z`, hairCol, 4); ell(g, -64, -28, 12, 14, C.band || '#e0b040', 3); }
    else if (HS === 'curly') { [[-50, -40, 30], [-24, -66, 30], [8, -76, 28], [38, -66, 24], [-60, -6, 28], [-50, 26, 24], [-30, -30, 26]].forEach(([x, y, r]) => ell(g, x, y, r, r, hairCol, 4)); [[-50, -40], [-24, -66], [8, -76], [-60, -6]].forEach(([x, y]) => sh(g, `M${x - 10} ${y - 4} q10 -12 20 0`, null, 1.6, hairHi)); }
    else if (HS === 'bald') { sh(g, 'M-56 16 C-62 -6 -56 -26 -44 -34 L-26 -18 L-30 40 Z', hairCol, 3.4); }
    else if (HS === 'wild') { sh(g, 'M-58 30 L-84 0 L-62 -14 L-92 -44 L-56 -50 L-60 -86 L-24 -72 L-8 -108 L14 -80 L44 -104 L48 -70 L76 -70 L60 -28 C30 -40 4 -36 -16 -14 L-30 46 Z', hairCol, 4); }
    else { sh(g, 'M-58 22 C-74 -40 -40 -84 12 -80 C52 -76 66 -48 60 -28 C30 -40 4 -36 -16 -14 L-30 46 Z', hairCol, 4); for (let i = 0; i < 6; i++) line(g, [-50 + i * 10, -60 + i * 4, -46 + i * 12, 10 + i * 4], 1.4, hairHi, 'round', true);
      if (HS === 'tied') { ell(g, -52, -70, 24, 22, hairCol, 4); line(g, [-40, -54, -30, -62], 4, C.band || '#c0402a', 'round', true); } } }
  // face: classical profile, straight brow-nose line
  const NOSE = { straight: 'L66 6 Q70 14 60 16 L56 20', hook: 'C60 -22 80 2 68 16 Q62 20 56 21', button: 'L55 -6 Q68 2 62 14 Q58 18 56 20', broad: 'L62 0 Q78 10 66 19 L56 21' }[C.nose || 'straight'];
  const JAW = C.jaw === 'square' ? 'Q58 44 44 52 L-24 54 C-44 40 -46 6 -44 -24' : C.jaw === 'round' ? 'Q58 44 40 56 C20 68 -20 64 -34 44 C-46 26 -46 6 -44 -24' : 'Q56 40 46 46 C30 62 -10 66 -30 46 C-46 30 -46 6 -44 -24';
  const face = `M-44 -24 C-48 -64 -10 -78 22 -70 C42 -64 52 -48 52 -30 ${NOSE} Q60 26 54 30 ${JAW} Z`;
  sh(g, face, lg(g, -44, 0, 66, 0, [[0, sd], [.45, C.skin], [1, mix(C.skin, '#fff2e0', .12)]]), 4);
  ell(g, -22, 4, 9, 14, sd, 3);
  // fringe over the forehead (drawn after the face so the hairline reads naturally)
  if (!C.helmet || C.helmet === 'crown' || C.helmet === 'cap') {
    if (HS === 'curly') { [[-38, -58, 22], [-14, -70, 22], [12, -74, 20], [34, -66, 16], [44, -54, 11]].forEach(([x, y, r]) => ell(g, x, y, r, r, hairCol, 3.6)); [[-14, -70], [12, -74]].forEach(([x, y]) => sh(g, `M${x - 8} ${y - 2} q8 -10 16 0`, null, 1.6, hairHi)); }
    else if (HS === 'short' || HS === 'tied' || HS === 'pony') sh(g, 'M-50 -10 C-60 -64 -26 -88 14 -86 C46 -84 62 -64 56 -44 C40 -52 26 -48 16 -40 C2 -54 -18 -52 -30 -36 C-38 -26 -44 -16 -50 -10 Z', hairCol, 3.4);
    else if (HS === 'long') { // crown + side-swept bangs over the forehead + a lock over the ear
      sh(g, 'M-56 0 C-66 -62 -24 -92 18 -88 C50 -86 66 -64 60 -40 C48 -50 34 -50 22 -40 C10 -30 -4 -26 -16 -30 C-26 -20 -34 -6 -40 10 Z', hairCol, 3.4);
      sh(g, 'M-26 -40 C-18 0 -24 60 -40 110 C-50 120 -62 116 -64 104 C-50 60 -44 10 -48 -30 Z', hairCol, 3); line(g, [-6, -76, 30, -52, 44, -44], 2, 'rgba(255,240,220,.22)', 'round', true); }
    else if (HS === 'wild') sh(g, 'M-40 -50 L-30 -88 L-6 -66 L10 -96 L26 -64 L52 -78 L48 -50 C36 -58 26 -52 18 -44 C6 -56 -14 -56 -26 -42 Z', hairCol, 3.4);
  }
  if (C.earring) { g.beginPath(); g.arc(-22, 24, 7, 0, Math.PI * 2); g.lineWidth = 3.4; g.strokeStyle = '#f0c850'; g.stroke(); }
  if (C.headband && !C.helmet) { sh(g, 'M-56 -30 Q0 -58 52 -40 L52 -28 Q0 -46 -56 -16 Z', C.headband, 3); }
  // eye
  const blink = ((t * .6 + ph) % 4.1) < .1;
  if (ex === 'tired' || blink) line(g, [24, -14, 40, -12], 2.6);
  else if (C.eyes === 'big') { const sk = ex === 'shock' ? 4 : 0; ell(g, 36, -15, 13, 15 + sk, '#fbf6ec', 2.6); ell(g, 40, -14, 7, 8, '#3a2214'); ell(g, 40, -14, 3.6, 4, '#0e0806'); ell(g, 43, -18, 2.6, 2.6, '#fff'); line(g, [22, -24 - sk, 36, -31 - sk, 50, -22 - sk], 2.6); }
  else { sh(g, `M22 -16 Q34 ${ex === 'shock' ? -28 : -24} 46 -14 Q34 -8 22 -16 Z`, '#f8f2e6', 2.4); ell(g, 39 + glance * 2.4 + (o.look ? o.look[0] * 2 : 0), -15 + (o.look ? o.look[1] * 2 : 0), ex === 'roar' || ex === 'angry' ? 3 : 4, 4.5, '#1a1220'); line(g, [22, -16, 46, -15], 2.2); }
  if (C.female && !(ex === 'tired' || blink)) { sh(g, `M22 -17 Q34 ${ex === 'shock' ? -29 : -25} 47 -15`, null, 3.2, '#1a1214'); line(g, [46, -16, 52, -20], 2.2, '#1a1214', 'round', true); line(g, [44, -19, 49, -24], 2.2, '#1a1214', 'round', true); }
  const browLift = -talk * 7 * (Math.sin(t * 5.1 + ph) > .3 ? 1 : .3);
  const BR0 = { angry: [20, -34, 46, -22], roar: [18, -36, 46, -20], fierce: [18, -32, 46, -24], tired: [18, -26, 46, -30], shock: [18, -38, 46, -36], smile: [18, -30, 46, -30] }[ex] || [18, -29, 46, -28];
  const BR = [BR0[0], BR0[1] + browLift, BR0[2], BR0[3] + browLift];
  line(g, [BR[0], BR[1] - (C.eyes === 'big' ? 8 : 0), (BR[0] + BR[2]) / 2, Math.min(BR[1], BR[3]) - 4 - (C.eyes === 'big' ? 8 : 0), BR[2], BR[3] - (C.eyes === 'big' ? 8 : 0)], 3.6 * (C.brow || (C.female ? .7 : 1)), hairCol === '#e8e4dc' || hairCol === '#d8d2c8' ? '#7a7068' : INK, 'round', true);
  if (C.glasses) { ell(g, 36, -14, 20, 18, 'rgba(220,240,255,.18)', 3.2, 0, C.glasses); line(g, [16, -16, -16, -6], 3.2, C.glasses, 'round', true); line(g, [56, -16, 64, -14], 3, C.glasses, 'round', true); }
  if (ex === 'tired') { line(g, [24, -6, 40, -4], 1.4, 'rgba(60,30,30,.4)', 'round', true); const k2 = (t * .5) % 1; ell(g, -4, -24 + k2 * 40, 3.5, 6, 'rgba(170,215,240,.85)', 1.5); }
  // mouth + beard
  const op = Math.max(talk, ex === 'roar' ? .9 : ex === 'shock' ? .16 : 0);
  if (C.beard === 'stubble') { const r = rng(5); for (let i = 0; i < 46; i++) { const x = -26 + r() * 82, y = 18 + r() * 40; if (x > 30 && y < 30) continue; ell(g, x, y, 1.6, 1.6, hexA(mix(C.beardCol, '#000', .1), .55)); } }
  else if (C.beard === 'goatee') { sh(g, 'M28 40 C26 64 36 78 46 80 C56 70 58 54 56 40 C48 46 38 46 28 40 Z', C.beardCol, 3); sh(g, 'M30 22 Q46 14 62 24 Q48 30 38 28 Z', C.beardCol, 2.2); }
  else if (C.beard) { const bp = C.beard === 'long' ? 'M-30 16 C-36 70 -8 140 34 176 C42 132 60 80 58 26 C40 40 6 40 -30 16 Z' : C.beard === 'forked' ? 'M-30 16 C-36 60 -10 110 8 150 L22 112 L40 154 C52 110 60 70 58 26 C40 40 6 40 -30 16 Z' : C.beard === 'braided' ? 'M-30 16 C-36 60 -6 100 22 110 C44 100 60 60 58 26 C40 40 6 40 -30 16 Z' : 'M-30 18 C-32 52 -6 78 26 82 C46 72 60 52 58 26 C40 40 6 40 -30 18 Z';
    sh(g, bp, lg(g, 0, 0, 0, 170, [[0, C.beardCol], [1, mix(C.beardCol, '#000', .3)]]), 3.6); for (let i = 0; i < 7; i++) line(g, [-20 + i * 10, 26 + i * 2, -16 + i * 11, (C.beard === 'long' ? 120 : 64) - Math.abs(i - 3) * 6], 1.3, mix(C.beardCol, '#fff', .25), 'round', true);
    if (C.beard === 'braided') { for (let i = 0; i < 4; i++) ell(g, 22, 120 + i * 18, 9, 10, C.beardCol, 2.4); [124, 160].forEach(y => line(g, [14, y, 30, y], 3, '#e0b648', 'round', true)); } }
  if (op > .05) { const vw = 1 + .35 * Math.sin(t * 13.7 + ph); ell(g, 46, 34 + op * 4, (9 + op * 3) * vw, (3 + op * 12) / Math.sqrt(vw), '#3a1418', 2.4); if (ex === 'roar') { line(g, [38, 28, 54, 28], 2.4, '#f4eee2', 'round', true); } }
  else if (C.female) { sh(g, ex === 'smile' ? 'M36 31 Q46 40 57 30 Q46 35 36 31 Z' : 'M38 33 Q47 30 56 33 Q47 38 38 33 Z', C.lips || '#b8505a', 2); }
  else line(g, ex === 'smile' ? [36, 32, 46, 37, 56, 31] : ex === 'tired' ? [38, 37, 46, 34, 54, 37] : [38, 34, 56, 33], 2.6);
  if (C.beard && C.beard !== 'stubble' && C.beard !== 'goatee') sh(g, 'M30 22 Q46 14 62 24 Q48 30 38 28 Z', mix(C.beardCol, '#fff', .08), 2.2);
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
  if (!armFirst) { arm(10 * b, fh, false); if (o.hold && typeof HOLD !== 'undefined' && HOLD[o.hold]) HOLD[o.hold](g, fh, o, t, b); }
  if (o.hold2 && typeof HOLD !== 'undefined' && HOLD[o.hold2]) HOLD[o.hold2](g, hands[0], o, t, b);
  if (C.weapon === 'sling') { const an = pose === 'sling' ? t * 15 : 0, sx2 = fh[0] + Math.cos(an) * 120, sy2 = fh[1] - 40 + Math.sin(an) * 50;
    line(g, [fh[0], fh[1], (fh[0] + sx2) / 2, (fh[1] + sy2) / 2 + 20, sx2, sy2], 2.4, '#5a3a1a', 'round', true); ell(g, sx2, sy2, 12, 12, lg(g, sx2 - 12, sy2 - 12, sx2 + 12, sy2 + 12, [[0, '#d8d0c4'], [1, '#6a625a']]), 3);
    if (pose === 'sling') { g.save(); g.globalAlpha = .35; g.beginPath(); g.ellipse(fh[0], fh[1] - 40, 120, 50, 0, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = '#fff2c8'; g.stroke(); g.restore(); } }
  g.restore();
  g.restore();
};
