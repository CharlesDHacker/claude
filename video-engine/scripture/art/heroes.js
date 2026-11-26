// Heroes v2: Toby and Selah redrawn at the illustrated standard (tapered limbs with hands, shaded forms, fabric folds and
// patterned hems, detailed eyes, curls and fur strokes). Same options as chars.js, which these replace.
toby = function (g, o) {
  const C = TOBY, t = o.t || 0, ex = o.expr || 'neutral', talk = o.talk || 0, ph = o.ph || 0, glT = Math.floor(t * .55 + ph * 3.1), glance = ((((glT * 9301 + 49297) % 233280) / 233280) - .5) * 2, [lx0, ly0] = o.look || [0, 0], lx = clamp(lx0 + glance * .35, -1, 1), ly = ly0 + Math.sin(t * .4 + ph) * .1;
  const skin = '#c58552', skinD = '#9c6038', skinL = '#dca274';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = 1 + .012 * Math.sin(t * 2.2 + ph), hop = o.hop ? -Math.abs(Math.sin(t * 9)) * 18 * o.hop : 0;
  g.translate(0, hop);
  g.fillStyle = rg(g, 0, 0, 10, 130, [[0, 'rgba(30,15,20,.32)'], [1, 'rgba(30,15,20,0)']]); g.beginPath(); g.ellipse(0, 4, 130, 18, 0, 0, 7); g.fill();
  // legs + sandals
  if (!o.noLegs) { [[-28, -1], [28, 1]].forEach(([x, sd]) => { taper(g, x, -104, x + sd * 4, -22, 34, 26, sd < 0 ? skinD : skin);
    sh(g, `M${x + sd * 4 - 24} -18 Q${x + sd * 4 + 8} -26 ${x + sd * 4 + 30} -10 Q${x + sd * 4 + 34} 2 ${x + sd * 4 + 26} 4 L${x + sd * 4 - 26} 4 Z`, sd < 0 ? skinD : skin, 3.4);
    sh(g, `M${x + sd * 4 - 28} 0 L${x + sd * 4 + 30} 0 L${x + sd * 4 + 30} 8 L${x + sd * 4 - 28} 8 Z`, '#5c3520', 3); line(g, [x + sd * 4 - 16, -16, x + sd * 4 + 2, -2], 3, '#5c3520', 'round', true); line(g, [x + sd * 4 + 6, -20, x + sd * 4 + 20, -4], 3, '#5c3520', 'round', true); }); }
  else { taper(g, 20, -100, 64, -30, 32, 24, skin); taper(g, 64, -30, 70, 30, 24, 20, skin); }
  g.save(); g.scale(1, br); g.translate(0, (1 - br) * 100);
  const H = { down: [[-92, -150], [92, -150]], up: [[-140, -430], [140, -430]], mouth: [[-56, -334], [56, -334]], hips: [[-104, -190], [104, -190]],
    point: [[-92, -150], [196, -330]], rope: [[-92, -150], [175, -205]], hug: [[-40, -230], [190, -260]], shrug: [[-156, -246], [156, -246]], chin: [[-92, -150], [30, -318]], ears: [[-118, -392], [118, -392]] };
  let [hl, hr] = o.hands ? (H[o.hands] || o.hands) : H.down;
  if (o.sling) { const an = t * 16; hr = [120 + Math.cos(an) * 26, -480 + Math.sin(an) * 10]; }
  const sw = Math.sin(t * 1.7 + ph) * 5;
  const arm = (sx, h, s) => { const hx = h[0] + sw * s, ex2 = (sx + hx) / 2 + s * 22, ey2 = (-262 + h[1]) / 2 + 16;
    taper(g, sx, -260, ex2, ey2, 28, 23, s < 0 ? skinD : skin); taper(g, ex2, ey2, hx, h[1], 23, 19, s < 0 ? skinD : skin);
    hand(g, hx, h[1], Math.atan2(h[1] - ey2, hx - ex2), 1.25, s < 0 ? skinD : skin, ['up', 'shrug', 'point'].includes(o.hands) ? 1 : 0);
    taper(g, sx, -264, sx + (ex2 - sx) * .45, -264 + (ey2 + 264) * .45, 44, 38, s < 0 ? mix(C.tunic, '#2a1020', .3) : C.tunic); };
  arm(-58, hl, -1);
  // tunic with folds + woven hem
  const tun = 'M-62 -284 C-90 -240 -96 -160 -86 -96 Q0 -80 86 -96 C96 -160 90 -240 62 -284 Q0 -298 -62 -284 Z';
  sh(g, tun, lg(g, -90, 0, 90, 0, [[0, '#b0662a'], [.45, C.tunic], [.75, '#eaa458'], [1, '#a85e24']]), 4.5);
  g.save(); g.clip(path(tun)); for (let i = -4; i <= 4; i++) line(g, [i * 12, -170, i * 18 + sw * .3, -92], 1.6, 'rgba(70,30,10,.3)', 'round', true);
  line(g, [-30, -282, -36, -96], 11, C.stripe, 'round', true); line(g, [30, -282, 36, -96], 11, C.stripe, 'round', true); line(g, [-30, -282, -36, -96], 1.4, 'rgba(255,220,170,.4)', 'round', true);
  pattern(g, -100, 100, -116, 18, '#8e4720', 'zig'); g.restore(); sh(g, tun, null, 4.5);
  line(g, [-86, -174, 0, -162, 86, -174], 10, '#ead6a8'); line(g, [-86, -174, 0, -162, 86, -174], 2, INK); ell(g, 60, -168, 7, 9, '#ead6a8', 2.6);
  arm(58, hr, 1);
  if (o.staff) taper(g, hr[0] + 6, hr[1] - 230, hr[0] + 6, hr[1] + 120, 11, 11, '#7a5432');
  if (o.sling) { const an = t * 16, sx = hr[0] + Math.cos(an) * 150, sy = hr[1] - 30 + Math.sin(an) * 60; g.save(); g.globalAlpha = .4; g.beginPath(); g.ellipse(hr[0], hr[1] - 30, 150, 60, 0, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = '#fff6dc'; g.stroke(); g.restore(); line(g, [hr[0], hr[1], (hr[0] + sx) / 2, (hr[1] + sy) / 2 + 18, sx, sy], 3.4, '#6a4a2a', 'round', true); ell(g, sx, sy, 14, 14, lg(g, sx - 14, sy - 14, sx + 14, sy + 14, [[0, '#e0d8cc'], [1, '#7a7268']]), 3); }
  g.restore();
  // head
  const nodT = talk * (.06 * Math.sin(t * 8.6 + ph) + .02) + .025 * Math.sin(t * .7 + ph * 2.3);
  g.save(); g.translate(0, -400 + (1 - br) * 300 - talk * 6); g.rotate((o.tilt || 0) + nodT);
  taper(g, 0, 90, 0, 124, 44, 46, skinD);
  // back curls
  const curls = [[-98, -40, 40], [-62, -94, 44], [-10, -114, 46], [46, -98, 44], [92, -52, 40], [-110, 6, 30], [108, 2, 30]];
  curls.forEach(([x, y, r]) => { ell(g, x, y, r, r, '#2b1a14', 4); line(g, [x - r * .4, y - r * .3, x, y - r * .6, x + r * .4, y - r * .3], 2, 'rgba(255,220,190,.18)', 'round', true); });
  ell(g, -116, 8, 22, 27, skin, 4); line(g, [-120, 0, -110, 8, -118, 18], 2, skinD, 'round', true); ell(g, 116, 8, 22, 27, skinD, 4);
  ell(g, 0, 0, 116, 112, rg(g, -30, -40, 20, 150, [[0, skinL], [.55, skin], [1, skinD]]), 5);
  // fringe curls + headband
  [[-70, -80, 22], [-36, -94, 24], [4, -98, 24], [42, -92, 22], [74, -76, 20]].forEach(([x, y, r]) => { ell(g, x, y, r, r, '#2b1a14', 3.4); line(g, [x - r * .4, y - r * .2, x, y - r * .55, x + r * .4, y - r * .2], 1.8, 'rgba(255,220,190,.22)', 'round', true); });
  line(g, [-114, -48, 0, -90, 114, -48], 24, INK, 'round', true); line(g, [-114, -48, 0, -90, 114, -48], 18, C.band, 'round', true); line(g, [-112, -48, 0, -88, 112, -48], 3.4, C.bandStripe, 'round', true);
  for (let i = -4; i <= 4; i++) line(g, [i * 24, -62 - (4 - Math.abs(i)) * 6, i * 24 + 4, -54 - (4 - Math.abs(i)) * 6], 1.2, 'rgba(60,80,140,.4)', 'round', true);
  limb(g, [112, -46, 140, -22, 150, 30], 9, C.band, 4); limb(g, [110, -42, 150, -32, 170, 6], 8, C.band, 4);
  ell(g, -72, 50, 24, 14, 'rgba(230,110,90,.32)'); ell(g, 72, 50, 24, 14, 'rgba(230,110,90,.32)');
  [[-62, 40], [-76, 50], [-60, 58], [-70, 34], [62, 40], [76, 50], [60, 58], [70, 34]].forEach(([x, y]) => ell(g, x, y, 2.4, 2.4, '#8a4a2a'));
  // eyes: whites, big irises, lids
  const blink = ((t * .63 + ph) % 3.7) < .1 && ex !== 'happy';
  [-42, 42].forEach(cx => {
    if (blink || ex === 'happy') { line(g, [cx - 24, 0, cx, ex === 'happy' ? -16 : 2, cx + 24, 0], 5); if (ex === 'happy') line(g, [cx - 20, 8, cx, 0, cx + 20, 8], 1.6, 'rgba(120,50,30,.4)', 'round', true); return; }
    const ry = ex === 'shock' ? 40 : 36; ell(g, cx, 0, 30, ry, lg(g, 0, -ry, 0, ry, [[0, '#ffffff'], [1, '#ece2d4']]), 4);
    const ir = ex === 'shock' ? 10 : 16, ix = cx + lx * 11, iy = 3 + ly * 11;
    ell(g, ix, iy, ir, ir * 1.08, rg(g, ix, iy, 2, ir, [[0, '#6a3a1e'], [.7, '#3a1e10'], [1, '#1a0e08']])); ell(g, ix, iy, ir * .5, ir * .55, '#100806'); ell(g, ix + 5, iy - 6, 4.5, 4.5, '#fff'); ell(g, ix - 4, iy + 5, 2, 2, 'rgba(255,255,255,.7)');
    g.beginPath(); g.ellipse(cx, 0, 30, ry, 0, Math.PI * 1.05, Math.PI * 1.95); g.lineWidth = 4.4; g.strokeStyle = INK; g.stroke();
    if (ex === 'annoyed') { sh(g, `M${cx - 33} -42 L${cx + 33} -42 L${cx + 33} 0 Q${cx} -6 ${cx - 33} 0 Z`, skin); line(g, [cx - 32, 0, cx, -5, cx + 32, 0], 4); }
  });
  const B = { neutral: [-56, -52, -24, -54], shout: [-62, -60, -22, -44], worry: [-62, -50, -24, -64], shock: [-60, -66, -24, -70], sad: [-60, -50, -22, -62], happy: [-60, -56, -24, -60], sheepish: [-60, -52, -24, -64], annoyed: [-60, -46, -24, -46] }[ex] || [-56, -52, -24, -54];
  [[1, 1], [-1, 1]].forEach(([sx]) => sh(g, `M${sx * B[0]} ${B[1]} Q${sx * (B[0] + B[2]) / 2} ${Math.min(B[1], B[3]) - 7} ${sx * B[2]} ${B[3]} Q${sx * (B[0] + B[2]) / 2} ${Math.min(B[1], B[3]) - 1} ${sx * B[0]} ${B[1] + 4} Z`, '#2b1a14', 2.4));
  sh(g, 'M-8 24 Q0 36 9 25', null, 3.6); ell(g, 4, 26, 6, 3, 'rgba(255,230,200,.35)');
  const my = 66;
  if (talk > .04 || ex === 'shout') { const op = Math.max(talk, ex === 'shout' ? .6 : 0), w = ex === 'shout' ? 30 : 22;
    sh(g, `M${-w} ${my - 4} Q0 ${my - 10} ${w} ${my - 4} Q${w * .9} ${my + 8 + op * 40} 0 ${my + 10 + op * 44} Q${-w * .9} ${my + 8 + op * 40} ${-w} ${my - 4} Z`, '#4a1418', 4);
    sh(g, `M${-w * .7} ${my - 3} Q0 ${my - 7} ${w * .7} ${my - 3} L${w * .6} ${my + 3} Q0 ${my} ${-w * .6} ${my + 3} Z`, '#fbf6ee'); ell(g, 0, my + 6 + op * 32, w * .5, 6 + op * 7, '#e06a64'); }
  else if (ex === 'shock') ell(g, 0, my + 10, 13, 18, '#4a1418', 4);
  else if (ex === 'sad' || ex === 'worry') line(g, [-22, my + 10, 0, my - 2, 22, my + 10], 5);
  else if (ex === 'sheepish') line(g, [-22, my + 4, -8, my - 2, 6, my + 6, 22, my], 5);
  else if (ex === 'happy') { sh(g, `M-34 ${my - 6} Q0 ${my + 46} 34 ${my - 6} Q0 ${my + 4} -34 ${my - 6} Z`, '#4a1418', 4); sh(g, `M-26 ${my - 3} Q0 ${my + 4} 26 ${my - 3} L22 ${my + 4} Q0 ${my + 8} -22 ${my + 4} Z`, '#fbf6ee'); ell(g, 0, my + 22, 12, 7, '#e06a64'); }
  else if (ex === 'annoyed') line(g, [-18, my + 4, 18, my + 4], 5);
  else line(g, [-24, my, 0, my + 14, 24, my], 5);
  if (o.tear) { const k = (t * .8) % 1; ell(g, -60, 30 + k * 60, 7, 10, rg(g, -62, 26 + k * 60, 1, 10, [[0, '#ffffff'], [1, 'rgba(150,200,235,.9)']]), 2.4); }
  g.restore();
  g.restore();
};
donkey = function (g, o) {
  const C = o.c || SELAH, t = o.t || 0, pose = o.pose || 'stand', talk = o.talk || 0, ex = o.expr || 'calm';
  const body = C.body, bodyD = C.bodyD, bodyL = mix(C.body, '#ffffff', .1);
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = Math.sin(t * 1.9 + (o.ph || 0)), walk = o.walk ? t * (o.walkRate || 4.5) : null;
  const P = pose === 'stand' ? { b: [-15, -262, 200, 112, 0], neck: [[80, -350], [150, -235]], head: [200, -470 + br * 3, .02 * br + (o.headRot || 0)] }
    : pose === 'sit' ? { b: [-50, -250, 195, 116, -.36], neck: [[60, -400], [120, -280]], head: [180, -565 + br * 3, -.12 + (o.headRot || 0)] }
    : { b: [-30, -118, 210, 100, 0], neck: [[110, -170], [170, -70]], head: [240, -240 + br * 2, .32 + (o.headRot || 0)] };
  g.fillStyle = rg(g, 0, 0, 10, 280, [[0, 'rgba(30,15,20,.3)'], [1, 'rgba(30,15,20,0)']]); g.beginPath(); g.ellipse(pose === 'lie' ? -20 : 0, 4, 280, 26, 0, 0, 7); g.fill();
  const hoof = '#2e2622';
  const leg = (x0, y0, x1, y1, col, phs) => { let dx = 0, dy = 0; if (walk != null) { dx = Math.sin(walk + phs) * 26; dy = -Math.max(0, Math.cos(walk + phs)) * 16; }
    const kx = x0 + (x1 - x0) * .5 + dx * .4 + 6, ky = (y0 + y1) / 2;
    taper(g, x0, y0, kx, ky, 54, 34, col); taper(g, kx, ky, x1 + dx, y1 + dy - 14, 34, 28, col);
    sh(g, `M${x1 + dx - 20} ${y1 + dy - 18} L${x1 + dx + 20} ${y1 + dy - 18} L${x1 + dx + 24} ${y1 + dy + 6} L${x1 + dx - 24} ${y1 + dy + 6} Z`, lg(g, 0, y1 + dy - 18, 0, y1 + dy + 6, [[0, '#4a3e38'], [1, hoof]]), 3.4);
  };
  const tw = Math.sin(t * 2.6 + 1) * 14;
  if (pose === 'stand') { taper(g, -205, -310, -228 + tw * .6, -220, 14, 10, bodyD); taper(g, -228 + tw * .6, -220, -228 + tw, -158, 10, 8, bodyD);
    sh(g, `M${-236 + tw} -172 Q${-246 + tw} -140 ${-232 + tw} -112 Q${-222 + tw} -140 ${-220 + tw} -172 Z`, C.mane, 3.4); }
  if (pose === 'stand') { leg(-120, -230, -125, -14, bodyD, 2.8); leg(120, -230, 128, -14, bodyD, .6); }
  if (pose === 'sit') leg(110, -280, 104, -14, bodyD, 0);
  // body: barrel with chest and haunch bulges, belly lighter, fur strokes, the dark cross
  g.save(); g.translate(P.b[0], P.b[1]); g.rotate(P.b[4]);
  const bw = P.b[2], bh = P.b[3];
  const torso = `M${-bw} ${-bh * .2} C${-bw} ${-bh * 1.05} ${-bw * .3} ${-bh * 1.02} ${bw * .2} ${-bh * .98} C${bw * .8} ${-bh * .96} ${bw * 1.05} ${-bh * .6} ${bw} ${-bh * .05} C${bw * .98} ${bh * .7} ${bw * .5} ${bh * 1.0} 0 ${bh * .98} C${-bw * .55} ${bh * 1.0} ${-bw * 1.02} ${bh * .75} ${-bw} ${-bh * .2} Z`;
  sh(g, torso, rg(g, -bw * .2, -bh * .6, 20, bw * 1.3, [[0, bodyL], [.55, body], [1, bodyD]]), 5);
  g.save(); g.clip(path(torso));
  sh(g, `M${-bw * .7} ${bh * .45} Q0 ${bh * 1.1} ${bw * .7} ${bh * .4} Q0 ${bh * .72} ${-bw * .7} ${bh * .45} Z`, C.belly);
  ell(g, -bw * .62, -bh * .1, bw * .32, bh * .6, 'rgba(0,0,0,.06)');
  g.restore();
  if (C.saddle) { sh(g, `M-90 -${bh - 4} Q0 -${bh + 22} 90 -${bh - 4} L80 10 Q0 30 -80 10 Z`, lg(g, 0, -bh, 0, 20, [[0, '#c04a34'], [1, '#8a2a1e']]), 4); pattern(g, -84, 84, -4, 14, '#e5b74a', 'zig'); }
  sh(g, torso, null, 5);
  g.restore();
  if (pose === 'sit') { sh(g, 'M-250 -110 C-250 -190 -150 -200 -90 -150 C-60 -110 -70 -40 -120 -16 L-230 -16 C-260 -40 -262 -80 -250 -110 Z', lg(g, 0, -190, 0, -10, [[0, body], [1, bodyD]]), 4.5); sh(g, 'M-236 -30 Q-140 -12 -40 -20 L-36 -2 Q-140 10 -240 -6 Z', bodyD, 4); sh(g, 'M-58 -26 L-12 -26 L-10 -2 L-60 -2 Z', hoof, 4); taper(g, -238, -110, -262, -24, 12, 9, bodyD); }
  if (pose === 'lie') { sh(g, 'M40 -40 Q140 -30 230 -24 L232 -4 Q140 4 40 -8 Z', bodyD, 4); sh(g, 'M-200 -50 Q-120 -20 -20 -18 L-20 2 Q-120 4 -206 -24 Z', bodyD, 4); taper(g, -236, -120, -262, -24, 12, 9, bodyD); }
  if (pose === 'stand') { leg(-150, -220, -158, -12, body, 0); leg(90, -220, 96, -12, body, 3.6); }
  if (pose === 'sit') leg(70, -290, 72, -12, body, 0);
  // neck
  const [hx, hy, hr] = P.head, hp = (x, y) => [hx + x * Math.cos(hr) - y * Math.sin(hr), hy + x * Math.sin(hr) + y * Math.cos(hr)];
  const a = hp(-10, -60), b = hp(70, 70), [n1, n2] = P.neck;
  const neck = `M${n1[0]} ${n1[1]} C${(n1[0] + a[0]) / 2 - 10} ${(n1[1] + a[1]) / 2 - 20} ${a[0] - 20} ${a[1]} ${a[0]} ${a[1]} L${b[0]} ${b[1]} C${b[0] - 30} ${b[1] + 40} ${n2[0] + 30} ${n2[1] - 20} ${n2[0]} ${n2[1]} Z`;
  sh(g, neck, lg(g, n1[0], 0, b[0], 0, [[0, body], [.6, bodyL], [1, bodyD]]), 5);
  { const cx = (n1[0] + a[0]) / 2 - 22, cy = (n1[1] + a[1]) / 2 - 26; line(g, [n1[0] - 4, n1[1] + 6, cx, cy, a[0] + 8, a[1] - 2], 36, INK, 'round', true); line(g, [n1[0] - 4, n1[1] + 6, cx, cy, a[0] + 8, a[1] - 2], 30, C.mane, 'round', true);
    for (let i = 2; i < 12; i += 3) { const k = i / 12, x = (1 - k) * (1 - k) * (n1[0] - 4) + 2 * k * (1 - k) * cx + k * k * (a[0] + 8), y = (1 - k) * (1 - k) * (n1[1] + 6) + 2 * k * (1 - k) * cy + k * k * (a[1] - 2); line(g, [x, y, x - 20, y - 20 - Math.sin(t * 2 + i) * 3], 6, C.mane, 'round', true); } }
  // head
  const nodS = (o.talk || 0) * (.05 * Math.sin(t * 7.9 + (o.ph || 0)) + .02) + .02 * Math.sin(t * .6 + (o.ph || 0) * 1.9);
  g.save(); g.translate(hx, hy - (o.talk || 0) * 5); g.rotate(hr + nodS);
  const ew = Math.sin(t * 1.3 + (o.ph || 0)) * .06 + (o.ears || 0);
  const ear = (bx, by, ang, len, front) => { g.save(); g.translate(bx, by); g.rotate(ang + ew);
    sh(g, `M-22 0 C-34 ${-len * .45} -20 ${-len * .9} 0 ${-len} C20 ${-len * .9} 30 ${-len * .45} 20 0 Z`, lg(g, -22, 0, 22, 0, [[0, front ? body : bodyD], [1, front ? bodyL : body]]), 4.5);
    sh(g, `M-11 -12 C-18 ${-len * .45} -10 ${-len * .8} 0 ${-len * .88} C10 ${-len * .8} 16 ${-len * .45} 10 -12 Z`, lg(g, 0, 0, 0, -len, [[0, '#c99a84'], [1, '#e8c4ae']]));
    sh(g, `M-8 ${-len * .86} C-4 ${-len * .98} 4 ${-len * .98} 8 ${-len * .86} L0 ${-len} Z`, C.mane); g.restore(); };
  ear(30, -66, -.35, 190, false);
  const skull = 'M-30 -40 C-10 -90 90 -90 150 -40 C200 0 210 60 186 96 C160 128 110 126 80 110 C30 86 -20 50 -36 6 Z';
  sh(g, skull, rg(g, 40, -50, 10, 220, [[0, bodyL], [.6, body], [1, bodyD]]), 5);
  ear(64, -70, -.12, 200, true);
  // forelock
  { const w = Math.sin(t * 2) * 3; sh(g, `M40 -78 Q58 -98 80 -80 Q86 ${-62 + w} 74 ${-50 + w} Q66 -66 56 -62 Q50 -72 40 -78 Z`, C.mane, 3); }
  // muzzle + jaw
  const jaw = talk * .32 + (o.jaw || 0);
  g.save(); g.translate(108, 82); g.rotate(jaw); sh(g, 'M0 0 Q30 28 70 22 Q88 14 84 0 Z', C.muzzle, 4); g.restore();
  if (jaw > .05) ell(g, 150, 84, 26, 8 + jaw * 30, '#4a1e1a', 3, .1);
  sh(g, 'M96 34 C110 8 170 4 196 30 C214 54 204 96 172 104 C140 110 104 98 96 70 Z', lg(g, 100, 10, 200, 104, [[0, '#f2ebe0'], [1, '#c9bba8']]), 4.4);
  sh(g, 'M168 40 Q184 46 180 64', null, 4); ell(g, 176, 52, 5, 10, '#3a2a24', 0, .4);
  line(g, [116, 92, 148, 100, 178, 88], 4);
  // (halter removed: read as a stray strap across her face)
  if (C.bell) { line(g, [70, 104, 66, 128], 3, '#8a6a2a', 'round', true); ell(g, 66, 142, 16, 16, rg(g, 60, 136, 2, 18, [[0, '#fff2b8'], [1, '#c0902a']]), 3.4); ell(g, 66, 152, 4, 3, '#5a3a14'); }
  // eye with lashes and iris
  const blink = ((t * .5 + (o.ph || 0) * .3) % 4.3) < .12;
  g.save(); g.translate(36, -18);
  if (ex === 'smile' || ex === 'happy' || blink) { line(g, [-20, 2, 0, ex === 'smile' || ex === 'happy' ? -12 : 4, 20, 2], 5);  }
  else { const wide = ex === 'wide' || ex === 'fear', er = wide ? 32 : 27;
    ell(g, 0, 0, er, er * 1.08, lg(g, 0, -er, 0, er, [[0, '#ffffff'], [1, '#ebe2d4']]), 4);
    const glS = Math.floor(t * .5 + (o.ph || 0) * 2.7), gS = ((((glS * 9301 + 49297) % 233280) / 233280) - .5) * 2, [lx0, ly] = o.look || [.3, 0], lx = clamp(lx0 + gS * .3, -1, 1), ix = lx * 8, iy = ly * 7 + 3, ir = wide ? 11 : 16;
    ell(g, ix, iy, ir, ir * 1.06, rg(g, ix, iy, 2, ir, [[0, '#7a4a2a'], [.7, '#3a2214'], [1, '#160c08']])); ell(g, ix, iy, ir * .5, ir * .55, '#0e0806'); ell(g, ix + 6, iy - 5, 5.5, 5.5, '#fff');
    if (o.eyeGlow) { glow(g, ix, iy, 26, 'rgba(255,214,120,1)', o.eyeGlow); ell(g, ix - 2, iy + 4, 3 + 3 * o.eyeGlow, 6 + 4 * o.eyeGlow, `rgba(255,236,170,${o.eyeGlow})`); }
    const lid = { calm: .3, smug: .4, sad: .38, wide: 0, fear: 0, hurt: .24 }[ex] ?? .3;
    if (lid > 0) { const ly2 = -er + lid * er * 2.1, droop = ex === 'sad' || ex === 'hurt'; sh(g, `M${-er - 5} ${-er - 8} L${er + 5} ${-er - 8} L${er + 5} ${ly2 + (droop ? 8 : 0)} Q0 ${ly2 + 8} ${-er - 5} ${ly2 - (droop ? 6 : 0)} Z`, body); line(g, [-er - 2, ly2 - (droop ? 5 : 0), 0, ly2 + 7, er + 2, ly2 + (droop ? 7 : 0)], 5); }
    if (ex === 'sad' || ex === 'hurt' || o.tear) { const k = (t * .6) % 1; ell(g, 10, 30 + k * 50, 6, 9, rg(g, 8, 28 + k * 50, 1, 9, [[0, '#fff'], [1, 'rgba(160,210,240,.95)']]), 2.4); } }
  const bro = { calm: [-26, -40, 22, -34], smug: [-26, -36, 22, -40], sad: [-26, -34, 22, -46], hurt: [-26, -34, 22, -46], wide: [-26, -52, 22, -52], fear: [-26, -48, 22, -56], smile: [-26, -40, 22, -40], happy: [-26, -40, 22, -40] }[ex] || [-26, -40, 22, -34];
  sh(g, `M${bro[0]} ${bro[1]} Q${(bro[0] + bro[2]) / 2} ${Math.min(bro[1], bro[3]) - 8} ${bro[2]} ${bro[3]} Q${(bro[0] + bro[2]) / 2} ${Math.min(bro[1], bro[3]) - 2} ${bro[0]} ${bro[1] + 5} Z`, mix(C.mane, '#000', .1), 2.2);
  g.restore();
  if (o.mouthGlow) glow(g, 160, 92, 180, 'rgba(255,215,120,1)', o.mouthGlow);
  g.restore();
  g.restore();
};
