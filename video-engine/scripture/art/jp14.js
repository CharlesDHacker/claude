// JP14 Yuki-onna (Hearn, Kwaidan 1904): old Mosaku, young Minokichi (and Minokichi ten years on), the snow woman, O-Yuki (the same woman
// passing as a village wife: same face, warm clothes), three of their children (each different); the blizzard, the ferryman's hut, the farmhouse.
function minoCape(g, L, G) { const d = `M${-130} ${G.shY - 10} L130 ${G.shY - 10} L170 ${G.waist + 200} L-170 ${G.waist + 200} Z`; tsh(g, d, '#b8a070', 5); g.save(); g.clip(path(d)); for (let x = -180; x < 180; x += 16) tln(g, [x, G.shY - 10, x * 1.2, G.waist + 220], 3, 'rgba(110,80,40,.55)'); g.restore(); tsh(g, d, null, 5); }
function iceCrown(g, L, rx, ry) { glow(g, 0, -ry * .4, 220, 'rgba(190,230,255,1)', .35); }
Object.assign(TOON, {
  mosaku:   { kind: 'elder', age: 1, skin: '#d8a27a', skinD: '#b88058', hair: '#e8e4dc', hairHi: '#ffffff', hairStyle: 'bald', beard: 'stubble', top: '#5a4a3a', topD: '#463a2e', pat: 'dots', patCol: 'rgba(220,200,160,.4)', collar: '#d8ccb0', trimCol: '#3a2e22', trimDot: '#d8ccb0',
              sleeve: 'kinu', bottom: 'hakama', hakama: '#4a4438', hakamaD: '#3a362c', belt: '#8a6a3a', feet: 'straw', wraps: '#d8ccb0', eyes: 'adult', eyeShape: 'droopy', iris: '#3a2a1a', brow: 7, browCol: '#e8e4dc', jaw: 'wide', nose: 'broad', bulk: 1.05, h: .9, stoop: .07, behind: minoCape },
  minokichi:{ kind: 'adult', age: .05, skin: '#e8b890', skinD: '#cc9a72', hair: '#16121a', hairHi: '#44405a', hairStyle: 'ponytail', tie: '#3a5a7a', top: '#3a5a7a', topD: '#2e4a66', pat: 'diamond', patCol: 'rgba(220,235,255,.35)', collar: '#e8e2d2', trimCol: '#24384e', trimDot: '#e8e2d2',
              sleeve: 'kinu', bottom: 'hakama', hakama: '#5a5048', hakamaD: '#48403a', belt: '#8a6a3a', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', eyeShape: 'round', iris: '#2a1810', brow: 6, jaw: 'pointed', nose: 'button', bulk: 1.0, h: 1.0 },
  yukionna: { kind: 'adult', female: true, age: .15, skin: '#eef4fa', skinD: '#c8d8e8', hair: '#0a0c14', hairHi: '#3a4a6a', hairStyle: 'long', top: '#f8fbff', topD: '#dce8f4', pat: 'clouds', patCol: 'rgba(160,200,240,.5)', collar: '#bcd8f0', layers: ['#9ac0e0'],
              sleeve: 'wide', bottom: 'skirt', skirt: '#f2f6fc', skirtD: '#d4e2f0', pleats: '#f8fbff', belt: '#9ac0e0', feet: 'straw', eyes: 'adult', eyeShape: 'almond', eyeS: 1.15, iris: '#3a5a88', lashes: true, brow: 3, browCol: '#3a4a6a', lips: '#7aa0c8', jaw: 'pointed', nose: 'button', h: 1.0, headX: iceCrown },
  oyuki:    { kind: 'adult', female: true, age: .15, skin: '#f8e2d0', skinD: '#e2c4ac', hair: '#0a0c14', hairHi: '#3a4a6a', hairStyle: 'bun', tie: '#c8506a', top: '#c8506a', topD: '#a83e56', pat: 'petals', patCol: 'rgba(255,230,236,.6)', collar: '#f6f0e6',
              sleeve: 'kinu', cord: '#f2c94c', bottom: 'skirt', skirt: '#5a3a4a', skirtD: '#462e3a', belt: '#f2c94c', feet: 'straw', eyes: 'adult', eyeShape: 'almond', eyeS: 1.15, iris: '#2a2030', lashes: true, brow: 3, browCol: '#3a4a6a', lips: '#c8506a', jaw: 'pointed', nose: 'button', h: 1.0 },
  minokichiOld: { kind: 'adult', age: .5, skin: '#dcaa80', skinD: '#c08c62', hair: '#16121a', hairHi: '#44405a', hairStyle: 'ponytail', tie: '#5a4a3a', top: '#5a4a3a', topD: '#463a2e', pat: 'diamond', patCol: 'rgba(230,210,170,.35)', collar: '#e8e2d2', trimCol: '#3a2e22', trimDot: '#e8e2d2',
              sleeve: 'kinu', bottom: 'hakama', hakama: '#4a4438', hakamaD: '#3a362c', belt: '#8a6a3a', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', eyeShape: 'round', iris: '#2a1810', brow: 7, beard: 'stubble', jaw: 'pointed', nose: 'button', bulk: 1.15, h: 1.0 },
  child1:   { kind: 'kid', skin: '#f2d0ac', skinD: '#dcae88', hair: '#16121a', hairHi: '#44405a', hairStyle: 'bob', top: '#e8a040', topD: '#c8842e', pat: 'dots', patCol: 'rgba(255,250,230,.6)', collar: '#f6f0e2', bottom: 'robe', obi: '#5a3a8a', obiCord: '#f2c94c', feet: 'geta', eyes: 'kid' },
  child2:   { kind: 'kid', skin: '#eec8a2', skinD: '#d6a882', hair: '#16121a', hairHi: '#44405a', hairStyle: 'parted', top: '#4a8a5a', topD: '#3a6e48', pat: 'diamond', patCol: 'rgba(230,255,235,.45)', collar: '#f6f0e2', bottom: 'robe', obi: '#8a3a2a', obiCord: '#f2c94c', feet: 'geta', eyes: 'kid' },
  child3:   { kind: 'kid', skin: '#f6d8b8', skinD: '#e0b896', hair: '#16121a', hairHi: '#44405a', hairStyle: 'ponytail', tie: '#d23a6a', top: '#8a6ab8', topD: '#6e5498', pat: 'petals', patCol: 'rgba(255,240,250,.55)', collar: '#f6f0e2', bottom: 'robe', obi: '#2f6f6c', obiCord: '#f2c94c', feet: 'geta', eyes: 'kid' },
});
Object.assign(THOLD, { sewing: (g, h, o, t) => { g.save(); g.translate(h[0] - 40, h[1] + 10); tsh(g, 'M-70 -20 L80 -30 L90 40 L-60 50 Z', '#c8506a', 4); tln(g, [20, -60 + Math.sin(t * 4) * 10, 30, 0], 2, '#e8e8f0'); g.restore(); } });
// freezing breath: a stream of white frost from (x, y) toward (x1, y1)
JPA.frostBreath = (g, A, c) => { const T = c.T, k = clamp(A.k ?? 1); if (k <= 0) return; g.save(); for (let i = 0; i < 26; i++) { const q = ((T * .7 + i / 26) % 1) * k, x = lerp(A.x, A.x1, q) + Math.sin(T * 3 + i) * 20 * q, y = lerp(A.y, A.y1, q) + Math.cos(T * 2.4 + i) * 26 * q;
  glow(g, x, y, 60 + q * 90, 'rgba(220,240,255,1)', .35 * (1 - q * .5)); } g.restore(); };
// white mist rising and thinning (the snow woman leaving through the roof)
JPA.mistRise = (g, A, c) => { const T = c.T, k = clamp(A.k ?? 1); g.save(); for (let i = 0; i < 30; i++) { const q = (i / 30 + T * .15) % 1, x = A.x + Math.sin(T + i * 1.3) * 60 * (1 - q), y = A.y - q * 1300 * k;
  glow(g, x, y, 120 + q * 80, 'rgba(230,245,255,1)', .5 * k * (1 - q)); } g.restore(); };
JPA.andon = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); glow(g, 0, -120, 380, 'rgba(255,190,110,1)', .55 + .06 * Math.sin(T * 7));
  tsh(g, 'M-50 -200 L50 -200 L50 -40 L-50 -40 Z', '#fff0c8', 5); for (let k = 1; k < 3; k++) tln(g, [-50 + k * 33, -200, -50 + k * 33, -40], 3, '#5a3a22'); tln(g, [-40, -40, -50, 0], 6, '#5a3a22'); tln(g, [40, -40, 50, 0], 6, '#5a3a22'); g.restore(); };

JSETS.blizzard = { light: { x: -1, col: 'rgba(200,225,255,1)', rim: .9, shade: .45 },   // the river crossing in a blizzard: dark blue, the ferryman's hut
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('bz_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#0a1020'], [1, '#3a4a66']]); x.fillRect(-700, -700, 2480, 3400); })));
    layerAt(g, c, .2, () => blit(g, cacheLayer('bz_far', x => { ridge(x, 1200, 240, '#2a3650', 501, {}); x.fillStyle = '#4a5a76'; x.fillRect(-700, 1320, 2480, 120); }, { blur: 2 })));
    layerAt(g, c, .5, () => blit(g, cacheLayer('bz_hut', x => { sh(x, 'M640 1560 L1040 1560 L1040 1300 L640 1300 Z', '#3a2e26'); sh(x, 'M600 1310 L840 1140 L1080 1310 Z', '#e8eef6'); sh(x, 'M760 1560 L860 1560 L860 1400 L760 1400 Z', '#1a1410');
      for (let i = 0; i < 5; i++) line(x, [-500 + i * 60, 1560, -480 + i * 60, 1380], 10, '#2a2420'); }, { blur: .6 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('bz_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#dce6f2'], [1, '#8a9ab4']]); x.fillRect(-700, 1540, 2480, 1300); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { JPA.snowFall(g, { n: 160, seed: 97 }, c); g.save(); g.globalAlpha = .18 + .08 * Math.sin(T * 1.3); g.fillStyle = '#dfe8f4'; g.fillRect(0, 0, 1080, 1920); g.restore(); },
  haze(g) { g.fillStyle = 'rgba(120,160,220,.08)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.hut = { light: { x: 1, col: 'rgba(190,220,255,1)', rim: .9, shade: .5 },   // inside the hut at night: the door open on the storm, a dead fire
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('ht_wall', x => { x.fillStyle = '#1e1814'; x.fillRect(-700, -700, 2480, 2300); for (let i = 0; i < 16; i++) line(x, [-700 + i * 160, 300, -700 + i * 160, 1600], 6, '#2a221c');
      sh(x, 'M760 1560 L1060 1560 L1060 900 L760 900 Z', '#3a4a66'); }, { blur: .8 })));
    layerAt(g, c, .3, () => { for (let i = 0; i < 30; i++) { const q = (T * .9 + i / 30) % 1, y = 920 + ((i * 97) % 620); ell(g, 1060 - q * 420, y + Math.sin(T * 3 + i) * 14, 4, 4, `rgba(255,255,255,${.8 * (1 - q)})`); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('ht_floor', x => { planksF(x, 1560, 2800, '#3a2e24', '#140e0a', 502); sh(x, 'M300 1700 L780 1700 L800 1780 L280 1780 Z', '#2a201a'); ell(x, 540, 1740, 140, 22, '#4a3a2e'); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(100,140,220,.08)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.farm = { light: { x: -1, col: 'rgba(255,190,120,1)', rim: .8, shade: .4 },   // the farmhouse at night: a hearth, a paper lamp, the smoke hole in the roof
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('fm_wall', x => { x.fillStyle = '#3a2a1e'; x.fillRect(-700, -700, 2480, 2300); for (let i = 0; i < 10; i++) line(x, [-650 + i * 280, 200, -650 + i * 280, 1600], 18, '#2a1e14');
      sh(x, 'M-700 420 L540 120 L1780 420 L1780 470 L540 170 L-700 470 Z', '#2a1e14'); sh(x, 'M500 140 L580 140 L580 220 L500 220 Z', '#0e1220'); }, { blur: .7 })));
    layerAt(g, c, 1, () => { blit(g, cacheLayer('fm_floor', x => { planksF(x, 1560, 2800, '#6a4e36', '#2a1e14', 503); sh(x, 'M340 1660 L740 1660 L760 1740 L320 1740 Z', '#2a2020'); }, { y0: 1500, h: 1300 }));
      fire(g, 540, 1700, .7, T); glow(g, 540, 1660, 400, 'rgba(255,150,60,1)', .45); });
  },
  haze(g) { g.fillStyle = 'rgba(255,150,80,.06)'; g.fillRect(0, 0, 1080, 1920); } };
