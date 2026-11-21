// Episode 7 (Esther): Esther, Mordecai, King Xerxes, Haman; the throne and golden scepter, a royal horse with a rider,
// the banquet, the sleepless night, and the gallows in silhouette.
Object.assign(WAR, {
  estherGirl: { female: 1, skin: '#c48c62', tunic: '#d8c8a8', kilt: '#7a4a2a', cape: '#8a5a3a', beard: null, hair: '#1e120c', hairStyle: 'long', nose: 'button', jaw: 'round', helmet: null, bulk: .82, tall: .98, head: 1.04, weapon: null, shield: null, boots: '#7a4a2a', long: 1, trim: '#c8a050', lips: '#b04a54' },
  esther:     { female: 1, skin: '#c48c62', tunic: '#5a2a8a', kilt: '#e8c04a', cape: '#2a3a8a', beard: null, hair: '#1e120c', hairStyle: 'long', nose: 'button', jaw: 'round', helmet: 'crown', earring: true, bulk: .84, tall: 1.0, head: 1.04, weapon: null, shield: null, boots: '#e8c04a', long: 1, trim: '#f0d060', lips: '#b04a54' },
  mordecai:   { skin: '#a8724c', tunic: '#7a6a52', kilt: '#4a3a2a', cape: '#3a4a5a', beard: 'long', beardCol: '#cfc8bc', hair: '#cfc8bc', hairStyle: 'long', nose: 'straight', jaw: 'square', brow: 1.5, helmet: 'turban', wrap: '#e8e0cc', bulk: 1.0, tall: .98, head: 1, weapon: null, shield: null, boots: '#4a2c1c', long: 1, trim: '#a89a6a' },
  mordecaiR:  { skin: '#a8724c', tunic: '#5a2a8a', kilt: '#e8c04a', cape: '#a8231a', beard: 'long', beardCol: '#cfc8bc', hair: '#cfc8bc', hairStyle: 'long', nose: 'straight', jaw: 'square', brow: 1.5, helmet: 'turban', wrap: '#f0d060', bulk: 1.0, head: 1, weapon: null, shield: null, boots: '#e8c04a', long: 1, trim: '#f0d060' },
  xerxes:     { skin: '#a8714c', tunic: '#8a1a2a', kilt: '#e0b648', cape: '#3a1a5a', beard: 'braided', beardCol: '#141010', hair: '#141010', nose: 'hook', jaw: 'square', brow: 1.4, helmet: 'kidaris', bulk: 1.12, tall: 1.06, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1, trim: '#e0b648' },
  haman:      { skin: '#b07a50', tunic: '#1e1a24', kilt: '#8a1a1a', cape: '#5a0e14', beard: 'forked', beardCol: '#2a1810', hair: '#2a1810', nose: 'hook', jaw: 'square', brow: 2, earring: true, helmet: 'felt', bulk: .95, tall: 1.08, head: .98, weapon: null, shield: null, boots: '#2a1810', long: 1, trim: '#c0302a' },
  scribe:     { skin: '#a8714c', tunic: '#c8b890', kilt: '#4a5a6a', cape: null, beard: 'short', beardCol: '#2a1a12', hair: '#2a1a12', nose: 'broad', helmet: 'felt', bulk: .95, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1 },
});
Object.assign(HOLD, {
  scepter: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -1.2); taper(g, 0, 40, 0, -300, 12, 10, lg(g, -8, 0, 8, 0, [[0, '#fff2a8'], [.5, '#e0b028'], [1, '#8a5a10']])); ell(g, 0, -316, 26, 26, rg(g, -8, -324, 4, 28, [[0, '#fffbe0'], [1, '#d8a020']]), 4); glow(g, 0, -316, 160 * (o.glow ?? 1), 'rgba(255,220,120,1)', .55); g.restore(); },
  cup: (g, h) => { g.save(); g.translate(h[0], h[1]); sh(g, 'M-26 -60 L26 -60 Q24 -20 0 -14 Q-24 -20 -26 -60 Z', '#e0b028', 3); line(g, [0, -14, 0, 14], 6, '#c08a20', 'round', true); line(g, [-18, 16, 18, 16], 6, '#c08a20', 'round', true); g.restore(); },
  scroll: (g, h) => { g.save(); g.translate(h[0] + 20, h[1] - 40); sh(g, 'M-70 -90 L70 -90 L70 90 L-70 90 Z', '#f2e6c4', 4); for (let i = 0; i < 6; i++) line(g, [-50, -60 + i * 24, 50, -60 + i * 24], 3, 'rgba(90,60,30,.5)', 'round', true); ell(g, 0, -92, 76, 12, '#d8c49a', 3); ell(g, 0, 92, 76, 12, '#d8c49a', 3); g.restore(); },
});
function throne(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  for (let i = 0; i < 3; i++) sh(g, `M${-360 + i * 50} ${-i * 50} L${360 - i * 50} ${-i * 50} L${360 - i * 50} ${-i * 50 - 50} L${-360 + i * 50} ${-i * 50 - 50} Z`, i % 2 ? '#8a6a4a' : '#a8845a', 5);
  sh(g, 'M-170 -150 L-170 -640 C-170 -720 170 -720 170 -640 L170 -150 Z', lg(g, -170, 0, 170, 0, [[0, '#a8781a'], [.5, '#f0c84a'], [1, '#8a5a10']]), 6);
  sh(g, 'M-120 -200 L-120 -600 C-120 -650 120 -650 120 -600 L120 -200 Z', '#6a1a2a', 4); [-1, 1].forEach(s => { sh(g, `M${s * 170} -330 L${s * 230} -330 L${s * 230} -150 L${s * 170} -150 Z`, '#d8a830', 5); ell(g, s * 200, -340, 26, 26, '#f0d060', 4); });
  ell(g, 0, -680, 40, 40, '#f0d060', 4); glow(g, 0, -500, 600, 'rgba(255,210,120,1)', .3); g.restore(); }
function horse(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  const col = a.col || '#f2ece0', dk = mix(col, '#2a1a10', .3), lt = mix(col, '#fff', .3), w = a.walk ? T * (a.rate || 5) : null, mane = a.mane || '#d8cfc0';
  g.fillStyle = rg(g, 0, 0, 10, 260, [[0, 'rgba(20,10,10,.3)'], [1, 'rgba(20,10,10,0)']]); g.beginPath(); g.ellipse(0, 4, 260, 22, 0, 0, 7); g.fill();
  const leg = (x, ph, c) => { const sw = w != null ? Math.sin(w + ph) * 30 : 0, lift = w != null ? Math.max(0, Math.cos(w + ph)) * 20 : 0; taper(g, x, -270, x + sw * .4, -140, 40, 26, c); taper(g, x + sw * .4, -140, x + sw, -14 - lift, 24, 20, c); sh(g, `M${x + sw - 18} ${-16 - lift} L${x + sw + 20} ${-16 - lift} L${x + sw + 22} ${2 - lift} L${x + sw - 20} ${2 - lift} Z`, '#3a2a22', 3); };
  leg(-150, 0, dk); leg(130, 2.4, dk);
  line(g, [-230, -330, -280 + Math.sin(T * 3) * 10, -200, -270, -130], 22, mane, 'round', true);
  sh(g, 'M-240 -320 C-250 -400 -120 -420 0 -410 C120 -420 210 -400 220 -330 C226 -270 180 -240 120 -236 L-180 -236 C-230 -240 -240 -280 -240 -320 Z', rg(g, -20, -380, 20, 280, [[0, lt], [.6, col], [1, dk]]), 6);
  if (a.caparison !== false) { sh(g, 'M-170 -400 C-80 -420 80 -420 150 -400 L170 -220 C80 -200 -80 -200 -190 -220 Z', a.cloth || '#5a2a8a', 5); pattern(g, -186, 168, -244, 18, '#f0d060', 'zig'); }
  // rider (upper body only, hidden below the saddle cloth)
  if (a.rider) { g.save(); g.beginPath(); g.rect(-400, -1400, 800, 1000); g.clip(); warrior(g, { c: a.rider, x: -10, y: -40, s: .9, flip: false, t: T, expr: a.riderExpr || 'smile', pose: a.riderPose || 'stand', talk: 0 }); g.restore();
    if (a.caparison !== false) { sh(g, 'M-170 -400 C-80 -420 80 -420 150 -400 L150 -380 C80 -396 -80 -396 -170 -380 Z', a.cloth || '#5a2a8a', 4); } }
  leg(-110, 3.1, col); leg(170, 5.4, col);
  g.save(); g.translate(190, -360); g.rotate(Math.sin((w ?? T * 1.2)) * .04);
  sh(g, 'M-30 30 C0 -40 30 -150 70 -210 C90 -236 140 -230 140 -200 C130 -140 90 -40 40 50 Z', lg(g, 0, -230, 0, 50, [[0, lt], [1, col]]), 6);
  for (let i = 0; i < 6; i++) line(g, [-10 + i * 12, 20 - i * 40, -30 + i * 10 + Math.sin(T * 4 + i) * 6, 30 - i * 40], 12, mane, 'round', true);
  sh(g, 'M80 -230 C100 -250 170 -240 210 -190 C224 -170 214 -150 196 -146 C170 -140 130 -160 100 -170 C80 -180 70 -210 80 -230 Z', lg(g, 80, -250, 220, -140, [[0, lt], [1, col]]), 5);
  sh(g, 'M96 -232 L90 -268 L114 -238 Z', dk, 3); ell(g, 136, -208, 7, 7, '#1a100a'); ell(g, 138, -210, 2.4, 2.4, '#fff'); ell(g, 198, -166, 5, 4, '#3a2a22');
  if (a.reins) line(g, [170, -180, 120, -120, a.reins[0] - 190, a.reins[1] + 360], 4, '#6a3a1a', 'round', true);
  sh(g, 'M100 -186 L196 -176', null, 4, '#c0302a'); g.restore(); g.restore(); }
function gallows(g, a) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const c = a.col || '#140810';
  sh(g, 'M-200 0 L-170 0 L-170 -1000 L-200 -1000 Z', c); sh(g, 'M-210 -1000 L260 -1000 L260 -970 L-210 -970 Z', c); line(g, [-185, -880, -60, -1000], 22, c, 'butt', true);
  sh(g, 'M-300 0 L300 0 L300 -180 L-300 -180 Z', c); for (let i = 0; i < 6; i++) line(g, [230, -180 + i * 0, 270, 0], 0); g.restore(); }
function lampStand(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); line(g, [0, 0, 0, -260], 10, '#8a6a30', 'round', true); sh(g, 'M-60 -260 L60 -260 L40 -230 L-40 -230 Z', '#c09030', 4); fire(g, 0, -270, .6, T); glow(g, 0, -280, 500, 'rgba(255,190,100,1)', .5); g.restore(); }
const _drawActorPer = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt), T = c.T;
  if (A.type === 'throne') return throne(g, A, T); if (A.type === 'horse') return horse(g, A, T); if (A.type === 'gallows') return gallows(g, A);
  if (A.type === 'lampstand') return lampStand(g, A, T);
  return _drawActorPer(g, a, c, P, o); };
