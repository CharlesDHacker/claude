# Toby & Selah: illustrated Bible shorts

2D illustrated vertical shorts (1080×1920, 30 fps) modelled on the Greek-myth shorts in `docs/01-reference-breakdown.md`.
Series rules, characters and casting are in `docs/02-series-bible.md`; scripts are in `docs/03-episode-scripts.md`.

## Build an episode
```
cd video-engine/scripture
# 1. voices: one clip per line in audio/ep01/lines/ (ElevenLabs takes where present, Kokoro for the rest)
python3 -I tools/split_takes.py audio/ep01/raw/toby_b.mp3 audio/ep01/take_b L01 L03 L05 L14 L22 L30 L36 L38 L40
python3 -I tools/voice_lines.py episodes/ep01-balaam.lines.json audio/ep01 /path/to/kokoro
# 2. timing: captions, lip-sync envelopes, shot times, voice track
python3 -I tools/timeline.py episodes/ep01-balaam.lines.json episodes/ep01-balaam.shots.json audio/ep01/lines build/ep01.timed.json build/ep01.voice.wav
# 3. music + sound effects + voice, -16 LUFS
python3 -I tools/mix.py build/ep01.timed.json build/ep01.voice.wav build/ep01.mix.wav
# 4. picture
node render.js build/ep01.timed.json build/ep01-balaam.mp4 --audio build/ep01.mix.wav
node render.js build/ep01.timed.json /tmp/f --frames 3.2,40.5     # debug stills
```
Needs Node with Playwright/Chromium, ffmpeg, and Python with numpy, scipy and librosa (librosa only for the analysis tools).
Kokoro: `pip install kokoro-onnx soundfile` plus `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub releases.

## Files
- `episodes/*.lines.json`: the script. Each line has `who`, `say` (spoken text with ElevenLabs v4 audio tags) and `cap` (caption chunks; markup `{g:gold}`, `{r:red}`, `{o:orange}`, `{pop:BIG WORD}`).
- `episodes/*.shots.json`: one shot per line (`at`). It sets `scene`, `cam` keyframes `[x, y, zoom]`, transition `tr` (`fade`/`flash`), scene options `o`, `pops`, `label`, `music` mood, `sfx`, `shake`/`shakeAt`, `amb`; `gaps` sets the pause after each line.
  A time written as `"@L15.1+0.35"` means "0.35 s after caption chunk 1 of line L15 starts".
- `art/lib.js`: drawing helpers. `art/chars.js`: Toby, Selah (and Balaam's donkey), Balaam, the angel, Balak, servants. `art/scenes.js`: the sets (road, court, ride, angel, field, vineyard, narrow, sil, heights).
- `player.html`: compositor (camera, dissolves, flashes, captions, title card, pop words, labels, grain, vignette).

## Voices
The pilot's Toby lines are ElevenLabs (Piku). The other four characters were rendered with offline Kokoro because the ElevenLabs account
refused further generations (free tier disabled for "unusual activity"). Once the account works, generate one take per speaker with the
`[long pause]`-joined prompts (see `voice_lines.py`), split them with `split_takes.py` into `audio/ep01/take_<x>/`, add those directories
to `takes` in `voice_lines.py`, and re-run steps 1–4: everything re-times automatically.
