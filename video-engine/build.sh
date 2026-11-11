#!/bin/bash
# Full build: narration -> re-timed video -> music/effects -> mix -> final MP4 at -16 LUFS.
# Usage: ./build.sh episodes/ep01.json OUTDIR NAME TTS_PYTHON MODEL_DIR [voice] [speed]
set -euo pipefail
EP=$1; OUT=$2; NAME=$3; PY=$4; MODEL=$5; VOICE=${6:-am_michael}; SPEED=${7:-1.0}
cd "$(dirname "$0")"; mkdir -p "$OUT"; P="$OUT/$NAME"
"$PY" narrate.py "$EP" "$P" --model "$MODEL" --voice "$VOICE" --speed "$SPEED"
node render.js "$P.timed.json" "$P.silent.mp4"
python3 audio.py "$P.timed.json" "$P" "$P.voice.wav"
I=$(ffmpeg -hide_banner -i "$P.mix.wav" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | grep -o "I: *-[0-9.]*" | tail -1 | grep -o "\-[0-9.]*")
G=$(python3 -c "print(round(-16-($I),2))")
ffmpeg -v error -y -i "$P.silent.mp4" -i "$P.mix.wav" -c:v copy -af "volume=${G}dB,alimiter=limit=0.89" -c:a aac -b:a 192k -shortest "$P.mp4"
echo "built $P.mp4 (mix was $I LUFS, gain ${G} dB)"
