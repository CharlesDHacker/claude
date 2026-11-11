// Part 2 scenes ("The Hiss"). Same conventions as scenes.js; c.che(k) = seconds since chunk k finished being spoken.
const badge = (n, col = GOLD) => `<circle r="17" fill="${col}" stroke="#000" stroke-width="3"/><text y="9" text-anchor="middle" class="an" font-size="24" fill="${INK}">${n}</text>`;
const yearStamp = (c, y) => G(40, 318, pop(c.lt, .05), `<text class="an" font-size="96" fill="#fff" stroke="#000" stroke-width="9" paint-order="stroke" letter-spacing="3">${y}</text>`, -3);

SC.pressure = c => {
  const st = c.o.stable, v = st ? 96.4 : Math.max(101.3 - c.lt * 1.5, 95), col = st ? GREEN : RED, D = Math.PI / 180;
  let o = interior(c.t, { blur: 1, seed: 17, dark: .5 });
  if (!st) for (let i = 0; i < 9; i++) { const a = ((c.t * 1.7 + i / 9) % 1); o += `<line x1="${f(-60 + a * 700)}" y1="${170 + i * 84}" x2="${f(40 + a * 700)}" y2="${170 + i * 84}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${(Math.sin(a * Math.PI) * .3).toFixed(2)}"/>`; }
  o += `<circle cx="288" cy="440" r="198" fill="#0b1020" stroke="#8a97a8" stroke-width="10"/>`;
  for (let i = 0; i <= 12; i++) { const a = lerp(-210, 30, i / 12) * D, r0 = i % 2 ? 150 : 136; o += `<line x1="${f(288 + Math.cos(a) * r0)}" y1="${f(440 + Math.sin(a) * r0)}" x2="${f(288 + Math.cos(a) * 168)}" y2="${f(440 + Math.sin(a) * 168)}" stroke="${i >= 10 ? GREEN : i >= 8 ? GOLD : RED}" stroke-width="${i % 2 ? 4 : 7}" stroke-linecap="round"/>`; }
  const na = (lerp(-210, 30, v / 120) + (st ? 0 : Math.sin(c.t * 30) * 1.4)) * D;
  o += `<line x1="288" y1="440" x2="${f(288 + Math.cos(na) * 138)}" y2="${f(440 + Math.sin(na) * 138)}" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="288" cy="440" r="16" fill="#dfe6ee"/>`;
  o += `<text x="288" y="378" text-anchor="middle" font-size="20" fill="#9aa5b8" letter-spacing="2">CABIN PRESSURE</text><text x="288" y="556" text-anchor="middle" class="an" font-size="56" fill="${st || Math.sin(c.t * 12) > 0 ? col : '#fff'}">${v.toFixed(1)} kPa</text>`;
  if (st && c.ch(1) > 0) o += G(288, 800, pop(c.ch(1)), pill(0, 0, 'LEAK SEALED', '#0d2b1c', GREEN, 26, GREEN));
  return o;
};
SC.math = c => {
  const b = c.ch(1), k = pop(c.lt, .05);
  let o = interior(c.t, { seed: 6, alert: .45 }) + person('teo', 288, 540, 1.85, c.t, { expr: 'worry', seed: 4, sweat: 1, look: [0, -.7] });
  const rows = ['LEAK RATE  ' + (1.2 + .4 * Math.abs(Math.sin(c.t * 9))).toFixed(2) + ' kPa/min', 'SAFE LIMIT  ' + (68 + Math.floor(c.t * 20) % 9) + ' kPa', 'TIME LEFT  ...'];
  const inner = b > 0 ? `<text y="-44" text-anchor="middle" font-size="24" fill="#9aa5b8" letter-spacing="3">AIR LEFT</text><g transform="scale(${(1 + .3 * Math.max(0, 1 - b / .2)).toFixed(3)})"><text y="54" text-anchor="middle" class="an" font-size="104" fill="${RED}" letter-spacing="4">11:00</text></g>` : rows.map((r, i) => `<text x="-170" y="${-34 + i * 44}" font-size="27" font-weight="700" fill="${CY}" letter-spacing="1">${r}</text>`).join('');
  return o + G(288, 262, k, `<rect x="-200" y="-92" width="400" height="184" rx="16" fill="#0b1020" stroke="${b > 0 ? RED : CY}" stroke-width="4"/>` + inner);
};
SC.crew2 = c => {
  const lk = c.o.scan ? [Math.sin(c.t * 2.4), Math.cos(c.t * 1.9) * .6] : [0, 0];
  return interior(c.t, { seed: 4, alert: c.o.alert ?? .4, dark: c.o.dark ?? .25, win: 1 }) + person('ava', 180, 540, 1.5, c.t, { expr: c.o.a || 'determined', seed: 1, look: lk }) + person('teo', 410, 580, 1.4, c.t, { expr: c.o.b || 'worry', seed: 4, look: [-lk[0], lk[1]] });
};
SC.invisible = c => {
  let o = interior(c.t, { seed: 15, dark: .35 });
  [[130, 300], [420, 250], [300, 470], [110, 570], [460, 550]].forEach(([x, y], i) => { const k = pop(c.lt, .1 + i * .16, .3); if (k > 0) o += G(x, y, k, `<circle r="52" fill="#0b1020" opacity=".55"/><circle r="52" fill="none" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 9" transform="rotate(${f(c.t * 40)})"/><text y="27" text-anchor="middle" class="an" font-size="76" fill="${GOLD}">?</text>`); });
  return o;
};
SC.tea = c => {
  const st = c.o.stage || 1, r = rng(77), cx = 500, cy = 330;
  let o = interior(c.t, { seed: 19, dark: .3, blur: 1 });
  if (st == 1) o += yearStamp(c, 2020);
  if (st == 2) o += `<path d="M${cx} ${cy - 44} l10 28 l-12 24 l14 32" fill="none" stroke="#05070c" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bx = st == 1 ? 230 : 130 - c.lt * 16, by = st == 1 ? 480 : 540;
  o += G(bx, by + Math.sin(c.t) * 8, st == 1 ? 1.5 : 1.1, `<path d="M0 -64 Q30 -108 60 -120" fill="none" stroke="#fff" stroke-width="3"/><rect x="50" y="-140" width="32" height="26" rx="3" fill="${GREEN}"/><path d="M-40 -64 L40 -64 L48 50 L-48 50Z" fill="#efe6cf" stroke="#b9ad90" stroke-width="3"/><path d="M-30 -20 Q0 -4 30 -20 L36 36 L-36 36Z" fill="#6b4a2b" opacity=".75"/>`, Math.sin(c.t * .8) * 8 - 10);
  const out = st == 1 ? (c.ch(3) > 0 ? eo(c.ch(3) / .8) : 0) : 1, pull = st == 2 ? c.ch(1) : -1;
  for (let i = 0; i < 46; i++) {
    const a = r() * TAU, d = 40 + r() * (st == 1 ? 170 : 230), w = .5 + r(), del = r() * .9, sz = 5 + r() * 6, jx = (r() - .5) * 16, jy = (r() - .5) * 34;
    let x = (st == 1 ? bx : 270) + Math.cos(a + c.t * .3 * w) * d * out, y = (st == 1 ? by - 20 : 470) + Math.sin(a + c.t * .25 * w) * d * out * (st == 2 ? 1.15 : 1);
    if (pull > 0) { const k = eio((pull - del) / 1.3); x = lerp(x, cx + jx, k); y = lerp(y, cy + jy, k); }
    if (out > 0) o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sz)}" ry="${f(sz * .5)}" fill="${i % 3 ? '#5b7a2e' : '#7a5a2b'}" stroke="#000" stroke-width=".8" transform="rotate(${f(c.t * 60 * w + i * 40)} ${f(x)} ${f(y)})"/>`;
  }
  if (st == 2 && c.ch(2) > 0) o += G(cx, cy, pop(c.ch(2), .1), `<circle r="60" fill="none" stroke="${GOLD}" stroke-width="6"/>` + pill(0, 98, 'LEAK', GOLD, INK, 26));
  return o;
};
SC.avaBiscuit = c => {
  const b = c.ch(1), k = b > 0 ? pop(b, 0, .45) : 0;
  let o = interior(c.t, { win: 1, seed: 4, alert: .35 }) + person('ava', 220, 500, 1.9, c.t, { expr: b > 0 ? 'smile' : 'worry', seed: 1, look: b > 0 ? [.8, .5] : [0, 0], arms: b > 0 ? { r: [118, 66] } : null });
  if (k > 0) o += biscuit(446, lerp(800, 560, Math.min(k, 1.05)), 1.9, c.t, { rot: -8 });
  return o;
};
SC.drift = c => {
  const P = p => lerp(84, 500, Math.pow(Math.max(p, 0), 2.3)), fast = c.ch(2) > 0 ? clamp(c.ch(2) / .4) : 0;
  let o = interior(c.t, { seed: 23, alert: .35, blur: 1 });
  for (let i = 0; i < 9; i++) { const a = ((c.t * 2.2 + i / 9) % 1); o += `<line x1="${f(-40 + a * 700)}" y1="${200 + i * 62}" x2="${f(60 + a * 700)}" y2="${200 + i * 62}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${(fast * Math.sin(a * Math.PI) * .5).toFixed(2)}"/>`; }
  for (let i = 6; i > 0; i--) o += `<circle cx="${f(P(c.p - i * .04))}" cy="470" r="${f(60 - i * 6)}" fill="#d9a066" opacity="${(.24 - i * .03).toFixed(2)}"/>`;
  return o + biscuit(P(c.p), 470 + Math.sin(c.t * 2) * 10, 2, c.t, { rot: -10 + Math.pow(c.p, 2.3) * 70 });
};
SC.corridorBiscuit = c => {
  const k = eo(c.p); let o = corridor(c.t, .6) + smoke(c.t, 288, 480, 8, 170, 5, '#c9ced6', .3);
  for (let i = 0; i < 16; i++) { const r = rng(i + 3), a = r() * TAU, q = ((c.t * 1.6 + r()) % 1), d0 = 440 * (1 - q) + 110; o += `<line x1="${f(288 + Math.cos(a) * (d0 + 70))}" y1="${f(490 + Math.sin(a) * (d0 + 70))}" x2="${f(288 + Math.cos(a) * d0)}" y2="${f(490 + Math.sin(a) * d0)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${(Math.sin(q * Math.PI) * .45).toFixed(2)}"/>`; }
  return o + biscuit(lerp(300, 288, k), lerp(830, 505, k), lerp(2.6, .5, k), c.t, { rot: c.lt * 170 });
};
// Hatch seal close-up. stage 1 = the warped gap sucking air in; stage 2 = taping it shut.
SC.seal = c => {
  const st = c.o.stage || 1, gx = 122, gy = 316, feed = st == 1 && c.ch(2) > 0 ? eo(c.ch(2) / .8) : 0, taped = st == 2 ? c.ch(1) : -1, flow = taped > 0 ? Math.max(0, 1 - taped / .5) : 1, r = rng(9);
  let o = hatch(c.t, { glow: st == 1 ? .75 + .25 * feed : (taped > .6 ? lerp(1, .5, eo((taped - .6) / 1)) : 1) });
  if (feed > 0) o += `<circle cx="288" cy="356" r="${f(190 + feed * 60)}" fill="#ff7a18" opacity="${(feed * .25).toFixed(2)}" filter="url(#b30)"/>`;
  o += `<path d="M94.7 349.2 A228 228 0 0 1 154 285.5" fill="none" stroke="#05070c" stroke-width="13" stroke-linecap="round"/><path d="M94.7 349.2 A228 228 0 0 1 154 285.5" fill="none" stroke="#ff9a2e" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>`;
  for (let i = 0; i < 22; i++) { const a = Math.PI * (.55 + r() * 1.1), len = 50 + r() * 80, sp = 1.5 + r() * 2, ph = r(), w = 2 + r() * 3, q = ((c.t * sp + ph) % 1), d0 = 300 * (1 - q) + 14;
    o += `<line x1="${f(gx + Math.cos(a) * (d0 + len))}" y1="${f(gy + Math.sin(a) * (d0 + len))}" x2="${f(gx + Math.cos(a) * d0)}" y2="${f(gy + Math.sin(a) * d0)}" stroke="#fff" stroke-width="${f(w)}" stroke-linecap="round" opacity="${(flow * q * .8).toFixed(2)}"/>`; }
  if (st == 1) return o + biscuit(gx - 8 + Math.sin(c.t * 50) * 2, gy + 6, 1.05, c.t, { rot: 38, spin: .2 });
  o += biscuit(lerp(gx, 40, eo(c.lt / 1.2)), lerp(gy, 560, eo(c.lt / 1.2)), 1.05, c.t, { rot: 38 + c.lt * 60 });
  [-146, -137, -128].forEach((deg, i) => { const k = pop(taped, i * .15, .28), a = deg * Math.PI / 180; if (k > 0) o += G(288 + Math.cos(a) * 228, 470 + Math.sin(a) * 228, k, `<rect x="-48" y="-14" width="96" height="28" rx="3" fill="#e0a422" stroke="#a87510" stroke-width="2" opacity=".95"/><rect x="-48" y="-14" width="96" height="7" fill="#fff" opacity=".25"/>`, deg + (i - 1) * 7); });
  const hk = eo(c.lt / .5);
  return o + sleeve(-80, 980, lerp(40, 176, hk), lerp(800, 420, hk), CAST.teo.accent, CAST.teo.skin, 92);
};
SC.finger = c => {
  const press = c.ch(3) > 0 ? eo(c.ch(3) / .22) : 0, hx = lerp(540, 363, press), hy = lerp(900, 570, press), r = rng(4);
  let o = BG('#b6c2cf');
  for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) o += `<rect x="${-110 + i * 262}" y="${-60 + j * 262}" width="250" height="250" rx="18" fill="${(i + j) % 2 ? '#c4ced9' : '#bcc7d3'}" stroke="#8a9bb0" stroke-width="3"/>` + [[24, 24], [226, 24], [24, 226], [226, 226]].map(([a, b]) => `<circle cx="${-110 + i * 262 + a}" cy="${-60 + j * 262 + b}" r="6" fill="#8a9bb0"/>`).join('');
  o += `<circle cx="288" cy="440" r="26" fill="#7a8696" opacity=".55"/><circle cx="288" cy="440" r="9" fill="#05070c"/>`;
  for (let i = 0; i < 18; i++) { const a = r() * TAU, sp = 1.6 + r() * 2, q = ((c.t * sp + r()) % 1), d0 = 230 * (1 - q) + 16, len = 40 + r() * 60; o += `<line x1="${f(288 + Math.cos(a) * (d0 + len))}" y1="${f(440 + Math.sin(a) * (d0 + len))}" x2="${f(288 + Math.cos(a) * d0)}" y2="${f(440 + Math.sin(a) * d0)}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity="${((1 - press) * q * .9).toFixed(2)}"/>`; }
  o += G(hx, hy, 1, `<rect x="56" y="60" width="150" height="330" rx="40" fill="#f1f3f6" stroke="#c3cad3" stroke-width="3" transform="rotate(18 100 100)"/><ellipse cx="14" cy="74" rx="84" ry="66" fill="#e3b088" stroke="#b98a66" stroke-width="3"/><rect x="-26" y="-150" width="52" height="176" rx="26" fill="#e3b088" stroke="#b98a66" stroke-width="3"/><rect x="-17" y="-143" width="34" height="30" rx="12" fill="#f6dcc6"/>`, -30);
  if (press > .9) o += G(288, 440, pop(c.ch(3), .2), `<circle r="74" fill="none" stroke="${GREEN}" stroke-width="6"/>`);
  return o + yearStamp(c, 2018) + BG('#1b2a4a', 'opacity=".16"');
};
SC.count = c => {
  const st = c.o.stage || 1, x6 = 468, y6 = 525, miss = st == 2 ? c.ch(1) : -1;
  let o = interior(c.t, { blur: 1, seed: 8 }) + BG('#0b1020', 'opacity=".45"');
  ['ava', 'teo', 'c3', 'c4', 'c5'].forEach((id, i) => { const lt = st == 1 ? c.ch(i + 1) : 1; if (lt <= 0) return; const k = st == 1 ? pop(lt, 0, .3) : 1, x = 108 + (i % 3) * 180, y = 320 + Math.floor(i / 3) * 205; o += person(id, x, y, .58 * k, c.t, { seed: i * 1.7, expr: 'worry' }) + G(x + 42, y - 42, k, badge(i + 1)); });
  o += `<g fill="${miss > 0 ? '#3a0b10' : 'none'}" stroke="${miss > 0 ? RED : '#8fa0b3'}" stroke-width="4" stroke-dasharray="9 8"><circle cx="${x6}" cy="${y6}" r="32"/><path d="M${x6 - 46} ${y6 + 112} Q${x6 - 48} ${y6 + 46} ${x6 - 16} ${y6 + 38} L${x6 + 16} ${y6 + 38} Q${x6 + 48} ${y6 + 46} ${x6 + 46} ${y6 + 112}Z"/></g>`;
  if (miss > 0) o += G(x6, y6, pop(miss) * (1 + .12 * Math.sin(miss * 14)), `<text y="20" text-anchor="middle" class="an" font-size="54" fill="${RED}">?</text>`) + G(x6 + 42, y6 - 42, pop(miss, .1), badge(6, RED)) + G(288, 800, pop(miss, .25), pill(0, 0, 'ONE IS MISSING', '#3a0b10', RED, 28, RED));
  return o;
};
SC.knocks = c => {
  const base = c.che(1); let sh = 0, o2 = '';
  [.12, .46, .8].forEach((tk, i) => { const a = base - tk; if (a < 0) return; sh += Math.exp(-a * 14) * 9 * Math.sin(a * 80);
    if (a < .5) o2 += `<circle cx="288" cy="470" r="${f(70 + a * 520)}" fill="none" stroke="#fff" stroke-width="${f(10 * (1 - a / .5))}" opacity="${(1 - a / .5).toFixed(2)}"/>`;
    if (a < .75) o2 += G([150, 424, 262][i], [310, 372, 610][i], pop(a, 0, .2), `<text text-anchor="middle" class="an" font-size="66" fill="${GOLD}" stroke="#000" stroke-width="9" paint-order="stroke" opacity="${clamp((.75 - a) / .2)}">KNOCK</text>`, [-12, 9, -5][i]); });
  return G(sh, 0, 1, hatch(c.t * .4, { glow: .16 }) + BG('#02040c', 'opacity=".42"')) + o2;
};
