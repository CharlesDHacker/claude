"""Record one speaker's lines with the offline Kokoro voice as a single take (lines joined by 1.2 s pauses), levelled to
a target RMS, so align_split.py can cut it like an ElevenLabs take. Delivery tags set the pace per line.
Usage: python3 kokoro_take.py episodes/X.lines.json SPEAKER VOICE OUT.wav KOKORO_DIR [target_dbfs]"""
import sys, json, re, numpy as np, wave
from kokoro_onnx import Kokoro
ep_p, who, voice, out, kdir = sys.argv[1:6]; target = float(sys.argv[6]) if len(sys.argv) > 6 else -20.0
PACE = {"whispering": .9, "ominous": .9, "awed": .9, "warmly": .93, "storytelling": .98, "gently": .93, "intense": 1.04, "excited": 1.06, "smirking": 1.0, "smug": .97, "amused": 1.0, "knowingly": .96}
k = Kokoro(f"{kdir}/kokoro-v1.0.onnx", f"{kdir}/voices-v1.0.bin"); SR = None; parts = []
for l in json.load(open(ep_p))["lines"]:
    if l["who"] != who: continue
    tags = re.findall(r"\[([^\]]*)\]", l["say"]); txt = re.sub(r"\[[^\]]*\]", "", l["say"]).strip()
    sp = np.prod([PACE.get(t, 1.0) for t in tags]) if tags else 1.0
    s, SR = k.create(txt, voice=voice, speed=float(sp), lang="en-gb" if voice[0] == "b" else "en-us"); s = np.asarray(s, dtype=np.float64)
    parts += [s, np.zeros(int(1.2 * SR))]; print(l["id"], f"{len(s) / SR:.2f}s pace {sp:.2f}")
y = np.concatenate(parts); act = y[np.abs(y) > 1e-3]; y = y * 10 ** (target / 20) / (np.sqrt(np.mean(act ** 2)) + 1e-9); y = y / max(1, np.max(np.abs(y)) / .97)
with wave.open(out, "w") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
