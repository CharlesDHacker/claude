// Engine upgrades shared by every episode from JP06 on:
//  - scene lighting on characters: the side away from the light falls into shade, the lit edge gets a coloured rim
//  - afterimage trails for fast movers (a.trail = number of ghosts)
//  - spins around the body's centre for flips and tumbles (a.spin, radians)
//  - arrows stuck in a body (toon o.arrows = count), straw hats (o.kasa), arrow volleys (JPA.volley)
// Impact frames (shot.impacts) live in player.html.

// ---------- arrows stuck in a figure: shafts angled out of the body, fletching at the end ----------
function arrowsStuck(g, G, n, seed, kid) {
  const r = rng(seed), tw = kid ? 80 : 96, top = G.shY + 30, bot = kid ? -40 : -120;
  for (let i = 0; i < n; i++) {
    const x = (r() - .5) * tw * 1.7, y = lerp(top + 60, bot, r()), up = .15 + r() * .55, an = x < 0 ? -(Math.PI - up) : -up, len = 110 + r() * 60;
    const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len;
    tell(g, x, y, 7, 5, 'rgba(60,10,10,.7)', 0);
    tln(g, [x, y, ex, ey], 9); tln(g, [x, y, ex, ey], 4.5, '#c8a878');
    g.save(); g.translate(ex, ey); g.rotate(an);
    [-1, 1].forEach(sd => tsh(g, `M-6 0 L-34 ${sd * 3} L-40 ${sd * 15} L-14 ${sd * 11} Z`, i % 2 ? '#f4efe2' : '#2a2a30', 2.6));
    g.restore();
  }
}
// ---------- a big conical straw hat (kasa) worn low ----------
function kasaT(g, rx, ry, s = 1) { g.save(); g.scale(s, s);
  tsh(g, `M${-rx * 2.1} ${-ry * .46} Q0 ${-ry * 1.9} ${rx * 2.1} ${-ry * .46} Q0 ${-ry * .3} ${-rx * 2.1} ${-ry * .46} Z`, '#c8a060', 5);
  for (let i = -4; i <= 4; i++) tln(g, [i * rx * .18, -ry * 1.5, i * rx * .48, -ry * .5], 2, 'rgba(90,60,20,.45)');
  tln(g, [-rx * 1.7, -ry * .56, rx * 1.7, -ry * .56], 3, 'rgba(90,60,20,.5)'); g.restore(); }

// ---------- lighting: offscreen copy of the figure, shaded across, rim on the lit edge ----------
const LT1 = document.createElement('canvas'); LT1.width = W; LT1.height = H; const LTG1 = LT1.getContext('2d');
const LT2 = document.createElement('canvas'); LT2.width = W; LT2.height = H; const LTG2 = LT2.getContext('2d');
function litDraw(g, A, light, hgt, draw) {
  const M = g.getTransform(), s = A.s || 1, k = Math.hypot(M.a, M.b) * s, p = M.transformPoint(new DOMPoint(A.x, A.y));
  const x0 = Math.max(0, Math.floor(p.x - 760 * k)), x1 = Math.min(W, Math.ceil(p.x + 760 * k)), y0 = Math.max(0, Math.floor(p.y - hgt * k)), y1 = Math.min(H, Math.ceil(p.y + 160 * k));
  if (x1 <= x0 || y1 <= y0) return; const bw = x1 - x0, bh = y1 - y0;
  LTG1.setTransform(1, 0, 0, 1, 0, 0); LTG1.globalCompositeOperation = 'source-over'; LTG1.globalAlpha = 1; LTG1.filter = 'none'; LTG1.clearRect(x0, y0, bw, bh); LTG1.setTransform(M); draw(LTG1);
  LTG1.setTransform(1, 0, 0, 1, 0, 0);
  const dir = light.x ?? -1, sh = light.shade ?? .3;
  if (light.sutra) { LTG1.globalCompositeOperation = 'source-atop'; LTG1.globalAlpha = light.sutra; LTG1.fillStyle = LTG1.createPattern(sutraTile(), 'repeat'); LTG1.fillRect(x0, y0, bw, bh); LTG1.globalAlpha = 1; }
  if (sh > 0) { LTG1.globalCompositeOperation = 'source-atop'; LTG1.fillStyle = lg(LTG1, p.x + dir * 260 * k, 0, p.x - dir * 300 * k, 0, [[0, 'rgba(0,0,0,0)'], [.45, 'rgba(0,0,0,0)'], [1, light.shadeCol || `rgba(18,10,40,${sh})`]]); LTG1.fillRect(x0, y0, bw, bh); }
  // rim: silhouette minus itself shifted away from the light, tinted with the light colour
  const rim = light.rim ?? .75;
  if (rim > 0) { const d = Math.max(3, 11 * k);
    LTG2.setTransform(1, 0, 0, 1, 0, 0); LTG2.globalCompositeOperation = 'source-over'; LTG2.globalAlpha = 1; LTG2.clearRect(x0, y0, bw, bh); LTG2.drawImage(LT1, x0, y0, bw, bh, x0, y0, bw, bh);
    LTG2.globalCompositeOperation = 'source-in'; LTG2.fillStyle = light.col || 'rgba(180,200,255,1)'; LTG2.fillRect(x0, y0, bw, bh);
    LTG2.globalCompositeOperation = 'destination-out'; LTG2.drawImage(LT1, x0, y0, bw, bh, x0 - dir * d, y0 + d * (light.y ?? .6), bw, bh); LTG2.globalCompositeOperation = 'source-over'; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(LT1, x0, y0, bw, bh, x0, y0, bw, bh);
  if (rim > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha *= rim; g.drawImage(LT2, x0, y0, bw, bh, x0, y0, bw, bh); }
  g.restore();
}
// ---------- wrap the actor dispatch: trails, spins and lighting for characters ----------
const _drawActorFx = drawActor;
drawActor = function (g, a, c, P, o) {
  const ty = a.type; if (ty !== 'toon' && ty !== 'mio' && ty !== 'fox') return _drawActorFx(g, a, c, P, o);
  const A = avAll(a, c.lt); if (A.alpha != null && A.alpha <= 0) return;
  const L = ty === 'toon' ? (typeof A.c === 'string' ? TOON[A.c] : A.c) : null, s = A.s || 1, kid = ty === 'mio' || (L && L.kind === 'kid');
  const hgt = (ty === 'fox' ? 520 : kid ? 760 : 1180) * ((L && L.h) || 1) * (L && L.wingsBig ? 1.3 : 1), piv = (ty === 'fox' ? 160 : kid ? 300 : 480) * s * ((L && L.h) || 1);
  const one = (gg, cc, aa) => { gg.save(); if (A.stone) gg.filter = 'grayscale(1) sepia(.4) brightness(.82) contrast(1.1)';
    if (A.ghost) { gg.globalAlpha *= A.ghost * (.82 + .18 * Math.sin(c.T * 5.3 + (A.ph || 0))); gg.filter = 'grayscale(.55) brightness(1.45) sepia(.2) hue-rotate(165deg) saturate(1.4)'; } if (A.spin) { gg.save(); gg.translate(A.x, A.y - piv); gg.rotate(A.spin); gg.translate(-A.x, -(A.y - piv)); } _drawActorFx(gg, aa || a, cc, P, o); if (A.spin) gg.restore(); gg.filter = 'none'; gg.restore(); };
  const light = a.light === false ? null : (a.light || (o && o.light) || (o && JSETS[o.set] && JSETS[o.set].light));
  const lightV = typeof light === 'function' ? light(o) : light;
  // afterimages first (behind), tinted toward the light colour
  if (A.trail) { const n = Math.round(A.trail), dt = A.trailDt || .045;
    for (let k = n; k >= 1; k--) { const c2 = Object.assign({}, c, { lt: c.lt - k * dt, T: c.T - k * dt }), A2 = avAll(a, c2.lt);
      g.save(); g.globalAlpha *= .3 * (1 - k / (n + 1)); g.filter = 'saturate(.4) brightness(1.5)';
      if (A2.spin) { g.translate(A2.x, A2.y - piv); g.rotate(A2.spin); g.translate(-A2.x, -(A2.y - piv)); } _drawActorFx(g, a, c2, P, o); g.restore(); } }
  if (A.sutra) { litDraw(g, A, Object.assign({ x: -1, rim: 0, shade: 0 }, lightV || {}, { sutra: A.sutra }), hgt, gg => one(gg, c)); if (!A.sutraEars && L) bareEars(g, A, L); }
  else if (lightV && lightV !== 'none') litDraw(g, A, lightV, hgt, gg => one(gg, c)); else one(g, c);
  if (A.ghost && A.ghostGlow !== false) glow(g, A.x, A.y - piv, 420 * s, 'rgba(140,200,255,1)', .18 * A.ghost);
};

// ---------- arrow volley: a cloud of arrows arcing in from one side ----------
JPA.volley = (g, A, c) => { const q0 = (c.lt - (A.t0 || 0)) / (A.d || 1.2); if (q0 < 0 || q0 > 1.3) return; const r = rng(A.seed || 11), n = A.n || 40, dir = A.dir || 1;
  for (let i = 0; i < n; i++) { const q = q0 - r() * .3; if (q < 0 || q > 1) continue;
    const sx = A.x0 + (r() - .5) * (A.spread || 500), sy = A.y0 + (r() - .5) * 200, ex = A.x1 + (r() - .5) * (A.spread || 500) * .6, ey = A.y1 + (r() - .5) * 240;
    const x = lerp(sx, ex, q), y = lerp(sy, ey, q) - Math.sin(q * Math.PI) * (A.arc ?? 380), x2 = lerp(sx, ex, q + .02), y2 = lerp(sy, ey, q + .02) - Math.sin((q + .02) * Math.PI) * (A.arc ?? 380), an = Math.atan2(y2 - y, x2 - x);
    g.save(); g.translate(x, y); g.rotate(an); g.globalAlpha = .9; line(g, [-70, 0, 46, 0], 5, '#1a1410', 'round'); line(g, [-60, 0, 40, 0], 2.4, '#c8a878', 'round');
    sh(g, 'M46 -6 L64 0 L46 6 Z', '#9aa2ae'); sh(g, 'M-70 0 L-84 -10 L-60 -2 Z', '#f4efe2'); sh(g, 'M-70 0 L-84 10 L-60 2 Z', '#f4efe2');
    g.globalAlpha = .25; line(g, [-70, 0, -240 * (A.streak ?? 1), 0], 3, '#fff8e8', 'round'); g.restore(); } };

// ---------- sutra tile (Heart Sutra, brushed in rows) and the bare ears drawn back over it ----------
let _SUTRA = null;
function sutraTile() { if (_SUTRA) return _SUTRA; const c = document.createElement('canvas'); c.width = 360; c.height = 360; const x = c.getContext('2d');
  const txt = '観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減';
  x.fillStyle = '#1a1210'; x.font = "900 30px 'IPAGothic'"; x.textAlign = 'center'; x.textBaseline = 'middle'; let k = 0;
  for (let col = 0; col < 9; col++) for (let row = 0; row < 9; row++) { x.save(); x.translate(20 + col * 40, 20 + row * 40); x.rotate((((col * 7 + row * 3) % 5) - 2) * .03); x.fillText(txt[k++ % txt.length], 0, 0); x.restore(); }
  return (_SUTRA = c); }
function bareEars(g, A, L) { const s = (A.s || 1), h = L.h || 1, rx = 76 * (L.headW || 1), ry = 90, hx = A.x, hy = A.y - 772 * s * h;
  if (A.noEars) return; [-1, 1].forEach(sd => { glow(g, hx + sd * rx * .98 * s, hy + ry * .05 * s * h, 70 * s, 'rgba(255,210,170,1)', .45 * (A.earGlow ?? 1)); g.save(); g.translate(hx + sd * rx * .98 * s, hy + ry * .05 * s * h); g.scale(s * 1.25, s * h * 1.25); tell(g, 0, 0, rx * .17, ry * .22, L.skin, 5); tln(g, [0, -ry * .09, sd * rx * .06, ry * .03], 2.4, L.skinD); g.restore(); }); }
