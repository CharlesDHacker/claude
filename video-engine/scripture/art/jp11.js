// JP11 Japan's Thanksgiving: Niinamesai (the emperor's new-rice offering), shrine offerings, the harvest, Labor Thanksgiving Day
// (kids' thank-you drawings for police, firefighters, nurses), and the Christmas fried-chicken bucket. Every character here is new.

// ---------- hats and badges (headX / frontX hooks) ----------
function fireHelmet(g, L, rx, ry) { tsh(g, `M${-rx * 1.06} ${-ry * .44} C${-rx * 1.1} ${-ry * 1.4} ${rx * 1.1} ${-ry * 1.4} ${rx * 1.06} ${-ry * .44} L${rx * 1.3} ${-ry * .3} L${-rx * 1.3} ${-ry * .3} Z`, '#c8c4bc', 5);
  tln(g, [-rx * 1.0, -ry * .62, rx * 1.0, -ry * .62], 6, '#e8c040'); tsh(g, `M${-rx * .2} ${-ry * 1.22} L${rx * .2} ${-ry * 1.22} L${rx * .14} ${-ry * .64} L${-rx * .14} ${-ry * .64} Z`, '#a8a49c', 3);
  tsh(g, `M${-rx * 1.04} ${-ry * .4} L${-rx * 1.1} ${ry * .5} L${-rx * .86} ${ry * .5} L${-rx * .86} ${-ry * .36} Z`, '#c8c4bc', 4); }   // neck flap
function policeCap(g, L, rx, ry) { tsh(g, `M${-rx * 1.0} ${-ry * .56} C${-rx * 1.1} ${-ry * 1.2} ${rx * 1.1} ${-ry * 1.2} ${rx * 1.0} ${-ry * .56} Z`, '#1e2a4e', 5);
  tsh(g, `M${-rx * .9} ${-ry * .6} L${rx * .9} ${-ry * .6} L${rx * .9} ${-ry * .46} L${-rx * .9} ${-ry * .46} Z`, '#14141c', 4); tsh(g, `M${-rx * .7} ${-ry * .48} Q0 ${-ry * .2} ${rx * .9} ${-ry * .44} Z`, '#14141c', 3);
  tell(g, 0, -ry * .82, 10, 10, '#e8c040', 3); }
function nurseCap(g, L, rx, ry) { tsh(g, `M${-rx * .56} ${-ry * .76} L${rx * .56} ${-ry * .76} L${rx * .44} ${-ry * 1.06} L${-rx * .44} ${-ry * 1.06} Z`, '#fbfaf6', 4); tln(g, [-rx * .5, -ry * .84, rx * .5, -ry * .84], 4, '#6ab0d8'); }
function farmerTowel(g, L, rx, ry) { tsh(g, `M${-rx * 1.02} ${-ry * .44} Q0 ${-ry * .62} ${rx * 1.02} ${-ry * .44} L${rx * 1.0} ${-ry * .2} Q0 ${-ry * .38} ${-rx * 1.0} ${-ry * .2} Z`, '#f2ece0', 4);
  tsh(g, `M${rx * .9} ${-ry * .4} L${rx * 1.3} ${-ry * .2} L${rx * 1.2} ${-ry * .02} L${rx * .92} ${-ry * .24} Z`, '#f2ece0', 3); for (let k = -2; k <= 2; k++) tln(g, [k * rx * .3, -ry * .5, k * rx * .3 + 6, -ry * .3], 2, '#3a5a8a'); }
const reflect = (g, L, G) => { [G.waist - 40, G.waist + 120].forEach(y => tsh(g, `M-96 ${y} L96 ${y} L96 ${y + 18} L-96 ${y + 18} Z`, '#e8e060', 3)); };
const badge = (g, L, G) => { tell(g, -40, G.shY + 90, 12, 14, '#e8c040', 3); };
Object.assign(TOON, {
  // the ancient emperor at the rite: pure white silk, a tall black cap, a long dark beard
  tennoRite: { kind: 'adult', age: .55, eyeShape: 'narrow', nose: 'long', bulk: 1.1, skin: '#ecc8a4', skinD: '#d0a682', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'heian', top: '#fbf8f0', topD: '#e8e2d4', pat: 'diamond', patCol: 'rgba(200,190,170,.25)', collar: '#fbf8f0',
    trimCol: '#e8e2d4', trimDot: '#fbf8f0', sleeve: 'wide', bottom: 'hakama', hakama: '#fbf8f0', hakamaD: '#e4dece', belt: '#e8e2d4', feet: 'straw', wraps: '#fbf8f0', eyes: 'adult', iris: '#140c08', brow: 7, beard: 'longWhite', jaw: 'square', kanmuri: true, h: 1.04 },
  // a country shrine priest in white and pale blue
  kannushi: { kind: 'adult', age: .9, eyeShape: 'narrow', nose: 'long', bulk: .95, stoop: .03, skin: '#d8a880', skinD: '#b8885e', hair: '#2a2024', hairHi: '#5a4a52', hairStyle: 'side', top: '#fbf8f0', topD: '#e8e2d4', pat: null, collar: '#fbf8f0', trimCol: '#9ac0d8', trimDot: '#fbf8f0',
    sleeve: 'wide', bottom: 'hakama', hakama: '#8ab4d0', hakamaD: '#6e98b4', belt: '#fbf8f0', feet: 'straw', wraps: '#fbf8f0', eyes: 'adult', iris: '#2a1810', brow: 6, jaw: 'round', eboshi: true, glasses: true, h: .98 },
  // a rice farmer: indigo work clothes, a twisted towel tied round the head, ruddy from the sun
  farmerKen: { kind: 'adult', age: .7, eyeShape: 'droopy', nose: 'broad', bulk: 1.25, skin: '#c8865a', skinD: '#a86a40', hair: '#2a2024', hairHi: '#5a4a52', hairStyle: 'side', top: '#2e4a78', topD: '#223a60', pat: 'diamond', patCol: 'rgba(220,230,250,.25)', collar: '#e8e2d2', trimCol: '#1e2e4a', trimDot: '#e8e2d2',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#3a4a5a', hakamaD: '#2e3c4a', belt: '#8a6a3a', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', iris: '#2a1810', brow: 9, beard: 'stubble', jaw: 'square', h: .98, headX: farmerTowel },
  firefighter: { kind: 'adult', age: .15, hairStyle: 'short', eyeShape: 'upturned', nose: 'line', skin: '#e2b088', skinD: '#c48e66', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'side', top: '#2a3a5a', topD: '#1e2c46', pat: null, collar: '#2a3a5a', suit: true, tie: '#2a3a5a', sleeve: 'kinu', cord: '#e8e060',
    bottom: 'pants', pants: '#2a3a5a', shoes: '#1a1414', eyes: 'adult', iris: '#2a1810', brow: 8, jaw: 'square', h: 1.06, bulk: 1.32, headX: fireHelmet, frontX: reflect },
  policeOfficer: { kind: 'adult', age: .35, hairStyle: 'ponytail', tie: '#141e3a', eyeShape: 'almond', nose: 'button', jaw: 'pointed', bulk: 1.05, female: true, skin: '#f0caa6', skinD: '#d6a682', hair: '#2a1e18', hairHi: '#5a4a3a', hairStyle: 'lowtie', top: '#1e2a4e', topD: '#141e3a', pat: null, collar: '#dce4f0', suit: true, tie: '#141e3a', sleeve: 'kinu', cord: '#dce4f0',
    bottom: 'pants', pants: '#1e2a4e', shoes: '#14141c', eyes: 'adult', iris: '#2a1810', lashes: true, brow: 5, lips: '#c06070', h: .98, headX: policeCap, frontX: badge },
  nurse: { kind: 'adult', age: .65, hairStyle: 'bun', eyeShape: 'round', nose: 'button', jaw: 'wide', bulk: 1.18, female: true, skin: '#e8b890', skinD: '#cc9a72', hair: '#3a2418', hairHi: '#6a4a34', hairStyle: 'lowtie', top: '#fbfaf6', topD: '#e6e4de', pat: null, collar: '#9ad0e8', suit: true, tie: '#9ad0e8', sleeve: 'kinu', cord: '#9ad0e8',
    bottom: 'pants', pants: '#fbfaf6', shoes: '#e6e4de', eyes: 'adult', iris: '#2a1810', lashes: true, brow: 5, lips: '#c87080', h: .96, headX: nurseCap },
  queueA: { kind: 'adult', female: true, age: .2, hairStyle: 'long', eyeShape: 'big', nose: 'button', jaw: 'pointed', skin: '#f2cca8', skinD: '#d8a884', hair: '#4a2a1e', hairHi: '#7a5038', top: '#c8a060', topD: '#a88448', pat: null, collar: '#f2ece0', suit: true, tie: '#c8302a', sleeve: 'kinu', bottom: 'skirt', skirt: '#3a2a3a', skirtD: '#2a1e2a', eyes: 'adult', iris: '#2a1810', lashes: true, brow: 4, lips: '#c06070', h: .95, bulk: 1.0 },
  queueB: { kind: 'adult', age: .95, hairStyle: 'bald', hair: '#d8d4cc', hairHi: '#ffffff', eyeShape: 'narrow', nose: 'broad', jaw: 'round', skin: '#dca880', skinD: '#c08a62', top: '#4a5a3a', topD: '#3a4a2e', pat: null, collar: '#e8e2d2', suit: true, tie: '#8a3a2a', sleeve: 'kinu', bottom: 'pants', pants: '#5a4a3a', shoes: '#2a1e16', eyes: 'adult', iris: '#2a1810', brow: 6, browCol: '#e8e4dc', h: .9, bulk: 1.1, stoop: .06 },
  queueC: { kind: 'adult', age: .05, hairStyle: 'spiky', hair: '#1a1418', hairHi: '#4a4050', eyeShape: 'upturned', nose: 'line', jaw: 'pointed', skin: '#e8b890', skinD: '#cc9a72', top: '#2a6a9a', topD: '#1e5078', pat: null, collar: '#2a6a9a', suit: true, tie: '#2a6a9a', sleeve: 'kinu', bottom: 'pants', pants: '#2a2a34', shoes: '#e8e4dc', eyes: 'adult', iris: '#2a1810', brow: 7, h: .88, bulk: .92 },
  xmasDad: { kind: 'adult', age: .5, hairStyle: 'parted', eyeShape: 'droopy', nose: 'long', bulk: 1.22, skin: '#e8be98', skinD: '#cca07a', hair: '#2a1e18', hairHi: '#5a4a3a', hairStyle: 'side', top: '#6a3a2a', topD: '#542c20', pat: null, collar: '#e8e2d2', suit: true, tie: '#c8302a', sleeve: 'kinu', cord: '#e8e2d2',
    bottom: 'pants', pants: '#3a3a44', shoes: '#1a1414', eyes: 'adult', iris: '#2a1810', brow: 7, jaw: 'round', glasses: true, h: 1.02 },
});
Object.assign(THOLD, {
  bucket: (g, h, o, t) => { g.save(); g.translate(h[0] + 10, h[1] + 96); JPA.chickenBucket(g, { x: 0, y: 0, s: .34 }, { T: t }); tln(g, [-36, -90, -10, -110, 36, -92], 4); g.restore(); },
  sanbo: (g, h, o, t) => { g.save(); g.translate(h[0] - 70, h[1] - 20); tsh(g, 'M-90 0 L90 0 L70 60 L-70 60 Z', '#e8d8b0', 4); tsh(g, 'M-100 -14 L100 -14 L100 0 L-100 0 Z', '#d8c498', 4);
    tsh(g, 'M-60 -14 C-60 -70 60 -70 60 -14 Z', '#fbfaf2', 4); for (let k = -3; k <= 3; k++) tell(g, k * 14, -40 - Math.abs(k) * -2, 5, 8, '#f6f2e6', 1.4); glow(g, 0, -40, 160, 'rgba(255,250,220,1)', .4 + .1 * Math.sin(t * 2)); g.restore(); },
  sickle: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.3); tln(g, [0, 20, 0, -120], 12, '#6a4a2a'); tsh(g, 'M0 -120 Q70 -150 110 -100 Q60 -128 4 -104 Z', '#c8d0da', 3); g.restore(); },
  drawing: (g, h, o, t) => { g.save(); g.translate(h[0] + 70, h[1] - 30); g.rotate(-.06); tsh(g, 'M-90 -70 L90 -70 L90 70 L-90 70 Z', '#fbfaf2', 4);
    tsh(g, 'M-50 30 L-50 -10 L-30 -30 L-10 -10 L-10 30 Z', '#c8302a', 2); tell(g, 30, -20, 18, 18, '#f2c94c', 2); tln(g, [10, 40, 60, 0], 4, '#3a7ac8'); tsh(g, 'M40 -50 C40 -60 56 -60 56 -50 C56 -40 48 -36 48 -30 C48 -36 40 -40 40 -50 Z', '#e84a6a', 0);
    g.fillStyle = '#2a1a12'; g.font = "900 22px 'IPAGothic'"; g.textAlign = 'center'; g.fillText('ありがとう', 0, 60); g.restore(); },
});

// ---------- props ----------
JPA.chickenBucket = (g, A, c) => { g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); const B = 'M-110 0 L110 0 L136 -230 L-136 -230 Z';
  tsh(g, B, '#fbf6ee', 5); g.save(); g.clip(path(B)); for (let k = -6; k <= 6; k += 2) { g.fillStyle = '#c8302a'; g.beginPath(); g.moveTo(k * 22 - 10, 0); g.lineTo(k * 22 + 10, 0); g.lineTo(k * 27 + 12, -230); g.lineTo(k * 27 - 12, -230); g.fill(); } g.restore(); tsh(g, B, null, 5);
  tsh(g, 'M-142 -230 L142 -230 L142 -250 L-142 -250 Z', '#c8302a', 4);
  [[-80, -270], [-20, -290], [44, -284], [96, -262], [10, -320], [-56, -310]].forEach(([x, y], i) => { g.save(); g.translate(x, y); g.rotate((i - 2.5) * .3); tsh(g, 'M-34 20 C-44 -20 -24 -50 4 -50 C34 -50 46 -16 34 20 C20 34 -20 34 -34 20 Z', '#c8882a', 4); for (let k = 0; k < 5; k++) tell(g, -16 + k * 8, -20 + (k % 2) * 14, 6, 4, '#a86a1a', 0); g.restore(); });
  glow(g, 0, -280, 260, 'rgba(255,220,150,1)', .25); g.restore(); };
JPA.riceSheaves = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); // hasa-kake: rice hung over a pole rack to dry
  [-300, 300].forEach(x => tln(g, [x, 0, x, -330], 14, '#5a3a22')); tln(g, [-340, -300, 340, -300], 12, '#5a3a22');
  for (let i = -6; i <= 6; i++) { const x = i * 48, sw = Math.sin(T * 1.2 + i) * 4; tsh(g, `M${x - 22} -300 L${x + 22} -300 L${x + 28 + sw} -110 L${x - 28 + sw} -110 Z`, i % 2 ? '#d8b04a' : '#c8a040', 3); for (let k = 0; k < 4; k++) tln(g, [x - 18 + k * 12, -290, x - 22 + k * 14 + sw, -120], 1.6, 'rgba(120,90,20,.45)'); }
  g.restore(); };
JPA.kobanBox = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); // a little neighbourhood police box with its red lamp
  tsh(g, 'M-220 0 L220 0 L220 -400 L-220 -400 Z', '#e8e2d6', 5); tsh(g, 'M-250 -400 L250 -400 L230 -460 L-230 -460 Z', '#3a3a44', 5); tsh(g, 'M-120 0 L120 0 L120 -300 L-120 -300 Z', '#9ab8d0', 4); tln(g, [0, 0, 0, -300], 4, '#3a3a44');
  tsh(g, 'M-160 -350 L160 -350 L160 -310 L-160 -310 Z', '#1e2a4e', 3); g.fillStyle = '#fbfaf6'; g.font = "900 30px 'IPAGothic'"; g.textAlign = 'center'; g.fillText('交番', 0, -320);
  glow(g, 0, -490, 160, 'rgba(255,60,40,1)', .5 + .3 * Math.sin(T * 3)); tell(g, 0, -486, 26, 26, '#e83a2a', 4); g.restore(); };
JPA.cardWall = (g, A, c) => { const r = rng(A.seed || 91); g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);
  for (let i = 0; i < (A.n || 8); i++) { const x = (i % 4 - 1.5) * 120 + (r() - .5) * 20, y = Math.floor(i / 4) * -130 + (r() - .5) * 16; g.save(); g.translate(x, y); g.rotate((r() - .5) * .3);
    tsh(g, 'M-50 -45 L50 -45 L50 45 L-50 45 Z', '#fbfaf2', 3); const cols = ['#c8302a', '#3a7ac8', '#f2c94c', '#4a9a5a', '#e84a8a']; tell(g, (r() - .5) * 40, (r() - .5) * 30, 16, 16, cols[i % 5], 2); tsh(g, `M-20 30 L0 ${-10 - r() * 10} L20 30 Z`, cols[(i + 2) % 5], 2); g.restore(); }
  g.restore(); };
JPA.leafFall = (g, A, c) => { const T = c.T, r = rng(A.seed || 93); for (let i = 0; i < (A.n || 26); i++) { const x = ((r() * 1500 + T * (30 + r() * 30) + Math.sin(T + i) * 40) % 1500) - 200, y = ((r() * 2100 + T * (70 + r() * 50)) % 2100) - 100;
  g.save(); g.translate(x, y); g.rotate(T * (1 + r()) + i); g.scale(.7 + r() * .6, .7 + r() * .6); const col = ['#e84a2a', '#f08a2a', '#d8302a', '#f2b030'][i % 4];
  sh(g, 'M0 -22 L6 -8 L20 -12 L12 0 L22 10 L6 8 L0 22 L-6 8 L-22 10 L-12 0 L-20 -12 L-6 -8 Z', col); g.restore(); } };
JPA.snowFall = (g, A, c) => { const T = c.T, r = rng(A.seed || 95); for (let i = 0; i < (A.n || 80); i++) { const x = ((r() * 1500 + T * 20 + Math.sin(T * .8 + i) * 30) % 1500) - 200, y = ((r() * 2100 + T * (60 + r() * 50)) % 2100) - 100; ell(g, x, y, 3 + r() * 4, 3 + r() * 4, 'rgba(255,255,255,.85)'); } };

// ---------- worlds ----------
function mapleTree(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); sh(x, 'M-16 0 L16 0 L10 -200 L-10 -200 Z', '#3a2418'); line(x, [0, -150, -80, -260], 12, '#3a2418', 'round'); line(x, [0, -170, 90, -280], 12, '#3a2418', 'round');
  const r = rng(Math.floor(cx)); for (let i = 0; i < 30; i++) { const an = r() * 6.28, d = r() * 160; ell(x, Math.cos(an) * d * 1.4, -300 + Math.sin(an) * d * .8, 50 + r() * 30, 40 + r() * 20, ['#e84a2a', '#f08a2a', '#d8302a', '#f2b030', '#c82a2a'][i % 5]); } x.restore(); }
JSETS.momiji = { light: { x: -1, col: 'rgba(255,190,120,1)', rim: .8, shade: .28 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('mj_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#4a5aa0'], [.55, '#e8986a'], [1, '#ffd8a0']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 300, 1100, 500, 'rgba(255,220,150,1)', .6);
      for (let i = 0; i < 4; i++) cloudF(x, -200 + i * 480, 520 + (i % 2) * 150, 1.0, 'rgba(255,200,170,.7)', 'rgba(255,230,190,.6)'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('mj_far', x => { ridge(x, 1150, 320, '#8a5a6a', 251, {}); for (let i = 0; i < 12; i++) mapleTree(x, -500 + i * 190, 1380 + (i % 3) * 20, .9); }, { blur: 1.4 })));
    layerAt(g, c, .4, () => blit(g, cacheLayer('mj_mid', x => { torii(x, 540, 1560, .9); mapleTree(x, 80, 1600, 1.4); mapleTree(x, 1000, 1580, 1.5); }, { blur: .4 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('mj_ground', x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, [[0, '#c8a888'], [1, '#7a5a48']]); x.fillRect(-700, 1560, 2480, 1300); const r = rng(252);
      for (let i = 0; i < 160; i++) { x.save(); x.translate(r() * 2400 - 700, 1600 + r() * 1000); x.rotate(r() * 6); x.scale(.7, .7); sh(x, 'M0 -22 L6 -8 L20 -12 L12 0 L22 10 L6 8 L0 22 L-6 8 L-22 10 L-12 0 L-20 -12 L-6 -8 Z', ['#e84a2a', '#f08a2a', '#d8302a', '#f2b030'][i % 4]); x.restore(); } }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { JPA.leafFall(g, { n: 22 }, c); },
  haze(g) { g.fillStyle = 'rgba(255,170,90,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.shinka = { light: { x: 1, col: 'rgba(255,200,130,1)', rim: .85, shade: .4 },  // the palace ritual hall at night: dark cypress, white curtains, torchlight
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('sk_back', x => { x.fillStyle = '#0a0806'; x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 7; i++) { const px = -500 + i * 330; sh(x, `M${px} 1580 L${px + 34} 1580 L${px + 34} 560 L${px} 560 Z`, '#5a4430'); }
      for (let i = 0; i < 6; i++) { const px = -470 + i * 330; x.fillStyle = lg(x, px, 0, px + 300, 0, [[0, '#d8d0c0'], [.5, '#f6f0e4'], [1, '#d8d0c0']]); x.fillRect(px, 640, 296, 760); for (let k = 0; k < 8; k++) line(x, [px + 18 + k * 36, 640, px + 18 + k * 36, 1400], 2, 'rgba(120,100,80,.25)'); }
      sh(x, 'M-700 560 L1780 560 L1780 500 L-700 500 Z', '#3a2a1e'); }, { blur: .6 })));
    layerAt(g, c, .6, () => { [[120, 1300], [960, 1300]].forEach(([x, y], i) => { line(g, [x, y + 300, x, y], 10, '#2a1a10', 'round'); fire(g, x, y - 10, .7, T + i); glow(g, x, y, 500, 'rgba(255,150,60,1)', .5); }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('sk_floor', x => { planksF(x, 1580, 2800, '#6a5038', '#1e140c', 253); sh(x, 'M240 1640 L840 1640 L900 1760 L180 1760 Z', '#c8b888'); for (let k = 0; k < 9; k++) line(x, [250 + k * 70, 1640, 230 + k * 76, 1760], 2, 'rgba(90,70,40,.4)'); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,120,40,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.street = { light: o => o.tod === 'xmas' ? { x: 1, col: 'rgba(255,220,170,1)', rim: .8, shade: .3 } : { x: 1, col: 'rgba(255,245,220,1)', rim: .6, shade: .24 },
  back(g, o, c, T) { const xm = o.tod === 'xmas';
    layerAt(g, c, 0, () => blit(g, cacheLayer('st2_sky' + xm, x => { x.fillStyle = lg(x, 0, -700, 0, 1400, xm ? [[0, '#0a1030'], [1, '#2a3060']] : [[0, '#4a8ad8'], [.7, '#b0d4f4'], [1, '#eaf4ff']]); x.fillRect(-700, -700, 2480, 3400); if (xm) starsF(x, 120, 255, 700); else for (let i = 0; i < 4; i++) cloudF(x, -200 + i * 480, 520 + (i % 2) * 150, 1.0, 'rgba(255,255,255,.85)', 'rgba(255,255,255,.6)'); })));
    layerAt(g, c, .2, () => blit(g, cacheLayer('st2_far' + xm, x => { for (let i = 0; i < 12; i++) { const h = 200 + (i * 53) % 260, px = -500 + i * 190; sh(x, `M${px} 1400 L${px + 170} 1400 L${px + 170} ${1400 - h} L${px} ${1400 - h} Z`, xm ? ['#1e2240', '#262a4a', '#1a1e38'][i % 3] : ['#d8d0c4', '#c8c0b4', '#e4ddd0'][i % 3]);
      for (let k = 0; k < 5; k++) for (let j = 0; j < 3; j++) { x.fillStyle = xm ? ((i + k + j) % 3 ? 'rgba(255,220,140,.8)' : 'rgba(40,40,70,.8)') : 'rgba(90,120,160,.6)'; x.fillRect(px + 18 + j * 52, 1400 - h + 20 + k * 44, 34, 26); } } }, { blur: 1 })));
    layerAt(g, c, .55, () => { if (xm) for (let i = 0; i < 40; i++) { const x = -200 + i * 40, y = 1200 + Math.sin(i * .7) * 30; glow(g, x, y, 30, ['rgba(255,80,80,1)', 'rgba(80,255,120,1)', 'rgba(255,220,80,1)'][i % 3], .6 + .4 * Math.sin(T * 3 + i)); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('st2_ground' + xm, x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, xm ? [[0, '#e8ecf4'], [1, '#a8b0c4']] : [[0, '#a8a49c'], [1, '#6a665e']]); x.fillRect(-700, 1560, 2480, 1300); sh(x, 'M-700 1560 L1780 1560 L1780 1600 L-700 1600 Z', xm ? '#c8d0dc' : '#8a867e'); for (let i = 0; i < 9; i++) line(x, [-600 + i * 300, 1600, -800 + i * 340, 2700], 2, 'rgba(60,60,60,.2)'); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { if (o.tod === 'xmas') JPA.snowFall(g, { n: 70 }, c); },
  haze(g, o) { g.fillStyle = o.tod === 'xmas' ? 'rgba(80,100,200,.06)' : 'rgba(255,240,210,.04)'; g.fillRect(0, 0, 1080, 1920); } };
JPA.riceBowls = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);
  [[-130, 0], [0, 0], [130, 0], [-65, -110], [65, -110], [0, -220]].forEach(([x, y], i) => { g.save(); g.translate(x, y + Math.sin(T * 2 + i) * 3);
    tsh(g, 'M-60 -20 L60 -20 Q56 40 0 44 Q-56 40 -60 -20 Z', i % 2 ? '#2a3a6a' : '#a8342a', 4); tln(g, [-50, 0, 50, 0], 3, '#e8c050');
    tsh(g, 'M-58 -20 C-50 -66 50 -66 58 -20 Z', '#fbfaf2', 4); for (let k = -2; k <= 2; k++) tell(g, k * 16, -40 + Math.abs(k) * 6, 5, 7, '#f2eee2', 1.2); g.restore(); });
  g.restore(); };

// a fried-chicken shop front for the Christmas queue: striped awning, warm window, counter, no brand anywhere
JPA.shopFront = (g, A, c) => { const T = c.T; g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);
  tsh(g, 'M-300 0 L300 0 L300 -900 L-300 -900 Z', '#e8dccc', 5); tsh(g, 'M-250 -120 L250 -120 L250 -560 L-250 -560 Z', rg(g, 0, -340, 40, 400, [[0, '#fff2c8'], [1, '#f2b860']]), 5);
  glow(g, 0, -340, 520, 'rgba(255,200,120,1)', .35 + .05 * Math.sin(T * 2)); tsh(g, 'M-260 -120 L260 -120 L260 -60 L-260 -60 Z', '#8a5a3a', 5);
  for (let i = 0; i < 8; i++) { const x0 = -320 + i * 80; tsh(g, `M${x0} -600 L${x0 + 80} -600 L${x0 + 80} -680 L${x0} -680 Z`, i % 2 ? '#fbf6ee' : '#c8302a', 3); tsh(g, `M${x0} -600 Q${x0 + 40} -560 ${x0 + 80} -600 Z`, i % 2 ? '#fbf6ee' : '#c8302a', 3); }
  for (let k = 0; k < 6; k++) { const x = -200 + k * 80 + Math.sin(T + k) * 2; g.save(); g.translate(x, -120); JPA.chickenBucket(g, { x: 0, y: 0, s: .26 }, c); g.restore(); }
  g.restore(); };
// distinct looks (applied after the base definitions so they win): age, eyes, nose, jaw, hair, build differ for every person
Object.assign(TOON.tennoRite, { age: .55, eyeShape: 'narrow', nose: 'long', bulk: 1.1 });
Object.assign(TOON.kannushi, { age: .9, eyeShape: 'narrow', nose: 'long', bulk: .95, stoop: .03, jaw: 'long' });
Object.assign(TOON.farmerKen, { age: .7, eyeShape: 'droopy', nose: 'broad', bulk: 1.25 });
Object.assign(TOON.firefighter, { age: .15, hairStyle: 'short', eyeShape: 'upturned', nose: 'line', bulk: 1.32, h: 1.06 });
Object.assign(TOON.policeOfficer, { age: .35, hairStyle: 'ponytail', eyeShape: 'almond', nose: 'button', jaw: 'pointed', bulk: 1.05 });
Object.assign(TOON.nurse, { age: .65, hairStyle: 'bun', eyeShape: 'round', nose: 'button', jaw: 'wide', bulk: 1.18, h: .93 });
Object.assign(TOON.xmasDad, { age: .5, hairStyle: 'parted', eyeShape: 'droopy', nose: 'long', jaw: 'wide', bulk: 1.22 });
