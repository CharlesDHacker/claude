// Episode 4 (the Prodigal Son): family, village houses, coins, pigs, famine, party lanterns, feast.
Object.assign(WAR, {
  father:   { skin: '#b07a52', tunic: '#e8dcc2', kilt: '#2a3e6a', cape: '#2a3e6a', beard: 'long', beardCol: '#e8e4dc', hair: '#e8e4dc', helmet: null, bulk: 1.05, head: 1, weapon: null, shield: null, boots: '#5a3420' },
  sonRich:  { skin: '#c08a5e', tunic: '#7a2a8a', kilt: '#e0b648', cape: '#c0402a', beard: null, hair: '#2a1a12', helmet: null, bulk: .95, head: 1.04, weapon: null, shield: null, boots: '#7a4a2a' },
  sonRags:  { skin: '#a8754e', tunic: '#7a6448', kilt: '#5a4a36', cape: null, beard: 'short', beardCol: '#2a1a12', hair: '#2a1a12', helmet: null, bulk: .9, head: 1.04, weapon: null, shield: null, boots: '#a8754e' },
  sonRobe:  { skin: '#a8754e', tunic: '#f2e6c8', kilt: '#c0902a', cape: '#a8231a', beard: 'short', beardCol: '#2a1a12', hair: '#2a1a12', helmet: null, bulk: .92, head: 1.04, weapon: null, shield: null, boots: '#7a4a2a' },
  older:    { skin: '#b4784e', tunic: '#8a7a5a', kilt: '#4a5a3a', cape: null, beard: 'short', beardCol: '#24160e', hair: '#24160e', helmet: null, bulk: 1.05, head: 1, weapon: null, shield: null, boots: '#4a2c1c' },
  guest:    { skin: '#b4784e', tunic: '#c9a57a', kilt: '#7a3a5a', cape: null, beard: 'short', beardCol: '#24160e', hair: '#24160e', helmet: null, weapon: null, shield: null },
});
function house(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); const col = a.col || '#c8a274', dk = mix(col, '#000', .25), lit = a.light ?? 0;
  sh(g, 'M-260 0 L-260 -420 L260 -420 L260 0 Z', lg(g, -260, 0, 260, 0, [[0, col], [1, dk]]), 7); sh(g, 'M-290 -420 L290 -420 L290 -460 L-290 -460 Z', dk, 6);
  for (let i = 0; i < 6; i++) line(g, [-280 + i * 112, -440, -280 + i * 112 + 30, -380], 4, 'rgba(60,30,10,.35)');
  sh(g, 'M-70 0 L-70 -250 Q0 -300 70 -250 L70 0 Z', lit ? `rgba(255,${190 + lit * 40 | 0},110,1)` : '#2a1810', 6);
  sh(g, 'M140 -320 L210 -320 L210 -240 L140 -240 Z', lit ? '#ffcf7a' : '#2a1810', 5); line(g, [175, -320, 175, -240], 4, '#5a3a20');
  if (lit) { glow(g, 0, -120, 360, 'rgba(255,190,100,1)', lit * .7); glow(g, 175, -280, 160, 'rgba(255,200,120,1)', lit * .6); }
  if (a.party) for (let i = 0; i < 3; i++) { const k = Math.sin(T * 6 + i * 2); g.save(); g.globalAlpha = .55; g.fillStyle = '#5a2a14'; g.beginPath(); g.ellipse(-30 + i * 30, -150 + k * 8, 14, 40, k * .2, 0, 7); g.fill(); g.restore(); }
  g.restore(); }
function coins(g, a, lt) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-90 0 C-120 -60 -100 -150 -40 -170 L40 -170 C100 -150 120 -60 90 0 Z', lg(g, -90, 0, 90, 0, [[0, '#8a5a32'], [1, '#5a3a1e']]), 7); line(g, [-50, -160, 50, -160], 10, '#c0902a');
  const q = (lt - (a.t0 ?? 0)) / (a.d || 1.6), r = rng(a.seed || 3);
  for (let i = 0; i < 30; i++) { const an = -Math.PI * (.15 + r() * .7), sp = 300 + r() * 600, k = clamp(q * (0.8 + r() * .4)); if (k <= 0) continue; const x = Math.cos(an) * sp * k, y = -170 + Math.sin(an) * sp * k + 1100 * k * k, sp2 = lt * (8 + r() * 6);
    g.save(); g.translate(x, y); g.scale(Math.cos(sp2), 1); ell(g, 0, 0, 24, 24, lg(g, -24, -24, 24, 24, [[0, '#fff0a0'], [1, '#c0902a']]), 4); g.restore(); }
  if (q > 0 && q < 1) glow(g, 0, -200, 300, 'rgba(255,210,100,1)', (1 - q) * .6);
  g.restore(); }
function pig(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); const b = Math.sin(T * 3 + (a.ph || 0)) * 4, pk = '#f0a8a0', dk = '#d08078';
  ell(g, 0, 4, 160, 16, 'rgba(30,15,10,.25)');
  [[-90, 0], [-50, 0], [60, 0], [100, 0]].forEach(([x], i) => { limb(g, [x, -90, x, -14], 26, i % 2 ? dk : pk, 5); sh(g, `M${x - 14} -16 l28 0 l2 16 l-32 0 Z`, '#5a3a32', 4); });
  ell(g, 0, -130, 150, 90, lg(g, 0, -220, 0, -40, [[0, pk], [1, dk]]), 7); ell(g, -40, -100, 40, 22, 'rgba(110,80,50,.35)'); ell(g, 60, -160, 30, 16, 'rgba(110,80,50,.3)');
  g.save(); g.translate(150, -150 + b); ell(g, 0, 0, 70, 62, pk, 7); ell(g, 60, 14, 30, 26, '#f6bcb4', 6); ell(g, 52, 12, 5, 8, '#7a3a32'); ell(g, 68, 12, 5, 8, '#7a3a32');
  sh(g, 'M-30 -40 L-10 -90 L14 -50 Z', dk, 5); sh(g, 'M10 -46 L36 -90 L50 -44 Z', dk, 5); ell(g, 20, -12, 9, 9, '#1a120e'); ell(g, 23, -15, 3, 3, '#fff'); line(g, [36, 40, 56, 44], 4); g.restore();
  line(g, [-150, -150, -190, -170, -180, -200, -160, -180], 6, dk); g.restore(); }
function deadTree(g, a) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); limb(g, [0, 0, -20, -200, 10, -420], 40, '#5a4436', 7); limb(g, [0, -260, -120, -340, -200, -360], 18, '#5a4436', 6); limb(g, [6, -320, 110, -400, 170, -470], 16, '#5a4436', 6); limb(g, [-110, -335, -130, -400], 10, '#5a4436', 5); g.restore(); }
function cracks(g, a) { const r = rng(a.seed || 5); g.save(); for (let i = 0; i < (a.n || 40); i++) { let x = -400 + r() * 1900, y = (a.y0 || 1400) + r() * 600; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - .5) * 120; y += (r() - .3) * 40; g.lineTo(x, y); } g.lineWidth = 3 + r() * 3; g.strokeStyle = 'rgba(60,35,20,.55)'; g.stroke(); } g.restore(); }
function lanterns(g, a, T) { const n = a.n || 9; g.save(); g.beginPath(); g.moveTo(a.x0, a.y); g.quadraticCurveTo((a.x0 + a.x1) / 2, a.y + 120, a.x1, a.y); g.lineWidth = 3; g.strokeStyle = '#3a2418'; g.stroke();
  for (let i = 1; i < n; i++) { const k = i / n, x = lerp(a.x0, a.x1, k), y = a.y + 4 * 120 * k * (1 - k) / 1 * .5 * 2 + Math.sin(T * 2 + i) * 4, cols = ['#ffb84a', '#ff7a4a', '#ffd86a', '#ff9ad0']; glow(g, x, y + 30, 120, 'rgba(255,190,100,1)', .6); ell(g, x, y + 30, 22, 30, cols[i % 4], 4); } g.restore(); }
function table(g, a) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); sh(g, 'M-420 -120 L420 -120 L440 -90 L-440 -90 Z', '#8a5a32', 6); limb(g, [-380, -90, -380, 0], 18, '#5a3a1e', 5); limb(g, [380, -90, 380, 0], 18, '#5a3a1e', 5);
  [[-300, '#e8c87a', 50, 26], [-160, '#7a3a8a', 40, 30], [0, '#c8743a', 80, 40], [170, '#e8c87a', 46, 24], [300, '#4a7a3a', 44, 30]].forEach(([x, c, rx, ry]) => ell(g, x, -150, rx, ry, c, 5)); [[-230], [90], [240]].forEach(([x]) => { sh(g, `M${x - 16} -120 L${x + 16} -120 L${x + 22} -190 L${x - 22} -190 Z`, '#c0902a', 4); }); g.restore(); }
function ring(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); glow(g, 0, 0, 380, 'rgba(255,220,130,1)', .8); rays(g, 0, 0, 900, 14, 'rgba(255,230,160,.6)', .5, T);
  g.lineWidth = 46; g.strokeStyle = lg(g, -120, -120, 120, 120, [[0, '#fff2b8'], [.5, '#e0a63a'], [1, '#8a5a1e']]); g.beginPath(); g.ellipse(0, 0, 130, 120, 0, 0, 7); g.stroke(); g.lineWidth = 6; g.strokeStyle = '#5a3a14'; g.beginPath(); g.ellipse(0, 0, 153, 143, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(0, 0, 107, 97, 0, 0, 7); g.stroke();
  ell(g, 0, -128, 46, 40, lg(g, -40, -160, 40, -90, [[0, '#ff8a9a'], [1, '#a8102a']]), 6); ell(g, -12, -140, 12, 9, 'rgba(255,255,255,.8)'); g.restore(); }
const _drawActor2 = drawActor;
drawActor = function (g, a, c, P, o) {
  const A = avAll(a, c.lt), T = c.T;
  if (A.type === 'house') return house(g, A, T); if (A.type === 'coins') return coins(g, A, c.lt); if (A.type === 'pig') return pig(g, A, T); if (A.type === 'deadtree') return deadTree(g, A);
  if (A.type === 'cracks') return cracks(g, A); if (A.type === 'lanterns') return lanterns(g, A, T); if (A.type === 'table') return table(g, A); if (A.type === 'ring') return ring(g, A, T);
  if (A.type === 'mud') { ell(g, A.x, A.y, A.w || 500, A.h || 60, '#6a4a32', 6); ell(g, A.x - 80, A.y - 10, (A.w || 500) * .3, 14, 'rgba(140,100,70,.6)'); return; }
  return _drawActor2(g, a, c, P, o);
};
