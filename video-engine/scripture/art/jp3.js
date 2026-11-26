// JP03 Tamamo-no-Mae: the Heian court lady (and her nine tails), the emperor, the diviner Abe no Yasunari, court ladies,
// mounted-warrior archers; the palace at night, the sickroom, the mirror reveal, the burning kingdoms, the plains of Nasu,
// the nine-tailed fox in flight, the arrow, the petrification, and the Killing Stone among the sulphur vents and jizo.
Object.assign(TOON, {
  tamamo:  { kind: 'adult', female: true, skin: '#fbefe6', skinD: '#e8d2c4', hair: '#0e0c12', hairHi: '#3a3650', hairStyle: 'heian', top: '#7a2a5a', topD: '#5e1e46', pat: 'clouds', patCol: 'rgba(240,200,120,.55)', collar: '#fff6ea',
             layers: ['#e8c050', '#3a6a5a', '#c83a3a', '#f2e6d0'], sleeve: 'wide', bottom: 'skirt', skirt: '#c8303a', skirtD: '#a0242e', pleats: '#7a2a5a', belt: '#e8c050', feet: 'straw', eyes: 'adult', iris: '#2a1810', lashes: true,
             hikimayu: true, lips: '#d0283a', magatama: null, h: .98, headW: .94 },
  toba:    { kind: 'adult', skin: '#ecc8a4', skinD: '#d0a682', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', cord: '#15121a', top: '#e8dcc0', topD: '#cfc2a2', pat: 'clouds', patCol: 'rgba(160,120,40,.45)', collar: '#7a2a5a', trimCol: '#7a2a5a', trimDot: '#e8c050',
             sleeve: 'wide', bottom: 'hakama', hakama: '#7a2a5a', hakamaD: '#5e1e46', belt: '#e8c050', feet: 'straw', wraps: '#f4efe2', eyes: 'adult', iris: '#2a1810', brow: 5, beard: 'stubble', jaw: 'round', kanmuri: true, h: 1.02 },
  yasunari:{ kind: 'adult', skin: '#e2b088', skinD: '#c48e66', hair: '#cfc8bc', hairHi: '#ffffff', hairStyle: 'mizura', cord: '#15121a', top: '#f6f3ec', topD: '#ddd8cc', pat: 'diamond', patCol: 'rgba(90,70,140,.35)', collar: '#5a3a8a', trimCol: '#5a3a8a', trimDot: '#f6f3ec',
             sleeve: 'wide', bottom: 'hakama', hakama: '#5a3a8a', hakamaD: '#44286e', belt: '#5a3a8a', feet: 'straw', wraps: '#f6f3ec', eyes: 'adult', iris: '#2a1810', brow: 7, browCol: '#cfc8bc', beard: 'longWhite', jaw: 'square', eboshi: true, h: 1.0 },
  lady1:   { kind: 'adult', female: true, skin: '#f6e6d8', skinD: '#e0c8b6', hair: '#0e0c12', hairHi: '#3a3650', hairStyle: 'heian', top: '#3a6a8a', topD: '#2a5270', pat: 'diamond', patCol: 'rgba(255,255,255,.3)', collar: '#fff6ea', layers: ['#e8c050', '#c83a3a'],
             sleeve: 'wide', bottom: 'skirt', skirt: '#c8303a', skirtD: '#a0242e', belt: '#e8c050', feet: 'straw', eyes: 'adult', iris: '#2a1810', lashes: true, hikimayu: true, lips: '#d0283a', h: .94 },
  lady2:   { kind: 'adult', female: true, skin: '#f6e6d8', skinD: '#e0c8b6', hair: '#0e0c12', hairHi: '#3a3650', hairStyle: 'heian', top: '#5a8a4a', topD: '#466e38', pat: 'dots', patCol: 'rgba(255,255,255,.35)', collar: '#fff6ea', layers: ['#f2a0b0', '#7a2a5a'],
             sleeve: 'wide', bottom: 'skirt', skirt: '#c8303a', skirtD: '#a0242e', belt: '#e8c050', feet: 'straw', eyes: 'adult', iris: '#2a1810', lashes: true, hikimayu: true, lips: '#d0283a', h: .92 },
  archer:  { kind: 'adult', skin: '#d8a070', skinD: '#b8804e', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'mizura', cord: '#c8302a', top: '#2a3a5a', topD: '#1e2a44', pat: 'waves', patCol: 'rgba(170,200,240,.3)', collar: '#c8302a', trimCol: '#c8302a', trimDot: '#e8c050',
             sleeve: 'kinu', bottom: 'hakama', hakama: '#3a3030', hakamaD: '#2a2222', belt: '#c8302a', feet: 'straw', wraps: '#e8e2d2', wrapLine: '#2a3a5a', eyes: 'adult', iris: '#2a1810', brow: 8, beard: 'short', jaw: 'square', armor: '#8a2a22', rivet: '#e8c050', kabuto: '#2a2a34', bulk: 1.1, h: 1.02 },
});
Object.assign(THOLD, {
  bow: (g, h, o, t) => { const draw = o.draw ?? 1; g.save(); g.translate(h[0], h[1]); if (o.bowFlip) g.scale(-1, 1); g.rotate(o.holdRot ?? 0);
    g.beginPath(); g.moveTo(0, -330); g.quadraticCurveTo(-90 - 20 * draw, 0, 0, 330); g.lineWidth = 16; g.strokeStyle = OUT; g.stroke(); g.lineWidth = 10; g.strokeStyle = '#5a3a22'; g.stroke();
    [-1, 1].forEach(sd => tln(g, [-40, sd * 180, -44, sd * 200], 6, '#c8302a')); const sx = 140 * draw;
    tln(g, [0, -330, sx, 0, 0, 330].slice(0, 4), 2.4, '#f6f0e0'); tln(g, [sx, 0, 0, 330], 2.4, '#f6f0e0');
    if (o.arrow !== false && draw > .2) { tln(g, [sx, 0, -200, 0], 5, '#6a4a2a'); tsh(g, `M-200 -10 L-236 0 L-200 10 Z`, '#cfd6de', 3); [-1, 1].forEach(sd => tsh(g, `M${sx} 0 L${sx - 40} ${sd * 16} L${sx - 30} 0 Z`, '#f6f0e0', 2)); } g.restore(); },
  ofuda: (g, h, o, t) => { g.save(); g.translate(h[0], h[1] - 30); g.rotate(-.15 + Math.sin(t * 3) * .05); tsh(g, 'M-26 -90 L26 -90 L26 70 L-26 70 Z', '#fbf6e8', 4); tln(g, [0, -70, 0, 50], 5, '#c8302a'); tln(g, [-14, -40, 14, -40], 4, '#c8302a'); tln(g, [-14, 0, 14, 0], 4, '#c8302a'); glow(g, 0, -10, 140, 'rgba(255,230,160,1)', .4); g.restore(); },
});
// ---- the nine-tailed fox (side view, running/standing), petrify 0..1 turns it to stone ----
function kyubi(g, a, lt, T) { const s = a.s || 1, run = a.run ?? 1, pet = clamp(a.petrify || 0), p = T * 9 * run + (a.ph || 0);
  const C = { fur: mix('#f2b23a', '#8a8680', pet), furD: mix('#d08a1e', '#6a6660', pet), belly: mix('#fff1d6', '#a8a49e', pet), tip: mix('#ffffff', '#b8b4ae', pet) };
  g.save(); g.translate(a.x, a.y); g.scale((a.flip ? -1 : 1) * s, s); const bob = run ? -Math.abs(Math.sin(p)) * 26 : 0;
  if (pet < .9) glow(g, 0, -260, 700, 'rgba(255,190,80,1)', (a.glowA ?? .5) * (1 - pet));
  g.fillStyle = rg(g, 0, 0, 10, 380, [[0, 'rgba(20,10,10,.35)'], [1, 'rgba(20,10,10,0)']]); g.beginPath(); g.ellipse(0, 6, 380, 30, 0, 0, 7); g.fill();
  g.translate(0, bob);
  // nine tails, fanned up and back
  for (let i = 0; i < 9; i++) { const a0 = -2.6 + i * .2 + Math.sin(T * 2 + i) * .08 * (1 - pet), L = 360 + (i % 3) * 50; g.save(); g.translate(-230, -250); g.rotate(a0);
    const tl = `M0 -44 C${L * .35} -130 ${L * .75} -110 ${L} 0 C${L * .82} 60 ${L * .7} 80 ${L * .6} 70 L${L * .55} 96 C${L * .4} 110 ${L * .2} 90 0 44 Z`; tsh(g, tl, lg(g, 0, 0, L, 0, [[0, C.furD], [.7, C.fur], [.84, C.tip], [1, C.tip]]), 5); g.restore(); }
  // legs: gallop cycle
  const leg = (x, ph2, col) => { const sw = Math.sin(p + ph2) * 80 * run, lift = Math.max(0, Math.cos(p + ph2)) * 50 * run; ttube(g, x, -230, x + sw * .5, -110, 92, 64, col, 6); ttube(g, x + sw * .5, -110, x + sw, -16 - lift, 60, 44, col, 6); tell(g, x + sw + 14, -14 - lift, 40, 20, mix('#3a2a2e', '#5a5650', pet), 5); };
  leg(-170, Math.PI, C.furD); leg(150, 0, C.furD);
  const body = 'M-300 -320 C-260 -430 120 -450 250 -370 C330 -320 320 -170 240 -140 C80 -100 -150 -100 -270 -150 C-340 -190 -350 -270 -300 -320 Z';
  tsh(g, body, lg(g, 0, -400, 0, -130, [[0, mix(C.fur, '#fff', .15)], [.6, C.fur], [1, C.furD]]), 6); sh(g, 'M-220 -150 C-80 -120 120 -120 230 -160 C150 -110 0 -100 -220 -150 Z', C.belly); tsh(g, 'M180 -380 C260 -340 300 -240 270 -170 L240 -200 L250 -240 L220 -250 L236 -300 L200 -310 Z', C.belly, 4);
  leg(-210, 0, C.fur); leg(190, Math.PI, C.fur);
  // neck + head
  ttube(g, 200, -340, 310, -450, 200, 160, C.fur, 6);
  g.save(); g.translate(330, -470); g.rotate(-.1 + Math.sin(p) * .04 * run);
  [[-40, -60], [20, -70]].forEach(([ex, ey], i) => { tsh(g, `M${ex - 34} ${ey + 20} L${ex} ${ey - 110} L${ex + 34} ${ey + 16} Z`, i ? C.fur : C.furD, 5); tsh(g, `M${ex - 16} ${ey + 10} L${ex} ${ey - 64} L${ex + 16} ${ey + 8} Z`, mix('#fbe4d0', '#9a9690', pet), 0); });
  tsh(g, 'M-90 -20 C-90 -90 40 -110 90 -60 L200 -10 Q214 6 196 18 C140 40 60 50 0 46 C-60 44 -92 20 -90 -20 Z', lg(g, 0, -110, 0, 50, [[0, mix(C.fur, '#fff', .2)], [1, C.fur]]), 6);
  sh(g, 'M-60 20 C0 44 120 40 190 16 C120 30 40 34 -60 10 Z', C.belly); tell(g, 198, 2, 12, 9, '#1a1214', 3); if (pet < .8) { tsh(g, 'M20 -60 Q40 -90 64 -64 Q42 -70 20 -60 Z', '#d8302a', 0); tsh(g, 'M96 -40 Q130 -50 150 -30 Q124 -36 96 -40 Z', '#d8302a', 0); }
  if (pet < .95) { glow(g, 60, -34, 90, 'rgba(255,60,40,1)', (1 - pet) * .8); tsh(g, 'M34 -34 Q62 -56 92 -36 Q62 -24 34 -34 Z', '#ffe080', 4); tell(g, 64, -36, 4, 10, '#1a0a0a', 0); }
  else tln(g, [34, -34, 64, -30, 92, -36], 5);
  tsh(g, 'M110 20 Q150 30 186 18', null, 4); g.restore();
  // stone texture creeping over the body
  if (pet > 0) { g.save(); g.globalAlpha = pet; const r = rng(7); for (let i = 0; i < 30; i++) { const x = -260 + r() * 560, y = -380 + r() * 260; tln(g, [x, y, x + (r() - .5) * 60, y + r() * 40, x + (r() - .5) * 90, y + 50 + r() * 40], 3, 'rgba(40,36,34,.7)'); } g.restore(); }
  g.restore(); }
// ---- the Killing Stone: a cracked black boulder with sacred rope; split 0..1 cleaves it; glow for the seal breaking ----
function killStone(g, a, lt, T) { const s = a.s || 1, sp = clamp(a.split || 0); g.save(); g.translate(a.x, a.y); g.scale(s, s);
  g.fillStyle = rg(g, 0, 0, 20, 420, [[0, 'rgba(10,6,10,.45)'], [1, 'rgba(10,6,10,0)']]); g.beginPath(); g.ellipse(0, 6, 420, 40, 0, 0, 7); g.fill();
  const half = (sd) => { g.save(); g.translate(sd * sp * 60, 0); g.rotate(sd * sp * .08);
    const d = sd < 0 ? 'M0 -560 L-40 -500 L-10 -400 L-50 -300 L-10 -170 L-40 -70 L0 0 L-300 0 L-340 -120 L-310 -260 L-250 -380 L-150 -500 L-60 -560 Z'
                     : 'M0 -560 L-40 -500 L-10 -400 L-50 -300 L-10 -170 L-40 -70 L0 0 L290 0 L330 -150 L300 -300 L230 -420 L110 -530 Z';
    tsh(g, d, lg(g, -300, -560, 300, 0, [[0, '#6a6470'], [.5, '#3e3846'], [1, '#1e1a22']]), 6); g.save(); g.clip(path(d)); const r = rng(sd < 0 ? 3 : 4); sh(g, sd < 0 ? 'M-300 0 L-340 -120 L-310 -260 L-250 -380 L-150 -500 L-90 -470 L-180 -360 L-230 -230 L-250 -100 Z' : 'M290 0 L330 -150 L300 -300 L230 -420 L170 -400 L240 -280 L260 -140 Z', 'rgba(0,0,0,.25)'); sh(g, 'M-150 -500 L-60 -560 L0 -560 L-40 -500 L-120 -460 Z', 'rgba(255,255,255,.12)');
    for (let i = 0; i < 18; i++) { const x = (r() - .5) * 600, y = -440 + r() * 420; tln(g, [x, y, x + (r() - .5) * 80, y + 30 + r() * 40], 3, 'rgba(10,8,12,.6)'); }
    for (let i = 0; i < 10; i++) ell(g, (r() - .5) * 560, -60 - r() * 380, 20 + r() * 40, 8 + r() * 12, 'rgba(160,150,170,.18)'); g.restore(); g.restore(); };
  if (sp > 0) { glow(g, 0, -240, 520 * sp + 100, 'rgba(170,90,255,1)', (a.glowA ?? .9) * sp); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(200,140,255,${.8 * sp})`; g.beginPath(); g.moveTo(-6, -480); g.lineTo(6, -480); g.lineTo(-30, 0); g.lineTo(-70, 0); g.fill(); g.restore(); }
  half(-1); half(1);
  // shimenawa: twisted rope around the middle with paper streamers; falls away as it splits
  if (a.rope !== false) { const drop = sp * 160; g.save(); g.translate(0, drop); g.rotate(sp * .25);
    for (let i = -10; i <= 10; i++) { const x = i * 31, y = -290 + Math.pow(i / 10, 2) * 40; tell(g, x, y, 22, 14, '#d8c07a', 2.6, .4); }
    [-150, -50, 50, 150].forEach(x => { const y = -290 + Math.pow(x / 320, 2) * 40 + 16; tsh(g, `M${x - 12} ${y} L${x + 12} ${y} L${x + 4} ${y + 26} L${x + 16} ${y + 26} L${x + 6} ${y + 56} L${x - 8} ${y + 56} L${x + 2} ${y + 30} L${x - 12} ${y + 30} Z`, '#fbf8f0', 2.4); }); g.restore(); }
  // poison steam
  for (let i = 0; i < 7; i++) { const q = (T * .22 + i / 7) % 1; puff(g, Math.sin(T * .7 + i * 2) * 90 + (i - 3) * 40, -420 - q * 760, 70 + q * 200, sp > 0 ? 'rgba(200,170,240,1)' : 'rgba(230,226,220,1)', (1 - q) * Math.min(1, q * 4) * .55); }
  if (a.rim !== false) glow(g, 0, -300, 520, sp > 0 ? 'rgba(180,90,255,1)' : 'rgba(150,120,210,1)', .25);
  g.restore(); }
function jizo(g, x, y, s, T) { g.save(); g.translate(x, y); g.scale(s, s); tsh(g, 'M-40 0 L40 0 L36 -20 L-36 -20 Z', '#8a8478', 3); tsh(g, 'M-34 -20 C-40 -100 40 -100 34 -20 Z', '#a8a296', 4); tell(g, 0, -110, 30, 32, '#b0aa9e', 4);
  tsh(g, 'M-32 -76 L32 -76 L20 -40 L-20 -40 Z', '#d23a2a', 3); tln(g, [-10, -112, -2, -108], 2.4, 'rgba(60,50,40,.6)'); tln(g, [4, -108, 12, -112], 2.4, 'rgba(60,50,40,.6)'); tln(g, [-6, -96, 6, -96], 2.4, 'rgba(60,50,40,.5)'); g.restore(); }
function birdFall(g, a, lt) { const r = rng(a.seed || 3); for (let i = 0; i < (a.n || 5); i++) { const t0 = r() * 1.4, q = clamp((lt - t0) / 1.0), x = a.x + (r() - .5) * 500, y = a.y - 600 + r() * 200 + q * q * 620;
    if (lt < t0) { const fl = Math.sin(lt * 14 + i) * 14; tln(g, [x - 26, y - fl, x, y], 5, '#1a1418'); tln(g, [x, y, x + 26, y - fl], 5, '#1a1418'); continue; }
    g.save(); g.translate(x, y); g.rotate(q * 3); tsh(g, 'M-24 0 Q0 -10 24 0 Q0 8 -24 0 Z', '#1a1418', 0); tln(g, [-10, 0, -20, 12], 3, '#1a1418'); g.restore(); } }
function arrowFly(g, a, lt) { const q = clamp((lt - a.t0) / (a.d || .5)); if (lt < a.t0 || q >= 1 && !a.hold) return; const x = lerp(a.x0, a.x1, q), y = lerp(a.y0, a.y1, q) - Math.sin(q * Math.PI) * (a.arc || 60), ang = Math.atan2(a.y1 - a.y0, a.x1 - a.x0);
  g.save(); g.translate(x, y); g.rotate(ang); for (let i = 1; i < 6; i++) { g.globalAlpha = .25 * (1 - i / 6); tln(g, [-80 - i * 40, 0, -40 - i * 40, 0], 6, '#fffaf0'); } g.globalAlpha = 1;
  tln(g, [-90, 0, 60, 0], 6, '#6a4a2a'); tsh(g, 'M60 -12 L104 0 L60 12 Z', '#cfd6de', 3); [-1, 1].forEach(sd => tsh(g, `M-90 0 L-120 ${sd * 18} L-100 0 Z`, '#f6f0e0', 2)); g.restore(); }
function mirrorReveal(g, a, lt, T) { const k = clamp(a.reveal ?? 1); g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  glow(g, 0, 0, 600, 'rgba(255,230,170,1)', .5); tell(g, 0, 0, 330, 330, lg(g, -330, -330, 330, 330, [[0, '#fff2c0'], [.5, '#d8a840'], [1, '#7a5418']]), 8);
  for (let i = 0; i < 24; i++) { const an = i / 24 * 6.28; tell(g, Math.cos(an) * 300, Math.sin(an) * 300, 10, 10, '#f6d070', 3); }
  const inner = 'M-262 0 A262 262 0 1 0 262 0 A262 262 0 1 0 -262 0 Z'; tsh(g, inner, lg(g, -260, -260, 260, 260, [[0, '#e8eef6'], [1, '#9aa6b8']]), 5);
  g.save(); g.clip(path(inner)); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(-90, -120, 120, 40, -.6, 0, 7); g.fill();
  // her reflection: the court lady's silhouette whose shadow sprouts nine tails and ears
  g.save(); g.translate(0, 260); g.scale(.55, .55); g.globalAlpha = .92; g.filter = 'brightness(0.12) saturate(0)';
  toon(g, { c: 'tamamo', x: 0, y: 0, s: 1, t: T, foxTails: k, foxEars: k, arms: 'clasp' }); g.filter = 'none'; g.restore();
  if (k > .2) { glow(g, -36, -120, 60, 'rgba(255,60,40,1)', k); glow(g, 36, -120, 60, 'rgba(255,60,40,1)', k); tell(g, -36, -120, 9, 5, '#ff6a3a', 0); tell(g, 36, -120, 9, 5, '#ff6a3a', 0); }
  g.restore(); g.restore(); }
function fallenKingdom(g, a, T) { const style = a.style || 'china'; g.save(); g.translate(a.x, a.y); g.scale(a.s || 1, a.s || 1);
  const pal = style === 'india' ? ['#f2a040', '#b8401e', '#5a1a14'] : ['#d84a2a', '#8a1a14', '#3a0a0a'];
  if (style === 'india') { tsh(g, 'M-360 0 L360 0 L360 -260 L-360 -260 Z', pal[1], 5); [-240, 0, 240].forEach((x, i) => { const r = i === 1 ? 140 : 90; tsh(g, `M${x - r} -260 C${x - r} ${-260 - r * 1.4} ${x + r} ${-260 - r * 1.4} ${x + r} -260 Z`, pal[0], 5); tln(g, [x, -260 - r * 1.3, x, -260 - r * 1.6], 6, OUT); });
    for (let i = -5; i <= 5; i++) tsh(g, `M${i * 60 - 16} 0 L${i * 60 + 16} 0 L${i * 60 + 16} -110 Q${i * 60} -140 ${i * 60 - 16} -110 Z`, pal[2], 3); }
  else { [[0, -300, 330], [0, -470, 250], [0, -600, 170]].forEach(([x, y, w], i) => { tsh(g, `M${-w - 60} ${y + 40} Q0 ${y - 10} ${w + 60} ${y + 40} L${w} ${y} L${-w} ${y} Z`, pal[2], 5); tsh(g, `M${-w * .8} ${y + 40} L${w * .8} ${y + 40} L${w * .8} ${y + 170 - i * 20} L${-w * .8} ${y + 170 - i * 20} Z`, pal[1], 5); });
    tsh(g, 'M-360 0 L360 0 L330 -130 L-330 -130 Z', pal[0], 5); }
  // the fox's shadow looming over the palace, flames at its feet
  g.save(); g.globalAlpha = .85; g.filter = 'brightness(0)'; kyubi(g, { x: 380, y: -260, s: .9, run: 0, flip: true }, 0, T); g.filter = 'none'; g.restore();
  flameWall(g, -420, 420, 20, 220, T, a.seed || 5, 1); smokeF(g, 0, -100, 700, T, .5, 9); g.restore(); }
Object.assign(JPA, {
  kyubi: (g, A, c) => kyubi(g, A, c.lt, c.T), killstone: (g, A, c) => killStone(g, A, c.lt, c.T), birds: (g, A, c) => birdFall(g, A, c.lt), arrow: (g, A, c) => arrowFly(g, A, c.lt),
  mirror: (g, A, c) => mirrorReveal(g, A, c.lt, c.T), kingdom: (g, A, c) => fallenKingdom(g, A, c.T), jizoRow: (g, A, c) => { for (let i = 0; i < (A.n || 5); i++) jizo(g, A.x + i * (A.dx || 90), A.y + (i % 2) * 6, A.s || .7, c.T); },
  sickbed: (g, A, c) => { g.save(); g.translate(A.x, A.y); g.scale(A.s || 1, A.s || 1); tsh(g, 'M-380 0 L380 0 L360 -60 L-360 -60 Z', '#efe6d2', 5); tpattern(g, 'M-380 0 L380 0 L360 -60 L-360 -60 Z', 'dots', 'rgba(120,60,90,.4)', 1);
    tsh(g, 'M-360 -60 C-300 -150 300 -150 360 -60 Z', '#7a2a5a', 5); tpattern(g, 'M-360 -60 C-300 -150 300 -150 360 -60 Z', 'clouds', 'rgba(240,200,120,.5)', 1); tell(g, -300, -100, 70, 36, '#fbf6ea', 4); g.restore(); },
  moonDisk: (g, A, c) => { glow(g, A.x, A.y, A.r * 6, 'rgba(230,236,255,1)', .35); ell(g, A.x, A.y, A.r, A.r, '#fbf8ec'); },
  label2022: (g, A, c) => { const k = clamp((c.lt - (A.t0 || 0)) / .4); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(A.x, A.y); g.rotate(-.03); tsh(g, 'M-230 -60 L230 -60 L230 60 L-230 60 Z', '#c8302a', 6); txt(g, A.text || 'MARCH 2022', 0, 20, 64, '#fbf6ea', '#3b2416', 'Nunito', 900); g.restore(); },
});
// ---- sets ----
function byobu(x, cx, cy, w, h, n) { for (let i = 0; i < n; i++) { const x0 = cx - w / 2 + i * w / n, d = `M${x0} ${cy - h} L${x0 + w / n} ${cy - h + (i % 2 ? 14 : 0)} L${x0 + w / n} ${cy + (i % 2 ? 14 : 0)} L${x0} ${cy} Z`;
    sh(x, d, lg(x, 0, cy - h, 0, cy, [[0, '#f4d27a'], [1, '#d8a840']]), 4, '#3b2416'); x.save(); x.clip(path(d)); x.globalAlpha = .9;
    cloudF(x, x0 + w / n / 2, cy - h * .7, .5, '#fff2c8', 'rgba(200,140,40,.5)'); if (i % 2) pine(x, x0 + w / n / 2, cy - 20, .5); x.restore(); } }
JSETS.heian = { back(g, o, c, T) { const night = o.tod !== 'day', dim = clamp(o.dim || 0);
    layerAt(g, c, .15, () => blit(g, cacheLayer('hn_garden' + (night ? 'n' : 'd'), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, night ? [[0, '#06081a'], [1, '#1e2650']] : [[0, '#9ab8d8'], [1, '#f6eedc']]); x.fillRect(-700, -700, 2480, 3400);
      if (night) { starsF(x, 120, 41, 600); moonF(x, 760, 300, 60); } ridge(x, 1000, 160, night ? '#141a34' : '#7a98b4', 3);
      waterF(x, 1010, 1200, night ? '#2a3466' : '#9ac0e0', night ? '#141c40' : '#5a8ab8', 44); for (let i = 0; i < 6; i++) { const px = -400 + i * 360; x.save(); x.translate(px, 1020); limb(x, [0, 0, 20, -160, -20, -280], 18, '#3a2420', 3); for (let k = 0; k < 14; k++) ell(x, (k * 37 % 160) - 80, -260 - (k * 23 % 120), 40, 28, ['#c8302a', '#e85a2a', '#a82424'][k % 3], 2, 0, 'rgba(60,10,10,.5)'); x.restore(); } }, { blur: 2 })));
    layerAt(g, c, .55, () => blit(g, cacheLayer('hn_room', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#2a1a14'], [1, '#4a2e1e']]); x.fillRect(-700, -700, 2480, 600);
      // open veranda frame onto the garden: pillars, beams, rolled-up bamboo blinds
      x.fillStyle = lg(x, 0, -100, 0, 1500, [[0, '#3a2418'], [1, '#2a1810']]); x.fillRect(-700, -100, 2480, 260); x.fillRect(-700, 1200, 2480, 420);
      for (let px = -560; px < 1700; px += 420) { sh(x, `M${px} -100 L${px + 54} -100 L${px + 54} 1500 L${px} 1500 Z`, lg(x, px, 0, px + 54, 0, [[0, '#2a160e'], [.5, '#7a4a2a'], [1, '#2a160e']]), 4, '#1a0e08');
        sh(x, `M${px + 54} 160 L${px + 420} 160 L${px + 420} 330 L${px + 54} 330 Z`, '#c8a868', 3, '#3b2416'); for (let k = 0; k < 14; k++) line(x, [px + 54, 170 + k * 11, px + 420, 170 + k * 11], 1.6, 'rgba(90,60,30,.5)', 'round', true);
        sh(x, `M${px + 54} 330 L${px + 420} 330 L${px + 420} 350 L${px + 54} 350 Z`, '#7a2a5a', 3); [px + 140, px + 330].forEach(tx => { line(x, [tx, 350, tx + 6, 430], 5, '#7a2a5a', 'round', true); ell(x, tx + 6, 440, 12, 14, '#7a2a5a', 2); }); }
      sh(x, 'M-700 1180 L1780 1180 L1780 1230 L-700 1230 Z', '#5a3420', 4, '#1a0e08'); for (let k = -700; k < 1780; k += 60) line(x, [k, 1180, k, 1230], 3, 'rgba(0,0,0,.4)', 'butt', true);
      byobu(x, 160, 1560, 560, 340, 4); byobu(x, 1000, 1560, 460, 300, 3); }, { blur: .5 })));
    layerAt(g, c, .55, () => { [[420, 1500], [760, 1520]].forEach(([x, y], i) => { line(g, [x, y + 60, x, y - 120], 8, '#3a2418', 'round', true); sh(g, `M${x - 40} ${y - 120} L${x + 40} ${y - 120} L${x + 34} ${y - 230} L${x - 34} ${y - 230} Z`, `rgba(255,${210 + 20 * Math.sin(T * 7 + i) | 0},150,.95)`, 4, '#3b2416'); glow(g, x, y - 170, 380, 'rgba(255,190,110,1)', .5 * (1 - dim * .6)); }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('hn_floor', x => { x.fillStyle = lg(x, 0, 1600, 0, 2700, [[0, '#7a5232'], [1, '#3a2414']]); x.fillRect(-700, 1600, 2480, 1200);
      for (let k = -700; k < 1780; k += 120) line(x, [k, 1600, k * 1.7 - 380, 2700], 3, 'rgba(0,0,0,.3)', 'round', true); for (let y = 1700; y < 2700; y += 130) line(x, [-700, y, 1780, y], 2, 'rgba(255,220,170,.08)', 'round', true); }, { y0: 1500, h: 1300 })));
    if (dim) layerAt(g, c, 0, () => { g.fillStyle = `rgba(10,14,40,${dim * .45})`; g.fillRect(-700, -700, 2480, 3400); }); },
  front(g, o, c, T) { if (o.petals) { const r = rng(5); for (let i = 0; i < 12; i++) { const x = ((r() * 1200 + T * 30) % 1200) - 60, y = ((r() * 1900 + T * 60) % 1900); g.save(); g.translate(x + c.cam[0] - 540, y + c.cam[1] - 960); g.rotate(T + i); ell(g, 0, 0, 10, 6, '#d8402a'); g.restore(); } } },
  haze(g) { g.fillStyle = 'rgba(255,170,100,.05)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.nasu = { back(g, o, c, T) { const night = o.tod === 'night';
    layerAt(g, c, 0, () => blit(g, cacheLayer('ns_sky' + (night ? 'n' : ''), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, night ? [[0, '#05060e'], [.6, '#1a1a3a'], [1, '#4a2a4a']] : [[0, '#2a2a5a'], [.45, '#a8506a'], [.8, '#f8a060'], [1, '#ffd49a']]); x.fillRect(-700, -700, 2480, 3400);
      if (night) { starsF(x, 200, 51, 800); moonF(x, 300, 260, 52); } else { glow(x, 820, 1080, 700, 'rgba(255,210,150,1)', .5); ell(x, 820, 1080, 90, 90, '#fff2d0'); } for (let i = 0; i < 6; i++) cloudF(x, -400 + i * 420, 400 + (i % 3) * 120, 1.2, night ? 'rgba(40,40,80,.6)' : 'rgba(210,120,140,.55)', night ? null : 'rgba(255,200,160,.5)'); })));
    // Nasu-dake: a volcano trailing smoke
    layerAt(g, c, .12, () => { blit(g, cacheLayer('ns_far' + (night ? 'n' : ''), x => { x.save(); x.translate(560, 1180); sh(x, 'M-700 0 C-420 -120 -200 -400 -80 -470 L60 -470 C180 -400 420 -120 700 0 Z', night ? '#22203a' : '#6a4a6a'); sh(x, 'M-80 -470 L60 -470 L90 -430 L-110 -430 Z', night ? '#3a3050' : '#8a6a7a'); x.restore();
        ridge(x, 1220, 180, night ? '#16162a' : '#4a3a5a', 5); }, { blur: 1.4 })); smokeF(g, 570, 720, 120, T, .35, 3); });
    layerAt(g, c, .35, () => blit(g, cacheLayer('ns_mid' + (night ? 'n' : ''), x => { forestBand(x, 1340, 220, 120, night ? '#101420' : '#3a2a34', 7); x.fillStyle = lg(x, 0, 1340, 0, 1700, night ? [[0, '#2a2a30'], [1, '#1a1a20']] : [[0, '#a8804a'], [1, '#8a643a']]); x.fillRect(-700, 1340, 2480, 400);
      for (let i = 0; i < 7; i++) { const px = -500 + i * 330; x.save(); x.translate(px, 1360); limb(x, [0, 0, 10, -120, -10, -200], 14, '#3a2420', 3); for (let k = 0; k < 10; k++) ell(x, (k * 37 % 140) - 70, -190 - (k * 23 % 90), 34, 24, ['#d8402a', '#f06a2a', '#b82a24'][k % 3], 2, 0, 'rgba(60,10,10,.5)'); x.restore(); } }, { blur: .8 })));
    layerAt(g, c, .55, () => susuki(g, -500, 1600, 1500, 200, 160, T, 61, null, 1));
    layerAt(g, c, 1, () => blit(g, cacheLayer('ns_ground' + (night ? 'n' : ''), x => { x.fillStyle = lg(x, 0, 1600, 0, 2700, night ? [[0, '#2a2a2e'], [1, '#121216']] : [[0, '#9a7a48'], [1, '#5a4626']]); x.fillRect(-700, 1600, 2480, 1200); grassField(x, 1600, 2600, 1400, night ? ['#2a3428', '#1e2a1e'] : ['#8a6e3a', '#a88a50', '#7a5e2e'], 63, -700, 1780, 30); }, { y0: 1500, h: 1300 }))); },
  front(g, o, c, T) { susuki(g, -300, 1380, 2060, 140, 360, T, 67, null, 1.2); if (o.leaves !== false) { const r = rng(71); for (let i = 0; i < 14; i++) { const x = ((r() * 1300 + T * 70) % 1300) - 110, y = ((r() * 1900 + T * 50 + Math.sin(T + i) * 40) % 1900); g.save(); g.translate(x + c.cam[0] - 540, y + c.cam[1] - 960); g.rotate(T * 2 + i); ell(g, 0, 0, 12, 7, ['#d8402a', '#f08a2a'][i % 2]); g.restore(); } } },
  haze(g, o) { g.fillStyle = o.tod === 'night' ? 'rgba(120,120,200,.05)' : 'rgba(255,170,120,.07)'; g.fillRect(0, 0, 1080, 1920); } };
// the volcanic slope of the Killing Stone: grey ash, sulphur vents, rows of jizo, a fence, steam everywhere
JSETS.stone = { back(g, o, c, T) { const night = o.tod !== 'day';
    layerAt(g, c, 0, () => blit(g, cacheLayer('st2_sky' + (night ? 'n' : 'd'), x => { x.fillStyle = lg(x, 0, -700, 0, 1500, night ? [[0, '#05040c'], [.6, '#1a1430'], [1, '#3a2a4a']] : [[0, '#8aa8c8'], [1, '#e8e4dc']]); x.fillRect(-700, -700, 2480, 3400);
      if (night) { starsF(x, 220, 81, 900); moonF(x, 820, 240, 58); } for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 420 + (i % 2) * 90, 1.0, night ? '#221c3c' : '#f6f6f8', night ? '#3a3060' : '#ffffff'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('st2_far' + (night ? 'n' : 'd'), x => { ridge(x, 1120, 420, night ? '#1e1a2e' : '#7a7a86', 9, { sharp: true, peaks: true }); ridge(x, 1220, 260, night ? '#16141e' : '#5a5a66', 11); }, { blur: 1.4 })));
    layerAt(g, c, .4, () => { blit(g, cacheLayer('st2_mid' + (night ? 'n' : 'd'), x => { x.fillStyle = lg(x, 0, 1240, 0, 1800, night ? [[0, '#3a3640'], [1, '#2a2630']] : [[0, '#a8a49e'], [1, '#8a8680']]); x.fillRect(-700, 1240, 2480, 600);
        const r = rng(91); for (let i = 0; i < 120; i++) ell(x, r() * 2400 - 680, 1260 + r() * 500, 20 + r() * 60, 8 + r() * 20, night ? `rgba(${70 + r() * 30 | 0},${66 + r() * 30 | 0},${80 + r() * 30 | 0},.6)` : `rgba(${150 + r() * 40 | 0},${146 + r() * 40 | 0},${140 + r() * 40 | 0},.6)`, 1.4, 0, 'rgba(30,30,30,.3)');
        for (let k = -600; k < 1700; k += 70) { line(x, [k, 1440, k, 1360], 8, '#5a3a22', 'round', true); } line(x, [-600, 1380, 1700, 1380], 5, '#5a3a22', 'round', true); line(x, [-600, 1410, 1700, 1410], 5, '#5a3a22', 'round', true);
        for (let i = 0; i < 9; i++) jizo(x, -360 + i * 110, 1470 + (i % 2) * 8, .62, 0); }, { blur: .5, y0: 1100, h: 900 }));
      [[-120, 1300], [1180, 1320], [880, 1260]].forEach(([vx, vy], i) => { for (let k = 0; k < 4; k++) { const q = (T * .3 + k / 4 + i * .17) % 1; puff(g, vx + Math.sin(T + k) * 40, vy - q * 600, 80 + q * 200, night ? 'rgba(170,156,190,1)' : 'rgba(244,242,234,1)', (1 - q) * Math.min(1, q * 4) * .5); } }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('st2_ground' + (night ? 'n' : 'd'), x => { x.fillStyle = lg(x, 0, 1580, 0, 2700, night ? [[0, '#3a3640'], [1, '#18161c']] : [[0, '#9a968e'], [1, '#5a5650']]); x.fillRect(-700, 1580, 2480, 1200);
      pebbles(x, 1600, 2600, 360, 93, night ? ['#4a4652', '#5a5662', '#2e2c34'] : ['#8a8478', '#a8a296', '#6e6a62']); const r = rng(95); for (let i = 0; i < 14; i++) ell(x, r() * 2400 - 680, 1640 + r() * 800, 60 + r() * 80, 14 + r() * 12, night ? 'rgba(200,190,90,.18)' : 'rgba(230,210,90,.35)'); }, { y0: 1500, h: 1300 }))); },
  front(g, o, c, T) { if (o.mist !== false) for (let i = 0; i < 5; i++) { const x = ((i * 300 + T * 25) % 1500) - 200; g.save(); g.globalAlpha = .18; ell(g, x + c.cam[0] - 540, 1900 + c.cam[1] - 960 + Math.sin(T + i) * 20, 320, 60, '#d8d0e8'); g.restore(); } embers(g, T, 10, 97); },
  haze(g, o) { g.fillStyle = o.tod === 'day' ? 'rgba(255,255,240,.06)' : 'rgba(150,110,220,.07)'; g.fillRect(0, 0, 1080, 1920); } };
