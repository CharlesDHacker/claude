// Usage: node render.js timed.json out.mp4 [--audio mix.wav] [--frames 1.2,4.5] [--workers 4]
const { chromium } = require('playwright'); const http = require('http'); const fs = require('fs'); const path = require('path'); const os = require('os'); const { spawnSync } = require('child_process');
const root = __dirname, types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const [ep, out] = process.argv.slice(2, 4), args = process.argv.slice(4), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const fps = 30, audio = opt('--audio', null), dbg = opt('--frames', null), workers = +opt('--workers', 4);
const srv = http.createServer((q, s) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!p.startsWith(root)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); s.end(d); }); });
srv.listen(0, '127.0.0.1', async () => {
  const url = `http://127.0.0.1:${srv.address().port}/player.html`, E = JSON.parse(fs.readFileSync(ep, 'utf8')), br = await chromium.launch();
  const open = async () => { const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } }); pg.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; }); await pg.goto(url); await pg.waitForFunction(() => window.__ready); await pg.evaluate(e => window.__load(e), E); return pg; };
  try {
    if (dbg) { const pg = await open(); for (const s of dbg.split(',')) { await pg.evaluate(t => window.__render(t), +s); await pg.screenshot({ path: `${out}_${(+s).toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 85 }); } return; }
    const n = Math.round(E.total * fps), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fight-')), t0 = Date.now();
    await Promise.all(Array.from({ length: workers }, async (_, w) => { const pg = await open(); for (let f = w; f < n; f += workers) { await pg.evaluate(t => window.__render(t), f / fps); await pg.screenshot({ path: path.join(dir, String(f).padStart(6, '0') + '.jpg'), type: 'jpeg', quality: 92 }); if (w === 0 && f % 300 === 0) console.log(`frame ${f}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`); } }));
    const ff = ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(dir, '%06d.jpg')]; if (audio) ff.push('-i', audio);
    ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps)); if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest'); ff.push(out);
    const r = spawnSync('ffmpeg', ff, { stdio: 'inherit' }); fs.rmSync(dir, { recursive: true, force: true });
    console.log(r.status === 0 ? `done ${n} frames ${E.total.toFixed(1)}s in ${((Date.now() - t0) / 1000).toFixed(0)}s` : 'ffmpeg failed');
  } finally { await br.close(); srv.close(); }
});
