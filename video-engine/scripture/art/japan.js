// Japanese mythology series: hosts Mio (a girl in a yukata) and Kon (a fox spirit with a shrine bib), ancient Japanese
// looks (kinu tunic, hakama tied below the knee, mizura hair, magatama beads), the eight-headed serpent Orochi, sake vats,
// the fence of eight gates, the comb, the swords, and the sets: shrine at dusk, Takamagahara, Izumo river, the old couple's
// house, the trap at night.
// ---------------- Mio ----------------
function mio(g, o) {
  const t = o.t || 0, ex = o.expr || 'neutral', talk = o.talk || 0, ph = o.ph || 0, glT = Math.floor(t * .55 + ph * 3.1), glance = ((((glT * 9301 + 49297) % 233280) / 233280) - .5) * 2, [lx0, ly0] = o.look || [0, 0], lx = clamp(lx0 + glance * .35, -1, 1), ly = ly0 + Math.sin(t * .4 + ph) * .1;
  const skin = '#ecb990', skinD = '#c88e66', skinL = '#f8d2b0', hair = '#16121c', yk = '#2f3f7c', ykD = '#1f2a58', obi = '#e8708e';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = 1 + .012 * Math.sin(t * 2.2 + ph), hop = o.hop ? -Math.abs(Math.sin(t * 9)) * 18 * o.hop : 0, shake = o.shake ? Math.sin(t * 40) * 6 * o.shake : 0;
  g.translate(shake, hop);
  g.fillStyle = rg(g, 0, 0, 10, 130, [[0, 'rgba(30,15,20,.32)'], [1, 'rgba(30,15,20,0)']]); g.beginPath(); g.ellipse(0, 4, 130, 18, 0, 0, 7); g.fill();
  // geta sandals with red straps, white tabi
  [[-30, -1], [30, 1]].forEach(([x, sd]) => { sh(g, `M${x - 30} 0 L${x + 30} 0 L${x + 30} 10 L${x - 30} 10 Z`, '#b88a5a', 3); sh(g, `M${x - 22} 10 l8 0 l0 10 l-8 0 Z M${x + 14} 10 l8 0 l0 10 l-8 0 Z`, '#8a6040', 2);
    sh(g, `M${x - 24} -2 Q${x - 26} -30 ${x} -34 Q${x + 26} -30 ${x + 24} -2 Z`, '#f6f2ea', 3.2); line(g, [x - 18, -8, x, -26, x + 18, -8], 5, '#d23a3a', 'round', true); });
  g.save(); g.scale(1, br); g.translate(0, (1 - br) * 100);
  const H = { down: [[-88, -170], [88, -170]], up: [[-140, -440], [140, -440]], mouth: [[-50, -336], [50, -336]], hips: [[-102, -200], [102, -200]], ears: [[-118, -396], [118, -396]],
    point: [[-88, -170], [196, -330]], shrug: [[-150, -250], [150, -250]], chin: [[-88, -170], [30, -320]], hug: [[-44, -236], [44, -236]], cheeks: [[-92, -360], [92, -360]], fists: [[-62, -250], [62, -250]] };
  let [hl, hr] = o.hands ? (H[o.hands] || o.hands) : H.down;
  const sw = Math.sin(t * 1.7 + ph) * 5;
  // kimono sleeve: a wide panel that hangs from the upper arm whatever the arm does
  const arm = (sx, h, s) => { const hx = h[0] + sw * s, ex2 = (sx + hx) / 2 + s * 20, ey2 = (-262 + h[1]) / 2 + 18;
    const ang = Math.atan2(ey2 + 262, ex2 - sx), cx = (sx + ex2) / 2, cy = (-262 + ey2) / 2, L = Math.hypot(ex2 - sx, ey2 + 262) + 40;
    g.save(); g.translate(cx, cy); g.rotate(ang - Math.PI / 2); const sl = `M-36 ${-L / 2} L36 ${-L / 2} L40 ${L / 2 - 6} Q40 ${L / 2 + 40} ${s * 6} ${L / 2 + 44} L-40 ${L / 2 + 40} Q-44 ${L / 2} -36 ${-L / 2} Z`;
    sh(g, sl, s < 0 ? ykD : yk, 4); g.save(); g.clip(path(sl)); for (let k = 0; k < 7; k++) { const px = -24 + (k % 3) * 24, py = -L / 2 + 20 + k * 22; sakura(g, px, py, 5, 'rgba(255,240,245,.8)'); } g.restore(); g.restore();
    const fx = ex2 + (hx - ex2) * .25, fy = ey2 + (h[1] - ey2) * .25; taper(g, fx, fy, hx, h[1], 21, 17, s < 0 ? skinD : skin); hand(g, hx, h[1], Math.atan2(h[1] - ey2, hx - ex2), 1.2, s < 0 ? skinD : skin, ['up', 'shrug', 'point', 'ears', 'cheeks'].includes(o.hands) ? 1 : 0); };
  arm(-56, hl, -1);
  // yukata body: crossed collar (left over right), indigo with petals, pink obi with a cord
  const body = 'M-60 -284 C-84 -230 -92 -140 -96 -30 Q0 -14 96 -30 C92 -140 84 -230 60 -284 Q0 -296 -60 -284 Z';
  sh(g, body, lg(g, -90, 0, 90, 0, [[0, ykD], [.45, yk], [.8, mix(yk, '#fff', .12)], [1, ykD]]), 4.5);
  g.save(); g.clip(path(body)); const r = rng(4); for (let k = 0; k < 22; k++) sakura(g, -90 + r() * 180, -270 + r() * 240, 5 + r() * 3, 'rgba(255,236,242,.85)');
  for (let i = -3; i <= 3; i++) line(g, [i * 20, -150, i * 24 + sw * .3, -36], 1.6, 'rgba(10,10,40,.3)', 'round', true); g.restore(); sh(g, body, null, 4.5);
  sh(g, 'M-34 -288 L8 -200 L22 -214 L-12 -290 Z', '#f6f0e4', 2.6); sh(g, 'M34 -288 L-4 -206 L-20 -218 L12 -290 Z', '#f6f0e4', 2.6); line(g, [30, -286, -6, -204, -96, -60], 3, ykD, 'round', true);
  sh(g, 'M-90 -196 Q0 -184 90 -196 L92 -140 Q0 -128 -92 -140 Z', lg(g, 0, -196, 0, -140, [[0, mix(obi, '#fff', .2)], [1, obi]]), 4); line(g, [-92, -168, 0, -158, 92, -168], 5, '#f6d070', 'round', true); ell(g, 0, -160, 8, 8, '#f6d070', 2.4);
  arm(56, hr, 1);
  g.restore();
  // head
  const nodT = talk * (.06 * Math.sin(t * 8.6 + ph) + .02) + .025 * Math.sin(t * .7 + ph * 2.3);
  g.save(); g.translate(0, -400 + (1 - br) * 300 - talk * 6); g.rotate((o.tilt || 0) + nodT);
  taper(g, 0, 90, 0, 124, 42, 44, skinD);
  // back hair (bob), two buns with red ribbons and a flower pin
  sh(g, 'M-124 40 C-138 -60 -90 -130 0 -132 C90 -130 138 -60 124 40 C120 80 104 104 90 110 L-90 110 C-104 104 -120 80 -124 40 Z', hair, 5);
  [[-86, -112], [86, -112]].forEach(([x, y], i) => { ell(g, x, y, 40, 38, hair, 4.5); line(g, [x - 24, y - 12, x, y - 26, x + 22, y - 12], 2, 'rgba(200,210,255,.22)', 'round', true);
    sh(g, `M${x - 6} ${y + 26} L${x - 34} ${y + 50} L${x - 22} ${y + 30} Z M${x + 6} ${y + 26} L${x + 34} ${y + 50} L${x + 22} ${y + 30} Z`, '#d23a3a', 2.6); ell(g, x, y + 28, 9, 7, '#d23a3a', 2.6); });
  sakura(g, 104, -76, 15, '#f6a8c0', true);
  ell(g, -114, 10, 20, 25, skin, 4); ell(g, 114, 10, 20, 25, skinD, 4);
  ell(g, 0, 0, 112, 110, rg(g, -30, -40, 20, 150, [[0, skinL], [.55, skin], [1, skinD]]), 5);
  // straight-cut fringe with a few separations
  sh(g, 'M-112 -10 C-116 -80 -60 -112 0 -112 C60 -112 116 -80 112 -10 L96 -18 L84 -44 L60 -40 L48 -58 L20 -46 L0 -60 L-22 -46 L-48 -58 L-62 -40 L-86 -44 L-96 -18 Z', hair, 4.5);
  line(g, [-60, -96, -30, -104, 0, -106], 3, 'rgba(200,210,255,.25)', 'round', true);
  ell(g, -70, 50, 22, 13, 'rgba(240,110,120,.35)'); ell(g, 70, 50, 22, 13, 'rgba(240,110,120,.35)');
  // eyes: big, dark brown, with upper lash flicks
  const blink = ((t * .63 + ph) % 3.7) < .1 && ex !== 'happy';
  [-42, 42].forEach(cx => { const sd = Math.sign(cx);
    if (blink || ex === 'happy') { line(g, [cx - 24, 2, cx, ex === 'happy' ? -14 : 4, cx + 24, 2], 5); return; }
    const ry = ex === 'shock' || ex === 'wide' ? 38 : 34; ell(g, cx, 4, 28, ry, lg(g, 0, -ry, 0, ry, [[0, '#ffffff'], [1, '#ece2d4']]), 4);
    const ir = ex === 'shock' ? 10 : 17, ix = cx + lx * 10, iy = 7 + ly * 10;
    ell(g, ix, iy, ir, ir * 1.1, rg(g, ix, iy, 2, ir, [[0, '#7a4a2a'], [.7, '#3a2014'], [1, '#160c08']])); ell(g, ix, iy, ir * .5, ir * .55, '#100806'); ell(g, ix + 5, iy - 7, 5, 5, '#fff'); ell(g, ix - 4, iy + 6, 2.2, 2.2, 'rgba(255,255,255,.7)');
    g.beginPath(); g.ellipse(cx, 4, 28, ry, 0, Math.PI * 1.02, Math.PI * 1.98); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
    line(g, [cx + sd * 24, -14, cx + sd * 36, -24], 4, INK, 'round', true); line(g, [cx + sd * 18, -22, cx + sd * 26, -34], 3.4, INK, 'round', true);
    if (ex === 'annoyed') { sh(g, `M${cx - 31} -38 L${cx + 31} -38 L${cx + 31} 4 Q${cx} -2 ${cx - 31} 4 Z`, skin); line(g, [cx - 30, 4, cx, -1, cx + 30, 4], 4); } });
  const B = { neutral: [-58, -62, -24, -66], shout: [-62, -70, -22, -54], worry: [-62, -58, -24, -74], shock: [-60, -78, -24, -82], sad: [-60, -58, -22, -72], happy: [-60, -66, -24, -70], annoyed: [-60, -54, -24, -56], wide: [-60, -76, -24, -80], scared: [-62, -60, -22, -78] }[ex] || [-58, -62, -24, -66];
  [[1], [-1]].forEach(([sx]) => line(g, [sx * B[0], B[1], sx * (B[0] + B[2]) / 2, Math.min(B[1], B[3]) - 6, sx * B[2], B[3]], 4.4, hair, 'round', true));
  sh(g, 'M-6 26 Q0 34 7 27', null, 3.2);
  const my = 64;
  if (talk > .04 || ex === 'shout' || ex === 'scared') { const op = Math.max(talk, ex === 'shout' || ex === 'scared' ? .7 : 0), w = ex === 'shout' || ex === 'scared' ? 28 : 20;
    sh(g, `M${-w} ${my - 4} Q0 ${my - 10} ${w} ${my - 4} Q${w * .9} ${my + 8 + op * 38} 0 ${my + 10 + op * 42} Q${-w * .9} ${my + 8 + op * 38} ${-w} ${my - 4} Z`, '#4a1418', 4);
    sh(g, `M${-w * .7} ${my - 3} Q0 ${my - 7} ${w * .7} ${my - 3} L${w * .6} ${my + 3} Q0 ${my} ${-w * .6} ${my + 3} Z`, '#fbf6ee'); ell(g, 0, my + 6 + op * 30, w * .5, 6 + op * 7, '#e06a74'); }
  else if (ex === 'shock' || ex === 'wide') ell(g, 0, my + 8, 12, 16, '#4a1418', 4);
  else if (ex === 'sad' || ex === 'worry') line(g, [-20, my + 10, 0, my - 2, 20, my + 10], 5);
  else if (ex === 'happy' || ex === 'smile') { sh(g, `M-30 ${my - 6} Q0 ${my + 40} 30 ${my - 6} Q0 ${my + 4} -30 ${my - 6} Z`, '#4a1418', 4); ell(g, 0, my + 18, 11, 6, '#e06a74'); }
  else if (ex === 'annoyed') line(g, [-16, my + 4, 16, my + 4], 5);
  else line(g, [-22, my, 0, my + 12, 22, my], 5);
  if (o.sweat) { const k = (t * .7) % 1; sh(g, `M96 ${-70 + k * 40} q10 16 0 24 q-10 -8 0 -24 Z`, 'rgba(170,215,240,.9)', 2.2); }
  g.restore();
  g.restore();
}
function sakura(g, x, y, r, col, ink) { g.save(); g.translate(x, y); for (let i = 0; i < 5; i++) { g.rotate(Math.PI * 2 / 5); ell(g, 0, -r * .9, r * .55, r * .8, col, ink ? 2.4 : 0); } ell(g, 0, 0, r * .3, r * .3, ink ? '#f6d070' : 'rgba(255,220,120,.9)', ink ? 1.6 : 0); g.restore(); }
// ---------------- Kon ----------------
function fox(g, o) {
  const t = o.t || 0, ex = o.expr || 'calm', talk = o.talk || 0, ph = o.ph || 0, br = Math.sin(t * 1.9 + ph);
  const fur = '#e8843c', furD = '#c0602a', furL = '#f6a868', wh = '#fbf3e6', sock = '#3a2a2e';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  g.fillStyle = rg(g, 0, 0, 10, 240, [[0, 'rgba(30,15,20,.3)'], [1, 'rgba(30,15,20,0)']]); g.beginPath(); g.ellipse(-10, 4, 240, 24, 0, 0, 7); g.fill();
  // tail: a big brush curling up behind, white tip
  const tw = Math.sin(t * 1.6 + ph) * .08;
  g.save(); g.translate(-120, -40); g.rotate(-.2 + tw);
  const tail = 'M0 0 C-120 20 -230 -40 -240 -170 C-246 -260 -190 -330 -120 -320 C-160 -260 -170 -180 -120 -110 C-80 -60 -20 -50 20 -40 Z';
  sh(g, tail, lg(g, -240, -320, 0, 0, [[0, wh], [.22, wh], [.26, furL], [.7, fur], [1, furD]]), 5);
  for (let i = 0; i < 6; i++) line(g, [-40 - i * 30, -30 - i * 10, -90 - i * 26, -90 - i * 26], 2, 'rgba(120,50,20,.35)', 'round', true); g.restore();
  // haunch + body
  taper(g, 90, -300, 132, -430, 120, 100, fur);  // neck
  sh(g, 'M-170 -10 C-200 -120 -150 -240 -40 -270 C30 -290 80 -330 110 -360 L176 -320 C186 -240 160 -120 136 -10 Z', lg(g, -180, 0, 170, 0, [[0, furD], [.5, fur], [1, furL]]), 5);
  sh(g, 'M118 -350 C176 -310 180 -170 140 -50 L96 -50 C116 -150 110 -260 80 -320 Z', wh, 3);  // white chest
  for (let i = 0; i < 5; i++) line(g, [-140 + i * 30, -120 - i * 20, -110 + i * 34, -60 - i * 16], 2, 'rgba(120,50,20,.3)', 'round', true);
  ell(g, -60, -40, 90, 46, furD, 4); sh(g, 'M-20 -14 L60 -14 L64 4 L-24 4 Z', sock, 3); // hind paw
  // front legs with dark socks
  [[78, furD], [124, fur]].forEach(([x, col]) => { taper(g, x, -230, x + 2, -60, 50, 40, col); taper(g, x + 2, -96, x + 4, -14, 38, 34, sock, true); sh(g, `M${x - 18} -18 L${x + 30} -18 Q${x + 38} 4 ${x + 24} 4 L${x - 20} 4 Z`, sock, 3); });
  // red shrine bib with a little bell
  sh(g, 'M70 -400 Q130 -372 196 -384 L166 -296 Q122 -306 88 -330 Z', lg(g, 0, -390, 0, -290, [[0, '#e8443a'], [1, '#b8282a']]), 4); ell(g, 158, -306, 13, 13, '#f6d070', 3); line(g, [152, -304, 164, -304], 2, INK, 'round', true);
  // head
  const nod = talk * (.06 * Math.sin(t * 8.4 + ph) + .03) + .03 * Math.sin(t * .8 + ph), gl = Math.floor(t * .5 + ph * 2.7), glance = (((gl * 9301 + 49297) % 233280) / 233280 - .5) * 2;
  g.save(); g.translate(150, -470 + br * 3); g.scale(1.12, 1.12); g.rotate((o.headRot || 0) - nod * .7 + (ex === 'smug' ? -.06 : 0));
  const earF = Math.max(0, Math.sin(t * 3.1 + ph * 5)) > .985 ? .25 : 0;
  sh(g, 'M-70 -40 L-96 -190 L-10 -90 Z', furD, 4.5); sh(g, 'M-80 -80 L-90 -160 L-38 -96 Z', '#3a2228', 0);
  g.save(); g.translate(-10, -60); g.rotate(-earF); sh(g, 'M-30 20 L-14 -140 L52 -10 Z', fur, 4.5); sh(g, 'M-16 6 L-10 -96 L30 -14 Z', '#f6d8c8', 0); g.restore();
  // skull + snout (long, pointed), cheek ruff
  sh(g, 'M-90 -10 C-96 -70 -50 -100 0 -96 C40 -92 70 -70 100 -48 L170 -24 Q186 -14 176 -2 C150 14 110 22 70 26 C30 50 -40 60 -70 40 C-96 26 -92 10 -90 -10 Z', lg(g, 0, -100, 0, 60, [[0, furL], [.6, fur], [1, furD]]), 5);
  sh(g, 'M-80 10 C-60 40 -20 70 40 50 C80 40 110 30 140 14 L60 22 C20 30 -30 30 -60 6 Z', wh, 0);
  sh(g, 'M-96 0 L-120 30 L-86 26 L-100 56 L-62 40 L-58 62 L-30 44 Z', wh, 3.4);
  ell(g, 172, -16, 12, 10, '#1a1214', 2); ell(g, 168, -20, 3.5, 2.5, 'rgba(255,255,255,.6)');
  // mouth: the lower jaw drops with speech
  const op = Math.max(talk, ex === 'wide' ? .35 : 0);
  if (op > .05) { sh(g, `M70 24 Q120 ${18 + op * 6} 160 4 Q130 ${30 + op * 36} 80 ${34 + op * 30} Z`, '#4a1418', 3.2); sh(g, `M88 ${30 + op * 22} Q120 ${30 + op * 26} 140 ${20 + op * 20}`, null, 6, '#e06a74'); }
  else line(g, ex === 'smile' || ex === 'smug' ? [76, 22, 110, 26, 150, 8] : [80, 24, 120, 22, 158, 6], 3.4);
  // eye: almond, amber iris, slanted lid
  const blink = ((t * .6 + ph) % 4.3) < .1;
  if (blink || ex === 'smile') line(g, [22, -40, 44, ex === 'smile' ? -52 : -40, 66, -44], 4.4);
  else { const lid = ex === 'smug' ? .5 : 0; sh(g, 'M18 -40 Q42 -66 70 -46 Q46 -28 18 -40 Z', '#fffaf0', 3.4); const ix = 46 + glance * 3 + (o.look ? o.look[0] * 4 : 0), iy = -45 + (o.look ? o.look[1] * 3 : 0);
    ell(g, ix, iy, 9, ex === 'wide' ? 12 : 10, rg(g, ix, iy, 1, 10, [[0, '#f6c040'], [1, '#a8601a']])); ell(g, ix, iy, 3, 8, '#140c08'); ell(g, ix + 3, iy - 4, 2.4, 2.4, '#fff');
    if (lid) sh(g, 'M16 -40 Q42 -64 72 -46 L70 -40 Q44 -52 18 -36 Z', fur, 0); line(g, [16, -40, 44, -62, 74, -46], 4, INK, 'round', true); line(g, [70, -48, 84, -56], 3.4, INK, 'round', true); }
  // brows (fur tufts) + red markings like a shrine fox
  const bl = ex === 'serious' ? 6 : ex === 'wide' ? -8 : 0; line(g, [20, -70 + bl, 46, -78 + bl * .4, 70, -66 - bl * .5], 4, furD, 'round', true);
  line(g, [26, -84, 40, -100], 5, '#d8302a', 'round', true); line(g, [42, -84, 54, -98], 5, '#d8302a', 'round', true);
  g.restore();
  g.restore();
}
var JPA = {};
// ---------------- dispatch ----------------
const _drawActorJp = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt);
  if (A.type === 'mio' || A.type === 'fox') { if (A.alpha != null && A.alpha <= 0) return; g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha;
    if (A.type === 'mio') toon(g, Object.assign({}, A, { c: 'mio', t: c.T + (A.ph || 0), talk: c.V('mio') })); else kitsune(g, Object.assign({}, A, { t: c.T + (A.ph || 0), talk: c.V('kon') })); g.restore(); return; }
  if (A.type === 'toon') { if (A.alpha != null && A.alpha <= 0) return; g.save(); if (A.alpha != null) g.globalAlpha *= A.alpha;
    let walk = A.walk; if (walk && a.x && typeof a.x === 'object' && a.x.t1 != null) walk = c.lt >= (a.x.t0 || 0) && c.lt <= a.x.t1 + .05 ? walk : 0;   // walkers stop when they arrive
    if (A.sil) g.filter = `brightness(${A.sil === true ? 0.04 : A.sil})`; toon(g, Object.assign({}, A, { walk, t: c.T + (A.ph || 0), talk: A.who ? c.V(A.who) : 0 })); g.filter = 'none'; g.restore(); return; }
  if (JPA[A.type]) return JPA[A.type](g, A, c);
  return _drawActorJp(g, a, c, P, o); };

// ---------------- people of the age of the gods ----------------
Object.assign(WAR, {
  susanoo:  { skin: '#d49a6a', tunic: '#efe9dc', kilt: '#efe9dc', hakama: '#3e4e74', knot: '#c8302a', cape: null, beard: 'short', beardCol: '#141018', hair: '#141018', hairStyle: 'wild', headband: '#c8302a', magatama: '#c8302a', nose: 'straight', jaw: 'square', brow: 2.0, helmet: null, bulk: 1.16, tall: 1.05, head: 1.0, weapon: null, shield: null, boots: '#5a3a22', long: 0, trim: '#3e4e74' },
  elder:    { skin: '#c89068', tunic: '#d8ccb0', kilt: '#d8ccb0', hakama: '#7a6a4a', knot: '#5a4a3a', cape: null, beard: 'long', beardCol: '#ece8e0', hair: '#ece8e0', hairStyle: 'mizura', nose: 'hook', jaw: 'round', brow: 1.2, helmet: null, bulk: .92, tall: .93, head: 1.0, weapon: null, shield: null, boots: '#5a4a3a', long: 0, trim: '#9a8a6a', magatama: '#5a8a6a' },
  elderW:   { female: 1, skin: '#c89068', tunic: '#cdbda0', kilt: '#8a6a4a', beard: null, hair: '#e0dcd4', hairStyle: 'long', nose: 'button', jaw: 'round', helmet: null, bulk: .86, tall: .88, head: 1.02, weapon: null, shield: null, boots: '#5a4a3a', long: 1, trim: '#9a8a6a', lips: '#a86a60' },
  kushinada:{ female: 1, skin: '#e2b48c', tunic: '#f6f1e6', kilt: '#c8343a', beard: null, hair: '#141018', hairStyle: 'long', band: '#c8343a', nose: 'button', jaw: 'round', helmet: null, bulk: .8, tall: .95, head: 1.04, weapon: null, shield: null, boots: '#7a2a2a', long: 1, trim: '#e8b84a', lips: '#c04a5a', magatama: '#3aa08a' },
  amaterasu:{ female: 1, skin: '#ecc29a', tunic: '#fff6dc', kilt: '#e8b84a', cape: '#f4d27a', beard: null, hair: '#141018', hairStyle: 'long', nose: 'button', jaw: 'round', helmet: null, bulk: .84, tall: 1.02, head: 1.04, weapon: null, shield: null, boots: '#c8962a', long: 1, trim: '#e8b84a', lips: '#c04a5a', magatama: '#e8b84a' },
  kami1:    { skin: '#d8a478', tunic: '#f2ecde', kilt: '#f2ecde', hakama: '#6a4a7a', knot: '#e8b84a', beard: 'short', beardCol: '#2a1e18', hair: '#2a1e18', hairStyle: 'mizura', nose: 'straight', jaw: 'round', helmet: null, bulk: 1.0, head: 1, weapon: null, shield: null, boots: '#5a3a22', long: 0, trim: '#e8b84a', magatama: '#3aa08a' },
  kami2:    { skin: '#c8946a', tunic: '#e8e2d4', kilt: '#e8e2d4', hakama: '#7a3a3a', knot: '#e8b84a', beard: 'stubble', beardCol: '#2a1e18', hair: '#2a1e18', hairStyle: 'mizura', nose: 'broad', jaw: 'square', helmet: null, bulk: 1.08, head: 1, weapon: null, shield: null, boots: '#5a3a22', long: 0, trim: '#e8b84a' },
});
Object.assign(HOLD, {
  tsurugi: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.25);
    sh(g, 'M-7 30 L7 30 L8 -10 L-8 -10 Z', '#4a2e1a', 2.6); ell(g, 0, 40, 12, 12, null, 4, 0, '#c8a040'); sh(g, 'M-26 -10 L26 -10 L22 -22 L-22 -22 Z', '#c8a040', 2.6);
    sh(g, 'M-10 -22 L10 -22 L8 -330 L0 -356 L-8 -330 Z', lg(g, -10, 0, 10, 0, [[0, '#8a96a4'], [.5, '#f4f8ff'], [1, '#7a8696']]), 2.6); line(g, [0, -26, 0, -340], 1.4, 'rgba(60,70,90,.5)', 'round', true);
    if (o.chip) sh(g, 'M8 -240 L-2 -232 L8 -222 Z', '#2a2a34'); if (o.glint) glow(g, 0, -300, 160, 'rgba(220,240,255,1)', o.glint); g.restore(); },
  kusanagi: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.25); glow(g, 0, -180, 360, 'rgba(255,220,140,1)', .7);
    sh(g, 'M-8 30 L8 30 L9 -10 L-9 -10 Z', '#2a2a3a', 2.6); sh(g, 'M-30 -10 L30 -10 L24 -26 L-24 -26 Z', '#e8c050', 2.6);
    sh(g, 'M-12 -26 L12 -26 L10 -360 L0 -392 L-10 -360 Z', lg(g, -12, 0, 12, 0, [[0, '#c8b070'], [.5, '#fffbe8'], [1, '#c0a060']]), 2.6); g.restore(); },
});
// a comb worn in the hair (Kushinada, transformed): drawn on the head transform after the figure
(function () { const base = warrior; warrior = function (g, o) { base(g, o); if (!o.comb) return;
  g.save(); g.setTransform(FIG_HEAD); g.translate(-30, -78); g.rotate(-.35); combShape(g, 1.05, o.comb); g.restore(); }; })();
function combShape(g, s, glowA) { g.save(); g.scale(s, s); if (glowA && glowA !== true) glow(g, 0, 0, 140, 'rgba(255,200,200,1)', glowA * .6);
  sh(g, 'M-46 6 C-46 -26 46 -26 46 6 Z', lg(g, 0, -26, 0, 6, [[0, '#e8484a'], [1, '#a8242a']]), 3); for (let i = -40; i <= 40; i += 8) line(g, [i, 4, i, 26], 3.4, '#a8242a', 'round', true);
  line(g, [-44, 6, 44, 6], 3, '#f6d070', 'round', true); sakura(g, 0, -8, 7, '#fbe4ec', true); g.restore(); }
// ---------------- Orochi ----------------
function bez(p0, p1, p2, p3, n) { const out = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; out.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } return out; }
function tube(g, pts, w0, w1, fill, belly, lw = 5, scales = true) { const n = pts.length, Lp = [], Rp = [], N = [];
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = lerp(w0, w1, i / (n - 1)) / 2;
    N.push([nx, ny, w]); Lp.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); Rp.push([pts[i][0] - nx * w, pts[i][1] - ny * w]); }
  let d = `M${Lp[0][0]} ${Lp[0][1]}`; for (let i = 1; i < n; i++) d += ` L${Lp[i][0]} ${Lp[i][1]}`; for (let i = n - 1; i >= 0; i--) d += ` L${Rp[i][0]} ${Rp[i][1]}`; d += ' Z';
  sh(g, d, fill, lw); g.save(); g.clip(path(d));
  if (belly) { g.beginPath(); for (let i = 0; i < n; i++) { const x = pts[i][0] - N[i][0] * N[i][2] * .62, y = pts[i][1] - N[i][1] * N[i][2] * .62; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineWidth = lerp(w0, w1, .5) * .45; g.strokeStyle = belly; g.lineCap = 'round'; g.stroke();
    for (let i = 2; i < n - 1; i += 2) { const x = pts[i][0] - N[i][0] * N[i][2] * .62, y = pts[i][1] - N[i][1] * N[i][2] * .62; line(g, [x + N[i][0] * N[i][2] * .22, y + N[i][1] * N[i][2] * .22, x - N[i][0] * N[i][2] * .22, y - N[i][1] * N[i][2] * .22], 2, 'rgba(40,10,10,.45)', 'round', true); } }
  if (scales) for (let i = 1; i < n - 1; i++) for (let k = -1; k <= 1; k++) { const x = pts[i][0] + N[i][0] * N[i][2] * k * .4, y = pts[i][1] + N[i][1] * N[i][2] * k * .4, r = N[i][2] * .22; g.beginPath(); g.arc(x, y, r, 0, Math.PI); g.lineWidth = 2; g.strokeStyle = 'rgba(140,200,160,.18)'; g.stroke(); }
  g.restore(); sh(g, d, null, lw); }
const ORO = { sc: '#2e4a3a', scD: '#1c3026', scL: '#4e7058', belly: '#d0583a', bellyL: '#f0a070', spine: '#efe6cc', eye: '#ff3a1e' };
// a serpent neck: outlined tube, scalloped scales, segmented belly plates on the underside, bone spines along the top
function serpentNeck(g, pts, w0, w1, sil) { const n = pts.length, Lp = [], Rp = [], N = [];
  const raw = []; for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; raw.push([-dy / d, dx / d]); }
  const sg = (raw[n - 1][1] + raw[Math.floor(n * .7)][1]) >= 0 ? 1 : -1;   // one belly side for the whole neck: underneath at the head end
  for (let i = 0; i < n; i++) { const nx = raw[i][0] * sg, ny = raw[i][1] * sg, w = lerp(w0, w1, i / (n - 1)) / 2;
    N.push([nx, ny, w]); Lp.push([pts[i][0] - nx * w, pts[i][1] - ny * w]); Rp.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); }
  if (!sil) for (let i = 2; i < n - 1; i += 2) { const [nx, ny, w] = N[i], bx = Lp[i][0], by = Lp[i][1], tx = bx - nx * w * .55, ty = by - ny * w * .55, px = pts[i + 1][0] - pts[i - 1][0], py = pts[i + 1][1] - pts[i - 1][1], pl = Math.hypot(px, py) || 1;
    tsh(g, `M${bx - px / pl * w * .22} ${by - py / pl * w * .22} L${tx + px / pl * w * .1} ${ty + py / pl * w * .1} L${bx + px / pl * w * .22} ${by + py / pl * w * .22} Z`, ORO.spine, 4); }
  let d = `M${Lp[0][0]} ${Lp[0][1]}`; for (let i = 1; i < n; i++) d += ` L${Lp[i][0]} ${Lp[i][1]}`; for (let i = n - 1; i >= 0; i--) d += ` L${Rp[i][0]} ${Rp[i][1]}`; d += ' Z';
  if (sil) { sh(g, d, '#05060c', 0); return; }
  tsh(g, d, lg(g, pts[0][0], pts[0][1], pts[n - 1][0], pts[n - 1][1], [[0, ORO.scD], [1, ORO.sc]]), 0); g.save(); g.clip(path(d));
  for (let i = 1; i < n - 1; i++) { const [nx, ny, w] = N[i]; for (let k = -2; k <= 1; k++) { const x = pts[i][0] + nx * w * k * .38, y = pts[i][1] + ny * w * k * .38, r = w * .2; g.beginPath(); g.arc(x, y, r, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI); g.lineWidth = 3; g.strokeStyle = 'rgba(10,20,14,.35)'; g.stroke(); } }
  g.beginPath(); for (let i = 0; i < n; i++) { const x = pts[i][0] + N[i][0] * N[i][2] * .62, y = pts[i][1] + N[i][1] * N[i][2] * .62; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineWidth = lerp(w0, w1, .5) * .38; g.strokeStyle = '#b8462e'; g.lineCap = 'butt'; g.stroke();
  for (let i = 1; i < n; i++) { const [nx, ny, w] = N[i], cx = pts[i][0] + nx * w * .62, cy = pts[i][1] + ny * w * .62, px = pts[i][0] - pts[i - 1][0], py = pts[i][1] - pts[i - 1][1], pl = Math.hypot(px, py) || 1; line(g, [cx - px / pl * 2 - nx * w * .26, cy - py / pl * 2 - ny * w * .26, cx + nx * w * .26, cy + ny * w * .26], 3.4, '#7a2418', 'butt', true); line(g, [cx + px / pl * 6 - nx * w * .2, cy + py / pl * 6 - ny * w * .2, cx + px / pl * 6 + nx * w * .2, cy + py / pl * 6 + ny * w * .2], 2.4, ORO.bellyL, 'butt', true); }
  g.beginPath(); for (let i = 0; i < n; i++) { const x = pts[i][0] - N[i][0] * N[i][2] * .5, y = pts[i][1] - N[i][1] * N[i][2] * .5; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.lineWidth = 6; g.strokeStyle = 'rgba(140,200,160,.18)'; g.stroke();
  g.restore(); tsh(g, d, null, 6); }
function oroHead(g, x, y, ang, side, jaw, eye, glowA, T, ph, hs = 1) { g.save(); g.translate(x, y); g.scale(side * hs, hs); g.rotate(side > 0 ? ang : -ang);
  const fl = Math.sin(T * 9 + ph * 3) > .7 && jaw > .25 ? 1 : 0;
  // crest of bone spines behind the skull
  [[-30, -40, -110, -170], [0, -62, -60, -200], [36, -74, -6, -214], [74, -78, 52, -190]].forEach(([bx, by, tx, ty], i) => tsh(g, `M${bx - 18} ${by + 10} Q${(bx + tx) / 2 - 10} ${(by + ty) / 2} ${tx} ${ty} Q${(bx + tx) / 2 + 14} ${(by + ty) / 2 + 6} ${bx + 18} ${by + 4} Z`, ORO.spine, 4.4));
  if (fl) { tln(g, [230, 40, 300, 46], 7, '#d83a4a'); tln(g, [300, 46, 326, 30], 5, '#d83a4a'); tln(g, [300, 46, 326, 60], 5, '#d83a4a'); }
  // lower jaw (hinged), belly-coloured plates underneath, teeth when open
  g.save(); g.translate(0, 22); g.rotate(jaw * .55); const lj = 'M-30 0 L250 0 Q258 30 200 50 L-10 56 Q-36 30 -30 0 Z'; tsh(g, lj, lg(g, 0, 0, 0, 56, [[0, ORO.sc], [.5, ORO.belly], [1, '#8a2a1a']]), 5);
  for (let i = 0; i < 6; i++) tln(g, [10 + i * 36, 34, 22 + i * 36, 52], 2.4, 'rgba(90,20,10,.5)'); if (jaw > .1) for (let i = 0; i < 7; i++) tsh(g, `M${30 + i * 30} 0 l12 0 l-6 ${-18 - (i % 2) * 8} Z`, '#fbf6e8', 2.4); g.restore();
  if (jaw > .1) tsh(g, `M-20 18 L232 14 L${226} ${26 + jaw * 80} L-20 ${36 + jaw * 50} Z`, '#3a0a0e', 0);
  // upper skull: long snout, brow ridge, scales, nostril
  const sk = 'M-50 -36 C-20 -100 120 -104 214 -62 C258 -42 286 -16 280 14 Q272 26 250 26 L-40 34 Q-66 0 -50 -36 Z';
  tsh(g, sk, lg(g, 0, -104, 0, 34, [[0, ORO.scL], [.55, ORO.sc], [1, ORO.scD]]), 6); g.save(); g.clip(path(sk));
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-20 + i * 32 + (r % 2) * 16, -70 + r * 28, 15, 0, Math.PI); g.lineWidth = 3; g.strokeStyle = 'rgba(10,24,16,.35)'; g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(120, -80, 120, 16, -.1, 0, 7); g.fill(); g.restore(); tsh(g, sk, null, 6);
  if (jaw > .1) for (let i = 0; i < 7; i++) tsh(g, `M${36 + i * 32} 24 l13 0 l-6 ${20 + (i % 2) * 8} Z`, '#fbf6e8', 2.4);
  tell(g, 258, -8, 9, 5, '#140a08', 0, -.3);
  tsh(g, 'M70 -64 Q120 -96 176 -66 L172 -56 Q120 -80 74 -54 Z', ORO.scD, 4);
  if (eye > .1) { if (glowA) glow(g, 128, -46, 190, 'rgba(255,70,30,1)', glowA); tsh(g, `M98 -46 Q128 ${-46 - 20 * eye} 158 -46 Q128 ${-46 + 14 * eye} 98 -46 Z`, rg(g, 128, -46, 2, 28, [[0, '#ffe890'], [.45, ORO.eye], [1, '#8a0a0a']]), 4.4); tell(g, 130, -46, 3.4, 11 * eye, '#1a0404', 0); tell(g, 138, -52, 3, 3, 'rgba(255,255,255,.8)', 0); }
  else tln(g, [98, -44, 128, -38, 158, -44], 5);
  g.restore(); }
function orochiDraw(g, a, lt, T) { const s = a.s || 1, mode = a.mode || 'idle', sl = clamp(a.sleep || 0), rise = clamp(a.rise ?? 1), eye = a.eyes ?? 1, sil = !!a.sil, jaw = a.jaw ?? (mode === 'roar' ? .8 : .15);
  g.save(); g.translate(a.x, a.y); g.scale(s, s);
  const top = x => -560 + Math.pow(x / 900, 2) * 420;
  const bodyD = 'M-1000 40 C-900 -300 -500 -560 0 -580 C500 -560 900 -300 1000 40 Z';
  const bodyFill = sil ? '#05060c' : lg(g, 0, -580, 0, 40, [[0, ORO.scL], [.4, ORO.sc], [.85, '#141e1a'], [1, ORO.belly]]);
  // tails behind the body
  if (!sil && a.tails !== false) [-1, 1].forEach(sd => { for (let i = 0; i < 2; i++) { const p = bez([sd * 700, -120 - i * 60], [sd * 1000, -260 - i * 80], [sd * 1150, 20], [sd * (1250 + i * 80), -80 + i * 30], 18); serpentNeck(g, p, 170, 46, false); } });
  if (sil) sh(g, bodyD, bodyFill, 0); else tsh(g, bodyD, bodyFill, 7);
  if (!sil) { g.save(); g.clip(path(bodyD)); for (let y = -560; y < 40; y += 46) for (let x = -1000 + ((y / 46 | 0) % 2) * 40; x < 1000; x += 80) { g.beginPath(); g.arc(x, y, 34, 0, Math.PI); g.lineWidth = 2.4; g.strokeStyle = 'rgba(140,200,160,.14)'; g.stroke(); }
    const r = rng(12); for (let i = 0; i < 14; i++) ell(g, -800 + r() * 1600, -300 - r() * 200, 60 + r() * 90, 22 + r() * 20, 'rgba(70,110,60,.55)'); g.restore();
    // cypress and cedar growing on its back, moss hanging
    for (let i = -7; i <= 7; i++) { const x = i * 118 + ((i * 37) % 30), y = top(x) + 20, h = 120 + ((i * 53) % 70); sh(g, `M${x - 30} ${y} L${x} ${y - h} L${x + 30} ${y} Z`, '#1e3a2a', 3); sh(g, `M${x - 22} ${y - h * .4} L${x} ${y - h * 1.05} L${x + 22} ${y - h * .4} Z`, '#2a4e36', 2.4); taper(g, x, y + 10, x, y - 20, 10, 8, '#3a2a1e'); } }
  else { glow(g, 0, -580, 900, 'rgba(120,30,30,1)', .18); }
  // necks and heads
  const n = a.heads || 8, ord = [0, 7, 1, 6, 2, 5, 3, 4];
  const P = [];
  for (let i = 0; i < n; i++) { const bx = -490 + i * 140, by = top(bx) + 60, side = i < n / 2 ? -1 : 1, q = (i - (n - 1) / 2) / ((n - 1) / 2), ph = i * 1.7;
    const sway = Math.sin(T * 1.3 + ph) * 26 * (1 - sl), bob = Math.cos(T * 1.1 + ph) * 18 * (1 - sl);
    let hx = q * 900 + sway, hy = -1060 + Math.abs(q) * 220 + bob, ang = .18;
    if (mode === 'rise') { const k = clamp(rise * 1.6 - Math.abs(q) * .5 - (i % 2) * .1); hx = lerp(bx, hx, eo(k)); hy = lerp(by + 200, hy, eo(k)); }
    if (a.targets) { const tg = a.targets[i], dk = mode === 'drink' || mode === 'sleep' ? 1 : 0; if (tg && dk) { const gulp = Math.sin(T * 5 + ph) * 8 * (1 - sl);
      const dx = tg[0] - side * 90, dy = tg[1] - 120 + gulp, sx2 = tg[0] + side * 150, sy2 = tg[1] - 20; hx = lerp(dx, sx2, sl); hy = lerp(dy, sy2, sl); ang = lerp(1.25, .12, sl); } }
    P.push({ i, bx, by, hx, hy, ang, side, ph }); }
  const draw = ord.filter(i => i < n).map(i => P[i]);
  if (a.fence) fence(g, { x: 0, y: a.fenceY ?? 0, gates: a.targets ? a.targets.map(p => p[0]) : null, part: 'back' }, T);
  const drinkM = a.targets && (mode === 'drink' || mode === 'sleep');
  draw.forEach(p => { const pts = drinkM ? bez([p.bx, p.by], [p.bx, p.by - 420], [p.hx - p.side * 60, p.hy - 640 + sl * 300], [p.hx, p.hy], 24) : bez([p.bx, p.by], [p.bx, p.by - 260], [p.hx - p.side * 260, p.hy + 220], [p.hx, p.hy], 22);
    serpentNeck(g, pts, drinkM ? 130 : 180, drinkM ? 96 : 120, sil); });
  if (!sil && a.trees !== false) for (let i = -7; i <= 7; i++) { const x = i * 118 + ((i * 37) % 30), y = top(x) + 20, h = 120 + ((i * 53) % 70); if (Math.abs(x) < 520 && !a.treesFront) continue; sh(g, `M${x - 30} ${y} L${x} ${y - h} L${x + 30} ${y} Z`, '#1e3a2a', 3); sh(g, `M${x - 22} ${y - h * .4} L${x} ${y - h * 1.05} L${x + 22} ${y - h * .4} Z`, '#2a4e36', 2.4); taper(g, x, y + 10, x, y - 20, 10, 8, '#3a2a1e'); }
  if (a.targets && a.vats !== false) a.targets.forEach(tg => vat(g, tg[0], tg[1], .9, 'back', T));
  draw.forEach(p => { if (sil) { g.save(); g.filter = 'brightness(0.04)'; oroHead(g, p.hx, p.hy, p.ang, p.side, 0, 0, 0, T, p.ph, a.hs || 1); g.filter = 'none'; g.restore(); const ex = p.hx + p.side * 120 * Math.cos(p.ang), ey = p.hy - 44; glow(g, ex, ey, 120, 'rgba(255,40,30,1)', .9 * eye); ell(g, ex, ey, 14, 6, '#ff5a3a'); }
    else oroHead(g, p.hx, p.hy, p.ang, p.side, lerp(jaw, 0, sl) + (mode === 'roar' ? Math.max(0, Math.sin(T * 3 + p.ph)) * .3 : 0), (1 - sl) * eye, a.glow ?? .35, T, p.ph, a.hs || 1); });
  if (a.targets && a.vats !== false) a.targets.forEach(tg => vat(g, tg[0], tg[1], .9, 'front', T));
  if (sl > .6) for (let i = 0; i < n; i += 2) { const p = P[i], q = ((T * .5 + i * .3) % 1); g.save(); g.globalAlpha = (1 - q) * (sl - .6) * 2.5; txt(g, 'z', p.hx + p.side * 60 + q * 40, p.hy - 120 - q * 120, 60 + q * 30, '#f6f0e0', '#141018'); g.restore(); }
  g.restore(); }
// ---------------- props ----------------
function vat(g, x, y, s, part, T) { g.save(); g.translate(x, y); g.scale(s, s);
  if (part !== 'front') { ell(g, 0, -150, 92, 22, '#5a3a22', 4); ell(g, 0, -148, 80, 16, lg(g, 0, -164, 0, -132, [[0, '#f6ecd0'], [1, '#d8c8a0']])); ell(g, -20 + Math.sin(T * 2) * 10, -150, 26, 4, 'rgba(255,255,255,.5)'); }
  if (part !== 'back') { sh(g, 'M-92 -150 Q-104 -70 -84 0 L84 0 Q104 -70 92 -150 Q0 -128 -92 -150 Z', lg(g, -100, 0, 100, 0, [[0, '#6a4428'], [.45, '#b8865a'], [1, '#6a4428']]), 4.5);
    for (let i = -3; i <= 3; i++) line(g, [i * 26, -142, i * 28, -4], 1.6, 'rgba(60,30,10,.35)', 'round', true);
    [-120, -50].forEach(yy => { sh(g, `M-98 ${yy - 8} Q0 ${yy + 12} 98 ${yy - 8} L98 ${yy + 6} Q0 ${yy + 26} -98 ${yy + 6} Z`, '#4a6a3a', 3); });
    sh(g, 'M-40 -104 L40 -104 L40 -68 L-40 -68 Z', '#f6f0e0', 2.4); line(g, [-24, -96, 24, -96], 3, '#c8302a', 'round', true); line(g, [-24, -86, 10, -86], 2.4, '#141018', 'round', true); line(g, [-24, -77, 18, -77], 2.4, '#141018', 'round', true); }
  g.restore(); }
function fence(g, a, T) { g.save(); g.translate(a.x || 0, a.y || 0); const gates = a.gates || [-770, -550, -330, -110, 110, 330, 550, 770], W = 120;
  // a palisade of lashed logs; every gate is an opening framed by two posts and a lintel
  const xs = []; for (let x = -1300; x <= 1300; x += 34) if (!gates.some(gx => Math.abs(x - gx) < W / 2 + 6)) xs.push(x);
  xs.forEach((x, i) => { const h = 300 + ((i * 37) % 26); sh(g, `M${x - 16} -20 L${x - 16} ${-h} L${x} ${-h - 22} L${x + 16} ${-h} L${x + 16} -20 Z`, lg(g, x - 16, 0, x + 16, 0, [[0, '#4a3020'], [.5, '#8a6440'], [1, '#4a3020']]), 3); });
  line(g, [-1300, -200, 1300, -200], 10, '#3a2414', 'butt', true); line(g, [-1300, -90, 1300, -90], 10, '#3a2414', 'butt', true);
  gates.forEach(gx => { [gx - W / 2 - 10, gx + W / 2 + 10].forEach(px => sh(g, `M${px - 14} -10 L${px - 14} -380 L${px + 14} -380 L${px + 14} -10 Z`, '#6a4428', 3.4)); sh(g, `M${gx - W / 2 - 40} -380 L${gx + W / 2 + 40} -380 L${gx + W / 2 + 30} -404 L${gx - W / 2 - 30} -404 Z`, '#4a2c18', 3.4);
    line(g, [gx - W / 2 - 24, -372, gx + W / 2 + 24, -372], 4, '#e8e0cc', 'butt', true); for (let k = 0; k < 4; k++) sh(g, `M${gx - 36 + k * 24} -368 l8 0 l-4 22 Z`, '#f6f0e0', 1.4); });
  g.restore(); }
function treasures(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); glow(g, 0, -200, 600, 'rgba(255,220,140,1)', .45);
  sh(g, 'M-360 0 L360 0 L330 -40 L-330 -40 Z', '#5a2a2a', 4); sh(g, 'M-330 -40 L330 -40 L330 -60 L-330 -60 Z', '#c8302a', 3);
  // mirror
  ell(g, -230, -230, 120, 120, lg(g, -350, -350, -110, -110, [[0, '#fff6d0'], [.5, '#d8b050'], [1, '#8a6018']]), 5); ell(g, -230, -230, 92, 92, lg(g, -320, -320, -140, -140, [[0, '#ffffff'], [1, '#c8d0d8']]), 3); ell(g, -258, -262, 30, 14, 'rgba(255,255,255,.7)', 0, -.6);
  // jewel
  sh(g, 'M-30 -160 C10 -230 90 -200 70 -130 C60 -90 20 -80 10 -110 C40 -120 40 -160 10 -160 C-10 -160 -10 -130 -30 -120 Z', rg(g, 20, -150, 4, 90, [[0, '#9ef0d0'], [1, '#2a8a6a']]), 4); ell(g, 18, -176, 10, 6, 'rgba(255,255,255,.7)');
  // sword
  g.save(); g.translate(230, -70); HOLD.kusanagi(g, [0, 0], { holdRot: .05 }, T); g.restore(); g.restore(); }
function snake(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1); const pts = []; for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push([-u * 260, Math.sin(T * 7 - u * 9) * 16 * (1 - u * .3) - 10]); }
  tube(g, pts, 26, 8, '#5a8a3a', '#c8c070', 3, false); sh(g, `M0 -24 C20 -30 46 -22 50 -10 C46 2 20 6 0 4 Z`, '#5a8a3a', 3); ell(g, 22, -16, 4, 4, '#141018');
  if (Math.sin(T * 8) > .3) { line(g, [50, -10, 72, -10], 3, '#d83a4a', 'round', true); line(g, [72, -10, 80, -16], 2.4, '#d83a4a', 'round', true); line(g, [72, -10, 80, -4], 2.4, '#d83a4a', 'round', true); } g.restore(); }
function chopsticks(g, a, T) { g.save(); g.translate(a.x, a.y + Math.sin(T * 2) * 4); g.rotate(-.12 + Math.sin(T * 1.3) * .05); g.scale(a.s || 1, a.s || 1);
  [0, 14].forEach(d => sh(g, `M-90 ${d} L90 ${d - 6} L90 ${d - 1} L-90 ${d + 5} Z`, '#c89a5a', 2.4)); for (let i = 0; i < 3; i++) { const q = (T * .6 + i / 3) % 1; g.save(); g.globalAlpha = (1 - q) * .5; ell(g, 0, 10, 100 + q * 120, 14 + q * 18, null, 2, 0, '#f6f8ff'); g.restore(); } g.restore(); }
function slash(g, a, lt) { const q = (lt - a.t0) / (a.d || .35); if (q < 0 || q > 1) return; g.save(); g.translate(a.x, a.y); g.rotate(a.rot || -.5); g.globalAlpha = 1 - q;
  sh(g, `M-500 0 Q0 ${-160 - q * 40} 500 0 Q0 ${-110 - q * 40} -500 0 Z`, '#fffaf0'); glow(g, 0, -60, 520, 'rgba(255,250,230,1)', (1 - q) * .8); g.restore();
  const r = rng(a.seed || 3); for (let i = 0; i < 26; i++) { const an = -Math.PI * r(), sp = 200 + r() * 700, x = a.x + Math.cos(an) * sp * eo(q), y = a.y + Math.sin(an) * sp * .6 * eo(q) + q * q * 300; ell(g, x, y, 10 + r() * 14, 8 + r() * 10, `rgba(${170 + r() * 50 | 0},20,24,${(1 - q) * .9})`); } }
function tailCut(g, a, lt, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const op = clamp(a.open || 0);
  const pts = bez([-1000, 360], [-500, -200], [300, 260], [1000, -260], 26); serpentNeck(g, pts, 380, 260, false);
  if (op > 0) { glow(g, 0, 20, 700 * op, 'rgba(255,220,140,1)', op); sh(g, `M-60 ${20 - 90 * op} Q0 ${20 - 120 * op} 60 ${20 - 90 * op} L60 ${20 + 90 * op} Q0 ${20 + 120 * op} -60 ${20 + 90 * op} Z`, '#2a0a0a', 4);
    g.save(); g.translate(0, 20); g.rotate(-1.3); g.globalAlpha = clamp(op * 1.5); HOLD.kusanagi(g, [0, 120 - op * 80], { holdRot: 0 }, T); g.restore(); }
  if (a.spark != null) { const q = (lt - a.spark) / .4; if (q > 0 && q < 1) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, -40, -80, 260, 'rgba(255,240,200,1)', 1 - q); for (let i = 0; i < 12; i++) { const an = i / 12 * 6.28; line(g, [-40, -80, -40 + Math.cos(an) * 180 * eo(q), -80 + Math.sin(an) * 180 * eo(q)], 5, `rgba(255,240,180,${1 - q})`, 'round', true); } g.restore(); } }
  g.restore(); }
function torii(g, x, y, s, col = '#d23a2a') { g.save(); g.translate(x, y); g.scale(s, s);
  [-240, 240].forEach(px => { sh(g, `M${px - 24} 0 L${px - 30} -600 L${px + 30} -600 L${px + 24} 0 Z`, lg(g, px - 30, 0, px + 30, 0, [[0, mix(col, '#000', .3)], [.5, col], [1, mix(col, '#000', .25)]]), 4); sh(g, `M${px - 34} 0 L${px + 34} 0 L${px + 30} -40 L${px - 30} -40 Z`, '#2a1a1a', 3); });
  sh(g, 'M-300 -470 L300 -470 L300 -430 L-300 -430 Z', col, 4); sh(g, 'M-16 -600 L16 -600 L16 -470 L-16 -470 Z', col, 3);
  sh(g, 'M-380 -640 Q0 -600 380 -640 L360 -604 Q0 -572 -360 -604 Z', col, 4); sh(g, 'M-400 -680 Q0 -630 400 -680 L380 -640 Q0 -600 -380 -640 Z', '#1e1418', 4); g.restore(); }
function lanternStone(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); const st = '#8a8478';
  sh(g, 'M-50 0 L50 0 L40 -30 L-40 -30 Z', st, 3); taper(g, 0, -30, 0, -170, 34, 30, st); sh(g, 'M-56 -170 L56 -170 L46 -196 L-46 -196 Z', st, 3);
  sh(g, 'M-40 -196 L40 -196 L40 -270 L-40 -270 Z', mix(st, '#000', .2), 3); sh(g, 'M-22 -206 L22 -206 L22 -258 L-22 -258 Z', `rgba(255,${200 + 30 * Math.sin(T * 9) | 0},120,1)`, 2); glow(g, 0, -232, 260, 'rgba(255,190,100,1)', .55);
  sh(g, 'M-80 -270 Q0 -300 80 -270 L50 -320 Q0 -330 -50 -320 Z', st, 3); ell(g, 0, -334, 16, 16, st, 3); g.restore(); }
function chochin(g, x, y, s, T, ph = 0) { g.save(); g.translate(x, y + Math.sin(T * 1.4 + ph) * 3); g.rotate(Math.sin(T * 1.1 + ph) * .04); g.scale(s, s); glow(g, 0, 50, 220, 'rgba(255,170,90,1)', .5);
  sh(g, 'M-20 0 L20 0 L20 10 L-20 10 Z', '#1e1418', 2); ell(g, 0, 56, 44, 50, lg(g, -44, 0, 44, 0, [[0, '#c8302a'], [.5, '#ff7a4a'], [1, '#c8302a']]), 3.4); for (let i = -2; i <= 2; i++) line(g, [-44, 56 + i * 16, 44, 56 + i * 16], 1.4, 'rgba(80,10,10,.35)', 'round', true);
  sh(g, 'M-20 102 L20 102 L20 112 L-20 112 Z', '#1e1418', 2); g.restore(); }
function cedar(g, x, y, s, col = '#1e3a2a') { g.save(); g.translate(x, y); g.scale(s, s); taper(g, 0, 0, 0, -120, 30, 20, '#4a3020');
  for (let i = 0; i < 5; i++) { const yy = -80 - i * 90, w = 170 - i * 28; sh(g, `M${-w} ${yy} Q0 ${yy - 50} ${w} ${yy} Q${w * .3} ${yy - 120} 0 ${yy - 160} Q${-w * .3} ${yy - 120} ${-w} ${yy} Z`, i % 2 ? mix(col, '#fff', .06) : col, 3.4); } g.restore(); }
function pine(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); sh(g, 'M-14 0 C-20 -120 30 -200 -10 -320 C-30 -380 10 -420 30 -440 L44 -430 C20 -400 0 -370 18 -320 C50 -220 10 -120 16 0 Z', '#5a3a2a', 3.4);
  [[-120, -360, 130], [70, -440, 120], [-20, -500, 100], [120, -300, 90]].forEach(([cx, cy, w]) => sh(g, `M${cx - w} ${cy} Q${cx} ${cy - 70} ${cx + w} ${cy} Q${cx} ${cy + 26} ${cx - w} ${cy} Z`, '#2a4a36', 3.4)); g.restore(); }
function hut(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  [-200, -60, 60, 200].forEach(px => taper(g, px, 0, px, -170, 22, 20, '#5a3a22')); sh(g, 'M-250 -170 L250 -170 L250 -200 L-250 -200 Z', '#7a5432', 3.4);
  sh(g, 'M-220 -200 L220 -200 L220 -380 L-220 -380 Z', lg(g, 0, -380, 0, -200, [[0, '#a8805a'], [1, '#8a6440']]), 4); for (let k = -200; k <= 200; k += 40) line(g, [k, -380, k, -200], 2, 'rgba(50,30,15,.35)', 'round', true);
  sh(g, 'M-60 -200 L60 -200 L60 -330 L-60 -330 Z', '#2a1a12', 3); glow(g, 0, -260, 200, 'rgba(255,170,90,1)', .4);
  sh(g, 'M-330 -360 L0 -620 L330 -360 Q0 -380 -330 -360 Z', lg(g, 0, -620, 0, -360, [[0, '#c8a868'], [1, '#8a6a3a']]), 5); for (let i = 0; i < 14; i++) line(g, [-300 + i * 46, -366, -20 + i * 4, -600], 1.6, 'rgba(70,50,20,.35)', 'round', true);
  [[-60, -640], [60, -640]].forEach(([cx, cy], i) => line(g, [0, -600, cx, cy], 10, '#5a3a22', 'round')); sh(g, 'M-120 -600 L120 -600 L110 -620 L-110 -620 Z', '#5a3a22', 3);
  for (let i = 0; i < 6; i++) line(g, [-60 + i * 24, -150 + i * 30, -40 + i * 24, -150 + i * 30], 6, '#7a5432', 'round');
  line(g, [-70, -200, -40, 0], 8, '#7a5432', 'round'); line(g, [-30, -200, 0, 0], 8, '#7a5432', 'round'); g.restore(); }
Object.assign(JPA, {
  orochi: (g, A, c) => orochiDraw(g, A, c.lt, c.T), vat: (g, A, c) => vat(g, A.x, A.y, A.s || 1, A.part, c.T), fence: (g, A, c) => fence(g, A, c.T),
  treasures: (g, A, c) => treasures(g, A, c.T), snake: (g, A, c) => snake(g, A, c.lt, c.T), chopsticks: (g, A, c) => chopsticks(g, A, c.T), slash: (g, A, c) => slash(g, A, c.lt),
  tailcut: (g, A, c) => tailCut(g, A, c.lt, c.T), comb: (g, A, c) => { g.save(); g.translate(A.x, A.y); g.rotate(A.rot || 0); combShape(g, A.s || 1, A.glow ?? .6); g.restore(); },
  sparkle: (g, A, c) => { const q = (c.lt - A.t0) / (A.d || 1); if (q < 0 || q > 1) return; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, A.x, A.y, (A.r || 400) * (.5 + q), 'rgba(255,220,230,1)', (1 - q) * 1.2);
    for (let i = 0; i < 16; i++) { const an = i / 16 * 6.28 + q, d = (A.r || 400) * .8 * eo(q); sakura(g, A.x + Math.cos(an) * d, A.y + Math.sin(an) * d, 12 * (1 - q) + 4, `rgba(255,200,220,${1 - q})`); } g.restore(); },
  sakuraFall: (g, A, c) => { const r = rng(A.seed || 7); for (let i = 0; i < (A.n || 24); i++) { const x = ((r() * 1300 + Math.sin(c.T * .8 + i) * 60 + c.T * 30) % 1300) - 110, y = ((r() * 2000 + c.T * (60 + r() * 50)) % 2000) - 40; g.save(); g.globalAlpha = .8; sakura(g, x, y, 7 + r() * 5, '#f8c0d0'); g.restore(); } },
  rain: (g, A, c) => { const r = rng(4); g.save(); g.globalAlpha = A.a ?? .5; for (let i = 0; i < 90; i++) { const x = ((r() * 1400 + c.T * 300) % 1400) - 160, y = ((r() * 2100 + c.T * 1500) % 2100) - 100; line(g, [x, y, x - 14, y + 60], 2.4, 'rgba(200,220,255,.8)', 'round', true); } g.restore(); },
  bolt: (g, A, c) => { const q = (c.lt - A.t0) / .5; if (q < 0 || q > 1) return; g.save(); g.globalAlpha = 1 - q; const r = rng(A.seed || 2); let x = A.x, y = A.y0 ?? -200; g.beginPath(); g.moveTo(x, y); while (y < A.y) { x += (r() - .5) * 120; y += 60 + r() * 60; g.lineTo(x, y); } g.lineWidth = 10; g.strokeStyle = '#f4f6ff'; g.stroke(); g.lineWidth = 26; g.strokeStyle = 'rgba(180,200,255,.35)'; g.stroke(); g.restore(); },
  halo: (g, A, c) => { glow(g, A.x, A.y, A.r || 360, 'rgba(255,230,160,1)', A.a ?? .8); ell(g, A.x, A.y, (A.r || 360) * .38, (A.r || 360) * .38, 'rgba(255,244,210,.55)', 3, 0, 'rgba(255,220,140,.8)'); },
});
// ---------------- sets (floor line 1880) ----------------
function mtnLayer(g, y, amp, col, seed, x0 = -600, x1 = 1700) { const r = rng(seed); let d = `M${x0} ${y + 400} L${x0} ${y}`; for (let x = x0; x <= x1; x += 120) d += ` Q${x + 60} ${y - amp * (.4 + r() * .8)} ${x + 120} ${y - r() * amp * .3}`; d += ` L${x1} ${y + 400} Z`; sh(g, d, col, 0); }
SET.shrine = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1500, [[0, '#2a2458'], [.45, '#8a4a7a'], [.75, '#f08a5a'], [1, '#ffc888']]); g.fillRect(-600, -600, 2300, 2200);
  for (let i = 0; i < 30; i++) ell(g, (i * 137) % 1300 - 100, (i * 71) % 500 - 100, 2, 2, 'rgba(255,255,255,.8)');
  mtnLayer(g, 1180, 260, '#5a3a6a', 3); mtnLayer(g, 1300, 200, '#3a2a4a', 5);
  torii(g, 280, 1560, .9); cedar(g, -40, 1560, 1.3); cedar(g, 1080, 1560, 1.4); cedar(g, 900, 1500, .9, '#24402e');
  g.fillStyle = lg(g, 0, 1500, 0, 2400, [[0, '#a8988a'], [1, '#6a5a52']]); g.fillRect(-600, 1500, 2300, 1000);
  const r = rng(9); for (let i = 0; i < 260; i++) ell(g, r() * 1400 - 160, 1520 + r() * 800, 3 + r() * 4, 2 + r() * 3, `rgba(${80 + r() * 60 | 0},${70 + r() * 50 | 0},${60 + r() * 40 | 0},.5)`);
  sh(g, 'M240 1500 L320 1500 L380 2400 L180 2400 Z', 'rgba(200,190,175,.6)'); for (let y = 1520; y < 2300; y += 70) line(g, [230 - (y - 1500) * .06, y, 330 + (y - 1500) * .06, y], 2, 'rgba(80,70,60,.35)', 'round', true);
  lanternStone(g, 80, 1640, .9, T); lanternStone(g, 990, 1640, .9, T + 1);
  line(g, [-100, 420, 1200, 470], 3, '#2a1a12', 'round', true); [[60, 430], [300, 446], [560, 458], [820, 462], [1040, 464]].forEach(([x, y], i) => chochin(g, x, y, .9, T, i)); };
SET.takama = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1600, [[0, '#f6e0b0'], [.5, '#ffd890'], [1, '#fff4dc']]); g.fillRect(-600, -600, 2300, 2200);
  sun(g, 760, 420, 130, '#fff8e0'); rays(g, 760, 420, 1800, 18, 'rgba(255,240,200,.5)', .35, T);
  const cloud = (x, y, s, c) => { g.save(); g.translate(x, y); g.scale(s, s); [[-140, 0, 90], [-40, -40, 110], [80, -20, 100], [170, 10, 70], [0, 30, 120]].forEach(([cx, cy, r]) => ell(g, cx, cy, r, r * .7, c, 3, 0, 'rgba(200,150,80,.5)')); line(g, [-120, -10, -60, -40, 0, -10], 2.4, 'rgba(200,150,80,.5)', 'round', true); g.restore(); };
  // the hall of heaven: shinmei-style roof with crossed chigi and log katsuogi
  g.save(); g.translate(360, 1240); sh(g, 'M-260 0 L260 0 L260 -220 L-260 -220 Z', lg(g, 0, -220, 0, 0, [[0, '#f0d8a8'], [1, '#c8a878']]), 4); for (let k = -220; k <= 220; k += 55) line(g, [k, -220, k, 0], 6, '#a8865a', 'butt', true);
  sh(g, 'M-320 -200 L0 -400 L320 -200 Z', lg(g, 0, -400, 0, -200, [[0, '#e8c070'], [1, '#a87a3a']]), 4); line(g, [-60, -430, 60, -370], 12, '#8a5a2a', 'round'); line(g, [60, -430, -60, -370], 12, '#8a5a2a', 'round');
  for (let i = -2; i <= 2; i++) sh(g, `M${i * 50 - 16} -404 L${i * 50 + 16} -404 L${i * 50 + 16} -386 L${i * 50 - 16} -386 Z`, '#e8b84a', 2.4); g.restore();
  [[-60, 1360, 1.6], [520, 1420, 1.3], [1000, 1300, 1.5], [200, 1620, 2.2], [880, 1660, 2.0], [-120, 1720, 2.4]].forEach(([x, y, s], i) => cloud(x + Math.sin(T * .3 + i) * 14, y, s, i % 2 ? '#fff8ec' : '#fff2dc'));
  g.fillStyle = lg(g, 0, 1700, 0, 2400, [[0, '#fff2dc'], [1, '#f0d8b0']]); g.fillRect(-600, 1760, 2300, 800); };
SET.izumo = (g, o, T) => { const tod = o.tod || 'day', red = clamp(o.red || 0);
  const sky = tod === 'night' ? [['#060a1c', 0], ['#1a2448', 1]] : tod === 'dusk' ? [['#3a2a5a', 0], ['#e8806a', .7], ['#ffc890', 1]] : [['#8ab4d8', 0], ['#e8eef0', .8], ['#fff4e0', 1]];
  g.fillStyle = lg(g, 0, -400, 0, 1300, sky.map(([c, k]) => [k, c])); g.fillRect(-600, -600, 2300, 2000);
  if (tod === 'night') { for (let i = 0; i < 40; i++) ell(g, (i * 137) % 1300 - 100, (i * 89) % 900, 2, 2, '#fff'); ell(g, 820, 300, 44, 44, '#f4ecd0'); glow(g, 820, 300, 240, 'rgba(230,230,200,1)', .25); }
  const shade = (c, k) => tod === 'night' ? mix(c, '#0a1024', k) : tod === 'dusk' ? mix(c, '#5a3a5a', k * .6) : c;
  mtnLayer(g, 1000, 300, shade('#9ab0c8', .7), 2); mtnLayer(g, 1120, 260, shade('#6a8aa0', .7), 4); mtnLayer(g, 1250, 220, shade('#4a6a62', .7), 6);
  g.save(); g.globalAlpha = .5; for (let i = 0; i < 3; i++) ell(g, 300 + i * 400 + Math.sin(T * .2 + i) * 40, 1200 + i * 40, 420, 34, tod === 'night' ? 'rgba(120,130,170,.4)' : 'rgba(255,255,255,.7)'); g.restore();
  g.fillStyle = lg(g, 0, 1300, 0, 2400, [[0, shade('#6a8a4a', .7)], [1, shade('#3a5a2a', .7)]]); g.fillRect(-600, 1300, 2300, 1300);
  // the Hi river: narrow in the distance, wide in front
  const rv = 'M500 1300 C560 1340 470 1420 520 1500 C600 1620 360 1720 300 1880 C260 2000 200 2200 160 2400 L1000 2400 C900 2200 860 2000 860 1880 C860 1720 700 1640 660 1520 C620 1420 640 1340 580 1300 Z';
  const wc = red > 0 ? [mix(tod === 'night' ? '#2a3a6a' : '#7aa0c8', '#a8141a', red), mix(tod === 'night' ? '#1a2448' : '#4a7aa8', '#6a0a10', red)] : [tod === 'night' ? '#2a3a6a' : '#8ab0d4', tod === 'night' ? '#1a2448' : '#4a7aa8'];
  sh(g, rv, lg(g, 0, 1300, 0, 2400, [[0, wc[0]], [1, wc[1]]]), 3, 'rgba(30,40,30,.5)'); g.save(); g.clip(path(rv)); for (let i = 0; i < 40; i++) { const y = 1320 + ((i * 53 + T * 60) % 1100), w = 20 + (y - 1300) * .08, x = 560 + Math.sin(i * 1.7) * (y - 1300) * .25;
    line(g, [x - w, y, x + w, y], 2 + (y - 1300) * .004, red > .5 ? 'rgba(255,120,110,.35)' : 'rgba(255,255,255,.4)', 'round', true); } g.restore();
  pine(g, -40, 1620, 1.2); pine(g, 1040, 1560, 1.0); cedar(g, 860, 1380, .5, shade('#2a4a36', .5)); cedar(g, 140, 1400, .45, shade('#2a4a36', .5));
  const r = rng(6); for (let i = 0; i < 90; i++) { const x = r() * 1400 - 160, y = 1520 + r() * 900; if (Math.abs(x - (560 - (y - 1300) * .1)) < (y - 1300) * .35 + 60) continue; line(g, [x, y, x + (r() - .5) * 10, y - 18 - r() * 16], 2.4, shade('#2a4a1a', .5), 'round', true); } };
SET.house = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1400, [[0, '#4a3a6a'], [.6, '#e8907a'], [1, '#ffd0a0']]); g.fillRect(-600, -600, 2300, 2000);
  sun(g, 860, 1180, 90, '#fff0d0'); mtnLayer(g, 1150, 280, '#6a4a6a', 2); mtnLayer(g, 1290, 200, '#4a3a4a', 4);
  g.fillStyle = lg(g, 0, 1300, 0, 2400, [[0, '#7a6a4a'], [1, '#4a3a2a']]); g.fillRect(-600, 1340, 2300, 1300);
  hut(g, 760, 1560, .9); cedar(g, 1060, 1600, 1.1, '#2a3a2a'); pine(g, 80, 1560, 1.1);
  for (let x = -100; x < 1300; x += 60) line(g, [x, 1600, x + 4, 1540], 6, '#6a4a2a', 'round', true); line(g, [-100, 1560, 1300, 1560], 5, '#5a3a22', 'round', true);
  g.fillStyle = 'rgba(20,10,10,.12)'; g.fillRect(-600, 1600, 2300, 1000); };
SET.trap = (g, o, T) => { g.fillStyle = lg(g, 0, -400, 0, 1300, [[0, '#04060e'], [1, '#141a34']]); g.fillRect(-600, -600, 2300, 2000); for (let i = 0; i < 40; i++) ell(g, (i * 137) % 1300 - 100, (i * 61) % 800, 2, 2, 'rgba(255,255,255,.8)');
  ell(g, 200, 260, 40, 40, '#f4ecd0'); glow(g, 200, 260, 220, 'rgba(230,230,200,1)', .2);
  if (o.hills !== false) { mtnLayer(g, 1100, 300, '#141a2a', 3); mtnLayer(g, 1250, 220, '#0e121e', 5); }
  g.fillStyle = lg(g, 0, 1300, 0, 2400, [[0, '#2a2a2a'], [1, '#141414']]); g.fillRect(-600, 1340, 2300, 1300);
  [[-40, 1500], [1120, 1500]].forEach(([x, y]) => { line(g, [x, y + 200, x, y], 10, '#3a2418', 'round', true); fire(g, x, y - 10, .6, T); glow(g, x, y, 420, 'rgba(255,170,80,1)', .55); }); };
SC.set_jp = null;
