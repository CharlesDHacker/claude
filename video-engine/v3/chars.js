// 2D cut-out characters (thick black outlines, stick limbs) drawn as SVG, rasterized onto billboards in the 3D world.
// Canvas space: viewBox -200 -180 400 600. Head centre (0,0), feet near y=400.
const INKC = '#15151c';
const CREW = {
  ava: { skin: '#a8704d', hair: '#231a2e', suit: '#f3f4f7', accent: '#e5484d', style: 'ava', patch: 'AVA' },
  teo: { skin: '#e8b48a', hair: '#3b2a1e', suit: '#f3f4f7', accent: '#2f6fed', style: 'teo', patch: 'TEO' },
  c3: { skin: '#f1c9a5', hair: '#c98b3a', suit: '#f3f4f7', accent: '#22a06b', style: 'bun', patch: 'LIV' },
  c4: { skin: '#7a4f35', hair: '#15131a', suit: '#f3f4f7', accent: '#f59e0b', style: 'short', patch: 'KOJO' },
  c5: { skin: '#d9a37c', hair: '#8b8f98', suit: '#f3f4f7', accent: '#8b5cf6', style: 'bald', patch: 'IVAN' },
  c6: { skin: '#c58b63', hair: '#5a2d1a', suit: '#f3f4f7', accent: '#06b6d4', style: 'curly', patch: 'MEI' },
  you: { skin: '#c99067', hair: '#2b1d14', suit: '#f08a3c', accent: '#2f6fed', style: 'short', patch: '' },
  mom: { skin: '#e3a97f', hair: '#6b2f1a', suit: '#f3f4f7', accent: '#e5484d', style: 'bun', patch: '' },
  dad: { skin: '#8a5a3c', hair: '#15131a', suit: '#f3f4f7', accent: '#14b8a6', style: 'short', patch: '' },
  gma: { skin: '#e8b896', hair: '#c9ced6', suit: '#b48ad8', accent: '#f59e0b', style: 'bun', patch: '' },
};
const AGE = { baby: [.82, .5], kid: [.9, .72], teen: [.96, .9] };
const n1 = v => (+v).toFixed(1);
function charSVG(id, o = {}) {
  const c = CREW[id], t = o.t || 0, SW = (w = 7) => `stroke="${INKC}" stroke-width="${w}" stroke-linejoin="round"`, S = SW();
  const expr = o.expr || 'neutral', [lx, ly] = o.look || [0, 0], seed = o.seed || 0;
  const blink = ((t * .7 + seed * 1.3) % 3.1) < .11, ex = lx * 9, ey = ly * 7;
  const eye = cx => expr === 'out' ? `<path d="M${cx - 12} ${-8} Q${cx} ${4} ${cx + 12} ${-8}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round"/>` : expr === 'cough' ? `<path d="M${cx - 11} ${-16} L${cx + (cx < 0 ? 9 : -9)} ${-6} L${cx - 11} ${4}" stroke="${INKC}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="${cx > 0 ? `translate(${2 * cx} 0) scale(-1 1)` : ''}"/>` : blink ? `<path d="M${cx - 11 + ex} ${-6 + ey} L${cx + 11 + ex} ${-6 + ey}" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/>`
    : `<ellipse cx="${cx + ex}" cy="${-6 + ey}" rx="10" ry="${expr === 'shock' ? 15 : 12.5}" fill="${INKC}"/><circle cx="${cx + ex + 3.5}" cy="${-11 + ey}" r="3.6" fill="#fff"/>`;
  const L = d => `<path d="${d}" stroke="${INKC}" stroke-width="6.5" fill="none" stroke-linecap="round"/>`;
  let brows = '', mouth = '';
  if (expr === 'worry') { brows = L('M-44 -36 L-17 -45') + L('M44 -36 L17 -45'); mouth = L('M-17 38 Q-8 28 0 35 Q8 43 17 33'); }
  else if (expr === 'shock') { brows = L('M-43 -46 L-17 -51') + L('M43 -46 L17 -51'); mouth = `<ellipse cx="0" cy="38" rx="13" ry="17" fill="#2a1216" ${S}/>`; }
  else if (expr === 'determined') { brows = L('M-46 -40 L-14 -28') + L('M46 -40 L14 -28'); mouth = L('M-18 38 L18 38'); }
  else if (expr === 'out') { brows = L('M-42 -34 L-17 -37') + L('M42 -34 L17 -37'); mouth = L('M-10 40 L10 40'); }
  else if (expr === 'cough') { brows = L('M-44 -30 L-17 -40') + L('M44 -30 L17 -40'); mouth = `<ellipse cx="0" cy="40" rx="16" ry="19" fill="#2a1216" ${S}/>`; }
  else if (expr === 'smile') { brows = L('M-42 -40 Q-29 -46 -16 -40') + L('M42 -40 Q29 -46 16 -40'); mouth = `<path d="M-22 28 Q0 54 22 28 Z" fill="#2a1216" ${S}/>`; }
  else { brows = L('M-42 -38 L-17 -39') + L('M42 -38 L17 -39'); mouth = L('M-14 38 Q0 41 14 38'); }
  if (o.talk > 0) mouth = `<ellipse cx="0" cy="38" rx="15" ry="${n1(4 + o.talk * 14)}" fill="#2a1216" ${S}/>`;
  let back = '', front = '';
  const sw = Math.sin(t * 1.3 + seed) * 8;
  if (c.style === 'ava') { back = `<path d="M22 -88 Q${66 + sw} -170 ${118 + sw * 2} -140 Q${76 + sw} -118 54 -70Z" fill="${c.hair}" ${S}/>`; front = `<path d="M-76 -12 Q-58 -88 4 -82 Q66 -86 78 -14 Q44 -56 2 -52 Q-38 -58 -76 -12Z" fill="${c.hair}" ${S}/>`; }
  else if (c.style === 'teo') { front = `<path d="M-78 -4 Q-84 -96 0 -94 Q84 -96 78 -4 Q56 -62 0 -58 Q-56 -62 -78 -4Z" fill="${c.hair}" ${S}/><path d="M-80 0 Q-82 -106 0 -106 Q82 -106 80 0" fill="none" stroke="${INKC}" stroke-width="10"/><rect x="-96" y="-18" width="24" height="46" rx="10" fill="#2b3442" ${S}/><path d="M-82 22 Q-76 60 -30 56" fill="none" stroke="${INKC}" stroke-width="6" stroke-linecap="round"/><circle cx="-30" cy="56" r="7" fill="#2b3442" ${S}/>`; }
  else if (c.style === 'bun') { back = `<circle cx="0" cy="-102" r="30" fill="${c.hair}" ${S}/>`; front = `<path d="M-78 -6 Q-84 -96 0 -94 Q84 -96 78 -6 Q50 -56 0 -56 Q-50 -56 -78 -6Z" fill="${c.hair}" ${S}/>`; }
  else if (c.style === 'curly') { front = [-60, -36, -8, 22, 48, 66].map((a, i) => `<circle cx="${a}" cy="${-62 - (i % 2) * 14}" r="24" fill="${c.hair}" ${S}/>`).join(''); }
  else if (c.style === 'bald') { front = `<path d="M-40 46 Q0 84 40 46 Q40 68 0 78 Q-40 68 -40 46Z" fill="${c.hair}" ${S}/>`; }
  else { front = `<path d="M-78 -8 Q-82 -92 0 -90 Q82 -92 78 -8 Q56 -60 0 -58 Q-56 -60 -78 -8Z" fill="${c.hair}" ${S}/>`; }
  const kick = Math.sin(t * 1.1 + seed) * 10;
  let legs = `<path d="M-26 248 Q${-34 + kick} 312 ${-30 + kick} 374" ${SW(9)} fill="none" stroke-linecap="round"/><path d="M26 248 Q${34 - kick} 312 ${30 - kick} 374" ${SW(9)} fill="none" stroke-linecap="round"/><ellipse cx="${-38 + kick}" cy="380" rx="22" ry="12" fill="${INKC}"/><ellipse cx="${38 - kick}" cy="380" rx="22" ry="12" fill="${INKC}"/>`;
  const armDef = { l: [-108 + Math.sin(t * .9 + seed) * 8, 214], r: [108 - Math.sin(t * .8 + seed) * 8, 214] }, A = { ...armDef, ...(o.arms || {}) };
  const arm = (side, [hx, hy]) => { const sx = side * 70, sy = 112, mx = (sx + hx) / 2 + side * 16, my = (sy + hy) / 2 + 10; return `<path d="M${sx} ${sy} Q${n1(mx)} ${n1(my)} ${n1(hx)} ${n1(hy)}" stroke="${INKC}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="${n1(hx)}" cy="${n1(hy)}" r="15" fill="${c.skin}" ${SW(5)}/>`; };
  let body = `<path d="M-74 250 Q-82 96 -34 80 L34 80 Q82 96 74 250 Z" fill="${c.suit}" ${S}/><path d="M-70 132 L-44 86 M70 132 L44 86" stroke="${c.accent}" stroke-width="12" stroke-linecap="round"/><rect x="12" y="118" width="48" height="20" rx="4" fill="#fff" stroke="${INKC}" stroke-width="3"/><text x="36" y="133" text-anchor="middle" font-size="13" font-weight="900" fill="#1e2a3a" font-family="Nunito,sans-serif">${c.patch}</text><circle cx="-38" cy="128" r="12" fill="${c.accent}" ${SW(4)}/>`;
  const hold = o.hold || '';
  const mask = o.mask ? `<rect x="-62" y="-42" width="124" height="110" rx="46" fill="#bfe8ff" fill-opacity=".28" stroke="${INKC}" stroke-width="5"/><path d="M-62 6 L-80 0 M62 6 L80 0" stroke="#14b8a6" stroke-width="9" stroke-linecap="round"/><rect x="-22" y="58" width="44" height="26" rx="9" fill="#2b3442" stroke="${INKC}" stroke-width="5"/>` : '';
  const face = back + `<circle r="78" fill="${c.skin}" ${S}/><circle cx="-44" cy="24" r="13" fill="#ff6b6b" opacity=".25"/><circle cx="44" cy="24" r="13" fill="#ff6b6b" opacity=".25"/>` + front + eye(-28) + eye(28) + brows + mouth + mask;
  let svg = '';
  if (o.headOnly) return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="-200 -180 400 600">${face}</svg>`;
  if (o.back) {
    svg = legs + arm(-1, A.l) + arm(1, A.r) + body.replace(/<rect x="12".*?<\/text><circle.*?\/>/, '') + `<circle r="78" fill="${c.hair}" ${S}/>` + (c.style === 'teo' ? `<path d="M-80 0 Q-82 -106 0 -106 Q82 -106 80 0" fill="none" stroke="${INKC}" stroke-width="10"/>` : '');
  } else {
    const patch = (o.patch ?? c.patch) ? body : body.replace(/<rect x="12".*?<\/text>/, '');
    const ag = AGE[o.age], wrap = x => ag ? `<g transform="translate(0 80) scale(${ag[0]} ${ag[1]}) translate(0 -80)">${x}</g>` : x;
    const onesie = o.age === 'baby' ? `<path d="M-60 250 Q-66 120 -30 84 L30 84 Q66 120 60 250 Z" fill="#ffd27a" ${SW(7)}/><circle cx="-18" cy="150" r="9" fill="#fff" ${SW(4)}/><circle cx="18" cy="150" r="9" fill="#fff" ${SW(4)}/>` : '';
    const helmet = o.helmet ? `<circle r="112" fill="#cfefff" fill-opacity=".22" ${SW(7)}/><path d="M-72 -62 Q-40 -96 6 -100" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".8"/><rect x="-60" y="96" width="120" height="22" rx="8" fill="#9aa6b5" ${SW(5)}/>` : '';
    svg = wrap(legs + arm(-1, A.l) + (onesie || patch)) + face + helmet + wrap(arm(1, A.r));
    if (hold) svg += `<g transform="translate(${n1(A.r[0])} ${n1(A.r[1])})">${hold}</g>`;
    if (o.sweat) svg += `<path d="M64 -50 Q76 -30 64 -20 Q52 -30 64 -50Z" fill="#8fd3ff" ${SW(4)} transform="translate(0 ${n1((t * 20) % 26)})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="-200 -180 400 600">${svg}</svg>`;
}
function biscuitSVG(o = {}) {
  const t = o.t || 0, SW = (w = 6) => `stroke="${INKC}" stroke-width="${w}" stroke-linejoin="round"`, S = SW(), ear = Math.sin(t * 1.6) * 10 * (o.spin ?? 1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="-200 -200 400 400"><g transform="scale(1.9)">
  <ellipse cx="0" cy="52" rx="30" ry="26" fill="#d9a066" ${S}/><ellipse cx="0" cy="56" rx="17" ry="15" fill="#f3d9b5"/>
  <ellipse cx="-22" cy="76" rx="11" ry="8" fill="#c98f58" ${S}/><ellipse cx="22" cy="76" rx="11" ry="8" fill="#c98f58" ${S}/>
  <path d="M-30 -24 Q${-60 - ear} -6 ${-46 - ear} 26 Q-34 16 -24 -4Z" fill="#7a4a2b" ${S}/><path d="M30 -24 Q${60 + ear} -6 ${46 + ear} 26 Q34 16 24 -4Z" fill="#7a4a2b" ${S}/>
  <circle r="38" fill="#d9a066" ${S}/><ellipse cx="0" cy="13" rx="21" ry="16" fill="#f3d9b5"/>
  <circle cx="-14" cy="-6" r="5.5" fill="${INKC}"/><circle cx="14" cy="-6" r="5.5" fill="${INKC}"/><circle cx="-12.5" cy="-8" r="1.8" fill="#fff"/><circle cx="15.5" cy="-8" r="1.8" fill="#fff"/>
  <ellipse cx="0" cy="6" rx="7.5" ry="5.5" fill="${INKC}"/><path d="M0 11 L0 17 M0 17 Q-6 23 -11 18 M0 17 Q6 23 11 18" stroke="${INKC}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <rect x="-22" y="30" width="44" height="9" rx="4.5" fill="#e5484d" ${SW(3)}/><circle cx="0" cy="42" r="6" fill="#ffc83d" ${SW(3)}/></g></svg>`;
}
const WRENCH = `<g transform="rotate(-25)"><rect x="-8" y="-96" width="16" height="104" rx="6" fill="#aab4c2" stroke="${INKC}" stroke-width="5"/><path d="M-22 -124 Q-24 -88 0 -86 Q24 -88 22 -124 L10 -124 L10 -104 L-10 -104 L-10 -124Z" fill="#aab4c2" stroke="${INKC}" stroke-width="5"/></g>`;
