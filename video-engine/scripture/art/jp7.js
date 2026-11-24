// JP07 Hoichi the Earless: the blind biwa player, the temple priest, the ghost samurai and the drowned Heike court; floating ears,
// ghost fires; Amidaji temple by the strait at night, the phantom golden hall, the Heike graveyard, Akama Shrine today.

Object.assign(TOON, {
  hoichi: { kind: 'adult', skin: '#e8c4a0', skinD: '#cca27c', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'none', top: '#2e2e40', topD: '#22222e', pat: 'diamond', patCol: 'rgba(180,180,220,.15)', collar: '#e8e2d2',
    trimCol: '#5a4a6a', trimDot: '#c8a040', sleeve: 'wide', bottom: 'skirt', skirt: '#26263a', skirtD: '#1a1a2a', belt: '#5a4a6a', feet: 'straw', eyes: 'adult', iris: '#2a1810', brow: 6, jaw: 'round', h: .96,
    frontX: (g, L, G) => { tsh(g, `M${-60} ${G.shY + 10} L${30} ${G.waist + 40} L${70} ${G.waist + 20} L${-20} ${G.shY - 6} Z`, '#8a6a3a', 3.4); } },   // the kesa sash
  osho: { kind: 'adult', skin: '#d8a880', skinD: '#b8885e', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'none', top: '#3a3a3a', topD: '#2a2a2a', pat: null, collar: '#e8e2d2', trimCol: '#8a6a3a', trimDot: '#c8a040',
    sleeve: 'wide', bottom: 'skirt', skirt: '#2e2e2e', skirtD: '#1e1e1e', belt: '#8a6a3a', feet: 'straw', eyes: 'adult', iris: '#2a1810', brow: 9, browCol: '#e8e2d8', beard: null, jaw: 'square', h: 1.0,
    frontX: (g, L, G) => { tsh(g, `M${-70} ${G.shY + 10} L${40} ${G.waist + 50} L${84} ${G.waist + 24} L${-24} ${G.shY - 6} Z`, '#c8902a', 3.4); } },
  heikeSam: { kind: 'adult', skin: '#c8b8a8', skinD: '#a89888', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'mizura', cord: '#a8242a', top: '#5a1e1e', topD: '#441616', pat: 'waves', patCol: 'rgba(240,200,120,.3)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#5a1e1e',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#2a2a34', hakamaD: '#1e1e26', belt: '#a8242a', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', iris: '#140c08', brow: 10, beard: 'short', jaw: 'square', armor: '#5a1e1e', rivet: '#e8c050', kabuto: '#14141c', bulk: 1.15, h: 1.04 },
});
Object.assign(THOLD, {
  biwa: (g, h, o, t) => { g.save(); g.translate(h[0] - 30, h[1] + 30); g.rotate(-.55); // pear body low, neck up to the left hand
    tsh(g, 'M-12 -150 L12 -150 L16 -330 L-16 -330 Z', '#4a2a16', 4); tsh(g, 'M-22 -330 L22 -330 L30 -380 L-30 -380 Z', '#2a1810', 4); [-1, 1].forEach(sd => tln(g, [sd * 26, -352, sd * 46, -360], 6, '#e8dcc0'));
    tsh(g, 'M0 -170 C70 -170 110 -80 100 10 C92 90 50 130 0 130 C-50 130 -92 90 -100 10 C-110 -80 -70 -170 0 -170 Z', lg(g, -100, 0, 100, 0, [[0, '#6a3a1a'], [.5, '#a86a32'], [1, '#6a3a1a']]), 5);
    [-1, 1].forEach(sd => tsh(g, `M${sd * 40} -40 Q${sd * 56} -20 ${sd * 40} 0 Q${sd * 48} -20 ${sd * 40} -40 Z`, '#1a0e08', 2)); tsh(g, 'M-50 70 L50 70 L46 86 L-46 86 Z', '#2a1810', 3);
    for (let k = 0; k < 4; k++) tln(g, [-12 + k * 8, -330, -14 + k * 9, 78], 1.4, 'rgba(250,240,210,.8)'); g.restore();
    g.save(); g.translate(h[0] + 8, h[1] - 4); g.rotate(-.9 + Math.sin(t * 6) * .25 * (o.strum ?? 1)); tsh(g, 'M0 0 L70 -40 L80 10 Z', '#efe6cf', 3.4); g.restore(); },
});
const BIWA = { arms: [[-150, -640], [40, -500]], hold: 'biwa' };

// ---------- floating ears and ghost fires ----------
JPA.ears = (g, A, c) => { const T = c.T, s = A.s || 1, gap = A.gap ?? 150; g.save(); g.translate(A.x, A.y + Math.sin(T * 1.6) * 8); g.scale(s, s); if (A.a != null) g.globalAlpha *= A.a;
  glow(g, 0, 0, 340, 'rgba(255,200,170,1)', .25);
  [-1, 1].forEach(sd => { g.save(); g.translate(sd * gap / 2, 0); g.scale(sd, 1); tsh(g, 'M0 -40 C30 -46 40 -10 30 16 C22 38 6 44 -2 34 C10 26 12 6 4 -6 C-4 -18 -10 -30 0 -40 Z', '#e8c4a0', 5); tln(g, [14, -24, 22, 0, 12, 18], 3, '#c09070'); g.restore(); });
  g.restore(); };
JPA.onibi = (g, A, c) => { const T = c.T, r = rng(A.seed || 71), n = A.n || 8; g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const an = r() * 6.28 + T * (A.spin ?? .4) * (i % 2 ? 1 : -1), rad = (A.r || 300) * (.5 + r() * .5), x = A.x + Math.cos(an) * rad, y = A.y + Math.sin(an) * rad * .45 + Math.sin(T * 2 + i) * 30, s = (A.s || 1) * (.7 + r() * .6), fl = Math.sin(T * 9 + i) * .15;
    glow(g, x, y, 120 * s, 'rgba(120,190,255,1)', .5); g.save(); g.translate(x, y); g.scale(s, s * (1 + fl)); g.rotate(Math.sin(T * 3 + i) * .2);
    sh(g, 'M0 -70 C26 -40 34 -4 22 18 C12 34 -12 34 -22 18 C-34 -4 -26 -40 0 -70 Z', 'rgba(150,210,255,.75)'); sh(g, 'M0 -34 C12 -16 14 4 8 14 C2 22 -6 22 -10 14 C-14 4 -10 -16 0 -34 Z', 'rgba(240,250,255,.95)'); g.restore(); }
  g.restore(); };

// ---------- sets ----------
function gorinto(x, cx, cy, s, col) { x.save(); x.translate(cx, cy); x.scale(s, s); const D = col; sh(x, 'M-50 0 L50 0 L50 -60 L-50 -60 Z', D); ell(x, 0, -92, 44, 36, D); sh(x, 'M-60 -122 L60 -122 Q40 -150 0 -160 Q-40 -150 -60 -122 Z', D);
  ell(x, 0, -178, 26, 20, D); sh(x, 'M0 -230 C18 -214 18 -196 0 -192 C-18 -196 -18 -214 0 -230 Z', D); x.restore(); }
JSETS.temple = { light: { x: 1, col: 'rgba(170,200,255,1)', rim: .8, shade: .32 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('tp_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#04061a'], [.6, '#141c40'], [1, '#2e3460']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 200, 211, 800); glow(x, 840, 300, 500, 'rgba(170,190,255,1)', .3); moonF(x, 840, 300, 80); })));
    layerAt(g, c, .1, () => blit(g, cacheLayer('tp_sea', x => { ridge(x, 1160, 140, '#141a34', 212, {}); waterF(x, 1170, 1420, '#2a3466', '#0e1430', 213); for (let i = 0; i < 14; i++) line(x, [840 - 60 - i * 6, 1190 + i * 16, 840 + 60 + i * 6, 1190 + i * 16], 3, `rgba(220,230,255,${.5 - i * .03})`, 'round'); }, { blur: 1 })));
    layerAt(g, c, .35, () => blit(g, cacheLayer('tp_pine', x => { pine(x, -120, 1460, 1.4); pine(x, 1180, 1440, 1.6); }, { blur: .6 })));
    layerAt(g, c, .7, () => { blit(g, cacheLayer('tp_hall', x => { sh(x, 'M-700 1180 L1780 1180 L1780 1110 L-700 1110 Z', '#1a1418'); for (let i = 0; i < 8; i++) { const px = -500 + i * 330; sh(x, `M${px} 1560 L${px + 26} 1560 L${px + 26} 1180 L${px} 1180 Z`, '#2a1a14'); }
        for (let i = 0; i < 7; i++) { const px = -470 + i * 330; x.fillStyle = 'rgba(255,200,130,.85)'; x.fillRect(px, 1220, 300, 300); for (let k = 1; k < 4; k++) line(x, [px, 1220 + k * 75, px + 300, 1220 + k * 75], 4, '#2a1a14'); for (let k = 1; k < 3; k++) line(x, [px + k * 100, 1220, px + k * 100, 1520], 4, '#2a1a14'); }
        sh(x, 'M-700 1560 L1780 1560 L1780 1600 L-700 1600 Z', '#3a2a22'); }, {}));
      glow(g, 540, 1380, 900, 'rgba(255,170,90,1)', .18 + .04 * Math.sin(T * 3)); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('tp_deck', x => planksF(x, 1600, 2800, '#4a3830', '#1a120e', 214), { y0: 1550, h: 1250 })));
  },
  front(g, o, c, T) { fireflies(g, T, 10, 215, [-200, 900, 1300, 1700], 'rgba(200,230,255,1)'); },
  haze(g) { g.fillStyle = 'rgba(40,60,150,.07)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.illusion = { light: { x: -1, col: 'rgba(255,220,150,1)', rim: .8, shade: .3 },
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('il_back', x => { x.fillStyle = '#2a1008'; x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 6; i++) { const px = -500 + i * 380; x.fillStyle = lg(x, px, 600, px + 360, 1500, [[0, '#e8b850'], [.5, '#fff0b8'], [1, '#c8902a']]); x.fillRect(px, 640, 360, 900);
        for (let k = 0; k < 3; k++) cloudF(x, px + 60 + k * 90, 820 + k * 200, .35, 'rgba(255,255,255,.5)', null); pine(x, px + 180, 1500, .5); line(x, [px, 640, px, 1540], 6, '#3a1a0c'); }
      for (let i = 0; i < 7; i++) sh(x, `M${-520 + i * 380} 560 L${-480 + i * 380} 560 L${-480 + i * 380} 1580 L${-520 + i * 380} 1580 Z`, '#a8242a'); sh(x, 'M-700 560 L1780 560 L1780 500 L-700 500 Z', '#7a1a1a'); }, { blur: .5 })));
    layerAt(g, c, .6, () => { for (let i = 0; i < 5; i++) { chochin(g, -100 + i * 320, 640, 1.0, T, i); glow(g, -100 + i * 320, 680, 260, 'rgba(255,190,100,1)', .45); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('il_floor', x => { planksF(x, 1580, 2800, '#7a4a2a', '#2a140a', 216); x.fillStyle = lg(x, 0, 1580, 0, 1800, [[0, 'rgba(255,200,120,.3)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(-700, 1580, 2480, 220); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,170,80,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.graveyard = { light: { x: 1, col: 'rgba(140,210,255,1)', rim: .9, shade: .4 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('gy_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#020408'], [.7, '#0a1420'], [1, '#14243a']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 80, 221, 600, .6); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('gy_far', x => { ridge(x, 1250, 160, '#0a121e', 222, {}); for (let i = 0; i < 14; i++) gorinto(x, -400 + i * 140, 1320 + (i % 3) * 10, .7, '#141e2c'); }, { blur: 1.4 })));
    layerAt(g, c, .45, () => blit(g, cacheLayer('gy_mid', x => { for (let i = 0; i < 9; i++) gorinto(x, -300 + i * 230, 1500 + (i % 2) * 30, 1.2, '#24303e');
      for (let i = 0; i < 16; i++) { const px = -400 + i * 120; sh(x, `M${px} 1520 L${px + 14} 1520 L${px + 14} 1300 L${px + 7} 1290 L${px} 1300 Z`, '#3a3428'); } }, { blur: .5 })));
    layerAt(g, c, .45, () => { for (let i = 0; i < 4; i++) puff(g, ((i * 430 + T * 20) % 1700) - 300, 1440 + i * 30, 420, 'rgba(120,170,220,1)', .16); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('gy_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#1e2a2e'], [1, '#080c10']]); x.fillRect(-700, 1540, 2480, 1300); pebbles(x, 1580, 2600, 260, 223, ['#2a343a', '#343e44', '#1e262a']); grassField(x, 1540, 1620, 360, ['#1a2a24', '#22342c'], 224); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { for (let i = 0; i < 3; i++) puff(g, ((i * 520 + T * 30) % 1700) - 300 + c.cam[0] - 540, 2000 + c.cam[1] - 960, 400, 'rgba(120,170,220,1)', .16); },
  haze(g) { g.fillStyle = 'rgba(60,120,200,.08)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.akama = { light: o => o.tod === 'dusk' ? { x: -1, col: 'rgba(255,170,120,1)', rim: .8, shade: .35 } : { x: 1, col: 'rgba(255,245,220,1)', rim: .6, shade: .25 },
  back(g, o, c, T) { const dusk = o.tod === 'dusk';
    layerAt(g, c, 0, () => blit(g, cacheLayer('ak_sky' + dusk, x => { x.fillStyle = lg(x, 0, -700, 0, 1400, dusk ? [[0, '#1a1438'], [.6, '#8a3a5a'], [1, '#f09060']] : [[0, '#3a7ad0'], [.7, '#a8d0f0'], [1, '#e8f4ff']]); x.fillRect(-700, -700, 2480, 3400);
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 480 + (i % 2) * 160, 1.1, dusk ? 'rgba(120,60,90,.7)' : 'rgba(255,255,255,.85)', dusk ? 'rgba(255,170,120,.5)' : 'rgba(255,255,255,.6)'); })));
    layerAt(g, c, .1, () => blit(g, cacheLayer('ak_sea' + dusk, x => { x.fillStyle = dusk ? '#3a2a4a' : '#4a7aa0'; x.fillRect(-700, 1180, 2480, 200); ridge(x, 1190, 120, dusk ? '#2a1e34' : '#5a7a8a', 225, {}); line(x, [-200, 1080, 1300, 1080], 6, dusk ? '#4a3a5a' : '#8aa0b0'); for (let i = 0; i < 9; i++) line(x, [-200 + i * 190, 1080, -120 + i * 190, 1180], 3, dusk ? '#4a3a5a' : '#8aa0b0'); }, { blur: 1.2 })));
    layerAt(g, c, .45, () => blit(g, cacheLayer('ak_gate' + dusk, x => { // Suitenmon: white base, vermilion dragon-palace gate, green roof
      sh(x, 'M-700 1560 L1780 1560 L1780 1300 L-700 1300 Z', dusk ? '#c8b8b0' : '#f4efe6'); for (let i = 0; i < 20; i++) line(x, [-700 + i * 130, 1300, -700 + i * 130, 1560], 2, 'rgba(120,110,100,.3)');
      sh(x, 'M300 1560 L780 1560 L780 1260 L300 1260 Z', '#f6f1e8'); sh(x, 'M440 1560 L640 1560 L640 1380 Q540 1300 440 1380 Z', '#2a2026'); sh(x, 'M280 1260 L800 1260 L780 1100 L300 1100 Z', '#d8402a');
      for (let i = 0; i < 6; i++) sh(x, `M${320 + i * 88} 1260 L${334 + i * 88} 1260 L${334 + i * 88} 1110 L${320 + i * 88} 1110 Z`, '#a82a1a'); sh(x, 'M240 1110 Q540 1040 840 1110 L760 1020 L320 1020 Z', '#3a7a6a'); sh(x, 'M330 1020 Q540 960 750 1020 L690 960 L390 960 Z', '#3a7a6a');
      ell(x, 540, 945, 16, 16, '#e8c050'); }, { blur: .4 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ak_ground' + dusk, x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, dusk ? [[0, '#8a7a72'], [1, '#3a302c']] : [[0, '#d8d0c0'], [1, '#9a9080']]); x.fillRect(-700, 1560, 2480, 1300); for (let y = 1600; y < 2700; y += 70) line(x, [-700, y, 1780, y], 2, 'rgba(90,80,70,.3)'); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { if (o.tod === 'dusk') fireflies(g, T, 8, 226, [-200, 900, 1300, 1700], 'rgba(170,220,255,1)'); },
  haze(g, o) { g.fillStyle = o.tod === 'dusk' ? 'rgba(255,120,80,.06)' : 'rgba(255,240,210,.05)'; g.fillRect(0, 0, 1080, 1920); } };
