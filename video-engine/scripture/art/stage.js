// "stage": a composable cinematic set. Shot options pick a sky preset and a list of actors; any numeric prop can be animated
// with {a: from, b: to, t0, t1, e: 'io'|'o'|'i'} (times in seconds into the shot). Layers get camera parallax.
function av(v, lt) { if (v && typeof v === 'object' && !Array.isArray(v) && 'a' in v) { const k = clamp((lt - (v.t0 || 0)) / Math.max((v.t1 ?? 1) - (v.t0 || 0), .001)); const e = v.e === 'o' ? eo(k) : v.e === 'i' ? ei(k) : v.e === 'lin' ? k : eio(k); return lerp(v.a, v.b, e); } return v; }
function avAll(o, lt) { const r = {}; for (const k in o) r[k] = (k === 'c' || k === 'look' || k === 'hands') ? o[k] : av(o[k], lt); return r; }
function par(g, c, k, fn) { g.save(); g.translate((c.cam[0] - 540) * (1 - k), (c.cam[1] - 960) * (1 - k) * .6); fn(); g.restore(); }
const SKY = {
  sunset: { s: ['#2a1838', '#c8583a', '#ffc070'], sun: '#ffe2a0', m1: '#6a2e3e', m2: '#3e1a28', ground: ['#2a1418', '#140a0c'], dark: '#140a0c', rim: '#ffb060' },
  blood:  { s: ['#14060c', '#7a1414', '#ff6a2a'], sun: '#ffb070', m1: '#4a1018', m2: '#2a080e', ground: ['#1e0a0c', '#0a0406'], dark: '#0c0406', rim: '#ff7a3a' },
  gold:   { s: ['#4a3a6a', '#e89a50', '#fff0c0'], sun: '#fffbe0', m1: '#a8706a', m2: '#7a4a4a', ground: ['#c99a62', '#8a6038'], dark: '#2a1810', rim: '#fff2c0' },
  day:    { s: ['#7aa0c8', '#f0d0a0', '#fbe8c4'], sun: '#fffbe8', m1: '#b89080', m2: '#a07a62', ground: ['#d8b07a', '#b08050'], dark: '#2a1810', rim: '#fff6dc' },
  night:  { s: ['#060a1a', '#16204a', '#34385e'], sun: '#f4f0dc', m1: '#20264a', m2: '#141a34', ground: ['#121428', '#08080f'], dark: '#06060c', rim: '#a8c0ff', moon: true },
  storm:  { s: ['#0e0e18', '#3a3048', '#7a5a6a'], sun: null, m1: '#2a2232', m2: '#1a1420', ground: ['#1a1418', '#0a0808'], dark: '#08060a', rim: '#d8c8ff' },
};
function skyLayer(g, c, P, o) {
  const hz = o.horizon ?? 1250, T = c.T;
  par(g, c, .05, () => { g.fillStyle = lg(g, 0, -600, 0, hz + 40, [[0, P.s[0]], [.62, P.s[1]], [1, P.s[2]]]); g.fillRect(-1600, -1600, 4300, hz + 1700);
    if (P.moon || o.stars) { const r = rng(77); for (let i = 0; i < 200; i++) { const x = -800 + r() * 2700, y = -600 + r() * (hz + 200), s = .8 + r() * 2.6, tw = .4 + .6 * Math.sin(T * (1 + r() * 2) + i); ell(g, x, y, s, s, `rgba(255,250,235,${(tw * .85).toFixed(2)})`); } } });
  par(g, c, .1, () => { const sx = o.sunX ?? 540, sy = o.sunY ?? hz - 180, sr = o.sunR ?? 210;
    if (P.sun && o.sun !== false) { glow(g, sx, sy, sr * 5, P.sun, .55); ell(g, sx, sy, sr, sr, P.moon ? '#f2eedc' : hexA(P.sun.startsWith('#') ? P.sun : '#ffe2a0', .95)); if (P.moon) { ell(g, sx - sr * .3, sy - sr * .2, sr * .18, sr * .18, 'rgba(180,180,170,.35)'); ell(g, sx + sr * .25, sy + sr * .3, sr * .12, sr * .12, 'rgba(180,180,170,.35)'); } }
    if (o.rays) rays(g, sx, sy, 2200, 26, 'rgba(255,230,170,.5)', o.rays, T);
    if (o.clouds !== false) { const r = rng(5); for (let i = 0; i < 9; i++) { const x = ((r() * 2600 + T * (8 + r() * 10)) % 2600) - 800, y = hz - 350 - r() * 700, w = 260 + r() * 300; ell(g, x, y, w, 26 + r() * 20, hexA(P.m2, .35)); ell(g, x + 60, y - 14, w * .6, 18, hexA(P.s[2], .25)); } } });
  if (o.lightning) { const f = (T * 1.7) % 4.3; if (f < .12 || (f > .25 && f < .32)) { g.save(); g.globalAlpha = .55; g.fillStyle = '#e8e0ff'; g.fillRect(-1600, -1600, 4300, 4300); g.restore(); } }
  par(g, c, .25, () => hills(g, hz - 90, 70, P.m1, 3, -1600, 2700, 50));
  par(g, c, .45, () => hills(g, hz - 20, 50, P.m2, 4, -1600, 2700, 50));
}
function groundLayer(g, c, P, o) {
  const hz = o.horizon ?? 1250;
  g.fillStyle = lg(g, 0, hz, 0, 2400, [[0, P.ground[0]], [1, P.ground[1]]]); g.beginPath(); g.moveTo(-1600, 2800); for (let x = -1600; x <= 2700; x += 60) g.lineTo(x, hz + 10 + Math.sin(x * .003 + 1) * 18); g.lineTo(2700, 2800); g.closePath(); g.fill();
}
// --- props
function army(g, a, T, P) { const r = rng(a.seed || 3), n = a.n || 40, col = a.col || P.dark;
  for (let i = 0; i < n; i++) { const x = lerp(a.x0, a.x1, i / (n - 1)) + (r() - .5) * 30, y = a.y + (r() - .5) * 20, s = a.s * (0.9 + r() * .2), bob = Math.sin(T * 6 + i) * 3 * (a.march ? 1 : .2);
    g.save(); g.translate(x, y + bob); g.scale((a.flip ? -1 : 1) * s, s); g.fillStyle = col; g.strokeStyle = col;
    g.beginPath(); g.moveTo(-26, 0); g.lineTo(-20, -120); g.lineTo(20, -120); g.lineTo(26, 0); g.fill(); g.beginPath(); g.arc(0, -150, 24, 0, Math.PI * 2); g.fill();
    g.lineWidth = 6; g.beginPath(); g.moveTo(30, 20); g.lineTo(34 + Math.sin(i) * 8, -300); g.stroke(); g.beginPath(); g.moveTo(26 + Math.sin(i) * 8, -300); g.lineTo(34 + Math.sin(i) * 8, -340); g.lineTo(42 + Math.sin(i) * 8, -300); g.fill();
    if (a.feather) for (let f = -3; f <= 3; f++) { g.save(); g.translate(0, -168); g.rotate(f * .16); g.fillRect(-3, -50, 6, 50); g.restore(); }
    if (a.shields) { g.beginPath(); g.arc(-18, -70, 34, 0, Math.PI * 2); g.fill(); }
    g.restore(); } }
function banner(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); limb(g, [0, 0, 0, -520], 10, '#4a2c1c', 4); const w = Math.sin(T * 3 + (a.ph || 0)); sh(g, `M4 -510 C80 ${-530 + w * 20} 160 ${-490 - w * 20} 230 ${-505 + w * 14} L230 ${-385 + w * 14} C160 ${-370 - w * 20} 80 ${-410 + w * 20} 4 -390 Z`, a.col || '#a8342a', 5); if (a.sym) ell(g, 110, -450 + w * 4, 26, 26, '#e0b648', 4); g.restore(); }
function stoneFly(g, a, lt) { const k = clamp((lt - a.t0) / (a.t1 - a.t0)); if (k <= 0 || k >= 1.0001 && !a.hold) return; const x = lerp(a.x0, a.x1, k), y = lerp(a.y0, a.y1, k) - Math.sin(k * Math.PI) * (a.arc || 0);
  for (let i = 1; i < 14; i++) { const kk = Math.max(0, k - i * .012); ell(g, lerp(a.x0, a.x1, kk), lerp(a.y0, a.y1, kk) - Math.sin(kk * Math.PI) * (a.arc || 0), (a.r || 22) * (1 - i / 16), (a.r || 22) * (1 - i / 16), `rgba(255,240,200,${(.35 * (1 - i / 14)).toFixed(2)})`); }
  g.save(); g.translate(x, y); g.rotate(lt * 20); ell(g, 0, 0, a.r || 22, (a.r || 22) * .85, lg(g, -20, -20, 20, 20, [[0, '#d8d0c4'], [1, '#6a625a']]), 5); g.restore(); }
function burst(g, a, lt, T) { const q = (lt - a.t0) / (a.d || .7); if (q < 0 || q > 1) return; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, a.x, a.y, (a.r || 300) * (0.6 + q), 'rgba(255,240,200,1)', (1 - q) * 1.2); g.restore();
  g.save(); g.globalAlpha = 1 - q; for (let i = 0; i < 14; i++) { const an = i / 14 * Math.PI * 2 + .2, r0 = (a.r || 300) * (.15 + q * .5), r1 = (a.r || 300) * (.4 + q * .9); line(g, [a.x + Math.cos(an) * r0, a.y + Math.sin(an) * r0, a.x + Math.cos(an) * r1, a.y + Math.sin(an) * r1], 10 * (1 - q) + 2, '#fff6dc'); }
  g.beginPath(); g.arc(a.x, a.y, (a.r || 300) * (.2 + q * 1.2), 0, Math.PI * 2); g.lineWidth = 14 * (1 - q); g.strokeStyle = '#fff2d0'; g.stroke(); g.restore(); }
function dustBurst(g, a, lt) { const q = (lt - a.t0) / (a.d || 1.6); if (q < 0 || q > 1) return; const r = rng(a.seed || 9); for (let i = 0; i < 26; i++) { const an = -Math.PI * (r()), sp = 200 + r() * 500, x = a.x + Math.cos(an) * sp * eo(q) * (a.s || 1), y = a.y + Math.sin(an) * sp * .35 * eo(q) * (a.s || 1), rr = (60 + r() * 90) * (0.4 + q) * (a.s || 1); ell(g, x, y, rr, rr * .7, hexA(a.col || '#c8a07a', .55 * (1 - q))); } }
function lamp(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const fl = 1 + .08 * Math.sin(T * 13) + .05 * Math.sin(T * 7.3);
  glow(g, 60, -70, 520 * fl, 'rgba(255,180,80,1)', .75 * (a.glow ?? 1)); sh(g, 'M-90 0 C-100 -50 -40 -70 30 -64 L100 -70 C130 -60 130 -40 110 -30 C80 -4 -20 14 -90 0 Z', lg(g, 0, -70, 0, 10, [[0, '#c98a5a'], [1, '#7a4a2a']]), 6); ell(g, -10, -56, 34, 10, '#3a2214', 4);
  g.save(); g.translate(112, -64); g.scale(fl, fl); sh(g, 'M-16 0 Q-22 -40 0 -96 Q22 -40 16 0 Z', 'rgba(255,170,60,.95)'); sh(g, 'M-9 0 Q-12 -26 0 -66 Q12 -26 9 0 Z', 'rgba(255,240,180,1)'); g.restore(); g.restore(); }
function gate(g, a, P) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const col = a.col || '#b08a64';
  sh(g, 'M-900 0 L-900 -380 L900 -380 L900 0 Z', col, 6); for (let x = -880; x < 900; x += 70) sh(g, `M${x} -380 l40 0 l0 -40 l-40 0 Z`, col, 5);
  [-300, 300].forEach(x => { sh(g, `M${x - 120} 0 L${x - 120} -620 L${x + 120} -620 L${x + 120} 0 Z`, mix(col, '#000', .1), 6); for (let i = 0; i < 4; i++) sh(g, `M${x - 120 + i * 70} -620 l40 0 l0 -40 l-40 0 Z`, mix(col, '#000', .1), 5); sh(g, `M${x - 16} -480 l32 0 l0 70 l-32 0 Z`, '#1a0e08'); });
  sh(g, 'M-170 0 L-170 -300 Q0 -420 170 -300 L170 0 Z', '#2a1810', 6); for (let y = -300; y < 0; y += 60) line(g, [-170, y, 170, y], 5, '#5a3a20'); g.restore(); }
function balanceScale(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const tilt = Math.sin(lt * 2.2) * .04 * Math.exp(-lt * .6);
  sh(g, 'M-30 0 L30 0 L14 -620 L-14 -620 Z', lg(g, -30, 0, 30, 0, [[0, '#f2c86a'], [1, '#8a5a1e']]), 6); sh(g, 'M-160 20 L160 20 L130 0 L-130 0 Z', '#8a5a1e', 6);
  g.save(); g.translate(0, -620); g.rotate(tilt); limb(g, [-420, 0, 420, 0], 18, '#e0b648', 6); ell(g, 0, 0, 30, 30, '#f2c86a', 6);
  [-1, 1].forEach(sd => { g.save(); g.translate(sd * 400, 0); g.rotate(-tilt); line(g, [0, 0, -120, 330], 4, '#8a6a2a'); line(g, [0, 0, 120, 330], 4, '#8a6a2a'); sh(g, 'M-170 330 Q0 400 170 330 Z', lg(g, -170, 0, 170, 0, [[0, '#f2c86a'], [1, '#8a5a1e']]), 6);
    if (sd < 0) { sh(g, 'M-60 330 L0 150 L60 330 Z', lg(g, -60, 0, 60, 0, [[0, '#e8c070'], [.5, '#fff0b8'], [1, '#8a5a1e']]), 6); line(g, [0, 170, 0, 320], 4, 'rgba(90,50,10,.6)'); sh(g, 'M-26 330 L26 330 L22 350 L-22 350 Z', '#6a4a2a', 4); }
    else { ell(g, 0, 300, 110, 52, '#f1e6d2', 6, -.05); line(g, [-90, 290, 80, 280], 4, 'rgba(150,120,90,.5)'); ell(g, 80, 266, 40, 38, '#e8b48a', 5); line(g, [64, 262, 74, 266], 4); line(g, [84, 262, 94, 266], 4); ell(g, 80, 282, 5, 3, '#c0605a'); sh(g, 'M48 240 Q80 210 112 244', null, 6); }
    g.restore(); });
  g.restore(); g.restore(); }
function speedLines(g, x, y, n, a, T, col = 'rgba(255,248,230,') { const r = rng(Math.floor(T * 12)); g.save(); for (let i = 0; i < n; i++) { const an = r() * Math.PI * 2, r0 = 380 + r() * 300, r1 = r0 + 300 + r() * 700; g.globalAlpha = a * (.4 + r() * .6); line(g, [x + Math.cos(an) * r0, y + Math.sin(an) * r0, x + Math.cos(an) * r1, y + Math.sin(an) * r1], 3 + r() * 8, col + '1)'); } g.restore(); }
function embers(g, T, n, seed, area = [-300, 0, 1700, 1920]) { const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = area[0] + ((r() * area[2] + Math.sin(T + i) * 40 + T * 20) % area[2]), y = area[1] + (((r() * area[3]) - T * (40 + r() * 80)) % area[3] + area[3]) % area[3], s = 2 + r() * 4; ell(g, x, y, s, s, `rgba(255,${150 + Math.floor(r() * 80)},80,${(.5 + .4 * Math.sin(T * 5 + i)).toFixed(2)})`); } g.restore(); }
// draw a figure as a dark silhouette with a light rim on one side
function rimSil(g, idx, dark, rim, rdx, fn) { const offs = rdx === 0 ? [[-7, -4], [7, -4]] : [[rdx, -Math.abs(rdx) * .4]]; offs.forEach(([dx, dy]) => silhouette(g, idx, rim, x => { x.translate(dx, dy); fn(x); })); silhouette(g, idx, dark, fn); }
function drawActor(g, a, c, P, o) {
  const T = c.T, lt = c.lt, A = avAll(a, lt);
  const fig = x => { if (A.type === 'w') warrior(x, Object.assign({}, A, { t: T + (A.ph || 0), talk: A.who ? c.V(A.who) : 0 }));
    else if (A.type === 'toby') toby(x, Object.assign({}, A, { t: T, talk: c.V('toby') })); else if (A.type === 'donkey') donkey(x, Object.assign({}, A, { t: T, talk: c.V('selah') })); };
  if (A.type === 'w' || A.type === 'toby' || A.type === 'donkey') { if (A.alpha != null && A.alpha <= 0) return; g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha;
    if (A.sil) rimSil(g, 1, A.silCol || P.dark, A.rimCol || P.rim, (A.rim ?? -8) * Math.max(1, (A.s || 1) * .8), fig); else fig(g); g.restore(); return; }
  if (A.type === 'army') army(g, A, T, P); else if (A.type === 'banner') banner(g, A, T); else if (A.type === 'stone') stoneFly(g, A, lt); else if (A.type === 'burst') burst(g, A, lt, T);
  else if (A.type === 'dust') dustBurst(g, A, lt); else if (A.type === 'lamp') lamp(g, A, T); else if (A.type === 'gate') gate(g, A, P); else if (A.type === 'scale') balanceScale(g, A, lt, T);
  else if (A.type === 'hand') bigHand(g, Object.assign({}, A, { t: T })); else if (A.type === 'foot') bigFoot(g, Object.assign({}, A, { t: T })); else if (A.type === 'fire') fire(g, A.x, A.y, A.s || 1, T); else if (A.type === 'tent') tent(g, A.x, A.y, A.s || 1, A.col || '#d8c09a', A.dark || '#a88a68');
  else if (A.type === 'speed') speedLines(g, A.x ?? 540, A.y ?? 960, A.n || 40, A.a ?? .6, T); else if (A.type === 'rays') rays(g, A.x, A.y, A.r || 1800, 24, 'rgba(255,230,170,.6)', A.a ?? .5, T);
  else if (A.type === 'glow') glow(g, A.x, A.y, A.r || 400, A.col || 'rgba(255,220,150,1)', A.a ?? .6);
  else if (A.type === 'rock') rock(g, A.x, A.y, A.w || 120, A.h || 80, A.col || '#7a5a44');
}
SC.stage = (g, o, c) => {
  o = avAll(o, c.lt);
  const P = Object.assign({}, SKY[o.sky || 'sunset'], o.pal || {}), lt = c.lt;
  skyLayer(g, c, P, o);
  for (const a of (o.far || [])) par(g, c, a.par ?? .6, () => drawActor(g, a, c, P, o));
  groundLayer(g, c, P, o);
  for (const a of (o.actors || [])) { if (a.par != null && a.par !== 1) par(g, c, a.par, () => drawActor(g, a, c, P, o)); else drawActor(g, a, c, P, o); }
  if (o.embers) embers(g, c.T, o.embers, 3);
  dust(g, c.T, o.dustN ?? 24, 21, o.sky === 'night' ? 'rgba(200,210,255,' : 'rgba(255,230,190,');
};
// ---------------- present day: the Valley of Elah, a brook full of smooth stones ----------------
SC.elah = (g, o, c) => {
  const T = c.T, late = o.late ? 1 : 0, P = { s: [mix('#5a4a7a', '#2a2050', late), mix('#e8905a', '#c0583a', late), mix('#ffd8a0', '#f0a070', late)] };
  par(g, c, .05, () => { g.fillStyle = lg(g, 0, -600, 0, 1000, [[0, P.s[0]], [.6, P.s[1]], [1, P.s[2]]]); g.fillRect(-1600, -1600, 4300, 2700); });
  par(g, c, .1, () => { sun(g, 780, 840 + late * 60, 90, mix('#ffe0a8', '#ffb070', late)); birds(g, T, 100, 300, 7, 4); });
  par(g, c, .25, () => { hills(g, 860, 80, mix('#9a6a7a', '#6a4060', late), 11, -1600, 2700); });
  par(g, c, .45, () => { hills(g, 940, 50, mix('#a8805a', '#7a5048', late), 12, -1600, 2700); olive(g, -200, 960, .6); olive(g, 1350, 950, .7); });
  g.fillStyle = lg(g, 0, 960, 0, 2000, [[0, mix('#b8a060', '#8a7048', late)], [1, mix('#8a7040', '#5a4430', late)]]); g.fillRect(-1600, 960, 4300, 1600);
  // the terebinth (elah) tree
  par(g, c, .8, () => { g.save(); g.translate(-60, 1300); g.scale(1.6, 1.6); limb(g, [0, 0, -20, -140, 30, -280], 36, '#5b4330', 6); limb(g, [10, -200, 90, -260, 140, -300], 18, '#5b4330', 5); [[-90, -320, 110, 70], [70, -340, 120, 76], [-10, -400, 130, 80], [150, -300, 80, 50], [-150, -260, 70, 46]].forEach(([a, b2, rx, ry]) => ell(g, a, b2, rx, ry, mix('#5a6a3a', '#3a4430', late), 6)); [[-70, -330, 80, 46], [60, -350, 86, 50], [-10, -410, 90, 50]].forEach(([a, b2, rx, ry]) => ell(g, a, b2, rx, ry, mix('#7a8a48', '#5a6a40', late))); g.restore(); });
  // brook
  const bw = (y) => 160 + (y - 1100) * .35;
  g.beginPath(); for (let y = 1100; y <= 2300; y += 40) g.lineTo(560 + Math.sin(y * .006) * 160 - bw(y), y); for (let y = 2300; y >= 1100; y -= 40) g.lineTo(560 + Math.sin(y * .006) * 160 + bw(y), y); g.closePath();
  g.fillStyle = lg(g, 0, 1100, 0, 2000, [[0, mix('#9ac0c8', '#7a8aa8', late)], [1, mix('#5a8a9a', '#3a5070', late)]]); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  for (let i = 0; i < 18; i++) { const y = 1140 + ((i * 70 + T * 40) % 900), x = 560 + Math.sin(y * .006) * 160 + Math.sin(i * 3.1) * bw(y) * .7; line(g, [x - 30, y, x + 30, y], 4, 'rgba(255,255,255,.45)'); }
  const r = rng(8); for (let i = 0; i < 46; i++) { const y = 1120 + r() * 880, x = 560 + Math.sin(y * .006) * 160 + (r() - .5) * 2 * bw(y) * .95, s = .4 + (y - 1100) / 900; ell(g, x, y, 22 * s, 15 * s, ['#d8d0c4', '#bfb6aa', '#a8a094', '#e6ded2'][i % 4], 3 * s); ell(g, x - 6 * s, y - 5 * s, 7 * s, 4 * s, 'rgba(255,255,255,.6)'); }
  grass(g, 120, 1800, 1.5); grass(g, 980, 1850, 1.6); rock(g, 940, 1720, 90, 60, '#8a6a52'); rock(g, 110, 1640, 70, 50, '#8a6a52');
  // cast
  const sel = { x: o.selahX ?? 780, y: o.selahY ?? 1560, s: o.selahS ?? 1.0, flip: o.selahFlip ?? true, t: T, pose: o.selahPose || 'stand', expr: o.selahExpr || 'calm', talk: c.V('selah'), look: o.selahLook || [.4, 0], ph: 1, walk: o.walk, headRot: o.selahHead || 0 };
  const tob = { x: o.tobyX ?? 300, y: o.tobyY ?? 1660, s: o.tobyS ?? 1.0, t: T, expr: o.tobyExpr || 'neutral', hands: o.tobyHands || 'down', talk: c.V('toby'), look: o.tobyLook || [.5, 0], hop: o.tobyHop || 0, sling: o.tobySling, flip: o.tobyFlip, noLegs: o.tobyRide, tilt: o.tobyTilt || 0 };
  if (o.ride) { const k = o.rideMove ? c.lt * o.rideMove : 0; sel.x -= k; tob.x -= k; sel.walk = !!o.rideMove; donkey(g, sel); toby(g, tob); }
  else if (o.tobyFront) { donkey(g, sel); toby(g, tob); } else { toby(g, tob); donkey(g, sel); }
  if (o.stoneFly) stoneFly(g, o.stoneFly, c.lt);
  dust(g, T, 30, 31);
};
