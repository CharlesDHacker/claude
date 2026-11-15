// "Why Nosey wouldn't survive one day in real life": a 10-ft animatronic rabbit (parody design) vs. the real world.
// Workshop (night) -> doorway crawl -> suburb walk with draining battery -> rain shorts his wiring -> sinks in a lawn ->
// phones -> police -> dies in a grocery parking lot -> tow truck -> listed on Marketplace. HUD: clock + battery.
while (!window.__crash || !window.ENG || !window.ENG.VOX) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng } = E;
const { vox, pose, put, std, blk, BOX } = E.VOX;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c', RED = '#ff3a3a';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const isMine = () => { const e = E.ep(); return !!(e && e.series === 'NOSEY'); };
const pathCam = (c, keys) => { let k0 = keys[0], k1 = keys[0], s = 0; const T = k => typeof k.t === 'number' ? k.t : c.lt - (k.t[1] === 'e' ? c.che(k.t[0]) : c.ch(k.t[0])) + (k.t[2] || 0);
  for (let i = 0; i < keys.length - 1; i++) { const a = T(keys[i]), b = T(keys[i + 1]); if (c.lt >= a) { k0 = keys[i]; k1 = keys[i + 1]; s = clamp((c.lt - a) / Math.max(b - a, .01)); } }
  if (c.lt >= T(keys[keys.length - 1])) { k0 = k1 = keys[keys.length - 1]; s = 0; } const e = eio(s); return { p: P(k0.p, k1.p, e), at: P(k0.a, k1.a, e), fov: lerp(k0.fov || 44, k1.fov || 44, e), roll: lerp(k0.roll || 0, k1.roll || 0, e) }; };
const shadowy = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

// ================= NOSEY (parody animatronic rabbit) =================
const furT = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#cfc5b4'; g.fillRect(0, 0, w, h); const r = rng(3); for (let i = 0; i < 9000; i++) { g.strokeStyle = r() < .5 ? 'rgba(90,80,64,.18)' : 'rgba(250,245,232,.18)'; g.lineWidth = 1; const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 4, y + 5 + r() * 6); g.stroke(); }
  for (let i = 0; i < 14; i++) { const x = r() * w, y = r() * h, s = 20 + r() * 60, gr = g.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, 'rgba(80,62,40,.45)'); gr.addColorStop(1, 'rgba(80,62,40,0)'); g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2); }
  g.strokeStyle = 'rgba(60,50,40,.6)'; g.setLineDash([6, 5]); g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(0, 120 + i * 140); g.bezierCurveTo(w * .3, 100 + i * 140, w * .6, 150 + i * 140, w, 110 + i * 140); g.stroke(); } });
furT.wrapS = furT.wrapT = THREE.RepeatWrapping;
const FUR = new THREE.MeshStandardMaterial({ map: furT, roughness: 1, color: '#ffffff' }), FUR2 = new THREE.MeshStandardMaterial({ map: furT, roughness: 1, color: '#a89a86' });
const METAL = new THREE.MeshStandardMaterial({ color: '#6a7078', metalness: .85, roughness: .32 }), DARKM = new THREE.MeshStandardMaterial({ color: '#2a2c30', metalness: .7, roughness: .45 });
const PINK = new THREE.MeshStandardMaterial({ color: '#c88a8a', roughness: .6 }), TOOTH = new THREE.MeshStandardMaterial({ color: '#efe4c4', roughness: .4 });
const EYE = new THREE.MeshStandardMaterial({ color: '#111', roughness: .05, metalness: .3, emissive: '#ffb030', emissiveIntensity: 0 });
const mesh = (geo, mat, x = 0, y = 0, z = 0, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (parent) parent.add(m); return m; };
const cap = (r, len, mat, parent, y = 0) => mesh(new THREE.CapsuleGeometry(r, len, 6, 16), mat, 0, y, 0, parent);
function makeNosey() {
  const N = new THREE.Group(), J = {};
  const pelvis = new THREE.Group(); pelvis.position.y = 1.45; N.add(pelvis); J.pelvis = pelvis;
  mesh(new THREE.SphereGeometry(.34, 24, 16), FUR, 0, 0, 0, pelvis).scale.set(1.1, .7, .85);
  [-1, 1].forEach(s => { const hip = new THREE.Group(); hip.position.set(s * .22, -.05, 0); pelvis.add(hip); cap(.15, .5, FUR, hip, -.36);
    const knee = new THREE.Group(); knee.position.y = -.75; hip.add(knee); mesh(new THREE.SphereGeometry(.09, 16, 12), METAL, 0, 0, 0, knee);
    [-.05, .05].forEach(dx => { const rod = mesh(new THREE.CylinderGeometry(.025, .025, .7, 8), METAL, dx, -.35, 0, knee); }); mesh(new THREE.CylinderGeometry(.04, .03, .62, 8), DARKM, 0, -.35, -.06, knee);
    const ankle = new THREE.Group(); ankle.position.y = -.72; knee.add(ankle); mesh(new THREE.SphereGeometry(.07, 12, 10), METAL, 0, 0, 0, ankle);
    const foot = mesh(new THREE.CapsuleGeometry(.1, .42, 6, 12), FUR2, 0, -.05, .18, ankle); foot.rotation.x = Math.PI / 2; foot.scale.set(1.2, 1, .7);
    J[s < 0 ? 'hipL' : 'hipR'] = hip; J[s < 0 ? 'kneeL' : 'kneeR'] = knee; });
  const spine = new THREE.Group(); pelvis.add(spine); J.spine = spine;
  const chest = mesh(new THREE.SphereGeometry(.4, 28, 20), FUR, 0, .5, 0, spine); chest.scale.set(1, 1.35, .8);
  mesh(new THREE.SphereGeometry(.3, 24, 16), new THREE.MeshStandardMaterial({ map: furT, roughness: 1, color: '#f4ece0' }), 0, .38, .12, spine).scale.set(.85, 1.2, .55);
  // torn patch with ribs/wires showing
  const hole = mesh(new THREE.CircleGeometry(.11, 20), DARKM, .2, .72, .26, spine); hole.rotation.y = .5; for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(.16, .015, .02), METAL, .2, .67 + i * .045, .27, spine).rotation.y = .5;
  const wire = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(.22, .7, .28), V(.27, .55, .33), V(.25, .4, .3)]), 12, .012, 6), new THREE.MeshStandardMaterial({ color: '#c8302a' }), 0, 0, 0, spine);
  J.sparkAt = [V(.2, .72, .27), V(.42, 1.0, 0), V(0, 1.25, 0)];
  [-1, 1].forEach(s => { const sh = new THREE.Group(); sh.position.set(s * .4, .95, 0); spine.add(sh); mesh(new THREE.SphereGeometry(.13, 16, 12), FUR, 0, 0, 0, sh); cap(.09, .45, FUR, sh, -.3);
    const el = new THREE.Group(); el.position.y = -.6; sh.add(el); mesh(new THREE.SphereGeometry(.07, 12, 10), METAL, 0, 0, 0, el); mesh(new THREE.CylinderGeometry(.03, .03, .55, 8), METAL, 0, -.28, 0, el); cap(.075, .25, FUR2, el, -.18);
    const hand = new THREE.Group(); hand.position.y = -.6; el.add(hand); mesh(new THREE.SphereGeometry(.08, 12, 10), FUR2, 0, 0, 0, hand); for (let f = 0; f < 4; f++) { const fg = mesh(new THREE.CapsuleGeometry(.018, .17, 4, 8), METAL, -.045 + f * .03, -.13, .02, hand); fg.rotation.x = .2; }
    J[s < 0 ? 'shL' : 'shR'] = sh; J[s < 0 ? 'elL' : 'elR'] = el; });
  const neck = new THREE.Group(); neck.position.y = 1.08; spine.add(neck); mesh(new THREE.CylinderGeometry(.06, .07, .25, 10), METAL, 0, .1, 0, neck); J.neck = neck;
  const head = new THREE.Group(); head.position.y = .3; neck.add(head); J.head = head;
  mesh(new THREE.SphereGeometry(.3, 28, 20), FUR, 0, .08, 0, head).scale.set(1, .95, 1.1);
  const snout = mesh(new THREE.CapsuleGeometry(.13, .32, 8, 16), FUR, 0, 0, .3, head); snout.rotation.x = Math.PI / 2 - .25; snout.scale.set(1, 1, .85);
  mesh(new THREE.SphereGeometry(.07, 16, 12), PINK, 0, .06, .55, head).scale.set(1.3, .8, 1);
  [-1, 1].forEach(s => { const t2 = mesh(new THREE.BoxGeometry(.055, .1, .03), TOOTH, s * .03, -.12, .45, head); t2.rotation.x = .2; });
  const jaw = new THREE.Group(); jaw.position.set(0, -.08, .18); head.add(jaw); mesh(new THREE.CapsuleGeometry(.09, .2, 6, 12), FUR2, 0, -.05, .1, jaw).rotation.x = Math.PI / 2; J.jaw = jaw;
  J.eyes = [-1, 1].map(s => { const e = mesh(new THREE.SphereGeometry(.075, 20, 16), EYE, s * .15, .14, .22, head); const gl = sprite(TEX.glowY, .5, true, 0); gl.material.color.set('#ffb040'); gl.position.copy(e.position).add(V(0, 0, .04)); head.add(gl); return gl; });
  [-1, 1].forEach(s => { const ear = new THREE.Group(); ear.position.set(s * .14, .3, -.05); ear.rotation.z = -s * .14; head.add(ear); const lo = cap(.07, .42, FUR, ear, .28); lo.scale.set(1, 1, .45);
    const tip = new THREE.Group(); tip.position.y = .56; ear.add(tip); cap(.065, .36, FUR, tip, .2).scale.set(1, 1, .45); mesh(new THREE.CylinderGeometry(.012, .012, .3, 6), METAL, 0, .18, -.03, tip);
    J[s < 0 ? 'earL' : 'earR'] = ear; J[s < 0 ? 'earTipL' : 'earTipR'] = tip; });
  J.earTipR.rotation.x = .9;
  shadowy(N); N.userData.J = J; return N;
}
// pose: walk (phase), crawl 0..1, slump 0..1, sink depth, twitch, eyes 0..1, look
function poseNosey(N, t, o = {}) { const J = N.userData.J, ph = o.walk ? t * 4.2 : 0, sw = o.walk ? Math.sin(ph) : 0, cw = o.crawl || 0, sl = o.slump || 0;
  const jerk = o.twitch ? (Math.sin(t * 47) * Math.sin(t * 13) > .3 ? 1 : 0) * o.twitch : 0;
  J.pelvis.position.y = 1.45 - cw * .78 - sl * .35 + (o.walk ? Math.abs(Math.cos(ph)) * .05 : 0) - (o.sink || 0);
  J.hipL.rotation.x = -sw * .45 - cw * 1.6 - sl * .3; J.hipR.rotation.x = sw * .45 - cw * 1.6 - sl * .3; J.kneeL.rotation.x = Math.max(0, sw) * .7 + cw * 2.1 + sl * .7; J.kneeR.rotation.x = Math.max(0, -sw) * .7 + cw * 2.1 + sl * .7;
  J.spine.rotation.x = cw * 1.15 + sl * .5 + jerk * .08; J.spine.rotation.z = Math.sin(t * .9) * .02 + jerk * .1;
  J.shL.rotation.x = sw * .35 - cw * 1.3 + sl * .2 + (o.armsUp || 0) * -2.6; J.shR.rotation.x = -sw * .35 - cw * 1.3 + sl * .2 + (o.armsUp || 0) * -2.6; J.shL.rotation.z = -.08 - jerk * .3; J.shR.rotation.z = .08 + jerk * .4;
  J.elL.rotation.x = -.25 - cw * .3; J.elR.rotation.x = -.25 - cw * .3;
  J.neck.rotation.x = -cw * .9 + sl * .9 + (o.down || 0); J.head.rotation.y = (o.look || 0) + Math.sin(t * .7) * .05 + jerk * .5; J.head.rotation.z = (o.tilt ?? .12) + Math.sin(t * .4) * .04 - jerk * .3;
  J.jaw.rotation.x = (o.jaw || 0) + jerk * .4 + sl * .35; J.earL.rotation.x = sl * .9 + (o.earDroop || 0); J.earR.rotation.x = sl * 1.1 + (o.earDroop || 0) * .8; J.earTipR.rotation.x = .9 + sl * .4;
  const eyes = o.eyes ?? 1, flick = o.flicker ? (Math.sin(t * 31) > .2 ? 1 : .15) : 1; J.eyes.forEach(e => e.material.opacity = eyes * flick); EYE.emissiveIntensity = 1.6 * eyes * flick; }

// ================= WORKSHOP =================
const SHOP = loc('NSHOP', 330000);
{ const conc = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#8a8680'; g.fillRect(0, 0, w, h); const r = rng(7); for (let i = 0; i < 3000; i++) { g.fillStyle = r() < .5 ? 'rgba(60,56,50,.18)' : 'rgba(200,196,188,.14)'; g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); } for (let i = 0; i < 6; i++) { const x = r() * w, y = r() * h, s = 30 + r() * 80, gr = g.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, 'rgba(40,36,30,.35)'); gr.addColorStop(1, 'rgba(40,36,30,0)'); g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2); } g.strokeStyle = 'rgba(40,40,40,.4)'; g.lineWidth = 2; g.strokeRect(0, 0, w, h); });
  conc.wrapS = conc.wrapT = THREE.RepeatWrapping; conc.repeat.set(4, 4);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshStandardMaterial({ map: conc, roughness: .8 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; SHOP.add(fl);
  const wallT = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#b8a890'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,70,56,.5)'; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } }); wallT.wrapS = THREE.RepeatWrapping; wallT.repeat.set(4, 1);
  const wm = new THREE.MeshStandardMaterial({ map: wallT, roughness: .9 });
  [[0, 3, -8, 0], [-8, 3, 0, Math.PI / 2], [8, 3, 0, -Math.PI / 2], [0, 3, 8, Math.PI]].forEach(([x, y, z, r]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wm); m.position.set(x, y, z); m.rotation.y = r; m.receiveShadow = true; SHOP.add(m); });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), std('#3a3630')); ceil.rotation.x = Math.PI / 2; ceil.position.y = 6; SHOP.add(ceil);
  for (let x = -6; x <= 6; x += 3) blk(.25, .3, 16, '#5a4a38', x, 5.8, 0, SHOP);
  // workbench + tools + pegboard
  blk(5, .12, 1.1, '#7a5a3a', -3.5, 1.0, -7.2, SHOP); for (const x of [-5.8, -1.2]) blk(.12, 1, 1, '#4a3a2a', x, .5, -7.2, SHOP);
  const peg = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#c8a878'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(60,40,20,.5)'; for (let y = 10; y < h; y += 16) for (let x = 10; x < w; x += 16) { g.beginPath(); g.arc(x, y, 2, 0, TAU); g.fill(); } const r = rng(4); const cols = ['#c8302a', '#2a4a8a', '#e8b030', '#555']; for (let i = 0; i < 26; i++) { g.fillStyle = cols[i % 4]; const x = 20 + r() * (w - 60), y = 20 + r() * (h - 80); g.fillRect(x, y, 8 + r() * 10, 30 + r() * 40); g.fillStyle = '#888'; g.fillRect(x - 4, y + 30, 16, 10); } });
  const pb = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.4), new THREE.MeshStandardMaterial({ map: peg })); pb.position.set(-3.5, 2.6, -7.95); SHOP.add(pb);
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 1.4, 16), std('#2a6a3a', { metalness: .4 })); tank.position.set(-.6, .7, -7.3); SHOP.add(tank);
  for (let i = 0; i < 6; i++) blk(.3 + Math.random() * .3, .2, .2, ['#c8302a', '#2a4a8a', '#888'][i % 3], -5.5 + i * .8, 1.16, -7.2, SHOP);
  // spare parts: a second head on a shelf, arm on the floor, cables
  blk(2.4, .08, .8, '#5a4a38', 4.5, 2.2, -7.5, SHOP); const spare = new THREE.Mesh(new THREE.SphereGeometry(.28, 20, 14), FUR); spare.position.set(4.6, 2.5, -7.4); SHOP.add(spare);
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-2 + i * .3, .02, -4), V(-1 + i * .5, .02, -2 + i * .3), V(i * .6, .02, -1)]), 20, .03, 6), std(['#c8302a', '#222', '#e8b030'][i % 3])); SHOP.add(c); }
  // the side door (6'8") and garage door
  const doorFrame = new THREE.Group(); doorFrame.position.set(5.5, 0, 7.95); SHOP.add(doorFrame); blk(1.1, 2.12, .12, '#3a3a40', 0, 1.06, 0, doorFrame); const dlight = new THREE.Mesh(new THREE.PlaneGeometry(.92, 2.02), new THREE.MeshBasicMaterial({ color: '#ffd8a0' })); dlight.position.set(0, 1.01, -.07); dlight.rotation.y = Math.PI; doorFrame.add(dlight); SHOP.userData.doorLight = dlight;
  const gd = new THREE.Mesh(new THREE.PlaneGeometry(5, 4), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d8d4cc'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4); }) })); gd.position.set(-3, 2, 7.95); gd.rotation.y = Math.PI; SHOP.add(gd);
  const bulbs = []; [[-3, -2], [2, -2], [-3, 3], [2, 3]].forEach(([x, z]) => { const cord = blk(.02, .8, .02, '#222', x, 5.6, z, SHOP); const shade = new THREE.Mesh(new THREE.ConeGeometry(.35, .3, 16, 1, true), std('#2a2a2a', { side: THREE.DoubleSide })); shade.position.set(x, 5.1, z); SHOP.add(shade); const pl = new THREE.PointLight('#ffcf8a', 14, 12, 1.5); pl.position.set(x, 4.9, z); pl.castShadow = x === 2 && z === -2; if (pl.castShadow) pl.shadow.mapSize.set(1024, 1024); SHOP.add(pl); bulbs.push(pl); const gl = sprite(TEX.glowY, .9, true, .9); gl.position.set(x, 4.95, z); SHOP.add(gl); });
  SHOP.add(new THREE.HemisphereLight('#c8d0e0', '#4a4036', .35)); SHOP.userData.bulbs = bulbs; }
const crackT = canvasTex(512, 512, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(20,18,16,.9)'; g.lineCap = 'round'; const r = rng(5); for (let i = 0; i < 14; i++) { let x = w / 2, y = h / 2, a = r() * TAU; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 9; k++) { a += (r() - .5) * .8; x += Math.cos(a) * 26; y += Math.sin(a) * 26; g.lineTo(x, y); g.lineWidth = Math.max(1, 6 - k * .6); } g.stroke(); } });
const cracks = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ map: crackT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; m.position.y = .01; SHOP.add(m); return m; });

// ================= TOWN (street, lawns, houses, parking lot) =================
const TOWN = loc('NTOWN', 340000);
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() } }, vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`, fragmentShader: `uniform vec3 top, hor; varying vec3 vP; void main(){ gl_FragColor = vec4(mix(hor, top, pow(clamp(vP.y,0.,1.),.5)), 1.); }` });
const skyM = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat); skyM.renderOrder = -2; TOWN.add(skyM);
const tSun = new THREE.DirectionalLight('#fff0dc', 2.4); tSun.castShadow = true; tSun.shadow.mapSize.set(2048, 2048); const tsc = tSun.shadow.camera; tsc.left = tsc.bottom = -30; tsc.right = tsc.top = 30; tsc.near = 1; tsc.far = 200; tSun.shadow.bias = -.0005; tSun.shadow.normalBias = .03; const tSunT = new THREE.Object3D(); TOWN.add(tSun, tSunT); tSun.target = tSunT;
const tHemi = new THREE.HemisphereLight('#cfe0ff', '#5a6a3a', 1); TOWN.add(tHemi);
const asphalt = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#3a3c40'; g.fillRect(0, 0, w, h); const r = rng(9); for (let i = 0; i < 6000; i++) { g.fillStyle = r() < .5 ? 'rgba(20,20,22,.3)' : 'rgba(120,120,120,.2)'; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); } }); asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping; asphalt.repeat.set(60, 4);
const ROADM = new THREE.MeshStandardMaterial({ map: asphalt, roughness: .85, metalness: 0 });
const road = new THREE.Mesh(new THREE.PlaneGeometry(400, 9), ROADM); road.rotation.x = -Math.PI / 2; road.receiveShadow = true; TOWN.add(road);
for (let x = -200; x < 200; x += 6) blk(3, .01, .15, '#e8c83a', x, .005, 0, TOWN, false);
const grassT = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#5a8a3a'; g.fillRect(0, 0, w, h); const r = rng(2); for (let i = 0; i < 12000; i++) { g.strokeStyle = r() < .5 ? 'rgba(40,80,20,.45)' : 'rgba(150,200,90,.35)'; g.beginPath(); const x = r() * w, y = r() * h; g.moveTo(x, y); g.lineTo(x + (r() - .5) * 3, y - 4 - r() * 5); g.stroke(); } }); grassT.wrapS = grassT.wrapT = THREE.RepeatWrapping; grassT.repeat.set(40, 4);
const GRASSM = new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 });
const SIDEM = std('#b8b4ac');
[-1, 1].forEach(s => { const sw = new THREE.Mesh(new THREE.PlaneGeometry(400, 2.4), SIDEM); sw.rotation.x = -Math.PI / 2; sw.position.set(0, .06, s * 5.7); sw.receiveShadow = true; TOWN.add(sw); blk(400, .15, .2, '#9a968e', 0, .07, s * 4.55, TOWN, false);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(400, 16), GRASSM); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, .03, s * 14.9); lawn.receiveShadow = true; TOWN.add(lawn); });
// grass blades near the hero lawn
{ const n = 5000, im = new THREE.InstancedMesh(new THREE.ConeGeometry(.02, .22, 3), new THREE.MeshStandardMaterial({ color: '#5f9a3e', roughness: 1 }), n), m = new THREE.Matrix4(), q = new THREE.Quaternion(), r = rng(4); for (let i = 0; i < n; i++) { q.setFromEuler(new THREE.Euler((r() - .5) * .4, r() * 3, (r() - .5) * .4)); m.compose(V(-14 + r() * 28, .1, 7.2 + r() * 13), q, V(1, .7 + r() * .8, 1)); im.setMatrixAt(i, m); } im.receiveShadow = true; TOWN.add(im); }
const sidingT = (col, seed) => canvasTex(256, 256, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 14) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, y + 11, w, 3); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, y, w, 2); } });
const HOUSES = [];
function house(x, z, col, roofCol, flip) { const g = new THREE.Group(); g.position.set(x, 0, z); if (flip) g.rotation.y = Math.PI; TOWN.add(g); const st = sidingT(col); st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(3, 1.5);
  const body = new THREE.Mesh(new THREE.BoxGeometry(11, 5.4, 9), new THREE.MeshStandardMaterial({ map: st, roughness: .9 })); body.position.y = 2.7; g.add(body);
  const roofShape = new THREE.Shape(); roofShape.moveTo(-6.2, 0); roofShape.lineTo(0, 3.4); roofShape.lineTo(6.2, 0); roofShape.lineTo(-6.2, 0); const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(roofShape, { depth: 10, bevelEnabled: false }), std(roofCol)); roof.position.set(0, 5.4, -5); g.add(roof);
  const winM = new THREE.MeshStandardMaterial({ color: '#2a3a4a', roughness: .1, metalness: .4, emissive: '#ffcf80', emissiveIntensity: 0 }); g.userData.winM = winM;
  [[-3.4, 1.7], [3.4, 1.7], [-3.4, 4.0], [3.4, 4.0], [0, 4.0]].forEach(([wx, wy]) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.3), winM); w.position.set(wx, wy, -4.52); w.rotation.y = Math.PI; g.add(w); blk(1.7, .12, .15, '#f4f2ee', wx, wy - .7, -4.55, g); blk(.35, 1.4, .05, '#3a4a6a', wx - 1.0, wy, -4.53, g); blk(.35, 1.4, .05, '#3a4a6a', wx + 1.0, wy, -4.53, g); });
  blk(1.1, 2.1, .1, '#8a2a22', 0, 1.25, -4.55, g); blk(1.4, .2, 1.2, '#b8b4ac', 0, .1, -5.1, g); blk(.12, .08, .06, '#e8c83a', .38, 1.2, -4.62, g);
  shadowy(g); HOUSES.push(g); return g; }
const HCOL = [['#e8e2d4', '#4a4a50'], ['#b8cfe0', '#5a3a2a'], ['#f0dcc0', '#3a3a3a'], ['#d0e0c8', '#6a3a2a'], ['#e8c8b8', '#3a3a44']];
for (let i = -3; i <= 3; i++) { const [c, rc] = HCOL[(i + 3) % 5]; house(i * 17, 27, c, rc, false); house(i * 17 + 8, -27, HCOL[(i + 5) % 5][0], HCOL[(i + 5) % 5][1], true); }
// trees, mailboxes, cars
function tree(x, z, s = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); TOWN.add(g); const tr = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, 3, 8), std('#5a4030')); tr.position.y = 1.5; g.add(tr); const r = rng(Math.floor(x * 7 + z));
  for (let k = 0; k < 5; k++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2 + r() * .6, 1), new THREE.MeshStandardMaterial({ color: r() < .5 ? '#3f7a32' : '#4f8a3a', roughness: 1, flatShading: true })); c.position.set((r() - .5) * 1.6, 3.6 + r() * 1.2, (r() - .5) * 1.6); g.add(c); } shadowy(g); return g; }
for (let i = -6; i <= 6; i++) { tree(i * 17 + 7, 9, .9 + (i % 3) * .1); tree(i * 17 - 1, -10, 1); }
function car(x, z, ry, col, police) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; TOWN.add(g); const paint = new THREE.MeshStandardMaterial({ color: col, metalness: .5, roughness: .3 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, .7, 4.5), paint); body.position.y = .65; g.add(body); const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, .6, 2.3), paint); cab.position.set(0, 1.25, -.2); g.add(cab);
  const glass = new THREE.MeshStandardMaterial({ color: '#1a2430', metalness: .6, roughness: .08 }); [[0, 1.27, .96, 1.6, .5, .05], [0, 1.27, -1.36, 1.6, .5, .05]].forEach(([gx, gy, gz, w, h, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glass); m.position.set(gx, gy, gz); g.add(m); }); [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.BoxGeometry(.04, .45, 2.0), glass); m.position.set(s * .86, 1.27, -.2); g.add(m); });
  [-1, 1].forEach(sx => [-1.45, 1.45].forEach(sz => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .28, 18), std('#1a1a1a')); w.rotation.z = Math.PI / 2; w.position.set(sx * .9, .36, sz); g.add(w); const hub = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .3, 12), std('#9aa0a8', { metalness: .8 })); hub.rotation.z = Math.PI / 2; hub.position.set(sx * .92, .36, sz); g.add(hub); }));
  [-.6, .6].forEach(dx => { const hl = new THREE.Mesh(new THREE.BoxGeometry(.35, .14, .05), new THREE.MeshBasicMaterial({ color: '#fff4dc' })); hl.position.set(dx, .75, 2.26); g.add(hl); const tl = new THREE.Mesh(new THREE.BoxGeometry(.35, .12, .05), new THREE.MeshBasicMaterial({ color: '#c82020' })); tl.position.set(dx, .78, -2.26); g.add(tl); });
  if (police) { const doorT = canvasTex(256, 64, (gg, w, h) => { gg.fillStyle = '#f4f4f4'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#1a1a2a'; gg.font = '800 36px Inter, sans-serif'; gg.textAlign = 'center'; gg.fillText('POLICE', w / 2, 46); }); [-1, 1].forEach(s => { const d = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .5), new THREE.MeshBasicMaterial({ map: doorT })); d.position.set(s * .96, .7, 0); d.rotation.y = s * Math.PI / 2; g.add(d); });
    const bar = new THREE.Group(); bar.position.y = 1.62; g.add(bar); const red = new THREE.Mesh(new THREE.BoxGeometry(.6, .14, .3), new THREE.MeshBasicMaterial({ color: '#ff2a2a' })); red.position.x = -.33; const blue = new THREE.Mesh(new THREE.BoxGeometry(.6, .14, .3), new THREE.MeshBasicMaterial({ color: '#2a5aff' })); blue.position.x = .33; bar.add(red, blue);
    const lr = new THREE.PointLight('#ff2a2a', 0, 18, 1.6), lb = new THREE.PointLight('#2a5aff', 0, 18, 1.6); lr.position.set(-.4, .3, 0); lb.position.set(.4, .3, 0); bar.add(lr, lb); const gr = sprite(TEX.glowR, 2.4, true, 0), gb = sprite(TEX.glowC, 2.4, true, 0); gb.material.color.set('#3a6aff'); gr.position.set(-.35, .1, 0); gb.position.set(.35, .1, 0); bar.add(gr, gb); g.userData.lights = { red, blue, lr, lb, gr, gb }; }
  shadowy(g); return g; }
const parked = [car(-20, 3, 0, '#c8302a'), car(10, -3, Math.PI, '#e8e8ec'), car(30, 3.2, 0, '#2a4a7a'), car(-40, -3.1, Math.PI, '#3a3a3a')];
const COPS = [car(6, 1.5, -.6, '#141414', true), car(-6, -1, .5, '#141414', true)];
COPS.forEach(c => { c.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHexString() === '141414') { } }); c.children[0].material.color.set('#151518'); });
// parking lot + store at x = 120
const LOT = new THREE.Group(); LOT.position.set(130, 0, 0); TOWN.add(LOT);
{ const lot = new THREE.Mesh(new THREE.PlaneGeometry(70, 60), ROADM); lot.rotation.x = -Math.PI / 2; lot.position.y = .02; lot.receiveShadow = true; LOT.add(lot); for (let x = -30; x <= 30; x += 3.2) { blk(.12, .01, 5.5, '#f4f4f0', x, .03, -8, LOT, false); blk(.12, .01, 5.5, '#f4f4f0', x, .03, 8, LOT, false); }
  const storeT = canvasTex(1024, 256, (g, w, h) => { g.fillStyle = '#e8e2d4'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a7a3a'; g.fillRect(0, 0, w, 70); g.fillStyle = '#fff'; g.font = '800 54px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('FRESH MART', w / 2, 54); g.fillStyle = '#2a3a4a'; for (let x = 60; x < w - 60; x += 110) g.fillRect(x, 110, 90, 130); });
  const store = new THREE.Mesh(new THREE.BoxGeometry(60, 9, 20), [std('#d8d2c4'), std('#d8d2c4'), std('#8a8680'), std('#8a8680'), new THREE.MeshStandardMaterial({ map: storeT }), std('#d8d2c4')]); store.position.set(0, 4.5, -32); store.castShadow = true; LOT.add(store);
  for (let x = -24; x <= 24; x += 16) [-16, 16].forEach(z => { const p = blk(.18, 8, .18, '#6a6e74', x, 4, z, LOT); const h2 = blk(1.4, .2, .5, '#4a4e54', x, 8.0, z, LOT); });
  const r = rng(3); for (let i = 0; i < 14; i++) { const x = -28 + Math.floor(r() * 18) * 3.2, z = r() < .5 ? -8 : 8; const c = car(130 + x, z, r() < .5 ? 0 : Math.PI, ['#c8302a', '#e8e8ec', '#2a4a7a', '#3a3a3a', '#8a8a8a', '#d8c8a0'][i % 6]); }
  for (let i = 0; i < 4; i++) { const cart = new THREE.Mesh(new THREE.BoxGeometry(.6, .5, .9), new THREE.MeshStandardMaterial({ color: '#b8bcc4', metalness: .8, roughness: .3, wireframe: true })); cart.position.set(-8 + i * 1.2, .6, 14 + i * .3); LOT.add(cart); } }
// tow truck (flatbed)
const TOW = new THREE.Group(); TOWN.add(TOW);
{ const cabM = new THREE.MeshStandardMaterial({ color: '#e8b020', metalness: .4, roughness: .4 }); const cab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.2, 2.4), cabM); cab.position.set(0, 1.6, 4.2); TOW.add(cab); const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, .8, .05), new THREE.MeshStandardMaterial({ color: '#1a2430', metalness: .6, roughness: .1 })); win.position.set(0, 2.1, 5.42); TOW.add(win);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4, .3, 7), std('#3a3c40', { metalness: .6 })); bed.position.set(0, 1.05, -.6); TOW.add(bed); const lb = new THREE.Mesh(new THREE.BoxGeometry(1.4, .15, .3), new THREE.MeshBasicMaterial({ color: '#ffa020' })); lb.position.set(0, 2.8, 4.2); TOW.add(lb); TOW.userData.lb = lb;
  [[-1.1, 4.4], [1.1, 4.4], [-1.1, -1.8], [1.1, -1.8], [-1.1, -3.2], [1.1, -3.2]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .4, 18), std('#151515')); w.rotation.z = Math.PI / 2; w.position.set(x, .5, z); TOW.add(w); }); shadowy(TOW); }
// rain + splashes
const RAIN = new THREE.InstancedMesh(new THREE.PlaneGeometry(.015, .7), new THREE.MeshBasicMaterial({ color: '#cfdcf0', transparent: true, opacity: .55, depthWrite: false, side: THREE.DoubleSide }), 1600); RAIN.frustumCulled = false; TOWN.add(RAIN);
const SPARKS = []; for (let i = 0; i < 40; i++) { const s = sprite(TEX.glowY, .25, true, 0); s.material.color.set('#fff2b0'); TOWN.add(s); SPARKS.push(s); }
const SMOKE = []; for (let i = 0; i < 16; i++) { const s = sprite(TEX.smoke, 1, false, 0); s.material.color.set('#8a8a8a'); TOWN.add(s); SMOKE.push(s); }
const MUD = []; for (let i = 0; i < 24; i++) { const s = sprite(TEX.smoke, .4, false, 0); s.material.color.set('#4a3a28'); TOWN.add(s); MUD.push(s); }
const mudPit = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), new THREE.MeshStandardMaterial({ color: '#3a2c1e', roughness: .35, metalness: .1 })); mudPit.rotation.x = -Math.PI / 2; mudPit.position.set(0, .045, 14); TOWN.add(mudPit);
const forSale = new THREE.Group(); TOWN.add(forSale); { blk(.08, 1.4, .08, '#5a4030', 0, .7, 0, forSale); const sT = canvasTex(256, 160, (g, w, h) => { g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8202a'; g.fillRect(0, 0, w, 44); g.fillStyle = '#fff'; g.font = '800 34px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('FOR SALE', w / 2, 34); g.fillStyle = '#1a1a1a'; g.font = '800 46px Inter, sans-serif'; g.fillText('$400 OBO', w / 2, 112); }); const sg = new THREE.Mesh(new THREE.PlaneGeometry(1, .62), new THREE.MeshStandardMaterial({ map: sT })); sg.position.y = 1.55; forSale.add(sg); }

// ================= characters =================
const nosey = makeNosey(); scene.add(nosey);
const people = {}; const mk = (k, o, sc = .9) => { const p = vox(o); p.scale.setScalar(sc); scene.add(p); people[k] = p; return p; };
mk('builder', { seed: 1501, shirt: '#5a4a3a', pants: '#2a3a4a', skin: '#e3b089', hair: '#3a2a1a', style: 3, beard: true });
['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].forEach((k, i) => mk(k, { seed: 1520 + i }));
mk('cop1', { seed: 1601, shirt: '#1a2a4a', pants: '#1a2a4a', skin: '#c98e62', hair: '#1a1a1a', style: 3 }); mk('cop2', { seed: 1602, shirt: '#1a2a4a', pants: '#1a2a4a', skin: '#e3b089', hair: '#4a2e1b', style: 3 });
mk('tow', { seed: 1701, shirt: '#e8b020', pants: '#2a3a5a', skin: '#9a6643', hair: '#1a1a1a', style: 3 });
const phoneGlows = Object.fromEntries(['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].map(k => { const s = sprite(TEX.glowC, .5, true, 0); s.material.color.set('#dff0ff'); scene.add(s); return [k, s]; }));
const placeN = (L, x, y, z, ry) => { nosey.position.set(LOC[L].position.x + x, y, z); nosey.rotation.set(0, ry || 0, 0); nosey.visible = true; };
const placeP = (k, L, x, z, ry, t, o) => put(people[k], LOC[L].position.x + x, 0, z, ry, t, o);

// ================= environment presets =================
const ENV = { dawn: ['#7a8ab8', '#f0b890', '#ffc890', 1.6, .8], day: ['#4a8ad8', '#cfe6ff', '#fff4e0', 2.6, 1.1], rain: ['#4a5260', '#7a8490', '#b8c4d0', .6, .9], dusk: ['#2a3a6a', '#e8906a', '#ffb070', 1.2, .7] };
function town(c, mode, o = {}) { const e = ENV[mode]; skyMat.uniforms.top.value.set(e[0]); skyMat.uniforms.hor.value.set(e[1]); tSun.color.set(e[2]); tSun.intensity = e[3]; tHemi.intensity = e[4]; tHemi.color.set(mode === 'rain' ? '#a8b4c4' : '#cfe0ff');
  const fx = o.focus || [0, 0, 0]; tSunT.position.set(fx[0], 0, fx[2]); tSun.position.set(fx[0] - 30, 40, fx[2] + (mode === 'dusk' ? -20 : 25));
  scene.fog = new THREE.FogExp2(new THREE.Color(e[1]), mode === 'rain' ? .018 : .004); ROADM.roughness = mode === 'rain' ? .2 : .85; ROADM.metalness = mode === 'rain' ? .35 : 0; ROADM.color.set(mode === 'rain' ? '#7a7c80' : '#ffffff');
  HOUSES.forEach(h => h.userData.winM.emissiveIntensity = mode === 'dusk' ? 1.2 : mode === 'rain' ? .5 : 0);
  RAIN.visible = mode === 'rain'; if (RAIN.visible) { const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, .12)), r = rng(5), cx = camera.position.x - TOWN.position.x, cz = camera.position.z; for (let i = 0; i < 1600; i++) { const x = cx + (r() - .5) * 30, z = cz - 2 - r() * 26, y = ((r() * 12 - c.t * 14 * (.8 + r() * .4)) % 12 + 12) % 12; m.compose(V(x, y, z), q, V(1, 1, 1)); RAIN.setMatrixAt(i, m); } RAIN.instanceMatrix.needsUpdate = true; } }
function copLights(t, on) { COPS.forEach((c, i) => { const L = c.userData.lights, a = Math.sin(t * 9 + i) > 0; L.lr.intensity = on && a ? 30 : 0; L.lb.intensity = on && !a ? 30 : 0; L.gr.material.opacity = on && a ? 1 : 0; L.gb.material.opacity = on && !a ? 1 : 0; L.red.material.color.set(a && on ? '#ff3a3a' : '#5a1010'); L.blue.material.color.set(!a && on ? '#3a6aff' : '#10183a'); c.visible = on; }); }
function sparkFX(t, k, at) { const J = nosey.userData.J; SPARKS.forEach((s, i) => { const r = rng(i * 13 + 1), a = (t * (2 + r() * 2) + r()) % 1, src = J.sparkAt[i % 3].clone(); J.spine.localToWorld(src); TOWN.worldToLocal(src); s.position.copy(src).add(V((r() - .5) * a * 1.4, -a * a * 1.6 + a * .6, (r() - .5) * a * 1.4)); s.material.opacity = k * (1 - a) * (Math.sin(t * 40 + i) > -.3 ? 1 : 0); s.scale.setScalar(.12 + (1 - a) * .2); });
  SMOKE.forEach((s, i) => { const r = rng(i + 50), a = (t * .3 + r()) % 1, src = J.sparkAt[i % 3].clone(); J.spine.localToWorld(src); TOWN.worldToLocal(src); s.position.copy(src).add(V(a * .8, a * 2, 0)); s.scale.setScalar(.5 + a * 2); s.material.opacity = k * .35 * Math.sin(a * Math.PI); }); }
RESETS.push((c, sh) => { const on = isMine(); nosey.visible = false; Object.values(people).forEach(p => p.visible = false); Object.values(phoneGlows).forEach(s => s.material.opacity = 0);
  if (!on) return; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; bloom.strength = .35; bloom.threshold = .85; scene.fog = null; camera.near = .05; camera.far = 2000;
  cracks.forEach(m => m.visible = false); copLights(c.t, false); TOW.visible = false; forSale.visible = false; SPARKS.forEach(s => s.material.opacity = 0); SMOKE.forEach(s => s.material.opacity = 0); MUD.forEach(s => s.material.opacity = 0); mudPit.visible = false; RAIN.visible = false; SHOP.userData.doorLight.material.color.set('#ffd8a0'); });

// ================= shots =================
const SH = 'NSHOP', TW = 'NTOWN';
Object.assign(SHOTS, {
  nhook: { loc: SH, aperture: .0016, cam: c => pathCam(c, [{ t: 0, p: [.6, .5, 3.2], a: [0, .5, 0], fov: 46 }, { t: c.d, p: [.9, 2.4, 3.4], a: [0, 2.85, 0], fov: 40 }]),
    fx: c => { placeN(SH, 0, 0, 0, -.12); poseNosey(nosey, c.t, { eyes: sm(.8, 1.6, c.lt), flicker: c.lt < 1.8, tilt: .2 }); } },
  ntall: { loc: SH, aperture: .0008, cam: c => pathCam(c, [{ t: 0, p: [0, 1.8, 8.5], a: [.6, 1.6, 0], fov: 44 }, { t: c.d, p: [0, 1.7, 7.4], a: [.6, 1.7, 0], fov: 44 }]),
    fx: c => { placeN(SH, -.4, 0, 0, .15); poseNosey(nosey, c.t, { look: .4, tilt: .25, down: .25 }); placeP('builder', SH, 1.2, .3, -.6, c.t, { up: .6, expr: c.ch(1) > 0 ? 'o' : 'neutral' }); },
    ov: c => { const k = eo(c.lt / .8); const top = project(world(SH, -.4, 3.05, 0)), bot = project(world(SH, -.4, 0, 0)), top2 = project(world(SH, 1.2, 1.8, .3)), bot2 = project(world(SH, 1.2, 0, .3));
      const bar = (x, y0, y1, col, txt) => `<g opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><line x1="${f1(x)}" y1="${f1(y0)}" x2="${f1(x)}" y2="${f1(lerp(y0, y1, k))}" stroke="${col}" stroke-width="3"/><line x1="${f1(x - 10)}" y1="${f1(y0)}" x2="${f1(x + 10)}" y2="${f1(y0)}" stroke="${col}" stroke-width="3"/><line x1="${f1(x - 10)}" y1="${f1(lerp(y0, y1, k))}" x2="${f1(x + 10)}" y2="${f1(lerp(y0, y1, k))}" stroke="${col}" stroke-width="3"/><text x="${f1(x + 14)}" y="${f1(lerp(y0, y1, k) + 8)}" font-family="Inter" font-weight="800" font-size="24" fill="${col}">${txt}</text></g>`;
      return bar(bot.x - 120, bot.y, top.y, ORANGE, '10 FT') + bar(bot2.x + 60, bot2.y, top2.y, '#ffffff', '6 FT'); } },
  nweight: { loc: SH, aperture: .0012, cam: c => pathCam(c, [{ t: 0, p: [3, .5, 5], a: [0, .3, -1], fov: 46 }, { t: [1, 's'], p: [1.6, .25, 2.2], a: [0, .1, -2], fov: 40 }, { t: c.d, p: [1.4, .3, 1.4], a: [0, .1, -3], fov: 40 }]),
    kick: c => { const st = (c.lt * 4.2 / Math.PI) % 1; return st < .15 ? .12 * (1 - st / .15) : 0; },
    fx: c => { const z = lerp(1, -3.5, clamp(c.lt / c.d)); placeN(SH, 0, 0, z, Math.PI); poseNosey(nosey, c.t, { walk: true }); cracks.forEach((m, i) => { const zz = 1 - i * 1.6; m.visible = z < zz + .4; m.position.set(LOC[SH].position.x + (i % 2 ? .22 : -.22), .01, zz); m.scale.setScalar(Math.max(.01, Math.min(1, (zz + .4 - z) * 2))); }); } },
  ndoor: { loc: SH, aperture: .001, cam: c => pathCam(c, [{ t: 0, p: [2.5, 2.4, 1], a: [5.5, 1.4, 7.9], fov: 46 }, { t: c.d, p: [3.2, 1.5, 3.8], a: [5.5, 1.0, 7.9], fov: 44 }]),
    fx: c => { const k = clamp(c.ch(2) / 2.2), cw = c.ch(2) > 0 ? sm(0, .6, c.ch(2)) : 0, z = lerp(5.2, 6.4, c.ch(2) > 0 ? k : 0); placeN(SH, 5.5, 0, c.ch(2) > 0 ? z : lerp(3.6, 5.2, clamp(c.lt / (c.o.chunks[2].t0 - c.o.t0))), 0); poseNosey(nosey, c.t, { walk: c.ch(2) < 0, crawl: cw, look: 0 }); SHOP.userData.doorLight.material.color.set('#ffd8a0'); },
    ov: c => { if (c.ch(1) < 0) return ''; const k = eo(c.ch(1) / .6), d0 = project(world(SH, 6.2, 0, 7.9)), d1 = project(world(SH, 6.2, 2.03, 7.9)), n0 = project(world(SH, 4.7, 0, 5.2)), n1 = project(world(SH, 4.7, 3.05, 5.2)); const bar = (x, y0, y1, col, txt) => `<g opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><line x1="${f1(x)}" y1="${f1(y0)}" x2="${f1(x)}" y2="${f1(y1)}" stroke="${col}" stroke-width="3"/><line x1="${f1(x - 10)}" y1="${f1(y1)}" x2="${f1(x + 10)}" y2="${f1(y1)}" stroke="${col}" stroke-width="3"/><text x="${f1(x + 14)}" y="${f1(y1 + 8)}" font-family="Inter" font-weight="800" font-size="22" fill="${col}">${txt}</text></g>`;
      return c.ch(2) > 0 ? '' : bar(d0.x, d0.y, d1.y, '#ffffff', "DOOR 6'8\"") + bar(n0.x - 40, n0.y, n1.y, ORANGE, "NOSEY 10'"); } },
  nbattery: { loc: TW, aperture: .0006, cam: c => { const k = clamp(c.lt / c.d), x = lerp(-6, 5, k); return { p: [x - 1.5 + k * 3, 1.9, 1.2], at: [x, 2.0, 5.7], fov: 50 }; },
    fx: c => { town(c, 'dawn', { focus: [0, 0, 6] }); const k = clamp(c.lt / c.d), slow = 1 - sm(.6, 1, k) * .6; placeN(TW, lerp(-6, 5, k), .06, 5.7, Math.PI / 2); poseNosey(nosey, c.t * slow, { walk: true, earDroop: k * .3 }); } },
  nrain: { loc: TW, aperture: .0008, cam: c => pathCam(c, [{ t: 0, p: [8.5, 1.4, 1.2], a: [6, 2.3, 6], fov: 48 }, { t: c.d, p: [7.4, 2.0, 2.6], a: [6, 2.7, 6], fov: 42 }]),
    kick: c => c.ch(1) > 0 ? .04 : 0,
    fx: c => { town(c, 'rain', { focus: [6, 0, 6] }); const z = c.ch(1) > 0 ? 1 : 0; placeN(TW, 6, .06, 6, Math.PI * .9); poseNosey(nosey, c.t, { twitch: z ? 1 : 0, flicker: z, eyes: 1, jaw: .1 }); sparkFX(c.t, z ? 1 : 0); } },
  nlawn: { loc: TW, aperture: .0008, cam: c => pathCam(c, [{ t: 0, p: [4, 1.6, 20.5], a: [0, 1.6, 14], fov: 46 }, { t: c.d, p: [2.4, 1.1, 18.4], a: [0, 1.0, 14], fov: 42 }]),
    fx: c => { town(c, 'rain', { focus: [0, 0, 14] }); mudPit.visible = true; const sink = c.ch(1) > 0 ? sm(0, 2.6, c.ch(1)) * .75 : 0; placeN(TW, 0, .04 - sink, 14, Math.PI * .25); poseNosey(nosey, c.t, { walk: c.ch(1) < 0 || sink < .5, twitch: sink > .3 ? .5 : 0, armsUp: sink > .5 ? .3 : 0 });
      MUD.forEach((s, i) => { const r = rng(i + 3), a = (c.t * (1.5 + r()) + r()) % 1; s.position.set(TOWN.position.x + (r() - .5) * 1.4, .1 + a * .8 * (1 - a) * 2, 14 + (r() - .5) * 1.4); s.material.opacity = sink > .05 ? .8 * (1 - a) : 0; s.scale.setScalar(.3 + a * .3); }); } },
  nphones: { loc: TW, aperture: .0006, cam: c => pathCam(c, [{ t: 0, p: [0, 1.6, -2], a: [0, 2.2, 14], fov: 50 }, { t: c.d, p: [0, 1.4, 0], a: [0, 2.2, 14], fov: 48 }]),
    fx: c => { town(c, 'rain', { focus: [0, 0, 10] }); mudPit.visible = true; placeN(TW, 0, -.7, 14, Math.PI); poseNosey(nosey, c.t, { twitch: .3, look: Math.sin(c.t) * .4, armsUp: .3 });
      ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].forEach((k, i) => { const x = -5 + i * 2, z = 6 + (i % 2) * 1.5; placeP(k, TW, x, z, Math.PI + (x * .04), c.t, { arms: [[-1.6, 0, .2], [-1.6, 0, -.2]], up: .2, expr: i % 2 ? 'o' : 'big', ph: i }); const gl = phoneGlows[k]; gl.position.set(TOWN.position.x + x, 1.25, z + .5); gl.material.opacity = .85; gl.scale.setScalar(.45); }); } },
  npolice: { loc: TW, aperture: .0006, cam: c => pathCam(c, [{ t: 0, p: [-1.0, 3.0, -.5], a: [0, 2.0, 9], fov: 52 }, { t: c.d, p: [-.3, 2.8, 1.4], a: [0, 2.2, 9], fov: 48 }]),
    fx: c => { town(c, 'day', { focus: [0, 0, 8] }); copLights(c.t, c.ch(2) > 0); placeN(TW, 0, .03, 9, Math.PI); poseNosey(nosey, c.t, { armsUp: c.ch(2) > 0 ? sm(0, .5, c.ch(2)) : 0, look: Math.sin(c.t * .8) * .4 });
      ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].forEach((k, i) => { if (c.ch(1) < 0 && i > 1) return; if (c.ch(1) < 0) { } const x = [-1.3, 1.2, -.4, .6, -1.9, 1.9][i], z = [3.2, 2.8, 4.6, 4.4, 5.2, 5.0][i]; placeP(k, TW, x, z, -x * .08, c.t, { arms: [[-1.6, 0, .2], [-1.6, 0, -.2]], up: .25, expr: 'o', ph: i }); const gl = phoneGlows[k]; gl.position.set(TOWN.position.x + x, 1.35, z + .45); gl.material.opacity = .8; gl.scale.setScalar(.45); });
      if (c.ch(2) < 0) return; COPS[0].position.set(TOWN.position.x + 7, 0, 2); COPS[1].position.set(TOWN.position.x - 8, 0, 1.5); placeP('cop1', TW, -1.6, 7.4, .2, c.t, { arms: [[-1.5, 0, .1], [-1.5, 0, -.1]], expr: 'squint' }); placeP('cop2', TW, 1.7, 7.6, -.2, c.t, { arms: [[-1.4, 0, .15], [0, 0, -.1]], talk: c.ch(1) > 0, expr: 'squint', ph: 2 }); } },
  ndead: { loc: TW, aperture: .0008, cam: c => pathCam(c, [{ t: 0, p: [130 + 8, 2.4, 9], a: [130, 2.2, 0], fov: 46 }, { t: c.d, p: [130 + 4, 1.4, 5], a: [130, 1.3, 0], fov: 42 }]),
    fx: c => { town(c, 'day', { focus: [130, 0, 0] }); const sl = c.ch(1) > 0 ? sm(0, 1.6, c.ch(1)) : 0, z = c.ch(1) > 0 ? 0 : lerp(-6, 0, clamp(c.lt / (c.o.chunks[1].t0 - c.o.t0))); placeN(TW, 130, .02, z, 0); poseNosey(nosey, c.t * (1 - sl), { walk: c.ch(1) < 0, slump: sl, eyes: 1 - sl, flicker: sl > 0 && sl < .9 }); } },
  ntow: { loc: TW, aperture: .0006, cam: c => pathCam(c, [{ t: 0, p: [130 + 10, 3, 10], a: [130, 1.6, 0], fov: 46 }, { t: c.d, p: [130 + 12, 4, 13], a: [130, 1.6, 0], fov: 48 }]),
    fx: c => { town(c, 'day', { focus: [130, 0, 0] }); TOW.visible = true; TOW.position.set(130, 0, 0); TOW.rotation.y = 0; TOW.userData.lb.material.color.set(Math.sin(c.t * 8) > 0 ? '#ffb020' : '#5a3a10'); placeN(TW, 130, 1.25, -.6, 0); nosey.rotation.set(-Math.PI / 2 + .08, 0, 0); nosey.position.y = 1.55; nosey.position.z = 2.2; poseNosey(nosey, 0, { slump: .3, eyes: 0 }); placeP('tow', TW, -1.8, 3.6, -.9, c.t, { expr: 'smile', arms: [[0, 0, .06], [-.4, 0, -.06]] }); } },
  nmarket: { loc: TW, aperture: .0008, cam: c => ({ p: [4.6, 1.9, 9.2], at: [0, 1.4, 5.6], fov: 40 }),
    fx: c => { town(c, 'dusk', { focus: [0, 0, 6] }); placeN(TW, 0, .02, 6, .15); poseNosey(nosey, 0, { slump: .9, eyes: 0 }); nosey.position.y = -.25; forSale.visible = true; forSale.position.set(TOWN.position.x + 1.6, 0, 7.4); forSale.rotation.y = -.5; },
    post: c => { const k = eo(clamp(c.lt / .5)), y = lerp(1100, 0, k); return `<g transform="translate(0 ${f1(y)})"><path d="M0 0 H576 V1024 H0 Z M78 120 h420 a36 36 0 0 1 36 36 v712 a36 36 0 0 1 -36 36 h-420 a36 36 0 0 1 -36 -36 v-712 a36 36 0 0 1 36 -36 Z" fill="#0c0c10" fill-rule="evenodd" opacity=".97"/><rect x="42" y="120" width="492" height="784" rx="36" fill="none" stroke="#2a2a30" stroke-width="10"/>
      <rect x="42" y="120" width="492" height="70" rx="0" fill="#f4f4f6"/><text x="70" y="166" font-family="Inter" font-weight="800" font-size="24" fill="#1a1a1a">‹  Marketplace</text>
      <rect x="42" y="560" width="492" height="344" fill="#f4f4f6"/><text x="64" y="610" font-family="Inter" font-weight="800" font-size="26" fill="#1a1a1a">Animatronic rabbit (10 ft)</text><text x="64" y="652" font-family="Inter" font-weight="800" font-size="30" fill="#1a7a3a">$400 · OBO</text>
      <text x="64" y="700" font-family="Inter" font-weight="600" font-size="18" fill="#444">Slightly creepy. Battery dead.</text><text x="64" y="728" font-family="Inter" font-weight="600" font-size="18" fill="#444">Does not fit through doors.</text><text x="64" y="756" font-family="Inter" font-weight="600" font-size="18" fill="#444">Pickup only. Bring a tow truck.</text>
      <rect x="64" y="790" width="448" height="56" rx="12" fill="#2a6ad8"/><text x="288" y="826" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="#fff">Message seller</text></g>`; } },
  nend: { loc: TW, noCap: false, aperture: .0008, cam: c => pathCam(c, [{ t: 0, p: [130 + 6, 1.6, 9], a: [130, 2.4, 0], fov: 46 }, { t: c.d - 1, p: [130 + 1.6, 2.6, 3.4], a: [130, 2.8, 0], fov: 40 }, { t: c.d, p: [130 + 1.6, 2.6, 3.4], a: [130, 2.8, 0], fov: 40 }]),
    fx: c => { town(c, 'dusk', { focus: [130, 0, 0] }); placeN(TW, 130, .02, 0, 0); poseNosey(nosey, c.t, { slump: .15, flicker: true, eyes: .9, earDroop: .3, look: Math.sin(c.t * .5) * .3 });
      TOW.visible = true; TOW.position.set(130 + lerp(30, 9, eo(clamp(c.lt / (c.d * .8)))), 0, -9); TOW.rotation.y = -Math.PI / 2; TOW.userData.lb.material.color.set(Math.sin(c.t * 8) > 0 ? '#ffb020' : '#5a3a10'); },
    post: c => { const a = c.lt - (c.d - 1.6); return a > 0 ? `<rect width="576" height="1024" fill="#000" opacity="${clamp(a / 1.4).toFixed(2)}"/>` : ''; } },
});
// ================= HUD: clock + battery =================
const CLOCK = { nhook: ['5:58 AM', 100], ntall: ['5:59 AM', 100], ndoor: ['7:00 AM', 82], nbattery: ['9:00 AM', null], nrain: ['1:00 PM', 9], npolice: ['3:00 PM', 4], nend: ['5:00 PM', 1] };
GLOBAL_OV.push((t, c, sh) => { if (!isMine()) return ''; const C = CLOCK[c.o.scene]; if (!C) return ''; let b = C[1]; if (b == null) b = Math.round(lerp(60, 12, sm(.15, .95, c.p)));
  const k = clamp(c.lt / .3), col = b > 50 ? '#5dffb0' : b > 15 ? '#ffd23a' : RED, blink = b <= 5 && Math.sin(t * 8) < 0 ? .3 : 1;
  return `<g transform="translate(26 392)" opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.85))"><text x="0" y="0" font-family="Inter" font-weight="800" font-size="13" fill="${ORANGE}" letter-spacing="2.4">NOSEY · DAY 1</text>
    <text x="0" y="46" font-family="Inter" font-weight="800" font-size="40" fill="#fff">${C[0]}</text>
    <g transform="translate(0 64)" opacity="${blink}"><rect x="0" y="0" width="80" height="30" rx="5" fill="none" stroke="#fff" stroke-width="3"/><rect x="80" y="9" width="6" height="12" rx="2" fill="#fff"/><rect x="4" y="4" width="${f1(72 * b / 100)}" height="22" rx="2" fill="${col}"/><text x="98" y="23" font-family="Inter" font-weight="800" font-size="20" fill="${col}">${b}%</text></g></g>`; });
const REASON = { ndoor: ['REASON #1', 'DOORS'], nbattery: ['REASON #2', 'BATTERY'], nrain: ['REASON #3', 'WEATHER'] };
GLOBAL_OV.push((t, c) => { if (!isMine()) return ''; const R2 = REASON[c.o.scene]; if (!R2) return ''; const a = c.ch(0); if (a < 0 || a > 2.2) return ''; const k = Math.min(1, E.spring(a / .3 * .9)), out = clamp((a - 1.8) / .4), sc = lerp(1.6, 1, Math.min(k, 1));
  return `<g transform="translate(288 250) scale(${sc.toFixed(3)})" opacity="${(1 - out).toFixed(2)}" style="filter:drop-shadow(0 3px 8px rgba(0,0,0,.7))"><text y="-30" text-anchor="middle" font-family="Inter" font-weight="800" font-size="26" fill="${ORANGE}" letter-spacing="4">${R2[0]}</text><text y="40" text-anchor="middle" font-family="Anton" font-size="84" fill="#fff" stroke="#111" stroke-width="8" paint-order="stroke" letter-spacing="3">${R2[1]}</text></g>`; });
window.__nosey = true;
