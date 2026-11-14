// "What if you climbed a ladder to space?" The climber stays at the origin; the world moves by altitude.
// Sky + Earth are one analytic shader (ray vs. a 6,371 km sphere), so the horizon curves correctly from
// the ground to orbit. Landmarks (Burj Khalifa, Everest, an airliner, Baumgartner's balloon, the ISS, the Moon)
// sit at their real altitudes. HUD: altitude, day/clock at 500 m per hour for 8 hours a day, air and temperature.
while (!window.__planets || !window.ENG || !window.ENG.VOX) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, scene, camera, renderer, bloom, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng } = E;
const { vox, pose, put, std, blk, BOX } = E.VOX;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1), ORANGE = '#ff9a3c', CY = '#8ff3ff';
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const isMine = () => { const e = E.ep(); return !!(e && e.series && e.series.startsWith('LADDER')); };
const LD = loc('LAD', 80000);

// ---------- analytic sky + planet ----------
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, depthTest: false,
  uniforms: { h: { value: 0 }, sunDir: { value: V(.5, .35, -1).normalize() }, time: { value: 0 } },
  vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform float h, time; uniform vec3 sunDir; varying vec3 vP;
    float hash(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f); return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y), mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z); }
    float fbm(vec3 p){ float v = 0., a = .5; for (int i = 0; i < 3; i++){ v += a * noise(p); p = p * 2.02 + 3.1; a *= .5; } return v; }
    void main(){
      const float R = 6371000.0; vec3 d = normalize(vP); vec3 c = vec3(0., R + h, 0.);
      float air = exp(-h / 8000.0), fade = pow(air, .35);
      vec3 skyTop = mix(vec3(.0, .0, .01), vec3(.16, .42, .86), fade), skyHor = mix(vec3(.02, .04, .1), vec3(.72, .86, 1.0), fade);
      float horizonEl = -acos(clamp(R / (R + h), 0., 1.)), el = asin(clamp(d.y, -1., 1.));
      float b = dot(c, d), cc = dot(c, c) - R * R, disc = b * b - cc; vec3 col;
      if (disc > 0. && -b - sqrt(disc) > 0.) {
        float t = -b - sqrt(disc); vec3 n = normalize(c + d * t);
        float land = fbm(n * 7.0 + 1.3), cl = fbm(n * 26.0 + vec3(time * .002, 0., 0.)), detail = noise(n * 900.0);
        vec3 g = land > .53 ? mix(vec3(.25, .42, .2), vec3(.55, .48, .32), smoothstep(.55, .7, land)) : vec3(.06, .22, .45);
        g *= .85 + .3 * detail; g = mix(g, vec3(.95), smoothstep(.55, .72, cl) * .9);
        float lit = clamp(dot(n, normalize(sunDir)) * 1.2 + .25, .05, 1.); g *= lit;
        float hz = 1. - exp(-t / mix(40000., 400000., 1. - fade)); col = mix(g, skyHor * lit, clamp(hz, 0., 1.) * mix(.95, .55, 1. - fade));
      } else {
        float above = max(el - horizonEl, 0.); col = mix(skyHor, skyTop, clamp(pow(above * 2.2, .55), 0., 1.));
        float limb = exp(-above * mix(6., 60., 1. - fade)) * (1. - fade); col += vec3(.25, .55, 1.0) * limb * 1.2;
      }
      float sd = max(dot(d, normalize(sunDir)), 0.); col += vec3(1., .96, .88) * (pow(sd, 900.) * 3. + pow(sd, 40.) * .25 * fade + pow(sd, 8.) * .1 * fade);
      gl_FragColor = vec4(col, 1.); }` });
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(9000, 64, 32), skyMat); skyDome.renderOrder = -3; LD.add(skyDome);
const stars = (() => { const r = rng(12), a = []; for (let i = 0; i < 3000; i++) { const u = r() * 2 - 1, an = r() * TAU, R = 8500; a.push(R * Math.sqrt(1 - u * u) * Math.cos(an), R * u, R * Math.sqrt(1 - u * u) * Math.sin(an)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, depthTest: false })); m.renderOrder = -2; return m; })(); LD.add(stars);
const moon = sprite(canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(100, 100, 10, 128, 128, 120); gr.addColorStop(0, '#f4f2ea'); gr.addColorStop(.85, '#b8b4aa'); gr.addColorStop(1, 'rgba(160,156,148,0)'); g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 120, 0, TAU); g.fill(); const r = rng(3); for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(110,108,100,.35)'; g.beginPath(); g.arc(50 + r() * 160, 50 + r() * 160, 6 + r() * 20, 0, TAU); g.fill(); } }), 400, false, 1); moon.material.depthTest = false; moon.renderOrder = -2; moon.position.set(-2600, 5200, -6000); LD.add(moon);

// ---------- foreground (meters; climber at the origin, world shifted by altitude) ----------
const FG = new THREE.Group(); LD.add(FG);
const sunL = new THREE.DirectionalLight('#fff4e0', 2.6); sunL.position.set(40, 30, 30); LD.add(sunL); const hemi = new THREE.HemisphereLight('#cfe6ff', '#4a5a3a', 1.0); LD.add(hemi);
// ladder: two rails and instanced rungs near the climber
const railM = std('#c9ced6', { metalness: .6, roughness: .35 });
const rails = [-1, 1].map(s => { const m = new THREE.Mesh(BOX, railM); m.scale.set(.06, 1, .06); m.position.x = s * .3; LD.add(m); return m; });
const RUNGS = 160, rungs = new THREE.InstancedMesh(BOX, railM, RUNGS); rungs.frustumCulled = false; LD.add(rungs);
// ground + city around the ladder base (only near the ground)
const GROUND = new THREE.Group(); FG.add(GROUND);
// city ground: road grid, blocks, parks and a river (2048px, tiled)
const cityT = canvasTex(2048, 2048, (g, w, h) => { g.fillStyle = '#3c3f44'; g.fillRect(0, 0, w, h); const r = rng(6), B = 128;
  for (let by = 0; by < h; by += B) for (let bx = 0; bx < w; bx += B) { const k = r(); g.fillStyle = k < .12 ? '#4f7a3e' : k < .2 ? '#5d8a48' : ['#8a8680', '#7d7a74', '#96918a', '#6f6c68'][Math.floor(r() * 4)]; g.fillRect(bx + 10, by + 10, B - 20, B - 20);
    if (k >= .2) for (let i = 0; i < 6; i++) { g.fillStyle = ['#a8a39a', '#6a6762', '#b8b2a8', '#5a5856', '#8c7a6a'][Math.floor(r() * 5)]; g.fillRect(bx + 14 + r() * (B - 50), by + 14 + r() * (B - 50), 12 + r() * 30, 12 + r() * 30); }
    else for (let i = 0; i < 8; i++) { g.fillStyle = '#3f6a32'; g.beginPath(); g.arc(bx + 20 + r() * (B - 40), by + 20 + r() * (B - 40), 4 + r() * 7, 0, TAU); g.fill(); } }
  g.strokeStyle = '#d8d0a0'; g.globalAlpha = .35; g.lineWidth = 1.5; g.setLineDash([8, 8]); for (let y = 0; y < h; y += B) { g.beginPath(); g.moveTo(0, y + 1); g.lineTo(w, y + 1); g.stroke(); } for (let x = 0; x < w; x += B) { g.beginPath(); g.moveTo(x + 1, 0); g.lineTo(x + 1, h); g.stroke(); } g.setLineDash([]); g.globalAlpha = 1;
  g.fillStyle = '#2d5a7a'; g.beginPath(); g.moveTo(0, h * .7); for (let x = 0; x <= w; x += 32) g.lineTo(x, h * .7 + Math.sin(x * .004) * 90 + Math.sin(x * .011) * 30); for (let x = w; x >= 0; x -= 32) g.lineTo(x, h * .7 + 70 + Math.sin(x * .004) * 90 + Math.sin(x * .011) * 30); g.fill(); });
cityT.wrapS = cityT.wrapT = THREE.RepeatWrapping; cityT.repeat.set(30, 30); cityT.anisotropy = 8;
const gnd = new THREE.Mesh(new THREE.CircleGeometry(30000, 64), new THREE.MeshStandardMaterial({ map: cityT, roughness: 1, emissive: '#ffffff', emissiveMap: cityT, emissiveIntensity: .75 })); gnd.rotation.x = -Math.PI / 2; GROUND.add(gnd);
const park = new THREE.Mesh(new THREE.CircleGeometry(40, 48), std('#5aa84a')); park.rotation.x = -Math.PI / 2; park.position.y = .05; GROUND.add(park);
// facades: windows in rows, lit/unlit, per style
const facade = (base, win, frame, seed, lit) => { const t = canvasTex(256, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(seed); for (let y = 8; y < h - 8; y += 16) for (let x = 6; x < w - 6; x += 14) { g.fillStyle = r() < lit ? '#ffe6a8' : win; g.fillRect(x, y, 10, 11); } g.fillStyle = frame; for (let y = 0; y < h; y += 64) g.fillRect(0, y, w, 3); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 3); return t; };
const STYLES = [[ '#9fb4c8', '#3a5068', '#c8d4e0', .04], ['#d8cdb8', '#4a4a50', '#b8ab94', .06], ['#a0563c', '#2a2a30', '#7a3e2a', .05], ['#2a3440', '#5a7a9a', '#1a2028', .08]];
const roofM = new THREE.MeshStandardMaterial({ color: '#5a5a5c', roughness: .95 });
{ const r = rng(14), per = 900, m = new THREE.Matrix4(), q = new THREE.Quaternion();
  STYLES.forEach(([base, win, frame, lit], si) => { const fm = new THREE.MeshStandardMaterial({ map: facade(base, win, frame, si * 9 + 1, lit), roughness: si === 0 || si === 3 ? .35 : .85, metalness: si === 0 || si === 3 ? .4 : 0 });
    const im = new THREE.InstancedMesh(BOX, [fm, fm, roofM, roofM, fm, fm], per); let n = 0;
    while (n < per) { const bx = Math.round((r() - .5) * 60) * 128 / 2048 * 30000 / 30 * 1.0, a = r() * TAU, d = 70 + Math.pow(r(), 1.3) * 5200, x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (Math.abs(x - 140) < 60 && Math.abs(z + 160) < 60) continue; const down = Math.exp(-d / 1400), hh = 12 + r() * (30 + 260 * down) * (r() < .08 ? 2.2 : 1), wd = 18 + r() * 34, dp = 18 + r() * 34;
      q.setFromAxisAngle(V(0, 1, 0), Math.round(r() * 2) * Math.PI / 2); m.compose(V(x, hh / 2, z), q, V(wd, hh, dp)); im.setMatrixAt(n++, m); }
    im.castShadow = false; im.frustumCulled = false; GROUND.add(im); }); }
// traffic: tiny cars along a few avenues
{ const r = rng(31), n = 600, im = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ roughness: .5 }), n), m = new THREE.Matrix4(); for (let i = 0; i < n; i++) { const ax = r() < .5, lane = (Math.round((r() - .5) * 40) * 125), t = (r() - .5) * 8000; m.makeScale(ax ? 4.5 : 2, 1.6, ax ? 2 : 4.5).setPosition(ax ? t : lane, .8, ax ? lane : t); im.setMatrixAt(i, m); im.setColorAt(i, new THREE.Color(['#e8e8e8', '#202020', '#c83030', '#3050a8', '#d8d0b8'][i % 5])); } im.frustumCulled = false; GROUND.add(im); }
for (let i = 0; i < 18; i++) { const r = rng(i + 50), t = new THREE.Group(), a = r() * TAU, d = 8 + r() * 28; t.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); GROUND.add(t); blk(.4, 2.6, .4, '#6b4f3a', 0, 1.3, 0, t); const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8 + r(), 1), new THREE.MeshStandardMaterial({ color: r() < .5 ? '#4caf50' : '#3f8f45', flatShading: true })); c.position.y = 3.4; t.add(c); }
// Burj Khalifa (828 m) next to the ladder
const BURJ = new THREE.Group(); BURJ.position.set(140, 0, -160); GROUND.add(BURJ);
{ const glass = new THREE.MeshStandardMaterial({ color: '#c8d6e4', metalness: .2, roughness: .3, emissive: '#405060', emissiveIntensity: .5 }); let y = 0; [[60, 160], [50, 140], [42, 120], [34, 110], [26, 100], [20, 80], [14, 70], [9, 50]].forEach(([w, hh]) => { const m = new THREE.Mesh(BOX, glass); m.scale.set(w, hh, w * .8); m.position.y = y + hh / 2; BURJ.add(m); y += hh; }); const sp = new THREE.Mesh(new THREE.ConeGeometry(4, 828 - y, 8), glass); sp.position.y = y + (828 - y) / 2; BURJ.add(sp); }
// Everest (8,849 m), a few km away
const EVER = new THREE.Group(); FG.add(EVER);
{ const N = 220, S = 60000, pg = new THREE.PlaneGeometry(S, S, N, N); pg.rotateX(-Math.PI / 2); const pa = pg.attributes.position, cols = [];
  const PEAKS = [[0, 0, 8849, 5200], [-5200, 2600, 8516, 3600], [7400, -3800, 8463, 3800], [-13000, -6000, 8188, 4200], [14000, 7000, 7900, 4600], [-2000, -12000, 7600, 5000], [9000, 12000, 7200, 5200]];
  const ridged = (x, z) => { let v = 0, a = 1, f = .00018; for (let k = 0; k < 5; k++) { v += a * (1 - Math.abs(Math.sin(x * f + k * 1.7) * Math.cos(z * f * 1.3 - k))); a *= .5; f *= 2.1; } return v; };
  for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i); let h = 0; PEAKS.forEach(([px, pz, ph, pr]) => { const d = Math.hypot(x - px, z - pz); h = Math.max(h, ph * Math.exp(-Math.pow(d / pr, 1.4))); });
    const near = Math.min(h / 2500, 1); h = h * (.82 + .18 * ridged(x, z) / 1.9) + 900 * near * ridged(x * 1.6, z * 1.6) / 1.9; h -= 450; pa.setY(i, h < 0 ? -80 : h); }
  pg.computeVertexNormals(); const nr = pg.attributes.normal;
  for (let i = 0; i < pa.count; i++) { const h = pa.getY(i), steep = 1 - nr.getY(i), snowLine = 5200 + 1400 * steep + 400 * Math.sin(pa.getX(i) * .001); const c = new THREE.Color(h > snowLine ? (steep > .45 ? '#c8ccd4' : '#f2f5fa') : h > 4200 ? '#7c7268' : h > 2500 ? '#6a6458' : '#4f5a3c'); cols.push(c.r, c.g, c.b); }
  pg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, emissive: '#262a32', emissiveIntensity: .35 })); EVER.add(m); }
EVER.position.set(9000, 0, -14000);
// cloud deck at ~2 km
const cloudMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { time: { value: 0 }, op: { value: 1 } },
  vertexShader: `varying vec3 wP; void main(){ vec4 w = modelMatrix * vec4(position,1.0); wP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float time, op; varying vec3 wP; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 7.1; a *= .5; } return v; }
    void main(){ vec2 q = (wP.xz - vec2(80000., 0.)) * .00035 + vec2(time * .002, 0.); float n = fbm(q + fbm(q * 1.9) * .8); float a = smoothstep(.48, .72, n);
      float shade = .78 + .22 * smoothstep(.5, .9, fbm(q * 2.3 + .4)); float dist = length(wP.xz - cameraPosition.xz); a *= 1. - smoothstep(20000., 30000., dist);
      gl_FragColor = vec4(vec3(shade), a * op * .92); }` });
const CLOUDL = new THREE.Mesh(new THREE.PlaneGeometry(64000, 64000), cloudMat); CLOUDL.rotation.x = -Math.PI / 2; FG.add(CLOUDL);
const CLOUDS = [];
// airliner at ~10.5 km
const PLANE = new THREE.Group(); FG.add(PLANE);
{ const white = new THREE.MeshStandardMaterial({ color: '#f4f6f8', roughness: .35, metalness: .15 }), grey = new THREE.MeshStandardMaterial({ color: '#b8c0c8', roughness: .4, metalness: .5 }), blue = std('#1f4fb0');
  const prof = []; for (let i = 0; i <= 40; i++) { const t = i / 40, y = -32 + t * 64, r = t < .1 ? 2.9 * Math.sin(t / .1 * Math.PI / 2) : t > .8 ? 2.9 * (1 - (t - .8) / .2 * .75) : 2.9; prof.push(new THREE.Vector2(Math.max(r, .05), y)); }
  const fus = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), white); fus.rotation.z = -Math.PI / 2; PLANE.add(fus);
  const winT = canvasTex(512, 32, (g, w, h) => { g.fillStyle = '#f4f6f8'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f4fb0'; g.fillRect(0, 22, w, 6); g.fillStyle = '#1a2230'; for (let x = 20; x < w - 20; x += 9) g.fillRect(x, 8, 5, 7); });
  [-1, 1].forEach(sd => { const strip = new THREE.Mesh(new THREE.PlaneGeometry(50, 3), new THREE.MeshStandardMaterial({ map: winT, transparent: true })); strip.position.set(0, .6, sd * 2.92); if (sd < 0) strip.rotation.y = Math.PI; PLANE.add(strip); });
  const wingShape = new THREE.Shape(); wingShape.moveTo(0, 0); wingShape.lineTo(-9, 30); wingShape.lineTo(-13, 30); wingShape.lineTo(-11, 0); wingShape.lineTo(0, 0);
  [-1, 1].forEach(sd => { const wg = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, { depth: .6, bevelEnabled: false }), white); wg.rotation.x = -Math.PI / 2 * sd; wg.position.set(6, -1.2, 0); wg.scale.set(1, sd, 1); PLANE.add(wg);
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 6, 18), grey); eng.rotation.z = Math.PI / 2; eng.position.set(4, -2.6, sd * 10); PLANE.add(eng);
    const hs = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, { depth: .3, bevelEnabled: false }), white); hs.scale.set(.35, sd * .35, 1); hs.rotation.x = -Math.PI / 2 * sd; hs.position.set(-27, .5, 0); PLANE.add(hs); });
  const finS = new THREE.Shape(); finS.moveTo(0, 0); finS.lineTo(-7, 10); finS.lineTo(-10, 10); finS.lineTo(-9, 0); const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(finS, { depth: .4, bevelEnabled: false }), blue); fin.position.set(-24, 2, -.2); PLANE.add(fin);
  PLANE.traverse(o => { if (o.isMesh) o.castShadow = false; }); }
const contrails = []; for (let i = 0; i < 30; i++) { const s = sprite(TEX.smoke, 6, false, 0); s.material.color.set('#ffffff'); FG.add(s); contrails.push(s); }
// Baumgartner's balloon capsule at 39 km
const BAL = new THREE.Group(); FG.add(BAL);
{ const env = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 20), new THREE.MeshStandardMaterial({ color: '#f2f0ea', transparent: true, opacity: .85, roughness: .4 })); env.scale.set(1, 1.15, 1); env.position.y = 160; BAL.add(env); const line = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 100, 6), std('#888')); line.position.y = 52; BAL.add(line); const cap = new THREE.Mesh(new THREE.SphereGeometry(2.4, 20, 14), std('#d8dce2', { metalness: .5, roughness: .4 })); BAL.add(cap); blk(2, 2.4, .2, '#2a3a4a', 0, 0, 2.3, BAL); }
const jumper = vox({ seed: 91, shirt: '#f2f2f2', pants: '#f2f2f2', skin: '#cfd6dc', hair: '#f2f2f2', style: 3 }); FG.add(jumper);
// the ISS at 400 km
const ISS = new THREE.Group(); FG.add(ISS);
{ const al = std('#e8eaee', { metalness: .4, roughness: .5 }), pv = new THREE.MeshStandardMaterial({ color: '#2b4a8f', metalness: .3, roughness: .4, emissive: '#0a1430', emissiveIntensity: .4 }); blk(108, 2, 2, '#c8ccd2', 0, 0, 0, ISS); [[-50, 1], [-38, 1], [38, 1], [50, 1]].forEach(([x]) => { [-1, 1].forEach(s => { const p = new THREE.Mesh(BOX, pv); p.scale.set(11, .3, 34); p.position.set(x, 0, s * 20); ISS.add(p); }); });
  [[0, 0, -6, 4.2, 14], [0, 0, 8, 4.2, 12], [0, 0, 20, 4, 10], [0, 0, -18, 4, 9]].forEach(([x, y, z, r, l]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 20), al); m.rotation.x = Math.PI / 2; m.position.set(x, y, z); ISS.add(m); }); blk(14, .3, 6, '#f2f2f2', 0, 6, 0, ISS); }

// ---------- climber ----------
const you = vox({ seed: 81, shirt: '#3f6fb0', pants: '#3a4a6a', skin: '#e3b089', hair: '#4a2e1b', style: 0 }); LD.add(you);
const U = you.userData, OUT = { hood: [], down: [], suit: [] }, addTo = (key, parent, w, h, d, c, x, y, z, mat) => { const m = blk(w, h, d, mat || c, x, y, z, parent, false); OUT[key].push(m); return m; };
// ground: hoodie strings, sneakers
addTo('hood', U.body, .64, .2, .36, '#2f5a98', 0, .58, 0); addTo('hood', U.body, .03, .18, .02, '#e8e8e8', -.08, .45, .18); addTo('hood', U.body, .03, .18, .02, '#e8e8e8', .08, .45, .18);
U.legs.forEach(l => addTo('hood', l, .28, .13, .36, '#f2f2f2', 0, -.66, .04));
// everest: red down jacket with quilting, beanie, goggles, backpack, gloves, boots, oxygen mask
const quilt = canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#d8262e'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < h; y += 12) g.fillRect(0, y, w, 2); g.fillStyle = 'rgba(255,255,255,.12)'; for (let y = 4; y < h; y += 12) g.fillRect(0, y, w, 3); });
const downM = new THREE.MeshStandardMaterial({ map: quilt, roughness: .7 });
addTo('down', U.body, .7, .7, .42, null, 0, .33, 0, downM); U.arms.forEach(a => { addTo('down', a, .25, .58, .29, null, 0, -.24, 0, downM); addTo('down', a, .2, .17, .24, '#1a1a1e', 0, -.57, 0); });
addTo('down', U.head, .64, .26, .64, '#2a2a30', 0, .6, 0); addTo('down', U.head, .66, .1, .66, '#d8262e', 0, .48, 0); addTo('down', U.head, .5, .14, .06, '#1a1a1e', 0, .4, .3); addTo('down', U.head, .4, .1, .07, new THREE.MeshStandardMaterial({ color: '#ffb040', metalness: .6, roughness: .15 }), 0, .4, .33);
addTo('down', U.head, .26, .18, .14, '#3a3f48', 0, .12, .34); addTo('down', U.body, .5, .6, .26, '#ff9a1a', 0, .4, -.32); addTo('down', U.body, .16, .5, .16, '#cfd6dc', .14, .5, -.5); addTo('down', U.body, .16, .5, .16, '#cfd6dc', -.14, .5, -.5);
U.legs.forEach(l => { addTo('down', l, .3, .7, .32, '#2a2a30', 0, -.36, 0); addTo('down', l, .32, .2, .4, '#f2c14e', 0, -.66, .05); });
// above 19 km: white pressure suit with a gold-visor glass helmet
const suitM = new THREE.MeshStandardMaterial({ color: '#f0f0ec', roughness: .6 });
addTo('suit', U.body, .72, .74, .44, null, 0, .33, 0, suitM); addTo('suit', U.body, .1, .5, .02, '#2f6fd0', 0, .33, .23); addTo('suit', U.body, .5, .62, .3, '#e8e8e4', 0, .38, -.34);
U.arms.forEach(a => { addTo('suit', a, .27, .6, .31, null, 0, -.24, 0, suitM); addTo('suit', a, .22, .18, .26, '#e8eaee', 0, -.57, 0); });
U.legs.forEach(l => { addTo('suit', l, .32, .74, .34, null, 0, -.36, 0, suitM); addTo('suit', l, .34, .22, .42, '#d8dce0', 0, -.66, .05); });
const helm = new THREE.Mesh(new THREE.SphereGeometry(.56, 32, 24), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .28, roughness: .05, metalness: .1, clearcoat: 1 })); helm.position.y = .32; U.head.add(helm); OUT.suit.push(helm);
const visor = new THREE.Mesh(new THREE.SphereGeometry(.565, 32, 24, Math.PI / 2 - .9, 1.8, .9, 1.0), new THREE.MeshStandardMaterial({ color: '#d8a030', metalness: .9, roughness: .15, transparent: true, opacity: .55 })); visor.position.y = .32; U.head.add(visor); OUT.suit.push(visor);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.36, .06, 10, 28), std('#c8ccd2', { metalness: .6 })); ring.rotation.x = Math.PI / 2; ring.position.y = .02; U.head.add(ring); OUT.suit.push(ring);
function outfit(alt) { const k = alt < 5000 ? 'hood' : alt < 18500 ? 'down' : 'suit'; Object.entries(OUT).forEach(([n, a]) => a.forEach(m => m.visible = n === k)); return k; }
const tank = new THREE.Group(); you.userData.body.add(tank);
const bubbles = []; for (let i = 0; i < 26; i++) { const s = sprite(TEX.glowC, .12, true, 0); s.material.color.set('#e8f8ff'); LD.add(s); bubbles.push(s); }

// ---------- per frame ----------
let ALT = 0;
function setAlt(c, alt, o = {}) {
  ALT = alt; skyMat.uniforms.h.value = alt; skyMat.uniforms.time.value = c.t; const air = Math.exp(-alt / 8000);
  stars.material.opacity = clamp(1 - Math.pow(air, .25) * 1.6); moon.material.opacity = .25 + .75 * (1 - Math.pow(air, .3));
  hemi.intensity = .35 + .75 * Math.pow(air, .3); hemi.color.set(air > .3 ? '#cfe6ff' : '#9fb4d8'); hemi.groundColor.set(alt < 3000 ? '#4a5a3a' : '#2a4a7a');
  GROUND.position.y = -alt; GROUND.visible = alt < 4000; EVER.position.y = -alt; EVER.visible = alt < 30000;
  CLOUDL.position.y = 2300 - alt; CLOUDL.visible = alt < 40000 && Math.abs(alt - 2300) > 40; cloudMat.uniforms.time.value = c.t; cloudMat.uniforms.op.value = 1 - sm(15000, 40000, alt);
  // ladder: rails reach from the ground (or far below) up into the sky, rungs every 0.3 m around the climber
  const below = Math.min(alt, 30000), above = 3000; rails.forEach(r => { r.scale.y = below + above; r.position.y = (above - below) / 2; });
  const m = new THREE.Matrix4(), off = ((o.step || 0) % .3); for (let i = 0; i < RUNGS; i++) { const y = -24 + i * .3 - off; m.makeScale(.6, .045, .045).setPosition(0, y, 0); rungs.setMatrixAt(i, m); } rungs.instanceMatrix.needsUpdate = true;
  scene.fog = alt < 4000 ? new THREE.FogExp2(new THREE.Color('#b8d4ee'), .00006) : null;
}
function climb(c, o = {}) { const ph = c.t * (o.rate || 2.4), u = you.userData; put(you, 0, -1.1 + (Math.sin(ph * Math.PI) * .04), .42, Math.PI, c.t, { expr: o.expr || 'neutral', blink: o.blink }); const a = Math.sin(ph * Math.PI);
  u.arms[0].rotation.set(-2.6 - .35 * a, 0, -.1); u.arms[1].rotation.set(-2.6 + .35 * a, 0, .1); u.legs[0].rotation.x = -.5 - .45 * Math.max(a, 0); u.legs[1].rotation.x = -.5 - .45 * Math.max(-a, 0); u.head.rotation.x = o.down ? .5 : o.up ? -.4 : 0; u.head.rotation.y = o.look || 0; outfit(ALT); }
RESETS.push((c, sh) => {
  moon.scale.setScalar(400); const on = isMine(); camera.far = on && sh.loc === 'LAD' ? 20000 : 3000; camera.near = on && sh.loc === 'LAD' ? .35 : .05;
  if (!on || sh.loc !== 'LAD') return; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.shadowMap.enabled = false; bloom.strength = .35; bloom.threshold = .82;
  PLANE.visible = BAL.visible = ISS.visible = jumper.visible = false; contrails.forEach(s => s.material.opacity = 0); bubbles.forEach(b => b.material.opacity = 0); you.visible = false; you.rotation.set(0, 0, 0); tank.visible = false;
});
const pathCam = (c, keys) => { let k0 = keys[0], k1 = keys[0], s = 0; const T = k => typeof k.t === 'number' ? k.t : c.lt - (k.t[1] === 'e' ? c.che(k.t[0]) : c.ch(k.t[0])) + (k.t[2] || 0);
  for (let i = 0; i < keys.length - 1; i++) { const a = T(keys[i]), b = T(keys[i + 1]); if (c.lt >= a) { k0 = keys[i]; k1 = keys[i + 1]; s = clamp((c.lt - a) / Math.max(b - a, .01)); } }
  if (c.lt >= T(keys[keys.length - 1])) { k0 = k1 = keys[keys.length - 1]; s = 0; } const e = eio(s); return { p: P(k0.p, k1.p, e), at: P(k0.a, k1.a, e), fov: lerp(k0.fov || 46, k1.fov || 46, e), roll: lerp(k0.roll || 0, k1.roll || 0, e) }; };
const orbit = (c, r, y, a0, a1, at = [0, -.2, 0], fov = 46) => { const a = lerp(a0, a1, eio(c.p)); return { p: [Math.sin(a) * r, y, Math.cos(a) * r], at, fov }; };
const altOf = (c, a0, a1, ease = 'lin') => lerp(a0, a1, ease === 'lin' ? c.p : eio(c.p));
Object.assign(SHOTS, {
  lintro: { loc: 'LAD', aperture: .0004, cam: c => pathCam(c, [{ t: 0, p: [3.2, -.4, 5], a: [0, -.6, 0], fov: 50 }, { t: c.d, p: [1.6, -.9, 2.2], a: [0, 60, -2], fov: 62 }]),
    fx: c => { setAlt(c, 2.2, { step: 0 }); climb(c, { rate: 0, up: true, expr: 'o' }); } },
  lclimb: { loc: 'LAD', aperture: .0004, cam: c => orbit(c, 6, 1.2, .9, -.4, [0, -1.2, 0]), fx: c => { const a = altOf(c, 4, 320); setAlt(c, a, { step: c.t * .9 }); climb(c, { expr: 'smile' }); } },
  lburj: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [-20, 6, 50], a: [140, -40, -160], fov: 50 }, { t: c.d, p: [-34, 14, 70], a: [140, -260, -160], fov: 56 }]),
    fx: c => { setAlt(c, altOf(c, 760, 860), { step: c.t * .9 }); climb(c, { look: .6, expr: 'smile' }); } },
  leverest: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [-6, 2, 9], a: [0, -.6, 0], fov: 46 }, { t: [0, 'e'], p: [-14, 6, 18], a: [3000, -600, -6000], fov: 50 }, { t: [2, 's'], p: [-3.4, .4, 4.4], a: [0, -.4, 0], fov: 40 }, { t: c.d, p: [-2.4, .2, 3.4], a: [0, -.3, 0], fov: 36 }]),
    fx: c => { setAlt(c, altOf(c, 8500, 8880), { step: c.t * .7 }); climb(c, { expr: c.ch(2) > 0 ? 'squint' : 'o', rate: 1.6, look: -.4 }); } },
  lplane: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [1.6, 2.2, 2.4], a: [-60, -320, -10], fov: 56 }, { t: c.d, p: [2.2, 2.6, 3.2], a: [80, -320, -10], fov: 58 }]),
    fx: c => { setAlt(c, altOf(c, 10900, 11050), { step: c.t * .6 }); climb(c, { down: true, expr: 'o', tank: true, rate: 1.4 }); PLANE.visible = true; const x = lerp(-700, 700, c.p); PLANE.position.set(x * .35, -320, -10); PLANE.scale.setScalar(1.8); PLANE.rotation.y = 0;
      contrails.forEach((s, i) => { s.position.set(x * .35 - 70 - i * 45, -320, -10 + (i % 2 ? 14 : -14)); s.scale.setScalar(6 + i * 1.6); s.material.opacity = .5 * (1 - i / contrails.length); }); } },
  larmstrong: { loc: 'LAD', aperture: .0012, cam: c => pathCam(c, [{ t: 0, p: [2.2, .4, 3], a: [0, -.2, 0], fov: 42 }, { t: c.d, p: [1.2, .3, 2], a: [0, -.25, 0], fov: 36 }]),
    fx: c => { setAlt(c, altOf(c, 18950, 19050), { step: c.t * .5 }); climb(c, { expr: 'o', tank: true, rate: 1.2, blink: false }); const k = sm(0, 1, c.ch(1));
      bubbles.forEach((b, i) => { const r = rng(i + 7), a = (c.t * (.6 + r() * .5) + r()) % 1; b.position.set((r() - .5) * .5, -1.1 + 1.4 + r() * .4 + a * .6, .7 + (r() - .5) * .3); b.material.opacity = k * .9 * (1 - a); b.scale.setScalar(.05 + r() * .08); }); } },
  lfelix: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [6, 2, 12], a: [-40, 40, -60], fov: 50 }, { t: [1, 's'], p: [4, 4, 14], a: [-40, -10, -60], fov: 46 }, { t: c.d, p: [3, 8, 18], a: [-40, -300, -60], fov: 54 }]),
    fx: c => { setAlt(c, 39045, { step: c.t * .4 }); climb(c, { look: .7, expr: 'o', tank: true, rate: 1 }); BAL.visible = jumper.visible = true; BAL.position.set(-40, 30, -60); const j = c.ch(1) > 0 ? c.ch(1) : 0, fall = j * j * 4.9;
      put(jumper, -40 + j * 2, 27 - fall - 1.2, -57.6, .6, c.t, { arms: [[0, 0, -1.4], [0, 0, 1.4]], expr: 'big', blink: false }); jumper.rotation.x = j > 0 ? -1.2 : 0; jumper.scale.setScalar(1.1); } },
  lkarman: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [3, 2, 6], a: [0, -.4, 0], fov: 46 }, { t: [1, 's'], p: [10, 8, 22], a: [0, -60, 0], fov: 56 }, { t: c.d, p: [14, 14, 30], a: [0, -400, -200], fov: 62 }]),
    fx: c => { setAlt(c, 100000, { step: 0 }); climb(c, { rate: 0, expr: 'big', tank: true }); const u = you.userData; if (c.ch(1) > 0) { u.arms[1].rotation.set(0, 0, 2.7 + Math.sin(c.t * 9) * .2); } } },
  lgravity: { loc: 'LAD', aperture: .0002, cam: c => { const f = c.ch(2) > 0 ? c.ch(2) : 0; return pathCam(c, [{ t: 0, p: [2.6, 1, 4], a: [0, -.4, 0], fov: 44 }, { t: [2, 's'], p: [2.2, .6, 3.4], a: [0, -.6, 0], fov: 42 }, { t: c.d, p: [3, 2, 6], a: [0, -60, 6], fov: 52 }]); },
    fx: c => { setAlt(c, 100000, { step: 0 }); const f = c.ch(2) > .3 ? c.ch(2) - .3 : 0, drop = f * f * 4.7; climb(c, { rate: 0, expr: f > 0 ? 'o' : 'neutral', tank: true, blink: false }); if (f > 0) { you.position.set(0, -1.1 - drop, .42 + f * .6); you.rotation.set(f * 1.2, Math.PI, f * .8); const u = you.userData; u.arms[0].rotation.set(0, 0, -2.6); u.arms[1].rotation.set(0, 0, 2.6); } } },
  liss: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [3, 1.5, 7], a: [0, -.3, 0], fov: 46 }, { t: [0, 'e', -.4], p: [4, 2, 10], a: [-60, 0, -50], fov: 52 }, { t: [1, 's'], p: [4, 2, 10], a: [40, 0, -50], fov: 52 }, { t: c.d, p: [2.6, 1.2, 6], a: [0, -.4, 0], fov: 44 }]),
    kick: c => { const a = c.ch(0) - .3; return a > 0 && a < .9 ? .06 * Math.sin(a / .9 * Math.PI) : 0; },
    fx: c => { setAlt(c, 400000, { step: 0 }); climb(c, { rate: 0, look: c.ch(1) > 0 ? .9 : -.6, expr: 'o', tank: true }); ISS.visible = true; const a = c.ch(0) - .3, x = a > 0 ? lerp(-900, 900, clamp(a / 1.1)) : -900; ISS.position.set(x, 4, -50); ISS.rotation.set(.1, 0, .05); } },
  lmoon: { loc: 'LAD', aperture: .0002, cam: c => pathCam(c, [{ t: 0, p: [4, 2, 8], a: [-260, 520, -600], fov: 46 }, { t: c.d, p: [20, -30, 60], a: [-260, 520, -600], fov: 54 }]),
    fx: c => { setAlt(c, 400000, { step: 0 }); climb(c, { rate: .6, up: true, expr: 'smile', tank: true }); moon.scale.setScalar(lerp(1200, 1500, c.p)); } },
  lend: { loc: 'LAD', noCap: false, aperture: .0002, cam: c => ({ p: P([20, -30, 60], [40, -200, 160], eio(c.p)), at: [-260, 520, -600], fov: 54 }),
    fx: c => { setAlt(c, 400000, { step: 0 }); climb(c, { rate: .6, up: true, expr: 'smile', tank: true }); moon.scale.setScalar(1500); },
    post: c => { const a = c.lt - (c.d - 2.6); if (a <= 0) return ''; const bar = eio(clamp(a / .8)), gap = lerp(512, 70, bar), t1 = clamp((a - .6) / .5), t2 = clamp((a - 1.1) / .5); const S = (y, txt, size, fill, op, it) => `<text x="288" y="${y}" text-anchor="middle" font-family="EBG" font-weight="500" ${it ? 'font-style="italic"' : ''} font-size="${size}" fill="${fill}" opacity="${op.toFixed(2)}">${txt}</text>`;
      return `<rect width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/><rect y="${f1(512 + gap)}" width="576" height="${f1(512 - gap)}" fill="#0b0a0a"/>` + S(360, 'What if you climbed', 33, '#fff', t1) + S(400, 'a ladder to space?', 33, '#fff', t1) + S(664, 'Moon: 263 years. Bring snacks.', 24, ORANGE, t2, true); } },
});
// ---------- HUD ----------
const tempAt = h => { const k = h / 1000; return k < 11 ? 15 - 6.5 * k : k < 20 ? -56.5 : k < 32 ? -56.5 + (k - 20) : k < 47 ? -44.5 + 2.8 * (k - 32) : k < 51 ? -2.5 : k < 71 ? -2.5 - 2.8 * (k - 51) : k < 85 ? -58.5 - 2 * (k - 71) : null; };
GLOBAL_OV.push((t, c, sh) => {
  if (!isMine() || sh.loc !== 'LAD' || c.o.scene === 'lintro' || c.o.scene === 'lend') return '';
  const hrs = ALT / 500, day = Math.max(1, Math.ceil(hrs / 8 - 1e-9)), inDay = hrs - (day - 1) * 8, hh = 8 + Math.floor(inDay), mm = Math.floor((inDay * 60) % 60), air = Math.exp(-ALT / 8000) * 100, T = tempAt(ALT);
  const big = ALT < 10000 ? `${Math.round(ALT).toLocaleString('en-US')}<tspan font-size="24" dx="4">m</tspan>` : `${(ALT / 1000).toLocaleString('en-US', { maximumFractionDigits: ALT < 100000 ? 1 : 0 })}<tspan font-size="24" dx="4">km</tspan>`;
  const airS = air > 1 ? `${air.toFixed(0)}%` : air > .001 ? `${air.toFixed(3)}%` : 'NONE', zone = ALT < 2000 ? 'GROUND LEVEL' : ALT < 12000 ? 'TROPOSPHERE' : ALT < 50000 ? 'STRATOSPHERE' : ALT < 100000 ? 'MESOSPHERE' : 'SPACE';
  const k = clamp(c.t / .3);
  return `<g transform="translate(26 392)" opacity="${k.toFixed(2)}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
    <text x="0" y="0" font-family="Inter" font-weight="800" font-size="13" fill="${ORANGE}" letter-spacing="2.4">${zone}</text>
    <text x="0" y="48" font-family="Inter" font-weight="800" font-size="44" fill="#fff">${big}</text>
    <text x="0" y="72" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">DAY ${day} · <tspan fill="${CY}">${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}</tspan></text>
    <text x="0" y="92" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">AIR <tspan fill="${air < 40 ? '#ff6a4a' : '#8ff3a0'}">${airS}</tspan></text>
    ${T != null ? `<text x="0" y="112" font-family="Inter" font-weight="800" font-size="13" fill="#fff" letter-spacing="1.4">TEMP <tspan fill="${T < 0 ? '#8fd8ff' : '#ffd27a'}">${Math.round(T)}°C</tspan></text>` : ''}</g>`;
});
window.__ladder = true;
