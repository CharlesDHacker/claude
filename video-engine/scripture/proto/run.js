// Render the hybrid 2D/3D test: serves the page, steps time, screenshots each frame, encodes with ffmpeg.
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'), { chromium } = require('playwright');
const H = __dirname, ROOT = '/home/user/claude/video-engine/scripture', THREE = path.join(H, 'node_modules/three/build');
const types = { '.js': 'text/javascript', '.html': 'text/html', '.mjs': 'text/javascript' };
const srv = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0]);
  const p = u.startsWith('/three/') ? path.join(THREE, u.slice(7)) : u === '/hybrid.html' ? path.join(H, 'hybrid.html') : path.join(ROOT, u);
  fs.readFile(p, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); s.end(d); }); });
srv.listen(0, '127.0.0.1', async () => {
  const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await br.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 }); pg.on('pageerror', e => console.error('PAGE ERROR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/hybrid.html`); await pg.waitForFunction(() => window.__ready, null, { timeout: 30000 });
  const dir = path.join(H, 'frames'); fs.mkdirSync(dir, { recursive: true }); const n = +(process.argv[2] || 300), only = process.argv[3];
  const el = await pg.$('#w');
  const list = only ? only.split(',').map(Number) : [...Array(n).keys()].map(i => i / 30);
  for (let i = 0; i < list.length; i++) { await pg.evaluate(t => window.__frame(t), list[i]); await el.screenshot({ path: path.join(dir, (only ? 'still_' : 'f_') + String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 90 }); }
  await br.close(); srv.close();
  if (!only) execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', path.join(dir, 'f_%04d.jpg'), '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(H, 'hybrid-test.mp4')]);
  console.log('done');
});
