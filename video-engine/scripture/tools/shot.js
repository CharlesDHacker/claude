// node tools/shot.js page.html out.png  -- screenshot a static test page
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message)); p.on('console', m => console.log('console:', m.text()));
  await p.goto('file://' + path.resolve(process.argv[2])); await p.waitForFunction(() => window.__done, null, { timeout: 15000 });
  await p.screenshot({ path: process.argv[3] }); await b.close(); })();
