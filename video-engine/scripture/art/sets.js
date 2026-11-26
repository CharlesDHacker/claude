// Persian sets for Esther (and reusable): full, layered environments with a shared floor line so people stand ON the
// ground. scene "set", o.set = hall | street | chamber | banquet | home | gate.  o.floor = the y feet stand on (1880).
const SET = {};
function vpLines(g, x0, x1, y0, y1, vx, vy, n, col, lw) { for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), k = (y0 - vy) / (y1 - vy); line(g, [vx + (x - vx) * k, y0, x, y1], lw, col, 'butt', true); } }
function tileFloor(g, y0, a, b, vx = 540, vy = 1050) { g.fillStyle = lg(g, 0, y0, 0, 2400, [[0, a], [1, mix(a, '#000', .35)]]); g.fillRect(-600, y0, 2300, 2600);
  g.save(); g.beginPath(); g.rect(-600, y0, 2300, 2600); g.clip(); let y = y0, h = 26, row = 0;
  while (y < 2500) { const k = (y - vy) / (y0 - vy), w = 120 * k; let x = vx - (Math.ceil((vx + 600) / w) + 1) * w + (row % 2) * w * .5;
    for (; x < 1700; x += w) { g.fillStyle = ((Math.round((x - vx) / w) + row) % 2) ? b : 'rgba(0,0,0,0)'; g.globalAlpha = .55; g.fillRect(x, y, w, h); }
    g.globalAlpha = 1; line(g, [-600, y, 1700, y], 1.6, 'rgba(40,20,10,.25)', 'butt', true); y += h; h *= 1.18; row++; }
  vpLines(g, -1600, 2700, y0, 2600, vx, vy, 34, 'rgba(40,20,10,.18)', 1.6); g.restore(); }
function drape(g, x, w, top, bot, col, side, T) { const sw = Math.sin(T * .8 + x) * 6;
  sh(g, `M${x} ${top} L${x + w * side} ${top} C${x + w * side * .5 + sw} ${(top + bot) * .45} ${x + w * side * .25} ${bot * .6} ${x + w * side * .4} ${bot} L${x} ${bot} Z`, lg(g, x, 0, x + w * side, 0, [[0, mix(col, '#000', .35)], [.5, col], [1, mix(col, '#000', .2)]]), 5);
  for (let i = 1; i < 5; i++) line(g, [x + w * side * i / 6, top + 10, x + w * side * i / 9 + sw, bot - 20], 3, 'rgba(0,0,0,.18)', 'round', true);
  sh(g, `M${x - 6 * side} ${bot * .62} Q${x + w * side * .3} ${bot * .6 + 20} ${x + w * side * .35} ${bot * .62 - 10}`, null, 9, '#e0b040'); ell(g, x + w * side * .36, bot * .62 - 6, 14, 14, '#f0c850', 3); }
function frieze(g, y, h, kind, T) { sh(g, `M-600 ${y} L1700 ${y} L1700 ${y + h} L-600 ${y + h} Z`, lg(g, 0, y, 0, y + h, [[0, '#2a5aa8'], [1, '#1a3a7a']]), 0);
  line(g, [-600, y, 1700, y], 6, '#e0b040', 'butt', true); line(g, [-600, y + h, 1700, y + h], 6, '#e0b040', 'butt', true);
  for (let x = -560; x < 1700; x += kind === 'rosette' ? 110 : 70) { if (kind === 'rosette') { for (let i = 0; i < 8; i++) { const a2 = i / 8 * 6.28; ell(g, x + Math.cos(a2) * h * .22, y + h / 2 + Math.sin(a2) * h * .22, h * .1, h * .1, '#f2e6c4'); } ell(g, x, y + h / 2, h * .12, h * .12, '#e0b040'); }
    else sh(g, `M${x} ${y + h - 6} L${x + 35} ${y + 8} L${x + 70} ${y + h - 6} Z`, '#f2e6c4', 0); } }
function brazier(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); line(g, [-50, 0, 0, -220, 50, 0], 9, '#6a4a20', 'round', true); line(g, [0, 0, 0, -220], 9, '#6a4a20', 'round', true);
  sh(g, 'M-90 -230 Q0 -170 90 -230 L80 -250 L-80 -250 Z', lg(g, -90, 0, 90, 0, [[0, '#8a5a18'], [.5, '#f0c050'], [1, '#6a3a10']]), 5); fire(g, 0, -250, 1.3, T); glow(g, 0, -300, 700, 'rgba(255,170,80,1)', .5); g.restore(); }
function hangLamp(g, x, y, T) { const sw = Math.sin(T * 1.2 + x) * 8; line(g, [x, -400, x + sw, y - 40], 3, '#3a2a18', 'round', true); sh(g, `M${x + sw - 40} ${y - 40} L${x + sw + 40} ${y - 40} L${x + sw + 26} ${y + 20} L${x + sw - 26} ${y + 20} Z`, '#c08a30', 4); glow(g, x + sw, y, 260, 'rgba(255,200,110,1)', .55); ell(g, x + sw, y + 10, 10, 14, '#fff2b0'); }
function palm(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < 12; i++) sh(g, `M-14 ${-i * 60} L14 ${-i * 60} L12 ${-i * 60 - 62} L-12 ${-i * 60 - 62} Z`, i % 2 ? '#7a5634' : '#8a6440', 3);
  const sw = Math.sin(T * 1.1 + x) * .05; for (let i = 0; i < 9; i++) { const a2 = -Math.PI / 2 + (i - 4) * .38 + sw; g.save(); g.translate(0, -730); g.rotate(a2 + Math.PI / 2);
    sh(g, 'M0 0 C60 -30 160 -10 230 50 C150 20 70 20 0 10 Z', i % 2 ? '#3a6a2a' : '#4a7a32', 3); for (let j = 1; j < 6; j++) line(g, [j * 36, -12 + j * 6, j * 36 + 10, 24 + j * 4], 2, 'rgba(20,40,10,.4)', 'round', true); g.restore(); }
  for (let i = 0; i < 5; i++) ell(g, -20 + i * 10, -700 + (i % 2) * 10, 12, 12, '#a85a20', 2.4); g.restore(); }
function house(g, x, y, w, h, col, T, o = {}) { const dk = mix(col, '#2a1408', .3);
  sh(g, `M${x} ${y} L${x + w} ${y} L${x + w} ${y - h} L${x} ${y - h} Z`, lg(g, x, 0, x + w, 0, [[0, mix(col, '#fff', .08)], [1, dk]]), 5);
  sh(g, `M${x - 10} ${y - h} L${x + w + 10} ${y - h} L${x + w + 10} ${y - h - 24} L${x - 10} ${y - h - 24} Z`, dk, 4);
  for (let i = 0; i < Math.floor(w / 60); i++) ell(g, x + 30 + i * 60, y - h + 26, 8, 8, '#6a4020', 2);
  const dw = Math.min(90, w * .32); sh(g, `M${x + w * .5 - dw / 2} ${y} L${x + w * .5 - dw / 2} ${y - 150} Q${x + w * .5} ${y - 200} ${x + w * .5 + dw / 2} ${y - 150} L${x + w * .5 + dw / 2} ${y} Z`, o.lit ? lg(g, 0, y - 200, 0, y, [[0, '#ffcf7a'], [1, '#a8501a']]) : '#3a2214', 4);
  if (h > 320) { const wy = y - h + 90; sh(g, `M${x + 30} ${wy} L${x + 100} ${wy} L${x + 100} ${wy + 80} L${x + 30} ${wy + 80} Z`, o.lit ? '#ffd27a' : '#2a1a10', 4); for (let i = 1; i < 3; i++) line(g, [x + 30 + i * 23, wy, x + 30 + i * 23, wy + 80], 3, mix(col, '#000', .3), 'butt', true);
    if (o.lit) glow(g, x + 65, wy + 40, 160, 'rgba(255,190,90,1)', .5); }
  if (o.awning) { const a2 = o.awning; sh(g, `M${x + 10} ${y - 230} L${x + w - 10} ${y - 230} L${x + w + 20} ${y - 170} L${x - 20} ${y - 170} Z`, a2, 4); for (let i = 0; i < 6; i++) sh(g, `M${x + 10 + i * (w - 20) / 6} ${y - 230} L${x + 10 + (i + .5) * (w - 20) / 6} ${y - 230} L${x - 20 + (i + .5) * (w + 40) / 6} ${y - 170} L${x - 20 + i * (w + 40) / 6} ${y - 170} Z`, 'rgba(255,255,255,.35)'); }
  if (o.pot) { ell(g, x + w - 40, y - h - 40, 26, 20, '#b8683a', 3); for (let i = 0; i < 4; i++) line(g, [x + w - 40, y - h - 50, x + w - 60 + i * 14, y - h - 100 - (i % 2) * 20], 4, '#4a7a32', 'round', true); } }
function bunting(g, x0, x1, y, cols, T) { const sag = 60; line(g, [x0, y, (x0 + x1) / 2, y + sag, x1, y], 3, '#4a3020', 'round', true);
  for (let i = 1; i < 14; i++) { const k = i / 14, x = lerp(x0, x1, k), yy = y + sag * 4 * k * (1 - k) + Math.sin(T * 3 + i) * 2; sh(g, `M${x - 14} ${yy} L${x + 14} ${yy} L${x} ${yy + 34} Z`, cols[i % cols.length], 2.4); } }
// ---------------- the sets ----------------
SET.hall = (g, o, T) => { const F = o.floor || 1880;
  g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#6a4a34'], [1, '#c8a274']]); g.fillRect(-600, -600, 2300, 2200);
  for (let x = -520; x < 1700; x += 240) { sh(g, `M${x} 200 L${x + 200} 200 L${x + 200} 1480 L${x} 1480 Z`, null, 3, 'rgba(60,30,10,.25)'); }
  frieze(g, 560, 70, 'zig', T); frieze(g, 1220, 110, 'rosette', T);
  // arched niche behind the throne
  sh(g, 'M300 1480 L300 520 Q540 300 780 520 L780 1480 Z', lg(g, 0, 300, 0, 1480, [[0, '#1a2a6a'], [1, '#2a4aa0']]), 7, '#e0b040');
  for (let i = 0; i < 24; i++) { const x = 330 + (i * 97) % 420, y = 560 + (i * 151) % 820; txt(g, '✦', x, y, 30, 'rgba(240,210,120,.7)', null); }
  sh(g, 'M-600 1480 L1700 1480 L1700 1540 L-600 1540 Z', '#8a6a44', 4);
  tileFloor(g, 1540, '#d8c09a', '#a8784a');
  sh(g, `M420 1540 L660 1540 L900 2500 L180 2500 Z`, lg(g, 0, 1540, 0, 2500, [[0, '#8a1a24'], [1, '#5a0e16']]), 0); line(g, [430, 1540, 200, 2500], 10, '#e0b040', 'butt', true); line(g, [650, 1540, 880, 2500], 10, '#e0b040', 'butt', true);
  hangLamp(g, 150, 420, T); hangLamp(g, 930, 420, T);
  drape(g, -60, 230, -400, 1600, '#9a1a2a', 1, T); drape(g, 1140, 230, -400, 1600, '#9a1a2a', -1, T); };
SET.street = (g, o, T) => { const night = o.tod === 'night', dusk = o.tod === 'dusk';
  g.fillStyle = lg(g, 0, -400, 0, 1300, night ? [[0, '#0c1230'], [1, '#2a3a6a']] : dusk ? [[0, '#3a2a5a'], [.6, '#e0784a'], [1, '#ffc27a']] : [[0, '#6aa8d8'], [1, '#f4e6c4']]); g.fillRect(-600, -600, 2300, 2000);
  if (night) { ell(g, 820, 360, 50, 50, '#f4ecd0'); glow(g, 820, 360, 260, 'rgba(240,230,190,1)', .3); for (let i = 0; i < 40; i++) ell(g, (i * 137) % 1200 - 60, (i * 89) % 700, 2.4, 2.4, '#fff'); }
  else { sun(g, 820, dusk ? 900 : 380, 110, dusk ? '#ffd8a0' : '#fff6d8'); }
  // citadel on its terrace
  const cit = night ? '#1a1a34' : dusk ? '#8a4a54' : '#c8a882', citD = mix(cit, '#000', .2);
  sh(g, 'M-200 1180 L-200 1020 L1300 1020 L1300 1180 Z', citD, 0); sh(g, 'M80 1020 L80 860 L1000 860 L1000 1020 Z', cit, 4);
  for (let x = 100; x < 1000; x += 46) sh(g, `M${x} 860 L${x + 26} 860 L${x + 26} 836 L${x} 836 Z`, cit, 2);
  for (let x = 140; x < 960; x += 70) line(g, [x, 980, x, 880], 10, mix(cit, '#fff', .18), 'butt', true); sh(g, 'M440 1180 L640 1180 L600 1020 L480 1020 Z', mix(cit, '#fff', .1), 3);
  if (night) for (let x = 160; x < 960; x += 140) glow(g, x, 940, 70, 'rgba(255,190,90,1)', .6);
  palm(g, -40, 1300, .7, T); palm(g, 1120, 1320, .75, T);
  // street ground
  g.fillStyle = lg(g, 0, 1180, 0, 2400, night ? [[0, '#2a2a3a'], [1, '#141420']] : [[0, '#d8b888'], [1, '#a8784a']]); g.fillRect(-600, 1180, 2300, 1400);
  vpLines(g, -900, 2000, 1260, 2500, 540, 1100, 14, 'rgba(60,30,10,.12)', 2);
  // houses down both sides of the street
  const hc = night ? ['#3a3048', '#2a2a3e', '#463650'] : ['#d8b080', '#c89a68', '#e0bc8c'];
  [[-260, 1500, 330, 520, hc[0], '#c8402a'], [60, 1420, 200, 380, hc[1], null], [820, 1420, 200, 420, hc[2], null], [1020, 1500, 330, 560, hc[0], '#2a7aa8']].forEach(([x, y, w, h, c, aw], i) => house(g, x, y, w, h, c, T, { awning: aw, lit: night, pot: i % 2 === 0 }));
  bunting(g, 120, 960, 1080, ['#c8402a', '#e0b040', '#2a7aa8', '#3a8a4a'], T);
  // market stall
  if (o.stall !== false) { g.save(); g.translate(o.stallX ?? 140, 1640); sh(g, 'M-150 0 L150 0 L150 -110 L-150 -110 Z', '#7a5230', 5); [[-90, '#c8683a'], [-20, '#d8a040'], [60, '#a8502a']].forEach(([x, c]) => { ell(g, x, -140, 34, 30, c, 4); ell(g, x, -170, 14, 6, mix(c, '#000', .3), 3); });
    for (let i = 0; i < 6; i++) ell(g, 100 + (i % 3) * 18, -126 - Math.floor(i / 3) * 16, 10, 10, i % 2 ? '#e8b030' : '#c8302a', 2); g.restore(); }
  if (night) { glow(g, 540, 1500, 900, 'rgba(60,80,160,1)', .15); } };
SET.chamber = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#3a2a3a'], [1, '#6a4a4a']]); g.fillRect(-600, -600, 2300, 2200);
  // tapestry
  sh(g, 'M560 300 L1000 300 L1000 1100 L560 1100 Z', lg(g, 0, 300, 0, 1100, [[0, '#7a1a2a'], [1, '#4a0e18']]), 5); 
  for (let y = 380; y < 1080; y += 140) for (let x = 610; x < 980; x += 110) { for (let i = 0; i < 6; i++) { const a2 = i / 6 * 6.28; ell(g, x + Math.cos(a2) * 22, y + Math.sin(a2) * 22, 9, 9, '#e0b040'); } ell(g, x, y, 10, 10, '#2a5aa8'); }
  // lattice window with the moon
  sh(g, 'M80 420 L380 420 L380 1000 L80 1000 Z', '#0e1430', 6, '#5a3a24'); ell(g, 300, 520, 40, 40, '#f4ecd0'); for (let i = 1; i < 4; i++) { line(g, [80 + i * 75, 420, 80 + i * 75, 1000], 5, '#5a3a24', 'butt', true); line(g, [80, 420 + i * 145, 380, 420 + i * 145], 5, '#5a3a24', 'butt', true); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(160,190,255,.08)'; g.beginPath(); g.moveTo(80, 1000); g.lineTo(380, 1000); g.lineTo(700, 1900); g.lineTo(200, 1900); g.fill(); g.restore();
  tileFloor(g, 1500, '#6a4a34', '#4a3020');
  sh(g, 'M160 1600 L940 1600 L1100 2300 L0 2300 Z', lg(g, 0, 1600, 0, 2300, [[0, '#2a4a7a'], [1, '#1a2a4a']]), 5); line(g, [180, 1620, 20, 2280], 8, '#e0b040', 'butt', true); line(g, [920, 1620, 1080, 2280], 8, '#e0b040', 'butt', true);
  // canopy bed on the right
  if (o.bed !== false) { g.save(); g.translate(o.bedX ?? 780, 1640); limb(g, [-260, 0, -260, -760], 14, '#6a4020', 4); limb(g, [260, 0, 260, -760], 14, '#6a4020', 4); sh(g, 'M-300 -760 L300 -760 L300 -700 L-300 -700 Z', '#8a1a2a', 4);
    sh(g, 'M-280 -700 C-300 -400 -240 -200 -270 0 L-200 0 C-190 -300 -230 -500 -200 -700 Z', '#c8a0a8', 3); sh(g, 'M-250 -170 L250 -170 L270 0 L-270 0 Z', '#5a2a3a', 5); sh(g, 'M-250 -230 L250 -230 L250 -170 L-250 -170 Z', '#e8dcc8', 4); ell(g, -180, -260, 70, 40, '#f2ece0', 4); g.restore(); }
  if (o.lamp !== false) { g.save(); g.translate(o.lampX ?? 460, 1700); sh(g, 'M-60 0 L60 0 L50 -150 L-50 -150 Z', '#6a4020', 4); sh(g, 'M-30 -150 L30 -150 L20 -180 L-20 -180 Z', '#c08a30', 3); fire(g, 0, -186, .45, T); glow(g, 0, -200, 420, 'rgba(255,190,100,1)', .55); g.restore(); } };
SET.banquet = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#2a1a2a'], [1, '#6a3a3a']]); g.fillRect(-600, -600, 2300, 2200);
  for (let i = 0; i < 6; i++) { const x = -100 + i * 230, c = ['#8a1a2a', '#c8902a', '#2a5a8a'][i % 3]; sh(g, `M${x} 200 Q${x + 115} 420 ${x + 230} 200 L${x + 230} 180 L${x} 180 Z`, c, 4); }
  frieze(g, 1220, 90, 'rosette', T);
  [[-30, '#c0702a'], [1110, '#a8502a']].forEach(([x, c]) => { sh(g, `M${x - 50} 1500 C${x - 84} 1400 ${x - 44} 1300 ${x - 22} 1286 L${x + 22} 1286 C${x + 44} 1300 ${x + 84} 1400 ${x + 50} 1500 Z`, c, 5); line(g, [x - 44, 1420, x + 44, 1420], 4, 'rgba(255,230,180,.5)', 'butt', true); });
  bunting(g, -60, 1140, 620, ['#e0b040', '#c8402a', '#f2e6c4'], T); for (let i = 0; i < 7; i++) { const x = 60 + i * 160; glow(g, x, 700, 120, 'rgba(255,200,110,1)', .5); ell(g, x, 700, 12, 16, '#ffe6a0', 2); }
  tileFloor(g, 1500, '#c8a274', '#8a5a34');
  hangLamp(g, 240, 420, T); hangLamp(g, 840, 420, T); };
SET.home = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#8a6a4a'], [1, '#c8a27a']]); g.fillRect(-600, -600, 2300, 2200);
  for (let y = 120; y < 1500; y += 70) for (let x = -560 + ((y / 70) % 2) * 60; x < 1700; x += 120) sh(g, `M${x} ${y} l116 0 l0 66 l-116 0 Z`, null, 2, 'rgba(70,40,20,.2)');
  sh(g, 'M620 520 L860 520 L860 760 L620 760 Z', '#f8e0a8', 6, '#5a3a20'); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,220,150,.18)'; g.beginPath(); g.moveTo(620, 760); g.lineTo(860, 760); g.lineTo(700, 1800); g.lineTo(300, 1800); g.fill(); g.restore();
  sh(g, 'M60 900 L460 900 L460 930 L60 930 Z', '#6a4020', 4); [[110, '#b8683a', 50], [200, '#d8a060', 40], [290, '#9a5a30', 56], [390, '#c8783a', 36]].forEach(([x, c, r]) => { ell(g, x, 900 - r, r * .8, r, c, 4); ell(g, x, 900 - r * 2, r * .4, r * .18, mix(c, '#000', .3), 3); });
  g.fillStyle = lg(g, 0, 1500, 0, 2400, [[0, '#8a6a44'], [1, '#5a4028']]); g.fillRect(-600, 1500, 2300, 1000); sh(g, 'M180 1640 L900 1640 L1000 2200 L80 2200 Z', '#c8a060', 4); for (let i = 0; i < 9; i++) line(g, [200 + i * 80, 1640, 100 + i * 100, 2200], 3, 'rgba(90,60,20,.35)', 'butt', true); };
SET.gate = (g, o, T) => { const dusk = o.tod === 'dusk', night = o.tod === 'night';
  g.fillStyle = lg(g, 0, -400, 0, 1400, night ? [[0, '#0c1230'], [1, '#2a3a6a']] : dusk ? [[0, '#3a2a5a'], [.6, '#e0784a'], [1, '#ffc27a']] : [[0, '#6aa8d8'], [1, '#f4e6c4']]); g.fillRect(-600, -600, 2300, 2000);
  const wc = night ? '#2a2a4a' : '#c8a07a';
  [[-120, 420], [860, 420]].forEach(([x, w]) => { sh(g, `M${x} 1560 L${x + w * .8} 1560 L${x + w * .8} 380 L${x} 380 Z`, lg(g, x, 0, x + w, 0, [[0, wc], [1, mix(wc, '#000', .25)]]), 6); for (let i = 0; i < 6; i++) sh(g, `M${x + i * 56} 380 l34 0 l0 -40 l-34 0 Z`, wc, 3); });
  sh(g, 'M200 1560 L200 700 Q540 420 880 700 L880 1560 Z', lg(g, 0, 500, 0, 1560, [[0, '#2a5aa8'], [1, '#1a3a7a']]), 6); frieze(g, 760, 80, 'rosette', T);
  sh(g, 'M330 1560 L330 960 Q540 800 750 960 L750 1560 Z', night ? '#120c18' : '#3a2214', 5);
  g.fillStyle = lg(g, 0, 1560, 0, 2400, night ? [[0, '#2a2a3a'], [1, '#141420']] : [[0, '#d8b888'], [1, '#a8784a']]); g.fillRect(-600, 1560, 2300, 1000); vpLines(g, -900, 2000, 1560, 2500, 540, 1200, 14, 'rgba(60,30,10,.12)', 2); };
function detailPass(g, o, T) { // texture specks on walls and floor, contact shadow where wall meets floor, depth haze
  const r = rng(77), fy = o.wallBase || 1500;
  for (let i = 0; i < 260; i++) { const x = r() * 1300 - 110, y = r() * 2300 - 300; ell(g, x, y, 1.2 + r() * 2.2, 1 + r() * 1.6, r() > .5 ? 'rgba(40,20,10,.10)' : 'rgba(255,245,225,.08)'); }
  for (let i = 0; i < 18; i++) { const x = r() * 1200 - 60, y = 200 + r() * (fy - 300); line(g, [x, y, x + 10 + r() * 26, y + 6 + r() * 20, x + r() * 30, y + 26 + r() * 30], 1.4, 'rgba(50,25,10,.16)', 'round', true); }
  g.fillStyle = lg(g, 0, fy - 30, 0, fy + 90, [[0, 'rgba(20,10,5,0)'], [.35, 'rgba(20,10,5,.28)'], [1, 'rgba(20,10,5,0)']]); g.fillRect(-600, fy - 30, 2300, 120);
  g.fillStyle = lg(g, 0, 0, 0, fy, [[0, 'rgba(255,240,220,.06)'], [1, 'rgba(255,240,220,0)']]); g.fillRect(-600, -600, 2300, fy + 600); }
SC.set = (g, o, c) => { o = avAll(o, c.lt); (SET[o.set] || SET.hall)(g, o, c.T); detailPass(g, Object.assign({ wallBase: { street: 1180, gate: 1560 }[o.set] || 1500 }, o), c.T);
  for (const a of (o.actors || [])) { if (a.par != null && a.par !== 1) par(g, c, a.par, () => drawActor(g, a, c, {}, o)); else drawActor(g, a, c, {}, o); }
  if (o.front) o.front.forEach(a => drawActor(g, a, c, {}, o));
  dust(g, c.T, o.dustN ?? 18, 21, 'rgba(255,236,200,'); };
// a throne that seats its king: dais, carved back, the king (seated), then the front armrest
function throne2(g, a, T) { const s = a.s || 1, x = a.x, y = a.y; g.save(); g.translate(x, y); g.scale(s, s);
  sh(g, 'M-340 0 L340 0 L320 -40 L-320 -40 Z', '#8a6a44', 5); sh(g, 'M-300 -40 L300 -40 L280 -80 L-280 -80 Z', '#a8845a', 5); line(g, [-300, -60, 300, -60], 6, '#e0b040', 'butt', true);
  sh(g, 'M-200 -300 L-200 -900 C-200 -990 80 -990 80 -900 L80 -300 Z', lg(g, -200, 0, 80, 0, [[0, '#a8781a'], [.5, '#f0c84a'], [1, '#8a5a10']]), 6);
  sh(g, 'M-160 -340 L-160 -860 C-160 -920 40 -920 40 -860 L40 -340 Z', '#6a1a2a', 4); ell(g, -60, -960, 34, 34, '#f0d060', 4); glow(g, -60, -620, 600, 'rgba(255,210,120,1)', .28);
  sh(g, 'M-220 -330 L180 -330 L180 -290 L-220 -290 Z', '#c89a3a', 5); sh(g, 'M-200 -290 L-170 -290 L-160 -80 L-190 -80 Z', '#a8781a', 4); sh(g, 'M150 -290 L180 -290 L190 -80 L160 -80 Z', '#a8781a', 4);
  g.restore();
  if (a.king) warrior(g, Object.assign({ c: a.king, x: x - 50 * s, y: y - 80 * s, s: (a.ks || 1) * s, pose: 'sit', t: T }, a.kingOpts || {}));
  g.save(); g.translate(x, y); g.scale(s, s); sh(g, 'M150 -440 L210 -440 L210 -300 L150 -300 Z', '#d8a830', 5); ell(g, 180, -450, 26, 26, '#f0d060', 4); g.restore(); }
const _drawActorSet = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'throne2') { const ko = A.kingOpts ? Object.assign({}, A.kingOpts) : {}; for (const k in ko) if (ko[k] && typeof ko[k] === 'object' && 'a' in ko[k]) ko[k] = avAll({ v: ko[k] }, c.lt).v; if (A.who) ko.talk = c.V(A.who); return throne2(g, Object.assign({}, A, { kingOpts: ko }), c.T); }
  if (A.type === 'brazier') return brazier(g, A.x, A.y, A.s || 1, c.T);
  if (A.type === 'palm') return palm(g, A.x, A.y, A.s || 1, c.T);
  return _drawActorSet(g, a, c, P, o); };

// Walking only happens while a character is actually travelling: a 'stride' actor whose x is animated eases into a
// standing pose when the move ends (and stands before it starts); step rate follows the travel speed. Horses likewise.
const _drawActorWalk = drawActor;
drawActor = function (g, a, c, P, o) {
  if (a.type === 'w' && a.pose === 'stride' && !a.pose2 && a.x && typeof a.x === 'object' && a.x.t1 != null) {
    const lt = c.lt, t0 = +a.x.t0, t1 = +a.x.t1, sc = typeof a.s === 'number' ? a.s : 1, L = (typeof a.c === 'string' ? WAR[a.c] : a.c) || {};
    const amp = (L.long ?? (typeof LONG !== 'undefined' ? LONG[a.c] : 0)) ? 34 : 95, v = Math.abs(a.x.b - a.x.a) / Math.max(.01, t1 - t0);
    const mix = lt < t0 ? 1 : lt > t1 ? clamp((lt - t1) / .3) : clamp(1 - (lt - t0) / .2);
    a = Object.assign({}, a, { pose2: 'stand', mix, walkRate: clamp(v / (sc * amp), 2.5, 9) });
  }
  if (a.type === 'horse' && a.walk && a.x && typeof a.x === 'object' && a.x.t1 != null) a = Object.assign({}, a, { walk: c.lt >= +a.x.t0 && c.lt <= +a.x.t1 + .1 });
  return _drawActorWalk(g, a, c, P, o);
};
