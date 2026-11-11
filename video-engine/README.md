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
