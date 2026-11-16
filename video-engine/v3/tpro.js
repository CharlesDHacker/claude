// "How I got TikTok Shop coupons with TikTok Pro": a creator in his LED-lit bedroom holding up his phone.
// The phone screen is a live canvas showing the real screenshots (balance, redemption history, QR reward card)
// plus drawn app screens (splash, daily check-in, event, coupons, profile highlights).
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
while (!window.__nosey || !window.ENG) await new Promise(r => setTimeout(r, 10));
const E = window.ENG;
const { THREE, LOC, loc, SHOTS, RESETS, GLOBAL_OV, canvasTex, TEX, sprite, project, P, lerp, clamp, eio, eo, rng } = E;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const sm = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const LIME = '#b8ec3c', GOLDC = '#ffd23c', MINT = '#3cff8a';
const isMine = () => { const e = E.ep(); return !!(e && e.series === 'TPRO'); };
const img = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const [IMG_HIST, IMG_QR, IMG_BAL] = await Promise.all(['assets/tpro/history.jpg', 'assets/tpro/qr.jpg', 'assets/tpro/balance.jpg'].map(img));

const R = loc('TPRO', 360000);
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .8, ...o });
const mesh = (geo, mat, x = 0, y = 0, z = 0, parent = R) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const boxm = (w, h, d, mat, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), typeof mat === 'string' ? std(mat) : mat, x, y, z, p);
const emis = (c, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });

// ================= ROOM =================
{
  const woodT = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#5a4030'; g.fillRect(0, 0, w, h); const r = rng(5); for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(25,${30 + r() * 10}%,${22 + r() * 8}%)`; g.fillRect(0, i * 64, w, 62); } for (let i = 0; i < 900; i++) { g.strokeStyle = 'rgba(0,0,0,.12)'; g.beginPath(); const y = r() * h; g.moveTo(0, y); g.lineTo(w, y + (r() - .5) * 6); g.stroke(); } });
  woodT.wrapS = woodT.wrapT = THREE.RepeatWrapping; woodT.repeat.set(3, 3);
  const floor = mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ map: woodT, roughness: .55 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2;
  const wallT = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#23263a'; g.fillRect(0, 0, w, h); const r = rng(9); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${r() * .025})`; g.fillRect(r() * w, r() * h, 2, 2); } });
  const wallM = new THREE.MeshStandardMaterial({ map: wallT, roughness: .95 });
  mesh(new THREE.PlaneGeometry(8, 3.2), wallM, 0, 1.6, -1.7);
  const sideL = mesh(new THREE.PlaneGeometry(6, 3.2), wallM, -2.3, 1.6, 1); sideL.rotation.y = Math.PI / 2;
  const sideR = mesh(new THREE.PlaneGeometry(6, 3.2), wallM, 2.3, 1.6, 1); sideR.rotation.y = -Math.PI / 2;
  const ceil = mesh(new THREE.PlaneGeometry(8, 8), std('#1a1c28'), 0, 2.7, 0); ceil.rotation.x = Math.PI / 2;
  // LED strips (purple along the back ceiling line, cyan behind the desk)
  boxm(4.6, .025, .025, emis('#b04cff', 2.2), 0, 2.62, -1.66); boxm(.025, .025, 5, emis('#b04cff', 2.2), -2.27, 2.62, 1);
  boxm(1.7, .02, .02, emis('#2ad8ff', 2), -1.25, .78, -1.64);
  const purple = new THREE.PointLight('#b04cff', 6, 6, 1.6); purple.position.set(0, 2.4, -1.3); R.add(purple);
  const purple2 = new THREE.PointLight('#d04cff', 3, 5, 1.6); purple2.position.set(-2, 2.3, .5); R.add(purple2);
  const cyanL = new THREE.PointLight('#2ad8ff', 3, 4, 1.6); cyanL.position.set(-1.3, 1.1, -1.2); R.add(cyanL);
  // key (ring light in front), rim from behind-right, soft ambient
  const key = new THREE.DirectionalLight('#fff4ea', 2.0); key.position.set(-.6, 1.9, 3); key.target.position.set(0, 1.4, 0); R.add(key, key.target);
  const rim = new THREE.DirectionalLight('#ff5ad8', 2.4); rim.position.set(1.4, 2.2, -2.2); rim.target.position.set(0, 1.4, 0); R.add(rim, rim.target);
  const rim2 = new THREE.DirectionalLight('#5ad8ff', 1.4); rim2.position.set(-1.6, 1.8, -2); rim2.target.position.set(0, 1.4, 0); R.add(rim2, rim2.target);
  R.add(new THREE.HemisphereLight('#8a90c8', '#2a2030', .55));
  R.userData.ring = sprite(TEX.glowY, .6, true, 0);
  // desk + monitor + keyboard + chair (back left)
  boxm(1.8, .05, .7, '#1b1b22', -1.25, .76, -1.3); [-2.05, -.45].forEach(x => boxm(.05, .74, .6, '#15151b', x, .38, -1.3));
  const monT = canvasTex(512, 288, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1a2a6c'); gr.addColorStop(.5, '#b21f8a'); gr.addColorStop(1, '#fdbb2d'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 6; i++) g.fillRect(30, 30 + i * 40, 200 + (i * 53) % 170, 18); });
  boxm(1.0, .58, .04, '#0b0b0f', -1.25, 1.18, -1.5); mesh(new THREE.PlaneGeometry(.96, .54), new THREE.MeshBasicMaterial({ map: monT, toneMapped: false }), -1.25, 1.18, -1.477);
  boxm(.06, .3, .06, '#0b0b0f', -1.25, .92, -1.52); boxm(.6, .02, .2, emis('#5a3cff', 1.2), -1.3, .79, -1.1);
  boxm(.5, .9, .1, '#1a1a1f', -1.0, .95, -.55); boxm(.5, .1, .5, '#1a1a1f', -1.0, .5, -.8);
  // shelf with little figures/plants (back right)
  boxm(1.1, .04, .26, '#2b2b35', 1.35, 1.55, -1.56); boxm(1.1, .04, .26, '#2b2b35', 1.35, 1.15, -1.56);
  [[1.0, 1.62, '#ff6b6b'], [1.25, 1.64, LIME], [1.55, 1.61, '#5ad8ff'], [1.15, 1.22, '#ffd23c'], [1.6, 1.24, '#e0e0e0']].forEach(([x, y, c], i) => { const o = mesh(i % 2 ? new THREE.CylinderGeometry(.05, .05, .14, 16) : new THREE.SphereGeometry(.06, 16, 12), std(c, { roughness: .4 }), x, y, -1.52); });
  const plant = mesh(new THREE.CylinderGeometry(.12, .09, .25, 16), std('#d8d2c4'), 1.9, .125, -1.3); for (let i = 0; i < 9; i++) { const lf = mesh(new THREE.SphereGeometry(.1, 10, 8), std('#2e7d3a'), 1.9 + Math.cos(i) * .12, .4 + (i % 3) * .12, -1.3 + Math.sin(i) * .12); lf.scale.set(.6, 1.6, .3); lf.rotation.z = Math.cos(i) * .6; }
  // posters
  const poster = (seed, x, y, w, h, hue) => { const t = canvasTex(256, 360, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, `hsl(${hue},70%,45%)`); gr.addColorStop(1, `hsl(${hue + 50},70%,20%)`); g.fillStyle = gr; g.fillRect(0, 0, W, H); const r = rng(seed); for (let i = 0; i < 5; i++) { g.fillStyle = `hsla(${hue + r() * 120},80%,65%,.8)`; g.beginPath(); g.arc(r() * W, r() * H, 20 + r() * 60, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(24, H - 70, W * .6, 14); g.fillRect(24, H - 46, W * .4, 10); });
    boxm(w + .04, h + .04, .02, '#0b0b0f', x, y, -1.69); mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .6 }), x, y, -1.675); };
  poster(1, -.25, 1.85, .5, .7, 280); poster(2, .45, 1.95, .42, .58, 190);
  // window with a night city (right back)
  const cityT = canvasTex(512, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a0f2a'); gr.addColorStop(1, '#3a1d4a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const r = rng(11); for (let i = 0; i < 26; i++) { const bw = 20 + r() * 40, bh = 120 + r() * 300, x = r() * w; g.fillStyle = '#070912'; g.fillRect(x, h - bh, bw, bh); for (let j = 0; j < bh / 14; j++) for (let k = 0; k < bw / 10; k++) if (r() < .35) { g.fillStyle = r() < .7 ? '#ffd890' : '#9fd8ff'; g.fillRect(x + 3 + k * 10, h - bh + 6 + j * 14, 4, 6); } } });
  mesh(new THREE.PlaneGeometry(.9, 1.1), new THREE.MeshBasicMaterial({ map: cityT, toneMapped: false }), 2.28, 1.6, -.7).rotation.y = -Math.PI / 2;
  [-.25, .2].forEach(dz => boxm(.04, 1.16, .04, '#111', 2.27, 1.6, -.7 + dz * 2.2)); boxm(.04, .04, .96, '#111', 2.27, 1.6, -.7);
  // bed corner (right)
  boxm(1.3, .4, 2, std('#3a3550'), 1.75, .2, .8); boxm(1.3, .12, 2, std('#6a5aa0', { roughness: 1 }), 1.75, .46, .8); boxm(.6, .14, .4, std('#e8e4f0', { roughness: 1 }), 1.75, .58, -.05);
}

// ================= THE GUY =================
const SKIN = std('#d9a27c', { roughness: .62 }), SKIN2 = std('#c48c68', { roughness: .7 }), HAIR = std('#1e140e', { roughness: .85 });
const HOOD = std('#17181f', { roughness: .92 }), HOOD2 = std('#22242e', { roughness: .92 }), JEANS = std('#2d3a55', { roughness: .9 }), SHOE = std('#f2f2f2', { roughness: .5 });
const WHITE = std('#f6f4f0', { roughness: .25 }), IRIS = std('#3a2414', { roughness: .2 }), PUP = std('#050505', { roughness: .1 }), LIP = std('#a8665a', { roughness: .5 }), MOUTH = std('#3a1212', { roughness: .9 });
const G = new THREE.Group(); R.add(G); const J = {};
{
  // legs + shoes
  [-1, 1].forEach(s => { const l = mesh(new THREE.CapsuleGeometry(.075, .72, 6, 16), JEANS, s * .1, .48, 0, G); l.scale.z = 1.05; mesh(new THREE.CapsuleGeometry(.06, .14, 6, 12), SHOE, s * .1, .06, .06, G).rotation.x = Math.PI / 2; });
  mesh(new THREE.CapsuleGeometry(.15, .06, 8, 20), JEANS, 0, .86, 0, G).scale.set(1.12, 1, .78);
  // torso (hoodie) as a body group so it can sway
  const body = new THREE.Group(); body.position.y = .9; G.add(body); J.body = body;
  const torso = mesh(new THREE.CapsuleGeometry(.165, .36, 10, 24), HOOD, 0, .3, 0, body); torso.scale.set(1.1, 1, .7);
  const pocket = mesh(new RoundedBoxGeometry(.22, .1, .02, 3, .01), HOOD2, 0, .16, .112, body); pocket.rotation.x = -.12;
  const hood = mesh(new THREE.TorusGeometry(.1, .045, 12, 24), HOOD2, 0, .58, -.05, body); hood.rotation.x = Math.PI / 2 - .3; hood.scale.set(1.35, 1, 1);
  [-1, 1].forEach(s => { const st = mesh(new THREE.CylinderGeometry(.006, .006, .2, 6), std(LIME), s * .04, .44, .118, body); st.rotation.x = -.12; mesh(new THREE.SphereGeometry(.01, 8, 6), std(LIME), s * .04, .34, .128, body); });
  const logo = mesh(new THREE.CircleGeometry(.028, 24), std(LIME, { emissive: LIME, emissiveIntensity: .25 }), .085, .47, .113, body); logo.rotation.x = -.1;
  [-1, 1].forEach(s => { const sh = mesh(new THREE.SphereGeometry(.07, 16, 12), HOOD, s * .17, .52, 0, body); sh.scale.set(1, .8, .9); });
  // neck + head
  const neck = new THREE.Group(); neck.position.set(0, .62, 0); body.add(neck); J.neck = neck;
  mesh(new THREE.CylinderGeometry(.052, .058, .12, 16), SKIN, 0, .04, 0, neck);
  const head = new THREE.Group(); head.position.y = .14; head.scale.setScalar(1.25); neck.add(head); J.head = head;
  const skull = mesh(new THREE.SphereGeometry(.105, 40, 30), SKIN, 0, .02, 0, head); skull.scale.set(.93, 1.12, 1.02);
  const jawM = mesh(new THREE.SphereGeometry(.088, 32, 24), SKIN, 0, -.045, .018, head); jawM.scale.set(.92, .82, 1.0);
  
  [-1, 1].forEach(s => { const ear = mesh(new THREE.SphereGeometry(.026, 16, 12), SKIN2, s * .096, .0, -.005, head); ear.scale.set(.45, 1.1, .8); });
  const nose = mesh(new THREE.SphereGeometry(.014, 16, 12), SKIN, 0, -.01, .102, head); nose.scale.set(1.15, .85, .9);
  // hair: short textured top with a soft quiff, tight sides
  const hairTop = mesh(new THREE.SphereGeometry(.113, 36, 24, 0, Math.PI * 2, 0, Math.PI * .42), HAIR, 0, .03, -.01, head); hairTop.scale.set(.97, 1.16, 1.06); hairTop.rotation.x = -.38;
  const r = rng(21); for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, b = r() * .55, tuft = mesh(new THREE.SphereGeometry(.034, 12, 10), HAIR, Math.sin(a) * Math.sin(b) * .07, .125 + Math.cos(b) * .02, Math.cos(a) * Math.sin(b) * .07 - .005, head); tuft.scale.set(1, .5, 1); tuft.rotation.set(r() * .5, r() * 3, r() * .5); }
  [[-.03, .14, .05], [.0, .148, .058], [.032, .14, .05]].forEach(([x, y, z]) => { const q = mesh(new THREE.SphereGeometry(.036, 14, 10), HAIR, x, y, z, head); q.scale.set(1, .55, .9); q.rotation.x = -.35; });
  [-1, 1].forEach(s => { const sd = mesh(new THREE.SphereGeometry(.05, 14, 10), HAIR, s * .082, .06, -.02, head); sd.scale.set(.35, .8, 1.1); });
  // eyes, lids, brows
  const flat = (r, mat, z, parent, x = 0, y = 0) => mesh(new THREE.CircleGeometry(r, 24), mat, x, y, z, parent);
  J.eyes = [-1, 1].map(s => { const eg = new THREE.Group(); eg.position.set(s * .037, .018, .084); head.add(eg);
    const w = mesh(new THREE.SphereGeometry(.02, 24, 18), WHITE, 0, 0, 0, eg); w.scale.set(1.1, .95, 1);
    const ir = new THREE.Group(); ir.position.z = .0196; eg.add(ir); flat(.0105, new THREE.MeshStandardMaterial({ color: '#4a2c16', roughness: .3 }), 0, ir); flat(.0058, new THREE.MeshBasicMaterial({ color: '#050505' }), .0003, ir); flat(.0022, new THREE.MeshBasicMaterial({ color: '#ffffff' }), .0006, ir, .0035, .0035);
    const lid = mesh(new THREE.SphereGeometry(.0215, 20, 12, 0, Math.PI * 2, 0, Math.PI * .32), SKIN, 0, 0, 0, eg); lid.scale.set(1.12, 1, 1.05); lid.rotation.x = .25;
    const brow = mesh(new THREE.CapsuleGeometry(.0052, .03, 4, 8), HAIR, 0, .03, .014, eg); brow.rotation.z = Math.PI / 2 + s * .1;
    return { eg, ir, lid, brow, s }; });
  // mouth: lips line + open cavity + teeth
  const mouth = new THREE.Group(); mouth.position.set(0, -.052, .093); head.add(mouth); J.mouth = mouth;
  J.cav = mesh(new THREE.SphereGeometry(.019, 20, 12), MOUTH, 0, -.004, 0, mouth); J.cav.scale.set(1.1, .1, .4);
  J.teeth = mesh(new THREE.BoxGeometry(.03, .007, .006), std('#f4f0e8', { roughness: .3 }), 0, .003, .006, mouth);
  J.lip = mesh(new THREE.TorusGeometry(.021, .0038, 8, 24, Math.PI * .7), LIP, 0, .012, .004, mouth); J.lip.rotation.z = Math.PI * 1.15;
  J.lower = mesh(new THREE.CapsuleGeometry(.0042, .02, 4, 8), LIP, 0, -.01, .004, mouth); J.lower.rotation.z = Math.PI / 2; J.lower.visible = false;
  // arms: segments repositioned every frame by IK
  const seg = (rad, mat) => { const m = mesh(new THREE.CylinderGeometry(rad, rad * .9, 1, 18), mat, 0, 0, 0, R); return m; };
  J.arm = [-1, 1].map(s => ({ s, up: seg(.06, HOOD), lo: seg(.05, HOOD), el: mesh(new THREE.SphereGeometry(.058, 14, 10), HOOD, 0, 0, 0, R), cuff: mesh(new THREE.CylinderGeometry(.046, .046, .04, 16), HOOD2, 0, 0, 0, R), hand: (() => {
    const h = new THREE.Group(); R.add(h); const palm = mesh(new RoundedBoxGeometry(.068, .075, .026, 3, .011), SKIN, 0, -.035, 0, h);
    const fingers = new THREE.Group(); fingers.position.set(0, -.08, 0); h.add(fingers); for (let i = 0; i < 4; i++) mesh(new THREE.CapsuleGeometry(.0085, .04 - Math.abs(i - 1.5) * .006, 4, 8), SKIN, -.024 + i * .016, -.022, 0, fingers);
    const thumb = mesh(new THREE.CapsuleGeometry(.011, .04, 4, 8), SKIN, -s * .042, -.03, .012, h); thumb.rotation.z = s * .7;
    h.userData = { fingers, thumb }; return h; })() }));
}
// phone (held in the right hand), screen = live canvas
const SCR = document.createElement('canvas'); SCR.width = 600; SCR.height = 1300; const SG = SCR.getContext('2d');
const scrTex = new THREE.CanvasTexture(SCR); scrTex.colorSpace = THREE.SRGBColorSpace; scrTex.anisotropy = 8;
const PHONE = new THREE.Group(); R.add(PHONE);
mesh(new RoundedBoxGeometry(.074, .155, .0085, 6, .009), std('#1c1d22', { metalness: .6, roughness: .3 }), 0, 0, 0, PHONE);
const screen = mesh(new THREE.PlaneGeometry(.0695, .1505), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false }), 0, 0, .0044, PHONE);
const cams = mesh(new RoundedBoxGeometry(.03, .03, .004, 3, .006), std('#2a2b30', { metalness: .6, roughness: .3 }), -.017, .055, -.0055, PHONE);
const SCREEN_W = .0695, SCREEN_H = .1505;

// ================= SCREEN DRAWING =================
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const font = (w, s) => `${w} ${s}px Inter`;
function coin(g, x, y, r) { const gr = g.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); gr.addColorStop(0, '#d8ff70'); gr.addColorStop(1, '#4caf1c'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = '#2f7a10'; g.lineWidth = r * .12; g.stroke();
  g.fillStyle = '#fffbe0'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .27 : r * .6; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fill(); }
function statusBar(g, dark) { g.fillStyle = dark ? '#fff' : '#111'; g.font = font(600, 26); g.fillText('9:41', 40, 50); rr(g, 500, 30, 50, 24, 6); g.lineWidth = 2.5; g.strokeStyle = g.fillStyle; g.stroke(); g.fillRect(504, 34, 34, 16); for (let i = 0; i < 4; i++) g.fillRect(420 + i * 12, 50 - i * 6, 8, 6 + i * 6); }
function scrApp(g, t, k) { g.fillStyle = '#060608'; g.fillRect(0, 0, 600, 1300); const gl = g.createRadialGradient(300, 520, 10, 300, 520, 420); gl.addColorStop(0, 'rgba(184,236,60,.35)'); gl.addColorStop(1, 'rgba(184,236,60,0)'); g.fillStyle = gl; g.fillRect(0, 0, 600, 1300); statusBar(g, 1);
  const s = 1 + .04 * Math.sin(t * 3); coin(g, 300, 500, 120 * s); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = font(800, 64); g.fillText('TikTok Pro', 300, 740); g.font = font(600, 28); g.fillStyle = '#b8bcc8'; g.fillText('Rewards for using TikTok', 300, 790);
  const a = clamp(k); g.globalAlpha = a; rr(g, 110, 860, 380, 80, 40); g.fillStyle = '#1b1d22'; g.fill(); g.fillStyle = LIME; g.beginPath(); g.arc(160, 900, 18, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 5; g.beginPath(); g.moveTo(151, 900); g.lineTo(158, 908); g.lineTo(170, 892); g.stroke();
  g.fillStyle = '#fff'; g.font = font(600, 26); g.textAlign = 'left'; g.fillText('Linked to your TikTok', 192, 910); g.globalAlpha = 1; g.textAlign = 'left'; }
function scrBalance(g, t) { g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1); g.fillStyle = '#fff'; g.font = font(800, 40); g.fillText('TikTok Pro', 40, 140); coin(g, 540, 126, 26);
  if (IMG_BAL) { const sc = 600 / 704; g.drawImage(IMG_BAL, 0, 238, 704, 240, 0, 190, 600, 240 * sc); }
  g.fillStyle = '#fff'; g.font = font(800, 32); g.fillText('Redeem', 40, 470);
  const tiles = [['TikTok Shop', 'coupon', '#ff2f6a'], ['TikTok Shop', 'coupon', '#ff8a2f'], ['Gift card', 'Amazon & more', '#2f9bff'], ['TikTok Shop', 'coupon', LIME]];
  tiles.forEach(([a, b, c], i) => { const x = 40 + (i % 2) * 270, y = 500 + Math.floor(i / 2) * 300; rr(g, x, y, 250, 280, 26); g.fillStyle = '#1b1d24'; g.fill(); rr(g, x + 20, y + 20, 210, 150, 18); const gr = g.createLinearGradient(x, y, x + 250, y + 170); gr.addColorStop(0, c); gr.addColorStop(1, '#1b1d24'); g.fillStyle = gr; g.fill();
    g.fillStyle = '#fff'; g.font = font(800, 40); g.fillText(i === 2 ? 'GIFT' : '% OFF', x + 40, y + 115); g.font = font(800, 26); g.fillText(a, x + 22, y + 215); g.fillStyle = '#9aa0ae'; g.font = font(600, 22); g.fillText(b, x + 22, y + 250); });
  rr(g, 40, 1130, 520, 90, 45); g.fillStyle = LIME; g.fill(); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = font(800, 32); g.fillText('Redeem Stars', 300, 1188); g.textAlign = 'left'; }
const HIST_ROWS = 9, HIST_Y = 170, HSC = 600 / 1170;
function scrHistory(g, t, hl, all) { g.fillStyle = '#f8f8f8'; g.fillRect(0, 0, 600, 1300); statusBar(g, 0); g.fillStyle = '#111'; g.font = font(800, 38); g.fillText('Stars history', 40, 135);
  if (IMG_HIST) g.drawImage(IMG_HIST, 0, 0, 1170, 2001, 0, HIST_Y, 600, 2001 * HSC);
  const rowH = 2001 / HIST_ROWS * HSC; const box = (i, col, a) => { g.globalAlpha = a; g.lineWidth = 9; g.strokeStyle = col; rr(g, 12, HIST_Y + i * rowH + 6, 576, rowH - 12, 18); g.stroke(); g.fillStyle = col; g.globalAlpha = a * .16; g.fill(); g.globalAlpha = 1; };
  if (hl) { box(hl[0], '#12c24a', hl[1]); box(hl[0], '#12c24a', hl[1] * .6); } if (all > 0) for (let i = 2; i < 9; i++) box(i, '#18b84a', clamp(all * 3 - (i - 2) * .25)); }
function scrQR(g, t, pulse) { g.fillStyle = '#000'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1); g.fillStyle = '#fff'; g.font = font(800, 36); g.textAlign = 'center'; g.fillText('Invite rewards', 300, 135); g.textAlign = 'left';
  if (IMG_QR) { const sc = 600 / 1170, y0 = 220; g.drawImage(IMG_QR, 0, 0, 1170, 1438, 0, y0, 600, 1438 * sc); g.fillStyle = '#000'; g.fillRect(0, y0, 58, 100); g.fillRect(540, y0, 60, 90);
    if (pulse > 0) { g.globalAlpha = pulse * (.6 + .4 * Math.sin(t * 8)); g.lineWidth = 7; g.strokeStyle = LIME; rr(g, 60, y0 + 15, 480, 200, 34); g.stroke(); g.globalAlpha = 1; } } }
function scrProfile(g, t, k) { g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1);
  g.fillStyle = '#2a2d36'; g.beginPath(); g.arc(300, 260, 90, 0, 7); g.fill(); g.fillStyle = '#4a4e5a'; g.beginPath(); g.arc(300, 235, 36, 0, 7); g.fill(); g.beginPath(); g.ellipse(300, 315, 60, 38, 0, Math.PI, 0); g.fill();
  rr(g, 200, 380, 200, 26, 13); g.fillStyle = '#3a3e4a'; g.fill(); [['Following', 160], ['Followers', 300], ['Likes', 440]].forEach(([s, x]) => { rr(g, x - 40, 430, 80, 30, 8); g.fillStyle = '#2a2d36'; g.fill(); g.fillStyle = '#9aa0ae'; g.font = font(600, 20); g.textAlign = 'center'; g.fillText(s, x, 490); });
  g.fillStyle = '#fff'; g.font = font(800, 28); g.textAlign = 'left'; g.fillText('Highlights', 40, 580);
  [['QR CODE', LIME, 1], ['Coupons', '#ff8a2f', 0], ['Tips', '#2f9bff', 0], ['Hauls', '#ff2f6a', 0]].forEach(([s, c, on], i) => { const x = 95 + i * 137, y = 680, p = on ? 1 + .08 * Math.sin(t * 7) * clamp(k) : 1;
    g.lineWidth = 7; g.strokeStyle = on ? c : '#3a3e4a'; g.beginPath(); g.arc(x, y, 52 * p, 0, 7); g.stroke(); g.fillStyle = '#1b1d24'; g.beginPath(); g.arc(x, y, 44 * p, 0, 7); g.fill();
    if (on) { g.fillStyle = '#fff'; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if ((a + b) % 2 === 0 || a === b) g.fillRect(x - 24 + a * 17, y - 24 + b * 17, 13, 13); } else coin(g, x, y, 22);
    g.fillStyle = on ? c : '#c8ccd6'; g.font = font(800, 22); g.textAlign = 'center'; g.fillText(s, x, y + 90); });
  g.textAlign = 'left'; for (let i = 0; i < 6; i++) { const x = (i % 3) * 200, y = 820 + Math.floor(i / 3) * 260; g.fillStyle = `hsl(${250 + i * 25},30%,${18 + (i % 2) * 6}%)`; g.fillRect(x + 2, y, 196, 256); } }
function scrCheckin(g, t, k) { g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1); g.fillStyle = '#fff'; g.font = font(800, 40); g.fillText('Daily check-in', 40, 150); g.fillStyle = '#9aa0ae'; g.font = font(600, 24); g.fillText('Open the app every day', 40, 195);
  for (let i = 0; i < 7; i++) { const x = 40 + (i % 4) * 133, y = 250 + Math.floor(i / 4) * 230, done = i < 4, today = i === 4, a = today ? clamp(k * 2) : 0; rr(g, x, y, 120, 200, 20); g.fillStyle = done ? '#1f2a14' : today ? `rgba(184,236,60,${.15 + .2 * a})` : '#1b1d24'; g.fill(); if (today) { g.lineWidth = 4; g.strokeStyle = LIME; g.stroke(); }
    g.fillStyle = '#c8ccd6'; g.font = font(600, 22); g.textAlign = 'center'; g.fillText(`Day ${i + 1}`, x + 60, y + 40); coin(g, x + 60, y + 105, 32); if (done) { g.strokeStyle = LIME; g.lineWidth = 7; g.beginPath(); g.moveTo(x + 40, y + 160); g.lineTo(x + 56, y + 176); g.lineTo(x + 84, y + 146); g.stroke(); } g.textAlign = 'left'; }
  rr(g, 40, 780, 520, 100, 50); g.fillStyle = LIME; g.fill(); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = font(800, 34); g.fillText(k > .4 ? 'Checked in ✓' : 'Check in', 300, 843); g.textAlign = 'left';
  for (let i = 0; i < 3; i++) { rr(g, 40, 930 + i * 110, 520, 90, 20); g.fillStyle = '#1b1d24'; g.fill(); coin(g, 95, 975 + i * 110, 24); g.fillStyle = '#fff'; g.font = font(600, 26); g.fillText(['Watch videos', 'Play a game', 'Spin the wheel'][i], 140, 985 + i * 110); } }
function scrEvent(g, t, k) { g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1); g.fillStyle = '#fff'; g.font = font(800, 40); g.fillText('Events', 40, 150);
  rr(g, 30, 190, 540, 420, 34); const gr = g.createLinearGradient(30, 190, 570, 610); gr.addColorStop(0, '#6a2cff'); gr.addColorStop(1, '#ff4c8a'); g.fillStyle = gr; g.fill();
  rr(g, 60, 220, 250, 50, 25); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill(); g.fillStyle = '#fff'; g.font = font(800, 24); const sec = Math.max(0, 75920 - Math.floor(t)), hh = String(Math.floor(sec / 3600)).padStart(2, '0'), mm = String(Math.floor(sec / 60) % 60).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0'); g.fillText(`⏱ ${hh}:${mm}:${ss}`, 82, 254);
  g.font = font(800, 48); g.fillText('Limited-time', 60, 350); g.fillText('event', 60, 408); g.font = font(600, 26); g.fillText('Bonus Stars for a few days only', 60, 460);
  coin(g, 470, 380, 70 + 6 * Math.sin(t * 5)); rr(g, 60, 500, 200, 70, 35); g.fillStyle = LIME; g.fill(); g.fillStyle = '#111'; g.font = font(800, 30); g.textAlign = 'center'; g.fillText('Join', 160, 546); g.textAlign = 'left';
  for (let i = 0; i < 4; i++) { rr(g, 30, 650 + i * 140, 540, 120, 24); g.fillStyle = '#1b1d24'; g.fill(); coin(g, 95, 710 + i * 140, 30); g.fillStyle = '#fff'; g.font = font(700, 28); g.fillText(['Spin to win', 'Mini game', 'Weekly challenge', 'Bonus task'][i], 145, 702 + i * 140); g.fillStyle = '#9aa0ae'; g.font = font(600, 22); g.fillText('Ends soon', 145, 738 + i * 140); } }
function scrCoupons(g, t, k) { g.fillStyle = '#0d0e12'; g.fillRect(0, 0, 600, 1300); statusBar(g, 1); g.fillStyle = '#fff'; g.font = font(800, 40); g.fillText('Shop coupons', 40, 150);
  const L = [['$5', '#ff2f6a', 0], ['$10', '#ff8a2f', 0], ['$20', '#2f9bff', 0], ['$50', LIME, 1]];
  L.forEach(([v, c, best], i) => { const y = 200 + i * 250, a = best ? clamp(k * 2) : 0; rr(g, 30, y, 540, 220, 28); g.fillStyle = '#1b1d24'; g.fill(); if (best) { g.lineWidth = 6; g.strokeStyle = LIME; g.globalAlpha = .4 + .6 * a; g.stroke(); g.globalAlpha = 1; }
    rr(g, 50, y + 20, 180, 180, 22); const gr = g.createLinearGradient(50, y, 230, y + 200); gr.addColorStop(0, c); gr.addColorStop(1, '#1b1d24'); g.fillStyle = gr; g.fill(); g.fillStyle = '#fff'; g.font = font(800, 56); g.textAlign = 'center'; g.fillText(v, 140, y + 128); g.textAlign = 'left';
    g.font = font(800, 32); g.fillText(`${v} off`, 260, y + 85); g.fillStyle = '#9aa0ae'; g.font = font(600, 24); g.fillText('TikTok Shop coupon', 260, y + 125);
    if (best) { rr(g, 260, y + 145, 190, 46, 23); g.fillStyle = LIME; g.globalAlpha = .5 + .5 * a; g.fill(); g.globalAlpha = 1; g.fillStyle = '#111'; g.font = font(800, 22); g.fillText('BEST VALUE', 282, y + 176); } }); }
function drawScreen(mode, t, a = {}) {
  SG.save(); SG.textAlign = 'left';
  ({ app: scrApp, balance: scrBalance, history: scrHistory, qr: scrQR, profile: scrProfile, checkin: scrCheckin, event: scrEvent, coupons: scrCoupons })[mode](SG, t, ...(a.args || []));
  // glass sheen
  const gr = SG.createLinearGradient(0, 0, 600, 1300); gr.addColorStop(0, 'rgba(255,255,255,.07)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); SG.fillStyle = gr; SG.fillRect(0, 0, 600, 1300);
  SG.restore(); scrTex.needsUpdate = true;
}

// ================= POSING =================
const STATES = {   // phone pos/rot (local to room), left-hand target, head yaw/pitch, body yaw
  show: { pp: [.09, 1.34, .34], pr: [-.06, -.22, .05], lh: [-.22, .98, .14], hy: .05, hp: 0, by: -.08 },
  thrust: { pp: [.06, 1.38, .5], pr: [-.04, -.02, 0], lh: [-.22, .98, .14], hy: 0, hp: -.05, by: -.04 },
  look: { pp: [.08, 1.24, .3], pr: [-1.75, 0, 0], lh: [-.24, 1.0, .16], hy: 0, hp: .38, by: 0 },
  point: { pp: [.1, 1.34, .34], pr: [-.06, -.22, .05], lh: [.09, 1.32, .36], hy: -.05, hp: .02, by: -.1 },
  shrug: { pp: [.24, 1.18, .24], pr: [-.25, -.3, .1], lh: [-.38, 1.22, .22], hy: .08, hp: -.04, by: 0 },
  wave: { pp: [.2, 1.24, .26], pr: [-.15, -.2, .05], lh: [-.34, 1.68, .18], hy: 0, hp: -.03, by: .05 },
  count: { pp: [.22, 1.2, .26], pr: [-.25, -.25, .05], lh: [-.18, 1.38, .3], hy: .04, hp: 0, by: -.05 },
};
const st = n => STATES[n];
const mixState = (a, b, k) => { const o = {}; for (const key in a) o[key] = Array.isArray(a[key]) ? P(a[key], b[key], k) : lerp(a[key], b[key], k); return o; };
// per chunk sequence: [state, cam, screen]; blended over .45 s at each chunk start
function seqAt(c, list, key) { let cur = list[0][key], prev = cur, kk = 1; for (let i = 0; i < list.length; i++) { const a = c.ch(i); if (a >= 0 && i > 0) { prev = list[i - 1][key]; cur = list[i][key]; kk = eio(clamp(a / .45)); } else if (i === 0) cur = list[0][key]; } return { prev, cur, k: kk }; }
const SEQ = {};
const qY = new THREE.Quaternion(), up = V(0, 1, 0);
function place(m, a, b, extra = 0) { const d = b.clone().sub(a), L = d.length(); m.position.copy(a).add(b).multiplyScalar(.5); m.scale.set(1, L + extra, 1); m.quaternion.setFromUnitVectors(up, d.normalize()); }
function poseGuy(t, S, talk) {
  const B = J.body; B.rotation.y = S.by + Math.sin(t * .6) * .025; B.rotation.z = Math.sin(t * .9) * .012; B.position.y = .9 + Math.sin(t * 1.8) * .003;
  const nod = talk.on ? Math.sin(t * 7.3) * .025 * talk.amt : 0;
  J.head.rotation.set(S.hp + nod + Math.sin(t * .7) * .015, S.hy + Math.sin(t * .5) * .03, Math.sin(t * .8) * .02 + (talk.hi ? .04 : 0));
  // mouth
  const op = talk.open; J.cav.visible = op > .02; J.cav.scale.y = .1 + op * .75; J.cav.position.y = -.002 - op * .007; J.lower.visible = op > .02; J.lower.position.y = -.004 - op * .014; J.teeth.visible = op > .3; J.teeth.position.y = .0; J.lip.visible = op <= .02;
  // eyes: blink, look, brows
  const bl = (t % 3.7) < .12 ? 1 - Math.abs((t % 3.7) - .06) / .06 : 0, lookDown = S.hp > .25;
  J.eyes.forEach(e => { e.eg.scale.y = 1 - bl * .9; e.ir.position.set(0, lookDown ? -.006 : 0, .0196 - (lookDown ? .002 : 0)); e.lid.rotation.x = lookDown ? .7 : .25; e.brow.position.y = .03 + talk.brow * .004; });
  // phone
  PHONE.position.set(...S.pp); PHONE.rotation.set(S.pr[0], S.pr[1], S.pr[2]); PHONE.position.y += Math.sin(t * 1.3) * .004; PHONE.updateMatrixWorld(true); G.updateMatrixWorld(true);
  // arms (2-bone IK); right wrist grips the phone's lower right edge, left goes to its target
  const tmp = new THREE.Vector3();
  J.arm.forEach(A => { const sh = V(0, 0, 0); B.localToWorld(sh.set(A.s * .18, .52, 0)); R.worldToLocal(sh);
    let T; if (A.s > 0) { T = PHONE.localToWorld(V(.036, -.058, -.016)); R.worldToLocal(T); } else T = V(...S.lh);
    const la = .3, lb = .27, d = T.clone().sub(sh), dist = Math.min(d.length(), (la + lb) * .995), dir = d.normalize(); const x = (la * la - lb * lb + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(la * la - x * x, 0));
    const pole = V(A.s * .55, -1, -.35).normalize(); pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize(); const el = sh.clone().add(dir.clone().multiplyScalar(x)).add(pole.multiplyScalar(h)); const wr = sh.clone().add(dir.multiplyScalar(dist));
    place(A.up, sh, el, .04); place(A.lo, el, wr); A.el.position.copy(el); A.cuff.position.copy(wr.clone().sub(el).normalize().multiplyScalar(-.02).add(wr)); A.cuff.quaternion.copy(A.lo.quaternion);
    const H = A.hand; H.position.copy(wr);
    if (A.s > 0) { H.quaternion.copy(PHONE.quaternion); H.rotateZ(Math.PI - .75); H.translateZ(-.006); H.userData.fingers.rotation.x = -1.35; H.userData.fingers.position.z = -.004; H.userData.thumb.position.set(-.035, -.045, .022); H.userData.thumb.rotation.set(0, 0, .2); }
    else { H.quaternion.copy(A.lo.quaternion); H.rotateY(Math.PI); H.userData.fingers.rotation.x = (S.lh[1] > 1.3 ? -.15 : -.45); }
    tmp.copy(wr); });
}
function talkAt(t) { const W = E.ep().words || []; let w = null, hiOn = false; for (const x of W) { if (t >= x.start && t < x.end) { w = x; break; } }
  const on = !!w, open = on ? .25 + .75 * Math.abs(Math.sin((t - w.start) * 17 + w.start * 3)) * clamp((w.end - t) / .05) : 0;
  return { on, open, amt: 1, smile: .6, hi: false, brow: on ? .5 : 0 }; }

// ================= CAMERA =================
const CAMS = {
  med: () => ({ p: [.02, 1.56, 2.55], at: [.02, 1.5, 0], fov: 38 }),
  close: () => ({ p: [.05, 1.58, 1.95], at: [.04, 1.53, 0], fov: 38 }),
  wide: () => ({ p: [-.35, 1.45, 3.1], at: [0, 1.25, 0], fov: 42 }),
  phone: (d = .3) => { const c = PHONE.localToWorld(V(0, -.012, 0)), n = PHONE.localToWorld(V(0, -.012, d)); R.worldToLocal(c); R.worldToLocal(n); const upv = PHONE.localToWorld(V(0, 1, 0)).sub(PHONE.getWorldPosition(V(0, 0, 0))).normalize();
    return { p: [n.x, n.y, n.z], at: [c.x, c.y + .02, c.z], fov: 38, roll: -Math.atan2(upv.x, upv.y) * .0 }; },
  phoneFar: () => CAMS.phone(.42),
};
const camOf = n => typeof n === 'function' ? n() : CAMS[n]();
function camBlend(c, list) { const s = seqAt(c, list, 1), a = camOf(s.prev), b = camOf(s.cur); return { p: P(a.p, b.p, s.k), at: P(a.at, b.at, s.k), fov: lerp(a.fov, b.fov, s.k), roll: 0 }; }
// slow push-in on top of every camera
const push = (cm, c, amt = .06) => { const k = c.p * amt; const d = [cm.at[0] - cm.p[0], cm.at[1] - cm.p[1], cm.at[2] - cm.p[2]]; return { ...cm, p: [cm.p[0] + d[0] * k, cm.p[1] + d[1] * k, cm.p[2] + d[2] * k] }; };

// ================= OVERLAYS =================
const f1 = n => (+n).toFixed(1);
const pill = (x, y, txt, col, k, size = 22) => { if (k <= 0) return ''; const sc = Math.min(1, E.spring(k / .3 * .9)), w = txt.length * size * .62 + 40; return `<g transform="translate(${x} ${y}) scale(${sc.toFixed(3)})" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,.55))"><rect x="${-w / 2}" y="${-size * 1.1}" width="${w}" height="${size * 2.2}" rx="${size * 1.1}" fill="#0b0d14" fill-opacity=".88" stroke="${col}" stroke-width="2.5"/><text y="${size * .36}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${size}" fill="#fff">${txt}</text></g>`; };
const stat = (y, big, sub, col, k) => { if (k <= 0) return ''; const sc = Math.min(1, E.spring(k / .3 * .9)); return `<g transform="translate(288 ${y}) scale(${sc.toFixed(3)})" style="filter:drop-shadow(0 8px 20px rgba(0,0,0,.6))"><rect x="-240" y="-70" width="480" height="140" rx="22" fill="#0b0d14" fill-opacity=".9" stroke="${col}" stroke-opacity=".6" stroke-width="2"/><text y="16" text-anchor="middle" font-family="Inter" font-weight="800" font-size="60" fill="${col}">${big}</text><text y="50" text-anchor="middle" font-family="Inter" font-weight="800" font-size="16" fill="#d8dce8" letter-spacing="1.5">${sub}</text></g>`; };
const coinSVG = (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#6cc426" stroke="#2f7a10" stroke-width="${r * .12}"/><circle r="${r * .8}" fill="#9be03a"/><path d="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .27 : r * .6; return (i ? 'L' : 'M') + f1(Math.cos(a) * q) + ' ' + f1(Math.sin(a) * q); }).join('')}Z" fill="#fffbe0"/></g>`;
function linkGfx(k, t) { if (k <= 0) return ''; const a = eo(clamp(k / .4)), dash = clamp((k - .3) / .5);
  return `<g opacity="${a.toFixed(2)}" transform="translate(0 ${(20 * (1 - a)).toFixed(1)})" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,.6))"><rect x="70" y="760" width="170" height="90" rx="20" fill="#0b0d14" fill-opacity=".9" stroke="#fff" stroke-opacity=".5"/><text x="155" y="814" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="#fff">YOUR TIKTOK</text>
    <rect x="336" y="760" width="170" height="90" rx="20" fill="#0b0d14" fill-opacity=".9" stroke="${LIME}"/>${coinSVG(372, 805, 18)}<text x="448" y="814" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="${LIME}">PRO</text>
    <line x1="246" y1="805" x2="${f1(246 + 84 * dash)}" y2="805" stroke="${LIME}" stroke-width="5" stroke-dasharray="10 7"/>${dash >= 1 ? `<circle cx="288" cy="805" r="16" fill="${LIME}"/><path d="M280 805 l6 6 l11 -12" stroke="#111" stroke-width="4" fill="none"/>` : ''}</g>`; }
function tradeGfx(k, t) { if (k <= 0) return ''; const a = eo(clamp(k / .4)), m = clamp((k - .4) / .5);
  return `<g opacity="${a.toFixed(2)}" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,.6))">${coinSVG(150, 820, 46)}<text x="150" y="900" text-anchor="middle" font-family="Inter" font-weight="800" font-size="20" fill="#fff">STARS</text>
    <path d="M220 820 h${f1(110 * m)}" stroke="${GOLDC}" stroke-width="7" stroke-linecap="round"/>${m >= 1 ? `<path d="M318 806 l16 14 l-16 14" stroke="${GOLDC}" stroke-width="7" fill="none" stroke-linecap="round"/>` : ''}
    <g opacity="${m.toFixed(2)}" transform="translate(430 820) rotate(-6)"><rect x="-80" y="-48" width="160" height="96" rx="12" fill="#ff2f6a"/><circle cx="-80" cy="0" r="14" fill="#1a1a22"/><circle cx="80" cy="0" r="14" fill="#1a1a22"/><line x1="-30" y1="-40" x2="-30" y2="40" stroke="#fff" stroke-dasharray="5 5" stroke-opacity=".7"/><text x="22" y="10" text-anchor="middle" font-family="Inter" font-weight="800" font-size="26" fill="#fff">% OFF</text></g>
    <text x="430" y="900" text-anchor="middle" font-family="Inter" font-weight="800" font-size="20" fill="#fff" opacity="${m.toFixed(2)}">COUPONS</text></g>`; }
function tipCard(n, title, k) { if (k <= 0) return ''; const sc = Math.min(1, E.spring(k / .3 * .9));
  return `<g transform="translate(288 860) scale(${sc.toFixed(3)})" style="filter:drop-shadow(0 8px 18px rgba(0,0,0,.6))"><rect x="-250" y="-52" width="500" height="104" rx="22" fill="#0b0d14" fill-opacity=".9"/><circle cx="-196" cy="0" r="34" fill="${GOLDC}"/><text x="-196" y="13" text-anchor="middle" font-family="Inter" font-weight="800" font-size="38" fill="#111">${n}</text><text x="-146" y="10" font-family="Inter" font-weight="800" font-size="27" fill="#fff">${title}</text></g>`; }

// ================= SHOTS =================
const on = (c, i) => c.ch(i) >= 0 && (i + 1 >= c.o.chunks.length || c.ch(i + 1) < 0);
function run(c, list) {
  const s = seqAt(c, list, 0), S = mixState(st(s.prev), st(s.cur), s.k); const sc = seqAt(c, list, 2); const cur = sc.cur;
  const k = list.findIndex((_, i) => on(c, i)), idx = k < 0 ? 0 : k; const args = typeof list[idx][3] === 'function' ? list[idx][3](c, idx) : [];
  drawScreen(cur, c.t, { args }); const tk = talkAt(c.t); tk.hi = !!list[idx][4]; poseGuy(c.t, S, tk);
}
const shot = (list, o = {}) => ({ loc: 'TPRO', aperture: o.ap ?? .0012, drift: .012, cut: true,
  fx: c => run(c, list), cam: c => { const cm = camBlend(c, list); return push(cm, c, o.push ?? .05); }, ...o });
const ch = (c, i) => c.ch(i);
Object.assign(SHOTS, {
  // [pose, camera, screen, screenArgs(c), raised-brows]
  thook: shot([['thrust', 'phone', 'history', c => [null, 0]], ['shrug', 'med', 'history', c => [null, 0], 1]],
    { focus: undefined, ov: c => '' }),
  twhat: shot([['thrust', 'phone', 'app', c => [0]], ['show', 'close', 'app', c => [1]], ['point', 'med', 'app', c => [1]]],
    { ov: c => linkGfx(c.ch(2) + .1, c.t) }),
  tstars: shot([['thrust', 'phone', 'balance'], ['look', 'close', 'checkin', c => [1]], ['show', 'med', 'coupons', c => [0]]],
    { ov: c => tradeGfx(c.ch(2) + .1, c.t) }),
  tproof: shot([['thrust', 'phoneFar', 'history', c => [null, 0]], ['thrust', 'phone', 'history', c => [[3, clamp(c.ch(1) / .3)], 0]], ['thrust', 'phone', 'history', c => [[5, clamp(c.ch(2) / .3)], 0]], ['thrust', 'phone', 'history', c => [[6, clamp(c.ch(3) / .3)], 0]], ['shrug', 'med', 'history', c => [null, 1], 1]],
    { ap: .0006, ov: c => c.ch(4) >= 0 ? stat(760, '4.5M', 'STARS → SHOP COUPONS (SCREEN ABOVE)', LIME, c.ch(4)) : '' }),
  ttips: shot([['count', 'med', 'checkin', c => [0]], ['show', 'phone', 'checkin', c => [clamp(c.ch(1) / 1.2)]], ['show', 'phone', 'event'], ['show', 'phone', 'coupons', c => [clamp(c.ch(3) / 1)]]],
    { ap: .0008, ov: c => (on(c, 1) ? tipCard(1, 'OPEN IT EVERY DAY', c.ch(1)) : '') + (on(c, 2) ? tipCard(2, 'LIMITED-TIME EVENTS', c.ch(2)) : '') + (on(c, 3) ? tipCard(3, 'SAVE FOR BIGGER COUPONS', c.ch(3)) : '') }),
  tqr: shot([['show', 'close', 'qr', c => [0], 1], ['thrust', 'phone', 'qr', c => [0]], ['thrust', 'phone', 'profile', c => [clamp(c.ch(2) / .5)]], ['thrust', 'phone', 'qr', c => [clamp(c.ch(3) / .4)]], ['point', 'med', 'qr', c => [1], 1], ['shrug', 'close', 'qr', c => [1], 1]],
    { ap: .0008, ov: c => (c.ch(4) >= 0 ? stat(780, '450K ≈ $45', 'NEW USER REWARD · IN STARS', MINT, c.ch(4)) : '') }),
  tout: shot([['point', 'med', 'qr', c => [1]], ['wave', 'med', 'qr', c => [1]]],
    { push: .1, ov: c => pill(288, 880, 'QR CODE IN MY HIGHLIGHTS', LIME, c.ch(0) + .05, 24) }),
});
SHOTS.thook.ov = c => c.ch(0) >= 0 && c.ch(1) < 0 ? pill(288, 900, 'MY REDEMPTION HISTORY', LIME, c.ch(0) - .4, 20) : '';
RESETS.push(() => { G.visible = PHONE.visible = isMine(); J.arm.forEach(A => [A.up, A.lo, A.el, A.cuff, A.hand].forEach(m => m.visible = isMine())); });
window.__tpro = true;
CAMS.face = () => ({ p: [0, 1.7, .55], at: [0, 1.68, 0], fov: 30 });
CAMS.side = () => ({ p: [.9, 1.5, 1.2], at: [0, 1.4, 0], fov: 38 });
SHOTS.tdbg = shot([['show', 'face', 'app', c => [1]], ['show', 'side', 'app', c => [1]], ['show', 'med', 'app', c => [1]], ['look', 'med', 'app', c => [1]]], { ap: .0001 });
