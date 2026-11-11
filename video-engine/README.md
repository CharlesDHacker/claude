# Video engine (flat-vector explainer shorts)

Renders a script (JSON beats) into a 720x1280, 30 fps MP4 with captions, HUD chips, scenes and camera moves.

    node render.js episodes/ep01.json out.mp4                  # silent video + out.timing.json + out.narration.txt
    node render.js episodes/ep01.json out.mp4 --audio vo.wav   # mux a narration track
    node render.js episodes/ep01.json frame --frames 4.1,9.0   # debug PNGs at those timestamps

Needs Node, the `playwright` package with Chromium, and ffmpeg.

## Beat fields
`d` seconds, `scene` (orbit, corridor, alarm, faces, biscuit, hatch, fire, schematic, fans, black, card), `cap` caption with {g:gold} {r:red} {b:cyan} markup,
`cam` {z:[from,to], x:[..], y:[..], shake}, `chip` {type: real|tag|rule|hud}, `flash`, plus scene-specific options (expr, glow, step, ...).
Top-level `pins` keep a headline on screen across beats.

## Workflow
1. Write the script and beats (Claude). 2. Render. 3. Record or generate narration from `*.narration.txt`, then re-time `d` values to the audio using `*.timing.json`. 4. Re-render with `--audio`.
Fact-check every "real" chip before publishing.

## Audio
    python3 audio.py episodes/ep01.json out      # out.music.wav, out.sfx.wav, out.mix.wav (needs numpy)
    ffmpeg -i out.mp4 -i out.mix.wav -c:v copy -c:a aac -b:a 192k -shortest out-with-audio.mp4

Sound effects are chosen per beat from the scene and flags (whoosh on cuts, impact on `flash`, alarm, fire rumble, fan spin-down, hiss).
Override with `"sfx": ["hiss_rise"]` on a beat, and duck the music with `"quiet": true`. Narration is not generated: mix a voice track over `out.mix.wav`, with the music about 18 dB under the voice.

## Narrated build (one command)
    ./build.sh episodes/ep01.json OUTDIR NAME /path/to/venv/bin/python /path/to/kokoro-model [voice] [speed]

Uses Kokoro (`pip install kokoro-onnx soundfile`; model files `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub releases).
Each beat's `say` text is spoken, the beat length is fitted to the speech, the video is rendered to those timings, and the voice is mixed over ducked music and effects at about -16 LUFS.
Beat options: `say`, `pad` (silence after the line), `lead` (silence before it), `sfxDelay`. Pins can use `toBeat`.

## v2 engine (current)
`v2/` is the rebuilt engine: word-timed caption chunks, redrawn scenes, 1080x1920 output, parallel rendering.

    python3 v2/timing.py v2/episodes/ep01.json out.timed.json [words.json]   # words.json = per-word timings of the narration
    python3 v2/mix.py out.timed.json voice.mp3 SFX_DIR mix.wav               # voice + story sound effects + music bed
    node v2/render.js out.timed.json out.mp4 --audio mix.wav

Narration and word timings come from ElevenLabs (speech, then transcription). Replace IPA spellings and drop `[pause]` tokens in words.json before timing.

### Word timings without ElevenLabs transcription
`v2/align.py voice16k.wav script.txt words.json` force-aligns a known script to the narration offline with PocketSphinx
(`pip install pocketsphinx`; audio must be 16 kHz mono WAV, script lowercase words with numbers spelled out).
Checked against pause positions in the audio it was within about 65 ms. Every video is delivered with audio; if a pause is too short
for a sound cue (for example the three knocks in part 2), insert silence into the voice track and shift the later word times.
