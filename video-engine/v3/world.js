// 3D world for "2D characters in a 3D world" episodes. Toon-shaded low-poly sets with ink outlines,
// billboard cut-out characters, a moving camera with depth of field, and an SVG overlay for captions and graphics.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const W = 720, H = 1280, V = new THREE.Vector3();
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, x) => a + (b - a) * x;
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const spring = x => x <= 0 ? 0 : 1 - Math.exp(-7 * x) * Math.cos(11 * x);
const pop = (lt, dl = 0, du = .4) => spring((lt - dl) / du * .9);
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('gl').appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, .05, 3000);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bokeh = new BokehPass(scene, camera, { focus: 6, aperture: .0025, maxblur: .008 });
composer.addPass(bokeh);
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), .2, .6, .9); composer.addPass(bloom); composer.addPass(new OutputPass());

// ---------- materials ----------
const grad = (() => { const d = new Uint8Array([90, 170, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, o = {}) => new THREE.MeshToonMaterial({ color, gradientMap: grad, ...o });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
const inkMat = new THREE.ShaderMaterial({
  uniforms: { k: { value: .035 } }, side: THREE.BackSide,
  vertexShader: `uniform float k; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix*normal); mv.xyz += n * k * clamp(-mv.z*0.12,0.25,4.0); gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `void main(){ gl_FragColor = vec4(0.082,0.082,0.11,1.0); }`,
});
function ink(mesh, k) {
  const g = mergeVertices(mesh.geometry.clone().deleteAttribute('uv').deleteAttribute('normal')); g.computeVertexNormals();
  const m = k ? inkMat.clone() : inkMat; if (k) m.uniforms.k.value = k;
  const o = new THREE.Mesh(g, m); o.raycast = () => {}; mesh.add(o); return mesh;
}
function M(geo, mat, x = 0, y = 0, z = 0, parent, outline = true) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (outline) ink(m); if (parent) parent.add(m); return m; }
const box = (w, h, d, c, x, y, z, p, ol) => M(new THREE.BoxGeometry(w, h, d), typeof c === 'string' ? toon(c) : c, x, y, z, p, ol);
const cyl = (r1, r2, h, c, x, y, z, p, seg = 24, ol) => M(new THREE.CylinderGeometry(r1, r2, h, seg), typeof c === 'string' ? toon(c) : c, x, y, z, p, ol);
function canvasTex(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const radial = (inner, outer) => canvasTex(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, inner); r.addColorStop(1, outer); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
const TEX = { smoke: radial('rgba(205,210,218,.85)', 'rgba(205,210,218,0)'), glowO: radial('rgba(255,170,60,1)', 'rgba(255,90,0,0)'), glowB: radial('rgba(200,240,255,1)', 'rgba(40,90,255,0)'), glowR: radial('rgba(255,80,80,1)', 'rgba(255,0,0,0)'), glowY: radial('rgba(255,230,140,1)', 'rgba(255,200,60,0)'), glowC: radial('rgba(140,240,255,.9)', 'rgba(60,200,255,0)') };
const sprite = (tex, s, add = true, op = 1) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: op, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending })); sp.scale.set(s, s, 1); return sp; };

// ---------- locations ----------
const LOC = {};
function loc(name, x) { const g = new THREE.Group(); g.position.x = x; g.name = name; scene.add(g); LOC[name] = g; return g; }

// Station model (also used as hologram). Spine along Z: capsule A at +Z, capsule B at -Z.
function stationModel(holo) {
  const g = new THREE.Group();
  const mat = c => holo ? new THREE.MeshBasicMaterial({ color: '#4fd8ff', transparent: true, opacity: .28, depthWrite: false }) : toon(c);
  const add = (geo, c, x, y, z, rx = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat(c)); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); if (holo) { m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: '#9ff0ff' }))); } else ink(m); g.add(m); return m; };
  add(new THREE.CylinderGeometry(1.1, 1.1, 4.2, 20), '#eef1f5', 0, 0, 5.1, Math.PI / 2);      // lab
  add(new THREE.SphereGeometry(1.5, 20, 14), '#f7f8fa', 0, 0, 2.2);                            // hub
  g.userData.service = add(new THREE.CylinderGeometry(1.15, 1.15, 3.6, 20), '#e9edf2', 0, 0, -.6, Math.PI / 2); // service
  g.userData.capA = add(new THREE.ConeGeometry(.95, 1.9, 20), '#fafafa', 0, 0, 8.1, Math.PI / 2);
  g.userData.capB = add(new THREE.ConeGeometry(.95, 1.9, 20), '#fafafa', 0, 0, -3.35, -Math.PI / 2);
  add(new THREE.BoxGeometry(17, .28, .28), '#9aa6b5', 0, 0, 2.2);                               // truss
  for (const x of [-7.2, -4.6, 4.6, 7.2]) for (const s of [1, -1]) {
    const p = add(new THREE.BoxGeometry(2.1, .06, 5.2), '#d9a63c', x, 0, 2.2 + s * 2.8);
    if (!holo) for (let i = 1; i < 4; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(2.12, .08, .05), toon('#6b4d15')); l.position.set(0, 0, -2.6 + i * 1.3); p.add(l); }
  }
  add(new THREE.BoxGeometry(.9, .08, 2.6), '#f2f4f7', 0, 1.6, 2.2, 0, 0);                        // radiators
  add(new THREE.BoxGeometry(.9, .08, 2.6), '#f2f4f7', 0, -1.6, 2.2, 0, 0);
  return g;
}
// --- EXTERIOR ---
const EXT = loc('EXT', 0);
{
  const sunL = new THREE.DirectionalLight('#fff1d6', 3.2); sunL.position.set(40, 30, 20); EXT.add(sunL); EXT.add(new THREE.HemisphereLight('#bcd4ff', '#1b2440', 1.2));
  const r = rng(7), pos = []; for (let i = 0; i < 1500; i++) { const u = r() * 2 - 1, a = r() * Math.PI * 2, R = 900; pos.push(R * Math.sqrt(1 - u * u) * Math.cos(a), R * u, R * Math.sqrt(1 - u * u) * Math.sin(a)); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  EXT.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false })));
  const earthTex = canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#2a73cf'; g.fillRect(0, 0, w, h); const q = rng(21); g.fillStyle = '#3fae74'; for (let i = 0; i < 60; i++) { g.beginPath(); g.ellipse(q() * w, h * .2 + q() * h * .6, 20 + q() * 90, 12 + q() * 50, q() * 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 90; i++) { g.beginPath(); g.ellipse(q() * w, q() * h, 20 + q() * 80, 4 + q() * 9, 0, 0, 7); g.fill(); } });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(300, 64, 48), toon('#ffffff', { map: earthTex })); earth.position.set(0, -335, -60); EXT.add(earth); EXT.userData.earth = earth;
  const atm = new THREE.Mesh(new THREE.SphereGeometry(309, 64, 48), new THREE.MeshBasicMaterial({ color: '#7cc4ff', transparent: true, opacity: .22, side: THREE.BackSide, depthWrite: false })); atm.position.copy(earth.position); EXT.add(atm);
  const sun = sprite(TEX.glowY, 160); sun.position.set(380, 260, -500); EXT.add(sun);
  const st = stationModel(false); EXT.add(st); EXT.userData.station = st;
  const hA = sprite(TEX.glowY, 6, true, 0), hB = sprite(TEX.glowY, 6, true, 0); hA.position.set(0, 0, 8.3); hB.position.set(0, 0, -3.6); st.add(hA, hB); EXT.userData.hA = hA; EXT.userData.hB = hB;
  const alertS = sprite(TEX.glowR, 5, true, 0); alertS.position.set(0, 0, -.6); st.add(alertS); EXT.userData.alert = alertS;
}
// --- HABITAT MODULE interior (Z axis, hatch at z=-20) ---
const HAB = loc('HAB', 1000);
{
  const R = 3.2, Lm = 44;
  const wallTex = canvasTex(2048, 512, (g, w, h) => {
    g.fillStyle = '#8193aa'; g.fillRect(0, 0, w, h); const q = rng(3);
    for (let i = 0; i < 32; i++) for (let j = 0; j < 4; j++) {
      const x = i * 64, y = j * 128, k = q(); g.fillStyle = k < .3 ? '#9aabc0' : k < .6 ? '#aebdcf' : '#8fa1b8'; g.fillRect(x + 3, y + 3, 58, 122);
      g.strokeStyle = '#4f6178'; g.lineWidth = 3; g.strokeRect(x + 3, y + 3, 58, 122);
      const kind = q(); if (kind < .14) { g.fillStyle = '#10223a'; g.fillRect(x + 12, y + 30, 40, 30); g.fillStyle = '#62d5ff'; g.fillRect(x + 16, y + 36, 24, 4); g.fillStyle = '#34d399'; g.fillRect(x + 16, y + 44, 16, 4); }
      else if (kind < .28) { g.fillStyle = '#e9dfc6'; g.fillRect(x + 10, y + 20, 44, 86); g.strokeStyle = '#a99d80'; g.strokeRect(x + 10, y + 20, 44, 86); }
      else if (kind < .38) { g.fillStyle = '#2f6fed'; g.fillRect(x + 8, y + 58, 48, 8); }
      else if (kind < .46) { g.fillStyle = '#e5484d'; g.fillRect(x + 8, y + 58, 48, 6); }
      else if (kind < .54) { g.fillStyle = '#f59e0b'; g.fillRect(x + 8, y + 20, 48, 10); g.fillStyle = '#15151c'; for (let s2 = 0; s2 < 4; s2++) g.fillRect(x + 12 + s2 * 12, y + 20, 5, 10); }
      else if (kind < .6) { g.fillStyle = '#14b8a6'; g.beginPath(); g.arc(x + 32, y + 64, 14, 0, 7); g.fill(); }
    }
  });
  wallTex.wrapS = THREE.RepeatWrapping; wallTex.repeat.set(2, 1);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(R, R, Lm, 16, 1, true), toon('#ffffff', { map: wallTex, side: THREE.BackSide }));
  tube.rotation.x = Math.PI / 2; HAB.add(tube);
  for (let z = -18; z <= 20; z += 4.5) { // ribs + ceiling light strips + handrails
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R - .05, .09, 6, 16), toon('#8a9bb0')); rib.position.z = z; HAB.add(rib); ink(rib, .02);
    const lt = box(.7, .06, 2.6, glow('#fffbe8'), 0, R - .25, z + 2.2, HAB, false);
    for (const s of [-1, 1]) { const hr = cyl(.05, .05, 2.6, '#f2c14e', s * 2.35, -1.9, z + 2.2, HAB, 8); hr.rotation.x = Math.PI / 2; }
  }
  const lights = [];
  for (let z = -16; z <= 16; z += 8) { const p = new THREE.PointLight('#ffd9a0', 5, 14, 1.4); p.position.set(0, 2.2, z); HAB.add(p); lights.push(p); }
  const amb = new THREE.HemisphereLight('#e8eeff', '#3a4660', .95); HAB.add(amb);
  const red = new THREE.PointLight('#ff2a2a', 0, 30, 1); red.position.set(0, 2.4, -4); HAB.add(red);
  HAB.userData = { lights, amb, red };
  // porthole window with Earth
  const port = new THREE.Group(); port.position.set(R - .15, .6, -8); port.rotation.y = -Math.PI / 2; HAB.add(port);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.75, .12, 10, 32), toon('#dfe6ee')); port.add(ring); ink(ring, .02);
  const earthWin = canvasTex(256, 256, (g) => { g.fillStyle = '#050a18'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#2a73cf'; g.beginPath(); g.arc(110, 330, 210, 0, 7); g.fill(); g.fillStyle = '#3fae74'; g.beginPath(); g.ellipse(80, 200, 50, 20, .3, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(60, 160, 90, 6); });
  port.add(new THREE.Mesh(new THREE.CircleGeometry(.76, 32), new THREE.MeshBasicMaterial({ map: earthWin })));
  // smoke detector on the ceiling
  const det = cyl(.42, .42, .16, '#eef1f5', 0, R - .2, -4, HAB, 24); const led = cyl(.13, .13, .06, glow('#4b5563'), 0, -.1, 0, det, 16, false); HAB.userData.led = led;
  // alarm beacon
  const bea = cyl(.22, .26, .32, glow('#ff3b3b'), -1.2, R - .45, 1, HAB, 16); HAB.userData.beacon = bea;
  // wire panel (Teo)
  const wp = box(1.6, 1.4, .1, '#17202e', -R + .45, .4, -1.6, HAB); wp.rotation.y = Math.PI / 2;
  ['#e5484d', '#ffc83d', '#62d5ff', '#34d399'].forEach((c, i) => { const w = cyl(.035, .035, 1.2, c, -.45 + i * .3, 0, .09, wp, 6, false); });
  // vent fan on the wall
  const fanG = new THREE.Group(); fanG.position.set(-R + .2, .2, -11); fanG.rotation.y = Math.PI / 2; HAB.add(fanG);
  const housing = new THREE.Mesh(new THREE.TorusGeometry(1.15, .2, 10, 32), toon('#5d6d80')); fanG.add(housing); ink(housing, .02);
  fanG.add(new THREE.Mesh(new THREE.CircleGeometry(1.12, 32), toon('#141c28')));
  const blades = new THREE.Group(); blades.position.z = .05; fanG.add(blades);
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.32, 1.0, .04), toon('#a6b4c6')); b.position.y = .52; const piv = new THREE.Group(); piv.rotation.z = i * Math.PI * 2 / 5; b.rotation.y = .5; piv.add(b); blades.add(piv); ink(b, .015); }
  cyl(.16, .16, .1, '#dfe6ee', 0, 0, .1, fanG, 16).rotation.x = Math.PI / 2;
  HAB.userData.blades = blades;
  // hatch at the far end
  const hatch = new THREE.Group(); hatch.position.set(0, 0, -19.8); HAB.add(hatch);
  hatch.add(new THREE.Mesh(new THREE.CircleGeometry(R, 32), toon('#9fb0c3')));
  const hRing = new THREE.Mesh(new THREE.TorusGeometry(1.75, .22, 10, 40), toon('#f2c14e')); hRing.position.z = .1; hatch.add(hRing); ink(hRing, .02);
  const door = cyl(1.6, 1.6, .22, '#c6d1dd', 0, 0, .18, hatch, 40); door.rotation.x = Math.PI / 2;
  const pw = new THREE.Mesh(new THREE.TorusGeometry(.42, .08, 8, 28), toon('#dfe6ee')); pw.position.set(0, .82, .32); hatch.add(pw); ink(pw, .015);
  const pglass = new THREE.Mesh(new THREE.CircleGeometry(.42, 28), new THREE.MeshBasicMaterial({ color: '#0a0d16' })); pglass.position.set(0, .82, .31); hatch.add(pglass);
  const wheel = new THREE.Group(); wheel.position.set(0, -.35, .34); hatch.add(wheel);
  const wr = new THREE.Mesh(new THREE.TorusGeometry(.6, .07, 8, 32), toon('#e5484d')); wheel.add(wr); ink(wr, .015);
  for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(1.2, .09, .07), toon('#d9e1ea')); sp.rotation.z = i * Math.PI / 3; wheel.add(sp); }
  const fireGlow = sprite(TEX.glowO, 1.9, true, 0); fireGlow.position.set(0, .82, .5); hatch.add(fireGlow);
  const fireL = new THREE.PointLight('#ff8a2a', 0, 9, 1.2); fireL.position.set(0, .8, 1.2); hatch.add(fireL);
  HAB.userData.hatch = { g: hatch, wheel, pglass, fireGlow, fireL };
  // wall crack (hiss)
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(.6, 1.2), new THREE.MeshBasicMaterial({ map: canvasTex(64, 128, (g) => { g.strokeStyle = '#05070c'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(30, 6); g.lineTo(40, 34); g.lineTo(26, 62); g.lineTo(42, 92); g.lineTo(30, 122); g.stroke(); }), transparent: true }));
  crack.position.set(R - .08, .3, -14); crack.rotation.y = -Math.PI / 2; crack.visible = false; HAB.add(crack); HAB.userData.crack = crack;
  // smoke sprites
  const sm = []; for (let i = 0; i < 40; i++) { const s = sprite(TEX.smoke, 1, false, 0); HAB.add(s); sm.push(s); } HAB.userData.smoke = sm;
}
// --- LAB (flame demo) ---
const LAB = loc('LAB', 2000);
{
  LAB.add(new THREE.Mesh(new THREE.SphereGeometry(40, 24, 16), new THREE.MeshBasicMaterial({ color: '#0a0f1e', side: THREE.BackSide })));
  LAB.add(new THREE.HemisphereLight('#c8d8ff', '#202840', 1.1)); const k = new THREE.DirectionalLight('#fff0d8', 1.6); k.position.set(3, 5, 4); LAB.add(k);
  box(4, .25, 2.4, '#6b4f36', 0, -1.2, 0, LAB);
  const candle = new THREE.Group(); LAB.add(candle);
  cyl(.22, .22, 1.2, '#f1ead8', 0, 0, 0, candle, 20); cyl(.02, .02, .2, '#222', 0, .7, 0, candle, 6, false);
  const flameO = new THREE.Mesh(new THREE.ConeGeometry(.16, .7, 16), new THREE.MeshBasicMaterial({ color: '#ffb02e' })); flameO.position.y = 1.1; candle.add(flameO);
  const flameI = new THREE.Mesh(new THREE.ConeGeometry(.08, .4, 12), new THREE.MeshBasicMaterial({ color: '#fff3c4' })); flameI.position.y = 1.0; candle.add(flameI);
  const gO = sprite(TEX.glowO, 2.2, true, .9); gO.position.y = 1.1; candle.add(gO);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.38, 32, 24), new THREE.MeshBasicMaterial({ color: '#cfefff' })); ball.position.y = 1.0; candle.add(ball);
  const gB = sprite(TEX.glowB, 3.2, true, 0); gB.position.y = 1.0; candle.add(gB);
  const lamp = new THREE.PointLight('#ffb35a', 6, 8); lamp.position.y = 1.2; candle.add(lamp);
  candle.position.y = -.5; LAB.userData = { candle, flameO, flameI, gO, ball, gB, lamp };
}
// --- HOLO table room ---
const HOLO = loc('HOLO', 3000);
{
  HOLO.add(new THREE.Mesh(new THREE.SphereGeometry(40, 24, 16), new THREE.MeshBasicMaterial({ color: '#071433', side: THREE.BackSide })));
  HOLO.add(new THREE.HemisphereLight('#9fdcff', '#0a1433', 1.2));
  cyl(4.4, 4.0, .5, '#2b3a55', 0, -2.2, 0, HOLO, 40); const top = cyl(4.2, 4.2, .06, glow('#4fd8ff', .35), 0, -1.92, 0, HOLO, 40, false);
  const grid = new THREE.GridHelper(8, 16, '#4fd8ff', '#2a7fa8'); grid.position.y = -1.88; grid.material.transparent = true; grid.material.opacity = .5; HOLO.add(grid);
  const st = stationModel(true); st.scale.setScalar(.32); st.position.set(0, 0, -.6); HOLO.add(st);
  const fireM = sprite(TEX.glowR, 1.8, true, 0); fireM.position.set(0, 0, -.6 + -.6 * .32); HOLO.add(fireM);
  const fireCore = new THREE.Mesh(new THREE.SphereGeometry(.18, 16, 12), new THREE.MeshBasicMaterial({ color: '#ff5a2a' })); fireCore.position.copy(fireM.position); fireCore.visible = false; HOLO.add(fireCore);
  const crew = []; for (let i = 0; i < 6; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' })); d.position.set(Math.cos(i) * .3, .55, -.6 + 2.2 * .32 + Math.sin(i * 1.7) * .25); HOLO.add(d); crew.push(d); }
  const route = new THREE.CatmullRomCurve3([v3(.1, .55, .1), v3(.9, .4, -.2), v3(.9, .2, -1.3), v3(.2, 0, -1.7)]);
  const routeM = new THREE.Mesh(new THREE.TubeGeometry(route, 64, .05, 8, false), new THREE.MeshBasicMaterial({ color: '#ffc83d' })); routeM.geometry.setDrawRange(0, 0); HOLO.add(routeM);
  const capBglow = sprite(TEX.glowY, 1.6, true, 0); capBglow.position.set(0, 0, -.6 + -3.35 * .32); HOLO.add(capBglow);
  // hologram fan + flame for rule 2
  const hf = new THREE.Group(); hf.position.set(-.95, -.7, 1.4); HOLO.add(hf);
  hf.add(new THREE.Mesh(new THREE.TorusGeometry(.62, .06, 8, 32), new THREE.MeshBasicMaterial({ color: '#9ff0ff' })));
  const hb = new THREE.Group(); hf.add(hb); for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.18, .52, .02), new THREE.MeshBasicMaterial({ color: '#4fd8ff', transparent: true, opacity: .7 })); b.position.y = .28; const p = new THREE.Group(); p.rotation.z = i * Math.PI * 2 / 5; p.add(b); hb.add(p); }
  const hfl = new THREE.Group(); hfl.position.set(.95, -.7, 1.4); HOLO.add(hfl);
  const hfb = new THREE.Mesh(new THREE.SphereGeometry(.3, 24, 16), new THREE.MeshBasicMaterial({ color: '#cfefff' })); hfl.add(hfb); const hfg = sprite(TEX.glowB, 2, true, 1); hfl.add(hfg);
  const arrows = []; for (let i = 0; i < 6; i++) { const a = new THREE.Mesh(new THREE.ConeGeometry(.07, .2, 8), new THREE.MeshBasicMaterial({ color: '#62d5ff', transparent: true })); a.rotation.z = -Math.PI / 2; HOLO.add(a); arrows.push(a); }
  HOLO.userData = { st, fireM, fireCore, crew, routeM, capBglow, hf, hb, hfl, hfb, hfg, arrows };
}
// --- CAPSULE interior ---
const CAPS = loc('CAPS', 4000);
{
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 3.2, 4.2, 24, 1, true), toon('#d7dee8', { side: THREE.BackSide })); CAPS.add(shell);
  CAPS.add(new THREE.Mesh(new THREE.CircleGeometry(1.6, 24), toon('#bcc7d3')).translateY(2.1).rotateX(Math.PI / 2));
  CAPS.add(new THREE.HemisphereLight('#ffffff', '#8090a8', 1.6)); const pl = new THREE.PointLight('#ffe9c4', 10, 12); pl.position.set(0, 1.5, 1.5); CAPS.add(pl);
  CAPS.add(new THREE.Mesh(new THREE.CircleGeometry(3.2, 24), toon('#5d6d80')).translateY(-2.1).rotateX(-Math.PI / 2));
  const seats = []; [[-1.05, -1.1, -.4], [0, -.9, -.9], [1.05, -1.1, -.4]].forEach(([x, y, z]) => { const s = new THREE.Group(); s.position.set(x, y, z); CAPS.add(s); box(.7, .16, .8, '#2f6fed', 0, 0, 0, s); box(.7, .9, .14, '#2f6fed', 0, .45, -.35, s); box(.74, .08, .5, '#ffc83d', 0, .12, .05, s, false); seats.push(s); });
  const win = new THREE.Mesh(new THREE.CircleGeometry(.36, 24), new THREE.MeshBasicMaterial({ color: '#2a73cf' })); win.position.set(0, .8, -1.55); CAPS.add(win);
  CAPS.userData = { seats };
}
const LOCS = Object.values(LOC);

// ---------- billboards ----------
const BB = {};
function billboard(name, w, h, cw, ch) {
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: .04, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); mesh.visible = false; scene.add(mesh);
  BB[name] = { mesh, cv, ctx: cv.getContext('2d'), tex, mat, last: '' }; return BB[name];
}
['ava', 'teo', 'c3', 'c4', 'c5', 'c6'].forEach(n => billboard(n, 1.27, 1.9, 800, 1200));
billboard('biscuit', 1, 1, 600, 600);
const imgCache = new Map();
async function rasterize(b, svg) {
  if (b.last === svg) return; b.last = svg;
  const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
  b.ctx.clearRect(0, 0, b.cv.width, b.cv.height); b.ctx.drawImage(img, 0, 0, b.cv.width, b.cv.height); b.tex.needsUpdate = true;
}

// ---------- overlay helpers ----------
const OV = document.getElementById('ov');
function project(p) { V.copy(p).project(camera); return { x: (V.x + 1) / 2 * 576, y: (1 - V.y) / 2 * 1024, behind: V.z > 1 }; }
const world = (locName, x, y, z) => v3(LOC[locName].position.x + x, y, z);

// ---------- shots ----------
// Each shot: loc, cam(c) -> {p:[x,y,z], at:[x,y,z], fov}, set(c) -> list of character placements [{id, p:[x,y,z], s, o}], fx(c), ov(c) -> svg.
const RED = '#ff4a4a', GOLD = '#ffc83d', GREEN = '#34d399', CYAN = '#62d5ff';
const P = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const habReset = (alert = 0, dim = 0) => { const u = HAB.userData; u.lights.forEach(l => l.intensity = 5 * (1 - dim * .8)); u.amb.intensity = .95 * (1 - dim * .7); u.red.intensity = 0; u.led.material.color.set('#4b5563'); u.beacon.material.color.set('#7a2020'); u.hatch.fireGlow.material.opacity = 0; u.hatch.fireL.intensity = 0; u.hatch.pglass.material.color.set("#0a0d16"); u.smoke.forEach(s => s.material.opacity = 0); u.crack.visible = false; HAB.userData.alertK = alert; };
function alarmFX(t, k) { const u = HAB.userData, f = Math.max(0, Math.sin(t * 9)); u.red.intensity = k * (5 + 11 * f); u.beacon.material.color.setRGB(1, .15 + .2 * f, .15); u.led.material.color.set(f > .3 ? '#ff3b3b' : '#7a1d1d'); }
function hatchGlow(t, k) { const u = HAB.userData.hatch, fl = .85 + .15 * Math.sin(t * 11) * Math.sin(t * 7.3); u.fireGlow.material.opacity = k * fl * .8; u.fireL.intensity = k * 5 * fl; u.pglass.material.color.setRGB(lerp(.04, 1, k), lerp(.05, .55, k), lerp(.09, .15, k)); }
function smokeFX(t, amount, cx = 0, cz = -18, spread = 6) { const r = rng(5); HAB.userData.smoke.forEach((s, i) => { const ph = r(), a = r() * 6.28, sp = .2 + r() * .4, age = (t * sp * .3 + ph) % 1, d = age * spread * amount; s.position.set(cx + Math.cos(a) * d * .5, Math.sin(a * 1.3) * d * .4, cz + d * (.6 + r())); const sc = (.8 + age * 2.6) * (.5 + amount); s.scale.set(sc, sc, 1); s.material.opacity = amount * .3 * (1 - age); }); }
const crewPos = [[-1.3, .5, 0], [0, .7, -.4], [1.3, .4, 0], [-.7, -.9, .3], [.7, -.8, .2], [0, -.2, -1.6]];
const IDS = ['ava', 'teo', 'c3', 'c4', 'c5', 'c6'];
const badge = (x, y, n, col = GOLD, s = 1) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})"><circle r="16" fill="${col}" stroke="#15151c" stroke-width="3.5"/><text y="8" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="22" fill="#15151c">${n}</text></g>`;

const SHOTS = {
  orbit: { loc: 'EXT', cam: c => ({ p: P([30, 7, 34], [17, 4, 21], eio(c.p)), at: [0, -.5, 2], fov: 38 }),
    ov: c => { const st = project(world('EXT', 0, 0, 2)), gr = project(world('EXT', 0, -35, 2)); const k = eo(c.lt / 1.2); const y1 = lerp(gr.y, st.y + 30, k);
      return `<g stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"><line x1="${st.x - 90}" y1="${gr.y}" x2="${st.x - 90}" y2="${y1}" stroke-dasharray="8 7"/><line x1="${st.x - 104}" y1="${gr.y}" x2="${st.x - 76}" y2="${gr.y}"/><line x1="${st.x - 104}" y1="${y1}" x2="${st.x - 76}" y2="${y1}"/></g><text x="${st.x - 70}" y="${y1 + 12}" font-family="Anton" font-size="34" fill="${GOLD}" stroke="#000" stroke-width="5" paint-order="stroke">${Math.round(400 * k)} KM</text>`; } },
  crew6: { loc: 'HAB', cam: c => ({ p: P([0, .2, 7.5], [0, .1, 5.6], eio(c.p)), at: [0, 0, -.3], fov: 42 }),
    set: c => IDS.map((id, i) => ({ id, p: crewPos[i], s: pop(c.lt, .05 + i * .1, .35), o: { expr: i % 3 === 1 ? 'smile' : 'neutral' } })),
    ov: c => IDS.map((id, i) => { const k = pop(c.lt, .15 + i * .1, .3); if (k <= 0) return ''; const q = project(world('HAB', crewPos[i][0] + .45, crewPos[i][1] + .95, crewPos[i][2])); return badge(q.x, q.y, i + 1, GOLD, k); }).join('') },
  capsules: { loc: 'EXT', cam: c => ({ p: P([18, 9, 16], [15, 7, 2], eio(c.p)), at: [0, 0, 2.4], fov: 40 }),
    fx: c => { const u = EXT.userData, pu = .7 + .3 * Math.sin(c.t * 7); u.hA.material.opacity = clamp(c.lt / .3) * pu; u.hB.material.opacity = clamp((c.lt - .3) / .3) * pu; },
    ov: c => ['A', 'B'].map((L, i) => { const k = pop(c.lt, i * .3); if (k <= 0) return ''; const q = project(world('EXT', 0, 1.8, i ? -3.6 : 8.4)); return badge(q.x, q.y - 10, L, GOLD, k * 1.4); }).join('') },
  alarmUnit: { loc: 'HAB', cam: c => ({ p: P([.8, -.4, -.6], [.5, .4, -2.0], eio(c.p)), at: [0, 3.0, -4], fov: 40 }), fx: c => { if (c.lt > .25) alarmFX(c.t, 1); }, focus: 2.2 },
  alone: { loc: 'EXT', cam: c => ({ p: P([22, 8, 26], [70, 30, 95], eio(c.p)), at: [0, 0, 2], fov: 38 }),
    fx: c => { EXT.userData.alert.material.opacity = .6 + .4 * Math.sin(c.t * 8); },
    ov: c => { const q = project(world('EXT', 0, 0, -.6)); return [0, 1, 2].map(i => { const a = (c.lt * .7 + i / 3) % 1; return `<circle cx="${q.x}" cy="${q.y}" r="${(10 + a * 150).toFixed(1)}" fill="none" stroke="${RED}" stroke-width="3" opacity="${(.8 * (1 - a)).toFixed(2)}"/>`; }).join(''); } },
  title: { loc: 'EXT', noCap: true, cam: c => ({ p: P([95, 40, 120], [110, 48, 140], eio(c.p)), at: [0, -5, 0], fov: 38 }), fx: c => { EXT.userData.alert.material.opacity = .6 + .4 * Math.sin(c.t * 8); },
    ov: c => { const a = pop(c.ch(0), 0, .45), b = pop(c.ch(1), 0, .4); return `<g transform="translate(288 380) scale(${(.5 + .5 * a).toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="150" fill="#fff" stroke="#15151c" stroke-width="10" paint-order="stroke" letter-spacing="4">ORBIT</text></g><g transform="translate(288 480) scale(${(.5 + .5 * a).toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="88" fill="${RED}" stroke="#15151c" stroke-width="9" paint-order="stroke" letter-spacing="3">EMERGENCY</text></g>` + (b > 0 ? `<g transform="translate(288 580) scale(${b.toFixed(3)}) rotate(-3)"><rect x="-104" y="-42" width="208" height="76" rx="12" fill="${GOLD}" stroke="#15151c" stroke-width="5"/><text y="17" text-anchor="middle" font-family="Anton" font-size="58" fill="#15151c" letter-spacing="3">PART ${EP.part}</text></g>` : ''); } },
  ava: { loc: 'HAB', cam: c => ({ p: P([.9, .9, -3.2], [.6, .8, -4.6], eio(c.p)), at: [-.2, .9, -6.8], fov: 40 }), set: c => [{ id: 'ava', p: [-.4, .1, -7], o: { expr: c.ch(1) > 0 ? 'determined' : 'neutral', look: [.4, -.1] } }], focus: 2.6 },
  teo: { loc: 'HAB', cam: c => ({ p: P([.6, .7, 1.4], [.2, .6, .2], eio(c.p)), at: [-1.9, .5, -1.6], fov: 42 }), set: c => [{ id: 'teo', p: [-1.7, -.05, -1.0], o: { expr: 'smile', arms: { r: [118, 20] }, hold: WRENCH, look: [-.5, -.1] } }], focus: 2.4 },
  biscuitFloat: { loc: 'HAB', cam: c => ({ p: P([.2, .4, -5.4], [.5, .5, -6.2], eio(c.p)), at: [2.4, .6, -8], fov: 40 }),
    set: c => { const fl = c.ch(1) > 0 ? eo(c.ch(1) / .6) : 0; return [{ id: 'biscuit', p: [lerp(1.8, 2.3, c.p), .5 + fl * .3 + Math.sin(c.t) * .1, -7.6], s: 1.1, rot: -12 + c.lt * 14 + fl * 20 }]; }, focus: 2.4 },
  alarmGo: { loc: 'HAB', cam: c => ({ p: P([0, .6, -.2], [0, .5, -1.0], eio(c.p)), at: [0, .7, -4.2], fov: 44 }), fx: c => alarmFX(c.t, clamp(c.lt / .12)),
    set: c => { const hit = c.lt > .12; return [{ id: 'ava', p: [-.75, .1, -4.4], o: { expr: hit ? 'shock' : 'neutral', look: [.6, -1], sweat: hit } }, { id: 'teo', p: [.8, -.05, -4.6], o: { expr: hit ? 'shock' : 'smile', look: [-.6, -1] } }, { id: 'biscuit', p: [-1.6, -1.1, -3.6], s: .55, rot: Math.sin(c.t) * 20 }]; }, shake: .03, focus: 3.6 },
  follow: { loc: 'HAB', cam: c => ({ p: P([0, .3, -5.5], [0, .2, -11.5], eio(c.p)), at: [0, .1, -19.8], fov: 44 }), fx: c => { alarmFX(c.t, .6); smokeFX(c.t, .6); hatchGlow(c.t, .15); },
    set: c => [{ id: 'teo', p: [lerp(.2, 0, c.p), lerp(-.2, .1, c.p), lerp(-9.5, -16, eio(c.p))], o: { back: true } }], focus: 3.5 },
  hatchGlow: { loc: 'HAB', cam: c => ({ p: P([0, .3, -11.5], [0, .6, -14.2], eio(c.p)), at: [0, .75, -19.8], fov: 40 }), fx: c => { alarmFX(c.t, .5); smokeFX(c.t, .5); hatchGlow(c.t, c.ch(1) > 0 ? lerp(.15, 1, eo(c.ch(1) / .45)) : .15); }, focus: 3 },
  rule1: { loc: 'HAB', cam: c => ({ p: P([.7, .1, -9.6], [.4, .1, -10.6], eio(c.p)), at: [0, .9, -19.8], fov: 42 }), fx: c => { alarmFX(c.t, .5); smokeFX(c.t, .5); hatchGlow(c.t, 1); HAB.userData.hatch.wheel.rotation.z = Math.sin(c.t * 2) * .04; },
    chips: [{ type: 'rule', no: 'RULE #1', l1: 'NEVER OPEN A', l2: 'BURNING HATCH.', at: 0, bodyAt: 1 }] },
  flame: { loc: 'LAB', cam: c => { const a = lerp(-.5, .5, eio(c.p)); return { p: [Math.sin(a) * 4.2, .6, Math.cos(a) * 4.2], at: [0, .3, 0], fov: 38 }; },
    fx: c => { const u = LAB.userData, m = c.ch(2) > 0 ? eio(c.ch(2) / .7) : 0, fl = 1 + .08 * Math.sin(c.t * 14); u.flameO.scale.set(1 - m, fl * (1 - m), 1 - m); u.flameI.scale.set(1 - m, fl * (1 - m), 1 - m); u.gO.material.opacity = .9 * (1 - m); u.ball.scale.setScalar(Math.max(m, .001) * (1 + .05 * Math.sin(c.t * 9))); u.gB.material.opacity = m; u.lamp.color.set(m > .5 ? '#8fd0ff' : '#ffb35a'); u.candle.position.y = -.5 + m * (.4 + Math.sin(c.t) * .08); u.candle.rotation.z = m * .25 * Math.sin(c.t * .7); },
    ov: c => { const m = c.ch(2) > 0; const k = pop(m ? c.ch(2) : c.lt, m ? .35 : .1); const col = m ? CYAN : GOLD, txt = m ? 'ORBIT · ZERO GRAVITY' : 'EARTH · GRAVITY', w = txt.length * 12 + 40; return `<g transform="translate(288 800) scale(${k.toFixed(3)})"><rect x="${-w / 2}" y="-22" width="${w}" height="44" rx="22" fill="#0b1020" stroke="${col}" stroke-width="3"/><text y="8" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="24" fill="${col}" letter-spacing="1">${txt}</text></g>`; },
    chips: [{ type: 'real', text: 'ZERO-G FLAMES FORM BLUE SPHERES', at: 4 }], focus: 4.2 },
  smokeDrift: { loc: 'HAB', cam: c => ({ p: P([1.4, 1.6, -8], [1.2, 1.4, -9.2], eio(c.p)), at: [-.3, -.2, -15], fov: 46 }),
    fx: c => { const a = lerp(.4, 1, eo(c.lt / (c.d * .8))) + (c.ch(3) > 0 ? eo(c.ch(3) / .4) * .8 : 0); smokeFX(c.t, a, 0, -18, 9); hatchGlow(c.t, .9); alarmFX(c.t, .4); },
    set: c => [{ id: 'ava', p: [-.9, 0, -13.5], o: { expr: 'worry' } }, { id: 'c3', p: [.6, -.3, -14.2], o: { expr: 'worry' } }, { id: 'c4', p: [-.1, .6, -15], o: { expr: 'shock' } }],
    chips: [{ type: 'real', text: 'NO GRAVITY = NO "UP" FOR SMOKE', at: 1 }], focus: 4.5 },
  mapFire: { loc: 'HOLO', cam: c => { const a = lerp(.8, .45, eio(c.p)); return { p: [Math.sin(a) * 6.6, 4.2, Math.cos(a) * 6.6], at: [0, -.2, -.6], fov: 40 }; },
    fx: c => { const u = HOLO.userData, k = pop(c.lt, .15); u.fireM.material.opacity = k * (.7 + .3 * Math.sin(c.t * 9)); u.fireCore.visible = k > 0; u.fireCore.scale.setScalar(Math.max(k, .01)); u.routeM.geometry.setDrawRange(0, 0); u.capBglow.material.opacity = 0; u.hf.visible = u.hfl.visible = false; u.arrows.forEach(a => a.visible = false); u.st.rotation.y = c.t * .05; },
    ov: c => { const k = pop(c.ch(1)); if (k <= 0) return ''; return `<g transform="translate(288 830) scale(${k.toFixed(3)})"><rect x="-150" y="-22" width="300" height="44" rx="22" fill="#0a1433" stroke="${RED}" stroke-width="3"/><text y="8" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="24" fill="${RED}" letter-spacing="1">FIRE: SERVICE MODULE</text></g>`; }, focus: 5.6 },
  mapRoute: { loc: 'HOLO', cam: c => { const a = lerp(.45, .2, eio(c.p)); return { p: [Math.sin(a) * 6.2, 3.8, Math.cos(a) * 6.2], at: [0, -.2, -.8], fov: 40 }; },
    fx: c => { const u = HOLO.userData; u.fireM.material.opacity = .7 + .3 * Math.sin(c.t * 9); u.fireCore.visible = true; u.fireCore.scale.setScalar(1); u.routeM.geometry.setDrawRange(0, Math.floor(eo(c.lt / .8) * 64 * 8 * 6)); u.capBglow.material.opacity = c.ch(2) > 0 ? .8 + .2 * Math.sin(c.t * 7) : 0; u.hf.visible = u.hfl.visible = false; u.arrows.forEach(a => a.visible = false); },
    ov: c => { let o = ''; if (c.ch(2) > .15) { const q = project(world('HOLO', .9, .3, -.9)), k = pop(c.ch(2), .15); o += `<g transform="translate(${q.x} ${q.y}) scale(${k.toFixed(3)})"><circle r="30" fill="#0a1433" stroke="${RED}" stroke-width="5"/><path d="M-13 -13 L13 13 M13 -13 L-13 13" stroke="${RED}" stroke-width="8" stroke-linecap="round"/></g>`; const k2 = pop(c.ch(2), .3); if (k2 > 0) o += `<g transform="translate(288 830) scale(${k2.toFixed(3)})"><rect x="-190" y="-22" width="380" height="44" rx="22" fill="#0a1433" stroke="${GOLD}" stroke-width="3"/><text y="8" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="24" fill="${GOLD}" letter-spacing="1">ROUTE TO CAPSULE B: BLOCKED</text></g>`; } return o; }, focus: 5 },
  seats: { loc: 'CAPS',
    cam: c => c.o.stage === 2 ? { p: P([0, .6, 8.5], [0, .5, 9.4], eio(c.p)), at: [0, -.3, 2], fov: 48 } : { p: P([0, .3, 3.0], [0, .2, 2.4], eio(c.p)), at: [0, -.6, -.6], fov: 48 },
    fx: c => { const t1 = c.o.stage === 2 ? 1 : c.ch(1); CAPS.userData.seats.forEach((s, i) => s.scale.setScalar(Math.max(pop(t1, i * .12, .32), .001))); },
    set: c => c.o.stage === 2 ? IDS.map((id, i) => { const bad = i >= 3 && c.ch(1) > 0, sh = bad ? Math.sin(c.ch(1) * 40) * .05 * Math.max(0, 1 - c.ch(1) / .4) : 0; return { id, p: [-2.5 + i * 1.0 + sh, -.9 + (i % 2) * .15, 3.6], s: .62 * pop(c.lt, i * .06, .3), o: { expr: bad ? 'worry' : 'neutral' } }; }) : [],
    ov: c => { if (c.o.stage !== 2 || c.ch(1) <= 0) return ''; let o = IDS.map((id, i) => { const q = project(world('CAPS', -2.5 + i * 1.0 + .28, -.9 + (i % 2) * .15 + .58, 3.6)), k = pop(c.ch(1), i * .05, .3); if (k <= 0) return ''; const bad = i >= 3; return `<g transform="translate(${q.x} ${q.y}) scale(${k.toFixed(3)})"><circle r="15" fill="${bad ? RED : GREEN}" stroke="#15151c" stroke-width="3"/>${bad ? '<path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' : '<path d="M-7 0 L-2 6 L8 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'}</g>`; }).join(''); const k = pop(c.ch(1), .2); if (k > 0) o += `<g transform="translate(288 830) scale(${k.toFixed(3)})"><rect x="-170" y="-24" width="340" height="48" rx="24" fill="#3a0b10" stroke="${RED}" stroke-width="3"/><text y="9" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="26" fill="${RED}" letter-spacing="1">3 PEOPLE WITHOUT A SEAT</text></g>`; return o; },
    chips: [{ type: 'real', text: 'A SOYUZ CAPSULE SEATS 3', at: 1, delay: .3, stage: 1 }], focus: 3 },
  reach: { loc: 'HAB', cam: c => ({ p: P([1.4, .4, -13.6], [1.0, .3, -14.6], eio(c.p)), at: [.2, -.1, -19.4], fov: 44 }), fx: c => { alarmFX(c.t, .5); smokeFX(c.t, .4); hatchGlow(c.t, 1); HAB.userData.hatch.wheel.rotation.z = c.ch(1) > 0 ? eo(c.ch(1) / .5) * .25 : 0; },
    set: c => [{ id: 'teo', p: [.75, -.35, -18.0], o: { expr: 'determined', look: [-.6, 0], arms: { l: [lerp(-108, -200, eo(c.lt / .9)), lerp(214, 70, eo(c.lt / .9))] } } }], focus: 4.6 },
  grab: { loc: 'HAB', cam: c => ({ p: P([0, .5, -13.2], [0, .45, -13.8], eio(c.p)), at: [0, 0, -18.4], fov: 44 }), fx: c => { alarmFX(c.t, .5); hatchGlow(c.t, 1); },
    set: c => { const g = c.ch(1) > 0 ? eo(c.ch(1) / .16) : 0; return [{ id: 'teo', p: [.75, -.35, -18.0], o: { expr: g ? 'shock' : 'determined', arms: { l: [-200, 70] } } }, { id: 'ava', p: [lerp(-2.6, -.85, eo(c.lt / .5)), -.2, -17.6], o: { expr: 'determined', arms: { r: [lerp(108, 230, g), lerp(214, 90, g)] } } }]; },
    ov: c => { const b = c.ch(1); if (b <= 0 || b > .35) return ''; const q = project(world('HAB', -.05, .35, -17.8)); let o = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283, r0 = 40 + b * 300, r1 = r0 + 50 * (1 - b / .35); o += `<line x1="${(q.x + Math.cos(a) * r0).toFixed(1)}" y1="${(q.y + Math.sin(a) * r0).toFixed(1)}" x2="${(q.x + Math.cos(a) * r1).toFixed(1)}" y2="${(q.y + Math.sin(a) * r1).toFixed(1)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${(1 - b / .35).toFixed(2)}"/>`; } return o; }, hitAt: 1, flashAt: 1, focus: 3 },
  avaNo: { loc: 'HAB', cam: c => ({ p: P([.1, .9, -13.8], [.05, .9, -14.4], eio(c.p)), at: [-.2, .9, -17.6], fov: 36 }), fx: c => { alarmFX(c.t, .8); hatchGlow(c.t, .6); },
    set: c => { const a = c.ch(0), b = c.ch(1), talk = (a > 0 && a < .34) ? Math.sin(a / .34 * Math.PI) : (b > 0 && b < .85 ? .35 + .65 * Math.abs(Math.sin(b * 13)) : 0); return [{ id: 'ava', p: [-.2, .05, -17.4], o: { expr: 'determined', talk, look: [-.4, 0] } }]; }, focus: 3.2 },
  rule2: { loc: 'HOLO', cam: c => ({ p: P([0, 1.0, 5.2], [0, .8, 4.4], eio(c.p)), at: [0, -.9, 1.4], fov: 40 }),
    fx: c => { const u = HOLO.userData, t1 = c.ch(1), t2 = c.ch(2), T = .7; u.hf.visible = u.hfl.visible = true; const spin = t1 > 0 ? (c.lt - t1) + (t1 < T ? t1 - t1 * t1 / (2 * T) : T / 2) : c.lt; u.hb.rotation.z = -spin * 11; const sz = t2 > 0 ? lerp(1, .2, eo(t2 / .8)) : 1; u.hfl.scale.setScalar(sz); const air = t1 > 0 ? 1 - clamp(t1 / .5) : 1; u.arrows.forEach((a, i) => { const q = (c.t * 1.2 + i / 6) % 1; a.visible = true; a.position.set(-.45 + q * .95, -.7 + (i % 3 - 1) * .22, 1.4); a.material.opacity = air * Math.sin(q * Math.PI); }); u.st.visible = false; u.fireM.material.opacity = 0; u.fireCore.visible = false; u.routeM.geometry.setDrawRange(0, 0); u.capBglow.material.opacity = 0; u.crew.forEach(d => d.visible = false); },
    ov: c => { const t1 = c.ch(1); if (t1 <= 0) return ''; const q = project(world('HOLO', -.95, -.7, 1.4)), k = pop(t1); return `<g transform="translate(${q.x} ${q.y}) scale(${k.toFixed(3)})"><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="${RED}" stroke-width="12" stroke-linecap="round"/></g>`; },
    chips: [{ type: 'rule', no: 'RULE #2', l1: 'STOP THE AIR.', l2: 'STARVE THE FIRE.', at: 0, bodyAt: 1 }], focus: 4.6 },
  fanDown: { loc: 'HAB', cam: c => ({ p: P([1.4, .3, -7.2], [1.0, .25, -8.0], eio(c.p)), at: [-3.2, .2, -11], fov: 42 }),
    fx: c => { const T = c.d * .9, lt = Math.min(c.lt, T); HAB.userData.blades.rotation.z = -18 * (lt - lt * lt / (2 * T)); alarmFX(c.t, .35); },
    set: c => [{ id: 'biscuit', p: [lerp(-1.6, -1.2, eo(c.p)), -.9, -10], s: .7, rot: 10 + 30 * eo(c.p) }],
    chips: [{ type: 'real', text: 'ISS CREWS CUT VENTILATION IN A FIRE', at: 0, delay: .2 }], focus: 3.4 },
  silence: { loc: 'HAB', dim: .75, cam: c => c.o.near ? { p: P([0, .6, -10.6], [0, .6, -11.4], eio(c.p)), at: [0, .55, -14.2], fov: 38 } : { p: P([.2, .8, -9], [.1, .7, -9.6], eio(c.p)), at: [0, .4, -14.2], fov: 44 },
    set: c => { const lk = c.o.near && c.lt > .25 ? [1, -.1] : [0, -.3]; return [{ id: 'ava', p: [-.75, .05, -14.2], o: { expr: 'worry', look: lk } }, { id: 'teo', p: [.75, -.1, -14.4], o: { expr: c.o.near ? 'shock' : 'worry', look: lk, sweat: c.o.near } }].concat(c.o.near ? [] : [{ id: 'biscuit', p: [-1.6, -1.0, -13.4], s: .55, rot: 24, still: true }]); }, tint: .35, focus: 4.4 },
  hiss: { loc: 'HAB', dim: .6, cam: c => ({ p: P([.4, .3, -11.6], [1.1, .3, -12.6], eio(c.p)), at: [3.1, .3, -14], fov: 42 }), fx: c => { HAB.userData.crack.visible = true; }, shake: .02,
    ov: c => { const q = project(world('HAB', 3.05, .3, -14)), r = rng(5), k = eo(c.lt / .2); let o = ''; for (let i = 0; i < 26; i++) { const a = ((c.t * (2.5 + r() * 2) + r()) % 1), y0 = q.y - 90 + r() * 180, ang = (r() - .5) * .9, len = 50 + r() * 100, d0 = a * 300 * k; o += `<line x1="${(q.x - Math.cos(ang) * d0).toFixed(1)}" y1="${(y0 + Math.sin(ang) * d0).toFixed(1)}" x2="${(q.x - Math.cos(ang) * (d0 + len)).toFixed(1)}" y2="${(y0 + Math.sin(ang) * (d0 + len)).toFixed(1)}" stroke="#fff" stroke-width="${(2 + r() * 4).toFixed(1)}" stroke-linecap="round" opacity="${((1 - a) * .85).toFixed(2)}"/>`; } const v = Math.max(101.3 - c.lt * 1.4, 97); return o + `<g opacity="${k}"><rect x="146" y="150" width="284" height="132" rx="16" fill="#0b1020" stroke="${RED}" stroke-width="4"/><text x="288" y="186" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="22" fill="#9aa5b8" letter-spacing="2">CABIN PRESSURE</text><text x="288" y="256" text-anchor="middle" font-family="Anton" font-size="62" fill="${Math.sin(c.t * 12) > 0 ? RED : '#fff'}">${v.toFixed(1)} kPa</text></g>`; }, focus: 3 },
  card: { loc: 'EXT', cam: c => ({ p: P([40, 12, 60], [46, 16, 70], eio(c.p)), at: [0, -8, 0], fov: 40 }), noCap: true,
    ov: c => { const e = c.o.card, a = pop(c.lt, .05), b = pop(c.lt, .3), q = pop(c.ch(0), 0), fo = pop(c.ch(1), 0); return `<rect width="576" height="1024" fill="#070b14" opacity=".55"/><text x="288" y="226" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="26" fill="#cbd5e1" letter-spacing="4">${e.series}</text><g transform="translate(288 360) scale(${a.toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="140" fill="#fff" stroke="#15151c" stroke-width="10" paint-order="stroke" letter-spacing="4">PART ${e.next}</text></g><rect x="${(288 - 120 * b).toFixed(1)}" y="392" width="${(240 * b).toFixed(1)}" height="6" fill="${RED}"/><g transform="translate(288 462) scale(${b.toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="52" fill="${CYAN}" stroke="#15151c" stroke-width="6" paint-order="stroke" letter-spacing="3">${e.title}</text></g>` + (q > 0 ? `<g transform="translate(288 590) scale(${q.toFixed(3)})"><text text-anchor="middle" font-family="Nunito" font-weight="900" font-size="46" fill="#fff" stroke="#15151c" stroke-width="8" paint-order="stroke"><tspan x="0">${e.q1}</tspan><tspan x="0" dy="56">${e.q2}</tspan></text></g>` : '') + (fo > 0 ? `<g transform="translate(288 760) scale(${fo.toFixed(3)})"><rect x="-160" y="-30" width="320" height="56" rx="28" fill="${GOLD}" stroke="#15151c" stroke-width="4"/><text y="10" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="28" fill="#15151c">${e.follow}</text></g>` : ''); } },
};

// ---------- overlay pieces ----------
function chipSVG(ch, c) {
  const lt = c.ch(ch.at || 0) - (ch.delay || 0); if (lt <= 0 || (ch.stage && ch.stage !== c.o.stage)) return '';
  if (ch.type === 'tag') { const w = Math.max(ch.name.length * 22, ch.sub.length * 10.5) + 48, k = pop(lt, 0, .4); return `<g transform="translate(${lerp(-w, 30, Math.min(k, 1.05)).toFixed(1)} 150) rotate(-2)"><rect width="${w}" height="78" rx="8" fill="#f6f3ea" stroke="#15151c" stroke-width="4"/><rect x="2" y="2" width="11" height="74" rx="3" fill="${ch.color || RED}"/><text x="26" y="41" font-family="Anton" font-size="36" fill="#17171f" letter-spacing="1">${ch.name}</text><text x="26" y="64" font-family="BarlowC" font-weight="800" font-size="17" fill="#6d6a60" letter-spacing="1.5">${ch.sub}</text></g>`; }
  if (ch.type === 'real') { const w = ch.text.length * 10.2 + 92, k = pop(lt, 0, .4), y = lerp(-50, ch.y || 118, Math.min(k, 1.06)); return `<g transform="translate(288 ${y.toFixed(1)})"><rect x="${-w / 2}" y="-22" width="${w}" height="44" rx="22" fill="#eafaf1" stroke="${GREEN}" stroke-width="3"/><rect x="${-w / 2 + 7}" y="-15" width="62" height="30" rx="15" fill="${GREEN}"/><text x="${-w / 2 + 38}" y="7" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="19" fill="#05331f" letter-spacing="1">REAL</text><text x="${-w / 2 + 80}" y="7.5" font-family="BarlowC" font-weight="700" font-size="21" fill="#0b3d2a" letter-spacing=".3">${ch.text}</text></g>`; }
  if (ch.type === 'rule') { const k = clamp(lt / .16), sc = lerp(1.7, 1, eo(k)), sh = lt < .3 ? Math.sin(lt * 90) * 3 * (1 - lt / .3) : 0, body = c.ch(ch.bodyAt ?? ch.at ?? 0); let o = `<g transform="translate(${(288 + sh).toFixed(1)} 200) rotate(${lerp(-9, -2, eo(k)).toFixed(2)}) scale(${sc.toFixed(3)})" opacity="${clamp(lt / .08)}"><rect x="-236" y="-70" width="472" height="140" rx="10" fill="#f6f3ea" stroke="#15151c" stroke-width="5"/><rect x="-233" y="-67" width="466" height="32" rx="6" fill="#c1121f"/><text x="0" y="-44" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="22" fill="#fff" letter-spacing="3">${ch.no}</text>`; if (body > 0) o += `<g opacity="${clamp(body / .12)}"><text x="0" y="8" text-anchor="middle" font-family="Anton" font-size="40" fill="#17171f" letter-spacing="1">${ch.l1}</text><text x="0" y="54" text-anchor="middle" font-family="Anton" font-size="40" fill="#c1121f" letter-spacing="1">${ch.l2}</text></g>`; return o + '</g>'; }
  return '';
}
function captionSVG(t) {
  const G = EP.capGroups; let g = null;
  for (const x of G) { if (t >= x.t0 && t < x.t1) { g = x; break; } }
  if (!g) return '';
  const since = t - g.t0, s = .8 + .2 * spring(since / .2 * .9), txt = g.text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<g transform="translate(288 700) scale(${s.toFixed(3)})"><text text-anchor="middle" font-family="Nunito" font-weight="900" font-size="44" fill="#fff" stroke="#15151c" stroke-width="9" stroke-linejoin="round" paint-order="stroke" style="paint-order:stroke">${txt}</text></g>`;
}

// sentence captions in a small italic serif (EP.capStyle === 'serif'): one line per spoken chunk
const esc = x => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function serifCap(t) {
  const all = []; EP.shots.forEach(s => { if (!SHOTS[s.scene].noCap) s.chunks.forEach(k => all.push(k)); });
  let k = null, nx = null; for (let i = 0; i < all.length; i++) if (t >= all[i].t0 - .05) { k = all[i]; nx = all[i + 1]; }
  if (!k) return ''; const end = Math.min(nx ? nx.t0 - .05 : 1e9, (k.te ?? k.t1 ?? k.t0 + 2) + .9); if (t > end) return '';
  const a = clamp((t - k.t0 + .05) / .22) * clamp((end - t) / .18), txt = esc(k.cap ?? k.say).replace(/\s*\/\s*/g, ' ');
  const lines = []; let cur = ''; txt.split(' ').forEach(wd => { if ((cur + ' ' + wd).trim().length > 34) { lines.push(cur.trim()); cur = wd; } else cur += ' ' + wd; }); if (cur.trim()) lines.push(cur.trim());
  const y0 = 690 - (lines.length - 1) * 15;
  return `<g opacity="${a.toFixed(3)}" transform="translate(0 ${(6 * (1 - eo(clamp((t - k.t0) / .3)))).toFixed(1)})">` + lines.map((l, i) => `<text x="288" y="${y0 + i * 30}" text-anchor="middle" font-family="EBG" font-style="italic" font-weight="500" font-size="25" fill="#fff" style="filter:drop-shadow(0 0 2px rgba(0,0,0,.9)) drop-shadow(0 1px 6px rgba(0,0,0,.6))">${l}</text>`).join('') + '</g>';
}

// kinetic headline (explainer style): kicker label + word-by-word reveal, upcoming words faded, keywords coloured
function kineticCap(t) {
  const all = []; EP.shots.forEach(s => s.chunks.forEach(k => all.push(k)));
  let k = null, nx = null; for (let i = 0; i < all.length; i++) if (t >= all[i].t0 - .08) { k = all[i]; nx = all[i + 1]; } if (!k) return '';
  const words = EP.words.filter(w => w.start >= k.t0 - .02 && w.start < (k.te ?? k.t0 + 3) - .01), disp = k.say.split(/\s+/);
  const hi = new Set((k.hi || []).map(x => x.toLowerCase())), out = clamp(((nx ? nx.t0 : 1e9) - t) / .08);
  const M = kineticCap.m || (kineticCap.m = document.createElement('canvas').getContext('2d')); M.font = '800 40px Inter'; M.letterSpacing = '-0.6px'; const ww = w => M.measureText(w.toUpperCase()).width + 11;
  const lines = []; let cur = [], cw = 0; disp.forEach((w, i) => { const wd = ww(w); if (cw + wd > 540 && cur.length) { lines.push(cur); cur = []; cw = 0; } cur.push(i); cw += wd; }); if (cur.length) lines.push(cur);
  let o = `<rect width="576" height="300" fill="url(#kgrad)"/><defs><linearGradient id="kgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d" stop-opacity=".78"/><stop offset="1" stop-color="#05070d" stop-opacity="0"/></linearGradient></defs>`;
  o += `<rect x="18" y="38" width="6" height="6" fill="#ff3a3a"/><text x="30" y="44.5" font-family="Inter" font-weight="800" font-size="9.5" fill="#ffffff" fill-opacity=".85" letter-spacing="2.4">${esc(k.kicker || '')}</text>`;
  lines.forEach((ln, li) => { let x = 18; const y = 92 + li * 44; ln.forEach(i => { const w = disp[i], wt = words[i] ? words[i].start : k.t0 + i * .3, on = t >= wt - .02, a = on ? 1 : .32, pk = on ? 1 + .06 * Math.exp(-(t - wt) * 18) : 1;
      const key = hi.has(w.toLowerCase()), col = on && key ? (k.col || '#ff3a3a') : '#ffffff', glow = key && on ? `filter:drop-shadow(0 0 8px ${k.col || '#ff3a3a'}88)` : '';
      const txt = esc(w.toUpperCase()), wpx = ww(w);
      o += `<text x="${x.toFixed(1)}" y="${y}" font-family="Inter" font-weight="800" font-size="40" fill="${col}" fill-opacity="${(a * out).toFixed(2)}" transform="translate(${((x) * (1 - pk)).toFixed(1)} ${((y) * (1 - pk)).toFixed(1)}) scale(${pk.toFixed(3)})" style="${glow}" letter-spacing="-.6">${txt}</text>`; x += wpx; }); });
  return o;
}

// TikTok-style centred pop captions (EP.capStyle === 'pop'): 1-2 words at a time at EP.capY, keywords coloured
function popCap(t) {
  const G = EP.capGroups || []; const g = G.find(x => t >= x.t0 && t < x.t1); if (!g) return '';
  const all = []; EP.shots.forEach(s => s.chunks.forEach(k => all.push(k))); let k = null; for (const c of all) if (g.t0 + .06 >= c.t0) k = c;
  const bare = w => w.toLowerCase().replace(/[^a-z0-9']/g, ''), hi = new Set(((k && k.hi) || []).map(bare)), key = g.text.split(/\s+/).some(w => hi.has(bare(w)));
  const M = popCap.m || (popCap.m = document.createElement('canvas').getContext('2d')); M.font = '900 60px Nunito'; const txt = g.text.toUpperCase().replace(/[,.]$/, ''), w = M.measureText(txt).width, fit = Math.min(1, 500 / w);
  const since = t - g.t0, sc = fit * (.82 + .18 * spring(since / .16 * .9)), y = EP.capY || 640, col = key ? (k.col || '#b8ec3c') : '#ffffff';
  return `<g transform="translate(288 ${y}) scale(${sc.toFixed(3)})" style="filter:drop-shadow(0 4px 10px rgba(0,0,0,.55))"><text text-anchor="middle" font-family="Nunito" font-weight="900" font-size="60" fill="${col}" stroke="#000" stroke-width="11" stroke-linejoin="round" paint-order="stroke" style="paint-order:stroke">${esc(txt)}</text></g>`;
}
// ---------- frame ----------
let EP = null; const RESETS = [], GLOBAL_OV = [];
window.__load = async (ep) => {
  EP = ep;
  await Promise.all(['900 20px Nunito', '20px Anton', '800 20px BarlowC', '700 20px BarlowC', 'italic 400 20px EBG', '400 20px EBG', 'italic 500 20px EBG', '500 20px EBG', '800 20px Inter', '600 20px Inter'].map(f => document.fonts.load(f)));
  // caption groups: one or two words at a time, function words glued to the next word
  const glue = new Set(['a', 'an', 'the', 'to', 'in', 'on', 'of', 'and', 'is', 'it', 'his', 'her', 'for', 'at', 'there', 'are', 'has', 'into', 'nobody', 'right', 'part', 'kill', 'rule', 'this', 'one', 'two', 'six', 'three', 'stop', 'follow', 'would', 'you']);
  const w = ep.words, G = [];
  for (let i = 0; i < w.length; i++) {
    let text = w[i].text, t0 = w[i].start, end = w[i].end, j = i;
    const bare = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
    while (j + 1 < w.length && glue.has(bare(w[j].text)) && !/[.,?!…]$/.test(w[j].text) && w[j + 1].start - w[j].end < .25 && (text + ' ' + w[j + 1].text).length <= 14) { j++; text += ' ' + w[j].text; end = w[j].end; }
    G.push({ text: text.replace(/[…]/g, '').replace(/\.\.\.$/, ''), t0: t0 - .03, end }); i = j;
  }
  G.forEach((g, i) => { const nx = i + 1 < G.length ? G[i + 1].t0 : g.end + .6; g.t1 = Math.min(nx, g.end + .55); });
  ep.capGroups = G;
  return ep.total;
};
function camAt(s, t) {
  const sh = SHOTS[s.scene], lt = t - s.t0, d = s.t1 - s.t0, p = clamp(lt / d), ch = k => k < s.chunks.length ? t - s.chunks[k].t0 : -1, che = k => k < s.chunks.length ? t - (s.chunks[k].te ?? s.chunks[k].t0) : -1;
  return sh.cam({ t, lt, d, p, ch, che, o: s });
}
window.__render = async (t) => {
  let i = EP.shots.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = t < EP.shots[0].t0 ? 0 : EP.shots.length - 1;
  const s = EP.shots[i], sh = SHOTS[s.scene], lt = t - s.t0, d = s.t1 - s.t0, p = clamp(lt / d);
  const ch = k => k < s.chunks.length ? t - s.chunks[k].t0 : -1, che = k => k < s.chunks.length ? t - (s.chunks[k].te ?? s.chunks[k].t0) : -1, c = { t, lt, d, p, ch, che, o: s, i };
  Object.values(LOC).forEach(g => g.visible = g.name === sh.loc);
  // reset per-shot state
  habReset(0, sh.dim || 0); EXT.userData.hA.material.opacity = EXT.userData.hB.material.opacity = 0; EXT.userData.alert.material.opacity = 0;
  CAPS.userData.seats.forEach(x => x.scale.setScalar(1)); const hu = HOLO.userData; hu.st.visible = true; hu.crew.forEach(x => x.visible = true);
  RESETS.forEach(f => f(c, sh));
  if (sh.fx) sh.fx(c);
  // camera, with a short blend from the previous shot when both happen in the same place (continuous camera)
  let cm = sh.cam(c);
  const prev = EP.shots[i - 1];
  const nxS = EP.shots[i + 1], whipIn = (s.trans || EP.trans) === 'whip' && i > 0, whipOut = nxS && (nxS.trans || EP.trans) === 'whip';
  const softIn = (s.trans || EP.trans) === 'soft' && prev && SHOTS[prev.scene].loc !== sh.loc, softOut = nxS && (nxS.trans || EP.trans) === 'soft' && SHOTS[nxS.scene].loc !== sh.loc;
  if (prev && SHOTS[prev.scene].loc === sh.loc && !s.cut && !whipIn) { const pc = camAt(prev, s.t0 - 1e-3), k = eio(lt / (EP.blend || .45)); cm = { p: P(pc.p, cm.p, k), at: P(pc.at, cm.at, k), fov: lerp(pc.fov, cm.fov, k), roll: lerp(pc.roll || 0, cm.roll || 0, k) }; }
  const L = LOC[sh.loc].position;
  const hitT = sh.hitAt != null ? (sh.hitEnd ? che(sh.hitAt) : ch(sh.hitAt)) : lt;
  const amp = (sh.shake || 0) + (sh.kick ? sh.kick(c) : 0) + ((sh.hit ?? (s.scene === 'alarmGo' || s.scene === 'grab' || s.scene === 'hiss' ? .06 : 0)) * (hitT >= 0 ? Math.exp(-hitT * 6) : 0));
  const dr = sh.drift ?? (sh.loc === 'EXT' ? .25 : .035);   // slow handheld drift so the camera is never perfectly still
  camera.position.set(L.x + cm.p[0] + Math.sin(t * 61) * amp + Math.sin(t * .7) * dr, cm.p[1] + Math.cos(t * 53) * amp + Math.cos(t * .53) * dr * .7, cm.p[2] + Math.sin(t * .41) * dr);
  camera.fov = cm.fov; camera.updateProjectionMatrix(); camera.lookAt(L.x + cm.at[0], cm.at[1], cm.at[2]); if (cm.roll) camera.rotateZ(cm.roll);
  const wIn = whipIn ? 1 - eo(clamp(lt / .26)) : 0, wOut = whipOut ? eio(clamp((.2 - (s.t1 - t)) / .2)) : 0, wDir = (i % 2 ? 1 : -1);
  if (wIn > 0 || wOut > 0) camera.rotateY(wDir * (wIn * .9 - wOut * .9));
  const sIn = softIn ? 1 - eo(clamp(lt / .35)) : 0, sOut = softOut ? eio(clamp((.3 - (s.t1 - t)) / .3)) : 0, sB = Math.max(sIn, sOut);
  const wBlur = Math.max(wIn, wOut, sB); document.getElementById('gl').style.filter = `blur(${(wBlur * 9).toFixed(1)}px) saturate(${EP.sat ?? 1.14}) contrast(${EP.con ?? 1.07}) brightness(${(1 + sB * .5).toFixed(3)})`;
  // characters
  Object.values(BB).forEach(b => b.mesh.visible = false);
  const placed = sh.set ? sh.set(c) : [];
  await Promise.all(placed.map(async q => {
    const b = BB[q.id]; if (!b || (q.s !== undefined && q.s <= 0.001)) return;
    const tt = q.still ? 2 : t;
    await rasterize(b, q.id === 'biscuit' ? biscuitSVG({ t: tt, spin: q.still ? 0 : 1 }) : charSVG(q.id, { t, seed: IDS.indexOf(q.id) * 1.7, ...(q.o || {}) }));
    const bob = q.still ? 0 : Math.sin(t * .8 + IDS.indexOf(q.id)) * .05;
    b.mesh.position.set(L.x + q.p[0], q.p[1] + bob, q.p[2]);
    b.mesh.quaternion.copy(camera.quaternion);
    if (q.rot) b.mesh.rotateZ(q.rot * Math.PI / 180);
    const sc = q.s ?? 1; b.mesh.scale.set((q.flip ? -sc : sc) * (q.sx ?? 1), sc * (q.sy ?? 1), sc);
    const tint = sh.tint ? 1 - sh.tint : 1, red = sh.loc === 'HAB' && HAB.userData.red.intensity > 0 ? .18 * Math.min(1, HAB.userData.red.intensity / 16) : 0;
    if (q.tint) b.mat.color.setRGB(q.tint[0], q.tint[1], q.tint[2]); else b.mat.color.setRGB(tint, tint * (1 - red), tint * (1 - red) * (sh.tint ? 1.15 : 1));
    b.mesh.visible = true;
  }));
  // depth of field: focus on the shot's subject distance
  const focus = sh.focus ?? camera.position.distanceTo(new THREE.Vector3(L.x + cm.at[0], cm.at[1], cm.at[2]));
  bokeh.uniforms.focus.value = focus; bokeh.uniforms.aperture.value = sh.loc === 'EXT' ? .0002 : (sh.aperture ?? .0011);
  composer.render();
  // overlay
  let o = '';
  if (sh.ov) o += sh.ov(c);
  (sh.chips || []).forEach(x => o += chipSVG(x, c));
  GLOBAL_OV.forEach(f => o += f(t, c, sh));
  if (!sh.noCap && !s.noCap) o += EP.capStyle === 'serif' ? serifCap(t) : EP.capStyle === 'kinetic' ? kineticCap(t) : EP.capStyle === 'pop' ? popCap(t) : captionSVG(t);
  const fT = sh.flashAt != null ? (sh.flashEnd ? che(sh.flashAt) : ch(sh.flashAt)) : (sh.flash || ['alarmGo', 'title', 'mapFire', 'hiss'].includes(s.scene) ? lt : -1);
  if (fT >= 0 && fT < .12) o += `<rect width="576" height="1024" fill="#fff" opacity="${(.55 * (1 - fT / .12)).toFixed(2)}"/>`;
  // iris transition into a new location, and out of it before the next one
  const nx = EP.shots[i + 1], newLoc = !prev || SHOTS[prev.scene].loc !== sh.loc, leaving = nx && SHOTS[nx.scene].loc !== sh.loc;
  let ir = 1; if (newLoc && i > 0) ir = Math.min(ir, eo(lt / .32)); if (leaving) ir = Math.min(ir, eo((s.t1 - t) / .2));
  if (whipIn || whipOut || EP.trans === 'soft') ir = 1;
  if (Math.max(wIn, wOut) > .05) { const r9 = rng(Math.floor(t * 60)), k = Math.max(wIn, wOut); for (let j = 0; j < 26; j++) { const y = r9() * 1024, x = r9() * 576, L2 = 120 + r9() * 360; o += `<line x1="${(x - L2 / 2).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + L2 / 2).toFixed(0)}" y2="${y.toFixed(0)}" stroke="#fff" stroke-width="${(1 + r9() * 3).toFixed(1)}" opacity="${(k * .45).toFixed(2)}"/>`; } }
  if (ir < 1) { const R = 30 + ir * 640; o += `<path d="M0 0 H576 V1024 H0 Z M288 ${512 - R} a${R} ${R} 0 1 0 0.01 0 Z" fill="#05070c" fill-rule="evenodd"/>`; }
  OV.innerHTML = `<rect width="576" height="1024" fill="url(#vig)"/>` + o + (sh.post ? sh.post(c) : '') + (EP.grain ? `<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="${Math.floor(t * 30) % 97}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter><rect width="576" height="1024" filter="url(#gr)" opacity="${EP.grain}" style="mix-blend-mode:overlay"/>` : '');
  return i;
};
window.ENG = { billboard, rasterize, composer, bokeh, bloom, renderer, THREE, scene, camera, LOC, loc, SHOTS, RESETS, GLOBAL_OV, toon, glow, ink, M, box, cyl, canvasTex, TEX, sprite, radial, project, world, P, lerp, clamp, eio, eo, pop, spring, rng, v3, alarmFX, hatchGlow, smokeFX, HAB, EXT, HOLO, LAB, CAPS, IDS, BB, badge, RED, GOLD, GREEN, CYAN, ep: () => EP };
