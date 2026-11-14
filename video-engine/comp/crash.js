// Shot direction for "What if an alien ship crashed on Earth?" using the Gemini sets + character sheets.
// Character indices per sheet:  farmer 0 neutral,1 shock,2 phone,3 worried,4 talk,5 point
// soldier 0 guard,1 stop,2 radio,3 shock,4/5 walk   hazmat 0 neutral,1/2 walk,3 reach,4 shock,5 flashlight
// diplomat 0 neutral,1 mic,2 panic,3 shrug,4 whisper,5 sweat   family 0 dad+light,1 mom worried,2 kid worried,3 dad shock,4 mom shock,5 kid shock
window.CRASH_SHOTS = () => {
  const bgImg = n => IMG[`/stills/crash/bg/${n}.jpg`];
  function bg(name, cam, o = {}) { const im = bgImg(name), xf = camXf(im, cam), sh = o.shake || 0, sx = sh ? (Math.sin(o.t * 61) + Math.sin(o.t * 37)) * sh : 0, sy = sh ? (Math.cos(o.t * 53) + Math.sin(o.t * 29)) * sh : 0;
    xf.ox += sx; xf.oy += sy; g.save(); if (o.blur) g.filter = `blur(${o.blur}px)`; if (o.filter) g.filter = o.filter + (o.blur ? ` blur(${o.blur}px)` : '');
    g.drawImage(im, xf.ox, xf.oy, im.width * xf.s, im.height * xf.s); g.restore(); return xf; }
  const NIGHT = { b: .72, s: .9, tint: ['#1a2a5a', .28], shadow: .5 }, DAWN = { b: 1.0, s: 1.05, tint: ['#ff9a4a', .1], shadow: .32 }, DAY = { b: 1.02, s: 1.02, tint: ['#fff4dc', .04], shadow: .35 };
  const GREEN = { b: .7, s: .85, tint: ['#1aff6a', .16], shadow: .45 }, RED = { b: .82, s: .95, tint: ['#ff2a2a', .16], shadow: .45 }, WARM = { b: .98, s: 1.0, tint: ['#ffd8a0', .07], shadow: .35 }, COOL = { b: 1.0, s: .95, tint: ['#dfe8ff', .05], shadow: .3 };
  const police = (t) => { const on = Math.sin(t * 9) > 0; return [on ? 'rgba(255,40,60,1)' : 'rgba(40,90,255,1)', .45, on ? -1 : 1]; };
  const S = {};

  // 1 — HOOK: the ship in the wheat at dawn, slow push in
  S.chook = c => { const xf = bg('bg01_farm', lerpCam([{ t: 0, cx: .5, cy: .52, z: 1.0 }, { t: c.d, cx: .5, cy: .47, z: 1.32 }], c));
    smoke(xf, c.t, .45, .45, 10, 3, '150,140,140', .3, 900, 160, 90); motes(c.t, 40, 5, '#ffd9a0', .5, [0, 0, W, H], [1.5, 3.5], [6, -10]); glow(...toScreen(xf, .55, .49), 160, 'rgba(90,255,240,.5)', .4 + .2 * Math.sin(c.t * 5)); };

  // 2 — RADAR ROOM: 3:12 a.m., the blip, push into the screen
  S.cradar = c => { const k = c.ch(2) > 0, cam = lerpCam([{ t: 0, cx: .5, cy: .55, z: 1.05 }, { t: (c.s.chunks[1].t0 - c.s.t0), cx: .5, cy: .5, z: 1.15 }, { t: (c.s.chunks[2].t0 - c.s.t0) + .2, cx: .56, cy: .42, z: 1.9 }, { t: c.d, cx: .58, cy: .43, z: 2.3 }], c);
    const xf = bg('bg02_radar', cam); const [rx, ry] = toScreen(xf, .5, .35), R = .229 * xf.bw * xf.s;
    // live radar sweep + pulsing blip
    g.save(); g.translate(rx, ry); g.rotate(c.t * 2.2); const sw = g.createConicGradient ? g.createConicGradient(0, 0, 0) : null; if (sw) { sw.addColorStop(0, 'rgba(120,255,140,.55)'); sw.addColorStop(.1, 'rgba(120,255,140,0)'); sw.addColorStop(1, 'rgba(120,255,140,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = sw; g.beginPath(); g.arc(0, 0, R, 0, 6.283); g.fill(); } g.restore();
    const [bx, by] = toScreen(xf, .58, .4375); glow(bx, by, 60 * xf.s + 30 * Math.sin(c.t * 8), 'rgba(255,40,40,1)', .9);
    if (!k) drawChar(xf, { set: 'soldier', i: c.ch(1) > 0 ? 2 : 0, x: .8, y: .98, h: .5, ph: 1, pop: c.s.chunks[1].t0 }, c.t, GREEN, c);
    else drawChar(xf, { set: 'soldier', i: 3, x: .82, y: .99, h: .5, ph: 1, pop: c.s.chunks[2].t0 + 1.4 }, c.t, GREEN, c); };

  // 3 — FALL + IMPACT
  S.cfall = c => { const hit = c.che(0) + .05; if (hit < 0) { const xf = bg('bg03_fall', lerpCam([{ t: 0, cx: .5, cy: .3, z: 1.12 }, { t: c.d, cx: .52, cy: .4, z: 1.0 }], c)); const [hx, hy] = toScreen(xf, .6, .31); glow(hx, hy, 200, 'rgba(120,255,240,1)', .6 + .2 * Math.sin(c.t * 30));
      motes(c.t, 30, 9, '#ffcf7a', .8, [hx - 380, hy - 300, 380, 300], [2, 5], [-120, -90]); return; }
    const xf = bg('bg04_impact', { cx: .5, cy: .5, z: lerp(1.35, 1.1, eo(hit / 1.4)) }, { shake: 26 * Math.exp(-hit * 3), t: c.t });
    const [ix, iy] = toScreen(xf, .5, .42); glow(ix, iy, 700, 'rgba(160,255,250,1)', .7 * Math.exp(-hit * 1.5)); motes(c.t, 80, 13, '#ffd27a', 1, [0, 0, W, H * .8], [2, 6], [0, -60]);
    flash(Math.exp(-hit * 5), '235,255,252'); };
  S.cfall.hardIn = false;

  // 4 — CORDON: roadblock, soldiers, police lights flashing on everything
  S.ccordon = c => { const xf = bg('bg05_roadblock', lerpCam([{ t: 0, cx: .5, cy: .6, z: 1.1 }, { t: c.d, cx: .5, cy: .6, z: 1.32 }], c));
    const on = Math.sin(c.t * 9) > 0; [[.13, .465], [.24, .465]].forEach(([x, y]) => glow(...toScreen(xf, x, y), 230, on ? 'rgba(255,40,60,1)' : 'rgba(50,100,255,1)', .55)); [[.8, .47], [.9, .47]].forEach(([x, y]) => glow(...toScreen(xf, x, y), 230, !on ? 'rgba(255,40,60,1)' : 'rgba(50,100,255,1)', .55));
    smoke(xf, c.t, .85, .36, 8, 4, '200,200,210', .25, 500, 120, 70);
    const gr = { ...NIGHT, rim: police }, walkK = clamp(c.lt / 2.2);
    drawChar(xf, { set: 'soldier', i: 0, x: .2, y: .74, h: .24, ph: .3 }, c.t, gr, c);
    drawChar(xf, walkK < 1 ? { set: 'soldier', walk: { a: 4, b: 5, rate: 5 }, x: lerp(.95, .72, walkK), y: .755, h: .25, ph: 2 } : { set: 'soldier', i: 2, x: .72, y: .755, h: .25, ph: 2, pop: c.s.t0 + 2.2 }, c.t, gr, c);
    drawChar(xf, { set: 'soldier', i: 1, x: .46, y: .8, h: .28, ph: 1.1 }, c.t, gr, c); };

  // 5 — VIRAL: the farmer films it from his porch, then the phone fills the screen with the view counter
  S.cviral = c => { if (c.ch(1) < 0) { const xf = bg('bg03_fall', lerpCam([{ t: 0, cx: .55, cy: .64, z: 1.45 }, { t: c.d, cx: .55, cy: .66, z: 1.6 }], c), { blur: 1.5 });
      const r = drawChar(xf, { set: 'farmer', i: 2, x: .52, y: .96, h: .44, ph: .5, pop: c.s.t0 + .05 }, c.t, { ...NIGHT, b: .85, tint: ['#ffb060', .12] }, c); glow(r.fx + r.w * .1, r.fy - r.h * .5, 120, 'rgba(200,230,255,1)', .5); return; }
    const k = c.ch(1); bg('bg01_farm', { cx: .5, cy: .5, z: 1.15 }, { blur: 10, t: c.t }); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, H);
    const pw = 640, ph = 1180, px = W / 2 - pw / 2, py = H * .14 + (1 - eo(k / .5)) * 400, rr = 70;
    g.save(); g.globalAlpha = clamp(k / .3); g.fillStyle = '#111'; g.beginPath(); g.roundRect(px - 22, py - 22, pw + 44, ph + 44, rr + 18); g.fill(); g.beginPath(); g.roundRect(px, py, pw, ph, rr); g.clip();
    const im = IMG['/stills/crash/bg/bg04_impact.jpg']; g.drawImage(im, px - (im.width * ph / im.height - pw) / 2, py, im.width * ph / im.height, ph);
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(px, py + 110, pw, 230);
    const views = Math.round(lerp(0, 200, eo(clamp(k / 2.6)))); g.fillStyle = '#fff'; g.font = '800 92px Inter'; g.textAlign = 'center'; g.fillText(`${views}M views`, W / 2, py + 230);
    g.font = '800 40px Inter'; g.fillStyle = '#ff3a5a'; g.fillText('♥ ' + Math.round(views * .31) + 'M   💬 ' + Math.round(views * .02) + 'M', W / 2, py + 300);
    g.fillStyle = '#ff3a3a'; g.beginPath(); g.arc(px + 60, py + 70, 14, 0, 6.283); g.fill(); g.fillStyle = '#fff'; g.font = '800 34px Inter'; g.textAlign = 'left'; g.fillText('LIVE', px + 86, py + 82); g.restore();
    const r9 = rng(4); for (let i = 0; i < 18; i++) { const a = (k * (.5 + r9() * .6) + r9()) % 1, x = W * (.25 + r9() * .55), y = H * .85 - a * H * .6; g.globalAlpha = Math.sin(a * Math.PI) * clamp(k); g.fillStyle = '#ff3a5a'; g.font = `${40 + r9() * 40}px sans-serif`; g.fillText('♥', x, y); } g.globalAlpha = 1; };

  // 6 — AIRPORT: every flight cancelled; the family staring up at the board
  S.cplanes = c => { const xf = bg('bg06_airport', lerpCam([{ t: 0, cx: .3, cy: .26, z: 1.15 }, { t: (c.s.chunks[0].te - c.s.t0), cx: .42, cy: .5, z: 1.02 }, { t: c.d, cx: .45, cy: .52, z: 1.12 }], c));
    const two = c.ch(1) > 0, pop = c.s.chunks[1].t0;
    drawChar(xf, { set: 'family', i: 3, x: .36, y: .93, h: .3, ph: .2, flip: true }, c.t, WARM, c);
    drawChar(xf, { set: 'family', i: two ? 4 : 1, x: .52, y: .94, h: .3, ph: 1.4, pop }, c.t, WARM, c);
    drawChar(xf, { set: 'family', i: two ? 5 : 2, x: .64, y: .95, h: .3, ph: 2.2, pop }, c.t, WARM, c);
    motes(c.t, 30, 21, '#ffe0b0', .35, [0, 0, W, H], [1.5, 3], [4, -6]); };

  // 7 — MARKETS: trading halted, traders panicking, red flicker
  S.cmarket = c => { const xf = bg('bg07_market', lerpCam([{ t: 0, cx: .5, cy: .4, z: 1.05 }, { t: c.d, cx: .5, cy: .56, z: 1.25 }], c));
    flash(.08 + .06 * Math.max(0, Math.sin(c.t * 7)), '255,30,30');
    drawChar(xf, { set: 'diplomat', i: 2, x: .3, y: .93, h: .34, ph: .4 }, c.t, RED, c); drawChar(xf, { set: 'diplomat', i: c.p > .55 ? 3 : 5, x: .7, y: .95, h: .34, ph: 1.5, pop: c.s.t0 + c.d * .55 }, c.t, RED, c);
    const r = rng(8); g.save(); for (let i = 0; i < 14; i++) { const a = (c.t * (.12 + r() * .1) + r()) % 1, x = W * r() + Math.sin(c.t + i) * 60, y = -60 + a * (H + 120); g.translate(x, y); g.rotate(c.t * (1 + r()) + i); g.fillStyle = 'rgba(245,245,240,.9)'; g.fillRect(-40, -28, 80, 56); g.fillStyle = 'rgba(80,80,80,.5)'; for (let l = 0; l < 4; l++) g.fillRect(-30, -18 + l * 12, 60, 3); g.setTransform(1, 0, 0, 1, 0, 0); } g.restore(); };

  // 8 — SUPERMARKET: stripped shelves, the mom grabbing her kid
  S.cpanic = c => { const xf = bg('bg08_supermarket', lerpCam([{ t: 0, cx: .5, cy: .45, z: 1.0 }, { t: c.d, cx: .5, cy: .5, z: 1.22 }], c));
    const k = clamp(c.lt / c.d); drawChar(xf, { set: 'family', i: 4, x: lerp(.62, .52, k), y: .9, h: .32, ph: .7 }, c.t, COOL, c); drawChar(xf, { set: 'family', i: 2, x: lerp(.74, .64, k), y: .91, h: .32, ph: 1.9 }, c.t, COOL, c);
    if (Math.sin(c.t * 23) > .7) flash(.05, '0,0,0'); };

  // 9 — HIGHWAY: gridlock, slow push, twinkling lights
  S.chighway = c => { const xf = bg('bg09_highway', lerpCam([{ t: 0, cx: .5, cy: .55, z: 1.0 }, { t: c.d, cx: .5, cy: .45, z: 1.25 }], c));
    const r = rng(17); for (let i = 0; i < 60; i++) { const x = r(), y = .25 + r() * .7, red = x > .5; glow(...toScreen(xf, x, y), 14, red ? 'rgba(255,60,50,1)' : 'rgba(255,240,210,1)', .35 + .35 * Math.sin(c.t * (2 + r() * 3) + i)); } };

  // 10 — UN: emergency session; the scary part; no plan; "None."
  S.cun = c => { const ch = k => c.ch(k) >= 0, last = ch(3), mid = ch(1);
    const cam = lerpCam([{ t: 0, cx: .5, cy: .45, z: 1.0 }, { t: c.s.chunks[1].t0 - c.s.t0, cx: .5, cy: .62, z: 1.2 }, { t: c.s.chunks[1].t0 - c.s.t0 + .4, cx: .5, cy: .7, z: 1.55 }, { t: c.s.chunks[3].t0 - c.s.t0, cx: .5, cy: .72, z: 1.65 }, { t: c.s.chunks[3].t0 - c.s.t0 + .35, cx: .52, cy: .66, z: 2.6 }, { t: c.d, cx: .52, cy: .66, z: 2.8 }], c);
    const xf = bg('bg10_un', cam, { blur: mid ? 1.5 : 0, shake: last ? 4 * Math.exp(-c.ch(3) * 3) : 0, t: c.t }); const pop2 = c.s.chunks[2].t0;
    if (!last) { drawChar(xf, { set: 'diplomat', i: ch(2) ? 2 : 0, x: .3, y: .86, h: .26, ph: .2, pop: pop2 }, c.t, WARM, c); drawChar(xf, { set: 'diplomat', i: ch(2) ? 3 : 1, x: .52, y: .88, h: .27, ph: 1.4, pop: pop2 }, c.t, WARM, c); drawChar(xf, { set: 'diplomat', i: 4, x: .72, y: .86, h: .26, ph: 2.6, flip: true }, c.t, WARM, c); }
    else drawChar(xf, { set: 'diplomat', i: 5, x: .52, y: .86, h: .27, ph: .9, pop: c.s.chunks[3].t0 }, c.t, WARM, c);
    if (last) flash(.15 * clamp(c.ch(3) / .5), '0,0,0'); };

  // 11 — HAZMAT: day three, the team walks to the ship; the hatch is open
  S.chazmat = c => { const open = c.ch(1) >= 0; const cam = lerpCam([{ t: 0, cx: .5, cy: .62, z: 1.0 }, { t: c.s.chunks[1].t0 - c.s.t0, cx: .48, cy: .52, z: 1.25 }, { t: c.s.chunks[1].t0 - c.s.t0 + .6, cx: .48, cy: .4, z: 1.9 }, { t: c.d, cx: .48, cy: .4, z: 2.05 }], c);
    const xf = bg('bg11_hazmat', cam); glow(...toScreen(xf, .5, .38), 120 * xf.s, 'rgba(90,255,240,1)', .45 + .25 * Math.sin(c.t * 4));
    const k = clamp(c.lt / (c.s.chunks[1].t0 - c.s.t0));
    if (!open) { drawChar(xf, { set: 'hazmat', walk: { a: 1, b: 2, rate: 4.5 }, x: lerp(.3, .38, k), y: lerp(1.02, .8, k), h: lerp(.36, .2, k), ph: .3 }, c.t, DAY, c); drawChar(xf, { set: 'hazmat', walk: { a: 2, b: 1, rate: 4.5 }, x: lerp(.62, .58, k), y: lerp(1.06, .82, k), h: lerp(.38, .21, k), ph: 1.3 }, c.t, DAY, c); }
    else { drawChar(xf, { set: 'hazmat', i: 5, x: .38, y: .58, h: .14, ph: .3, pop: c.s.chunks[1].t0 }, c.t, DAY, c); drawChar(xf, { set: 'hazmat', i: 3, x: .6, y: .6, h: .14, ph: 1.3, pop: c.s.chunks[1].t0 + .3 }, c.t, DAY, c); } };

  // 12 — EMPTY COCKPIT
  S.cempty = c => { const xf = bg('bg12_cockpit', lerpCam([{ t: 0, cx: .5, cy: .5, z: 1.05 }, { t: c.d, cx: .5, cy: .5, z: 1.45 }], c));
    glow(...toScreen(xf, .5, .32), 220 * xf.s, 'rgba(200,120,255,1)', .35 + .25 * (Math.sin(c.t * 13) > 0 ? 1 : .4)); smoke(xf, c.t, .5, .75, 10, 31, '120,200,210', .14, 300, 400, 160); };

  // 13 — FOOTPRINTS: glowing three-toed prints leading off down the dirt road
  S.cwalked = c => { const xf = bg('bg01_farm', lerpCam([{ t: 0, cx: .5, cy: .78, z: 1.6 }, { t: c.d, cx: .44, cy: .66, z: 1.25 }], c), { filter: 'brightness(.62) saturate(.8) hue-rotate(-10deg)' });
    g.fillStyle = 'rgba(30,20,60,.25)'; g.fillRect(0, 0, W, H);
    const show = clamp(c.lt / (c.d * .7)); for (let i = 0; i < 16; i++) { const f = i / 15; if (f > show) break; const x = lerp(.62, .2, f) + (i % 2 ? .02 : -.02), y = lerp(.99, .74, Math.pow(f, .7)); const [sx, sy] = toScreen(xf, x, y), s = lerp(1.2, .35, f) * xf.s * 46;
      g.save(); g.translate(sx, sy); g.rotate(-.55); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(110,255,230,.9)'; g.beginPath(); g.ellipse(0, s * .3, s * .38, s * .55, 0, 0, 6.283); g.fill(); [[-.42, -.55, -.35], [0, -.8, 0], [.42, -.55, .35]].forEach(([dx, dy, r]) => { g.beginPath(); g.ellipse(dx * s, dy * s, s * .14, s * .32, r, 0, 6.283); g.fill(); }); g.restore(); glow(sx, sy, s * 2.2, 'rgba(90,255,230,1)', .35); } };

  // 14 — END: the family on the porch staring at the glow on the horizon
  S.cend = c => { const xf = bg('bg03_fall', lerpCam([{ t: 0, cx: .5, cy: .7, z: 1.5 }, { t: c.d, cx: .5, cy: .72, z: 1.62 }], c));
    glow(...toScreen(xf, .5, .42), 260 * xf.s, 'rgba(90,255,230,1)', .3 + .1 * Math.sin(c.t * 3));
    const gr = { ...NIGHT, b: .82, tint: ['#ff9a40', .1] };
    drawChar(xf, { set: 'family', i: 0, x: .36, y: .93, h: .36, ph: .2 }, c.t, gr, c); drawChar(xf, { set: 'family', i: 1, x: .55, y: .935, h: .36, ph: 1.3 }, c.t, gr, c); drawChar(xf, { set: 'family', i: 2, x: .68, y: .94, h: .36, ph: 2.4 }, c.t, gr, c);
    const [fx, fy] = toScreen(xf, .43, .79); glow(fx, fy, 160, 'rgba(255,230,160,1)', .5); };
  return S;
};
