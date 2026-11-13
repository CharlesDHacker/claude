// "Every star, ranked by size": real radii (in Suns) side by side; the camera keeps pulling back so each new
// star fills the frame, and the previous ones shrink to dots. Orbits of the planets are drawn on Antares and
// Stephenson 2-18 to show what they would swallow. HUD: name, size in Suns, type, distance.
while (!window.__ladder || !window.ENG) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng } = E;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const isMine = () => { const e = E.ep(); return !!(e && e.series && e.series.startsWith('EVERY STAR')); };
const ST = loc('STARS', 120000);

const DATA = [
  ['sun', 'THE SUN', 1, '#fff1c8', 'YELLOW DWARF', '8 LIGHT-MINUTES'], ['sirius', 'SIRIUS', 1.71, '#d4e4ff', 'WHITE MAIN-SEQUENCE', '8.6 LIGHT-YEARS'], ['pollux', 'POLLUX', 9.06, '#ffc890', 'ORANGE GIANT', '34 LIGHT-YEARS'],
  ['arcturus', 'ARCTURUS', 25.4, '#ffb070', 'RED GIANT', '37 LIGHT-YEARS'], ['aldebaran', 'ALDEBARAN', 44.2, '#ff9a58', 'RED GIANT', '65 LIGHT-YEARS'], ['rigel', 'RIGEL', 78.9, '#b8d0ff', 'BLUE SUPERGIANT', '~860 LIGHT-YEARS'],
  ['antares', 'ANTARES', 680, '#ff6a40', 'RED SUPERGIANT', '~550 LIGHT-YEARS'], ['betelgeuse', 'BETELGEUSE', 764, '#ff7a48', 'RED SUPERGIANT', '~550 LIGHT-YEARS'], ['st218', 'STEPHENSON 2-18', 2150, '#ff4a2a', 'RED SUPERGIANT', '~19,000 LIGHT-YEARS'],
];
// background: deep starfield + faint milky-way band, big enough for every zoom level
const BG = new THREE.Group(); ST.add(BG);
{ const r = rng(77), a = [], c = []; for (let i = 0; i < 5000; i++) { const u = r() * 2 - 1, an = r() * TAU, R = 1; const band = r() < .45; const y = band ? (r() - .5) * .25 : u; const s = Math.sqrt(1 - y * y); a.push(s * Math.cos(an), y, s * Math.sin(an)); const k = .6 + r() * .4, t = r(); c.push(k * (t < .2 ? 1 : .85), k * .9, k * (t > .8 ? 1 : .8)); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, depthTest: false, depthWrite: false })); pts.renderOrder = -3; BG.add(pts);
  for (let i = 0; i < 14; i++) { const neb = sprite(TEX.smoke, .5 + r() * .6, true, .12); neb.material.color.set(['#5a3a8a', '#2a4a8a', '#8a3a5a'][i % 3]); neb.material.depthTest = false; neb.renderOrder = -3; const an = r() * TAU; neb.position.set(Math.cos(an) * .95, (r() - .5) * .3, Math.sin(an) * .95); BG.add(neb); } }
// star material: limb darkening + boiling granulation
const starMat = col => new THREE.ShaderMaterial({ uniforms: { col: { value: new THREE.Color(col) }, time: { value: 0 }, seed: { value: Math.random() * 10 } },
  vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vO; void main(){ vO = normalize(position); vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform vec3 col; uniform float time, seed; varying vec3 vN; varying vec3 vV; varying vec3 vO;
    float hash(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f); return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y), mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z); }
    float fbm(vec3 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 1.7; a *= .5; } return v; }
    void main(){ float mu = max(dot(vN, vV), 0.); float g = fbm(vO * 9. + vec3(time * .15, seed, -time * .1)); float g2 = fbm(vO * 30. + vec3(-time * .3, time * .2, seed));
      vec3 c = col * (.55 + .6 * g + .25 * g2); c *= .3 + .7 * pow(mu, .5); c += col * .25 * pow(1. - mu, 3.); gl_FragColor = vec4(c * 1.05, 1.); }` });
const STARS = {}; let x = 0, prevR = 0;
DATA.forEach(([id, name, r, col], i) => { if (i) x += prevR + Math.max(r, prevR) * .35 + r; const g = new THREE.Group(); g.position.set(x, 0, 0); ST.add(g);
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), starMat(col)); g.add(m); const halo = sprite(TEX.glowY, r * 4.2, true, .3); halo.material.color.set(col); g.add(halo); const halo2 = sprite(TEX.glowY, r * 2.4, true, .22); halo2.material.color.set('#ffffff'); g.add(halo2);
  STARS[id] = { g, m, r, x, name, col, halo }; prevR = r; });
// Earth next to the Sun for scale
const earth = new THREE.Mesh(new THREE.SphereGeometry(.00917 * 6, 24, 16), new THREE.MeshBasicMaterial({ color: '#4a8aff' })); earth.position.set(-1.35, 0, 0); ST.add(earth);
// planet orbits (radii in Suns: 1 AU = 215 R_sun), drawn around a big star
const ORB = [['MERCURY', 83], ['VENUS', 155], ['EARTH', 215], ['MARS', 327], ['JUPITER', 1118], ['SATURN', 2050]];
const orbitG = new THREE.Group(); ST.add(orbitG); const orbitM = ORB.map(([n, r]) => { const m = new THREE.Mesh(new THREE.RingGeometry(r * .994, r * 1.006, 256), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false })); m.renderOrder = 5; orbitG.add(m); return m; });
const lightDot = sprite(TEX.glowC, 1, true, 0); lightDot.material.color.set('#ffffff'); lightDot.material.depthTest = false; lightDot.renderOrder = 6; ST.add(lightDot);

let FOCUS = 'sun', CAMD = 6;
const frame = (id, k = 5.4) => STARS[id].r * k;   // camera distance that makes a star fill ~70% of the width
RESETS.push((c, sh) => {
  const on = isMine(); if (!on) return; if (sh.loc !== 'STARS') return;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.shadowMap.enabled = false; bloom.strength = .4; bloom.threshold = .82; bloom.radius = .6; scene.fog = null;
  Object.values(STARS).forEach(s => { s.m.material.uniforms.time.value = c.t; s.g.rotation.y = c.t * .05; });
  const id = { sintro: 'st218', send: 'st218' }[c.o.scene] || c.o.scene.slice(1), st = STARS[id] || STARS.st218, dd = st.r * (c.o.scene === 'send' ? 9 : 6); camera.near = Math.max(.002, dd * .001); camera.far = dd * 60 + 20000;
  orbitM.forEach(m => m.material.opacity = 0); lightDot.material.opacity = 0;
});
// camera: look at a star from straight ahead; near/far follow the zoom so depth stays precise
function starCam(c, id, k0, k1, ox = 0) { const s = STARS[id], k = lerp(k0, k1, eio(c.p)), d = s.r * k; if (id === FOCUS || (FOCUS === null && id === 'st218') || (FOCUS === 'end' && id === 'st218')) { BG.position.set(s.x + ox * s.r, 0, d); BG.scale.setScalar(d * 40); } return { p: [s.x + ox * s.r, s.r * .05, d], at: [s.x + ox * s.r, 0, 0], fov: 50 }; }
const STAR_SHOTS = ['sun', 'sirius', 'pollux', 'arcturus', 'aldebaran', 'rigel', 'antares', 'betelgeuse', 'st218'];
Object.assign(SHOTS, {
  sintro: { loc: 'STARS', aperture: 0, cam: c => starCam(c, 'st218', 7.5, 5.2), fx: c => { FOCUS = null; } },
  ssun: { loc: 'STARS', aperture: 0, cam: c => { const s = STARS.sun; const k = c.ch(1) > 0 ? lerp(5.4, 1.6, eio(clamp(c.ch(1) / 1.6))) : 5.4; const ox = c.ch(1) > 0 ? lerp(0, -1.2, eio(clamp(c.ch(1) / 1.6))) : 0; return starCam(c, 'sun', k, k, ox); }, fx: c => { FOCUS = 'sun'; },
    ov: c => { if (c.ch(1) <= .8) return ''; const q = project(world('STARS', earth.position.x, earth.position.y, 0)), k = clamp((c.ch(1) - .8) / .3); return `<g opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="16" fill="none" stroke="#fff" stroke-width="2"/><line x1="${f1(q.x)}" y1="${f1(q.y - 16)}" x2="${f1(q.x)}" y2="${f1(q.y - 70)}" stroke="#fff" stroke-width="2"/><text x="${f1(q.x)}" y="${f1(q.y - 80)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="14" fill="#fff" letter-spacing="2">EARTH</text></g>`; } },
  ...Object.fromEntries(STAR_SHOTS.slice(1).map(id => ['s' + id, { loc: 'STARS', aperture: 0, cam: c => starCam(c, id, id === 'st218' ? 4.2 : 5.6, id === 'st218' ? 3.6 : 5.0, id === 'antares' || id === 'st218' ? 0 : -.35), fx: c => { FOCUS = id; } }])),
  send: { loc: 'STARS', aperture: 0, noCap: false, cam: c => { const s = STARS.st218, k = lerp(3.6, 9, eio(clamp(c.lt / 2))); return starCam(c, 'st218', k, k, lerp(0, -1.6, eio(clamp(c.lt / 2)))); }, fx: c => { FOCUS = 'end'; },
    ov: c => { const k = clamp((c.lt - .8) / .4); if (k <= 0) return ''; const q = project(world('STARS', STARS.sun.x, 0, 0)); return `<g opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${f1(18 + 6 * Math.sin(c.t * 4))}" fill="none" stroke="${ORANGE}" stroke-width="3"/><line x1="${f1(q.x)}" y1="${f1(q.y + 24)}" x2="${f1(q.x)}" y2="${f1(q.y + 90)}" stroke="${ORANGE}" stroke-width="2"/><text x="${f1(q.x)}" y="${f1(q.y + 112)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="15" fill="${ORANGE}" letter-spacing="2">THE SUN</text></g>`; },
    post: c => { const a = c.lt - (c.d - 2.4); if (a <= 0) return ''; const bar = eio(clamp(a / .8)), gap = lerp(512, 70, bar), t1 = clamp((a - .6) / .5), t2 = clamp((a - 1.1) / .5); const S = (y, txt, size, fill, op, it) => `<text x="288" y="${y}" text-anchor="middle" font-family="EBG" font-weight="500" ${it ? 'font-style="italic"' : ''} font-size="${size}" fill="${fill}" opacity="${op.toFixed(2)}">${txt}</text>`;
      return `<rect width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/><rect y="${f1(512 + gap)}" width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/>` + S(372, 'Every star, ranked by size.', 33, '#fff', t1) + S(664, 'Which one surprised you?', 24, ORANGE, t2, true); } },
});
// orbit overlays on Antares (swallows Mars) and Stephenson 2-18 (past Saturn); light circling St 2-18
const oldA = SHOTS.santares.fx, oldS = SHOTS.sst218.fx;
SHOTS.santares.fx = c => { oldA(c); const s = STARS.antares, k = sm(0, .8, c.ch(1)); orbitG.position.set(s.x, 0, s.r * 1.05); orbitM.forEach((m, i) => { m.material.opacity = i < 4 ? k * .9 : 0; m.material.color.set(i === 3 ? '#ff9a3c' : '#ffffff'); m.scale.setScalar(1); }); };
SHOTS.santares.ov = c => { const k = sm(0, .8, c.ch(1)); if (k <= 0) return ''; const s = STARS.antares; const q = project(world('STARS', s.x + 327, 0, s.r * 1.05)); return `<text x="${f1(Math.min(q.x + 8, 520))}" y="${f1(q.y - 8)}" font-family="Inter" font-weight="800" font-size="14" fill="${ORANGE}" opacity="${k.toFixed(2)}" letter-spacing="2" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.9))">MARS' ORBIT</text>`; };
SHOTS.sst218.fx = c => { oldS(c); const s = STARS.st218, k = sm(0, .8, c.ch(1)); orbitG.position.set(s.x, 0, s.r * 1.05); orbitM.forEach((m, i) => { m.material.opacity = k * (i === 5 ? 1 : .55); m.material.color.set(i === 5 ? '#ff9a3c' : '#ffffff'); });
  const L = c.ch(2) > 0 ? c.ch(2) : -1; if (L > 0) { const a = L * 1.4, R = s.r * 1.02; lightDot.position.set(s.x + Math.cos(a) * R, Math.sin(a) * R, s.r * 1.05); lightDot.scale.setScalar(s.r * .12); lightDot.material.opacity = 1; } };
SHOTS.sst218.ov = c => { let o = ''; const s = STARS.st218, k = sm(0, .8, c.ch(1)); if (k > 0) { const q = project(world('STARS', s.x + 2050 * .7071, 2050 * .7071, s.r * 1.05)); o += `<text x="${f1(Math.min(q.x, 500))}" y="${f1(q.y - 10)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="14" fill="${ORANGE}" opacity="${k.toFixed(2)}" letter-spacing="2" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.9))">SATURN'S ORBIT</text>`; }
  if (c.ch(2) > 0) { const hrs = Math.min(c.ch(2) / 3.2, 1) * 8.7; o += `<g transform="translate(288 250)" opacity="${clamp(c.ch(2) / .3).toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.9))"><text text-anchor="middle" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="2">LIGHT, ONE LAP</text><text y="40" text-anchor="middle" font-family="Inter" font-weight="800" font-size="36" fill="#fff">${Math.floor(hrs)}h ${String(Math.floor((hrs * 60) % 60)).padStart(2, '0')}m</text></g>`; } return o; };
// ---------- HUD ----------
GLOBAL_OV.push((t, c, sh) => {
  if (!isMine() || sh.loc !== 'STARS' || !FOCUS || FOCUS === 'end') return ''; const i = STAR_SHOTS.indexOf(FOCUS), d = DATA[i], s = STARS[FOCUS], k = clamp(c.lt / .3);
  const big = d[2] === 1 ? '1×' : d[2] < 10 ? `${d[2]}×` : `${Math.round(d[2]).toLocaleString('en-US')}×`;
  return `<g transform="translate(26 392)" opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))">
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="14" fill="${ORANGE}" letter-spacing="2.4">#${i + 1} · ${d[1]}</text>
    <text x="0" y="22" font-family="Inter" font-weight="800" font-size="11" fill="#fff" fill-opacity=".8" letter-spacing="2">WIDTH, IN SUNS</text>
    <text x="0" y="66" font-family="Inter" font-weight="800" font-size="44" fill="#fff">${big}</text>
    <text x="0" y="90" font-family="Inter" font-weight="800" font-size="13" fill="${d[3]}" letter-spacing="1.4">${d[4]}</text>
    <text x="0" y="110" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">DISTANCE <tspan fill="#8ff3ff">${d[5]}</tspan></text></g>`
    + `<g transform="translate(540 290)" opacity="${(k * .9).toFixed(2)}">${STAR_SHOTS.map((id, j) => `<circle cx="0" cy="${j * 30}" r="${j === i ? 11 : 6}" fill="${j === i ? ORANGE : j < i ? '#fff' : 'rgba(255,255,255,.35)'}"/>`).join('')}</g>`;
});
window.__stars = true;
