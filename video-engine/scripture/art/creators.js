// "The people behind the top 10": a name card per creator and an original illustrated vignette for each fact.
// No likenesses of the real authors and no copyrighted characters or cover art; books are generic coloured volumes.
function boardDrift(g, T, col) { const r = rng(41); for (let i = 0; i < 16; i++) { const x = r() * 1200 - 60, y = (r() * 2200 + T * (14 + r() * 18)) % 2200 - 200, w = 60 + r() * 70;
  g.save(); g.translate(x, y); g.rotate(Math.sin(T * .3 + i) * .4); g.globalAlpha = .06 + r() * .05; sh(g, rrect(g, -w / 2, -w * .65, w, w * 1.3, 6), col || '#9ab8ff', 0); g.restore(); } }
function creatorCard(g, a, lt) { const k = eo((lt - (a.t0 || 0)) / .45), col = a.col || '#ffb04a';
  g.save(); g.globalAlpha = k;
  txt(g, '#' + a.rank, 165 - (1 - k) * 200, 610, 190, col, '#0a0e16', 'Nunito', 900, -.06, 24);
  g.save(); g.translate((1 - k) * 260, 0); const name = a.name || '', ns = Math.min(80, 1120 / Math.max(8, name.length));
  txt(g, name, 660, 566, ns, '#f2ead8', '#0a0e16', 'Nunito', 900, 0, 12);
  line(g, [350, 620, 950, 620], 6, col, 'round', true); txt(g, a.books || '', 650, 668, 44, mix(col, '#fff', .35), '#0a0e16', 'Nunito', 800, 0, 6); g.restore(); g.restore(); }
function book(g, x, y, s, col, title, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); sh(g, 'M110 -150 L136 -136 L136 164 L110 150 Z', '#efe4cc', 4); cel(g, rrect(g, -110, -150, 220, 300, 10), col, 5, -1, .2, 110); sh(g, 'M-110 -150 L-88 -150 L-88 150 L-110 150 Z', shade(col, .35), 3);
  if (title) title.split('\n').forEach((w, i, arr) => txt(g, w, 10, -60 + i * 50 - (arr.length - 1) * 8, w.length > 9 ? 34 : 42, '#fff', '#0a0e16', 'Nunito', 900, 0, 8)); line(g, [-60, 110, 80, 110], 6, 'rgba(255,255,255,.5)', 'round', true); g.restore(); }
// --- vignettes (all centred around x,y) ---
const VIG = {
  lawyer: (g, a, lt, T) => { // the gavel comes down, then becomes a pen writing in a diary
    const hit = Math.max(0, Math.sin(Math.min(lt, 1.2) * 8)) * (lt < 1.4 ? 1 : 0);
    sh(g, rrect(g, -260, 120, 220, 50, 10), '#7a4a2a', 5); g.save(); g.translate(-150, 40); g.rotate(-.6 + hit * .5); sh(g, rrect(g, -20, -10, 40, 200, 10), '#a8743a', 4); sh(g, rrect(g, -80, -70, 160, 70, 18), '#8a5a2a', 5); g.restore();
    if (lt > 1.2) glow(g, -150, 110, 160, 'rgba(255,230,160,1)', clamp(1 - (lt - 1.2) * 2) * .7);
    g.save(); g.translate(150, 60); sh(g, rrect(g, -150, -190, 300, 380, 12), '#fffdf4', 5, '#1c2a5a'); for (let y = -120; y < 180; y += 34) line(g, [-150, y, 150, y], 2.4, 'rgba(90,150,220,.5)', 'butt', true);
    const w = clamp((lt - 1.6) / 2.5); for (let i = 0; i < 5; i++) { const ww = clamp(w * 5 - i) * 230; if (ww > 0) wob(g, [-120, -100 + i * 68, -120 + ww, -98 + i * 68], 4, '#1c2a5a', T, i); }
    if (lt > 3) { const q = eo((lt - 3) / .4); g.save(); g.translate(90, 120); g.scale(q * .35, q * .35); icon(g, 'heart', 0, 0, 1, T); g.restore(); } g.restore();
    g.save(); g.translate(150 + lerp(-120, 110, (lt * .4) % 1), -40 + Math.floor((lt * .4) % 5) * 68); g.rotate(.6); sh(g, 'M-7 -120 L7 -120 L7 20 L-7 20 Z', '#8a5ad0', 3); sh(g, 'M-7 20 L7 20 L0 44 Z', '#2a1a3a', 3); g.restore(); },
  actor: (g, a, lt, T) => { // stage masks and an award statuette under a spotlight
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,230,170,.10)'; g.beginPath(); g.moveTo(-60, -520); g.lineTo(60, -520); g.lineTo(260, 260); g.lineTo(-260, 260); g.fill(); g.restore();
    [[-170, -40, -.2, '#f2e6c4', 1], [-60, 10, .25, '#e8b84a', -1]].forEach(([x, y, r, c, m]) => { g.save(); g.translate(x, y); g.rotate(r + Math.sin(T * 1.5 + x) * .05);
      sh(g, 'M-80 -90 C-80 -140 80 -140 80 -90 C84 20 40 100 0 100 C-40 100 -84 20 -80 -90 Z', c, 5); ell(g, -34, -30, 16, 10, '#1a1214'); ell(g, 34, -30, 16, 10, '#1a1214');
      sh(g, m > 0 ? 'M-34 40 Q0 70 34 40' : 'M-34 60 Q0 30 34 60', null, 6, '#1a1214'); g.restore(); });
    g.save(); g.translate(190, 160); const sp = Math.sin(T * 2) * .03; g.rotate(sp); sh(g, 'M-70 0 L70 0 L60 -40 L-60 -40 Z', '#2a1a14', 4); sh(g, 'M-20 -40 L20 -40 L14 -200 L-14 -200 Z', lg(g, -20, 0, 20, 0, [[0, '#8a5a10'], [.5, '#ffe080'], [1, '#8a5a10']]), 4);
    ell(g, 0, -230, 40, 40, lg(g, -40, -270, 40, -190, [[0, '#fff2a8'], [1, '#c08a20']]), 4); glow(g, 0, -200, 260, 'rgba(255,220,120,1)', .5 + .2 * Math.sin(T * 5)); g.restore(); },
  islands: (g, a, lt, T) => { // a little islands-game map, then a cosy bookstore front
    const q = clamp(lt / 2.2); g.save(); g.translate(-150, -60); sh(g, rrect(g, -200, -200, 400, 380, 24), lg(g, 0, -200, 0, 180, [[0, '#5ac8e8'], [1, '#2a7ab8']]), 5);
    [[-110, -80, 60], [40, -110, 46], [100, 40, 64], [-60, 90, 50]].forEach(([x, y, r], i) => { ell(g, x, y + 10, r * 1.2, r * .55, '#e8d08a', 4); ell(g, x, y, r, r * .45, '#5aa84a', 3); if (q > i / 4) ell(g, x, y - 6, 9, 9, '#e8402a', 2); });
    line(g, [-110, -80, 40, -110, 100, 40, -60, 90], 4, 'rgba(255,255,255,.7)', 'round', true); g.restore();
    const k2 = eo(clamp((lt - 1.8) / .5)); g.save(); g.translate(170, 120 + (1 - k2) * 60); g.globalAlpha = k2;
    sh(g, 'M-170 0 L170 0 L170 -300 L-170 -300 Z', '#d8b08a', 5); sh(g, 'M-190 -300 L190 -300 L190 -340 L-190 -340 Z', '#5a3a24', 4); txt(g, 'BOOKS', 0, -320, 30, '#f2e6c4', null, 'Nunito', 900);
    sh(g, 'M-170 -260 L170 -260 L190 -210 L-190 -210 Z', '#2a7a5a', 4); for (let i = 0; i < 7; i++) sh(g, `M${-170 + i * 48.6} -260 L${-170 + (i + .5) * 48.6} -260 L${-190 + (i + .5) * 54} -210 L${-190 + i * 54} -210 Z`, 'rgba(255,255,255,.3)');
    sh(g, 'M-140 -190 L-10 -190 L-10 -40 L-140 -40 Z', '#ffe0a0', 4); for (let i = 0; i < 6; i++) sh(g, `M${-132 + i * 20} -100 l16 0 l0 56 l-16 0 Z`, ['#c8402a', '#2a6ac8', '#e8b030', '#3a8a4a', '#8a5ad0', '#e86a3a'][i], 2);
    sh(g, 'M30 0 L30 -170 Q80 -210 130 -170 L130 0 Z', '#5a3a24', 4); glow(g, -75, -110, 160, 'rgba(255,200,120,1)', .5); g.restore(); },
  quiz: (g, a, lt, T) => { // a quiz-show podium: the buzzer lights up and the score climbs
    const buzz = lt > 1.0 && lt < 1.5; g.save(); g.translate(-40, 100);
    sh(g, 'M-170 0 L170 0 L150 -300 L-150 -300 Z', lg(g, -170, 0, 170, 0, [[0, '#1a2a6a'], [.5, '#3a5ac8'], [1, '#1a2a6a']]), 6); sh(g, rrect(g, -120, -270, 240, 90, 10), '#0a0e2a', 4);
    const wq = clamp((lt - 1.2) / .3); if (wq > 0) { g.save(); g.translate(0, -225); g.scale(.6 + .4 * eo(wq), .6 + .4 * eo(wq)); txt(g, 'WINNER', 0, 0, 56, '#ffd23a', null, 'Nunito', 900); g.restore(); glow(g, 0, -225, 260, 'rgba(255,210,80,1)', .4 * wq); } else txt(g, '?', 0, -225, 60, '#5a6ac8', null, 'Nunito', 900);
    sh(g, rrect(g, -150, -320, 300, 26, 8), '#e0b040', 4); ell(g, 120, -350, 22, 14, buzz ? '#ff4a3a' : '#a8302a', 4); if (buzz) glow(g, 120, -350, 200, 'rgba(255,80,60,1)', .8);
    for (let i = 0; i < 3; i++) line(g, [-120 + i * 120, -170, -120 + i * 120, -10], 3, 'rgba(255,255,255,.18)', 'butt', true); g.restore();
    g.save(); g.translate(240, -140); g.scale(.7, .7); icon(g, 'wing', 0, 0, 1, T); g.restore(); },
  covers: (g, a, lt, T) => { // a paintbrush paints seven fresh covers in a row
    const cols = ['#c8402a', '#2a7a5a', '#2a5ac8', '#e8b030', '#6a3a8a', '#1a3a5a', '#a8302a'];
    for (let i = 0; i < 7; i++) { const q = eo(clamp((lt - .3 - i * .35) / .4)), x = -330 + i * 110; sh(g, rrect(g, x - 48, -140, 96, 280, 6), '#f2ead8', 4); g.save(); g.beginPath(); g.rect(x - 48, -140, 96, 280 * q); g.clip(); sh(g, rrect(g, x - 48, -140, 96, 280, 6), cols[i], 0);
      ell(g, x, -10, 26, 26, 'rgba(255,240,200,.45)'); line(g, [x - 30, 90, x + 30, 90], 5, 'rgba(255,255,255,.5)', 'round', true); txt(g, String(i + 1), x, -100, 34, '#fff', null, 'Nunito', 900); g.restore(); sh(g, rrect(g, x - 48, -140, 96, 280, 6), null, 4); }
    const bi = Math.min(6, Math.floor((lt - .3) / .35)), bq = ((lt - .3) / .35) % 1, bx = -330 + Math.max(0, bi) * 110, by = -140 + bq * 280;
    g.save(); g.translate(bx + 40, by - 40); g.rotate(.7); sh(g, 'M-8 -180 L8 -180 L10 -40 L-10 -40 Z', '#8a5a2a', 3); sh(g, 'M-12 -40 L12 -40 L10 -10 L-10 -10 Z', '#c0c0c8', 3); sh(g, 'M-10 -10 L10 -10 Q8 20 0 34 Q-8 20 -10 -10 Z', cols[Math.max(0, bi)], 3); g.restore();
    g.save(); g.translate(330, -260); g.scale(.55, .55); icon(g, 'gem', 0, 0, 1, T); g.restore(); },
  teeth: (g, a, lt, T) => { // braces, a sparkle of a smile, and the old landline for the club
    g.save(); g.translate(-120, -20); g.scale(1.2, 1.2); icon(g, 'braces', 0, 0, 1, T); g.restore();
    const q = eo(clamp((lt - 1.4) / .5)); g.save(); g.translate(200, 120); g.globalAlpha = q; g.scale(.8, .8); icon(g, 'phone', 0, 0, 1, T); g.restore();
    if (lt > .8 && lt < 1.6) { const k = (lt - .8) / .8; for (let i = 0; i < 4; i++) txt(g, '✦', -120 + Math.cos(i * 1.6) * 200 * k, -20 + Math.sin(i * 1.6) * 120 * k, 40, `rgba(255,250,220,${1 - k})`, null); } },
};
function vignette(g, a, lt, T) { g.save(); g.translate(a.x || 540, a.y || 1080); g.scale(a.s || 1, a.s || 1); const f = VIG[a.kind]; if (f) f(g, a, lt - (a.t0 || 0), T); g.restore(); }
// --- school settings (shared floor line 1880) ---
SET.hallway = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#c8d0c0'], [1, '#e8e4d0']]); g.fillRect(-600, -600, 2300, 2200);
  sh(g, 'M-600 1120 L1700 1120 L1700 1500 L-600 1500 Z', '#7a9a8a', 0); line(g, [-600, 1120, 1700, 1120], 8, '#5a7a6a', 'butt', true);
  for (let i = 0; i < 9; i++) { const x = -160 + i * 150; sh(g, `M${x} 620 L${x + 140} 620 L${x + 140} 1500 L${x} 1500 Z`, lg(g, x, 0, x + 140, 0, [[0, '#4a7ab8'], [1, '#3a5a98']]), 5);
    for (let j = 0; j < 3; j++) line(g, [x + 30, 680 + j * 16, x + 110, 680 + j * 16], 4, 'rgba(10,20,40,.4)', 'round', true); ell(g, x + 118, 1040, 8, 22, '#c8c8d0', 3); }
  sh(g, 'M-600 300 L1700 300 L1700 330 L-600 330 Z', '#8a8a7a', 0); for (let i = 0; i < 4; i++) { sh(g, rrect(g, -80 + i * 330, 380, 220, 150, 8), ['#ffe080', '#ff9a8a', '#9ad0ff', '#b0e8a0'][i], 4); for (let j = 0; j < 3; j++) line(g, [-60 + i * 330, 420 + j * 30, 100 + i * 330, 420 + j * 30], 4, 'rgba(40,40,60,.3)', 'round', true); }
  tileFloor(g, 1500, '#d8d4c4', '#b8b4a4'); };
SET.classroom = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#e8dcc0'], [1, '#d8c8a4']]); g.fillRect(-600, -600, 2300, 2200);
  sh(g, rrect(g, 60, 520, 960, 560, 14), '#2a4a3a', 10, '#7a5a3a'); g.save(); g.globalAlpha = .1; for (let i = 0; i < 9; i++) sh(g, `M${120 + i * 97} ${560 + (i * 53) % 400} q40 -14 80 6`, null, 6, '#e8e8e0'); g.restore();
  [['ART', '#f0f0e6'], ['...', '#f0f0e6'], ['HA!', '#ffe678']].forEach(([w, col], i) => { const x = 480 + i * 180; sh(g, rrect(g, x, 690, 160, 130, 6), null, 4, 'rgba(240,240,230,.8)'); txt(g, w, x + 80, 770, 54, col, null, 'Nunito', 900, i === 2 ? -.15 : -.05); if (i < 2) sh(g, `M${x + 166} 755 l8 0`, null, 4, 'rgba(240,240,230,.6)'); });
  txt(g, 'setup  ·  beat  ·  punchline', 750, 900, 34, 'rgba(240,240,230,.7)', null, 'Nunito', 900); sh(g, 'M60 1080 L1020 1080 L1020 1100 L60 1100 Z', '#7a5a3a', 3); ell(g, 300, 1074, 30, 8, '#f0f0e6', 2);
  g.save(); g.translate(930, 1300); ell(g, 0, 0, 70, 70, '#f8f4ea', 5); sh(g, 'M-50 -48 Q-10 0 -50 48', null, 4, '#c8302a'); sh(g, 'M50 -48 Q10 0 50 48', null, 4, '#c8302a'); g.restore();
  g.save(); g.translate(120, 1320); sh(g, 'M-90 60 C-120 -60 -40 -130 40 -110 C110 -90 120 0 90 60 Z', '#a8603a', 5); for (let i = 0; i < 4; i++) line(g, [-60 + i * 36, 50, -50 + i * 34, -90], 3, 'rgba(60,30,10,.4)', 'round', true); g.restore();
  tileFloor(g, 1500, '#b8905a', '#9a7040'); };
const _drawActorCr = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'creator') { boardDrift(g, c.T, A.col); return creatorCard(g, A, c.lt); }
  if (A.type === 'vignette') return vignette(g, A, c.lt, c.T);
  if (A.type === 'book') return book(g, A.x, A.y, A.s || 1, A.col, A.title, A.rot || 0);
  return _drawActorCr(g, a, c, P, o); };
