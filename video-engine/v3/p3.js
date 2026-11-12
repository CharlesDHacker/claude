// Orbit Emergency, Part 3 ("The Sixth"): extra sets, props and shots for the 3D engine in world.js.
const E = window.ENG;
const { THREE, LOC, loc, SHOTS, RESETS, GLOBAL_OV, toon, glow, ink, box, cyl, canvasTex, TEX, sprite, project, world, P, lerp, clamp, eio, eo, pop, rng, alarmFX, hatchGlow, smokeFX, HAB, EXT, HOLO, LAB, IDS, badge, RED, GOLD, GREEN, CYAN } = E;
const TAU = Math.PI * 2, f1 = n => (+n).toFixed(1);
const pillSVG = (x, y, text, col, k = 1, fs = 24) => { const w = text.length * fs * .5 + 44; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k.toFixed(3)})"><rect x="${-w / 2}" y="${-fs * .92}" width="${w}" height="${fs * 1.84}" rx="${fs * .92}" fill="#0b1020" stroke="${col}" stroke-width="3"/><text y="${fs * .34}" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="${fs}" fill="${col}" letter-spacing="1">${text}</text></g>`; };
const bigText = (x, y, text, size, fill, k = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${k.toFixed(3)})"><text text-anchor="middle" font-family="Anton" font-size="${size}" fill="${fill}" stroke="#15151c" stroke-width="${Math.max(6, size * .07)}" stroke-linejoin="round" paint-order="stroke" style="paint-order:stroke">${text}</text></g>`;

// ---------- hatch door that can swing open, and Mei's porthole ----------
const H = HAB.userData.hatch, hg = H.g, kids = hg.children.slice();
const doorG = new THREE.Group(); doorG.position.set(-1.6, 0, 0); hg.add(doorG);
[kids[2], kids[3], kids[4], H.wheel, H.fireGlow].forEach(m => { doorG.add(m); m.position.x += 1.6; });
const hole = new THREE.Mesh(new THREE.CircleGeometry(1.58, 40), new THREE.MeshBasicMaterial({ color: '#07090f' })); hole.position.z = .04; hg.add(hole);
const vapor = []; for (let i = 0; i < 16; i++) { const s = sprite(TEX.smoke, 1, false, 0); HAB.add(s); vapor.push(s); }
// ---------- vent valve on the wall beside the hatch ----------
const valve = new THREE.Group(); valve.position.set(2.95, .2, -17.2); valve.rotation.y = -Math.PI / 2; HAB.add(valve);
const hazard = canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#f2c14e'; g.fillRect(0, 0, w, h); g.fillStyle = '#15151c'; for (let i = -6; i < 12; i++) { g.beginPath(); g.moveTo(i * 44, 0); g.lineTo(i * 44 + 22, 0); g.lineTo(i * 44 - 40, 60); g.lineTo(i * 44 - 62, 60); g.fill(); } g.fillStyle = '#f6f3ea'; g.fillRect(24, 232, 208, 64); g.strokeStyle = '#15151c'; g.lineWidth = 6; g.strokeRect(24, 232, 208, 64); g.fillStyle = '#c1121f'; g.font = '900 34px sans-serif'; g.textAlign = 'center'; g.fillText('VENT', 128, 276); });
box(1.05, 1.35, .12, toon('#ffffff', { map: hazard }), 0, 0, 0, valve);
const lever = new THREE.Group(); lever.position.set(0, -.1, .1); valve.add(lever);
box(.13, .78, .13, '#dfe6ee', 0, .39, 0, lever); const knob = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 14), toon('#e5484d')); knob.position.y = .82; lever.add(knob); ink(knob, .02);
const vLight = new THREE.Mesh(new THREE.SphereGeometry(.09, 14, 10), glow('#34d399')); vLight.position.set(.36, .42, .1); valve.add(vLight);
const vGlow = sprite(TEX.glowR, 1.6, true, 0); vGlow.position.set(.36, .42, .2); valve.add(vGlow);
RESETS.push(() => { doorG.rotation.y = 0; H.wheel.rotation.z = 0; lever.rotation.x = -.55; vLight.material.color.set('#34d399'); vGlow.material.opacity = 0; vapor.forEach(s => s.material.opacity = 0); hole.material.color.set('#07090f'); });
const doorOpen = k => { doorG.rotation.y = -1.95 * k; };
function vaporFX(t, k) { const r = rng(12); vapor.forEach((s) => { const a = r() * TAU, sp = .25 + r() * .4, age = (t * sp + r()) % 1; s.position.set(Math.cos(a) * age * 1.6, Math.sin(a) * age * 1.2 + .1, -19.5 + age * 3.4); const sc = 1 + age * 3; s.scale.set(sc, sc, 1); s.material.opacity = k * .5 * (1 - age); }); }

// ---------- burning service module (interior) ----------
const SVC = loc('SVC', 5000);
{
  const tex = HAB.children[0].material.map;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 18, 16, 1, true), toon('#b48f7c', { map: tex, side: THREE.BackSide })); tube.rotation.x = Math.PI / 2; SVC.add(tube);
  for (let z = -8; z <= 8; z += 4) { const rib = new THREE.Mesh(new THREE.TorusGeometry(3.15, .09, 6, 16), toon('#5d4a44')); rib.position.z = z; SVC.add(rib); ink(rib, .02); }
  const back = new THREE.Mesh(new THREE.CircleGeometry(3.2, 24), toon('#3a2c2a')); back.position.z = -9; SVC.add(back);
  const amb = new THREE.HemisphereLight('#ffd9b0', '#2a1a16', .55); SVC.add(amb);
  const fireL = new THREE.PointLight('#ff7a1a', 30, 26, 1.1); fireL.position.set(0, 0, -5); SVC.add(fireL);
  const cold = new THREE.PointLight('#8fc8ff', 0, 26, 1.1); cold.position.set(0, 1, 4); SVC.add(cold);
  const flames = []; const r = rng(31);
  for (let i = 0; i < 16; i++) { const outer = i % 2 === 0, m = new THREE.Mesh(new THREE.ConeGeometry(outer ? .7 : .4, outer ? 2.6 : 1.7, 10), new THREE.MeshBasicMaterial({ color: outer ? '#ff7a1a' : '#ffd24a' })); const a = r() * TAU, d = r() * 2.4; m.position.set(Math.cos(a) * d, Math.sin(a) * d * .8 - .6, -6.4 + r() * 1.6 + (outer ? 0 : .4)); m.userData = { ph: r() * 6, sp: 5 + r() * 6, base: m.position.clone() }; SVC.add(m); flames.push(m); }
  const glows = []; for (let i = 0; i < 5; i++) { const g = sprite(TEX.glowO, 6, true, .8); g.position.set((r() - .5) * 3.6, (r() - .5) * 2.4, -5.6); SVC.add(g); glows.push(g); }
  const embers = []; for (let i = 0; i < 36; i++) { const g = sprite(TEX.glowY, .16, true, 1); SVC.add(g); embers.push(g); }
  const smokes = []; for (let i = 0; i < 18; i++) { const g = sprite(TEX.smoke, 1, false, 0); SVC.add(g); smokes.push(g); }
  // pump Mei was repairing
  const pump = box(1.3, 1.1, 1.0, '#4b5d73', -1.9, -1.5, 1.6, SVC); cyl(.28, .28, .9, '#e5484d', 0, .9, 0, pump, 16); cyl(.09, .09, 1.6, '#aab4c2', .5, .7, .2, pump, 8).rotation.z = .7;
  SVC.userData = { amb, fireL, cold, flames, glows, embers, smokes };
}
function svcFire(t, k, vac = 0) {
  const u = SVC.userData, r = rng(8);
  u.flames.forEach(m => { const d = m.userData, fl = .8 + .3 * Math.sin(t * d.sp + d.ph); m.scale.set(k * (.9 + .15 * Math.sin(t * d.sp * .7)), Math.max(k * fl, .001), k); m.position.x = d.base.x + Math.sin(t * 2 + d.ph) * .12; m.rotation.z = Math.sin(t * 3 + d.ph) * .15; m.visible = k > .01; });
  u.glows.forEach((g, i) => { g.material.opacity = Math.min(1, k) * (.6 + .3 * Math.sin(t * 7 + i)); const sc = 5 + k * 3; g.scale.set(sc, sc, 1); });
  u.fireL.intensity = 30 * k * (.85 + .15 * Math.sin(t * 13)); u.amb.intensity = lerp(.55, .25, vac); u.cold.intensity = vac * 14;
  u.embers.forEach((g) => { const a = r() * TAU, sp = .3 + r() * .5, age = (t * sp + r()) % 1, d = .4 + r() * 2.2; g.position.set(Math.cos(a) * d + Math.sin(t * 2 + a) * .2, Math.sin(a) * d - .4 + age * 1.2, -5.5 + age * 9); g.material.opacity = Math.min(1, k) * (1 - age); });
  u.smokes.forEach((g) => { const a = r() * TAU, sp = .15 + r() * .25, age = (t * sp + r()) % 1; g.position.set(Math.cos(a) * 2.2 * age, Math.sin(a) * 1.6 * age + .6, -4 + age * 7); const sc = 1.5 + age * 3.5; g.scale.set(sc, sc, 1); g.material.opacity = Math.min(1, k) * .34 * (1 - age); });
}
// ---------- exterior vent jets ----------
const st = EXT.userData.station, jets = { fire: [], vapor: [] };
const jetG = new THREE.Group(); jetG.position.set(0, 0, -.6); jetG.rotation.z = Math.PI / 2; st.add(jetG);   // the vent points away from both the spine and the solar arrays
for (let i = 0; i < 90; i++) { const g = sprite(i % 3 ? TEX.glowO : TEX.glowY, 1, true, 0); jetG.add(g); jets.fire.push(g); }
const core = new THREE.Mesh(new THREE.ConeGeometry(1.1, 9, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#fff2c4', transparent: true, opacity: 0, depthWrite: false })); core.rotation.z = Math.PI / 2; core.position.set(5.6, 0, 0); jetG.add(core);
for (let i = 0; i < 46; i++) { const g = sprite(TEX.smoke, 1, false, 0); jetG.add(g); jets.vapor.push(g); }
function ventFX(t, kFire, kVapor, len = 34) {
  const r = rng(77); core.material.opacity = kFire * (.75 + .25 * Math.sin(t * 40)); core.scale.set(1 + .1 * Math.sin(t * 31), .6 + .4 * kFire, 1);
  for (const [arr, k, w] of [[jets.fire, kFire, 1], [jets.vapor, kVapor, 1.5]]) arr.forEach((g) => { const sp = .5 + r() * .9, age = (t * sp + r()) % 1, jy = (r() - .5), jz = (r() - .5); g.position.set(1.2 + age * len, jy * age * 9, jz * age * 9); const sc = (.8 + age * 7) * w; g.scale.set(sc, sc, 1); g.material.opacity = k * (1 - age) * (w > 1 ? .55 : 1); });
}
RESETS.push(() => { jets.fire.forEach(g => g.material.opacity = 0); jets.vapor.forEach(g => g.material.opacity = 0); core.material.opacity = 0; });
// ---------- bell jar in the lab ----------
const jar = new THREE.Group(); jar.position.set(0, .15, 0); LAB.add(jar);
jar.add(new THREE.Mesh(new THREE.CylinderGeometry(.85, .85, 2.0, 40, 1, true), new THREE.MeshBasicMaterial({ color: '#cfeaff', transparent: true, opacity: .13, depthWrite: false, side: THREE.DoubleSide })));
const dome = new THREE.Mesh(new THREE.SphereGeometry(.85, 40, 16, 0, TAU, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#cfeaff', transparent: true, opacity: .13, depthWrite: false, side: THREE.DoubleSide })); dome.position.y = 1.0; jar.add(dome);
[-1.0, 1.0].forEach(y => { const rr = new THREE.Mesh(new THREE.TorusGeometry(.85, .035, 8, 48), glow('#eaf6ff')); rr.rotation.x = Math.PI / 2; rr.position.y = y; jar.add(rr); });
cyl(1.0, 1.05, .16, '#4b5d73', 0, -1.08, 0, jar, 40); const knobJ = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), toon('#dfe6ee')); knobJ.position.y = 1.9; jar.add(knobJ); ink(knobJ, .02);
const hose = cyl(.06, .06, 1.4, '#2b3442', 1.5, -1.05, 0, jar, 10); hose.rotation.z = Math.PI / 2;
jar.visible = false; RESETS.push(() => { jar.visible = false; });
// ---------- hologram extras ----------
const HU = HOLO.userData, holoCyan = new THREE.Color('#4fd8ff'), holoRed = new THREE.Color('#ff3b30'), svcH = new THREE.Vector3(0, 0, -.6);
const meiDot = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' })); meiDot.position.set(0, .12, -.86); HOLO.add(meiDot);
const meiGlow = sprite(TEX.glowR, .9, true, 0); meiGlow.position.copy(meiDot.position); HOLO.add(meiGlow);
const hJets = []; for (let i = 0; i < 18; i++) { const g = sprite(TEX.glowC, .3, true, 0); HOLO.add(g); hJets.push(g); }
RESETS.push(() => { HU.st.children.forEach(m => { if (m.material && m.material.color) { m.material.color.copy(holoCyan); m.material.opacity = .28; } }); meiDot.visible = false; meiGlow.material.opacity = 0; hJets.forEach(g => g.material.opacity = 0); HU.hf.visible = HU.hfl.visible = false; HU.arrows.forEach(a => a.visible = false); HU.routeM.geometry.setDrawRange(0, 0); HU.capBglow.material.opacity = 0; HU.fireM.material.opacity = 0; HU.fireCore.visible = false; HU.st.rotation.y = 0; });

// ---------- shared bits ----------
const hatchScreen = () => project(world('HAB', 0, .2, -19.6));
const knockRings = (ages, q) => ages.map((a, i) => a < 0 || a > .6 ? '' : `<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${f1(30 + a * 420)}" fill="none" stroke="#fff" stroke-width="${f1(9 * (1 - a / .6))}" opacity="${(1 - a / .6).toFixed(2)}"/>` + (a < .5 ? bigText(q.x + [-120, 110, -30][i % 3], q.y + [-150, -90, 150][i % 3], 'KNOCK', 54, GOLD, pop(a, 0, .18), [-12, 9, -5][i % 3]) : '')).join('');
const kickOf = ages => ages.reduce((s, a) => s + (a >= 0 ? Math.exp(-a * 13) * .09 : 0), 0);
const hatchBase = (c, glowK = 1, al = .3) => { alarmFX(c.t, al); smokeFX(c.t, .35); hatchGlow(c.t, glowK); };
const crewAt = [['ava', [-1.15, .15, -17.6]], ['teo', [1.2, .05, -17.3]], ['c3', [-1.5, -.9, -15.6]], ['c4', [1.55, -1.0, -15.4]], ['c5', [.1, -1.25, -14.6]]];
const MEI_PORT = { id: 'c6', p: [0, .72, -19.42], s: 1.05, tint: [.55, .32, .2] };

Object.assign(SHOTS, {
  // cold open: three knocks before the first word
  knocks3: { loc: 'HAB', cam: c => ({ p: P([0, .1, -4.5], [0, .3, -10.2], eio(c.p)), at: [0, .25, -19.8], fov: 42 }),
    kick: c => kickOf([.15, .5, .85].map(k => c.t - k)), fx: c => hatchBase(c, 1, .45),
    set: c => c.ch(1) > 0 ? [{ ...MEI_PORT, s: 1.05 * pop(c.ch(1), 0, .3), o: { headOnly: true, expr: 'worry', mask: 1 } }] : [],
    ov: c => knockRings([.15, .5, .85].map(k => c.t - k), hatchScreen()) },
  sixth: { loc: 'HAB', cam: c => ({ p: P([1.6, .9, -6.6], [.8, .6, -8.4], eio(c.p)), at: [0, .1, -19.6], fov: 44 }), fx: c => hatchBase(c),
    set: c => crewAt.map(([id, p], i) => ({ id, p, o: { expr: 'worry', look: [i % 2 ? -.5 : .5, -.2], sweat: i === 1 } })).concat([{ ...MEI_PORT, o: { headOnly: true, expr: 'worry', mask: 1 } }]),
    ov: c => { let o = crewAt.map(([id, p], i) => { const q = project(world('HAB', p[0] + .42, p[1] + .98, p[2])); return badge(q.x, q.y, i + 1, GOLD, pop(c.lt, i * .09, .3)); }).join(''); if (c.ch(1) > 0) { const q = project(world('HAB', .5, 1.35, -19.4)); o += badge(q.x, q.y, 6, RED, pop(c.ch(1), 0, .3) * 1.5); } return o; } },
  mei: { loc: 'SVC', cam: c => ({ p: P([.9, .5, 6.2], [.4, .4, 4.6], eio(c.p)), at: [0, .45, 1.5], fov: 40 }), fx: c => svcFire(c.t, .85),
    set: c => [{ id: 'c6', p: [0, .05, 1.5], tint: [1, .86, .74], o: { expr: 'worry', mask: 1, sweat: 1, look: [0, 0] } }],
    chips: [{ type: 'tag', name: 'MEI · 26', sub: 'FLIGHT SURGEON · ROOKIE', color: '#06b6d4', at: 0, delay: .35 }], focus: 3.2, flash: true },
  openIt: { loc: 'HOLO', cam: c => { const a = lerp(.9, .3, eio(c.p)); return { p: [Math.sin(a) * 6.6, 4.2, Math.cos(a) * 6.6], at: [0, -.2, -.4], fov: 40 }; },
    fx: c => { HU.fireM.material.opacity = .8 + .2 * Math.sin(c.t * 9); HU.fireCore.visible = true; HU.fireCore.scale.setScalar(1); const w = c.ch(1) > 0 ? c.ch(1) * 9 : -1; HU.st.children.forEach(m => { if (!m.material || !m.material.color) return; const k = clamp((w - m.position.distanceTo(svcH)) / 1.5); m.material.color.copy(holoCyan).lerp(holoRed, k); m.material.opacity = .28 + .3 * k; }); },
    ov: c => c.ch(1) > 0 ? pillSVG(288, 830, 'FIRE REACHES EVERY MODULE', RED, pop(c.ch(1), .2)) : '', hitAt: 1, hit: .05, flashAt: 1 },
  leaveIt: { loc: 'SVC', cam: c => ({ p: P([-.7, .5, 5.0], [-.3, .45, 3.6], eio(c.p)), at: [0, .45, 1.5], fov: 40 }), fx: c => svcFire(c.t, lerp(.9, 1.5, eio(c.p))), shake: .012,
    set: c => [{ id: 'c6', p: [0, .05, 1.5], tint: [1, .8, .64], o: { expr: c.ch(1) > 0 ? 'shock' : 'worry', mask: 1, sweat: 1, look: [0, c.ch(1) > 0 ? .3 : 0] } }] },
  knockBack: { loc: 'HAB', cam: c => ({ p: P([1.2, .5, -11.6], [.7, .5, -12.8], eio(c.p)), at: [-.35, .4, -19.2], fov: 42 }), fx: c => hatchBase(c),
    kick: c => kickOf([.05, .33].map(k => c.che(0) - k)),
    set: c => { const a = c.che(0), hit = Math.max(0, 1 - Math.abs(a - .05) / .1, 1 - Math.abs(a - .33) / .1); return [{ id: 'ava', p: [-1.0, -.25, -18.5], o: { expr: 'determined', look: [.8, -.3], arms: { r: [lerp(150, 196, hit), lerp(40, 10, hit)] } } }].concat(c.ch(2) > 0 ? [{ ...MEI_PORT, s: 1.05 * pop(c.ch(2), 0, .3), o: { headOnly: true, expr: 'worry', mask: 1 } }] : []); },
    ov: c => knockRings([.05, .33].map(k => c.che(0) - k), hatchScreen()) },
  rule4: { loc: 'LAB', cam: c => { const a = lerp(-.45, .4, eio(c.p)); return { p: [Math.sin(a) * 5.0, .9, Math.cos(a) * 5.0], at: [0, .35, 0], fov: 38 }; },
    fx: c => { const u = LAB.userData, vac = c.ch(2) > 0 ? eio(c.ch(2) / 1.3) : 0, fl = 1 + .08 * Math.sin(c.t * 14); jar.visible = true; u.candle.position.y = -.5; u.candle.rotation.z = 0; u.ball.scale.setScalar(.001); u.gB.material.opacity = 0; u.flameO.scale.set(1 - vac, Math.max(fl * (1 - vac), .001), 1 - vac); u.flameI.scale.set(1 - vac, Math.max(fl * (1 - vac), .001), 1 - vac); u.gO.material.opacity = .9 * (1 - vac); u.lamp.intensity = 6 * (1 - vac); u.lamp.color.set('#ffb35a'); },
    ov: c => { const vac = c.ch(2) > 0 ? eio(c.ch(2) / 1.3) : 0, k = pop(c.lt, .2); return `<g transform="translate(288 836) scale(${k.toFixed(3)})"><rect x="-190" y="-30" width="380" height="60" rx="14" fill="#0b1020" stroke="#15151c" stroke-width="4"/><text x="-172" y="9" font-family="BarlowC" font-weight="800" font-size="24" fill="#9aa5b8" letter-spacing="2">AIR</text><rect x="-116" y="-12" width="230" height="24" rx="12" fill="#1f2a44"/><rect x="-116" y="-12" width="${f1(230 * (1 - vac))}" height="24" rx="12" fill="${vac > .7 ? RED : CYAN}"/><text x="176" y="9" text-anchor="end" font-family="Anton" font-size="26" fill="#fff">${Math.round(100 * (1 - vac))}%</text></g>` + (vac > .95 ? bigText(288, 600, 'VACUUM', 64, CYAN, pop(c.ch(2) - 1.25, 0, .3), -4) : ''); },
    chips: [{ type: 'rule', no: 'RULE #4', l1: "FIRE CAN'T BURN", l2: 'IN A VACUUM.', at: 1, bodyAt: 2 }] },
  plan: { loc: 'HOLO', cam: c => { const a = lerp(.35, -.35, eio(c.p)); return { p: [Math.sin(a) * 6.2, 3.7, Math.cos(a) * 6.2], at: [0, -.1, -.8], fov: 40 }; },
    fx: c => { const vent = c.ch(1) > 0 ? clamp(c.ch(1) / .3) : 0, dead = c.ch(3) > 0 ? eo(c.ch(3) / .6) : 0, r = rng(3); HU.fireM.material.opacity = (1 - dead) * (.8 + .2 * Math.sin(c.t * 9)); HU.fireCore.visible = dead < .98; HU.fireCore.scale.setScalar(Math.max(1 - dead, .01)); hJets.forEach((g) => { const age = (c.t * (.8 + r()) + r()) % 1; g.position.set(.45 + age * 3.2, (r() - .5) * age * 1.2, -.8 + (r() - .5) * age * 1.2); g.material.opacity = vent * (1 - age); }); meiDot.visible = true; const bad = c.ch(4) > 0; meiDot.material.color.set(bad ? '#ff3b30' : '#ffffff'); meiGlow.material.opacity = bad ? .5 + .5 * Math.sin(c.t * 12) : 0; },
    ov: c => { let o = ''; if (c.ch(1) > 0) { const q = project(world('HOLO', 2.2, .1, -.8)); o += bigText(q.x, q.y - 34, 'TO SPACE', 34, CYAN, pop(c.ch(1), .1)); } if (c.ch(3) > 0) o += pillSVG(288, 800, 'FIRE: OUT', GREEN, pop(c.ch(3), .1)); if (c.ch(4) > 0) o += pillSVG(288, 858, 'MEI: NO AIR', RED, pop(c.ch(4), .05)); return o; }, hitAt: 4, hit: .04 },
  vacuum15: { loc: 'SVC', cam: c => ({ p: P([.5, .4, 5.4], [.2, .4, 4.2], eio(c.p)), at: [0, .45, 1.5], fov: 40 }), fx: c => svcFire(c.t, 0, 1),
    set: c => [{ id: 'c6', p: [0, .05, 1.5], tint: [.62, .76, 1], o: { expr: c.p > .6 ? 'out' : 'determined', look: [0, 0] } }],
    ov: c => { const k = pop(c.ch(1), 0), rem = lerp(15, 0, clamp((c.ch(1)) / Math.max(c.d - (c.o.chunks[1].t0 - c.o.t0), .5))), R = 74, C = TAU * R; if (k <= 0) return ''; return `<g transform="translate(288 250) scale(${k.toFixed(3)})"><circle r="${R + 16}" fill="#0b1020" stroke="#15151c" stroke-width="5"/><circle r="${R}" fill="none" stroke="#1f2a44" stroke-width="13"/><circle r="${R}" fill="none" stroke="${rem < 5 ? RED : CYAN}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${f1(C * rem / 15)} ${f1(C)}" transform="rotate(-90)"/><text y="22" text-anchor="middle" font-family="Anton" font-size="64" fill="#fff">${Math.ceil(rem)}</text><text y="52" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="17" fill="#9aa5b8" letter-spacing="2">SECONDS</text></g>`; },
    chips: [{ type: 'real', text: 'IN A VACUUM YOU STAY CONSCIOUS ~15 SECONDS', at: 2, y: 390 }] },
  steps: { loc: 'HAB', cam: c => ({ p: P([0, .5, -8.6], [0, .4, -9.6], eio(c.p)), at: [0, .9, -17.4], fov: 42 }), fx: c => hatchBase(c),
    set: c => [{ id: 'ava', p: [-.85, .05, -17.5], o: { expr: 'determined', look: [.3, 0] } }, { id: 'teo', p: [.85, -.05, -17.3], o: { expr: 'determined', look: [-.3, 0] } }],
    ov: c => bigText(288, 196, '15 SECONDS', 70, RED, pop(c.ch(0), 0, .35), -3) + [['1', 'VENT'], ['2', 'OPEN'], ['3', 'PULL HER OUT']].map(([n, tx], i) => { const k = pop(c.ch(i + 1), 0, .3); if (k <= 0) return ''; const w = tx.length * 19 + 92; return `<g transform="translate(${96 + i * 14} ${262 + i * 66}) rotate(-2) scale(${k.toFixed(3)})"><rect width="${w}" height="54" rx="10" fill="#f6f3ea" stroke="#15151c" stroke-width="4.5"/><circle cx="30" cy="27" r="18" fill="${GOLD}" stroke="#15151c" stroke-width="3.5"/><text x="30" y="36" text-anchor="middle" font-family="Anton" font-size="26" fill="#15151c">${n}</text><text x="62" y="39" font-family="Anton" font-size="32" fill="#17171f" letter-spacing="1">${tx}</text></g>`; }).join('') },
  valve: { loc: 'HAB', cam: c => ({ p: P([-1.9, .5, -13.6], [-1.3, .45, -14.4], eio(c.p)), at: [2.2, .05, -18.1], fov: 42 }),
    fx: c => { hatchBase(c); const pull = c.che(3) > 0 ? eo(c.che(3) / .14) : 0; lever.rotation.x = lerp(-.55, 1.95, pull); if (pull > 0) { vLight.material.color.set('#ff3b3b'); vGlow.material.opacity = .6 + .4 * Math.sin(c.t * 20); } },
    set: c => { const pull = c.che(3) > 0 ? eo(c.che(3) / .14) : 0, g = eo(c.lt / .5); return [{ id: 'teo', p: [1.75, -.35, -18.5], o: { expr: pull ? 'shock' : 'determined', look: [.8, 0], sweat: 1, arms: { r: [lerp(108, 215, g), lerp(214, lerp(10, 120, pull), g)] } } }]; },
    ov: c => [3, 2, 1].map((n, i) => { const a = c.ch(i + 1), nx = i < 2 ? c.ch(i + 2) : c.che(3) - .1; if (a <= 0 || nx > 0) return ''; return bigText(288, 330, n, 250, n === 1 ? RED : '#fff', .55 + .45 * pop(a, 0, .25)); }).join(''),
    hitAt: 3, hitEnd: true, hit: .12, flashAt: 3, flashEnd: true },
  blast: { loc: 'EXT', cut: true, cam: c => ({ p: P([24, 2, -3], [38, 5, -5], eo(c.p)), at: [0, 7.5, 1.2], fov: 42, roll: lerp(.3, .18, c.p) }), hit: .25, flash: true,
    fx: c => { const fade = c.ch(2) > 0 ? 1 - clamp(c.ch(2) / .9) : 1, f = c.ch(1) > 0 ? Math.max(0, 1 - c.ch(1) / .9) : 1; ventFX(c.t * 1.6, f, fade * .9); EXT.userData.alert.material.opacity = f; } },
  wheel: { loc: 'HAB', dim: .45, cam: c => ({ p: P([-1.2, .45, -11.4], [-.6, .35, -12.6], eio(c.p)), at: [.3, 0, -19.6], fov: 42 }),
    fx: c => { alarmFX(c.t, .3); const op = c.ch(1) > 0 ? eo(c.ch(1) / .9) : 0; H.wheel.rotation.z = -Math.min(c.lt, c.ch(1) > 0 ? c.lt - c.ch(1) : c.lt) * 7; doorOpen(op); vaporFX(c.t, op); },
    set: c => [{ id: 'ava', p: [1.0, -.3, -18.6], o: { expr: 'determined', look: [-.8, 0], sweat: 1, arms: { l: [-190 + Math.sin(c.lt * 14) * 26, 150 + Math.cos(c.lt * 14) * 26] } } }], hitAt: 1, hit: .05 },
  meiOut: { loc: 'HAB', dim: .5, cam: c => ({ p: P([1.1, .7, -10.4], [.6, .55, -11.4], eio(c.p)), at: [0, .1, -18.2], fov: 42 }),
    fx: c => { alarmFX(c.t, .25); doorOpen(1); vaporFX(c.t, .9); },
    set: c => [{ id: 'c6', p: [lerp(-.1, .1, c.p), lerp(.1, .2, c.p), lerp(-19.3, -17.6, eo(c.p))], rot: 82, still: true, o: { expr: 'out' } }, { id: 'ava', p: [-1.3, -.9, -16.4], o: { expr: 'worry', look: [.6, -.6], arms: { r: [190, 60] } } }, { id: 'teo', p: [1.35, -1.0, -16.2], o: { expr: 'shock', look: [-.6, -.6] } }], tint: .12 },
  cough: { loc: 'HAB', dim: .4, cam: c => ({ p: P([0, .5, -13.6], [-.1, .45, -14.2], eio(c.p)), at: [-.15, .3, -17.6], fov: 36 }),
    fx: c => { alarmFX(c.t, .2); doorOpen(1); vaporFX(c.t, .5); }, kick: c => c.ch(1) > 0 ? Math.exp(-c.ch(1) * 9) * .05 : 0,
    set: c => { const up = c.ch(1) > 0 ? eo(c.ch(1) / .3) : 0; return [{ id: 'c6', p: [.1, .2 + up * .05, -17.6], rot: lerp(82, 58, up), still: !up, o: { expr: up ? 'cough' : 'out' } }].concat(up ? [{ id: 'biscuit', p: [.55, .95, -17.5], s: .5 * pop(c.ch(1), .25, .35), rot: -20 }] : []); },
    ov: c => { const a = c.ch(1); if (a <= 0 || a > .7) return ''; const q = project(world('HAB', -.25, .45, -17.5)); return [0, 1, 2, 3, 4].map(i => { const an = -2.6 + i * .32, d0 = 40 + a * 170, d1 = d0 + 40; return `<line x1="${f1(q.x + Math.cos(an) * d0)}" y1="${f1(q.y + Math.sin(an) * d0)}" x2="${f1(q.x + Math.cos(an) * d1)}" y2="${f1(q.y + Math.sin(an) * d1)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${(1 - a / .7).toFixed(2)}"/>`; }).join(''); } },
  six: { loc: 'HAB', dim: .2, cam: c => ({ p: P([0, .3, -7.4], [0, .25, -8.4], eio(c.p)), at: [0, .25, -16.6], fov: 44 }), fx: c => { alarmFX(c.t, .15); doorOpen(1); },
    set: c => [['ava', [-1.15, 1.0, -16.8], 'smile'], ['teo', [1.15, .95, -16.8], 'smile'], ['c3', [-1.2, -.95, -16.2], 'smile'], ['c4', [1.2, -1.0, -16.2], 'smile'], ['c5', [0, 1.15, -17.0], 'smile'], ['c6', [0, -.75, -16.0], 'worry']].map(([id, p, expr], i) => ({ id, p, s: pop(c.lt, i * .07, .3), o: { expr } })).concat([{ id: 'biscuit', p: [.62, -.2, -15.8], s: .42, rot: Math.sin(c.t) * 14 }]),
    ov: c => badge(288, 150, 6, GREEN, pop(c.lt, .4, .35) * 2.6) },
  stuck: { loc: 'HAB', cam: c => ({ p: P([-1.0, .4, -14.4], [-.5, .35, -15.0], eio(c.p)), at: [2.3, .05, -18.0], fov: 40 }), shake: .014,
    fx: c => { alarmFX(c.t, .6); lever.rotation.x = 1.95 - .13 * Math.abs(Math.sin(c.t * 10)); vLight.material.color.set('#ff3b3b'); vGlow.material.opacity = .6 + .4 * Math.sin(c.t * 20); doorOpen(1); },
    set: c => [{ id: 'teo', p: [1.75, -.35, -18.5], o: { expr: 'shock', look: [.8, 0], sweat: 1, arms: { r: [215, 120 + Math.sin(c.t * 10) * 8] } } }],
    ov: c => { const q = project(world('HAB', 2.75, .1, -17.2)), r = rng(Math.floor(c.t * 12)); let o = ''; for (let i = 0; i < 9; i++) { const a = r() * TAU, d = 20 + r() * 90; o += `<line x1="${f1(q.x)}" y1="${f1(q.y)}" x2="${f1(q.x + Math.cos(a) * d)}" y2="${f1(q.y + Math.sin(a) * d)}" stroke="${i % 2 ? GOLD : '#fff'}" stroke-width="${f1(2 + r() * 4)}" stroke-linecap="round"/>`; } return o + (c.ch(1) > 0 ? bigText(288, 250, 'STUCK', 96, RED, pop(c.ch(1), 0, .25), -8) : ''); }, hitAt: 1, hit: .06 },
  leaking: { loc: 'EXT', cam: c => ({ p: P([16, 7, -20], [30, 13, -30], eio(c.p)), at: [3, 0, 0], fov: 40 }), fx: c => { ventFX(c.t, 0, .85, 26); EXT.userData.alert.material.opacity = .5 + .5 * Math.sin(c.t * 8); }, flash: true,
    ov: c => { const v = Math.max(96.4 - c.lt * 1.3, 90), k = pop(c.ch(1), 0); return k <= 0 ? '' : `<g transform="translate(288 232) scale(${k.toFixed(3)})"><rect x="-150" y="-70" width="300" height="136" rx="16" fill="#0b1020" stroke="${RED}" stroke-width="4"/><text y="-34" text-anchor="middle" font-family="BarlowC" font-weight="800" font-size="22" fill="#9aa5b8" letter-spacing="2">STATION PRESSURE</text><text y="38" text-anchor="middle" font-family="Anton" font-size="64" fill="${Math.sin(c.t * 12) > 0 ? RED : '#fff'}">${v.toFixed(1)} kPa</text></g>`; } },
});
// how long Mei has been in vacuum, shown from the valve pull until she coughs
GLOBAL_OV.push((t) => {
  const ep = E.ep(), a = ep.shots.find(s => s.scene === 'valve'), b = ep.shots.find(s => s.scene === 'cough'); if (!a || !b) return '';
  const t0 = a.chunks[3].te ?? a.chunks[3].t0, t1 = b.chunks[1].t0; if (t < t0 || t > t1 + 1.2) return '';
  const done = t >= t1, sec = Math.min(t, t1) - t0, col = done ? GREEN : sec > 12 ? RED : GOLD, k = pop(t - t0, 0, .3), bl = done || Math.sin(t * 10) > -.2;
  return `<g transform="translate(288 92) scale(${k.toFixed(3)})"><rect x="-150" y="-26" width="300" height="52" rx="12" fill="#0b1020" stroke="${col}" stroke-width="3.5"/><circle cx="-124" cy="0" r="7" fill="${col}" opacity="${bl ? 1 : .25}"/><text x="-104" y="8" font-family="BarlowC" font-weight="800" font-size="23" fill="#cbd5e1" letter-spacing="1.5">MEI IN VACUUM</text><text x="134" y="10" text-anchor="end" font-family="Anton" font-size="30" fill="${col}">${sec.toFixed(1)}s</text></g>`;
});
// floating dust in the habitat, for depth
const motes = []; { const r = rng(91); for (let i = 0; i < 60; i++) { const g = sprite(TEX.glowY, .05 + r() * .05, true, .5); g.userData = { x: (r() - .5) * 4.6, y: (r() - .5) * 4.2, z: -20 + r() * 16, ph: r() * 6, sp: .2 + r() * .4 }; HAB.add(g); motes.push(g); } }
RESETS.push((c) => { motes.forEach(g => { const d = g.userData; g.position.set(d.x + Math.sin(c.t * d.sp + d.ph) * .3, d.y + Math.cos(c.t * d.sp * .8 + d.ph) * .25, d.z + Math.sin(c.t * d.sp * .5 + d.ph) * .4); }); });
window.__p3 = true;
