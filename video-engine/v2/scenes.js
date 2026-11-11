// Scene functions. Each gets c = {t, lt, d, p, ch(k), o}: absolute time, time in shot, shot length,
// progress 0..1, seconds since caption chunk k started (negative before it), and the shot's options.
const SC = {};
const pill = (x, y, text, fill, color, fs = 20, stroke = 'none') => { const w = text.length * fs * .5 + 30; return `<rect x="${f(x - w / 2)}" y="${y - fs * .95}" width="${f(w)}" height="${fs * 1.7}" rx="${fs * .85}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x}" y="${f(y + fs * .28)}" text-anchor="middle" font-size="${fs}" fill="${color}" letter-spacing="1">${text}</text>`; };
const G = (x, y, s, inner, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${(+s).toFixed(3)})">${inner}</g>`;

SC.orbit = c => {
  const k = eo(c.lt / 1.1), y0 = 762, y1 = lerp(762, 480, k);
  let o = space(c.t, { earthTop: 760 }) + G(288, 332 - c.p * 8, .78, station(c.t), -8 + Math.sin(c.t * .3) * 1.5);
  o += `<g stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"><line x1="92" y1="${y0}" x2="92" y2="${f(y1)}" stroke-dasharray="9 8"/><line x1="78" y1="${y0}" x2="106" y2="${y0}"/><line x1="78" y1="${f(y1)}" x2="106" y2="${f(y1)}"/></g>`;
  o += `<text x="112" y="${f((y0 + y1) / 2 + 14)}" class="an" font-size="40" fill="${GOLD}" stroke="#000" stroke-width="6" paint-order="stroke">${Math.round(400 * k)} KM</text>`.replace(`y="${f((y0 + y1) / 2 + 14)}"`, `y="${f(y1 + 46)}"`);
  return o;
};
SC.crew6 = c => {
  let o = interior(c.t, { blur: 1, seed: 8 }) + BG('#0b1020', 'opacity=".35"');
  ['ava', 'teo', 'c3', 'c4', 'c5', 'c6'].forEach((id, i) => {
    const k = pop(c.lt, .05 + i * .11, .34); if (k <= 0) return;
    o += person(id, 108 + (i % 3) * 180, 320 + Math.floor(i / 3) * 205, .58 * k, c.t, { seed: i * 1.7, expr: i % 3 == 1 ? 'smile' : 'neutral' });
    o += G(108 + (i % 3) * 180 + 42, 320 + Math.floor(i / 3) * 205 - 42, pop(c.lt, .16 + i * .11, .3), `<circle r="17" fill="${GOLD}" stroke="#000" stroke-width="3"/><text y="9" text-anchor="middle" class="an" font-size="24" fill="${INK}">${i + 1}</text>`);
  });
  return o;
};
SC.capsules = c => space(c.t, { earthTop: 880, sun: false }) + G(300, 400, 1.08, station(c.t, { hiA: c.lt, hiB: c.lt - .28 }), 6 + Math.sin(c.t * .3) * 1.2);
SC.alarmUnit = c => {
  const on = clamp((c.lt - .25) / .15), fl = on * (.5 + .5 * Math.sin((c.lt - .25) * 22) ** 2);
  let o = interior(c.t, { blur: 1, seed: 11, alert: on * .9 });
  o += `<circle cx="288" cy="420" r="${f(150 + fl * 90)}" fill="url(#gRed)" opacity="${(fl * .9).toFixed(2)}"/>`;
  o += `<circle cx="288" cy="420" r="150" fill="#eef1f5" stroke="#8a97a8" stroke-width="8"/><circle cx="288" cy="420" r="118" fill="#dfe5ec" stroke="#b3bdc9" stroke-width="4"/>`;
  for (let i = 0; i < 12; i++) o += `<rect x="282" y="322" width="12" height="52" rx="6" fill="#8a97a8" transform="rotate(${i * 30} 288 420)"/>`;
  o += `<circle cx="288" cy="420" r="40" fill="${on ? '#ff3b3b' : '#4b5563'}" stroke="#fff" stroke-width="6"/><circle cx="288" cy="420" r="20" fill="#fff" opacity="${(.25 + fl * .7).toFixed(2)}"/>`;
  return G(0, 36, 1, o);
};
SC.alone = c => {
  let o = space(c.t, { earthTop: 610, earthR: 1500 }) + G(288, 330, .3, station(c.t, { alert: 1 }), -12);
  for (let i = 0; i < 3; i++) { const a = ((c.lt * .7 + i / 3) % 1); o += `<circle cx="288" cy="330" r="${f(30 + a * 190)}" fill="none" stroke="${RED}" stroke-width="3" opacity="${(.7 * (1 - a)).toFixed(2)}"/>`; }
  return o;
};
SC.title = c => {
  const a = pop(c.ch(0), 0, .45), b = pop(c.ch(1), 0, .4);
  let o = BG('#060914') + stars(c.t, 70, 3) + `<circle cx="288" cy="1500" r="900" fill="#1d5fbf" opacity=".5" filter="url(#b30)"/><circle cx="288" cy="1560" r="900" fill="url(#gEarth)"/>`;
  o += G(288 + Math.cos(c.t * .5) * 150, 180 + Math.sin(c.t * .5) * 16, .2, station(c.t, { alert: 1 }), 20);
  o += G(288, 392, .5 + .5 * a, `<text text-anchor="middle" class="an" font-size="164" fill="#fff" letter-spacing="4">ORBIT</text>`);
  o += G(288, 500, .5 + .5 * a, `<text text-anchor="middle" class="an" font-size="96" fill="${RED}" letter-spacing="3">EMERGENCY</text>`);
  o += `<rect x="${f(288 - 190 * eo(c.lt / .5))}" y="524" width="${f(380 * eo(c.lt / .5))}" height="6" fill="#fff"/>`;
  if (b > 0) o += G(288, 620, b, `<rect x="-110" y="-44" width="220" height="80" rx="12" fill="${GOLD}"/><text y="18" text-anchor="middle" class="an" font-size="62" fill="${INK}" letter-spacing="3">PART ${EP.part}</text>`, -3);
  return o;
};
SC.ava = c => interior(c.t, { win: 1, seed: 4 }) + person('ava', 268, 500, 2.05, c.t, { expr: c.ch(1) > 0 ? 'determined' : 'neutral', seed: 1, look: [.3, -.2] });
SC.teo = c => {
  const wrench = `<g transform="rotate(${f(-20 + Math.sin(c.t * 3) * 8)})"><rect x="-6" y="-70" width="12" height="80" rx="5" fill="#9aa6b5" stroke="#5d6d80" stroke-width="2"/><path d="M-16 -92 Q-18 -66 0 -64 Q18 -66 16 -92 L7 -92 L7 -78 L-7 -78 L-7 -92Z" fill="#9aa6b5" stroke="#5d6d80" stroke-width="2"/></g>`;
  let o = interior(c.t, { seed: 6 });
  o += `<rect x="336" y="110" width="210" height="230" rx="12" fill="#17202e" stroke="#5d6d80" stroke-width="5"/>`;
  [[RED, 366], [GOLD, 416], [CY, 466], [GREEN, 511]].forEach(([col, x], i) => o += `<path d="M${x} 126 Q${x + 26 * Math.sin(c.t + i)} 220 ${x + 10} 334" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`.replace('M' + x + ' 126', 'M' + x + ' 116'));
  return o + person('teo', 300, 510, 1.95, c.t, { expr: 'smile', seed: 4, arms: { r: [104, 6] }, hold: wrench, look: [-.4, -.1] });
};
SC.biscuitFloat = c => {
  const fl = c.ch(1) > 0 ? eo(c.ch(1) / .6) : 0;
  return interior(c.t, { win: 1, seed: 9 }) + biscuit(lerp(190, 320, eio(c.p)), lerp(520, 430, eio(c.p)) - fl * 24, 2.1 + fl * .2, c.t, { rot: -12 + c.lt * 13 + fl * 16 });
};
SC.alarmGo = c => {
  const hit = c.lt > .12, a = clamp(c.lt / .12), fl = .5 + .5 * Math.sin(c.lt * 16);
  let o = interior(c.t, { alert: a, seed: 4 });
  o += `<circle cx="288" cy="190" r="${f(120 + fl * 60)}" fill="url(#gRed)" opacity="${(a * (.5 + .5 * fl)).toFixed(2)}"/><rect x="238" y="116" width="100" height="40" rx="8" fill="#3d4a5a"/><path d="M252 156 Q252 216 288 216 Q324 216 324 156Z" fill="#ff3b3b" stroke="#fff" stroke-width="4"/>`;
  o += `<path d="M288 186 L${f(288 + Math.cos(c.lt * 9) * 700)} ${f(186 + Math.sin(c.lt * 9) * 700)} L${f(288 + Math.cos(c.lt * 9 + .35) * 700)} ${f(186 + Math.sin(c.lt * 9 + .35) * 700)}Z" fill="#ff5a5a" opacity="${(a * .22).toFixed(2)}"/>`;
  o += person('ava', 170, 520, 1.45, c.t, { expr: hit ? 'shock' : 'neutral', seed: 1, look: [.5, -1], sweat: hit });
  o += person('teo', 420, 560, 1.35, c.t, { expr: hit ? 'shock' : 'smile', seed: 4, look: [-.5, -1] });
  return o + biscuit(96, 850, 1, c.t);
};
function corridor(t, alert) {
  let o = BG('#3d4a5a') + `<polygon points="-200,-200 170,330 170,650 -200,1224" fill="#a9b7c6"/><polygon points="776,-200 406,330 406,650 776,1224" fill="#a9b7c6"/><polygon points="-200,-200 776,-200 406,330 170,330" fill="#cfd8e2"/><polygon points="-200,1224 776,1224 406,650 170,650" fill="#6f7f92"/><rect x="170" y="330" width="236" height="320" fill="#5d6d80"/>`;
  for (let i = 0; i < 5; i++) { const k = (i + 1) / 6, z = k * k; o += `<path d="M${f(lerp(-200, 170, z))} ${f(lerp(-200, 330, z))} L${f(lerp(-200, 170, z))} ${f(lerp(1224, 650, z))} M${f(lerp(776, 406, z))} ${f(lerp(-200, 330, z))} L${f(lerp(776, 406, z))} ${f(lerp(1224, 650, z))}" stroke="#7f8fa3" stroke-width="${f(5 - 3 * k)}" fill="none"/><rect x="${f(lerp(200, 262, z))}" y="${f(lerp(-40, 318, z))}" width="${f(lerp(176, 52, z))}" height="${f(lerp(22, 6, z))}" rx="3" fill="#fff" opacity=".92"/>`; }
  [[RED, 40], [CY, 96], [GREEN, 150]].forEach(([col, x], i) => o += `<line x1="${x - 200}" y1="-200" x2="${178 + i * 7}" y2="330" stroke="${col}" stroke-width="5"/><line x1="${776 - x}" y1="-200" x2="${398 - i * 7}" y2="330" stroke="${col}" stroke-width="5"/>`);
  o += `<line x1="-80" y1="1224" x2="176" y2="650" stroke="#f2c14e" stroke-width="7"/><line x1="656" y1="1224" x2="400" y2="650" stroke="#f2c14e" stroke-width="7"/>`;
  o += `<circle cx="288" cy="490" r="96" fill="#7d8ea2" stroke="#4d5b6c" stroke-width="8"/><circle cx="288" cy="490" r="76" fill="url(#gMetal)"/><circle cx="288" cy="452" r="20" fill="#070b14" stroke="#dfe6ee" stroke-width="3"/><circle cx="288" cy="452" r="15" fill="#ff7a18" opacity="${(.5 + .3 * Math.sin(t * 9)).toFixed(2)}"/><circle cx="288" cy="516" r="30" fill="none" stroke="#e5484d" stroke-width="7"/>`;
  if (alert) o += BG('#ff1a1a', `opacity="${(alert * (.34 + .2 * Math.sin(t * 8) ** 2)).toFixed(2)}" style="mix-blend-mode:multiply"`);
  return o;
}
function personBack(x, y, s, t) {
  const c = CAST.teo, kick = Math.sin(t * 3) * 10;
  return G(x + Math.sin(t * .9) * 5, y, s, `<path d="M-30 170 Q${-46 + kick} 250 ${-34 + kick} 318" stroke="#e3e7ec" stroke-width="36" fill="none" stroke-linecap="round"/><path d="M30 170 Q${46 - kick} 250 ${34 - kick} 318" stroke="#e3e7ec" stroke-width="36" fill="none" stroke-linecap="round"/><ellipse cx="${-34 + kick}" cy="324" rx="24" ry="16" fill="#2b3442"/><ellipse cx="${34 - kick}" cy="324" rx="24" ry="16" fill="#2b3442"/>
  <path d="M-70 96 Q-108 30 -86 -44" stroke="#e3e7ec" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M70 96 Q108 30 86 -44" stroke="#e3e7ec" stroke-width="30" fill="none" stroke-linecap="round"/><circle cx="-86" cy="-48" r="17" fill="${c.skin}"/><circle cx="86" cy="-48" r="17" fill="${c.skin}"/>
  <path d="M-78 200 Q-84 76 -30 62 L30 62 Q84 76 78 200Z" fill="#f1f3f6" stroke="#c3cad3" stroke-width="2"/><path d="M-74 126 L-44 72 M74 126 L44 72" stroke="${c.accent}" stroke-width="11" stroke-linecap="round"/><rect x="-36" y="96" width="72" height="62" rx="10" fill="#d5dbe3" stroke="#9aa5b1" stroke-width="2"/>
  <circle r="54" fill="${c.hair}"/><ellipse cx="-54" cy="4" rx="8" ry="12" fill="${c.skin}"/><ellipse cx="54" cy="4" rx="8" ry="12" fill="${c.skin}"/><path d="M-58 0 Q-60 -78 0 -78 Q60 -78 58 0" fill="none" stroke="#2b3442" stroke-width="7"/><rect x="-70" y="-12" width="18" height="34" rx="8" fill="#2b3442"/>`, Math.sin(t * .7) * 4);
}
SC.follow = c => {
  const k = eio(c.p);
  let o = corridor(c.t, .6) + smoke(c.t, 288, 480, 9, 170, 5, '#c9ced6', .34);
  o += personBack(lerp(250, 288, k), lerp(700, 560, k), lerp(1.25, .62, k), c.t);
  return o + smoke(c.t + 3, 288, 700, 6, 300, 12, '#d7dbe1', .2, 1.8);
};
SC.hatchGlow = c => hatch(c.t, { glow: c.ch(1) > 0 ? lerp(.1, 1, eo(c.ch(1) / .45)) : .1, leak: 1 });
SC.rule1 = c => hatch(c.t, { glow: 1 });
SC.flame = c => {
  const m = c.ch(2) > 0 ? eio(c.ch(2) / .7) : 0, fl = 1 + .06 * Math.sin(c.t * 14) + .04 * Math.sin(c.t * 23), sk = Math.sin(c.t * 6) * 3;
  let o = BG('#0a0f1e') + `<g opacity="${m.toFixed(2)}">${stars(c.t, 80, 5)}</g><g opacity="${(1 - m).toFixed(2)}"><rect x="-200" y="640" width="976" height="600" fill="#151c2e"/><rect x="-200" y="640" width="976" height="6" fill="#26304a"/></g>`;
  const cy = lerp(0, -40, m) + Math.sin(c.t * .8) * 6 * m;
  o += `<g transform="translate(0 ${f(cy)}) rotate(${f(m * 8)} 288 560)"><rect x="258" y="470" width="60" height="170" rx="8" fill="#f1ead8" stroke="#cfc6ae" stroke-width="3"/><path d="M258 492 Q270 510 266 530" stroke="#dcd3bb" stroke-width="6" fill="none"/><line x1="288" y1="470" x2="288" y2="448" stroke="#2a2a2a" stroke-width="4"/>`;
  if (m < 1) o += `<g opacity="${(1 - m).toFixed(2)}" transform="translate(288 456) scale(${f(1 - m * .4)} ${(fl * (1 - m * .6)).toFixed(3)}) skewX(${f(sk)})"><path d="M0 0 Q-50 -52 -24 -116 Q-6 -166 0 -198 Q6 -166 24 -116 Q50 -52 0 0Z" fill="#ffb02e" opacity=".35" filter="url(#b12)"/><path d="M0 0 Q-44 -50 -22 -110 Q-6 -160 0 -190 Q6 -160 22 -110 Q44 -50 0 0Z" fill="url(#gFlame)"/><path d="M0 -6 Q-18 -34 -8 -70 Q0 -92 0 -104 Q0 -92 8 -70 Q18 -34 0 -6Z" fill="#fff6c9" opacity=".8"/></g>`;
  if (m > 0) o += G(288, 410, m, blueFlame(c.t, 0, 0, 62, m));
  o += `</g>`;
  for (let i = 0; i < 3; i++) { const a = ((c.t * .9 + i / 3) % 1), x = 208 + i * 80; o += `<g opacity="${((1 - m) * Math.sin(a * Math.PI) * .9).toFixed(2)}" transform="translate(${x} ${f(250 - a * 120)})"><path d="M0 40 L0 0 M-12 14 L0 0 L12 14" stroke="#ffd27a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  o += m < .5 ? G(288, 760 + 0, pop(c.lt, .1), pill(0, 0, 'EARTH · GRAVITY', '#2a2110', GOLD, 24, GOLD)) : G(288, 760, pop(c.ch(2), .35), pill(0, 0, 'ORBIT · ZERO GRAVITY', '#0c2233', CY, 24, CY));
  return o;
};
SC.smokeDrift = c => {
  const R = lerp(50, 300, eo(c.lt / (c.d * .8))) + (c.ch(3) > 0 ? eo(c.ch(3) / .4) * 260 : 0), r = rng(31);
  let o = BG('#0a0f1e') + `<rect x="30" y="200" width="516" height="430" rx="70" fill="#c5cfda" stroke="#8a9bb0" stroke-width="8"/><rect x="52" y="222" width="472" height="386" rx="52" fill="#dbe3eb"/>`;
  for (let i = 0; i < 6; i++) o += `<rect x="${70 + i * 76}" y="232" width="60" height="14" rx="7" fill="#b3c0ce"/><rect x="${70 + i * 76}" y="584" width="60" height="14" rx="7" fill="#b3c0ce"/>`;
  o += person('ava', 150, 380, .52, c.t, { expr: 'worry', seed: 1 }) + person('c3', 280, 420, .5, c.t, { expr: 'worry', seed: 3 }) + person('c4', 210, 500, .5, c.t, { expr: 'shock', seed: 5, body: 0 });
  o += `<clipPath id="cM"><rect x="52" y="222" width="472" height="386" rx="52"/></clipPath><g clip-path="${c.ch(3) > 0 ? '' : 'url(#cM)'}">`;
  for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R, w = .5 + r(); o += `<circle cx="${f(470 + Math.cos(a + c.t * .2 * w) * d)}" cy="${f(414 + Math.sin(a + c.t * .2 * w) * d)}" r="${f(26 + r() * 40 + R * .06)}" fill="#7f8792" opacity="${(.2 + r() * .16).toFixed(2)}"/>`; }
  o += `</g><circle cx="470" cy="414" r="16" fill="#ff7a18"/><circle cx="470" cy="414" r="8" fill="#ffd27a"/>`;
  if (c.ch(1) > 0) { const k = pop(c.ch(1)); o += G(470, 300, k, `<path d="M0 60 L0 -40 M-22 -14 L0 -40 L22 -14" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path d="M-30 -20 L30 40 M30 -20 L-30 40" stroke="${RED}" stroke-width="12" stroke-linecap="round"/>`); }
  return o;
};
// Station plan (blueprint). stage 1 = fire, 2 = blocked route.
function plan(c, stage) {
  const t = c.t, S = '#7fb2ff', mod = (y, h, w, label, hot) => `<rect x="${288 - w / 2}" y="${y}" width="${w}" height="${h}" rx="18" fill="${hot ? '#4a0d16' : '#0d2150'}" stroke="${hot ? RED : S}" stroke-width="4"/><text x="${288 + w / 2 + 14}" y="${y + h / 2 + 8}" font-size="22" fill="${hot ? RED : S}" letter-spacing="1">${label}</text>`;
  const bell = (y, dir, hi, label) => `<g transform="translate(288 ${y}) scale(1 ${dir})"><path d="M-44 0 L-44 -34 Q-38 -74 0 -80 Q38 -74 44 -34 L44 0Z" fill="${hi ? '#3a2c06' : '#0d2150'}" stroke="${hi ? GOLD : S}" stroke-width="4"/></g><text x="346" y="${y + dir * -32 + 8}" font-size="22" fill="${hi ? GOLD : S}" letter-spacing="1">${label}</text>`;
  let o = blueprint(t) + `<line x1="60" y1="356" x2="516" y2="356" stroke="#2b4a8f" stroke-width="10"/>` + [60, 110, 420, 470].map(x => `<rect x="${x}" y="296" width="40" height="120" fill="#12306e" stroke="#2b4a8f" stroke-width="2"/>`).join('');
  const hiB = stage == 2 && c.ch(2) > 0;
  o += bell(190, 1, 0, 'CAPSULE A') + mod(196, 100, 120, 'LAB') + mod(302, 108, 170, 'HUB') + mod(416, 96, 120, 'SERVICE', 1) + bell(518, -1, hiB, 'CAPSULE B');
  const fl = .5 + .5 * Math.sin(t * 9), fk = stage == 1 ? pop(c.lt, .15) : 1;
  o += `<circle cx="288" cy="464" r="${f(52 + fl * 16)}" fill="url(#gRed)" opacity="${(.6 * fk).toFixed(2)}"/>` + G(288, 484, fk * (1 + .08 * fl), `<path d="M0 -44 Q-26 -8 0 14 Q26 -8 0 -44Z" fill="#ff7a18"/><path d="M0 -24 Q-12 -4 0 8 Q12 -4 0 -24Z" fill="#ffd27a"/>`);
  [[250, 240], [320, 262], [232, 340], [288, 366], [344, 338], [300, 318]].forEach(([x, y], i) => { const pu = stage == 2 && c.ch(1) > 0 ? 1 + .5 * Math.max(0, 1 - c.ch(1) / .4) : 1; o += `<circle cx="${f(x + Math.sin(t * 1.2 + i) * 4)}" cy="${f(y + Math.cos(t + i) * 4)}" r="${f(9 * pu)}" fill="#fff" stroke="${S}" stroke-width="2"/>`; });
  if (stage == 2) {
    const dr = eo(c.lt / .6), len = 250;
    o += `<path d="M228 366 L228 600" fill="none" stroke="${GOLD}" stroke-width="5" stroke-dasharray="${len}" stroke-dashoffset="${f(len * (1 - dr))}" opacity=".9"/>`;
    if (dr > .9) o += `<path d="M216 582 L228 600 L240 582" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`;
    if (c.ch(2) > .15) o += G(228, 464, pop(c.ch(2), .15), `<circle r="34" fill="#0a1433" stroke="${RED}" stroke-width="5"/><path d="M-15 -15 L15 15 M15 -15 L-15 15" stroke="${RED}" stroke-width="9" stroke-linecap="round"/>`);
  }
  const rows = stage == 1 ? [[c.ch(1), 'FIRE: SERVICE MODULE', RED]] : [[1, 'FIRE: SERVICE MODULE', RED], [c.ch(2) - .25, 'ROUTE TO CAPSULE B: BLOCKED', GOLD]];
  rows.forEach(([lt, text, col], i) => { if (lt > 0) o += G(288, 790 + i * 54, pop(lt), pill(0, 0, text, '#0a1433', col, 22, col)); });
  return o;
}
SC.mapFire = c => blueprint(c.t) + G(28.8, 44, .9, plan(c, 1));
SC.mapRoute = c => blueprint(c.t) + G(28.8, 44, .9, plan(c, 2));
SC.seats = c => {
  const st = c.o.stage || 1, S = '#7fb2ff'; let o = G(0, -50, 1, blueprint(c.t));
  o += `<path d="M168 420 L168 300 Q176 150 288 132 Q400 150 408 300 L408 420Z" fill="#0d2150" stroke="${GOLD}" stroke-width="5"/><text x="288" y="118" text-anchor="middle" font-size="24" fill="${GOLD}" letter-spacing="2">CAPSULE A</text>`;
  const seatT = c.o.instant ? c.lt - .1 : st == 1 ? c.ch(1) : 1;
  [[232, 330], [288, 280], [344, 330]].forEach(([x, y], i) => { const k = pop(seatT, i * .12, .32); if (k > 0) o += G(x, y, k, `<rect x="-22" y="-34" width="44" height="60" rx="12" fill="${st == 2 ? '#14532d' : '#12306e'}" stroke="${st == 2 ? GREEN : S}" stroke-width="4"/><rect x="-26" y="20" width="52" height="16" rx="8" fill="${st == 2 ? GREEN : S}"/>`); });
  if (st == 2) ['ava', 'teo', 'c3', 'c4', 'c5', 'c6'].forEach((id, i) => {
    const x = 68 + i * 88, k = pop(c.lt, i * .07, .3), bad = i >= 3 && c.ch(1) > 0, sh = bad ? Math.sin(c.ch(1) * 40) * 5 * Math.max(0, 1 - c.ch(1) / .4) : 0;
    if (k <= 0) return;
    o += person(id, x + sh, 540, .42 * k, c.t, { body: 0, float: .4, seed: i, expr: bad ? 'worry' : 'neutral' });
    if (c.ch(1) > 0) o += G(x + 22, 512, pop(c.ch(1), i * .05, .3), bad ? `<circle r="14" fill="${RED}" stroke="#000" stroke-width="2"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` : `<circle r="14" fill="${GREEN}" stroke="#000" stroke-width="2"/><path d="M-7 0 L-2 6 L8 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  });
  if (st == 2 && c.ch(1) > .2) o += G(288, 800, pop(c.ch(1), .2), pill(0, 0, '3 PEOPLE WITHOUT A SEAT', '#3a0b10', RED, 24, RED));
  return G(0, 50, 1, o);
};
const sleeve = (x0, y0, x1, y1, cuff, skin, w = 86) => { const cx = lerp(x0, x1, .8), cy = lerp(y0, y1, .8); return `<path d="M${x0} ${y0} L${f(x1)} ${f(y1)}" stroke="#c3cad3" stroke-width="${w + 6}" stroke-linecap="round"/><path d="M${x0} ${y0} L${f(x1)} ${f(y1)}" stroke="#f1f3f6" stroke-width="${w}" stroke-linecap="round"/><path d="M${f(cx)} ${f(cy)} L${f(x1)} ${f(y1)}" stroke="${cuff}" stroke-width="${w + 2}" stroke-linecap="butt"/><circle cx="${f(x1)}" cy="${f(y1)}" r="${w * .56}" fill="${skin}"/>`; };
SC.reach = c => {
  const k = eo(c.lt / .9), hx = lerp(60, 236, k), hy = lerp(1000, 610, k);
  return hatch(c.t, { glow: 1, turn: c.ch(1) > 0 ? eo(c.ch(1) / .5) * 14 : 0 }) + sleeve(-60, 1150, hx, hy, CAST.teo.accent, CAST.teo.skin) + [0, 1, 2, 3].map(i => `<rect x="${f(hx - 8 + i * 17)}" y="${f(hy - 66 + Math.abs(i - 1.5) * 8)}" width="15" height="44" rx="7.5" fill="${CAST.teo.skin}" stroke="#b98a66" stroke-width="1.5" transform="rotate(24 ${f(hx)} ${f(hy)})"/>`).join('');
};
SC.grab = c => {
  const g = c.ch(1) > 0 ? eo(c.ch(1) / .16) : 0, pre = eo(c.lt / .3), ax = lerp(760, 356, Math.max(g, pre * .25)), ay = lerp(300, 474, Math.max(g, pre * .25)), fl = .85 + .15 * Math.sin(c.t * 11);
  let o = BG('#3d2a1c') + `<circle cx="120" cy="160" r="460" fill="url(#gGlow)" opacity="${(.8 * fl).toFixed(2)}"/><circle cx="60" cy="210" r="250" fill="none" stroke="#3d4a5a" stroke-width="64"/><circle cx="60" cy="210" r="250" fill="none" stroke="#e5484d" stroke-width="44"/>`;
  o += sleeve(-80, 1040, 268, 438, CAST.teo.accent, CAST.teo.skin, 116) + sleeve(760, 180 + (1 - g) * 60, ax, ay, CAST.ava.accent, CAST.ava.skin, 108);
  if (g > 0) { o += [0, 1, 2, 3].map(i => `<rect x="${f(250 + i * 30)}" y="${f(438 + i * 14)}" width="27" height="92" rx="13" fill="${CAST.ava.skin}" stroke="#7d5238" stroke-width="2" transform="rotate(-38 ${f(264 + i * 30)} ${f(484 + i * 14)})"/>`).join('');
    const b = c.ch(1); if (b < .35) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, r0 = 110 + b * 300, r1 = r0 + 60 * (1 - b / .35); o += `<line x1="${f(310 + Math.cos(a) * r0)}" y1="${f(480 + Math.sin(a) * r0)}" x2="${f(310 + Math.cos(a) * r1)}" y2="${f(480 + Math.sin(a) * r1)}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${(1 - b / .35).toFixed(2)}"/>`; } }
  return o;
};
SC.avaNo = c => {
  const a = c.ch(0), b = c.ch(1), talk = (a > 0 && a < .34) ? Math.sin(a / .34 * Math.PI) : (b > 0 && b < .85 ? .35 + .65 * Math.abs(Math.sin(b * 13)) : 0);
  return interior(c.t, { alert: .9, seed: 4, blur: 1 }) + person('ava', 288, 470, 2.5, c.t, { expr: 'determined', talk, seed: 1, float: .5, look: [-.5, 0] });
};
SC.rule2 = c => {
  const t1 = c.ch(1), t2 = c.ch(2), T = .7, spin = t1 > 0 ? c.lt - t1 + (t1 < T ? t1 - t1 * t1 / (2 * T) : T / 2) : c.lt, air = t1 > 0 ? 1 - clamp(t1 / .5) : 1, sz = t2 > 0 ? lerp(1, .22, eo(t2 / .8)) : 1;
  let o = BG('#0a0f1e') + `<rect x="24" y="300" width="528" height="300" rx="30" fill="#111a30" stroke="#26304a" stroke-width="4"/>` + fan(c.t, 128, 450, 62, spin * 620);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { const a = ((c.t * 1.4 + i / 4 + j * .13) % 1), x = 220 + a * 130; o += `<path d="M${f(x)} ${400 + j * 50} l26 0 m-10 -9 l10 9 l-10 9" stroke="${CY}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${(air * Math.sin(a * Math.PI) * .9).toFixed(2)}"/>`; }
  o += G(440, 450, sz, blueFlame(c.t, 0, 0, 54, .5 + .5 * sz));
  if (t1 > 0) o += G(128, 450, pop(t1), `<path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke="${RED}" stroke-width="14" stroke-linecap="round"/>`);
  o += `<text x="128" y="574" text-anchor="middle" font-size="22" fill="#9db4e6" letter-spacing="1">FANS ${t1 > 0 ? 'OFF' : 'ON'}</text><text x="440" y="574" text-anchor="middle" font-size="22" fill="${t2 > 0 ? GREEN : '#9db4e6'}" letter-spacing="1">${t2 > .4 ? 'FIRE SHRINKS' : 'FIRE FED'}</text>`;
  return o;
};
SC.fanDown = c => {
  const T = c.d * .9, lt = Math.min(c.lt, T), ang = 1100 * (lt - lt * lt / (2 * T)), sp = 1 - lt / T;
  let o = interior(c.t, { seed: 13, blur: 1, alert: .5 }) + fan(c.t, 288, 430, 176, ang);
  for (let i = 0; i < 7; i++) { const a = ((c.t * 1.8 + i / 7) % 1); o += `<line x1="${f(40 + i * 82)}" y1="${f(700 + a * 200)}" x2="${f(40 + i * 82)}" y2="${f(740 + a * 200)}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${(sp * Math.sin(a * Math.PI) * .5).toFixed(2)}"/>`; }
  return o + biscuit(lerp(90, 130, eo(c.p)), 860, 1.3, c.t, { rot: 10 + 30 * eo(c.p), spin: sp });
};
SC.silence = c => {
  const near = c.o.near || 0, lk = near && c.lt > .25 ? [1, -.1] : [0, -.3];
  let o = interior(c.t * .15, { seed: 4, dark: .62, win: 1 });
  o += person('ava', near ? 170 : 200, near ? 500 : 520, near ? 1.7 : 1.15, c.t * .3, { expr: 'worry', seed: 1, float: .5, look: lk });
  o += person('teo', near ? 420 : 380, near ? 540 : 560, near ? 1.6 : 1.08, c.t * .3, { expr: near ? 'shock' : 'worry', seed: 4, float: .5, look: lk, sweat: near });
  if (!near) o += biscuit(110, 800, .9, 2, { spin: 0, rot: 24 });
  return o + BG('#0a1433', 'opacity=".25"');
};
SC.hiss = c => {
  const v = Math.sin(c.t * 70) * 2, k = eo(c.lt / .2), drop = lerp(101.3, 97.2, clamp(c.lt / c.d)), r = rng(5);
  let o = G(v, 0, 1, interior(c.t, { seed: 17, dark: .5 }));
  o += `<path d="M300 380 L322 430 L304 470 L330 520 L312 580" fill="none" stroke="#05070c" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M300 380 L322 430 L304 470 L330 520 L312 580" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>`;
  for (let i = 0; i < 26; i++) { const a = ((c.t * (2.5 + r() * 2) + r()) % 1), y0 = 390 + r() * 180, ang = (r() - .5) * .9, len = 60 + r() * 110, d0 = a * 330 * k; o += `<line x1="${f(318 - Math.cos(ang) * d0)}" y1="${f(y0 + Math.sin(ang) * d0)}" x2="${f(318 - Math.cos(ang) * (d0 + len))}" y2="${f(y0 + Math.sin(ang) * (d0 + len))}" stroke="#fff" stroke-width="${f(2 + r() * 4)}" stroke-linecap="round" opacity="${((1 - a) * .85).toFixed(2)}"/>`; }
  if (!c.o.noGauge) o += `<rect x="136" y="156" width="304" height="150" rx="16" fill="#0b1020" stroke="${RED}" stroke-width="4" opacity="${k}"/><text x="288" y="194" text-anchor="middle" font-size="22" fill="#9aa5b8" letter-spacing="2" opacity="${k}">CABIN PRESSURE</text><text x="288" y="272" text-anchor="middle" class="an" font-size="72" fill="${Math.sin(c.t * 12) > 0 ? RED : '#fff'}" opacity="${k}">${drop.toFixed(1)} kPa</text>`;
  return o;
};
SC.card = c => {
  const e = c.o.card, a = pop(c.lt, .05), b = pop(c.lt, .3), q = pop(c.ch(0), 0), fo = pop(c.ch(1), 0);
  let o = BG('#070b14') + stars(c.t, 60, 9) + `<circle cx="288" cy="1620" r="900" fill="url(#gEarth)" opacity=".8"/>`;
  o += `<text x="288" y="206" text-anchor="middle" font-size="26" fill="#9aa5b8" letter-spacing="4">${e.series}</text>` + G(288, 390, a, `<text text-anchor="middle" class="an" font-size="140" fill="#fff" letter-spacing="4">PART ${e.next}</text>`);
  o += `<rect x="${f(288 - 120 * b)}" y="420" width="${f(240 * b)}" height="6" fill="${RED}"/>` + G(288, 492, b, `<text text-anchor="middle" class="an" font-size="52" fill="${CY}" letter-spacing="3">${e.title}</text>`);
  if (q > 0) o += G(288, 610, q, `<text text-anchor="middle" class="an" font-size="50" fill="#fff" letter-spacing="1"><tspan x="0">${e.q1}</tspan><tspan x="0" dy="60">${e.q2}</tspan></text>`);
  if (fo > 0) o += G(288, 780, fo, pill(0, 0, e.follow, GOLD, INK, 30));
  return o + `<text x="288" y="880" text-anchor="middle" font-size="18" fill="#6b7587" letter-spacing="2">STORY = FICTION · FACTS = REAL</text>`;
};
