// "What if you were born on Uranus": a floating city above an endless cloud sea, blocky voxel people,
// soft realistic light (no ink outlines), a persistent HUD clock, first-person hands, and a sun that
// circles the sky for 42 years before it finally sets.
while (!window.__mars || !window.__mars2 || !window.ENG) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng } = E;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c', CY = '#8ff3ff';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
scene.add(camera);

// ---------- materials ----------
const MC = new Map();
const std = (c, o = {}) => { const k = c + JSON.stringify(o); if (!MC.has(k)) MC.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: .88, metalness: 0, ...o })); return MC.get(k); };
const BOX = new THREE.BoxGeometry(1, 1, 1);
function blk(w, h, d, c, x, y, z, parent, cast = true) { const m = new THREE.Mesh(BOX, typeof c === 'string' ? std(c) : c); m.scale.set(w, h, d); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m; }

// ---------- voxel people ----------
const SKINS = ['#f3cfae', '#e3b089', '#c98e62', '#9a6643', '#6b4430'], HAIRS = ['#2b1d14', '#4a2e1b', '#7a4a26', '#c9a15a', '#1a1a1a', '#8a3b1f', '#d8d2c8'];
const SHIRTS = ['#e86f5a', '#3f7bd9', '#f2c14e', '#4caf7a', '#8e6bd6', '#f08fb5', '#f4f1ea', '#2f3b52', '#d9774b', '#6fc3df', '#b84a62', '#5c8f6b'], PANTS = ['#2f3b52', '#4a4f5c', '#3b5b8c', '#6b4f3a', '#22252c', '#7d6a55'];
const faceCache = new Map();
function faceTex(skin, expr) {
  const key = skin + expr; if (faceCache.has(key)) return faceCache.get(key);
  const t = canvasTex(64, 64, (g) => {
    g.fillStyle = skin; g.fillRect(0, 0, 64, 64); const ink = '#21160f', ey = 31;
    if (expr === 'sleep' || expr === 'squint' || expr === 'joy') { g.fillStyle = ink; if (expr === 'joy') { g.lineWidth = 3; g.strokeStyle = ink; [[20, ey], [44, ey]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y + 3, 5, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }); } else { g.fillRect(15, ey + 1, 10, 3); g.fillRect(39, ey + 1, 10, 3); } }
    else { g.fillStyle = ink; const h = expr === 'o' ? 10 : 8; g.fillRect(17, ey - h / 2, 6, h); g.fillRect(41, ey - h / 2, 6, h); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(19, ey - h / 2 + 1, 2, 2); g.fillRect(43, ey - h / 2 + 1, 2, 2); }
    g.fillStyle = 'rgba(45,28,18,.85)';
    if (expr === 'sad' || expr === 'cry') { g.save(); g.translate(20, ey - 10); g.rotate(.32); g.fillRect(-6, -1.5, 12, 3); g.restore(); g.save(); g.translate(44, ey - 10); g.rotate(-.32); g.fillRect(-6, -1.5, 12, 3); g.restore(); }
    else if (expr === 'o') { g.fillRect(14, ey - 14, 12, 3); g.fillRect(38, ey - 14, 12, 3); }
    else if (expr === 'squint') { g.save(); g.translate(20, ey - 8); g.rotate(-.3); g.fillRect(-6, -1.5, 12, 3); g.restore(); g.save(); g.translate(44, ey - 8); g.rotate(.3); g.fillRect(-6, -1.5, 12, 3); g.restore(); }
    else { g.fillRect(14, ey - 11, 12, 3); g.fillRect(38, ey - 11, 12, 3); }
    g.strokeStyle = '#3a1d16'; g.fillStyle = '#5a2320'; g.lineWidth = 2.6; g.lineCap = 'round'; const my = 47;
    if (expr === 'smile' || expr === 'joy') { g.beginPath(); g.arc(32, my - 6, 8, Math.PI * .2, Math.PI * .8); g.stroke(); }
    else if (expr === 'big') { g.beginPath(); g.moveTo(23, my - 3); g.quadraticCurveTo(32, my + 9, 41, my - 3); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(26, my - 3, 12, 2.5); }
    else if (expr === 'sad' || expr === 'cry') { g.beginPath(); g.arc(32, my + 6, 7, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
    else if (expr === 'o') { g.beginPath(); g.ellipse(32, my, 3.5, 5, 0, 0, TAU); g.fill(); }
    else if (expr === 'squint') { g.beginPath(); g.moveTo(25, my); for (let i = 0; i <= 4; i++) g.lineTo(25 + i * 3.5, my + (i % 2 ? -2.5 : 2.5)); g.stroke(); }
    else if (expr !== 'sleep') { g.beginPath(); g.moveTo(28, my); g.lineTo(36, my); g.stroke(); }
    if (expr === 'smile' || expr === 'big' || expr === 'joy') { g.fillStyle = 'rgba(255,110,110,.22)'; g.beginPath(); g.arc(13, 42, 5, 0, TAU); g.arc(51, 42, 5, 0, TAU); g.fill(); }
    if (expr === 'cry') { g.fillStyle = 'rgba(120,200,255,.95)'; g.fillRect(18, ey + 6, 3, 12); g.fillRect(42, ey + 6, 3, 16); }
  });
  t.magFilter = THREE.NearestFilter; faceCache.set(key, t); return t;
}
const PEOPLE = [];
function vox(o = {}) {
  const r = rng(o.seed || 1), pick = a => a[Math.floor(r() * a.length)];
  const skin = o.skin || pick(SKINS), hair = o.hair || pick(HAIRS.slice(0, 6)), shirt = o.shirt || pick(SHIRTS), pants = o.pants || pick(PANTS), simple = !!o.simple;
  const g = new THREE.Group(), legH = .72, tH = .66;
  const legs = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .145, legH, 0); g.add(p); blk(.25, legH, .28, pants, 0, -legH / 2, 0, p); if (!simple) blk(.27, .12, .33, '#2a2522', 0, -legH + .06, .03, p); return p; });
  const body = new THREE.Group(); body.position.y = legH; g.add(body);
  blk(.62, tH, .34, shirt, 0, tH / 2, 0, body);
  const arms = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .405, tH - .07, 0); body.add(p); blk(.19, .55, .23, shirt, 0, -.24, 0, p); if (!simple) blk(.17, .15, .21, skin, 0, -.57, 0, p); return p; });
  const head = new THREE.Group(); head.position.y = tH; body.add(head);
  const fm = new THREE.MeshStandardMaterial({ roughness: .9, map: faceTex(skin, 'neutral') }), skm = std(skin);
  const hb = new THREE.Mesh(BOX, [skm, skm, skm, skm, fm, skm]); hb.scale.setScalar(.58); hb.position.y = .31; hb.castShadow = true; head.add(hb);
  const style = o.style ?? Math.floor(r() * 4);
  blk(.62, .14, .62, hair, 0, .63, -.0, head); blk(.62, style === 2 ? .62 : .36, .14, hair, 0, style === 2 ? .3 : .47, -.25, head);
  if (style !== 3) blk(.62, .1, .16, hair, 0, .55, .24, head);
  if (style === 1) { blk(.12, .3, .5, hair, -.3, .45, -.03, head); blk(.12, .3, .5, hair, .3, .45, -.03, head); }
  if (o.beard) blk(.5, .14, .06, hair, 0, .08, .3, head);
  g.userData = { legs, arms, body, head, fm, skin, expr: 'neutral', hs: 1 };
  g.visible = false; PEOPLE.push(g); return g;
}
function age(p, kind) { const u = p.userData; if (kind === 'baby') { p.scale.setScalar(.42); u.head.scale.setScalar(1.45); } else if (kind === 'kid') { p.scale.setScalar(.64); u.head.scale.setScalar(1.18); } else if (kind === 'teen') { p.scale.setScalar(.88); u.head.scale.setScalar(1.05); } }
// pose: walk (speed), cheer (0..1), wave, nose, hold, look (yaw), up (look up), expr, talk, lean
function pose(p, t, o = {}) {
  const u = p.userData, ph = o.ph || 0, w = o.walk || 0, sw = w ? Math.sin(t * 7.5 * Math.min(w, 1.4) + ph) * .65 : 0;
  u.legs[0].rotation.x = sw; u.legs[1].rotation.x = -sw; u.arms[0].rotation.set(-sw * .8, 0, .06); u.arms[1].rotation.set(sw * .8, 0, -.06);
  u.body.position.y = .72 + (w ? Math.abs(Math.cos(t * 7.5 * Math.min(w, 1.4) + ph)) * .05 : Math.sin(t * 1.6 + ph) * .006); u.body.rotation.set(o.lean || 0, 0, 0);
  if (o.cheer) { const k = o.cheer, j = Math.sin(t * 10 + ph) * .18 * k; u.arms[0].rotation.set(0, 0, -lerp(.06, 2.75, k) + j); u.arms[1].rotation.set(0, 0, lerp(.06, 2.75, k) - j); }
  if (o.wave) { u.arms[1].rotation.set(0, 0, 2.6 + Math.sin(t * 11 + ph) * .35); }
  if (o.nose) { const k = o.nose; u.arms[1].rotation.set(lerp(0, -2.35, k), 0, lerp(-.06, .55, k)); }
  if (o.hold) { u.arms[0].rotation.set(-o.hold, 0, .15); u.arms[1].rotation.set(-o.hold, 0, -.15); }
  if (o.hug) { u.arms[0].rotation.set(-1.3, 0, -.5); u.arms[1].rotation.set(-1.3, 0, .5); }
  if (o.arms) { u.arms[0].rotation.set(...o.arms[0]); u.arms[1].rotation.set(...o.arms[1]); }
  u.head.rotation.set(-(o.up || 0) + (o.down || 0), o.look || 0, o.tilt || 0);
  let ex = o.expr || 'neutral'; if (o.talk) ex = Math.sin(t * 13 + ph) > 0 ? 'big' : 'smile'; if (o.blink !== false && ex !== 'sleep' && ex !== 'joy' && ((t * 1.0 + ph * .37) % 3.3) < .1) ex = ex === 'cry' ? 'cry' : 'sleep';
  if (u.expr !== ex) { u.fm.map = faceTex(u.skin, ex); u.expr = ex; }
}
function put(p, x, y, z, ry, t, o) { p.position.set(x, y, z); p.rotation.set(0, ry || 0, 0); p.visible = true; pose(p, t, o); return p; }

// ---------- the world: sky, cloud sea, city ----------
const U = loc('USKY', 20000), RX = 300;   // nursery room floats at x = RX
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
  uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, low: { value: new THREE.Color() }, sunDir: { value: V(0, .1, -1) }, glowC: { value: new THREE.Color() }, glowK: { value: 1 }, glowW: { value: 8 }, halo: { value: .3 } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform vec3 top, hor, low, glowC, sunDir; uniform float glowK, glowW, halo; varying vec3 vP;
    void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h,0.,1.), .55)) : mix(hor, low, clamp(-h*5.,0.,1.));
      float d = max(dot(normalize(vP), normalize(sunDir)), 0.0); c += glowC * glowK * (pow(d, glowW) + halo * pow(d, 2.5) * (1.0 - clamp(h*2.0,0.,1.)*.5));
      gl_FragColor = vec4(c, 1.0); }` });
const skyM = new THREE.Mesh(new THREE.SphereGeometry(1500, 48, 24), skyMat); skyM.renderOrder = -2; U.add(skyM);
const starsU = (() => { const r = rng(91), pos = []; for (let i = 0; i < 2600; i++) { const u = r() * .98 + .02, a = r() * TAU, R = 1400; pos.push(R * Math.sqrt(1 - u * u) * Math.cos(a), R * u, R * Math.sqrt(1 - u * u) * Math.sin(a)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false })); m.renderOrder = -1; return m; })();
U.add(starsU);
// rings: a thin bright arc across the sky
const ringG = new THREE.Group(); ringG.position.set(0, -260, -520); ringG.rotation.set(0, Math.PI / 2, .5); U.add(ringG);
const ringMats = [];
[[880, 3, .5], [900, 1.6, .35], [925, 7, .7], [948, 2, .4], [985, 14, .85]].forEach(([r0, w, a]) => { const m = new THREE.MeshBasicMaterial({ color: '#dff6ff', transparent: true, opacity: a, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }); const mesh = new THREE.Mesh(new THREE.RingGeometry(r0, r0 + w, 360), m); mesh.renderOrder = -1; ringG.add(mesh); ringMats.push([m, a]); });
// moons
const moonTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(48, 46, 4, 64, 64, 60); gr.addColorStop(0, '#f2f0ea'); gr.addColorStop(.8, '#a9a59c'); gr.addColorStop(1, 'rgba(120,118,110,0)'); g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 60, 0, TAU); g.fill(); const r = rng(4); for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(90,88,80,.35)'; g.beginPath(); g.arc(30 + r() * 70, 30 + r() * 70, 3 + r() * 8, 0, TAU); g.fill(); } });
const MOONS = [['Miranda', V(-210, 820, -560), 26], ['Ariel', V(160, 900, -380), 40], ['Titania', V(-420, 640, -260), 52], ['Oberon', V(380, 700, -620), 46], ['Puck', V(30, 980, -160), 16]].map(([n, p, s]) => { const sp = sprite(moonTex, s, false, 0); sp.position.copy(p); U.add(sp); return { n, p, sp }; });
// sun: a tiny bright star with a halo
const sunCore = sprite(TEX.glowY, 20, true, 1), sunHalo = sprite(TEX.glowY, 70, true, .2), sunBig = sprite(TEX.glowO, 600, true, 0); sunCore.material.color.set('#ffffff'); sunHalo.material.color.set('#e8fbff'); U.add(sunHalo, sunCore, sunBig);
// cloud sea
const CLOUD_Y = -26;
const cloudMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, fog: false,
  uniforms: { time: { value: 0 }, cA: { value: new THREE.Color() }, cB: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: V(0, .1, -1) }, sunC: { value: new THREE.Color() }, flow: { value: 1 }, under: { value: 0 } },
  vertexShader: `varying vec3 wP; void main(){ vec4 w = modelMatrix * vec4(position,1.0); wP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float time, flow, under; uniform vec3 cA, cB, hor, sunDir, sunC; varying vec3 wP;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + vec2(1.7,9.2); a *= .5; } return v; }
    void main(){ vec2 rel = wP.xz - vec2(20000.0, 0.0); vec2 q = rel * .011 + vec2(time * .05 * flow, time * .012);
      float n = fbm(q + fbm(q * 1.6) * .9); float l = n - fbm(q + normalize(sunDir.xz + 1e-4) * .04 + fbm(q * 1.6) * .9);
      float bands = .5 + .5 * sin(rel.y * .0035 + n * 3.0);
      vec3 c = mix(cA, cB, smoothstep(.32, .78, n)); c *= .88 + .2 * bands; c += sunC * clamp(l * 6.0, 0., 1.) * .35;
      float dist = length(wP.xz - cameraPosition.xz); float fog = 1. - exp(-dist * .0011); c = mix(c, hor, clamp(fog, 0., 1.));
      c = mix(c, c * .25, under); gl_FragColor = vec4(c, 1.0); }` });
const cloudSea = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), cloudMat); cloudSea.rotation.x = -Math.PI / 2; cloudSea.position.y = CLOUD_Y; U.add(cloudSea);
const puffs = []; { const r = rng(33); for (let i = 0; i < 130; i++) { const a = r() * TAU, d = 40 + r() * 520, s = 30 + r() * 70; const sp = sprite(TEX.smoke, s, false, .32); sp.position.set(Math.cos(a) * d, CLOUD_Y + 2 + r() * 12, Math.sin(a) * d); sp.userData = { a, d, y: sp.position.y, s, ph: r() * 6 }; U.add(sp); puffs.push(sp); } }
// lights
const sunL = new THREE.DirectionalLight('#f4fbff', 2.2); sunL.castShadow = true; sunL.shadow.mapSize.set(2048, 2048); const sc = sunL.shadow.camera; sc.left = sc.bottom = -34; sc.right = sc.top = 34; sc.near = 1; sc.far = 260; sunL.shadow.bias = -.0006; sunL.shadow.normalBias = .03; sunL.shadow.radius = 4;
const sunT = new THREE.Object3D(); U.add(sunL, sunT); sunL.target = sunT;
const hemi = new THREE.HemisphereLight('#bff4ff', '#2d6b78', 1.1); U.add(hemi);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ---------- the floating city ----------
const CITY = new THREE.Group(); U.add(CITY);
const deckTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#d9d4c7'; g.fillRect(0, 0, w, h); const r = rng(8); for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const k = r(); g.fillStyle = k < .3 ? '#cfc8b8' : k < .6 ? '#ddd8cc' : '#e4e0d6'; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); } });
deckTex.wrapS = deckTex.wrapT = THREE.RepeatWrapping; deckTex.repeat.set(14, 14);
const deck = new THREE.Mesh(new THREE.CylinderGeometry(26, 25.4, 1.2, 64), [new THREE.MeshStandardMaterial({ color: '#9aa4ad', roughness: .7, metalness: .3 }), new THREE.MeshStandardMaterial({ map: deckTex, roughness: .95 }), std('#7f8a94')]);
deck.position.y = -.6; deck.receiveShadow = true; CITY.add(deck);
const plazaRing = new THREE.Mesh(new THREE.RingGeometry(6.5, 7.1, 64), std('#b8ae9a')); plazaRing.rotation.x = -Math.PI / 2; plazaRing.position.y = .01; plazaRing.receiveShadow = true; CITY.add(plazaRing);
const plaza = new THREE.Mesh(new THREE.CircleGeometry(6.5, 64), std('#e9e3d4')); plaza.rotation.x = -Math.PI / 2; plaza.position.y = .012; plaza.receiveShadow = true; CITY.add(plaza);
const under = new THREE.Mesh(new THREE.ConeGeometry(25.4, 17, 48, 1, true), new THREE.MeshStandardMaterial({ color: '#7a8792', roughness: .6, metalness: .45, side: THREE.DoubleSide })); under.rotation.x = Math.PI; under.position.y = -9.7; CITY.add(under);
for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(25.4 - i * 3.4, .18, 6, 64), std('#5f6b75')); m.rotation.x = Math.PI / 2; m.position.y = -1.3 - i * 2.05; CITY.add(m); }
const bulbGeo = new THREE.SphereGeometry(.11, 8, 6);
const rimLights = new THREE.InstancedMesh(bulbGeo, new THREE.MeshBasicMaterial({ color: '#9ff6ff' }), 96); for (let i = 0; i < 96; i++) { const a = i / 96 * TAU; rimLights.setMatrixAt(i, new THREE.Matrix4().makeScale(2.2, 2.2, 2.2).setPosition(Math.cos(a) * 25.6, -1.25, Math.sin(a) * 25.6)); } CITY.add(rimLights);
// railing
{ const n = 140, posts = new THREE.InstancedMesh(BOX, std('#e9eef2', { metalness: .2 }), n); for (let i = 0; i < n; i++) { const a = i / n * TAU; posts.setMatrixAt(i, new THREE.Matrix4().makeScale(.07, 1.05, .07).setPosition(Math.cos(a) * 25.55, .52, Math.sin(a) * 25.55)); } posts.castShadow = true; CITY.add(posts);
  const rail = new THREE.Mesh(new THREE.TorusGeometry(25.55, .06, 6, 160), std('#f4f7f9', { metalness: .3 })); rail.rotation.x = Math.PI / 2; rail.position.y = 1.06; CITY.add(rail);
  const rail2 = rail.clone(); rail2.position.y = .55; CITY.add(rail2); }
// buildings with windows that glow at night
const winTex = (seed, lit) => canvasTex(128, 256, (g, w, h) => { const r = rng(seed); g.fillStyle = lit ? '#000' : '#fff'; g.fillRect(0, 0, w, h); for (let y = 0; y < 7; y++) for (let x = 0; x < 3; x++) { const on = r() < .62; g.fillStyle = lit ? (on ? (r() < .5 ? '#ffcf7a' : '#ffe2a8') : '#000') : '#3d5363'; g.fillRect(14 + x * 38, 14 + y * 35, 24, 22); if (!lit) { g.fillStyle = '#9fb3c0'; g.fillRect(14 + x * 38, 14 + y * 35, 24, 4); } } });
const HOUSE_MATS = [];
const BCOL = ['#efe6d6', '#e9c9a8', '#cfe3d6', '#d8e4ee', '#f0d9c4', '#d9d0e6', '#e6dcc0', '#c9dde0'];
{ const r = rng(12);
  for (let a = 0; a < TAU; a += .31 + r() * .12) {
    const da = Math.atan2(Math.sin(a - (-Math.PI / 2)), Math.cos(a - (-Math.PI / 2)));    // angle from the sun side (-z)
    if (Math.abs(da) < .85) continue;
    const rr = 17.5 + r() * 4, w = 3.6 + r() * 2.6, d = 3.6 + r() * 2.4, h = 3.5 + r() * (Math.abs(da) > 2.2 ? 11 : 7), x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    const seed = Math.floor(r() * 1000), mapT = winTex(seed, false), emT = winTex(seed, true); mapT.wrapS = mapT.wrapT = emT.wrapS = emT.wrapT = THREE.RepeatWrapping; const rep = [Math.max(1, Math.round(w / 2.6)), Math.max(1, Math.round(h / 4))]; mapT.repeat.set(...rep); emT.repeat.set(...rep);
    const col = BCOL[Math.floor(r() * BCOL.length)], m = new THREE.MeshStandardMaterial({ color: col, map: mapT, emissive: '#ffffff', emissiveMap: emT, emissiveIntensity: 0, roughness: .9 }); HOUSE_MATS.push(m);
    const topM = std(col), hm = new THREE.Mesh(BOX, [m, m, topM, topM, m, m]); hm.scale.set(w, h, d); hm.position.set(x, h / 2, z); hm.rotation.y = -a; hm.castShadow = hm.receiveShadow = true; CITY.add(hm);
    blk(w * .4, .8, d * .4, '#b9b2a4', x, h + .4, z, CITY).rotation.y = -a;
    if (r() < .5) { const aw = blk(w * .8, .1, 1, ['#d9774b', '#3f7bd9', '#4caf7a', '#e86f5a'][Math.floor(r() * 4)], x - Math.cos(a) * (d / 2 + .5), 2.6, z - Math.sin(a) * (d / 2 + .5), CITY); aw.rotation.set(0, -a, 0); }
  } }
// trees
const TREES = []; { const r = rng(4); const spots = []; for (let i = 0; i < 16; i++) { const a = r() * TAU, d = 9 + r() * 6; spots.push([Math.cos(a) * d, Math.sin(a) * d]); }
  spots.forEach(([x, z], i) => { const tr = new THREE.Group(); tr.position.set(x, 0, z); CITY.add(tr); const tk = blk(.32, 2.2, .32, '#6b4f3a', 0, 1.1, 0, tr); const cg = new THREE.IcosahedronGeometry(1.5 + r() * .6, 0); const c = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: r() < .5 ? '#5fae5a' : '#4c9a4f', flatShading: true, roughness: .9 })); c.position.y = 3.1; c.castShadow = c.receiveShadow = true; tr.add(c); const c2 = c.clone(); c2.scale.setScalar(.6); c2.position.set(.8, 3.8, .3); tr.add(c2); TREES.push(tr); }); }
// benches + planters
{ const r = rng(6); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .2, x = Math.cos(a) * 8, z = Math.sin(a) * 8; const b = new THREE.Group(); b.position.set(x, 0, z); b.rotation.y = -a + Math.PI / 2; CITY.add(b); blk(1.8, .1, .5, '#a0714d', 0, .48, 0, b); blk(1.8, .45, .08, '#a0714d', 0, .78, -.22, b); blk(.08, .45, .4, '#555', -.8, .23, 0, b); blk(.08, .45, .4, '#555', .8, .23, 0, b); } }
// string lights between poles over the plaza
const BULBS = []; const poles = [];
{ for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .15, x = Math.cos(a) * 12.5, z = Math.sin(a) * 12.5; blk(.12, 5, .12, '#3a3f45', x, 2.5, z, CITY); poles.push(V(x, 4.9, z)); }
  poles.push(V(-6, 4.2, -21.5), V(6, 4.2, -21.5), V(-14, 4.2, -18), V(14, 4.2, -18));
  const pairs = []; for (let i = 0; i < 10; i++) { pairs.push([i, (i + 1) % 10]); pairs.push([i, (i + 4) % 10]); } pairs.push([10, 11], [12, 10], [11, 13], [10, 0], [11, 9], [12, 8], [13, 0]);
  const pts = []; pairs.forEach(([a, b]) => { const A = poles[a], B = poles[b], L = A.distanceTo(B), n = Math.floor(L / .8); for (let k = 1; k < n; k++) { const s = k / n, p = A.clone().lerp(B, s); p.y -= Math.sin(s * Math.PI) * (.5 + L * .04); pts.push(p); } });
  const im = new THREE.InstancedMesh(bulbGeo, new THREE.MeshBasicMaterial({ color: '#ffd38a' }), pts.length); pts.forEach((p, i) => im.setMatrixAt(i, new THREE.Matrix4().setPosition(p))); CITY.add(im); BULBS.push(im);
  const wireG = new THREE.BufferGeometry().setFromPoints(pts); }
// balloons holding the city up
const BALLOONS = []; [[0, 44, 4, 16], [-24, 34, -2, 10], [22, 36, 10, 11], [-4, 38, 26, 9]].forEach(([x, y, z, s], i) => { const g = new THREE.Group(); g.position.set(x, y, z); CITY.add(g); const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshStandardMaterial({ color: i % 2 ? '#f2ede2' : '#eae4f2', roughness: .75 })); m.scale.set(s, s * .72, s); m.castShadow = true; g.add(m); for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.TorusGeometry(s * (1 - k * .0) * Math.cos((k - 2.5) * .18), .08, 6, 48), std('#c9c2b4')); b.rotation.x = Math.PI / 2; b.position.y = Math.sin((k - 2.5) * .18) * s * .72; g.add(b); } BALLOONS.push(g);
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + i, bx = x + Math.cos(a) * s * .6, bz = z + Math.sin(a) * s * .6, ex = Math.cos(a) * 24 * .9 + x * .2, ez = Math.sin(a) * 24 * .9 + z * .2, len = Math.hypot(ex - bx, ez - bz, y - s * .6); const c = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, len, 5), std('#40464d')); c.position.set((bx + ex) / 2, (y - s * .6) / 2, (bz + ez) / 2); c.lookAt(ex, 0, ez); c.rotateX(Math.PI / 2); CITY.add(c); } });
// long tables + cake (birthday)
const TABLES = new THREE.Group(); CITY.add(TABLES);
for (const z of [-11.5, -8]) { blk(12, .1, 1.3, '#f6f3ec', 0, .92, z, TABLES); for (const x of [-5.6, 5.6]) blk(.12, .9, 1.1, '#6b4f3a', x, .45, z, TABLES); for (let i = 0; i < 9; i++) { blk(.4, .03, .4, '#ffffff', -5 + i * 1.25, .98, z + .35, TABLES); blk(.4, .03, .4, '#ffffff', -5 + i * 1.25, .98, z - .35, TABLES); } }
const cake = new THREE.Group(); cake.position.set(.6, .97, -11.5); TABLES.add(cake);
{ const c1 = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 24), std('#f3c6d6')); c1.position.y = .15; c1.castShadow = true; cake.add(c1); const c2 = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .22, 24), std('#fff4f8')); c2.position.y = .41; cake.add(c2); blk(.05, .26, .05, '#62d5ff', 0, .65, 0, cake); }
const flame = sprite(TEX.glowY, .55, true, 1); flame.position.set(0, .86, 0); cake.add(flame);
const cakeL = new THREE.PointLight('#ffc070', 0, 6, 1.6); cakeL.position.set(0, 1.0, 0); cake.add(cakeL);
const confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(.1, .16), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide }), 220); { const cols = ['#ffc83d', '#62d5ff', '#e5484d', '#34d399', '#f59e0b', '#ffffff']; for (let i = 0; i < 220; i++) confetti.setColorAt(i, new THREE.Color(cols[i % 6])); } U.add(confetti);
// first-person hands
const FP = new THREE.Group(); camera.add(FP);
const fpArm = side => { const g = new THREE.Group(); FP.add(g); const sl = blk(.11, .11, .55, '#4b6fb8', 0, 0, .1, g, false); const hd = blk(.1, .1, .12, '#e3b089', 0, 0, -.22, g, false); g.userData = { sl, hd }; return g; };
const fpL = fpArm(-1), fpR = fpArm(1);
// motes / snow / wind streaks / stink / diamonds
const flakes = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: '#e9f8ff', size: .09, transparent: true, opacity: .9, depthWrite: false })); { const r = rng(2), a = []; for (let i = 0; i < 1600; i++) a.push((r() - .5) * 60, r() * 30, (r() - .5) * 60); flakes.geometry.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); flakes.userData.base = a.slice(); } U.add(flakes);
const streaks = []; { for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(14, .22), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })); U.add(m); streaks.push(m); } }
const stink = []; for (let i = 0; i < 16; i++) { const s = sprite(TEX.smoke, 2.4, false, 0); s.material.color.set('#c8e08a'); U.add(s); stink.push(s); }
const DEEP_Y = -140;
const diamonds = new THREE.InstancedMesh(new THREE.OctahedronGeometry(.5, 0), new THREE.MeshStandardMaterial({ color: '#eaffff', emissive: '#7fe6ff', emissiveIntensity: 1.1, roughness: .08, metalness: .6, flatShading: true }), 140); U.add(diamonds);
const glints = []; for (let i = 0; i < 40; i++) { const s = sprite(TEX.glowB, 2, true, 0); U.add(s); glints.push(s); }
const deepLight = new THREE.PointLight('#7fe9ff', 0, 120, 1.2); U.add(deepLight);

// ---------- nursery (a room on the city's edge, with a big window onto the clouds) ----------
const ROOM = new THREE.Group(); ROOM.position.set(RX, 0, 0); U.add(ROOM);
{ const wall = '#dfeee8', floorT = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b98a5e'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#b08155' : '#c29367'; g.fillRect(0, i * 32, w, 30); } }); floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(3, 3);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ map: floorT, roughness: .8 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; ROOM.add(fl);
  blk(9, 3.6, .3, wall, 0, 1.8, 4.4, ROOM); blk(.3, 3.6, 9, wall, -4.4, 1.8, 0, ROOM); blk(.3, 3.6, 9, wall, 4.4, 1.8, 0, ROOM); blk(9, .3, 9, '#f4f1ea', 0, 3.75, 0, ROOM);
  blk(1.7, 3.6, .3, wall, -3.65, 1.8, -4.4, ROOM); blk(1.7, 3.6, .3, wall, 3.65, 1.8, -4.4, ROOM); blk(5.6, .55, .3, wall, 0, .27, -4.4, ROOM); blk(5.6, .7, .3, wall, 0, 3.25, -4.4, ROOM);
  blk(5.7, .12, .5, '#f4f1ea', 0, .6, -4.3, ROOM); for (const x of [-2.8, 0, 2.8]) blk(.1, 2.4, .12, '#f4f1ea', x, 1.75, -4.42, ROOM);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.8, 40), std('#e8a87c')); rug.rotation.x = -Math.PI / 2; rug.position.set(.2, .01, -.6); rug.receiveShadow = true; ROOM.add(rug);
  const crib = new THREE.Group(); crib.position.set(-1.1, 0, -2.3); ROOM.add(crib); blk(1.6, .1, .9, '#f4f1ea', 0, .62, 0, crib); for (let i = 0; i < 9; i++) { blk(.05, .6, .05, '#f4f1ea', -.75 + i * .1875, .95, .43, crib); blk(.05, .6, .05, '#f4f1ea', -.75 + i * .1875, .95, -.43, crib); } blk(1.62, .07, .07, '#f4f1ea', 0, 1.27, .43, crib); blk(1.62, .07, .07, '#f4f1ea', 0, 1.27, -.43, crib); for (const x of [-.8, .8]) blk(.08, 1.3, .9, '#f4f1ea', x, .65, 0, crib); blk(1.5, .12, .8, '#9fd3e6', 0, .73, 0, crib);
  const shelf = blk(1.6, .08, .4, '#a0714d', 3.4, 2.0, 2.2, ROOM); ['#e86f5a', '#3f7bd9', '#f2c14e'].forEach((c, i) => blk(.25, .35, .25, c, 3.0 + i * .4, 2.22, 2.2, ROOM));
  const lamp = new THREE.PointLight('#ffd7a0', 6, 10, 1.5); lamp.position.set(2.5, 2.8, 1.5); ROOM.add(lamp); ROOM.userData.lamp = lamp;
  const pot = blk(.5, .5, .5, '#d9774b', 3.6, .25, -3.6, ROOM); const pl = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 0), new THREE.MeshStandardMaterial({ color: '#4c9a4f', flatShading: true })); pl.position.set(3.6, .9, -3.6); ROOM.add(pl);
  // little mobile above the crib: three planets
  const mob = new THREE.Group(); mob.position.set(-1.1, 2.3, -2.3); ROOM.add(mob); ROOM.userData.mob = mob; ['#8ff3ff', '#f2c14e', '#e86f5a'].forEach((c, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.11, 12, 10), std(c)); s.position.set(Math.cos(i * TAU / 3) * .35, -.3, Math.sin(i * TAU / 3) * .35); mob.add(s); }); }

// ---------- cast ----------
const YOU = { shirt: '#ff9a3c', pants: '#2f3b52', skin: '#e3b089', hair: '#4a2e1b', style: 0 };
const you = { baby: vox({ ...YOU, seed: 1 }), kid: vox({ ...YOU, seed: 2 }), teen: vox({ ...YOU, seed: 3, shirt: '#3f7bd9' }), adult: vox({ ...YOU, seed: 4, shirt: '#2f6f6a' }), old: vox({ ...YOU, seed: 5, hair: '#d8d2c8', shirt: '#8e6bd6', beard: true }) };
age(you.baby, 'baby'); age(you.kid, 'kid'); age(you.teen, 'teen');
const mom = vox({ seed: 21, skin: '#e3b089', hair: '#2b1d14', shirt: '#f08fb5', style: 2 }), dad = vox({ seed: 22, skin: '#c98e62', hair: '#1a1a1a', shirt: '#4caf7a', style: 3, beard: true });
const kids = [vox({ seed: 31, style: 1 }), vox({ seed: 32 }), vox({ seed: 33, style: 2 })]; kids.forEach(k => age(k, 'kid'));
const partner = vox({ seed: 41, skin: '#9a6643', hair: '#d8d2c8', shirt: '#e86f5a', style: 2 });
const crowd = []; for (let i = 0; i < 70; i++) crowd.push(vox({ seed: 100 + i, simple: i > 30 }));
[you.baby, you.kid, you.teen, you.adult, you.old, mom, dad, partner, ...kids, ...crowd].forEach(p => U.add(p));
const smallKids = crowd.slice(0, 8); smallKids.forEach(k => age(k, 'kid'));

// ---------- environment presets ----------
const ENV = {
  day: { top: '#2f7fa8', hor: '#9fdfe2', low: '#5fb5bf', glowC: '#ffffff', glowK: .5, glowW: 60, halo: .18, cA: '#3f9aab', cB: '#bfeceb', sunC: '#ffffff', sunI: 2.0, hemiS: '#b5eef8', hemiG: '#2f6d78', hemiI: 1.0, stars: 0, rings: .35, win: 0, bulbs: .55, exp: .9 },
  gold: { top: '#1a4672', hor: '#7cc6cf', low: '#357f90', glowC: '#ffd59a', glowK: .55, glowW: 18, halo: .22, cA: '#3d8fa0', cB: '#b8ece6', sunC: '#ffe0b0', sunI: 2.2, hemiS: '#8fd9ee', hemiG: '#24505f', hemiI: .8, stars: .05, rings: .55, win: .25, bulbs: 1.2, exp: .9 },
  dusk: { top: '#0b1a36', hor: '#2c6683', low: '#1b4a5c', glowC: '#ffb874', glowK: .6, glowW: 9, halo: .3, cA: '#1d5368', cB: '#5aa7b4', sunC: '#ffe2b8', sunI: .45, hemiS: '#5a8fbf', hemiG: '#102a36', hemiI: .55, stars: .45, rings: .8, win: .9, bulbs: 1.5, exp: 1.1 },
  night: { top: '#02040c', hor: '#0b2232', low: '#06141e', glowC: '#000000', glowK: 0, glowW: 8, halo: 0, cA: '#061722', cB: '#123848', sunC: '#000000', sunI: 0, hemiS: '#3d5f9a', hemiG: '#050b12', hemiI: .42, stars: 1, rings: 1, win: 1.3, bulbs: 1.6, exp: 1.15 },
  dawn: { top: '#123a63', hor: '#86cdd0', low: '#357f90', glowC: '#ffe9c8', glowK: 1.0, glowW: 12, halo: .35, cA: '#2f7d90', cB: '#a8e6e0', sunC: '#ffe6c0', sunI: 2.2, hemiS: '#9adcf0', hemiG: '#24505f', hemiI: .85, stars: .15, rings: .6, win: .5, bulbs: 1.3, exp: .92 },
};
let sunAz = 0, sunEl = .06;
function sunDirV(az = sunAz, el = sunEl) { return V(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)); }
function setEnv(name, k = 1, from) {
  const a = ENV[from || name], b = ENV[name], C = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), k), L = (x, y) => lerp(x, y, k), u = skyMat.uniforms, cu = cloudMat.uniforms;
  u.top.value.copy(C(a.top, b.top)); u.hor.value.copy(C(a.hor, b.hor)); u.low.value.copy(C(a.low, b.low)); u.glowC.value.copy(C(a.glowC, b.glowC)); u.glowK.value = L(a.glowK, b.glowK); u.glowW.value = L(a.glowW, b.glowW); u.halo.value = L(a.halo, b.halo);
  cu.cA.value.copy(C(a.cA, b.cA)); cu.cB.value.copy(C(a.cB, b.cB)); cu.hor.value.copy(u.hor.value); cu.sunC.value.copy(C(a.sunC, b.sunC));
  const sd = sunDirV(); u.sunDir.value.copy(sd); cu.sunDir.value.copy(sd);
  sunL.color.copy(C(a.sunC === '#000000' ? '#ffffff' : a.sunC, b.sunC === '#000000' ? '#ffffff' : b.sunC)); sunL.intensity = L(a.sunI, b.sunI) * sm(-.03, .03, sd.y);
  hemi.color.copy(C(a.hemiS, b.hemiS)); hemi.groundColor.copy(C(a.hemiG, b.hemiG)); hemi.intensity = L(a.hemiI, b.hemiI);
  starsU.material.opacity = L(a.stars, b.stars); ringMats.forEach(([m, op]) => m.opacity = op * L(a.rings, b.rings));
  const win = L(a.win, b.win); HOUSE_MATS.forEach(m => m.emissiveIntensity = win); BULBS.forEach(m => m.material.color.set('#ffd38a').multiplyScalar(L(a.bulbs, b.bulbs)));
  renderer.toneMappingExposure = L(a.exp, b.exp);
  const vis = sd.y > -.04, horK = sm(-.04, .05, sd.y); sunCore.position.copy(sd).multiplyScalar(1350); sunHalo.position.copy(sunCore.position); sunBig.position.copy(sunCore.position);
  sunCore.material.opacity = vis ? horK : 0; sunHalo.material.opacity = vis ? .2 * horK : 0;
  puffs.forEach(p => p.material.color.copy(u.hor.value).lerp(cu.cB.value, .5));
}
function sunAt(az, el) { sunAz = az; sunEl = el; }
function shadowAround(x, z) { sunT.position.set(x, 0, z); sunL.position.copy(sunDirV(sunAz, Math.max(sunEl, .12))).multiplyScalar(120).add(sunT.position); }

// per-frame reset for this location
const ALL_FX = () => { PEOPLE.forEach(p => p.visible = false); FP.visible = false; TABLES.visible = false; confetti.visible = false; flakes.visible = false; streaks.forEach(s => s.material.opacity = 0); stink.forEach(s => s.material.opacity = 0); diamonds.visible = false; glints.forEach(g => g.material.opacity = 0); deepLight.intensity = 0; cloudMat.uniforms.under.value = 0; cloudMat.uniforms.flow.value = 1; sunBig.material.opacity = 0; MOONS.forEach(m => m.sp.material.opacity = 0); cakeL.intensity = 0; flame.material.opacity = 0; ROOM.visible = false; CITY.visible = true; TREES.forEach(t => t.visible = true); };
RESETS.push((c, sh) => {
  const mine = sh.loc === 'USKY';
  renderer.toneMapping = mine ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping; renderer.shadowMap.enabled = mine;
  bloom.strength = mine ? .32 : .2; bloom.threshold = mine ? .86 : .9; bloom.radius = mine ? .7 : .6;
  FP.visible = false; if (!mine) return;
  ALL_FX(); cloudMat.uniforms.time.value = c.t; sunAt(0, .07); setEnv('day');
  puffs.forEach(p => { const u = p.userData; p.position.set(Math.cos(u.a + c.t * .004) * u.d, u.y + Math.sin(c.t * .3 + u.ph) * .5, Math.sin(u.a + c.t * .004) * u.d); });
  BALLOONS.forEach((b, i) => b.position.y += Math.sin(c.t * .5 + i) * .004);
});

// ---------- HUD (persistent, top-left, like a clock) ----------
const SUNSET_AT = 42, YEAR = 84;
const ymd = y => { const yy = Math.floor(y + 1e-9), d = Math.floor((y - yy) * 365.25 + 1e-6); return [yy, d]; };
GLOBAL_OV.push((t, c, sh) => {
  const yr = c.o.yr; if (!yr || sh.loc !== 'USKY') return '';
  const y = lerp(yr[0], yr[1], c.o.scene === 'unursery' ? sm(.45, 1, c.p) : c.o.scene === 'unight' || c.o.scene === 'udeep' ? sm(0, 1, c.p) : clamp(c.p));
  const [Y, D] = ymd(y), hrs = Math.floor(((y * 365.25) % 1) * 24), ph = y % YEAR, night = ph >= SUNSET_AT, left = (night ? YEAR : SUNSET_AT) - ph, [LY, LD] = ymd(Math.max(left, 0));
  const fade = clamp((c.t - 4.5) / .4);
  const big = y < 1 ? `DAY ${Math.floor(y * 365.25) + 1}` : `${Y}<tspan font-size="24" dx="2">y</tspan> ${String(D).padStart(3, '0')}<tspan font-size="24" dx="2">d</tspan>`;
  const cd = LY > 0 || LD > 2 ? `${LY}y ${String(LD).padStart(3, '0')}d` : `${String(Math.floor(left * 365.25 * 24)).padStart(2, '0')}:${String(Math.floor((left * 365.25 * 24 * 60) % 60)).padStart(2, '0')}:${String(Math.floor((left * 365.25 * 24 * 3600) % 60)).padStart(2, '0')}`;
  const where = c.o.scene === 'udeep' ? 'BELOW THE CLOUDS' : c.o.scene === 'unursery' ? 'SKY CITY · NURSERY' : 'SKY CITY · NORTH POLE';
  const temp = c.o.scene === 'unight' || c.o.scene === 'udeep' ? `<text x="0" y="114" font-family="Inter" font-weight="800" font-size="13" fill="#9fdcff" letter-spacing="1.6">OUTSIDE <tspan fill="#fff">−224°C</tspan></text>` : '';
  return `<g transform="translate(26 398)" opacity="${fade.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.55))">
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="14" fill="${ORANGE}" letter-spacing="2.6">BORN ON URANUS</text>
    <text x="0" y="48" font-family="Inter" font-weight="800" font-size="42" fill="#fff" letter-spacing=".5">${big}</text>
    <text x="0" y="72" font-family="Inter" font-weight="800" font-size="13.5" fill="#fff" letter-spacing="1.6">${night ? 'SUNRISE' : 'SUNSET'} IN <tspan fill="${night ? CY : '#ff5a4a'}">${cd}</tspan></text>
    <text x="0" y="93" font-family="Inter" font-weight="600" font-size="12.5" fill="#fff" fill-opacity=".85" letter-spacing="1.8">${where}</text>${temp}</g>`;
});

// ---------- serif title helpers ----------
const serif = (x, y, txt, size, fill, op = 1, italic = false, w = 500) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="EBG" font-weight="${w}" ${italic ? 'font-style="italic"' : ''} font-size="${size}" fill="${fill}" opacity="${op.toFixed(3)}" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))">${txt}</text>`;

// ---------- intro globe: the pin flies to Uranus instead of Mars ----------
const GP = E.GLOBE_PARTS, GL = LOC.GLOBE;
const uTex = canvasTex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#c9f3f2'); gr.addColorStop(.5, '#96e0e6'); gr.addColorStop(1, '#7fcfd9'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,255,255,${(.04 + (i % 3) * .03).toFixed(2)})`; g.fillRect(0, i * 18 + 4, w, 6 + (i % 4) * 3); } g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(w * .5, 12, w * .6, 26, 0, 0, TAU); g.fill(); });
const uRings = new THREE.Group(); GL.add(uRings); uRings.position.copy(GP.MARSP);
[[16, .5, .55], [17.4, .25, .4], [18.6, 1.1, .7], [20, .3, .35]].forEach(([r0, w, a]) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r0 + w, 160), new THREE.MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: a, side: THREE.DoubleSide, depthWrite: false })); uRings.add(m); });
uRings.rotation.set(.25, .4, Math.PI / 2 - .17);   // the famous ~98° tilt: rings stand almost vertical
RESETS.push((c, sh) => { const u = E.ep() && E.ep().dest === 'uranus'; GP.marsBall.material.map = u ? uTex : GP.mTex; GP.marsHalo.material.color.set(u ? '#7fe9ff' : '#ffffff'); uRings.visible = !!u; GP.pin.visible = true; });

// ---------- shots ----------
const C = (p, at, fov = 44) => ({ p, at, fov });
const pathCam = (c, keys) => { // keys: [{at:time-from-shot-start or chunk ref, p, a, fov}] eased between
  let k0 = keys[0], k1 = keys[0], s = 0; const T = k => typeof k.t === 'number' ? k.t : c.lt - (k.t[1] === 'e' ? c.che(k.t[0]) : c.ch(k.t[0]));
  for (let i = 0; i < keys.length - 1; i++) { const a = T(keys[i]) , b = T(keys[i + 1]); if (c.lt >= a) { k0 = keys[i]; k1 = keys[i + 1]; s = clamp((c.lt - a) / Math.max(b - a, .01)); } }
  if (c.lt >= T(keys[keys.length - 1])) { k0 = k1 = keys[keys.length - 1]; s = 0; }
  const e = eio(s); return { p: P(k0.p, k1.p, e), at: P(k0.a, k1.a, e), fov: lerp(k0.fov || 44, k1.fov || 44, e), roll: lerp(k0.roll || 0, k1.roll || 0, e) };
};
const MP = GP.MARSP;
Object.assign(SHOTS, {
  uhook: { loc: 'GLOBE', noCap: true, aperture: .0002,
    cam: c => { const rush = eio(clamp((c.lt - (c.d - .55)) / .55)); return { p: P(P([MP.x - 8, MP.y + 16, MP.z + 46], [MP.x - 4, MP.y + 7, MP.z + 31], eo(c.p)), [MP.x, MP.y + 2, MP.z + 11], rush), at: [MP.x, MP.y, MP.z], fov: 44 - rush * 8, roll: .08 * (1 - c.p) }; },
    kick: c => Math.exp(-Math.max(c.ch(0), 0) * 7) * .35,
    fx: c => { GP.marsBall.rotation.y = c.t * .25; GP.pin.visible = false; },
    ov: c => { const a = clamp(c.lt / .25), b = pop(c.ch(0), 0, .4), wob = Math.max(0, 1 - c.ch(0) / .5) * Math.sin(c.ch(0) * 40) * 4, out = 1 - clamp((c.lt - (c.d - .35)) / .3);
      return `<g opacity="${(a * out).toFixed(2)}">` + serif(288, 300, 'What if you were born on', 34, '#fff') + `<g transform="translate(${f1(288 + wob)} 372) scale(${Math.max(b, .001).toFixed(3)})">` + serif(0, 0, 'Uranus?!', 72, ORANGE, 1, true) + `</g></g>`; },
    post: c => { const w = clamp((c.lt - (c.d - .3)) / .3); return w > 0 ? `<rect width="576" height="1024" fill="#d9fbff" opacity="${(w * .9).toFixed(2)}"/>` : ''; } },
  uclouds: { loc: 'USKY', aperture: .0003,
    cam: c => pathCam(c, [{ t: 0, p: [-30, -12, 230], a: [-24, -46, 170], fov: 50, roll: .1 }, { t: [1, 's'], p: [-22, -10, 175], a: [-14, -30, 110], fov: 48, roll: .04 }, { t: c.d, p: [-12, -6, 110], a: [0, 4, 0], fov: 46 }]),
    fx: c => { sunAt(.5, .09); setEnv('day'); shadowAround(0, 0); cloudMat.uniforms.flow.value = 2.2; },
    post: c => { const w = 1 - clamp(c.lt / .5); return w > 0 ? `<rect width="576" height="1024" fill="#d9fbff" opacity="${(w * .9).toFixed(2)}"/>` : ''; } },
  ucity: { loc: 'USKY', aperture: .0002,
    cam: c => { const a = lerp(.32, -.38, eio(c.p)), R = lerp(72, 56, eio(c.p)); return { p: [Math.sin(a) * R, lerp(-2, 14, eio(c.p)), Math.cos(a) * R], at: [0, lerp(4, 6, c.p), 0], fov: 46 }; },
    fx: c => { sunAt(.5, .09); setEnv('day'); shadowAround(0, 0); walkers(c, 14); } },
  unursery: { loc: 'USKY', aperture: .0012,
    cam: c => pathCam(c, [{ t: 0, p: [RX + 1.6, 2.3, 2.4], a: [RX - 1.0, 1.1, -2.6], fov: 46 }, { t: [1, 's'], p: [RX + .9, 2.0, 1.2], a: [RX - 1.0, 1.0, -2.6], fov: 42 }, { t: [2, 's'], p: [RX + .8, 1.7, .6], a: [RX - .2, 1.4, -6], fov: 50 }, { t: c.d, p: [RX + .2, 1.8, -1.2], a: [RX, 1.2, -12], fov: 52 }]),
    fx: c => { ROOM.visible = true; CITY.visible = false; const sp = c.ch(2) > 0 ? eio(clamp(c.ch(2) / (c.d - (c.o.chunks[2].t0 - c.o.t0)))) : 0, az = -.9 + sp * TAU * 2.2; sunAt(az, .1 + .03 * Math.sin(az * 2)); setEnv('gold', .35, 'day'); shadowAround(RX, 0); ROOM.userData.mob.rotation.y = c.t * .7;
      put(you.baby, RX - 1.1, .79, -2.3, 0, c.t, { expr: c.ch(1) > 0 ? 'smile' : 'sleep', blink: false }); you.baby.rotation.x = -Math.PI / 2 + .05; you.baby.position.y = .86; you.baby.position.z = -2.0;
      put(mom, RX - 2.0, 0, -3.25, .45, c.t, { expr: 'smile', down: .45, look: .1, lean: .12 }); put(dad, RX - .1, 0, -3.3, -.45, c.t, { expr: 'smile', down: .4, look: -.1, hug: 1, ph: 1 }); },
    ov: c => { const k = c.ch(2); if (k <= 0) return ''; const q = project(world('USKY', RX + sunDirV().x * 1350, sunDirV().y * 1350, sunDirV().z * 1350)); return ''; } },
  usun: { loc: 'USKY', aperture: .0016, focus: .9,
    cam: c => pathCam(c, [{ t: 0, p: [1.5, 1.05, -22.6], a: [10, 40, -220], fov: 46 }, { t: c.d, p: [1.4, 1.0, -23.2], a: [14, 46, -230], fov: 40 }]),
    fx: c => { sunAt(.06, .2); setEnv('day'); shadowAround(0, -18); FP.visible = true; const reach = eo(clamp(c.lt / .8));
      fpR.visible = true; fpL.visible = false; fpR.position.set(.07, lerp(-.34, -.1, reach), -.5); fpR.rotation.set(lerp(-.2, .55, reach), -.08, 0); fpR.scale.setScalar(.85);
      const big = c.ch(1); if (big > 0) { const k = clamp(big / .35), s = 1 - eio(clamp((big - .5) / 1.0)); sunBig.material.opacity = k * s * .75; sunBig.scale.setScalar(lerp(30, 520, s)); sunBig.material.color.set('#ffe0a0'); }
      kids.slice(0, 2).forEach((k, i) => put(k, -2 + i * 1.6, 0, -21 - i * .4, Math.PI + .3 - i * .5, c.t, { up: .5, expr: 'o', ph: i })); },
    post: c => { const big = c.ch(1); if (big <= 0) return ''; const s = 1 - eio(clamp((big - .5) / 1.0)); return `<rect width="576" height="1024" fill="#fff3d6" opacity="${(s * .12 * clamp(big / .35)).toFixed(2)}"/>`; } },
  usmell: { loc: 'USKY', aperture: .0014,
    cam: c => pathCam(c, [{ t: 0, p: [1.2, 1.0, -3.2], a: [0, .75, 3], fov: 44 }, { t: [1, 's'], p: [.5, .9, -1.6], a: [0, .75, 2.2], fov: 40 }, { t: c.d, p: [.3, .85, -.7], a: [0, .78, 1.9], fov: 34 }]),
    fx: c => { sunAt(.4, .16); setEnv('day'); shadowAround(0, 2); const walkK = 1 - clamp(c.ch(1) / .4), z = lerp(5.5, 2.0, eo(clamp(c.lt / (c.o.chunks[1].t0 - c.o.t0 + .1))));
      put(you.kid, 0, 0, z, Math.PI, c.t, { walk: walkK, nose: eo(clamp((c.ch(0) - .9) / .4)), expr: c.ch(1) > 0 ? 'squint' : (c.ch(0) > .9 ? 'squint' : 'smile'), look: c.ch(1) > 0 ? 0 : -.2 });
      kids.forEach((k, i) => put(k, -1.4 + i * 1.5 + (i === 1 ? 1.2 : 0), 0, z + 1.4 + (i % 2) * .6, Math.PI + (i - 1) * .2, c.t, { walk: walkK * .9, ph: i * 1.3, nose: i === 1 ? eo(clamp((c.ch(0) - 1.2) / .4)) : 0, cheer: i === 2 ? .35 : 0, expr: i === 2 ? 'big' : 'squint' }));
      stink.forEach((s, i) => { const a = (c.t * .3 + i / stink.length) % 1; s.position.set(Math.sin(i * 2.3 + c.t * .4) * 3, .3 + a * 3, z - 1 + Math.cos(i * 1.7) * 3); s.material.opacity = .12 * Math.sin(a * Math.PI) * clamp(c.ch(0) / .6); s.scale.setScalar(2 + a * 2); }); walkers(c, 6, 4); } },
  uwind: { loc: 'USKY', aperture: .0006,
    cam: c => pathCam(c, [{ t: 0, p: [3.5, 1.9, -20.5], a: [0, 1.4, -26], fov: 46 }, { t: c.d * .55, p: [1.8, 1.6, -23], a: [-6, .4, -60], fov: 48, roll: -.03 }, { t: c.d, p: [1.2, 1.5, -23.6], a: [-30, -6, -200], fov: 52, roll: -.06 }]),
    fx: c => { sunAt(-.3, .13); setEnv('day'); shadowAround(0, -18); cloudMat.uniforms.flow.value = 9; const k = clamp(c.lt / .6);
      put(you.teen, 0, 0, -24.9, Math.PI, c.t, { hold: 1.35, lean: -.08 + Math.sin(c.t * 9) * .02, expr: 'o' });
      streaks.forEach((s, i) => { const r = rng(i * 7 + 3), y = -4 + r() * 12, z = -30 - r() * 60, sp = 70 + r() * 80, x = ((c.t * sp + r() * 400) % 400) - 200; s.position.set(x, y, z); s.material.opacity = k * (.25 + r() * .35); s.lookAt(camera.position.x - U.position.x, y, z + 40); s.rotation.set(0, 0, 0); });
      puffs.forEach(p => { p.position.x = ((p.position.x + c.t * 40 + 600) % 1200) - 600; }); } },
  urings: { loc: 'USKY', aperture: .0004,
    cam: c => pathCam(c, [{ t: 0, p: [3.6, 1.5, 3.2], a: [0, 1.1, -1], fov: 44 }, { t: [0, 'e'], p: [2.2, .5, 3.2], a: [-.4, 3, -1.2], fov: 48 }, { t: [1, 's'], p: [1.6, .35, 2.6], a: [-60, 520, -560], fov: 58 }, { t: c.d, p: [1.2, .3, 2.4], a: [-30, 620, -450], fov: 64 }]),
    fx: c => { sunAt(1.9, .12); setEnv('day'); ringMats.forEach(([m, op]) => m.opacity = op * .75); shadowAround(0, 0); put(you.teen, 0, 0, 0, Math.PI + .2, c.t, { up: .9, expr: c.ch(1) > 0 ? 'o' : 'smile', arms: [[0, 0, -.25], [-2.3, 0, -.2]] });
      MOONS.forEach((m, i) => m.sp.material.opacity = pop(c.ch(1), i * .12, .4) > 0 ? Math.min(pop(c.ch(1), i * .12, .4), 1) : 0); walkers(c, 8); },
    ov: c => { if (c.ch(2) <= 0) return ''; return MOONS.map((m, i) => { const q = project(world('USKY', m.p.x, m.p.y, m.p.z)), k = clamp((c.ch(2) - i * .14) / .3); if (k <= 0 || q.behind) return ''; return serif(q.x, q.y - 28, m.n, 26, '#fff', k, true); }).join(''); } },
  ugather: { loc: 'USKY', aperture: .0009,
    cam: c => pathCam(c, [{ t: 0, p: [2.6, 2.2, -8.5], a: [0, 1.6, -30], fov: 44 }, { t: c.d, p: [1.0, 3.8, -13.5], a: [0, 1.0, -120], fov: 46 }]),
    fx: c => { sunAt(0, lerp(.05, .03, c.p)); setEnv('gold'); shadowAround(0, -18); gatherCrowd(c, 0); treesAway(0, -12, 9); } },
  usunset: { loc: 'USKY', aperture: .0016,
    cam: c => pathCam(c, [{ t: 0, p: [-1.6, 1.85, -27.0], a: [.1, 1.55, -24.35], fov: 40 }, { t: [0, 'e'], p: [-1.1, 1.8, -26.6], a: [-.05, 1.6, -24.35], fov: 34 }, { t: (c.o.chunks[0].te ?? c.o.chunks[0].t0 + 2) - c.o.t0 + 1.4, p: [-.75, 2.05, -23.35], a: [0, 1.2, -80], fov: 44 }, { t: c.d, p: [0, 5.5, -12], a: [0, -2, -160], fov: 48 }]),
    fx: c => { const s = sm(.25, .85, c.p); sunAt(0, lerp(.03, -.06, s)); setEnv('dusk', sm(.3, .95, c.p), 'gold'); shadowAround(0, -18); gatherCrowd(c, 1);
      pose(you.adult, c.t, { expr: c.p > .3 ? 'cry' : 'sad', up: .05, blink: false }); treesAway(0, -14, 9); },
    post: c => '' },
  unight: { loc: 'USKY', aperture: .0002,
    cam: c => pathCam(c, [{ t: 0, p: [10, 9, -46], a: [0, 3, 0], fov: 44 }, { t: c.d, p: [34, 16, -66], a: [0, 2, 0], fov: 46 }]),
    fx: c => { sunAt(0, -.4); setEnv('night'); shadowAround(0, 0); flakes.visible = true; const pa = flakes.geometry.attributes.position, b = flakes.userData.base; for (let i = 0; i < pa.count; i++) pa.setXYZ(i, b[i * 3] + Math.sin(c.t * .5 + i) * .4, ((b[i * 3 + 1] - c.t * 1.2) % 30 + 30) % 30 - 6, b[i * 3 + 2] - 20); pa.needsUpdate = true; flakes.position.set(0, 0, -10); walkers(c, 6); } },
  udeep: { loc: 'USKY', aperture: .0004,
    cam: c => { const k = eio(c.p); return { p: [lerp(30, 10, k), lerp(CLOUD_Y + 18, DEEP_Y + 10, k), lerp(-40, -20, k)], at: [lerp(10, 0, k), lerp(CLOUD_Y - 30, DEEP_Y - 20, k), lerp(-60, -40, k)], fov: lerp(52, 60, k) }; },
    fx: c => { sunAt(0, -.4); setEnv('night'); const k = eio(c.p), below = sm(.2, .45, c.p); cloudMat.uniforms.under.value = below; CITY.visible = c.p < .4;
      scene.fog = below > 0 ? new THREE.FogExp2(new THREE.Color('#0a2a4a'), .009 * below) : null; skyMat.uniforms.top.value.lerp(new THREE.Color('#06182b'), below); skyMat.uniforms.hor.value.lerp(new THREE.Color('#0a2a44'), below); skyMat.uniforms.low.value.lerp(new THREE.Color('#041120'), below); starsU.material.opacity *= 1 - below; ringMats.forEach(([m]) => m.opacity *= 1 - below);
      diamonds.visible = below > 0; deepLight.position.set(10, DEEP_Y + 5, -30); deepLight.intensity = 9 * below; const mt = new THREE.Matrix4(), q = new THREE.Quaternion(), r = rng(7);
      for (let i = 0; i < 140; i++) { const x = (r() - .5) * 60 + 10, z = -40 + (r() - .5) * 60, sp = 4 + r() * 6, y = DEEP_Y + 40 - ((c.t * sp + r() * 90) % 90), rx = c.t * (1 + r() * 2); q.setFromEuler(new THREE.Euler(rx, rx * .7, r() * 3)); const s = .6 + r() * 1.3; mt.compose(V(x, y, z), q, V(s, s * 1.4, s)); diamonds.setMatrixAt(i, mt); }
      diamonds.instanceMatrix.needsUpdate = true; glints.forEach((g, i) => { const rr = rng(i + 50), x = (rr() - .5) * 50 + 10, z = -40 + (rr() - .5) * 50, sp = 4 + rr() * 6, y = DEEP_Y + 40 - ((c.t * sp + rr() * 90) % 90); g.position.set(x, y, z); g.material.opacity = below * Math.max(0, Math.sin(c.t * (3 + rr() * 4) + i)) * .9; g.scale.setScalar(Math.min(2.5 + rr() * 3, .12 * g.position.distanceTo(camera.position.clone().sub(U.position)))); }); } },
  urise: { loc: 'USKY', aperture: .0008,
    cam: c => pathCam(c, [{ t: 0, p: [0, 4, -12], a: [0, 1, -120], fov: 46 }, { t: [0, 'e'], p: [.8, 2.4, -15.8], a: [0, 3, -200], fov: 44 }, { t: [1, 's'], p: [-1.6, 1.85, -27.0], a: [.1, 1.55, -24.35], fov: 40 }, { t: c.d, p: [-1.1, 1.8, -26.6], a: [-.05, 1.6, -24.35], fov: 34 }]),
    fx: c => { const k = sm(0, .38, c.p); sunAt(.05, lerp(-.03, .06, k)); setEnv('dawn', k, 'night'); shadowAround(0, -18); gatherCrowd(c, 2); treesAway(0, -14, 9); } },
  ubday: { loc: 'USKY', aperture: .0012,
    cam: c => pathCam(c, [{ t: 0, p: [3.0, 2.3, -5.2], a: [.4, 1.3, -11.3], fov: 44 }, { t: c.d, p: [1.9, 1.85, -7.9], a: [.5, 1.35, -11.5], fov: 38 }]),
    fx: c => { sunAt(.05, .07); setEnv('dawn'); shadowAround(0, -10); treesAway(1, -9, 7); TABLES.visible = true; flame.material.opacity = .9 + .1 * Math.sin(c.t * 20); cakeL.intensity = 3; confettiFX(c); bdayCrowd(c); } },
  uend: { loc: 'USKY', noCap: true, aperture: .0008,
    cam: c => pathCam(c, [{ t: 0, p: [1.9, 1.85, -7.9], a: [.5, 1.35, -11.5], fov: 38 }, { t: 1.2, p: [0, 4, -4], a: [0, 3, -200], fov: 46 }, { t: c.d, p: [0, 9, 6], a: [0, 4, -200], fov: 50 }]),
    fx: c => { sunAt(.05, .09); setEnv('dawn'); shadowAround(0, -10); treesAway(1, -9, 7); TABLES.visible = true; flame.material.opacity = 1; cakeL.intensity = 3; bdayCrowd(c); confettiFX(c); },
    post: c => { const w = sm(.35, 1.0, c.lt), bar = eio(clamp((c.lt - 1.0) / .9)), title = clamp((c.lt - 1.8) / .6), q = clamp((c.lt - 2.6) / .6), black = clamp((c.lt - 1.0) / .7);
      const gap = lerp(512, 60, bar), H = 1024;
      let o = `<rect width="576" height="1024" fill="#fffdf5" opacity="${(w * (1 - black * .0) * (bar < 1 ? 1 : 0) * .85).toFixed(2)}"/>`;
      if (bar > 0) o += `<rect width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/><rect y="${f1(512 + gap)}" width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/>`;
      o += serif(288, 360, 'What if you were born', 34, '#fff', title) + serif(288, 402, 'on <tspan fill="' + ORANGE + '">Uranus</tspan>?', 34, '#fff', title);
      o += serif(288, 664, 'Would you wait 42 years for a sunrise?', 23, ORANGE, q, true); return o; } },
});
// people walking around the plaza
function treesAway(x, z, r) { TREES.forEach(t => { if (Math.hypot(t.position.x - x, t.position.z - z) < r) t.visible = false; }); }
function walkers(c, n, near = 0) {
  for (let i = 0; i < n; i++) { const p = crowd[30 + i], r = rng(i + 9), R = 3 + r() * 9 + near, dir = r() < .5 ? 1 : -1, a = r() * TAU + dir * c.t * (1.1 / R); put(p, Math.cos(a) * R, 0, Math.sin(a) * R, -a + (dir > 0 ? Math.PI : 0), c.t, { walk: 1, ph: i * 1.7 }); }
}
// the whole city at the rail facing the sun; mode 0 gathering, 1 sunset, 2 sunrise
function gatherCrowd(c, mode) {
  const r = rng(5); let j = 0;
  for (let row = 0; row < 6; row++) for (let i = 0; i < 11; i++) { if (j >= crowd.length) break; const p = crowd[j++], x = (i - 5) * .95 + (row % 2) * .45 + (r() - .5) * .3, z = -23.6 + row * 1.15 + (r() - .5) * .3; if (Math.abs(x) < 1.6 && row < 1) continue;
    const arr = mode === 0 ? sm(0, 1, (c.lt * .7 - row * .2 - r() * .4)) : 1, zz = lerp(z + 4, z, arr);
    put(p, x, 0, zz, Math.PI + (r() - .5) * .3, c.t, { walk: mode === 0 && arr < 1 ? 1 : 0, ph: j, up: .1, cheer: mode === 2 ? sm(.5, .8, c.p) * (r() < .6 ? 1 : 0) : 0, expr: mode === 2 && c.p > .5 ? 'big' : mode === 1 && r() < .3 ? 'sad' : 'neutral', hug: mode === 1 && r() < .25 ? 1 : 0 }); }
  const P0 = mode === 2 ? you.old : you.adult; put(P0, -.2, 0, -24.35, Math.PI, c.t, { up: .08, expr: mode === 2 ? (c.p > .55 ? 'joy' : 'o') : 'neutral', cheer: mode === 2 ? sm(.6, .85, c.p) * .6 : 0 });
  put(partner, .78, 0, -24.3, Math.PI - .2, c.t, { up: .08, expr: mode === 2 && c.p > .5 ? 'big' : mode === 1 ? 'sad' : 'neutral', ph: 3 });
  if (mode !== 2) { partner.userData.hs = 1; }
}
function bdayCrowd(c) {
  const r = rng(19);
  put(you.old, .6, 0, -12.5, 0, c.t, { expr: 'joy', down: .25, hold: .4 });
  put(partner, -.6, 0, -12.6, .15, c.t, { expr: 'big', cheer: .6, ph: 2 });
  for (let i = 0; i < 26; i++) { const p = crowd[i], side = i % 2 ? 1 : -1, x = -5 + (i >> 1) * .85, z = side > 0 ? -12.7 : -9.0; if (Math.abs(x - .6) < 1.2 && side > 0) continue; if (side < 0 && x > -1 && x < 3.5) continue; put(p, x + (r() - .5) * .2, 0, z, 0, c.t, { cheer: sm(0, .5, c.lt - r() * .4) * (r() < .7 ? 1 : .3), expr: 'big', ph: i }); }
}
function confettiFX(c) { confetti.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), r = rng(3); for (let i = 0; i < 220; i++) { const x = (r() - .5) * 10, z = -9.5 + (r() - .5) * 8, sp = .6 + r() * .7, f = (c.lt * sp * .35 + r()) % 1; q.setFromEuler(new THREE.Euler(c.t * 3 + i, c.t * 2 + i * .5, 0)); m.compose(V(x + Math.sin(c.t + i) * .3, 6 - f * 6.5, z), q, V(1, 1, 1)); confetti.setMatrixAt(i, m); } confetti.instanceMatrix.needsUpdate = true; }

E.VOX = { vox, pose, put, age, std, blk, faceTex, BOX, uRings };
window.__uranus = true;
