// Modern people rig v2 (front view, cel-shaded flat vector): proper proportions, hair split into a back layer (behind the
// body) and a front layer (hairline, fringe, highlights), slim jointed arms attached at the shoulder, shirts that overlap
// the waistband, blinking and lip-sync. Original characters only.
const PEOPLE = {
  host: { skin: '#c99068', skinD: '#a8704c', hair: '#231610', hairStyle: 'bun', top: '#2f6f6c', topKind: 'hoodie', pants: '#33405e', shoes: '#ece7dc', shoeAcc: '#d0442c', glasses: '#1e1e26', headphones: true, brow: '#231610', kid: false },
  kid:  { skin: '#a8704a', skinD: '#88563a', hair: '#1a110b', hairStyle: 'curly', top: '#f2b23c', topKind: 'tee', stripes: '#e0603a', pants: '#3e4e78', shoes: '#f2efe6', shoeAcc: '#2f86cc', brow: '#1a110b', kid: true },
  kid2: { skin: '#e4b48e', skinD: '#c8946c', hair: '#6e3a1c', hairStyle: 'long', top: '#8452cc', topKind: 'sweater', pants: '#2a3858', shoes: '#f2efe6', shoeAcc: '#e8b030', brow: '#4e2814', kid: true },
};
const shade = (c, k = .22) => mix(c, '#1a1030', k), light = (c, k = .12) => mix(c, '#fff8ec', k);
function rrect(g, x, y, w, h, r) { return `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`; }
// fill a shape, then a cel shadow on its left side clipped to it
function cel(g, d, col, lw = 5, side = -1, amt = .28, hw = 120, cx = 0) { sh(g, d, col, 0); g.save(); g.clip(path(d)); g.fillStyle = shade(col, amt); g.beginPath(); g.ellipse(cx + side * hw * 1.62, 0, hw * .9, 3000, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,236,210,.16)'; g.beginPath(); g.ellipse(cx - side * hw * 1.78, 0, hw * .9, 3000, 0, 0, 7); g.fill(); g.restore(); if (lw) sh(g, d, null, lw); }
const HEAD_FACE = 'M-104 -36 C-108 -128 -58 -146 0 -146 C58 -146 108 -128 104 -36 C102 38 82 94 46 116 C24 128 -24 128 -46 116 C-82 94 -102 38 -104 -36 Z';
function hairBack(g, L, t) { const H = L.hair;
  if (L.hairStyle === 'long') { const sw = Math.sin(t * 1.6) * 4; sh(g, `M-112 -60 C-126 -170 126 -170 112 -60 C120 30 134 150 ${126 + sw} 250 C90 270 60 262 40 240 L-40 240 C-60 262 -90 270 ${-126 + sw} 250 C-134 150 -120 30 -112 -60 Z`, shade(H, .15), 5);
    for (let i = -2; i <= 2; i++) if (i) line(g, [i * 40, 120, i * 46 + sw, 236], 3, shade(H, .35), 'round', true); }
  if (L.hairStyle === 'curly') { const r = rng(3); for (let i = 0; i < 16; i++) { const an = Math.PI * (1.05 + i / 15 * .9), R = 128 + r() * 10; ell(g, Math.cos(an) * R, -30 + Math.sin(an) * R * .95, 34 + r() * 6, 34 + r() * 6, H, 4.5); } }
  if (L.hairStyle === 'bun') { ell(g, 0, -168, 54, 46, H, 5); sh(g, 'M-40 -176 Q0 -206 40 -176', null, 3, light(H, .25)); line(g, [-46, -140, 46, -140], 10, shade(H, .2), 'round', true); } }
function hairFront(g, L, t) { const H = L.hair, HL = light(H, .3);
  if (L.hairStyle === 'bun') { // smooth cap pulled back, soft side part, tufts by the ears
    sh(g, 'M-108 -24 C-116 -126 -54 -156 4 -154 C66 -152 116 -120 108 -24 C96 -70 72 -96 40 -104 C20 -96 -6 -94 -30 -100 C-64 -96 -94 -70 -108 -24 Z', H, 5);
    sh(g, 'M-30 -100 C-16 -128 10 -146 40 -150', null, 3, HL); sh(g, 'M-70 -120 C-50 -138 -20 -148 4 -150', null, 3, HL);
    [-1, 1].forEach(s => sh(g, `M${s * 104} -30 C${s * 110} 0 ${s * 106} 20 ${s * 98} 34 L${s * 92} -10 Z`, H, 3)); }
  if (L.hairStyle === 'curly') { const r = rng(9); // tight curls framing the forehead and crown
    for (let i = 0; i < 11; i++) { const k = i / 10, x = lerp(-104, 104, k), y = -96 - Math.sin(k * Math.PI) * 54 + (r() - .5) * 6, rr = 22 + r() * 6; ell(g, x, y, rr, rr, H, 4); sh(g, `M${x - rr * .5} ${y - rr * .15} q${rr * .5} ${-rr * .6} ${rr} 0`, null, 2.2, HL); }
    for (let i = 0; i < 7; i++) { const k = i / 6, x = lerp(-70, 70, k), y = -150 - Math.sin(k * Math.PI) * 20; ell(g, x, y, 26, 24, H, 4); } }
  if (L.hairStyle === 'long') { // side part with a swept fringe and face-framing pieces
    sh(g, 'M-110 -30 C-118 -136 -40 -164 26 -156 C84 -150 118 -110 110 -30 C104 -70 82 -104 40 -112 C10 -80 -40 -64 -84 -60 C-98 -54 -106 -44 -110 -30 Z', H, 5);
    [-1, 1].forEach(s => sh(g, `M${s * 106} -40 C${s * 116} 20 ${s * 112} 80 ${s * 96} 130 L${s * 84} 120 C${s * 94} 70 ${s * 96} 10 ${s * 90} -40 Z`, H, 3.5));
    sh(g, 'M24 -150 C0 -120 -40 -84 -84 -62', null, 3, HL); sh(g, 'M50 -146 C70 -130 90 -104 100 -70', null, 3, HL); } }
function face(g, L, o, t) {
  const ex = o.expr || 'neutral', talk = o.talk || 0, [lx, ly] = o.look || [0, 0], ph = o.ph || 0;
  [-1, 1].forEach(s => { ell(g, s * 106, 4, 22, 30, L.skin, 4.5); ell(g, s * 108, 6, 9, 15, L.skinD); });
  cel(g, HEAD_FACE, L.skin, 5, -1, .16, 105);
  hairFront(g, L, t);
  const BR = { neutral: [0, 0], smile: [-4, -4], happy: [-6, -6], think: [-14, 8], surprised: [-20, -20], skeptic: [-16, 8], sad: [8, 8], focus: [6, 6] }[ex] || [0, 0];
  [-1, 1].forEach(s => { const y0 = -54 + (s < 0 ? BR[0] : BR[1]), tilt = ex === 'sad' ? -s * 6 : ex === 'focus' ? s * 6 : 0;
    sh(g, `M${s * 20} ${y0 + 6 + tilt} Q${s * 44} ${y0 - 8} ${s * 70} ${y0 + 2 - tilt} L${s * 70} ${y0 + 10 - tilt} Q${s * 44} ${y0 + 1} ${s * 20} ${y0 + 14 + tilt} Z`, L.brow, 2); });
  const blink = ((t * .55 + ph * .37) % 3.7) < .11, closed = ex === 'happy' || blink;
  [-1, 1].forEach(s => { const x = s * 42, y = -14;
    if (closed) { line(g, [x - 19, y + (ex === 'happy' ? 4 : 0), x, y - (ex === 'happy' ? 10 : -2), x + 19, y + (ex === 'happy' ? 4 : 0)], 5.5, '#1a1214', 'round', true); return; }
    const ry = ex === 'surprised' ? 24 : ex === 'focus' ? 15 : 20; ell(g, x, y, 19, ry, '#fdfaf4', 4); const ix = x + lx * 6, iy = y + 2 + ly * 5;
    g.save(); g.beginPath(); g.ellipse(x, y, 19, ry, 0, 0, 7); g.clip(); ell(g, ix, iy, 12, 13, rg(g, ix, iy, 2, 13, [[0, '#7a4a2c'], [.7, '#3a2216'], [1, '#160c08']])); ell(g, ix, iy, 5.5, 6.5, '#0c0604'); ell(g, ix + 5, iy - 5, 4, 4, '#fff'); ell(g, ix - 4, iy + 5, 1.8, 1.8, 'rgba(255,255,255,.7)'); g.restore();
    sh(g, `M${x - 21} ${y - 2} Q${x} ${y - ry - 7} ${x + 21} ${y - 2}`, null, 5, '#1a1214'); });
  if (L.glasses) { [-1, 1].forEach(s => sh(g, rrect(g, s * 42 - 32, -42, 64, 52, 16), 'rgba(220,240,255,.14)', 4.5, L.glasses)); line(g, [-10, -22, 10, -22], 4.5, L.glasses, 'round', true); [-1, 1].forEach(s => line(g, [s * 74, -24, s * 104, -16], 4.5, L.glasses, 'round', true));
    line(g, [-58, -36, -44, -26], 3, 'rgba(255,255,255,.5)', 'round', true); line(g, [26, -36, 40, -26], 3, 'rgba(255,255,255,.5)', 'round', true); }
  sh(g, 'M-2 14 Q10 34 -6 42', null, 4, shade(L.skinD, .2)); ell(g, -62, 40, 17, 9, 'rgba(230,100,100,.16)'); ell(g, 62, 40, 17, 9, 'rgba(230,100,100,.16)');
  const open = Math.max(talk, ex === 'surprised' ? .55 : 0);
  if (open > .06) { const h = 8 + open * 24; sh(g, `M-28 68 Q0 64 28 68 Q24 ${68 + h} 0 ${70 + h} Q-24 ${68 + h} -28 68 Z`, '#5a1c22', 4); sh(g, 'M-22 69 Q0 66 22 69 L20 76 Q0 73 -20 76 Z', '#fff'); ell(g, 0, 68 + h * .75, 11, 4 + open * 3, '#e0707a'); }
  else if (ex === 'smile' || ex === 'happy') sh(g, 'M-32 62 Q0 96 32 62 Q0 78 -32 62 Z', '#5a1c22', 4);
  else if (ex === 'think' || ex === 'skeptic') line(g, [-22, 74, 4, 70, 26, 62], 5, '#3a1a1a', 'round', true);
  else if (ex === 'sad') line(g, [-22, 76, 0, 68, 22, 76], 5, '#3a1a1a', 'round', true);
  else line(g, [-22, 70, 0, 74, 22, 70], 5, '#3a1a1a', 'round', true);
}
function person(g, o) {
  const L = typeof o.c === 'string' ? PEOPLE[o.c] : o.c, t = o.t || 0, ph = o.ph || 0, pose = o.pose || 'idle', kid = L.kid;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  g.fillStyle = rg(g, 0, 0, 10, 170, [[0, 'rgba(20,10,20,.32)'], [1, 'rgba(20,10,20,0)']]); g.beginPath(); g.ellipse(0, 4, 170, 22, 0, 0, 7); g.fill();
  const br = Math.sin(t * 2 + ph) * 3, legH = kid ? 250 : 400, hipY = -legH, torsoH = kid ? 240 : 320, shY = hipY - torsoH + br, sw = kid ? 92 : 118, ww = kid ? 82 : 100;
  const hs = kid ? 1.12 : .98, hy = shY - 40 - 118 * hs + Math.sin(t * 2 + ph) * 2, tilt = Math.sin(t * 1.3 + ph) * .02 + (o.tilt || 0);
  // back hair (behind everything)
  g.save(); g.translate(0, hy); g.scale(hs, hs); g.rotate(tilt); hairBack(g, L, t); g.restore();
  // legs: pants with a knee crease, shoes
  [-1, 1].forEach(s => { const x = s * (kid ? 38 : 46), w = kid ? 36 : 44, leg = `M${x - w} ${hipY - 30} L${x + w} ${hipY - 30} L${x + w - 6} -36 L${x - w + 6} -36 Z`;
    cel(g, leg, L.pants, 5, -1, .26, w, x); line(g, [x - w * .4, hipY + legH * .45, x + w * .3, hipY + legH * .5], 2.6, shade(L.pants, .4), 'round', true);
    const f = `M${x - w - 4 + s * 4} -40 C${x - w - 6 + s * 4} -74 ${x + w + s * 14} -72 ${x + w + 12 + s * 16} -26 L${x + w + 14 + s * 16} 0 L${x - w - 6 + s * 4} 0 Z`; cel(g, f, L.shoes, 5, -1, .14, w + 10, x + s * 6); line(g, [x - w - 4 + s * 4, -10, x + w + 12 + s * 16, -10], 9, L.shoeAcc, 'butt', true); line(g, [x - w * .3, -60, x + w * .5, -56], 3, shade(L.shoes, .3), 'round', true); });
  // arms: [elbow x, elbow y, hand x, hand y] per side
  const k = o.k ?? 1, wav = Math.sin(t * 3 + ph);
  const P = { idle: [[-sw - 18, shY + 150, -sw - 10, shY + 280], [sw + 18, shY + 150, sw + 10, shY + 280]],
    gesture: [[-sw - 18, shY + 150, -sw - 10, shY + 280], [sw + 60, shY + 130, sw + 100 + wav * 14, shY + 20 + wav * 14]],
    explain: [[-sw - 50, shY + 140, -sw - 60 - wav * 10, shY + 50 - wav * 10], [sw + 50, shY + 140, sw + 60 + wav * 10, shY + 50 + wav * 10]],
    cross: [[-sw - 4, shY + 160, sw - 40, shY + 140], [sw + 4, shY + 160, -sw + 40, shY + 160]],
    hold: [[-sw - 14, shY + 170, -46, shY + 140], [sw + 14, shY + 170, 46, shY + 140]],
    raise: [[-sw - 18, shY + 150, -sw - 10, shY + 280], [sw + 30, lerp(shY + 150, shY - 70, k), sw + 30, lerp(shY + 280, shY - 220, k)]],
    write: [[-sw - 4, shY + 170, -30, shY + 220], [sw + 20, shY + 170, 50 + wav * 12, shY + 230]] }[pose] || [[-sw - 18, shY + 150, -sw - 10, shY + 280], [sw + 18, shY + 150, sw + 10, shY + 280]];
  const sleeve = L.topKind === 'tee' ? .4 : 1, aw = kid ? 34 : 40;
  const arm = (s, [ex2, ey2, hx, hy2]) => { const sx = s * (sw - 26), sy = shY + 26, armCol = s < 0 ? shade(L.top, .18) : L.top, skinA = s < 0 ? L.skinD : L.skin;
    taper(g, sx, sy, ex2, ey2, aw, aw * .86, L.topKind === 'tee' ? skinA : armCol); taper(g, ex2, ey2, hx, hy2, aw * .86, aw * .74, L.topKind === 'tee' ? skinA : armCol);
    if (L.topKind === 'tee') taper(g, sx, sy, lerp(sx, ex2, sleeve), lerp(sy, ey2, sleeve), aw * 1.32, aw * 1.2, armCol);
    else { const cx = lerp(ex2, hx, .82), cy = lerp(ey2, hy2, .82); taper(g, cx, cy, lerp(ex2, hx, .95), lerp(ey2, hy2, .95), aw * .8, aw * .8, shade(L.top, .3)); }
    const an = Math.atan2(hy2 - ey2, hx - ex2); g.save(); g.translate(hx, hy2); g.rotate(an - Math.PI / 2);
    sh(g, 'M-20 -4 C-24 22 -14 40 0 40 C14 40 24 22 20 -4 Z', skinA, 4.5); sh(g, `M${s * 16} 2 C${s * 34} 6 ${s * 36} 20 ${s * 24} 26`, skinA, 4); [-7, 2, 11].forEach(fx => line(g, [fx, 24, fx, 34], 2.4, shade(skinA, .35), 'round', true)); g.restore(); };
  // torso (shirt overlaps the waistband)
  const hem = hipY + (L.topKind === 'hoodie' ? 36 : 22), torso = `M${-sw} ${shY + 44} Q${-sw} ${shY} ${-sw + 44} ${shY - 4} L${sw - 44} ${shY - 4} Q${sw} ${shY} ${sw} ${shY + 44} L${ww + 10} ${hem} Q0 ${hem + 8} ${-ww - 10} ${hem} Z`;
  if (L.topKind === 'hoodie') sh(g, `M${-sw + 18} ${shY + 22} C${-sw + 6} ${shY - 64} ${sw - 6} ${shY - 64} ${sw - 18} ${shY + 22} Z`, shade(L.top, .3), 5);
  cel(g, torso, L.top, 0, -1, .22, sw);
  g.save(); g.clip(path(torso));
  if (L.stripes) for (let y = shY + 46; y < hem; y += 50) line(g, [-sw - 20, y, sw + 20, y], 18, L.stripes, 'butt', true);
  if (L.topKind === 'hoodie') { sh(g, `M${-ww + 14} ${hem - 140} L${ww - 14} ${hem - 140} L${ww} ${hem - 26} L${-ww} ${hem - 26} Z`, null, 4, shade(L.top, .35)); line(g, [-22, shY + 12, -26, shY + 140], 5, '#efe8da', 'round', true); line(g, [22, shY + 12, 26, shY + 136], 5, '#efe8da', 'round', true); }
  if (L.topKind === 'sweater') for (let x = -sw; x < sw; x += 26) line(g, [x, hem - 36, x, hem], 3, shade(L.top, .3), 'butt', true);
  line(g, [-sw, hem - 10, sw, hem - 10], 20, shade(L.top, .22), 'butt', true); line(g, [sw * .5, shY + 20, sw * .62, hem - 30], 10, 'rgba(255,255,255,.08)', 'round', true);
  g.restore(); sh(g, torso, null, 5);
  // neck + collar
  sh(g, `M-26 ${shY - 46} L26 ${shY - 46} L28 ${shY + 6} L-28 ${shY + 6} Z`, L.skinD, 4);
  if (L.topKind === 'hoodie') sh(g, `M-66 ${shY - 6} Q0 ${shY + 46} 66 ${shY - 6} Q0 ${shY + 18} -66 ${shY - 6} Z`, shade(L.top, .3), 4); else sh(g, `M-40 ${shY - 4} Q0 ${shY + 30} 40 ${shY - 4}`, shade(L.top, .25), 5);
  if (L.headphones) { g.save(); g.beginPath(); g.arc(0, shY - 18, 60, .15, Math.PI - .15); g.lineWidth = 12; g.strokeStyle = '#24242c'; g.stroke(); g.restore(); [-1, 1].forEach(s => sh(g, rrect(g, s * 62 - 17, shY - 12, 34, 42, 12), '#24242c', 3)); }
  if (pose === 'cross') { arm(1, P[1]); arm(-1, P[0]); } else { arm(-1, P[0]); if (o.item && pose === 'hold') HOLD2(g, o, 0, shY + 130, t); if (pose !== 'raise') arm(1, P[1]); }
  if (o.item && pose !== 'hold' && pose !== 'raise') HOLD2(g, o, P[1][2], P[1][3], t);
  // head
  const nodP = (o.talk || 0) * (.05 * Math.sin(t * 8.2 + ph) + .02), glP = Math.floor(t * .5 + ph * 2.9), gP = ((((glP * 9301 + 49297) % 233280) / 233280) - .5) * 2, oL = o.look || [0, 0];
  g.save(); g.translate(0, hy - (o.talk || 0) * 5); g.scale(hs, hs); g.rotate(tilt + nodP); face(g, L, Object.assign({}, o, { look: [clamp(oL[0] + gP * .35, -1, 1), oL[1]] }), t); g.restore();
  if (pose === 'raise') { arm(1, P[1]); if (o.item) HOLD2(g, o, P[1][2], P[1][3], t); }
  g.restore();
}
function HOLD2(g, o, x, y, t) { const it = o.item; g.save(); g.translate(x, y);
  if (it === 'book') { g.rotate(o.itemRot || 0); cel(g, rrect(g, -86, -116, 172, 232, 10), o.itemCol || '#2a6ac8', 5, -1, .2, 86); sh(g, 'M-86 -116 L-66 -116 L-66 116 L-86 116 Z', shade(o.itemCol || '#2a6ac8', .35), 3); line(g, [-40, -66, 56, -66], 8, 'rgba(255,255,255,.6)', 'round', true); line(g, [-40, -40, 28, -40], 6, 'rgba(255,255,255,.4)', 'round', true); }
  if (it === 'page') { g.translate(0, -150); g.rotate(o.itemRot ?? .05); sh(g, 'M-120 -160 L120 -160 L120 160 L-120 160 Z', '#fbf6ea', 5); ['#ffd8a0', '#c8e6ff', '#ffc8d8', '#d8f0c0'].forEach((c, i) => sh(g, `M${-104 + (i % 2) * 108} ${-144 + (i >> 1) * 150} l100 0 l0 138 l-100 0 Z`, c, 3)); txt(g, 'HA!', 58, 66, 48, '#e8302a', '#2a2a34', 'Nunito', 900, -.2, 6); }
  if (it === 'pencil') { g.rotate(-.5 + Math.sin(t * 9) * .08); sh(g, 'M-9 30 L9 30 L9 -120 L-9 -120 Z', '#f0c040', 3); sh(g, 'M-9 30 L9 30 L0 58 Z', '#e8c8a0', 3); sh(g, 'M-9 -120 L9 -120 L9 -146 L-9 -146 Z', '#e88a9a', 3); }
  g.restore(); }
const _drawActorP = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'p') { if (A.alpha != null && A.alpha <= 0) return; g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha; person(g, Object.assign({}, A, { t: c.T + (A.ph || 0), talk: A.who ? c.V(A.who) : 0 })); g.restore(); return; }
  return _drawActorP(g, a, c, P, o); };
