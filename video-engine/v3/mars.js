// "What if you were born on Mars": Mars surface, a family habitat, a sky that changes with the story, and the shots.
const E = window.ENG;
const { THREE, scene, LOC, loc, SHOTS, RESETS, GLOBAL_OV, toon, glow, ink, box, cyl, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng, billboard, BB } = E;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), GOLD = '#ffc83d', CYAN = '#62d5ff', RED = '#ff4a4a', GREEN = '#34d399';
['you', 'mom', 'dad'].forEach(n => billboard(n, 1.27, 1.9, 800, 1200));
const bigText = (x, y, text, size, fill, k = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${k.toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="${size}" fill="${fill}" stroke="#15151c" stroke-width="${Math.max(6, size * .07)}" stroke-linejoin="round" paint-order="stroke" style="paint-order:stroke">${text}</text></g>`;
const label = (q, text, col, k) => k <= 0 || q.behind ? '' : `<g transform="translate(${f1(q.x)} ${f1(q.y)}) scale(${k.toFixed(3)})"><line x1="0" y1="0" x2="0" y2="-34" stroke="${col}" stroke-width="3"/><circle r="5" fill="${col}"/><text y="-44" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="26" fill="#fff" stroke="#15151c" stroke-width="6" paint-order="stroke" letter-spacing="2">${text}</text></g>`;

// ---------- value noise for terrain ----------
const R0 = rng(5), PERM = Array.from({ length: 512 }, () => R0());
const hash = (x, z) => PERM[((x * 73856093) ^ (z * 19349663)) & 511 >>> 0] ?? PERM[Math.abs((x * 73 + z * 191) % 512)];
function vnoise(x, z) { const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, s = t => t * t * (3 - 2 * t); const a = PERM[Math.abs((xi * 73 + zi * 191) % 512)], b = PERM[Math.abs(((xi + 1) * 73 + zi * 191) % 512)], c = PERM[Math.abs((xi * 73 + (zi + 1) * 191) % 512)], d = PERM[Math.abs(((xi + 1) * 73 + (zi + 1) * 191) % 512)]; return lerp(lerp(a, b, s(xf)), lerp(c, d, s(xf)), s(zf)); }
const terrainH = (x, z) => { const r = Math.hypot(x, z); const flat = clamp((r - 14) / 18); return flat * (vnoise(x * .05, z * .05) * 6 + vnoise(x * .15, z * .15) * 1.6 - 2.2) + clamp((r - 120) / 60) * 30; };

// ---------- MARS surface ----------
const MARS = loc('MARS', 6000);
const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
  uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, .3, -1) }, glowC: { value: new THREE.Color() }, glowK: { value: 0 }, glowW: { value: 8 } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform vec3 top, hor, glowC; uniform vec3 sunDir; uniform float glowK, glowW; varying vec3 vP;
    void main(){ float h = clamp(vP.y, 0.0, 1.0); vec3 c = mix(hor, top, pow(h, 0.55)); float d = max(dot(normalize(vP), normalize(sunDir)), 0.0); c += glowC * glowK * pow(d, glowW); gl_FragColor = vec4(c, 1.0); }` }));
MARS.add(sky);
const starsM = (() => { const r = rng(17), pos = []; for (let i = 0; i < 1400; i++) { const u = r() * .95 + .05, a = r() * TAU, R = 850; pos.push(R * Math.sqrt(1 - u * u) * Math.cos(a), R * u, R * Math.sqrt(1 - u * u) * Math.sin(a)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); return new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0 })); })();
MARS.add(starsM);
const groundTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#c8673d'; g.fillRect(0, 0, w, h); const r = rng(4); for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .5 ? 'rgba(120,52,28,.35)' : 'rgba(236,150,96,.32)'; g.beginPath(); g.arc(r() * w, r() * h, .8 + r() * 3.2, 0, 7); g.fill(); } });
groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping; groundTex.repeat.set(40, 40);
const tg = new THREE.PlaneGeometry(500, 500, 180, 180); tg.rotateX(-Math.PI / 2);
{ const p = tg.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, terrainH(p.getX(i), p.getZ(i))); tg.computeVertexNormals(); }
const ground = new THREE.Mesh(tg, toon('#ffffff', { map: groundTex })); MARS.add(ground);
{ // rocks and craters
  const r = rng(23);
  for (let i = 0; i < 70; i++) { const a = r() * TAU, d = 9 + r() * 70, x = Math.cos(a) * d, z = Math.sin(a) * d, s = .25 + r() * r() * 1.8; if (Math.hypot(x + 12, z + 4) < 6 || (Math.abs(x) < 3 && z > 0 && z < 20)) continue; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), toon(r() < .5 ? '#8e4128' : '#a9512f')); m.position.set(x, terrainH(x, z) + s * .35, z); m.rotation.set(r() * 3, r() * 3, r() * 3); m.scale.y = .6 + r() * .4; ink(m, .02); MARS.add(m); }
  for (let i = 0; i < 9; i++) { const a = r() * TAU, d = 30 + r() * 80, x = Math.cos(a) * d, z = Math.sin(a) * d, s = 3 + r() * 7; const rim = new THREE.Mesh(new THREE.TorusGeometry(s, s * .18, 6, 28), toon('#b85b33')); rim.rotation.x = Math.PI / 2; rim.position.set(x, terrainH(x, z) + .1, z); rim.scale.z = .35; MARS.add(rim); const fl = new THREE.Mesh(new THREE.CircleGeometry(s, 28), toon('#9a4526')); fl.rotation.x = -Math.PI / 2; fl.position.set(x, terrainH(x, z) - .05, z); MARS.add(fl); }
}
// habitat: three domes, tunnels, greenhouse, solar panels, airlock, landing pad + rocket
const HABX = new THREE.Group(); MARS.add(HABX);
const dome = (r, x, z, c = '#f4f1ea') => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16, 0, TAU, 0, Math.PI / 2), toon(c)); m.position.set(x, 0, z); ink(m, .03); HABX.add(m); const b = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.02, r * 1.05, .4, 32), toon('#9aa6b5')); b.position.set(x, .2, z); ink(b, .02); HABX.add(b); return m; };
dome(4, 0, 0); dome(2.8, 8, -3); dome(3, -7.5, -2.5);
const gh = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 16, 0, TAU, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#9ff7c4', transparent: true, opacity: .35, depthWrite: false })); gh.position.set(3, 0, -10); HABX.add(gh);
for (let i = 0; i < 14; i++) { const r = rng(i + 40), c = new THREE.Mesh(new THREE.ConeGeometry(.3 + r() * .3, 1 + r() * 1.2, 7), toon(r() < .5 ? '#2fa865' : '#3fc277')); c.position.set(3 + (r() - .5) * 3.6, .6, -10 + (r() - .5) * 3.6); HABX.add(c); }
const ghGlow = sprite(TEX.glowC, 9, true, .35); ghGlow.material.color.set('#7dffb0'); ghGlow.position.set(3, 1.5, -10); HABX.add(ghGlow);
[[4, -1.5, 5.6, -2.2], [-4.2, -1.2, -5.2, -2.2], [1.5, -4.5, 2.6, -8]].forEach(([x1, z1, x2, z2]) => { const len = Math.hypot(x2 - x1, z2 - z1), m = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, len, 16), toon('#e6e1d6')); m.position.set((x1 + x2) / 2, .8, (z1 + z2) / 2); m.rotation.z = Math.PI / 2; m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); ink(m, .02); HABX.add(m); });
const winMat = glow('#ffd27a'); [[0, 2.2, 3.4], [-2.4, 2, 2.6], [2.4, 2, 2.6], [8, 1.6, -.4], [-7.5, 1.7, .2]].forEach(([x, y, z]) => { const w = new THREE.Mesh(new THREE.CircleGeometry(.42, 20), winMat); w.position.set(x, y, z); w.lookAt(x * 2, y, z * 2 + (z > 0 ? 10 : 6)); HABX.add(w); });
const lockG = new THREE.Group(); lockG.position.set(0, 0, 3.9); HABX.add(lockG);
box(2.2, 2.6, 1.6, '#e6e1d6', 0, 1.3, .3, lockG); const lockDoor = box(1.5, 2.1, .12, '#f2c14e', 0, 1.1, 1.2, lockG); const lockDark = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.1), new THREE.MeshBasicMaterial({ color: '#3a2a1e' })); lockDark.position.set(0, 1.1, 1.14); lockG.add(lockDark);
const lockLight = new THREE.PointLight('#ffd9a0', 0, 8); lockLight.position.set(0, 1.5, 1.6); lockG.add(lockLight);
for (const [x, z] of [[-12, 6], [-14.5, 6], [-12, 9], [-14.5, 9]]) { const pn = box(2.2, .08, 2.6, '#2b4a8f', x, 1.4, z, MARS); pn.rotation.x = -.5; for (let i = 1; i < 3; i++) box(2.22, .1, .05, '#9fb6e8', 0, 0, -1.3 + i * .86, pn, false); cyl(.07, .07, 1.4, '#9aa6b5', x, .7, z + .4, MARS, 8); }
const pad = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, .25, 40), toon('#6f7783')); pad.position.set(20, .12, 8); MARS.add(pad); ink(pad, .02);
const padRing = new THREE.Mesh(new THREE.TorusGeometry(3.6, .12, 6, 40), glow('#ffc83d')); padRing.rotation.x = Math.PI / 2; padRing.position.set(20, .27, 8); MARS.add(padRing);
const rocket = new THREE.Group(); rocket.position.set(20, .25, 8); MARS.add(rocket);
cyl(1.1, 1.2, 7, '#f4f1ea', 0, 3.5, 0, rocket, 24); const nose = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.6, 24), toon('#e5484d')); nose.position.y = 8.3; rocket.add(nose); ink(nose, .02);
cyl(1.12, 1.12, .5, '#e5484d', 0, 5.6, 0, rocket, 24); for (let i = 0; i < 3; i++) { const fn = box(.15, 1.8, 1.4, '#e5484d', 0, .9, 0, rocket); fn.position.set(Math.cos(i * TAU / 3) * 1.15, .9, Math.sin(i * TAU / 3) * 1.15); fn.rotation.y = -i * TAU / 3; }
const portR = new THREE.Mesh(new THREE.CircleGeometry(.35, 20), glow('#9fdcff')); portR.position.set(0, 6.4, 1.12); rocket.add(portR);
// sky objects
const sunS = sprite(TEX.glowY, 120, true, 1), sunDisc = sprite(TEX.glowY, 26, true, 1); MARS.add(sunS, sunDisc);
const moonTex = canvasTex(128, 128, (g) => { g.fillStyle = '#9a8f86'; g.beginPath(); g.ellipse(64, 64, 58, 40, .4, 0, 7); g.fill(); g.fillStyle = '#7c726a'; [[44, 54, 9], [80, 70, 12], [62, 40, 6]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); g.strokeStyle = '#15151c'; g.lineWidth = 5; g.beginPath(); g.ellipse(64, 64, 58, 40, .4, 0, 7); g.stroke(); });
const phobos = sprite(moonTex, 46, false, 0), deimos = sprite(moonTex, 18, false, 0); MARS.add(phobos, deimos);
const earthDot = sprite(TEX.glowC, 22, true, 0); earthDot.material.color.set('#7fb8ff'); MARS.add(earthDot);
phobos.position.set(-260, 380, -560); deimos.position.set(220, 520, -520); earthDot.position.set(70, 260, -700);
// storm: dust wall + fog
const dust = []; { const r = rng(55); for (let i = 0; i < 70; i++) { const s = sprite(TEX.smoke, 30, false, 0); s.material.color.set(r() < .5 ? '#b77a4c' : '#9c5f38'); s.userData = { x: (r() - .5) * 260, y: 4 + r() * 50, z: r() * 60, sz: 30 + r() * 60, sp: .5 + r() }; MARS.add(s); dust.push(s); } }
const marsLights = { sun: new THREE.DirectionalLight('#fff0dc', 2.6), hemi: new THREE.HemisphereLight('#f3cfa0', '#5a2a18', 1.0) };
marsLights.sun.position.set(-60, 80, 40); MARS.add(marsLights.sun, marsLights.hemi);
const PRESET = {
  day: { top: '#c3875a', hor: '#ecc896', glowC: '#fff6e0', glowK: .9, glowW: 10, sun: [-.35, .55, -1], sunCol: '#fff6e0', sunI: 2.6, hemi: 1.0, stars: 0 },
  dawn: { top: '#5d4560', hor: '#e8a273', glowC: '#ffd9a0', glowK: 1.1, glowW: 6, sun: [.6, .08, -1], sunCol: '#ffd2a0', sunI: 1.8, hemi: .75, stars: .5 },
  night: { top: '#03040c', hor: '#1d1622', glowC: '#000000', glowK: 0, glowW: 8, sun: [0, -1, 0], sunCol: '#8aa0d8', sunI: .5, hemi: .38, stars: 1 },
  storm: { top: '#6e4a2c', hor: '#9b6d43', glowC: '#ffd9a0', glowK: .25, glowW: 4, sun: [-.3, .5, -1], sunCol: '#d9a070', sunI: .8, hemi: .7, stars: 0 },
  sunset: { top: '#2a2338', hor: '#b98157', glowC: '#5fa8ff', glowK: 2.2, glowW: 7, sun: [.25, .045, -1], sunCol: '#cfe3ff', sunI: 1.3, hemi: .55, stars: .35 },
};
function setSky(name, k = 1, from) {
  const a = PRESET[from || name], b = PRESET[name], u = sky.material.uniforms, C = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), k);
  u.top.value.copy(C(a.top, b.top)); u.hor.value.copy(C(a.hor, b.hor)); u.glowC.value.copy(C(a.glowC, b.glowC)); u.glowK.value = lerp(a.glowK, b.glowK, k); u.glowW.value = lerp(a.glowW, b.glowW, k);
  const sd = new THREE.Vector3(...P(a.sun, b.sun, k)).normalize(); u.sunDir.value.copy(sd);
  sunS.position.copy(sd).multiplyScalar(800); sunDisc.position.copy(sunS.position); sunS.material.opacity = sd.y > -.05 ? lerp(.7, .55, k) : 0; sunDisc.material.opacity = sd.y > -.05 ? 1 : 0;
  sunS.material.color.set(name === 'sunset' ? '#9fc8ff' : '#fff2cc'); sunDisc.material.color.set(name === 'sunset' ? '#e8f2ff' : '#fff8e0');
  marsLights.sun.color.copy(C(a.sunCol, b.sunCol)); marsLights.sun.intensity = lerp(a.sunI, b.sunI, k); marsLights.hemi.intensity = lerp(a.hemi, b.hemi, k);
  marsLights.sun.position.copy(sd).multiplyScalar(100); starsM.material.opacity = lerp(a.stars, b.stars, k);
}
RESETS.push(() => { scene.fog = null; dust.forEach(d => d.material.opacity = 0); phobos.material.opacity = deimos.material.opacity = earthDot.material.opacity = 0; lockDoor.position.y = 1.1; lockLight.intensity = 0; setSky('day'); });

// ---------- HOME interior ----------
const HOME = loc('HOME', 7000);
const wallTex = canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#efe3cf'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d6c4a6'; g.lineWidth = 4; for (let x = 0; x < w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.fillStyle = '#e07a4a'; g.fillRect(0, h * .62, w, 22); g.fillStyle = '#2f6fed'; g.fillRect(0, h * .62 + 22, w, 8); });
wallTex.wrapS = THREE.RepeatWrapping; wallTex.repeat.set(2, 1);
const room = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 4.4, 24, 1, true), toon('#ffffff', { map: wallTex, side: THREE.BackSide })); room.position.y = 2.2; HOME.add(room);
const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 32), toon('#b9845a')); floor.rotation.x = -Math.PI / 2; HOME.add(floor);
const ceil = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 12, 0, TAU, 0, Math.PI / 2), toon('#f6eee0', { side: THREE.BackSide })); ceil.position.y = 4.4; ceil.scale.y = .45; HOME.add(ceil);
const rug = new THREE.Mesh(new THREE.CircleGeometry(2.4, 32), toon('#4f7fd9')); rug.rotation.x = -Math.PI / 2; rug.position.y = .02; HOME.add(rug);
const rug2 = new THREE.Mesh(new THREE.RingGeometry(1.7, 2.0, 32), toon('#ffc83d')); rug2.rotation.x = -Math.PI / 2; rug2.position.y = .03; HOME.add(rug2);
HOME.add(new THREE.HemisphereLight('#fff4e0', '#6a4a36', 1.05)); const lamp = new THREE.PointLight('#ffd9a0', 22, 16, 1.3); lamp.position.set(0, 3.6, 0); HOME.add(lamp);
const nightL = new THREE.PointLight('#7f9cff', 0, 12, 1.3); nightL.position.set(0, 2.5, -4.5); HOME.add(nightL);
function windowTex(mode) { return canvasTex(512, 512, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h * .7); if (mode === 'night') { sk.addColorStop(0, '#05060f'); sk.addColorStop(1, '#1d1622'); } else { sk.addColorStop(0, '#c3875a'); sk.addColorStop(1, '#f0cf9c'); } g.fillStyle = sk; g.fillRect(0, 0, w, h); if (mode === 'night') { const r = rng(3); g.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { g.globalAlpha = .4 + r() * .6; g.fillRect(r() * w, r() * h * .6, 2, 2); } g.globalAlpha = 1; g.fillStyle = '#9a8f86'; g.beginPath(); g.ellipse(150, 120, 26, 18, .4, 0, 7); g.fill(); g.fillStyle = '#9fd0ff'; g.beginPath(); g.arc(360, 90, 5, 0, 7); g.fill(); } else { g.fillStyle = 'rgba(255,248,224,.9)'; g.beginPath(); g.arc(160, 140, 30, 0, 7); g.fill(); } g.fillStyle = mode === 'night' ? '#3a1d14' : '#b55a32'; g.beginPath(); g.moveTo(0, h * .62); for (let x = 0; x <= w; x += 32) g.lineTo(x, h * .62 - 30 * Math.sin(x * .011) - 18 * Math.sin(x * .031)); g.lineTo(w, h); g.lineTo(0, h); g.fill(); g.fillStyle = mode === 'night' ? '#2a140e' : '#8e4128'; g.fillRect(0, h * .78, w, h); }); }
const winTex = { day: windowTex('day'), night: windowTex('night') };
const win = new THREE.Mesh(new THREE.CircleGeometry(1.75, 40), new THREE.MeshBasicMaterial({ map: winTex.day })); win.position.set(0, 2.3, -5.86); HOME.add(win);
const winFrame = new THREE.Mesh(new THREE.TorusGeometry(1.8, .16, 10, 40), toon('#9aa6b5')); winFrame.position.copy(win.position); HOME.add(winFrame); ink(winFrame, .02);
// crib, table + cake, bed, clock, screen, airlock door, plants
const crib = new THREE.Group(); crib.position.set(-2.2, 0, -3.2); HOME.add(crib);
box(1.9, .5, 1.1, '#f4f1ea', 0, .75, 0, crib); for (let i = 0; i < 9; i++) cyl(.04, .04, .7, '#f4f1ea', -.85 + i * .21, 1.3, .52, crib, 6, false); box(1.9, .08, .08, '#e07a4a', 0, 1.65, .52, crib);
const mobile = new THREE.Group(); mobile.position.set(0, 2.6, 0); crib.add(mobile); cyl(.02, .02, .6, '#555', 0, .3, 0, mobile, 4, false); ['#ffc83d', '#62d5ff', '#e5484d'].forEach((c, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.14, 12, 10), toon(c)); s.position.set(Math.cos(i * TAU / 3) * .45, -.15, Math.sin(i * TAU / 3) * .45); mobile.add(s); ink(s, .015); });
const table = new THREE.Group(); table.position.set(0, 0, -1); HOME.add(table);
cyl(1.1, 1.1, .12, '#8a5a3c', 0, 1.0, 0, table, 32); cyl(.12, .2, 1.0, '#6b4430', 0, .5, 0, table, 12);
const cake = cyl(.45, .45, .4, '#ee8fb4', 0, 1.26, 0, table, 28); cyl(.47, .47, .08, '#ffd1e3', 0, .18, 0, cake, 28, false);
cyl(.035, .035, .3, '#62d5ff', 0, .35, 0, cake, 8, false); const candleF = new THREE.Mesh(new THREE.ConeGeometry(.05, .16, 10), new THREE.MeshBasicMaterial({ color: '#ffd24a' })); candleF.position.y = .58; cake.add(candleF); const candleG = sprite(TEX.glowY, .7, true, .9); candleG.position.y = .58; cake.add(candleG);
const bed = new THREE.Group(); bed.position.set(3.2, 0, -2.6); bed.rotation.y = -.5; HOME.add(bed);
box(2.4, .5, 1.3, '#8a5a3c', 0, .35, 0, bed); box(2.3, .25, 1.25, '#f4f1ea', 0, .72, 0, bed); box(1.5, .14, 1.28, '#2f6fed', .4, .9, 0, bed); box(.5, .18, .9, '#ffffff', -.85, .92, 0, bed);
const clockTex = canvasTex(512, 256, () => {}), clockCtx = clockTex.image.getContext('2d');
const clock = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshBasicMaterial({ map: clockTex })); clock.position.set(4.3, 2.7, -4.1); clock.rotation.y = -.82; HOME.add(clock);
const scrTex = canvasTex(640, 400, () => {}), scrCtx = scrTex.image.getContext('2d');
const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.62), new THREE.MeshBasicMaterial({ map: scrTex })); screen.position.set(-4.0, 2.2, -4.2); screen.rotation.y = .76; HOME.add(screen);
const scrFrame = box(2.8, 1.82, .1, '#2b3442', 0, 0, -.06, screen);
for (const [x, z] of [[4.6, 1.8], [-4.8, 1.2], [1.8, -4.9]]) { cyl(.35, .28, .55, '#e07a4a', x, .28, z, HOME, 14); for (let i = 0; i < 4; i++) { const lf = new THREE.Mesh(new THREE.ConeGeometry(.16, .9, 6), toon('#3fc277')); lf.position.set(x + Math.cos(i * 1.6) * .14, .9, z + Math.sin(i * 1.6) * .14); lf.rotation.z = Math.cos(i * 1.6) * .35; lf.rotation.x = Math.sin(i * 1.6) * .35; HOME.add(lf); } }
const gmaImg = new Image(); gmaImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(charSVG('gma', { expr: 'smile' })); await gmaImg.decode();
const confetti = []; { const r = rng(8), cols = ['#ffc83d', '#62d5ff', '#e5484d', '#34d399', '#f59e0b']; for (let i = 0; i < 50; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.08, .14), new THREE.MeshBasicMaterial({ color: cols[i % 5], side: THREE.DoubleSide })); m.userData = { x: (r() - .5) * 3, z: -1 + (r() - .5) * 2, ph: r() * 6, sp: .25 + r() * .2 }; m.visible = false; HOME.add(m); confetti.push(m); } }
RESETS.push(() => { table.visible = crib.visible = bed.visible = false; win.material.map = winTex.day; nightL.intensity = 0; lamp.intensity = 22; confetti.forEach(m => m.visible = false); mobile.rotation.y = 0; candleF.visible = true; candleG.material.opacity = .9; });
function drawClock(text, sub) { const g = clockCtx; g.fillStyle = '#0b1020'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#2b3442'; g.lineWidth = 16; g.strokeRect(8, 8, 496, 240); g.fillStyle = '#62d5ff'; g.font = '700 30px BarlowC, sans-serif'; g.textAlign = 'center'; g.fillText(sub, 256, 66); g.fillStyle = '#ffc83d'; g.font = '120px Anton, sans-serif'; g.fillText(text, 256, 196); clockTex.needsUpdate = true; }
function drawCall(remain, prog) { const g = scrCtx, W = 640, H = 400; g.fillStyle = '#10223a'; g.fillRect(0, 0, W, H); g.drawImage(gmaImg, 200, -40, 240, 360); g.fillStyle = 'rgba(11,16,32,.85)'; g.fillRect(0, 0, W, 54); g.fillStyle = '#9fd0ff'; g.font = '800 30px BarlowC, sans-serif'; g.textAlign = 'left'; g.fillText('● EARTH  ·  GRANDMA', 22, 38); g.fillStyle = 'rgba(11,16,32,.9)'; g.fillRect(0, 300, W, 100); g.fillStyle = '#ffffff'; g.font = '800 28px BarlowC, sans-serif'; g.fillText('YOUR MESSAGE ARRIVES IN', 22, 340); g.fillStyle = '#ffc83d'; g.font = '56px Anton, sans-serif'; g.textAlign = 'right'; g.fillText(remain, W - 22, 360); g.fillStyle = '#1f2a44'; g.fillRect(22, 372, W - 44, 14); g.fillStyle = '#62d5ff'; g.fillRect(22, 372, (W - 44) * prog, 14); scrTex.needsUpdate = true; }
drawClock('23:58', 'MARS TIME'); drawCall('22:00', 0);

// ---------- shots ----------
const youAt = (p, o = {}, extra = {}) => ({ id: 'you', p, o, ...extra });
Object.assign(SHOTS, {
  mhook: { loc: 'MARS', noCap: true, cam: c => ({ p: P([-30, 12, 44], [-8, 5, 17], eo(c.p)), at: P([0, 1, -10], [0, 1.8, 0], eio(c.p)), fov: 46 }), fx: c => setSky('dawn'),
    kick: c => Math.exp(-Math.max(c.ch(0), 0) * 7) * .5, flash: true,
    ov: c => bigText(288, 330, 'WHAT IF YOU WERE BORN ON', 40, '#fff', pop(c.lt, 0, .3), -2) + bigText(288, 470, 'MARS?!', 150, '#ff6a2c', pop(c.ch(0), 0, .35), -4) },
  sky: { loc: 'HOME', cam: c => { const k = eio(c.p); return { p: P([-1.9, 2.7, -1.5], [-.4, 1.4, 1.6], k), at: P([-2.2, 1.25, -3.2], [0, 2.4, -5.8], k), fov: 44 }; },
    fx: c => { crib.visible = true; mobile.rotation.y = c.t * .8; },
    set: c => [youAt([-2.2, 1.5, -3.15], { age: 'baby', expr: c.ch(1) > 0 ? 'smile' : 'neutral', look: [.3, -1] }, { s: .55, rot: 0 }), { id: 'mom', p: [-3.35, 1.0, -2.4], o: { expr: 'smile', look: [.6, .4], arms: { r: [190, 150] } } }],
    ov: c => { const k = pop(c.ch(2), .1); if (k <= 0) return ''; return `<g transform="translate(288 830) scale(${k.toFixed(3)})"><rect x="-150" y="-30" width="300" height="60" rx="30" fill="#0b1020" stroke="#15151c" stroke-width="4"/><circle cx="-108" cy="0" r="20" fill="#e3b57e" stroke="#fff" stroke-width="3"/><text x="16" y="10" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="28" fill="#e9c896" letter-spacing="2">BUTTERSCOTCH</text></g>`; } },
  bounce: { loc: 'HOME', cam: c => ({ p: P([2.6, 1.3, 3.2], [-1.2, 1.3, 3.4], eio(c.p)), at: P([2.0, 1.0, -.4], [-1.8, 1.0, -.4], eio(c.p)), fov: 46 }),
    set: c => { const hop = .95, n = Math.max(0, c.ch(1)) / hop, f = n % 1, h = c.ch(1) > 0 ? 4 * f * (1 - f) * 1.0 : 0, x = lerp(2.2, -2.0, clamp(Math.max(0, c.ch(1)) / Math.max(c.d - (c.o.chunks[1].t0 - c.o.t0), .5))); return [youAt([x, .8 + h, -.4], { age: 'baby', expr: h > .2 ? 'smile' : 'neutral', arms: h > .2 ? { l: [-150, 30], r: [150, 30] } : undefined }, { s: .85, rot: Math.sin(n * Math.PI) * 6 }), { id: 'dad', p: [-3.0, 1.0, -1.2], o: { expr: 'smile', look: [.6, 0], arms: { l: [-170, 120], r: [170, 120] } } }]; },
    ov: c => { const k = pop(c.lt, .2); return `<g transform="translate(288 236) scale(${k.toFixed(3)})"><rect x="-170" y="-46" width="340" height="96" rx="16" fill="#0b1020" stroke="#15151c" stroke-width="4"/><text x="-150" y="-12" font-family="BarlowC" font-weight="800" font-size="20" fill="#9aa5b8" letter-spacing="2">GRAVITY</text><text x="-150" y="30" font-family="BarlowC" font-weight="800" font-size="22" fill="#62d5ff">EARTH</text><rect x="-70" y="14" width="210" height="18" rx="9" fill="#62d5ff"/><text x="-150" y="-36" font-family="BarlowC" font-weight="800" font-size="1" fill="none">.</text><text x="-150" y="6" font-family="BarlowC" font-weight="800" font-size="22" fill="#ff7a3c">MARS</text><rect x="-70" y="-10" width="${f1(210 * .38 * eo(c.lt / .8))}" height="18" rx="9" fill="#ff7a3c"/><text x="150" y="6" text-anchor="end" font-family="Anton" font-size="24" fill="#fff">38%</text></g>`; },
    chips: [{ type: 'real', text: "MARS GRAVITY: 38% OF EARTH'S", at: 0, delay: .5, y: 340 }] },
  bday: { loc: 'HOME', cam: c => { const a = lerp(-.6, .45, eio(c.p)); return { p: [Math.sin(a) * 4.3, 2.2, -1 + Math.cos(a) * 4.3], at: [-.2, 1.25, -1], fov: 44 }; },
    fx: c => { table.visible = true; confetti.forEach((m, i) => { const d = m.userData, fall = ((c.t * d.sp + d.ph) % 1); m.visible = true; m.position.set(d.x + Math.sin(c.t + d.ph) * .2, 3.6 - fall * 3.4, d.z); m.rotation.set(c.t * 2 + d.ph, c.t * 3 + d.ph, 0); }); candleF.scale.y = 1 + .15 * Math.sin(c.t * 18); },
    set: c => [youAt([-.8, .74, -.05], { age: 'kid', expr: 'smile', look: [.5, .2], arms: { r: [150, 120] } }, { s: .78 }), { id: 'mom', p: [1.15, 1.0, -2.1], o: { expr: 'smile', look: [-.6, .2] } }, { id: 'dad', p: [-.25, 1.0, -2.6], o: { expr: 'smile', look: [-.3, .3] } }],
    ov: c => { const k = pop(c.lt, .1), e = clamp(Math.max(0, c.ch(1)) / 1.2), earth = lerp(1, 1.88, e); return `<g transform="translate(288 250) scale(${k.toFixed(3)})"><rect x="-210" y="-58" width="420" height="116" rx="16" fill="#0b1020" stroke="#15151c" stroke-width="4"/><text x="-105" y="-20" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="20" fill="#ff7a3c" letter-spacing="2">MARS AGE</text><text x="-105" y="40" text-anchor="middle" font-family="Anton" font-size="56" fill="#fff">1</text><line x1="0" y1="-40" x2="0" y2="40" stroke="#2b3650" stroke-width="3"/><text x="105" y="-20" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="20" fill="#62d5ff" letter-spacing="2">EARTH AGE</text><text x="105" y="40" text-anchor="middle" font-family="Anton" font-size="56" fill="#fff">${earth.toFixed(1)}</text></g>`; },
    chips: [{ type: 'real', text: '1 MARS YEAR = 687 EARTH DAYS', at: 0, delay: .4, y: 380 }] },
  sleep: { loc: 'HOME', cam: c => ({ p: P([1.6, 1.6, .6], [2.0, 1.4, -.4], eio(c.p)), at: [3.3, 1.2, -2.8], fov: 42 }),
    fx: c => { bed.visible = true; win.material.map = winTex.night; lamp.intensity = 5; nightL.intensity = 6; const e = clamp(c.lt / Math.max(c.d * .7, .5)), mins = Math.round(lerp(0, 39, eio(e))); drawClock(c.lt < .25 ? '23:59' : `24:${String(mins).padStart(2, '0')}`, mins >= 39 ? 'SOL COMPLETE' : 'MARS TIME'); },
    set: c => [youAt([3.25, 1.12, -2.55], { age: 'kid', expr: 'out' }, { s: .72, rot: 78, still: true })],
    ov: c => { const q = project(world('HOME', 3.0, 1.75, -2.5)); return [0, 1, 2].map(i => { const a = (c.lt * .5 + i / 3) % 1; return `<text x="${f1(q.x + 20 + a * 60)}" y="${f1(q.y - a * 120)}" font-family="Anton" font-size="${f1(26 + a * 22)}" fill="#fff" stroke="#15151c" stroke-width="5" paint-order="stroke" opacity="${(Math.sin(a * Math.PI)).toFixed(2)}">Z</text>`; }).join(''); },
    chips: [{ type: 'real', text: '1 MARS DAY = 24 HOURS 39 MINUTES', at: 0, delay: .3, y: 380 }] },
  outside: { loc: 'MARS', cam: c => ({ p: P([5.5, 1.6, 12.5], [3.4, 1.4, 10.0], eio(c.p)), at: [0, 1.2, 5.2], fov: 44 }),
    fx: c => { setSky('day'); const op = eo(c.lt / .7); lockDoor.position.y = 1.1 + op * 2.2; lockLight.intensity = op * 4; },
    set: c => { const st = clamp((c.lt - .5) / 1.6), hop = (c.lt * 1.3) % 1; return [youAt([lerp(0, .9, st), terrainH(0, 6) + .78 + (st > 0 ? 4 * hop * (1 - hop) * .35 : 0), lerp(4.9, 7.6, st)], { age: 'kid', helmet: 1, expr: 'smile', look: [.4, 0] }, { s: .72 })]; },
    ov: c => { const k1 = pop(c.ch(0), .25), k2 = pop(c.ch(1), 0); return `<g transform="translate(150 230) scale(${k1.toFixed(3)})"><rect x="-120" y="-50" width="240" height="100" rx="14" fill="#0b1020" stroke="#62d5ff" stroke-width="3"/><text y="-14" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="20" fill="#9aa5b8" letter-spacing="2">AIR PRESSURE</text><text y="34" text-anchor="middle" font-family="Anton" font-size="40" fill="#62d5ff">0.6% OF EARTH</text></g><g transform="translate(426 230) scale(${k2.toFixed(3)})"><rect x="-120" y="-50" width="240" height="100" rx="14" fill="#0b1020" stroke="#62d5ff" stroke-width="3"/><text y="-14" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="20" fill="#9aa5b8" letter-spacing="2">AVERAGE TEMP</text><text y="34" text-anchor="middle" font-family="Anton" font-size="44" fill="#62d5ff">−60°C</text></g>`; } },
  night: { loc: 'MARS', cam: c => { const k = eio(c.p); return { p: P([3.6, 1.0, 17.5], [2.8, 1.0, 15.5], k), at: P([1.2, 2.5, 8], [.5, 6, 0], k), fov: 50 }; },
    fx: c => { setSky('night'); const k = clamp(c.lt / .4); phobos.material.opacity = k; deimos.material.opacity = k; earthDot.material.opacity = k * (.75 + .25 * Math.sin(c.t * 3)); phobos.position.set(-72, 300, -515); deimos.position.set(59, 353, -482); earthDot.position.set(19, 225, -556); },
    set: c => [youAt([2.9, .74, 12.3], { age: 'kid', helmet: 1, expr: 'smile', look: [0, -1] }, { s: .78 })],
    ov: c => label(project(world('MARS', -72, 300, -515)), 'PHOBOS', '#cbd5e1', pop(c.ch(1), 0, .3)) + label(project(world('MARS', 59, 353, -482)), 'DEIMOS', '#cbd5e1', pop(c.ch(1), .5, .3)) + label(project(world('MARS', 19, 225, -556)), 'EARTH', CYAN, pop(c.ch(3), 0, .3)) },
  call: { loc: 'HOME', cam: c => ({ p: P([.9, 1.5, 1.8], [.2, 1.6, .9], eio(c.p)), at: [-2.9, 1.6, -3.0], fov: 46 }),
    fx: c => { const e = clamp(c.lt / c.d); drawCall(`${String(21 - Math.floor(e * 1.2)).padStart(2, '0')}:${String(59 - Math.floor((c.lt * 7) % 60)).padStart(2, '0')}`, e * .06); },
    set: c => [youAt([-1.6, .74, -1.2], { age: 'kid', expr: 'smile', look: [-.8, -.2], arms: { l: [-170 + Math.sin(c.t * 9) * 20, 20] } }, { s: .74 })],
    chips: [{ type: 'real', text: 'MARS → EARTH SIGNAL DELAY: 3–22 MINUTES', at: 0, delay: .3, y: 380 }] },
  storm: { loc: 'MARS', cam: c => ({ p: P([22, 6, 30], [15, 4.5, 22], eio(c.p)), at: [0, 4, -10], fov: 46 }),
    fx: c => { const k = eio(clamp(c.lt / (c.d * .8))); setSky('storm', k, 'day'); scene.fog = new THREE.FogExp2(new THREE.Color('#9b6d43'), .004 + .022 * k); dust.forEach(d => { const u = d.userData, z = lerp(-180, 40, k) - u.z + Math.sin(c.t * u.sp) * 3; d.position.set(u.x + Math.sin(c.t * .3 * u.sp) * 6, u.y, z); d.scale.set(u.sz, u.sz, 1); d.material.opacity = .75; }); sunS.material.opacity *= (1 - .8 * k); sunDisc.material.opacity = 1 - .85 * k; },
    chips: [{ type: 'real', text: 'MARS DUST STORMS CAN COVER THE WHOLE PLANET', at: 0, delay: .4, y: 380 }] },
  leave: { loc: 'MARS', cam: c => ({ p: P([13.5, 1.8, 18.5], [14.5, 2.3, 17], eio(c.p)), at: P([17.2, 1.7, 11.6], [18.6, 3.0, 9.2], eio(c.p)), fov: 46 }), fx: c => setSky('day'),
    set: c => { const sag = c.ch(2) > 0 ? eo(c.ch(2) / .6) : 0; return [youAt([17.2, .25 + .95 - sag * .1, 11.6], { expr: sag ? 'worry' : 'smile', helmet: 1, look: [.6, 0] }, { s: 1.0 - sag * .06 })]; },
    ov: c => { const k = pop(c.ch(2), 0), w = lerp(1, 2.6, eo(clamp(c.ch(2) / 1.2))); return k <= 0 ? '' : `<g transform="translate(288 250) scale(${k.toFixed(3)})"><rect x="-190" y="-62" width="380" height="124" rx="16" fill="#0b1020" stroke="#15151c" stroke-width="4"/><text y="-24" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="22" fill="#9aa5b8" letter-spacing="2">YOUR WEIGHT ON EARTH</text><text y="44" text-anchor="middle" font-family="Anton" font-size="66" fill="${w > 2 ? RED : '#fff'}">×${w.toFixed(1)}</text></g>`; } },
  sunset: { loc: 'MARS', cam: c => ({ p: P([-11.2, 1.4, -2.0], [-15, 4, 6], eio(c.p)), at: P([-12, 1.2, -7], [12, 5, -80], eio(c.p)), fov: 46 }), fx: c => setSky('sunset'),
    set: c => [youAt([-12, .95, -6], { expr: 'smile', helmet: 1, look: [.2, -.6] }, { tint: [.7, .74, .95] })],
    chips: [{ type: 'real', text: 'SUNSETS ON MARS ARE BLUE', at: 2, delay: .1, y: 380 }] },
  mcard: { loc: 'MARS', noCap: true, cam: c => ({ p: P([-15, 4, 6], [-17, 5.5, 10], eio(c.p)), at: [12, 5, -80], fov: 46 }), fx: c => setSky('sunset'),
    set: c => [youAt([-12, .95, -6], { expr: 'smile', helmet: 1, look: [.2, -.6] }, { tint: [.7, .74, .95] })],
    ov: c => { const a = pop(c.lt, .05), b = pop(c.lt, .5); return `<rect width="576" height="1024" fill="#070b14" opacity=".35"/>` + bigText(288, 380, 'WOULD YOU', 64, '#fff', a, -2) + bigText(288, 456, 'TRADE IT', 76, '#fff', pop(c.lt, .15), -2) + bigText(288, 552, 'FOR EARTH?', 96, '#5fa8ff', pop(c.lt, .3), -2) + (b > 0 ? `<g transform="translate(288 700) scale(${b.toFixed(3)})"><rect x="-214" y="-30" width="428" height="58" rx="29" fill="${GOLD}" stroke="#15151c" stroke-width="4"/><text y="11" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="28" fill="#15151c">FOLLOW FOR MORE WORLDS</text></g>` : ''); } },
});

// ---------- INTRO: spinning Earth with a location pin that suddenly launches to Mars ----------
const GLOBE = loc('GLOBE', 9000);
{ const r = rng(71), pos = []; for (let i = 0; i < 2000; i++) { const u = r() * 2 - 1, a = r() * TAU, R = 800; pos.push(R * Math.sqrt(1 - u * u) * Math.cos(a), R * u, R * Math.sqrt(1 - u * u) * Math.sin(a)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); GLOBE.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: 1.6, sizeAttenuation: false }))); }
GLOBE.add(new THREE.HemisphereLight('#cfe0ff', '#10142a', .9)); const gSun = new THREE.DirectionalLight('#fff3dc', 2.8); gSun.position.set(40, 20, 30); GLOBE.add(gSun);
const eTex = canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#2a73cf'; g.fillRect(0, 0, w, h); const q = rng(9); g.fillStyle = '#3fae74'; for (let i = 0; i < 26; i++) { const x = q() * w, y = h * .18 + q() * h * .64; for (let j = 0; j < 6; j++) { g.beginPath(); g.ellipse(x + (q() - .5) * 120, y + (q() - .5) * 70, 30 + q() * 70, 20 + q() * 40, q() * 3, 0, 7); g.fill(); } } g.fillStyle = '#eef6ff'; g.fillRect(0, 0, w, 30); g.fillRect(0, h - 30, w, 30); g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 70; i++) { g.beginPath(); g.ellipse(q() * w, q() * h, 30 + q() * 80, 5 + q() * 9, 0, 0, 7); g.fill(); } });
const earthG = new THREE.Group(); GLOBE.add(earthG);
const earthM = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 48), toon('#ffffff', { map: eTex })); earthG.add(earthM); ink(earthM, .03);
const atmo = new THREE.Mesh(new THREE.SphereGeometry(10.9, 64, 48), new THREE.MeshBasicMaterial({ color: '#7cc4ff', transparent: true, opacity: .25, side: THREE.BackSide, depthWrite: false })); GLOBE.add(atmo);
const pin = new THREE.Group(); GLOBE.add(pin);
{ const head = new THREE.Mesh(new THREE.SphereGeometry(.85, 24, 18), toon('#e5484d')); head.position.y = 2.1; pin.add(head); ink(head, .03); const tip = new THREE.Mesh(new THREE.ConeGeometry(.62, 1.7, 24), toon('#e5484d')); tip.rotation.x = Math.PI; tip.position.y = .95; pin.add(tip); ink(tip, .03); const dot = new THREE.Mesh(new THREE.SphereGeometry(.33, 16, 12), toon('#ffffff')); dot.position.set(0, 2.15, .62); pin.add(dot); }
const pinGlow = sprite(TEX.glowR, 3.5, true, 0); GLOBE.add(pinGlow);
const trail = []; for (let i = 0; i < 28; i++) { const t = sprite(i % 2 ? TEX.glowO : TEX.glowY, 1, true, 0); GLOBE.add(t); trail.push(t); }
const mTex = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#c8673d'; g.fillRect(0, 0, w, h); const q = rng(12); for (let i = 0; i < 160; i++) { g.fillStyle = q() < .5 ? 'rgba(120,52,28,.4)' : 'rgba(236,150,96,.35)'; g.beginPath(); g.ellipse(q() * w, q() * h, 6 + q() * 30, 4 + q() * 14, q() * 3, 0, 7); g.fill(); } g.fillStyle = '#f4ece0'; g.fillRect(0, 0, w, 12); });
const MARSP = new THREE.Vector3(70, 30, -320), marsBall = new THREE.Mesh(new THREE.SphereGeometry(12, 48, 32), toon('#ffffff', { map: mTex })); marsBall.position.copy(MARSP); GLOBE.add(marsBall); ink(marsBall, .03);
const marsHalo = sprite(TEX.glowO, 34, true, .14); marsHalo.position.copy(MARSP); GLOBE.add(marsHalo);
const PIN_LAT = .55;   // where the pin sits on the globe (radians north)
function pinOnEarth(spin) { const v = new THREE.Vector3(Math.sin(-spin) * Math.cos(PIN_LAT), Math.sin(PIN_LAT), Math.cos(-spin) * Math.cos(PIN_LAT)); return v; }
function bez(a, b, c, t) { return a.clone().multiplyScalar((1 - t) * (1 - t)).add(b.clone().multiplyScalar(2 * (1 - t) * t)).add(c.clone().multiplyScalar(t * t)); }
let introState = null;
SHOTS.globe = { loc: 'GLOBE', aperture: .0004,
  cam: c => { const s = introState; if (!s || s.fp <= 0) return { p: P([10, 14, 70], [6, 11, 58], eio(c.lt / Math.max(s ? s.launch : c.d, .5))), at: [0, 4, 0], fov: 38 };
    const dir = s.tan.clone().normalize(), pos = s.pos.clone().sub(dir.clone().multiplyScalar(lerp(9, 16, s.fp))).add(new THREE.Vector3(0, lerp(3, 4, s.fp), 0)); const look = s.pos.clone().lerp(MARSP, eio(clamp((s.fp - .25) / .6)));
    const pre = { p: [6, 11, 58], at: [0, 4, 0] }, k = eo(clamp(s.fp / .18)); return { p: P(pre.p, [pos.x, pos.y, pos.z], k), at: P(pre.at, [look.x, look.y, look.z], k), fov: lerp(40, 52, eo(clamp(s.fp / .3))) }; },
  fx: c => {
    const launch = Math.max(c.che(0) + .12, .9), spin = c.t * .25, d = c.d, fp = c.lt <= launch ? 0 : eio(clamp((c.lt - launch) / Math.max(d - launch - .05, .3)));
    earthG.rotation.y = spin; const n = pinOnEarth(spin), base = n.clone().multiplyScalar(10);
    const drop = pop(c.lt, .2, .35), up = n.clone();
    let pos, tan;
    if (fp <= 0) { const wob = c.lt > launch - .25 ? Math.sin(c.t * 60) * .08 * clamp((c.lt - (launch - .25)) / .25) : 0; pos = base.clone().add(up.clone().multiplyScalar(lerp(5, 0, Math.min(drop, 1)) + wob)); tan = up.clone(); }
    else { const p0 = base, p1 = base.clone().add(up.clone().multiplyScalar(30)).add(new THREE.Vector3(0, 20, -40)), p2 = MARSP.clone().add(new THREE.Vector3(0, 12, 0)); pos = bez(p0, p1, p2, fp); tan = bez(p0, p1, p2, Math.min(fp + .02, 1)).sub(pos); if (tan.lengthSq() < 1e-6) tan = new THREE.Vector3(0, -1, 0); }
    pin.position.copy(pos); pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), fp <= 0 ? up : tan.clone().normalize().negate()); pin.scale.setScalar(Math.max(drop, .001) * (fp > 0 ? lerp(.7, 1.2, fp) : .6));
    pinGlow.position.copy(pos); pinGlow.material.opacity = fp > 0 ? .9 : .35 * Math.min(drop, 1);
    trail.forEach((t, i) => { const back = Math.max(fp - i * .006, 0), pp = fp > 0 ? (() => { const p0 = base, p1 = base.clone().add(up.clone().multiplyScalar(30)).add(new THREE.Vector3(0, 20, -40)), p2 = MARSP.clone().add(new THREE.Vector3(0, 12, 0)); return bez(p0, p1, p2, eio(clamp(back))); })() : pos; t.position.copy(pp); const sc = (1.8 - i * .05) * (fp > 0 ? 1 : 0); t.scale.set(sc, sc, 1); t.material.opacity = fp > 0 ? (1 - i / trail.length) * .9 : 0; });
    marsBall.rotation.y = c.t * .1;
    introState = { launch, fp, pos, tan };
  },
  ov: c => { const s = introState; let o = ''; if (!s) return o;
    if (s.fp <= 0) { const q = project(pin.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 3.2, 0))), k = pop(c.lt, .45, .3); if (k > 0 && !q.behind) o += `<g transform="translate(${f1(q.x)} ${f1(q.y)}) scale(${k.toFixed(3)})"><rect x="-74" y="-24" width="148" height="44" rx="22" fill="#fff" stroke="#15151c" stroke-width="4"/><text y="8" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="24" fill="#15151c" letter-spacing="2">YOU, DAY 1</text></g>`;
      if (c.lt > s.launch - .3) { const a = (c.lt - (s.launch - .3)); o += `<g transform="translate(${f1(q.x + 70)} ${f1(q.y - 40)}) scale(${pop(a, 0, .2).toFixed(3)}) rotate(10)"><text text-anchor="middle" font-family="Anton" font-size="70" fill="#ffc83d" stroke="#15151c" stroke-width="8" paint-order="stroke">!</text></g>`; } }
    else { const r = rng(Math.floor(c.t * 30)), k = Math.sin(Math.min(s.fp, 1) * Math.PI); for (let i = 0; i < 22; i++) { const a = r() * TAU, d0 = 200 + r() * 260, len = 60 + r() * 120; o += `<line x1="${f1(288 + Math.cos(a) * d0)}" y1="${f1(512 + Math.sin(a) * d0)}" x2="${f1(288 + Math.cos(a) * (d0 + len))}" y2="${f1(512 + Math.sin(a) * (d0 + len))}" stroke="#fff" stroke-width="${f1(2 + r() * 3)}" stroke-linecap="round" opacity="${(k * .7).toFixed(2)}"/>`; } }
    return o; } };

// age counter, top-left
GLOBAL_OV.push((t, c) => {
  const age = c.o.age; if (age == null) return '';
  const k = pop(c.lt, 0, .3), mars = age / 1.88;
  return `<g transform="translate(28 34) scale(${k.toFixed(3)})"><rect width="200" height="64" rx="12" fill="#0b1020" fill-opacity=".88" stroke="#ff7a3c" stroke-width="3"/><text x="16" y="27" font-family="BarlowC" font-weight="800" font-size="18" fill="#9aa5b8" letter-spacing="2">YOUR AGE</text><text x="184" y="30" text-anchor="end" font-family="Anton" font-size="28" fill="#fff">${age === 0 ? 'DAY 1' : age}</text><text x="16" y="52" font-family="BarlowC" font-weight="800" font-size="17" fill="#ff7a3c" letter-spacing="1">${age === 0 ? 'FIRST HUMAN BORN HERE' : mars.toFixed(1) + ' MARS YEARS'}</text></g>`;
});
window.__mars = true;
