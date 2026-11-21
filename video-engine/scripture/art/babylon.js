// Episode 5 (Daniel and the lions): Persian court, Daniel's upper room, lions, the den, the sealed stone, the decree.
Object.assign(WAR, {
  daniel:   { nose: 'straight', jaw: 'round', brow: 1.3, eyes: 'big', tall: .97,  skin: '#b07a52', tunic: '#e8e0cc', kilt: '#3a5a8a', cape: '#3a5a8a', beard: 'long', beardCol: '#f0ece4', hair: '#f0ece4', helmet: null, bulk: .95, head: 1, weapon: null, shield: null, boots: '#5a3420', long: 1, trim: '#c9a24a' },
  darius:   { nose: 'hook', jaw: 'square', brow: 1.5, tall: 1.06,  skin: '#a8714c', tunic: '#6a2a7a', kilt: '#e0b648', cape: '#4a1a5a', beard: 'braided', beardCol: '#141010', hair: '#141010', helmet: 'kidaris', bulk: 1.1, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1, trim: '#e0b648' },
  satrap:   { nose: 'broad', jaw: 'round', brow: 1.8, earring: true,  skin: '#a8714c', tunic: '#8a5a2a', kilt: '#2a4a5a', cape: '#5a3a2a', beard: 'forked', beardCol: '#1e1612', hair: '#1e1612', helmet: 'felt', bulk: 1.05, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1, trim: '#c0902a' },
  satrap2:  { nose: 'hook', jaw: 'square', eyes: 'big', tall: 1.04,  skin: '#b4784e', tunic: '#3a5a4a', kilt: '#7a2a2a', cape: '#2a3a3a', beard: 'goatee', beardCol: '#1e1612', hair: '#1e1612', helmet: 'felt', bulk: 1.0, head: 1, weapon: null, shield: null, boots: '#3a2418', long: 1, trim: '#c0902a' },
  guard:    { nose: 'broad', jaw: 'square', brow: 1.6, tall: 1.08,  skin: '#a8714c', tunic: '#c8a24a', kilt: '#5a2a6a', cape: null, beard: 'stubble', beardCol: '#141010', hair: '#141010', helmet: 'felt', bulk: 1.1, head: 1, weapon: 'spear', shield: null, boots: '#3a2418' },
});
// extra headwear for figure v2: Persian crenellated crown (kidaris) and rounded felt cap
(function () { const base = warrior; warrior = function (g, o) {
  const C = typeof o.c === 'string' ? WAR[o.c] : o.c || {};
  if (C.helmet !== 'kidaris' && C.helmet !== 'felt') return base(g, o);
  const kind = C.helmet; const c2 = Object.assign({}, C, { helmet: null }); base(g, Object.assign({}, o, { c: c2 }));
  // redraw the hat on top using the same head transform as figure v2
  const b = C.bulk || 1, pose = o.pose || 'stand', kneel = ['kneel', 'faint', 'pray', 'sulk'].includes(pose), drop = kneel ? 150 : 0;
  const shY = -620 + drop + Math.sin((o.t || 0) * 1.7 + (o.ph || 0)) * 2, hs = (C.head || 1) * .86, hy = shY - 62 * hs;
  g.save(); g.translate(o.x, o.y); g.scale((o.flip ? -1 : 1) * (o.s || 1), (o.s || 1) * (C.tall || 1)); if (pose === 'fall') g.rotate(-eio(o.k ?? 1) * 1.45);
  if (o.rot) { g.translate(0, -380); g.rotate(o.rot); g.translate(0, 380); } g.rotate(pose === 'charge' ? .16 : pose === 'thrust' ? .08 : 0);
  g.translate(14, hy); g.scale(hs, hs); if (o.headRot) g.rotate(o.headRot);
  if (kind === 'kidaris') { sh(g, 'M-54 -40 L-50 -150 L-30 -128 L-12 -158 L6 -128 L24 -158 L42 -128 L58 -150 L56 -40 Q0 -54 -54 -40 Z', lg(g, -54, -158, 56, -40, [[0, '#fff2b0'], [.5, '#e0b04a'], [1, '#9a6a1e']]), 4);
    for (let i = 0; i < 3; i++) line(g, [-52, -60 - i * 26, 56, -60 - i * 26], 2, 'rgba(120,70,10,.6)', 'round', true); [-30, 6, 42].forEach(x => ell(g, x, -90, 6, 6, '#3a6ac8', 1.6)); glow(g, 0, -100, 110, 'rgba(255,220,120,1)', .25); }
  else { sh(g, 'M-56 -30 C-60 -90 -20 -118 20 -112 C56 -104 64 -70 58 -32 Q0 -48 -56 -30 Z', lg(g, 0, -118, 0, -30, [[0, mix(C.cape || '#5a3a2a', '#fff', .2)], [1, C.cape || '#5a3a2a']]), 3.6); line(g, [-56, -34, 0, -50, 58, -36], 3, mix(C.trim || '#c0902a', '#000', .1), 'round', true); sh(g, 'M-56 -30 C-70 0 -64 40 -44 60 L-30 40 C-40 20 -40 -6 -36 -24 Z', C.cape || '#5a3a2a', 3); }
  g.restore(); }; })();
function lion(g, a, T) {
  const pose = a.pose || 'stand', m = a.mouth ?? 0, male = a.male !== false, ph = a.ph || 0;
  const fur = a.col || '#c8924a', furL = mix(fur, '#fff2d0', .3), furD = mix(fur, '#4a2a10', .35), mane = a.mane || '#7a4420';
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * (a.s || 1), a.s || 1);
  const br = Math.sin(T * 1.6 + ph) * (pose === 'sleep' ? 4 : 2), walk = pose === 'prowl' ? T * 3.4 + ph : null;
  g.fillStyle = rg(g, 0, 0, 10, 300, [[0, 'rgba(20,10,10,.32)'], [1, 'rgba(20,10,10,0)']]); g.beginPath(); g.ellipse(0, 4, 300, 26, 0, 0, 7); g.fill();
  const lying = pose === 'sleep' || pose === 'lie';
  const leg = (x, back, phs) => { let dx = 0, dy = 0; if (walk != null) { dx = Math.sin(walk + phs) * 34; dy = -Math.max(0, Math.cos(walk + phs)) * 18; }
    if (lying) { sh(g, `M${x - 30} -40 Q${x + 60} -46 ${x + 110} -20 Q${x + 120} 0 ${x + 90} 4 L${x - 40} 4 Z`, back ? furD : fur, 4); return; }
    taper(g, x, -200, x + 6 + dx * .4, -100, 60, 40, back ? furD : fur); taper(g, x + 6 + dx * .4, -100, x + dx, -24 + dy, 40, 36, back ? furD : fur);
    sh(g, `M${x + dx - 26} ${-30 + dy} Q${x + dx + 34} ${-38 + dy} ${x + dx + 40} ${dy - 4} Q${x + dx + 34} ${4 + dy} ${x + dx} ${4 + dy} L${x + dx - 28} ${4 + dy} Z`, back ? furD : furL, 3.6);
    [0, 12, 24].forEach(k => line(g, [x + dx + k, dy - 6, x + dx + k, dy + 2], 1.6, 'rgba(60,30,10,.6)', 'round', true)); };
  const by = lying ? -110 : -230;
  // tail
  const tw = Math.sin(T * 2 + ph) * 20;
  taper(g, -230, by - 10, -330, by + (lying ? 40 : 60) + tw, 18, 10, furD); ell(g, -334, by + (lying ? 44 : 66) + tw, 18, 26, mane, 3);
  if (!lying) { leg(-150, true, 2.8); leg(140, true, .6); }
  // body
  const bod = lying ? `M-250 ${by + 20} C-260 ${by - 90} -60 ${by - 100} 120 ${by - 80} C220 ${by - 70} 260 ${by - 10} 250 ${by + 60} L-230 ${by + 100} Z`
    : `M-250 ${by + 10} C-262 ${by - 90} -60 ${by - 104} 120 ${by - 92} C230 ${by - 80} 262 ${by - 10} 240 ${by + 70} C140 ${by + 120} -120 ${by + 120} -230 ${by + 80} Z`;
  sh(g, bod, rg(g, -40, by - 80, 20, 360, [[0, furL], [.6, fur], [1, furD]]), 4.5);
  g.save(); g.clip(path(bod)); const r = rng(ph * 10 + 3); for (let i = 0; i < 40; i++) { const x = -240 + r() * 480, y = by - 90 + r() * 200; line(g, [x, y, x - 10, y + 14], 1.6, i % 3 ? 'rgba(80,40,10,.2)' : 'rgba(255,240,200,.22)', 'round', true); } g.restore();
  if (lying) { leg(80, false, 0); leg(150, false, 0); } else { leg(-110, false, 0); leg(180, false, 3.6); }
  // head + mane
  const hx = lying ? 260 : 250, hy = (lying ? by - 40 : by - 80) + br, hr = lying ? .15 : -.05;
  g.save(); g.translate(hx, hy); g.rotate(hr + (a.headRot || 0));
  if (male) { for (let i = 0; i < 22; i++) { const an = i / 22 * Math.PI * 2, rr = 150 + Math.sin(i * 2.3) * 18; g.save(); g.rotate(an); sh(g, `M0 -40 Q${rr * .5} -60 ${rr} 0 Q${rr * .5} 60 0 40 Z`, i % 2 ? mane : mix(mane, '#2a1408', .25), 3); g.restore(); }
    ell(g, 0, 0, 130, 130, rg(g, -30, -30, 10, 140, [[0, mix(mane, '#e09a4a', .4)], [1, mane]]), 4); }
  const face = 'M-70 -60 C-30 -100 50 -96 86 -50 C110 -20 118 30 100 70 C80 110 20 118 -20 100 C-60 84 -84 30 -84 -10 C-84 -30 -80 -48 -70 -60 Z';
  sh(g, face, rg(g, 10, -40, 10, 140, [[0, furL], [.7, fur], [1, furD]]), 4);
  [[-50, -84], [40, -92]].forEach(([x, y]) => { ell(g, x, y, 26, 24, fur, 3.6); ell(g, x, y + 4, 13, 12, furD); });
  // muzzle + jaw
  sh(g, 'M30 20 C60 6 110 14 118 44 C122 70 96 88 64 86 C40 84 24 64 26 42 Z', mix(furL, '#fff', .3), 3.4);
  sh(g, 'M92 20 Q112 22 116 38 Q104 46 92 40 Q86 30 92 20 Z', '#4a2a22', 3);
  line(g, [100, 46, 100, 66], 2.6); if (m > .05) { sh(g, `M50 70 Q84 ${80 + m * 40} 118 70 Q110 ${104 + m * 70} 70 ${110 + m * 70} Q46 ${96 + m * 50} 50 70 Z`, '#5a1414', 3.6); [62, 78, 94].forEach(x => sh(g, `M${x} 72 L${x + 6} ${86 + m * 6} L${x + 12} 72 Z`, '#fff8ec', 1.6)); sh(g, `M60 ${100 + m * 60} Q84 ${92 + m * 50} 108 ${100 + m * 60}`, '#d06060', 0); }
  else line(g, [56, 76, 80, 84, 112, 72], 3);
  for (let i = 0; i < 3; i++) { line(g, [70, 52 + i * 8, 130, 44 + i * 12], 1.4, 'rgba(60,40,30,.55)', 'round', true); ell(g, 74 + i * 8, 54 + (i % 2) * 6, 2, 2, '#4a2a22'); }
  // eyes
  if (pose === 'sleep' || a.eyes === 'shut') { line(g, [20, -20, 40, -14, 60, -20], 3.6); }
  else { sh(g, 'M14 -26 Q36 -40 60 -24 Q38 -14 14 -26 Z', '#f6e6a8', 3); ell(g, 40, -25, 6, 8, '#2a1a0a'); ell(g, 42, -28, 2.4, 2.4, '#fff'); line(g, [10, -40, 36, -46, 64, -36], 3.4); }
  if (pose === 'sleep') { const z = (T * .6 + ph) % 1; g.save(); g.globalAlpha = 1 - z; g.font = '900 40px Nunito'; g.fillStyle = '#fffbe8'; g.fillText('z', 120 + z * 40, -120 - z * 80); g.restore(); }
  g.restore();
  g.restore();
}
function palace(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const col = a.col || '#d8c4a0', dk = mix(col, '#3a2418', .3);
  sh(g, 'M-1100 0 L1100 0 L1100 -40 L-1100 -40 Z', lg(g, 0, -40, 0, 0, [[0, mix(col, '#fff', .1)], [1, dk]]), 4); pattern(g, -1100, 1100, -34, 16, '#3a6ac8', 'meander');
  for (let i = -4; i <= 4; i++) { const x = i * 260; taper(g, x, -40, x, -1080, 70, 60, lg(g, x - 35, 0, x + 35, 0, [[0, dk], [.5, col], [1, dk]]));
    for (let k = 0; k < 9; k++) line(g, [x - 24 + k * 6, -60, x - 22 + k * 5.5, -1060], 1.2, 'rgba(60,40,20,.3)', 'round', true);
    // bull capital
    g.save(); g.translate(x, -1100); sh(g, 'M-110 30 L110 30 L96 -10 L-96 -10 Z', mix(col, '#c0902a', .3), 3.4); [-1, 1].forEach(sd => { g.save(); g.scale(sd, 1); sh(g, 'M10 -10 C40 -60 100 -60 130 -30 L140 -6 C110 -24 70 -20 40 6 Z', lg(g, 0, -60, 0, 6, [[0, '#8a6a4a'], [1, '#4a3424']]), 3.4); sh(g, 'M110 -48 L150 -70 L140 -40 Z', '#e0c070', 2.4); ell(g, 104, -30, 4, 4, '#1a0e08'); g.restore(); }); g.restore(); }
  sh(g, 'M-1100 -1150 L1100 -1150 L1100 -1230 L-1100 -1230 Z', lg(g, 0, -1230, 0, -1150, [[0, '#7a4a2a'], [1, '#4a2a18']]), 4); pattern(g, -1100, 1100, -1196, 20, '#e0b648', 'zig');
  g.restore(); }
function upperRoom(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const wall = a.col || '#c8a27a';
  // window (open, view toward the far city at sunset)
  sh(g, 'M-1200 -1600 L1200 -1600 L1200 0 L-1200 0 Z', lg(g, 0, -1600, 0, 0, [[0, mix(wall, '#2a1810', .35)], [1, mix(wall, '#2a1810', .1)]]));
  const win = 'M-230 -1250 L230 -1250 L230 -420 L-230 -420 Z';
  g.save(); g.clip(path(win)); g.fillStyle = lg(g, 0, -1250, 0, -420, [[0, '#4a3a7a'], [.6, '#e8885a'], [1, '#ffd08a']]); g.fillRect(-260, -1260, 520, 860);
  sun(g, 60, -560, 70, '#ffe2a8'); hills(g, -500, 18, '#8a5a6a', 12, -260, 260, 30); hills(g, -460, 12, '#6a4258', 13, -260, 260, 30);
  // Jerusalem far away: tiny walls and temple
  g.save(); g.globalAlpha = .7; sh(g, 'M-120 -520 L120 -520 L120 -560 L90 -560 L90 -580 L40 -580 L40 -620 L-20 -620 L-20 -580 L-80 -580 L-80 -560 L-120 -560 Z', '#5a3a4a'); g.restore();
  glow(g, 0, -600, 380, 'rgba(255,200,130,1)', .4); g.restore();
  sh(g, win, null, 8); [-230, 230].forEach(x => sh(g, `M${x - 30} -1270 L${x + 30} -1270 L${x + 30} -400 L${x - 30} -400 Z`, lg(g, x - 30, 0, x + 30, 0, [[0, '#7a5232'], [1, '#4a2e1a']]), 4));
  sh(g, 'M-270 -420 L270 -420 L290 -380 L-290 -380 Z', '#8a5e3a', 4); sh(g, 'M-260 -1290 L260 -1290 L240 -1250 L-240 -1250 Z', '#8a5e3a', 4);
  // shutters swung open
  [-1, 1].forEach(sd => { g.save(); g.translate(sd * 260, -835); g.scale(sd, 1); sh(g, 'M0 -410 L120 -440 L120 450 L0 420 Z', lg(g, 0, 0, 120, 0, [[0, '#6a4428'], [1, '#8a5e3a']]), 4); for (let i = 0; i < 6; i++) line(g, [10, -360 + i * 140, 112, -380 + i * 140], 2, 'rgba(30,15,5,.4)', 'round', true); g.restore(); });
  // the beam of window light across the floor
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = lg(g, 0, -420, 0, 300, [[0, 'rgba(255,200,130,.35)'], [1, 'rgba(255,200,130,0)']]); g.beginPath(); g.moveTo(-230, -420); g.lineTo(230, -420); g.lineTo(420, 300); g.lineTo(-420, 300); g.fill(); g.restore();
  sh(g, 'M-1200 0 L1200 0 L1200 600 L-1200 600 Z', lg(g, 0, 0, 0, 600, [[0, '#8a6a4a'], [1, '#4a3424']])); for (let i = -6; i <= 6; i++) line(g, [i * 180, 0, i * 340, 600], 2, 'rgba(30,15,5,.3)', 'round', true);
  g.restore(); }
function denInside(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const lit = a.light ?? .4, open = a.open ?? 0;
  g.fillStyle = rg(g, 0, -600, 100, 1600, [[0, mix('#7a5a42', '#ffe6b0', lit * .3)], [.5, '#3a2a22'], [1, '#120c0a']]); g.fillRect(-1600, -2400, 3200, 3200);
  const r = rng(5); for (let i = 0; i < 60; i++) { const x = -1200 + r() * 2400, y = -1800 + r() * 1800, w = 80 + r() * 160, h = 50 + r() * 70; sh(g, `M${x} ${y} l${w} ${-4} l${6} ${h} l${-w} ${4} Z`, `rgba(${90 + r() * 40 | 0},${70 + r() * 30 | 0},${55 + r() * 20 | 0},.5)`, 2.4, 'rgba(20,10,5,.45)'); }
  // opening above with light shaft
  ell(g, 0, -1700, 220, 70, open ? '#ffe8b8' : '#2a2018', 6);
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .35 + lit * .5; g.fillStyle = lg(g, 0, -1700, 0, 0, [[0, 'rgba(255,230,170,.9)'], [1, 'rgba(255,230,170,0)']]); g.beginPath(); g.moveTo(-210, -1700); g.lineTo(210, -1700); g.lineTo(520, 0); g.lineTo(-520, 0); g.fill(); g.restore();
  sh(g, 'M-1600 0 L1600 0 L1600 800 L-1600 800 Z', lg(g, 0, 0, 0, 800, [[0, '#5a4434'], [1, '#2a1e18']])); for (let i = 0; i < 30; i++) { const x = -1200 + r() * 2400, y = 20 + r() * 300; ell(g, x, y, 14 + r() * 20, 6 + r() * 6, 'rgba(160,140,120,.35)'); }
  g.restore(); }
function denStone(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); const off = a.off ?? 0;
  sh(g, 'M-500 0 C-480 -160 -300 -220 0 -224 C300 -220 480 -160 500 0 Z', lg(g, 0, -224, 0, 0, [[0, '#8a7a6a'], [1, '#5a4a3e']]), 5);
  ell(g, 0, -60, 300, 90, '#120c0a', 5);
  g.save(); g.translate(off, 0); ell(g, 0, -80, 320, 100, lg(g, -320, -180, 320, 20, [[0, '#b8a898'], [1, '#6a5a4c']]), 6); ell(g, 0, -86, 220, 60, null, 3, 0, 'rgba(40,30,20,.4)');
  if (a.sealed) { line(g, [-260, -60, 260, -110], 5, '#8a6a3a', 'round', true); ell(g, 40, -92, 34, 30, lg(g, 6, -122, 74, -62, [[0, '#d0402a'], [1, '#7a1a10']]), 3.6); ell(g, 40, -92, 18, 16, null, 2, 0, 'rgba(255,200,180,.5)'); }
  g.restore(); g.restore(); }
function decree(g, a, T) { g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1); g.rotate(a.rot || 0); const u = a.unroll ?? 1;
  sh(g, `M-260 ${-300 * u} L260 ${-300 * u} L260 ${300 * u} L-260 ${300 * u} Z`, lg(g, -260, 0, 260, 0, [[0, '#e8d4a8'], [.5, '#f6e8c8'], [1, '#d8c094']]), 4);
  g.save(); g.beginPath(); g.rect(-240, -300 * u, 480, 600 * u); g.clip(); for (let i = 0; i < 12; i++) { const y = -250 + i * 42; for (let k = 0; k < 7; k++) { const x = -210 + k * 62 + (i % 2) * 14; sh(g, `M${x} ${y} l14 0 l-7 18 Z`, 'rgba(60,40,20,.75)'); line(g, [x + 20, y + 4, x + 40, y + 4], 3, 'rgba(60,40,20,.7)', 'round', true); } } g.restore();
  [-1, 1].forEach(sd => { sh(g, `M-280 ${sd * 300 * u - 26} L280 ${sd * 300 * u - 26} L280 ${sd * 300 * u + 26} L-280 ${sd * 300 * u + 26} Z`, lg(g, 0, sd * 300 * u - 26, 0, sd * 300 * u + 26, [[0, '#c8a878'], [1, '#8a6a42']]), 3.6); });
  if (u > .9) { ell(g, 150, 220, 46, 40, lg(g, 110, 180, 190, 260, [[0, '#d0402a'], [1, '#7a1a10']]), 3.6); ell(g, 150, 220, 24, 20, null, 2, 0, 'rgba(255,200,180,.5)'); }
  g.restore(); }
const _drawActor3 = drawActor;
drawActor = function (g, a, c, P, o) { const A = avAll(a, c.lt), T = c.T;
  if (A.type === 'lion') return lion(g, A, T); if (A.type === 'palace') return palace(g, A, T); if (A.type === 'room') return upperRoom(g, A, T);
  if (A.type === 'den') return denInside(g, A, T); if (A.type === 'denstone') return denStone(g, A, T); if (A.type === 'decree') return decree(g, A, T);
  if (A.type === 'campfire') { fire(g, A.x, A.y, A.s || 1, T); [[-60, 10], [60, 10], [0, 20]].forEach(([dx, dy]) => taper(g, A.x + dx * (A.s || 1), A.y + dy, A.x - dx * (A.s || 1) * .3, A.y + dy - 14, 22, 18, '#5a3a22')); return; }
  return _drawActor3(g, a, c, P, o); };
