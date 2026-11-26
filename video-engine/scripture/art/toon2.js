// Toon rig, part 2: more hairstyles (so no two people share a head) and a true side-profile view for walking and talking in profile.
// Loaded after toon.js; extends hairBackT / hairFrontT by name and adds toonSide(), which toon() calls for o.view === 'side'.
(function () {
  const backOld = hairBackT, frontOld = hairFrontT;
  hairBackT = function (g, L, G, t, ph) { const H = L.hair, [hx, hy] = G.head, [rx, ry] = G.hr, sw = Math.sin(t * 1.5 + ph) * 5, st = L.hairStyle;
    g.save(); g.translate(hx, hy);
    if (st === 'bob') tsh(g, `M${-rx - 14} -20 C${-rx - 20} 60 ${-rx - 18} ${ry * .9} ${-rx + 6} ${ry * 1.02} L${rx - 6} ${ry * 1.02} C${rx + 18} ${ry * .9} ${rx + 20} 60 ${rx + 14} -20 Z`, H, 5);
    if (st === 'ponytail') { tsh(g, `M${rx * .3} ${-ry * .9} C${rx + 60 + sw} ${-ry * .8} ${rx + 70 + sw} ${ry * .6} ${rx + 30 + sw * 2} ${ry * 1.6} C${rx + 10 + sw} ${ry * .7} ${rx + 10} ${-ry * .3} ${rx * .2} ${-ry * .7} Z`, H, 5);
      tln(g, [rx + 20, -ry * .4, rx + 40 + sw, ry * .9], 2.4, L.hairHi); }
    if (st === 'long') { tsh(g, `M${-rx - 12} -30 C${-rx - 24} 120 ${-rx - 26 + sw} 240 ${-rx - 14 + sw} 330 L${rx + 14 + sw} 330 C${rx + 26 + sw} 240 ${rx + 24} 120 ${rx + 12} -30 Z`, H, 5); for (let i = -2; i <= 2; i++) tln(g, [i * 28, 140, i * 30 + sw, 310], 2.2, L.hairHi); }
    g.restore(); if (!['bob', 'ponytail', 'long', 'short', 'buzz', 'bald', 'bun', 'curly', 'spiky', 'parted'].includes(st)) backOld(g, L, G, t, ph); };
  hairFrontT = function (g, L, G, t, ph) { const H = L.hair, HL = L.hairHi, [rx, ry] = G.hr, st = L.hairStyle;
    const cap = (bottom, edge) => tsh(g, `M${-rx - 6} ${bottom} C${-rx - 10} -${ry * 1.16} ${rx + 10} -${ry * 1.16} ${rx + 6} ${bottom} ${edge} Z`, H, 5);
    if (st === 'short') { cap(-10, `C${rx} -${ry * .58} ${rx * .4} -${ry * .74} 0 -${ry * .7} C${-rx * .4} -${ry * .74} ${-rx} -${ry * .58} ${-rx - 6} -10`); tln(g, [-rx * .3, -ry * 1.0, rx * .2, -ry * .98], 3, HL); return; }
    if (st === 'parted') { cap(10, `C${rx} -${ry * .44} ${rx * .5} -${ry * .62} ${rx * .2} -${ry * .54} C${-rx * .2} -${ry * .74} ${-rx} -${ry * .56} ${-rx - 6} 10`); tln(g, [rx * .22, -ry * 1.06, rx * .2, -ry * .6], 3, 'rgba(0,0,0,.4)'); tln(g, [-rx * .5, -ry * .96, 0, -ry * 1.04], 3, HL); return; }
    if (st === 'spiky') { let d = `M${-rx - 6} -6`; const pts = [[-1.2, -.5], [-1.0, -1.0], [-.7, -.9], [-.55, -1.4], [-.25, -1.06], [0, -1.5], [.25, -1.08], [.55, -1.42], [.7, -.92], [1.0, -1.02], [1.2, -.5]]; pts.forEach(([a, b]) => d += ` L${a * rx} ${b * ry}`);
      d += ` L${rx + 6} -6 L${rx - 6} -${ry * .5} L${rx * .5} -${ry * .62} L${rx * .3} -${ry * .44} L${rx * .05} -${ry * .64} L${-rx * .2} -${ry * .44} L${-rx * .45} -${ry * .64} L${-rx + 6} -${ry * .48} Z`; tsh(g, d, H, 5); return; }
    if (st === 'buzz') { tsh(g, `M${-rx - 2} -16 C${-rx - 6} -${ry * 1.12} ${rx + 6} -${ry * 1.12} ${rx + 2} -16 C${rx - 4} -${ry * .62} ${-rx + 4} -${ry * .62} ${-rx - 2} -16 Z`, mix(H, L.skin, .45), 3); return; }
    if (st === 'bald') { [-1, 1].forEach(sd => tsh(g, `M${sd * rx * 1.02} ${ry * .14} C${sd * (rx + 14)} -${ry * .2} ${sd * rx * .9} -${ry * .52} ${sd * rx * .6} -${ry * .6} C${sd * rx * .8} -${ry * .3} ${sd * rx * .84} 0 ${sd * rx * .86} ${ry * .14} Z`, H, 4)); tln(g, [-rx * .3, -ry * .92, -rx * .05, -ry * .98], 6, 'rgba(255,255,255,.35)'); return; }
    if (st === 'bob') { tsh(g, `M${-rx - 12} ${ry * .7} C${-rx - 20} -${ry * 1.2} ${rx + 20} -${ry * 1.2} ${rx + 12} ${ry * .7} L${rx - 4} ${ry * .7} C${rx - 4} 0 ${rx - 8} -${ry * .32} ${rx - 14} -${ry * .36} L${-rx + 14} -${ry * .36} C${-rx + 8} -${ry * .32} ${-rx + 4} 0 ${-rx + 4} ${ry * .7} Z`, H, 5); tsh(g, `M${-rx * .5} -${ry * .94} Q0 -${ry * 1.04} ${rx * .5} -${ry * .94}`, null, 4, HL); return; }
    if (st === 'ponytail') { cap(0, `C${rx} -${ry * .62} ${rx * .2} -${ry * .56} ${-rx * .3} -${ry * .78} C${-rx * .7} -${ry * .5} ${-rx} -${ry * .4} ${-rx - 6} 0`); tln(g, [rx * .62, -ry * .86, rx * .9, -ry * .7], 8, L.tie || '#d23a3a'); return; }
    if (st === 'long') { cap(30, `L${rx - 4} 10 C${rx - 4} -${ry * .4} ${rx * .2} -${ry * .64} 0 -${ry * .9} C${-rx * .2} -${ry * .64} ${-rx + 4} -${ry * .4} ${-rx + 4} 10`); return; }
    if (st === 'bun') { tell(g, 0, -ry * 1.16, rx * .42, ry * .3, H, 5); tln(g, [-rx * .3, -ry * 1.02, rx * .3, -ry * 1.02], 6, L.tie || '#c8a040'); cap(0, `C${rx} -${ry * .7} ${rx * .3} -${ry * .78} 0 -${ry * .76} C${-rx * .3} -${ry * .78} ${-rx} -${ry * .7} ${-rx - 6} 0`); return; }
    if (st === 'curly') { let d = ''; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.05 + i / 14 * .9), x = Math.cos(a) * rx * 1.12, y = Math.sin(a) * ry * 1.12 - 6; tell(g, x, y, 26, 24, H, 4); } tsh(g, `M${-rx * .8} -${ry * .6} Q0 -${ry * .82} ${rx * .8} -${ry * .6} L${rx * .9} -${ry * .9} Q0 -${ry * 1.2} ${-rx * .9} -${ry * .9} Z`, H, 0); return; }
    frontOld(g, L, G, t, ph); };
})();

// ---------------- side profile, facing right (flip faces left) ----------------
function toonSide(g, o, L) {
  const t = o.t || 0, ph = o.ph || 0, ex = o.expr || 'neutral', talk = o.talk || 0, bk = L.bulk || 1, age = L.age ?? (L.kind === 'elder' ? 1 : .3);
  const rx = 76 * (L.headW || 1), ry = 90 * (L.headH || 1), shY = -650, waist = -470, hipY = -412, tw = 76 * bk;
  const br = Math.sin(t * 1.9 + ph), walk = o.walk ? t * (o.walkRate || 7) : null, lw = walk != null ? Math.sin(walk) : 0, bob = walk != null ? -Math.abs(Math.sin(walk)) * 10 : 0;
  const D = c => mix(c, '#1a1020', .25), skin = L.skin, armsK = o.arms || 'down';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), (o.s || 1) * (L.h || 1));
  if (o.shadow !== false) { g.fillStyle = rg(g, 0, 4, 10, 150 * bk, [[0, 'rgba(20,10,18,.42)'], [1, 'rgba(20,10,18,0)']]); g.beginPath(); g.ellipse(0, 4, 150 * bk, 20, 0, 0, 7); g.fill(); }
  g.translate(0, bob); const lean = (L.stoop || 0) + (o.lean || 0); if (lean) { g.translate(0, hipY); g.rotate(lean); g.translate(0, -hipY); }
  const lowCol = L.bottom === 'pants' ? L.pants : L.bottom === 'hakama' ? L.hakama : null;
  // legs: thigh + shin, the back leg bends at the knee as it swings
  const leg = (sd, far) => { const a = sd * lw * .42, kn = Math.max(0, -sd * lw) * .55, kx = Math.sin(a) * 205, ky = hipY + Math.cos(a) * 205, fx = kx + Math.sin(a - kn) * 205, fy = Math.min(-4, ky + Math.cos(a - kn) * 205);
    const c0 = lowCol || skin, c = far ? D(c0) : c0, wTop = L.bottom === 'hakama' ? 96 : L.bottom === 'pants' ? 70 : 36, wLow = L.bottom === 'hakama' ? 84 : L.bottom === 'pants' ? 58 : 32;
    if (L.bottom === 'hakama') { ttube(g, kx, ky, fx, fy, 40, 34, far ? D(L.wraps || skin) : (L.wraps || skin), 5); ttube(g, kx * .9, ky - 20, (kx + fx) / 2, (ky + fy) / 2, wLow, wLow, c, 5); }
    else ttube(g, kx, ky, fx, fy, wLow, wLow * .92, c, 5);
    ttube(g, 0, hipY, kx, ky, wTop, wTop * .9, c, 5);
    const shoe = L.bottom === 'pants' ? (L.shoes || '#1e1616') : '#c8a868'; tsh(g, `M${fx - 26} ${fy - 14} L${fx + 34} ${fy - 12} Q${fx + 52} ${fy - 4} ${fx + 46} ${fy + 6} L${fx - 28} ${fy + 6} Z`, far ? D(shoe) : shoe, 4); };
  // arms: upper arm swings opposite the legs; held poses bend the forearm forward
  const held = ['hold', 'offer', 'clasp', 'chest', 'open', 'gesture', 'point'].includes(armsK) || o.hold;
  const arm = (far) => { const sh = [far ? 8 : -4, shY + 34 + br * 2], swing = (far ? 1 : -1) * lw * .38;
    let a = swing, b = .22; if (!far && held) { a = .28; b = armsK === 'point' ? 1.3 : 1.25; } if (far && held && armsK !== 'point') { a = .22; b = 1.15; } if (!far && (armsK === 'up' || armsK === 'wave' || armsK === 'raise')) { a = 2.5; b = .3; }
    const el = [sh[0] + Math.sin(a) * 134, sh[1] + Math.cos(a) * 134], h = [el[0] + Math.sin(a + b) * 128, el[1] + Math.cos(a + b) * 128];
    const col = far ? D(L.top) : L.top; ttube(g, sh[0], sh[1], el[0], el[1], 52, 48, col, 5); ttube(g, el[0], el[1], el[0] + (h[0] - el[0]) * .8, el[1] + (h[1] - el[1]) * .8, 46, 40, col, 5);
    ttube(g, el[0] + (h[0] - el[0]) * .78, el[1] + (h[1] - el[1]) * .78, h[0], h[1], 30, 28, far ? D(skin) : skin, 5); mitten(g, h[0], h[1], Math.atan2(h[1] - el[1], h[0] - el[0]), 1.2, far ? D(skin) : skin, false); return h; };
  // back hair that hangs behind the shoulders
  const st = L.hairStyle, longBack = ['long', 'longBangs', 'goddess', 'heian', 'lowtie'].includes(st);
  if (longBack) { const len = st === 'heian' ? 700 : st === 'lowtie' ? 260 : 330, sw = Math.sin(t * 1.5 + ph) * 6; tsh(g, `M${-rx * .9} -${772 + ry * .3} C${-rx * 1.3} -700 ${-rx * 1.2 + sw} ${-772 + len * .6} ${-rx * .8 + sw} ${-772 + len} L${-rx * .1 + sw} ${-772 + len} C${-rx * .3} -650 ${-rx * .2} -720 ${-rx * .2} -${772 + ry * .3} Z`, L.hair, 5); }
  if (o.foxTails) foxTailsT(g, o.foxTails, { shY, waist, hip: hipY }, t, o.foxCol);
  arm(true); leg(-1, true);
  if (L.bottom === 'skirt') { leg(1, false); const s2 = lw * 18; tsh(g, `M${-tw * .9} ${waist} L${tw} ${waist} L${tw + 50 + s2} -12 Q0 4 ${-tw - 40 + s2 * .5} -12 Z`, L.skirt, 5); }
  else if (L.bottom === 'robe') { leg(1, false); tsh(g, `M${-tw * .9} ${waist} L${tw} ${waist} L${tw + 20} -26 L${-tw - 10} -26 Z`, L.top, 5); }
  else leg(1, false);
  // torso in profile: rounded back, chest forward
  const body = `M${-tw * .9} ${shY + 6} C${-tw * 1.05} ${shY + 120} ${-tw * 1.0} ${waist - 40} ${-tw * .95} ${waist + 46} L${tw * .9} ${waist + 46} C${tw * .98} ${waist - 60} ${tw * 1.12} ${shY + 160} ${tw * .86} ${shY + 20} Q${tw * .2} ${shY - 18} ${-tw * .9} ${shY + 6} Z`;
  g.save(); g.translate(0, waist); g.scale(1, 1 + .01 * br); g.translate(0, -waist);
  tsh(g, body, L.top, 5); if (L.pat) tpattern(g, body, L.pat, L.patCol, 1); g.save(); g.clip(path(body)); g.fillStyle = 'rgba(40,20,40,.16)'; g.fillRect(-tw * 1.2, shY - 40, tw * .7, 900);
  if (L.suit) { tln(g, [tw * .5, shY + 6, tw * .9, shY + 170], 8, L.collar || '#f4f2ec'); [0, 1, 2].forEach(k => tell(g, tw * .8, shY + 210 + k * 46, 5, 5, '#2a2020', 0)); }
  else { tln(g, [tw * .2, shY - 4, tw * .92, shY + 150], 14, L.collar); tsh(g, `M${-tw * 1.1} ${waist - 18} L${tw * 1.1} ${waist - 18} L${tw * 1.1} ${waist + 14} L${-tw * 1.1} ${waist + 14} Z`, L.belt || L.obi || D(L.top), 4); }
  if (L.frontX === reflectSide || L.reflect) [waist - 40, waist + 120].forEach(y => tsh(g, `M${-tw * 1.2} ${y} L${tw * 1.2} ${y} L${tw * 1.2} ${y + 18} L${-tw * 1.2} ${y + 18} Z`, '#e8e060', 3));
  g.restore(); tsh(g, body, null, 5); g.restore();
  // head in profile
  const nod = talk * (.05 * Math.sin(t * 8.6 + ph) + .02) + .02 * Math.sin(t * .7 + ph * 2.3) + (o.headDown || 0), jaw = talk * 10 * Math.abs(Math.sin(t * 9 + ph));
  ttube(g, 4, shY + 10, 10, -772 + ry * .5, 56, 52, L.skinD, 5);
  g.save(); g.translate(10, -772 + br * 2); g.rotate((o.tilt || 0) + nod * .6);
  const nose = L.nose === 'long' ? 24 : L.nose === 'button' ? 8 : L.nose === 'broad' ? 14 : 16;
  const head = `M${-rx * .5} ${ry * .78} C${-rx * 1.08} ${ry * .4} ${-rx * 1.12} ${-ry * .8} ${-rx * .2} ${-ry * 1.02} C${rx * .5} ${-ry * 1.1} ${rx * .9} ${-ry * .62} ${rx * .92} ${-ry * .26} L${rx * .98} ${-ry * .06} L${rx * 1.06 + nose} ${ry * .22} L${rx * .98} ${ry * .32} Q${rx * 1.03} ${ry * .42} ${rx * .97} ${ry * .5 + jaw * .3} Q${rx * 1.0} ${ry * .6 + jaw} ${rx * .92} ${ry * .68 + jaw} Q${rx * .94} ${ry * .94 + jaw} ${rx * .56} ${ry * 1.0 + jaw} Q${rx * .1} ${ry * .96} ${-rx * .22} ${ry * .56} Q${-rx * .36} ${ry * .7} ${-rx * .5} ${ry * .78} Z`;
  tsh(g, head, skin, 6); g.save(); g.clip(path(head)); g.fillStyle = 'rgba(160,80,60,.12)'; g.beginPath(); g.ellipse(-rx * .5, ry * .2, rx * .5, ry * 1.2, 0, 0, 7); g.fill(); g.restore(); tsh(g, head, null, 6);
  if (talk > .1) tsh(g, `M${rx * .9} ${ry * .54} L${rx * .99} ${ry * .54} L${rx * .95} ${ry * .58 + jaw} Z`, '#4a1418', 3);
  else tln(g, [rx * .8, ry * .55, rx * .97, ry * (ex === 'happy' || ex === 'smile' ? .5 : .55)], 4);
  tell(g, -rx * .1, ry * .06, rx * .16, ry * .2, skin, 5); tln(g, [-rx * .12, -ry * .02, -rx * .06, ry * .14], 2.4, L.skinD);   // ear
  if (L.blush) tell(g, rx * .5, ry * .36, rx * .16, ry * .08, L.blush, 0);
  const ES = EYES[L.eyeShape || 'almond'] || EYES.almond, ew = rx * .2 * ES.w, eh = ry * .1 * ES.h, ex0 = rx * .6, ey = -ry * .04, blink = ((t * .63 + ph) % 3.7) < .1 || ex === 'happy';
  if (blink) tln(g, [ex0 - ew, ey + 2, ex0, ey - (ex === 'happy' ? 8 : 0), ex0 + ew * .7, ey + 4], 5);
  else { tsh(g, `M${ex0 - ew} ${ey} Q${ex0} ${ey - eh * 1.8} ${ex0 + ew * .7} ${ey + 2 + ES.tilt * .4} Q${ex0} ${ey + eh * 1.2} ${ex0 - ew} ${ey} Z`, '#fffdf8', 3); tell(g, ex0 + ew * .3, ey, ew * .3, eh * 1.1, L.iris || '#3a2418', 0); tell(g, ex0 + ew * .32, ey, ew * .14, eh * .6, '#140c08', 0);
    tln(g, [ex0 - ew - 2, ey, ex0, ey - eh * 1.8, ex0 + ew * .7 + 2, ey + 2 + ES.tilt * .4], 5); if (L.lashes) tln(g, [ex0 + ew * .7, ey + 1, ex0 + ew * .7 + 10, ey - 6], 4); }
  if (age >= .6) tln(g, [ex0 - ew * .4, ey + eh * 1.8, ex0 + ew * .4, ey + eh * 1.7], 2, 'rgba(120,60,40,.45)');
  if (age >= .45) tln(g, [rx * .9, ry * .32, rx * .78, ry * .52], 2.2, 'rgba(150,80,50,.35)');
  if (L.glasses) { tell(g, ex0 + 4, ey, ew * 1.2, eh * 2.2, 'rgba(220,240,255,.15)', 4); tln(g, [ex0 - ew * 1.2, ey - 4, -rx * .1, ey - 8], 3); }
  const by = -ry * .3 + ({ angry: 6, fierce: 6, shock: -10, scared: -8, sad: -4, worry: -4, happy: -3 }[ex] || 0); tln(g, [rx * .38, by + 2, rx * .62, by - 6, rx * .86, by + (ex === 'angry' ? 8 : 0)], L.brow || 6, L.browCol || L.hair);
  if (L.beard === 'stubble') { const r = rng(4); for (let i = 0; i < 26; i++) tell(g, rx * (.2 + r() * .7), ry * (.5 + r() * .4), 1.8, 1.8, 'rgba(40,30,30,.45)', 0); }
  if (L.beard === 'longWhite' || L.beard === 'short' || L.beard === 'storm') tsh(g, `M${-rx * .2} ${ry * .5} Q${rx * .4} ${ry * .74} ${rx * .9} ${ry * .66} Q${rx * .9} ${ry * (L.beard === 'longWhite' ? 2.0 : 1.25)} ${rx * .3} ${ry * (L.beard === 'longWhite' ? 1.9 : 1.15)} Q${-rx * .1} ${ry * .9} ${-rx * .2} ${ry * .5} Z`, L.beard === 'longWhite' ? L.hair : L.hair, 5);
  // hair in profile: a cap from the hairline back over the skull, then the style's own shape behind
  const H = L.hair, HL = L.hairHi;
  if (st !== 'bald' && st !== 'buzz') { const nape = st === 'bob' ? ry * .78 : longBack ? ry * .9 : ry * .3, front = st === 'bob' || st === 'longBangs' || st === 'mio' ? -ry * .26 : -ry * .5;
    tsh(g, `M${rx * .9} ${front} C${rx * 1.0} ${-ry * 1.2} ${-rx * 1.3} ${-ry * 1.3} ${-rx * 1.06} ${nape - 20} L${-rx * .6} ${nape} C${-rx * .3} ${ry * .2} ${-rx * .1} ${-ry * .2} ${rx * .1} ${-ry * .5} Q${rx * .5} ${-ry * .6} ${rx * .9} ${front} Z`, H, 5);
    tsh(g, `M${-rx * .4} ${-ry * .96} Q${rx * .2} ${-ry * 1.08} ${rx * .6} ${-ry * .86}`, null, 4, HL);
    if (st === 'spiky') for (let k = 0; k < 5; k++) tsh(g, `M${-rx * .8 + k * rx * .34} ${-ry * .9} L${-rx * .7 + k * rx * .34} ${-ry * 1.36} L${-rx * .5 + k * rx * .34} ${-ry * .96} Z`, H, 4);
    if (st === 'bun' || st === 'mio' || st === 'mizura') tell(g, -rx * .6, -ry * .96, rx * .36, ry * .3, H, 5);
    if (st === 'ponytail') { const sw = Math.sin(t * 2 + ph) * 8; tsh(g, `M${-rx * .9} ${-ry * .6} C${-rx * 1.6} ${-ry * .5} ${-rx * 1.7 + sw} ${ry * .6} ${-rx * 1.4 + sw} ${ry * 1.4} C${-rx * 1.3} ${ry * .5} ${-rx * 1.2} ${-ry * .2} ${-rx * .8} ${-ry * .3} Z`, H, 5); tln(g, [-rx * 1.0, -ry * .7, -rx * .9, -ry * .4], 8, L.tie || '#d23a3a'); }
    if (st === 'curly') for (let k = 0; k < 7; k++) tell(g, -rx * .9 + k * rx * .28, -ry * (1.0 - Math.abs(k - 3) * .06), 24, 22, H, 4); }
  else if (st === 'bald') tsh(g, `M${-rx * .2} ${-ry * .1} C${-rx * .4} ${-ry * .5} ${-rx * 1.0} ${-ry * .4} ${-rx * .98} ${ry * .3} L${-rx * .6} ${ry * .5} C${-rx * .5} ${ry * .1} ${-rx * .3} ${ry * .1} ${-rx * .2} ${-ry * .1} Z`, H, 4);
  else tsh(g, `M${rx * .9} ${-ry * .5} C${rx * 1.0} ${-ry * 1.16} ${-rx * 1.24} ${-ry * 1.24} ${-rx * 1.0} ${ry * .2} L${-rx * .7} ${ry * .24} C${-rx * .4} ${-ry * .3} ${rx * .3} ${-ry * .7} ${rx * .9} ${-ry * .5} Z`, mix(H, skin, .45), 3);
  hatT(g, L, rx, ry, t); if (L.headX) L.headX(g, L, rx, ry, o, t, ex);
  g.restore();
  // near arm last, over the body
  const hN = arm(false); if (o.hold && THOLD[o.hold]) THOLD[o.hold](g, hN, o, t, L);
  g.restore();
}
function reflectSide() { }
