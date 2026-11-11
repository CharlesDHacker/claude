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
