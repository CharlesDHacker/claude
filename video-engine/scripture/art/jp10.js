// JP10 How Mio Met Kon: the sun-shower, the fox's wedding (masked fox-folk in wedding robes under a red umbrella, foxfire
// lanterns), little Mio lost in the cedars, the white fox who walks her home, the empty sushi box on the porch.

// ---------- a white fox mask worn over the face (ears up, red markings) ----------
function foxMask(g, L, rx, ry) {
  [-1, 1].forEach(sd => { tsh(g, `M${sd * rx * .36} ${-ry * .7} L${sd * rx * .74} ${-ry * 1.5} L${sd * rx * .86} ${-ry * .58} Z`, '#fbf6ee', 5); tsh(g, `M${sd * rx * .5} ${-ry * .76} L${sd * rx * .72} ${-ry * 1.3} L${sd * rx * .76} ${-ry * .74} Z`, '#d8342a', 0); });
  const M = `M${-rx * .92} ${-ry * .6} C${-rx * .9} ${-ry * 1.0} ${rx * .9} ${-ry * 1.0} ${rx * .92} ${-ry * .6} C${rx * .98} ${ry * .1} ${rx * .5} ${ry * .7} 0 ${ry * 1.02} C${-rx * .5} ${ry * .7} ${-rx * .98} ${ry * .1} ${-rx * .92} ${-ry * .6} Z`;
  tsh(g, M, '#fbf6ee', 5); g.save(); g.clip(path(M)); g.fillStyle = 'rgba(160,140,170,.18)'; g.beginPath(); g.ellipse(rx * .7, 0, rx * .4, ry * 1.2, 0, 0, 7); g.fill(); g.restore(); tsh(g, M, null, 5);
  [-1, 1].forEach(sd => { tsh(g, `M${sd * rx * .16} ${-ry * .12} Q${sd * rx * .44} ${-ry * .34} ${sd * rx * .66} ${-ry * .2} Q${sd * rx * .42} ${-ry * .1} ${sd * rx * .16} ${-ry * .12} Z`, '#140c08', 0);
    tln(g, [sd * rx * .14, -ry * .26, sd * rx * .62, -ry * .44], 5, '#d8342a'); tln(g, [sd * rx * .2, ry * .3, sd * rx * .5, ry * .2], 4, '#d8342a'); });
  tsh(g, `M${-rx * .1} ${-ry * .72} Q0 ${-ry * .9} ${rx * .1} ${-ry * .72} Q0 ${-ry * .56} ${-rx * .1} ${-ry * .72} Z`, '#d8342a', 0); tell(g, 0, ry * .86, rx * .1, ry * .06, '#2a1a1e', 0); }
function wataboshi(g, L, rx, ry) { // the bride's white wedding hood
  tsh(g, `M${-rx * 1.2} ${ry * .1} C${-rx * 1.3} ${-ry * 1.1} ${-rx * .6} ${-ry * 1.6} 0 ${-ry * 1.62} C${rx * .6} ${-ry * 1.6} ${rx * 1.3} ${-ry * 1.1} ${rx * 1.2} ${ry * .1} L${rx * .98} ${ry * .04} C${rx * 1.02} ${-ry * .9} ${rx * .5} ${-ry * 1.3} 0 ${-ry * 1.3} C${-rx * .5} ${-ry * 1.3} ${-rx * 1.02} ${-ry * .9} ${-rx * .98} ${ry * .04} Z`, '#fbf8f2', 5); }
const FOXFOLK = { foxTails: 1 };
Object.assign(TOON, {
  foxBride: { kind: 'adult', female: true, skin: '#f6e6da', skinD: '#e0ccc0', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'longBangs', top: '#fbf8f2', topD: '#e6e0d6', pat: 'clouds', patCol: 'rgba(200,190,210,.4)', collar: '#d8342a',
    sleeve: 'wide', bottom: 'skirt', skirt: '#fbf8f2', skirtD: '#e2dcd2', belt: '#d8342a', feet: 'straw', eyes: 'adult', iris: '#c8302a', lashes: true, brow: 5, lips: '#c04a5a', h: .98, headX: (g, L, rx, ry) => { foxMask(g, L, rx, ry); wataboshi(g, L, rx, ry); } },
  foxGroom: { kind: 'adult', skin: '#f0dcc8', skinD: '#d8c0aa', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'mizura', top: '#1a1a22', topD: '#121218', pat: null, collar: '#fbf8f2', trimCol: '#3a3a44', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#6a6a74', hakamaD: '#54545e', hakamaPat: 'tiger', hakamaPatCol: 'rgba(30,30,40,.25)', belt: '#e8c050', feet: 'straw', wraps: '#fbf8f2', eyes: 'adult', iris: '#c8302a', brow: 7, jaw: 'square', h: 1.04, headX: foxMask },
  foxGuest: { kind: 'adult', skin: '#f0dcc8', skinD: '#d8c0aa', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'mizura', top: '#d8342a', topD: '#b02822', pat: 'diamond', patCol: 'rgba(255,220,180,.3)', collar: '#fbf8f2', trimCol: '#fbf8f2', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#fbf8f2', hakamaD: '#e0d8cc', belt: '#e8c050', feet: 'straw', wraps: '#fbf8f2', eyes: 'adult', iris: '#c8302a', brow: 6, jaw: 'round', h: .96, headX: foxMask },
  // Grandma: Mio's family face. Mio's buns in silver, Mio's red kimono with the same cherry blossoms, her teal sash and gold cord, rosy cheeks
  grandma: { kind: 'elder', female: true, skin: '#f0caa8', skinD: '#d6a682', blush: 'rgba(240,120,110,.35)', hair: '#d8d4dc', hairHi: '#ffffff', hairStyle: 'mio', top: '#a8343a', topD: '#86282e', pat: 'petals', patCol: 'rgba(255,236,240,.85)', collar: '#f8f2e6',
    trimCol: '#2f6f6c', trimDot: '#f2c94c', sleeve: 'wide', bottom: 'skirt', skirt: '#7a2a30', skirtD: '#5e1e24', belt: '#2f6f6c', feet: 'geta', eyes: 'adult', iris: '#2a1810', brow: 5, browCol: '#c8c4cc', lips: '#c0606a', stoop: .08, h: .86,
    headX: (g, L, rx, ry) => { g.save(); g.translate(rx * .62, -ry * .78); g.scale(.95, .95); sakura(g, 0, 0, 16, '#f6a8be'); g.restore(); } },
});
Object.assign(THOLD, {
  wagasa: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); const sw = Math.sin(t * 1.3) * .03; g.rotate(sw); tln(g, [0, 20, 0, -560], 9, '#3a2418');
    g.translate(0, -560); const C = 'M-330 40 Q-300 -80 0 -110 Q300 -80 330 40 Q240 10 160 34 Q80 6 0 30 Q-80 6 -160 34 Q-240 10 -330 40 Z';
    tsh(g, C, lg(g, 0, -110, 0, 40, [[0, '#e8443a'], [1, '#a82420']]), 5); for (let k = -4; k <= 4; k++) tln(g, [0, -106, k * 80, 30 - Math.abs(k) * 4], 2.4, 'rgba(60,10,10,.4)'); tell(g, 0, -108, 16, 10, '#2a1a12', 3); g.restore(); },
  lanternPole: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(-.08); tln(g, [0, 30, 0, -360], 8, '#3a2418'); tln(g, [0, -360, 70, -360], 6, '#3a2418');
    g.translate(70, -330); glow(g, 0, 20, 220, 'rgba(255,170,80,1)', .55 + .1 * Math.sin(t * 7)); tell(g, 0, 20, 34, 46, '#ffcf7a', 4); for (let k = -1; k <= 1; k++) tln(g, [-30, 20 + k * 18, 30, 20 + k * 18], 2, 'rgba(160,80,20,.5)'); tsh(g, 'M-20 -28 L20 -28 L20 -20 L-20 -20 Z', '#2a1a12', 3); g.restore(); },
});

// ---------- foxfire: warm floating lantern-flames drifting through the trees ----------
JPA.foxfire = (g, A, c) => { const T = c.T, r = rng(A.seed || 81), n = A.n || 10; g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const q = ((T * (A.speed ?? .06) + r()) % 1), x = lerp(A.x0, A.x1, q) + Math.sin(T * 1.3 + i * 2) * 30, y = lerp(A.y0, A.y1, q) + Math.sin(T * 1.9 + i) * 24 + (r() - .5) * (A.spread || 200), s = (A.s || 1) * (.6 + r() * .6), fl = Math.sin(T * 8 + i) * .12;
    glow(g, x, y, 130 * s, 'rgba(255,160,70,1)', .55); g.save(); g.translate(x, y); g.scale(s, s * (1 + fl));
    sh(g, 'M0 -60 C22 -34 30 -4 20 16 C10 30 -10 30 -20 16 C-30 -4 -22 -34 0 -60 Z', 'rgba(255,170,80,.8)'); sh(g, 'M0 -28 C10 -14 12 4 6 12 C2 18 -4 18 -8 12 C-12 4 -10 -14 0 -28 Z', 'rgba(255,245,210,.95)'); g.restore(); }
  g.restore(); };
// ---------- a sun-shower: golden rain slanting through sunlight, a faint rainbow ----------
JPA.sunRain = (g, A, c) => { const T = c.T, r = rng(A.seed || 83), a = A.a ?? 1; g.save(); g.globalAlpha *= a;
  if (A.rainbow !== false) { g.save(); g.globalAlpha *= .28; ['#ff6a6a', '#ffb05a', '#fff06a', '#6aff8a', '#6ab0ff', '#9a6aff'].forEach((col, i) => { g.lineWidth = 22; g.strokeStyle = col; g.beginPath(); g.arc(A.rx ?? 760, A.ry ?? 1500, 900 - i * 22, Math.PI * 1.05, Math.PI * 1.75); g.stroke(); }); g.restore(); }
  for (let i = 0; i < (A.n || 110); i++) { const x = ((r() * 1500 + T * 220) % 1500) - 200, y = ((r() * 2100 + T * 1300) % 2100) - 100, k = r(); line(g, [x, y, x - 12, y + 54], 2.4, `rgba(255,${230 + k * 20 | 0},${170 + k * 60 | 0},${.45 + k * .35})`, 'round'); }
  const r2 = rng(84); for (let i = 0; i < 16; i++) { const q = ((T * 1.6 + r2()) % 1), x = r2() * 1080, y = 1880 + r2() * 300; g.save(); g.globalAlpha *= (1 - q) * .7; g.lineWidth = 2; g.strokeStyle = '#fff6dc'; g.beginPath(); g.ellipse(x, y, 10 + q * 40, 3 + q * 10, 0, 0, 7); g.stroke(); g.restore(); }
  g.restore(); };
// ---------- the empty sushi box ----------
JPA.sushiBox = (g, A, c) => { g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); g.rotate(A.rot || 0);
  tsh(g, 'M-90 0 L90 0 L84 -50 L-84 -50 Z', lg(g, 0, -50, 0, 0, [[0, '#c8904a'], [1, '#8a5a2a']]), 5); tsh(g, 'M-80 -46 L80 -46 L76 -10 L-76 -10 Z', '#3a1e10', 3);
  tell(g, -40, -24, 10, 4, 'rgba(255,240,220,.6)', 0); tell(g, 20, -20, 8, 3, 'rgba(255,240,220,.6)', 0); tsh(g, 'M-100 6 L-10 -70 L-4 -64 L-92 12 Z', '#c8904a', 3); g.restore(); };
// ---------- a memory vignette: soft warm edges for the flashback ----------
JPA.memory = (g, A, c) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = rg(g, 540, 960, 520, 1150, [[0, 'rgba(0,0,0,0)'], [1, `rgba(255,214,160,${A.a ?? .45})`]]); g.fillRect(0, 0, 1080, 1920); /* drifting memory motes: soft bokeh that keeps every flashback frame alive */ const r = rng(A.seed || 31); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < (A.motes ?? 26); k++) { const sp = 45 + r() * 70, R = 14 + r() * 30, x = ((r() * 1300 + Math.sin(c.T * (.5 + r() * .6) + k) * 90 + c.T * 18) % 1300) - 110, y = 2000 - ((r() * 2100 + c.T * sp) % 2100); g.globalAlpha = (.18 + .14 * Math.sin(c.T * 2 + k)) ; g.fillStyle = rg(g, x, y, 0, R, [[0, 'rgba(255,236,200,1)'], [1, 'rgba(255,220,170,0)']]); g.beginPath(); g.arc(x, y, R, 0, 7); g.fill(); } g.restore(); };
// Grandma reads as truly old: crow's feet, forehead lines, soft drooping eyes (still Mio's face shape and hair)
Object.assign(TOON.grandma, { age: .95, eyeShape: 'droopy', nose: 'button', jaw: 'wide' });
