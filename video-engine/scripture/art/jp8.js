// JP08 The Nue (a viewer request): the chimera (monkey face, tanuki body, tiger legs, snake tail), the black cloud over the
// palace, Yorimasa the archer and his retainer Hayata, the viewer's comment card, the night thrush, the Nue Shrine today.

// ---------- the Nue: side-on (faces left; flip to face right), hooves at y = 0 ----------
function nueDraw(g, a, c) { const T = c.T, s = a.s || 1, br = Math.sin(T * 2.2) * .02, sh = a.shriek || 0, ph = a.ph || 0;
  g.save(); g.translate(a.x, a.y); if (a.spin) { g.translate(0, -260 * s); g.rotate(a.spin); g.translate(0, 260 * s); } g.scale((a.flip ? -1 : 1) * s, s);
  if (a.sil) g.filter = `brightness(${a.sil})`;
  if (!a.noShadow) { g.fillStyle = rg(g, 0, 6, 10, 360, [[0, 'rgba(10,5,15,.45)'], [1, 'rgba(10,5,15,0)']]); g.beginPath(); g.ellipse(0, 6, 360, 30, 0, 0, 7); g.fill(); }
  // snake tail (behind): an S-curve from the rump, rearing up with its own head
  const tw = Math.sin(T * 2.6 + ph) * 40, tw2 = Math.sin(T * 3.1 + ph + 1) * 30;
  const tail = [[230, -300], [330, -330 + tw * .3], [400, -420 + tw], [360, -540 + tw2], [430, -620 + tw2 * .6]];
  for (let i = 0; i < tail.length - 1; i++) ttube(g, tail[i][0], tail[i][1], tail[i + 1][0], tail[i + 1][1], 64 - i * 9, 56 - i * 9, '#4a8a4a', 5);
  for (let i = 0; i < 4; i++) { const [x0, y0] = tail[i], [x1, y1] = tail[i + 1]; for (let k = 1; k < 4; k++) tln(g, [lerp(x0, x1, k / 4) - 14, lerp(y0, y1, k / 4), lerp(x0, x1, k / 4) + 14, lerp(y0, y1, k / 4) + 6], 3, 'rgba(20,50,20,.5)'); }
  g.save(); g.translate(tail[4][0], tail[4][1]); g.rotate(-.5 + Math.sin(T * 2 + ph) * .2); tsh(g, 'M-40 10 C-50 -40 30 -60 80 -30 C100 -16 96 10 70 18 C30 30 -30 34 -40 10 Z', '#4a8a4a', 5); tell(g, 30, -24, 9, 7, '#ffe040', 3); tell(g, 32, -24, 2.5, 6, '#140c08', 0);
  const tg = (Math.sin(T * 6 + ph) > .3) ? 1 : 0; if (tg) tln(g, [92, 4, 130, 0, 144, -10, 130, 0, 144, 10], 3.4, '#d23a3a'); g.restore();
  // far legs (tiger), then body (tanuki), then near legs
  const gait = a.walk ? T * 6 : 0, L = (x, ph2, near) => { const sw = a.walk ? Math.sin(gait + ph2) * .35 : (a.crouch ? .15 : 0); g.save(); g.translate(x, -200); g.rotate(sw);
    ttube(g, 0, 0, 0, 120, 62, 50, near ? '#e8962e' : '#c87a22', 5); ttube(g, 0, 120, 6, 196, 50, 44, near ? '#e8962e' : '#c87a22', 5);
    for (let k = 0; k < 3; k++) tsh(g, `M-26 ${30 + k * 56} Q0 ${44 + k * 56} 26 ${26 + k * 56} L22 ${38 + k * 56} Q0 ${54 + k * 56} -24 ${42 + k * 56} Z`, '#1a1210', 0);
    tsh(g, 'M-34 186 Q6 176 40 190 L44 208 L-38 208 Z', '#f4efe2', 4); [-22, 0, 22].forEach(cx => tsh(g, `M${cx - 6} 206 L${cx} 222 L${cx + 6} 206 Z`, '#fbf6ea', 2.4)); g.restore(); };
  L(150, 1.6, false); L(-150, 0, false);
  g.save(); g.translate(0, -300); g.scale(1, 1 + br);
  const body = 'M-250 40 C-280 -110 -120 -190 40 -180 C200 -170 300 -90 290 30 C280 130 120 160 -20 150 C-160 140 -240 120 -250 40 Z';
  tsh(g, body, '#7a5a3a', 6); g.save(); g.clip(path(body)); g.fillStyle = '#5a4028'; g.beginPath(); g.ellipse(40, -150, 260, 70, 0, 0, 7); g.fill(); g.fillStyle = '#b8946a'; g.beginPath(); g.ellipse(-20, 140, 230, 70, 0, 0, 7); g.fill();
  const r = rng(91); for (let i = 0; i < 26; i++) { const x = -220 + r() * 460, y = -120 + r() * 230; tln(g, [x, y, x + 10, y + 16, x + 22, y + 20], 3.4, 'rgba(40,25,10,.4)'); } g.restore(); tsh(g, body, null, 6);
  let tuft = ''; for (let i = 0; i <= 16; i++) { const q = i / 16, x = lerp(-230, 270, q), y = -160 + Math.sin(q * Math.PI) * -24 + (i % 2 ? -26 : 0); tuft += (i ? ' L' : 'M') + `${x} ${y}`; } tln(g, tuft.replace(/[ML]/g, '').trim().split(/\s+/).map(Number), 5, '#5a4028'); g.restore();
  L(110, 3.2, true); L(-190, 1.0, true);
  // monkey head: red face in a ruff of grey-brown fur, glaring
  g.save(); g.translate(-300, -470); g.rotate((a.headTilt || 0) + Math.sin(T * 1.4 + ph) * .04);
  let ruff = 'M0 -170'; for (let i = 1; i <= 22; i++) { const an = -Math.PI / 2 + i / 22 * Math.PI * 2, rr = i % 2 ? 196 : 160; ruff += ` L${Math.cos(an) * rr} ${Math.sin(an) * rr * .95}`; } tsh(g, ruff + ' Z', '#8a7a68', 5);
  tsh(g, 'M-110 -20 C-120 -130 110 -130 110 -20 C110 70 60 120 0 120 C-60 120 -110 70 -110 -20 Z', '#d0503e', 5);
  tsh(g, 'M-120 -70 Q-60 -100 0 -76 Q60 -100 120 -70 Q60 -60 0 -50 Q-60 -60 -120 -70 Z', '#a8382c', 0);
  [-1, 1].forEach(sd => { const ex = sd * 48, ey = -30; if (a.glowEyes) glow(g, ex, ey, 90, 'rgba(255,220,60,1)', a.glowEyes); tell(g, ex, ey, 26, 20, '#ffe040', 4); tell(g, ex + (a.look || 0) * 6, ey, 8, 16, '#140c08', 0);
    tln(g, [ex - 30 * sd, ey - 34, ex + 26 * sd, ey - 22], 8, '#3a1410'); });
  tsh(g, 'M-14 6 L14 6 L8 30 L-8 30 Z', '#8a2a20', 3);
  const mo = .25 + sh * .75; tsh(g, `M-50 56 Q0 ${46 + mo * 6} 50 56 Q36 ${66 + mo * 50} 0 ${70 + mo * 56} Q-36 ${66 + mo * 50} -50 56 Z`, '#3a0a10', 5);
  [-1, 1].forEach(sd => tsh(g, `M${sd * 38 - 8} 58 L${sd * 38 + 8} 58 L${sd * 34} ${86 + mo * 10} Z`, '#fbf6ea', 3));
  if (a.sil && a.glowEyes) { g.filter = 'none'; [-1, 1].forEach(sd => { glow(g, sd * 48, -30, 160, 'rgba(255,220,60,1)', a.glowEyes); tell(g, sd * 48, -30, 26 * a.glowEyes, 20 * a.glowEyes, '#ffe040', 0); tell(g, sd * 48, -30, 8, 16 * a.glowEyes, '#140c08', 0); }); g.filter = `brightness(${a.sil})`; }
  g.restore();
  if (a.arrowIn) { g.save(); g.translate(-60, -420); g.rotate(-2.4); tln(g, [0, 0, 220, 0], 10); tln(g, [0, 0, 220, 0], 5, '#c8a878'); g.translate(220, 0); [-1, 1].forEach(sd => tsh(g, `M0 0 L-40 ${sd * 16} L-50 0 Z`, '#f4efe2', 3)); g.restore(); }
  g.filter = 'none'; g.restore(); }
JPA.nue = (g, A, c) => nueDraw(g, A, c);

// ---------- the black cloud: roiling dark puffs, violet lightning inside, maybe eyes ----------
JPA.blackCloud = (g, A, c) => { const T = c.T, s = A.s || 1, r = rng(A.seed || 93); g.save(); g.translate(A.x, A.y); g.scale(s, s);
  glow(g, 0, 0, 900, 'rgba(90,40,140,1)', .35 + .15 * Math.sin(T * 2));
  for (let i = 0; i < 26; i++) { const an = r() * 6.28, d = r() * 360, x = Math.cos(an) * d * 1.5 + Math.sin(T * .6 + i) * 30, y = Math.sin(an) * d * .55 + Math.cos(T * .5 + i) * 20, rr = 130 + r() * 120;
    ell(g, x, y, rr, rr * .7, i % 3 ? 'rgba(12,8,20,.85)' : 'rgba(28,18,40,.85)'); }
  const fl = Math.sin(T * 7.3) > .82 || Math.sin(T * 3.1 + 1) > .93; if (fl && A.lightning !== false) { let x = (r() - .5) * 300, y = -120; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (Math.sin(T * 40 + k) ) * 60; y += 50; g.lineTo(x, y); } g.lineWidth = 6; g.strokeStyle = 'rgba(210,170,255,.9)'; g.stroke(); glow(g, x, y, 300, 'rgba(190,140,255,1)', .5); }
  if (A.eyes) { const k = A.eyes; [-1, 1].forEach(sd => { glow(g, sd * 70, 10, 140, 'rgba(255,220,60,1)', .8 * k); tell(g, sd * 70, 10, 34 * k, 22 * k, '#ffe040', 0); tell(g, sd * 70, 10, 8 * k, 18 * k, '#140c08', 0); }); }
  g.restore(); };

// ---------- the viewer's comment, as it looked in the app ----------
JPA.comment = (g, A, c) => { const k = clamp((c.lt - (A.t0 || 0)) / .35); if (k <= 0) return; const out = A.t1 != null ? clamp((c.lt - A.t1) / .3) : 0; if (out >= 1) return;
  g.save(); g.translate(A.x, A.y + (1 - eo(k)) * 60); g.scale(A.s || 1, A.s || 1); g.globalAlpha = eo(k) * (1 - out); g.rotate(A.rot || -.02);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.roundRect(-414, -96, 840, 210, 36); g.fill();
  g.fillStyle = '#1e1e22'; g.beginPath(); g.roundRect(-420, -110, 840, 210, 36); g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.18)'; g.stroke();
  ell(g, -330, -10, 54, 54, '#4a4a56'); ell(g, -330, -28, 20, 20, '#9a9aa8'); g.save(); g.beginPath(); g.arc(-330, -10, 54, 0, 7); g.clip(); ell(g, -330, 40, 40, 30, '#9a9aa8'); g.restore();
  g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = "900 34px Nunito"; g.fillStyle = '#9a9aa6'; g.fillText(A.who || 'a viewer', -250, -54);
  g.font = "900 52px Nunito"; g.fillStyle = '#f6f6f8'; g.fillText(A.text || 'Can you do Nue?', -250, 6); g.font = "900 28px Nunito"; g.fillStyle = '#7a7a86'; g.fillText('Reply', -250, 66);
  g.lineWidth = 5; g.strokeStyle = '#cfcfd6'; g.beginPath(); g.moveTo(330, 0); g.bezierCurveTo(300, -34, 262, 0, 330, 44); g.bezierCurveTo(398, 0, 360, -34, 330, 0); g.stroke();
  if (A.like) { const lk = clamp((c.lt - A.like) / .25); if (lk > 0) { g.fillStyle = '#ff3a5a'; g.save(); g.translate(330, 10); g.scale(eo(lk) * 1.1, eo(lk) * 1.1); g.translate(-330, -10); g.beginPath(); g.moveTo(330, 0); g.bezierCurveTo(300, -34, 262, 0, 330, 44); g.bezierCurveTo(398, 0, 360, -34, 330, 0); g.fill(); g.restore(); } }
  g.restore(); };

// ---------- the night thrush that still carries the name ----------
JPA.thrush = (g, A, c) => { const T = c.T, sing = A.sing ? (Math.sin(T * 1.6) > .2 ? 1 : 0) : 0; g.save(); g.translate(A.x, A.y); g.scale((A.flip ? -1 : 1) * (A.s || 1), A.s || 1);
  line(g, [-260, 40, 260, 30], 16, '#2a1e16', 'round'); tsh(g, 'M-30 30 L-150 110 L-120 120 L-10 50 Z', '#6a4e24', 4);
  const BD = 'M-60 30 C-90 -30 -40 -110 20 -110 C60 -110 70 -60 60 -20 C50 20 20 40 -60 30 Z'; tsh(g, BD, '#b8944a', 5);
  const r = rng(95); g.save(); g.clip(path(BD)); for (let i = 0; i < 40; i++) tsh(g, `M${-100 + r() * 200} ${-80 + r() * 120} q8 6 16 0`, null, 2.4, '#3a2810'); g.restore();
  tell(g, 40, -120, 32, 30, '#b8944a', 5); tell(g, 52, -126, 6, 6, '#140c08', 0); tell(g, 54, -128, 2, 2, '#fff', 0); tln(g, [24, -100, 60, -96], 3, 'rgba(60,40,10,.5)');
  tsh(g, `M68 -124 L${112 + sing * 6} -118 L68 ${-112 + sing * 10} Z`, '#2a1e16', 3);
  if (sing) for (let k = 0; k < 3; k++) { const q = ((T * 1.2 + k / 3) % 1); g.save(); g.globalAlpha = (1 - q) * .8; g.lineWidth = 4; g.strokeStyle = '#e8f0ff'; g.beginPath(); g.arc(112, -118, 40 + q * 200, -.6, .6); g.stroke(); g.restore(); }
  g.restore(); };

// ---------- people ----------
Object.assign(TOON, {
  yorimasa: { kind: 'adult', skin: '#e0b088', skinD: '#c48e66', hair: '#d8d4cc', hairHi: '#ffffff', hairStyle: 'heian', top: '#f4efe2', topD: '#d8d0bc', pat: 'clouds', patCol: 'rgba(60,110,90,.35)', collar: '#2a6a5a', trimCol: '#2a6a5a', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#5a3a7a', hakamaD: '#442a5e', belt: '#e8c050', feet: 'straw', wraps: '#f4efe2', eyes: 'adult', iris: '#2a1810', brow: 9, browCol: '#d8d4cc', beard: 'short', jaw: 'square', eboshi: true, h: 1.02 },
  hayata: { kind: 'adult', skin: '#c89068', skinD: '#a87048', hair: '#15121a', hairHi: '#3a3040', hairStyle: 'wild', band: '#c8302a', top: '#3a3a4a', topD: '#2a2a36', pat: 'diamond', patCol: 'rgba(200,200,230,.18)', collar: '#c8302a', trimCol: '#c8302a', trimDot: '#e8c050',
    sleeve: 'kinu', bottom: 'hakama', hakama: '#2a2a34', hakamaD: '#1e1e26', belt: '#c8302a', feet: 'straw', wraps: '#c8b898', eyes: 'adult', iris: '#2a1810', brow: 11, beard: 'stubble', jaw: 'square', armor: '#3a3a4a', rivet: '#c8a040', bulk: 1.2, h: 1.0 },
  konoe: { kind: 'adult', skin: '#f0d4b6', skinD: '#d8b090', hair: '#15121a', hairHi: '#4a4262', hairStyle: 'heian', top: '#f6ecd0', topD: '#e0d2b0', pat: 'clouds', patCol: 'rgba(200,150,60,.4)', collar: '#a8242a', trimCol: '#a8242a', trimDot: '#e8c050',
    sleeve: 'wide', bottom: 'hakama', hakama: '#a8242a', hakamaD: '#86181e', belt: '#e8c050', feet: 'straw', wraps: '#f6ecd0', eyes: 'adult', iris: '#2a1810', brow: 5, jaw: 'round', kanmuri: true, h: .94 },
});

// ---------- the Nue Shrine in Nijo Park today: the little shrine, the pond, the castle wall ----------
JSETS.nueShrine = { light: { x: 1, col: 'rgba(255,245,220,1)', rim: .6, shade: .25 },
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('ns_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1400, [[0, '#3a7ad0'], [.7, '#a8d0f0'], [1, '#e8f4ff']]); x.fillRect(-700, -700, 2480, 3400); for (let i = 0; i < 5; i++) cloudF(x, -300 + i * 460, 480 + (i % 2) * 160, 1.1, 'rgba(255,255,255,.85)', 'rgba(255,255,255,.6)'); })));
    layerAt(g, c, .15, () => blit(g, cacheLayer('ns_far', x => { x.fillStyle = '#8a8478'; x.fillRect(-700, 1180, 2480, 120); for (let i = 0; i < 30; i++) for (let k = 0; k < 3; k++) { x.strokeStyle = 'rgba(60,55,50,.5)'; x.lineWidth = 2; x.strokeRect(-700 + i * 90 + (k % 2) * 45, 1180 + k * 40, 90, 40); }
      sh(x, 'M-700 1180 L1780 1180 L1780 1150 L-700 1150 Z', '#5a5650'); for (let i = 0; i < 9; i++) ell(x, -500 + i * 280, 1150, 150, 110, ['#4a7a3a', '#5a8a44', '#3e6a34'][i % 3]); }, { blur: 1 })));
    layerAt(g, c, .45, () => blit(g, cacheLayer('ns_mid', x => { x.fillStyle = lg(x, 0, 1360, 0, 1560, [[0, '#6a9a7a'], [1, '#3a6a5a']]); x.beginPath(); x.ellipse(260, 1460, 420, 90, 0, 0, 7); x.fill(); x.lineWidth = 10; x.strokeStyle = '#8a8478'; x.stroke();
      for (let i = 0; i < 14; i++) ell(x, 260 + Math.cos(i / 14 * 6.28) * 430, 1460 + Math.sin(i / 14 * 6.28) * 96, 34, 22, '#9a948a', 3, 0, '#5a564e');
      // the small shrine: a red torii, a little hall, a stone marker
      torii(x, 820, 1500, .45); sh(x, 'M700 1500 L940 1500 L940 1380 L700 1380 Z', '#6a4a34'); sh(x, 'M680 1390 Q820 1320 960 1390 L940 1360 L700 1360 Z', '#2a2026'); sh(x, 'M760 1500 L880 1500 L880 1420 L760 1420 Z', '#f4efe2');
      sh(x, 'M560 1520 L620 1520 L616 1360 L564 1360 Z', '#a8a296'); x.fillStyle = '#3a3630'; x.font = "900 34px 'IPAGothic'"; x.textAlign = 'center'; ['鵺', '池'].forEach((ch, i) => x.fillText(ch, 590, 1410 + i * 44)); }, { blur: .4 })));
    layerAt(g, c, .45, () => { for (let i = 0; i < 6; i++) { const q = (T * .3 + i / 6) % 1; ell(g, 160 + i * 40, 1460 + Math.sin(i) * 20, 30 + q * 80, 8 + q * 20, `rgba(230,245,255,${.4 * (1 - q)})`); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('ns_ground', x => { x.fillStyle = lg(x, 0, 1540, 0, 2700, [[0, '#c8b894'], [1, '#8a7a5e']]); x.fillRect(-700, 1540, 2480, 1300); pebbles(x, 1580, 2600, 300, 97, ['#a8987a', '#b8a888', '#8a7a62']); }, { y0: 1500, h: 1300 })));
  },
  front(g, o, c, T) { const r = rng(98); for (let i = 0; i < 14; i++) { const x = ((r() * 1500 + T * 30) % 1500) - 200, y = ((r() * 2000 + T * (50 + r() * 30)) % 2000) - 40; g.save(); g.globalAlpha = .7; sakura(g, x, y, 7 + r() * 4, '#f6c0cc'); g.restore(); } },
  haze(g) { g.fillStyle = 'rgba(255,240,210,.05)'; g.fillRect(0, 0, 1080, 1920); } };
