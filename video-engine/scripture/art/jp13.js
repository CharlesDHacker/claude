// JP13 Kuzunoha, the fox mother: Yasuna, Kuzunoha, little Seimei (a boy, nothing like Mio), two hunters, grown Seimei the onmyoji,
// the wild white fox (no red markings, unlike Kon), the poem on the paper door, the crystal orb; Shinoda's bamboo forest and the family's room.
function seimanHat(g, L, rx, ry) { tsh(g, `M${-rx * .66} ${-ry * .74} C${-rx * .74} ${-ry * 1.4} ${-rx * .3} ${-ry * 2.2} ${rx * .1} ${-ry * 2.3} C${rx * .5} ${-ry * 2.1} ${rx * .7} ${-ry * 1.4} ${rx * .66} ${-ry * .74} Z`, '#141016', 5);
  tln(g, [-rx * .6, -ry * .9, rx * .6, -ry * .9], 3, '#3a3040'); }
function hunterHat(g, L, rx, ry) { tsh(g, `M${-rx * 1.5} ${-ry * .52} Q0 ${-ry * 1.8} ${rx * 1.5} ${-ry * .52} Q0 ${-ry * .7} ${-rx * 1.5} ${-ry * .52} Z`, L.hat || '#b89a5a', 5); for (let k = -3; k <= 3; k++) tln(g, [k * rx * .4, -ry * .62, k * rx * .12, -ry * 1.3], 2, 'rgba(90,60,20,.45)'); }
const seimanStar = (g, L, G) => { g.save(); g.translate(60, G.shY + 120); const r = 26; g.beginPath(); for (let k = 0; k <= 5; k++) { const a = -Math.PI / 2 + k * 4 * Math.PI / 5; k ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.lineWidth = 4; g.strokeStyle = '#5a3a8a'; g.stroke(); g.restore(); };
Object.assign(TOON, {
  yasuna:   { kind: 'adult', age: .2, skin: '#eac09a', skinD: '#cea078', hair: '#1a1418', hairHi: '#4a4050', hairStyle: 'mizura', cord: '#2f6f6c', top: '#2f6f6c', topD: '#235654', pat: 'waves', patCol: 'rgba(220,240,230,.35)', collar: '#f2ecde',
              trimCol: '#1e4a48', trimDot: '#f2ecde', sleeve: 'kinu', bottom: 'hakama', hakama: '#8a7a5a', hakamaD: '#6e6046', belt: '#c8a868', feet: 'straw', wraps: '#f2ecde', eyes: 'adult', eyeShape: 'round', iris: '#2a1810', brow: 6, jaw: 'round', nose: 'button', bulk: 1.08, h: 1.02 },
  kuzunoha: { kind: 'adult', female: true, age: .2, skin: '#fbf2ea', skinD: '#e6d6ca', hair: '#16121c', hairHi: '#4a4466', hairStyle: 'long', top: '#f6f2ea', topD: '#ddd6ca', pat: 'petals', patCol: 'rgba(150,190,140,.55)', collar: '#8ab48a',
              layers: ['#8ab48a'], sleeve: 'wide', bottom: 'skirt', skirt: '#5a8a6a', skirtD: '#466e54', pleats: '#f6f2ea', belt: '#c8a868', feet: 'straw', eyes: 'adult', eyeShape: 'almond', eyeS: 1.15, iris: '#5a3a14', lashes: true, brow: 4, lips: '#c8606a', jaw: 'pointed', nose: 'button', h: .95 },
  seimeiKid:{ kind: 'kid', skin: '#f2cca6', skinD: '#dcaa84', blush: 'rgba(240,130,110,.3)', hair: '#16121a', hairHi: '#44405a', hairStyle: 'spiky', top: '#4a6a9a', topD: '#3a5480', pat: 'diamond', patCol: 'rgba(230,240,255,.4)', collar: '#f2ecde', bottom: 'robe', obi: '#c8a868', obiCord: '#5a3a22', feet: 'geta', eyes: 'kid' },
  hunterA:  { kind: 'adult', age: .6, skin: '#c48a5c', skinD: '#a46e42', hair: '#1a1418', hairHi: '#4a4050', hairStyle: 'short', beard: 'stubble', top: '#6a5a3a', topD: '#54462c', pat: null, collar: '#c8b888', trimCol: '#3a2e1c', trimDot: '#c8b888',
              sleeve: 'kinu', bottom: 'hakama', hakama: '#4a4a3a', hakamaD: '#3a3a2e', belt: '#3a2e1c', feet: 'straw', wraps: '#c8b888', eyes: 'adult', eyeShape: 'narrow', iris: '#2a1810', brow: 10, jaw: 'square', nose: 'broad', bulk: 1.3, h: 1.0, headX: hunterHat },
  hunterB:  { kind: 'adult', age: .25, skin: '#dcaa7c', skinD: '#bc8a5e', hair: '#2a1e18', hairHi: '#5a4a3a', hairStyle: 'spiky', top: '#8a3a2a', topD: '#6e2e20', pat: null, collar: '#d8c898', trimCol: '#4a2018', trimDot: '#d8c898',
              sleeve: 'kinu', bottom: 'hakama', hakama: '#5a4a3a', hakamaD: '#463a2e', belt: '#2a1e14', feet: 'straw', wraps: '#d8c898', eyes: 'adult', eyeShape: 'upturned', iris: '#2a1810', brow: 7, jaw: 'pointed', nose: 'line', bulk: .95, h: .94 },
  seimei:   { kind: 'adult', age: .35, skin: '#f2d2b2', skinD: '#d8b290', hair: '#14101a', hairHi: '#4a4466', hairStyle: 'short', top: '#f8f6f0', topD: '#e2ded4', pat: 'diamond', patCol: 'rgba(120,90,170,.3)', collar: '#5a3a8a', trimCol: '#5a3a8a', trimDot: '#f8f6f0',
              sleeve: 'wide', bottom: 'hakama', hakama: '#5a3a8a', hakamaD: '#44286e', belt: '#5a3a8a', feet: 'straw', wraps: '#f8f6f0', eyes: 'adult', eyeShape: 'upturned', iris: '#a87a2a', brow: 4, jaw: 'pointed', nose: 'long', h: 1.03, headX: seimanHat, frontX: seimanStar },
});
Object.assign(THOLD, {
  bow: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? .1); tsh(g, 'M-10 -300 Q60 0 -10 300', null, 9, '#5a3a22'); tln(g, [-10, -300, -10, 300], 2, '#e8e2d2'); g.restore(); },
  orb: (g, h, o, t) => { g.save(); g.translate(h[0] + 10, h[1] - 50); glow(g, 0, 0, 220, 'rgba(160,220,255,1)', .6 + .2 * Math.sin(t * 3)); tell(g, 0, 0, 44, 44, rg(g, -14, -14, 4, 50, [[0, '#ffffff'], [.5, '#bfe4ff'], [1, '#5a8ac8']]), 4); g.restore(); },
});
// the wild white fox: same species as Kon but a different animal: no red markings, no bib, one tail, a soft silver glow
JPA.whiteFox = (g, A, c) => { g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha; glow(g, A.x, A.y - 160 * (A.s || 1), 360 * (A.s || 1), 'rgba(220,235,255,1)', A.glowA ?? .45); g.filter = 'saturate(0) brightness(1.08)';
  kitsune(g, Object.assign({}, A, { t: c.T + (A.ph || 0), talk: 0, nTails: 1 })); g.filter = 'none'; g.restore(); };
// the paper door with the goodbye poem, brushed in one column at a time
JPA.poemDoor = (g, A, c) => { const T = c.T, k = clamp(A.k ?? 1); g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);
  tsh(g, 'M-300 -900 L300 -900 L300 0 L-300 0 Z', '#5a3a22', 6); tsh(g, 'M-276 -876 L276 -876 L276 -24 L-276 -24 Z', '#f6f0e2', 3);
  for (let i = 1; i < 4; i++) tln(g, [-276 + i * 138, -876, -276 + i * 138, -24], 5, '#6a4a2e'); for (let j = 1; j < 6; j++) tln(g, [-276, -876 + j * 142, 276, -876 + j * 142], 5, '#6a4a2e');
  const cols = ['恋しくば', '尋ね来て見よ', '和泉なる', '信太の森の', 'うらみ葛の葉']; g.fillStyle = '#1a1210'; g.font = "900 54px 'IPAGothic'"; g.textAlign = 'center';
  cols.forEach((s, i) => { const x = 200 - i * 100, n = Math.floor(clamp(k * cols.length - i) * s.length); for (let j = 0; j < n; j++) g.fillText(s[j], x, -760 + j * 66); });
  g.restore(); };

JSETS.shinoda = { light: o => o.tod === 'night' ? { x: -1, col: 'rgba(180,220,255,1)', rim: .85, shade: .4 } : { x: 1, col: 'rgba(255,230,170,1)', rim: .7, shade: .26 },   // Shinoda forest: bamboo and kudzu
  back(g, o, c, T) { const n = o.tod === 'night';
    layerAt(g, c, 0, () => blit(g, cacheLayer('sn_sky' + n, x => { x.fillStyle = lg(x, 0, -700, 0, 1500, n ? [[0, '#060a14'], [1, '#1a2a3a']] : [[0, '#8ab8a0'], [1, '#f2ecc8']]); x.fillRect(-700, -700, 2480, 3400); if (n) { starsF(x, 120, 401, 800); moonF(x, 780, 260, 50); } })));
    [[.15, 401, .55, 2.2], [.4, 402, .8, 1.0], [.7, 403, 1, .3]].forEach(([k, sd, sc, bl]) => layerAt(g, c, k, () => blit(g, cacheLayer('sn_b' + sd + n, x => { const r = rng(sd); for (let i = 0; i < 14; i++) { const px = -650 + i * 180 + r() * 60, w = 26 * sc, col = n ? mix('#2a4a44', '#0a1414', 1 - sc) : mix('#6a9a5a', '#d8e4c0', 1 - sc);
      x.fillStyle = col; x.fillRect(px, -200, w, 1800); for (let y = 0; y < 1600; y += 150 * sc + r() * 60) { x.fillStyle = n ? '#0e1a18' : '#4a7a3e'; x.fillRect(px - 3, y, w + 6, 6); }
      for (let j = 0; j < 4; j++) { const ly = 200 + r() * 1100; sh(x, `M${px + w} ${ly} q${60 * sc} ${-30 * sc} ${120 * sc} ${10 * sc} q${-60 * sc} ${4 * sc} ${-120 * sc} ${-10 * sc} Z`, n ? '#1a3a30' : '#5a8a46'); } } }, { blur: bl }))));
    layerAt(g, c, 1, () => blit(g, cacheLayer('sn_ground' + n, x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, n ? [[0, '#1a2a24'], [1, '#060a08']] : [[0, '#8a9a5a'], [1, '#4a5a2e']]); x.fillRect(-700, 1560, 2480, 1300); const r = rng(404);
      for (let i = 0; i < 90; i++) { const px = r() * 2400 - 700, py = 1580 + r() * 900; sh(x, `M${px} ${py} q16 -26 34 -4 q-16 10 -34 4 Z`, n ? '#2a4a3a' : '#6a8a3a'); } }, { y0: 1500, h: 1300 })));
    if (n) for (let i = 0; i < 14; i++) { const x = (i * 97 + T * 20) % 1200 - 60, y = 900 + Math.sin(T * .8 + i * 1.7) * 300 + i * 30; glow(g, x, y, 26, 'rgba(200,255,200,1)', .5 + .4 * Math.sin(T * 3 + i)); }
  },
  haze(g, o) { g.fillStyle = o.tod === 'night' ? 'rgba(80,140,200,.06)' : 'rgba(255,240,190,.05)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.room = { light: { x: 1, col: 'rgba(255,220,170,1)', rim: .7, shade: .3 },   // the family's room: tatami, a paper door, morning light
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('rm_wall', x => { x.fillStyle = '#d8c8a8'; x.fillRect(-700, -700, 2480, 2300); for (let i = 0; i < 9; i++) { const px = -650 + i * 300; x.fillStyle = '#5a3a22'; x.fillRect(px, 400, 26, 1200); }
      x.fillStyle = '#4a2e1a'; x.fillRect(-700, 400, 2480, 30); x.fillStyle = 'rgba(255,240,200,.35)'; x.fillRect(-700, 430, 2480, 1130); }, { blur: .8 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('rm_floor', x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, [[0, '#c8b878'], [1, '#8a7a48']]); x.fillRect(-700, 1560, 2480, 1300); for (let i = 0; i < 8; i++) line(x, [-700 + i * 360, 1560, -900 + i * 420, 2700], 6, '#4a5a2a'); line(x, [-700, 1900, 1780, 1900], 6, '#4a5a2a'); }, { y0: 1500, h: 1300 })));
    glow(g, 900, 900, 700, 'rgba(255,230,170,1)', .25 + .05 * Math.sin(T));
  },
  haze(g) { g.fillStyle = 'rgba(255,220,160,.05)'; g.fillRect(0, 0, 1080, 1920); } };
