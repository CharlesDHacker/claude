// Prototype art direction: ukiyo-e / emaki scroll. Washi paper grain over everything, gold kasumi cloud bands,
// a restrained traditional palette (indigo, vermilion, ochre, sumi), layered mist and light, characters in profile.
const EMAKI = { indigo: '#26355a', sumi: '#1c1a20', ver: '#c8452c', ochre: '#d8a04a', paper: '#efe2c4', sage: '#7a8a5e', gold: '#d9b45a' };
let _washi = null;
function washiTex() { if (_washi) return _washi; const c = document.createElement('canvas'); c.width = 540; c.height = 960; const x = c.getContext('2d'), r = rng(911);
  const im = x.createImageData(540, 960); for (let i = 0; i < im.data.length; i += 4) { const v = 200 + r() * 55; im.data[i] = v; im.data[i + 1] = v * .96; im.data[i + 2] = v * .86; im.data[i + 3] = 255; } x.putImageData(im, 0, 0);
  x.globalAlpha = .18; x.strokeStyle = '#8a7a5a'; for (let i = 0; i < 260; i++) { x.lineWidth = .6 + r(); x.beginPath(); const px = r() * 540, py = r() * 960; x.moveTo(px, py); x.quadraticCurveTo(px + (r() - .5) * 40, py + (r() - .5) * 40, px + (r() - .5) * 70, py + (r() - .5) * 70); x.stroke(); }
  return (_washi = c); }
// paper grain over the frame (multiply), a soft vignette, and a little warmth
JPA.washi = (g, A, c) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'multiply'; g.globalAlpha = A.a ?? .5; g.drawImage(washiTex(), 0, 0, 1080, 1920); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  g.fillStyle = rg(g, 540, 900, 500, 1250, [[0, 'rgba(40,20,10,0)'], [1, 'rgba(40,20,10,.38)']]); g.fillRect(0, 0, 1080, 1920); g.restore(); };
// gold kasumi: stylised cloud bands with an ink edge, drifting slowly
function kasumi(g, x, y, w, h, col) {   // a gold mist band: a soft lozenge with rounded lobes on top, flat gilt with fine parallel lines, no hard outline
  g.save(); g.fillStyle = lg(g, x, y - h, x, y + h, [[0, '#f6dc92'], [.6, col || EMAKI.gold], [1, '#b88e3c']]); g.globalAlpha = .92;
  g.beginPath(); g.moveTo(x, y + h * .5); g.quadraticCurveTo(x - h * .6, y, x + h * .4, y - h * .3); const n = Math.max(2, Math.round(w / (h * 2.2)));
  for (let k = 0; k < n; k++) { const x0 = x + h * .4 + (w - h * .8) * k / n, x1 = x + h * .4 + (w - h * .8) * (k + 1) / n; g.quadraticCurveTo((x0 + x1) / 2, y - h * (1.1 + (k % 2) * .25), x1, y - h * .3); }
  g.quadraticCurveTo(x + w + h * .6, y, x + w, y + h * .5); g.closePath(); g.fill();
  g.globalAlpha = .5; g.strokeStyle = '#a07a30'; g.lineWidth = 2; [.05, .3].forEach(q => { g.beginPath(); g.moveTo(x + h * .5, y + h * q); g.lineTo(x + w - h * .5, y + h * q); g.stroke(); }); g.restore(); }
JPA.kasumi = (g, A, c) => { const T = c.T; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); [[-80, 150, 520, 46, .5], [560, 230, 600, 40, -.4], [-140, 1740, 640, 50, .35], [620, 1820, 560, 44, -.5]].forEach(([x, y, w, h, s]) => kasumi(g, x + Math.sin(T * .2 + y) * 30 * s + T * 6 * s, y, w, h)); g.restore(); };

JSETS.emakiRiver = { light: { x: -1, col: 'rgba(255,190,120,1)', rim: .75, shade: .3 },   // the Hidaka river at dusk: indigo hills, a vermilion bridge, willow, mist
  back(g, o, c, T) {
    layerAt(g, c, 0, () => blit(g, cacheLayer('em_sky', x => { x.fillStyle = lg(x, 0, -700, 0, 1500, [[0, '#2a3458'], [.45, '#8a5a6a'], [.8, '#e8a46a'], [1, '#f2cf96']]); x.fillRect(-700, -700, 2480, 3400);
      ell(x, 760, 820, 120, 120, '#f6e2b0'); x.globalAlpha = .5; ell(x, 760, 820, 170, 170, 'rgba(246,226,176,.4)'); x.globalAlpha = 1; })));
    layerAt(g, c, .12, () => blit(g, cacheLayer('em_far', x => { const r = rng(921); x.fillStyle = '#4a4a72'; x.beginPath(); x.moveTo(-700, 1250); for (let px = -700; px <= 1780; px += 90) x.lineTo(px, 1080 - Math.abs(Math.sin(px * .006)) * 260 - r() * 40); x.lineTo(1780, 1250); x.fill();
      x.fillStyle = 'rgba(242,207,150,.35)'; x.fillRect(-700, 1100, 2480, 160); }, { blur: 1.5 })));
    layerAt(g, c, .3, () => blit(g, cacheLayer('em_mid', x => { x.fillStyle = '#34406a'; x.beginPath(); x.moveTo(-700, 1350); for (let px = -700; px <= 1780; px += 60) x.lineTo(px, 1230 - Math.abs(Math.sin(px * .01 + 1)) * 150); x.lineTo(1780, 1350); x.fill();
      // a vermilion arched bridge
      x.lineWidth = 16; x.strokeStyle = EMAKI.ver; x.beginPath(); x.moveTo(-120, 1330); x.quadraticCurveTo(220, 1180, 560, 1330); x.stroke(); x.lineWidth = 6; x.beginPath(); x.moveTo(-120, 1290); x.quadraticCurveTo(220, 1140, 560, 1290); x.stroke();
      for (let k = 0; k <= 8; k++) { const px = -120 + k * 85, py = 1330 - Math.sin(k / 8 * Math.PI) * 112; line(x, [px, py, px, py - 44], 6, EMAKI.ver); } }, { blur: .6 })));
    layerAt(g, c, .55, () => { g.save(); g.fillStyle = lg(g, 0, 1330, 0, 1600, [[0, '#3a4a78'], [1, '#26355a']]); g.fillRect(-700, 1330, 2480, 260);   // the river, with moving highlight strokes
      for (let i = 0; i < 26; i++) { const y = 1350 + (i * 37) % 230, x = ((i * 173 + T * (20 + i % 4 * 8)) % 1500) - 250; line(g, [x, y, x + 60 + (i % 3) * 30, y], 3, 'rgba(242,207,150,.45)'); }
      ell(g, 760 + Math.sin(T) * 6, 1420, 80, 10, 'rgba(246,226,176,.35)'); g.restore(); });
    layerAt(g, c, .8, () => { // a willow on the bank, its strands swaying
      line(g, [940, 1700, 900, 900], 34, EMAKI.sumi, 'round'); line(g, [910, 980, 760, 860], 14, EMAKI.sumi, 'round'); line(g, [920, 1040, 1060, 900], 12, EMAKI.sumi, 'round'); for (let k = 0; k < 44; k++) { const bx = 640 + k * 12, sw = Math.sin(T * 1.1 + k * .5) * 18; g.save(); g.setLineDash([14, 8]); g.strokeStyle = ['#4e6e42', '#6e8a56', '#86a062'][k % 3]; g.lineWidth = 6; g.beginPath(); g.moveTo(bx, 880 + Math.abs(k - 11) * 6); g.quadraticCurveTo(bx + sw, 1150, bx + sw * 1.6, 1420 - (k % 4) * 40); g.stroke(); g.restore(); } });
    layerAt(g, c, 1, () => blit(g, cacheLayer('em_bank', x => { x.fillStyle = lg(x, 0, 1580, 0, 2700, [[0, '#8a7a52'], [1, '#4a4030']]); x.fillRect(-700, 1580, 2480, 1300); const r = rng(922);
      for (let i = 0; i < 70; i++) { const px = r() * 2400 - 700, py = 1600 + r() * 900; line(x, [px, py, px + (r() - .5) * 20, py - 26 - r() * 30], 3, r() < .5 ? '#5a6a3a' : '#6e7a44', 'round'); } }, { y0: 1500, h: 1300 })));
    // drifting mist bands
    for (let k = 0; k < 3; k++) { const y = 1250 + k * 160, x = ((T * (12 + k * 6) + k * 400) % 1600) - 500; g.fillStyle = rg(g, x + 400, y, 40, 520, [[0, 'rgba(246,230,200,.32)'], [1, 'rgba(246,230,200,0)']]); g.fillRect(x - 200, y - 200, 1200, 400); }
  },
  front(g, o, c, T) { JPA.kasumi(g, {}, c); },
  haze(g) { g.fillStyle = 'rgba(255,170,100,.05)'; g.fillRect(0, 0, 1080, 1920); } };

// Kiyohime (prototype cast): ukiyo-e profile beauty in a vermilion and indigo wave-pattern kimono
TOON.kiyohime = { kind: 'adult', female: true, age: .15, skin: '#f8e8da', skinD: '#e4cab4', hair: '#121018', hairHi: '#3e3a58', hairStyle: 'long', top: '#c8452c', topD: '#a43620', pat: 'waves', patCol: 'rgba(250,236,210,.55)', collar: '#f2e6cc',
  layers: ['#26355a'], sleeve: 'wide', bottom: 'skirt', skirt: '#26355a', skirtD: '#1c2846', pleats: '#c8452c', belt: '#d9b45a', feet: 'straw', eyes: 'adult', eyeShape: 'upturned', iris: '#2a1810', lashes: true, brow: 3, lips: '#c8452c', jaw: 'pointed', nose: 'button', h: .96 };
