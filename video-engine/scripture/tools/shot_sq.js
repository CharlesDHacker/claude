// node tools/shot_sq.js page.html[#hash] out.png  -- 1080x1080 screenshot of a static page
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } }); p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  const [f, h] = process.argv[2].split('#'); await p.goto('file://' + path.resolve(f) + (h ? '#' + h : '')); await p.waitForFunction(() => window.__done, null, { timeout: 15000 });
  await p.screenshot({ path: process.argv[3] }); await b.close(); })();
