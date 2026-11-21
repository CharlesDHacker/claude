// Episode 6 (Gideon's 300): Gideon, Midianite raiders, camels with crescent ornaments, the winepress, caves,
// jars / torches / ram's horns, the enemy tent camp at night, the tumbling barley loaf, and the midnight chaos.
Object.assign(WAR, {
  gideon:    { skin: '#b67c50', tunic: '#cdb48a', kilt: '#6a4a2c', cape: null, beard: 'short', beardCol: '#3a2414', hair: '#3a2414', helmet: null, bulk: .92, head: 1.04, weapon: null, shield: null, boots: '#6a4428' },
  gideonW:   { skin: '#b67c50', tunic: '#cdb48a', kilt: '#6a4a2c', cape: '#a8341e', beard: 'short', beardCol: '#3a2414', hair: '#3a2414', helmet: null, bulk: .98, head: 1.02, weapon: null, shield: null, boots: '#6a4428' },
  man300:    { skin: '#a8714c', tunic: '#b89a6a', kilt: '#4a3a2a', cape: null, beard: 'short', beardCol: '#24160e', hair: '#24160e', helmet: null, bulk: 1, head: 1, weapon: null, shield: null, boots: '#4a2c1c' },
  midianite: { skin: '#9a6440', tunic: '#2a2a3a', kilt: '#8a2a2a', cape: '#3a2a4a', beard: 'long', beardCol: '#140c08', hair: '#140c08', helmet: 'turban', wrap: '#d8c8a0', bulk: 1.08, head: 1, weapon: 'sword', shield: null, boots: '#3a2418', long: 1, trim: '#d8a038' },
  midianite2:{ skin: '#a06a44', tunic: '#5a3a1a', kilt: '#2a4a5a', cape: null, beard: 'short', beardCol: '#140c08', hair: '#140c08', helmet: 'turban', wrap: '#8a2a2a', bulk: 1.0, head: 1, weapon: 'sword', shield: null, boots: '#3a2418' },
  midsoldier:{ skin: '#a06a44', tunic: '#4a3a5a', kilt: '#6a3a1a', cape: null, beard: 'short', beardCol: '#140c08', hair: '#140c08', helmet: 'turban', wrap: '#c8b890', bulk: 1.0, head: 1, weapon: null, shield: null, boots: '#3a2418' },
});
// turban (headwrap with a hanging tail), drawn over figure v2's head
(function () { const base = warrior; warrior = function (g, o) {
  const C = typeof o.c === 'string' ? WAR[o.c] : o.c || {};
  if (C.helmet !== 'turban') return base(g, o);
  base(g, Object.assign({}, o, { c: Object.assign({}, C, { helmet: null }) }));
  const pose = o.pose || 'stand', kneel = ['kneel', 'faint', 'pray', 'sulk'].includes(pose), drop = kneel ? 150 : 0;
  const shY = -620 + drop + Math.sin((o.t || 0) * 1.7 + (o.ph || 0)) * 2, hs = (C.head || 1) * .86, hy = shY - 62 * hs, w = C.wrap || '#d8c8a0';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1); if (pose === 'fall') g.rotate(-eio(o.k ?? 1) * 1.45);
  if (o.rot) { g.translate(0, -380); g.rotate(o.rot); g.translate(0, 380); } g.rotate(pose === 'charge' ? .16 : pose === 'thrust' ? .08 : 0);
  g.translate(14, hy); g.scale(hs, hs); if (o.headRot) g.rotate(o.headRot);
  const sw = Math.sin((o.t || 0) * 2.4) * 8;
  sh(g, `M-58 -40 Q-80 ${10 + sw} -70 ${70 + sw} L-52 ${66 + sw} Q-58 10 -44 -30 Z`, mix(w, '#000', .2), 3.4);
  sh(g, 'M-62 -26 C-70 -96 -10 -126 30 -116 C66 -106 72 -66 64 -30 Q0 -48 -62 -26 Z', lg(g, 0, -126, 0, -26, [[0, mix(w, '#fff', .25)], [1, w]]), 4);
  for (let i = 0; i < 3; i++) line(g, [-60, -40 - i * 22, -10, -64 - i * 26, 62, -44 - i * 20], 2.4, mix(w, '#000', .3), 'round', true);
  g.restore(); }; })();

// items held in the front hand (hook in figure.js): drawn in figure space at the hand
var HOLD = {
  torch: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot || -.15);
    taper(g, 0, 50, 0, -170, 12, 16, lg(g, -8, 0, 8, 0, [[0, '#7a5030'], [1, '#3a2414']])); sh(g, 'M-20 -170 L20 -170 L16 -196 L-16 -196 Z', '#4a2e1a', 3);
    fire(g, 0, -190, .9, t); glow(g, 0, -230, 420, 'rgba(255,170,70,1)', .45); g.restore(); },
  horn: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.5);
    sh(g, 'M-20 10 C-30 -60 10 -140 90 -170 C120 -180 150 -170 160 -150 L150 -120 C130 -140 100 -140 80 -128 C30 -96 10 -40 8 12 Z', lg(g, 0, -170, 0, 12, [[0, '#f2dcb0'], [.6, '#c89a5a'], [1, '#7a5228']]), 4);
    for (let i = 1; i < 5; i++) line(g, [-14 + i * 4, -i * 34 + 10, 8 + i * 20, -i * 36 - 4], 2.2, 'rgba(90,50,20,.45)', 'round', true);
    if (o.blow) { const q = (t * 2.2) % 1; for (let i = 0; i < 3; i++) { const r = 60 + ((q + i / 3) % 1) * 220; g.save(); g.globalAlpha = (1 - ((q + i / 3) % 1)) * .8 * o.blow; g.beginPath(); g.arc(160, -150, r, -1.3, .3); g.lineWidth = 9; g.strokeStyle = '#fff4c8'; g.stroke(); g.restore(); } }
    g.restore(); },
  jar: (g, h, o, t) => { g.save(); g.translate(h[0], h[1] + 40); jarShape(g, o.jarK ?? 0, t); g.restore(); },
  stick: (g, h, o) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -1.1); taper(g, 0, 40, 0, -300, 12, 9, '#8a6038'); g.restore(); },
};
// clay jar; k 0 = whole, >0 = shattered (shards fly outward, the hidden torch flares)
function jarShape(g, k, t) {
  if (k <= 0) { sh(g, 'M-40 -110 L40 -110 L34 -90 C80 -60 84 20 50 50 L-50 50 C-84 20 -80 -60 -34 -90 Z', lg(g, -80, 0, 80, 0, [[0, '#d88a54'], [.5, '#b8683a'], [1, '#7a3e1e']]), 4.5);
    line(g, [-60, -20, 60, -20], 3, 'rgba(70,30,10,.45)', 'round', true); line(g, [-58, 0, 58, 0], 3, 'rgba(70,30,10,.35)', 'round', true);
    glow(g, 0, -110, 90, 'rgba(255,170,70,1)', .25 + .1 * Math.sin(t * 9)); return; }
  const q = Math.min(1, k); const r = rng(7);
  for (let i = 0; i < 9; i++) { const an = -Math.PI * (.05 + r() * .9) + (r() > .7 ? Math.PI : 0), sp = 140 + r() * 260, x = Math.cos(an) * sp * q, y = Math.sin(an) * sp * q + 400 * q * q;
    g.save(); g.translate(x, y - 30); g.rotate(q * (r() * 12 - 6)); g.globalAlpha *= 1 - q * .6; sh(g, `M-${18 + r() * 14} -10 L${10 + r() * 14} -${14 + r() * 10} L${16 + r() * 10} ${12 + r() * 8} L-${8 + r() * 8} 14 Z`, i % 2 ? '#b8683a' : '#8a4422', 3); g.restore(); }
  taper(g, 0, 60, 0, -120, 12, 16, '#4a2e1a'); fire(g, 0, -130, 1.2 + (1 - q) * .8, t); glow(g, 0, -150, 600, 'rgba(255,190,90,1)', .55 + (1 - q) * .5);
}
function camel(g, a, T) {
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  const col = a.col || '#c8955a', dk = mix(col, '#3a2010', .35), lt = mix(col, '#fff', .2), sil = a.sil, ph = a.ph || 0, w = a.walk ? T * (a.rate || 5) + ph : null;
  const ink = sil ? 0 : 4.5, fillC = (c) => sil ? (a.silCol || '#1a1020') : c;
  if (!sil) { g.fillStyle = rg(g, 0, 0, 10, 220, [[0, 'rgba(20,10,10,.3)'], [1, 'rgba(20,10,10,0)']]); g.beginPath(); g.ellipse(0, 4, 220, 20, 0, 0, 7); g.fill(); }
  const leg = (x, phs, c) => { const sw = w != null ? Math.sin(w + phs) * 34 : 0, lift = w != null ? Math.max(0, Math.cos(w + phs)) * 18 : 0;
    taper(g, x, -230, x + sw * .4, -110, 30, 20, fillC(c), !sil); taper(g, x + sw * .4, -110, x + sw, -6 - lift, 20, 15, fillC(c), !sil); ell(g, x + sw + 6, -6 - lift, 22, 9, fillC(dk), ink * .7); };
  leg(-120, 0, dk); leg(110, 2.4, dk);
  if (!sil) { line(g, [-185, -280, -205, -200, -198, -170], 9, dk, 'round', true); }
  const body = 'M-180 -270 C-190 -330 -130 -350 -90 -400 C-50 -450 30 -440 60 -380 C76 -350 120 -330 160 -320 C190 -300 186 -240 150 -220 L-140 -216 C-180 -222 -186 -246 -180 -270 Z';
  sh(g, body, sil ? fillC() : rg(g, -20, -380, 20, 260, [[0, lt], [.6, col], [1, dk]]), ink);
  if (!sil && a.blanket !== false) { sh(g, 'M-110 -330 C-80 -300 40 -296 80 -330 L96 -250 C40 -236 -80 -236 -120 -252 Z', a.blanket || '#8a2a2a', 3.5); pattern(g, -118, 94, -262, 14, '#e0b648', 'zig'); }
  leg(-80, 3.1, col); leg(140, 5.4, col);
  // neck + head
  const nod = Math.sin((w ?? T * 1.2) + ph) * .05;
  g.save(); g.translate(150, -300); g.rotate(nod);
  sh(g, 'M-20 -10 C10 -40 40 -110 60 -170 C70 -196 110 -200 116 -170 C110 -120 70 -40 30 30 Z', sil ? fillC() : lg(g, 0, -200, 0, 30, [[0, lt], [1, col]]), ink);
  sh(g, 'M70 -200 C80 -230 140 -232 176 -214 C196 -204 196 -180 176 -172 C150 -164 110 -166 84 -160 C64 -170 62 -190 70 -200 Z', sil ? fillC() : lg(g, 70, -230, 190, -160, [[0, lt], [1, col]]), ink);
  if (!sil) { sh(g, 'M84 -212 L76 -236 L98 -218 Z', dk, 3); ell(g, 112, -204, 7, 7, '#1a100a'); ell(g, 114, -206, 2.4, 2.4, '#fff'); line(g, [176, -184, 186, -178], 3);
    line(g, [150, -172, 184, -176], 2.6); if (a.crescents !== false) { line(g, [30, -30, 60, -40, 80, -60], 3, '#e0b648', 'round', true); [[30, -26], [56, -36], [78, -56]].forEach(([x, y]) => { g.save(); g.translate(x, y + 16); sh(g, 'M-12 -6 Q0 18 12 -6 Q0 6 -12 -6 Z', '#f0c850', 2.4); g.restore(); }); } }
  g.restore();
  g.restore();
}
function camels(g, a, T) { const r = rng(a.seed || 5), n = Math.round(a.n || 12);
  for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : .5, x = lerp(a.x0, a.x1, k) + (r() - .5) * (a.jit || 60), y = a.y + (r() - .5) * (a.dy || 30);
    camel(g, { x: x + (a.vx || 0) * T, y, s: (a.s || .3) * (.9 + r() * .2), flip: a.flip, walk: a.walk, ph: r() * 6, sil: a.sil ?? true, silCol: a.col, rate: a.rate }, T); } }
function swarm(g, a, T) { const r = rng(a.seed || 9), n = a.n || 160; g.save(); g.fillStyle = a.col || 'rgba(30,20,20,.75)';
  for (let i = 0; i < n; i++) { const bx = r() * (a.w || 1100), by = r() * (a.h || 600), sp = 120 + r() * 160, x = (a.x || 0) + ((bx + T * sp * (a.dir || 1)) % (a.w || 1100) + (a.w || 1100)) % (a.w || 1100), y = (a.y || 0) + by + Math.sin(T * 6 + i) * 10;
    g.save(); g.translate(x, y); g.rotate(Math.sin(T * 8 + i) * .3); g.beginPath(); g.ellipse(0, 0, 9, 3.4, 0, 0, 7); g.fill(); g.globalAlpha = .4; g.beginPath(); g.ellipse(-2, -4, 7, 3, -.5 + Math.sin(T * 40 + i) * .6, 0, 7); g.fill(); g.restore(); }
  g.restore(); }
function caves(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const col = a.col || '#a8825e';
  sh(g, 'M-700 0 L-640 -520 C-560 -700 -360 -760 -200 -700 C-40 -820 200 -800 320 -680 C480 -720 640 -600 700 -440 L760 0 Z', lg(g, 0, -800, 0, 0, [[0, mix(col, '#fff', .15)], [1, mix(col, '#3a2010', .35)]]), 6);
  for (let i = 0; i < 9; i++) line(g, [-600 + i * 150, -500 + (i % 3) * 60, -560 + i * 150, -300 + (i % 2) * 80], 3, 'rgba(60,30,10,.3)', 'round', true);
  (a.mouths || [[-380, -380, 110], [60, -520, 90], [380, -300, 120], [-120, -170, 80]]).forEach(([x, y, r], i) => {
    sh(g, `M${x - r} ${y + r * .4} C${x - r} ${y - r * .9} ${x + r} ${y - r * .9} ${x + r} ${y + r * .4} Z`, '#1a0e0a', 5);
    const bl = ((T * .7 + i * .37) % 3.2) < .1; if (!bl) [[-r * .28, 0], [r * .12, 0]].forEach(([dx]) => { ell(g, x + dx, y - r * .05, r * .09, r * .11, '#fff4d8'); ell(g, x + dx + r * .02 * Math.sin(T + i), y - r * .03, r * .04, r * .05, '#1a0e0a'); }); });
  g.restore(); }
function winepress(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const st = a.col || '#b0957a', dk = mix(st, '#2a1810', .4);
  if (a.part !== 'front') { sh(g, 'M-420 -40 L-400 -520 L400 -520 L420 -40 Z', lg(g, 0, -520, 0, -40, [[0, mix(st, '#000', .45)], [1, mix(st, '#000', .2)]]), 6);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) sh(g, `M${-390 + c * 196 + (r % 2) * 90} ${-500 + r * 116} l180 0 l0 104 l-180 0 Z`, null, 2, 'rgba(30,15,10,.35)');
    sh(g, 'M-560 -520 C-480 -600 -300 -620 -200 -560 C-80 -640 160 -640 260 -560 C380 -620 540 -580 580 -520 Z', lg(g, 0, -640, 0, -520, [[0, '#7a8a4a'], [1, '#4a5a2a']]), 5); }
  if (a.part !== 'back') { sh(g, 'M-480 -170 L480 -170 L500 40 L-500 40 Z', lg(g, 0, -170, 0, 40, [[0, mix(st, '#fff', .12)], [1, dk]]), 6);
    for (let c = 0; c < 6; c++) sh(g, `M${-470 + c * 160} -160 l150 0 l0 90 l-150 0 Z`, null, 2.4, 'rgba(40,20,10,.4)');
    line(g, [-480, -168, 480, -168], 4, 'rgba(255,240,210,.35)', 'round', true); }
  g.restore(); }
function chaff(g, a, lt) { const r = rng(a.seed || 3); g.save();
  for (let i = 0; i < (a.n || 40); i++) { const per = 1.1, ph = r() * per, q = ((lt + ph) % per) / per, an = -Math.PI * (.2 + r() * .6), sp = 120 + r() * 260;
    const x = a.x + Math.cos(an) * sp * q + Math.sin(lt * 3 + i) * 10, y = a.y + Math.sin(an) * sp * q + 160 * q * q; g.globalAlpha = (1 - q) * .9;
    g.save(); g.translate(x, y); g.rotate(i + lt * 4); ell(g, 0, 0, 7, 3, i % 3 ? '#f0d890' : '#d8b860'); g.restore(); }
  g.restore(); }
function oak(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  sh(g, 'M-50 0 C-40 -200 -60 -360 -120 -470 L-80 -480 C-30 -400 -10 -360 0 -330 C20 -400 60 -460 120 -500 L150 -480 C80 -420 50 -300 60 0 Z', lg(g, -60, 0, 60, 0, [[0, '#6a4428'], [1, '#3a2414']]), 6);
  const sw = Math.sin(T * .9) * 6;
  [[-200, -560, 210], [60, -640, 250], [260, -520, 190], [-60, -460, 170], [140, -420, 150]].forEach(([x, y, r], i) => ell(g, x + sw * (i % 2 ? 1 : -1), y, r, r * .78, lg(g, x, y - r, x, y + r, [[0, '#8aa04a'], [1, '#3e5a26']]), 6));
  for (let i = 0; i < 14; i++) ell(g, -260 + (i * 47) % 520, -700 + (i * 71) % 300, 20, 14, 'rgba(220,240,160,.25)');
  g.restore(); }
function stream(g, a, T) { const y = a.y, h = a.h || 160; g.save();
  sh(g, `M-200 ${y} C300 ${y - 30} 700 ${y + 30} 1300 ${y - 10} L1300 ${y + h} C700 ${y + h + 20} 300 ${y + h - 30} -200 ${y + h} Z`, lg(g, 0, y, 0, y + h, [[0, '#7ac0d8'], [1, '#2a6a8a']]), 6);
  for (let i = 0; i < 24; i++) { const x = ((i * 97 + T * 60) % 1400) - 150, yy = y + 30 + (i * 37) % (h - 50); line(g, [x, yy, x + 50, yy - 3], 4, 'rgba(255,255,255,.55)', 'round', true); }
  g.restore(); }
// Midianite goat-hair tent; squash k (0..1) flattens it
function mtent(g, a, lt) { const k = clamp(a.squash ?? 0); g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), (a.s || 1) * (1 - k * .82)); const col = a.col || '#3a2a2a';
  sh(g, 'M-300 0 L-260 -200 C-120 -250 120 -250 260 -200 L300 0 Z', lg(g, 0, -250, 0, 0, [[0, mix(col, '#fff', .15)], [1, col]]), 6);
  for (let i = 0; i < 5; i++) line(g, [-280 + i * 140, -6, -250 + i * 125, -214], 6, 'rgba(255,230,190,.12)', 'round', true);
  sh(g, 'M-70 0 L-50 -150 L50 -150 L70 0 Z', a.lit ? lg(g, 0, -150, 0, 0, [[0, '#ffcf7a'], [1, '#c86a2a']]) : '#140c0c', 4);
  if (a.lit) glow(g, 0, -60, 260, 'rgba(255,170,80,1)', .4);
  line(g, [-300, 0, -380, 30], 3, '#5a4030', 'round', true); line(g, [300, 0, 380, 30], 3, '#5a4030', 'round', true); g.restore(); }
function camp(g, a, T) { const r = rng(a.seed || 11), rows = a.rows || 3;
  for (let j = 0; j < rows; j++) { const n = (a.n || 9) + j * 2, y = a.y + j * (a.dy || 60), s = (a.s || .22) * (1 + j * .35);
    for (let i = 0; i < n; i++) { const x = lerp(a.x0 ?? -100, a.x1 ?? 1180, (i + (j % 2) * .5) / n) + (r() - .5) * 40;
      mtent(g, { x, y, s, col: j % 2 ? '#3a2a30' : '#4a3428', lit: a.lit && r() > .6 }, 0);
      if (a.fires && r() > .55) fire(g, x + 90 * s / .22 * .3, y + 10, s * 1.6, T + i); } } }
function loaf(g, a, lt) { const k = clamp((lt - a.t0) / (a.t1 - a.t0)); if (lt < a.t0 && !a.pre) return;
  const x = lerp(a.x0, a.x1, k), y = lerp(a.y0, a.y1, k) - Math.abs(Math.sin(k * Math.PI * 3)) * (a.bounce ?? 60), R = a.r || 70;
  g.save(); g.translate(x, y - R); g.rotate(k * (a.spin ?? 14));
  ell(g, 0, 0, R, R * .82, rg(g, -R * .3, -R * .3, 4, R, [[0, '#f2d08a'], [.6, '#c8903e'], [1, '#8a5a22']]), 5);
  for (let i = -1; i <= 1; i++) line(g, [i * R * .4 - 10, -R * .5, i * R * .4 + 10, R * .5], 4, 'rgba(110,60,20,.6)', 'round', true);
  g.restore(); if (a.trail) for (let i = 1; i < 6; i++) ell(g, x - (a.x1 - a.x0) * .03 * i, y - 10, 30 - i * 4, 8, `rgba(240,220,170,${.3 - i * .05})`); }
function jarActor(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const k = a.t0 != null && lt >= a.t0 ? (lt - a.t0) / (a.d || .9) : 0; jarShape(g, k, T); g.restore(); }
// lights that pop on around an arc (the 300 torches on the hills), staggered from t0
function torchring(g, a, lt, T) { const r = rng(a.seed || 4), n = a.n || 40;
  for (let i = 0; i < n; i++) { const an = lerp(a.a0 ?? Math.PI * 1.05, a.a1 ?? Math.PI * 1.95, i / (n - 1)) + (r() - .5) * .04, x = a.cx + Math.cos(an) * a.rx, y = a.cy + Math.sin(an) * a.ry;
    const on = clamp((lt - (a.t0 ?? 0) - r() * (a.spread ?? .8)) / .15); if (on <= 0) { if (a.dark !== false) ell(g, x, y, 5 * (a.s || 1), 7 * (a.s || 1), 'rgba(20,10,10,.6)'); continue; }
    glow(g, x, y, 90 * (a.s || 1), 'rgba(255,170,70,1)', .7 * on); ell(g, x, y - 4, 7 * (a.s || 1) * on, (14 + Math.sin(T * 12 + i) * 3) * (a.s || 1) * on, '#fff0b0'); } }
function sparks(g, a, lt) { const per = a.per || .55, r = rng(a.seed || 2); g.save(); g.globalCompositeOperation = 'lighter';
  (a.pts || [[a.x, a.y]]).forEach(([px, py], j) => { const q = ((lt + j * .21) % per) / per; glow(g, px, py, 120 * (1 - q), 'rgba(255,230,160,1)', (1 - q));
    for (let i = 0; i < 10; i++) { const an = r() * Math.PI * 2, sp = 60 + r() * 140; line(g, [px + Math.cos(an) * sp * q, py + Math.sin(an) * sp * q, px + Math.cos(an) * (sp * q + 26), py + Math.sin(an) * (sp * q + 26)], 4, `rgba(255,220,140,${1 - q})`, 'round', true); } });
  g.restore(); }
function hornwaves(g, a, lt) { (a.pts || []).forEach(([x, y], j) => { for (let i = 0; i < 3; i++) { const q = ((lt * 1.6 + i / 3 + j * .13) % 1); g.save(); g.globalAlpha = (1 - q) * (a.a ?? .7);
  g.beginPath(); g.arc(x, y, 30 + q * (a.r || 260), 0, Math.PI * 2); g.lineWidth = 7; g.strokeStyle = a.col || '#fff0c0'; g.stroke(); g.restore(); } }); }

const _drawActor6 = drawActor;
drawActor = function (g, a, c, P, o) {
  const A = avAll(a, c.lt), T = c.T, lt = c.lt;
  if (A.type === 'camel') return camel(g, A, T); if (A.type === 'camels') return camels(g, A, T); if (A.type === 'swarm') return swarm(g, A, T);
  if (A.type === 'caves') return caves(g, A, T); if (A.type === 'winepress') return winepress(g, A, T); if (A.type === 'chaff') return chaff(g, A, lt);
  if (A.type === 'oak') return oak(g, A, T); if (A.type === 'stream') return stream(g, A, T); if (A.type === 'mtent') return mtent(g, A, lt);
  if (A.type === 'camp') return camp(g, A, T); if (A.type === 'loaf') return loaf(g, A, lt); if (A.type === 'jar') return jarActor(g, A, lt, T);
  if (A.type === 'torchring') return torchring(g, A, lt, T); if (A.type === 'sparks') return sparks(g, A, lt); if (A.type === 'hornwaves') return hornwaves(g, A, lt);
  if (A.type === 'angel') return angel(g, Object.assign({}, A, { t: T, talk: c.V('angel') }));
  return _drawActor6(g, a, c, P, o);
};
