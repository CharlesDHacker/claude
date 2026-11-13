// "How bright would a flashlight need to be to see the bottom of the ocean from space?"
// One continuous dive down a flashlight beam: a depth HUD, voxel sea life zone by zone, the Titanic,
// black-smoker vents, a trench wall down to 10,935 m, a ghost Everest, then the 10^190 W answer and the ocean boiling.
while (!window.__uranus || !window.ENG || !window.ENG.VOX) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng, spring } = E;
const { vox, pose, put, std, blk, BOX, uRings } = E.VOX;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c', CY = '#8ff3ff';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const Y = d => -d / 20;            // depth in meters -> world y
const OC = loc('OCEAN', 40000);
const isOcean = () => { const e = E.ep(); return !!(e && e.series && e.series.startsWith('FLASHLIGHT')); };

// ---------- water: colors by depth ----------
const WATER = [[0, '#3fb3d3'], [60, '#1f86b0'], [200, '#0b4a78'], [600, '#06233f'], [1000, '#030f22'], [3000, '#01060f'], [11000, '#000307']];
function waterAt(d) { for (let i = 0; i < WATER.length - 1; i++) { const [a, ca] = WATER[i], [b, cb] = WATER[i + 1]; if (d <= b) return new THREE.Color(ca).lerp(new THREE.Color(cb), clamp((d - a) / (b - a))); } return new THREE.Color(WATER[WATER.length - 1][1]); }
const hemiO = new THREE.HemisphereLight('#bff2ff', '#0a2a40', 1.2); OC.add(hemiO);
const sunO = new THREE.DirectionalLight('#e8fbff', 2.0); sunO.position.set(10, 60, 20); OC.add(sunO); const sunOT = new THREE.Object3D(); OC.add(sunOT); sunO.target = sunOT;
const torch = new THREE.SpotLight('#fff6e0', 0, 120, .5, .6, 1.0); OC.add(torch); const torchT = new THREE.Object3D(); OC.add(torchT); torch.target = torchT;
const fill = new THREE.PointLight('#6fa8ff', 0, 30, 1.4); OC.add(fill);

// surface seen from below
const surfMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false, uniforms: { time: { value: 0 } },
  vertexShader: `varying vec2 vU; void main(){ vU = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform float time; varying vec2 vU; void main(){ vec2 p = vU * .18; float w = sin(p.x*3.1 + time*1.3) * sin(p.y*2.7 - time*1.1) + .5*sin((p.x+p.y)*5.3 + time*2.); float c = smoothstep(.6, 1.4, w);
    float dist = length(vU) / 220.; vec3 col = mix(vec3(.45,.82,.95), vec3(.95), c*.5); gl_FragColor = vec4(col, (.6 + .25*c) * (1.0 - smoothstep(.4, 1., dist))); }` });
const surf = new THREE.Mesh(new THREE.PlaneGeometry(440, 440, 1, 1), surfMat); surf.rotation.x = Math.PI / 2; surf.position.y = 0; OC.add(surf);
const sunDisc = sprite(TEX.glowY, 16, true, .7); sunDisc.position.set(12, 2, -30); OC.add(sunDisc);
const shaftT = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(220,250,255,.55)'); gr.addColorStop(1, 'rgba(220,250,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const shafts = []; { const r = rng(3); for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5 + r() * 3, 30), new THREE.MeshBasicMaterial({ map: shaftT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: .5 })); m.position.set((r() - .5) * 40, -14, (r() - .5) * 40 - 6); m.rotation.set(0, r() * 3, .25); m.userData.ph = r() * 6; OC.add(m); shafts.push(m); } }

// the flashlight beam running all the way down
const beamMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { k: { value: .08 }, a0: { value: .55 }, boost: { value: 0 } },
  vertexShader: `varying float wy; varying vec3 vN; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position,1.0); wy = w.y; vN = normalize(normalMatrix * normal); vV = normalize(-(modelViewMatrix * vec4(position,1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float k, a0, boost; varying float wy; varying vec3 vN; varying vec3 vV; void main(){ float edge = pow(abs(dot(vN, vV)), 1.5); float a = a0 * exp(k * min(wy, 0.0)) * edge + boost * edge; gl_FragColor = vec4(vec3(1.0,.97,.86) * a, a); }` });
const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 600, 32, 60, true), beamMat); beam.position.set(0, -300 + 2, 0); OC.add(beam);
// marine snow around the camera
const snowG = new THREE.BufferGeometry(); { const r = rng(9), a = []; for (let i = 0; i < 1400; i++) a.push((r() - .5) * 30, (r() - .5) * 30, (r() - .5) * 30); snowG.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
const snow = new THREE.Points(snowG, new THREE.PointsMaterial({ color: '#dff6ff', size: .05, transparent: true, opacity: .6, depthWrite: false })); OC.add(snow);

// ---------- sea life (voxel) ----------
const L = (c, e = 0, ec) => new THREE.MeshStandardMaterial({ color: c, roughness: .8, emissive: ec || c, emissiveIntensity: e });
function part(g, w, h, d, m, x, y, z) { const b = new THREE.Mesh(BOX, typeof m === 'string' ? std(m) : m); b.scale.set(w, h, d); b.position.set(x, y, z); g.add(b); return b; }
// sunlight zone: fish school, turtle, dolphins
const SCHOOL = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .5, metalness: .3 }), 160); { const cols = ['#ffd23f', '#3fa7ff', '#ffffff', '#ff8c42']; for (let i = 0; i < 160; i++) SCHOOL.setColorAt(i, new THREE.Color(cols[i % 4])); } OC.add(SCHOOL);
function turtle() { const g = new THREE.Group(); part(g, 1.6, .45, 1.9, '#6b7a3a', 0, 0, 0); part(g, 1.2, .3, 1.4, '#8a9a4a', 0, .3, 0); part(g, .5, .4, .55, '#9bb07a', 0, .05, 1.15); const fl = [[-1, .5], [1, .5], [-1, -.6], [1, -.6]].map(([s, z]) => { const p = new THREE.Group(); p.position.set(s * .8, 0, z); g.add(p); part(p, 1.0, .1, .4, '#9bb07a', s * .5, 0, 0); return p; }); g.userData.fl = fl; OC.add(g); return g; }
const turt = turtle();
function dolphin() { const g = new THREE.Group(); part(g, .7, .7, 3.2, '#8b9bab', 0, 0, 0); part(g, .5, .4, .8, '#a9b7c4', 0, -.1, 1.9); part(g, .1, .6, .5, '#7d8c9b', 0, .55, -.2); const tail = new THREE.Group(); tail.position.z = -1.6; g.add(tail); part(tail, 1.4, .1, .4, '#7d8c9b', 0, 0, -.3); part(g, .7, .25, .7, '#e6edf2', 0, -.3, .4); g.userData.tail = tail; OC.add(g); return g; }
const dolphins = [dolphin(), dolphin()];
// jellies (twilight + midnight)
function jelly(col) { const g = new THREE.Group(); const dome = new THREE.Mesh(new THREE.SphereGeometry(.6, 16, 10, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .8, transparent: true, opacity: .6, roughness: .3 })); g.add(dome); const ts = []; for (let i = 0; i < 6; i++) { const t = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .5 })); t.scale.set(.03, 1.6, .03); t.position.set(Math.cos(i) * .35, -.8, Math.sin(i) * .35); g.add(t); ts.push(t); } const gl = sprite(TEX.glowC, 2.6, true, .5); gl.material.color.set(col); g.add(gl); g.userData = { dome, ts }; OC.add(g); return g; }
const JELLY = []; { const r = rng(14); for (let i = 0; i < 10; i++) { const j = jelly(r() < .5 ? '#ff7fd0' : '#7fd6ff'); j.userData.home = V((r() - .5) * 18, Y(150 + r() * 950), (r() - .5) * 18 - 4); j.userData.ph = r() * 6; JELLY.push(j); } }
// scuba diver at 332 m
const diver = vox({ seed: 61, shirt: '#1c2128', pants: '#1c2128', skin: '#e3b089', hair: '#1a1a1a', style: 3 }); OC.add(diver);
{ const u = diver.userData; part(u.body, .42, .62, .26, '#c9d2d9', 0, .38, -.3); const mask = part(u.head, .5, .2, .08, new THREE.MeshStandardMaterial({ color: '#7fd6ff', emissive: '#3fa7ff', emissiveIntensity: .5, transparent: true, opacity: .8 }), 0, .36, .3); u.legs.forEach(l => part(l, .32, .06, .7, '#ffd23f', 0, -.72, .3)); }
const bubbles = []; for (let i = 0; i < 24; i++) { const s = sprite(TEX.glowC, .3, true, 0); s.material.color.set('#d9f6ff'); OC.add(s); bubbles.push(s); }
// midnight: anglerfish, bioluminescent sparks
const angler = new THREE.Group(); OC.add(angler);
{ part(angler, 1.6, 1.3, 1.9, L('#5a4a52', .08), 0, 0, 0); const jaw = part(angler, 1.5, .4, 1.6, '#1d181c', 0, -.6, .3); for (let i = 0; i < 7; i++) { part(angler, .07, .28, .07, '#f1ede0', -.6 + i * .2, -.25, 1.1); part(angler, .07, .22, .07, '#f1ede0', -.5 + i * .17, -.45, 1.05); }
  part(angler, .22, .22, .05, new THREE.MeshBasicMaterial({ color: '#d9f6ff' }), .45, .35, .96); part(angler, .22, .22, .05, new THREE.MeshBasicMaterial({ color: '#d9f6ff' }), -.45, .35, .96);
  part(angler, .06, .9, .06, '#3a3238', 0, 1.0, .6).rotation.x = .6; const lure = sprite(TEX.glowC, 1.8, true, 1); lure.material.color.set('#9ffcff'); lure.position.set(0, 1.4, 1.05); angler.add(lure); const ball = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 10), new THREE.MeshBasicMaterial({ color: '#e9ffff' })); ball.position.copy(lure.position); angler.add(ball);
  const ll = new THREE.PointLight('#8ffcff', 0, 8, 1.6); ll.position.copy(lure.position); angler.add(ll); angler.userData = { lure, ll, jaw }; part(angler, .1, .9, .9, '#2a2328', 0, .1, -1.3); }
const sparks = []; { const r = rng(21); for (let i = 0; i < 70; i++) { const s = sprite(TEX.glowC, .4 + r() * .5, true, 0); s.material.color.set(r() < .6 ? '#5fffd0' : '#6fb8ff'); s.userData = { o: V((r() - .5) * 26, (r() - .5) * 20, (r() - .5) * 26 - 6), ph: r() * 6, sp: .6 + r() * 2 }; OC.add(s); sparks.push(s); } }
// sperm whale + giant squid at 2000 m
const whale = new THREE.Group(); OC.add(whale);
{ const skin = std('#77716a'); part(whale, 3.2, 3.4, 5.2, skin, 0, 0, 2.6); part(whale, 2.8, 2.8, 6, skin, 0, -.2, -3); part(whale, 2, 2, 3.5, skin, 0, -.2, -7.6); part(whale, 1.3, .35, 4.5, '#5a5550', 0, -1.85, 2.9); part(whale, .25, .25, .1, '#111', 1.4, .2, 3.4); part(whale, .25, .25, .1, '#111', -1.4, .2, 3.4);
  const fl = new THREE.Group(); fl.position.z = -9.4; whale.add(fl); part(fl, 4.8, .25, 1.6, skin, 0, -.2, -.6); whale.userData.fl = fl; part(whale, .8, .4, 1.8, skin, 1.8, -1.0, 1.2).rotation.z = -.5; part(whale, .8, .4, 1.8, skin, -1.8, -1.0, 1.2).rotation.z = .5; }
const squid = new THREE.Group(); OC.add(squid);
{ const sk = L('#c0462e', .15); const mantle = new THREE.Mesh(new THREE.ConeGeometry(.9, 4, 10), sk); mantle.rotation.x = Math.PI / 2; mantle.position.z = -2.2; squid.add(mantle); part(squid, 1.2, 1.2, 1, sk, 0, 0, 0); part(squid, .3, .3, .05, '#fff2a0', .5, .2, .4); const arms = []; for (let i = 0; i < 10; i++) { const a = new THREE.Group(); a.rotation.set(Math.sin(i) * .4, Math.cos(i * 1.3) * .5, 0); squid.add(a); const n = i >= 8 ? 6 : 4; const segs = []; let par = a; for (let k = 0; k < n; k++) { const s = new THREE.Group(); s.position.z = k ? .7 : .5; par.add(s); part(s, .14 - k * .015, .14 - k * .015, .75, sk, 0, 0, .35); segs.push(s); par = s; } arms.push(segs); } squid.userData.arms = arms; }
// seafloor: abyssal plain at 3800 m, trench wall down to 10,935 m
const PLAIN = Y(3800), BOT = Y(10935);
const sedT = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#8f897c'; g.fillRect(0, 0, w, h); const r = rng(5); for (let i = 0; i < 900; i++) { g.fillStyle = r() < .5 ? 'rgba(40,38,34,.4)' : 'rgba(120,116,104,.35)'; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); } }); sedT.wrapS = sedT.wrapT = THREE.RepeatWrapping; sedT.repeat.set(30, 30);
function floorY(x) { if (x < 20) return PLAIN; if (x < 64) return lerp(PLAIN, BOT, sm(20, 64, x)) ; if (x < 120) return BOT; return lerp(BOT, PLAIN + 20, sm(120, 180, x)); }
const fg = new THREE.PlaneGeometry(400, 160, 200, 40); fg.rotateX(-Math.PI / 2); { const p = fg.attributes.position, r = rng(2); for (let i = 0; i < p.count; i++) { const x = p.getX(i) + 60, z = p.getZ(i); p.setX(i, x); p.setY(i, floorY(x) + Math.sin(x * .3 + z * .2) * .4 + (r() - .5) * .5); } fg.computeVertexNormals(); }
const floorM = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: sedT, roughness: 1, flatShading: true })); floorM.position.z = -10; OC.add(floorM);
// rocks on the trench wall
{ const r = rng(8); for (let i = 0; i < 90; i++) { const x = 20 + r() * 44, z = -40 + r() * 60, s = .5 + r() * 2.5; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), new THREE.MeshStandardMaterial({ color: r() < .5 ? '#4a4740' : '#3a3833', roughness: 1, flatShading: true })); m.position.set(x, floorY(x) + s * .3, z - 10); m.rotation.set(r() * 3, r() * 3, r() * 3); OC.add(m); } }
// the Titanic (bow section), resting on the plain
const TITANIC = new THREE.Group(); TITANIC.position.set(-8, PLAIN + .1, -14); TITANIC.rotation.set(0, .55, .06); OC.add(TITANIC);
{ const rust = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#4a3226'; g.fillRect(0, 0, w, h); const r = rng(7); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${150 + r() * 60 | 0},${70 + r() * 30 | 0},${30 + r() * 20 | 0},${(.2 + r() * .5).toFixed(2)})`; g.fillRect(r() * w, r() * h, 2 + r() * 8, 1 + r() * 14); } g.fillStyle = 'rgba(20,14,10,.8)'; for (let x = 8; x < w; x += 12) g.fillRect(x, 30, 4, 4); });
  const hullM = new THREE.MeshStandardMaterial({ map: rust, roughness: 1 }); const hull = new THREE.Mesh(BOX, hullM); hull.scale.set(4.2, 3.4, 26); hull.position.y = 1.2; TITANIC.add(hull);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(.05, 2.1, 6, 4, 1), hullM); bow.rotation.set(Math.PI / 2, Math.PI / 4, 0); bow.scale.set(1, 1, 1.6); bow.position.set(0, 1.35, 15.8); TITANIC.add(bow);
  part(TITANIC, 3.4, 1.4, 14, new THREE.MeshStandardMaterial({ color: '#6b5a48', map: rust, roughness: 1 }), 0, 3.5, -3); part(TITANIC, 3.0, .9, 9, '#5a4a3a', 0, 4.6, -5);
  [-1.5, -6.5].forEach((z, i) => { const f = new THREE.Mesh(new THREE.CylinderGeometry(.75, .8, i ? 1.6 : 3.5, 12), std('#3a2a20')); f.position.set(0, 5.6 + (i ? -.6 : .6), z); f.rotation.x = -.15; TITANIC.add(f); });
  const mast = part(TITANIC, .18, 6, .18, '#3a2a20', 0, 4, 9); mast.rotation.x = .6; part(TITANIC, 4.6, .3, 26.5, '#3a1d14', 0, -.6, 0);
  const torn = part(TITANIC, 4.4, 4, .6, '#1a120d', 0, 1.6, -13.2); }
// hydrothermal vents
const VENTS = new THREE.Group(); VENTS.position.set(8, PLAIN, -4); OC.add(VENTS);
const smoke = [], ventGlows = [];
{ const r = rng(31), chim = []; [[0, 0, 7], [2.5, 1.5, 5], [-2.2, 1.2, 4.2], [1.2, -2.4, 3.4], [-1.4, -2, 2.6]].forEach(([x, z, h]) => { const g = new THREE.Group(); g.position.set(x, 0, z); VENTS.add(g); let y = 0; while (y < h) { const s = .9 - y / h * .5 + r() * .2, hh = .6 + r() * .5; const m = new THREE.Mesh(new THREE.CylinderGeometry(s * .8, s, hh, 8), new THREE.MeshStandardMaterial({ color: r() < .5 ? '#2b2622' : '#3d342c', roughness: 1, flatShading: true })); m.position.y = y + hh / 2; m.rotation.y = r() * 3; g.add(m); y += hh * .9; } const top = V(x, y, z); chim.push(top);
    const gl = sprite(TEX.glowO, 2.2, true, .8); gl.position.set(x, y, z); VENTS.add(gl); ventGlows.push(gl);
    for (let k = 0; k < 9; k++) { const s = sprite(TEX.smoke, 1, false, 0); s.material.color.set('#15110e'); s.userData = { top, ph: k / 9, sp: .35 + r() * .3 }; VENTS.add(s); smoke.push(s); } });
  for (let i = 0; i < 40; i++) { const a = r() * TAU, d = 1.5 + r() * 3.5, t = new THREE.Group(); t.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); VENTS.add(t); const h = .8 + r() * 1.3; part(t, .1, h, .1, '#f2efe6', 0, h / 2, 0); part(t, .2, .3, .2, L('#d62f2f', .3), 0, h + .1, 0); }
  VENTS.userData.light = new THREE.PointLight('#ff7a2a', 0, 20, 1.4); VENTS.userData.light.position.set(0, 3, 0); VENTS.add(VENTS.userData.light); }
// snailfish + amphipods at 8,300 m (on the trench wall)
const snailfish = new THREE.Group(); OC.add(snailfish);
{ const m = new THREE.MeshStandardMaterial({ color: '#f2c8c4', emissive: '#f2b8b4', emissiveIntensity: .12, transparent: true, opacity: .88, roughness: .4 }); const sph = new THREE.SphereGeometry(.5, 20, 14); const hd = new THREE.Mesh(sph, m); hd.scale.set(1.0, .9, 1.2); hd.position.z = .4; snailfish.add(hd); const segs = []; let par = snailfish; for (let k = 0; k < 5; k++) { const s = new THREE.Group(); s.position.z = k ? -.45 : -.1; par.add(s); const b = new THREE.Mesh(sph, m); b.scale.set(.85 - k * .14, .75 - k * .12, .9); b.position.z = -.25; s.add(b); segs.push(s); par = s; } part(snailfish, .12, .12, .05, '#111', .3, .15, .95); part(snailfish, .12, .12, .05, '#111', -.3, .15, .95); snailfish.userData.segs = segs; }
const amph = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: '#f1ede0', roughness: .6 }), 60); OC.add(amph);
// ghost Everest (cutaway at the bottom)
const EVEREST_H = 8849 / 20;
const ever = new THREE.Group(); ever.position.set(92, BOT, -10); OC.add(ever);
{ const cg = new THREE.ConeGeometry(130, EVEREST_H, 7, 6); const pa = cg.attributes.position, r = rng(4); for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); if (y < EVEREST_H / 2 - 1) { pa.setX(i, pa.getX(i) * (1 + (r() - .5) * .25)); pa.setZ(i, pa.getZ(i) * (1 + (r() - .5) * .25)); } } cg.computeVertexNormals();
  const em = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: '#bfe6ff', transparent: true, opacity: .14, depthWrite: false })); em.position.y = EVEREST_H / 2; ever.add(em);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(cg, 1), new THREE.LineBasicMaterial({ color: '#e6f6ff', transparent: true, opacity: .55 })); wire.position.y = EVEREST_H / 2; ever.add(wire); ever.userData = { em, wire }; }
// dry, steaming seabed for the ending + a cooked fish
const steam = []; { const r = rng(44); for (let i = 0; i < 40; i++) { const s = sprite(TEX.smoke, 4, false, 0); s.material.color.set('#e8e2d6'); s.userData = { x: 70 + (r() - .5) * 30, z: -10 + (r() - .5) * 30, ph: r(), sp: .2 + r() * .3 }; OC.add(s); steam.push(s); } }
const bones = new THREE.Group(); OC.add(bones);
{ const b = std('#efe7d4'); part(bones, .08, .08, 2.2, b, 0, .1, 0); for (let i = 0; i < 7; i++) { part(bones, .05, .5 - Math.abs(i - 3) * .06, .05, b, 0, .1, -.8 + i * .25); } part(bones, .6, .5, .5, b, 0, .2, 1.3); part(bones, .5, .1, .3, b, 0, .1, -1.25); part(bones, .12, .12, .05, '#111', .2, .3, 1.56); }

// ---------- the flashlight in space (on the intro globe) ----------
const GP = E.GLOBE_PARTS, GL = LOC.GLOBE;
const FL = new THREE.Group(); GL.add(FL); FL.position.set(0, 17.5, 0);
{ const body = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 6, 24), new THREE.MeshStandardMaterial({ color: '#1d2026', roughness: .45, metalness: .6 })); body.position.y = 2.6; FL.add(body);
  for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.12, .09, 6, 24), std('#3a3f48')); r.rotation.x = Math.PI / 2; r.position.y = 1 + i * .5; FL.add(r); }
  const head = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.75, 1.8, 24), new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: .3, metalness: .8 })); head.position.y = -.9; FL.add(head);
  const btn = part(FL, .5, .6, .3, '#e5484d', 0, 3.6, 1.1);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshBasicMaterial({ color: '#444a52' })); lens.rotation.x = Math.PI / 2; lens.position.y = -1.81; FL.add(lens); FL.userData.lens = lens; }
const spaceBeam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 3.0, 6.0, 32, 1, true), new THREE.MeshBasicMaterial({ color: '#fff4d0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); spaceBeam.position.set(0, 12.7, 0); GL.add(spaceBeam);
const spot = sprite(TEX.glowY, 6, true, 0); spot.position.set(0, 10.1, 0); GL.add(spot);
const lensGlow = sprite(TEX.glowY, 8, true, 0); lensGlow.position.set(0, 15.6, 0); GL.add(lensGlow);
const steamTex = canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#d9d4cc'; g.fillRect(0, 0, w, h); const q = rng(19); g.fillStyle = '#9a7a55'; [[180, 170, 120, 80], [250, 330, 70, 110], [520, 160, 90, 70], [560, 300, 80, 120], [760, 190, 170, 90], [860, 360, 70, 50]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); }); g.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 140; i++) { g.beginPath(); g.ellipse(q() * w, q() * h, 40 + q() * 120, 12 + q() * 30, 0, 0, TAU); g.fill(); } });
const steamPuffs = []; for (let i = 0; i < 40; i++) { const s = sprite(TEX.smoke, 4, false, 0); s.material.color.set('#f2efe9'); s.userData = { dir: V(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize(), sp: .6 + Math.random() }; GL.add(s); steamPuffs.push(s); }
const earthMesh = GP.earthG.children[0]; let earthMap = null;

// ---------- per-frame reset ----------
RESETS.push((c, sh) => {
  const on = isOcean(), mine = sh.loc === 'OCEAN';
  FL.visible = spaceBeam.visible = spot.visible = lensGlow.visible = on && sh.loc === 'GLOBE'; steamPuffs.forEach(s => s.material.opacity = 0);
  if (on) { GP.marsBall.visible = false; GP.marsHalo.visible = false; uRings.visible = false; GP.pin.visible = false; if (!earthMap) earthMap = earthMesh.material.map; earthMesh.material.map = earthMap; spaceBeam.material.opacity = 0; spot.material.opacity = 0; lensGlow.material.opacity = 0; FL.userData.lens.material.color.set('#444a52'); }
  else { GP.marsBall.visible = true; GP.marsHalo.visible = true; if (earthMap) earthMesh.material.map = earthMap; }
  if (!mine) { if (scene.background && scene.userData.oceanBg) { scene.background = null; scene.userData.oceanBg = false; } return; }
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.shadowMap.enabled = false; bloom.strength = .45; bloom.threshold = .78; bloom.radius = .6;
  [SCHOOL, turt, ...dolphins, ...JELLY, diver, angler, whale, squid, TITANIC, VENTS, snailfish, amph, ever, bones, ...bubbles, ...sparks, ...steam].forEach(o => o.visible = false);
  ever.visible = false; floorM.visible = true; surf.visible = true; beam.visible = true; beamMat.uniforms.boost.value = 0; snow.visible = true; torch.intensity = 0; fill.intensity = 0; VENTS.userData.light.intensity = 0; angler.userData.ll.intensity = 0;
  surfMat.uniforms.time.value = c.t;
});
// depth-driven water look, called from each ocean shot with the camera depth (m)
function water(c, d, o = {}) {
  const col = waterAt(d); scene.background = col; scene.userData.oceanBg = true; scene.fog = new THREE.FogExp2(col, o.fog ?? lerp(.03, .02, sm(0, 1000, d)));
  const light = Math.exp(-d / 90); hemiO.intensity = .7 + 1.0 * light; hemiO.color.set(waterAt(Math.max(d - 150, 0))).lerp(new THREE.Color('#5a7fa8'), d > 300 ? .6 : 0); hemiO.groundColor.set('#0a1420');
  sunO.intensity = 2.2 * light; sunOT.position.set(0, Y(d) - 10, 0); sunO.position.set(10, Y(d) + 50, 20);
  surf.visible = d < 260; shafts.forEach(s => { s.material.opacity = .45 * Math.exp(-d / 40) * (.7 + .3 * Math.sin(c.t * .7 + s.userData.ph)); }); sunDisc.material.opacity = Math.exp(-d / 30);
  // flashlight: a spot from above, with the beam fading as its light is absorbed
  const cam = o.cam; torch.position.set(0, Y(d) + 25, 0); torchT.position.set(0, Y(d) - 30, 0); torch.intensity = (o.torch ?? 1) * 60 * Math.exp(-d * .02 * 1.1);
  fill.position.set(cam[0] + 1.5, cam[1] + 2, cam[2] + 1); fill.distance = o.fillD ?? 45; fill.decay = 1.2; fill.color.set('#d6e6ff'); fill.intensity = (o.fill ?? 1) * (d > 120 ? lerp(8, 45, sm(120, 1500, d)) : 0);
  snow.position.set(Math.round(cam[0] / 30) * 30, Math.round(cam[1] / 30) * 30 - ((c.t * .4) % 1), Math.round(cam[2] / 30) * 30); snow.material.opacity = .25 + .45 * sm(0, 400, d);
}
const camD = c => -SHOTS[c.o.scene].cam(c).p[1] * 20;
const pathCam = (c, keys) => {
  let k0 = keys[0], k1 = keys[0], s = 0; const T = k => typeof k.t === 'number' ? k.t : c.lt - (k.t[1] === 'e' ? c.che(k.t[0]) : c.ch(k.t[0])) + (k.t[2] || 0);
  for (let i = 0; i < keys.length - 1; i++) { const a = T(keys[i]), b = T(keys[i + 1]); if (c.lt >= a) { k0 = keys[i]; k1 = keys[i + 1]; s = clamp((c.lt - a) / Math.max(b - a, .01)); } }
  if (c.lt >= T(keys[keys.length - 1])) { k0 = k1 = keys[keys.length - 1]; s = 0; }
  const e = eio(s); return { p: P(k0.p, k1.p, e), at: P(k0.a, k1.a, e), fov: lerp(k0.fov || 46, k1.fov || 46, e), roll: lerp(k0.roll || 0, k1.roll || 0, e) };
};
const serif = (x, y, txt, size, fill, op = 1, italic = false, w = 500) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="EBG" font-weight="${w}" ${italic ? 'font-style="italic"' : ''} font-size="${size}" fill="${fill}" opacity="${op.toFixed(3)}" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))">${txt}</text>`;
const slam = (x, y, txt, size, fill, a, sub = '') => { if (a <= 0) return ''; const k = Math.min(1.05, a < .5 ? spring(a / .3 * .9) : 1), sc = lerp(2.2, 1, Math.min(k, 1)); return `<g transform="translate(${x} ${y}) scale(${sc.toFixed(3)})" opacity="${clamp(a / .12).toFixed(2)}"><text text-anchor="middle" font-family="Inter" font-weight="800" font-size="${size}" fill="${fill}" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.7))">${txt}</text>${sub ? `<text y="${size * .55}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="15" fill="#fff" letter-spacing="2" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))">${sub}</text>` : ''}</g>`; };

// creature animation helpers
function schoolFX(c, cx, cy, cz, R = 5, n = 160) { SCHOOL.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), r = rng(12); for (let i = 0; i < n; i++) { const a = c.t * (.35 + r() * .1) + r() * TAU, rr = R * (.6 + r() * .6), y = cy + (r() - .5) * 3 + Math.sin(c.t + i) * .2; q.setFromEuler(new THREE.Euler(0, -a, 0)); m.compose(V(cx + Math.cos(a) * rr, y, cz + Math.sin(a) * rr), q, V(.05, .09, .22)); SCHOOL.setMatrixAt(i, m); } SCHOOL.instanceMatrix.needsUpdate = true; }
function jellyFX(c, dMin, dMax) { JELLY.forEach(j => { const d = -j.userData.home.y * 20; if (d < dMin || d > dMax) return; j.visible = true; const u = j.userData, pu = Math.sin(c.t * 2 + u.ph); j.position.copy(u.home).add(V(Math.sin(c.t * .3 + u.ph), pu * .15 + c.t * .05, 0)); u.dome.scale.set(1 + pu * .12, 1 - pu * .15, 1 + pu * .12); u.ts.forEach((t, i) => t.rotation.z = Math.sin(c.t * 2 + i) * .15); }); }

// ---------- shots ----------
Object.assign(SHOTS, {
  ospace: { loc: 'GLOBE', aperture: .0002, noCap: false,
    cam: c => { const a = lerp(-.5, .15, eio(c.p)); return { p: [Math.sin(a) * lerp(64, 44, eio(c.p)), lerp(26, 22, c.p), Math.cos(a) * lerp(64, 44, eio(c.p))], at: [0, lerp(8, 12, c.p), 0], fov: 40 }; },
    fx: c => { GP.earthG.rotation.y = 2.2 + c.t * .03; const k = pop(c.ch(1), 0, .5); FL.scale.setScalar(Math.max(k, .001)); FL.rotation.z = (1 - Math.min(k, 1)) * .8; } },
  obeam: { loc: 'GLOBE', aperture: .0002,
    cam: c => { const r = eio(clamp((c.lt - (c.d - 1.1)) / 1.1)); return { p: P(P([12, 22, 34], [7, 19, 22], eo(c.p)), [0, 11.2, .6], r), at: P([0, 12, 0], [0, 9, 0], r), fov: 40 + r * 14 }; },
    fx: c => { GP.earthG.rotation.y = 2.2 + c.t * .03; const on = c.lt > .08 ? 1 : 0, fl = on * (.92 + .08 * Math.sin(c.t * 40)); spaceBeam.material.opacity = .45 * fl; spot.material.opacity = .9 * fl; lensGlow.material.opacity = fl; FL.userData.lens.material.color.set(on ? '#fffbe8' : '#444a52'); },
    kick: c => c.lt > .08 && c.lt < .5 ? .2 * (1 - (c.lt - .08) / .42) : 0,
    post: c => { const w = clamp((c.lt - (c.d - .35)) / .35); return (c.lt > .08 && c.lt < .2 ? `<rect width="576" height="1024" fill="#fff" opacity=".35"/>` : '') + (w > 0 ? `<rect width="576" height="1024" fill="#e9fbff" opacity="${(w * .95).toFixed(2)}"/>` : ''); } },
  osun: { loc: 'OCEAN', aperture: .0004,
    cam: c => pathCam(c, [{ t: 0, p: [2, -1.2, 10], a: [6, 3, -20], fov: 54 }, { t: [1, 's'], p: [1, -2.5, 8], a: [0, -3.5, 0], fov: 50 }, { t: c.d, p: [-1, Y(60), 9], a: [0, Y(80), 0], fov: 48 }]),
    fx: c => { const cm = SHOTS.osun.cam(c); water(c, camD(c), { cam: cm.p, torch: .6 }); schoolFX(c, 0, -4.5, -5, 7); turt.visible = true; const a = c.t * .25; turt.position.set(-5 + c.lt * .8, -2.4 + Math.sin(c.t) * .2, 2); turt.rotation.set(-.1, 1.4, Math.sin(c.t) * .05); turt.userData.fl.forEach((f, i) => f.rotation.z = Math.sin(c.t * 2.4 + (i % 2) * Math.PI) * .5 * (i < 2 ? 1 : .5));
      dolphins.forEach((d, i) => { d.visible = true; const a2 = c.t * .5 + i * 2.2; d.position.set(Math.cos(a2) * 9, -5 - i * 2 + Math.sin(c.t * 1.5 + i) * .6, -8 + Math.sin(a2) * 7); d.rotation.set(Math.cos(c.t * 1.5 + i) * .15, -a2, 0); d.userData.tail.rotation.x = Math.sin(c.t * 6 + i) * .4; }); },
    post: c => { const w = 1 - clamp(c.lt / .45); return w > 0 ? `<rect width="576" height="1024" fill="#e9fbff" opacity="${(w * .95).toFixed(2)}"/>` : ''; } },
  otwi: { loc: 'OCEAN', aperture: .0005,
    cam: c => pathCam(c, [{ t: 0, p: [3, Y(170), 9], a: [0, Y(200), 0], fov: 48 }, { t: [2, 's'], p: [4, Y(200), 7], a: [0, Y(210), -2], fov: 46 }, { t: c.d, p: [5, Y(250), 7], a: [0, Y(320), 0], fov: 48 }]),
    fx: c => { const cm = SHOTS.otwi.cam(c); water(c, camD(c), { cam: cm.p }); jellyFX(c, 100, 400); } },
  oscuba: { loc: 'OCEAN', aperture: .0008,
    cam: c => pathCam(c, [{ t: 0, p: [4.5, Y(310), 6], a: [0, Y(332), 0], fov: 46 }, { t: c.d, p: [3.2, Y(338), 4.4], a: [0, Y(334), 0], fov: 42 }]),
    fx: c => { const cm = SHOTS.oscuba.cam(c); water(c, camD(c), { cam: cm.p, fill: 1.2 }); diver.visible = true; const y0 = Y(332); diver.position.set(.6, y0 - .3 + Math.sin(c.t * .8) * .1, 0); diver.rotation.set(-1.25, .5, 0); pose(diver, c.t, { arms: [[-.2, 0, .4 + Math.sin(c.t * 1.5) * .1], [-.2, 0, -.4 - Math.sin(c.t * 1.5) * .1]], expr: 'o', blink: false });
      diver.userData.legs[0].rotation.x = Math.sin(c.t * 3) * .35; diver.userData.legs[1].rotation.x = -Math.sin(c.t * 3) * .35;
      bubbles.forEach((b, i) => { const r = rng(i + 3), a = (c.t * (.4 + r() * .3) + r()) % 1; b.visible = true; b.position.set(.9 + (r() - .5) * .4 + Math.sin(c.t * 3 + i) * .1, y0 + .6 + a * 6, .4 + (r() - .5) * .4); b.material.opacity = .9 * (1 - a); b.scale.setScalar(.15 + r() * .2 + a * .2); }); jellyFX(c, 250, 450); } },
  omid: { loc: 'OCEAN', aperture: .0012,
    cam: c => pathCam(c, [{ t: 0, p: [3, Y(940), 8], a: [0, Y(1000), 0], fov: 48 }, { t: [2, 's'], p: [3.2, Y(1000) + .6, 6.2], a: [0, Y(1000) + .3, 0], fov: 42 }, { t: c.d, p: [2.6, Y(1000) + .4, 5.2], a: [0, Y(1000) + .5, 0], fov: 40 }]),
    fx: c => { const cm = SHOTS.omid.cam(c); water(c, camD(c), { cam: cm.p, fill: .9 }); const y0 = Y(1000); angler.visible = true; angler.position.set(-.2, y0 + Math.sin(c.t * .6) * .15, -.6); angler.rotation.set(0, .45 + Math.sin(c.t * .4) * .1, 0); const u = angler.userData, fl = .8 + .2 * Math.sin(c.t * 5); u.lure.material.opacity = fl; u.ll.intensity = 6 * fl; u.jaw.rotation.x = c.ch(2) > 1.2 ? -.35 * sm(0, .3, c.ch(2) - 1.2) : 0;
      sparks.forEach((s, i) => { const u2 = s.userData; s.visible = true; s.position.set(u2.o.x, y0 + u2.o.y * .5 + Math.sin(c.t * .5 + u2.ph), u2.o.z); s.material.opacity = Math.max(0, Math.sin(c.t * u2.sp + u2.ph)) * sm(0, 1, c.lt); }); jellyFX(c, 800, 1200); } },
  owhale: { loc: 'OCEAN', aperture: .0004,
    cam: c => pathCam(c, [{ t: 0, p: [10, Y(1975), 16], a: [-1, Y(2000), 0], fov: 50 }, { t: c.d, p: [13, Y(2006), 11], a: [0, Y(2001), 1], fov: 46 }]),
    fx: c => { const cm = SHOTS.owhale.cam(c); water(c, camD(c), { cam: cm.p, fill: 1.6, fog: .012, fillD: 70 }); fill.position.set(cm.p[0] - 4, cm.p[1] + 6, cm.p[2]); const y0 = Y(2000); whale.visible = squid.visible = true;
      whale.position.set(-6 + c.lt * .9, y0 + Math.sin(c.t * .5) * .3, -2); whale.rotation.set(-.12, 1.35, Math.sin(c.t * .7) * .05); whale.userData.fl.rotation.x = Math.sin(c.t * 1.8) * .35;
      squid.position.set(-6 + c.lt * .9 + 6.5, y0 + .4, -2 + .9); squid.rotation.set(.2, -1.7 + Math.sin(c.t * 2) * .2, .3); squid.userData.arms.forEach((segs, i) => segs.forEach((s, k) => { s.rotation.x = Math.sin(c.t * 3 + i + k) * .35; s.rotation.y = Math.cos(c.t * 2.4 + i * .7 + k) * .3; })); } },
  otitanic: { loc: 'OCEAN', aperture: .0005,
    cam: c => pathCam(c, [{ t: 0, p: [10, PLAIN + 26, 18], a: [-8, PLAIN + 2, -14], fov: 48 }, { t: [1, 's'], p: [6, PLAIN + 9, 6], a: [-8, PLAIN + 3, -10], fov: 44 }, { t: c.d, p: [3, PLAIN + 6, 2], a: [-8, PLAIN + 3, -4], fov: 42 }]),
    fx: c => { const cm = SHOTS.otitanic.cam(c); water(c, camD(c), { cam: cm.p, fill: 1.4, fog: .014, fillD: 70 }); fill.position.set(cm.p[0] - 2, cm.p[1] + 8, cm.p[2] - 4); TITANIC.visible = true; torch.intensity = 40; torch.position.set(-6, PLAIN + 30, -8); torchT.position.set(-8, PLAIN, -12); } },
  ovent: { loc: 'OCEAN', aperture: .0006,
    cam: c => pathCam(c, [{ t: 0, p: [16, PLAIN + 5, 10], a: [8, PLAIN + 4, -4], fov: 46 }, { t: [1, 's'], p: [13, PLAIN + 3.2, 4], a: [8, PLAIN + 5, -4], fov: 42 }, { t: [2, 's'], p: [12.5, PLAIN + 7.5, 2], a: [8, PLAIN + 8, -4], fov: 44 }, { t: c.d, p: [14, PLAIN + 12, 6], a: [8, PLAIN + 8, -4], fov: 46 }]),
    fx: c => { const cm = SHOTS.ovent.cam(c); water(c, camD(c), { cam: cm.p, fill: .5, fog: .02 }); VENTS.visible = true; VENTS.userData.light.intensity = 20 + 4 * Math.sin(c.t * 7); ventGlows.forEach((g, i) => g.material.opacity = .7 + .3 * Math.sin(c.t * 6 + i));
      smoke.forEach(s => { const u = s.userData, a = (c.t * u.sp + u.ph) % 1; s.position.set(u.top.x + Math.sin(c.t + u.ph * 9) * a * 1.2, u.top.y + a * 9, u.top.z + Math.cos(c.t * .7 + u.ph * 7) * a); const sc = .8 + a * 4; s.scale.set(sc, sc, 1); s.material.opacity = .85 * (1 - a) * sm(0, .1, a); }); },
    ov: c => slam(288, 300, '400°C', 96, '#ff6a2c', c.ch(0) > 0 ? (() => { const w = (E.ep().words || []).find(x => x.text.toLowerCase() === 'four' && x.start > c.o.t0 && x.start < c.o.t1); return w ? c.t - w.start : -1; })() : -1, 'VENT WATER') +
      (c.ch(1) > 0 ? `<g opacity="${clamp(c.ch(1) / .25).toFixed(2)}" transform="translate(288 360)"><rect x="-150" y="-20" width="300" height="38" rx="19" fill="rgba(10,10,14,.75)" stroke="#ff9a3c" stroke-width="2"/><text y="6" text-anchor="middle" font-family="Inter" font-weight="800" font-size="16" fill="#fff" letter-spacing="1.5">LEAD MELTS AT <tspan fill="#ff9a3c">327°C</tspan></text></g>` : '') },
  osnail: { loc: 'OCEAN', aperture: .0012,
    cam: c => { const y0 = Y(8300), wx = 20 + 44 * sm(0, 1, (PLAIN - y0) / (PLAIN - BOT)); return pathCam(c, [{ t: 0, p: [wx + 14, y0 + 40, 8], a: [wx + 2, y0 + 10, -6], fov: 50 }, { t: [1, 's'], p: [wx + 8, y0 + 2, 2], a: [wx + 3, y0, -6], fov: 44 }, { t: c.d, p: [wx + 7, y0 + 1.2, -1.5], a: [wx + 3, y0 + .3, -6], fov: 38 }]); },
    fx: c => { const cm = SHOTS.osnail.cam(c); water(c, camD(c), { cam: cm.p, fill: 1, fog: .018 }); const y0 = Y(8300), wx = 20 + 44 * sm(0, 1, (PLAIN - y0) / (PLAIN - BOT)); snailfish.visible = true; snailfish.position.set(wx + 3 + Math.sin(c.t * .5) * .3, y0 + .3, -6); snailfish.rotation.set(0, -.9 + Math.sin(c.t * .6) * .2, 0); snailfish.userData.segs.forEach((s, k) => s.rotation.y = Math.sin(c.t * 3 - k * .7) * .25);
      amph.visible = true; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), r = rng(6); for (let i = 0; i < 60; i++) { const a = c.t * (.5 + r()) + r() * TAU, rr = 1 + r() * 2.5; q.setFromEuler(new THREE.Euler(0, -a, Math.sin(c.t * 9 + i) * .3)); m.compose(V(wx + 3 + Math.cos(a) * rr, y0 - .2 + r() * 1.2, -6 + Math.sin(a) * rr), q, V(.035, .035, .1)); amph.setMatrixAt(i, m); } amph.instanceMatrix.needsUpdate = true; } },
  obottom: { loc: 'OCEAN', aperture: .0002,
    cam: c => { const y0 = BOT; return pathCam(c, [{ t: 0, p: [76, y0 + 30, 14], a: [84, y0, -8], fov: 48 }, { t: [1, 's'], p: [80, y0 + 6, 6], a: [83, y0, -4], fov: 46 }, { t: [2, 's'], p: [79, y0 + 5, 8], a: [83, y0 + 1, -4], fov: 46 }, { t: [2, 's', 1.2], p: [70, y0 + 6, 30], a: [88, y0 + 40, -10], fov: 50 }, { t: c.d, p: [-140, Y(5000), 680], a: [80, Y(5600), -10], fov: 52 }]); },
    fx: c => { const cm = SHOTS.obottom.cam(c), cut = sm(0, 1.4, c.ch(2)); water(c, camD(c), { cam: cm.p, fill: 1.2, fog: lerp(.02, .0, cut) }); if (cut > 0) { scene.fog = cut > .98 ? null : scene.fog; scene.background = new THREE.Color('#020a16').lerp(new THREE.Color('#06213a'), cut); hemiO.intensity = .5 + cut; }
      torch.position.set(cm.p[0] + 1, cm.p[1] + 8, cm.p[2] + 2); torchT.position.set(84, BOT, -8); torch.distance = 90; torch.angle = .7; torch.intensity = 140 * (1 - cut); ever.visible = c.ch(2) > 0; ever.userData.em.material.opacity = .16 * cut; ever.userData.wire.material.opacity = .6 * cut; ever.scale.y = Math.max(eo(clamp(c.ch(2) / 1.8)), .001); },
    ov: c => { if (c.ch(2) <= .8) return ''; const k = clamp((c.ch(2) - .8) / .5), top = project(world('OCEAN', 92, BOT + EVEREST_H, -10)), sea = project(world('OCEAN', 92, 0, -10)), bot = project(world('OCEAN', 92, BOT, -10)); if (top.behind) return '';
      const x = Math.min(top.x + 70, 520); return `<g opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><line x1="40" y1="${f1(sea.y)}" x2="560" y2="${f1(sea.y)}" stroke="#8ff3ff" stroke-width="2" stroke-dasharray="6 6"/><text x="44" y="${f1(sea.y - 10)}" font-family="Inter" font-weight="800" font-size="13" fill="#8ff3ff" letter-spacing="2">SEA LEVEL</text>
        <text x="${f1(top.x)}" y="${f1(top.y - 12)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="14" fill="#fff" letter-spacing="1.5">EVEREST 8,849 m</text>
        <line x1="${f1(x)}" y1="${f1(sea.y)}" x2="${f1(x)}" y2="${f1(top.y)}" stroke="${ORANGE}" stroke-width="3"/><line x1="${f1(x - 8)}" y1="${f1(sea.y)}" x2="${f1(x + 8)}" y2="${f1(sea.y)}" stroke="${ORANGE}" stroke-width="3"/><line x1="${f1(x - 8)}" y1="${f1(top.y)}" x2="${f1(x + 8)}" y2="${f1(top.y)}" stroke="${ORANGE}" stroke-width="3"/>
        <text x="${f1(x - 10)}" y="${f1((sea.y + top.y) / 2 + 5)}" text-anchor="end" font-family="Inter" font-weight="800" font-size="15" fill="${ORANGE}">2,086 m TO SPARE</text></g>`; } },
  oanswer: { loc: 'GLOBE', aperture: .0002,
    cam: c => { const a = lerp(.6, -.2, eio(c.p)); return { p: [Math.sin(a) * 52, 24, Math.cos(a) * 52], at: [0, 9, 0], fov: 42 }; },
    fx: c => { GP.earthG.rotation.y = 2.2 + c.t * .03; const fl = .95 + .05 * Math.sin(c.t * 40); spaceBeam.material.opacity = .45 * fl; spot.material.opacity = .9 * fl; lensGlow.material.opacity = fl; FL.userData.lens.material.color.set('#fffbe8'); },
    ov: c => { let o = ''; const w = (E.ep().words || []).find(x => x.text.toLowerCase() === 'number' && x.start > c.o.t0); const a = w ? c.t - w.start : -1;
      o += slam(288, 330, '10<tspan font-size="64" dy="-46">190</tspan><tspan font-size="96" dy="46"> W</tspan>', 120, '#fff', a, 'WATTS · A 1 WITH 190 ZEROS');
      const b = c.ch(2); if (b > 0) { const k = clamp(b / .3); o += `<g opacity="${k.toFixed(2)}" transform="translate(288 430)"><rect x="-200" y="-22" width="400" height="44" rx="22" fill="rgba(8,10,20,.8)" stroke="#8ff3ff" stroke-width="2"/><text y="7" text-anchor="middle" font-family="Inter" font-weight="800" font-size="16" fill="#fff" letter-spacing="1">EVERY STAR IN THE UNIVERSE ≈ <tspan fill="#8ff3ff">10</tspan><tspan fill="#8ff3ff" font-size="11" dy="-7">49</tspan><tspan fill="#8ff3ff" dy="7"> W</tspan></text></g>`; }
      return o; } },
  oboil: { loc: 'GLOBE', aperture: .0002,
    cam: c => { const a = lerp(-.2, -.45, eio(c.p)); return { p: [Math.sin(a) * lerp(52, 60, c.p), 24, Math.cos(a) * lerp(52, 60, c.p)], at: [0, 8, 0], fov: 42 }; },
    kick: c => { const a = c.che(0); return a > 0 && a < 1.2 ? .5 * Math.exp(-a * 3) : 0; },
    fx: c => { GP.earthG.rotation.y = 2.2 + c.t * .03; const a = c.che(0), on = a > 0, boil = sm(0, 1.6, a); spaceBeam.material.opacity = on ? 1 : .45; spaceBeam.scale.set(on ? 1 + boil * 2 : 1, 1, on ? 1 + boil * 2 : 1); spot.material.opacity = 1; spot.scale.setScalar(on ? 6 + boil * 30 : 6); lensGlow.material.opacity = 1; lensGlow.scale.setScalar(on ? 8 + boil * 20 : 8); FL.userData.lens.material.color.set('#ffffff');
      if (a > .4) earthMesh.material.map = steamTex; steamPuffs.forEach((s, i) => { const u = s.userData, t2 = clamp((a - .2 - i * .02) / 2.5); if (t2 <= 0) return; s.position.copy(u.dir).multiplyScalar(10.4 + t2 * 6 * u.sp); s.scale.setScalar(2 + t2 * 9); s.material.opacity = .85 * (1 - t2 * .6); }); },
    post: c => { const a = c.che(0); if (a < 0) return ''; const f = a < .12 ? 1 : Math.exp(-(a - .12) * 2.2); return `<rect width="576" height="1024" fill="#fffdf2" opacity="${(f * .95).toFixed(2)}"/>`; } },
  oend: { loc: 'OCEAN', noCap: false, aperture: .0012,
    cam: c => pathCam(c, [{ t: 0, p: [76, BOT + 14, 16], a: [80, BOT + 1, -6], fov: 48 }, { t: [1, 's'], p: [79, BOT + 3, 2], a: [80, BOT + .3, -6], fov: 42 }, { t: c.d, p: [80.4, BOT + 1.2, -3.2], a: [80, BOT + .2, -6], fov: 36 }]),
    fx: c => { scene.background = new THREE.Color('#7a6f62'); scene.userData.oceanBg = true; scene.fog = new THREE.FogExp2(new THREE.Color('#9a8f80'), .03); hemiO.intensity = 1.4; hemiO.color.set('#fff2dc'); hemiO.groundColor.set('#4a4036'); sunO.intensity = 2.2; sunO.position.set(60, BOT + 80, 30); sunOT.position.set(80, BOT, -6); surf.visible = false; beam.visible = false; snow.visible = false; shafts.forEach(s => s.material.opacity = 0); sunDisc.material.opacity = 0;
      bones.visible = true; bones.position.set(80, BOT + .05, -6); bones.rotation.set(0, .6, .1);
      steam.forEach(s => { const u = s.userData, a = (c.t * u.sp + u.ph) % 1; s.visible = true; s.position.set(u.x + Math.sin(c.t * .3 + u.ph * 7) * 2, BOT + a * 18, u.z); s.scale.setScalar(4 + a * 10); s.material.opacity = .5 * Math.sin(a * Math.PI); }); },
    post: c => { const st = c.d - 2.4, a = c.lt - st; if (a <= 0) return ''; const bar = eio(clamp(a / .8)), gap = lerp(512, 70, bar), t1 = clamp((a - .6) / .5), t2 = clamp((a - 1.1) / .5);
      return `<rect width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/><rect y="${f1(512 + gap)}" width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/>` + serif(288, 360, 'How bright would your', 33, '#fff', t1) + serif(288, 400, 'flashlight need to be?', 33, '#fff', t1) + serif(288, 664, '10<tspan font-size="14" dy="-10">190</tspan><tspan dy="10"> watts. Sorry, fish.</tspan>', 24, ORANGE, t2, true); } },
});

// ---------- HUD: depth meter + side gauge ----------
const ZONES = [[0, 'SUNLIGHT ZONE'], [200, 'TWILIGHT ZONE'], [1000, 'MIDNIGHT ZONE'], [4000, 'ABYSS'], [6000, 'HADAL ZONE']];
GLOBAL_OV.push((t, c, sh) => {
  if (!isOcean() || sh.loc !== 'OCEAN' || c.o.scene === 'oend') return '';
  const d = Math.max(0, -camera.position.y * 20), zone = ZONES.filter(z => d >= z[0]).pop()[1], atm = 1 + d / 10;
  const ex = d * .02 / Math.LN10, light = ex < 2 ? `${(100 * Math.pow(10, -ex)).toFixed(ex < 1 ? 0 : 1)}%` : `1 IN 10<tspan font-size="9" dy="-5">${Math.round(ex)}</tspan><tspan dy="5"></tspan>`;
  const vent = c.o.scene === 'ovent', temp = vent ? '<tspan fill="#ff6a2c">400°C</tspan>' : `${Math.round(d < 200 ? lerp(22, 12, d / 200) : d < 1000 ? lerp(12, 4, (d - 200) / 800) : lerp(4, 1.5, Math.min((d - 1000) / 9000, 1)))}°C`;
  const fade = clamp((c.t - 10.2) / .4);
  let o = `<g transform="translate(26 398)" opacity="${fade.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="13" fill="${ORANGE}" letter-spacing="2.4">${zone}</text>
    <text x="0" y="48" font-family="Inter" font-weight="800" font-size="44" fill="#fff">${Math.round(d).toLocaleString('en-US')}<tspan font-size="24" dx="4">m</tspan></text>
    <text x="0" y="72" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">PRESSURE <tspan fill="${CY}">${Math.round(atm).toLocaleString('en-US')} atm</tspan></text>
    <text x="0" y="92" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">LIGHT LEFT <tspan fill="#ffd27a">${light}</tspan></text>
    <text x="0" y="112" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">WATER ${temp}</text></g>`;
  // side gauge 0..11,000 m
  const gy = v => 170 + v / 11000 * 700, k = fade;
  o += `<g opacity="${(k * .9).toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))"><line x1="548" y1="170" x2="548" y2="870" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
  [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000].forEach(v => o += `<line x1="542" y1="${gy(v)}" x2="548" y2="${gy(v)}" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`);
  [[332, 'DIVER'], [3800, 'TITANIC'], [10935, 'BOTTOM']].forEach(([v, n]) => o += `<text x="538" y="${gy(v) + 4}" text-anchor="end" font-family="Inter" font-weight="800" font-size="9" fill="#fff" fill-opacity=".75" letter-spacing="1">${n}</text>`);
  o += `<circle cx="548" cy="${f1(gy(Math.min(d, 11000)))}" r="6" fill="${ORANGE}" stroke="#fff" stroke-width="2"/></g>`;
  return o;
});
// the intro title over space
const sp0 = SHOTS.ospace;
sp0.post = c => '';
E.OCEANDBG = { fill, hemiO, sunO, torch, floorM };
window.__ocean = true;
