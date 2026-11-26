// Video-essay look: original modern people (a host and two kid readers), a study, a library, a bedroom at night,
// a dark infographic board, and the diagrams for the argument. No characters from either book series are drawn.
Object.assign(WAR, {
  host: { modern: 1, skin: '#c08a5e', tunic: '#2a5a6a', longSleeve: 1, hood: 1, headphones: 1, glasses: '#2a2a34', pants: '#3a4a6a', sneakers: '#c8302a', hair: '#2a1a12', hairStyle: 'tied', band: '#2a1a12', beard: null, nose: 'straight', jaw: 'square', bulk: .95, tall: 1, head: 1.05, weapon: null, shield: null },
  kid:  { modern: 1, skin: '#b07a52', tunic: '#e8b04a', stripes: 'rgba(200,80,40,.55)', pants: '#4a5a7a', sneakers: '#3a8ac8', hair: '#1e140c', hairStyle: 'curly', eyes: 'big', nose: 'button', jaw: 'round', beard: null, bulk: .82, tall: .74, head: 1.32, weapon: null, shield: null },
  kid2: { modern: 1, skin: '#d4a07a', tunic: '#8a5ac8', longSleeve: 1, pants: '#2a3a5a', sneakers: '#f0c040', hair: '#6a3a1a', hairStyle: 'long', eyes: 'big', nose: 'button', jaw: 'round', beard: null, bulk: .8, tall: .72, head: 1.3, weapon: null, shield: null },
});
function spines(g, x0, y0, w, h, rows, seed, T) { const r = rng(seed), cols = ['#a8342a', '#2a5a8a', '#3a7a4a', '#c8902a', '#6a3a7a', '#2a6a6a', '#d8c8a8', '#8a4a2a'];
  sh(g, `M${x0} ${y0} L${x0 + w} ${y0} L${x0 + w} ${y0 + h} L${x0} ${y0 + h} Z`, '#5a3a24', 6);
  const rh = h / rows; for (let k = 0; k < rows; k++) { const y = y0 + k * rh; sh(g, `M${x0 + 14} ${y + 12} L${x0 + w - 14} ${y + 12} L${x0 + w - 14} ${y + rh - 6} L${x0 + 14} ${y + rh - 6} Z`, '#2a1a12');
    let x = x0 + 18; while (x < x0 + w - 40) { const bw = 18 + r() * 22, bh = rh * (.62 + r() * .28), lean = r() > .93 ? .12 : 0; g.save(); g.translate(x, y + rh - 8); g.rotate(lean);
      sh(g, `M0 0 L${bw} 0 L${bw} ${-bh} L0 ${-bh} Z`, cols[(r() * cols.length) | 0], 2.4); line(g, [3, -bh * .2, bw - 3, -bh * .2], 2, 'rgba(255,240,200,.35)', 'butt', true); g.restore(); x += bw + 2 + (lean ? 8 : 0); }
    line(g, [x0 + 10, y + rh - 4, x0 + w - 10, y + rh - 4], 10, '#7a5234', 'butt', true); } }
SC.room = (g, o, c) => { o = avAll(o, c.lt); const T = c.T, kind = o.kind || 'study';
  if (kind === 'board') { g.fillStyle = lg(g, 0, -400, 0, 2400, [[0, '#141a26'], [1, '#0a0e16']]); g.fillRect(-1600, -1600, 4300, 4300);
    g.save(); g.globalAlpha = .07; for (let x = -100; x < 1200; x += 60) line(g, [x, -200, x, 2200], 2, '#9ab8ff', 'butt', true); for (let y = -200; y < 2200; y += 60) line(g, [-200, y, 1300, y], 2, '#9ab8ff', 'butt', true); g.restore();
    glow(g, 540, 900, 900, 'rgba(90,130,255,1)', .12); }
  else if (kind === 'bedroom') { g.fillStyle = lg(g, 0, -200, 0, 2200, [[0, '#1a2240'], [1, '#0e1226']]); g.fillRect(-1600, -1600, 4300, 4300);
    par(g, c, .5, () => { sh(g, 'M640 380 L960 380 L960 760 L640 760 Z', lg(g, 0, 380, 0, 760, [[0, '#0a1430'], [1, '#2a3a70']]), 8, '#3a2a2a'); ell(g, 860, 470, 34, 34, '#f4ecd0'); for (let i = 0; i < 9; i++) ell(g, 660 + (i * 37) % 280, 400 + (i * 53) % 300, 2.4, 2.4, '#fff');
      line(g, [800, 380, 800, 760], 6, '#3a2a2a', 'butt', true); line(g, [640, 570, 960, 570], 6, '#3a2a2a', 'butt', true); spines(g, 60, 480, 420, 380, 2, 4, T); });
    sh(g, 'M-300 1500 L1400 1500 L1400 2400 L-300 2400 Z', '#2a2236'); }
  else if (kind === 'library') { g.fillStyle = lg(g, 0, -200, 0, 2200, [[0, '#3a2a1e'], [1, '#1e140e']]); g.fillRect(-1600, -1600, 4300, 4300);
    par(g, c, .6, () => { spines(g, -120, 300, 560, 1180, 6, 7, T); spines(g, 640, 300, 560, 1180, 6, 9, T); glow(g, 540, 300, 700, 'rgba(255,200,120,1)', .35); });
    sh(g, 'M-300 1480 L1400 1480 L1400 2400 L-300 2400 Z', lg(g, 0, 1480, 0, 2400, [[0, '#6a4a30'], [1, '#3a2618']])); }
  else { // study
    g.fillStyle = lg(g, 0, -200, 0, 2200, [[0, '#3a4a4a'], [1, '#22302e']]); g.fillRect(-1600, -1600, 4300, 4300);
    par(g, c, .55, () => { sh(g, 'M600 300 L1000 300 L1000 820 L600 820 Z', lg(g, 0, 300, 0, 820, [[0, '#2a2a5a'], [.6, '#c86a5a'], [1, '#f0b07a']]), 8, '#2a1a12'); line(g, [800, 300, 800, 820], 7, '#2a1a12', 'butt', true); line(g, [600, 560, 1000, 560], 7, '#2a1a12', 'butt', true);
      spines(g, 40, 260, 460, 1000, 5, 3, T); sh(g, 'M640 900 L960 900 L960 1100 L640 1100 Z', '#e8dcc0', 6, '#5a3a24'); for (let i = 0; i < 3; i++) sh(g, `M${660 + i * 98} 920 L${740 + i * 98} 920 L${740 + i * 98} 1080 L${660 + i * 98} 1080 Z`, ['#ffd23a', '#7ad2ff', '#ff8ab4'][i], 3); });
    sh(g, 'M-300 1500 L1400 1500 L1400 2400 L-300 2400 Z', lg(g, 0, 1500, 0, 2400, [[0, '#5a3e2a'], [1, '#3a2618']])); glow(g, 300, 1250, 700, 'rgba(255,200,120,1)', .25); }
  for (const a of (o.actors || [])) { if (a.par != null && a.par !== 1) par(g, c, a.par, () => drawActor(g, a, c, {}, o)); else drawActor(g, a, c, {}, o); }
  if (o.vignette) { g.fillStyle = rg(g, 540, 960, 400, 1300, [[0, 'rgba(0,0,0,0)'], [1, `rgba(20,10,0,${o.vignette})`]]); g.fillRect(-1600, -1600, 4300, 4300); }
};
function desk(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-520 -40 L520 -40 L540 0 L-540 0 Z', '#8a5a34', 5); sh(g, 'M-500 0 L500 0 L500 620 L-500 620 Z', lg(g, 0, 0, 0, 420, [[0, '#6a4426'], [1, '#3a2414']]), 6); sh(g, 'M-440 60 L-40 60 L-40 200 L-440 200 Z', null, 3, 'rgba(0,0,0,.35)'); ell(g, -240, 130, 16, 8, '#c8a050', 2.4);
  // lamp + books + mug
  g.save(); g.translate(360, -40); limb(g, [0, 0, -40, -200, 40, -300], 12, '#2a2a34', 4); sh(g, 'M0 -340 L110 -280 L60 -230 L-30 -300 Z', '#2a5a4a', 5); glow(g, 60, -230, 500, 'rgba(255,210,140,1)', .5); g.restore();
  [['#a8342a', 0], ['#2a5a8a', -38], ['#c8902a', -76]].forEach(([col, dy], i) => sh(g, `M${-420 + i * 8} ${-40 + dy} L${-200 + i * 8} ${-40 + dy} L${-200 + i * 8} ${-76 + dy} L${-420 + i * 8} ${-76 + dy} Z`, col, 4));
  sh(g, 'M-110 -40 L-50 -40 L-56 -120 L-104 -120 Z', '#e8e0d0', 4); ell(g, -80, -120, 24, 6, '#5a3a24', 3); g.restore(); }
function comicsPage(g, a, lt) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); g.rotate(a.rot || 0);
  sh(g, 'M-380 -500 L380 -500 L380 500 L-380 500 Z', '#f2ead8', 6); txt(g, 'THE DAILY COMICS', 0, -440, 54, '#2a2a34', null, 'Garamond', 500);
  line(g, [-350, -400, 350, -400], 4, '#2a2a34', 'butt', true); const r = rng(4), cols = ['#ffd8a0', '#c8e6ff', '#ffc8d8', '#d8f0c0'];
  for (let row = 0; row < 5; row++) { const y = -370 + row * 172, on = a.t0 == null || lt > a.t0 + row * (a.step || .25); if (!on) continue;
    for (let k = 0; k < 3; k++) { const x = -350 + k * 236; sh(g, `M${x} ${y} L${x + 222} ${y} L${x + 222} ${y + 150} L${x} ${y + 150} Z`, cols[(row + k) % 4], 3.4, '#2a2a34');
      ell(g, x + 60 + r() * 100, y + 104, 26, 30, 'rgba(40,40,60,.25)'); if (k < 2) { sh(g, `M${x + 20} ${y + 16} L${x + 150} ${y + 16} L${x + 150} ${y + 56} L${x + 20} ${y + 56} Z`, '#fff', 2.4, '#2a2a34'); line(g, [x + 34, y + 36, x + 130, y + 36], 3, 'rgba(40,40,60,.5)', 'round', true); }
      else txt(g, '!', x + 160, y + 60, 70, '#e8302a', '#2a2a34', 'Nunito', 900, -.2, 8); } }
  g.restore(); }
function timeline(g, a, lt) { g.save(); g.translate(0, a.y || 1000); const x0 = 200, x1 = 880, yr = y => x0 + (y - 1991) / (2026 - 1991) * (x1 - x0), k = clamp((lt - (a.t0 || 0)) / .8);
  line(g, [x0, 0, lerp(x0, x1, eio(k)), 0], 8, '#e8e0d0', 'round', true);
  (a.marks || []).forEach(([y, label, col, up, t0]) => { if (lt < t0) return; const q = eo((lt - t0) / .3), x = yr(y), dy = up ? -1 : 1;
    ell(g, x, 0, 18 * q, 18 * q, col, 4, 0, '#0a0e16'); line(g, [x, dy * 26, x, dy * 26 + dy * 70 * q], 4, col, 'round', true);
    g.save(); g.globalAlpha = q; txt(g, String(y), x, dy * 140, 66, col, '#0a0e16', 'Nunito', 900, 0, 8); const ls = label.split('\n'); ls.forEach((s, i) => txt(g, s, x, up ? -200 - (ls.length - 1 - i) * 46 : 200 + i * 46, 40, '#e8e0d0', '#0a0e16', 'Nunito', 800, 0, 6)); g.restore(); });
  g.restore(); }
function anatomy(g, a, lt) { const labs = [['SETUP', '#7ad2ff'], ['BEAT', '#ffd23a'], ['PUNCHLINE', '#ff6a8a']];
  labs.forEach(([l, col], i) => { const t0 = (a.t0 || 0) + i * (a.step || .6); if (lt < t0) return; const q = eo((lt - t0) / .3), x = 205 + i * 335, y = a.y || 900;
    g.save(); g.translate(x, y + (1 - q) * 40); g.globalAlpha = q; sh(g, 'M-150 -200 L150 -200 L150 200 L-150 200 Z', '#f2ead8', 6, '#e8e0d0');
    if (i === 0) { ell(g, -30, 60, 50, 60, 'rgba(40,40,60,.3)'); sh(g, 'M-110 -170 L110 -170 L110 -80 L-110 -80 Z', '#fff', 3, '#2a2a34'); line(g, [-90, -136, 80, -136], 4, 'rgba(40,40,60,.5)', 'round', true); line(g, [-90, -110, 40, -110], 4, 'rgba(40,40,60,.5)', 'round', true); }
    if (i === 1) { ell(g, -30, 60, 50, 60, 'rgba(40,40,60,.3)'); txt(g, '...', 0, -120, 70, '#2a2a34', null); }
    if (i === 2) { sh(g, 'M0 -170 L30 -90 L110 -110 L60 -40 L130 20 L40 20 L30 110 L-20 40 L-110 80 L-60 0 L-130 -60 L-40 -70 Z', '#ffd23a', 4, '#2a2a34'); txt(g, 'HA!', 0, -30, 70, '#e8302a', '#2a2a34', 'Nunito', 900, -.15, 8); }
    txt(g, l, 0, 260, 50, col, '#0a0e16', 'Nunito', 900, 0, 8); g.restore(); }); }
function ironyCards(g, a, lt) { [['WHAT GREG SAYS', '"I\'m the good guy."', '#7ad2ff', 0], ['WHAT THE PAGE SHOWS', '...not quite.', '#ff6a8a', a.step || 1.2]].forEach(([h, b, col, d], i) => { const t0 = (a.t0 || 0) + d; if (lt < t0) return;
  const q = eo((lt - t0) / .35), y = (a.y || 760) + i * 440; g.save(); g.translate(540 + (1 - q) * (i ? 300 : -300), y); g.globalAlpha = q;
  sh(g, 'M-420 -170 L420 -170 L420 170 L-420 170 Z', '#1a2232', 6, col); txt(g, h, 0, -100, 46, col, null, 'Nunito', 900); txt(g, b, 0, 30, 70, '#f2ead8', null, i ? 'Garamond' : 'Nunito', i ? 500 : 800); g.restore(); }); }
// cast diagrams: a hub (everything points at one name) vs a web (everyone connects to everyone)
function castMap(g, a, lt) { const k = clamp((lt - (a.t0 || 0)) / (a.d || 1.4)), cx = a.x || 540, cy = a.y || 980, nodes = a.nodes || [], links = a.links || [], col = a.col || '#ffb04a';
  const pos = nodes.map((n, i) => i === 0 && a.hub ? [cx, cy] : (() => { const m = a.hub ? nodes.length - 1 : nodes.length, j = a.hub ? i - 1 : i, an = -Math.PI / 2 + j / m * Math.PI * 2, R = a.r || 330; return [cx + Math.cos(an) * R, cy + Math.sin(an) * R * .95]; })());
  links.forEach(([i, j], li) => { const q = clamp(k * links.length - li * .6); if (q <= 0) return; const [x0, y0] = pos[i], [x1, y1] = pos[j]; line(g, [x0, y0, lerp(x0, x1, q), lerp(y0, y1, q)], 4, hexA(col, .65), 'round', true); });
  nodes.forEach((n, i) => { const q = eo(clamp(k * nodes.length * .8 - i * .5)); if (q <= 0) return; const [x, y] = pos[i], big = a.hub ? i === 0 : n === a.star;
    g.save(); g.translate(x, y); g.scale(q, q); ell(g, 0, 0, big ? 96 : 66, big ? 96 : 66, big ? col : '#1a2232', 5, 0, col); txt(g, n, 0, big ? 0 : 0, n.length > 7 ? (big ? 34 : 24) : (big ? 42 : 30), big ? '#0a0e16' : '#f2ead8', null, 'Nunito', 900); g.restore(); });
  if (a.title) txt(g, a.title, cx, cy - (a.r || 330) - 150, 56, col, '#0a0e16', 'Nunito', 900, 0, 8); }
function counter(g, a, lt) { const k = clamp((lt - (a.t0 || 0)) / (a.d || 1.6)), v = Math.round(eo(k) * (a.to || 300) );
  txt(g, `${v}${a.unit || ' MILLION+'}`, a.x || 540, a.y || 820, a.size || 120, '#f2ead8', '#0a0e16', 'Nunito', 900, 0, 12); txt(g, a.sub || 'COPIES SOLD', a.x || 540, (a.y || 820) + 110, 50, '#8a9ab8', null, 'Nunito', 800);
  if (a.stamp != null && lt > a.stamp) { const q = eo((lt - a.stamp) / .2); g.save(); g.translate(540, (a.y || 820) + 330); g.rotate(-.08); g.scale(2 - q, 2 - q); g.globalAlpha = q;
    sh(g, 'M-380 -80 L380 -80 L380 80 L-380 80 Z', null, 10, '#ff6a8a'); txt(g, a.stampText || 'REACH ≠ QUALITY', 0, 4, 66, '#ff6a8a', null, 'Nunito', 900); g.restore(); } }
function reachScale(g, a, lt, T) { const k = clamp((lt - (a.t0 || 0)) / 1.2), tilt = eio(k) * (a.tilt ?? .22), x = a.x || 540, y = a.y || 1050;
  g.save(); g.translate(x, y); sh(g, 'M-24 0 L24 0 L40 460 L-40 460 Z', '#c8a050', 5); sh(g, 'M-140 460 L140 460 L140 500 L-140 500 Z', '#8a6a30', 5);
  g.rotate(tilt); line(g, [-380, 0, 380, 0], 16, '#e0b84a', 'round', true); ell(g, 0, 0, 28, 28, '#f0d070', 5);
  [[-380, a.left || 'REACH', '#7ad2ff'], [380, a.right || 'QUALITY', '#ffd23a']].forEach(([px, l, col], i) => { g.save(); g.translate(px, 0); g.rotate(-tilt); line(g, [-100, 200, 0, 0, 100, 200], 4, '#e0b84a', 'round', true);
    sh(g, 'M-150 200 Q0 270 150 200 Z', '#e0b84a', 5); txt(g, l, 0, 290, 50, col, '#0a0e16', 'Nunito', 900, 0, 8); g.restore(); }); g.restore(); }
function bedBlanket(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  sh(g, 'M-460 0 L460 0 L460 120 L-460 120 Z', '#5a3a24', 5); sh(g, 'M-480 -60 L-420 -60 L-420 160 L-480 160 Z', '#5a3a24', 5);
  sh(g, 'M-420 -40 C-300 -330 200 -360 380 -160 C440 -100 460 -40 460 0 L-420 0 Z', lg(g, 0, -340, 0, 0, [[0, '#6a7ad8'], [1, '#3a4aa8']]), 6);
  for (let i = 0; i < 5; i++) line(g, [-300 + i * 150, -250 + Math.abs(i - 2) * 40, -260 + i * 150, -20], 3, 'rgba(255,255,255,.18)', 'round', true);
  ell(g, -330, -40, 110, 50, '#e8e0d0', 5);
  ell(g, -190, -150, 62, 66, '#b07a52', 5); [[-232, -196, 30], [-196, -214, 30], [-158, -200, 26], [-240, -160, 24]].forEach(([x, y, r]) => ell(g, x, y, r, r, '#1e140c', 4));
  ell(g, -164, -146, 12, 14, '#fff', 3); ell(g, -158, -144, 6, 7, '#1e140c'); line(g, [-176, -116, -156, -112], 4);
  sh(g, 'M-260 -130 C-200 -60 -80 -70 -40 -120 L-20 -40 L-300 -40 Z', '#4a5ac0', 5); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 60, -150, 260 + Math.sin(T * 3) * 10, 'rgba(255,230,150,1)', .55); g.restore();
  sh(g, 'M-40 -190 L120 -220 L150 -110 L-10 -80 Z', '#f2ead8', 4); line(g, [55, -205, 75, -95], 3, 'rgba(60,40,30,.4)', 'round', true); g.restore(); }
function newsStack(g, a, lt) { const k = clamp((lt - (a.t0 || 0)) / (a.d || 1.8)), n = Math.round(2 + eio(k) * (a.n || 26)); g.save(); g.translate(a.x, a.y);
  for (let i = 0; i < n; i++) { const dx = Math.sin(i * 1.7) * 14; sh(g, `M${-160 + dx} ${-i * 34} L${160 + dx} ${-i * 34} L${160 + dx} ${-i * 34 - 30} L${-160 + dx} ${-i * 34 - 30} Z`, i % 2 ? '#efe6d2' : '#e4dac4', 3, '#5a5040'); line(g, [-140 + dx, -i * 34 - 15, 140 + dx, -i * 34 - 15], 2.4, 'rgba(60,50,40,.35)', 'butt', true); }
  line(g, [-170, -n * 17, 170, -n * 17], 6, '#8a3a2a', 'butt', true); txt(g, `${Math.round(lerp(1, 35, eio(k)))} YEARS OF STRIPS`, 0, -n * 34 - 70, 46, '#f2ead8', '#1e140e', 'Nunito', 900, 0, 8); g.restore(); }
function oneBook(g, a) { g.save(); g.translate(a.x, a.y); g.rotate(a.rot || 0); g.scale(a.s || 1, a.s || 1); sh(g, 'M-90 -130 L90 -130 L90 130 L-90 130 Z', '#ffb02a', 5); sh(g, 'M-90 -130 L-70 -130 L-70 130 L-90 130 Z', '#c8781a', 3); txt(g, '1 BOOK', 10, 0, 40, '#fff', '#2a1a0a', 'Nunito', 900, -.2, 6); g.restore(); }

const _drawActorE = drawActor;
drawActor = function (g, a, c, P, o) {
  const A = avAll(a, c.lt), T = c.T, lt = c.lt;
  if (A.alpha != null && A.alpha <= 0) return;
  const M = { desk: () => desk(g, A, T), comicspage: () => comicsPage(g, A, lt), timeline: () => timeline(g, A, lt), anatomy: () => anatomy(g, A, lt), irony: () => ironyCards(g, A, lt),
    castmap: () => castMap(g, A, lt), counter: () => counter(g, A, lt), reachscale: () => reachScale(g, A, lt, T), bed: () => bedBlanket(g, A, T), newsstack: () => newsStack(g, A, lt), onebook: () => oneBook(g, A) };
  if (M[A.type]) { if (A.alpha != null) { g.save(); g.globalAlpha *= A.alpha; M[A.type](); g.restore(); } else M[A.type](); return; }
  return _drawActorE(g, a, c, P, o);
};
// things the people hold (front hand), and crumpled drafts
Object.assign(HOLD, {
  pencil: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate((o.holdRot ?? -.6) + Math.sin(t * 9) * .08); sh(g, 'M-8 30 L8 30 L8 -110 L-8 -110 Z', '#f0c040', 3); sh(g, 'M-8 30 L8 30 L0 56 Z', '#e8c8a0', 3); ell(g, 0, 52, 3, 4, '#2a2a34'); sh(g, 'M-8 -110 L8 -110 L8 -134 L-8 -134 Z', '#e88a9a', 3); g.restore(); },
  page: (g, h, o) => { g.save(); g.translate(h[0] + 40, h[1] - 140); g.rotate(o.holdRot ?? .06); sh(g, 'M-110 -150 L110 -150 L110 150 L-110 150 Z', '#fbf6ea', 5); ['#ffd8a0', '#c8e6ff', '#ffc8d8', '#d8f0c0'].forEach((c, i) => sh(g, `M${-96 + (i % 2) * 100} ${-136 + (i >> 1) * 140} l92 0 l0 128 l-92 0 Z`, c, 3)); txt(g, 'HA!', 54, 60, 44, '#e8302a', '#2a2a34', 'Nunito', 900, -.2, 6); g.restore(); },
  book: (g, h, o) => { g.save(); g.translate(h[0] + 20, h[1] - 60); g.rotate(o.holdRot ?? -.15); sh(g, 'M-80 -110 L80 -110 L80 110 L-80 110 Z', o.bookCol || '#2a6ac8', 5); sh(g, 'M-80 -110 L-62 -110 L-62 110 L-80 110 Z', mix(o.bookCol || '#2a6ac8', '#000', .3), 3); line(g, [-40, -60, 50, -60], 6, 'rgba(255,255,255,.6)', 'round', true); g.restore(); },
});
const _drawActorE2 = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'crumples') { const r = rng(A.seed || 6); for (let i = 0; i < (A.n || 6); i++) { const t0 = (A.t0 || 0) + i * (A.step || .5); if (c.lt < t0) continue; const q = eo((c.lt - t0) / .35), x = A.x + (r() - .5) * (A.w || 500), y = A.y + (r() - .5) * 40;
      g.save(); g.translate(lerp(A.x, x, q), lerp(A.y - 300, y, q) - Math.sin(q * Math.PI) * 120); g.rotate(i + q * 3); ell(g, 0, 0, 34, 30, '#f2ead8', 4, 0, '#5a5040'); line(g, [-20, -6, 4, 4, 18, -12], 2.4, 'rgba(90,80,60,.6)', 'round', true); line(g, [-10, 14, 12, 10], 2.4, 'rgba(90,80,60,.6)', 'round', true); g.restore(); } return; }
  return _drawActorE2(g, a, c, P, o); };
