// "Born on Mars" upgrade pass: camera choreography on every line, kinetic number slams, a livelier world,
// a real dust storm, a richer intro. Loaded after mars.js; overrides its shot cameras and adds effects.
const E = window.ENG;
const { THREE, scene, LOC, SHOTS, RESETS, GLOBAL_OV, toon, glow, ink, box, cyl, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng } = E;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1);
const MARS = LOC.MARS, HOME = LOC.HOME, GLOBE = LOC.GLOBE;

// ---------- camera keys: a new move on every caption chunk, eased handoffs, constant drift ----------
function beats(keys, blend = .55) {
  return c => {
    const T = keys.map(K => K.k == null || K.k < 0 ? 0 : Math.max(0, c.o.chunks[Math.min(K.k, c.o.chunks.length - 1)].t0 - c.o.t0 - .12));
    const seg = (j, lt) => { const K = keys[j], t0 = T[j], t1 = j + 1 < keys.length ? T[j + 1] : c.d, u = clamp((lt - t0) / Math.max(t1 - t0, .3)), e = K.ease === 'in' ? u * u : eio(u);
      return { p: P(K.p, K.p2 || K.p, e), at: P(K.a, K.a2 || K.a, e), fov: lerp(K.fov || 44, K.fov2 || K.fov || 44, e), roll: lerp(K.roll || 0, K.roll2 || K.roll || 0, e) }; };
    let j = 0; for (let q = 0; q < keys.length; q++) if (c.lt >= T[q]) j = q;
    const cur = seg(j, c.lt);
    if (j > 0 && c.lt - T[j] < blend) { const pr = seg(j - 1, T[j]), k = eio((c.lt - T[j]) / blend); return { p: P(pr.p, cur.p, k), at: P(pr.at, cur.at, k), fov: lerp(pr.fov, cur.fov, k), roll: lerp(pr.roll, cur.roll, k) }; }
    return cur;
  };
}
const set = (name, keys) => { SHOTS[name].cam = beats(keys); };
set('sky', [
  { k: 0, p: [-1.9, 2.8, -1.6], p2: [-2.0, 2.4, -2.1], a: [-2.2, 1.3, -3.2], fov: 46 },
  { k: 1, p: [-3.3, 1.7, -1.5], p2: [-3.0, 1.8, -1.1], a: [-.6, 2.3, -5.8], a2: [-.2, 2.4, -5.8], fov: 46 },
  { k: 2, p: [-.7, 2.0, -2.6], p2: [-.15, 2.3, -4.3], a: [0, 2.35, -5.86], fov: 44, fov2: 38 }]);
set('bounce', [
  { k: 0, p: [2.5, 1.5, 3.0], p2: [1.7, 1.3, 2.3], a: [2.1, 1.0, -.4], fov: 46 },
  { k: 1, p: [3.3, .45, 1.3], p2: [2.6, .4, 1.0], a: [1.7, .9, -.4], fov: 48 },
  { k: 2, p: [1.4, 1.1, 3.0], p2: [-2.6, 1.2, 3.0], a: [.8, 1.1, -.4], a2: [-2.2, 1.1, -.4], fov: 48 }]);
set('bday', [
  { k: 0, p: [-2.6, 2.3, 2.4], p2: [-1.3, 2.0, 2.8], a: [-.4, 1.3, -1], fov: 44 },
  { k: 1, p: [-.3, 2.9, 1.9], p2: [.4, 3.0, 1.6], a: [0, 1.2, -1], fov: 44 },
  { k: 2, p: [2.5, 1.5, 2.1], p2: [1.6, 1.45, 2.5], a: [-.5, 1.15, -1], fov: 44 }]);
set('sleep', [
  { k: 0, p: [1.3, 1.8, .9], p2: [2.0, 1.55, -.1], a: [3.3, 1.1, -2.7], fov: 42 },
  { k: 1, p: [3.6, 2.3, -1.4], p2: [3.85, 2.55, -2.3], a: [4.3, 2.7, -4.1], fov: 40 }]);
set('outside', [
  { k: 0, p: [5.6, 1.7, 12.8], p2: [4.4, 1.5, 11.0], a: [0, 1.3, 5.2], a2: [.3, 1.2, 6], fov: 46 },
  { k: 1, p: [-3.2, .45, 9.4], p2: [-2.3, .55, 8.4], a: [.6, 1.3, 6.4], fov: 48 },
  { k: 2, p: [1.9, 1.35, 10.6], p2: [1.25, 1.2, 9.4], a: [.9, 1.0, 7.6], fov: 42 }]);
set('night', [
  { k: 0, p: [3.7, 1.0, 17.6], p2: [3.3, .95, 16.2], a: [2.9, 1.6, 12.2], a2: [2.2, 3.5, 6], fov: 50 },
  { k: 1, p: [3.3, .95, 16.2], p2: [3.1, .95, 15.9], a: [-4, 18, -25], fov: 50 },
  { k: 2, p: [3.1, .95, 15.9], p2: [3.0, .95, 15.7], a: [1.5, 13, -28], fov: 50, fov2: 44 },
  { k: 3, p: [3.0, .95, 15.7], a: [1.3, 12.6, -28], fov: 44, fov2: 36 }]);
set('call', [
  { k: 0, p: [1.0, 1.5, 1.9], p2: [.2, 1.6, 1.0], a: [-2.8, 1.5, -2.9], fov: 46 },
  { k: 1, p: [-2.4, 1.8, -1.0], p2: [-2.95, 1.95, -2.2], a: [-4.0, 2.2, -4.2], fov: 44 }]);
set('storm', [
  { k: 0, p: [26, 8, 34], p2: [20, 6, 26], a: [0, 4, -10], fov: 46 },
  { k: 1, p: [9, 1.6, 19], p2: [6.5, 1.5, 15], a: [0, 6, -60], fov: 50 },
  { k: 2, p: [-2, 1.5, 14], p2: [-1.5, 1.5, 12.5], a: [0, 14, -60], fov: 50 },
  { k: 3, p: [3.2, 2.1, 10], p2: [2.4, 2.3, 8.4], a: [0, 2.2, 3.4], fov: 44 }]);
set('leave', [
  { k: 0, p: [11, 1.8, 20], p2: [13, 2.0, 18], a: [17.2, 1.6, 11.6], fov: 46 },
  { k: 1, p: [22.5, .9, 15.5], p2: [23.2, 1.1, 13.8], a: [20, 6.5, 8], fov: 50 },
  { k: 2, p: [15.8, 1.8, 14.8], p2: [16.2, 1.7, 13.9], a: [17.2, 1.7, 11.6], fov: 44 },
  { k: 3, p: [16.2, 1.7, 13.9], a: [17.2, 1.65, 11.6], fov: 44, fov2: 34 }]);
set('sunset', [
  { k: 0, p: [-11.3, 1.25, -3.1], p2: [-11.5, 1.35, -2.7], a: [-12, 1.2, -6.2], fov: 44 },
  { k: 1, p: [-13.7, 1.0, -4.6], p2: [-13.3, 1.1, -3.9], a: [-12, 1.35, -6], fov: 44 },
  { k: 2, p: [-12.3, 1.2, -3.5], p2: [-12.9, 2.4, -1.2], a: [-11.6, 1.5, -8], a2: [12, 5, -80], fov: 44 },
  { k: 3, p: [-12.9, 2.4, -1.2], p2: [-16, 5, 8], a: [12, 5, -80], fov: 46 }]);

// ---------- kinetic number slams, timed to the spoken word ----------
const SLAMS = [
  { scene: 'bounce', word: '38%', text: '38%', sub: "OF EARTH'S GRAVITY", col: '#ff7a3c' },
  { scene: 'bday', word: '687', text: '687', sub: 'DAYS = 1 BIRTHDAY', col: '#ffc83d' },
  { scene: 'sleep', word: 'forty', text: '+40 MIN', sub: 'EVERY SINGLE DAY', col: '#62d5ff' },
  { scene: 'outside', word: 'hundred', text: '100×', sub: 'THINNER AIR', col: '#62d5ff' },
  { scene: 'call', word: '22', text: '22 MIN', sub: 'ONE WAY', col: '#ffc83d' },
];
GLOBAL_OV.push((t, c) => {
  const ep = E.ep(); let o = '';
  for (const S of SLAMS) {
    if (c.o.scene !== S.scene) continue;
    const w = ep.words.find(x => x.text.toLowerCase().startsWith(S.word.toLowerCase()) && x.start >= c.o.t0 - .05 && x.start < c.o.t1); if (!w) continue;
    const a = t - w.start; if (a < 0 || a > 1.35) continue;
    const k = Math.min(1.0, a < .5 ? E.spring(a / .3 * .9) : 1), out = clamp((a - 1.05) / .3), sc = lerp(2.4, 1, Math.min(k, 1)) * (1 - out * .3), op = 1 - out, sh = a < .25 ? Math.sin(a * 120) * 6 * (1 - a / .25) : 0;
    const T = (dx, dy, fill, extra = '') => `<text x="${dx}" y="${dy}" text-anchor="middle" font-family="Anton" font-size="138" fill="${fill}" ${extra} letter-spacing="2">${S.text}</text>`;
    o += `<g transform="translate(${f1(288 + sh)} 500) rotate(-5) scale(${sc.toFixed(3)})" opacity="${op.toFixed(2)}">` + T(-5, 3, '#ff2d55', 'opacity=".7"') + T(5, -3, '#22d3ee', 'opacity=".7"') + T(0, 0, S.col, 'stroke="#15151c" stroke-width="12" stroke-linejoin="round" paint-order="stroke" style="paint-order:stroke"') +
      `<g transform="translate(0 56)"><rect x="${-S.sub.length * 9.6 - 16}" y="-20" width="${S.sub.length * 19.2 + 32}" height="40" rx="8" fill="#15151c"/><text y="9" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="26" fill="#fff" letter-spacing="2">${S.sub}</text></g></g>`;
  }
  return o;
});

// ---------- a livelier Mars ----------
{ // rover
  const rv = new THREE.Group(); MARS.add(rv);
  box(1.6, .5, 1.0, '#f4f1ea', 0, .75, 0, rv); box(.7, .35, .9, '#2f6fed', -.3, 1.15, 0, rv); cyl(.03, .03, .9, '#555', .55, 1.4, .3, rv, 6, false);
  const dish = new THREE.Mesh(new THREE.CircleGeometry(.22, 16), toon('#dfe6ee', { side: THREE.DoubleSide })); dish.position.set(.55, 1.85, .3); rv.add(dish);
  const wheels = []; for (const [x, z] of [[-.6, .55], [0, .6], [.6, .55], [-.6, -.55], [0, -.6], [.6, -.55]]) { const w = cyl(.26, .26, .2, '#2b3442', x, .3, z, rv, 14); w.rotation.x = Math.PI / 2; wheels.push(w); }
  RESETS.push(c => { const a = c.t * .12; rv.position.set(Math.cos(a) * 11, .05, Math.sin(a) * 11 + 2); rv.rotation.y = -a - Math.PI / 2; wheels.forEach(w => w.rotation.y = c.t * 4); });
}
{ // radar dish, comms mast with blinking beacons, flag
  const mast = new THREE.Group(); mast.position.set(-6.5, 0, 3); MARS.add(mast);
  cyl(.08, .12, 4.2, '#9aa6b5', 0, 2.1, 0, mast, 8); const dish = new THREE.Group(); dish.position.y = 4.3; mast.add(dish);
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 10, 0, TAU, 0, Math.PI / 3), toon('#f4f1ea', { side: THREE.DoubleSide })); bowl.rotation.x = Math.PI * .65; dish.add(bowl); ink(bowl, .02);
  const bea = []; [[-6.5, 4.9, 3], [0, 4.25, 0], [8, 3.0, -3], [20, 10.9, 8]].forEach(([x, y, z], i) => { const s = sprite(TEX.glowR, 1.4, true, 0); s.position.set(x, y, z); MARS.add(s); bea.push(s); });
  const flagT = canvasTex(256, 160, (g) => { g.fillStyle = '#ff7a3c'; g.fillRect(0, 0, 256, 160); g.fillStyle = '#fff'; g.beginPath(); g.arc(90, 80, 40, 0, 7); g.fill(); g.fillStyle = '#ff7a3c'; g.beginPath(); g.arc(104, 72, 34, 0, 7); g.fill(); g.strokeStyle = '#15151c'; g.lineWidth = 10; g.strokeRect(0, 0, 256, 160); });
  cyl(.04, .04, 3, '#dfe6ee', 3.4, 1.5, 6.2, MARS, 6); const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .8, 8, 1), new THREE.MeshBasicMaterial({ map: flagT, side: THREE.DoubleSide })); flag.position.set(4.05, 2.6, 6.2); MARS.add(flag);
  const fp0 = flag.geometry.attributes.position.array.slice();
  RESETS.push(c => { dish.rotation.y = c.t * .6; bea.forEach((s, i) => s.material.opacity = (Math.sin(c.t * 3 + i * 1.7) > .55 ? 1 : .08)); const pa = flag.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const x = fp0[i * 3]; pa.setZ(i, Math.sin(c.t * 2.2 + x * 4) * .08 * (x + .65)); } pa.needsUpdate = true; });
}
// floating dust around the camera on Mars, and haze for depth
const motes = []; { const r = rng(61); for (let i = 0; i < 70; i++) { const s = sprite(TEX.glowY, .06 + r() * .08, true, .45); s.material.color.set('#ffd9a8'); s.userData = { x: (r() - .5) * 10, y: r() * 4, z: (r() - .5) * 10, ph: r() * 6 }; MARS.add(s); motes.push(s); } }
const homeMotes = []; { const r = rng(62); for (let i = 0; i < 50; i++) { const s = sprite(TEX.glowY, .04 + r() * .05, true, .5); s.userData = { x: (r() - .5) * 6, y: .5 + r() * 3, z: -5 + r() * 6, ph: r() * 6 }; HOME.add(s); homeMotes.push(s); } }
// light shaft from the home window
const shaftT = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,214,150,.55)'); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const shaft = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.5), new THREE.MeshBasicMaterial({ map: shaftT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); shaft.position.set(0, 1.4, -3.6); shaft.rotation.x = -.95; HOME.add(shaft);
RESETS.push((c, sh) => {
  const cam = E.camera.position, L = MARS.position;
  motes.forEach(s => { const u = s.userData; s.position.set(cam.x - L.x + u.x + Math.sin(c.t * .4 + u.ph) * .5, Math.max(.2, cam.y - 1.5 + u.y + Math.sin(c.t * .3 + u.ph) * .3), cam.z + u.z + Math.cos(c.t * .35 + u.ph) * .5); });
  homeMotes.forEach(s => { const u = s.userData; s.position.set(u.x + Math.sin(c.t * .25 + u.ph) * .3, u.y + Math.sin(c.t * .2 + u.ph) * .2, u.z); });
  shaft.visible = !['sleep', 'sky'].includes(c.o.scene); shaft.material.opacity = .28 + .06 * Math.sin(c.t * .7);
  motes.forEach(m => m.material.opacity = c.o.scene === 'night' ? .18 : .45);
  if (sh.loc === 'MARS' && !['storm', 'night'].includes(c.o.scene)) scene.fog = new THREE.FogExp2(new THREE.Color(c.o.scene === 'sunset' || c.o.scene === 'mcard' ? '#6a5a70' : '#d9a46e'), .006);
});
// ---------- a real dust storm ----------
const wallT = canvasTex(512, 256, (g, w, h) => { const r = rng(5); for (let i = 0; i < 260; i++) { const x = r() * w, y = h * .25 + r() * h * .75, s = 20 + r() * 60; const gr = g.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, `rgba(${150 + r() * 40 | 0},${90 + r() * 30 | 0},${50 + r() * 20 | 0},.9)`); gr.addColorStop(1, 'rgba(140,90,50,0)'); g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2); } });
const walls = []; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(420, 90), new THREE.MeshBasicMaterial({ map: wallT, transparent: true, depthWrite: false, color: i % 2 ? '#c08a58' : '#a06a3c' })); m.visible = false; MARS.add(m); walls.push(m); }
RESETS.push(() => walls.forEach(m => m.visible = false));
const stormFx = SHOTS.storm.fx;
SHOTS.storm.fx = c => { stormFx(c); const k = eio(clamp(c.lt / (c.d * .8))); walls.forEach((m, i) => { m.visible = true; m.position.set(Math.sin(c.t * .2 + i) * 10, 40 + i * 6 - 25 * (1 - k), lerp(-260, -20, k) - i * 18 + Math.sin(c.t * .5 + i) * 4); m.material.opacity = .95; }); };
SHOTS.storm.kick = c => .012 + .02 * clamp(c.lt / c.d);
SHOTS.storm.ov = c => { const k = eio(clamp(c.lt / (c.d * .8))), r = rng(Math.floor(c.t * 24)); let o = `<rect width="576" height="1024" fill="#7a4a24" opacity="${(k * .22).toFixed(2)}"/>`; for (let i = 0; i < 40; i++) { const y = r() * 1024, x = r() * 700 - 60, L = 80 + r() * 220; o += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - L)}" y2="${f1(y + L * .12)}" stroke="#f0c48c" stroke-width="${f1(1 + r() * 2.5)}" opacity="${(k * .45).toFixed(2)}" stroke-linecap="round"/>`; } return o; };
// ---------- squash and stretch on the baby's bounces ----------
const bounceSet = SHOTS.bounce.set;
SHOTS.bounce.set = c => { const L = bounceSet(c), hop = .95, n = Math.max(0, c.ch(1)) / hop, f = n % 1; if (c.ch(1) > 0) { const land = Math.max(0, 1 - Math.min(f, 1 - f) / .12); L[0].sx = 1 + .18 * land; L[0].sy = 1 - .2 * land + .12 * Math.sin(f * Math.PI) * (1 - land); } return L; };
// ---------- intro: nicer Earth, clouds, launch smoke, entry flames ----------
{
  const earthM = GLOBE.children.find(m => m.isGroup && m.children[0] && m.children[0].geometry && m.children[0].geometry.parameters.radius === 10);
  const eT = canvasTex(1024, 512, (g, w, h) => { const oc = g.createLinearGradient(0, 0, 0, h); oc.addColorStop(0, '#1f5fb8'); oc.addColorStop(.5, '#2a7fd6'); oc.addColorStop(1, '#1f5fb8'); g.fillStyle = oc; g.fillRect(0, 0, w, h); const q = rng(19);
    const blob = (x, y, rx, ry) => { g.beginPath(); for (let a = 0; a < 7; a += .4) { const rr = 1 + (q() - .5) * .5; g.lineTo(x + Math.cos(a) * rx * rr, y + Math.sin(a) * ry * rr); } g.closePath(); g.fill(); };
    [[180, 170, 120, 80], [250, 330, 70, 110], [520, 160, 90, 70], [560, 300, 80, 120], [760, 190, 170, 90], [860, 360, 70, 50]].forEach(([x, y, rx, ry]) => { g.fillStyle = '#e8d29a'; blob(x, y, rx * 1.08, ry * 1.08); g.fillStyle = '#4fb46e'; blob(x, y, rx, ry); g.fillStyle = '#2f8f55'; blob(x + 10, y + 10, rx * .5, ry * .45); });
    g.fillStyle = '#f4f8ff'; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26); });
  if (earthM) earthM.children[0].material.map = eT;
  const cT = canvasTex(1024, 512, (g, w, h) => { const q = rng(29); g.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 110; i++) { g.beginPath(); g.ellipse(q() * w, h * .1 + q() * h * .8, 30 + q() * 90, 5 + q() * 12, (q() - .5) * .4, 0, 7); g.fill(); } });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(10.25, 48, 32), new THREE.MeshLambertMaterial({ map: cT, transparent: true, depthWrite: false })); GLOBE.add(clouds);
  const rim = sprite(TEX.glowC, 27, true, .35); GLOBE.add(rim);
  const smoke = []; for (let i = 0; i < 26; i++) { const s = sprite(TEX.smoke, 1, false, 0); GLOBE.add(s); smoke.push(s); }
  const flames = sprite(TEX.glowO, 6, true, 0); GLOBE.add(flames);
  const gfx = SHOTS.globe.fx;
  SHOTS.globe.fx = c => { gfx(c); clouds.rotation.y = c.t * .4; const s = window.__introState || null; };
  const gov = SHOTS.globe.ov;
  RESETS.push(c => { smoke.forEach(s => s.material.opacity = 0); flames.material.opacity = 0; });
  // launch smoke burst and entry glow, driven by the pin's position after the base intro logic ran
  const pinObj = GLOBE.children.find(m => m.isGroup && m !== earthM && m.children.length === 3);
  SHOTS.globe.fx = c => { gfx(c); clouds.rotation.y = c.t * .4;
    const launch = Math.max(c.che(0) + .12, .9), a = c.lt - launch;
    if (a > 0 && a < 1.6 && pinObj) { const r = rng(4), base = window.__pinLaunch || (window.__pinLaunch = pinObj.position.clone()); smoke.forEach(s => { const an = r() * TAU, sp = .6 + r(); s.position.set(base.x + Math.cos(an) * a * 3 * sp, base.y + Math.sin(an) * a * 3 * sp, base.z + 1); const sc = 1 + a * 4 * sp; s.scale.set(sc, sc, 1); s.material.opacity = .55 * (1 - a / 1.6); }); }
    if (a <= 0) window.__pinLaunch = null;
    const fp = a > 0 ? clamp(a / Math.max(c.d - launch, .3)) : 0;
    if (fp > .72 && pinObj) { flames.position.copy(pinObj.position); const k = clamp((fp - .72) / .15); flames.material.opacity = k * (.8 + .2 * Math.sin(c.t * 30)); flames.scale.set(4 + k * 6, 4 + k * 6, 1); }
  };
  SHOTS.globe.kick = c => { const a = c.lt - Math.max(c.che(0) + .12, .9); return a > 0 && a < .5 ? .25 * (1 - a / .5) : 0; };
}
// ---------- fixes ----------
// keep the sunset walk clear of rocks the camera would pass through
MARS.children.filter(m => m.isMesh && m.geometry && m.geometry.type === 'DodecahedronGeometry').forEach(m => { if (m.position.x < -7 && m.position.x > -19 && m.position.z > -10 && m.position.z < 10) m.visible = false; });
window.__mars2 = true;
