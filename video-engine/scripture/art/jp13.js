// JP13 Kuzunoha, the fox mother: Yasuna, Kuzunoha, little Seimei (a boy, nothing like Mio), two hunters, grown Seimei the onmyoji,
// the wild white fox (no red markings, unlike Kon), the poem on the paper door, the crystal orb; Shinoda's bamboo forest and the family's room.
function seimanHat(g, L, rx, ry) { tsh(g, `M${-rx * .66} ${-ry * .74} C${-rx * .74} ${-ry * 1.4} ${-rx * .3} ${-ry * 2.2} ${rx * .1} ${-ry * 2.3} C${rx * .5} ${-ry * 2.1} ${rx * .7} ${-ry * 1.4} ${rx * .66} ${-ry * .74} Z`, '#141016', 5);
  tln(g, [-rx * .6, -ry * .9, rx * .6, -ry * .9], 3, '#3a3040'); }
function hunterHat(g, L, rx, ry) { tsh(g, `M${-rx * 1.5} ${-ry * .52} Q0 ${-ry * 1.8} ${rx * 1.5} ${-ry * .52} Q0 ${-ry * .7} ${-rx * 1.5} ${-ry * .52} Z`, L.hat || '#b89a5a', 5); for (let k = -3; k <= 3; k++) tln(g, [k * rx * .4, -ry * .62, k * rx * .12, -ry * 1.3], 2, 'rgba(90,60,20,.45)'); }
const seimanStar = (g, L, G) => { g.save(); g.translate(60, G.shY + 120); const r = 26; g.beginPath(); for (let k = 0; k <= 5; k++) { const a = -Math.PI / 2 + k * 4 * Math.PI / 5; k ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.lineWidth = 4; g.strokeStyle = '#5a3a8a'; g.stroke(); g.restore(); };
Object.assign(TOON, {
  yasuna:   { kind: 'adult', age: .2, skin: '#eac09a', skinD: '#cea078', hair: '#1a1418', hairHi: '#4a4050', hairStyle: 'short', cord: '#2f6f6c', top: '#2f6f6c', topD: '#235654', pat: 'waves', patCol: 'rgba(220,240,230,.35)', collar: '#f2ecde',
              trimCol: '#1e4a48', trimDot: '#f2ecde', sleeve: 'kinu', bottom: 'hakama', hakama: '#8a7a5a', hakamaD: '#6e6046', belt: '#c8a868', feet: 'straw', wraps: '#f2ecde', eyes: 'adult', eyeShape: 'almond', iris: '#3a2414', brow: 6, jaw: 'round', nose: 'line', bulk: 1.08, h: 1.02 },
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

// ================= the wild fox (Kuzunoha's true form): an original design, not Kon =================
// slender, long muzzle, tall ears, one big brush tail; side view facing right; gaits: run | trot | stand | cower; scared ears fold back
JPA.wildFox = (g, A, c) => { const T = c.T + (A.ph || 0), gait = A.gait || 'stand', run = gait === 'run', ph = T * (A.rate || (run ? 14 : 8)), scared = A.scared ?? (run || gait === 'cower');
  const C = A.col || '#f6f3ee', CD = mix(C, '#6a7488', .32), TIP = A.tip || '#bcd0ea', INK = '#2a2230';
  g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha; g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * (A.s || 1), A.s || 1);
  if (A.glowA) glow(g, 0, -150, 360, 'rgba(210,230,255,1)', A.glowA);
  g.fillStyle = rg(g, 0, 4, 10, 170, [[0, 'rgba(20,10,20,.35)'], [1, 'rgba(20,10,20,0)']]); g.beginPath(); g.ellipse(0, 4, 170, 16, 0, 0, 7); g.fill();
  const bob = run ? -Math.abs(Math.sin(ph)) * 22 : gait === 'trot' ? -Math.abs(Math.sin(ph)) * 7 : 0, low = gait === 'cower' ? 34 : 0, trem = A.tremble ? Math.sin(T * 47) * 2.4 * A.tremble : 0;
  g.translate(trem, bob + low);
  const leg = (hx, hy, ang, col, front) => { const L1 = 50, L2 = 48, bend = (front ? -1 : 1) * (run ? .7 : .3), kx = hx + Math.sin(ang) * L1, ky = hy + Math.cos(ang) * L1, fx = kx + Math.sin(ang + bend * .6) * L2, fy = Math.min(-low - bob - 2, ky + Math.cos(ang + bend * .6) * L2);
    ttube(g, hx, hy, kx, ky, front ? 34 : 42, 24, col, 4); ttube(g, kx, ky, fx, fy, 20, 16, col, 4); tsh(g, `M${fx - 8} ${fy - 6} L${fx + 16} ${fy - 4} Q${fx + 22} ${fy + 4} ${fx + 14} ${fy + 6} L${fx - 8} ${fy + 6} Z`, mix(col, '#3a3040', .35), 3); };
  const A1 = run ? .95 : gait === 'trot' ? .45 : .06, sF = Math.sin(ph), sB = Math.sin(ph + 2.2);
  leg(-84, -86, run ? sB * A1 : -sF * A1, CD, false); leg(74, -88, run ? sF * A1 : sF * A1, CD, true);   // far legs
  // the brush tail: one, big, white-tipped; tucked low when scared
  const tw = Math.sin(T * (run ? 6 : 2)) * (run ? .12 : .18); g.save(); g.translate(-118, -112); g.rotate((scared ? .35 : -.6) + tw); g.scale(1.15, 1.35);
  const tl = 'M0 0 C-60 -10 -150 -40 -190 -100 C-205 -130 -170 -150 -140 -130 C-110 -100 -60 -70 0 -40 Z'; tsh(g, tl, C, 5); g.save(); g.clip(path(tl)); g.fillStyle = TIP; g.beginPath(); g.ellipse(-180, -118, 46, 40, 0, 0, 7); g.fill(); g.restore(); tsh(g, tl, null, 5); g.restore();
  // body: long and lean, pale belly
  const body = 'M-138 -112 C-150 -168 -40 -176 40 -166 C108 -160 138 -140 136 -104 C134 -66 96 -58 44 -62 L-84 -64 C-128 -66 -134 -84 -138 -112 Z';
  tsh(g, body, C, 5); g.save(); g.clip(path(body)); g.fillStyle = 'rgba(120,130,160,.22)'; g.beginPath(); g.ellipse(-10, -172, 200, 40, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(10, -62, 120, 18, 0, 0, 7); g.fill(); g.restore(); tsh(g, body, null, 5);
  leg(-66, -84, run ? -sB * A1 : sF * A1, C, false); leg(92, -86, run ? -sF * A1 : -sF * A1, C, true);   // near legs
  // head on a raised neck, long muzzle; look back over the shoulder when fleeing
  const back = (A.lookBack || 0) > .5; g.save(); g.translate(112, -150 + (gait === 'cower' ? 30 : 0)); g.scale(1.25, 1.25); if (back) g.scale(-1, 1); g.rotate((run ? .12 : 0) + Math.sin(T * 1.3) * .03);
  tsh(g, 'M-40 40 C-30 0 -10 -30 20 -40 L50 -10 C30 10 10 40 -10 60 Z', C, 5);
  const ear = (x, r, col) => { g.save(); g.translate(x, -46); g.rotate(scared ? -1.05 : r); tsh(g, 'M-16 6 L2 -78 L22 4 Z', col, 4.4); tsh(g, 'M-7 0 L3 -54 L13 -2 Z', '#f2c4cc', 0); tsh(g, 'M-4 -50 L2 -78 L9 -50 Z', '#3a3440', 0); g.restore(); };
  ear(18, -.12, CD);
  const hd = 'M-8 -34 C6 -62 58 -64 82 -36 L150 -6 Q160 4 150 12 L80 22 C46 32 4 22 -8 -34 Z'; tsh(g, hd, C, 5); g.save(); g.clip(path(hd)); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(100, 16, 60, 14, 0, 0, 7); g.fill(); g.restore(); tsh(g, hd, null, 5);
  ear(48, .1, C); tell(g, 151, 2, 9, 7, '#1a1418', 0); tln(g, [96, 14, 128, 12], 2.4, INK);
  const blink = ((T * .5) % 4) < .08, eW = scared ? 17 : 15, eH = scared ? 11 : 7;
  if (blink) tln(g, [58, -20, 86, -18], 4, INK); else { const eye = `M56 -18 Q72 ${-20 - eH * 1.6} 90 -22 Q74 ${-14 + eH} 56 -18 Z`; tsh(g, eye, scared ? '#fffdf8' : (A.eyeCol || '#e8b040'), 3.4, INK);
    tell(g, scared ? 76 : 74, -19, scared ? 4 : 3.4, scared ? 5 : eH * .8, '#140c08', 0); tell(g, 78, -22, 2, 2, '#fff', 0); tln(g, [54, -16, 72, -32, 94, -24], 3.4, INK); }
  if (scared) tln(g, [60, -40, 84, -44], 3, INK);
  g.restore(); g.restore(); };
// a frightened fox held in someone's arms (THOLD at the hand): curled small, trembling
THOLD.foxHeld = (g, h, o, t) => { JPA.wildFox(g, { x: h[0] - 10, y: h[1] + 60, s: .95, gait: 'cower', tremble: 1, scared: true, flip: true }, { T: t }); };
THOLD.stick = (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.4); tln(g, [0, 30, 0, -260], 16, '#4a3020'); tln(g, [0, 30, 0, -260], 8, '#7a5236'); g.restore(); };
// Yasuna after the beating: bruises and a scrape (same man, same face)
TOON.yasunaHurt = Object.assign({}, TOON.yasuna, { headX: (g, L, rx, ry) => { tell(g, -rx * .5, ry * .1, rx * .22, ry * .14, 'rgba(120,60,140,.45)', 0); tell(g, rx * .38, -ry * .42, rx * .18, ry * .1, 'rgba(120,60,140,.4)', 0);
  tln(g, [rx * .2, ry * .5, rx * .46, ry * .38], 3, 'rgba(190,40,40,.7)'); tln(g, [rx * .26, ry * .58, rx * .5, ry * .46], 2.4, 'rgba(190,40,40,.55)'); } });
// a hit flash: white starburst with speed lines, for the beating close-up
JPA.impact = (g, A, c) => { const k = clamp(A.k ?? 1); if (k <= 0 || k >= 1) return; const r = 60 + k * 160; g.save(); g.globalAlpha *= 1 - k; g.translate(A.x, A.y); let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, rr = i % 2 ? r * .45 : r; d += (i ? ' L' : 'M') + (Math.cos(a) * rr) + ' ' + (Math.sin(a) * rr); }
  tsh(g, d + ' Z', '#fffbe8', 5, '#1a1010'); g.restore(); };
// a leafy bush that rustles and parts when someone pushes through
JPA.bush = (g, A, c) => { const T = c.T, sh = A.shake ?? 0, part = clamp(A.part ?? 0); g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); const r = rng(A.seed || 7), base = A.col || '#2e5a3a';
  [[-150, -90, 120], [-40, -150, 150], [90, -110, 130], [180, -60, 90], [-220, -40, 80]].forEach(([bx, by, br], i) => { const w = Math.sin(T * 18 + i) * sh * 10; tell(g, bx + w + (bx < 0 ? -1 : 1) * part * 120, by, br, br * .8, mix(base, '#000', .3), 5); });
  for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1, bx = (r() - .5) * 420 + side * part * 120, by = -r() * 300 - 20, w = Math.sin(T * 18 + i) * sh * 14 + Math.sin(T * 1.4 + i) * 3;
    g.save(); g.translate(bx + w, by); g.rotate((r() - .5) * 1.4 + w * .02); tsh(g, 'M0 -40 C30 -30 34 20 0 40 C-34 20 -30 -30 0 -40 Z', i % 3 ? (A.col || '#2e5a3a') : mix(A.col || '#2e5a3a', '#000', .25), 3); tln(g, [0, -34, 0, 34], 2, 'rgba(0,0,0,.25)'); g.restore(); }
  g.restore(); };
// big out-of-focus bamboo stalks sliding across the foreground (depth while walking between trees)
JPA.fgBamboo = (g, A, c) => { const T = c.T; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'blur(6px)'; (A.xs || [80, 520, 980]).forEach((x0, i) => { const x = ((x0 + T * (A.sp || 160)) % 1500) - 200;
  g.fillStyle = A.col || '#0e1a16'; g.fillRect(x, -50, 90, 2100); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 12, -50, 14, 2100); for (let y = 100 + i * 140; y < 2000; y += 420) { g.fillStyle = '#06100c'; g.fillRect(x - 6, y, 102, 14); } }); g.filter = 'none'; g.restore(); };
// the orb, close: cupped child hands, a glowing sphere full of turning light, spirits circling, rays
JPA.orbClose = (g, A, c) => { const T = c.T, x = A.x || 540, y = A.y || 1150, R = A.r || 230; g.save();
  for (let i = 0; i < 14; i++) { const a = T * .25 + i / 14 * 6.283; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .1; g.fillStyle = '#bfe0ff'; g.beginPath(); g.moveTo(x, y); g.arc(x, y, 1100, a, a + .09); g.closePath(); g.fill(); g.restore(); }
  glow(g, x, y, R * 3, 'rgba(150,210,255,1)', .7);
  const sp = (k, front) => { for (let i = 0; i < 7; i++) { const a = T * .9 + i / 7 * 6.283, z = Math.sin(a); if ((z > 0) !== front) continue; const px = x + Math.cos(a) * R * 1.6, py = y + z * R * .5 - 40, ss = .7 + z * .3;
    glow(g, px, py, 70 * ss, 'rgba(200,240,255,1)', .8); g.save(); g.translate(px, py); g.scale(ss, ss); tsh(g, 'M0 -34 C14 -18 18 0 10 12 C4 20 -4 20 -10 12 C-18 0 -14 -18 0 -34 Z', 'rgba(220,245,255,.9)', 0); g.restore(); } };
  sp(0, false);
  tell(g, x, y, R, R, rg(g, x - R * .35, y - R * .4, R * .05, R * 1.1, [[0, '#ffffff'], [.35, '#cfeaff'], [.75, '#5a8ad8'], [1, '#1e3a7a']]), 6, 0, '#1a2440');
  g.save(); g.beginPath(); g.arc(x, y, R - 4, 0, 7); g.clip(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 5; k++) { g.beginPath(); g.lineWidth = 14 - k * 2; g.strokeStyle = `rgba(${180 + k * 15},230,255,.35)`; g.ellipse(x, y, R * (.3 + k * .14), R * (.12 + k * .07), T * (.6 + k * .2) + k, 0, 7); g.stroke(); }
  g.globalAlpha = .5; JPA.wildFox(g, { x: x - 20, y: y + 80, s: .5, gait: 'stand', glowA: .6, alpha: .7 + .2 * Math.sin(T * 2) }, c); g.restore();
  tell(g, x - R * .38, y - R * .42, R * .2, R * .12, 'rgba(255,255,255,.85)', 0, -.6);
  const skin = A.skin || '#f2cca6', skD = mix(skin, '#8a5a40', .3); [-1, 1].forEach(s => { g.save(); g.translate(x, y); g.scale(s, 1);   // two small palms cradling the orb from below, wrists running off the bottom
    tsh(g, `M${R * .25} ${R * 2.2} L${R * .25} ${R * 1.2} L${R * .75} ${R * 1.1} L${R * .85} ${R * 2.2} Z`, skD, 6);
    tsh(g, `M${R * .02} ${R * 1.16} C${R * .5} ${R * 1.32} ${R * 1.08} ${R * 1.0} ${R * 1.02} ${R * .32} C${R * .98} ${R * .12} ${R * .86} ${R * .14} ${R * .84} ${R * .34} C${R * .82} ${R * .72} ${R * .5} ${R * .98} ${R * .02} ${R * .98} Z`, skin, 6);
    [[.9, .42], [.8, .66], [.62, .86]].forEach(([fx, fy]) => tln(g, [R * fx, R * fy, R * (fx - .1), R * (fy + .08)], 2.6, 'rgba(150,90,60,.55)')); g.restore(); });
  sp(0, true); g.restore(); };
