// Sea, ships, the great fish, Nineveh and friends (episode 3: Jonah).
Object.assign(WAR, {
  jonah:   { skin: '#b4784e', tunic: '#7a6a4a', kilt: '#5a4a32', cape: '#3e6a7e', beard: 'short', beardCol: '#2a1a12', hair: '#2a1a12', helmet: null, bulk: .95, head: 1.02, weapon: null, shield: null, boots: '#5a3420' },
  sailor:  { skin: '#a8714c', tunic: '#d8c49a', kilt: '#8a3a22', cape: null, beard: 'short', beardCol: '#2a1a12', helmet: 'cap', bulk: 1.05, weapon: null, shield: null, boots: '#3a2418' },
  sailor2: { skin: '#c08a5e', tunic: '#5a7a8a', kilt: '#6a5a3a', cape: null, beard: 'long', beardCol: '#5a4a3a', helmet: 'cap', bulk: 1.1, weapon: null, shield: null, boots: '#3a2418' },
  ninevite: { skin: '#a8714c', tunic: '#7a6a50', kilt: '#6a5a44', cape: null, beard: 'long', beardCol: '#1e1612', hair: '#1e1612', helmet: null, bulk: 1, weapon: null, shield: null, boots: '#3a2418' },
  ninKing: { skin: '#a8714c', tunic: '#6e5e46', kilt: '#5e4e38', cape: '#5a4a36', beard: 'long', beardCol: '#141010', hair: '#141010', helmet: 'crown', bulk: 1.15, weapon: null, shield: null, boots: '#3a2418' },
});
// ---------- the sea ----------
function seaLayer(g, c, o, front) {
  const S = o.sea, T = c.T, y0 = S.y ?? 1250, rough = S.rough ?? .3, n = front ? 2 : 9;
  const deep = S.deep || '#0e2a3a', mid = S.mid || '#1f5266', lite = S.lite || '#4a8a96';
  for (let i = 0; i < n; i++) {
    const k = front ? 1 + i * .25 : i / (n - 1), y = front ? 1760 + i * 150 : y0 + Math.pow(k, 1.6) * 900, amp = (5 + k * 34) * (0.4 + rough * 1.1) * (front ? 1.5 : 1), wl = (260 + k * 700) * (front ? 1.4 : 1), sp = (front ? 1.6 : .6 + k * .9) * (0.6 + rough);
    const col = front ? mix(mid, deep, .3 + i * .3) : mix(lite, deep, k * .8);
    g.beginPath(); g.moveTo(-1700, 4000);
    for (let x = -1700; x <= 2800; x += 30) g.lineTo(x, y + Math.sin(x / wl * 6.28 + T * sp + i * 1.7) * amp + Math.sin(x / (wl * .43) * 6.28 - T * sp * 1.3 + i) * amp * .35);
    g.lineTo(2800, 4000); g.closePath(); g.fillStyle = col; g.fill();
    if (rough > .25 || front) { g.save(); g.globalAlpha = .55 * Math.min(1, rough * 1.4 + (front ? .3 : 0)); g.beginPath();
      for (let x = -1700; x <= 2800; x += 30) { const yy = y + Math.sin(x / wl * 6.28 + T * sp + i * 1.7) * amp + Math.sin(x / (wl * .43) * 6.28 - T * sp * 1.3 + i) * amp * .35; x === -1700 ? g.moveTo(x, yy) : g.lineTo(x, yy); }
      g.lineWidth = 3 + k * 8; g.strokeStyle = '#e8f4f0'; g.stroke(); g.restore(); }
  }
  if (!front && S.glint) { glow(g, S.glint[0], y0 + 30, 400, 'rgba(255,220,170,1)', .35); for (let i = 0; i < 14; i++) line(g, [S.glint[0] - 60 + Math.sin(T * 2 + i) * 40, y0 + 20 + i * 26, S.glint[0] + 60 + Math.sin(T * 2 + i) * 40, y0 + 20 + i * 26], 4, 'rgba(255,230,190,.35)'); }
}
function rain(g, T, a = 1) { const r = rng(Math.floor(T * 24)); g.save(); g.globalAlpha = .5 * a; g.strokeStyle = '#cfe0ff'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 220; i++) { const x = -600 + r() * 2300, y = -400 + r() * 2800; g.moveTo(x, y); g.lineTo(x - 40, y + 110); } g.stroke(); g.restore(); }
function bolt(g, a, lt) { const q = (lt - a.t0) / .35; if (q < 0 || q > 1) return; const r = rng(a.seed || 4); let x = a.x, y = -300; g.save(); g.globalAlpha = 1 - q; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x, y); while (y < a.y) { x += (r() - .5) * 160; y += 60 + r() * 80; g.lineTo(x, y); } g.lineWidth = 26; g.strokeStyle = 'rgba(190,200,255,.35)'; g.stroke(); g.lineWidth = 8; g.strokeStyle = '#f4f6ff'; g.stroke(); g.restore(); glow(g, a.x, a.y * .6, 900, 'rgba(200,210,255,1)', (1 - q) * .6); }
// ---------- the ship ----------
function ship(g, a, T) {
  const rock = Math.sin(T * (1.1 + (a.rock || 0) * 1.4)) * (a.rock ?? .2) * .22, bob = Math.sin(T * 1.7) * 10 * (1 + (a.rock || 0) * 3);
  g.save(); g.translate(a.x, a.y + bob); g.rotate(rock); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  // mast + sail
  limb(g, [0, -40, 0, -760], 22, '#6a4a2a', 6); limb(g, [-260, -700, 270, -700], 14, '#6a4a2a', 5); limb(g, [-240, -330, 250, -330], 12, '#6a4a2a', 5);
  const bil = Math.sin(T * 2.4) * 30 * (1 + (a.rock || 0) * 2);
  const sail = `M-250 -695 Q${bil} -620 250 -695 L245 -335 Q${bil * .8} -${300 - bil * .3} -245 -335 Z`;
  sh(g, sail, a.sail || '#e8d8b0', 6); g.save(); g.clip(path(sail)); for (let i = -2; i <= 2; i++) line(g, [i * 100, -720, i * 100 + bil * .4, -320], 34, i % 2 ? 'rgba(160,50,40,.75)' : 'rgba(0,0,0,0)'); g.restore(); sh(g, sail, null, 6);
  if (a.torn) { sh(g, 'M80 -600 L150 -520 L60 -470 L120 -400', null, 6, '#2a1a12'); }
  line(g, [0, -760, -480, -60], 4, '#3a2a1a'); line(g, [0, -760, 470, -70], 4, '#3a2a1a');
  // hull
  sh(g, 'M-520 -120 C-500 -40 -420 60 -260 70 L280 70 C430 60 520 -20 560 -160 L600 -230 L520 -170 L-470 -140 L-560 -260 Z', lg(g, 0, -200, 0, 70, [[0, '#9a6a3a'], [1, '#5a3a1e']]), 7);
  for (let i = 0; i < 3; i++) line(g, [-500, -100 + i * 50, 0, -90 + i * 60 + 12, 540, -120 + i * 50], 4, 'rgba(40,20,10,.5)');
  ell(g, 500, -140, 22, 22, '#f2ead8', 4); ell(g, 504, -140, 10, 10, '#2a1a12');
  sh(g, 'M-560 -260 C-600 -330 -560 -380 -520 -360 C-540 -320 -530 -290 -500 -270 Z', '#7a4a26', 6);
  g.restore();
}
// ---------- the great fish ----------
function bigFish(g, a, T) {
  const m = a.mouth ?? 0, tail = Math.sin(T * 2.2 + (a.ph || 0)) * .25;
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); g.rotate(a.rot || 0);
  const body = a.col || '#2c4a5e', belly = a.belly || '#a8b8a8', dark = mix(body, '#000', .35);
  // tail
  g.save(); g.translate(-760, 0); g.rotate(tail); sh(g, 'M0 0 C-120 -60 -260 -260 -330 -300 C-300 -150 -300 150 -330 300 C-260 260 -120 60 0 0 Z', lg(g, -330, 0, 0, 0, [[0, dark], [1, body]]), 9); g.restore();
  // fins
  sh(g, 'M-200 -300 C-120 -480 60 -520 140 -420 C40 -400 -60 -340 -100 -290 Z', dark, 8);
  // body (lower jaw hinged)
  const top = 'M-780 0 C-700 -340 -200 -440 260 -380 C480 -350 640 -220 700 -40 L320 -20 Z';
  sh(g, top, lg(g, 0, -440, 0, 0, [[0, mix(body, '#fff', .15)], [1, body]]), 9);
  g.save(); g.translate(320, -20); g.rotate(m * .55);
  if (m > .05) sh(g, 'M0 0 L380 -20 C300 160 120 240 -40 200 Z', '#3a0e14', 0);
  sh(g, 'M-1100 20 C-900 360 -300 440 160 360 C360 320 470 200 400 -10 L0 0 Z', lg(g, 0, 0, 0, 400, [[0, belly], [1, mix(belly, '#000', .2)]]), 9);
  for (let i = 0; i < 6; i++) line(g, [-700 + i * 160, 120, -660 + i * 160, 330], 5, 'rgba(40,50,50,.35)');
  g.restore();
  if (m > .05) { g.save(); g.globalAlpha = m; ell(g, 560, 10, 140 * m + 20, 90 * m + 10, '#1a0608'); g.restore(); for (let i = 0; i < 7; i++) sh(g, `M${380 + i * 44} -32 L${400 + i * 44} ${-32 + 34} L${420 + i * 44} -32 Z`, '#f2ead8', 3); }
  sh(g, 'M-300 40 C-200 160 -60 160 40 110 C-60 90 -200 80 -300 40 Z', dark, 7);
  // eye
  ell(g, 420, -200, 44, 40, '#f4ecd8', 7); ell(g, 432, -198, 20, 24, '#120a08'); ell(g, 440, -208, 7, 7, '#fff'); line(g, [370, -250, 470, -236], 10, mix(body, '#000', .5));
  // spots + gill
  [[-400, -200, 30], [-200, -260, 22], [0, -280, 26], [-520, -100, 20], [100, -230, 18]].forEach(([x, y, r]) => ell(g, x, y, r, r * .7, mix(body, '#fff', .25)));
  line(g, [230, -300, 200, -150, 240, -20], 7, mix(body, '#000', .5));
  g.restore();
}
// ---------- animals (optionally in sackcloth) ----------
function cow(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); const b = Math.sin(T * 2 + (a.ph || 0)) * 3;
  ell(g, 0, 4, 190, 20, 'rgba(30,15,10,.25)');
  [[-120, 0], [-70, 0], [90, 0], [140, 0]].forEach(([x], i) => { limb(g, [x, -150, x + (i % 2 ? 4 : -4), -16], 30, i < 2 ? '#c9b8a0' : '#e8dccb', 5); sh(g, `M${x - 18} -18 l36 0 l2 18 l-40 0 Z`, '#2a1a12', 4); });
  ell(g, 0, -200, 190, 100, '#f0e6d6', 7); ell(g, -60, -230, 60, 40, '#5a3a2a'); ell(g, 80, -170, 50, 34, '#5a3a2a');
  if (a.sack) { sh(g, 'M-170 -280 Q0 -320 170 -280 L190 -150 Q0 -120 -190 -150 Z', '#7a6a50', 6); for (let i = -3; i <= 3; i++) line(g, [i * 50, -300, i * 52, -130], 3, 'rgba(40,30,20,.35)'); }
  g.save(); g.translate(200, -250 + b); limb(g, [-40, 20, 20, 10], 60, '#f0e6d6', 6); ell(g, 60, 10, 66, 56, '#f0e6d6', 6); ell(g, 100, 40, 40, 30, '#e8b4a8', 5); ell(g, 92, 36, 5, 7, '#3a2a24'); ell(g, 112, 36, 5, 7, '#3a2a24');
  sh(g, 'M20 -40 Q0 -90 -30 -84 Q0 -70 30 -30 Z', '#e8dcc0', 4); sh(g, 'M70 -44 Q80 -96 110 -92 Q86 -76 82 -38 Z', '#e8dcc0', 4); ell(g, 60, -6, 9, 9, '#1a120e'); ell(g, 63, -9, 3, 3, '#fff');
  line(g, [40, -24, 76, -20], 5); ell(g, -6, -10, 22, 12, '#f0e6d6', 5, -.6); if (a.sack) sh(g, 'M-30 -30 Q40 -70 110 -40 L100 -14 Q40 -40 -24 -6 Z', '#7a6a50', 5); g.restore();
  limb(g, [-190, -230, -220, -160, -214, -100], 8, '#d8c8b0', 4); g.restore(); }
function sheep(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  ell(g, 0, 4, 120, 14, 'rgba(30,15,10,.25)'); [[-60, 0], [60, 0]].forEach(([x]) => { limb(g, [x - 14, -70, x - 16, -10], 18, '#2a201c', 4); limb(g, [x + 14, -70, x + 16, -10], 18, '#2a201c', 4); });
  [[-70, -120, 60], [0, -140, 70], [70, -120, 60], [-30, -90, 60], [40, -90, 60]].forEach(([x, y, r]) => ell(g, x, y, r, r * .85, '#f4f0e6', 6));
  if (a.sack) sh(g, 'M-110 -170 Q0 -200 110 -170 L120 -90 Q0 -70 -120 -90 Z', '#7a6a50', 6);
  ell(g, 120, -140, 40, 46, '#2a201c', 5); ell(g, 132, -150, 7, 7, '#f4f0e6'); ell(g, 94, -170, 22, 12, '#2a201c', 4, -.5); g.restore(); }
// ---------- Nineveh ----------
function nineveh(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const col = a.col || '#c8a070', dk = mix(col, '#000', .2);
  // ziggurat
  for (let i = 0; i < 5; i++) { const w = 700 - i * 130, h = 120; sh(g, `M${-w / 2} ${-260 - i * h} L${w / 2} ${-260 - i * h} L${w / 2 - 30} ${-260 - (i + 1) * h} L${-w / 2 + 30} ${-260 - (i + 1) * h} Z`, mix(col, '#fff', i * .03), 5); }
  sh(g, 'M-40 -860 L40 -860 L40 -920 L-40 -920 Z', '#e0b648', 4);
  sh(g, 'M-1300 0 L-1300 -300 L1300 -300 L1300 0 Z', dk, 6); for (let x = -1290; x < 1300; x += 60) sh(g, `M${x} -300 l34 0 l0 -36 l-34 0 Z`, dk, 4);
  for (let i = -3; i <= 3; i++) { const x = i * 380; sh(g, `M${x - 70} 0 L${x - 70} -440 L${x + 70} -440 L${x + 70} 0 Z`, col, 6); for (let j = 0; j < 3; j++) sh(g, `M${x - 70 + j * 50} -440 l34 0 l0 -40 l-34 0 Z`, col, 4); }
  sh(g, 'M-120 0 L-120 -220 Q0 -320 120 -220 L120 0 Z', '#2a1810', 6); [[-160, -120], [160, -120]].forEach(([x, y]) => { ell(g, x, y, 34, 50, '#e0b648', 4); });
  for (let i = 0; i < 6; i++) { const x = -1200 + i * 480; limb(g, [x, -300, x + 10, -470], 14, '#5a4330', 4); for (let k = 0; k < 5; k++) { g.save(); g.translate(x + 10, -470); g.rotate(-1.4 + k * .7 + Math.sin(T + i) * .05); sh(g, 'M0 0 Q60 -20 120 10 Q60 0 0 8 Z', '#4e6a34', 3); g.restore(); } }
  g.restore(); }
// ---------- the tomb ----------
function tomb(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const open = a.open ?? 0;
  sh(g, 'M-700 0 C-680 -500 -300 -760 100 -720 C480 -680 720 -420 720 0 Z', lg(g, 0, -720, 0, 0, [[0, '#8a7a6a'], [1, '#5a4a3e']]), 8);
  [[-400, -400, 140], [300, -500, 120], [-100, -620, 90], [450, -220, 110]].forEach(([x, y, w]) => line(g, [x - w, y, x, y + 30, x + w, y + 6], 6, 'rgba(30,20,15,.35)'));
  ell(g, 0, -230, 210, 230, '#0a0604', 7);
  if (open > 0) { glow(g, 0, -230, 700, 'rgba(255,230,160,1)', open); rays(g, 0, -230, 1600, 20, 'rgba(255,236,180,.7)', open * .8, T); ell(g, 0, -230, 190, 210, `rgba(255,246,220,${open * .9})`); }
  const sx = open * 520; g.save(); g.translate(sx, -230); g.rotate(open * 1.6); ell(g, 0, 0, 250, 250, lg(g, -250, -250, 250, 250, [[0, '#a89888'], [1, '#6a5a4c']]), 8); ell(g, 0, 0, 170, 170, null, 5, 0, 'rgba(40,30,20,.4)'); g.restore();
  g.restore(); }
function bubbles(g, T, n, seed, area) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + r() * area[2] + Math.sin(T * 2 + i) * 14, y = area[1] + ((r() * area[3] - T * (60 + r() * 120)) % area[3] + area[3]) % area[3], s = 4 + r() * 12; ell(g, x, y, s, s, null, 3, 0, 'rgba(220,240,255,.55)'); ell(g, x - s * .3, y - s * .3, s * .25, s * .25, 'rgba(255,255,255,.6)'); } }
// hook the new actors into the stage
const _drawActor = drawActor;
drawActor = function (g, a, c, P, o) {
  const A = avAll(a, c.lt), T = c.T;
  if (A.type === 'ship') return ship(g, A, T); if (A.type === 'fish') return bigFish(g, A, T); if (A.type === 'bolt') return bolt(g, A, c.lt);
  if (A.type === 'cow') return cow(g, A, T); if (A.type === 'sheep') return sheep(g, A, T); if (A.type === 'nineveh') return nineveh(g, A, T); if (A.type === 'tomb') return tomb(g, A, c.lt, T);
  if (A.type === 'splash') { const q = (c.lt - A.t0) / (A.d || 1.2); if (q < 0 || q > 1) return; const r = rng(A.seed || 2); for (let i = 0; i < 30; i++) { const an = -Math.PI * (.1 + r() * .8), sp = (300 + r() * 600) * (A.s || 1), x = A.x + Math.cos(an) * sp * q, y = A.y + Math.sin(an) * sp * q + 900 * q * q * (A.s || 1), rr = (10 + r() * 22) * (A.s || 1); ell(g, x, y, rr, rr, `rgba(230,245,250,${(1 - q).toFixed(2)})`); } return; }
  if (A.type === 'booth') { g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); limb(g, [-200, 0, -200, -380], 14, '#6a4a2a', 5); limb(g, [200, 0, 200, -380], 14, '#6a4a2a', 5); sh(g, 'M-260 -380 L260 -380 L230 -440 L-230 -440 Z', '#8a7a4a', 5); for (let i = 0; i < 9; i++) { const x = -240 + i * 60; ell(g, x, -440, 46, 26, A.wilt ? '#8a7a3a' : '#5a8a3a', 4); } g.restore(); return; }
  return _drawActor(g, a, c, P, o);
};
// stage: sea instead of ground, rain, front waves
const _stage = SC.stage;
SC.stage = (g, o, c) => {
  o = avAll(o, c.lt);
  if (!o.sea) { _stage(g, o, c); if (o.rain) rain(g, c.T, o.rain); return; }
  const P = Object.assign({}, SKY[o.sky || 'sunset'], o.pal || {});
  skyLayer(g, c, P, o);
  for (const a of (o.far || [])) par(g, c, a.par ?? .6, () => drawActor(g, a, c, P, o));
  seaLayer(g, c, o, false);
  for (const a of (o.actors || [])) { if (a.par != null && a.par !== 1) par(g, c, a.par, () => drawActor(g, a, c, P, o)); else drawActor(g, a, c, P, o); }
  if (o.seaFront) seaLayer(g, c, o, true);
  if (o.rain) rain(g, c.T, o.rain);
  dust(g, c.T, o.dustN ?? 16, 21, 'rgba(230,240,255,');
};
// underwater: light shafts, bubbles, a sinking man and something rising from below
SC.under = (g, o, c) => {
  const T = c.T, lt = c.lt, P = SKY.night;
  g.fillStyle = lg(g, 0, -400, 0, 2400, [[0, '#3a7a8a'], [.4, '#14404e'], [1, '#04121a']]); g.fillRect(-1600, -1600, 4300, 4300);
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = -200 + i * 230 + Math.sin(T * .4 + i) * 40; g.fillStyle = lg(g, 0, -400, 0, 1600, [[0, 'rgba(160,220,230,.22)'], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.moveTo(x - 30, -400); g.lineTo(x + 30, -400); g.lineTo(x + 180, 1600); g.lineTo(x - 60, 1600); g.fill(); } g.restore();
  for (const a of (o.actors || [])) drawActor(g, a, c, P, o);
  bubbles(g, T, 40, 7, [-200, 0, 1500, 2000]);
};
// inside the fish: a dark ribbed cave, one warm light where he prays
SC.belly = (g, o, c) => {
  const T = c.T, lt = c.lt, P = SKY.night, warm = o.warm ?? 0;
  g.fillStyle = rg(g, 540, 1100, 100, 1500, [[0, '#4a1a1e'], [.6, '#200a0e'], [1, '#080204']]); g.fillRect(-1600, -1600, 4300, 4300);
  const pulse = 1 + .015 * Math.sin(T * 1.4);
  for (let i = 0; i < 7; i++) { const x = -300 + i * 280; g.save(); g.translate(540, 1100); g.scale(pulse, pulse); g.translate(-540, -1100); line(g, [x, -200, x + (540 - x) * .25, 700, x, 1700], 60, 'rgba(120,50,50,.55)'); line(g, [x, -200, x + (540 - x) * .25, 700, x, 1700], 18, 'rgba(200,120,110,.25)'); g.restore(); }
  sh(g, 'M-900 1800 Q540 1600 1980 1800 L1980 2600 L-900 2600 Z', '#1a080a'); for (let i = 0; i < 8; i++) ell(g, 100 + i * 130, 1760 + Math.sin(i) * 20, 70, 26, 'rgba(60,90,60,.6)');
  for (let i = 0; i < 5; i++) { const k = ((T * .4 + i / 5) % 1); ell(g, 200 + i * 170, -100 + k * 1900, 6, 10, 'rgba(180,200,190,.5)'); }
  if (warm > 0) { glow(g, 540, 1350, 900, 'rgba(255,200,120,1)', warm * .8); rays(g, 540, 1300, 1400, 16, 'rgba(255,220,160,.5)', warm * .35, T); }
  for (const a of (o.actors || [])) drawActor(g, a, c, P, o);
  dust(g, T, 20, 5, 'rgba(255,200,170,');
};
// present day: dusk beach at Joppa
SC.beach = (g, o, c) => {
  const T = c.T, late = o.late ? 1 : 0;
  par(g, c, .05, () => { g.fillStyle = lg(g, 0, -600, 0, 1000, [[0, mix('#3a3a7a', '#1a1a4a', late)], [.6, mix('#e07a5a', '#a04a5a', late)], [1, mix('#ffd0a0', '#e0907a', late)]]); g.fillRect(-1600, -1600, 4300, 2700); });
  par(g, c, .1, () => { sun(g, 760, 900 + late * 50, 100, mix('#ffe0a8', '#ffa070', late)); birds(g, T, 0, 300, 6, 9); });
  seaLayer(g, c, { sea: { y: 960, rough: .12, glint: [760], lite: mix('#e0a080', '#a06070', late), mid: '#2a5a6a', deep: '#123a4a' } }, false);
  if (o.tail) { const k = ((c.lt - (o.tail.t0 || 0)) / 1.6); if (k > 0 && k < 1) { const x = o.tail.x || 820, y = 1020 - Math.sin(k * Math.PI) * 140; g.save(); g.translate(x, y); g.rotate(-1 + k * 2); g.scale(.35, .35); sh(g, 'M0 0 C-120 -60 -260 -260 -330 -300 C-300 -150 -300 150 -330 300 C-260 260 -120 60 0 0 Z', '#1e3a4a', 9); g.restore(); } if (k > .7 && k < 1.6) { const q = (k - .7) / .9; for (let i = 0; i < 16; i++) { const an = -Math.PI * (.15 + i / 16 * .7), r2 = 160 * q; ell(g, (o.tail.x || 820) + Math.cos(an) * r2, 1030 + Math.sin(an) * r2 * .8 + 200 * q * q, 8, 8, `rgba(240,250,255,${(1 - q).toFixed(2)})`); } } }
  g.fillStyle = lg(g, 0, 1300, 0, 2000, [[0, mix('#e0c08a', '#b08a6a', late)], [1, mix('#c09a62', '#8a6a4a', late)]]); g.beginPath(); g.moveTo(-1600, 2600); for (let x = -1600; x <= 2700; x += 40) g.lineTo(x, 1330 + Math.sin(x * .004) * 30); g.lineTo(2700, 2600); g.fill();
  const wash = Math.sin(T * .9) * 30; g.save(); g.globalAlpha = .7; g.beginPath(); for (let x = -1600; x <= 2700; x += 40) g.lineTo(x, 1330 + Math.sin(x * .004) * 30 + wash + Math.sin(x * .02 + T) * 6); g.lineWidth = 10; g.strokeStyle = '#f4f8f4'; g.stroke(); g.restore();
  rock(g, 980, 1720, 120, 80, '#7a6a5a'); rock(g, 80, 1660, 90, 60, '#7a6a5a'); for (let i = 0; i < 6; i++) ell(g, 200 + i * 150, 1800 + (i % 2) * 40, 14, 8, '#f4e8d8', 3);
  for (const a of (o.actors || [])) drawActor(g, a, c, SKY.day, o);
  if (o.noCast) { dust(g, T, 26, 31); return; }
  const sel = { x: o.selahX ?? 860, y: 1640, s: 1.0, flip: true, t: T, pose: o.selahPose || 'stand', expr: o.selahExpr || 'calm', talk: c.V('selah'), look: o.selahLook || [.4, 0], ph: 1 };
  const tob = { x: o.tobyX ?? 280, y: 1700, s: 1.0, t: T, expr: o.tobyExpr || 'neutral', hands: o.tobyHands || 'down', talk: c.V('toby'), look: o.tobyLook || [.5, 0], hop: o.tobyHop || 0, flip: o.tobyFlip };
  if (o.tobyFront) { donkey(g, sel); toby(g, tob); } else { toby(g, tob); donkey(g, sel); }
  dust(g, T, 26, 31);
};
