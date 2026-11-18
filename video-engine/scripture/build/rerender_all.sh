#!/bin/bash
# Re-time, re-mix and re-render all episodes with the TikTok safe-area layout, then encode download copies into videos/.
set -e
cd "$(dirname "$0")/.."
run() { ep=$1 lines=$2 shots=$3 adir=$4 out=$5
  python3 -I tools/timeline.py $lines $shots $adir build/$ep.timed.json build/$ep.voice.wav | head -1
  python3 -I tools/mix2.py build/$ep.timed.json build/$ep.voice.wav build/$ep.mix.wav | tail -c 40
  node render.js build/$ep.timed.json build/$ep.full.mp4 --audio build/$ep.mix.wav --workers 4 | tail -1
  ffmpeg -v error -y -i build/$ep.full.mp4 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -movflags +faststart videos/$out.mp4
  rm build/$ep.full.mp4; echo "== $out $(du -h videos/$out.mp4 | cut -f1)"; }
#run ep03 episodes/ep03-jonah.lines.json episodes/ep03-jonah.shots.json audio/ep03/lines jonah
#run ep02 episodes/ep02-giants.lines.json episodes/ep02-giants.shots.json audio/ep02/lines goliath-had-brothers
run ep01 episodes/ep01-balaam.lines.json episodes/ep01-balaam.shots.json audio/ep01/lines balaam
echo ALL DONE
