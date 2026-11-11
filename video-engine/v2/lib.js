// Shared helpers and reusable drawing components (flat-vector, 576x1024 canvas).
const W = 576, H = 1024, TAU = Math.PI * 2;
const GOLD = '#ffc83d', RED = '#ff4a4a', CY = '#62d5ff', GREEN = '#34d399', INK = '#0b1020';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const spring = x => x <= 0 ? 0 : 1 - Math.exp(-7 * x) * Math.cos(11 * x);
const pop = (lt, delay = 0, dur = .4) => spring((lt - delay) / dur * .9);
const fade = (lt, delay = 0, dur = .25) => clamp((lt - delay) / dur);
const f = n => (+n).toFixed(1);
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const BG = (fill, extra = '') => `<rect x="-200" y="-200" width="976" height="1424" fill="${fill}" ${extra}/>`;

const DEFS = `<defs>
<linearGradient id="gSpace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03040c"/><stop offset=".6" stop-color="#070d22"/><stop offset="1" stop-color="#0d2247"/></linearGradient>
<radialGradient id="gEarth" cx=".5" cy=".5" r=".5"><stop offset=".75" stop-color="#1d5fbf"/><stop offset=".93" stop-color="#2f86e0"/><stop offset="1" stop-color="#7cc4ff"/></radialGradient>
<linearGradient id="gPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0cc66"/><stop offset="1" stop-color="#b47f22"/></linearGradient>
<linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5dde6"/><stop offset="1" stop-color="#9eadbd"/></linearGradient>
<linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0d1626" stop-opacity=".5"/></linearGradient>
<linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6ebf1"/><stop offset="1" stop-color="#97a5b6"/></linearGradient>
<radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#ff9a2e"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient>
<radialGradient id="gBlue" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#bdeaff"/><stop offset=".62" stop-color="#3b8bff"/><stop offset="1" stop-color="#1e40ff" stop-opacity="0"/></radialGradient>
<linearGradient id="gFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3b8bff"/><stop offset=".22" stop-color="#ffb02e"/><stop offset=".7" stop-color="#ffd84d"/><stop offset="1" stop-color="#fff6c9"/></linearGradient>
<radialGradient id="gVig" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="gRed" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5a5a" stop-opacity=".9"/><stop offset="1" stop-color="#ff0000" stop-opacity="0"/></radialGradient>
<radialGradient id="gSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8e0"/><stop offset=".15" stop-color="#ffe9b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<linearGradient id="gBlueprint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071433"/><stop offset="1" stop-color="#0a1f4d"/></linearGradient>
<filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b12" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="b30" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>
</defs>`;

function stars(t, n = 120, seed = 7) {
  const r = rng(seed); let o = '';
  for (let i = 0; i < n; i++) {
    const x = r() * 776 - 100, y = r() * 1224 - 100, s = .5 + r() * 1.5, sp = 1 + r() * 2, a = .3 + .6 * r();
    o += `<circle cx="${f(x)}" cy="${f(y)}" r="${s.toFixed(2)}" fill="#fff" opacity="${((.6 + .4 * Math.sin(t * sp + i)) * a).toFixed(2)}"/>`;
  } return o;
}
function earth(t, top = 700, R = 1000) {
  const cy = top + R, drift = t * 5, r = rng(21);
  let o = `<circle cx="288" cy="${cy}" r="${R + 22}" fill="#4aa3ff" opacity=".3" filter="url(#b12)"/><circle cx="288" cy="${cy}" r="${R}" fill="url(#gEarth)"/>`;
  o += `<clipPath id="cE"><circle cx="288" cy="${cy}" r="${R}"/></clipPath><g clip-path="url(#cE)">`;
  for (let i = 0; i < 8; i++) { const x = ((r() * 1000 + drift) % 1000) - 200, y = top + 50 + r() * 300, w = 60 + r() * 130, h = 24 + r() * 46; o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(h)}" fill="#39a873" opacity=".8" transform="rotate(${f(r() * 40 - 20)} ${f(x)} ${f(y)})"/>`; }
  for (let i = 0; i < 12; i++) { const x = ((r() * 1000 + drift * (1.4 + r())) % 1000) - 200, y = top + 16 + r() * 340; o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(40 + r() * 90)}" ry="${f(6 + r() * 11)}" fill="#fff" opacity=".55"/>`; }
  return o + `</g>`;
}
function space(t, o = {}) {
  let s = BG('url(#gSpace)') + stars(t);
  if (o.sun !== false) s += `<circle cx="470" cy="150" r="190" fill="url(#gSun)" opacity=".5"/><circle cx="470" cy="150" r="30" fill="#fff8e6"/>`;
  if (o.earth !== false) s += earth(t, o.earthTop ?? 700, o.earthR ?? 1000);
  return s;
}
// Station exterior, origin at the hub. Vertical spine: capsule A (top), lab, hub, service, capsule B (bottom).
function station(t, { hiA = 0, hiB = 0, alert = 0 } = {}) {
  const P = (x, y, w = 46, h = 118) => { let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#gPanel)" stroke="#6b4d15" stroke-width="1.5"/>`; for (let i = 1; i < 5; i++) o += `<line x1="${x}" y1="${y + i * h / 5}" x2="${x + w}" y2="${y + i * h / 5}" stroke="#6b4d15" stroke-width="1"/>`; return o + `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#6b4d15" stroke-width="1"/>`; };
  const cap = (y, dir, hi, label) => {
    const pulse = .6 + .4 * Math.sin(t * 7);
    let o = `<g transform="translate(0 ${y}) scale(1 ${dir})">`;
    if (hi > 0) o += `<path d="M-30 4 L-30 -22 Q-26 -52 0 -58 Q26 -52 30 -22 L30 4Z" fill="${GOLD}" opacity="${(hi * .55 * pulse).toFixed(2)}" filter="url(#b4)"/>`;
    o += `<path d="M-23 0 L-23 -20 Q-20 -42 0 -46 Q20 -42 23 -20 L23 0Z" fill="#f2f4f7" stroke="${hi > 0 ? GOLD : '#8794a6'}" stroke-width="${hi > 0 ? 4 : 2.5}"/><rect x="-23" y="-12" width="46" height="6" fill="#e5484d"/><circle cx="0" cy="-26" r="6" fill="#16263f"/></g>`;
    if (hi > 0) { const k = pop(hi, 0, 1); o += `<g transform="translate(${74} ${y + dir * -24}) scale(${k.toFixed(3)})"><circle r="22" fill="${GOLD}"/><text x="0" y="11" text-anchor="middle" class="an" font-size="30" fill="${INK}">${label}</text></g><line x1="50" y1="${y + dir * -24}" x2="28" y2="${y + dir * -24}" stroke="${GOLD}" stroke-width="3" opacity="${clamp(hi)}"/>`; }
    return o;
  };
  let o = `<rect x="-262" y="-6" width="524" height="12" fill="#9aa6b5"/>`;
  for (let i = 0; i < 20; i++) o += `<line x1="${-256 + i * 26}" y1="-6" x2="${-243 + i * 26}" y2="6" stroke="#6f7c8e" stroke-width="1.5"/>`;
  [-262, -208, 162, 216].forEach(x => { o += P(x, -136) + P(x, 18); });
  o += `<rect x="-128" y="-78" width="24" height="64" fill="#eef2f6" stroke="#9aa6b5"/><rect x="104" y="14" width="24" height="64" fill="#eef2f6" stroke="#9aa6b5"/>`;
  const mod = (y, h, w, fill = '#e9edf2') => `<rect x="${-w / 2}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="#8794a6" stroke-width="2.5"/><line x1="${-w / 2}" y1="${y + h * .3}" x2="${w / 2}" y2="${y + h * .3}" stroke="#b7c1ce" stroke-width="2"/><line x1="${-w / 2}" y1="${y + h * .7}" x2="${w / 2}" y2="${y + h * .7}" stroke="#b7c1ce" stroke-width="2"/>`;
  o += mod(-150, 92, 52) + mod(40, 86, 52, alert ? '#ffd9d2' : '#e9edf2') + mod(-60, 102, 74, '#f4f6f9');
  o += `<circle cx="0" cy="-10" r="12" fill="#16263f" stroke="#8794a6" stroke-width="2"/><circle cx="0" cy="-104" r="7" fill="#16263f"/>`;
  if (alert) { const k = .5 + .5 * Math.sin(t * 9); o += `<circle cx="0" cy="83" r="${30 + k * 14}" fill="url(#gRed)" opacity="${(alert * (.5 + .5 * k)).toFixed(2)}"/><circle cx="0" cy="83" r="6" fill="#ff3b3b"/>`; }
  o += cap(-150, 1, hiA, 'A') + cap(126, -1, hiB, 'B');
  return o;
}
// Station interior wall (flat, front-on).
function interior(t, { alert = 0, dark = 0, win = 0, seed = 3, blur = 0 } = {}) {
  const r = rng(seed); let o = `<g ${blur ? 'filter="url(#b4)"' : ''}>` + BG('url(#gWall)');
  for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) {
    const x = -170 + i * 152, y = -130 + j * 158, k = r(), kind = r(), ph = r() * 6;
    o += `<rect x="${x + 6}" y="${y + 6}" width="140" height="146" rx="14" fill="${k < .33 ? '#bcc8d5' : k < .66 ? '#c8d2dd' : '#b1bfce'}" stroke="#8a9bb0" stroke-width="2"/>`;
    if (kind < .2) { o += `<rect x="${x + 28}" y="${y + 40}" width="96" height="62" rx="7" fill="#0f2238" stroke="#5b6b80" stroke-width="2"/>`; for (let q = 0; q < 3; q++) o += `<rect x="${x + 38}" y="${y + 52 + q * 15}" width="${f(30 + 40 * (.5 + .5 * Math.sin(t * 1.5 + ph + q * 2)))}" height="6" rx="3" fill="${q == 1 ? GREEN : CY}" opacity=".9"/>`; }
    else if (kind < .38) o += `<rect x="${x + 26}" y="${y + 30}" width="100" height="96" rx="20" fill="#eadfc7" stroke="#b9ad90" stroke-width="2"/><rect x="${x + 26}" y="${y + 70}" width="100" height="10" fill="#8a7f66" opacity=".5"/>`;
    else if (kind < .54) o += `<rect x="${x + 26}" y="${y + 72}" width="100" height="12" rx="6" fill="#2f6fed"/><rect x="${x + 36}" y="${y + 66}" width="8" height="24" fill="#5b6b80"/><rect x="${x + 108}" y="${y + 66}" width="8" height="24" fill="#5b6b80"/>`;
    else if (kind < .66) for (let q = 0; q < 5; q++) o += `<rect x="${x + 34}" y="${y + 42 + q * 16}" width="84" height="6" rx="3" fill="#7f8fa3"/>`;
    else o += [[20, 20], [132, 20], [20, 138], [132, 138]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="3.5" fill="#8a9bb0"/>`).join('');
  }
  o += `<path d="M-60 250 Q150 330 330 262 T700 300" fill="none" stroke="#e5484d" stroke-width="5" opacity=".8"/><path d="M-60 268 Q170 350 340 286 T700 322" fill="none" stroke="#f2c14e" stroke-width="4" opacity=".8"/>`;
  if (win) o += `<circle cx="430" cy="214" r="98" fill="#7d8da0"/><circle cx="430" cy="214" r="84" fill="#050a18"/><clipPath id="cW"><circle cx="430" cy="214" r="84"/></clipPath><g clip-path="url(#cW)"><circle cx="400" cy="420" r="230" fill="url(#gEarth)"/><ellipse cx="${f(380 + Math.sin(t * .2) * 20)}" cy="228" rx="60" ry="8" fill="#fff" opacity=".5"/></g><circle cx="430" cy="214" r="84" fill="none" stroke="#dfe6ee" stroke-width="6"/>`;
  o += BG('url(#gShade)') + `</g>`;
  for (let i = 0; i < 16; i++) { const x = (r() * 600 + t * (4 + r() * 8)) % 620 - 20, y = (r() * 1040 + Math.sin(t * .4 + i) * 20); o += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1 + r() * 1.8)}" fill="#fff" opacity=".45"/>`; }
  if (alert) { const k = Math.sin(t * 8) ** 2; o += BG('#ff1a1a', `opacity="${(alert * (.38 + .22 * k)).toFixed(2)}" style="mix-blend-mode:multiply"`) + BG('#ff2a2a', `opacity="${(alert * .1 * k).toFixed(2)}"`); }
  if (dark) o += BG('#02040c', `opacity="${dark}"`);
  return o;
}
const CAST = {
  ava: { skin: '#a8704d', hair: '#231a2e', accent: '#e5484d', style: 'ava', patch: 'AVA' },
  teo: { skin: '#e3b088', hair: '#3b2a1e', accent: '#2f6fed', style: 'teo', patch: 'TEO' },
  c3: { skin: '#f1c9a5', hair: '#c98b3a', accent: '#22a06b', style: 'bun', patch: 'LIV' },
  c4: { skin: '#7a4f35', hair: '#15131a', accent: '#f59e0b', style: 'short', patch: 'KOJO' },
  c5: { skin: '#d9a37c', hair: '#8b8f98', accent: '#8b5cf6', style: 'bald', patch: 'IVAN' },
  c6: { skin: '#c58b63', hair: '#5a2d1a', accent: '#06b6d4', style: 'curly', patch: 'MEI' },
};
function person(id, x, y, s, t, { expr = 'neutral', look = [0, 0], talk = 0, seed = 0, float = 1, arms = null, rot = 0, sweat = 0, body = 1, flip = 0, hold = '' } = {}) {
  const c = CAST[id], suit = '#f1f3f6';
  const fx = Math.sin(t * .8 + seed) * 4 * float, fy = Math.cos(t * .65 + seed * 2) * 7 * float, rr = rot + Math.sin(t * .5 + seed) * 2.5 * float;
  const blink = ((t * .7 + seed * 1.3) % 3.1) < .11, [lx, ly] = look, ex = lx * 5, ey = ly * 4;
  const eye = cx => blink ? `<rect x="${cx - 8 + ex}" y="${-5 + ey}" width="16" height="4" rx="2" fill="#15151c"/>` : `<ellipse cx="${cx + ex}" cy="${-4 + ey}" rx="7" ry="${expr === 'shock' ? 11 : 9}" fill="#15151c"/><circle cx="${cx + ex + 2.5}" cy="${-7.5 + ey}" r="2.6" fill="#fff"/>`;
  const B = (d) => `<path d="${d}" stroke="#15151c" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  let brows = '', mouth = '';
  if (expr === 'worry') { brows = B('M-32 -24 L-12 -31') + B('M32 -24 L12 -31'); mouth = B('M-12 28 Q-6 20 0 26 Q6 32 12 24'); }
  else if (expr === 'shock') { brows = B('M-31 -32 L-12 -36') + B('M31 -32 L12 -36'); mouth = `<ellipse cx="0" cy="28" rx="9" ry="12" fill="#2a1216"/>`; }
  else if (expr === 'determined') { brows = B('M-33 -27 L-10 -19') + B('M33 -27 L10 -19'); mouth = B('M-13 28 L13 28'); }
  else if (expr === 'smile') { brows = B('M-30 -27 Q-21 -31 -12 -27') + B('M30 -27 Q21 -31 12 -27'); mouth = B('M-15 22 Q0 38 15 22'); }
  else { brows = B('M-30 -26 L-12 -27') + B('M30 -26 L12 -27'); mouth = B('M-10 28 Q0 30 10 28'); }
  if (talk > 0) mouth = `<ellipse cx="0" cy="28" rx="10" ry="${f(3 + talk * 10)}" fill="#2a1216"/><ellipse cx="0" cy="${f(31 + talk * 5)}" rx="6" ry="${f(talk * 4)}" fill="#e5484d"/>`;
  const sw = Math.sin(t * 1.3 + seed) * 6;
  let back = '', front = '';
  if (c.style === 'ava') { back = `<path d="M-60 8 Q-72 -72 0 -74 Q72 -72 60 8 Q64 44 42 56 L42 -6 Q0 -30 -42 -6 L-42 56 Q-64 44 -60 8Z" fill="${c.hair}"/><path d="M14 -64 Q${50 + sw} -124 ${84 + sw * 2} -104 Q${54 + sw} -86 38 -52Z" fill="${c.hair}"/>`; front = `<path d="M-52 -14 Q-32 -58 6 -54 Q42 -56 54 -12 Q30 -40 0 -36 Q-28 -40 -52 -14Z" fill="${c.hair}"/>`; }
  else if (c.style === 'teo') { front = `<path d="M-56 -6 Q-62 -70 0 -68 Q62 -70 56 -6 Q40 -46 0 -43 Q-40 -46 -56 -6Z" fill="${c.hair}"/><path d="M-58 -2 Q-60 -78 0 -78 Q60 -78 58 -2" fill="none" stroke="#2b3442" stroke-width="7"/><rect x="-70" y="-14" width="18" height="34" rx="8" fill="#2b3442"/><path d="M-60 16 Q-56 44 -22 40" fill="none" stroke="#2b3442" stroke-width="4" stroke-linecap="round"/><circle cx="-22" cy="40" r="5" fill="#2b3442"/>`; }
  else if (c.style === 'bun') { back = `<circle cx="0" cy="-74" r="22" fill="${c.hair}"/>`; front = `<path d="M-56 -6 Q-62 -70 0 -68 Q62 -70 56 -6 Q36 -40 0 -40 Q-36 -40 -56 -6Z" fill="${c.hair}"/>`; }
  else if (c.style === 'curly') { front = [-44, -26, -6, 16, 36, 50].map((a, i) => `<circle cx="${a}" cy="${-46 - (i % 2) * 10}" r="18" fill="${c.hair}"/>`).join(''); }
  else if (c.style === 'bald') { front = `<path d="M-30 34 Q0 62 30 34 Q30 50 0 58 Q-30 50 -30 34Z" fill="${c.hair}"/>`; }
  else { front = `<path d="M-56 -8 Q-60 -68 0 -66 Q60 -68 56 -8 Q40 -44 0 -42 Q-40 -44 -56 -8Z" fill="${c.hair}"/>`; }
  let o = `<g transform="translate(${f(x + fx)} ${f(y + fy)}) rotate(${f(rr)}) scale(${flip ? -s : s} ${s})">`;
  if (body) {
    o += `<path d="M-80 196 Q-84 80 -30 64 L30 64 Q84 80 80 196Z" fill="${suit}" stroke="#c3cad3" stroke-width="2"/><path d="M-76 128 L-46 74" stroke="${c.accent}" stroke-width="11" stroke-linecap="round"/><path d="M76 128 L46 74" stroke="${c.accent}" stroke-width="11" stroke-linecap="round"/>`;
    o += `<line x1="0" y1="76" x2="0" y2="196" stroke="#c3cad3" stroke-width="3"/><rect x="14" y="104" width="44" height="18" rx="4" fill="#fff" stroke="#9aa5b1" stroke-width="1.5"/><text x="36" y="118" text-anchor="middle" font-size="12" fill="#1e2a3a" transform="${flip ? 'translate(72 0) scale(-1 1)' : ''}">${c.patch}</text><circle cx="-36" cy="114" r="11" fill="${c.accent}" stroke="#fff" stroke-width="2"/>`;
    o += `<ellipse cx="0" cy="64" rx="33" ry="12" fill="#cfd6de" stroke="#9aa5b1" stroke-width="2"/>`;
  }
  o += back + `<ellipse cx="-54" cy="0" rx="8" ry="12" fill="${c.skin}"/><ellipse cx="54" cy="0" rx="8" ry="12" fill="${c.skin}"/><circle r="54" fill="${c.skin}"/><circle cx="-31" cy="18" r="9" fill="#ff6b6b" opacity=".22"/><circle cx="31" cy="18" r="9" fill="#ff6b6b" opacity=".22"/>` + front + eye(-20) + eye(20) + brows + mouth;
  if (sweat) o += `<path d="M46 -34 Q54 -20 46 -14 Q38 -20 46 -34Z" fill="#8fd3ff" transform="translate(0 ${f((t * 14) % 18)})" opacity=".9"/>`;
  if (arms && body) for (const [side, h] of [[-1, arms.l], [1, arms.r]]) {
    if (!h) continue; const sx = side * 62, sy = 100, [hx, hy] = h, mx = (sx + hx) / 2 + side * 18, my = (sy + hy) / 2 + 14;
    o += `<path d="M${sx} ${sy} Q${f(mx)} ${f(my)} ${hx} ${hy}" fill="none" stroke="#c3cad3" stroke-width="34" stroke-linecap="round"/><path d="M${sx} ${sy} Q${f(mx)} ${f(my)} ${hx} ${hy}" fill="none" stroke="${suit}" stroke-width="30" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="17" fill="${c.skin}"/><circle cx="${f(lerp(hx, mx, .28))}" cy="${f(lerp(hy, my, .28))}" r="17.5" fill="${c.accent}"/>`;
    if (side === 1 && hold) o += `<g transform="translate(${hx} ${hy})">${hold}</g><circle cx="${hx}" cy="${hy}" r="17" fill="${c.skin}"/>`;
  }
  return o + `</g>`;
}
function biscuit(x, y, s, t, { spin = 1, seed = 3, rot: r0 = 0 } = {}) {
  const rot = Math.sin(t * .7 + seed) * 14 * spin + r0, fy = Math.sin(t * .9 + seed) * 10 * spin, ear = Math.sin(t * 1.6) * 8 * spin;
  return `<g transform="translate(${f(x)} ${f(y + fy)}) rotate(${f(rot)}) scale(${s})">
  <ellipse cx="0" cy="52" rx="30" ry="26" fill="#d9a066"/><ellipse cx="0" cy="56" rx="17" ry="15" fill="#f3d9b5"/>
  <ellipse cx="-22" cy="76" rx="11" ry="8" fill="#c98f58"/><ellipse cx="22" cy="76" rx="11" ry="8" fill="#c98f58"/>
  <path d="M-30 -24 Q${-60 - ear} -6 ${-46 - ear} 26 Q-34 16 -24 -4Z" fill="#7a4a2b"/><path d="M30 -24 Q${60 + ear} -6 ${46 + ear} 26 Q34 16 24 -4Z" fill="#7a4a2b"/>
  <circle r="38" fill="#d9a066"/><ellipse cx="0" cy="13" rx="21" ry="16" fill="#f3d9b5"/><path d="M14 -34 Q30 -30 34 -12 Q22 -18 14 -34Z" fill="#c98f58"/>
  <circle cx="-14" cy="-6" r="5.5" fill="#15151c"/><circle cx="14" cy="-6" r="5.5" fill="#15151c"/><circle cx="-12.5" cy="-8" r="1.8" fill="#fff"/><circle cx="15.5" cy="-8" r="1.8" fill="#fff"/>
  <ellipse cx="0" cy="6" rx="7.5" ry="5.5" fill="#15151c"/><path d="M0 11 L0 17 M0 17 Q-6 23 -11 18 M0 17 Q6 23 11 18" stroke="#15151c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <rect x="-22" y="30" width="44" height="9" rx="4.5" fill="#e5484d"/><circle cx="0" cy="42" r="6" fill="${GOLD}"/></g>`;
}
function smoke(t, cx, cy, n, spread = 120, seed = 1, col = '#cfd3da', alpha = .35, grow = 1) {
  const r = rng(seed); let o = '';
  for (let i = 0; i < n; i++) {
    const ph = r(), ang = r() * TAU, sp = .25 + r() * .5, age = ((t * sp * .35 + ph) % 1), d = age * spread;
    o += `<circle cx="${f(cx + Math.cos(ang + age * 1.5) * d)}" cy="${f(cy + Math.sin(ang * 1.3 + age * 1.2) * d)}" r="${f((14 + age * 46) * grow)}" fill="${col}" opacity="${(alpha * (1 - age)).toFixed(3)}"/>`;
  } return o;
}
// Hatch, centred on (288, 470). glow 0..1, turn = wheel angle in degrees.
function hatch(t, { glow = 0, turn = 0, label = 'SERVICE MODULE', leak = 0 } = {}) {
  const fl = .82 + .18 * Math.sin(t * 11) * Math.sin(t * 7.3);
  let o = interior(t, { blur: 1, seed: 21 }) + BG('#0b1020', 'opacity=".35"') + `<rect x="18" y="170" width="540" height="640" rx="40" fill="#8fa0b3" stroke="#5d6d80" stroke-width="6"/>`;
  [[52, 204], [524, 204], [52, 776], [524, 776], [288, 190], [288, 790]].forEach(([a, b]) => o += `<circle cx="${a}" cy="${b}" r="9" fill="#c9d3de" stroke="#5d6d80" stroke-width="3"/>`);
  o += `<circle cx="288" cy="470" r="246" fill="none" stroke="#f2c14e" stroke-width="16" stroke-dasharray="34 26" opacity=".9"/><circle cx="288" cy="470" r="228" fill="#7d8ea2" stroke="#4d5b6c" stroke-width="10"/><circle cx="288" cy="470" r="200" fill="url(#gMetal)" stroke="#6c7c8f" stroke-width="6"/>`;
  if (glow > 0) o += `<circle cx="288" cy="356" r="${f(150 + 20 * fl)}" fill="#ff7a18" opacity="${(glow * .28 * fl).toFixed(2)}" filter="url(#b30)"/>`;
  o += `<circle cx="288" cy="356" r="62" fill="#3d4a5a"/><circle cx="288" cy="356" r="50" fill="#070b14"/>`;
  if (glow > 0) o += `<clipPath id="cP"><circle cx="288" cy="356" r="50"/></clipPath><g clip-path="url(#cP)" opacity="${clamp(glow)}"><circle cx="288" cy="356" r="50" fill="#ff7a18"/><circle cx="${f(288 + Math.sin(t * 5) * 8)}" cy="${f(366 + Math.cos(t * 6) * 6)}" r="${f(30 * fl)}" fill="#ffd27a"/><circle cx="${f(280 + Math.cos(t * 4) * 10)}" cy="372" r="${f(15 * fl)}" fill="#fff3c4"/></g>`;
  o += `<circle cx="288" cy="356" r="50" fill="none" stroke="#dfe6ee" stroke-width="5"/><path d="M256 330 Q270 314 292 312" stroke="#fff" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>`;
  o += `<g transform="rotate(${f(turn)} 288 540)"><circle cx="288" cy="540" r="84" fill="none" stroke="#3d4a5a" stroke-width="20"/><circle cx="288" cy="540" r="84" fill="none" stroke="#e5484d" stroke-width="13"/>${[0, 60, 120].map(a => `<rect x="280" y="456" width="16" height="168" rx="8" fill="#c9d3de" stroke="#5d6d80" stroke-width="4" transform="rotate(${a} 288 540)"/>`).join('')}<circle cx="288" cy="540" r="22" fill="#dfe6ee" stroke="#5d6d80" stroke-width="5"/></g>`;
  o += `<rect x="178" y="700" width="220" height="42" rx="8" fill="#f6f3ea" stroke="#b9b2a2" stroke-width="2"/><text x="288" y="729" text-anchor="middle" font-size="24" fill="#c1121f" letter-spacing="1">${label}</text>`;
  if (glow > .5 || leak) o += smoke(t, 288, 250, 7, 130, 9, '#8d939e', .4);
  return o;
}
function fan(t, cx, cy, R, ang) {
  let o = `<circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="#5d6d80" stroke="#3d4a5a" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#141c28"/>`;
  o += `<g transform="rotate(${f(ang)} ${cx} ${cy})">${[0, 72, 144, 216, 288].map(a => `<path d="M${cx} ${cy} Q${cx + R * .34} ${cy - R * .5} ${cx} ${cy - R * .94} Q${cx - R * .3} ${cy - R * .46} ${cx} ${cy}Z" fill="#9fb0c3" stroke="#6c7c8f" stroke-width="2" transform="rotate(${a} ${cx} ${cy})"/>`).join('')}</g><circle cx="${cx}" cy="${cy}" r="${R * .16}" fill="#dfe6ee" stroke="#6c7c8f" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) o += `<line x1="${cx - R}" y1="${cy - R * .6 + i * R * .4}" x2="${cx + R}" y2="${cy - R * .6 + i * R * .4}" stroke="#3d4a5a" stroke-width="4" opacity=".55"/>`;
  return o;
}
function blueprint(t) {
  let o = BG('url(#gBlueprint)') + `<g stroke="#15306b" stroke-width="1">`;
  for (let i = -6; i < 26; i++) o += `<line x1="${i * 32}" y1="-200" x2="${i * 32}" y2="1224"/>`;
  for (let i = -6; i < 40; i++) o += `<line x1="-200" y1="${i * 32}" x2="776" y2="${i * 32}"/>`;
  return o + `</g>`;
}
function blueFlame(t, cx, cy, R, a = 1) {
  const r = R * (1 + .06 * Math.sin(t * 7) + .04 * Math.sin(t * 13));
  return `<circle cx="${cx}" cy="${cy}" r="${f(r * 2.3)}" fill="url(#gBlue)" opacity="${(.45 * a).toFixed(2)}"/><circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="url(#gBlue)" opacity="${a}"/>`;
}
