// Episode 8 (Peter and the rooster): Peter, Jesus, the servant girl, the accuser, temple guards; the upper room, the olive
// garden at night, the high priest's courtyard with its charcoal fire, the Sea of Galilee at dawn; rooster, coals, boat.
Object.assign(WAR, {
  peter:   { skin: '#a8724c', tunic: '#7a5a3a', kilt: '#3a2a1a', cape: '#3a5a6a', beard: 'short', beardCol: '#2a1a10', hair: '#2a1a10', hairStyle: 'curly', nose: 'broad', jaw: 'square', brow: 1.5, helmet: null, bulk: 1.12, tall: 1.0, head: 1.02, weapon: null, shield: null, boots: '#5a3a1e', long: 0, trim: '#a88a5a' },
  peterR:  { skin: '#a8724c', tunic: '#8a6a44', kilt: '#3a2a1a', cape: null, beard: 'short', beardCol: '#2a1a10', hair: '#2a1a10', hairStyle: 'curly', nose: 'broad', jaw: 'square', brow: 1.5, helmet: null, bulk: 1.12, head: 1.02, weapon: null, shield: null, boots: '#5a3a1e', long: 0, trim: '#a88a5a' },
  jesus:   { skin: '#b07a52', tunic: '#efe6d2', kilt: '#c8a870', cape: '#3a5a9a', beard: 'short', beardCol: '#3a2414', hair: '#3a2414', hairStyle: 'long', nose: 'straight', jaw: 'round', brow: 1.1, helmet: null, bulk: .96, tall: 1.02, head: 1.0, weapon: null, shield: null, boots: '#7a5230', long: 1, trim: '#c8a870' },
  maid:    { female: 1, skin: '#c08a5e', tunic: '#b88a5a', kilt: '#6a4a2a', cape: null, beard: null, hair: '#2a1a10', hairStyle: 'pony', band: '#8a3a2a', nose: 'button', jaw: 'round', helmet: null, bulk: .82, tall: .96, head: 1.04, weapon: null, shield: null, boots: '#6a4a2a', long: 1, trim: '#a8783a', lips: '#a04a50' },
  accuser: { skin: '#9a6440', tunic: '#5a4a6a', kilt: '#2a2a3a', cape: '#3a2a3a', beard: 'goatee', beardCol: '#1a120c', hair: '#1a120c', hairStyle: 'short', nose: 'hook', jaw: 'square', brow: 1.8, helmet: null, bulk: 1.05, tall: 1.04, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1, trim: '#8a7a9a' },
  john:    { skin: '#c08a5e', tunic: '#8a3a2a', kilt: '#3a2a1a', cape: null, beard: null, hair: '#3a2010', hairStyle: 'wild', nose: 'button', jaw: 'round', brow: 1, helmet: null, bulk: .9, tall: .96, head: 1.02, weapon: null, shield: null, boots: '#5a3a1e', long: 0, trim: '#c89a5a' },
  andrew:  { skin: '#9a6440', tunic: '#5a6a4a', kilt: '#3a2a1a', cape: null, beard: 'stubble', beardCol: '#1a120c', hair: '#1a120c', hairStyle: 'tied', band: '#c8a050', nose: 'hook', jaw: 'square', brow: 1.3, helmet: null, bulk: 1.0, tall: 1.03, head: 1, weapon: null, shield: null, boots: '#4a2c1c', long: 0, trim: '#a89a6a' },
  tguard:  { skin: '#a8714c', tunic: '#6a4a2a', kilt: '#8a2a1a', cape: '#5a1a14', beard: 'short', beardCol: '#1a120c', hair: '#1a120c', helmet: 'bronze', bulk: 1.1, head: 1, weapon: 'spear', shield: null, boots: '#3a2418', armor: 'leather', armorCol: '#7a5230' },
});
// ---- props ----
function rooster(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  const c = a.crow != null && lt >= a.crow ? clamp((lt - a.crow) / .25) * (1 - clamp((lt - a.crow - 1.3) / .3)) : 0, bob = Math.sin(T * 3) * 3 * (1 - c);
  g.fillStyle = rg(g, 0, 0, 6, 90, [[0, 'rgba(20,10,10,.3)'], [1, 'rgba(20,10,10,0)']]); g.beginPath(); g.ellipse(0, 2, 90, 12, 0, 0, 7); g.fill();
  [[-14, '#d8a030'], [14, '#c88a20']].forEach(([x, col]) => { line(g, [x, -70, x - 4, -10, x + 6, 0], 7, col, 'round', true); line(g, [x + 6, 0, x + 26, 2], 5, col, 'round', true); line(g, [x + 6, 0, x - 12, 4], 5, col, 'round', true); });
  // sickle tail
  [['#1a3a2a', -2.5], ['#2a5a3a', -2.2], ['#7a2a1a', -1.9], ['#1a2a3a', -1.6]].forEach(([col, an], i) => { g.save(); g.translate(-60, -120); g.rotate(an + Math.sin(T * 2 + i) * .04); sh(g, 'M0 0 C40 -20 120 -10 160 40 C110 20 50 16 0 14 Z', col, 3.4); g.restore(); });
  sh(g, 'M-80 -110 C-90 -170 40 -190 70 -140 C96 -100 70 -60 20 -56 C-30 -52 -76 -70 -80 -110 Z', lg(g, -80, -190, 80, -56, [[0, '#e8a040'], [.5, '#c8502a'], [1, '#8a2a1a']]), 4.5);
  for (let i = 0; i < 4; i++) sh(g, `M${-50 + i * 22} -110 q12 30 24 0`, null, 2.4, 'rgba(255,220,150,.5)');
  g.save(); g.translate(54, -150 - c * 26 + bob); g.rotate(-c * .6);
  sh(g, 'M-30 30 C-40 -10 -20 -60 10 -66 C40 -70 56 -40 50 -10 C46 20 20 40 -30 30 Z', lg(g, -30, -66, 50, 30, [[0, '#f0b050'], [1, '#c8602a']]), 4);
  sh(g, 'M-6 -64 C-10 -96 10 -100 14 -78 C20 -104 40 -100 38 -76 C50 -90 64 -80 50 -60 Z', '#e8302a', 3.4); sh(g, 'M30 -6 Q36 22 24 30 Q16 16 22 -4 Z', '#e8302a', 3);
  sh(g, `M44 -36 L78 ${-28 - c * 10} L46 -22 Z`, '#e8b030', 3); if (c > .05) sh(g, `M46 -24 L${76} ${-14 + c * 6} L46 -18 Z`, '#e8b030', 3);
  ell(g, 24, -36, 7, 7, '#fff8e8', 2.4); ell(g, 26, -36, 3.6, 3.6, '#1a1210'); g.restore();
  if (c > .05) for (let i = 0; i < 3; i++) { const q = ((lt - a.crow) * 1.8 + i / 3) % 1; g.save(); g.globalAlpha = (1 - q) * c * .8; g.beginPath(); g.arc(140, -220 - c * 30, 30 + q * 180, -1.1, .5); g.lineWidth = 7; g.strokeStyle = '#fff4d0'; g.stroke(); g.restore(); }
  g.restore(); }
function coals(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  glow(g, 0, -30, 420, 'rgba(255,120,40,1)', .55 + .1 * Math.sin(T * 5));
  for (let i = 0; i < 9; i++) { const an = Math.PI * (1 + i / 8); ell(g, Math.cos(an) * 120, Math.sin(an) * 22 + 6, 28, 18, i % 2 ? '#6a6a72' : '#5a5a64', 3); }
  ell(g, 0, 0, 104, 22, '#1a0e0a', 3); const r = rng(5);
  for (let i = 0; i < 26; i++) { const x = (r() - .5) * 180, y = (r() - .6) * 22, f = .5 + .5 * Math.sin(T * (3 + r() * 4) + i); ell(g, x, y, 12 + r() * 8, 7 + r() * 4, `rgb(${200 + f * 55 | 0},${60 + f * 90 | 0},${20 + f * 20 | 0})`, 1.6, 0, '#2a0e06'); }
  for (let i = 0; i < 4; i++) { const h = 30 + 16 * Math.sin(T * 7 + i * 2); sh(g, `M${-50 + i * 34} -6 Q${-56 + i * 34} ${-h * .6} ${-44 + i * 34} ${-h} Q${-34 + i * 34} ${-h * .5} ${-36 + i * 34} -6 Z`, 'rgba(255,200,90,.85)'); }
  if (a.fish) { line(g, [-120, -30, 120, -30], 4, '#4a3a30', 'round', true); [[-60, -42], [10, -44], [70, -40]].forEach(([x, y], i) => { sh(g, `M${x - 30} ${y} Q${x} ${y - 16} ${x + 26} ${y} Q${x} ${y + 12} ${x - 30} ${y} Z`, '#a8a8a0', 3); sh(g, `M${x + 26} ${y} L${x + 40} ${y - 10} L${x + 40} ${y + 10} Z`, '#8a8a84', 2.4); ell(g, x - 18, y - 2, 2.4, 2.4, '#1a1210'); }); ell(g, 140, -6, 34, 18, '#d8a860', 3); ell(g, 136, -12, 16, 6, 'rgba(255,240,200,.4)'); }
  for (let i = 0; i < 3; i++) { const q = (T * .25 + i / 3) % 1; g.save(); g.globalAlpha = (1 - q) * .25; ell(g, Math.sin(T + i) * 30, -60 - q * 300, 20 + q * 50, 14 + q * 30, '#c8c0b8'); g.restore(); }
  g.restore(); }
function boat(g, a, T) { const bob = Math.sin(T * 1.4) * 6, roll = Math.sin(T * 1.1) * .02; g.save(); g.translate(a.x, a.y + bob); g.rotate(roll); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  if (a.part !== 'front') { sh(g, 'M-330 -120 L330 -120 L300 -100 L-300 -100 Z', '#6a4428', 3); if (a.net) { sh(g, 'M120 -120 C160 -200 260 -190 280 -120 Z', 'rgba(200,190,160,.85)', 3); for (let i = 0; i < 6; i++) line(g, [130 + i * 26, -122, 160 + i * 18, -184 + Math.abs(i - 3) * 8], 1.6, 'rgba(90,80,60,.6)', 'round', true);
      for (let i = 0; i < 9; i++) sh(g, `M${150 + (i % 5) * 24} ${-136 - Math.floor(i / 5) * 18} q12 -8 24 0 q-12 8 -24 0 Z`, '#b8c0c8', 2); } }
  if (a.part !== 'back') { sh(g, 'M-360 -130 C-330 -40 -240 0 0 0 C240 0 330 -40 360 -130 L320 -120 C280 -60 200 -40 0 -40 C-200 -40 -280 -60 -320 -120 Z', lg(g, 0, -130, 0, 0, [[0, '#9a6a3a'], [1, '#5a3a1e']]), 5);
    for (let i = 1; i < 4; i++) sh(g, `M${-340 + i * 8} ${-130 + i * 24} C-240 ${-40 + i * 8} 240 ${-40 + i * 8} ${340 - i * 8} ${-130 + i * 24}`, null, 2.4, 'rgba(40,20,10,.45)'); }
  g.restore(); }
function tomb(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-560 0 C-540 -300 -420 -560 -120 -600 C200 -640 460 -480 560 -200 L560 0 Z', lg(g, 0, -640, 0, 0, [[0, '#a8988a'], [1, '#6a5a52']]), 6);
  for (let i = 0; i < 9; i++) sh(g, `M${-480 + i * 110} ${-80 - (i * 67) % 300} q40 -20 80 4`, null, 3, 'rgba(40,30,30,.3)');
  sh(g, 'M-170 0 L-170 -230 Q0 -380 170 -230 L170 0 Z', '#0e0a0c', 6, '#3a2e2a');
  const ra = a.rays ?? 1; if (ra > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const an = -Math.PI / 2 + (i - 3) * .22 + Math.sin(T * .6 + i) * .03; g.globalAlpha = .18 * ra; g.fillStyle = '#fff2c8'; g.beginPath(); g.moveTo(0, -120); g.lineTo(Math.cos(an - .05) * 900, -120 + Math.sin(an - .05) * 900 + 700); g.lineTo(Math.cos(an + .05) * 900, -120 + Math.sin(an + .05) * 900 + 700); g.fill(); } g.restore(); glow(g, 0, -140, 420, 'rgba(255,240,200,1)', .8 * ra); }
  sh(g, 'M150 -80 L560 -80', null, 0); ell(g, 360, -200, 190, 200, lg(g, 200, -400, 520, 0, [[0, '#b8a898'], [1, '#7a6a60']]), 6); ell(g, 360, -200, 120, 128, null, 3, 0, 'rgba(40,30,30,.35)');
  sh(g, 'M-90 -12 Q0 -30 90 -12 L80 0 L-80 0 Z', '#efe6d2', 3);   // the folded grave cloth
  g.restore(); }
// ---- sets (shared floor line 1880) ----
SET.upper = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#3a2a24'], [1, '#7a5a42']]); g.fillRect(-600, -600, 2300, 2200);
  for (let y = 160; y < 1500; y += 90) for (let x = -560 + ((y / 90) % 2) * 80; x < 1700; x += 160) sh(g, `M${x} ${y} l156 0 l0 86 l-156 0 Z`, null, 2, 'rgba(30,15,8,.18)');
  sh(g, 'M640 420 L640 820 L940 820 L940 420 Q790 300 640 420 Z', lg(g, 0, 300, 0, 820, [[0, '#0c1230'], [1, '#2a3a6a']]), 7, '#3a2418'); ell(g, 860, 500, 30, 30, '#f4ecd0'); for (let i = 0; i < 14; i++) ell(g, 660 + (i * 53) % 260, 440 + (i * 71) % 360, 2.2, 2.2, '#fff');
  [[160, 640], [420, 600]].forEach(([x, y]) => { sh(g, `M${x - 26} ${y} L${x + 26} ${y} L${x + 18} ${y + 30} L${x - 18} ${y + 30} Z`, '#c08a30', 3); fire(g, x, y - 6, .4, T); glow(g, x, y, 300, 'rgba(255,190,100,1)', .5); });
  tileFloor(g, 1500, '#7a5a3a', '#5a4028');
  sh(g, 'M-60 1600 L1140 1600 L1140 1640 L-60 1640 Z', '#5a3a20', 4); sh(g, 'M-40 1640 L1120 1640 L1120 1740 L-40 1740 Z', lg(g, 0, 1640, 0, 1740, [[0, '#7a5230'], [1, '#4a3018']]), 5);
  [[180, '#d8a860'], [430, '#e8e0c8'], [640, '#d8a860'], [860, '#8a2a3a']].forEach(([x, c], i) => i === 3 ? (sh(g, `M${x - 24} 1600 L${x + 24} 1600 L${x + 16} 1560 L${x - 16} 1560 Z`, '#c0a040', 3), ell(g, x, 1560, 26, 8, c, 3)) : ell(g, x, 1588, 50, 16, c, 3)); };
SET.olives = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1400, [[0, '#060a1c'], [1, '#1a2448']]); g.fillRect(-600, -600, 2300, 2100); ell(g, 820, 360, 56, 56, '#f4ecd0'); glow(g, 820, 360, 300, 'rgba(230,230,200,1)', .25);
  for (let i = 0; i < 40; i++) ell(g, (i * 137) % 1200 - 60, (i * 89) % 800, 2.2, 2.2, '#fff');
  g.fillStyle = lg(g, 0, 1300, 0, 2400, [[0, '#1a2a24'], [1, '#0e1612']]); g.fillRect(-600, 1300, 2300, 1300);
  const tree = (x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); sh(g, 'M-40 0 C-30 -100 -80 -160 -40 -260 C-10 -320 20 -300 30 -240 C50 -170 10 -100 40 0 Z', '#3a2a24', 5); sh(g, 'M-20 -200 C-90 -260 -120 -300 -100 -330', null, 14, '#3a2a24');
    [[-140, -360, 120], [0, -420, 150], [130, -340, 110], [-60, -300, 100]].forEach(([cx, cy, r]) => ell(g, cx, cy, r, r * .7, lg(g, 0, cy - r, 0, cy + r, [[0, '#3a5a4a'], [1, '#1a2a24']]), 5)); g.restore(); };
  tree(-60, 1500, 1.4); tree(1120, 1520, 1.5); tree(560, 1320, .8); };
SET.courtyard = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 900, [[0, '#060a1c'], [1, '#1a2040']]); g.fillRect(-600, -600, 2300, 1700); for (let i = 0; i < 30; i++) ell(g, (i * 137) % 1200 - 60, (i * 89) % 500, 2, 2, '#fff');
  // walls
  sh(g, 'M-600 360 L1700 360 L1700 1500 L-600 1500 Z', lg(g, 0, 360, 0, 1500, [[0, '#4a3e40'], [1, '#6a5650']]), 0);
  for (let y = 380; y < 1500; y += 70) for (let x = -560 + ((y / 70) % 2) * 70; x < 1700; x += 140) sh(g, `M${x} ${y} l136 0 l0 66 l-136 0 Z`, null, 2, 'rgba(20,12,10,.22)');
  // the balcony / colonnade at the back (where Jesus stands under guard)
  sh(g, 'M-600 780 L560 780 L560 820 L-600 820 Z', '#3a2e30', 4); for (let x = -40; x < 560; x += 130) { sh(g, `M${x} 820 L${x + 34} 820 L${x + 34} 1180 L${x} 1180 Z`, '#5a4a48', 3); }
  sh(g, 'M-600 1180 L560 1180 L560 1220 L-600 1220 Z', '#3a2e30', 4); line(g, [-600, 1100, 560, 1100], 8, '#2a2224', 'butt', true);
  // the gate arch on the right
  sh(g, 'M700 1500 L700 900 Q880 760 1060 900 L1060 1500 Z', '#140c10', 6, '#2a2224');
  [[640, 760], [1100, 760], [200, 1260]].forEach(([x, y]) => { line(g, [x, y + 60, x, y], 8, '#3a2418', 'round', true); fire(g, x, y - 10, .5, T); glow(g, x, y, 380, 'rgba(255,170,80,1)', .55); });
  tileFloor(g, 1500, '#5a4a44', '#3a3030'); };
SET.shore = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1150, [[0, '#4a5a9a'], [.5, '#e8a07a'], [1, '#ffd8a0']]); g.fillRect(-600, -600, 2300, 1800);
  sun(g, 760, 1080, 120, '#fff0c8'); glow(g, 760, 1080, 600, 'rgba(255,220,160,1)', .4);
  sh(g, 'M-600 1120 C-300 980 0 1040 300 1000 C600 960 900 1060 1700 1010 L1700 1150 L-600 1150 Z', '#8a6a8a', 0); sh(g, 'M-600 1140 C-200 1080 300 1110 700 1080 C1000 1060 1300 1100 1700 1090 L1700 1160 L-600 1160 Z', '#6a5a7a', 0);
  g.fillStyle = lg(g, 0, 1150, 0, 1560, [[0, '#f0b080'], [.3, '#7aa0c8'], [1, '#3a6a9a']]); g.fillRect(-600, 1150, 2300, 420);
  for (let i = 0; i < 40; i++) { const x = ((i * 113 + T * 30) % 1500) - 200, y = 1170 + (i * 37) % 360, w = 20 + (i % 5) * 12; line(g, [x, y, x + w, y], 3, `rgba(255,${230 - (y - 1170) / 3 | 0},200,${.6 - (y - 1170) / 900})`, 'round', true); }
  g.fillStyle = lg(g, 0, 1560, 0, 2400, [[0, '#c8a880'], [1, '#8a7050']]); g.fillRect(-600, 1560, 2300, 1000); sh(g, 'M-600 1560 C-200 1590 300 1550 700 1580 C1000 1600 1300 1570 1700 1590 L1700 1610 L-600 1610 Z', 'rgba(255,255,255,.5)');
  const r = rng(8); for (let i = 0; i < 70; i++) ell(g, r() * 1300 - 110, 1620 + r() * 700, 6 + r() * 12, 4 + r() * 6, ['#9a8a7a', '#b8a890', '#7a6a5a'][i % 3], 1.4, 0, 'rgba(60,40,20,.4)'); };
const _drawActorGal = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'rooster') return rooster(g, A, c.lt, c.T); if (A.type === 'coals') return coals(g, A, c.T); if (A.type === 'boat') return boat(g, A, c.T); if (A.type === 'tomb') return tomb(g, A, c.lt, c.T);
  return _drawActorGal(g, a, c, P, o); };
