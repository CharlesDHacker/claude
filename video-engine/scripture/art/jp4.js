// JP04 Masakado: the rebel samurai (armour, and crowned as the "New Emperor"), his severed flying head with ghost-fire,
// Kyoto's gate where the head was displayed, the flight east past Fuji, 1920s Tokyo and the Ministry of Finance,
// the 1940 lightning fire, the post-war bulldozer, the Kubizuka between Otemachi's towers, and a map of head and body.
Object.assign(TOON, {
  masakado:  { kind: 'adult', skin: '#d8a070', skinD: '#b8804e', hair: '#120e10', hairHi: '#3a3040', hairStyle: 'wild', band: false, top: '#2a2230', topD: '#1e1824', pat: 'diamond', patCol: 'rgba(220,60,50,.4)', collar: '#c8302a', trimCol: '#c8302a', trimDot: '#e8c050',
               sleeve: 'kinu', bottom: 'hakama', hakama: '#3a2a2a', hakamaD: '#2a1e1e', cord: '#c8302a', belt: '#c8302a', feet: 'straw', wraps: '#e8e2d2', wrapLine: '#2a2230', eyes: 'adult', iris: '#2a1008', brow: 9, beard: 'storm', jaw: 'square',
               armor: '#7a1e1a', rivet: '#e8c050', kabuto: '#1e1a22', sword: true, bulk: 1.22, h: 1.06 },
  masakadoK: { kind: 'adult', skin: '#d8a070', skinD: '#b8804e', hair: '#120e10', hairHi: '#3a3040', hairStyle: 'wild', band: false, top: '#5a1e3a', topD: '#44142c', pat: 'clouds', patCol: 'rgba(240,200,90,.55)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#5a1e3a',
               sleeve: 'wide', bottom: 'hakama', hakama: '#e8c050', hakamaD: '#c8a040', cord: '#5a1e3a', belt: '#e8c050', feet: 'straw', wraps: '#f4efe2', eyes: 'adult', iris: '#2a1008', brow: 9, beard: 'storm', jaw: 'square', kanmuri: true, bulk: 1.22, h: 1.06 },
  official:  { kind: 'adult', skin: '#e2b088', skinD: '#c48e66', hair: '#1a1416', hairHi: '#4a4252', hairStyle: 'side', top: '#2a2c36', topD: '#1e2028', pat: null, collar: '#f4f2ec', suit: true, tie: '#6a2a2a', sleeve: 'kinu', cord: '#f4f2ec',
               bottom: 'pants', pants: '#2a2c36', shoes: '#1a1414', eyes: 'adult', iris: '#2a1810', brow: 6, jaw: 'square', moustache: true, glasses: true, h: 1.0 },
  official2: { kind: 'adult', skin: '#d8a47c', skinD: '#b8845c', hair: '#2a2024', hairHi: '#5a4a52', hairStyle: 'side', top: '#3a3a2e', topD: '#2a2a22', pat: null, collar: '#f4f2ec', suit: true, tie: '#2a3a6a', sleeve: 'kinu', cord: '#f4f2ec',
               bottom: 'pants', pants: '#3a3a2e', shoes: '#1a1414', eyes: 'adult', iris: '#2a1810', brow: 6, jaw: 'round', h: .98 },
});
// ---- the severed head: wild hair, open glowing eyes, ghost-fire under the chin; it talks with Masakado's voice ----
function flyHead(g, a, c) { const T = c.T, s = a.s || 1, L = Object.assign({}, TOON.masakado, { kabuto: null, hairStyle: 'heian', hairHi: '#4a4052' }), Gh = { head: [0, 0], hr: [76, 90] }, dir = a.dir ?? 0, talk = a.who === false ? 0 : c.V('masakado'), sp = a.speed ?? 0;
  g.save(); g.translate(a.x, a.y + Math.sin(T * 2.2) * 10 * (a.bob ?? 1)); g.scale(s, s);
  // ghost-fire trail and streaming hair behind the direction of flight
  if (sp > 0) { g.save(); g.rotate(dir); for (let i = 0; i < 14; i++) { const q = i / 14; g.save(); g.globalAlpha = (1 - q) * .55; g.globalCompositeOperation = 'lighter'; ell(g, -120 - q * 900 * sp, Math.sin(T * 9 + i) * 20 * q, 90 * (1 - q * .6), 60 * (1 - q * .6), 'rgba(140,200,255,1)'); g.restore(); }
    const sw = Math.sin(T * 6) * 16; for (let i = -3; i <= 3; i++) tsh(g, `M-60 ${i * 22} C-200 ${i * 30 + sw} -320 ${i * 34 - sw} ${-420 - Math.abs(i) * 30} ${i * 40 + sw}`, null, 16, L.hair); g.restore(); }
  glow(g, 0, 0, 420, a.glowCol || 'rgba(255,90,50,1)', a.glowA ?? .55);
  // disheveled loose hair hanging around the face (the topknot came undone)
  const sw = Math.sin(T * 1.8) * 8; tsh(g, `M-104 -20 C-130 -160 130 -160 104 -20 C122 90 ${132 + sw} 200 ${114 + sw} 300 L${80 + sw} 262 L${66 + sw} 316 L${34 + sw * .6} 252 L${10 + sw * .4} 320 L${-14 + sw * .4} 252 L${-44 + sw * .6} 314 L${-70 + sw} 262 L${-112 + sw} 300 C${-132 + sw} 200 -122 90 -104 -20 Z`, L.hair, 5);
  for (let i = -3; i <= 3; i++) tln(g, [i * 30, 120, i * 32 + sw, 270], 2.4, L.hairHi);
  faceT(g, L, Gh, { look: a.look || [0, 0] }, T, 0, a.expr || 'angry', Math.max(talk, a.scream ? .8 : 0));
  [-1, 1].forEach(sd => { glow(g, sd * 32, -8, 70, 'rgba(255,60,30,1)', (a.eyes ?? 1) * .9); tell(g, sd * 32, -6, 7, 4, `rgba(255,120,60,${a.eyes ?? 1})`, 0); });
  // onibi under the chin
  for (let i = 0; i < 7; i++) { const x = -66 + i * 22, h = 70 + 34 * Math.sin(T * 8 + i * 1.7); sh(g, `M${x - 20} 240 Q${x - 14} ${240 - h * .45} ${x + Math.sin(T * 6 + i) * 9} ${240 - h} Q${x + 16} ${240 - h * .45} ${x + 20} 240 Z`, 'rgba(150,210,255,.8)'); }
  glow(g, 0, 210, 160, 'rgba(140,200,255,1)', .5);
  g.restore(); }
// ---- the display stand at the gate ----
function headStand(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); [-90, 90].forEach(px => ttube(g, px, 0, px, -330, 22, 20, '#5a3a22', 5)); tsh(g, 'M-130 -330 L130 -330 L120 -300 L-120 -300 Z', '#4a2e1a', 5);
  tsh(g, 'M-70 -300 L70 -300 L60 -270 L-60 -270 Z', '#6a4428', 4); tsh(g, 'M-20 -330 L20 -330 L16 -420 L-16 -420 Z', '#3a2418', 4); g.restore(); }
function rashomon(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); const red = '#c8402a', redD = '#8a2a1e';
  for (let i = -3; i <= 3; i++) sh(x, `M${i * 150 - 16} 0 L${i * 150 + 16} 0 L${i * 150 + 14} -420 L${i * 150 - 14} -420 Z`, lg(x, i * 150 - 16, 0, i * 150 + 16, 0, [[0, redD], [.5, red], [1, redD]]), 4, '#3b2416');
  sh(x, 'M-520 -420 L520 -420 L520 -470 L-520 -470 Z', '#f2e6d0', 4, '#3b2416'); sh(x, 'M-600 -470 Q0 -440 600 -470 L560 -540 Q0 -510 -560 -540 Z', '#2a2a34', 5, '#14121a');
  for (let i = -3; i <= 3; i++) sh(x, `M${i * 150 - 12} -540 L${i * 150 + 12} -540 L${i * 150 + 12} -700 L${i * 150 - 12} -700 Z`, red, 4, '#3b2416');
  sh(x, 'M-480 -700 L480 -700 L480 -730 L-480 -730 Z', '#f2e6d0', 4, '#3b2416'); sh(x, 'M-560 -730 Q0 -700 560 -730 L460 -860 Q0 -830 -460 -860 Z', '#2a2a34', 5, '#14121a');
  for (let i = -9; i <= 9; i++) line(x, [i * 50, -740, i * 42, -850], 2, 'rgba(255,255,255,.12)', 'round', true); x.restore(); }
function towers(x, y0, n, hmin, hmax, w, col, winCol, seed, lit = .5) { const r = rng(seed); let px = -700; while (px < 1780) { const ww = w * (.7 + r() * .6), hh = hmin + r() * (hmax - hmin);
    sh(x, `M${px} ${y0} L${px} ${y0 - hh} L${px + ww} ${y0 - hh} L${px + ww} ${y0} Z`, mix(col, '#000', r() * .15), 2, 'rgba(0,0,0,.4)');
    if (r() < .3) sh(x, `M${px + ww * .3} ${y0 - hh} L${px + ww * .5} ${y0 - hh - 60} L${px + ww * .7} ${y0 - hh} Z`, col);
    const cw = Math.max(10, ww / 9), ch = 18; for (let yy = y0 - hh + 20; yy < y0 - 20; yy += ch + 10) for (let xx = px + 10; xx < px + ww - cw; xx += cw + 6) if (r() < lit) sh(x, `M${xx} ${yy} l${cw} 0 l0 ${ch} l${-cw} 0 Z`, r() < .2 ? '#fff2c8' : winCol);
    px += ww + 6 + r() * 30; } }
function tokyoTower(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); const c = '#e8502a', w = '#f6f2ea'; const legs = [[-140, 0, -20, -620], [140, 0, 20, -620]]; legs.forEach(([a, b, c2, d]) => line(x, [a, b, c2, d], 18, c, 'butt', true));
  for (let i = 0; i < 12; i++) { const y = -i * 52, hw = 140 - i * 10; line(x, [-hw, y, hw, y], 5, i % 2 ? c : w, 'butt', true); line(x, [-hw, y, hw - 10, y - 52], 3, c, 'butt', true); line(x, [hw, y, -hw + 10, y - 52], 3, c, 'butt', true); }
  sh(x, 'M-60 -300 L60 -300 L56 -330 L-56 -330 Z', w); sh(x, 'M-30 -560 L30 -560 L26 -580 L-26 -580 Z', w); line(x, [0, -620, 0, -820], 8, c, 'butt', true); glow(x, 0, -820, 40, 'rgba(255,80,60,1)', .8); x.restore(); }
function kubizuka(g, a, T) { const s = a.s || 1, scaff = clamp(a.scaffold || 0); g.save(); g.translate(a.x, a.y); g.scale(s, s);
  // stone terrace, hedge, the stele, incense, frog statues, flowers
  tsh(g, 'M-420 0 L420 0 L380 -60 L-380 -60 Z', '#9a968e', 5); for (let i = -5; i <= 5; i++) tln(g, [i * 70, -6, i * 66, -56], 2, 'rgba(60,55,50,.4)');
  for (let i = -6; i <= 6; i++) tell(g, i * 62, -70, 46, 30, i % 2 ? '#2e5a36' : '#3a6a42', 3);
  tsh(g, 'M-130 -60 L130 -60 L120 -110 L-120 -110 Z', '#8a867e', 4); tsh(g, 'M-90 -110 L90 -110 L80 -150 L-80 -150 Z', '#a8a49c', 4);
  const st = 'M-70 -150 L70 -150 L62 -520 Q0 -560 -62 -520 Z'; tsh(g, st, lg(g, -70, 0, 70, 0, [[0, '#6a6660'], [.5, '#8a867e'], [1, '#5a5650']]), 5);
  for (let i = 0; i < 6; i++) tln(g, [-14 + (i % 2) * 6, -480 + i * 52, 14 - (i % 2) * 6, -480 + i * 52], 6, 'rgba(30,28,26,.55)'); tln(g, [0, -490, 0, -200], 3, 'rgba(30,28,26,.35)');
  sh(g, 'M-62 -520 Q0 -560 62 -520 L50 -500 Q0 -530 -50 -500 Z', 'rgba(255,255,255,.15)');
  // incense burner + smoke
  tsh(g, 'M-40 -110 L40 -110 L32 -150 L-32 -150 Z', '#5a5048', 3); for (let i = 0; i < 3; i++) { const q = (T * .3 + i / 3) % 1; g.save(); g.globalAlpha = (1 - q) * .5; tln(g, [Math.sin(T + i) * 8, -150 - q * 300, Math.sin(T * 1.3 + i) * 20, -170 - q * 320], 4, '#e8e4dc'); g.restore(); }
  // frogs (kaeru: "return")
  [[-230, -60], [-170, -66], [180, -62], [240, -60], [-300, -52], [300, -54]].forEach(([fx, fy], i) => { g.save(); g.translate(fx, fy); const k = .9 + (i % 3) * .15; g.scale(k, k);
    tell(g, 0, -20, 30, 22, '#7a8a6a', 3); tell(g, -14, -40, 9, 9, '#7a8a6a', 3); tell(g, 14, -40, 9, 9, '#7a8a6a', 3); tell(g, -14, -41, 3.5, 3.5, '#2a2a22', 0); tell(g, 14, -41, 3.5, 3.5, '#2a2a22', 0); tln(g, [-10, -16, 10, -16], 2.4, 'rgba(40,40,30,.6)'); g.restore(); });
  [[-110, -110], [110, -110]].forEach(([fx, fy]) => { tsh(g, `M${fx - 14} ${fy} L${fx + 14} ${fy} L${fx + 10} ${fy - 40} L${fx - 10} ${fy - 40} Z`, '#6a6660', 3); [-8, 0, 8].forEach((d, i) => tell(g, fx + d, fy - 50 - (i % 2) * 6, 10, 10, ['#f6f0e4', '#e86a8a', '#f2c94c'][i], 2)); });
  if (a.eyes) { [-1, 1].forEach(sd => { glow(g, sd * 26, -420, 80, 'rgba(255,60,30,1)', a.eyes); tell(g, sd * 26, -420, 10, 5, `rgba(255,120,60,${a.eyes})`, 0); }); }
  // 2020: scaffolding and a construction screen
  if (scaff > 0) { g.save(); g.globalAlpha = scaff; for (let i = -4; i <= 4; i++) tln(g, [i * 100, 0, i * 100, -640], 8, '#b8b4ac'); for (let y = -80; y > -660; y -= 110) tln(g, [-420, y, 420, y], 7, '#b8b4ac');
    for (let i = -4; i < 4; i++) tln(g, [i * 100, -80, i * 100 + 100, -190], 4, '#9a968e'); tsh(g, 'M-430 -10 L430 -10 L430 -200 L-430 -200 Z', 'rgba(230,240,250,.85)', 4); for (let i = 0; i < 6; i++) tln(g, [-410 + i * 150, -40, -340 + i * 150, -170], 10, '#f2c94c'); g.restore(); }
  g.restore(); }
function ministry(g, a, T) { const s = a.s || 1, ruin = clamp(a.ruin || 0), burn = clamp(a.burn || 0); g.save(); g.translate(a.x, a.y); g.scale(s, s);
  const body = 'M-520 0 L520 0 L520 -560 L-520 -560 Z'; tsh(g, body, lg(g, 0, -560, 0, 0, [[0, mix('#b8604a', '#2a2020', burn * .7)], [1, mix('#8a3e2e', '#1a1414', burn * .7)]]), 6);
  g.save(); g.clip(path(body)); for (let y = -540; y < 0; y += 22) tln(g, [-520, y, 520, y], 1.6, 'rgba(60,20,10,.35)');
  for (let r = 0; r < 3; r++) for (let i = -4; i <= 4; i++) { const x = i * 110, y = -490 + r * 160; tsh(g, `M${x - 30} ${y} L${x + 30} ${y} L${x + 30} ${y + 100} L${x - 30} ${y + 100} Z`, burn > .3 ? `rgba(255,${140 + 60 * Math.sin(T * 9 + i + r) | 0},60,1)` : '#f6e8c8', 3); tsh(g, `M${x - 36} ${y - 14} L${x + 36} ${y - 14} L${x + 30} ${y} L${x - 30} ${y} Z`, '#e8dcc0', 2); } g.restore();
  tsh(g, 'M-560 -560 L560 -560 L520 -620 L-520 -620 Z', '#e8dcc0', 5); tsh(g, 'M-160 -620 L160 -620 L0 -720 Z', '#e8dcc0', 5); tell(g, 0, -660, 30, 30, '#fbf6ea', 4); tln(g, [0, -660, 0, -680], 3); tln(g, [0, -660, 14, -660], 3);
  for (let i = -2; i <= 2; i++) ttube(g, i * 80, 0, i * 80, -200, 30, 28, '#e8dcc0', 4); tsh(g, 'M-200 -200 L200 -200 L200 -230 L-200 -230 Z', '#e8dcc0', 4);
  if (ruin > 0) { g.save(); g.globalAlpha = ruin; tsh(g, 'M-520 -560 L-300 -420 L-120 -600 L100 -380 L300 -540 L520 -400 L520 -620 L-520 -620 Z', '#1a1418', 0); for (let i = 0; i < 18; i++) { const x = -500 + i * 58; tsh(g, `M${x} 0 L${x + 40} -${30 + (i * 37) % 60} L${x + 70} 0 Z`, '#6a4a3a', 3); } g.restore(); }
  if (burn > 0) { flameWall(g, -540, 540, -200, 520 * burn, T, 7, burn); smokeF(g, 0, -560, 1000, T, .6 * burn, 9); }
  g.restore(); }
function barracks(g, a) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); tsh(g, 'M-360 0 L360 0 L360 -220 L-360 -220 Z', '#9a7a52', 5); for (let k = -340; k <= 340; k += 34) tln(g, [k, -220, k, 0], 2, 'rgba(50,30,15,.4)');
  tsh(g, 'M-400 -220 L400 -220 L340 -300 L-340 -300 Z', '#4a4a52', 5); for (let i = -2; i <= 2; i++) tsh(g, `M${i * 130 - 30} -170 L${i * 130 + 30} -170 L${i * 130 + 30} -100 L${i * 130 - 30} -100 Z`, '#f6e8c8', 3); g.restore(); }
function bulldozer(g, a, lt, T) { const tip = a.tip == null ? 0 : clamp(a.tip); g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); g.translate(260, 0); g.rotate(-tip * 1.45); g.translate(-260, 0);
  const ol = '#5a6a3a', olD = '#3e4a28'; tsh(g, 'M-280 -40 L260 -40 Q300 -40 300 -80 L300 -110 L-280 -110 Q-320 -110 -320 -75 Q-320 -40 -280 -40 Z', '#2a2a24', 5);
  for (let i = 0; i < 7; i++) tell(g, -260 + i * 86, -75, 28, 28, '#4a4a42', 3); tsh(g, 'M-240 -110 L220 -110 L220 -260 L-240 -260 Z', ol, 5); tsh(g, 'M-60 -260 L160 -260 L160 -420 L-60 -420 Z', olD, 5); tsh(g, 'M-40 -400 L140 -400 L140 -290 L-40 -290 Z', 'rgba(200,220,230,.5)', 3);
  tsh(g, 'M-180 -260 L-140 -260 L-140 -360 L-180 -360 Z', '#2a2a24', 3); tsh(g, 'M220 -230 L400 -120 L420 -20 L300 -20 L240 -110 Z', ol, 5); tsh(g, 'M380 -320 L420 -320 L460 20 L400 20 Z', '#6a6a5a', 5); tell(g, -150, -190, 40, 20, '#f2f0e8', 2); tln(g, [-170, -190, -130, -190], 3, '#2a2a24');
  g.restore(); if (tip > .6) dustBurst(g, { x: a.x + 200, y: a.y, t0: 0, s: 1.4, col: '#a89a7a' }, (tip - .6) * 2.5); }
function kantoMap(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  tsh(g, 'M-460 -620 L460 -620 L460 620 L-460 620 Z', lg(g, 0, -620, 0, 620, [[0, '#f2e6c8'], [1, '#e0cfa8']]), 6); tpattern(g, 'M-460 -620 L460 -620 L460 620 L-460 620 Z', 'waves', 'rgba(90,120,150,.25)', 1.2);
  const land = 'M-460 -620 L300 -620 C320 -480 280 -380 340 -260 C380 -160 300 -60 220 20 C160 80 60 60 0 140 C-40 200 -60 300 -10 360 C30 420 -40 480 -120 470 C-220 460 -260 380 -330 360 C-400 340 -440 300 -460 280 Z';
  tsh(g, land, '#d8c49a', 5); g.save(); g.clip(path(land)); for (let i = 0; i < 8; i++) { const x = -420 + i * 90, y = -560 + (i % 3) * 30; tsh(g, `M${x - 40} ${y + 30} L${x} ${y - 30} L${x + 40} ${y + 30} Z`, 'rgba(120,100,70,.5)', 0); } g.restore();
  const pins = [[-140, 230, 'TOKYO', 'HEAD', '#c8302a'], [160, -300, 'IBARAKI', 'BODY', '#2a3a6a']];
  pins.forEach(([px, py, nm, what, col], i) => { const k = clamp((lt - (a.t0 || 0) - i * .5) / .4); if (k <= 0) return; g.save(); g.globalAlpha = k;
    if (i === 1 && a.quake != null && lt > a.quake) for (let r = 0; r < 4; r++) { const q = ((lt - a.quake) * .9 + r / 4) % 1; g.save(); g.globalAlpha = (1 - q) * k; g.beginPath(); g.arc(px, py, 30 + q * 300, 0, 7); g.lineWidth = 8; g.strokeStyle = '#c8302a'; g.stroke(); g.restore(); }
    tsh(g, `M${px} ${py} C${px - 40} ${py - 50} ${px - 40} ${py - 100} ${px} ${py - 100} C${px + 40} ${py - 100} ${px + 40} ${py - 50} ${px} ${py} Z`, col, 5); tell(g, px, py - 66, 14, 14, '#fbf6ea', 0);
    txt(g, nm, px, py + 60, 54, '#3b2416', null, 'Nunito', 900); txt(g, what, px, py + 108, 40, col, null, 'Nunito', 900); g.restore(); });
  if (a.line) { const k = clamp((lt - (a.t0 || 0) - .9) / .6); g.save(); g.setLineDash([18, 14]); tln(g, [-140, 150, -140 + 300 * k, 150 - 470 * k], 5, '#3b2416'); g.restore(); }
  g.restore(); }
Object.assign(JPA, {
  flyhead: (g, A, c) => flyHead(g, A, c), headstand: (g, A, c) => headStand(g, A.x, A.y, A.s || 1), kubizuka: (g, A, c) => kubizuka(g, A, c.T), ministry: (g, A, c) => ministry(g, A, c.T),
  barracks: (g, A, c) => barracks(g, A), bulldozer: (g, A, c) => bulldozer(g, A, c.lt, c.T), kantomap: (g, A, c) => kantoMap(g, A, c.lt, c.T),
  tally: (g, A, c) => { const n = Math.min(A.n || 14, Math.floor(clamp((c.lt - (A.t0 || 0)) / (A.d || 3)) * (A.n || 14) + .001)); for (let i = 0; i < n; i++) { const x = A.x + (i % 7) * 110, y = A.y + Math.floor(i / 7) * 150;
      g.save(); g.translate(x, y); sh(g, 'M-34 0 L-40 -110 Q-30 -140 0 -144 Q30 -140 40 -110 L34 0 Z', '#1a1418'); ell(g, 0, -170, 30, 34, '#1a1418'); tln(g, [-36, -190, 36, -100], 10, '#c8302a'); tln(g, [36, -190, -36, -100], 10, '#c8302a'); g.restore(); }
    if (n) { txt(g, String(n), A.x + 330, A.y - 260, 130, '#c8302a', '#3b2416', 'Nunito', 900); } },
  banners: (g, A, c) => { for (let i = 0; i < (A.n || 5); i++) banner(g, { x: A.x + i * (A.dx || 220), y: A.y, s: A.s || .8, col: A.col || '#1e1a22', sym: true, ph: i }, c.T); },
});
// ---- sets ----
JSETS.otemachi = { back(g, o, c, T) { const scaff = o.year2020;
    layerAt(g, c, 0, () => blit(g, cacheLayer('ot_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#08061a'], [.55, '#241a48'], [.85, '#5a2a5a'], [1, '#8a3a4a']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 60, 101, 400, .5); moonF(x, 840, 160, 40); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('ot_far', x => { towers(x, 1250, 0, 260, 620, 120, '#2a2448', '#c8b87a', 103, .35); tokyoTower(x, 860, 1200, .7); }, { blur: 1.4 })));
    layerAt(g, c, .32, () => blit(g, cacheLayer('ot_mid', x => { towers(x, 1420, 0, 520, 1100, 190, '#1e1a34', '#f2d48a', 107, .45); }, { blur: .7 })));
    layerAt(g, c, .32, () => { for (let i = 0; i < 6; i++) { const bl = Math.sin(T * 2 + i) > .6; if (bl) ell(g, -400 + i * 380, 300 + (i % 3) * 80, 5, 5, '#ff4a3a'); } });
    layerAt(g, c, .6, () => blit(g, cacheLayer('ot_near', x => { [[-420, 1660, 520, 1800], [1150, 1660, 560, 1900]].forEach(([px, py, w, h]) => { sh(x, `M${px - w / 2} ${py} L${px - w / 2} ${py - h} L${px + w / 2} ${py - h} L${px + w / 2} ${py} Z`, lg(x, px - w / 2, 0, px + w / 2, 0, [[0, '#2a3456'], [.5, '#3a4a72'], [1, '#1e2642']]), 4, '#0e1020');
        for (let yy = py - h + 30; yy < py - 40; yy += 60) for (let xx = px - w / 2 + 20; xx < px + w / 2 - 50; xx += 70) sh(x, `M${xx} ${yy} l54 0 l0 40 l-54 0 Z`, (xx * 7 + yy) % 5 < 2 ? '#f6e2a0' : 'rgba(120,150,200,.5)'); }); }, { blur: .3, y0: -400, h: 2400 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ot_ground', x => { x.fillStyle = lg(x, 0, 1640, 0, 2700, [[0, '#4a4652'], [1, '#22202a']]); x.fillRect(-700, 1640, 2480, 1100);
      for (let y = 1660; y < 2700; y += 70) line(x, [-700, y, 1780, y], 2, 'rgba(0,0,0,.3)', 'round', true); for (let k = -700; k < 1780; k += 120) line(x, [k, 1640, k * 1.5 - 280, 2700], 2, 'rgba(0,0,0,.25)', 'round', true);
      [[120, 1660], [960, 1660]].forEach(([lx, ly]) => { line(x, [lx, ly, lx, ly - 380], 10, '#2a2a34', 'round', true); sh(x, `M${lx - 30} ${ly - 380} L${lx + 30} ${ly - 380} L${lx + 20} ${ly - 410} L${lx - 20} ${ly - 410} Z`, '#2a2a34'); glow(x, lx, ly - 370, 260, 'rgba(255,230,170,1)', .45); }); }, { y0: 1100, h: 1700 }))); },
  front(g, o, c, T) { if (o.rain) ACT_RAIN(g, c, T); }, haze(g) { g.fillStyle = 'rgba(150,110,220,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.kyoto = { back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('ky_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#05040c'], [.6, '#1a1432'], [1, '#3a2030']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 160, 111, 700); moonF(x, 260, 260, 50); for (let i = 0; i < 4; i++) cloudF(x, -300 + i * 520, 520 + (i % 2) * 80, 1, '#1e1834', '#3a2e5a'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('ky_far', x => { ridge(x, 1200, 260, '#140f22', 113); for (let i = 0; i < 9; i++) { const px = -600 + i * 280; sh(x, `M${px - 110} 1300 L${px - 110} 1190 L${px + 110} 1190 L${px + 110} 1300 Z`, '#120c18'); sh(x, `M${px - 140} 1190 Q${px} 1150 ${px + 140} 1190 L${px + 100} 1150 L${px - 100} 1150 Z`, '#1a1222'); } }, { blur: 1.2 })));
    layerAt(g, c, .45, () => blit(g, cacheLayer('ky_gate', x => { rashomon(x, 540, 1560, 1.0); }, { blur: .4 })));
    layerAt(g, c, .45, () => { [[100, 1560], [980, 1560]].forEach(([x, y], i) => { line(g, [x, y, x, y - 300], 8, '#3a2418', 'round', true); fire(g, x, y - 300, .55, T + i); glow(g, x, y - 320, 380, 'rgba(255,150,70,1)', .5); }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('ky_ground', x => { x.fillStyle = lg(x, 0, 1580, 0, 2700, [[0, '#3a3236'], [1, '#18141a']]); x.fillRect(-700, 1580, 2480, 1200); pebbles(x, 1600, 2600, 300, 117, ['#4a4246', '#5a5256', '#2e282c']); }, { y0: 1500, h: 1300 }))); },
  front(g, o, c, T) { embers(g, T, 12, 119); }, haze(g) { g.fillStyle = 'rgba(120,60,150,.07)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.flight = { back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('fl_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#04040e'], [.6, '#141a40'], [1, '#2a3060']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 300, 121, 1100); moonF(x, 820, 220, 70); })));
    layerAt(g, c, .1, () => blit(g, cacheLayer('fl_fuji', x => { fujiF(x, 600, 1500, 1.1, '#2a2a52', '#c8cce8'); ridge(x, 1520, 220, '#1a1a38', 123); }, { blur: 1.5 })));
    layerAt(g, c, .25, () => { const off = (T * 120) % 2400; for (let i = 0; i < 7; i++) { const x = ((i * 420 - off) % 2400 + 2400) % 2400 - 700; cloudF(g, x, 900 + (i % 3) * 200, 1.4, 'rgba(40,44,90,.85)', 'rgba(150,160,230,.4)'); } });
    layerAt(g, c, .7, () => { const off = (T * 400) % 2600; for (let i = 0; i < 5; i++) { const x = ((i * 560 - off) % 2600 + 2600) % 2600 - 700; cloudF(g, x, 1700 + (i % 2) * 220, 2.2, 'rgba(60,66,120,.9)', 'rgba(170,180,240,.45)'); } }); },
  haze(g) { g.fillStyle = 'rgba(120,150,255,.05)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.taisho = { back(g, o, c, T) { const sepia = o.tod !== 'night';
    layerAt(g, c, 0, () => blit(g, cacheLayer('ts_sky' + (sepia ? 'd' : 'n'), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, sepia ? [[0, '#a8b8c8'], [1, '#f2e2c0']] : [[0, '#080814'], [1, '#2a2440']]); x.fillRect(-700, -700, 2480, 3400);
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 500 + (i % 2) * 120, 1.1, sepia ? '#fbf6ea' : '#221e36', sepia ? '#ffffff' : '#3a3260'); })));
    layerAt(g, c, .2, () => blit(g, cacheLayer('ts_far' + (sepia ? 'd' : 'n'), x => { towers(x, 1300, 0, 120, 300, 200, sepia ? '#9a8070' : '#2a2030', sepia ? '#f2e2c0' : '#f2c87a', 131, sepia ? .2 : .4); }, { blur: 1.2 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ts_ground' + (sepia ? 'd' : 'n'), x => { x.fillStyle = lg(x, 0, 1620, 0, 2700, sepia ? [[0, '#b8a688'], [1, '#7a6a52']] : [[0, '#3a3438'], [1, '#18141a']]); x.fillRect(-700, 1620, 2480, 1100);
      line(x, [-700, 1720, 1780, 1720], 5, 'rgba(60,50,40,.6)', 'round', true); line(x, [-700, 1760, 1780, 1760], 5, 'rgba(60,50,40,.6)', 'round', true); for (let k = -700; k < 1780; k += 40) line(x, [k, 1716, k + 4, 1764], 3, 'rgba(60,50,40,.4)', 'round', true);
      [[60, 1640], [1020, 1640]].forEach(([lx, ly]) => { line(x, [lx, ly, lx, ly - 420], 10, '#2a2420', 'round', true); sh(x, `M${lx - 26} ${ly - 420} L${lx + 26} ${ly - 420} L${lx + 18} ${ly - 470} L${lx - 18} ${ly - 470} Z`, sepia ? '#f6eed0' : '#ffe4a0', 3, '#2a2420'); if (!sepia) glow(x, lx, ly - 445, 260, 'rgba(255,220,150,1)', .55); }); }, { y0: 1100, h: 1700 }))); },
  haze(g, o) { g.fillStyle = o.tod !== 'night' ? 'rgba(200,160,100,.1)' : 'rgba(120,100,200,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.paper = { back(g, o, c, T) { layerAt(g, c, 0, () => blit(g, cacheLayer('pp_bg', x => { x.fillStyle = lg(x, 0, -700, 0, 2600, [[0, '#2a1c14'], [1, '#140c08']]); x.fillRect(-700, -700, 2480, 3400); }))); },
  haze(g) { g.fillStyle = 'rgba(255,200,120,.04)'; g.fillRect(0, 0, 1080, 1920); } };
