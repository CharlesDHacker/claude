// JP09 Japan's Anubis: Inari and her white fox messengers. Stone fox statues (key / jewel, red bibs), the senbon torii tunnel
// at Fushimi Inari, the black jackal by the Nile vs the white fox in the rice, inari sushi, and a seated jackal-god silhouette
// (an easter egg for a fellow myth channel) waiting at the far end of the gates.

Object.assign(TOON, {
  inariKami: { kind: 'adult', female: true, skin: '#f6d8b8', skinD: '#e0b898', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'goddess', top: '#fbf6ea', topD: '#e8dcc4', pat: 'clouds', patCol: 'rgba(220,170,60,.4)', collar: '#c8302a',
    sleeve: 'wide', bottom: 'skirt', skirt: '#c8302a', skirtD: '#a02420', belt: '#e8c050', feet: 'straw', eyes: 'adult', iris: '#c8302a', lashes: true, brow: 5, lips: '#c04a5a', h: 1.02 },
});
Object.assign(THOLD, {
  rice: (g, h, o, t) => { g.save(); g.translate(h[0], h[1]); g.rotate((o.holdRot ?? -.3) + Math.sin(t * 1.4) * .04);
    for (let k = -3; k <= 3; k++) tln(g, [0, 40, k * 16, -200], 4, '#8a7a2a');
    for (let k = -3; k <= 3; k++) for (let j = 0; j < 6; j++) { const x = k * 16 * (1 - j * .02) + Math.sin(k + j) * 6, y = -200 + j * 22 - Math.abs(k) * 8; tell(g, x, y, 7, 11, '#e8c050', 2, .3 * k); }
    tsh(g, 'M-20 10 L20 10 L18 30 L-18 30 Z', '#c8302a', 3); g.restore(); },
});

// ---------- stone fox statue on a plinth: sitting upright, tail flaring, bib, key or jewel in the mouth ----------
JPA.foxStatue = (g, A, c) => { const s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * s, s); const ST = A.col || '#c8c4bc', SD = A.colD || '#9a968e';
  tsh(g, 'M-150 0 L150 0 L140 -120 L-140 -120 Z', lg(g, 0, -120, 0, 0, [[0, '#a8a296'], [1, '#6e6a62']]), 5); tsh(g, 'M-166 -120 L166 -120 L166 -146 L-166 -146 Z', '#b8b2a6', 5);
  tsh(g, 'M40 -150 C120 -170 170 -260 140 -380 C130 -420 100 -440 90 -400 C110 -300 80 -220 30 -190 Z', ST, 5);                     // tail flaring up behind
  tsh(g, 'M-90 -146 C-110 -230 -80 -330 -40 -380 L30 -380 C60 -320 80 -230 70 -146 Z', ST, 5); g.save(); g.clip(path('M-90 -146 C-110 -230 -80 -330 -40 -380 L30 -380 C60 -320 80 -230 70 -146 Z')); g.fillStyle = 'rgba(60,55,50,.18)'; g.fillRect(10, -400, 100, 300); g.restore(); tsh(g, 'M-90 -146 C-110 -230 -80 -330 -40 -380 L30 -380 C60 -320 80 -230 70 -146 Z', null, 5);
  tsh(g, 'M-70 -146 L-60 -230 L-40 -230 L-44 -146 Z', SD, 4); tsh(g, 'M10 -146 L20 -230 L40 -230 L36 -146 Z', SD, 4);                  // front legs
  tsh(g, 'M-60 -340 L40 -340 L-10 -250 Z', '#c8302a', 4); tln(g, [-60, -340, 40, -340], 5, '#a02420');                                       // red bib
  g.save(); g.translate(-10, -400); tsh(g, 'M-50 20 C-60 -30 -40 -60 0 -64 C40 -60 60 -30 50 20 C40 40 -40 40 -50 20 Z', ST, 5);                // head
  tsh(g, 'M-44 -40 L-60 -120 L-14 -60 Z', ST, 4); tsh(g, 'M14 -60 L40 -120 L44 -40 Z', ST, 4); tsh(g, 'M-40 10 L-110 26 L-44 34 Z', ST, 4);   // ears, snout (facing left)
  tell(g, -22, -16, 8, 4, '#3a3630', 0); tln(g, [-40, -20, -10, -10], 3, '#c8302a');
  if (A.holds === 'key') { tln(g, [-110, 28, -40, 30], 8, '#c8a040'); tell(g, -122, 28, 14, 14, null, 6, 0, '#c8a040'); tln(g, [-60, 30, -60, 46, -50, 46], 5, '#c8a040'); }
  if (A.holds === 'jewel') { glow(g, -120, 20, 90, 'rgba(255,230,150,1)', .6); tsh(g, 'M-120 -14 C-100 0 -96 24 -120 40 C-144 24 -140 0 -120 -14 Z', '#f0d070', 4); }
  g.restore(); g.restore(); };

// ---------- the seated jackal-god silhouette: upright on a big box, facing left, arm out holding a tall was-staff ----------
// ground at y = 0; the box runs x -40..260, top at -330. Drawn as one solid shape so it reads as a clean silhouette.
JPA.anubisSil = (g, A, c) => { const s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * s, s); if (A.a != null) g.globalAlpha *= A.a; const K = A.col || '#050304';
  g.fillStyle = K; g.strokeStyle = K; g.lineCap = 'round'; g.lineJoin = 'round';
  const F = d => g.fill(new Path2D(d));
  F('M40 0 L300 0 L300 -300 L40 -300 Z');                                                                     // the box (set back, so the shins stand clear of it)
  F('M26 -298 L314 -298 L314 -318 L26 -318 Z');                                                              // its lip
  F('M262 -312 C268 -350 252 -380 226 -380 L60 -374 C10 -372 -40 -372 -52 -356 C-62 -340 -56 -318 -36 -310 C40 -306 160 -306 262 -312 Z');   // thighs on the box, knees jutting past its edge
  F('M-58 -336 C-60 -240 -54 -120 -48 -40 L-14 -40 C-12 -120 -12 -240 -14 -330 Z');                          // shin, free of the box
  F('M-48 -44 L-124 -32 C-138 -26 -136 -2 -118 0 L-8 0 L-12 -44 Z');                                         // foot, toes forward
  F('M150 -376 C152 -436 166 -480 170 -522 C150 -584 142 -632 162 -664 L266 -664 C290 -622 284 -562 260 -522 C260 -472 270 -424 274 -376 Z');   // torso: broad shoulders, narrow waist
  F('M258 -656 C292 -620 296 -520 276 -430 C270 -406 252 -398 238 -406 C250 -460 262 -540 246 -610 Z');      // back arm down to the lap
  F('M188 -664 C110 -654 30 -638 -76 -628 C-96 -626 -98 -600 -80 -596 C20 -594 110 -602 190 -612 Z');         // front arm reaching forward, level
  F('M184 -660 L240 -660 L236 -718 L190 -720 Z');                                                            // neck
  F('M232 -762 C272 -758 290 -722 292 -682 L302 -590 C302 -574 288 -570 278 -582 L256 -664 Z');              // headcloth falling behind the neck
  F('M170 -744 C168 -780 192 -800 220 -798 C248 -796 262 -772 258 -742 C256 -718 240 -706 218 -706 L184 -708 C174 -716 170 -730 170 -744 Z');   // the head
  F('M196 -778 C156 -772 104 -758 52 -740 C40 -736 40 -720 54 -716 C104 -714 156 -712 200 -712 Z');          // the snout: long, but thick at the root
  F('M190 -782 L206 -900 L234 -790 Z');                                                                      // ear
  F('M226 -786 L252 -890 L266 -776 Z');                                                                      // ear
  // the was-staff held upright in front of the knees: forked foot, long shaft, hooked head
  g.lineWidth = 13; g.beginPath(); g.moveTo(-104, -16); g.lineTo(-104, -1000); g.stroke();
  F('M-104 -30 L-134 6 L-120 6 L-104 -14 L-88 6 L-74 6 Z');
  F('M-110 -992 C-120 -1030 -106 -1056 -76 -1052 C-64 -1050 -58 -1040 -62 -1032 C-78 -1036 -92 -1030 -96 -1000 Z');
  F('M-116 -632 C-124 -620 -124 -600 -114 -590 L-92 -590 C-86 -602 -86 -620 -94 -632 Z');                    // the fist around the shaft
  g.restore(); };

// ---------- a black jackal by the Nile, sitting ----------
JPA.jackal = (g, A, c) => { const T = c.T, s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * s, s); const B = '#1a1416', H = 'rgba(210,170,110,.6)';
  tsh(g, `M60 -40 C160 -40 190 ${-80 + Math.sin(T * 2) * 10} 200 -140 C180 -110 140 -80 70 -80 Z`, B, 5);
  tsh(g, 'M-60 0 C-90 -80 -70 -200 -30 -260 L30 -260 C60 -200 90 -80 90 0 Z', B, 5); tsh(g, 'M-50 0 L-40 -120 L-20 -120 L-24 0 Z', B, 4); tsh(g, 'M10 0 L20 -120 L40 -120 L36 0 Z', B, 4);
  g.save(); g.translate(-10, -290); tsh(g, 'M-40 20 C-50 -30 -30 -56 6 -60 C40 -56 54 -30 46 20 C36 40 -30 40 -40 20 Z', B, 5); tsh(g, 'M-36 -30 L-48 -120 L-8 -54 Z', B, 4); tsh(g, 'M8 -54 L30 -120 L40 -30 Z', B, 4);
  tsh(g, 'M-30 6 L-120 22 L-34 32 Z', B, 4); tell(g, -16, -14, 9, 5, '#e8b040', 0); tell(g, -18, -14, 3, 4, '#140c08', 0); tln(g, [-34, -54, -30, -100], 3, H); g.restore();
  tln(g, [-50, -220, -40, -60], 3, H); g.restore(); };

// ---------- inari sushi on a plate ----------
JPA.inariSushi = (g, A, c) => { const s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale(s, s); tell(g, 0, 10, 200, 46, '#f4efe6', 5); tell(g, 0, 4, 170, 34, '#e0d8c8', 0);
  [[-90, -10], [0, -20], [90, -10]].forEach(([x, y], i) => { tsh(g, `M${x - 56} ${y + 10} Q${x - 60} ${y - 50} ${x} ${y - 56} Q${x + 60} ${y - 50} ${x + 56} ${y + 10} Q${x} ${y + 26} ${x - 56} ${y + 10} Z`, '#c8882a', 4);
    tln(g, [x - 30, y - 30, x - 10, y - 20], 2, 'rgba(120,70,20,.5)'); tln(g, [x + 10, y - 40, x + 30, y - 28], 2, 'rgba(120,70,20,.5)'); });
  g.restore(); };

// ---------- worlds ----------
function shrineHall(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); sh(x, 'M-360 0 L360 0 L360 -240 L-360 -240 Z', '#f4efe6'); for (let i = -2; i <= 2; i++) sh(x, `M${i * 150 - 14} 0 L${i * 150 + 14} 0 L${i * 150 + 14} -260 L${i * 150 - 14} -260 Z`, '#d23a2a');
  sh(x, 'M-440 -250 Q0 -300 440 -250 L320 -400 L-320 -400 Z', '#2e3a3a'); sh(x, 'M-330 -400 L330 -400 L300 -430 L-300 -430 Z', '#d23a2a'); line(x, [-360, -244, 360, -244], 10, '#d23a2a'); x.restore(); }
JSETS.inari = { light: o => o.tod === 'day' ? { x: 1, col: 'rgba(255,240,210,1)', rim: .6, shade: .25 } : { x: -1, col: 'rgba(255,170,110,1)', rim: .85, shade: .32 },
  back(g, o, c, T) { const day = o.tod === 'day';
    layerAt(g, c, 0, () => blit(g, cacheLayer('in_sky' + day, x => { x.fillStyle = lg(x, 0, -700, 0, 1400, day ? [[0, '#5a9ad8'], [.7, '#b8dcf4'], [1, '#f0f6ff']] : [[0, '#241a44'], [.55, '#a04a5a'], [.85, '#f09a5a'], [1, '#ffd08a']]); x.fillRect(-700, -700, 2480, 3400);
      for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 460 + (i % 2) * 150, 1.1, day ? 'rgba(255,255,255,.85)' : 'rgba(160,70,90,.6)', day ? 'rgba(255,255,255,.6)' : 'rgba(255,190,130,.5)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('in_far' + day, x => { ridge(x, 1150, 300, day ? '#5a8a6a' : '#3a2a44', 231, {}); for (let i = 0; i < 14; i++) cedar(x, -500 + i * 160, 1340 + (i % 3) * 20, 1.4, day ? '#2a4a34' : '#1a1a24'); }, { blur: 1.2 })));
    layerAt(g, c, .4, () => blit(g, cacheLayer('in_mid' + day, x => { shrineHall(x, 540, 1460, .9); torii(x, 540, 1560, 1.0); }, { blur: .4 })));
    layerAt(g, c, .4, () => { [[200, 1300], [880, 1300]].forEach(([x, y], i) => { chochin(g, x, y, .9, T, i); glow(g, x, y, 220, 'rgba(255,170,90,1)', day ? .1 : .4); }); });
    layerAt(g, c, 1, () => blit(g, cacheLayer('in_ground' + day, x => { x.fillStyle = lg(x, 0, 1560, 0, 2700, day ? [[0, '#d8d0c0'], [1, '#9a9080']] : [[0, '#8a7a72'], [1, '#3a2e2c']]); x.fillRect(-700, 1560, 2480, 1300); pebbles(x, 1600, 2600, 300, 232, ['#a8a296', '#8a8478', '#bcb6aa']);
      sh(x, 'M440 1560 L640 1560 L900 2700 L180 2700 Z', day ? 'rgba(200,190,175,.7)' : 'rgba(120,110,100,.6)'); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { if (o.tod !== 'day') fireflies(g, T, 10, 233, [-200, 900, 1300, 1700], 'rgba(255,220,150,1)'); },
  haze(g, o) { g.fillStyle = o.tod === 'day' ? 'rgba(255,240,210,.05)' : 'rgba(255,130,90,.06)'; g.fillRect(0, 0, 1080, 1920); } };
// the tunnel of gates, receding to a vanishing point up the mountain path
function gateRing(x, cx, cy, s, col, dark) { x.save(); x.translate(cx, cy); x.scale(s, s); [-1, 1].forEach(sd => sh(x, `M${sd * 300 - 26} 0 L${sd * 300 + 26} 0 L${sd * 300 + 22} -640 L${sd * 300 - 22} -640 Z`, col));
  sh(x, 'M-380 -640 Q0 -660 380 -640 L370 -690 Q0 -710 -370 -690 Z', dark); sh(x, 'M-330 -570 L330 -570 L330 -540 L-330 -540 Z', col); [-1, 1].forEach(sd => sh(x, `M${sd * 300 - 30} 0 L${sd * 300 + 30} 0 L${sd * 300 + 30} -60 L${sd * 300 - 30} -60 Z`, dark)); x.restore(); }
JSETS.senbon = { light: { x: 0.3, col: 'rgba(255,190,120,1)', rim: .8, shade: .3 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('sb_back', x => { x.fillStyle = lg(x, 0, -700, 0, 1600, [[0, '#120a10'], [.6, '#3a1a1a'], [1, '#6a3a2a']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 540, 1170, 520, 'rgba(255,210,150,1)', .7); })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('sb_ground', x => { x.fillStyle = lg(x, 0, 1160, 0, 2700, [[0, '#4a3226'], [1, '#160c08']]); x.beginPath(); x.moveTo(500, 1160); x.lineTo(580, 1160); x.lineTo(1700, 2700); x.lineTo(-620, 2700); x.closePath(); x.fill();
      for (let i = 0; i < 26; i++) { const q = i / 26, y = lerp(1220, 2600, q * q); line(x, [540 - (60 + 900 * q * q), y, 540 + (60 + 900 * q * q), y], 2, 'rgba(0,0,0,.35)'); } }, { y0: 1100, h: 1700 })));
    // true perspective: gate at depth z has scale 1.5/z and stands on the ground plane; far half, then the silhouette, then near half
    const GZ = (z0, z1, key) => blit(g, cacheLayer(key, x => { for (let z = z1; z >= z0; z -= .28) { const sc = 1.5 / z, by = 1160 + 760 * sc, dk = clamp((z - 1) / 16) * .45;
      glow(x, 540, by - 300 * sc, 500 * sc, 'rgba(255,190,110,1)', .12); gateRing(x, 540, by, sc, mix('#e8502a', '#5a1810', dk), mix('#2a1a16', '#0a0606', dk)); } }, { blur: .3 }));
    layerAt(g, c, .6, () => GZ(7, 22, 'sb_far2'));
    layerAt(g, c, .6, () => GZ(1.6, 6.6, 'sb_near2'));
    if (o.actorsFar) layerAt(g, c, .6, () => o.actorsFar.forEach(a => drawActor(g, a, c, {}, o)));   // standing in the open tunnel, below the beams
    layerAt(g, c, 1, () => { for (let i = 0; i < 6; i++) { const q = ((T * .05 + i / 6) % 1); glow(g, 540 + Math.sin(i * 2) * 300 * q, lerp(1200, 1700, q), 140, 'rgba(255,190,110,1)', .15 * Math.sin(q * Math.PI)); } });
  },
  front(g, o, c, T) { layerAt(g, c, 1.35, () => blit(g, cacheLayer('sb_near', x => { gateRing(x, 540, 2700, 2.2, '#e8542e', '#1a1010'); gateRing(x, 540, 2300, 1.4, '#e04a2a', '#1a1010'); }, { blur: 2 }))); },
  haze(g) { g.fillStyle = 'rgba(255,110,60,.07)'; g.fillRect(0, 0, 1080, 1920); } };
// Egypt by the Nile (dusk, black soil) and Japan in the rice (gold)
JSETS.nile = { light: { x: 1, col: 'rgba(255,190,120,1)', rim: .8, shade: .3 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('nl_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#2a2050'], [.55, '#b06a5a'], [.85, '#f0aa6a'], [1, '#ffd89a']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 760, 1130, 500, 'rgba(255,220,150,1)', .6); ell(x, 760, 1140, 90, 90, '#fff0c8'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('nl_far', x => { [[160, 1260, 1.0], [420, 1270, .7], [1000, 1260, .6]].forEach(([px, py, s]) => sh(x, `M${px - 260 * s} ${py} L${px} ${py - 300 * s} L${px + 260 * s} ${py} Z`, '#8a5a5a')); for (let i = 0; i < 8; i++) { const px = -300 + i * 220; line(x, [px, 1290, px + 10, 1150], 8, '#3a2a30', 'round'); for (let k = 0; k < 6; k++) { const an = -2.6 + k * .45; line(x, [px + 10, 1150, px + 10 + Math.cos(an) * 80, 1150 + Math.sin(an) * 50 + 20], 6, '#3a2a30', 'round'); } } }, { blur: 1 })));
    layerAt(g, c, .3, () => blit(g, cacheLayer('nl_river', x => { waterF(x, 1290, 1440, '#d89a7a', '#6a4a5a', 241); }, { blur: .6 })));
    layerAt(g, c, 1, () => blit(g, cacheLayer('nl_soil', x => { x.fillStyle = lg(x, 0, 1440, 0, 2700, [[0, '#2a1a14'], [1, '#0c0806']]); x.fillRect(-700, 1440, 2480, 1300); for (let y = 1480; y < 2600; y += 60) line(x, [-700, y, 1780, y + 30], 3, 'rgba(90,60,40,.4)'); grassField(x, 1440, 1520, 300, ['#3a5a2a', '#4a6a34'], 242); }, { y0: 1400, h: 1400 })));
  },
  front(g, o, c, T) { fireflies(g, T, 14, 247, [-200, 900, 1300, 1800], 'rgba(255,220,150,1)'); },
  haze(g) { g.fillStyle = 'rgba(255,170,90,.06)'; g.fillRect(0, 0, 1080, 1920); } };
JSETS.rice = { light: { x: -1, col: 'rgba(255,230,160,1)', rim: .8, shade: .28 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('rc_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#4a6ab0'], [.6, '#f0c080'], [1, '#ffe8b0']]); x.fillRect(-700, -700, 2480, 3400); glow(x, 300, 1100, 500, 'rgba(255,230,160,1)', .6); for (let i = 0; i < 4; i++) cloudF(x, -200 + i * 480, 520 + (i % 2) * 140, 1.0, 'rgba(255,240,220,.8)', 'rgba(255,220,170,.6)'); })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('rc_far', x => { ridge(x, 1150, 360, '#5a7a8a', 243, { snow: '#f4f4f0', sharp: true }); ridge(x, 1250, 160, '#4a6a4a', 244, {}); torii(x, 860, 1330, .35); }, { blur: 1.2 })));
    layerAt(g, c, .5, () => { for (let k = 0; k < 4; k++) { const y = 1330 + k * 70; g.fillStyle = ['#c8a040', '#d8b04a', '#c89a38', '#e0b850'][k]; g.beginPath(); g.moveTo(-700, y + 80); for (let x0 = -700; x0 <= 1780; x0 += 80) g.lineTo(x0, y + Math.sin(x0 * .01 + T * 1.2 + k) * 6); g.lineTo(1780, y + 300); g.lineTo(-700, y + 300); g.fill(); line(g, [-700, y + 4, 1780, y + 4], 3, 'rgba(120,90,30,.4)'); } });
    layerAt(g, c, 1, () => { g.fillStyle = lg(g, 0, 1600, 0, 2700, [[0, '#d8b04a'], [1, '#8a6a2a']]); g.fillRect(-700, 1600, 2480, 1300); const r = rng(245); for (let i = 0; i < 140; i++) { const x = r() * 2400 - 700, y = 1620 + r() * 1000, sw = Math.sin(T * 1.6 + i) * 8; line(g, [x, y, x + sw, y - 70], 4, '#a8842a', 'round'); tell(g, x + sw, y - 76, 6, 12, '#e8c050', 0, .3); } });
  },
  front(g, o, c, T) { const r = rng(246); for (let i = 0; i < 18; i++) { const x = ((r() * 1500 + T * 40) % 1500) - 200, y = ((r() * 2000 + T * (30 + r() * 30)) % 2000) - 40; ell(g, x, y, 3, 3, 'rgba(255,240,190,.7)'); } },
  haze(g) { g.fillStyle = 'rgba(255,210,120,.06)'; g.fillRect(0, 0, 1080, 1920); } };
// ---------- a torii pillar up close: lacquer, and the donor's name brushed down it ----------
JPA.pillar = (g, A, c) => { const s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale(s, s);
  tsh(g, 'M-120 400 L120 400 L120 -1400 L-120 -1400 Z', lg(g, -120, 0, 120, 0, [[0, '#b8341e'], [.45, '#ee5a34'], [1, '#a82e1a']]), 6); tsh(g, 'M-130 400 L130 400 L130 300 L-130 300 Z', '#1a1212', 5);
  g.fillStyle = '#140c0a'; g.font = "900 96px 'IPAGothic'"; g.textAlign = 'center'; g.textBaseline = 'middle';
  [...(A.text || '奉納')].forEach((ch, i) => g.fillText(ch, 0, -1100 + i * 120)); g.font = "900 60px 'IPAGothic'"; [...(A.sub || '商店一同')].forEach((ch, i) => g.fillText(ch, 0, -780 + i * 80));
  g.restore(); };
// ---------- a girl's silhouette, standing, facing right (toward the jackal-god): big round head, long straight hair,
// a feather in her headband, a long flared dress, a brush held out. Ground at y = 0. ----------
JPA.girlSil = (g, A, c) => { const s = A.s || 1; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * s, s); if (A.a != null) g.globalAlpha *= A.a; g.fillStyle = A.col || '#050304';
  const F = d => g.fill(new Path2D(d)), bob = Math.sin((c.T || 0) * 2) * 3;
  F('M-44 -6 C-60 -6 -62 8 -44 8 L-14 8 L-14 -6 Z'); F('M18 -6 L18 8 L52 8 C66 8 64 -6 48 -6 Z');                     // feet
  F('M-86 -8 L86 -8 C70 -110 48 -230 34 -320 L-34 -320 C-48 -230 -70 -110 -86 -8 Z');                              // A-line dress, flaring to the ankles
  F('M-36 -318 L36 -318 L44 -446 L-44 -446 Z');                                                                       // fitted bodice
  F('M-14 -444 L14 -444 L12 -470 L-12 -470 Z');                                                                       // thin neck
  g.save(); g.translate(0, bob);
  F('M-30 -600 C-90 -600 -112 -560 -112 -500 L-120 -330 C-100 -322 -84 -330 -78 -350 L-70 -470 Z');                   // long straight hair hanging down her back
  F('M-84 -548 C-84 -616 -44 -648 6 -648 C56 -648 92 -616 92 -548 C92 -488 54 -456 4 -456 C-46 -456 -84 -488 -84 -548 Z');                             // big round head
  F('M-86 -588 L92 -588 L92 -574 L-86 -574 Z');                                                                       // headband
  F('M-2 -640 C-26 -684 -14 -742 8 -760 C30 -730 30 -680 14 -640 Z');                                                 // the feather standing up from her headband
  g.restore();
  F('M36 -424 C80 -420 118 -408 150 -392 C158 -388 156 -372 146 -372 C112 -380 74 -392 34 -398 Z');                    // arm held out
  g.lineWidth = 7; g.lineCap = 'round'; g.strokeStyle = A.col || '#050304'; g.beginPath(); g.moveTo(146, -384); g.lineTo(206, -336); g.stroke();   // the brush
  F('M200 -344 C214 -340 220 -326 210 -318 C200 -322 196 -334 200 -344 Z');
  g.restore(); };
