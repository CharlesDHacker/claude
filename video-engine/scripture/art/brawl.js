// BOOK BRAWL: an original boxing-arena set and two original book mascots (a loud full-colour comic book and a
// doodled spiral notebook), plus the props for each round. No characters from either series are drawn.
function txt(g, s, x, y, size, fill, stroke = '#141018', font = 'Nunito', weight = 900, rot = 0, lw) {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  if (stroke) { g.lineWidth = lw ?? size * .2; g.strokeStyle = stroke; g.strokeText(s, 0, 0); } g.fillStyle = fill; g.fillText(s, 0, 0); g.restore(); }
function ftxt(g, F, s, x, y, ...r) { g.save(); g.scale(F, 1); txt(g, s, x * F, y, ...r); g.restore(); }
const boil = (T, seed, amp = 2.2) => { const f = Math.floor(T * 8); return (i) => (Math.sin(f * 12.9898 + seed * 78.233 + i * 37.719) * 43758.5453 % 1) * amp; };
function wob(g, pts, lw, col, T, seed) { const j = boil(T, seed); const p = pts.map((v, i) => v + j(i)); line(g, p, lw, col, 'round', true); }
function glove(g, x, y, r, col, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot);
  sh(g, `M${-r * .9} ${r * .2} C${-r * 1.1} ${-r * .9} ${r * .2} ${-r * 1.2} ${r * .9} ${-r * .5} C${r * 1.2} ${0} ${r * .9} ${r * .8} ${r * .1} ${r * .9} L${-r * .7} ${r * .8} Z`, lg(g, -r, -r, r, r, [[0, mix(col, '#fff', .35)], [.5, col], [1, mix(col, '#000', .35)]]), 5);
  sh(g, `M${-r * .8} ${r * .7} L${r * .2} ${r * .8} L${r * .15} ${r * 1.25} L${-r * .8} ${r * 1.2} Z`, '#f4f0e8', 4); ell(g, -r * .2, -r * .35, r * .28, r * .16, 'rgba(255,255,255,.55)', 0, -.5); g.restore(); }

// ---------- the arena ----------
SC.ring = (g, o, c) => {
  o = avAll(o, c.lt); const T = c.T, lt = c.lt;
  par(g, c, .1, () => { g.fillStyle = lg(g, 0, -600, 0, 1600, [[0, o.top || '#0c0816'], [.6, o.mid || '#241634'], [1, '#3a2040']]); g.fillRect(-1600, -1600, 4300, 4300);
    // jumbotron
    g.save(); g.translate(540, 130); g.scale(.7, .7); sh(g, 'M-330 -150 L330 -150 L330 150 L-330 150 Z', '#0e0a14', 8, '#3a2a48'); sh(g, 'M-300 -122 L300 -122 L300 122 L-300 122 Z', lg(g, 0, -122, 0, 122, [[0, '#2a1a4a'], [1, '#14102a']]));
    for (let i = 0; i < 6; i++) { const on = (Math.floor(T * 4) + i) % 3 === 0; sh(g, `M${-270 + i * 92} -90 L${-200 + i * 92} -90 L${-200 + i * 92} 90 L${-270 + i * 92} 90 Z`, on ? 'rgba(255,190,60,.55)' : 'rgba(120,90,200,.25)'); }
    line(g, [0, 150, 0, -700], 10, '#1a1424', 'round', true); g.restore(); });
  // crowd: rows of heads with phone/camera flashes
  par(g, c, .35, () => { const r = rng(17);
    for (let row = 0; row < 4; row++) { const y = 860 + row * 90, s = .8 + row * .18;
      for (let i = 0; i < 22; i++) { const x = -260 + i * 76 + (row % 2) * 38 + (r() - .5) * 20, bob = Math.sin(T * (5 + r() * 3) + i) * (o.hype ?? 1) * 8 * s;
        ell(g, x, y + bob, 30 * s, 34 * s, row > 1 ? '#1e1428' : '#16101e'); ell(g, x, y + 60 * s + bob, 46 * s, 40 * s, row > 1 ? '#1e1428' : '#16101e');
        if (r() > .82 && ((T * 1.7 + i * .37 + row) % 2.2) < .07) glow(g, x + 20, y - 10, 90, 'rgba(255,255,255,1)', .9); } } });
  // spotlights
  g.save(); g.globalCompositeOperation = 'lighter';
  (o.spots || [[260, 'rgba(255,190,90,'], [820, 'rgba(120,170,255,']]).forEach(([x, col], i) => { const sw = Math.sin(T * .7 + i * 2) * 60;
    g.fillStyle = lg(g, 0, -200, 0, 1800, [[0, col + '.35)'], [1, col + '0)']]); g.beginPath(); g.moveTo(x + sw - 40, -200); g.lineTo(x + sw + 40, -200); g.lineTo(x + 330, 1800); g.lineTo(x - 330, 1800); g.closePath(); g.fill(); });
  g.restore();
  // ring: posts, back ropes, mat
  const mat = 'M-300 1320 L1380 1320 L1700 2100 L-620 2100 Z';
  sh(g, mat, lg(g, 0, 1320, 0, 2100, [[0, '#4a6a9a'], [1, '#2a3a62']]), 0);
  g.save(); g.clip(path(mat)); ell(g, 540, 1650, 330, 120, 'rgba(255,255,255,.08)'); txt(g, 'BOOK BRAWL', 540, 1650, 70, 'rgba(255,255,255,.12)', null); g.restore();
  sh(g, 'M-620 2100 L1700 2100 L1700 2200 L-620 2200 Z', '#a8231a');
  [[-160, '#c8302a'], [1240, '#2a5ac8']].forEach(([x, col]) => { sh(g, `M${x - 22} 1340 L${x + 22} 1340 L${x + 22} 1020 L${x - 22} 1020 Z`, lg(g, x - 22, 0, x + 22, 0, [[0, mix(col, '#fff', .3)], [1, mix(col, '#000', .3)]]), 5); });
  [1080, 1160, 1240].forEach((y, i) => line(g, [-160, y, 1240, y], 9, ['#e8e0d0', '#c8302a', '#2a5ac8'][i], 'round', true));
  for (const a of (o.actors || [])) { if (a.par != null && a.par !== 1) par(g, c, a.par, () => drawActor(g, a, c, {}, o)); else drawActor(g, a, c, {}, o); }
  if (o.front) { [1500, 1590].forEach((y, i) => { line(g, [-300, y + 40, 1380, y + 40], 16, 'rgba(0,0,0,.35)', 'round', true); line(g, [-300, y, 1380, y], 15, i ? '#2a5ac8' : '#c8302a', 'round', true); }); }
  if (o.confetti) confetti(g, lt, o.confetti);
};
function confetti(g, lt, n) { const r = rng(23), cols = ['#ffd23a', '#ff4a6a', '#3ad2ff', '#7aff6a', '#ffffff', '#ff9a1a'];
  for (let i = 0; i < n; i++) { const x0 = r() * 1300 - 110, sp = 220 + r() * 260, y = -100 + ((lt * sp + r() * 2400) % 2200), x = x0 + Math.sin(lt * 2 + i) * 50;
    g.save(); g.translate(x, y); g.rotate(lt * (2 + r() * 4) + i); g.fillStyle = cols[i % cols.length]; g.fillRect(-9, -5, 18, 10 * Math.abs(Math.cos(lt * 5 + i))); g.restore(); } }

// ---------- mascot 1: the comic book (loud, full colour, halftone) ----------
function comicBook(g, a, T) {
  const ex = a.expr || 'grin', pose = a.pose || 'guard', hop = (a.hop ?? 1) * Math.abs(Math.sin(T * 5.2 + (a.ph || 0))) * 16;
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  g.fillStyle = rg(g, 0, 0, 10, 220, [[0, 'rgba(0,0,0,.4)'], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.ellipse(0, 4, 220, 26, 0, 0, 7); g.fill();
  g.translate(0, -hop); const W = 170, top = -600, bot = -150;
  // legs + sneakers
  [[-70, -1], [70, 1]].forEach(([x, d], i) => { const k = Math.sin(T * 5.2 + i * Math.PI) * 10 * (a.hop ?? 1); limb(g, [x, bot, x + d * 20 + k, -70, x + d * 30, -22], 22, '#1a1420', 4);
    sh(g, `M${x + d * 30 - 44} -40 Q${x + d * 30 + 10} -66 ${x + d * 30 + 56} -24 L${x + d * 30 + 56} 4 L${x + d * 30 - 48} 4 Z`, '#e83a2a', 5); line(g, [x + d * 30 - 48, -6, x + d * 30 + 56, -6], 6, '#fff', 'round', true); });
  // back arm
  const arm = (side, gx, gy) => { const sx = side * W, sy = -400; limb(g, [sx, sy, (sx + gx) / 2 + side * 30, (sy + gy) / 2 + 30, gx, gy], 20, '#1a1420', 4); glove(g, gx, gy, 54, '#e83a2a', side > 0 ? .3 : -.3); };
  const G = { guard: [[-120, -500], [140, -520]], punch: [[-130, -470], [420, -470]], flex: [[-260, -700], [260, -700]], champ: [[-200, -760], [200, -760]], tired: [[-200, -260], [200, -260]], point: [[-150, -330], [330, -620]] }[pose] || [[-120, -500], [140, -520]];
  const jab = pose === 'guard' ? Math.sin(T * 5.2) * 14 : 0;
  // book body: page block side + cover
  sh(g, `M${W} ${top} L${W + 46} ${top + 24} L${W + 46} ${bot + 20} L${W} ${bot} Z`, lg(g, W, 0, W + 46, 0, [[0, '#fff6e0'], [1, '#d8c8a8']]), 5);
  for (let i = 1; i < 6; i++) line(g, [W + i * 7.6, top + 4 + i * 4, W + i * 7.6, bot + i * 3.4], 1.4, 'rgba(120,90,50,.45)', 'round', true);
  const cover = `M${-W} ${top} L${W} ${top} L${W} ${bot} L${-W} ${bot} Z`;
  sh(g, cover, lg(g, -W, top, W, bot, [[0, '#ffe04a'], [1, '#ff9a1a']]), 6);
  g.save(); g.clip(path(cover)); g.fillStyle = 'rgba(255,90,40,.22)'; for (let y = top; y < bot; y += 22) for (let x = -W + ((y / 22) % 2) * 11; x < W; x += 22) { g.beginPath(); g.arc(x, y, 4.4, 0, 7); g.fill(); }
  // title band
  sh(g, `M${-W} ${top} L${W} ${top} L${W} ${top + 110} L${-W} ${top + 96} Z`, '#e8302a', 0); ftxt(g, a.flip ? -1 : 1, 'BIG NATE', 0, top + 54, 74, '#fff', '#141018', 'Nunito', 900, -.03, 14);
  // two little panels at the bottom
  sh(g, `M${-W + 18} ${bot - 120} L${-14} ${bot - 120} L${-14} ${bot - 16} L${-W + 18} ${bot - 16} Z`, '#3ad2ff', 4); ftxt(g, a.flip ? -1 : 1, 'POW!', -W / 2 - 2, bot - 68, 40, '#fff', '#e8302a', 'Nunito', 900, -.15, 8);
  sh(g, `M${14} ${bot - 120} L${W - 18} ${bot - 120} L${W - 18} ${bot - 16} L${14} ${bot - 16} Z`, '#ff5ab4', 4); ell(g, W / 2 + 2, bot - 74, 52, 30, '#fff', 3.4); ftxt(g, a.flip ? -1 : 1, 'HA!', W / 2 + 2, bot - 74, 34, '#141018', null);
  g.restore(); sh(g, cover, null, 6);
  // face
  const look = a.look || [0, 0], fy = top + 230; const eye = (x) => { ell(g, x, fy, 40, ex === 'shock' ? 50 : 44, '#fff', 5); ell(g, x + look[0] * 12, fy + 6 + look[1] * 10, 17, 19, '#141018'); ell(g, x + look[0] * 12 + 6, fy - 2 + look[1] * 10, 6, 6, '#fff'); };
  if (ex === 'laugh') { [-62, 62].forEach(x => line(g, [x - 30, fy + 8, x, fy - 20, x + 30, fy + 8], 9, '#141018', 'round', true)); } else { eye(-62); eye(62); }
  const brow = { grin: [-14, 0], smug: [-6, 12], laugh: [-16, 0], shock: [-30, -10], tired: [8, -8], fierce: [10, 22] }[ex] || [-14, 0];
  [-1, 1].forEach(s => line(g, [s * 100, fy - 62 + brow[0] * (s > 0 ? 1 : 1) - (s > 0 ? brow[1] : 0), s * 26, fy - 60 + brow[1] * (s > 0 ? 0 : 0)], 12, '#141018', 'round', true));
  const my = fy + 110;
  if (ex === 'laugh' || ex === 'shock' || (a.talkT && Math.sin(T * 22) > 0)) { sh(g, `M-80 ${my - 20} Q0 ${my - 30} 80 ${my - 20} Q60 ${my + 70} 0 ${my + 72} Q-60 ${my + 70} -80 ${my - 20} Z`, '#5a1220', 5); sh(g, `M-66 ${my - 18} L66 ${my - 18} L60 ${my + 2} L-60 ${my + 2} Z`, '#fff'); ell(g, 0, my + 46, 34, 16, '#ff6a7a'); }
  else if (ex === 'smug') { line(g, [-60, my, 10, my + 12, 74, my - 22], 10, '#141018', 'round', true); }
  else { sh(g, `M-84 ${my - 18} Q0 ${my - 4} 84 ${my - 18} Q70 ${my + 50} 0 ${my + 54} Q-70 ${my + 50} -84 ${my - 18} Z`, '#5a1220', 5); sh(g, `M-74 ${my - 12} Q0 ${my} 74 ${my - 12} L68 ${my + 6} Q0 ${my + 16} -68 ${my + 6} Z`, '#fff'); }
  // arms on top
  arm(-1, G[0][0], G[0][1] + jab); arm(1, G[1][0], G[1][1] - jab);
  if (pose === 'champ') belt(g, 0, -760, 1.1, T);
  g.restore();
}
function belt(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s);
  sh(g, 'M-230 -30 Q0 -50 230 -30 L230 30 Q0 50 -230 30 Z', '#2a1a14', 5); ell(g, 0, 0, 96, 78, lg(g, -90, -70, 90, 70, [[0, '#fff2a8'], [.5, '#f0b828'], [1, '#a86a10']]), 6);
  ell(g, 0, 0, 64, 50, lg(g, -60, -50, 60, 50, [[0, '#ffe080'], [1, '#c88a18']]), 4); txt(g, '#1', 0, 2, 54, '#fff', '#8a4a08', 'Nunito', 900, 0, 8);
  [-150, 150].forEach(px => ell(g, px, 0, 34, 28, '#f0c040', 4)); glow(g, 0, 0, 260, 'rgba(255,220,120,1)', .4 + .2 * Math.sin(T * 6)); g.restore(); }

// ---------- mascot 2: the spiral notebook (pen doodles on lined paper, everything boils) ----------
function notebook(g, a, T) {
  const ex = a.expr || 'smug', pose = a.pose || 'guard', ko = pose === 'ko', hop = ko ? 0 : (a.hop ?? 1) * Math.abs(Math.sin(T * 4.6 + 1 + (a.ph || 0))) * 12;
  const INKB = '#1c2a5a';
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  g.fillStyle = rg(g, 0, 0, 10, 220, [[0, 'rgba(0,0,0,.4)'], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.ellipse(0, 4, 230, 26, 0, 0, 7); g.fill();
  if (ko) { g.translate(0, -60); g.rotate(-1.45); g.translate(0, 300); }
  g.translate(0, -hop); const W = 160, top = -590, bot = -150, j = boil(T, 3, 3);
  // stick legs
  if (!ko) [[-60, -1], [60, 1]].forEach(([x, d], i) => { wob(g, [x, bot, x + d * 14, -76, x + d * 24, -10], 7, INKB, T, i + 9); wob(g, [x + d * 24 - 30, -10, x + d * 24 + 34, -6], 7, INKB, T, i + 19); });
  const G = { guard: [[-140, -470], [150, -480]], punch: [[-150, -470], [380, -470]], whine: [[-230, -650], [230, -650]], shrug: [[-250, -420], [250, -420]], ko: [[-240, -300], [240, -300]], point: [[-160, -360], [300, -560]] }[pose] || [[-140, -470], [150, -480]];
  const jab = pose === 'guard' ? Math.sin(T * 4.6) * 12 : pose === 'whine' ? Math.sin(T * 14) * 18 : 0;
  // page
  const pg = `M${-W + j(1)} ${top + j(2)} L${W + j(3)} ${top + j(4)} L${W + j(5)} ${bot - 40} L${W - 40} ${bot + j(6)} L${-W + j(7)} ${bot + j(8)} Z`;
  sh(g, pg, lg(g, 0, top, 0, bot, [[0, '#fffdf4'], [1, '#efe8d4']]), 5, INKB);
  g.save(); g.clip(path(pg)); for (let y = top + 140; y < bot; y += 34) line(g, [-W, y, W, y], 2.4, 'rgba(90,150,220,.55)', 'round', true); line(g, [-W + 56, top, -W + 56, bot], 3, 'rgba(230,80,90,.6)', 'round', true); g.restore();
  sh(g, `M${W} ${bot - 40} L${W - 40} ${bot} L${W - 36} ${bot - 36} Z`, '#d8d0bc', 3, INKB);
  // spiral wire
  for (let i = 0; i < 12; i++) { const y = top + 26 + i * 37; g.beginPath(); g.ellipse(-W - 4, y, 20, 11, -.3, Math.PI * .3, Math.PI * 1.8); g.lineWidth = 6; g.strokeStyle = '#8a8a96'; g.stroke(); ell(g, -W + 18, y + 4, 5, 5, '#2a2a34'); }
  // scrawled title
  const tt = ['DIARY OF A', 'WIMPY KID']; tt.forEach((s, i) => ftxt(g, a.flip ? -1 : 1, s, 10 + j(10 + i), top + 46 + i * 54, i ? 54 : 40, INKB, null, 'Nunito', 800, -.04 + i * .02));
  // doodled face
  const fy = top + 250, look = a.look || [0, 0];
  if (ex === 'dizzy') [-58, 58].forEach((x, i) => { g.save(); g.translate(x, fy); g.rotate(T * 6 * (i ? 1 : -1)); g.beginPath(); for (let k = 0; k < 40; k++) { const r = k * .9, an = k * .5; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.lineWidth = 5; g.strokeStyle = INKB; g.stroke(); g.restore(); });
  else [-58, 58].forEach((x, i) => { const r = ex === 'shock' ? 30 : 24; g.beginPath(); g.ellipse(x + j(20 + i), fy + j(22 + i), r, r * 1.1, 0, 0, 7); g.lineWidth = 5; g.strokeStyle = INKB; g.stroke(); ell(g, x + look[0] * 8, fy + 3 + look[1] * 8, 7, 8, INKB);
    if (ex === 'smug') line(g, [x - 28, fy - 6, x + 28, fy - 8], 6, INKB, 'round', true);
    if (ex === 'whine' || ex === 'sad') { const k = (T * .8 + i * .5) % 1; ell(g, x + 14, fy + 34 + k * 60, 7, 11, 'rgba(110,170,240,.9)', 2, 0, INKB); } });
  const bro = { smug: [6, -10], whine: [-14, 14], shock: [-22, -22], sad: [-14, 14], dizzy: [0, 0], mad: [14, -14] }[ex] || [0, 0];
  if (ex !== 'dizzy') { wob(g, [-90, fy - 52 + bro[0], -28, fy - 52 + bro[1]], 6, INKB, T, 31); wob(g, [28, fy - 52 + bro[1], 90, fy - 52 + bro[0]], 6, INKB, T, 32); }
  const my = fy + 100;
  if (ex === 'shock' || ex === 'dizzy') { g.beginPath(); g.ellipse(0, my, 26, 34, 0, 0, 7); g.lineWidth = 5; g.strokeStyle = INKB; g.stroke(); }
  else if (ex === 'smug') wob(g, [-50, my, 0, my + 10, 56, my - 18], 6, INKB, T, 41);
  else if (ex === 'whine' || ex === 'sad') { const w = Math.sin(T * 20) * 6; wob(g, [-56, my + 10, -28, my - 6 + w, 0, my + 10, 28, my - 6 - w, 56, my + 10], 6, INKB, T, 42); }
  else wob(g, [-50, my, 0, my + 6, 50, my], 6, INKB, T, 43);
  if (a.goggles) { g.save(); g.globalAlpha = .9; [-58, 58].forEach(x => { sh(g, `M${x} ${fy + 30} C${x - 60} ${fy - 10} ${x - 40} ${fy - 60} ${x} ${fy - 30} C${x + 40} ${fy - 60} ${x + 60} ${fy - 10} ${x} ${fy + 30} Z`, 'rgba(255,110,170,.55)', 6, '#c02a6a'); }); line(g, [-20, fy - 20, 20, fy - 20], 6, '#c02a6a', 'round', true); g.restore(); }
  // stick arms + doodled gloves
  [[-1, G[0]], [1, G[1]]].forEach(([s, [gx, gy]], i) => { const sx = s * W, sy = -400, yy = gy + (i ? -jab : jab); wob(g, [sx, sy, (sx + gx) / 2, (sy + yy) / 2 + 20, gx, yy], 7, INKB, T, 50 + i);
    g.beginPath(); g.ellipse(gx + j(60 + i), yy + j(62 + i), 44, 40, 0, 0, 7); g.fillStyle = '#5a8ae8'; g.fill(); g.lineWidth = 5; g.strokeStyle = INKB; g.stroke(); line(g, [gx - 30, yy + 30, gx + 30, yy + 30], 5, INKB, 'round', true); });
  if (ko || ex === 'dizzy') for (let i = 0; i < 4; i++) { const an = T * 3 + i * Math.PI / 2; txt(g, '★', Math.cos(an) * 150, top - 40 + Math.sin(an) * 34, 52, '#ffd23a', INKB, 'Nunito', 900, 0, 6); }
  g.restore();
}

// ---------- props ----------
function scoreboard(g, a, lt) { g.save(); g.translate(a.x ?? 540, a.y ?? 1500); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-400 -90 L400 -90 L400 90 L-400 90 Z', '#120c1a', 6, '#ffd23a');
  sh(g, 'M-392 -82 L-6 -82 L-6 82 L-392 82 Z', lg(g, 0, -82, 0, 82, [[0, '#ff9a1a'], [1, '#c8501a']])); sh(g, 'M6 -82 L392 -82 L392 82 L6 82 Z', lg(g, 0, -82, 0, 82, [[0, '#4a7ae8'], [1, '#2a3aa8']]));
  txt(g, 'BIG NATE', -260, -40, 38, '#fff', '#141018', 'Nunito', 900, 0, 7); txt(g, 'WIMPY KID', 260, -40, 38, '#fff', '#141018', 'Nunito', 900, 0, 7);
  const pa = a.pa ?? 0, pb = a.pb ?? 0, fl = a.flash != null ? clamp(1 - (lt - a.flash) / .5) : 0, sc = 1 + fl * .5 * (lt >= (a.flash ?? 1e9) ? 1 : 0);
  g.save(); g.translate(-200, 26); g.scale(sc, sc); txt(g, String(Math.round(pa)), 0, 0, 96, '#fff', '#141018'); g.restore(); txt(g, String(Math.round(pb)), 200, 26, 96, '#fff', '#141018');
  if (fl > 0 && lt >= a.flash) glow(g, -200, 26, 300, 'rgba(255,230,120,1)', fl); g.restore(); }
function bubble(g, a, lt) { if (lt < a.t0 || (a.t1 != null && lt > a.t1)) return; const k = eo((lt - a.t0) / .22), out = a.t1 != null ? clamp((a.t1 - lt) / .15) : 1;
  g.save(); g.translate(a.x, a.y); g.scale(k * out, k * out); g.rotate(a.rot || 0); const w = a.w || 520, h = a.h || 200, doodle = a.style === 'doodle', tl = a.tail || [-120, 170];
  if (doodle) { const p = `M${-w / 2} ${-h / 2 + 10} Q0 ${-h / 2 - 14} ${w / 2} ${-h / 2 + 6} Q${w / 2 + 14} 0 ${w / 2 - 6} ${h / 2} L${tl[0] + 50} ${h / 2} L${tl[0]} ${tl[1]} L${tl[0] - 10} ${h / 2} Q${-w / 2 - 10} ${h / 2 + 6} ${-w / 2} ${-h / 2 + 10} Z`;
    sh(g, p, '#fffdf4', 6, '#1c2a5a'); (a.text || '').split('\n').forEach((s, i, arr) => txt(g, s, 0, (i - (arr.length - 1) / 2) * (a.size || 54) * 1.1, a.size || 54, '#1c2a5a', null, 'Nunito', 800, -.03)); }
  else { const p = `M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2} ${h / 2} L${tl[0] + 50} ${h / 2} L${tl[0]} ${tl[1]} L${tl[0] - 20} ${h / 2} L${-w / 2} ${h / 2} Z`;
    sh(g, p, '#fff', 8, '#141018'); (a.text || '').split('\n').forEach((s, i, arr) => txt(g, s, 0, (i - (arr.length - 1) / 2) * (a.size || 58) * 1.1, a.size || 58, '#141018', null)); }
  g.restore(); }
function bell(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const q = a.t0 != null ? lt - a.t0 : -1, sh2 = q >= 0 && q < 1.2 ? Math.sin(q * 60) * (1 - q / 1.2) * .25 : 0;
  line(g, [0, 0, 0, 200], 14, '#5a4a3a', 'round', true); g.rotate(sh2); sh(g, 'M-110 0 C-110 -120 110 -120 110 0 L130 30 L-130 30 Z', lg(g, -120, -120, 120, 30, [[0, '#fff2a8'], [.5, '#e8b028'], [1, '#8a5a10']]), 6); ell(g, 0, -96, 16, 14, '#8a5a10', 4); g.rotate(-sh2);
  if (q >= 0 && q < 1.2) for (let i = 0; i < 3; i++) { const r = 130 + ((q * 2 + i / 3) % 1) * 200; g.save(); g.globalAlpha = (1 - q / 1.2) * .8; g.beginPath(); g.arc(0, -30, r, -2.6, -.5); g.lineWidth = 9; g.strokeStyle = '#fff2a8'; g.stroke(); g.restore(); }
  g.restore(); }
function bus(g, a) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  sh(g, 'M-360 -260 L260 -260 Q330 -260 340 -190 L360 -120 L360 0 L-360 0 Z', lg(g, 0, -260, 0, 0, [[0, '#ffd23a'], [1, '#e8a01a']]), 7); line(g, [-360, -100, 360, -100], 8, '#141018', 'butt');
  for (let i = 0; i < 5; i++) sh(g, `M${-330 + i * 120} -230 L${-240 + i * 120} -230 L${-240 + i * 120} -150 L${-330 + i * 120} -150 Z`, '#bfe6ff', 5);
  txt(g, 'SCHOOL BUS', -40, -60, 46, '#141018', null); [[-220, 0], [220, 0]].forEach(([x]) => { ell(g, x, 0, 64, 64, '#1a1420', 6); ell(g, x, 0, 26, 26, '#aaa'); });
  for (let i = 0; i < 4; i++) line(g, [-420 - i * 40, -200 + i * 50, -520 - i * 60, -200 + i * 50], 8, 'rgba(255,255,255,.7)', 'round', true); g.restore(); }
function slips(g, a, lt) { const r = rng(31), n = a.n || 26;
  for (let i = 0; i < n; i++) { const x = r() * 1200 - 60, sp = 300 + r() * 300, y = -200 + ((lt * sp + r() * 600) % 2400) * (lt > (a.t0 || 0) ? 1 : 0); if (lt < (a.t0 || 0)) continue;
    g.save(); g.translate(x + Math.sin(lt * 2 + i) * 40, y); g.rotate(Math.sin(lt * 3 + i) * .6); sh(g, 'M-90 -50 L90 -50 L90 50 L-90 50 Z', '#ffd0e0', 4); txt(g, 'DETENTION', 0, -10, 28, '#c0203a', null); line(g, [-60, 22, 60, 22], 3, 'rgba(60,20,30,.5)', 'round', true); g.restore(); } }
function heart(g, a, T) { const s = (a.s || 1) * (1 + .08 * Math.max(0, Math.sin(T * 8))); g.save(); g.translate(a.x, a.y); g.scale(s, s); glow(g, 0, -40, 300, 'rgba(255,80,120,1)', .45);
  sh(g, 'M0 100 C-160 -10 -180 -150 -80 -160 C-30 -164 0 -120 0 -100 C0 -120 30 -164 80 -160 C180 -150 160 -10 0 100 Z', lg(g, 0, -160, 0, 100, [[0, '#ff6a8a'], [1, '#c81a3a']]), 7); ell(g, -70, -110, 26, 16, 'rgba(255,255,255,.6)', 0, -.6); g.restore(); }
function nametags(g, a, lt) { (a.names || []).forEach((n, i) => { const t0 = (a.t0 || 0) + i * (a.step || .45); if (lt < t0) return; const k = eo((lt - t0) / .25), [x, y, rot] = a.pos[i];
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); sh(g, 'M-200 -110 L200 -110 L200 110 L-200 110 Z', '#fff', 6); sh(g, 'M-200 -110 L200 -110 L200 -30 L-200 -30 Z', '#e8302a', 0); sh(g, 'M-200 -110 L200 -110 L200 110 L-200 110 Z', null, 6);
  txt(g, 'HELLO', 0, -82, 36, '#fff', null); txt(g, 'my name is', 0, -46, 24, '#fff', null, 'Nunito', 800); txt(g, n, 0, 40, n.length > 7 ? 46 : 60, '#1c2a5a', null, 'Nunito', 800, -.04); g.restore(); }); }
function panels(g, a, lt) { const labs = ['SETUP', 'TIMING', 'PUNCHLINE'], cols = ['#3ad2ff', '#ffd23a', '#ff5ab4'];
  labs.forEach((l, i) => { const t0 = (a.t0 || 0) + i * (a.step || .7); if (lt < t0) return; const k = eo((lt - t0) / .25), y = a.y + i * 300;
    g.save(); g.translate(540, y); g.scale(k, k); g.rotate((i - 1) * .03); sh(g, 'M-380 -130 L380 -130 L380 130 L-380 130 Z', cols[i], 8); g.fillStyle = 'rgba(255,255,255,.18)';
    for (let yy = -120; yy < 130; yy += 20) for (let xx = -370 + ((yy / 20) % 2) * 10; xx < 380; xx += 20) { g.beginPath(); g.arc(xx, yy, 4, 0, 7); g.fill(); }
    txt(g, l, -150, 0, 64, '#fff', '#141018', 'Nunito', 900, 0, 12); txt(g, ['?', '...', 'HA!'][i], 220, 0, i === 2 ? 110 : 90, i === 2 ? '#fff' : '#141018', i === 2 ? '#e8302a' : null, 'Nunito', 900, i === 2 ? -.2 : 0, 14); g.restore(); }); }
function yearflip(g, a, lt) { const k = clamp((lt - (a.t0 || 0)) / (a.d || 2)), y = Math.round(lerp(a.from || 1991, a.to || 2026, eio(k)));
  g.save(); g.translate(a.x || 540, a.y || 600); sh(g, 'M-230 -110 L230 -110 L230 110 L-230 110 Z', '#fff', 7); sh(g, 'M-230 -110 L230 -110 L230 -60 L-230 -60 Z', '#e8302a', 0); sh(g, 'M-230 -110 L230 -110 L230 110 L-230 110 Z', null, 7);
  txt(g, String(y), 0, 28, 120, '#141018', null); g.restore(); }
function bookstack(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const r = rng(5), cols = ['#e8302a', '#3a7ae8', '#2ac86a', '#ffb02a', '#9a4ae8'], n = a.n || 9;
  for (let i = 0; i < n; i++) { const w = 300 + r() * 60, dx = (r() - .5) * 40; sh(g, `M${-w / 2 + dx} ${-i * 56} L${w / 2 + dx} ${-i * 56} L${w / 2 + dx} ${-i * 56 - 52} L${-w / 2 + dx} ${-i * 56 - 52} Z`, cols[i % 5], 5); line(g, [-w / 2 + dx + 20, -i * 56 - 26, w / 2 + dx - 20, -i * 56 - 26], 4, 'rgba(255,255,255,.5)', 'round', true); }
  for (let i = 0; i < 5; i++) { const q = (T * .6 + i / 5) % 1; g.save(); g.globalAlpha = 1 - q; txt(g, '$', -160 + i * 80, -n * 56 - 40 - q * 220, 70, '#7aff6a', '#1a4a1a', 'Nunito', 900, 0, 10); g.restore(); } g.restore(); }
function burger(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const b = Math.sin(T * 5) * 8;
  sh(g, 'M-200 0 Q-200 60 0 60 Q200 60 200 0 Z', '#d8903a', 6); sh(g, 'M-210 -10 L210 -10 L200 20 L-200 20 Z', '#5a2a14', 5); sh(g, 'M-220 -30 Q0 10 220 -30 L210 -10 L-210 -10 Z', '#6ad24a', 5);
  sh(g, 'M-200 -40 Q-200 -200 0 -200 Q200 -200 200 -40 Z', lg(g, 0, -200, 0, -40, [[0, '#f0b04a'], [1, '#c8781a']]), 6); [[-80, -150], [20, -170], [100, -120], [-20, -110]].forEach(([x, y]) => ell(g, x, y, 10, 5, '#fff4d0'));
  ell(g, -60, -100, 18, 20, '#fff', 4); ell(g, 60, -100, 18, 20, '#fff', 4); ell(g, -56, -96, 8, 9, '#141018'); ell(g, 64, -96, 8, 9, '#141018'); line(g, [-40, -60, 0, -44, 40, -60], 7, '#141018', 'round', true);
  sh(g, 'M-110 -200 C-150 -300 -60 -330 -20 -280 C10 -340 110 -320 100 -250 C150 -250 140 -190 110 -190 L-110 -190 Z', '#fff', 6);
  g.save(); g.translate(300, -60 + b); sh(g, 'M-60 -120 L60 -120 Q60 -30 0 -10 Q-60 -30 -60 -120 Z', lg(g, -60, 0, 60, 0, [[0, '#fff2a8'], [1, '#d8981a']]), 5); sh(g, 'M-14 -10 L14 -10 L18 40 L-18 40 Z', '#d8981a', 4); sh(g, 'M-50 40 L50 40 L50 64 L-50 64 Z', '#5a3a1a', 4); glow(g, 0, -60, 200, 'rgba(255,230,120,1)', .5); g.restore();
  limb(g, [200, -40, 260, -60], 14, '#d8903a', 4); g.restore(); }
function cheesehouse(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-260 0 L-260 -300 L0 -480 L260 -300 L260 0 Z', '#f4e6c8', 7); sh(g, 'M-300 -290 L0 -500 L300 -290 L280 -260 L0 -460 L-280 -260 Z', '#c8302a', 6);
  sh(g, 'M-170 -40 L170 -40 L170 -220 Z', lg(g, 0, -220, 0, -40, [[0, '#ffe04a'], [1, '#f0a81a']]), 6); [[60, -100, 18], [110, -70, 12], [130, -150, 10]].forEach(([x, y, r]) => ell(g, x, y, r, r, '#e09018', 3));
  for (let i = 0; i < 5; i++) { const an = T * 2 + i * 1.3, rr = 200 + Math.sin(T * 3 + i) * 20; txt(g, '✦', Math.cos(an) * rr, -160 + Math.sin(an) * rr * .5, 40, '#fff6b0', null); }
  g.save(); g.translate(330, -80); line(g, [0, 80, 0, -60], 10, '#6a4a2a', 'round', true); sh(g, 'M-110 -140 L110 -140 L110 -40 L-110 -40 Z', '#fff', 5); txt(g, 'RENT', 0, -110, 34, '#1a7a2a', null); txt(g, 'FREE', 0, -70, 34, '#1a7a2a', null); g.restore(); g.restore(); }
function magnifier(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  // a tiny three-panel strip under the glass
  [-1, 0, 1].forEach(i => { sh(g, `M${i * 230 - 105} -100 L${i * 230 + 105} -100 L${i * 230 + 105} 100 L${i * 230 - 105} 100 Z`, ['#bfe6ff', '#fff2a8', '#ffc8e0'][i + 1], 6); });
  txt(g, 'kid gets', -230, -10, 40, '#141018', null, 'Nunito', 800); txt(g, 'detention', -230, 36, 40, '#141018', null, 'Nunito', 800); txt(g, '...', 0, 0, 80, '#141018', null); txt(g, 'HA!', 230, 0, 90, '#fff', '#e8302a', 'Nunito', 900, -.2, 12);
  const mx = Math.sin(T * 1.5) * 200; g.save(); g.translate(mx, -20); ell(g, 0, 0, 150, 150, 'rgba(200,230,255,.25)', 14, 0, '#2a2a34'); limb(g, [100, 110, 210, 230], 30, '#6a3a1a', 6); g.restore();
  for (let i = 0; i < 3; i++) txt(g, '?', -300 + i * 300 + Math.sin(T * 3 + i) * 20, -200 - Math.abs(Math.sin(T * 2 + i)) * 40, 90, '#ffd23a', '#141018', 'Nunito', 900, 0, 12); g.restore(); }
function towers(g, a, lt, T) { g.save(); g.translate(a.x || 540, a.y || 1700); const k = clamp((lt - (a.t0 || 0)) / (a.d || 1.6)), n = Math.round(4 + eio(k) * 26), r = rng(8), cols = ['#ffd23a', '#ff9a1a', '#3ad2ff', '#ff5ab4', '#7ad24a'];
  sh(g, 'M-360 0 L-160 0 L-160 -60 L-360 -60 Z', '#2ac86a', 5); txt(g, '1 BOOK', -260, -30, 34, '#fff', '#141018', 'Nunito', 900, 0, 6);
  for (let i = 0; i < n; i++) { const w = 220 + r() * 30, dx = 200 + (r() - .5) * 26; sh(g, `M${dx - w / 2} ${-i * 46} L${dx + w / 2} ${-i * 46} L${dx + w / 2} ${-i * 46 - 42} L${dx - w / 2} ${-i * 46 - 42} Z`, cols[i % 5], 4); }
  txt(g, `${Math.round(lerp(1, 30, eio(k)))} YEARS OF COMICS`, 200, -n * 46 - 60, 44, '#fff', '#141018', 'Nunito', 900, 0, 9); g.restore(); }
function vsTitle(g, a, lt, T) { const k = eo((lt - (a.t0 || 0)) / .3); if (k <= 0) return; g.save(); g.translate(a.x || 540, a.y || 1000); g.scale(k * (1 + .04 * Math.sin(T * 10)), k * (1 + .04 * Math.sin(T * 10)));
  glow(g, 0, 0, 400, 'rgba(255,200,80,1)', .6); txt(g, 'VS', 0, 0, 260, '#ffd23a', '#e8302a', 'Nunito', 900, -.08, 34); g.restore(); }

const _drawActorB = drawActor;
drawActor = function (g, a, c, P, o) {
  const A = avAll(a, c.lt), T = c.T, lt = c.lt;
  if (A.alpha != null && A.alpha <= 0) return;
  const run = (fn) => { if (A.alpha != null) { g.save(); g.globalAlpha *= A.alpha; fn(); g.restore(); } else fn(); };
  const M = { comic: () => comicBook(g, A, T), notebook: () => notebook(g, A, T), scoreboard: () => scoreboard(g, A, lt), bubble: () => bubble(g, A, lt), bell: () => bell(g, A, lt, T),
    bus: () => bus(g, A), slips: () => slips(g, A, lt), heart: () => heart(g, A, T), nametags: () => nametags(g, A, lt), panels: () => panels(g, A, lt), yearflip: () => yearflip(g, A, lt),
    bookstack: () => bookstack(g, A, T), burger: () => burger(g, A, T), cheesehouse: () => cheesehouse(g, A, T), magnifier: () => magnifier(g, A, T), towers: () => towers(g, A, lt, T),
    vs: () => vsTitle(g, A, lt, T), belt: () => belt(g, A.x, A.y, A.s || 1, T) };
  if (M[A.type]) return run(M[A.type]);
  return _drawActorB(g, a, c, P, o);
};
