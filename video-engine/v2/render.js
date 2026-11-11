// Usage: node render.js timed.json out.mp4 [--audio mix.wav] [--frames 1.2,4.5] [--workers 4] [--scale 1.875]
const {chromium}=require('playwright');const {spawnSync}=require('child_process');const fs=require('fs');const path=require('path');const os=require('os');
(async()=>{
  const [ep,out]=process.argv.slice(2,4),args=process.argv.slice(4),opt=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d};
  const fps=30,audio=opt('--audio',null),dbg=opt('--frames',null),workers=+opt('--workers',4),scale=+opt('--scale',1.875);
  const E=JSON.parse(fs.readFileSync(ep,'utf8')),url='file://'+path.resolve(__dirname,'player.html');
  const br=await chromium.launch();
  const open=async()=>{const pg=await br.newPage({viewport:{width:576,height:1024},deviceScaleFactor:scale});pg.on('pageerror',e=>{console.error('PAGE ERROR',e.message);process.exitCode=1});await pg.goto(url);await pg.evaluate(e=>window.__load(e),E);return pg};
  if(dbg){const pg=await open();for(const s of dbg.split(',')){await pg.evaluate(t=>window.__render(t),+s);await pg.screenshot({path:`${out}_${(+s).toFixed(2).padStart(6,'0')}.png`})}await br.close();return}
  const n=Math.round(E.total*fps),dir=fs.mkdtempSync(path.join(os.tmpdir(),'frames-'));
  await Promise.all(Array.from({length:workers},async(_,w)=>{const pg=await open();for(let fr=w;fr<n;fr+=workers){await pg.evaluate(t=>window.__render(t),fr/fps);await pg.screenshot({path:path.join(dir,String(fr).padStart(6,'0')+'.jpg'),type:'jpeg',quality:94})}}));
  await br.close();
  const ff=['-v','error','-y','-framerate',String(fps),'-i',path.join(dir,'%06d.jpg')];if(audio)ff.push('-i',audio);
  ff.push('-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-preset','medium','-r',String(fps));if(audio)ff.push('-c:a','aac','-b:a','192k','-shortest');ff.push(out);
  const r=spawnSync('ffmpeg',ff,{stdio:'inherit'});fs.rmSync(dir,{recursive:true,force:true});
  console.log(r.status===0?`done ${n} frames ${E.total.toFixed(1)}s`:'ffmpeg failed');
})();
