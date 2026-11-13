// "Every planet, ranked by how fast it would kill you": one voxel "you" visiting each world, with a
// survival-timer HUD. Rocky planets are a surface set re-dressed per planet; gas giants are a free-fall
// through cloud layers. Intro and outro fly past all eight planets lined up in space.
while (!window.__ocean || !window.ENG || !window.ENG.VOX) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng, spring } = E;
const { vox, pose, put, std, blk } = E.VOX;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const isMine = () => { const e = E.ep(); return !!(e && e.series && e.series.startsWith('EVERY PLANET')); };

// ---------- planet looks ----------
const LOOK = {
  earth: { top: '#2f7fd6', hor: '#bfe6ff', low: '#7fb0d0', sun: '#fff6dc', sunK: .6, ground: '#5aa84a', g2: '#3f8a3a', fog: '#bfe6ff', fogD: .006, hemi: ['#d8f0ff', '#4a6a3a', 1.1], sunI: 2.4, stars: 0 },
  mars: { top: '#b0703a', hor: '#e8c08a', low: '#c08050', sun: '#fff0d8', sunK: .5, ground: '#b8582e', g2: '#8a3a20', fog: '#d8a06a', fogD: .012, hemi: ['#f0c8a0', '#5a2a18', 1.0], sunI: 2.2, stars: 0 },
  mercury: { top: '#000000', hor: '#0a0a10', low: '#050508', sun: '#ffffff', sunK: 2.2, ground: '#8a8a88', g2: '#5a5a58', fog: '#000000', fogD: .0, hemi: ['#6a6a7a', '#101010', .25], sunI: 4.5, stars: 1 },
  venus: { top: '#6a3a10', hor: '#e8a040', low: '#c86a20', sun: '#ffd080', sunK: .2, ground: '#4a2a1a', g2: '#2a160c', fog: '#c87a30', fogD: .05, hemi: ['#ffb060', '#3a1a08', 1.2], sunI: .8, stars: 0 },
};
const GAS = {
  uranus: { top: '#2f7fa8', hor: '#9fdfe2', cA: '#3f9aab', cB: '#bfeceb', band: '#6fc8cf' },
  saturn: { top: '#6a5a3a', hor: '#e8d6a8', cA: '#b89a62', cB: '#f0e2b8', band: '#d8c08a' },
  neptune: { top: '#0a1a5a', hor: '#3a6ad8', cA: '#1a3a9a', cB: '#6a9aff', band: '#2a4ac0' },
  jupiter: { top: '#4a2a1a', hor: '#e8b88a', cA: '#a8582a', cB: '#f2dcc0', band: '#c87a4a' },
};

// ---------- the surface set ----------
const PL = loc('PLAN', 60000);
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, low: { value: new THREE.Color() }, sunDir: { value: V(0, .3, -1).normalize() }, sunC: { value: new THREE.Color() }, sunK: { value: 1 } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform vec3 top, hor, low, sunC, sunDir; uniform float sunK; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h,0.,1.), .6)) : mix(hor, low, clamp(-h*4.,0.,1.)); float d = max(dot(normalize(vP), normalize(sunDir)), 0.); c += sunC * sunK * (pow(d, 60.) + .25 * pow(d, 6.)); gl_FragColor = vec4(c,1.); }` });
const skyM = new THREE.Mesh(new THREE.SphereGeometry(1400, 48, 24), skyMat); skyM.renderOrder = -2; PL.add(skyM);
const starsP = (() => { const r = rng(5), a = []; for (let i = 0; i < 2400; i++) { const u = r() * .98 + .02, an = r() * TAU, R = 1300; a.push(R * Math.sqrt(1 - u * u) * Math.cos(an), R * u, R * Math.sqrt(1 - u * u) * Math.sin(an)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false })); m.renderOrder = -1; return m; })(); PL.add(starsP);
const sunCore = sprite(TEX.glowY, 60, true, 1), sunHalo = sprite(TEX.glowY, 260, true, .4); PL.add(sunHalo, sunCore);
const groundTex = (base, dark, kind) => canvasTex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(kind.length * 7);
  for (let i = 0; i < 3000; i++) { g.fillStyle = r() < .5 ? dark : 'rgba(255,255,255,.12)'; g.globalAlpha = .25 + r() * .35; g.beginPath(); g.arc(r() * w, r() * h, .8 + r() * (kind === 'earth' ? 2 : 3.5), 0, TAU); g.fill(); }
  g.globalAlpha = 1; if (kind === 'mercury') for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * h, s = 6 + r() * 30; g.strokeStyle = 'rgba(30,30,30,.5)'; g.lineWidth = 2 + s * .12; g.beginPath(); g.arc(x, y, s, 0, TAU); g.stroke(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fill(); }
  if (kind === 'venus') { g.strokeStyle = '#ff7a1a'; g.shadowColor = '#ffb040'; g.shadowBlur = 10; for (let i = 0; i < 26; i++) { g.lineWidth = 1.5 + r() * 3; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 90; y += (r() - .5) * 90; g.lineTo(x, y); } g.stroke(); } } });
const TEXS = {}; for (const k of Object.keys(LOOK)) { const t = groundTex(LOOK[k].ground, LOOK[k].g2, k); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 30); TEXS[k] = t; }
const lavaEm = TEXS.venus;
const R0 = rng(5), PERM = Array.from({ length: 512 }, () => R0());
function vnoise(x, z) { const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, s = t => t * t * (3 - 2 * t), h = (a, b) => PERM[Math.abs((a * 73 + b * 191) % 512)]; return lerp(lerp(h(xi, zi), h(xi + 1, zi), s(xf)), lerp(h(xi, zi + 1), h(xi + 1, zi + 1), s(xf)), s(zf)); }
const terrH = (x, z) => { const r = Math.hypot(x, z); return sm(6, 30, r) * (vnoise(x * .05, z * .05) * 5 + vnoise(x * .16, z * .16) * 1.2 - 2) + sm(100, 220, r) * 26; };
const tg = new THREE.PlaneGeometry(600, 600, 200, 200); tg.rotateX(-Math.PI / 2); { const p = tg.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, terrH(p.getX(i), p.getZ(i))); tg.computeVertexNormals(); }
const groundMat = new THREE.MeshStandardMaterial({ map: TEXS.earth, roughness: .95, emissive: '#ffffff', emissiveMap: lavaEm, emissiveIntensity: 0 });
const ground = new THREE.Mesh(tg, groundMat); ground.receiveShadow = true; PL.add(ground);
const rocks = []; { const r = rng(9); for (let i = 0; i < 80; i++) { const a = r() * TAU, d = 6 + r() * 80, x = Math.cos(a) * d, z = Math.sin(a) * d, s = .2 + r() * r() * 2.2; if (Math.abs(x) < 2.5 && z > -4 && z < 8) continue; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), new THREE.MeshStandardMaterial({ color: '#888', roughness: 1, flatShading: true })); m.position.set(x, terrH(x, z) + s * .3, z); m.rotation.set(r() * 3, r() * 3, r() * 3); m.scale.y = .6 + r() * .4; m.castShadow = true; PL.add(m); rocks.push(m); } }
// earth dressing: trees, flowers, clouds
const trees = []; { const r = rng(3); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = 9 + r() * 40, x = Math.cos(a) * d, z = Math.sin(a) * d - 10; const t = new THREE.Group(); t.position.set(x, terrH(x, z), z); PL.add(t); blk(.35, 2.4, .35, '#6b4f3a', 0, 1.2, 0, t); const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + r() * .8, 0), new THREE.MeshStandardMaterial({ color: r() < .5 ? '#4caf50' : '#3f9a45', flatShading: true })); c.position.y = 3.2; c.castShadow = true; t.add(c); trees.push(t); } }
const clouds = []; for (let i = 0; i < 24; i++) { const r = rng(i + 30), s = sprite(TEX.smoke, 60 + r() * 90, false, .85); s.material.color.set('#ffffff'); s.position.set((r() - .5) * 900, 90 + r() * 140, -200 - r() * 600); PL.add(s); clouds.push(s); }
// fx particles
const dustP = []; for (let i = 0; i < 30; i++) { const s = sprite(TEX.smoke, 8, false, 0); PL.add(s); dustP.push(s); }
const rain = []; for (let i = 0; i < 140; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.02, .7), new THREE.MeshBasicMaterial({ color: '#e8ff6a', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })); PL.add(m); rain.push(m); }
const sunL = new THREE.DirectionalLight('#fff', 2); sunL.castShadow = true; sunL.shadow.mapSize.set(1024, 1024); const scm = sunL.shadow.camera; scm.left = scm.bottom = -12; scm.right = scm.top = 12; scm.near = 1; scm.far = 200; sunL.shadow.bias = -.0005; const sunT = new THREE.Object3D(); PL.add(sunL, sunT); sunL.target = sunT;
const hemi = new THREE.HemisphereLight('#fff', '#444', 1); PL.add(hemi);
const heatL = new THREE.PointLight('#ff7a2a', 0, 30, 1.2); PL.add(heatL);
// gas-giant free fall: cloud floors far below plus puffs rushing upward
const GASY = -400;
const gasMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { time: { value: 0 }, cA: { value: new THREE.Color() }, cB: { value: new THREE.Color() }, band: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, storm: { value: 0 } },
  vertexShader: `varying vec3 wP; void main(){ vec4 w = modelMatrix * vec4(position,1.0); wP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float time, storm; uniform vec3 cA, cB, band, hor; varying vec3 wP;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + vec2(1.7,9.2); a *= .5; } return v; }
    void main(){ vec2 rel = wP.xz - vec2(60000.0, 0.0); vec2 q = rel * .008 + vec2(time * .08, 0.); float n = fbm(q + fbm(q * 1.7) * 1.2);
      float b = .5 + .5 * sin(rel.y * .02 + n * 4.0); vec3 c = mix(cA, cB, smoothstep(.3, .8, n)); c = mix(c, band, b * .45);
      float sw = smoothstep(.0, .6, 1. - length((rel - vec2(60., -120.)) * vec2(.006, .012))) * storm; c = mix(c, vec3(.75,.25,.12), sw * (.6 + .4 * sin(atan(rel.y + 120., rel.x - 60.) * 3. + length(rel) * .05 - time)));
      float dist = length(wP.xz - cameraPosition.xz); c = mix(c, hor, clamp(1. - exp(-dist * .0025), 0., 1.)); gl_FragColor = vec4(c, 1.); }` });
const gasFloor = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), gasMat); gasFloor.rotation.x = -Math.PI / 2; gasFloor.position.y = GASY - 120; PL.add(gasFloor);
const gasPuffs = []; for (let i = 0; i < 90; i++) { const r = rng(i + 70), s = sprite(TEX.smoke, 30 + r() * 60, false, .7); s.userData = { x: (r() - .5) * 160, z: (r() - .5) * 160, ph: r(), sz: 20 + r() * 50 }; PL.add(s); gasPuffs.push(s); }
const streaks = []; for (let i = 0; i < 50; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.06, 9), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })); PL.add(m); streaks.push(m); }
const satRings = new THREE.Group(); PL.add(satRings); satRings.position.set(0, GASY + 700, -1400); satRings.rotation.set(1.25, 0, .25);
[[900, 60, '#e8d6a8', .55], [980, 30, '#c8b48a', .4], [1030, 90, '#f0e2b8', .6]].forEach(([r0, w, c, a]) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r0 + w, 200), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: a, side: THREE.DoubleSide, depthWrite: false })); m.renderOrder = -1; satRings.add(m); });
const bolt = new THREE.PointLight('#cfe0ff', 0, 400, 1); PL.add(bolt);

// ---------- you ----------
const you = vox({ seed: 81, shirt: '#ff9a3c', pants: '#2f3b52', skin: '#e3b089', hair: '#4a2e1b', style: 0 }); PL.add(you);
const youFm = you.userData.fm;

// ---------- planets lined up in space (intro / outro) ----------
const SP = loc('PSPACE', 65000);
SP.add(new THREE.HemisphereLight('#cfe0ff', '#101020', .5)); const spSun = new THREE.DirectionalLight('#fff6e0', 2.8); spSun.position.set(-200, 40, 60); SP.add(spSun);
{ const r = rng(41), a = []; for (let i = 0; i < 2600; i++) { const u = r() * 2 - 1, an = r() * TAU, R = 1200; a.push(R * Math.sqrt(1 - u * u) * Math.cos(an), R * u, R * Math.sqrt(1 - u * u) * Math.sin(an)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); SP.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: 1.5, sizeAttenuation: false }))); }
const sunBall = sprite(TEX.glowY, 140, true, 1); sunBall.position.set(-90, 0, 0); SP.add(sunBall); const sunBall2 = sprite(TEX.glowY, 60, true, 1); sunBall2.material.color.set('#ffffff'); sunBall2.position.copy(sunBall.position); SP.add(sunBall2);
const bandTex = (cols, spot) => canvasTex(512, 256, (g, w, h) => { const r = rng(cols.length * 13); let y = 0; while (y < h) { const t = 6 + r() * 26; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(0, y, w, t + 1); y += t; } g.globalAlpha = .25; for (let i = 0; i < 40; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 60, 3 + r() * 6, 0, 0, TAU); g.fill(); } g.globalAlpha = 1; if (spot) { g.fillStyle = '#c0502a'; g.beginPath(); g.ellipse(w * .62, h * .62, 34, 18, 0, 0, TAU); g.fill(); } });
const dotTex = (base, dots, land) => canvasTex(512, 256, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(base.length + dots.length); for (let i = 0; i < 260; i++) { g.fillStyle = dots[Math.floor(r() * dots.length)]; g.globalAlpha = .3 + r() * .5; g.beginPath(); g.ellipse(r() * w, r() * h, 3 + r() * (land ? 50 : 14), 2 + r() * (land ? 30 : 10), r() * 3, 0, TAU); g.fill(); } g.globalAlpha = 1; if (land) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14); } });
const PLANETS = [
  ['mercury', 2.2, dotTex('#8a8a88', ['#5a5a58', '#aaaaa8'])], ['venus', 3.6, bandTex(['#e8c890', '#d8a868', '#f0d8a8'])], ['earth', 3.8, dotTex('#2a73cf', ['#3fae74', '#2f8f55', '#ffffff'], true)], ['mars', 2.8, dotTex('#c8673d', ['#8a3a20', '#e8956a'])],
  ['jupiter', 12, bandTex(['#c8905a', '#e8d0b0', '#a8683a', '#f2e2c8'], true)], ['saturn', 10, bandTex(['#e8d6a8', '#d8c08a', '#c8a870'])], ['uranus', 6, bandTex(['#a6e4e8', '#96d8e0', '#bff0f0'])], ['neptune', 5.8, bandTex(['#3a6ad8', '#2a4ac0', '#5a8aff'])],
];
const PBALL = {}; let px = -60;
PLANETS.forEach(([n, r, t], i) => { px += r * 1.2 + (i ? 6 : 0); const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), new THREE.MeshStandardMaterial({ map: t, roughness: .85 })); m.position.set(px, 0, 0); SP.add(m); PBALL[n] = m; px += r * 1.2;
  if (n === 'saturn') { const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.3, r * 2.2, 96), new THREE.MeshBasicMaterial({ color: '#e8d6a8', transparent: true, opacity: .55, side: THREE.DoubleSide })); ring.rotation.set(1.2, 0, .2); m.add(ring); }
  if (n === 'uranus') { const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.5, r * 1.6, 96), new THREE.MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: .4, side: THREE.DoubleSide })); ring.rotation.set(.2, 0, 1.45); m.add(ring); } });
const SPX = n => PBALL[n].position.x;

// ---------- per-frame reset ----------
function look(name) {
  const L = LOOK[name], u = skyMat.uniforms; u.top.value.set(L.top); u.hor.value.set(L.hor); u.low.value.set(L.low); u.sunC.value.set(L.sun); u.sunK.value = L.sunK;
  groundMat.map = TEXS[name]; groundMat.emissiveIntensity = name === 'venus' ? 1.2 : 0; groundMat.needsUpdate = true;
  rocks.forEach(r => r.material.color.set(name === 'earth' ? '#8a8a84' : name === 'mars' ? '#7a3a22' : name === 'mercury' ? '#6a6a68' : '#2a1810'));
  scene.fog = L.fogD ? new THREE.FogExp2(new THREE.Color(L.fog), L.fogD) : null; hemi.color.set(L.hemi[0]); hemi.groundColor.set(L.hemi[1]); hemi.intensity = L.hemi[2]; sunL.intensity = L.sunI; starsP.material.opacity = L.stars;
  trees.forEach(t => t.visible = name === 'earth'); clouds.forEach(c => c.visible = name === 'earth');
  const sd = V(...(name === 'mercury' ? [.3, .22, -1] : name === 'venus' ? [0, .6, -1] : [.4, .35, -1])).normalize(); u.sunDir.value.copy(sd); sunCore.position.copy(sd).multiplyScalar(1300); sunHalo.position.copy(sunCore.position);
  sunCore.scale.setScalar(name === 'mercury' ? 170 : name === 'venus' ? 0.01 : 60); sunHalo.scale.setScalar(name === 'mercury' ? 600 : name === 'venus' ? .01 : 260); sunCore.visible = sunHalo.visible = name !== 'venus';
  sunL.position.copy(sd).multiplyScalar(80); sunT.position.set(0, 0, 0); sunL.color.set(name === 'mars' ? '#ffe8d0' : name === 'venus' ? '#ffb060' : '#ffffff');
}
function gasMode(name, c, fallY) {
  const G = GAS[name], u = gasMat.uniforms; ground.visible = false; rocks.forEach(r => r.visible = false); trees.forEach(t => t.visible = false); clouds.forEach(cl => cl.visible = false); sunCore.visible = sunHalo.visible = false;
  gasFloor.visible = true; u.cA.value.set(G.cA); u.cB.value.set(G.cB); u.band.value.set(G.band); u.hor.value.set(G.hor); u.time.value = c.t; u.storm.value = name === 'jupiter' ? 1 : 0;
  const s = skyMat.uniforms; s.top.value.set(G.top); s.hor.value.set(G.hor); s.low.value.set(G.cA); s.sunK.value = .25; s.sunC.value.set('#ffffff');
  scene.fog = new THREE.FogExp2(new THREE.Color(G.hor), .004); hemi.color.set(G.hor); hemi.groundColor.set(G.cA); hemi.intensity = 1.3; sunL.intensity = 1.2; starsP.material.opacity = 0;
  gasPuffs.forEach(p => { const d = p.userData, y = fallY - 60 + (((c.t * 28 + d.ph * 120) % 120)); p.visible = true; p.position.set(d.x, y, d.z); p.scale.setScalar(d.sz); p.material.color.set(G.cB).lerp(new THREE.Color(G.cA), d.ph); p.material.opacity = .55; });
}
RESETS.push((c, sh) => {
  if (!isMine()) return; const mine = sh.loc === 'PLAN' || sh.loc === 'PSPACE';
  if (mine) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.shadowMap.enabled = true; bloom.strength = .4; bloom.threshold = .8; bloom.radius = .6; }
  if (sh.loc !== 'PLAN') return;
  ground.visible = true; rocks.forEach(r => r.visible = true); gasFloor.visible = false; gasPuffs.forEach(p => p.visible = false); satRings.visible = false; bolt.intensity = 0; heatL.intensity = 0;
  dustP.forEach(d => d.material.opacity = 0); rain.forEach(r => r.material.opacity = 0); streaks.forEach(s => s.material.opacity = 0); you.visible = false; you.scale.set(1, 1, 1); youFm.color.set('#ffffff'); you.traverse(o => { if (o.isMesh && o.material !== youFm && o.material.emissive) { } });
});
const tint = (col, k) => you.traverse(o => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { if (m.emissive) { m.emissive.set(col); m.emissiveIntensity = k; } }); } });
RESETS.push((c, sh) => { if (isMine() && sh.loc === 'PLAN') tint('#000000', 0); });

// ---------- camera helper ----------
const pathCam = (c, keys) => { let k0 = keys[0], k1 = keys[0], s = 0; const T = k => typeof k.t === 'number' ? k.t : c.lt - (k.t[1] === 'e' ? c.che(k.t[0]) : c.ch(k.t[0])) + (k.t[2] || 0);
  for (let i = 0; i < keys.length - 1; i++) { const a = T(keys[i]), b = T(keys[i + 1]); if (c.lt >= a) { k0 = keys[i]; k1 = keys[i + 1]; s = clamp((c.lt - a) / Math.max(b - a, .01)); } }
  if (c.lt >= T(keys[keys.length - 1])) { k0 = k1 = keys[keys.length - 1]; s = 0; } const e = eio(s); return { p: P(k0.p, k1.p, e), at: P(k0.a, k1.a, e), fov: lerp(k0.fov || 44, k1.fov || 44, e), roll: lerp(k0.roll || 0, k1.roll || 0, e) }; };
const H0 = terrH(0, 0);
const standCam = (c, extra = []) => pathCam(c, [{ t: 0, p: [4.2, H0 + 2.2, 6.5], a: [0, H0 + 1.3, 0], fov: 46 }, { t: [1, 's'], p: [2.4, H0 + 1.7, 3.6], a: [0, H0 + 1.5, 0], fov: 40 }, ...extra, { t: c.d, p: [1.4, H0 + 1.6, 2.4], a: [0, H0 + 1.45, 0], fov: 34 }]);
const fallCam = (c, y) => { const a = c.t * .3; return { p: [Math.sin(a) * 4.5, y + 2.4, Math.cos(a) * 4.5], at: [0, y - .4, 0], fov: 52, roll: Math.sin(c.t * .7) * .08 }; };
function falling(c, y, o = {}) { put(you, 0, y - 1.2, 0, c.t * .6, c.t, { arms: [[0, 0, -2.6 + Math.sin(c.t * 6) * .3], [0, 0, 2.6 - Math.sin(c.t * 6 + 1) * .3]], expr: o.expr || 'o', blink: false }); you.rotation.x = -.9 + Math.sin(c.t * 2) * .2; you.rotation.z = Math.sin(c.t * 1.3) * .3;
  you.userData.legs[0].rotation.x = Math.sin(c.t * 8) * .5; you.userData.legs[1].rotation.x = -Math.sin(c.t * 8) * .5; }
function windFX(c, y, k, col = '#ffffff') { streaks.forEach((s, i) => { const r = rng(i * 11), x = (r() - .5) * 14, z = (r() - .5) * 14, yy = y - 10 + (((c.t * (40 + 60 * k) + r() * 30) % 30)); s.position.set(x, yy, z); s.lookAt(camera.position.x - PL.position.x, yy, camera.position.z); s.material.color.set(col); s.material.opacity = (.2 + r() * .4) * k; }); }

// ---------- shots ----------
Object.assign(SHOTS, {
  pintro: { loc: 'PSPACE', aperture: .0002, cam: c => { const x = lerp(SPX('mercury') - 10, SPX('saturn'), eio(c.p)); return { p: [x, 12, 95], at: [x + 18, 0, 0], fov: 46 }; },
    fx: c => { Object.values(PBALL).forEach((m, i) => m.rotation.y = c.t * .15 + i); } },
  pearth: { loc: 'PLAN', aperture: .0012, cam: c => standCam(c), fx: c => { look('earth'); put(you, 0, H0, 0, .35, c.t, { cheer: sm(0, .6, c.lt) * (c.ch(2) > 0 ? .4 : 1), expr: c.ch(2) > 0 ? 'smile' : 'big', ph: 1 }); clouds.forEach((s, i) => s.position.x += Math.sin(c.t * .05 + i) * .1); } },
  pmars: { loc: 'PLAN', aperture: .0012, cam: c => standCam(c), fx: c => { look('mars'); const gasp = sm(0, .5, c.ch(1)), fall = sm(0, .8, c.ch(3)); put(you, 0, H0, 0, .35, c.t, { arms: [[-2.3 * gasp, 0, .5 * gasp], [-2.3 * gasp, 0, -.5 * gasp]], expr: fall > .3 ? 'sleep' : gasp > 0 ? 'o' : 'neutral', blink: false }); you.rotation.x = -fall * 1.45; you.position.y = H0 + fall * .3;
      dustP.forEach((d, i) => { const r = rng(i + 4), a = (c.t * .1 + r()) % 1; d.position.set((r() - .5) * 30 + a * 20, H0 + 1 + r() * 4, -6 - r() * 20); d.scale.setScalar(6 + r() * 8); d.material.color.set('#c88a5a'); d.material.opacity = .25 * Math.sin(a * Math.PI); }); } },
  pmercury: { loc: 'PLAN', aperture: .0012, cam: c => pathCam(c, [{ t: 0, p: [-3.5, H0 + 1.8, 5], a: [0, H0 + 1.3, 0], fov: 44 }, { t: [2, 's'], p: [-2.2, H0 + 1.6, 3], a: [0, H0 + 1.4, 0], fov: 40 }, { t: [3, 's'], p: [2.6, H0 + 1.6, 3], a: [0, H0 + 1.4, 0], fov: 40 }, { t: c.d, p: [1.8, H0 + 1.5, 2.2], a: [0, H0 + 1.4, 0], fov: 36 }]),
    fx: c => { look('mercury'); const burn = sm(0, 1, c.ch(2)); put(you, 0, H0, 0, .3, c.t, { arms: [[-1.2, 0, .3], [-.3, 0, -.2]], expr: c.ch(2) > 0 ? 'squint' : 'o', blink: false }); tint('#ff3a10', .16 * burn); heatL.position.set(4, H0 + 2, -4); heatL.intensity = 4 * burn; } },
  puranus: { loc: 'PLAN', aperture: .0004, cam: c => fallCam(c, GASY), fx: c => { gasMode('uranus', c, GASY); falling(c, GASY, { expr: c.ch(3) > 0 ? 'squint' : 'o' }); windFX(c, GASY, .4); tint('#7fe9ff', .15 * sm(0, 1, c.p)); } },
  psaturn: { loc: 'PLAN', aperture: .0004, cam: c => { const k = fallCam(c, GASY); k.at = P(k.at, [0, GASY + 300, -1400], sm(0, .45, c.p) * (1 - sm(.55, .9, c.p))); return k; }, fx: c => { gasMode('saturn', c, GASY); satRings.visible = true; falling(c, GASY); windFX(c, GASY, .8); } },
  pneptune: { loc: 'PLAN', aperture: .0004, cam: c => { const k = fallCam(c, GASY); k.roll += Math.sin(c.t * 9) * .05; return k; }, kick: c => .05, fx: c => { gasMode('neptune', c, GASY); falling(c, GASY); you.rotation.y = c.t * 4; windFX(c, GASY, 1.4, '#cfe0ff'); } },
  pjupiter: { loc: 'PLAN', aperture: .0004, cam: c => fallCam(c, GASY), fx: c => { gasMode('jupiter', c, GASY); falling(c, GASY, { expr: 'o' }); windFX(c, GASY, 1); const fl = Math.max(0, Math.sin(c.t * 2.3) * Math.sin(c.t * 7.1)); bolt.position.set(8, GASY - 10, -8); bolt.intensity = fl > .6 ? 900 : 0; you.scale.set(1 + sm(.4, 1, c.p) * .15, 1 - sm(.4, 1, c.p) * .2, 1 + sm(.4, 1, c.p) * .15); } },
  pvenus: { loc: 'PLAN', aperture: .0012, cam: c => pathCam(c, [{ t: 0, p: [3.4, H0 + 2.2, 5.5], a: [0, H0 + 1.2, 0], fov: 46 }, { t: [3, 's'], p: [1.8, H0 + 1.5, 2.8], a: [0, H0 + 1, 0], fov: 40 }, { t: c.d, p: [2.2, H0 + 1.4, 3.4], a: [0, H0 + .8, 0], fov: 38 }]),
    kick: c => { const a = c.che(4) > 0 ? c.che(4) : -1; return a > 0 && a < .8 ? .2 * (1 - a / .8) : 0; },
    fx: c => { look('venus'); const crush = c.che(4) > 0 ? eo(clamp(c.che(4) / .25)) : 0; put(you, 0, H0, 0, .3, c.t, { arms: [[-.4, 0, .6], [-.4, 0, -.6]], expr: crush > 0 ? 'squint' : 'o', blink: false }); you.scale.set(1 + crush * .5, 1 - crush * .78, 1 + crush * .5); tint('#ff5a10', .6 * crush + .15);
      heatL.position.set(0, H0 + 3, 2); heatL.intensity = 3; rain.forEach((r, i) => { const rr = rng(i + 2), y = H0 + 8 - ((c.t * (9 + rr() * 5) + rr() * 10) % 10); r.position.set((rr() - .5) * 10, y, -2 - rr() * 8); r.material.opacity = .55 * sm(0, 1, c.ch(3) + 1.5); r.lookAt(camera.position.x - PL.position.x, y, camera.position.z); });
      dustP.forEach((d, i) => { const r = rng(i + 9), a = (c.t * .15 + r()) % 1; d.position.set((r() - .5) * 18, H0 + a * 6, -3 - r() * 12); d.scale.setScalar(4 + a * 8); d.material.color.set('#e89040'); d.material.opacity = .3 * Math.sin(a * Math.PI); }); },
    post: c => { const a = c.che(4) > 0 ? c.che(4) : -1; return a > 0 && a < 1 ? `<rect width="576" height="1024" fill="#fff3d8" opacity="${(.9 * Math.exp(-a * 3)).toFixed(2)}"/>` : ''; } },
  pend: { loc: 'PSPACE', noCap: true, aperture: .0002, cam: c => ({ p: P([SPX('neptune') + 30, 10, 70], [SPX('earth') + 10, 14, 120], eio(c.p)), at: P([SPX('saturn'), 0, 0], [SPX('jupiter') - 6, 0, 0], eio(c.p)), fov: 46 }),
    fx: c => { Object.values(PBALL).forEach((m, i) => m.rotation.y = c.t * .15 + i); },
    ov: c => { const RANK = { earth: 8, mars: 7, mercury: 6, uranus: 5, saturn: 4, neptune: 3, jupiter: 2, venus: 1 }; return Object.entries(RANK).map(([n, r], i) => { const m = PBALL[n], q = project(world('PSPACE', m.position.x, m.geometry.parameters.radius + 3, 0)), k = clamp((c.lt - .2 - i * .08) / .3); if (q.behind || k <= 0) return ''; return `<g opacity="${k.toFixed(2)}" transform="translate(${f1(q.x)} ${f1(q.y)})"><circle r="17" fill="${r === 1 ? '#e8343a' : '#0b1020'}" stroke="#fff" stroke-width="2.5"/><text y="6.5" text-anchor="middle" font-family="Inter" font-weight="800" font-size="17" fill="#fff">${r}</text></g>`; }).join(''); },
    post: c => { const a = c.lt - (c.d - 2.6); if (a <= 0) return ''; const bar = eio(clamp(a / .8)), gap = lerp(512, 70, bar), t1 = clamp((a - .6) / .5), t2 = clamp((a - 1.1) / .5); const S = (y, txt, size, fill, op, it) => `<text x="288" y="${y}" text-anchor="middle" font-family="EBG" font-weight="500" ${it ? 'font-style="italic"' : ''} font-size="${size}" fill="${fill}" opacity="${op.toFixed(2)}">${txt}</text>`;
      return `<rect width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/><rect y="${f1(512 + gap)}" width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/>` + S(360, 'Every planet, ranked by', 33, '#fff', t1) + S(400, 'how fast it would kill you.', 33, '#fff', t1) + S(664, 'Which one would you pick?', 24, ORANGE, t2, true); } },
});
// ---------- HUD ----------
const INFO = {
  pearth: { rank: 8, name: 'EARTH', die: 'LIFESPAN', clock: () => '~80 YEARS', l1: 'AIR <tspan fill="#8ff3a0">BREATHABLE</tspan>', l2: 'TEMP <tspan fill="#8ff3a0">15°C</tspan>' },
  pmars: { rank: 7, name: 'MARS', limit: 120, l1: 'PRESSURE <tspan fill="#ff6a4a">0.6% OF EARTH</tspan>', l2: 'TEMP <tspan fill="#8fd8ff">−60°C</tspan>' },
  pmercury: { rank: 6, name: 'MERCURY', limit: 90, l1: 'AIR <tspan fill="#ff6a4a">NONE</tspan>', l2: 'TEMP <tspan fill="#ff6a4a">430°C</tspan> / <tspan fill="#8fd8ff">−180°C</tspan>' },
  puranus: { rank: 5, name: 'URANUS', limit: 60, l1: 'GROUND <tspan fill="#ff6a4a">NONE</tspan>', l2: 'TEMP <tspan fill="#8fd8ff">−224°C</tspan>' },
  psaturn: { rank: 4, name: 'SATURN', limit: 8, l1: 'WIND <tspan fill="#ff6a4a">1,800 km/h</tspan>', l2: 'GROUND <tspan fill="#ff6a4a">NONE</tspan>' },
  pneptune: { rank: 3, name: 'NEPTUNE', limit: 5, l1: 'WIND <tspan fill="#ff6a4a">2,100 km/h</tspan>', l2: 'TEMP <tspan fill="#8fd8ff">−200°C</tspan>' },
  pjupiter: { rank: 2, name: 'JUPITER', limit: 3, l1: 'RADIATION <tspan fill="#ff6a4a">LETHAL</tspan>', l2: 'STORM <tspan fill="#ff6a4a">BIGGER THAN EARTH</tspan>' },
  pvenus: { rank: 1, name: 'VENUS', limit: .8, l1: 'PRESSURE <tspan fill="#ff6a4a">92× EARTH</tspan>', l2: 'TEMP <tspan fill="#ff6a4a">465°C</tspan>' },
};
const fmt = s => { const m = Math.floor(s / 60), ss = s % 60; return `${String(m).padStart(2, '0')}:${ss.toFixed(2).padStart(5, '0')}`; };
GLOBAL_OV.push((t, c, sh) => {
  if (!isMine()) return ''; const I = INFO[c.o.scene]; if (!I) return '';
  const run = clamp(c.lt / Math.max(c.d - .6, .5)), s = I.limit != null ? I.limit * eio(run) : 0, dead = I.limit != null && run >= 1;
  const clock = I.clock ? I.clock() : fmt(s), pulse = dead ? (Math.sin(t * 12) > 0 ? '#ff3a3a' : '#fff') : '#fff', k = clamp(c.lt / .25);
  return `<g transform="translate(26 392)" opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.65))">
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="14" fill="${ORANGE}" letter-spacing="2.4">#${I.rank} · ${I.name}</text>
    <text x="0" y="22" font-family="Inter" font-weight="800" font-size="11" fill="#fff" fill-opacity=".8" letter-spacing="2">${I.die || 'TIME TO DEATH'}</text>
    <text x="0" y="66" font-family="Inter" font-weight="800" font-size="42" fill="${pulse}">${clock}</text>
    <text x="0" y="90" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">${I.l1}</text>
    <text x="0" y="110" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">${I.l2}</text></g>`
    + `<g transform="translate(540 300)" opacity="${(k * .9).toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">${[8, 7, 6, 5, 4, 3, 2, 1].map((r, i) => `<circle cx="0" cy="${i * 30}" r="${r === I.rank ? 11 : 6}" fill="${r === I.rank ? ORANGE : r > I.rank ? '#ffffff' : 'rgba(255,255,255,.35)'}"/>` + (r === I.rank ? `<text x="-18" y="${i * 30 + 5}" text-anchor="end" font-family="Inter" font-weight="800" font-size="13" fill="#fff">${r}</text>` : '')).join('')}</g>`;
});
window.__planets = true;
