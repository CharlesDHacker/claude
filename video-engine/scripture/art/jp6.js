// JP06 Benkei: the warrior monk (white cowl, prayer beads, seven weapons on his back, naginata), Ushiwakamaru (veil, flute,
// war fan) who becomes the general Yoshitsune, Sojobo the tengu king and his crow tengu, the brother who hunted them, the
// checkpoint guard, archers and spearmen, and a joke Genghis Khan. Worlds: Gojo bridge by moonlight, the Kurama cedar forest,
// the cliff charge, the sea battle, the checkpoint, the burning hall at Koromogawa, the shogun's hall, the steppe, Gojo today.

// ---------- character parts (rig hooks: behind / headX / frontX) ----------
function benkeiCowl(g, L, rx, ry, o) { // katou-zukin: white cloth over head and neck, face left open
  const P = new Path2D(`M${-rx * 1.32} ${ry * 1.15} C${-rx * 1.5} ${-ry * .4} ${-rx * 1.0} ${-ry * 1.62} 0 ${-ry * 1.62} C${rx * 1.0} ${-ry * 1.62} ${rx * 1.5} ${-ry * .4} ${rx * 1.32} ${ry * 1.15} Q0 ${ry * 1.45} ${-rx * 1.32} ${ry * 1.15} Z ` +
    `M${-rx * .84} ${ry * .05} C${-rx * .86} ${ry * .9} ${-rx * .4} ${ry * 1.08} 0 ${ry * 1.08} C${rx * .4} ${ry * 1.08} ${rx * .86} ${ry * .9} ${rx * .84} ${ry * .05} C${rx * .8} ${-ry * .5} ${rx * .5} ${-ry * .52} 0 ${-ry * .5} C${-rx * .5} ${-ry * .52} ${-rx * .8} ${-ry * .5} ${-rx * .84} ${ry * .05} Z`);
  g.save(); g.fillStyle = L.cowl || '#f2eee4'; g.fill(P, 'evenodd'); g.clip(P, 'evenodd'); g.fillStyle = 'rgba(120,110,140,.22)'; g.fillRect(rx * .3, -ry * 2, rx * 2, ry * 4);
  [[-1.1, -.9, -.5, -1.3], [1.1, -.9, .5, -1.3], [-1.2, .3, -.9, .9], [1.2, .3, .9, .9], [-.3, -1.45, .3, -1.45]].forEach(([a, b, c2, d]) => tln(g, [rx * a, ry * b, rx * c2, ry * d], 3, 'rgba(120,110,130,.45)'));
  g.restore(); g.lineWidth = 6; g.strokeStyle = OUT; g.stroke(P); }
function benkeiBack(g, L, G, o, t) { // the seven weapons fanned over his back, and the cowl's tail
  const sw = Math.sin(t * 1.2) * .02;
  const W7 = [[-.5, 'axe'], [-.36, 'saw'], [-.22, 'rake'], [.2, 'fork'], [.32, 'mallet'], [.44, 'sickle'], [.56, 'pole']];
  W7.forEach(([an, kind], i) => { g.save(); g.translate(0, G.waist - 40); g.rotate(an + sw); const top = -600 - (i % 2) * 50;
    tln(g, [0, 0, 0, top], 18); tln(g, [0, 0, 0, top], 10, i % 2 ? '#6a4a2a' : '#5a3a22'); g.translate(0, top); g.scale(.8, .8);
    if (kind === 'axe') tsh(g, 'M0 20 L70 -10 Q100 30 80 80 L0 50 Z', '#9aa4b2', 5);
    if (kind === 'saw') { tsh(g, 'M-14 40 L-14 -150 L22 -150 L22 40 Z', '#aab2be', 4); for (let k = 0; k < 9; k++) tsh(g, `M22 ${-146 + k * 20} l14 8 l-14 8 Z`, '#aab2be', 2.4); }
    if (kind === 'rake') { tln(g, [-60, -10, 60, -10], 10); for (let k = -2; k <= 2; k++) tsh(g, `M${k * 28 - 5} -10 L${k * 28 + 5} -10 L${k * 30} -70 Z`, '#8a929e', 3); }
    if (kind === 'fork') tln(g, [-50, -80, -40, 0, 40, 0, 50, -80], 10, '#8a929e');
    if (kind === 'mallet') tsh(g, 'M-50 -60 L50 -60 L50 10 L-50 10 Z', '#6a4a2a', 5);
    if (kind === 'sickle') tsh(g, 'M0 0 Q60 -60 20 -120 Q90 -70 10 10 Z', '#aab2be', 4);
    if (kind === 'pole') { tsh(g, 'M-8 0 Q-20 -90 10 -170 Q24 -80 10 0 Z', '#c8d0da', 4); }
    g.restore(); });
  tsh(g, `M-90 ${G.head[1] + 40} Q-150 ${G.shY + 120} -120 ${G.shY + 230} L120 ${G.shY + 230} Q150 ${G.shY + 120} 90 ${G.head[1] + 40} Z`, L.cowl || '#f2eee4', 5); }
function prayerBeads(g, L, G) { const tw = 98 * (L.bulk || 1), n = 15;
  for (let i = 0; i <= n; i++) { const q = i / n, x = lerp(-tw * .62, tw * .62, q), y = G.shY + 6 + Math.sin(q * Math.PI) * 220; tell(g, x, y, 17, 17, '#2a1e18', 4); tell(g, x - 5, y - 6, 5, 4, 'rgba(255,255,255,.35)', 0); }
  tsh(g, `M-14 ${G.shY + 238} L14 ${G.shY + 238} L24 ${G.shY + 320} L-24 ${G.shY + 320} Z`, '#7a2a6a', 4); tell(g, 0, G.shY + 236, 22, 22, '#e8c050', 4); }
function veilBack(g, L, G, o, t) { if (o.noVeil) return; const sw = Math.sin(t * 1.4) * 10;
  tsh(g, `M-110 ${G.head[1] - 60} C-170 ${G.shY - 40} ${-160 + sw} ${G.waist - 60} ${-150 + sw} ${G.waist + 40} L${150 + sw} ${G.waist + 40} C${160 + sw} ${G.waist - 60} 170 ${G.shY - 40} 110 ${G.head[1] - 60} Z`, L.veil || '#f6f1e6', 5);
  g.save(); g.clip(path(`M-260 ${G.head[1] - 60} L260 ${G.head[1] - 60} L300 ${G.waist + 130} L-300 ${G.waist + 130} Z`)); tpattern(g, `M-300 ${G.head[1]} L300 ${G.head[1]} L300 ${G.waist + 130} L-300 ${G.waist + 130} Z`, 'petals', 'rgba(220,80,100,.4)', 1); g.restore();
  tln(g, [-150 + sw, G.waist + 32, 150 + sw, G.waist + 32], 10, L.veilLine || '#c8302a'); }
function veilFront(g, L, rx, ry, o) { if (o.noVeil) return;
  const d = `M${-rx * 1.22} ${ry * .5} C${-rx * 1.36} ${-ry * 1.0} ${-rx * .7} ${-ry * 1.52} 0 ${-ry * 1.52} C${rx * .7} ${-ry * 1.52} ${rx * 1.36} ${-ry * 1.0} ${rx * 1.22} ${ry * .5} L${rx * 1.02} ${ry * .4} C${rx * 1.08} ${-ry * .7} ${rx * .6} ${-ry * 1.16} 0 ${-ry * 1.16} C${-rx * .6} ${-ry * 1.16} ${-rx * 1.08} ${-ry * .7} ${-rx * 1.02} ${ry * .4} Z`;
  tsh(g, d, L.veil || '#f6f1e6', 5); tln(g, [-rx * 1.04, ry * .36, -rx * 1.06, -ry * .6, -rx * .6, -ry * 1.12, 0, -ry * 1.18, rx * .6, -ry * 1.12, rx * 1.06, -ry * .6, rx * 1.04, ry * .36], 6, L.veilLine || '#c8302a'); }
function tenguNose(g, L, rx, ry) { // the long red nose, jutting up and out
  tsh(g, `M${-rx * .14} ${ry * .06} C${rx * .3} ${ry * .02} ${rx * .9} ${ry * .1} ${rx * 1.42} ${ry * .22} C${rx * 1.56} ${ry * .26} ${rx * 1.56} ${ry * .42} ${rx * 1.42} ${ry * .44} C${rx * .9} ${ry * .48} ${rx * .3} ${ry * .5} ${-rx * .1} ${ry * .44} Q${-rx * .26} ${ry * .26} ${-rx * .14} ${ry * .06} Z`, L.nose || mix(L.skin, '#ff6a50', .25), 5);
  tln(g, [rx * .1, ry * .14, rx * 1.3, ry * .27], 4, 'rgba(255,230,210,.55)'); }
function crowBeak(g, L, rx, ry, o, t, ex) { const op = (o.talk || 0) * .5 + (ex === 'shout' ? .5 : 0);
  tsh(g, `M${-rx * .42} ${ry * .02} Q0 ${-ry * .18} ${rx * .42} ${ry * .02} Q${rx * .3} ${ry * .5} 0 ${ry * .98} Q${-rx * .3} ${ry * .5} ${-rx * .42} ${ry * .02} Z`, '#f0b030', 5);
  tsh(g, `M${-rx * .32} ${ry * (.34 + op * .2)} Q0 ${ry * (.5 + op * .3)} ${rx * .32} ${ry * (.34 + op * .2)} Q0 ${ry * (1.06 + op * .3)} ${-rx * .32} ${ry * (.34 + op * .2)} Z`, '#d88a20', 4);
  tln(g, [-rx * .3, ry * .12, -rx * .1, ry * .1], 3, 'rgba(90,50,10,.6)'); }
function wingsOf(col, hi) { return (g, L, G, o, t) => { const fl = o.flap ?? .35, ph = Math.sin(t * (o.flapRate || 4)) * fl;
  [-1, 1].forEach(sd => { g.save(); g.translate(sd * 60, G.shY + 50); g.rotate(sd * (.25 - ph * .5)); g.scale(sd, 1 - ph * .25);
    const d = 'M0 0 C120 -200 380 -330 640 -320 L600 -250 L660 -230 L590 -160 L640 -120 L550 -70 L590 -20 L490 0 L520 60 L400 60 L410 120 L280 100 L260 170 L150 120 Q60 120 0 60 Z';
    tsh(g, d, col, 5); for (let k = 0; k < 6; k++) tln(g, [70 + k * 40, 20 - k * 30, 560 - k * 50, -270 + k * 60], 3, hi); g.restore(); }); }; }
function mongolHat(g, L, rx, ry) { tsh(g, `M${-rx * .9} ${-ry * .62} Q0 ${-ry * 2.0} ${rx * .9} ${-ry * .62} Z`, '#a8242a', 5); tell(g, 0, -ry * 1.66, 14, 14, '#e8c050', 4);
  let d = `M${-rx * 1.12} ${-ry * .4}`; for (let i = 0; i <= 14; i++) { const x = lerp(-rx * 1.12, rx * 1.12, i / 14); d += ` L${x} ${-ry * (i % 2 ? .98 : .86)}`; } d += ` L${rx * 1.12} ${-ry * .4} Q0 ${-ry * .52} ${-rx * 1.12} ${-ry * .4} Z`; tsh(g, d, '#8a6a4a', 5); }
const BENKEI = { kind: 'adult', skin: '#c88a5c', skinD: '#a86e44', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'none', browCol: '#15121a', top: '#1c1c26', topD: '#121218', pat: 'diamond', patCol: 'rgba(150,150,190,.18)', collar: '#e8e2d2',
  trimCol: '#3a2a3a', trimDot: '#c8a040', sleeve: 'wide', bottom: 'hakama', hakama: '#2e2e3a', hakamaD: '#20202a', belt: '#c8a040', feet: 'straw', wraps: '#e8e2d2', wrapLine: '#2e2e3a', eyes: 'adult', iris: '#2a1810', brow: 12, beard: 'short', jaw: 'square',
  bulk: 1.5, h: 1.12, cowl: '#f2eee4', behind: benkeiBack, headX: benkeiCowl, frontX: (g, L, G) => prayerBeads(g, L, G) };
Object.assign(TOON, {
  benkei: BENKEI,
  ushiwaka: { kind: 'adult', skin: '#f4d2b2', skinD: '#dcae88', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'longBangs', top: '#f6f1e6', topD: '#e0d6c4', pat: 'petals', patCol: 'rgba(220,80,100,.45)', collar: '#c8302a', trimCol: '#c8302a', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#a8242a', hakamaD: '#86181e', belt: '#e8c050', feet: 'straw', wraps: '#f6f1e6', wrapLine: '#a8242a', eyes: 'adult', iris: '#2a1810', brow: 5, jaw: 'round', h: .9, headW: .96, veil: '#f6f1e6', veilLine: '#c8302a', behind: veilBack, headX: veilFront },
  yoshitsune: { kind: 'adult', skin: '#f0caa6', skinD: '#d6a682', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', cord: '#e8c050', top: '#a8242a', topD: '#86181e', pat: 'waves', patCol: 'rgba(255,210,150,.3)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#a8242a',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#f6f1e6', hakamaD: '#dcd2c0', belt: '#e8c050', feet: 'straw', wraps: '#f6f1e6', wrapLine: '#a8242a', eyes: 'adult', iris: '#2a1810', brow: 7, jaw: 'round', armor: '#a8242a', rivet: '#e8c050', kabuto: '#14141c', h: .98 },
  yoshiP: { kind: 'adult', skin: '#f0caa6', skinD: '#d6a682', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', cord: '#8a6a4a', top: '#8a7458', topD: '#6e5c44', pat: null, collar: '#c8b898', trimCol: '#5a4a3a', trimDot: '#c8b898',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#6e5c44', hakamaD: '#5a4a36', belt: '#4a3a2a', feet: 'straw', wraps: '#c8b898', eyes: 'adult', iris: '#2a1810', brow: 7, jaw: 'round', h: .96 },
  sojobo: { kind: 'adult', skin: '#d0443a', skinD: '#a83228', hair: '#f2eee6', hairHi: '#ffffff', hairStyle: 'wild', band: false, browCol: '#f2eee6', top: '#f4efe2', topD: '#d8d0bc', pat: 'diamond', patCol: 'rgba(120,110,90,.25)', collar: '#6a3a8a', trimCol: '#6a3a8a', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#6a3a8a', hakamaD: '#4e2a6a', belt: '#e8c050', feet: 'straw', wraps: '#f4efe2', eyes: 'adult', iris: '#ffd040', brow: 12, beard: 'longWhite', jaw: 'square', tokin: true, pompoms: '#e8c050', bulk: 1.25, h: 1.1, wingsBig: true,
    behind: wingsOf('#3a2a22', 'rgba(150,110,80,.6)'), headX: tenguNose },
  karasu: { kind: 'adult', skin: '#2e2e3e', skinD: '#22222e', hair: '#15121a', hairHi: '#3a3a4a', hairStyle: 'wild', band: false, browCol: '#15121a', top: '#2a2a34', topD: '#1e1e26', pat: 'diamond', patCol: 'rgba(160,160,200,.15)', collar: '#8a8a9a', trimCol: '#4a4a5a', trimDot: '#c8302a',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#4a4a5a', hakamaD: '#3a3a48', belt: '#c8302a', feet: 'straw', wraps: '#2a2a34', eyes: 'adult', iris: '#ff3a2a', brow: 10, jaw: 'square', tokin: true, pompoms: '#c8302a', h: .96, wingsBig: true,
    behind: wingsOf('#15121a', 'rgba(110,110,150,.5)'), headX: crowBeak },
  yoritomo: { kind: 'adult', skin: '#e8c4a0', skinD: '#cca27c', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'heian', top: '#1e2440', topD: '#141a30', pat: 'diamond', patCol: 'rgba(200,200,240,.15)', collar: '#e8e2d2', trimCol: '#c8a040', trimDot: '#1e2440',
    sleeve: 'wide', bottom: 'hakama', hakama: '#2a2a3a', hakamaD: '#1e1e2a', belt: '#c8a040', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', iris: '#140c08', brow: 8, jaw: 'square', eboshi: true, h: 1.02 },
  togashi: { kind: 'adult', skin: '#d8a070', skinD: '#b8804e', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', cord: '#2a6a5a', top: '#2a5a4a', topD: '#1e4438', pat: 'diamond', patCol: 'rgba(200,240,200,.2)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#2a5a4a',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#e8e2d2', hakamaD: '#c4bca8', belt: '#e8c050', feet: 'straw', wraps: '#e8e2d2', eyes: 'adult', iris: '#2a1810', brow: 9, beard: 'short', jaw: 'square', armor: '#2a5a4a', rivet: '#e8c050', h: 1.02 },
  spear: { kind: 'adult', skin: '#c89068', skinD: '#a87048', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'mizura', cord: '#7a2a2a', top: '#4a3a2a', topD: '#3a2c20', pat: null, collar: '#c8b898', trimCol: '#2a2020', trimDot: '#c8a040',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#3a3a44', hakamaD: '#2a2a34', belt: '#7a2a2a', feet: 'straw', wraps: '#c8b898', eyes: 'adult', iris: '#2a1810', brow: 9, beard: 'stubble', jaw: 'square', armor: '#3a3028', rivet: '#c8a040', kabuto: '#1e1a1e', h: 1.0 },
  genghis: { kind: 'adult', skin: '#f0caa6', skinD: '#d6a682', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', top: '#2a4a8a', topD: '#1e3a6e', pat: 'clouds', patCol: 'rgba(240,210,120,.35)', collar: '#e8c050', trimCol: '#e8c050', trimDot: '#2a4a8a', fur: '#8a6a4a',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#3a2a22', hakamaD: '#2a1e18', belt: '#e8c050', feet: 'straw', wraps: '#3a2a22', eyes: 'adult', iris: '#2a1810', brow: 8, beard: 'short', jaw: 'round', h: 1.0, headX: mongolHat },
});
Object.assign(THOLD, {
  naginata: (g, h, o) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.2); tln(g, [0, 240, 0, -560], 20); tln(g, [0, 240, 0, -560], 11, '#5a3a22'); tsh(g, 'M-16 -560 L16 -560 L14 -590 L-14 -590 Z', '#c8a040', 4);
    tsh(g, 'M-12 -588 C-16 -700 10 -800 60 -860 C40 -760 30 -680 16 -588 Z', lg(g, -16, 0, 60, 0, [[0, '#8a96a8'], [.5, '#f6faff'], [1, '#9aa6b8']]), 4); if (o.glint) glow(g, 30, -760, 200, 'rgba(220,240,255,1)', o.glint); g.restore(); },
  flute: (g, h, o) => { g.save(); g.translate(h[0] + 24, h[1] - 6); g.rotate(-.04); tsh(g, 'M-230 -9 L30 -9 L30 9 L-230 9 Z', '#3a2418', 4); for (let k = 0; k < 6; k++) tell(g, -190 + k * 30, 0, 4, 4, '#140c08', 0); tln(g, [-226, -3, 26, -3], 2, 'rgba(255,220,180,.3)'); g.restore(); },
  fan: (g, h, o) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.4); const op = o.fanOpen ?? 1; for (let k = -4; k <= 4; k++) tln(g, [0, 0, Math.sin(k * .18 * op) * 150, -Math.cos(k * .18 * op) * 150], 4, '#2a1a12');
    if (op > .1) { tsh(g, `M0 0 L${Math.sin(-.72 * op) * 160} ${-Math.cos(-.72 * op) * 160} A160 160 0 0 1 ${Math.sin(.72 * op) * 160} ${-Math.cos(.72 * op) * 160} Z`, '#1a1418', 4); tell(g, 0, -100, 22, 22, '#e84a3a', 0); } g.restore(); },
  hauchiwa: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate((o.holdRot ?? -.2) + Math.sin(t * 2) * .08); tln(g, [0, 30, 0, -60], 12, '#5a3a22');
    for (let k = -5; k <= 5; k++) tsh(g, `M0 -60 Q${k * 22} -150 ${k * 26} -230 Q${k * 26 + 12} -170 0 -60 Z`, k % 2 ? '#f4efe2' : '#d8d0bc', 3); g.restore(); },
  staff: (g, h, o) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.3); tln(g, [0, 200, 0, -380], 16); tln(g, [0, 200, 0, -380], 8, '#8a6a42'); g.restore(); },
  bokken: (g, h, o) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.15); tsh(g, 'M-10 30 L10 30 L10 -6 L-10 -6 Z', '#3a2418', 4); tsh(g, 'M-10 -6 L10 -6 L8 -300 L0 -320 L-8 -300 Z', '#b88a52', 4); g.restore(); },
});

// ---------- props ----------
// a pile of captured swords that grows night after night
JPA.swordPile = (g, A, c) => { const n = Math.min(90, Math.floor(A.n || 40)), r = rng(A.seed || 21); g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1);
  for (let i = 0; i < n; i++) { const q = i / 90, x = (r() - .5) * (260 + q * 120), y = -q * 260 * (1 - Math.abs(x) / 400) - r() * 20, an = (r() - .5) * 2.6;
    g.save(); g.translate(x, y); g.rotate(an); tsh(g, 'M-6 0 L6 0 L5 -150 L0 -162 L-5 -150 Z', r() > .5 ? '#c8d0da' : '#9aa4b2', 3); tsh(g, 'M-14 0 L14 0 L12 10 L-12 10 Z', '#c8a040', 2.6); tsh(g, 'M-5 10 L5 10 L5 54 L-5 54 Z', r() > .5 ? '#2a1a12' : '#5a2a1e', 2.6); g.restore(); }
  g.restore(); };
// music notes drifting from the flute
JPA.notes = (g, A, c) => { for (let i = 0; i < (A.n || 6); i++) { const q = ((c.T * .35 + i / (A.n || 6)) % 1), x = A.x + q * 260 * (A.dir || 1) + Math.sin(q * 9 + i) * 30, y = A.y - q * 380;
  g.save(); g.globalAlpha = Math.sin(q * Math.PI) * .95; g.translate(x, y); g.rotate(Math.sin(q * 6 + i) * .3); tell(g, 0, 0, 16, 12, '#fff2c0', 3, -.4); tln(g, [14, -2, 14, -64, 34, -50], 4, '#fff2c0'); glow(g, 0, -20, 70, 'rgba(255,230,150,1)', .5); g.restore(); } };
// riders charging down a slope, in silhouette against the dawn
function horseShape(g, ph, col) { // side view, facing +x, hooves at y=90
  const leg = (x, y, a1, a2) => { g.save(); g.translate(x, y); g.rotate(a1); line(g, [0, 0, 0, 80], 30, col, 'round'); g.translate(0, 80); g.rotate(a2); line(g, [0, 0, 0, 74], 16, col, 'round'); sh(g, 'M-12 70 L14 70 L16 86 L-14 86 Z', col); g.restore(); };
  const f = Math.sin(ph), f2 = Math.sin(ph + 1.1);
  leg(-100, -70, .55 * f2, .7 * Math.max(0, f2)); leg(110, -70, -.6 * f, .8 * Math.max(0, -f));
  sh(g, 'M-150 -110 C-150 -165 -60 -172 40 -166 C92 -163 112 -172 140 -212 L188 -282 C204 -304 236 -298 246 -282 L288 -222 C295 -206 282 -196 268 -200 L228 -216 L176 -150 C160 -98 140 -66 100 -58 L-104 -58 C-134 -60 -150 -80 -150 -110 Z', col);
  leg(-70, -70, -.5 * f2, .9 * Math.max(0, -f2)); leg(140, -80, .7 * f, .6 * Math.max(0, f));
  sh(g, 'M186 -292 L196 -326 L206 -290 Z', col); sh(g, `M-146 -126 Q-226 ${-110 + f * 26} -246 ${-40 + f * 20} Q-206 -80 -148 -96 Z`, col);
  for (let i = 0; i < 6; i++) sh(g, `M${150 + i * 9} ${-214 - i * 12} l-34 ${-8 + f * 6} l20 -10 Z`, col); }
JPA.cavalry = (g, A, c) => { const r = rng(A.seed || 31), n = A.n || 7, col = A.col || '#120a10';
  for (let i = 0; i < n; i++) { const q = ((c.lt * (A.speed || .35) + i / n + r() * .1) % 1), x = lerp(A.x0, A.x1, q), y = lerp(A.y0, A.y1, q), s = (A.s || 1) * (.8 + r() * .4), ph = c.T * 14 + i * 2.1;
    g.save(); g.translate(x, y + Math.abs(Math.sin(ph * .5)) * -14); g.rotate(A.tilt || .45); g.scale(s * (A.dir || 1), s);
    sh(g, 'M-40 -160 L30 -160 L40 -300 L-14 -312 Z', col); ell(g, 10, -342, 30, 32, col); sh(g, 'M-26 -356 Q10 -408 46 -356 Q10 -370 -26 -356 Z', col); [-1, 1].forEach(sd => sh(g, `M${10 + sd * 8} -372 L${10 + sd * 34} -420 L${10 + sd * 14} -368 Z`, col));
    line(g, [30, -270, 150, -230], 12, col, 'round'); line(g, [-24, -290, -60, -470], 6, col, 'round'); sh(g, `M-60 -470 L${-150 + Math.sin(c.T * 7 + i) * 10} -462 L${-146 + Math.sin(c.T * 7 + i) * 10} -392 L-60 -400 Z`, A.flag || '#f4efe2');
    horseShape(g, ph, col); g.restore();
    if (A.dust) dustBurst(g, { x: x - 140, y: y + 120, t0: 0, s: .5, col: A.dustCol || '#c8a07a' }, (c.T * 1.3 + i * .37) % 1); } };
// a war boat with banners, rocking; sinking > 0 tips it and drags it under
JPA.boat = (g, A, c) => { const sk = A.sinking || 0, rk = Math.sin(c.T * 1.3 + (A.ph || 0)) * .04; g.save(); g.translate(A.x, A.y + sk * 160 + Math.sin(c.T * 1.1 + (A.ph || 0)) * 8); g.rotate(rk + sk * .5 * (A.dir || 1)); g.scale((A.s || 1) * (A.dir || 1), A.s || 1);
  tsh(g, 'M-330 -60 L330 -60 L270 40 L-280 40 Z', lg(g, 0, -60, 0, 40, [[0, '#7a5232'], [1, '#4a2e1a']]), 5); for (let k = -3; k <= 3; k++) tln(g, [k * 90, -56, k * 80, 36], 2.4, 'rgba(30,15,5,.5)'); tln(g, [-330, -60, 330, -60], 8, '#c8a040');
  if (A.mast !== false) { tln(g, [-40, -60, -40, -420], 12); tln(g, [-40, -60, -40, -420], 6, '#5a3a22'); const fl = Math.sin(c.T * 3 + (A.ph || 0)) * 12;
  tsh(g, `M-34 -410 L${80 + fl} ${-400 + fl * .3} L${76 + fl} -270 L-34 -280 Z`, A.flag || '#c8302a', 4); } for (let k = 0; k < (A.crew || 3); k++) { ell(g, -200 + k * 120, -90, 26, 30, '#1e1418'); sh(g, `M${-226 + k * 120} -80 L${-174 + k * 120} -80 L${-170 + k * 120} -40 L${-230 + k * 120} -40 Z`, '#1e1418'); }
  g.restore(); };
// an army massed in rows: spears, banners, torches (silhouettes with a rim of firelight)
JPA.host = (g, A, c) => { const r = rng(A.seed || 41), rows = A.rows || 3, col = A.col || '#120c12';
  for (let rw = 0; rw < rows; rw++) { const y = A.y - rw * 34 * (A.s || 1), n = A.n || 14, s = (A.s || 1) * (1 - rw * .12);
    for (let i = 0; i < n; i++) { const x = lerp(A.x0, A.x1, (i + r() * .7) / n), b = Math.sin(c.T * 2.4 + i + rw) * 3 * (A.bob ?? 1);
      g.save(); g.translate(x, y + b); g.scale(s, s); sh(g, 'M-34 0 L-40 -230 Q-30 -270 0 -274 Q30 -270 40 -230 L34 0 Z', col); ell(g, 0, -300, 30, 32, col); sh(g, 'M-44 -306 Q0 -360 44 -306 Q0 -322 -44 -306 Z', col);
      const kd = (i + rw) % 4; if (kd === 0) { line(g, [30, -180, 46, -620], 5, col, 'round'); sh(g, 'M40 -620 L52 -620 L46 -680 Z', '#9aa2ae'); }
      if (kd === 2 && A.banners !== false) { line(g, [-30, -200, -38, -640], 5, col, 'round'); sh(g, `M-38 -640 L${-38 + 70} -640 L${-38 + 70} -440 L-38 -440 Z`, A.flag || '#f4efe2'); tell(g, -3, -560, 18, 18, A.mon || '#c8302a', 0); }
      if (kd === 1 && A.torches) { line(g, [36, -160, 60, -420], 7, col, 'round'); fire(g, 60, -430, .5, c.T + i); glow(g, 60, -450, 220, 'rgba(255,150,60,1)', .35); }
      g.restore(); } } };
// arrows stuck in the planks all around a figure
JPA.arrowField = (g, A, c) => { const r = rng(A.seed || 51); for (let i = 0; i < (A.n || 30); i++) { const x = A.x + (r() - .5) * (A.w || 700), y = A.y + (r() - .5) * 80, an = -1.9 - r() * .5, len = 90 + r() * 60;
  g.save(); g.translate(x, y); tln(g, [0, 0, Math.cos(an) * len, Math.sin(an) * len], 7); tln(g, [0, 0, Math.cos(an) * len, Math.sin(an) * len], 3, '#c8a878');
  g.translate(Math.cos(an) * len, Math.sin(an) * len); g.rotate(an); sh(g, 'M0 0 L-24 -9 L-30 0 Z', '#f4efe2'); sh(g, 'M0 0 L-24 9 L-30 0 Z', '#f4efe2'); g.restore(); } };
// a sign / caption board in Japanese with a gloss under it
JPA.sign = (g, A, c) => { const k = clamp((c.lt - (A.t0 || 0)) / .3); if (k <= 0) return; g.save(); g.translate(A.x, A.y); g.scale(eo(k) * (A.s || 1), eo(k) * (A.s || 1)); g.rotate(A.rot || -.03);
  tsh(g, 'M-330 -120 L330 -120 L330 110 L-330 110 Z', '#f6ecd6', 6); tsh(g, 'M-310 -100 L310 -100 L310 90 L-310 90 Z', null, 2.4, '#c8302a');
  g.fillStyle = '#2a1410'; g.font = "900 104px 'IPAGothic'"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(A.jp || '弁慶の泣き所', 0, -24);
  g.font = "900 34px Nunito"; g.fillStyle = '#a8242a'; g.fillText(A.en || "BENKEI'S CRYING SPOT", 0, 62); g.restore(); };
// a bronze statue base (the figures on it are toon actors drawn with stone:true)
JPA.plinth = (g, A, c) => { g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); tsh(g, 'M-420 0 L420 0 L400 -160 L-400 -160 Z', lg(g, 0, -160, 0, 0, [[0, '#8a8478'], [1, '#5a564e']]), 6); tsh(g, 'M-440 -160 L440 -160 L440 -190 L-440 -190 Z', '#a8a296', 5);
  g.fillStyle = '#3a3630'; g.font = "900 40px 'IPAGothic'"; g.textAlign = 'center'; g.fillText('弁慶と牛若丸', 0, -70); g.restore(); };

// ================= worlds =================
function willowF(x, cx, cy, s, col) { x.save(); x.translate(cx, cy); x.scale(s, s); sh(x, 'M-14 0 Q-20 -200 10 -360 L26 -360 Q10 -200 14 0 Z', '#141018');
  for (let i = 0; i < 26; i++) { const a = -1.4 + i * .11, sx = Math.cos(a) * 60, sy = -360 + Math.sin(a) * 40; x.strokeStyle = col; x.lineWidth = 3; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + (i - 13) * 12, sy + 120, sx + (i - 13) * 14, sy + 300 + (i % 4) * 30); x.stroke(); } x.restore(); }
function pagodaF(x, cx, cy, s, col) { x.save(); x.translate(cx, cy); x.scale(s, s); for (let k = 0; k < 5; k++) { const y = -k * 120, w = 170 - k * 22; sh(x, `M${-w * .55} ${y} L${w * .55} ${y} L${w * .5} ${y - 70} L${-w * .5} ${y - 70} Z`, col); sh(x, `M${-w} ${y - 70} Q0 ${y - 100} ${w} ${y - 70} L${w * .7} ${y - 110} L${-w * .7} ${y - 110} Z`, col); }
  x.fillStyle = col; x.fillRect(-6, -760, 12, 180); x.restore(); }
function railRow(x, y, x0, x1, step, col, cap, s = 1) { // a bridge railing: posts with bronze onion caps (giboshi), two rails
  for (let px = x0; px <= x1; px += step) { tsh(x, `M${px - 20 * s} ${y} L${px + 20 * s} ${y} L${px + 18 * s} ${y - 170 * s} L${px - 18 * s} ${y - 170 * s} Z`, col, 4 * s);
    tsh(x, `M${px - 26 * s} ${y - 168 * s} Q${px - 30 * s} ${y - 210 * s} ${px} ${y - 236 * s} Q${px + 30 * s} ${y - 210 * s} ${px + 26 * s} ${y - 168 * s} Z`, cap, 4 * s); tell(x, px, y - 244 * s, 7 * s, 9 * s, cap, 3 * s); }
  tsh(x, `M${x0} ${y - 150 * s} L${x1} ${y - 150 * s} L${x1} ${y - 126 * s} L${x0} ${y - 126 * s} Z`, col, 4 * s); tsh(x, `M${x0} ${y - 70 * s} L${x1} ${y - 70 * s} L${x1} ${y - 52 * s} L${x0} ${y - 52 * s} Z`, col, 4 * s); }
function planksF(x, y0, y1, c1, c2, seed) { x.fillStyle = lg(x, 0, y0, 0, y1, [[0, c1], [1, c2]]); x.fillRect(-700, y0, 2480, y1 - y0); const r = rng(seed);
  for (let y = y0 + 30, k = 0; y < y1; y += 34 + k * 3, k++) { line(x, [-700, y, 1780, y], 2.4, 'rgba(0,0,0,.35)'); for (let i = 0; i < 6; i++) { const px = r() * 2400 - 700; line(x, [px, y - 30 - k * 3, px, y], 2, 'rgba(0,0,0,.25)'); } line(x, [-700, y + 2, 1780, y + 2], 1.4, 'rgba(255,255,255,.06)'); } }
function cedarTrunk(x, cx, w, col, hi) { sh(x, `M${cx - w} 2600 L${cx - w * .8} -700 L${cx + w * .8} -700 L${cx + w} 2600 Z`, col); for (let i = 0; i < 9; i++) { const dx = (i - 4) * w * .2; line(x, [cx + dx, -700, cx + dx * 1.1, 2600], 3, hi); } }
function burningHall(x, cx, cy, s, burnt) { x.save(); x.translate(cx, cy); x.scale(s, s); sh(x, 'M-420 0 L420 0 L420 -260 L-420 -260 Z', burnt ? '#1a1416' : '#3a2620'); for (let i = -3; i <= 3; i++) sh(x, `M${i * 120 - 10} 0 L${i * 120 + 10} 0 L${i * 120 + 10} -260 L${i * 120 - 10} -260 Z`, '#140c0c');
  sh(x, burnt ? 'M-500 -250 L-300 -330 L-80 -300 L120 -400 L300 -320 L500 -250 Z' : 'M-520 -250 Q0 -320 520 -250 L380 -460 L-380 -460 Z', burnt ? '#120c0e' : '#22161a'); if (!burnt) { sh(x, 'M-380 -460 L380 -460 L300 -520 L-300 -520 Z', '#22161a'); [-1, 1].forEach(sd => sh(x, `M${sd * 380} -460 L${sd * 440} -500 L${sd * 360} -470 Z`, '#22161a')); }
  if (!burnt) for (let i = -2; i <= 2; i++) { x.fillStyle = 'rgba(255,170,80,.75)'; x.fillRect(i * 120 + 30, -220, 60, 140); } x.restore(); }
function barrier(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); for (let i = -9; i <= 9; i++) { if (Math.abs(i) <= 1) continue; tsh(x, `M${i * 70 - 10} 0 L${i * 70 + 10} 0 L${i * 70 + 8} -250 L${i * 70} -268 L${i * 70 - 8} -250 Z`, '#6a5038', 4); }
  [-200, -110].forEach(y => tsh(x, `M-660 ${y} L660 ${y} L660 ${y + 16} L-660 ${y + 16} Z`, '#5a4030', 4));
  [-1, 1].forEach(sd => tsh(x, `M${sd * 110 - 18} 0 L${sd * 110 + 18} 0 L${sd * 110 + 18} -380 L${sd * 110 - 18} -380 Z`, '#4a3424', 5)); tsh(x, 'M-200 -380 L200 -380 L170 -440 L-170 -440 Z', '#2a2026', 5); tsh(x, 'M-150 -330 L150 -330 L150 -300 L-150 -300 Z', '#4a3424', 4);
  tsh(x, 'M-60 -360 L60 -360 L60 -306 L-60 -306 Z', '#e8dcc0', 3); x.fillStyle = '#2a1410'; x.font = "900 36px 'IPAGothic'"; x.textAlign = 'center'; x.fillText('安宅関', 0, -320); x.restore(); }
function gerF(x, cx, cy, s, col) { x.save(); x.translate(cx, cy); x.scale(s, s); tsh(x, 'M-160 0 L160 0 L160 -120 L-160 -120 Z', col, 4); tsh(x, 'M-176 -116 Q0 -260 176 -116 Z', col, 4); tln(x, [-160, -60, 160, -60], 3, 'rgba(120,60,40,.6)'); tsh(x, 'M-30 0 L30 0 L30 -80 L-30 -80 Z', '#a8242a', 3); x.restore(); }
const fireflies = (g, T, n, seed, area, col = 'rgba(220,255,160,1)') => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + ((r() * (area[2] - area[0]) + Math.sin(T * .6 + i) * 60) % (area[2] - area[0])), y = area[1] + r() * (area[3] - area[1]) + Math.sin(T * .9 + i * 2) * 40, a = .5 + .5 * Math.sin(T * 3 + i * 1.7);
  glow(g, x, y, 40, col, a * .7); ell(g, x, y, 3, 3, `rgba(255,255,220,${a})`); } };

// --- Gojo bridge, Kyoto, under a huge moon ---
JSETS.gojo = { light: { x: 1, col: 'rgba(170,200,255,1)', rim: .85, shade: .32 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('gj_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#04061a'], [.5, '#141a40'], [.85, '#30305e'], [1, '#4a3a6a']]); x.fillRect(-700, -700, 2480, 3400); starsF(x, 260, 161, 900);
      glow(x, 780, 330, 700, 'rgba(160,190,255,1)', .35); moonF(x, 780, 330, 120); for (let i = 0; i < 4; i++) cloudF(x, -200 + i * 480, 640 + (i % 2) * 140, 1.0, 'rgba(40,44,90,.7)', 'rgba(170,190,255,.35)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('gj_far', x => { ridge(x, 1200, 260, '#161a38', 163, {}); pagodaF(x, 240, 1260, .9, '#10122a'); for (let i = 0; i < 9; i++) sh(x, `M${-200 + i * 170} 1300 L${-120 + i * 170} 1240 L${-40 + i * 170} 1300 Z`, '#10122a');
      const r = rng(164); for (let i = 0; i < 60; i++) ell(x, r() * 1600 - 300, 1270 + r() * 40, 3, 3, `rgba(255,${180 + r() * 60 | 0},120,${.4 + r() * .5})`); }, { blur: 1.4 })));
    layerAt(g, c, .35, () => { blit(g, cacheLayer('gj_river', x => { waterF(x, 1300, 1560, '#2a3466', '#0e1430', 165); willowF(x, -80, 1340, 1.1, 'rgba(60,90,80,.8)'); willowF(x, 1180, 1330, 1.2, 'rgba(60,90,80,.8)'); }, { blur: .8 }));
      for (let i = 0; i < 18; i++) { const y = 1330 + i * 13, w = 40 + Math.sin(T * 2 + i) * 30 + i * 6; line(g, [780 - w, y, 780 + w, y], 3, `rgba(220,230,255,${.55 - i * .025})`, 'round'); }
      for (let i = 0; i < 3; i++) puff(g, ((i * 520 + T * 26) % 1700) - 300, 1440 + i * 26, 420, 'rgba(150,170,230,1)', .16); });
    layerAt(g, c, .75, () => { blit(g, cacheLayer('gj_rail', x => { railRow(x, 1560, -460, 1540, 260, '#5a3e2e', '#b89a5a', .9); }, {}));
      [[-200, 1340], [320, 1340], [840, 1340], [1360, 1340]].forEach(([x, y], i) => { chochin(g, x, y, .8, T, i); glow(g, x, y, 220, 'rgba(255,170,90,1)', .4); }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('gj_deck', x => { planksF(x, 1560, 2800, '#4a3a3e', '#1e161c', 166); x.fillStyle = lg(x, 0, 1560, 0, 1700, [[0, 'rgba(140,160,230,.25)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(-700, 1560, 2480, 140); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { fireflies(g, T, 14, 167, [-200, 900, 1300, 1700]); if (o.rail) layerAt(g, c, 1.4, () => blit(g, cacheLayer('gj_frail', x => railRow(x, 2420, -600, 1700, 330, '#3a2a22', '#8a7040', 1.3), { blur: 3 }))); },
  haze(g) { g.fillStyle = 'rgba(40,60,150,.07)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Mount Kurama: giant cedars, moonbeams, mist, crow tengu watching ---
JSETS.kurama = { light: { x: -1, col: 'rgba(160,255,215,1)', rim: .8, shade: .36 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('ku_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1600, [[0, '#020806'], [.6, '#0a1e18'], [1, '#1e3a30']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 200, 200, 600, 'rgba(160,255,210,1)', .3); moonF(x, 200, 200, 70); })));
    layerAt(g, c, .1, () => { g.save(); g.globalCompositeOperation = 'lighter'; rays(g, 200, 200, 2400, 9, 'rgba(160,255,210,.5)', .32, T * .03, .05); g.restore(); });
    layerAt(g, c, .15, () => blit(g, cacheLayer('ku_far', x => { for (let i = 0; i < 16; i++) cedar(x, -500 + i * 140, 1400 + (i % 3) * 40, 2.0 + (i % 2) * .4, '#0c1e18'); }, { blur: 2.2 })));
    layerAt(g, c, .4, () => { blit(g, cacheLayer('ku_mid', x => { [[-120, 90], [300, 60], [760, 120], [1180, 80]].forEach(([cx, w]) => cedarTrunk(x, cx, w, '#14241c', 'rgba(60,90,70,.4)'));
      [[60, 520], [980, 380]].forEach(([bx, by], i) => { line(x, [bx - 200, by + 40, bx + 200, by], 22, '#14241c', 'round'); }); }, { blur: .9 }));
      [[60, 470, 0], [940, 330, 1.3]].forEach(([x, y, ph]) => { g.save(); g.translate(x, y); g.scale(.32, .32); g.filter = 'brightness(.25)'; toon(g, { c: 'karasu', x: 0, y: 0, t: T + ph, expr: 'neutral', flap: .15, arms: 'hips' }); g.filter = 'none'; g.restore(); });
      for (let i = 0; i < 4; i++) puff(g, ((i * 430 + T * 22) % 1700) - 300, 1300 + i * 40, 420, 'rgba(140,220,190,1)', .14); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('ku_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#1e3428'], [1, '#08120c']]); x.fillRect(-700, 1540, 2480, 1200); pebbles(x, 1580, 2600, 300, 171, ['#2a3a30', '#34463a', '#1e2a22']);
      for (let i = 0; i < 9; i++) { const rx0 = -500 + i * 280; line(x, [rx0, 1560, rx0 + 160, 1640, rx0 + 260, 1700], 18, '#1a1410', 'round'); } grassField(x, 1540, 1620, 420, ['#1e3a28', '#2a4a34'], 172); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { fireflies(g, T, 22, 173, [-200, 600, 1300, 1800], 'rgba(170,255,200,1)'); for (let i = 0; i < 3; i++) puff(g, ((i * 520 + T * 40) % 1700) - 300 + c.cam[0] - 540, 1980 + c.cam[1] - 960, 380, 'rgba(140,220,190,1)', .14); },
  haze(g) { g.fillStyle = 'rgba(40,140,110,.06)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Ichi-no-Tani: the cliff at dawn, the enemy camp far below by the sea ---
JSETS.cliff = { light: { x: 1, col: 'rgba(255,200,140,1)', rim: .9, shade: .36 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('cl_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#1a1230'], [.45, '#7a2e40'], [.75, '#e8743a'], [1, '#ffcc80']]); x.fillRect(-700, -700, 2480, 3400);
      glow(x, 900, 1080, 600, 'rgba(255,220,150,1)', .6); ell(x, 900, 1080, 110, 110, '#fff0c8'); for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 440, 520 + (i % 2) * 160, 1.1, 'rgba(120,50,70,.6)', 'rgba(255,190,130,.5)'); })));
    layerAt(g, c, .08, () => blit(g, cacheLayer('cl_sea', x => { x.fillStyle = lg(x, 0, 1150, 0, 1500, [[0, '#e89a6a'], [1, '#5a3a5a']]); x.fillRect(-700, 1150, 2480, 400); for (let i = 0; i < 40; i++) line(x, [-600 + i * 60, 1170 + (i % 7) * 40, -560 + i * 60, 1170 + (i % 7) * 40], 2, 'rgba(255,230,190,.4)');
      for (let i = 0; i < 12; i++) { sh(x, `M${300 + i * 60} 1220 L${330 + i * 60} 1220 L${326 + i * 60} 1236 L${304 + i * 60} 1236 Z`, '#2a1a20'); line(x, [312 + i * 60, 1220, 312 + i * 60, 1190], 2, '#2a1a20'); sh(x, `M${312 + i * 60} 1190 L${326 + i * 60} 1192 L${324 + i * 60} 1204 L${312 + i * 60} 1202 Z`, '#d8302a'); } }, { blur: 1.2 })));
    layerAt(g, c, .55, () => blit(g, cacheLayer('cl_slope', x => { x.fillStyle = lg(x, 0, 700, 0, 2400, [[0, '#4a2a30'], [1, '#1a0e14']]); x.beginPath(); x.moveTo(-700, 640); x.lineTo(-200, 720); x.lineTo(1780, 2300); x.lineTo(1780, 2800); x.lineTo(-700, 2800); x.closePath(); x.fill();
      const r = rng(175); for (let i = 0; i < 70; i++) { const q = r(), px = lerp(-300, 1500, q), py = lerp(760, 2200, q) + 40 + r() * 600; rock(x, px, py, 40 + r() * 90, 20 + r() * 40, ['#3a2228', '#4a2c32', '#2a181e'][i % 3]); }
      [[-100, 760, .8], [160, 960, .6], [1260, 2040, .9]].forEach(([px, py, s]) => pine(x, px, py, s)); line(x, [-700, 640, -200, 720, 1780, 2300], 8, 'rgba(255,190,130,.55)', 'round'); }, { blur: .5 })));
  },
  front(g, o, c, T) { embers(g, T, 10, 176); },
  haze(g) { g.fillStyle = 'rgba(255,120,60,.06)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Dan-no-ura: a grey sea battle, waves, spray ---
JSETS.sea = { light: { x: -1, col: 'rgba(255,240,215,1)', rim: .7, shade: .3 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('se_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#2a3440'], [.7, '#7a8a96'], [1, '#c8c8c0']]); x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 6; i++) cloudF(x, -300 + i * 380, 300 + (i % 3) * 160, 1.3, 'rgba(60,70,84,.8)', 'rgba(200,210,220,.4)'); })));
    layerAt(g, c, .1, () => blit(g, cacheLayer('se_far', x => { ridge(x, 1220, 180, '#4a5a66', 177, {}); x.fillStyle = lg(x, 0, 1220, 0, 1700, [[0, '#5a7080'], [1, '#2a3a4a']]); x.fillRect(-700, 1220, 2480, 500); }, { blur: 1.2 })));
    layerAt(g, c, .3, () => { for (let k = 0; k < 6; k++) { const y = 1260 + k * 60; g.fillStyle = `rgba(${40 + k * 6},${60 + k * 8},${76 + k * 8},.9)`; g.beginPath(); g.moveTo(-700, y + 80); for (let x0 = -700; x0 <= 1780; x0 += 60) g.lineTo(x0, y + Math.sin(x0 * .012 + T * (1 + k * .2) + k) * 18); g.lineTo(1780, y + 400); g.lineTo(-700, y + 400); g.fill();
      for (let x0 = -700; x0 <= 1780; x0 += 120) line(g, [x0, y + Math.sin(x0 * .012 + T * (1 + k * .2) + k) * 18 - 2, x0 + 50, y + Math.sin((x0 + 50) * .012 + T * (1 + k * .2) + k) * 18 - 2], 3, 'rgba(230,240,245,.5)', 'round'); } });
  },
  front(g, o, c, T) { for (let k = 0; k < 2; k++) { const y = 2050 + k * 90 + c.cam[1] - 960; g.fillStyle = `rgba(${30 + k * 8},${48 + k * 8},${62 + k * 8},.95)`; g.beginPath(); g.moveTo(-700, y + 600); for (let x0 = -700; x0 <= 1780; x0 += 50) g.lineTo(x0, y + Math.sin(x0 * .01 + T * 1.6 + k * 2) * 26); g.lineTo(1780, y + 600); g.fill(); }
    const r = rng(178); for (let i = 0; i < 26; i++) { const q = (T * .7 + r()) % 1, x = r() * 1500 - 200, y = 1700 + r() * 300 - q * 200; ell(g, x, y, 6 * (1 - q) + 2, 6 * (1 - q) + 2, `rgba(240,248,255,${.6 * (1 - q)})`); } },
  haze(g) { g.fillStyle = 'rgba(150,170,190,.08)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Ataka checkpoint: snow, pines, a wooden barrier ---
JSETS.ataka = { light: { x: -1, col: 'rgba(235,242,255,1)', rim: .65, shade: .26 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('at_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#5a6a7e'], [.7, '#b8c4cc'], [1, '#e2e6e8']]); x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 420 + (i % 2) * 140, 1.3, 'rgba(150,160,175,.7)', 'rgba(240,244,248,.5)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('at_far', x => { ridge(x, 1150, 420, '#8a98a8', 181, { sharp: true, peaks: true, snow: '#f2f4f6' }); ridge(x, 1260, 220, '#6a7888', 182, { snow: '#e8ecf0' }); }, { blur: 1.5 })));
    layerAt(g, c, .4, () => blit(g, cacheLayer('at_mid', x => { for (let i = 0; i < 7; i++) pine(x, -500 + i * 330, 1500 + (i % 2) * 20, 1.2); barrier(x, 540, 1560, 1.0); }, { blur: .5 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('at_ground', x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, [[0, '#e8ecf0'], [1, '#a8b0b8']]); x.fillRect(-700, 1560, 2480, 1200); pebbles(x, 1600, 2600, 140, 183, ['#8a929a', '#a0a8b0', '#7a828a']); line(x, [-700, 1700, 1780, 1720], 60, 'rgba(160,170,180,.35)'); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { const r = rng(184); for (let i = 0; i < 70; i++) { const x = ((r() * 1500 + T * 40 + Math.sin(T + i) * 30) % 1500) - 200, y = ((r() * 2000 + T * (70 + r() * 60)) % 2000) - 40; ell(g, x, y, 3 + r() * 3, 3 + r() * 3, 'rgba(255,255,255,.85)'); } },
  haze(g) { g.fillStyle = 'rgba(200,215,230,.08)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Koromogawa: the hall burning behind, a narrow bridge over the river; o.after = the silent grey dawn ---
JSETS.koromo = { light: o => o.after ? { x: 1, col: 'rgba(225,225,255,1)', rim: .55, shade: .3 } : { x: -1, col: 'rgba(255,150,70,1)', rim: 1, shade: .42 },
  back(g, o, c, T) { const af = !!o.after;
    layerAt(g, c, 0, () => blit(g, cacheLayer('ko_sky' + af, x => { x.fillStyle = lg(x, 0, -700, 0, 1500, af ? [[0, '#1e2230'], [.6, '#6a6a7a'], [1, '#c8b8a8']] : [[0, '#12060a'], [.5, '#5a141a'], [.85, '#d8502a'], [1, '#ffa050']]); x.fillRect(-700, -700, 2480, 3400);
      if (af) { glow(x, 820, 1100, 500, 'rgba(255,220,190,1)', .3); } else starsF(x, 60, 185, 400, .5); for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 400 + (i % 2) * 150, 1.2, af ? 'rgba(90,90,104,.7)' : 'rgba(70,20,26,.75)', af ? 'rgba(220,200,190,.4)' : 'rgba(255,140,80,.45)'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('ko_far' + af, x => { ridge(x, 1150, 300, af ? '#3a3a48' : '#2a0e12', 186, {}); burningHall(x, 640, 1240, .9, af); }, { blur: 1.0 })));
    layerAt(g, c, .15, () => { if (!af) { flameWall(g, 260, 1020, 1210, 360, T, 187, .95); glow(g, 640, 1050, 900, 'rgba(255,120,40,1)', .55); smokeF(g, 640, 900, 700, T, .5, 188); } else smokeF(g, 640, 1000, 600, T, .35, 189); });
    layerAt(g, c, .45, () => { blit(g, cacheLayer('ko_river' + af, x => { waterF(x, 1340, 1580, af ? '#4a4a5a' : '#5a1e1e', af ? '#1e1e28' : '#1e0a0e', 190); ridge(x, 1360, 60, af ? '#2a2a34' : '#1a080c', 191, {}); }, { blur: .6 }));
      for (let i = 0; i < 14; i++) { const y = 1370 + i * 14, w = 50 + Math.sin(T * 2.4 + i) * 40 + i * 8; line(g, [640 - w, y, 640 + w, y], 3, af ? `rgba(220,210,200,${.4 - i * .025})` : `rgba(255,150,70,${.6 - i * .035})`, 'round'); } });
    layerAt(g, c, .75, () => blit(g, cacheLayer('ko_rail' + af, x => railRow(x, 1580, -460, 1540, 300, af ? '#3a3036' : '#2a1a16', af ? '#6a6058' : '#8a6a3a', .8), {})));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ko_deck' + af, x => { planksF(x, 1580, 2800, af ? '#4a4248' : '#3a2220', af ? '#1e1a1e' : '#140808', 192); if (!af) { x.fillStyle = lg(x, 0, 1580, 0, 1760, [[0, 'rgba(255,120,60,.3)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(-700, 1580, 2480, 180); } }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { if (!o.after) embers(g, T, 30, 193); else { const r = rng(194); for (let i = 0; i < 40; i++) { const x = ((r() * 1500 + T * 20) % 1500) - 200, y = ((r() * 2000 + T * (40 + r() * 30)) % 2000) - 40; ell(g, x, y, 2.4, 2.4, 'rgba(200,200,200,.5)'); } }
    for (let i = 0; i < 3; i++) puff(g, ((i * 520 + T * 30) % 1700) - 300 + c.cam[0] - 540, 2000 + c.cam[1] - 960, 400, o.after ? 'rgba(180,180,190,1)' : 'rgba(120,60,50,1)', .2); },
  haze(g, o) { g.fillStyle = o.after ? 'rgba(170,170,190,.1)' : 'rgba(255,90,40,.08)'; g.fillRect(0, 0, 1080, 1920); } };

// --- the shogun's hall: dark wood, cold paper screens, white banners ---
JSETS.hall = { light: { x: 1, col: 'rgba(190,210,255,1)', rim: .7, shade: .38 },
  back(g, o, c, T) {
    layerAt(g, c, .3, () => blit(g, cacheLayer('ha_back', x => { x.fillStyle = '#0e0c12'; x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 6; i++) { const px = -400 + i * 380; x.fillStyle = lg(x, px, 0, px + 300, 0, [[0, '#8a9ab8'], [.5, '#c8d4e8'], [1, '#8a9ab8']]); x.fillRect(px, 700, 300, 820); for (let k = 0; k < 5; k++) line(x, [px, 700 + k * 164, px + 300, 700 + k * 164], 6, '#1a1418'); for (let k = 1; k < 3; k++) line(x, [px + k * 100, 700, px + k * 100, 1520], 6, '#1a1418'); }
      for (let i = 0; i < 7; i++) sh(x, `M${-440 + i * 380} 600 L${-400 + i * 380} 600 L${-400 + i * 380} 1560 L${-440 + i * 380} 1560 Z`, '#1e1416');
      [[100, 'L'], [980, 'R']].forEach(([px]) => { sh(x, `M${px - 80} 640 L${px + 80} 640 L${px + 80} 1180 L${px - 80} 1180 Z`, '#f4efe2'); x.save(); x.translate(px, 880); for (let k = 0; k < 5; k++) { x.save(); x.rotate(k * 1.256); ell(x, 0, -40, 18, 40, '#2a3a8a'); x.restore(); } ell(x, 0, 0, 16, 16, '#2a3a8a'); x.restore(); }); }, { blur: .6 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ha_floor', x => { planksF(x, 1560, 2800, '#3a2a24', '#120c0c', 195); x.fillStyle = lg(x, 0, 1560, 0, 1800, [[0, 'rgba(170,190,240,.22)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(-700, 1560, 2480, 240); }, { y0: 1500, h: 1300 })));
    layerAt(g, c, .6, () => { chochin(g, 540, 560, 1.1, T, 0); glow(g, 540, 600, 420, 'rgba(255,170,90,1)', .35); });
  },
  haze(g) { g.fillStyle = 'rgba(60,70,130,.08)'; g.fillRect(0, 0, 1080, 1920); } };

// --- the steppe at sunset ---
JSETS.steppe = { light: { x: 1, col: 'rgba(255,200,130,1)', rim: .85, shade: .3 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('st_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#2a2a5a'], [.5, '#a85a6a'], [.85, '#f0a060'], [1, '#ffd890']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 820, 1200, 700, 'rgba(255,220,150,1)', .6); ell(x, 820, 1210, 120, 120, '#fff0c0');
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 500 + (i % 2) * 140, 1.0, 'rgba(150,80,100,.6)', 'rgba(255,200,150,.5)'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('st_far', x => { ridge(x, 1300, 120, '#6a4a5a', 197, {}); [[-120, 1330, .7], [180, 1340, .8], [1180, 1335, .75]].forEach(([px, py, s]) => gerF(x, px, py, s, '#f4ecdc')); }, { blur: 1 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('st_ground', x => { x.fillStyle = lg(x, 0, 1360, 0, 2700, [[0, '#a89050'], [.3, '#6a7a3a'], [1, '#2a3a1a']]); x.fillRect(-700, 1360, 2480, 1400); grassField(x, 1380, 2500, 1600, ['#8a9a4a', '#6a7a3a', '#a8a860'], 198, -700, 1780, 34); }, { y0: 1300, h: 1500 })));
  },
  front(g, o, c, T) { for (let i = 0; i < 3; i++) puff(g, ((i * 520 + T * 50) % 1700) - 300 + c.cam[0] - 540, 2000 + c.cam[1] - 960, 400, 'rgba(230,200,150,1)', .14); },
  haze(g) { g.fillStyle = 'rgba(255,170,90,.07)'; g.fillRect(0, 0, 1080, 1920); } };

// --- Gojo today: blue sky, the river embankment, the statue of Benkei and Ushiwakamaru ---
JSETS.gojoNow = { light: { x: 1, col: 'rgba(255,245,220,1)', rim: .6, shade: .25 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('gn_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#3a7ad0'], [.7, '#9ac8f0'], [1, '#e0f0ff']]); x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 500 + (i % 2) * 160, 1.1, 'rgba(255,255,255,.85)', 'rgba(255,255,255,.6)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('gn_far', x => { ridge(x, 1180, 200, '#5a8a6a', 201, {}); for (let i = 0; i < 12; i++) { const h = 120 + (i * 37) % 160; sh(x, `M${-400 + i * 180} 1300 L${-260 + i * 180} 1300 L${-260 + i * 180} ${1300 - h} L${-400 + i * 180} ${1300 - h} Z`, ['#c8ccd4', '#b0b8c4', '#d8d4cc'][i % 3]); for (let k = 0; k < 4; k++) line(x, [-390 + i * 180, 1300 - h + 20 + k * 26, -270 + i * 180, 1300 - h + 20 + k * 26], 6, 'rgba(90,120,160,.5)'); } }, { blur: 1.2 })));
    layerAt(g, c, .35, () => blit(g, cacheLayer('gn_mid', x => { waterF(x, 1330, 1470, '#6aa0c0', '#3a6a8a', 202); x.fillStyle = '#a8a49a'; x.fillRect(-700, 1460, 2480, 60); for (let i = 0; i < 8; i++) { x.fillStyle = '#4a7a3a'; ell(x, -500 + i * 300, 1440, 120, 90, '#4a7a3a'); } }, { blur: .6 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('gn_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#c8c0b0'], [1, '#8a8478']]); x.fillRect(-700, 1540, 2480, 1300); for (let y = 1580; y < 2700; y += 70) line(x, [-700, y, 1780, y], 2, 'rgba(90,80,70,.3)'); for (let xx = -700; xx < 1780; xx += 140) line(x, [xx, 1540, xx - 200, 2700], 2, 'rgba(90,80,70,.2)'); }, { y0: 1500, h: 1300 })));
  },
  haze(g) { g.fillStyle = 'rgba(255,240,210,.05)'; g.fillRect(0, 0, 1080, 1920); } };

// ---------- more props ----------
JPA.counter = (g, A, c) => { const n = Math.floor(A.n || 0), k = clamp((c.lt - (A.t0 || 0)) / .25); if (k <= 0) return; g.save(); g.translate(A.x, A.y); g.scale((A.s || 1) * eo(k), (A.s || 1) * eo(k)); g.rotate(A.rot || -.04);
  g.font = "900 190px Nunito"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = 'rgba(30,12,8,.95)'; g.strokeText(String(n), 0, 0);
  g.fillStyle = lg(g, 0, -90, 0, 90, [[0, '#fff4c8'], [.5, '#ffc850'], [1, '#e88a2a']]); g.fillText(String(n), 0, 0); g.font = "900 54px Nunito"; g.lineWidth = 12; g.strokeText(A.sub || 'SWORDS', 0, 118); g.fillStyle = '#fff4dc'; g.fillText(A.sub || 'SWORDS', 0, 118); g.restore(); };
JPA.splash = (g, A, c) => { const q = (c.lt - A.t0) / (A.d || .9); if (q < 0 || q > 1) return; const r = rng(A.seed || 61); g.save();
  for (let i = 0; i < 26; i++) { const an = -Math.PI * (.15 + r() * .7), sp = (200 + r() * 500) * (A.s || 1), x = A.x + Math.cos(an) * sp * eo(q), y = A.y + Math.sin(an) * sp * eo(q) + q * q * 600 * (A.s || 1), rr = (10 + r() * 16) * (1 - q * .6) * (A.s || 1);
    ell(g, x, y, rr, rr * 1.3, `rgba(235,245,255,${.9 * (1 - q)})`); }
  ell(g, A.x, A.y, 220 * (A.s || 1) * (.5 + q), 40 * (A.s || 1), `rgba(235,245,255,${.6 * (1 - q)})`); g.restore(); };
