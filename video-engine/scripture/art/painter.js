// Painter v2: illustrated environments. Faceted mountain ranges with lit/shadow faces and haze, scalloped outlined cloud banks,
// soft suns with halo rings, textured ground. Replaces hills/skyLayer/groundLayer/sun so every set upgrades.
hills = function (g, y, amp, col, seed, x0 = -900, x1 = 1980, step = 60) {
  const r = rng(seed * 7 + 3), pts = []; let x = x0;
  while (x <= x1 + 200) { const w = 120 + r() * 260, h = amp * (1.2 + r() * 2.2); pts.push([x, y - h * (0.4 + r() * .6)]); x += w * .5; pts.push([x, y - r() * amp * .5]); x += w * .5; }
  const lit = mix(col, '#fff4e0', .16), dark = mix(col, '#140a20', .22);
  // body
  g.beginPath(); g.moveTo(x0, 4000); pts.forEach(([px, py]) => g.lineTo(px, py)); g.lineTo(x1 + 200, 4000); g.closePath(); g.fillStyle = col; g.fill();
  // facets: shadow face on the right of each peak, light ridge line
  for (let i = 0; i < pts.length - 2; i += 2) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], [cx2, cy2] = pts[i + 2] || pts[i + 1];
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.lineTo(ax + (bx - ax) * .25, y + 60); g.closePath(); g.fillStyle = dark; g.globalAlpha = .55; g.fill(); g.globalAlpha = 1;
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax - (ax - (pts[i - 1] || pts[i])[0]) * .3, y + 40); g.lineWidth = 1.6; g.strokeStyle = hexA(lit, .5); g.stroke();
    if (ay < y - amp * 2.0) { const sn = (y - ay) * .16; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + sn * .9, ay + sn); g.lineTo(ax + sn * .4, ay + sn * .8); g.lineTo(ax, ay + sn * 1.2); g.lineTo(ax - sn * .4, ay + sn * .7); g.lineTo(ax - sn * .9, ay + sn * .95); g.closePath(); g.fillStyle = mix(col, '#ffffff', .6); g.fill(); } }
  g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.lineWidth = 2.2; g.strokeStyle = hexA(mix(col, '#140a20', .45), .8); g.stroke();
  // haze at the base
  g.fillStyle = lg(g, 0, y - amp * 2, 0, y + 80, [[0, 'rgba(255,255,255,0)'], [1, hexA(mix(col, '#ffffff', .35), .55)]]); g.fillRect(x0, y - amp * 2, x1 - x0 + 200, amp * 2 + 80);
};
function cloudBank(g, x0, x1, y, r0, r1, top, bot, seed, hang = false, a = 1, depth = 3000) {
  const r = rng(seed); g.save(); g.globalAlpha *= a;
  for (let row = 0; row < 3; row++) { const yy = y + (hang ? -row : row) * r0 * .55, cols = [mix(top, bot, row * .3), mix(top, bot, .4 + row * .25)];
    let x = x0 - r1; g.beginPath(); const arcs = [];
    while (x < x1 + r1) { const rr = r0 + r() * (r1 - r0); arcs.push([x + rr * .7, yy, rr]); x += rr * 1.25; }
    arcs.forEach(([cx, cy, rr]) => { g.moveTo(cx + rr, cy); g.arc(cx, cy, rr, 0, Math.PI * 2); });
    if (hang) g.rect(x0 - r1, yy - depth, x1 - x0 + r1 * 2, depth); else g.rect(x0 - r1, yy, x1 - x0 + r1 * 2, depth);
    g.fillStyle = lg(g, 0, yy - r1, 0, yy + r1, hang ? [[0, cols[1]], [1, cols[0]]] : [[0, cols[0]], [1, cols[1]]]); g.fill();
    g.lineWidth = 2.2; g.strokeStyle = hexA(mix(bot, '#140a20', .45), .55);
    arcs.forEach(([cx, cy, rr]) => { g.beginPath(); if (hang) g.arc(cx, cy, rr, .15, Math.PI - .15); else g.arc(cx, cy, rr, Math.PI + .15, -.15); g.stroke();
      g.beginPath(); if (hang) g.arc(cx, cy - rr * .15, rr * .7, .5, Math.PI - .5); else g.arc(cx, cy + rr * .15, rr * .7, Math.PI + .5, -.5); g.strokeStyle = hexA(mix(top, '#ffffff', .4), .35); g.stroke(); g.strokeStyle = hexA(mix(bot, '#140a20', .45), .55); }); }
  g.restore();
}
sun = function (g, x, y, r, col, a = 1) {
  glow(g, x, y, r * 6, col, .5 * a); glow(g, x, y, r * 2.2, col, .6 * a);
  g.save(); g.globalAlpha = a; ell(g, x, y, r, r, rg(g, x - r * .3, y - r * .3, r * .1, r, [[0, '#fffdf4'], [1, hexA(col.startsWith('#') ? col : '#ffe2a0', .95)]]));
  for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(x, y, r * (1 + i * .35), 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = `rgba(255,245,220,${(.22 / i).toFixed(2)})`; g.stroke(); }
  g.restore();
};
skyLayer = function (g, c, P, o) {
  const hz = o.horizon ?? 1250, T = c.T;
  par(g, c, .05, () => { g.fillStyle = lg(g, 0, -600, 0, hz + 40, [[0, P.s[0]], [.62, P.s[1]], [1, P.s[2]]]); g.fillRect(-1600, -1600, 4300, hz + 1700);
    // soft painterly bands
    const r = rng(3); for (let i = 0; i < 6; i++) { const yy = -300 + i * (hz + 300) / 6; g.fillStyle = hexA(i % 2 ? P.s[2] : P.s[0], .06); g.fillRect(-1600, yy + r() * 60, 4300, 80 + r() * 90); }
    if (P.moon || o.stars) { const r2 = rng(77); for (let i = 0; i < 220; i++) { const x = -800 + r2() * 2700, y = -600 + r2() * (hz + 200), s = .8 + r2() * 2.4, tw = .4 + .6 * Math.sin(T * (1 + r2() * 2) + i); ell(g, x, y, s, s, `rgba(255,250,235,${(tw * .85).toFixed(2)})`); if (r2() > .965) { g.save(); g.globalAlpha = tw; line(g, [x - 14, y, x + 14, y], 2, '#fffbe8', 'round', true); line(g, [x, y - 14, x, y + 14], 2, '#fffbe8', 'round', true); g.restore(); } } } });
  par(g, c, .1, () => { const sx = o.sunX ?? 540, sy = o.sunY ?? hz - 180, sr = o.sunR ?? 210;
    if (P.sun && o.sun !== false) { if (P.moon) { glow(g, sx, sy, sr * 4, 'rgba(220,230,255,1)', .35); ell(g, sx, sy, sr, sr, rg(g, sx - sr * .3, sy - sr * .3, 4, sr, [[0, '#fbf8ec'], [1, '#d8d8cc']])); ell(g, sx - sr * .3, sy - sr * .2, sr * .18, sr * .16, 'rgba(160,160,150,.35)'); ell(g, sx + sr * .25, sy + sr * .3, sr * .12, sr * .1, 'rgba(160,160,150,.35)'); }
      else sun(g, sx, sy, sr, P.sun); }
    if (o.rays) rays(g, sx, sy, 2200, 26, 'rgba(255,230,170,.5)', o.rays, T); });
  // canopy of scalloped cloud hanging from the top, slowly drifting
  if (o.clouds !== false) par(g, c, .15, () => { const d = T * 6; cloudBank(g, -900 + d % 200, 2000, (o.canopyY ?? 120), 80, 170, mix(P.s[0], '#ffffff', .22), mix(P.s[1], P.s[0], .35), 8, true, o.canopy ?? 1);
    const r = rng(5); for (let i = 0; i < 5; i++) { const x = ((r() * 2600 + T * (8 + r() * 10)) % 2600) - 800, y = 150 + r() * (hz - 600); cloudBank(g, x, x + 260 + r() * 260, y, 26, 46, mix(P.s[2], '#ffffff', .25), mix(P.s[1], P.s[2], .5), 20 + i, false, .55, 40); } });
  if (o.lightning) { const f = (T * 1.7) % 4.3; if (f < .12 || (f > .25 && f < .32)) { g.save(); g.globalAlpha = .55; g.fillStyle = '#e8e0ff'; g.fillRect(-1600, -1600, 4300, 4300); g.restore(); } }
  par(g, c, .25, () => hills(g, hz - 90, 70, P.m1, 3, -1600, 2700, 50));
  par(g, c, .45, () => { hills(g, hz - 20, 42, P.m2, 4, -1600, 2700, 50); if (o.lowClouds !== false) cloudBank(g, -1600, 2700, hz + 6, 34, 64, mix(P.m2, '#ffffff', .35), mix(P.m2, P.s[2], .4), 41, false, .45); });
};
groundLayer = function (g, c, P, o) {
  const hz = o.horizon ?? 1250;
  g.fillStyle = lg(g, 0, hz, 0, 2400, [[0, mix(P.ground[0], P.s[2], .25)], [.25, P.ground[0]], [1, P.ground[1]]]); g.beginPath(); g.moveTo(-1600, 2800); for (let x = -1600; x <= 2700; x += 60) g.lineTo(x, hz + 10 + Math.sin(x * .003 + 1) * 18); g.lineTo(2700, 2800); g.closePath(); g.fill();
  g.beginPath(); for (let x = -1600; x <= 2700; x += 60) x === -1600 ? g.moveTo(x, hz + 10 + Math.sin(x * .003 + 1) * 18) : g.lineTo(x, hz + 10 + Math.sin(x * .003 + 1) * 18); g.lineWidth = 2.2; g.strokeStyle = hexA(mix(P.ground[1], '#140a20', .4), .6); g.stroke();
  const r = rng(91), ink = hexA(mix(P.ground[1], '#140a20', .5), .55), hi = hexA(mix(P.ground[0], '#ffffff', .3), .5);
  for (let i = 0; i < 70; i++) { const y = hz + 40 + Math.pow(r(), 1.6) * 900, s = .4 + (y - hz) / 700, x = -800 + r() * 2700;
    if (r() > .5) { ell(g, x, y, 10 * s, 6 * s, mix(P.ground[0], '#fff', .12), 0); g.beginPath(); g.ellipse(x, y, 10 * s, 6 * s, 0, Math.PI * 1.1, Math.PI * 1.9, true); g.lineWidth = 1.6; g.strokeStyle = ink; g.stroke(); }
    else { for (let k = -1; k <= 1; k++) line(g, [x + k * 5 * s, y, x + k * 9 * s, y - (14 - Math.abs(k) * 4) * s], 1.6, ink, 'round', true); } }
  for (let i = 0; i < 26; i++) { const y = hz + 80 + r() * 800, x = -800 + r() * 2700, w = 40 + r() * 120; line(g, [x, y, x + w * .5, y - 4, x + w, y], 1.6, ink, 'round', true); line(g, [x + 6, y + 4, x + w * .5, y, x + w - 6, y + 4], 1.2, hi, 'round', true); }
};

Object.assign(SKY.sunset, { s: ['#3a2a5e', '#d8784a', '#ffd08e'], m1: '#8a5a72', m2: '#6a4258', ground: ['#b88e64', '#6a4a3a'] });
Object.assign(SKY.blood, { s: ['#2a0e22', '#a8342e', '#ff9050'], m1: '#702430', m2: '#501a26', ground: ['#9a5a44', '#3e1c1c'] });
Object.assign(SKY.gold, { ground: ['#d0a46a', '#8a6038'] });
Object.assign(SKY.day, { s: ['#5a8ac0', '#b8d4e6', '#fbe8c4'], m1: '#8aa2bc', m2: '#a08a7a' });
Object.assign(SKY.night, { s: ['#0c1430', '#22305e', '#4e4c80'], m1: '#2e3866', m2: '#20284e', ground: ['#3a3a5e', '#16162a'] });
Object.assign(SKY.storm, { s: ['#1c1a30', '#4e4264', '#8e7290'], m1: '#3e3656', m2: '#2c2644', ground: ['#4a3e50', '#1a1620'] });
