"""Split a batch take into one clip per line at its N-1 longest pauses (the [long pause]s between lines).
More reliable than forced alignment for whispers, gasps and sobs. Word timings are spread by letter count over each clip's voiced span.
Usage: python3 tools/split_by_gaps.py take.mp3 episodes/X.lines.json SPEAKER OUT_DIR"""
import sys, os, json, re, subprocess, wave, numpy as np
take, lines_p, who, out = sys.argv[1:5]; os.makedirs(out, exist_ok=True)
E = json.load(open(lines_p)); td = os.path.basename(out.rstrip("/"))
L = [l for l in E["lines"] if l["who"] == who and l.get("take", E.get("takes", {}).get(who, td)) == td]
SR = 44100; y = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", take, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout, "<i2").astype(np.float64) / 32768
env = np.convolve(np.abs(y), np.ones(1764) / 1764, "same"); v = env > env.max() * .015
on = np.where(v)[0]; a0, a1 = on[0], on[-1]
gaps = []; i = a0
while i < a1:
    if not v[i]:
        j = i
        while j < a1 and not v[j]: j += 1
        gaps.append((j - i, i, j)); i = j
    else: i += 1
n = len(L); big = sorted(sorted(gaps, reverse=True)[:n - 1], key=lambda g: g[1])
if len(big) != n - 1: sys.exit(f"{who}: found {len(big) + 1} groups for {n} lines")
cuts = [max(0, a0 - int(.08 * SR))] + [(g[1] + g[2]) // 2 for g in big] + [min(len(y), a1 + int(.15 * SR))]
words = {}
for k, l in enumerate(L):
    seg = y[cuts[k]:cuts[k + 1]]; e2 = env[cuts[k]:cuts[k + 1]]; vv = np.where(e2 > env.max() * .015)[0]
    s0 = max(0, vv[0] - int(.06 * SR)); s1 = min(len(seg), vv[-1] + int(.12 * SR)); seg = seg[s0:s1]
    with wave.open(os.path.join(out, l["id"] + ".wav"), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(seg, -1, 1) * 32767).astype("<i2").tobytes())
    ws = re.findall(r"[a-z0-9']+", re.sub(r"\[[^\]]*\]", " ", l["say"]).lower().replace("-", " ")); t0, t1 = .06, len(seg) / SR - .12; tot = sum(len(x) + 1 for x in ws) or 1; acc = 0; words[l["id"]] = []
    for x in ws: st = t0 + (t1 - t0) * acc / tot; acc += len(x) + 1; words[l["id"]].append([x, round(st, 3), round(t0 + (t1 - t0) * acc / tot, 3)])
    print(f"{l['id']}  {len(seg) / SR:5.2f}s  {l['say'][:50]}")
json.dump(words, open(os.path.join(out, "words.json"), "w"))
