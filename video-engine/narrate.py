"""Generate narration for an episode with Kokoro (offline TTS) and re-time the beats to the speech.
Usage: python narrate.py episodes/ep01.json outprefix --model DIR [--voice am_michael] [--speed 1.0]
Writes outprefix.timed.json (beat durations fitted to the voice, pins re-timed) and outprefix.voice.wav.
Each beat's spoken text is its "say" field (falls back to the caption). "pad" = silence after the line, "lead" = silence before it."""
import sys, json, re, os, wave, argparse
import numpy as np
from kokoro_onnx import Kokoro
SR_OUT = 44100
ap = argparse.ArgumentParser(); ap.add_argument("ep"); ap.add_argument("pre"); ap.add_argument("--model", required=True)
ap.add_argument("--voice", default="am_michael"); ap.add_argument("--speed", type=float, default=1.0)
a = ap.parse_args()
ep = json.load(open(a.ep))
k = Kokoro(os.path.join(a.model, "kokoro-v1.0.onnx"), os.path.join(a.model, "voices-v1.0.bin"))

def trim(x, sr, thr=0.012):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx): return x
    return x[max(idx[0] - int(0.01 * sr), 0): idx[-1] + int(0.05 * sr)]
def resample(x, sr):
    n = int(len(x) * SR_OUT / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)

clips, t, starts = [], 0.0, []
for i, b in enumerate(ep["beats"]):
    text = b.get("say")
    if text is None: text = re.sub(r"\{[grb]:([^}]*)\}", r"\1", b.get("cap", "")).capitalize()
    lead = b.get("lead", 0.06)
    if text:
        x, sr = k.create(text, voice=a.voice, speed=a.speed, lang="en-us")
        x = resample(trim(np.asarray(x, dtype=np.float64), sr), sr)
        x = x / (np.abs(x).max() + 1e-9) * 0.85
        ends_soft = text.rstrip().endswith((",", "...", ":"))
        pad = b.get("pad", 0.14 if ends_soft else 0.3)
        d = max(lead + len(x) / SR_OUT + pad, b.get("min", 1.1))
        clips.append((t + lead, x))
    else:
        d = b["d"]
    print(f"{i:2d} {t:6.2f} +{d:4.2f}  {text}")
    starts.append(t); b["d"] = round(d * 30) / 30; t += b["d"]
total = t
for p in ep.get("pins", []):
    if "toBeat" in p: p["to"] = starts[p["toBeat"]]
    if "fromBeat" in p: p["from"] = starts[p["fromBeat"]]
voice = np.zeros(int(total * SR_OUT) + SR_OUT)
for at, x in clips:
    i = int(at * SR_OUT); voice[i:i + len(x)] += x
voice = voice[: int(total * SR_OUT)]
with wave.open(a.pre + ".voice.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT); w.writeframes((np.clip(voice, -1, 1) * 32767).astype("<i2").tobytes())
json.dump(ep, open(a.pre + ".timed.json", "w"), indent=1)
print(f"total {total:.2f}s, voice {a.voice}, speed {a.speed}")
