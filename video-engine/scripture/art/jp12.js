// JP12 She Destroyed Two Kingdoms: the nine-tailed fox before Japan. Daji and King Zhou (Shang), Lady Kayo and Prince Hanzoku (India),
// Bao Si and King You (Zhou, the beacon fires), the girl on the envoy ship. Every person here is new; Tamamo, Toba, Yasunari come from JP03.
function mianCrown(g, L, rx, ry) { tsh(g, `M${-rx * .7} ${-ry * .9} L${rx * .7} ${-ry * .9} L${rx * .62} ${-ry * 1.3} L${-rx * .62} ${-ry * 1.3} Z`, L.crown || '#1a1418', 4);   // a flat board crown with bead strings
  tsh(g, `M${-rx * 1.25} ${-ry * 1.34} L${rx * 1.25} ${-ry * 1.34} L${rx * 1.2} ${-ry * 1.46} L${-rx * 1.2} ${-ry * 1.46} Z`, L.crown || '#1a1418', 4); tln(g, [-rx * 1.2, -ry * 1.4, rx * 1.2, -ry * 1.4], 3, '#e8c050');
  for (let k = -4; k <= 4; k++) { if (Math.abs(k) < 2) continue; const x = k * rx * .28; tln(g, [x, -ry * 1.34, x, -ry * .7], 2, '#e8c050'); for (let j = 0; j < 4; j++) tell(g, x, -ry * 1.24 + j * ry * .16, 4, 4, j % 2 ? '#d23a3a' : '#2fa888', 1.6); } }
function hairPins(g, L, rx, ry) { [-1, 1].forEach(sd => { tln(g, [sd * rx * .2, -ry * 1.1, sd * rx * 1.4, -ry * 1.5], 6, L.pin || '#e8c050'); tell(g, sd * rx * 1.4, -ry * 1.5, 12, 12, L.gem || '#d23a3a', 3);
  for (let j = 1; j <= 3; j++) { tln(g, [sd * rx * (.4 + j * .3), -ry * (1.15 + j * .1), sd * rx * (.4 + j * .3), -ry * (.9 + j * .1)], 2, L.pin || '#e8c050'); tell(g, sd * rx * (.4 + j * .3), -ry * (.88 + j * .1), 4, 4, L.gem || '#d23a3a', 1.4); } }); }
function bindi(g, L, rx, ry) { tell(g, 0, -ry * .42, 6, 6, '#c8202a', 2); tln(g, [-rx * .5, -ry * .74, 0, -ry * .62, rx * .5, -ry * .74], 3, '#e8c050'); tell(g, 0, -ry * .6, 7, 9, '#2fa888', 2.4);
  [-1, 1].forEach(sd => tell(g, sd * rx * 1.0, ry * .3, 8, 8, '#e8c050', 2.4)); }
function turban(g, L, rx, ry) { tsh(g, `M${-rx * 1.1} ${-ry * .4} C${-rx * 1.3} ${-ry * 1.5} ${rx * 1.3} ${-ry * 1.5} ${rx * 1.1} ${-ry * .4} Q0 ${-ry * .62} ${-rx * 1.1} ${-ry * .4} Z`, L.turban || '#e88a2a', 5);
  for (let k = 0; k < 4; k++) tln(g, [-rx * (1.0 - k * .1), -ry * (.6 + k * .2), rx * (1.0 - k * .1), -ry * (.8 + k * .18)], 3, 'rgba(120,50,10,.45)'); tell(g, 0, -ry * .78, 12, 14, '#2fa888', 3); tln(g, [0, -ry * .92, 8, -ry * 1.4], 5, '#f6f2e6'); }
Object.assign(TOON, {
  daji:    { kind: 'adult', female: true, age: .25, skin: '#f8e4d4', skinD: '#e2c6b2', hair: '#0e0a10', hairHi: '#3a3046', hairStyle: 'bun', tie: '#c8302a', top: '#1e1218', topD: '#140a10', pat: 'clouds', patCol: 'rgba(232,192,80,.6)', collar: '#c8302a',
             layers: ['#e8c050', '#c8302a'], sleeve: 'wide', bottom: 'skirt', skirt: '#8a1a22', skirtD: '#6a1018', pleats: '#1e1218', belt: '#e8c050', feet: 'straw', eyes: 'adult', eyeShape: 'upturned', iris: '#3a1a10', lashes: true, brow: 4, lips: '#c8202a', jaw: 'pointed', nose: 'button', h: .97, headX: hairPins },
  kingZhou:{ kind: 'adult', age: .55, skin: '#e2b48a', skinD: '#c49268', hair: '#141016', hairHi: '#3a3040', hairStyle: 'short', top: '#2a1a10', topD: '#1e120a', pat: 'diamond', patCol: 'rgba(232,192,80,.45)', collar: '#e8c050', trimCol: '#8a1a22', trimDot: '#e8c050',
             sleeve: 'wide', bottom: 'hakama', hakama: '#3a2416', hakamaD: '#2a1a0e', belt: '#e8c050', feet: 'straw', wraps: '#2a1a10', eyes: 'adult', eyeShape: 'narrow', iris: '#2a1810', brow: 9, beard: 'short', jaw: 'wide', nose: 'broad', bulk: 1.38, h: 1.05, headX: mianCrown },
  kayo:    { kind: 'adult', female: true, age: .2, skin: '#c8885a', skinD: '#a86c42', hair: '#120c0e', hairHi: '#40303a', hairStyle: 'long', top: '#1e7a7a', topD: '#16605e', pat: 'dots', patCol: 'rgba(240,200,90,.75)', collar: '#e8c050',
             sleeve: 'kinu', cord: '#e8c050', bottom: 'skirt', skirt: '#b02a6a', skirtD: '#8a1e52', pleats: '#e8c050', belt: '#e8c050', feet: 'straw', eyes: 'adult', eyeShape: 'big', iris: '#2a1408', lashes: true, brow: 5, lips: '#a82040', jaw: 'pointed', nose: 'long', h: .96, headX: bindi },
  hanzoku: { kind: 'adult', age: .3, skin: '#b8784c', skinD: '#985e36', hair: '#140e10', hairHi: '#3a2e34', hairStyle: 'side', moustache: true, top: '#efe2b8', topD: '#d6c698', pat: 'diamond', patCol: 'rgba(200,120,40,.4)', collar: '#c8302a', trimCol: '#c8302a', trimDot: '#e8c050',
             sleeve: 'kinu', cord: '#e8c050', bottom: 'pants', pants: '#7a2a4a', shoes: '#5a3a22', eyes: 'adult', eyeShape: 'almond', iris: '#2a1408', brow: 8, jaw: 'square', nose: 'long', bulk: 1.2, h: 1.03, turban: '#e88a2a', headX: turban },
  baosi:   { kind: 'adult', female: true, age: .18, skin: '#fbefe6', skinD: '#e6d0c2', hair: '#14101a', hairHi: '#4a4060', hairStyle: 'bun', tie: '#c8d8e8', top: '#c4d6e6', topD: '#a4bad0', pat: 'clouds', patCol: 'rgba(255,255,255,.55)', collar: '#f6f2ee',
             layers: ['#7a9ab8'], sleeve: 'wide', bottom: 'skirt', skirt: '#6a86a4', skirtD: '#52708e', pleats: '#c4d6e6', belt: '#e8e4dc', feet: 'straw', eyes: 'adult', eyeShape: 'narrow', iris: '#2a2030', lashes: true, brow: 3, lips: '#d07a88', jaw: 'pointed', nose: 'button', h: .95, pin: '#e8e4dc', gem: '#7ab0d8', headX: hairPins },
  kingYou: { kind: 'adult', age: .08, skin: '#f0caa4', skinD: '#d6a882', hair: '#16121a', hairHi: '#4a4258', hairStyle: 'short', top: '#5a2a7a', topD: '#44205e', pat: 'clouds', patCol: 'rgba(232,192,80,.45)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#5a2a7a',
             sleeve: 'wide', bottom: 'hakama', hakama: '#3a1a52', hakamaD: '#2c123e', belt: '#e8c050', feet: 'straw', wraps: '#f2ecde', eyes: 'adult', eyeShape: 'round', iris: '#2a1810', brow: 6, jaw: 'round', nose: 'button', bulk: 1.05, h: 1.0, crown: '#3a1a52', headX: mianCrown },
  wakamo:  { kind: 'adult', female: true, age: 0, skin: '#f8e0cc', skinD: '#e2c2aa', hair: '#100c12', hairHi: '#3a3448', hairStyle: 'ponytail', tie: '#f2ecde', top: '#6a8aa0', topD: '#526e84', pat: 'waves', patCol: 'rgba(255,255,255,.35)', collar: '#f2ecde',
             sleeve: 'kinu', cord: '#f2ecde', bottom: 'skirt', skirt: '#3a4a5a', skirtD: '#2a3846', belt: '#c8a868', feet: 'straw', eyes: 'adult', eyeShape: 'big', iris: '#2a1810', lashes: true, brow: 3, jaw: 'pointed', nose: 'button', h: .86, bulk: .9 },
});

// ---------- props ----------
JPA.winePool = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);   // a stone pool brimming with dark red wine, ripples and a floating cup
  tsh(g, 'M-460 0 Q-480 -60 -400 -80 L400 -80 Q480 -60 460 0 Q480 60 400 80 L-400 80 Q-480 60 -460 0 Z', '#8a8478', 6); tsh(g, 'M-420 0 Q-436 -46 -370 -60 L370 -60 Q436 -46 420 0 Q436 46 370 60 L-370 60 Q-436 46 -420 0 Z', lg(g, 0, -60, 0, 60, [[0, '#7a1020'], [1, '#3a0610']]), 4);
  for (let k = 0; k < 5; k++) { const q = (T * .4 + k / 5) % 1; g.save(); g.globalAlpha = (1 - q) * .5; g.beginPath(); g.ellipse(-120 + k * 70, 0, 30 + q * 180, 8 + q * 40, 0, 0, 7); g.lineWidth = 3; g.strokeStyle = '#e87080'; g.stroke(); g.restore(); }
  g.save(); g.translate(160 + Math.sin(T * .7) * 60, Math.sin(T) * 8); tsh(g, 'M-30 -10 L30 -10 L20 12 L-20 12 Z', '#c8a040', 3); g.restore(); glow(g, 0, 0, 380, 'rgba(255,60,80,1)', .18); g.restore(); };
JPA.meatTrees = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);   // bare trees hung with cuts of meat on hooks
  (A.xs || [-300, 0, 300]).forEach((x, i) => { tln(g, [x, 0, x, -520], 26, '#3a2418'); tln(g, [x, -380, x - 140, -500], 14, '#3a2418'); tln(g, [x, -420, x + 150, -540], 14, '#3a2418'); tln(g, [x, -300, x + 120, -380], 10, '#3a2418');
    [[x - 120, -480], [x + 130, -520], [x + 100, -360], [x - 40, -560]].forEach(([mx, my], k) => { const sw = Math.sin(T * 1.4 + i + k) * .12; g.save(); g.translate(mx, my); g.rotate(sw); tln(g, [0, 0, 0, 30], 3, '#8a8478');
      tsh(g, 'M-22 30 C-34 60 -30 110 0 124 C30 110 34 60 22 30 Z', '#b8484a', 4); tsh(g, 'M-10 46 C-16 70 -12 96 0 104 C10 96 14 70 8 46 Z', '#e8a0a0', 0); g.restore(); }); });
  g.restore(); };
JPA.hotPillar = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);   // a bronze pillar laid over coals, glowing red-hot
  for (let i = 0; i < 9; i++) fire(g, -320 + i * 80, -10, .7, T + i, .8); tsh(g, 'M-380 -60 L380 -60 L380 -20 L-380 -20 Z', lg(g, -380, 0, 380, 0, [[0, '#ff5a20'], [.5, '#ffd060'], [1, '#ff5a20']]), 5);
  glow(g, 0, -40, 520, 'rgba(255,90,30,1)', .5 + .15 * Math.sin(T * 6)); [-360, 360].forEach(x => tsh(g, `M${x - 20} -60 L${x + 20} -60 L${x + 30} 40 L${x - 30} 40 Z`, '#5a3a22', 4)); g.restore(); };
JPA.beacons = (g, A, c) => { const T = c.T, lit = A.lit ?? 1; g.save(); (A.pts || [[160, 1180, .9], [520, 1060, .7], [860, 980, .55], [1000, 900, .4]]).forEach(([x, y, s], i) => { g.save(); g.translate(x, y); g.scale(s, s);   // stone beacon towers on the ridges
  tsh(g, 'M-60 0 L60 0 L44 -220 L-44 -220 Z', '#6a6458', 5); tsh(g, 'M-56 -220 L56 -220 L56 -250 L-56 -250 Z', '#4a443a', 4); if (lit > i * .25) { fire(g, 0, -260, 1.6, T + i * 1.7); glow(g, 0, -300, 520, 'rgba(255,140,50,1)', .6); tln(g, [0, -330, Math.sin(T + i) * 40, -620], 26, 'rgba(60,50,50,.35)'); }
  g.restore(); }); g.restore(); };

// ---------- worlds ----------
JSETS.shang = { light: { x: 1, col: 'rgba(255,150,90,1)', rim: .85, shade: .4 },   // the Shang palace at night: bronze, lacquer red, lanterns, smoke
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('sh_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#0e0610'], [.7, '#3a1018'], [1, '#6a2018']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 60, 301, 600, .6); })));
    layerAt(g, c, .25, () => blit(g, cacheLayer('sh_hall', x => { sh(x, 'M-700 700 L1780 700 L1780 1560 L-700 1560 Z', '#2a140e'); for (let i = 0; i < 9; i++) { const px = -560 + i * 290; sh(x, `M${px} 1560 L${px + 60} 1560 L${px + 60} 640 L${px} 640 Z`, '#8a1a1a'); sh(x, `M${px - 14} 660 L${px + 74} 660 L${px + 74} 620 L${px - 14} 620 Z`, '#c8a040'); }
      sh(x, 'M-700 640 L1780 640 L1780 560 L-700 560 Z', '#1a0a08'); for (let i = 0; i < 18; i++) sh(x, `M${-700 + i * 140} 600 L${-630 + i * 140} 540 L${-560 + i * 140} 600 Z`, '#c8a040'); }, { blur: .8 })));
    layerAt(g, c, .45, () => { for (let i = 0; i < 6; i++) { const x = -100 + i * 260, y = 820 + Math.sin(T * 1.2 + i) * 6; tln(g, [x, 560, x, y - 40], 2, '#3a2418'); glow(g, x, y, 160, 'rgba(255,90,50,1)', .55); tell(g, x, y, 34, 44, '#d8302a', 4); tln(g, [x - 30, y, x + 30, y], 2, '#e8c050'); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('sh_floor', x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, [[0, '#4a2a1e'], [1, '#1a0c08']]); x.fillRect(-700, 1560, 2480, 1300); for (let i = 0; i < 14; i++) line(x, [-700 + i * 200, 1560, -1000 + i * 260, 2700], 3, 'rgba(200,140,60,.18)'); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,60,40,.07)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.india = { light: { x: -1, col: 'rgba(255,200,120,1)', rim: .8, shade: .3 },   // a sandstone palace at sunset: arches, domes, palms
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('in_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#5a3a7a'], [.5, '#e8806a'], [1, '#ffd08a']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 760, 1150, 420, 'rgba(255,220,140,1)', .8); })));
    layerAt(g, c, .3, () => blit(g, cacheLayer('in_pal', x => { const st = '#e8b07a', sd = '#c88a5a'; sh(x, 'M-700 900 L1780 900 L1780 1560 L-700 1560 Z', st);
      [[-200, 760, 160], [540, 620, 260], [1280, 760, 160]].forEach(([dx, dy, r]) => { sh(x, `M${dx - r} ${dy + r} Q${dx - r} ${dy - r * .3} ${dx} ${dy - r} Q${dx + r} ${dy - r * .3} ${dx + r} ${dy + r} Z`, '#f2d4a8'); line(x, [dx, dy - r, dx, dy - r - 70], 6, '#c8a040'); ell(x, dx, dy - r - 76, 10, 10, '#c8a040'); sh(x, `M${dx - r - 20} ${dy + r} L${dx + r + 20} ${dy + r} L${dx + r + 20} 900 L${dx - r - 20} 900 Z`, st); });
      for (let i = 0; i < 10; i++) { const px = -620 + i * 260; sh(x, `M${px} 1560 L${px} 1200 Q${px + 90} 1040 ${px + 180} 1200 L${px + 180} 1560 Z`, '#7a3a2a'); line(x, [px - 10, 1560, px - 10, 1150], 14, sd); } sh(x, 'M-700 900 L1780 900 L1780 930 L-700 930 Z', sd); }, { blur: .7 })));
    layerAt(g, c, .6, () => { [[-60, 1560], [1140, 1560]].forEach(([px, py], i) => { line(g, [px, py, px + 30, py - 620], 22, '#5a3a22', 'round'); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .45 + Math.sin(T + k) * .04; line(g, [px + 30, py - 620, px + 30 + Math.cos(a) * 240, py - 620 + Math.sin(a) * 240 + 80], 18, '#2a5a3a', 'round'); } }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('in_floor', x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, [[0, '#d8a878'], [1, '#8a5a3a']]); x.fillRect(-700, 1560, 2480, 1300); for (let i = 0; i < 12; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) { x.fillStyle = 'rgba(120,60,30,.18)'; x.fillRect(-700 + i * 220, 1580 + j * 200, 220, 200); } }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,170,90,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.beacon = { light: { x: 1, col: 'rgba(255,170,90,1)', rim: .9, shade: .45 },   // Zhou ridges at night, beacon towers stepping away into the dark
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('bc_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#060814'], [1, '#2a2440']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 140, 302, 900); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('bc_far', x => { ridge(x, 1150, 260, '#1a1a2a', 303, {}); }, { blur: 1.2 })));
    layerAt(g, c, .35, () => { ridge(g, 1350, 200, '#121220', 304, {}); JPA.beacons(g, { lit: o.lit ?? 1 }, c); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('bc_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#2a2430'], [1, '#0e0a10']]); x.fillRect(-700, 1540, 2480, 1300); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,120,50,.05)'; g.fillRect(0, 0, 1080, 1920); } };
