// Parametric warrior: one rig for kings, soldiers and giants. Faces right; o.flip faces left.
// o.c = look {skin, tunic, armor:'scale'|'leather'|null, armorCol, kilt, cape, beard:'long'|'short'|null, beardCol, hair, helmet:'feather'|'bronze'|'cap'|'crown'|null,
//   bulk (width), head (head scale), weapon:'spear'|'sword'|'sling'|null, shield:'bronze'|'leather'|null, boots}
// o.pose = stand | stride | charge | raise | thrust | sling | faint | kneel | fall ; o.k = 0..1 progress for raise/fall ; o.expr = neutral|angry|roar|tired|fierce|shock|smile
const WAR = {
  goliath: { skin: '#a8714c', tunic: '#5a4a3a', armor: 'scale', armorCol: '#b5893a', kilt: '#6a2a1a', cape: '#4a1a14', beard: 'long', beardCol: '#1e1612', helmet: 'bronze', bulk: 1.35, head: .84, weapon: 'spear', shield: 'bronze', boots: '#3a2418' },
  ishbi:   { skin: '#9a6444', tunic: '#4a3a30', armor: 'scale', armorCol: '#8a7a6a', kilt: '#3a2a4a', cape: '#2a1a2a', beard: 'short', beardCol: '#140e0c', helmet: 'feather', bulk: 1.4, head: .82, weapon: 'spear', shield: null, boots: '#2a1a12' },
  gathGiant: { skin: '#b07a52', tunic: '#5a3a2a', armor: 'leather', armorCol: '#6a4a2a', kilt: '#7a5a2a', cape: null, beard: 'long', beardCol: '#3a2214', helmet: 'feather', bulk: 1.45, head: .8, weapon: 'spear', shield: null, boots: '#3a2418' },
  david:   { skin: '#c08a5e', tunic: '#e9dcc0', armor: 'scale', armorCol: '#c9a24a', kilt: '#2a4a7a', cape: '#7a2a8a', beard: 'long', beardCol: '#d8d2c8', hair: '#d8d2c8', helmet: 'crown', bulk: 1, head: 1, weapon: 'sword', shield: null, boots: '#5a3420' },
  youngDavid: { skin: '#d49a6a', tunic: '#d9c49a', armor: null, kilt: '#8a6a3a', cape: null, beard: null, hair: '#a8432a', helmet: null, bulk: .85, head: 1.08, weapon: 'sling', shield: null, boots: '#7a5432' },
  abishai: { skin: '#b4784e', tunic: '#7a2a22', armor: 'leather', armorCol: '#8a5a32', kilt: '#2a3a5a', cape: '#a8342a', beard: 'short', beardCol: '#24160e', helmet: 'cap', bulk: 1.08, head: 1, weapon: 'sword', shield: 'leather', boots: '#4a2c1c' },
  israelite: { skin: '#b4784e', tunic: '#c9a57a', armor: 'leather', armorCol: '#8a5a32', kilt: '#5a3a22', cape: null, beard: 'short', beardCol: '#24160e', helmet: 'cap', bulk: 1, head: 1, weapon: 'spear', shield: 'leather', boots: '#4a2c1c' },
  philistine: { skin: '#a8714c', tunic: '#6a3a2a', armor: 'leather', armorCol: '#8a6a3a', kilt: '#3a3a6a', cape: null, beard: null, helmet: 'feather', bulk: 1, head: 1, weapon: 'spear', shield: 'bronze', boots: '#3a2418' },
};
function warrior(g, o) {
  const C = Object.assign({ skin: '#b4784e', tunic: '#c9a57a', kilt: '#5a3a22', bulk: 1, head: 1, beardCol: '#24160e', hair: '#24160e', boots: '#4a2c1c', armorCol: '#8a5a32' }, typeof o.c === 'string' ? WAR[o.c] : o.c || {});
  const t = o.t || 0, pose = o.pose || 'stand', k = o.k ?? 1, ex = o.expr || 'neutral', b = C.bulk, ph = o.ph || 0, talk = o.talk || 0;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
  if (o.shadow !== false) ell(g, 0, 2, 150 * b, 18, 'rgba(20,10,5,.3)');
  if (pose === 'fall') { g.rotate(-eio(k) * 1.45); }
  if (o.rot) { g.translate(0, -350); g.rotate(o.rot); g.translate(0, 350); }
  const lean = pose === 'charge' ? .18 : pose === 'thrust' ? .1 : pose === 'faint' ? -.05 : 0;
  const kneelish = pose === 'kneel' || pose === 'faint' || pose === 'pray' || pose === 'sulk';
  const drop = kneelish ? 130 : 0, br = Math.sin(t * (pose === 'faint' ? 3.2 : 1.8) + ph) * (pose === 'faint' ? 5 : 2.5);
  const hipY = -330 + drop, shY = -565 + drop + br;
  // ---- legs
  const run = pose === 'stride' ? 5 : pose === 'charge' ? 11 : 0, p = t * run + ph;
  let feet;
  if (run) feet = [[-30 + Math.sin(p) * 80, -Math.max(0, Math.cos(p)) * 26], [40 - Math.sin(p) * 80, -Math.max(0, -Math.cos(p)) * 26]];
  else if (pose === 'raise' || pose === 'thrust' || pose === 'sling') feet = [[-85, 0], [90, 0]];
  else if (kneelish) feet = [[-120, 0], [70, 0]];
  else feet = [[-34, 0], [38, 0]];
  const leg = (hx, f, back) => { const kneeX = kneelish ? (back ? -60 : 70) : (hx + f[0]) / 2 + 22, kneeY = kneelish ? (back ? -8 : -150) : (hipY + f[1]) / 2;
    limb(g, [hx, hipY, kneeX, kneeY], 40 * b, back ? mix(C.skin, '#000', .2) : C.skin, 6); limb(g, [kneeX, kneeY, f[0], f[1] - 14], 34 * b, back ? mix(C.skin, '#000', .2) : C.skin, 6);
    sh(g, `M${f[0] - 26 * b} ${f[1] - 30} L${f[0] + 34 * b} ${f[1] - 30} Q${f[0] + 46 * b} ${f[1] - 6} ${f[0] + 40 * b} ${f[1] + 2} L${f[0] - 28 * b} ${f[1] + 2} Z`, C.boots, 5);
    if (C.armor === 'scale') limb(g, [kneeX, kneeY + 6, f[0], f[1] - 30], 30 * b, back ? mix(C.armorCol, '#000', .3) : C.armorCol, 4); };
  g.save(); g.rotate(lean);
  // cape behind everything
  if (C.cape) { const w = Math.sin(t * 2.4 + ph) * 26 + (run ? 40 : 0); sh(g, `M${-50 * b} ${shY + 10} C${-140 * b - w} ${shY + 140} ${-170 * b - w} ${hipY + 60} ${-120 * b - w * 1.4} ${hipY + 200} L${-30 * b} ${hipY + 40} Z`, lg(g, 0, shY, 0, hipY + 200, [[0, C.cape], [1, mix(C.cape, '#000', .35)]]), 6); }
  // back arm + shield
  const handsFor = () => {
    const sx = 52 * b, sy = shY + 26;
    if (pose === 'raise') return [[-90 * b, hipY + 30], [lerp(sx + 60, sx - 10, eo(k)), lerp(sy + 120, sy - 260, eo(k))]];
    if (pose === 'thrust') return [[-120 * b, sy + 90], [sx + 200 * k, sy + 30]];
    if (pose === 'sling') { const an = t * 15; return [[-110 * b, sy + 120], [20 + Math.cos(an) * 30, sy - 210 + Math.sin(an) * 14]]; }
    if (pose === 'faint') return [[20, hipY + 40], [40, shY - 30]];
    if (pose === 'kneel') return [[60, hipY + 40], [120, sy + 120]];
    if (pose === 'pray') return [[70, sy - 150], [130, sy - 170]];
    if (pose === 'hug') return [[150, sy + 40], [190, sy + 10]];
    if (pose === 'cross') return [[60, sy + 90], [10, sy + 80]];
    if (pose === 'beg') return [[130, sy + 90], [170, sy + 70]];
    if (pose === 'sulk') return [[50, sy + 70], [90, sy + 60]];
    if (pose === 'flail') { const w = Math.sin(t * 9); return [[-150, sy - 120 + w * 40], [170, sy - 140 - w * 40]]; }
    if (pose === 'preach') return [[-90 * b, sy + 200], [sx + 120, sy - 160]];
    if (pose === 'charge') return [[-140 * b, sy + 120], [sx + 140, sy - 60]];
    if (run) return [[-60 * b - Math.sin(p) * 60, sy + 200], [sx + 30 + Math.sin(p) * 60, sy + 200]];
    return [[-70 * b, sy + 210], [sx + 34, sy + 200]];
  };
  const [bh, fh] = handsFor();
  limb(g, [-46 * b, shY + 26, (-46 * b + bh[0]) / 2 - 20, (shY + bh[1]) / 2 + 10, bh[0], bh[1]], 32 * b, mix(C.skin, '#000', .2), 6); ell(g, bh[0], bh[1], 17 * b, 17 * b, mix(C.skin, '#000', .2), 5);
  if (C.shield) { const r = 82 * b; ell(g, bh[0] - 10, bh[1] - 40, r, r, C.shield === 'bronze' ? lg(g, bh[0] - r, 0, bh[0] + r, 0, [[0, '#e3b558'], [1, '#8a5a1e']]) : '#7a5432', 7); ell(g, bh[0] - 10, bh[1] - 40, r * .72, r * .72, null, 4, 0, 'rgba(40,20,10,.6)'); ell(g, bh[0] - 10, bh[1] - 40, 16 * b, 16 * b, C.shield === 'bronze' ? '#f2d080' : '#a8834a', 4); }
  leg(-26 * b, feet[0], true);
  // torso + kilt
  const tw = 72 * b, ww = 58 * b;
  sh(g, `M${-ww - 14} ${hipY + 4} L${ww + 14} ${hipY + 4} L${ww + 22} ${hipY + 110} Q0 ${hipY + 124} ${-ww - 22} ${hipY + 110} Z`, lg(g, 0, hipY, 0, hipY + 120, [[0, C.kilt], [1, mix(C.kilt, '#000', .3)]]), 6);
  [-30, 0, 30].forEach(x => line(g, [x * b, hipY + 10, x * b * 1.15, hipY + 112], 4, 'rgba(0,0,0,.25)'));
  leg(26 * b, feet[1], false);
  const torso = `M${-tw} ${shY} Q${-tw - 8} ${(shY + hipY) / 2} ${-ww} ${hipY + 8} L${ww} ${hipY + 8} Q${tw + 14} ${(shY + hipY) / 2} ${tw} ${shY} Q0 ${shY - 20} ${-tw} ${shY} Z`;
  sh(g, torso, lg(g, -tw, 0, tw, 0, [[0, mix(C.tunic, '#000', .25)], [.6, C.tunic], [1, mix(C.tunic, '#000', .15)]]), 6);
  if (C.armor) {
    g.save(); g.clip(path(torso));
    if (C.armor === 'scale') { for (let y = shY + 10; y < hipY + 10; y += 22) for (let x = -tw - 10 + ((y / 22) % 2) * 12; x < tw + 10; x += 24) { sh(g, `M${x - 12} ${y} Q${x} ${y + 26} ${x + 12} ${y} Z`, mix(C.armorCol, '#fff', ((x + 200) % 3) * .05), 2.5, 'rgba(40,20,5,.7)'); } }
    else { sh(g, `M${-tw} ${shY + 30} L${tw} ${shY + 30} L${tw} ${hipY - 20} L${-tw} ${hipY - 20} Z`, C.armorCol); for (let y = shY + 50; y < hipY - 20; y += 34) line(g, [-tw, y, tw, y], 4, 'rgba(0,0,0,.25)'); }
    g.restore(); sh(g, torso, null, 6);
  }
  line(g, [-ww - 6, hipY + 6, ww + 6, hipY + 6], 14 * b, '#3a2418'); ell(g, 0, hipY + 6, 12, 10, '#e0b648', 3);
  // head
  const hs = C.head, hy = shY - 70 * hs;
  g.save(); g.translate(12, hy); g.scale(hs, hs); if (o.headRot) g.rotate(o.headRot);
  sh(g, 'M-22 40 L26 40 L24 80 L-20 80 Z', C.skin, 5);
  ell(g, 0, 0, 58, 64, lg(g, -58, 0, 58, 0, [[0, mix(C.skin, '#000', .15)], [1, C.skin]]), 6);
  sh(g, 'M50 -16 Q74 4 66 20 Q58 26 48 22', C.skin, 5); // nose
  ell(g, -30, 4, 12, 16, C.skin, 4);
  if (!C.helmet || C.helmet === 'crown' || C.helmet === 'cap') sh(g, 'M-60 0 C-66 -60 -20 -76 20 -70 C50 -66 62 -46 56 -30 C30 -44 0 -40 -20 -20 L-34 30 Z', C.hair || '#24160e', 5);
  // eye + brow
  const eyeX = 30, eyeY = -10, blink = ((t * .6 + ph) % 4.1) < .1;
  if (ex === 'tired' || blink) line(g, [eyeX - 10, eyeY, eyeX + 10, eyeY + 2], 5);
  else { ell(g, eyeX, eyeY, ex === 'shock' ? 11 : 9, ex === 'shock' ? 12 : 7.5, '#fbf6ec', 4); ell(g, eyeX + 3, eyeY, ex === 'roar' || ex === 'angry' || ex === 'fierce' ? 3.5 : 4.5, ex === 'roar' || ex === 'angry' || ex === 'fierce' ? 3.5 : 4.5, INK); }
  const BR = { angry: [18, -34, 46, -20], roar: [16, -36, 46, -18], fierce: [16, -32, 46, -22], tired: [16, -26, 46, -30], shock: [16, -38, 46, -38], smile: [16, -30, 46, -30] }[ex] || [16, -30, 46, -28];
  line(g, BR, 8);
  if (ex === 'tired') { line(g, [eyeX - 12, eyeY + 12, eyeX + 8, eyeY + 14], 3, 'rgba(60,30,20,.5)'); const sw = (t * .5) % 1; ell(g, -10, -20 + sw * 40, 5, 8, 'rgba(170,215,240,.85)', 2); }
  // mouth + beard
  const op = Math.max(talk, ex === 'roar' ? .9 : ex === 'shock' ? .4 : 0);
  if (C.beard) { sh(g, C.beard === 'long' ? 'M-26 10 C-34 60 -10 130 30 160 C40 120 62 70 60 18 C40 30 6 30 -26 10 Z' : 'M-26 12 C-30 50 -6 76 26 80 C46 70 62 50 60 20 C40 32 6 32 -26 12 Z', lg(g, 0, 0, 0, 150, [[0, C.beardCol], [1, mix(C.beardCol, '#000', .3)]]), 5); }
  if (op > .05) { ell(g, 38, 34 + op * 6, 14 + op * 4, 4 + op * 18, '#3a1612', 4); if (ex === 'roar') { line(g, [28, 26, 50, 26], 4, '#f4eee2'); line(g, [28, 46 + op * 10, 50, 46 + op * 10], 4, '#f4eee2'); } }
  else line(g, ex === 'smile' ? [24, 30, 38, 38, 52, 30] : ex === 'tired' ? [26, 36, 38, 32, 52, 36] : [26, 34, 52, 32], 5);
  // helmets
  if (C.helmet === 'feather') { for (let i = -6; i <= 6; i++) { const a = i * .11 - .1, len = 110 + Math.cos(i * .3) * 16, wob = Math.sin(t * 3 + i) * .02; g.save(); g.translate(0, -44); g.rotate(a + wob); sh(g, `M-9 0 Q-14 ${-len * .6} 0 ${-len} Q14 ${-len * .6} 9 0 Z`, i % 2 ? '#f1e6cf' : '#d9c8a6', 3); g.restore(); } sh(g, 'M-62 -30 Q0 -64 62 -30 L62 -10 Q0 -44 -62 -10 Z', '#c9a24a', 5); [-40, -20, 0, 20, 40].forEach(x => ell(g, x, -26 + Math.abs(x) * .2, 5, 5, '#7a2a22')); line(g, [-50, -10, -30, 50, 20, 70], 4, '#5a3a1a'); }
  if (C.helmet === 'bronze') { sh(g, 'M-66 10 C-70 -70 -20 -92 18 -88 C60 -82 72 -40 66 4 L50 0 L48 30 L36 30 L32 -14 C0 -24 -40 -16 -50 30 Z', lg(g, -66, -80, 66, 10, [[0, '#f2c86a'], [.5, '#c48a32'], [1, '#7a4a14']]), 6); const cw = Math.sin(t * 2.2) * 8; sh(g, `M-40 -80 C-60 -150 ${40 + cw} -170 ${110 + cw} -120 C${70 + cw} -112 30 -96 18 -88 Z`, '#a8231a', 5); for (let i = 0; i < 6; i++) line(g, [-30 + i * 22, -100 - i * 6, -10 + i * 24 + cw * .5, -140 - i * 2], 3, 'rgba(60,10,6,.5)'); line(g, [-60, -20, 62, -20], 6, '#8a5a1e'); }
  if (C.helmet === 'cap') { sh(g, 'M-62 -10 C-64 -66 -10 -84 24 -78 C58 -70 66 -40 62 -14 Q0 -36 -62 -10 Z', '#7a5432', 5); line(g, [-62, -12, 0, -34, 62, -14], 6, '#4a2c1c'); }
  if (C.helmet === 'crown') { sh(g, 'M-50 -46 L-50 -96 L-30 -72 L-10 -108 L8 -74 L28 -104 L44 -70 L54 -92 L56 -44 Q0 -60 -50 -46 Z', lg(g, 0, -108, 0, -44, [[0, '#fff0a8'], [1, '#c48a2a']]), 5); [-28, 4, 34].forEach(x => ell(g, x, -58, 6, 6, '#3a6ac8', 2)); }
  g.restore();
  // front arm + weapon
  const fsx = 52 * b, fsy = shY + 26;
  if (C.weapon === 'spear') {
    const ang = pose === 'raise' ? lerp(0, 2.25, eo(k)) : pose === 'thrust' ? -1.45 : pose === 'charge' ? -1.2 : run ? -.08 : 0;
    g.save(); g.translate(fh[0], fh[1]); g.rotate(ang); const L0 = 470 * b, L1 = 300 * b;
    limb(g, [0, L1, 0, -L0], 14 * b, '#6a4a2a', 5); sh(g, `M${-18 * b} ${-L0} L0 ${-L0 - 120 * b} L${18 * b} ${-L0} Z`, lg(g, -18, 0, 18, 0, [[0, '#f2d68a'], [1, '#9a6a24']]), 5); g.restore();
  }
  if (C.weapon === 'sword') {
    const ang = pose === 'raise' ? lerp(.3, -2.8, eo(k)) : pose === 'charge' ? -1.1 : pose === 'thrust' ? -1.5 : pose === 'faint' ? 2.4 : .25;
    g.save(); g.translate(fh[0], fh[1]); g.rotate(ang); sh(g, `M-9 -26 L-7 ${-220 * b} L0 ${-250 * b} L7 ${-220 * b} L9 -26 Z`, lg(g, -9, 0, 9, 0, [[0, '#f4f2ea'], [1, '#9aa2aa']]), 4); sh(g, 'M-34 -30 L34 -30 L34 -16 L-34 -16 Z', '#c9a24a', 4); limb(g, [0, -16, 0, 22], 12, '#5a3a1a', 4); g.restore();
  }
  limb(g, [fsx, fsy, (fsx + fh[0]) / 2 + 24, (fsy + fh[1]) / 2 + 10, fh[0], fh[1]], 32 * b, C.skin, 6); ell(g, fh[0], fh[1], 18 * b, 18 * b, C.skin, 5);
  if (C.weapon === 'sling') {
    const an = pose === 'sling' ? t * 15 : 0, sx = fh[0] + Math.cos(an) * 120, sy2 = fh[1] - 40 + Math.sin(an) * 50;
    line(g, [fh[0], fh[1], (fh[0] + sx) / 2, (fh[1] + sy2) / 2 + 20, sx, sy2], 4, '#5a3a1a'); ell(g, sx, sy2, 13, 13, '#9a9088', 4);
    if (pose === 'sling') { g.save(); g.globalAlpha = .35; g.beginPath(); g.ellipse(fh[0], fh[1] - 40, 120, 50, 0, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = '#fff2c8'; g.stroke(); g.restore(); }
  }
  g.restore(); // lean
  g.restore();
}
// big open hand with N fingers (close-up)
function bigHand(g, o) {
  const n = o.n || 5, t = o.t || 0, cnt = o.count ?? 99; g.save(); g.translate(o.x, o.y); g.scale(o.s || 1, o.s || 1);
  const skin = o.skin || '#b07a52', sd = mix(skin, '#000', .2);
  sh(g, 'M-170 120 C-190 -20 -170 -120 -150 -150 L150 -150 C170 -120 190 -20 170 120 L130 420 L-130 420 Z', lg(g, -190, 0, 190, 0, [[0, sd], [.5, skin], [1, sd]]), 9);
  for (let i = 0; i < n; i++) { const x = -150 + i * (300 / (n - 1)), len = 260 + Math.sin(i / (n - 1) * Math.PI) * 90, a = (i - (n - 1) / 2) * .09;
    g.save(); g.translate(x * .92, -130); g.rotate(a); sh(g, `M-26 30 L-28 ${-len + 30} Q0 ${-len - 14} 28 ${-len + 30} L26 30 Z`, lg(g, -28, 0, 28, 0, [[0, sd], [.5, skin], [1, sd]]), 8); line(g, [-14, -len * .45, 14, -len * .45], 4, 'rgba(60,30,20,.45)'); sh(g, `M-16 ${-len + 22} Q0 ${-len - 2} 16 ${-len + 22} L14 ${-len + 46} L-14 ${-len + 46} Z`, mix(skin, '#fff', .25), 3, 'rgba(60,30,20,.5)');
      if (i < cnt) { const kk = clamp((cnt - i)); ell(g, 0, -len - 70, 34, 34, `rgba(255,214,110,${(.9 * kk).toFixed(2)})`, 0); g.font = '900 44px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(42,26,18,${kk})`; g.fillText(String(i + 1), 0, -len - 68); }
      g.restore(); }
  sh(g, 'M150 80 C230 40 290 -40 300 -100 C320 -40 280 80 170 170 Z', lg(g, 150, 0, 300, 0, [[0, skin], [1, sd]]), 9);
  if (cnt > n) { const kk = clamp(cnt - n); ell(g, 330, -170, 34, 34, `rgba(255,214,110,${(.9 * kk).toFixed(2)})`); g.font = '900 44px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(42,26,18,${kk})`; g.fillText(String(n + 1), 330, -168); }
  g.restore();
}
// big foot with N toes (close-up, counting)
function bigFoot(g, o) {
  const n = o.n || 6, cnt = o.count ?? 99; g.save(); g.translate(o.x, o.y); g.scale(o.s || 1, o.s || 1);
  const skin = o.skin || '#b07a52', sd = mix(skin, '#000', .2);
  sh(g, 'M-300 60 C-320 -60 -200 -150 -40 -150 L260 -140 C330 -130 340 -40 320 30 C280 110 -200 120 -300 60 Z', lg(g, 0, -150, 0, 110, [[0, skin], [1, sd]]), 9);
  sh(g, 'M-300 60 L-380 -40 L-420 120 L-260 140 Z', sd, 8);
  for (let i = 0; i < n; i++) { const x = -60 + i * (360 / (n - 1)), r = 60 - Math.abs(i - 1) * 4; ell(g, x, -150 - r * .6, r * .75, r, lg(g, x - r, 0, x + r, 0, [[0, sd], [.5, skin], [1, sd]]), 7); ell(g, x, -150 - r * 1.15, r * .45, r * .32, mix(skin, '#fff', .25), 3, 0, 'rgba(60,30,20,.5)');
    if (i < cnt) { const kk = clamp(cnt - i); ell(g, x, -150 - r * 2 - 50, 32, 32, `rgba(255,214,110,${(.9 * kk).toFixed(2)})`); g.font = '900 42px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(42,26,18,${kk})`; g.fillText(String(i + 1), x, -150 - r * 2 - 48); } }
  g.restore();
}
