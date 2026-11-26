// Toon rig for the Japanese mythology series, in the reference's look: front-facing characters, thick warm-brown outlines,
// flat colours with one soft shade, big readable faces, patterned clothing with trims. Kids have big round eyes with small
// dark pupils; adults have almond eyes with coloured irises. Everything breathes, blinks, glances and talks.
const OUT = '#3b2416';
function tsh(g, d, fill, w = 5, stroke = OUT) { const p = path(d); if (fill) { g.fillStyle = fill; g.fill(p); } if (w) { g.lineWidth = w; g.strokeStyle = stroke; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(p); } }
function tell(g, x, y, rx, ry, fill, w = 5, rot = 0, stroke = OUT) { g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { g.lineWidth = w; g.strokeStyle = stroke; g.stroke(); } }
function tln(g, pts, w = 5, col = OUT) { line(g, pts, w, col, 'round', true); }
function ttube(g, x0, y0, x1, y1, w0, w1, fill, w = 5) { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  g.beginPath(); g.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); g.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2); g.arc(x1, y1, w1 / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, true);
  g.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); g.arc(x0, y0, w0 / 2, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, true); g.closePath(); g.fillStyle = fill; g.fill(); if (w) { g.lineWidth = w; g.strokeStyle = OUT; g.lineJoin = 'round'; g.stroke(); } }
function mitten(g, x, y, ang, s, skin, open) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  tsh(g, 'M-10 -16 C8 -20 26 -14 28 0 C30 14 14 20 -2 18 C-12 16 -14 6 -14 0 Z', skin, 5);
  if (open) { [-10, -2, 6].forEach(yy => tsh(g, `M20 ${yy - 4} Q38 ${yy - 2} 38 ${yy + 2} Q30 ${yy + 6} 20 ${yy + 4} Z`, skin, 4)); }
  tsh(g, 'M0 -14 C4 -28 16 -30 18 -22 C16 -16 10 -12 6 -8 Z', skin, 4.4); g.restore(); }
// wave (seigaiha), hemp-leaf dots, petals, diamonds: clipped fill patterns
function tpattern(g, d, kind, col, sc = 1) { g.save(); g.clip(path(d)); g.globalAlpha = .9;
  if (kind === 'waves') for (let y = -1200; y < 200; y += 26 * sc) for (let x = -400 + ((y / (26 * sc)) | 0) % 2 * 26 * sc; x < 400; x += 52 * sc) for (let r = 24 * sc; r > 4; r -= 8 * sc) { g.beginPath(); g.arc(x, y, r, Math.PI, 0); g.lineWidth = 2.4; g.strokeStyle = col; g.stroke(); }
  if (kind === 'dots') for (let y = -1200; y < 200; y += 30 * sc) for (let x = -400 + ((y / (30 * sc)) | 0) % 2 * 15 * sc; x < 400; x += 30 * sc) tell(g, x, y, 3.4 * sc, 3.4 * sc, col, 0);
  if (kind === 'diamond') for (let y = -1200; y < 200; y += 34 * sc) for (let x = -400 + ((y / (34 * sc)) | 0) % 2 * 17 * sc; x < 400; x += 34 * sc) tsh(g, `M${x} ${y - 7 * sc} L${x + 6 * sc} ${y} L${x} ${y + 7 * sc} L${x - 6 * sc} ${y} Z`, col, 0);
  if (kind === 'tiger') { g.fillStyle = col; for (let y = -1200; y < 200; y += 46 * sc) for (let x = -400 + ((y / (46 * sc)) | 0) % 2 * 40 * sc; x < 400; x += 80 * sc) { g.beginPath(); g.moveTo(x - 30 * sc, y); g.quadraticCurveTo(x, y - 16 * sc, x + 30 * sc, y + 4 * sc); g.lineTo(x + 26 * sc, y + 12 * sc); g.quadraticCurveTo(x, y - 4 * sc, x - 26 * sc, y + 8 * sc); g.closePath(); g.fill(); } }
  if (kind === 'petals') { const r = rng(5); for (let i = 0; i < 160; i++) { const x = -360 + r() * 720, y = -1100 + r() * 1300; sakura(g, x, y, (6 + r() * 4) * sc, col); } }
  if (kind === 'clouds') for (let y = -1200; y < 200; y += 70 * sc) for (let x = -400 + ((y / (70 * sc)) | 0) % 2 * 60 * sc; x < 400; x += 120 * sc) { tln(g, [x - 30 * sc, y, x - 10 * sc, y - 14 * sc, x + 10 * sc, y, x + 30 * sc, y - 12 * sc], 3, col); tln(g, [x - 10 * sc, y + 14 * sc, x + 20 * sc, y + 14 * sc], 3, col); }
  g.restore(); }
function trim(g, x0, x1, y, h, col, dot) { tsh(g, `M${x0} ${y} L${x1} ${y} L${x1} ${y + h} L${x0} ${y + h} Z`, col, 4); if (dot) for (let x = x0 + 10; x < x1 - 4; x += 16) tell(g, x, y + h / 2, 2.6, 2.6, dot, 0); }
const TOON = {
  mio:   { kind: 'kid', skin: '#f6d2ac', skinD: '#e0a882', blush: 'rgba(240,120,110,.4)', hair: '#1c1620', hairHi: '#4a4258', hairStyle: 'mio', top: '#d8463e', topD: '#b03430', pat: 'petals', patCol: 'rgba(255,236,240,.92)', collar: '#f8f2e6', bottom: 'robe', obi: '#2f6f6c', obiCord: '#f2c94c', feet: 'geta', eyes: 'kid' },
  susanoo: { kind: 'adult', trimCol: '#c8302a', trimDot: '#f2ecde', pouch: '#5a3a22', wraps: '#f2ecde', wrapLine: '#26365c', skin: '#e2a878', skinD: '#c4875a', hair: '#15121a', hairHi: '#3e3a52', hairStyle: 'wild', top: '#26365c', topD: '#1a2644', pat: 'waves', patCol: 'rgba(170,200,240,.45)', collar: '#f2ecde', sleeve: 'kinu', bottom: 'hakama', hakama: '#e8e2d2', hakamaD: '#c4bca8', cord: '#c8302a', belt: '#c8302a', feet: 'straw', eyes: 'adult', iris: '#4a2a18', brow: 7, beard: 'storm', jaw: 'square', magatama: '#d23a2a', sword: true, h: 1.04 },
  elder: { kind: 'elder', trimCol: '#5a4430', trimDot: '#e8d8b0', pouch: '#5a4a3a', wraps: '#d8ccb0', skin: '#d8a27a', skinD: '#b88058', hair: '#f2eee6', hairHi: '#ffffff', hairStyle: 'mizura', top: '#8a6a48', topD: '#6e5236', pat: 'dots', patCol: 'rgba(250,230,190,.5)', collar: '#efe6d2', sleeve: 'kinu', bottom: 'hakama', hakama: '#5a5a48', hakamaD: '#44443a', cord: '#e8d8b0', belt: '#e8d8b0', feet: 'straw', eyes: 'adult', iris: '#4a3a2a', brow: 6, browCol: '#d8d2c8', beard: 'longWhite', jaw: 'round', h: .93, stoop: .05, cane: true },
  elderW:{ kind: 'elder', female: true, skin: '#d8a27a', skinD: '#b88058', hair: '#e8e4dc', hairHi: '#ffffff', hairStyle: 'lowtie', top: '#7a5a7a', topD: '#5e445e', pat: 'diamond', patCol: 'rgba(250,230,250,.35)', collar: '#efe6d2', sleeve: 'wide', bottom: 'skirt', skirt: '#4e3e5a', skirtD: '#3a2e44', belt: '#c8a868', feet: 'straw', eyes: 'adult', iris: '#4a3a2a', brow: 5, browCol: '#c8c2b8', h: .86, stoop: .05 },
  kushinada: { kind: 'adult', female: true, skin: '#f2c8a2', skinD: '#dca07a', hair: '#15121a', hairHi: '#3e3a52', hairStyle: 'longBangs', ribbon: '#d23a3a', top: '#f6f1e6', topD: '#e0d6c4', pat: 'petals', patCol: 'rgba(230,120,140,.55)', collar: '#d23a3a', sleeve: 'wide', bottom: 'skirt', skirt: '#d23a3a', skirtD: '#a82a2e', pleats: '#f6f1e6', belt: '#2f6f6c', feet: 'straw', eyes: 'adult', iris: '#3a2418', lashes: true, brow: 4, lips: '#c84a5a', magatama: '#2fa888', h: .94 },
  amaterasu: { kind: 'adult', female: true, skin: '#f6d0a8', skinD: '#e0aa82', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'goddess', top: '#fff6dc', topD: '#ecdcb0', pat: 'clouds', patCol: 'rgba(220,170,70,.6)', collar: '#e8b84a', sleeve: 'wide', bottom: 'skirt', skirt: '#f2d27a', skirtD: '#d4ac4a', pleats: '#fff6dc', belt: '#d23a3a', feet: 'straw', eyes: 'adult', iris: '#6a3a10', lashes: true, brow: 4, lips: '#c84a5a', magatama: '#e8b84a', h: 1.0 },
  kami1: { kind: 'adult', trimCol: '#6a4a7a', trimDot: '#e8b84a', skin: '#e2a878', skinD: '#c4875a', hair: '#2a1e18', hairHi: '#5a4a3a', hairStyle: 'mizura', top: '#f2ecde', topD: '#d8d0bc', pat: 'diamond', patCol: 'rgba(200,160,80,.4)', collar: '#e8b84a', sleeve: 'kinu', bottom: 'hakama', hakama: '#6a4a7a', hakamaD: '#523a5e', cord: '#e8b84a', belt: '#e8b84a', feet: 'straw', eyes: 'adult', iris: '#3a2418', brow: 6, beard: 'short', jaw: 'round', magatama: '#2fa888', h: 1.0 },
  kami2: { kind: 'adult', trimCol: '#7a3a3a', trimDot: '#e8b84a', skin: '#d0946a', skinD: '#b07a50', hair: '#2a1e18', hairHi: '#5a4a3a', hairStyle: 'mizura', top: '#e8e2d4', topD: '#cec6b4', pat: 'dots', patCol: 'rgba(160,60,60,.4)', collar: '#c8302a', sleeve: 'kinu', bottom: 'hakama', hakama: '#7a3a3a', hakamaD: '#5e2c2c', cord: '#e8b84a', belt: '#e8b84a', feet: 'straw', eyes: 'adult', iris: '#3a2418', brow: 7, beard: 'stubble', jaw: 'square', h: 1.02 },
};
const EYES = { almond: { w: 1, h: 1, tilt: 0 }, round: { w: .9, h: 1.5, tilt: 0 }, narrow: { w: 1.06, h: .6, tilt: -2, lid: 6 }, droopy: { w: 1, h: 1.05, tilt: 7 }, upturned: { w: 1.02, h: .88, tilt: -9 }, big: { w: 1.12, h: 1.4, tilt: -2 } };
function toon(g, o) {
  let L = typeof o.c === 'string' ? TOON[o.c] : o.c; if (o.pale) L = Object.assign({}, L, { skin: mix(L.skin, '#e6e2dc', o.pale), skinD: mix(L.skinD, '#c8c2bc', o.pale) });
  if (o.view === 'side' && L.kind !== 'kid' && typeof toonSide === 'function') return toonSide(g, o, L);
  const t = o.t || 0, ph = o.ph || 0, ex = o.expr || 'neutral', talk = o.talk || 0, kid = L.kind === 'kid';
  // proportions
  const bk = L.bulk || 1; const G = kid ? { head: [0, -440], hr: [124, 120], shY: -296, sw: 82, waist: -206, hip: -186, hand: 1.25, armU: 86, armF: 90, legW: 34 }
                : { head: [0, -772], hr: [76 * (L.headW || 1), 90 * (L.headH || 1)], shY: -650, sw: 84 * bk, waist: -470, hip: -440, hand: 1.3 * Math.sqrt(bk), armU: 134, armF: 128, legW: 44 };
  const br = Math.sin(t * 1.9 + ph), breath = 1 + .01 * br;
  const walk = o.walk ? t * (o.walkRate || 7) : null, bob = walk != null ? -Math.abs(Math.sin(walk)) * 10 : 0, hop = o.hop ? -Math.abs(Math.sin(t * 9)) * 22 * o.hop : 0, shake = o.shake ? Math.sin(t * 40) * 6 * o.shake : 0;
  g.save(); g.translate(o.x + shake, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1) , (o.s || 1) * (L.h || 1));
  { const air = o.gy != null ? Math.max(0, (o.gy - o.y) / ((o.s || 1) * (L.h || 1))) : 0, sk = 1 / (1 + air / 900), sw0 = (kid ? 130 : 170) * (L.bulk || 1) * sk;
    if (o.shadow !== false) { g.fillStyle = rg(g, 0, air + 4, 10, sw0, [[0, `rgba(20,10,18,${.42 * sk})`], [1, 'rgba(20,10,18,0)']]); g.beginPath(); g.ellipse(0, air + 4, sw0, 22 * sk, 0, 0, 7); g.fill(); } }
  g.translate(0, bob + hop); if (o.rot) { g.translate(0, -450); g.rotate(o.rot); g.translate(0, 450); }
  const lean = (L.stoop || 0) + (o.lean || 0); if (lean) { g.translate(0, G.hip); g.rotate(lean); g.translate(0, -G.hip); }
  // arms: poses as [left hand, right hand] in body space (left = viewer's left)
  const A = kid ? { down: [[-100, -128], [100, -128]], up: [[-150, -470], [150, -470]], ears: [[-128, -440], [128, -440]], cheeks: [[-96, -380], [96, -380]], mouth: [[-46, -360], [46, -360]], hips: [[-110, -200], [110, -200]],
      point: [[-92, -150], [200, -330]], shrug: [[-150, -250], [150, -250]], chest: [[-40, -250], [40, -250]], fists: [[-60, -260], [60, -260]], chin: [[-92, -150], [24, -330]], proud: [[-110, -200], [110, -200]] }
    : { down: [[-104, -396], [104, -396]], hips: [[-150, -470], [150, -470]], gesture: [[-104, -396], [150, -530]], point: [[-104, -396], [320, -640]], raise: [[-104, -396], [140, -940]], chest: [[-50, -560], [50, -560]],
      clasp: [[-30, -540], [30, -540]], open: [[-222, -452], [222, -452]], relaxed: [[-92, -418], [92, -418]], wave: [[-104, -396], [178, -846]], behind: [[-46, -470], [46, -470]], pocket: [[-112, -430], [112, -430]], salute: [[-104, -396], [96, -812]], up: [[-190, -900], [190, -900]], hold: [[-60, -520], [60, -520]], offer: [[-60, -540], [170, -560]], cane: [[-104, -396], [126, -420]], weep: [[-40, -600], [40, -600]], sword2: [[-20, -1000], [30, -1010]], slash: [[-200, -600], [-150, -640]] };
  const armsK = o.arms || o.hands; let [hl, hr] = typeof armsK === 'object' && armsK ? armsK : (A[armsK || (L.cane ? 'cane' : 'down')] || A.down);
  if (o.arms2 && o.mix != null) { const B2 = A[o.arms2] || A.down, m = eio(o.mix); hl = [lerp(hl[0], B2[0][0], m), lerp(hl[1], B2[0][1], m)]; hr = [lerp(hr[0], B2[1][0], m), lerp(hr[1], B2[1][1], m)]; }
  const sway = Math.sin(t * 1.6 + ph) * 4; hl = [hl[0] - sway * .5, hl[1] + Math.abs(sway) * .2]; hr = [hr[0] + sway * .5, hr[1] + Math.abs(sway) * .2];
  if (walk != null) { hl = [hl[0], hl[1] + Math.sin(walk) * 14]; hr = [hr[0], hr[1] - Math.sin(walk) * 14]; }
  const sh0 = [-G.sw, G.shY + 16 + br * 2], sh1 = [G.sw, G.shY + 16 + br * 2];
  // back hair (behind body)
  if (o.foxTails) foxTailsT(g, o.foxTails, G, t, o.foxCol);
  hairBackT(g, L, G, t, ph);
  if (L.behind) L.behind(g, L, G, o, t);
  // legs + lower garment
  lowerT(g, L, G, t, walk);
  // arm helper (elbow bends outward-down), wide or narrow sleeves
  const armT = (s0, h, side, front) => { const dx = h[0] - s0[0], dy = h[1] - s0[1], d = Math.min(Math.hypot(dx, dy), G.armU + G.armF - 1), a2 = (G.armU * G.armU - G.armF * G.armF + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, G.armU * G.armU - a2 * a2)), D = Math.hypot(dx, dy) || 1;
    const soft = h[1] > s0[1] - 10 ? (armsK === 'hips' ? .78 : .5) : 1; const hh2 = hh * soft; const px = s0[0] + a2 * dx / D, py = s0[1] + a2 * dy / D; let c1 = [px - hh2 * dy / D, py + hh2 * dx / D], c2 = [px + hh2 * dy / D, py - hh2 * dx / D]; const el = (c1[0] * side > c2[0] * side) ? c1 : c2;
    const skin = L.skin, sw = kid ? 50 : 50, cuff = kid ? 36 : 34, col = side < 0 ? L.topD : L.top;
    ttube(g, s0[0], s0[1], el[0], el[1], sw, sw * .92, col, 5);
    const fdx = h[0] - el[0], fdy = h[1] - el[1], fl = Math.hypot(fdx, fdy) || 1, ux = fdx / fl, uy = fdy / fl; let nx = -uy, ny = ux; if (ny < 0) { nx = -nx; ny = -ny; }
    if (L.sleeve === 'wide' && !kid) { // kimono sleeve: a bell of cloth from the elbow, its lower edge sagging under gravity
      const ke = .66, ex2 = el[0] + fdx * ke, ey2 = el[1] + fdy * ke, ws = kid ? 54 : 62, drop = (kid ? 46 : 74) * Math.max(.35, Math.abs(ux) * .6 + .5);
      const d2 = `M${el[0] - nx * ws * .5} ${el[1] - ny * ws * .5} L${ex2 - nx * ws * .55} ${ey2 - ny * ws * .55} L${ex2 + nx * (ws * .5 + drop)} ${ey2 + ny * (ws * .5 + drop)} Q${(el[0] + ex2) / 2 + nx * (ws * .6 + drop * 1.2)} ${(el[1] + ey2) / 2 + ny * (ws * .6 + drop * 1.2)} ${el[0] + nx * (ws * .5 + drop * .4)} ${el[1] + ny * (ws * .5 + drop * .4)} Z`;
      ttube(g, ex2, ey2, h[0], h[1], cuff * .95, cuff * .85, skin, 5); tsh(g, d2, col, 5); if (L.pat) tpattern(g, d2, L.pat, L.patCol, kid ? .8 : 1); tsh(g, d2, null, 5);
      tln(g, [ex2 - nx * ws * .5, ey2 - ny * ws * .5, ex2 + nx * (ws * .45 + drop), ey2 + ny * (ws * .45 + drop)], 6, mix(col, '#fff', .25)); }
    else { const ke = .8, ex2 = el[0] + fdx * ke, ey2 = el[1] + fdy * ke; ttube(g, ex2, ey2, h[0], h[1], cuff, cuff * .9, skin, 5);
      if (kid) { ttube(g, el[0], el[1], ex2, ey2, sw * .95, cuff * 1.5, col, 5); tln(g, [ex2 - nx * cuff * .75, ey2 - ny * cuff * .75, ex2 + nx * cuff * .75, ey2 + ny * cuff * .75], 7, L.collar); }
      else { ttube(g, el[0], el[1], ex2, ey2, sw * .9, cuff * 1.15, col, 5); tln(g, [ex2 - nx * cuff * .6, ey2 - ny * cuff * .6, ex2 + nx * cuff * .6, ey2 + ny * cuff * .6], 6, L.cord || L.belt || OUT); } }
    const hArgs = [h[0], h[1], Math.atan2(h[1] - el[1], h[0] - el[0]), G.hand, skin, front && ['gesture', 'point', 'open', 'up', 'offer', 'ears', 'cheeks', 'shrug'].includes(armsK)];
    mitten(g, ...hArgs); if (h[1] < G.shY + 30) raisedHands.push(hArgs); };   // hands up by the face get drawn again over the head
  if (armsK === 'behind') { armT(sh0, hl, -1, false); armT(sh1, hr, 1, false); }   // hands clasped behind the back, hidden by the torso
  // torso garment
  const tw = kid ? 92 : 98 * bk, ww = kid ? 86 : 84 * bk, top = `M${-tw} ${G.shY - 4} C${-tw - 8} ${G.shY + 80} ${-ww - 6} ${G.waist - 60} ${-ww} ${G.waist + (kid ? 150 : 50)} L${ww} ${G.waist + (kid ? 150 : 50)} C${ww + 6} ${G.waist - 60} ${tw + 8} ${G.shY + 80} ${tw} ${G.shY - 4} Q0 ${G.shY - 22} ${-tw} ${G.shY - 4} Z`;
  g.save(); g.translate(0, G.waist); g.scale(1, breath); g.translate(0, -G.waist);
  if (L.cape) { tsh(g, `M${-tw - 10} ${G.shY} L${-tw - 70} ${G.waist + 260} L${tw + 70} ${G.waist + 260} L${tw + 10} ${G.shY} Z`, L.cape, 5); }
  tsh(g, top, L.top, 5); if (L.pat) tpattern(g, top, L.pat, L.patCol, kid ? .8 : 1);
  g.save(); g.clip(path(top)); g.fillStyle = 'rgba(40,20,40,.16)'; g.fillRect(tw * .45, G.shY - 40, 300, 900);
  if (!kid) { const hy2 = G.waist + 50; trim(g, -ww - 20, ww + 20, hy2 - 26, 26, L.trimCol || mix(L.topD, '#000', .15), L.trimDot || '#e8c45a'); }
  [-1, 1].forEach(sd => tln(g, [sd * tw * .62, G.shY - 6, sd * tw * .9, G.shY + 50], 2.4, 'rgba(40,20,20,.35)')); g.restore(); tsh(g, top, null, 5);
  if (L.armor) { const ad = `M${-tw + 6} ${G.shY + 30} L${tw - 6} ${G.shY + 30} L${ww + 4} ${G.waist + 4} L${-ww - 4} ${G.waist + 4} Z`; tsh(g, ad, lg(g, -tw, 0, tw, 0, [[0, mix(L.armor, '#000', .3)], [.5, L.armor], [1, mix(L.armor, '#000', .35)]]), 5);
    g.save(); g.clip(path(ad)); for (let y = G.shY + 56; y < G.waist; y += 30) { tln(g, [-tw, y, tw, y], 3, 'rgba(20,20,30,.6)'); for (let x = -tw + 14; x < tw; x += 26) tell(g, x, y - 12, 3, 3, L.rivet || '#e8c45a', 0); } g.restore(); tsh(g, ad, null, 5);
    [-1, 1].forEach(sd => tsh(g, `M${sd * (tw - 20)} ${G.shY - 10} Q${sd * (tw + 40)} ${G.shY} ${sd * (tw + 46)} ${G.shY + 70} L${sd * (tw + 6)} ${G.shY + 84} Q${sd * tw} ${G.shY + 30} ${sd * (tw - 30)} ${G.shY + 20} Z`, L.armor, 5)); }
  if (L.fur) { let d2 = `M${-tw - 16} ${G.shY + 20}`; for (let i = 0; i <= 12; i++) { const x = lerp(-tw - 16, tw + 16, i / 12), y = G.shY + (i % 2 ? 46 : 14) + Math.abs(i - 6) * -2; d2 += ` L${x} ${y}`; } d2 += ` L${tw + 10} ${G.shY - 16} Q0 ${G.shY - 40} ${-tw - 10} ${G.shY - 16} Z`; tsh(g, d2, L.fur, 5); for (let i = 0; i < 10; i++) tln(g, [-tw + i * tw * .2, G.shY - 4, -tw + i * tw * .2 + 6, G.shY + 20], 2.4, 'rgba(255,240,220,.3)'); }
  // crossed collar (left over right), white under-collar
  if (L.layers) L.layers.forEach((col, i) => { const off = (L.layers.length - i) * 9; tsh(g, `M${-tw * .38 - off} ${G.shY - 12} L${tw * .12} ${G.waist - 30 + off * .4} L${tw * .38 + off} ${G.shY - 12} Z`, col, 3.4); });
  const cy0 = G.shY - 12, cy1 = G.waist - (kid ? 10 : 30);
  if (L.suit) { tsh(g, `M${-tw * .3} ${cy0} L0 ${cy0 + 150} L${tw * .3} ${cy0} Z`, '#f4f2ec', 4); tsh(g, `M-12 ${cy0 + 8} L12 ${cy0 + 8} L18 ${cy0 + 120} L0 ${cy0 + 146} L-18 ${cy0 + 120} Z`, L.tie || '#7a2a2a', 3.4);
    [-1, 1].forEach(sd => tsh(g, `M${sd * tw * .32} ${cy0 - 4} L${sd * tw * .06} ${cy0 + 170} L${sd * tw * .2} ${cy0 + 60} L${sd * tw * .5} ${cy0 + 30} Z`, L.topD, 4)); [0, 1, 2].forEach(k => tell(g, -tw * .02, cy0 + 200 + k * 50, 5, 5, '#2a2020', 0)); }
  else {
  tsh(g, `M${-tw * .38} ${cy0} L${tw * .12} ${cy1} L${tw * .3} ${cy1 - 18} L${-tw * .14} ${cy0 - 4} Z`, L.collar, 4); tsh(g, `M${tw * .38} ${cy0} L${-tw * .02} ${cy1 - 30} L${-tw * .18} ${cy1 - 44} L${tw * .14} ${cy0 - 4} Z`, L.collar, 4);
  }
  if (kid) tln(g, [tw * .1, cy1 + 6, -ww + 6, G.waist + 146], 4, L.topD);
  // belt / obi
  if (kid) { tsh(g, `M${-ww - 4} ${G.waist - 40} Q0 ${G.waist - 30} ${ww + 4} ${G.waist - 40} L${ww + 6} ${G.waist + 22} Q0 ${G.waist + 32} ${-ww - 6} ${G.waist + 22} Z`, L.obi, 5); tln(g, [-ww - 4, G.waist - 6, 0, G.waist + 2, ww + 4, G.waist - 6], 5, L.obiCord); tell(g, 0, G.waist + 1, 9, 9, L.obiCord, 4); }
  else if (L.suit) { }
  else { tsh(g, `M${-ww - 2} ${G.waist - 18} L${ww + 2} ${G.waist - 18} L${ww + 2} ${G.waist + 14} L${-ww - 2} ${G.waist + 14} Z`, L.belt, 4.4); tln(g, [-ww, G.waist - 2, ww, G.waist - 2], 2, 'rgba(255,255,255,.3)');
    tsh(g, `M18 ${G.waist - 14} Q32 ${G.waist} 18 ${G.waist + 12} Q6 ${G.waist} 18 ${G.waist - 14} Z`, mix(L.belt, '#000', .15), 3.4); const bs = Math.sin(t * 1.5 + ph) * 3;
    tsh(g, `M16 ${G.waist + 8} L${4 + bs} ${G.waist + 90} L${16 + bs} ${G.waist + 92} L24 ${G.waist + 10} Z`, L.belt, 3.4); tsh(g, `M22 ${G.waist + 8} L${34 + bs} ${G.waist + 80} L${44 + bs} ${G.waist + 76} L28 ${G.waist + 6} Z`, L.belt, 3.4);
    if (L.pouch) { tsh(g, `M${-ww + 6} ${G.waist + 10} L${-ww + 46} ${G.waist + 10} L${-ww + 42} ${G.waist + 66} Q${-ww + 26} ${G.waist + 74} ${-ww + 10} ${G.waist + 66} Z`, L.pouch, 4); tln(g, [-ww + 8, G.waist + 26, -ww + 44, G.waist + 26], 3, mix(L.pouch, '#000', .2)); } }
  if (L.pompoms) { [-1, 1].forEach(sd => { tln(g, [sd * tw * .44, G.shY - 6, sd * tw * .3, G.shY + 200], 6, '#f4efe2'); [[.25, 40], [.6, 110], [.95, 190]].forEach(([q, dy]) => tell(g, sd * tw * (.44 - .14 * q), G.shY + dy, 20, 20, L.pompoms, 4)); }); }
  if (L.magatama) { tln(g, [-tw * .4, G.shY - 6, 0, G.shY + 70, tw * .4, G.shY - 6], 3, '#3a2a1a'); [[-36, .55], [-18, .8], [0, .95], [18, .8], [36, .55]].forEach(([x, q], i) => { const y = G.shY - 6 + q * 70;
    if (i === 2) { tsh(g, `M${x - 9} ${y - 2} C${x - 8} ${y - 16} ${x + 14} ${y - 14} ${x + 12} ${y + 4} C${x + 10} ${y + 20} ${x - 6} ${y + 26} ${x - 4} ${y + 12} C${x + 2} ${y + 10} ${x + 2} ${y + 2} ${x - 9} ${y - 2} Z`, L.magatama, 3); tell(g, x + 2, y - 4, 3, 3, 'rgba(255,255,255,.6)', 0); }
    else tell(g, x, y, 6, 6, i % 2 ? mix(L.magatama, '#fff', .35) : L.magatama, 2.6); }); }
  if (L.sword && !o.noSword) { g.save(); g.translate(-ww - 4, G.waist + 6); g.rotate(.5); tsh(g, 'M-8 0 L8 0 L10 240 L-10 240 Z', '#1e1a24', 4); tsh(g, 'M-22 -8 L22 -8 L18 6 L-18 6 Z', '#c8a040', 3.4); tsh(g, 'M-7 -8 L7 -8 L8 -70 L-8 -70 Z', '#4a2e1a', 3.4); tell(g, 0, -80, 11, 11, null, 4, 0, '#c8a040'); g.restore(); }
  g.restore();
  const raisedHands = [];
  // arms (viewer-left first), held props
  const overHead = h => h[1] < G.shY - 40 && (Math.abs(h[0] - G.head[0]) > G.hr[0] * .85 || h[1] < G.head[1] - G.hr[1] * .6);
  const lateL = overHead(hl), lateR = overHead(hr) && !(o.noArmR > .5), holdR = () => { if (o.hold && THOLD[o.hold] && !(o.noArmR > .5)) THOLD[o.hold](g, hr, o, t, L); };
  if (armsK === 'behind') { /* hands tucked behind the back: drawn before the torso */ }
  if (!lateL && armsK !== 'behind') armT(sh0, hl, -1, false); if (!lateR && !(o.noArmR > .5) && armsK !== 'behind') armT(sh1, hr, 1, true);   // noArmR: the right arm has been cut off
  if (!lateR) holdR();
  if (L.cane) { tln(g, [hr[0] + 6, hr[1] - 20, hr[0] + 24, 0], 14, '#5a3a22'); tln(g, [hr[0] + 6, hr[1] - 20, hr[0] + 24, 0], 7, '#8a6040'); }
  // head
  const nod = talk * (.06 * Math.sin(t * 8.6 + ph) + .02) + .025 * Math.sin(t * .7 + ph * 2.3) + (o.headDown || 0);
  g.save(); g.translate(G.head[0], G.head[1] + br * 2 - talk * 4); g.rotate((o.tilt || 0) + nod * .6);
  if (!kid) ttube(g, 0, G.hr[1] * .7, 0, G.hr[1] * 1.3, 52, 56, L.skinD, 5);
  else ttube(g, 0, G.hr[1] * .7, 0, G.hr[1] * 1.08, 52, 56, L.skinD, 5);
  faceT(g, L, G, o, t, ph, ex, talk);
  g.restore();
  if (lateL || lateR) { raisedHands.length = 0; if (lateL) armT(sh0, hl, -1, false); if (lateR) { armT(sh1, hr, 1, true); holdR(); } }   // raised arms go in front of the head
  raisedHands.forEach(a => mitten(g, ...a));   // never behind the head
  if (L.frontX) L.frontX(g, L, G, o, t);
  if (o.arrows) arrowsStuck(g, G, o.arrows, o.arrowSeed || 3, kid);
  g.restore();
}
var THOLD = {
  tsurugi: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.15); tsh(g, 'M-8 26 L8 26 L9 -6 L-9 -6 Z', '#4a2e1a', 4); tell(g, 0, 38, 12, 12, null, 5, 0, '#c8a040'); tsh(g, 'M-28 -6 L28 -6 L24 -20 L-24 -20 Z', '#c8a040', 4);
    tsh(g, 'M-11 -20 L11 -20 L9 -330 L0 -362 L-9 -330 Z', lg(g, -11, 0, 11, 0, [[0, '#8a96a8'], [.5, '#f6faff'], [1, '#7a8698']]), 4); tln(g, [0, -26, 0, -344], 2, 'rgba(60,70,90,.45)');
    if (o.chip) tsh(g, 'M9 -250 L-2 -240 L9 -228 Z', '#26222e', 0); if (o.glint) glow(g, 0, -300, 180, 'rgba(220,240,255,1)', o.glint); g.restore(); },
  kusanagi: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate(o.holdRot ?? -.1); glow(g, 0, -200, 420, 'rgba(255,220,140,1)', .75); tsh(g, 'M-9 26 L9 26 L10 -6 L-10 -6 Z', '#2a2a3a', 4); tsh(g, 'M-30 -6 L30 -6 L24 -24 L-24 -24 Z', '#e8c050', 4);
    tsh(g, 'M-13 -24 L13 -24 L11 -380 L0 -414 L-11 -380 Z', lg(g, -13, 0, 13, 0, [[0, '#d8c080'], [.5, '#fffdf0'], [1, '#c8a860']]), 4); g.restore(); },
  comb: (g, h, o, t) => { g.save(); g.translate(h[0] - 10, h[1] - 40); combShape(g, 1.2, o.combGlow ?? .5); g.restore(); },
  mirror: (g, h, o, t) => { g.save(); g.translate(h[0] - 40, h[1] - 60); glow(g, 0, 0, 260, 'rgba(255,240,200,1)', .6); tell(g, 0, 0, 70, 70, lg(g, -70, -70, 70, 70, [[0, '#fff6d0'], [.5, '#d8b050'], [1, '#8a6018']]), 5); tell(g, 0, 0, 52, 52, lg(g, -50, -50, 50, 50, [[0, '#ffffff'], [1, '#c8d0d8']]), 3); g.restore(); },
  saké: (g, h, o, t) => { g.save(); g.translate(h[0], h[1] - 20); tsh(g, 'M-34 -50 L34 -50 L26 30 L-26 30 Z', '#c8302a', 4); tell(g, 0, -50, 34, 8, '#f6ecd0', 3); g.restore(); },
};
function hairBackT(g, L, G, t, ph) { const H = L.hair, [hx, hy] = G.head, [rx, ry] = G.hr, sw = Math.sin(t * 1.5 + ph) * 5;
  g.save(); g.translate(hx, hy);
  if (L.hairStyle === 'mio') tsh(g, `M${-rx - 10} 10 C${-rx - 20} -120 ${rx + 20} -120 ${rx + 10} 10 C${rx + 14} 70 ${rx} 110 ${rx - 16} 128 L${-rx + 16} 128 C${-rx} 110 ${-rx - 14} 70 ${-rx - 10} 10 Z`, H, 6);
  if (L.hairStyle === 'wild') { tsh(g, `M${-rx - 30} -40 L${-rx - 70} 40 L${-rx - 40} 50 L${-rx - 74 + sw} 150 L${-rx - 20} 130 L${-rx - 30 + sw} 230 L-20 180 L20 180 L${rx + 30 + sw} 230 L${rx + 20} 130 L${rx + 74 + sw} 150 L${rx + 40} 50 L${rx + 70} 40 L${rx + 30} -40 Z`, H, 5); }
  if (L.hairStyle === 'longBangs' || L.hairStyle === 'goddess') { tsh(g, `M${-rx - 16} -40 C${-rx - 30} 100 ${-rx - 40 + sw} 260 ${-rx - 20 + sw} 380 L${rx + 20 + sw} 380 C${rx + 40 + sw} 260 ${rx + 30} 100 ${rx + 16} -40 Z`, H, 5);
    for (let i = -2; i <= 2; i++) tln(g, [i * 30, 120, i * 34 + sw, 360], 2.4, L.hairHi); if (L.ribbon) { tsh(g, `M-30 300 L30 300 L36 330 L-36 330 Z`, L.ribbon, 4); } }
  if (L.hairStyle === 'heian') { const len = 760; tsh(g, `M${-rx - 14} -30 C${-rx - 40} 200 ${-rx - 60 + sw} ${len * .7} ${-rx - 70 + sw} ${len} L${rx + 70 + sw} ${len} C${rx + 60 + sw} ${len * .7} ${rx + 40} 200 ${rx + 14} -30 Z`, H, 5);
    for (let i = -3; i <= 3; i++) tln(g, [i * 30, 160, i * 38 + sw, len - 30], 2.4, L.hairHi); }
  if (L.hairStyle === 'lowtie') tsh(g, `M${-rx - 10} -30 C${-rx - 20} 80 ${-rx} 160 -20 210 L20 210 C${rx} 160 ${rx + 20} 80 ${rx + 10} -30 Z`, H, 5);
  g.restore(); }
function lowerT(g, L, G, t, walk) { const kid = L.kind === 'kid', lw = walk != null ? Math.sin(walk) : 0;
  if (L.bottom === 'robe') { // kid yukata reaching the ankles, geta below
    [[-30, -1], [30, 1]].forEach(([x, sd]) => { const lift = walk != null ? Math.max(0, sd * lw) * 16 : 0; g.save(); g.translate(0, -lift);
      tsh(g, `M${x - 30} 0 L${x + 30} 0 L${x + 30} 12 L${x - 30} 12 Z`, '#c89a64', 4); tsh(g, `M${x - 22} 12 l8 0 l0 10 l-8 0 Z M${x + 14} 12 l8 0 l0 10 l-8 0 Z`, '#8a6040', 3);
      tsh(g, `M${x - 24} -2 Q${x - 26} -34 ${x} -38 Q${x + 26} -34 ${x + 24} -2 Z`, '#fbf8f2', 4.4); tln(g, [x - 18, -10, x, -28, x + 18, -10], 6, '#d23a3a'); g.restore(); });
    const d = `M${-92} ${G.waist + 20} L${-98} -26 Q0 -14 98 -26 L92 ${G.waist + 20} Z`; tsh(g, d, L.top, 5); tpattern(g, d, L.pat, L.patCol, .8); g.save(); g.clip(path(d)); g.fillStyle = 'rgba(40,20,40,.16)'; g.fillRect(36, -400, 200, 500); g.restore(); tsh(g, d, null, 5);
    tln(g, [10, G.waist + 24, -6, -22], 4, L.topD); return; }
  if (L.bottom === 'hakama') { // wide trousers tied below the knee, bare shins, straw sandals
    [[-1], [1]].forEach(([sd]) => { const x = sd * 58, sw2 = walk != null ? sd * lw * 22 : 0, lift = walk != null ? Math.max(0, sd * lw) * 22 : 0;
      ttube(g, x + sw2 * .4, -220, x + sw2, -12 - lift, 40, 32, L.wraps || L.skin, 5); if (L.wraps) for (let k = 0; k < 5; k++) { const yy = -196 + k * 36 - lift * k / 5, xx = x + sw2 * (.4 + k * .12); tln(g, [xx - 18, yy, xx + 18, yy + 22], 3, L.wrapLine || 'rgba(90,60,40,.7)'); tln(g, [xx + 18, yy, xx - 18, yy + 22], 3, L.wrapLine || 'rgba(90,60,40,.7)'); }
      tsh(g, `M${x - 30 + sw2} ${-14 - lift} L${x + 34 + sw2} ${-14 - lift} Q${x + 42 + sw2} ${4 - lift} ${x + 30 + sw2} ${6 - lift} L${x - 32 + sw2} ${6 - lift} Z`, '#c8a868', 4.4); tln(g, [x - 8 + sw2, -30 - lift, x + 8 + sw2, -10 - lift], 4, '#8a6a3a');
      const hk = `M0 ${G.waist + 10} L${sd * 104 + sw2 * .2} ${G.waist + 20} L${sd * 112 + sw2 * .5} -236 Q${sd * 60 + sw2 * .5} -214 ${sd * 10 + sw2 * .4} -238 L${sd * 6} ${G.hip + 120} L0 ${G.hip + 100} Z`;
      tsh(g, hk, sd < 0 ? L.hakamaD : L.hakama, 5); if (L.hakamaPat) { tpattern(g, hk, L.hakamaPat, L.hakamaPatCol || '#1a1410', 1); tsh(g, hk, null, 5); } for (let k = 1; k < 4; k++) tln(g, [sd * (12 + k * 24), G.waist + 30, sd * (16 + k * 26) + sw2 * .5, -246], 2.4, 'rgba(60,40,30,.3)');
      tln(g, [sd * 22 + sw2 * .5, -220, sd * 100 + sw2 * .6, -218], 7, L.cord || OUT); tln(g, [sd * 76 + sw2 * .6, -218, sd * 86 + sw2 * .6, -184], 5, L.cord || OUT); }); return; }
  if (L.bottom === 'pants') { [[-1], [1]].forEach(([sd]) => { const x = sd * 40, sw2 = walk != null ? sd * lw * 22 : 0, lift = walk != null ? Math.max(0, sd * lw) * 22 : 0;
      ttube(g, sd * 30, G.hip, x + sw2, -26 - lift, 74, 60, sd < 0 ? mix(L.pants, '#000', .2) : L.pants, 5); tln(g, [sd * 26, G.hip + 40, x + sw2 + sd * 4, -60 - lift], 2, 'rgba(0,0,0,.25)');
      tsh(g, `M${x - 30 + sw2} ${-26 - lift} L${x + 40 + sw2} ${-26 - lift} Q${x + 52 + sw2} ${-4 - lift} ${x + 40 + sw2} ${4 - lift} L${x - 32 + sw2} ${4 - lift} Z`, L.shoes || '#1e1616', 4); });
    tsh(g, `M${-80} ${G.waist - 10} L80 ${G.waist - 10} L80 ${G.hip + 10} L-80 ${G.hip + 10} Z`, L.pants, 4); return; }
  if (L.bottom === 'skirt') { // long pleated mo skirt, toes peeking out
    [[-28], [28]].forEach(([x]) => tsh(g, `M${x - 26} 0 Q${x - 26} -22 ${x} -24 Q${x + 26} -22 ${x + 26} 0 Z`, '#c8a868', 4));
    const sk = `M${-86} ${G.waist} L${-120} -14 Q0 4 120 -14 L86 ${G.waist} Z`; tsh(g, sk, L.skirt, 5); g.save(); g.clip(path(sk)); for (let k = -5; k <= 5; k++) tln(g, [k * 16, G.waist + 10, k * 24, 0], 3, L.skirtD); g.fillStyle = 'rgba(40,20,40,.14)'; g.fillRect(40, -600, 200, 700); g.restore(); tsh(g, sk, null, 5);
    if (L.pleats) tsh(g, `M${-100} ${G.waist + 60} L${-112} ${G.waist + 220} Q0 ${G.waist + 236} 112 ${G.waist + 220} L100 ${G.waist + 60} Z`, L.pleats, 4); return; }
}
function faceT(g, L, G, o, t, ph, ex, talk) { const kid = L.kind === 'kid', [rx, ry] = G.hr, H = L.hair, gl = Math.floor(t * .55 + ph * 3.1), glance = (((gl * 9301 + 49297) % 233280) / 233280 - .5) * 2, [lx0, ly0] = o.look || [0, 0], lx = clamp(lx0 + glance * .3, -1, 1), ly = ly0;
  const blink = ((t * .63 + ph) % 3.7) < .1, closed = blink || ex === 'happy' || ex === 'sleep' || ex === 'cry' || ex === 'smile' && !kid && false;
  // ears, face
  if (!o.noEars) [-1, 1].forEach(s => { tell(g, s * rx * .98, ry * .05, rx * .17, ry * .22, L.skin, 5); tln(g, [s * rx * .98, -ry * .04, s * rx * 1.04, ry * .08], 2.4, L.skinD); });
  const face = kid ? `M${-rx} -10 C${-rx} -${ry * 1.05} ${rx} -${ry * 1.05} ${rx} -10 C${rx} ${ry * .7} ${rx * .5} ${ry * .98} 0 ${ry * .98} C${-rx * .5} ${ry * .98} ${-rx} ${ry * .7} ${-rx} -10 Z`
                   : L.jaw === 'square' ? `M${-rx} -20 C${-rx} -${ry * 1.1} ${rx} -${ry * 1.1} ${rx} -20 L${rx * .92} ${ry * .55} Q${rx * .6} ${ry * .96} 0 ${ry} Q${-rx * .6} ${ry * .96} ${-rx * .92} ${ry * .55} Z`
                   : L.jaw === 'pointed' ? `M${-rx} -20 C${-rx} -${ry * 1.1} ${rx} -${ry * 1.1} ${rx} -20 C${rx} ${ry * .42} ${rx * .32} ${ry * .94} 0 ${ry * 1.04} C${-rx * .32} ${ry * .94} ${-rx} ${ry * .42} ${-rx} -20 Z`
                   : L.jaw === 'wide' ? `M${-rx} -20 C${-rx} -${ry * 1.1} ${rx} -${ry * 1.1} ${rx} -20 C${rx * 1.04} ${ry * .62} ${rx * .7} ${ry * .96} 0 ${ry * .96} C${-rx * .7} ${ry * .96} ${-rx * 1.04} ${ry * .62} ${-rx} -20 Z`
                   : `M${-rx} -20 C${-rx} -${ry * 1.1} ${rx} -${ry * 1.1} ${rx} -20 C${rx} ${ry * .5} ${rx * .5} ${ry} 0 ${ry} C${-rx * .5} ${ry} ${-rx} ${ry * .5} ${-rx} -20 Z`;
  const age = L.age ?? (L.kind === 'elder' ? 1 : .3);
  tsh(g, face, L.skin, 6); g.save(); g.clip(path(face)); g.fillStyle = 'rgba(160,80,60,.12)'; g.beginPath(); g.ellipse(rx * .9, ry * .2, rx * .5, ry * 1.2, 0, 0, 7); g.fill(); g.restore(); tsh(g, face, null, 6);
  if (L.paint) { [-1, 1].forEach(sd => { tln(g, [sd * rx * .3, ry * .12, sd * rx * .86, ry * .02], 7, L.paint); tln(g, [sd * rx * .36, ry * .3, sd * rx * .84, ry * .22], 7, L.paint); }); tln(g, [-rx * .18, -ry * .5, rx * .18, -ry * .5], 6, L.paint); }
  if (L.blush || kid) { tell(g, -rx * .58, ry * .38, rx * .2, ry * .1, L.blush || 'rgba(240,120,110,.35)', 0); tell(g, rx * .58, ry * .38, rx * .2, ry * .1, L.blush || 'rgba(240,120,110,.35)', 0); }
  // eyes
  const ex0 = kid ? 46 : rx * .42, ey = kid ? 6 : -ry * .06;
  [-1, 1].forEach(s => { const cx = s * ex0;
    if (closed) { if (ex === 'cry') { tln(g, [cx - 22, ey - 2, cx, ey + 8, cx + 22, ey - 2], kid ? 6 : 5); } else if (ex === 'sleep') tln(g, [cx - 20, ey + 4, cx, ey + 10, cx + 20, ey + 4], 5); else tln(g, [cx - (kid ? 26 : 18), ey + 4, cx, ey - (ex === 'happy' ? 14 : 2), cx + (kid ? 26 : 18), ey + 4], kid ? 6 : 5); return; }
    if (kid) { const ry2 = ex === 'shock' || ex === 'wide' || ex === 'scared' ? 40 : 34, rx2 = 30; tell(g, cx, ey, rx2, ry2, '#fffdf8', 6); const pr = ex === 'shock' || ex === 'scared' ? 7 : 11; tell(g, cx + lx * 12, ey + 4 + ly * 12, pr, pr * 1.08, '#1c1418', 0);
      if (ex === 'sad' || ex === 'annoyed' || ex === 'worry' || ex === 'smug') { const lid = ex === 'annoyed' || ex === 'smug' ? .45 : .3; tsh(g, `M${cx - rx2 - 3} ${ey - ry2 * .2} Q${cx} ${ey - ry2 - 6} ${cx + rx2 + 3} ${ey - ry2 * .2} L${cx + rx2 + 3} ${ey - ry2 * (1 - lid * 2) } L${cx - rx2 - 3} ${ey - ry2 * (1 - lid * 2)} Z`, L.skin, 0); tln(g, [cx - rx2, ey - ry2 * (1 - lid * 2) + (ex === 'sad' ? s * 4 : 0), cx + rx2, ey - ry2 * (1 - lid * 2) - (ex === 'sad' ? s * 4 : 0)], 6); } }
    else { const op = ex === 'shock' || ex === 'scared' ? 1.25 : ex === 'angry' || ex === 'fierce' ? .75 : 1, ES = EYES[L.eyeShape || 'almond'] || EYES.almond, w2 = rx * .29 * ES.w * (L.eyeS || 1), h2 = ry * .125 * op * ES.h * (L.eyeS || 1), xi = cx - s * w2, xo = cx + s * w2, oy = ES.tilt;
      tsh(g, `M${xi} ${ey} Q${cx} ${ey - h2 * 1.9} ${xo} ${ey + oy} Q${cx} ${ey + h2 * 1.3} ${xi} ${ey} Z`, '#fffdf8', 3.4); const ix = cx + lx * w2 * .35, iy = ey - 1 + ly * 3;
      if (o.foxEyes) { glow(g, ix, iy, 60, 'rgba(255,190,60,1)', o.foxEyes * .8); tell(g, ix, iy, w2 * .48, h2 * 1.25, '#ffc23a', 0); tell(g, ix, iy, w2 * .08, h2 * 1.0, '#140c08', 0); } else { tell(g, ix, iy, w2 * .44, h2 * 1.2, L.iris || '#3a2418', 0); tell(g, ix, iy, w2 * .2, h2 * .62, '#140c08', 0); } tell(g, ix + 3, iy - 3, 2.4, 2.4, '#fff', 0);
      tln(g, [xi - s * 2, ey + 1, cx, ey - h2 * 1.9, xo + s * 2, ey + oy + 1], ES.lid || 5.4); if (age >= .6) tln(g, [cx - w2 * .6, ey + h2 * 1.5, cx + w2 * .6, ey + h2 * 1.5], 2, 'rgba(120,60,40,.45)');
      if (age >= .75) [-6, 4].forEach(dy => tln(g, [xo + s * 6, ey + dy * .3, xo + s * 18, ey + dy], 2, 'rgba(120,60,40,.45)')); if (L.lashes) tln(g, [cx + s * w2, ey - 1, cx + s * (w2 + 9), ey - 9], 4); } });
  // nose
  if (kid) tln(g, [-4, 30, 4, 36, -2, 40], 4.4); else { const nz = L.nose || 'line';
    if (nz === 'button') { tln(g, [-9, ry * .26, 0, ry * .32, 9, ry * .26], 4); tell(g, 0, ry * .2, 8, 6, 'rgba(150,80,50,.18)', 0); }
    else if (nz === 'broad') { tln(g, [0, ry * .02, -4, ry * .24], 3.4, 'rgba(90,50,30,.6)'); tln(g, [-16, ry * .26, -8, ry * .34, 0, ry * .3, 8, ry * .34, 16, ry * .26], 4); }
    else if (nz === 'long') { tsh(g, `M2 ${-ry * .1} L-9 ${ry * .36} Q0 ${ry * .42} 9 ${ry * .38} Z`, 'rgba(150,80,50,.22)', 0); tln(g, [2, -ry * .1, -8, ry * .36, 5, ry * .4], 4); }
    else { tsh(g, `M2 ${-ry * .02} L-8 ${ry * .3} Q0 ${ry * .36} 8 ${ry * .32} Z`, 'rgba(150,80,50,.22)', 0); tln(g, [2, -ry * .02, -6, ry * .3, 4, ry * .34], 4); }
    if (age >= .45) { tln(g, [-rx * .62, ry * .24, -rx * .5, ry * .44], 2.4, 'rgba(150,80,50,.35)'); tln(g, [rx * .62, ry * .24, rx * .5, ry * .44], 2.4, 'rgba(150,80,50,.35)'); }
    if (age >= .8) [-.62, -.52].forEach(q => tln(g, [-rx * .36, ry * q, 0, ry * (q - .04), rx * .36, ry * q], 2, 'rgba(130,70,45,.35)'));
    if (L.freckles) { const r = rng(L.freckles); for (let i = 0; i < 14; i++) { const sd = i % 2 ? 1 : -1; tell(g, sd * rx * (.36 + r() * .3), ry * (.16 + r() * .2), 2.2, 2.2, 'rgba(150,80,50,.5)', 0); } }
    if (L.mole) tell(g, L.mole[0] * rx, L.mole[1] * ry, 3.4, 3.4, 'rgba(60,30,20,.75)', 0); }
  if (kid) [[-62, 36], [-74, 46], [-56, 52], [62, 36], [74, 46], [56, 52]].forEach(([x, y]) => tell(g, x, y, 2.6, 2.6, 'rgba(170,90,60,.7)', 0));
  // beard under the mouth
  if (L.beard === 'longWhite') { tsh(g, `M${-rx * .8} ${ry * .3} C${-rx * .7} ${ry * 1.2} ${-rx * .3} ${ry * 1.8} 0 ${ry * 2.1} C${rx * .3} ${ry * 1.8} ${rx * .7} ${ry * 1.2} ${rx * .8} ${ry * .3} Q0 ${ry * .7} ${-rx * .8} ${ry * .3} Z`, L.hair, 5);
    for (let i = -2; i <= 2; i++) tln(g, [i * 12, ry * .7, i * 10, ry * 1.6 - Math.abs(i) * 12], 2.4, 'rgba(160,150,140,.6)'); }
  if (L.beard === 'storm' || L.beard === 'short') { tsh(g, `M${-rx * .92} ${ry * .1} C${-rx * .9} ${ry * .8} ${-rx * .4} ${ry * 1.18} 0 ${ry * 1.22} C${rx * .4} ${ry * 1.18} ${rx * .9} ${ry * .8} ${rx * .92} ${ry * .1} C${rx * .6} ${ry * .5} ${rx * .3} ${ry * .55} 0 ${ry * .5} C${-rx * .3} ${ry * .55} ${-rx * .6} ${ry * .5} ${-rx * .92} ${ry * .1} Z`, H, 5);
    if (L.beard === 'storm') [[-20, 1.1], [0, 1.3], [20, 1.1]].forEach(([x, q]) => tsh(g, `M${x - 10} ${ry * 1.1} L${x} ${ry * q + 16} L${x + 10} ${ry * 1.1} Z`, H, 3)); }
  if (L.beard === 'stubble') { const r = rng(4); for (let i = 0; i < 40; i++) tell(g, (r() - .5) * rx * 1.4, ry * .4 + r() * ry * .5, 1.8, 1.8, 'rgba(40,30,30,.45)', 0); }
  // mouth
  const my = kid ? 66 : ry * .56;
  if (L.beard === 'storm' || L.beard === 'short' || L.beard === 'longWhite') tsh(g, `M${-rx * .5} ${my - 8} Q${-rx * .2} ${my - 20} 0 ${my - 12} Q${rx * .2} ${my - 20} ${rx * .5} ${my - 8} Q${rx * .2} ${my - 6} 0 ${my - 6} Q${-rx * .2} ${my - 6} ${-rx * .5} ${my - 8} Z`, L.beard === 'longWhite' ? L.hair : H, 4);
  const shout = ex === 'shout' || ex === 'scared' || ex === 'roar';
  if (talk > .04 || shout) { const op = Math.max(talk, shout ? .8 : 0), w = kid ? (shout ? 30 : 22) : rx * (shout ? .34 : .24), hgt = kid ? 46 : ry * .5;
    tsh(g, `M${-w} ${my - 2} Q0 ${my - 8} ${w} ${my - 2} Q${w * .9} ${my + 6 + op * hgt * .9} 0 ${my + 8 + op * hgt} Q${-w * .9} ${my + 6 + op * hgt * .9} ${-w} ${my - 2} Z`, '#4a1418', 5);
    tsh(g, `M${-w * .7} ${my - 1} Q0 ${my - 5} ${w * .7} ${my - 1} L${w * .6} ${my + 4} Q0 ${my + 1} ${-w * .6} ${my + 4} Z`, '#fbf6ee', 0); tell(g, 0, my + 6 + op * hgt * .72, w * .5, 4 + op * 6, '#e06a74', 0); }
  else if (ex === 'shock' || ex === 'wide') tell(g, 0, my + 8, kid ? 13 : 9, kid ? 18 : 12, '#4a1418', 5);
  else if (ex === 'sad' || ex === 'worry' || ex === 'cry') tln(g, [-(kid ? 20 : 14), my + 8, 0, my - 2, kid ? 20 : 14, my + 8], 5);
  else if (ex === 'happy' || ex === 'smile') { if (kid) { tsh(g, `M-30 ${my - 6} Q0 ${my + 40} 30 ${my - 6} Q0 ${my + 4} -30 ${my - 6} Z`, '#4a1418', 5); tell(g, 0, my + 16, 11, 6, '#e06a74', 0); } else tln(g, [-rx * .26, my, 0, my + 10, rx * .26, my], 5); }
  else if (ex === 'smug') tln(g, [-(kid ? 18 : 12), my + 4, kid ? 8 : 6, my + 2, kid ? 22 : 16, my - 8], 5);
  else if (ex === 'angry' || ex === 'fierce' || ex === 'annoyed') tln(g, [-(kid ? 18 : 14), my + 4, kid ? 18 : 14, my + 2], 5);
  else if (ex === 'whisper') tell(g, 0, my + 4, kid ? 9 : 6, kid ? 7 : 5, '#4a1418', 4);
  else tln(g, [-(kid ? 18 : 12), my, 0, my + (kid ? 10 : 4), kid ? 18 : 12, my], 5);
  if (L.fangs) [-1, 1].forEach(sd => tsh(g, `M${sd * rx * .22 - 8} ${my + 8} L${sd * rx * .22 + 8} ${my + 8} L${sd * rx * .24} ${my - L.fangs} Z`, '#fbf6ea', 3.4));
  if (L.lips && talk <= .04 && !shout) tln(g, [-10, my + 1, 10, my + 1], 3, L.lips);
  if (ex === 'cry') { const q = (t * .8) % 1; [-1, 1].forEach(s => { tln(g, [s * ex0, ey + 12, s * (ex0 + 4), ey + 60], 6, 'rgba(150,200,235,.85)'); tsh(g, `M${s * (ex0 + 4) - 7} ${ey + 40 + q * 50} Q${s * (ex0 + 4)} ${ey + 22 + q * 50} ${s * (ex0 + 4) + 7} ${ey + 40 + q * 50} Q${s * (ex0 + 4)} ${ey + 52 + q * 50} ${s * (ex0 + 4) - 7} ${ey + 40 + q * 50} Z`, 'rgba(190,225,245,.95)', 2.4); }); }
  if (o.sweat) { const q = (t * .7) % 1; tsh(g, `M${rx * .8} ${-ry * .5 + q * 30} q12 18 0 28 q-12 -10 0 -28 Z`, 'rgba(170,215,240,.95)', 3); }
  // front hair
  hairFrontT(g, L, G, t, ph);
  if (L.hikimayu) { [-1, 1].forEach(sd => tell(g, sd * rx * .34, -ry * .62, rx * .1, ry * .05, 'rgba(40,30,30,.75)', 0)); }
  // brows
  const bc = L.browCol || H, bw = (L.brow || (kid ? 7 : 6)), by = kid ? -50 : -ry * .3;
  const BR = { neutral: [0, 0], smile: [-2, -2], happy: [-4, -4], angry: [8, -8], fierce: [7, -6], shock: [-12, -12], scared: [-6, -14], sad: [-2, -12], cry: [-2, -14], worry: [-2, -12], annoyed: [6, 2], smug: [4, -6], wide: [-12, -12], whisper: [-2, -6], sleep: [2, 2] }[ex] || [0, 0];
  if (!L.hikimayu) [-1, 1].forEach(s => { const x0 = s * (kid ? 20 : rx * .2), x1 = s * (kid ? 72 : rx * .66); tln(g, [x0, by + BR[0] - (talk > .3 ? 4 : 0), (x0 + x1) / 2, by - 6 + Math.min(BR[0], BR[1]) - (talk > .3 ? 4 : 0), x1, by + BR[1]], bw, bc); });
  hatT(g, L, rx, ry, t); if (L.headX) L.headX(g, L, rx, ry, o, t, ex); if (o.kasa) kasaT(g, rx, ry, o.kasa); if (L.horns) hornsT(g, L, rx, ry); if (o.foxEars) foxEarsT(g, o.foxEars, rx, ry, o.foxCol);
  if (o.comb) { g.save(); g.translate(rx * .45, -ry * .95); g.rotate(.35); combShape(g, kid ? 1.1 : .9, o.comb); g.restore(); }
}
function hairFrontT(g, L, G, t, ph) { const H = L.hair, HL = L.hairHi, [rx, ry] = G.hr, sw = Math.sin(t * 1.3 + ph) * 3;
  if (L.hairStyle === 'mio') { // straight-cut fringe, two round buns with red cords, stray strands, a flower pin
    [[-1], [1]].forEach(([s]) => { tell(g, s * rx * .72, -ry * .92, 44, 42, H, 6); tsh(g, `M${s * rx * .72 - 24} ${-ry * .92 - 14} Q${s * rx * .72} ${-ry * .92 - 34} ${s * rx * .72 + 22} ${-ry * .92 - 16}`, null, 4, HL);
      tln(g, [s * rx * .72 - 30, -ry * .92 + 28, s * rx * .72 + 30, -ry * .92 + 28], 8, '#d23a3a'); tln(g, [s * rx * .72 + s * 22, -ry * .92 + 30, s * rx * .72 + s * 40, -ry * .92 + 62], 6, '#d23a3a'); });
    tsh(g, `M${-rx - 6} 0 C${-rx - 10} -${ry * 1.16} ${rx + 10} -${ry * 1.16} ${rx + 6} 0 L${rx - 6} -6 L${rx - 16} -40 L${rx * .55} -34 L${rx * .4} -54 L${rx * .15} -40 L0 -56 L${-rx * .18} -40 L${-rx * .4} -54 L${-rx * .55} -34 L${-rx + 16} -40 L${-rx + 6} -6 Z`, H, 6);
    tsh(g, `M${-rx * .5} -${ry * .9} Q0 -${ry * 1.02} ${rx * .5} -${ry * .9}`, null, 6, HL);
    tsh(g, `M-10 -${ry * 1.02} C-24 -${ry * 1.3} 10 -${ry * 1.36} 16 -${ry * 1.22}`, null, 5); tsh(g, `M14 -${ry * 1.0} C24 -${ry * 1.24} 50 -${ry * 1.26} 46 -${ry * 1.12}`, null, 5);
    sakura(g, rx * .72, -ry * .5, 16, '#f6a8c0', true); return; }
  if (L.hairStyle === 'wild') { tsh(g, `M${-rx - 8} 0 L${-rx - 30} -50 L${-rx - 8} -60 L${-rx - 26} -110 L${-rx * .5} -${ry * 1.0} L${-rx * .5 + 10} -${ry * 1.3} L0 -${ry * 1.08} L${rx * .3} -${ry * 1.36} L${rx * .5} -${ry * 1.02} L${rx + 26} -110 L${rx + 8} -60 L${rx + 30} -50 L${rx + 8} 0 L${rx - 8} -${ry * .5} L${rx * .4} -${ry * .62} L${rx * .2} -${ry * .44} L0 -${ry * .66} L${-rx * .25} -${ry * .44} L${-rx * .45} -${ry * .64} L${-rx + 8} -${ry * .5} Z`, H, 5);
    tsh(g, `M${-rx * .5} -${ry * .9} L0 -${ry * .96} L${rx * .4} -${ry * .86}`, null, 4, HL); [[-.7, -.6, -.9, -.2], [-.3, -.8, -.4, -.5], [.3, -.8, .4, -.5], [.7, -.6, .9, -.2]].forEach(([a, b2, c2, d]) => tln(g, [rx * a, ry * b2, rx * c2, ry * d], 2.4, 'rgba(120,120,160,.5)'));
    if (L.band !== false) { tsh(g, `M${-rx - 6} -${ry * .55} Q0 -${ry * .76} ${rx + 6} -${ry * .55} L${rx + 4} -${ry * .38} Q0 -${ry * .6} ${-rx - 4} -${ry * .38} Z`, L.band || '#c8302a', 4); tsh(g, `M${rx} -${ry * .48} L${rx + 40 + sw * 3} -${ry * .2} L${rx + 30 + sw * 3} -${ry * .1} L${rx - 4} -${ry * .38} Z`, L.band || '#c8302a', 4); } return; }
  if (L.hairStyle === 'mizura') { tsh(g, `M${-rx - 6} -10 C${-rx - 8} -${ry * 1.14} ${rx + 8} -${ry * 1.14} ${rx + 6} -10 C${rx} -${ry * .7} ${rx * .3} -${ry * .78} 0 -${ry * .7} C${-rx * .3} -${ry * .78} ${-rx} -${ry * .7} ${-rx - 6} -10 Z`, H, 5);
    tln(g, [0, -ry * 1.04, 0, -ry * .72], 3, L.hairHi === '#ffffff' ? 'rgba(180,170,160,.8)' : 'rgba(0,0,0,.4)');
    if (L.fringe) { tsh(g, `M${-rx * .9} -${ry * .62} C${-rx * .7} -${ry * 1.02} ${rx * .7} -${ry * 1.02} ${rx * .9} -${ry * .62} L${rx * .62} -${ry * .44} L${rx * .4} -${ry * .6} L${rx * .2} -${ry * .38} L0 -${ry * .56} L${-rx * .22} -${ry * .36} L${-rx * .42} -${ry * .58} L${-rx * .64} -${ry * .42} Z`, H, 5); tsh(g, `M${-rx * .5} -${ry * .86} Q0 -${ry * .96} ${rx * .5} -${ry * .86}`, null, 4, HL); }
    [-1, 1].forEach(s => { tsh(g, `M${s * rx * 1.02} -${ry * .2} C${s * (rx + 44)} -${ry * .24} ${s * (rx + 46)} ${ry * .22} ${s * rx * 1.04} ${ry * .2} Z`, H, 5); tsh(g, `M${s * rx * 1.04} ${ry * .2} C${s * (rx + 46)} ${ry * .22} ${s * (rx + 44)} ${ry * .7} ${s * rx * 1.0} ${ry * .62} Z`, H, 5); tln(g, [s * (rx - 2), ry * .2, s * (rx + 40), ry * .2], 6, L.cord || '#c8302a'); }); return; }
  if (L.hairStyle === 'longBangs' || L.hairStyle === 'goddess') { tsh(g, `M${-rx - 8} 40 C${-rx - 14} -${ry * 1.16} ${rx + 14} -${ry * 1.16} ${rx + 8} 40 L${rx - 6} 20 C${rx - 4} -${ry * .3} ${rx * .5} -${ry * .44} ${rx * .3} -${ry * .52} L${rx * .1} -${ry * .38} L0 -${ry * .56} L${-rx * .14} -${ry * .38} L${-rx * .34} -${ry * .52} C${-rx * .5} -${ry * .44} ${-rx + 4} -${ry * .3} ${-rx + 6} 20 Z`, H, 5);
    tsh(g, `M${-rx * .5} -${ry * .92} Q0 -${ry * 1.04} ${rx * .5} -${ry * .92}`, null, 4, HL);
    if (L.hairStyle === 'goddess') { tsh(g, `M${-rx * .9} -${ry * .86} Q0 -${ry * 1.3} ${rx * .9} -${ry * .86} L${rx * .8} -${ry * .74} Q0 -${ry * 1.12} ${-rx * .8} -${ry * .74} Z`, '#e8b84a', 4); [-.5, 0, .5].forEach(k => tell(g, k * rx, -ry * (1.06 - Math.abs(k) * .2), 7, 7, k ? '#d23a3a' : '#2fa888', 3)); }
    else tsh(g, `M${-rx * .9} -${ry * .9} Q${-rx * 1.1} -${ry * .7} ${-rx * .96} -${ry * .5} L${-rx * .74} -${ry * .74} Z`, L.ribbon || '#d23a3a', 4); return; }
  if (L.hairStyle === 'heian') { tsh(g, `M${-rx - 8} 120 C${-rx - 14} -${ry * 1.2} ${rx + 14} -${ry * 1.2} ${rx + 8} 120 L${rx - 4} 110 C${rx} -${ry * .2} ${rx * .5} -${ry * .78} 4 -${ry * .86} L0 -${ry * .7} L-4 -${ry * .86} C${-rx * .5} -${ry * .78} ${-rx} -${ry * .2} ${-rx + 4} 110 Z`, H, 5);
    tsh(g, `M${-rx * .5} -${ry * .9} Q0 -${ry * 1.0} ${rx * .5} -${ry * .9}`, null, 4, HL); [-1, 1].forEach(sd => tsh(g, `M${sd * rx * .92} 0 C${sd * rx * 1.02} 160 ${sd * rx * .96} 260 ${sd * rx * .84} 330 L${sd * rx * .7} 320 C${sd * rx * .8} 240 ${sd * rx * .86} 140 ${sd * rx * .8} 0 Z`, H, 4)); return; }
  if (L.hairStyle === 'side') { tsh(g, `M${-rx - 4} -10 C${-rx - 8} -${ry * 1.16} ${rx + 8} -${ry * 1.16} ${rx + 4} -10 C${rx} -${ry * .56} ${rx * .5} -${ry * .74} ${-rx * .2} -${ry * .66} C${-rx * .6} -${ry * .6} ${-rx} -${ry * .4} ${-rx - 4} -10 Z`, H, 5);
    tln(g, [-rx * .2, -ry * 1.04, -rx * .24, -ry * .7], 2.4, HL); if (L.moustache) tsh(g, `M-${rx * .34} ${ry * .44} Q0 ${ry * .3} ${rx * .34} ${ry * .44} Q0 ${ry * .4} -${rx * .34} ${ry * .44} Z`, H, 3); if (L.glasses) { [-1, 1].forEach(sd => tell(g, sd * rx * .42, -ry * .05, rx * .24, ry * .17, 'rgba(220,240,255,.15)', 4)); tln(g, [-rx * .18, -ry * .07, rx * .18, -ry * .07], 3); } return; }
  if (L.hairStyle === 'lowtie') { tsh(g, `M${-rx - 6} 10 C${-rx - 8} -${ry * 1.14} ${rx + 8} -${ry * 1.14} ${rx + 6} 10 C${rx} -${ry * .64} ${rx * .3} -${ry * .74} 0 -${ry * .66} C${-rx * .3} -${ry * .74} ${-rx} -${ry * .64} ${-rx - 6} 10 Z`, H, 5); tln(g, [0, -ry * 1.04, 0, -ry * .68], 3, 'rgba(160,150,140,.8)'); return; }
}
// ---------------- Kon: a small white-and-red kitsune ----------------
function kitsune(g, o) { const t = o.t || 0, ex = o.expr || 'calm', talk = o.talk || 0, ph = o.ph || 0, br = Math.sin(t * 1.9 + ph);
  const W0 = '#fbf6ee', WD = '#dcd2d6', R = '#d8342a', RD = '#a82420', GO = '#f2c94c';
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  const WK = o.walk ? t * (o.walkRate || 6) : null, wb = WK != null ? -Math.abs(Math.sin(WK)) * 6 : 0;   // walking: four-legged gait, body level
  g.fillStyle = rg(g, 0, 0, 8, 150, [[0, 'rgba(25,12,20,.32)'], [1, 'rgba(25,12,20,0)']]); g.beginPath(); g.ellipse(-10, 4, 150, 16, 0, 0, 7); g.fill();
  // three tails fanned behind, red tips
  const nT = o.nTails || 3, nn = Math.round(nT), big = nT > 3 ? Math.min(1, (nT - 3) / 6) : 0, TAILS = nn <= 3 ? [[-.9, 0], [-.45, .7], [-1.3, 1.4]] : Array.from({ length: nn }, (_, i) => [lerp(-.9, -.2 - i * (1.5 / (nn - 1)), 1) * (1 - big) + (.9 - i * (2.7 / (nn - 1))) * big, i * .5]);
  if (o.glowEyes) { glow(g, -40, -260, 520, 'rgba(160,80,255,1)', o.glowEyes * .5); }
  TAILS.forEach(([a0, p2], i) => { const wv = Math.sin(t * 1.7 + ph + p2) * .1; g.save(); if (WK != null) { g.translate(-118, -112 + wb); g.rotate(a0 - .55 + wv * 1.4); } else { g.translate(-70 + big * 40, -40 - big * 60); g.rotate(a0 + wv); } g.scale(1 + big * .45, 1 + big * .55);
    const tl = 'M0 0 C-20 -60 -40 -150 -10 -210 C10 -250 50 -250 56 -214 C40 -170 40 -90 36 0 Z'; tsh(g, tl, i === 1 ? W0 : WD, 5); g.save(); g.clip(path(tl)); g.fillStyle = R; g.beginPath(); g.ellipse(20, -230, 60, 56, 0, 0, 7); g.fill(); g.fillStyle = RD; g.beginPath(); g.ellipse(26, -246, 40, 30, 0, 0, 7); g.fill(); g.restore(); tsh(g, tl, null, 5); g.restore(); });
  if (WK != null) { // walking side-on, facing right: far legs, level body, near legs, bib at the chest
    const leg = (x, phs, col) => { const a = Math.sin(WK + phs) * .5, lift = Math.max(0, Math.cos(WK + phs)) * 18, fx = x + Math.sin(a) * 70, fy = -8 - lift;
      ttube(g, x, -84 + wb, fx, fy, 28, 22, col, 5); tsh(g, `M${fx - 16} ${fy} L${fx + 22} ${fy} Q${fx + 28} ${fy + 14} ${fx + 14} ${fy + 14} L${fx - 16} ${fy + 14} Z`, col, 4); tln(g, [fx - 10, fy - 16, fx + 12, fy - 16], 4, R); };
    leg(-74, Math.PI, WD); leg(86, 0, WD);
    const bw = `M-136 ${-96 + wb} C-146 ${-156 + wb} -80 ${-176 + wb} 0 ${-172 + wb} C84 ${-170 + wb} 138 ${-156 + wb} 148 ${-114 + wb} C154 ${-72 + wb} 116 ${-54 + wb} 40 ${-52 + wb} L-84 ${-54 + wb} C-124 ${-56 + wb} -132 ${-74 + wb} -136 ${-96 + wb} Z`;
    tsh(g, bw, W0, 5); g.save(); g.clip(path(bw)); g.fillStyle = 'rgba(150,130,160,.2)'; g.beginPath(); g.ellipse(-20, -40 + wb, 200, 40, 0, 0, 7); g.fill(); g.restore(); tsh(g, bw, null, 5);
    leg(-50, 0, W0); leg(112, Math.PI, W0);
    tsh(g, `M90 ${-178 + wb} Q128 ${-160 + wb} 162 ${-178 + wb} L140 ${-118 + wb} Q116 ${-128 + wb} 98 ${-140 + wb} Z`, lg(g, 0, -178 + wb, 0, -118 + wb, [[0, '#e8443a'], [1, RD]]), 4.4); tell(g, 132, -124 + wb, 10, 10, GO, 4);
  } else {
  // body: a compact sitting pear, chest fluff
    const body = 'M-100 0 C-130 -60 -110 -170 -40 -200 C0 -216 50 -220 70 -200 C96 -170 100 -80 90 0 Z'; tsh(g, body, W0, 5);
    g.save(); g.clip(path(body)); g.fillStyle = 'rgba(150,130,160,.2)'; g.beginPath(); g.ellipse(-110, -40, 70, 200, 0, 0, 7); g.fill(); g.restore(); tsh(g, body, null, 5);
    tsh(g, 'M10 -190 L-6 -150 L14 -158 L4 -116 L28 -132 L30 -96 L48 -124 L60 -100 L66 -150 Z', W0, 4);
    // bib + bell
    tsh(g, 'M-14 -206 Q40 -186 84 -206 L60 -140 Q30 -150 4 -162 Z', lg(g, 0, -206, 0, -140, [[0, '#e8443a'], [1, RD]]), 4.4); tell(g, 50, -146, 11, 11, GO, 4); tln(g, [44, -144, 56, -144], 2.4);
    // legs with red sock tips
    [[-50, WD, -1], [40, W0, 1], [66, W0, 1]].forEach(([x, col, s], i) => { if (i === 0) { tell(g, x, -30, 46, 30, col, 5); tsh(g, `M${x - 6} -6 L${x + 40} -6 Q${x + 46} 6 ${x + 34} 6 L${x - 8} 6 Z`, col, 4); return; }
      ttube(g, x, -140, x + 2, -10, 26, 22, col, 5); tsh(g, `M${x - 13} -10 L${x + 20} -10 Q${x + 26} 6 ${x + 14} 6 L${x - 14} 6 Z`, col, 4); tln(g, [x - 8, -28, x + 10, -28], 4, R); });
  }
  // head (3/4 view facing right): big ears, tapered muzzle, red kitsune markings
  const nod = talk * (.06 * Math.sin(t * 8.4 + ph) + .03) + .03 * Math.sin(t * .8 + ph), earF = Math.max(0, Math.sin(t * 3.1 + ph * 5)) > .985 ? .25 : 0;
  g.save(); if (WK != null) { g.translate(150, -214 + wb + br * 2); g.scale(.96, .96); } else { g.translate(30, -250 + br * 2); g.scale(1.12, 1.12); } g.rotate((o.headRot || 0) - nod * .7 + (o.tilt || 0));
  [[-62, -1], [26, 1]].forEach(([x, s], i) => { g.save(); g.translate(x, -52); g.rotate(s * .18 - (i ? earF : 0)); const ear = `M-30 20 L${s * 6} -110 L34 14 Z`; tsh(g, ear, i ? W0 : WD, 5); tsh(g, `M-16 6 L${s * 4} -76 L18 2 Z`, '#f6c0c4', 0); tsh(g, `M${s * 6 - 14} -70 L${s * 6} -110 L${s * 6 + 14} -70 Z`, R, 0); tsh(g, ear, null, 5); g.restore(); });
  const head = 'M-90 -10 C-98 -78 -36 -108 16 -104 C66 -100 96 -70 96 -36 Q114 -24 112 -4 Q110 14 92 22 C70 38 40 48 10 48 C-34 50 -86 36 -90 -10 Z';
  tsh(g, head, W0, 6); g.save(); g.clip(path(head)); g.fillStyle = 'rgba(150,130,160,.18)'; g.beginPath(); g.ellipse(-90, 20, 60, 90, 0, 0, 7); g.fill(); g.restore(); tsh(g, head, null, 6);
  tsh(g, 'M-86 0 L-112 24 L-80 22 L-96 50 L-60 36 Z', W0, 4);
  tell(g, 108, -6, 10, 8, '#2a1a1e', 3); tell(g, 104, -9, 3.4, 2.2, 'rgba(255,255,255,.7)', 0);
  // red markings: eyeliner flicks and a forehead flame
  tsh(g, 'M-10 -70 Q6 -96 22 -72 Q8 -78 -10 -70 Z', R, 0); tsh(g, 'M30 -70 Q44 -90 56 -66 Q44 -72 30 -70 Z', R, 0);
  const op = Math.max(talk, ex === 'wide' ? .35 : 0);
  if (op > .05) { tsh(g, `M50 26 Q80 ${24 + op * 4} 100 12 Q88 ${34 + op * 26} 56 ${38 + op * 22} Z`, '#4a1418', 4); tln(g, [66, 34 + op * 16, 88, 28 + op * 14], 7, '#e06a74'); }
  else { tln(g, [100, 2, 96, 14], 3.4); tln(g, ex === 'smile' || ex === 'smug' ? [60, 22, 80, 28, 96, 14, 106, 20] : [62, 24, 82, 24, 96, 14], 4.4); }
  const blink = ((t * .6 + ph) % 4.3) < .1;
  [[-16, 1.15], [46, 1.4]].forEach(([x, sc], i) => { if (blink || ex === 'smile') { tln(g, [x - 16 * sc, -36, x, ex === 'smile' ? -46 : -34, x + 16 * sc, -38], 5); return; }
    const lid = ex === 'smug' ? .5 : 0, ry2 = (ex === 'wide' ? 17 : 14) * sc; tsh(g, `M${x - 17 * sc} -34 Q${x} ${-34 - ry2 * 1.8} ${x + 19 * sc} -38 Q${x + 2} ${-34 + ry2 * .9} ${x - 17 * sc} -34 Z`, '#fffdf8', 4);
    const ix = x + 4 * sc + (o.look ? o.look[0] * 4 : 0), iy = -40 + (o.look ? o.look[1] * 3 : 0); if (o.glowEyes) glow(g, ix, iy, 50, 'rgba(200,120,255,1)', o.glowEyes); tell(g, ix, iy, 8 * sc, 11 * sc, o.glowEyes ? rg(g, ix, iy, 1, 11 * sc, [[0, '#f0d0ff'], [1, '#9a40e0']]) : rg(g, ix, iy, 1, 11 * sc, [[0, '#ffd860'], [1, '#c87a1a']]), 0); tell(g, ix, iy, 3 * sc, 8 * sc, '#140c08', 0); tell(g, ix + 3, iy - 4, 2.2, 2.2, '#fff', 0);
    if (lid) tsh(g, `M${x - 19 * sc} -36 Q${x} ${-36 - ry2 * 1.9} ${x + 21 * sc} -40 L${x + 21 * sc} -44 Q${x} ${-36 - ry2 * .6} ${x - 19 * sc} -32 Z`, W0, 0);
    tln(g, [x - 18 * sc, -33, x, -36 - ry2 * 1.8 + lid * 14, x + 20 * sc, -38], 5); tln(g, [x + 18 * sc, -39, x + 30 * sc, -46], 4.4, R); });
  const bl = ex === 'serious' ? 6 : ex === 'wide' ? -8 : ex === 'smug' ? 2 : 0; tln(g, [-24, -60 + bl, -8, -66 + bl * .4], 4.4, '#9a8a94'); tln(g, [32, -64 + bl, 54, -70 + bl * .4], 4.4, '#9a8a94');
  g.restore(); g.restore(); }

// ---- hats and fox parts ----
function hornsT(g, L, rx, ry) { const [n, col, len] = L.horns, h = len || 1; const xs = n === 1 ? [0] : n === 2 ? [-rx * .52, rx * .52] : [-rx * .6, 0, rx * .6];
  xs.forEach((x, i) => { const sd = Math.sign(x) || 0, H = ry * (n === 3 && i === 1 ? 1.0 : .8) * h; tsh(g, `M${x - 18} -${ry * .82} C${x - 14 + sd * 10} -${ry * .82 + H * .5} ${x + sd * 34} -${ry * .82 + H * .9} ${x + sd * 40} -${ry * .82 + H} C${x + sd * 20} -${ry * .82 + H * .7} ${x + 18} -${ry * .82 + H * .4} ${x + 18} -${ry * .82} Z`, col || '#f2e6c8', 4.4);
    for (let k = 1; k < 4; k++) tln(g, [x - 16 + k * 2, -ry * .82 - H * k * .18, x + 14 + sd * k * 3, -ry * .82 - H * k * .2], 2, 'rgba(90,70,40,.5)'); }); }
function hatT(g, L, rx, ry, t) {
  if (L.tokin) { tsh(g, `M-${rx * .26} -${ry * .78} L${rx * .26} -${ry * .78} L${rx * .2} -${ry * 1.1} L0 -${ry * 1.2} L-${rx * .2} -${ry * 1.1} Z`, '#15121a', 4); tln(g, [-rx * .7, -ry * .74, rx * .7, -ry * .74], 4, '#15121a'); }
  if (L.kanmuri) { tsh(g, `M${-rx * .62} -${ry * .86} Q0 -${ry * 1.32} ${rx * .62} -${ry * .86} L${rx * .56} -${ry * .62} Q0 -${ry * .72} ${-rx * .56} -${ry * .62} Z`, '#15121a', 5);
    tsh(g, `M-${rx * .22} -${ry * 1.16} L${rx * .22} -${ry * 1.16} L${rx * .18} -${ry * 1.5} L-${rx * .18} -${ry * 1.5} Z`, '#15121a', 4); const sw = Math.sin(t * 1.3) * 6;
    tsh(g, `M${rx * .12} -${ry * 1.46} C${rx * .9} -${ry * 1.9} ${rx * 1.3 + sw} -${ry * 1.2} ${rx * 1.2 + sw} -${ry * .4} L${rx * 1.06 + sw} -${ry * .44} C${rx * 1.1 + sw} -${ry * 1.1} ${rx * .8} -${ry * 1.6} ${rx * .1} -${ry * 1.3} Z`, '#15121a', 4); }
  if (L.eboshi) { tsh(g, `M${-rx * .66} -${ry * .74} C${-rx * .74} -${ry * 1.4} ${-rx * .3} -${ry * 2.2} ${rx * .1} -${ry * 2.3} C${rx * .5} -${ry * 2.1} ${rx * .7} -${ry * 1.4} ${rx * .66} -${ry * .74} Q0 -${ry * .9} ${-rx * .66} -${ry * .74} Z`, '#15121a', 5);
    tln(g, [-rx * .3, -ry * 1.8, rx * .2, -ry * 1.3], 2.4, 'rgba(120,120,150,.5)'); tln(g, [-rx * .6, -ry * .82, rx * .6, -ry * .82], 5, '#3a3044'); }
  for (let si = (L.kabutoStack || 1) - 1; si >= 0; si--) { g.save(); g.translate(0, -si * ry * .5); g.scale(1 + si * .06, 1 + si * .06);
  if (L.kabuto) { tsh(g, `M${-rx * 1.04} -${ry * .52} C${-rx * 1.06} -${ry * 1.4} ${rx * 1.06} -${ry * 1.4} ${rx * 1.04} -${ry * .52} Q0 -${ry * .66} ${-rx * 1.04} -${ry * .52} Z`, L.kabuto, 5);
    [-1, 1].forEach(sd => tsh(g, `M${sd * rx * .96} -${ry * .6} L${sd * rx * 1.42} -${ry * .74} L${sd * rx * 1.4} -${ry * .18} L${sd * rx * 1.02} -${ry * .1} Z`, L.kabuto, 5));
    for (let i = 0; i < 5; i++) tln(g, [-rx * .9 + i * rx * .45, -ry * 1.2 + Math.abs(i - 2) * 10, -rx * .9 + i * rx * .45, -ry * .6], 2.4, 'rgba(255,255,255,.18)');
    [-1, 1].forEach(sd => tsh(g, `M${sd * rx * .12} -${ry * .86} C${sd * rx * .5} -${ry * 1.4} ${sd * rx * .7} -${ry * 1.9} ${sd * rx * .5} -${ry * 2.2} L${sd * rx * .64} -${ry * 2.24} C${sd * rx * .9} -${ry * 1.9} ${sd * rx * .7} -${ry * 1.3} ${sd * rx * .26} -${ry * .84} Z`, '#e8c050', 4)); }
  g.restore(); }
}
function foxEarsT(g, k, rx, ry, col = '#f2c14e') { [-1, 1].forEach(sd => { g.save(); g.translate(sd * rx * .55, -ry * .86); g.scale(k, k); const e = `M${-sd * 34} 10 L${sd * 14} -120 L${sd * 46} 4 Z`; tsh(g, e, col, 5); tsh(g, `M${-sd * 18} 0 L${sd * 12} -76 L${sd * 30} 0 Z`, '#fbe4d0', 0); tsh(g, e, null, 5); g.restore(); }); }
function foxTailsT(g, k, G, t, col = '#f2c14e') { const n = 9, base = [0, G.hip - 40]; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * .26 * k, wv = Math.sin(t * 1.6 + i * .7) * .06, L = (420 + (i % 2) * 60) * k;
    g.save(); g.translate(base[0], base[1]); g.rotate(a + Math.PI / 2 + wv); const tl = `M-40 0 C-90 ${-L * .4} -60 ${-L * .8} 0 ${-L} C60 ${-L * .8} 90 ${-L * .4} 40 0 Z`;
    tsh(g, tl, lg(g, 0, 0, 0, -L, [[0, mix(col, '#a85a10', .3)], [.75, col], [.86, '#fff8ec'], [1, '#ffffff']]), 5); g.restore(); }
  glow(g, 0, G.hip - 300 * k, 600 * k, 'rgba(255,200,90,1)', .35 * k); }
