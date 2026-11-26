// TOP 10 countdown: a rank card per entry (glowing numeral, a floating book with the title in our own type, and a
// simple generic icon for the theme). No characters or cover art from any series are drawn.
function icon(g, kind, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); const bob = Math.sin(T * 2) * 8; g.translate(0, bob);
  if (kind === 'gem') { line(g, [-70, -150, 0, -60, 70, -150], 6, '#d8c070', 'round', true); sh(g, 'M0 -70 L70 0 L0 110 L-70 0 Z', lg(g, -70, -70, 70, 110, [[0, '#a0f0ff'], [.5, '#3aa0e8'], [1, '#1a3a8a']]), 6); sh(g, 'M0 -70 L30 0 L0 110 L-30 0 Z', 'rgba(255,255,255,.25)'); glow(g, 0, 10, 260, 'rgba(120,210,255,1)', .5 + .2 * Math.sin(T * 4)); }
  if (kind === 'wing') { sh(g, 'M-20 60 C-60 -40 -20 -140 120 -170 C80 -120 100 -90 140 -100 C100 -60 120 -30 150 -30 C100 0 60 40 -20 60 Z', lg(g, -60, -170, 150, 60, [[0, '#ff9a3a'], [1, '#a82a1a']]), 6);
    for (let i = 0; i < 3; i++) line(g, [-10, 40, 60 + i * 30, -140 + i * 50], 4, 'rgba(60,10,0,.4)', 'round', true); g.save(); g.translate(-90, 40); fire(g, 0, 0, 1.4, T); g.restore(); }
  if (kind === 'shades') { sh(g, 'M-170 -30 L170 -30 L170 -10 L-170 -10 Z', '#141018', 4); [-1, 1].forEach(sd => sh(g, `M${sd * 20} -30 L${sd * 160} -30 Q${sd * 160} 60 ${sd * 90} 60 Q${sd * 20} 60 ${sd * 20} -30 Z`, lg(g, 0, -30, 0, 60, [[0, '#3a3a5a'], [1, '#0a0a14']]), 5)); line(g, [-120, -10, -80, 30], 6, 'rgba(255,255,255,.4)', 'round', true); line(g, [60, -10, 100, 30], 6, 'rgba(255,255,255,.4)', 'round', true); }
  if (kind === 'heart') { sh(g, 'M0 90 C-130 0 -150 -110 -60 -120 C-20 -124 0 -90 0 -70 C0 -90 20 -124 60 -120 C150 -110 130 0 0 90 Z', '#ff6aa8', 6, '#3a1a5a'); for (let i = 0; i < 4; i++) line(g, [-80 + i * 40, -60, -60 + i * 40, 30], 3, 'rgba(255,255,255,.35)', 'round', true);
    g.save(); g.translate(120, -40); g.rotate(.7); sh(g, 'M-8 -110 L8 -110 L8 60 L-8 60 Z', '#8a5ad0', 3); sh(g, 'M-8 60 L8 60 L0 86 Z', '#3a1a5a', 3); g.restore(); }
  if (kind === 'strip') { [-1, 0, 1].forEach(i => sh(g, `M${i * 120 - 54} -70 L${i * 120 + 54} -70 L${i * 120 + 54} 70 L${i * 120 - 54} 70 Z`, ['#ffd8a0', '#c8e6ff', '#ffc8d8'][i + 1], 5)); txt(g, 'HA!', 120, 0, 50, '#e8302a', '#141018', 'Nunito', 900, -.2, 8); txt(g, '...', 0, 0, 50, '#141018', null); }
  if (kind === 'phone') { sh(g, rrect(g, -120, -20, 240, 130, 26), '#e84a6a', 6); sh(g, 'M-140 -40 C-140 -110 140 -110 140 -40 L100 -30 C100 -60 -100 -60 -100 -30 Z', '#c8304a', 6); ell(g, 0, 46, 46, 46, '#fff4f0', 4);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; ell(g, Math.cos(a) * 30, 46 + Math.sin(a) * 30, 6, 6, '#c8304a'); } }
  if (kind === 'braces') { sh(g, 'M-160 -30 Q0 140 160 -30 Q0 30 -160 -30 Z', '#5a1c22', 6); sh(g, 'M-140 -20 Q0 40 140 -20 L130 10 Q0 66 -130 10 Z', '#fff', 3); line(g, [-130, -2, 0, 38, 130, -2], 5, '#a8b0c0', 'round', true); for (let i = -4; i <= 4; i++) sh(g, `M${i * 28 - 8} ${-4 + 40 - Math.abs(i) * 7} l16 0 l0 14 l-16 0 Z`, '#d0d8e4', 2.4); }
  if (kind === 'cape') { const w = Math.sin(T * 4) * 20; sh(g, `M-50 -120 L50 -120 C80 -40 ${130 + w} 40 ${150 + w} 130 Q0 ${100 - w} ${-150 - w} 130 C${-130 - w} 40 -80 -40 -50 -120 Z`, lg(g, 0, -120, 0, 130, [[0, '#ff4a3a'], [1, '#a81a1a']]), 6); sh(g, 'M-60 -130 L60 -130 L60 -110 L-60 -110 Z', '#ffd23a', 4); }
  if (kind === 'badge') { sh(g, 'M0 -140 L40 -100 L100 -110 L90 -50 L130 0 L90 50 L100 110 L40 100 L0 140 L-40 100 L-100 110 L-90 50 L-130 0 L-90 -50 L-100 -110 L-40 -100 Z', lg(g, -130, -140, 130, 140, [[0, '#fff2a8'], [.5, '#e8b028'], [1, '#8a5a10']]), 6);
    ell(g, 0, 10, 30, 26, '#6a3a10'); [[-38, -30], [-12, -50], [16, -50], [40, -30]].forEach(([x, y2]) => ell(g, x, y2, 13, 15, '#6a3a10')); }
  if (kind === 'notebook') { sh(g, 'M-110 -150 L120 -150 L120 150 L-110 150 Z', '#fffdf4', 6, '#1c2a5a'); for (let y2 = -100; y2 < 150; y2 += 30) line(g, [-110, y2, 120, y2], 2.4, 'rgba(90,150,220,.55)', 'butt', true);
    for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(-114, -130 + i * 37, 16, 9, -.3, Math.PI * .3, Math.PI * 1.8); g.lineWidth = 5; g.strokeStyle = '#8a8a96'; g.stroke(); } txt(g, '300M+', 10, 0, 64, '#e8302a', '#fff', 'Nunito', 900, -.1, 10); }
  g.restore(); }
function rankCard(g, a, lt, T) { const k = eo((lt - (a.t0 || 0)) / .45), col = a.col || '#ffb04a';
  glow(g, 540, 1000, 900, hexA(col, 1), .22);
  // numeral
  g.save(); g.translate(250 - (1 - k) * 300, 640); g.globalAlpha = k; txt(g, '#' + a.rank, 0, 0, 230, col, '#0a0e16', 'Nunito', 900, -.06, 26); g.restore();
  // book: slides in, floats, slight 3D tilt
  const bx = 600 + (1 - k) * 600, by = 1080 + Math.sin(T * 1.6) * 14, rot = -.06 + Math.sin(T * 1.1) * .03;
  g.save(); g.translate(bx, by); g.rotate(rot); g.globalAlpha = k;
  sh(g, 'M150 -250 L190 -228 L190 272 L150 250 Z', lg(g, 150, 0, 190, 0, [[0, '#f6ecd6'], [1, '#c8b896']]), 5);
  cel(g, rrect(g, -150, -250, 300, 500, 12), a.bookCol || col, 0, -1, .2, 150); sh(g, rrect(g, -150, -250, 300, 500, 12), null, 6);
  sh(g, 'M-150 -250 L-122 -250 L-122 250 L-150 250 Z', shade(a.bookCol || col, .35), 0);
  const words = (a.title || '').split('\n'); words.forEach((w, i) => txt(g, w, 12, -150 + i * 64 - (words.length - 1) * 10, w.length > 9 ? 44 : 56, '#fff', '#0a0e16', 'Nunito', 900, 0, 10));
  line(g, [-90, 200, 110, 200], 6, 'rgba(255,255,255,.5)', 'round', true); g.restore();
  if (a.icon) icon(g, a.icon, 790, 640 + (1 - k) * 80, .9 * k, T);
  if (a.sub) { g.save(); g.globalAlpha = clamp((lt - (a.t0 || 0) - .4) / .3); txt(g, a.sub, 540, 1460, 44, '#e8e0d0', '#0a0e16', 'Nunito', 800, 0, 8); g.restore(); } }
const _drawActorT = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'rankcard') return rankCard(g, A, c.lt, c.T);
  if (A.type === 'icon') return icon(g, A.kind, A.x, A.y, A.s || 1, c.T);
  return _drawActorT(g, a, c, P, o); };
