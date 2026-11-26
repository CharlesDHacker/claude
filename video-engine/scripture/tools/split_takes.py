"""Split one batch TTS take (lines separated by long pauses) into per-line WAV clips.
Usage: python3 split_takes.py take.mp3 OUT_DIR ID1 ID2 ... (one id per spoken line, in order)
Finds speech regions by energy, then keeps the N-1 widest gaps as line boundaries."""
import sys, os, subprocess, numpy as np
src, out, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
SR = 44100
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
y = np.frombuffer(raw, "<i2").astype(np.float64) / 32768
hop = int(SR * .01); fr = np.array([np.sqrt(np.mean(y[i:i + hop * 2] ** 2) + 1e-12) for i in range(0, len(y) - hop * 2, hop)])
db = 20 * np.log10(fr); on = db > max(db.max() - 38, -50)
# speech runs
runs = []; i = 0
while i < len(on):
    if on[i]:
        j = i
        while j < len(on) and on[j]: j += 1
        runs.append([i, j]); i = j
    else: i += 1
runs = [r for r in runs if r[1] - r[0] >= 3]
gaps = sorted(range(len(runs) - 1), key=lambda k: runs[k + 1][0] - runs[k][1], reverse=True)[:len(ids) - 1]
cuts = sorted(gaps); segs = []; s = 0
for k in cuts: segs.append((runs[s][0], runs[k][1])); s = k + 1
segs.append((runs[s][0], runs[-1][1]))
os.makedirs(out, exist_ok=True)
for lid, (a, b) in zip(ids, segs):
    a = max(0, a * hop - int(.04 * SR)); b = min(len(y), b * hop + int(.12 * SR))
    clip = y[a:b].copy(); f = int(.01 * SR); clip[:f] *= np.linspace(0, 1, f); clip[-f:] *= np.linspace(1, 0, f)
    p = os.path.join(out, lid + ".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", p], input=(clip * 32767).astype("<i2").tobytes(), check=True)
    print(f"{lid}  {a / SR:6.2f}-{b / SR:6.2f}  {(b - a) / SR:5.2f}s")
gl = [round((runs[k + 1][0] - runs[k][1]) * .01, 2) for k in sorted(gaps)]
print("boundary gaps:", gl, " smallest kept:", min(gl) if gl else None)
