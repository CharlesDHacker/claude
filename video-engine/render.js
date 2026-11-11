// Usage: node render.js episodes/ep01.json out.mp4 [--fps 30] [--audio narration.wav] [--frames a,b,c (png debug)]
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
(async()=>{
  const [ep,out]=process.argv.slice(2,4);const args=process.argv.slice(4);
  const opt=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d};
  const fps=+opt('--fps',30),audio=opt('--audio',null),dbg=opt('--frames',null);
  const E=JSON.parse(fs.readFileSync(ep,'utf8'));
  const br=await chromium.launch();const pg=await br.newPage({viewport:{width:720,height:1280}});
  await pg.goto('file://'+path.resolve(__dirname,'player.html'));
  const total=await pg.evaluate(e=>window.__load(e),E);
  const n=Math.round(total*fps);
  if(dbg){for(const s of dbg.split(',')){const t=+s;await pg.evaluate(t=>window.__render(t),t);await pg.screenshot({path:`${out}_${s}.png`})}await br.close();return}
  const ff=['-y','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-'];
  if(audio)ff.push('-i',audio);
  ff.push('-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-r',String(fps));
  if(audio)ff.push('-c:a','aac','-b:a','192k','-shortest');
  ff.push(out);
  const p=spawn('ffmpeg',ff,{stdio:['pipe','inherit','inherit']});
  for(let f=0;f<n;f++){await pg.evaluate(t=>window.__render(t),f/fps);const buf=await pg.screenshot({type:'png'});if(!p.stdin.write(buf))await new Promise(r=>p.stdin.once('drain',r))}
  p.stdin.end();await new Promise(r=>p.on('close',r));await br.close();
  // sidecar: caption timing + narration text for TTS alignment
  let t=0;const rows=E.beats.map(b=>{const r={start:+t.toFixed(2),end:+(t+b.d).toFixed(2),text:(b.cap||'').replace(/\{[grb]:([^}]*)\}/g,'$1')};t+=b.d;return r});
  fs.writeFileSync(out.replace(/\.mp4$/,'.timing.json'),JSON.stringify(rows,null,1));
  fs.writeFileSync(out.replace(/\.mp4$/,'.narration.txt'),rows.filter(r=>r.text).map(r=>r.text).join(' ')+'\n');
  console.log('done',n,'frames',total.toFixed(1)+'s');
})();
