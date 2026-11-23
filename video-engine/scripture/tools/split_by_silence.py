"""Split a take into one clip per line by its silences (for screams and shouts that forced alignment mislabels).
Usage: python3 split_by_silence.py take.mp3 episodes/X.lines.json SPEAKER OUT_DIR
Needs exactly as many voiced groups (pauses > 0.45 s) as the speaker has lines; word timings are spread by letter count."""
import sys, json, re, subprocess, wave, numpy as np
take, lines_p, who, out = sys.argv[1:5]
L = [l for l in json.load(open(lines_p))["lines"] if l["who"] == who]
SR = 44100; y = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", take, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout, "<i2").astype(np.float64) / 32768
env = np.convolve(np.abs(y), np.ones(2205) / 2205, "same"); v = env > env.max() * .02; segs = []; i = 0
while i < len(v):
    if v[i]:
        j = i
        while j < len(v) and v[j]: j += 1
        segs.append((i / SR, j / SR)); i = j
    else: i += 1
g = []
for a, b in segs:
    if g and a - g[-1][1] < .45: g[-1] = (g[-1][0], b)
    else: g.append((a, b))
if len(g) != len(L): sys.exit(f"{len(g)} voiced groups for {len(L)} lines")
def words_of(say): return [w for w in re.findall(r"[a-z']+", re.sub(r"\[[^\]]*\]", " ", say).replace("-", " ").lower()) if w.strip("'")]
W = {}
for k, (l, (a, b)) in enumerate(zip(L, g)):
    s0 = max(0, a - .08); e0 = b + .12
    if k + 1 < len(g): e0 = min(e0, (b + g[k + 1][0]) / 2)
    seg = y[int(s0 * SR):int(e0 * SR)].copy(); f = int(.01 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    with wave.open(f"{out}/{l['id']}.wav", "w") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(seg, -1, 1) * 32767).astype("<i2").tobytes())
    ws = words_of(l["say"]); tot = sum(len(x) + 1 for x in ws); acc = 0; arr = []
    for x in ws: t0 = (a - s0) + (b - a) * acc / tot; acc += len(x) + 1; arr.append([x, round(t0, 3), round((a - s0) + (b - a) * acc / tot, 3)])
    W[l["id"]] = arr; print(l["id"], f"{e0 - s0:.2f}s", " ".join(ws))
json.dump(W, open(f"{out}/words.json", "w"))
