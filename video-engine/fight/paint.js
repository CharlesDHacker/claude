// node paint.js [names...] -> img/<name>.png for every keyframe in draw.html
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, only = process.argv.slice(2);
const srv = http.createServer((q, s) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); s.end(d); }); });
srv.listen(0, '127.0.0.1', async () => { const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1920, height: 1080 } }); pg.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await pg.goto(`http://127.0.0.1:${srv.address().port}/draw.html`); await pg.waitForFunction(() => window.__ready);
  const names = only.length ? only : await pg.evaluate(() => window.__names);
  for (const n of names) { await pg.evaluate(n => window.__draw(n), n); await pg.locator('canvas').screenshot({ path: path.join(root, 'img', n + '.png') }); }
  console.log('painted', names.length); await br.close(); srv.close(); });
