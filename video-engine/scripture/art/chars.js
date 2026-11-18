// Characters. Every draw fn takes (g, o) with o.x, o.y = feet position, o.s = scale, o.flip (face left), o.t = time,
// o.expr, o.talk (0..1 mouth from the voice envelope), o.look [x,y] (-1..1).
// ---------------- TOBY: shepherd boy, big round head, curls, striped headband, ochre tunic ----------------
const TOBY = { skin: '#c3814f', skinD: '#a5653a', hair: '#2b1a12', tunic: '#d98b3c', tunicD: '#b06a2a', stripe: '#8e4720', band: '#f2eadb', bandStripe: '#3f62a6' };
function toby(g, o) {
  const C = TOBY, t = o.t || 0, ex = o.expr || 'neutral', talk = o.talk || 0, [lx, ly] = o.look || [0, 0];
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = 1 + .012 * Math.sin(t * 2.2 + (o.ph || 0)), hop = o.hop ? -Math.abs(Math.sin(t * 9)) * 18 * o.hop : 0;
  g.translate(0, hop);
  // shadow
  ell(g, 0, 2, 120, 16, 'rgba(40,20,10,.28)');
  // legs + sandals
  if (!o.noLegs) { limb(g, [-30, -100, -32, -54, -36, -16], 30, C.skin, 6); limb(g, [30, -100, 32, -54, 36, -16], 30, C.skin, 6);
  ell(g, -42, -8, 34, 13, '#5c3520', 5); ell(g, 42, -8, 34, 13, '#5c3520', 5);
  line(g, [-56, -18, -30, -30], 5, '#5c3520'); line(g, [56, -18, 30, -30], 5, '#5c3520'); }
  else { limb(g, [20, -100, 60, -40, 70, 30], 30, C.skin, 6); }
  g.save(); g.scale(1, br); g.translate(0, (1 - br) * 100);
  const hands = { down: [[-92, -150], [92, -150]], up: [[-140, -430], [140, -430]], mouth: [[-60, -330], [60, -330]], hips: [[-104, -190], [104, -190]],
    point: [[-92, -150], [190, -330]], rope: [[-92, -150], [175, -205]], hug: [[-40, -230], [190, -260]], shrug: [[-150, -250], [150, -250]], chin: [[-92, -150], [30, -318]] };
  let [hl, hr] = o.hands ? (hands[o.hands] || o.hands) : hands.down;
  if (o.sling) { const an = t * 16; hr = [120 + Math.cos(an) * 26, -480 + Math.sin(an) * 10]; }
  const sw = Math.sin(t * 1.7 + (o.ph || 0)) * 5;
  const arm = (sx, h, s) => { const mx = (sx + h[0]) / 2 + s * 26, my = (-262 + h[1]) / 2 + 18; limb(g, [sx, -262, mx, my, h[0] + sw * s, h[1]], 24, C.skin, 6); ell(g, h[0] + sw * s, h[1], 19, 19, C.skin, 5); };
  arm(-58, hl, -1);
  // tunic
  sh(g, 'M-80 -94 C-94 -160 -90 -238 -60 -284 L60 -284 C90 -238 94 -160 80 -94 Q0 -80 -80 -94 Z', lg(g, -80, 0, 80, 0, [[0, C.tunic], [.7, C.tunic], [1, C.tunicD]]), 6);
  line(g, [-30, -282, -36, -92], 12, C.stripe); line(g, [30, -282, 36, -92], 12, C.stripe);
  sh(g, 'M-80 -94 Q0 -80 80 -94 L82 -112 Q0 -98 -82 -112 Z', C.stripe);
  line(g, [-84, -172, 0, -160, 84, -172], 11, '#ead6a8'); line(g, [-84, -172, 0, -160, 84, -172], 2.5, INK);
  arm(58, hr, 1);
  if (o.sling) { const an = t * 16, sx = hr[0] + Math.cos(an) * 150, sy = hr[1] - 30 + Math.sin(an) * 60; g.save(); g.globalAlpha = .4; g.beginPath(); g.ellipse(hr[0], hr[1] - 30, 150, 60, 0, 0, Math.PI * 2); g.lineWidth = 4; g.strokeStyle = '#fff6dc'; g.stroke(); g.restore(); line(g, [hr[0], hr[1], (hr[0] + sx) / 2, (hr[1] + sy) / 2 + 18, sx, sy], 5, '#6a4a2a'); ell(g, sx, sy, 15, 15, '#cfc6ba', 4); }
  if (o.staff) { const h = hr; limb(g, [h[0] + 6, h[1] - 230, h[0] + 6, h[1] + 120], 11, '#7a5432', 5); }
  g.restore();
  // head
  g.save(); g.translate(0, -400 + (1 - br) * 300); if (o.tilt) g.rotate(o.tilt);
  sh(g, 'M-24 96 L24 96 L20 120 L-20 120 Z', C.skin, 5);
  ell(g, -116, 6, 22, 26, C.skin, 5); ell(g, 116, 6, 22, 26, C.skin, 5);
  // back curls
  [[-96, -40, 40], [-60, -92, 44], [-8, -112, 46], [48, -96, 44], [92, -50, 40], [-108, 6, 30], [106, 2, 30]].forEach(([x, y, r]) => ell(g, x, y, r, r, C.hair, 5));
  ell(g, 0, 0, 116, 112, lg(g, -116, 0, 116, 0, [[0, C.skin], [.75, C.skin], [1, C.skinD]]), 6);
  // fringe curls + headband
  [[-70, -78, 22], [-36, -92, 24], [4, -96, 24], [42, -90, 22], [74, -74, 20]].forEach(([x, y, r]) => ell(g, x, y, r, r, C.hair, 4));
  line(g, [-114, -46, 0, -88, 114, -46], 26, INK); line(g, [-114, -46, 0, -88, 114, -46], 18, C.band); line(g, [-112, -46, 0, -86, 112, -46], 4, C.bandStripe);
  limb(g, [112, -44, 140, -20, 150, 30], 9, C.band, 4); limb(g, [110, -40, 150, -30, 170, 6], 8, C.band, 4);
  ell(g, -72, 52, 22, 13, 'rgba(224,110,80,.35)'); ell(g, 72, 52, 22, 13, 'rgba(224,110,80,.35)');
  [[-62, 40], [-74, 50], [-60, 56], [62, 40], [74, 50], [60, 56]].forEach(([x, y]) => ell(g, x, y, 2.6, 2.6, '#8a4a2a'));
  // eyes
  const blink = ((t * .63 + (o.ph || 0)) % 3.7) < .1 && ex !== 'happy';
  const er = ex === 'shock' ? [33, 40] : [30, 36];
  [-42, 42].forEach(cx => {
    if (blink || ex === 'happy') { line(g, [cx - 24, 0, cx, ex === 'happy' ? -16 : 2, cx + 24, 0], 6); return; }
    ell(g, cx, 0, er[0], er[1], '#fbf6ec', 5);
    const pr = ex === 'shock' ? 8 : 13; ell(g, cx + lx * 12, 2 + ly * 12, pr, pr * 1.1, INK); ell(g, cx + lx * 12 + 4, -4 + ly * 12, 4, 4, '#fff');
    if (ex === 'annoyed') sh(g, `M${cx - 33} -40 L${cx + 33} -40 L${cx + 33} 0 Q${cx} -6 ${cx - 33} 0 Z`, C.skin, 0), line(g, [cx - 32, 0, cx, -5, cx + 32, 0], 5);
  });
  // brows
  const B = { neutral: [-56, -52, -24, -54], shout: [-62, -60, -22, -44], worry: [-62, -50, -24, -64], shock: [-60, -66, -24, -70], sad: [-60, -50, -22, -62],
    happy: [-60, -56, -24, -60], sheepish: [-60, -52, -24, -64], annoyed: [-60, -46, -24, -46] }[ex] || [-56, -52, -24, -54];
  line(g, [B[0], B[1], B[2], B[3]], 7); line(g, [-B[0], B[1], -B[2], B[3]], 7);
  line(g, [-8, 26, 0, 34, 8, 26], 5);
  // mouth
  const my = 66;
  if (talk > .04 || ex === 'shout') {
    const op = Math.max(talk, ex === 'shout' ? .6 : 0), w = ex === 'shout' ? 30 : 22;
    sh(g, `M${-w} ${my - 4} Q0 ${my - 10} ${w} ${my - 4} Q${w * .9} ${my + 8 + op * 40} 0 ${my + 10 + op * 44} Q${-w * .9} ${my + 8 + op * 40} ${-w} ${my - 4} Z`, '#5a1f1a', 5);
    ell(g, 0, my + 6 + op * 30, w * .5, 6 + op * 6, '#d9605a');
  } else if (ex === 'shock') ell(g, 0, my + 10, 13, 18, '#5a1f1a', 5);
  else if (ex === 'sad' || ex === 'worry') line(g, [-22, my + 10, 0, my - 2, 22, my + 10], 6);
  else if (ex === 'sheepish') line(g, [-22, my + 4, -8, my - 2, 6, my + 6, 22, my], 6);
  else if (ex === 'happy') { sh(g, `M-34 ${my - 6} Q0 ${my + 46} 34 ${my - 6} Q0 ${my + 4} -34 ${my - 6} Z`, '#5a1f1a', 5); }
  else if (ex === 'annoyed') line(g, [-18, my + 4, 18, my + 4], 6);
  else line(g, [-24, my, 0, my + 14, 24, my], 6);
  if (o.tear) { const k = (t * .8) % 1; ell(g, -60, 30 + k * 60, 7, 10, 'rgba(160,210,240,.9)', 3); }
  g.restore();
  g.restore();
}
// ---------------- DONKEY (Selah, and Balaam's donkey via colour opts) ----------------
const SELAH = { body: '#8e837a', bodyD: '#6f665e', belly: '#d8cfc4', muzzle: '#ddd3c7', mane: '#3b322c', cross: '#4d443d', ear: '#d6b2a0', halter: '#b8452e', bell: true };
const ASS = { body: '#9a7556', bodyD: '#7a5a40', belly: '#e0c9ab', muzzle: '#e6d6c0', mane: '#3d2a1e', cross: '#4b3424', ear: '#d9a98c', halter: '#6b4a2e', bell: false, saddle: true };
function donkey(g, o) {
  const C = o.c || SELAH, t = o.t || 0, pose = o.pose || 'stand', talk = o.talk || 0, ex = o.expr || 'calm';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = Math.sin(t * 1.9 + (o.ph || 0));
  const walk = o.walk ? t * (o.walkRate || 4.5) : null;
  const P = pose === 'stand' ? { b: [-15, -262, 200, 112, 0], neck: [[80, -350], [150, -235]], head: [200, -470 + br * 3, .02 * br + (o.headRot || 0)] }
    : pose === 'sit' ? { b: [-50, -250, 195, 116, -.36], neck: [[60, -400], [120, -280]], head: [180, -565 + br * 3, -.12 + (o.headRot || 0)] }
    : { b: [-30, -118, 210, 100, 0], neck: [[110, -170], [170, -70]], head: [240, -240 + br * 2, .32 + (o.headRot || 0)] };
  ell(g, pose === 'lie' ? -20 : 0, 2, 270, 22, 'rgba(40,20,10,.25)');
  const legW = 44, hoof = '#2e2622';
  const leg = (x0, y0, x1, y1, col, ph) => { let dx = 0, dy = 0; if (walk != null) { dx = Math.sin(walk + ph) * 26; dy = -Math.max(0, Math.cos(walk + ph)) * 16; }
    limb(g, [x0, y0, x0 + (x1 - x0) * .5 + dx * .4, (y0 + y1) / 2, x1 + dx, y1 + dy], legW, col, 6); sh(g, `M${x1 + dx - 24} ${y1 + dy - 6} L${x1 + dx + 24} ${y1 + dy - 6} L${x1 + dx + 26} ${y1 + dy + 8} L${x1 + dx - 26} ${y1 + dy + 8} Z`, hoof, 5); };
  // tail
  const tw = Math.sin(t * 2.6 + 1) * 14;
  if (pose === 'stand') { limb(g, [-205, -300, -240, -240, -228 + tw, -150], 12, C.bodyD, 5); ell(g, -228 + tw, -135, 15, 30, C.mane, 5, .2); }
  if (pose === 'stand') { leg(-120, -230, -125, -14, C.bodyD, 2.8); leg(120, -230, 128, -14, C.bodyD, .6); }
  if (pose === 'sit') { leg(110, -280, 104, -14, C.bodyD, 0); }
  // body
  g.save(); g.translate(P.b[0], P.b[1]); g.rotate(P.b[4]);
  ell(g, 0, 0, P.b[2], P.b[3], lg(g, 0, -P.b[3], 0, P.b[3], [[0, C.body], [.65, C.body], [1, C.bodyD]]), 6);
  sh(g, `M${-P.b[2] * .55} ${P.b[3] * .55} Q0 ${P.b[3] * 1.02} ${P.b[2] * .6} ${P.b[3] * .5} Q0 ${P.b[3] * .75} ${-P.b[2] * .55} ${P.b[3] * .55} Z`, C.belly);
  line(g, [P.b[2] * .45, -P.b[3] * .92, 0, -P.b[3] * 1.04, -P.b[2] * .85, -P.b[3] * .55], 13, hexA(C.cross, .55));
  line(g, [P.b[2] * .42, -P.b[3] * .9, P.b[2] * .52, -P.b[3] * .2, P.b[2] * .38, P.b[3] * .3], 11, hexA(C.cross, .45));
  if (C.saddle) { sh(g, `M-90 -${P.b[3] - 4} Q0 -${P.b[3] + 22} 90 -${P.b[3] - 4} L80 10 Q0 30 -80 10 Z`, '#a33a2a', 5); line(g, [-84, 2, 0, 22, 84, 2], 7, '#e5b74a'); }
  ell(g, 0, 0, P.b[2], P.b[3], null, 6);
  g.restore();
  if (pose === 'sit') { ell(g, -150, -95, 98, 82, lg(g, 0, -170, 0, 0, [[0, C.body], [1, C.bodyD]]), 6); sh(g, 'M-230 -30 Q-140 -10 -40 -20 L-36 -2 Q-140 10 -236 -6 Z', C.bodyD, 5); sh(g, 'M-58 -26 L-12 -26 L-10 -2 L-60 -2 Z', hoof, 5); limb(g, [-238, -110, -270, -80, -258, -20], 12, C.bodyD, 5); }
  if (pose === 'lie') { sh(g, 'M40 -40 Q140 -30 230 -24 L232 -4 Q140 4 40 -8 Z', C.bodyD, 5); sh(g, 'M-200 -50 Q-120 -20 -20 -18 L-20 2 Q-120 4 -206 -24 Z', C.bodyD, 5); limb(g, [-236, -120, -270, -80, -262, -24], 12, C.bodyD, 5); }
  if (pose === 'stand') { leg(-150, -220, -158, -12, C.body, 0); leg(90, -220, 96, -12, C.body, 3.6); }
  if (pose === 'sit') { leg(70, -290, 72, -12, C.body, 0); }
  // neck + head
  const [hx, hy, hr] = P.head, hp = (x, y) => [hx + x * Math.cos(hr) - y * Math.sin(hr), hy + x * Math.sin(hr) + y * Math.cos(hr)];
  const a = hp(-10, -60), b = hp(70, 70), [n1, n2] = P.neck;
  sh(g, `M${n1[0]} ${n1[1]} C${(n1[0] + a[0]) / 2 - 10} ${(n1[1] + a[1]) / 2 - 20} ${a[0] - 20} ${a[1]} ${a[0]} ${a[1]} L${b[0]} ${b[1]} C${b[0] - 30} ${b[1] + 40} ${n2[0] + 30} ${n2[1] - 20} ${n2[0]} ${n2[1]} Z`, lg(g, n1[0], 0, b[0], 0, [[0, C.body], [1, C.bodyD]]), 6);
  // mane tufts along the neck crest
  { const cx = (n1[0] + a[0]) / 2 - 22, cy = (n1[1] + a[1]) / 2 - 26; line(g, [n1[0] - 4, n1[1] + 6, cx, cy, a[0] + 8, a[1] - 2], 40, INK); line(g, [n1[0] - 4, n1[1] + 6, cx, cy, a[0] + 8, a[1] - 2], 28, C.mane);
    for (let i = 1; i < 7; i++) { const k = i / 7, x = (1 - k) * (1 - k) * (n1[0] - 4) + 2 * k * (1 - k) * cx + k * k * (a[0] + 8), y = (1 - k) * (1 - k) * (n1[1] + 6) + 2 * k * (1 - k) * cy + k * k * (a[1] - 2); line(g, [x, y, x - 22, y - 18 - Math.sin(t * 2 + i) * 3], 9, C.mane); } }
  g.save(); g.translate(hx, hy); g.rotate(hr);
  const ew = Math.sin(t * 1.3 + (o.ph || 0)) * .06 + (o.ears || 0);
  const ear = (bx, by, ang, len) => { g.save(); g.translate(bx, by); g.rotate(ang + ew); sh(g, `M-22 0 C-34 ${-len * .45} -20 ${-len * .9} 0 ${-len} C20 ${-len * .9} 30 ${-len * .45} 20 0 Z`, C.body, 6); sh(g, `M-11 -12 C-18 ${-len * .45} -10 ${-len * .8} 0 ${-len * .88} C10 ${-len * .8} 16 ${-len * .45} 10 -12 Z`, C.ear); sh(g, `M-8 ${-len * .86} C-4 ${-len * .98} 4 ${-len * .98} 8 ${-len * .86} L0 ${-len} Z`, C.mane); g.restore(); };
  ear(30, -66, -.35, 190);
  ell(g, 70, -8, 112, 64, lg(g, 0, -60, 0, 70, [[0, C.body], [1, C.bodyD]]), 6, .5);
  ear(64, -70, -.12, 200);
  // muzzle + jaw
  const jaw = talk * .32 + (o.jaw || 0);
  g.save(); g.translate(108, 82); g.rotate(jaw); sh(g, 'M0 0 Q30 28 70 22 Q88 14 84 0 Z', C.muzzle, 5); if (jaw > .05) sh(g, 'M6 2 Q40 16 78 4', null, 0); g.restore();
  if (jaw > .05) ell(g, 150, 84, 26, 8 + jaw * 30, '#4a1e1a', 4, .1);
  ell(g, 146, 54, 58, 52, C.muzzle, 6, .2);
  sh(g, 'M168 40 Q184 46 180 64', null, 6); ell(g, 176, 52, 5, 10, '#3a2a24', 0, .4);
  line(g, [112, 88, 145, 98, 176, 86], 5);
  // halter
  if (C.halter) { g.save(); g.beginPath(); g.ellipse(146, 54, 60, 54, .2, -2.1, 1.3); g.lineWidth = 12; g.strokeStyle = C.halter; g.stroke(); g.restore(); line(g, [88, 2, 60, -40, 30, -70], 11, C.halter); }
  if (C.bell) { line(g, [70, 104, 66, 128], 4, '#8a6a2a'); ell(g, 66, 140, 16, 16, '#e0b648', 5); ell(g, 60, 134, 5, 5, '#fff3c4'); }
  // eye
  const blink = ((t * .5 + (o.ph || 0) * .3) % 4.3) < .12;
  g.save(); g.translate(36, -18);
  if (ex === 'smile' || ex === 'happy' || blink) { line(g, [-20, 2, 0, ex === 'smile' || ex === 'happy' ? -12 : 4, 20, 2], 6); }
  else {
    const wide = ex === 'wide' || ex === 'fear', er = wide ? 32 : 27;
    ell(g, 0, 0, er, er * 1.08, '#fbf6ee', 5);
    const [lx, ly] = o.look || [.3, 0]; ell(g, lx * 8, ly * 7 + 3, wide ? 11 : 16, wide ? 12 : 17, '#22160f'); ell(g, lx * 8 + 6, ly * 7 - 4, 6, 6, '#fff');
    if (o.eyeGlow) { glow(g, lx * 7, ly * 6 + 2, 26, 'rgba(255,214,120,1)', o.eyeGlow); ell(g, lx * 7 - 2, ly * 6 + 4, 3 + 3 * o.eyeGlow, 6 + 4 * o.eyeGlow, `rgba(255,236,170,${o.eyeGlow})`); }
    const lid = { calm: .3, smug: .4, sad: .38, wide: 0, fear: 0, hurt: .24 }[ex] ?? .3;
    if (lid > 0) { const ly2 = -er + lid * er * 2.1; sh(g, `M${-er - 5} ${-er - 8} L${er + 5} ${-er - 8} L${er + 5} ${ly2 + (ex === 'sad' || ex === 'hurt' ? 8 : 0)} Q0 ${ly2 + 8} ${-er - 5} ${ly2 - (ex === 'sad' || ex === 'hurt' ? 6 : 0)} Z`, C.body, 0); line(g, [-er - 2, ly2 - (ex === 'sad' || ex === 'hurt' ? 5 : 0), 0, ly2 + 7, er + 2, ly2 + (ex === 'sad' || ex === 'hurt' ? 7 : 0)], 6); }
    [[-14, -er * (1 - lid * 2) - 2], [0, -er * (1 - lid * 2) - 6], [14, -er * (1 - lid * 2) - 2]].forEach(([x, y], i) => line(g, [x, y + (lid ? lid * er * 2 - 4 : 0), x + (i - 1) * 6 - 4, y - 14 + (lid ? lid * er * 2 - 4 : 0)], 4));
    if (ex === 'sad' || ex === 'hurt' || o.tear) { const k = (t * .6) % 1; ell(g, 10, 30 + k * 50, 6, 9, 'rgba(160,210,240,.95)', 3); }
  }
  const bro = { calm: [-26, -40, 22, -34], smug: [-26, -36, 22, -40], sad: [-26, -34, 22, -46], hurt: [-26, -34, 22, -46], wide: [-26, -52, 22, -52], fear: [-26, -48, 22, -56], smile: [-26, -40, 22, -40], happy: [-26, -40, 22, -40] }[ex] || [-26, -40, 22, -34];
  line(g, bro, 6);
  g.restore();
  if (o.mouthGlow) { glow(g, 160, 92, 180, 'rgba(255,215,120,1)', o.mouthGlow); }
  g.restore();
  g.restore();
}
// ---------------- BALAAM: old seer, grey beard, maroon robe, head cloth, staff ----------------
const BAL = { skin: '#b67a52', skinD: '#94603e', robe: '#6d2a3a', robeD: '#4b1b28', trim: '#e2b552', cloth: '#e7dbc2', clothD: '#c9b893', beard: '#d9d2c6', beardD: '#aaa197', staff: '#7a5432' };
function balaamHead(g, ex, talk, t, o) {
  const C = BAL;
  sh(g, 'M-58 -20 C-70 -90 -20 -118 14 -110 C52 -104 70 -70 66 -30 L80 40 L40 30 L-60 60 Z', C.clothD, 5);
  ell(g, 8, -28, 54, 62, C.skin, 6);
  sh(g, 'M52 -40 Q74 -26 70 -10 Q62 -4 50 -8', C.skin, 5);
  sh(g, 'M-58 -46 C-50 -100 0 -116 30 -104 C60 -94 68 -70 64 -54 L40 -60 C10 -68 -30 -60 -52 -20 Z', C.cloth, 6);
  line(g, [-56, -44, 0, -74, 62, -56], 10, '#8a6a3a');
  // eye
  const blink = ((t * .55 + 1.1) % 3.9) < .1;
  if (ex === 'awe' || ex === 'shock') { ell(g, 34, -30, 11, 12, '#fbf6ec', 4); ell(g, 37, -29, 5, 5, INK); }
  else if (blink || ex === 'shut') line(g, [24, -28, 44, -27], 5);
  else { ell(g, 34, -29, 9, 7, '#fbf6ec', 4); ell(g, 37, -29, 4.5, 4.5, INK); if (ex === 'greedy') { ell(g, 38, -31, 2.5, 2.5, '#ffe9a0'); glow(g, 36, -29, 22, 'rgba(255,210,90,1)', .9); } }
  const B = { angry: [16, -50, 50, -38], pain: [16, -44, 48, -50], awe: [16, -54, 48, -54], shock: [16, -56, 48, -56], greedy: [16, -46, 50, -44], ashamed: [16, -42, 48, -50] }[ex] || [16, -46, 50, -46];
  line(g, B, 8, C.beardD); line(g, B, 4);
  // beard + moustache, mouth inside
  sh(g, 'M-24 0 C-30 40 -10 110 30 150 C40 110 62 60 62 10 C44 22 6 22 -24 0 Z', lg(g, 0, 0, 0, 150, [[0, C.beard], [1, C.beardD]]), 5);
  const op = Math.max(talk, ex === 'angry' ? .3 : 0);
  if (op > .05) ell(g, 40, 22 + op * 6, 12, 4 + op * 16, '#3a1612', 3); else line(g, [28, 24, 52, 22], 4);
  sh(g, 'M14 8 Q40 0 64 12 Q46 18 30 16 Q20 18 14 8 Z', C.beard, 4);
  line(g, [-20, 20, -10, 60], 3, C.beardD); line(g, [8, 40, 16, 100], 3, C.beardD);
}
function balaam(g, o) {
  const C = BAL, t = o.t || 0, ex = o.expr || 'neutral', pose = o.pose || 'stand', talk = o.talk || 0;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = Math.sin(t * 1.8 + (o.ph || 0));
  if (pose === 'prostrate') {
    ell(g, 0, 4, 230, 20, 'rgba(30,15,10,.3)');
    sh(g, 'M-200 0 C-210 -60 -160 -130 -60 -140 C40 -146 110 -100 150 -40 L170 0 Z', lg(g, 0, -140, 0, 0, [[0, C.robe], [1, C.robeD]]), 6);
    line(g, [-200, -2, 170, -2], 10, C.trim);
    sh(g, 'M120 -60 C150 -90 200 -70 216 -30 L222 0 L130 0 Z', C.cloth, 6);
    limb(g, [100, -40, 190, -20, 250, -8], 26, C.robe, 6); ell(g, 262, -10, 18, 12, C.skin, 5);
    g.restore(); return;
  }
  const riding = pose === 'ride';
  if (!riding) { ell(g, 0, 2, 120, 16, 'rgba(40,20,10,.28)'); ell(g, -30, -8, 30, 12, '#4a2c1c', 5); ell(g, 36, -8, 30, 12, '#4a2c1c', 5); }
  const top = riding ? -360 : -470, bot = riding ? -150 : -20;
  // staff behind/held
  const raise = pose === 'raise' ? (o.raiseK ?? 1) : 0, bless = pose === 'bless';
  const hand = raise ? [lerp(100, 60, raise), lerp(top + 140, top - 120, raise)] : bless ? [150, top - 160] : [104, top + 150];
  if (o.staff !== false && !bless) { g.save(); g.translate(hand[0], hand[1]); g.rotate(raise ? lerp(0, -2.3, raise) : 0); limb(g, [0, -260, 0, riding ? 200 : 450], 13, C.staff, 5); g.restore(); }
  // back arm
  if (bless) { limb(g, [-40, top + 40, -120, top - 40, -150, top - 160], 40, C.robeD, 6); ell(g, -150, top - 168, 18, 20, C.skin, 5); }
  // robe
  if (riding) {
    sh(g, `M-80 ${bot} C-92 ${bot - 80} -84 ${top + 40} -64 ${top} L64 ${top} C84 ${top + 40} 92 ${bot - 80} 80 ${bot} Z`, lg(g, -80, 0, 80, 0, [[0, C.robe], [1, C.robeD]]), 6);
    sh(g, `M-40 ${bot} L70 ${bot} L80 ${bot + 120} L30 ${bot + 150} L-10 ${bot + 130} Z`, C.robe, 6); ell(g, 52, bot + 150, 26, 12, '#4a2c1c', 5);
  } else sh(g, `M-96 ${bot} C-112 ${bot - 180} -98 ${top + 90} -70 ${top} L70 ${top} C98 ${top + 90} 112 ${bot - 180} 96 ${bot} Q0 ${bot + 16} -96 ${bot} Z`, lg(g, -96, 0, 96, 0, [[0, C.robe], [.7, C.robe], [1, C.robeD]]), 6);
  if (!riding) line(g, [-96, bot - 6, 0, bot + 8, 96, bot - 6], 9, C.trim);
  sh(g, `M-70 ${top} L10 ${top} L60 ${riding ? bot : top + 300} L20 ${riding ? bot : top + 320} Z`, C.robeD, 0);
  line(g, [-60, top + 8, 40, riding ? bot - 10 : top + 300], 6, C.trim);
  // front arm
  const sx = 50, sy = top + 30;
  limb(g, [sx, sy, (sx + hand[0]) / 2 + 20, (sy + hand[1]) / 2 + 20, hand[0], hand[1]], 40, C.robe, 6); ell(g, hand[0], hand[1], 19, 21, C.skin, 5);
  // head
  g.save(); g.translate(8, top - 74 + br * 2); g.scale(1.25, 1.25); if (o.headRot) g.rotate(o.headRot); balaamHead(g, ex, talk, t, o); g.restore();
  g.restore();
}
// ---------------- ANGEL OF THE LORD: towering, wings, flaming sword ----------------
function angel(g, o) {
  const t = o.t || 0, a = o.alpha ?? 1; if (a <= 0) return;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1); g.globalAlpha *= a;
  glow(g, 0, -760, 900, 'rgba(255,214,140,.9)', .55 * (o.aura ?? 1));
  if (o.rays) rays(g, 0, -900, 1500, 18, 'rgba(255,230,170,.5)', o.rays, t);
  const flap = Math.sin(t * 1.2) * .05;
  // wings: rows of feathers along an arc
  [-1, 1].forEach(sd => { g.save(); g.translate(sd * 50, -880); g.rotate(sd * flap); g.scale(sd, 1);
    const rows = [[560, '#efe2bf', 34], [470, '#f6ecd2', 30], [360, '#fff7e6', 26]];
    rows.forEach(([R, col, fw], ri) => { for (let i = 0; i < 13; i++) { const k = i / 12, an = lerp(-1.25, .95, k), len = R * (0.55 + .45 * Math.sin(k * Math.PI * .95 + .2));
      const x = Math.cos(an) * 60 + 20, y = Math.sin(an) * 60; g.save(); g.translate(x, y); g.rotate(an + .35 - ri * .05); sh(g, `M0 ${-fw} C${len * .5} ${-fw * 1.3} ${len * .9} ${-fw * .6} ${len} 0 C${len * .9} ${fw * .6} ${len * .5} ${fw * 1.3} 0 ${fw} Z`, lg(g, 0, 0, len, 0, [[0, col], [1, '#d8b56a']]), 4, 'rgba(120,80,30,.8)'); g.restore(); } });
    g.restore(); });
  // robe
  sh(g, 'M-170 0 C-190 -300 -150 -700 -90 -880 L90 -880 C150 -700 190 -300 170 0 Q0 30 -170 0 Z', lg(g, 0, -880, 0, 0, [[0, '#fffaf0'], [.6, '#f3e6c8'], [1, '#e2c27a']]), 6, 'rgba(120,80,30,.9)');
  [-80, -20, 40, 100].forEach(x => line(g, [x, -840, x * 1.4, -20], 4, 'rgba(180,140,70,.45)'));
  line(g, [-120, -560, 0, -540, 120, -560], 18, '#e0b648'); line(g, [-170, -6, 0, 24, 170, -6], 14, '#e0b648');
  // arms: left raised open hand (halt), right holding sword
  limb(g, [-80, -840, -200, -760, -260, -900], 46, '#fbf3e0', 5); ell(g, -268, -918, 24, 30, '#e8c39e', 5);
  const sx = 230, sy = -720;
  // sword
  g.save(); g.translate(sx, sy); g.rotate(-.45);
  const L = 640; glow(g, 0, -L * .55, 360, 'rgba(255,170,60,1)', .85);
  for (let i = 0; i < 9; i++) { const k = i / 8, y = -60 - k * (L - 60), fl = 60 + 70 * Math.sin(k * Math.PI) * (0.7 + .3 * Math.sin(t * 9 + i * 1.7)); sh(g, `M-18 ${y} Q${-fl * .7} ${y - fl * .5} ${Math.sin(t * 7 + i) * 10} ${y - fl * 1.4} Q${fl * .7} ${y - fl * .5} 18 ${y} Z`, i % 2 ? 'rgba(255,150,40,.85)' : 'rgba(255,205,90,.9)'); }
  sh(g, `M-28 -40 L-24 ${-L} L0 ${-L - 70} L24 ${-L} L28 -40 Z`, lg(g, -16, 0, 16, 0, [[0, '#fff8e0'], [.5, '#ffffff'], [1, '#f2c96a']]), 4, 'rgba(140,90,20,.9)');
  sh(g, 'M-90 -52 L90 -52 L90 -28 L-90 -28 Z', '#e0b648', 5); sh(g, 'M-10 -30 L10 -30 L10 40 L-10 40 Z', '#7a4f20', 4); ell(g, 0, 48, 14, 14, '#e0b648', 4);
  g.restore();
  limb(g, [80, -840, 190, -780, sx, sy], 46, '#fbf3e0', 5); ell(g, sx, sy, 26, 26, '#e8c39e', 5);
  // head
  g.save(); g.translate(0, -1000);
  g.save(); g.globalAlpha *= .9; g.beginPath(); g.ellipse(0, -30, 120, 120, 0, 0, Math.PI * 2); g.lineWidth = 14; g.strokeStyle = '#ffe08a'; g.stroke(); g.restore(); glow(g, 0, -30, 220, 'rgba(255,235,170,1)', .8);
  [[-70, -40, 40], [-40, -86, 42], [10, -96, 44], [56, -78, 40], [78, -30, 36]].forEach(([x, y, r]) => ell(g, x, y, r, r, '#f0c45a', 4, 0, 'rgba(140,90,20,.9)'));
  sh(g, 'M-34 90 L34 90 L30 130 L-30 130 Z', '#e8c39e', 4, 'rgba(120,70,30,.9)');
  ell(g, 0, 10, 74, 86, lg(g, -74, 0, 74, 0, [[0, '#f2d2ae'], [1, '#d9a87e']]), 5, 0, 'rgba(120,70,30,.9)');
  [[-60, -40, 30], [-24, -66, 30], [20, -68, 30], [58, -44, 28]].forEach(([x, y, r]) => ell(g, x, y, r, r * .8, '#f0c45a', 0));
  const eg = o.eyesOpen ? 1 : 0;
  [-28, 28].forEach(cx => { if (eg) { ell(g, cx, 6, 15, 10, '#fffbe8', 4, 0, 'rgba(120,70,30,.9)'); glow(g, cx, 6, 40, 'rgba(255,240,180,1)', .9); } else line(g, [cx - 16, 6, cx, 14, cx + 16, 6], 5, 'rgba(90,50,20,.95)'); line(g, [cx - 18, -16, cx + 16, -20], 5, 'rgba(120,80,30,.9)'); });
  line(g, [-6, 30, 0, 44, 8, 40], 4, 'rgba(120,70,30,.9)');
  const op = o.talk || 0; if (op > .05) ell(g, 0, 64, 14, 3 + op * 12, '#6a2a20', 3); else line(g, [-16, 62, 0, 66, 16, 62], 4, 'rgba(120,70,30,.95)');
  g.restore();
  g.restore();
}
// ---------------- BALAK, king of Moab ----------------
function balak(g, o) {
  const t = o.t || 0, talk = o.talk || 0;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const br = Math.sin(t * 1.6 + 2) * 2;
  ell(g, 0, 2, 140, 18, 'rgba(30,15,10,.3)');
  sh(g, 'M-120 -10 C-140 -200 -120 -400 -84 -470 L84 -470 C120 -400 140 -200 120 -10 Q0 10 -120 -10 Z', lg(g, -120, 0, 120, 0, [[0, '#a8342a'], [.7, '#9b2f22'], [1, '#6e1f17']]), 6);
  line(g, [0, -470, 0, -10], 26, '#e0b648'); line(g, [-120, -12, 0, 6, 120, -12], 12, '#e0b648');
  const hx = o.offer ? 190 : 110, hy = o.offer ? -330 : -260;
  limb(g, [70, -440, 150, -380, hx, hy], 42, '#9b2f22', 6); ell(g, hx, hy, 22, 22, '#9a6040', 5);
  if (o.offer) { for (let i = 0; i < 4; i++) ell(g, hx + 10 + i * 6, hy - 22 - i * 4, 15, 6, '#f2c14e', 3); glow(g, hx + 20, hy - 30, 90, 'rgba(255,210,90,1)', .7); }
  g.save(); g.translate(0, -540 + br);
  sh(g, 'M-50 10 C-70 80 -30 150 0 160 C30 150 70 80 50 10 Z', '#1f1714', 5);
  ell(g, 0, -10, 60, 66, '#9a6040', 6);
  sh(g, 'M-62 -20 C-70 -70 -40 -90 0 -92 C40 -90 70 -70 62 -20 C40 -40 -40 -40 -62 -20 Z', '#1f1714', 5);
  sh(g, 'M-58 -60 L-58 -120 L-34 -94 L-12 -132 L0 -98 L12 -132 L34 -94 L58 -120 L58 -60 Z', '#e8bd4f', 5);
  [-34, 0, 34].forEach(x => ell(g, x, -74, 7, 7, '#b8352a', 2));
  [-24, 24].forEach(cx => { ell(g, cx, -8, 9, 7, '#fbf6ec', 3); ell(g, cx + 2, -8, 4.5, 4.5, INK); line(g, [cx - 14, -26, cx + 12, -22], 6); });
  line(g, [-6, 14, 0, 22, 8, 14], 4);
  if (talk > .05) ell(g, 0, 40, 14, 4 + talk * 14, '#3a1612', 3); else line(g, [-16, 40, 0, 46, 16, 40], 5, '#f2e6d6');
  g.restore();
  g.restore();
}
// simple walking servant
function servant(g, o) {
  const t = o.t || 0, k = Math.sin(t * 5 + (o.ph || 0));
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  ell(g, 0, 2, 70, 10, 'rgba(40,20,10,.25)');
  limb(g, [-14, -120, -14 + k * 22, -10], 18, '#9a6040', 5); limb(g, [14, -120, 14 - k * 22, -10], 18, '#9a6040', 5);
  sh(g, 'M-46 -110 C-54 -200 -44 -280 -30 -310 L30 -310 C44 -280 54 -200 46 -110 Z', o.col || '#c9a57a', 5);
  limb(g, [24, -290, 50, -230, 60 + k * 10, -180], 18, o.col || '#c9a57a', 5);
  ell(g, 0, -350, 40, 44, '#9a6040', 5); sh(g, 'M-42 -360 C-40 -410 40 -410 42 -360 L46 -330 L-46 -330 Z', '#e7dbc2', 5);
  if (o.pack) { ell(g, -50, -250, 34, 46, '#7a5432', 5); }
  g.restore();
}
