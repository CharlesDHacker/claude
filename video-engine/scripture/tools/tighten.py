"""Tighten line clips: shorten internal pauses and optionally speed up some speakers; remaps words.json.
Usage: python3 tools/tighten.py episodes/X.lines.json audio/<ep>/lines [max_pause=0.22] [who=tempo,...]
Originals are kept in audio/<ep>/lines_orig (re-running starts from them)."""
import sys, os, json, shutil, subprocess, numpy as np, soundfile as sf
lines_p, d = sys.argv[1], sys.argv[2]; mp = float(sys.argv[3]) if len(sys.argv) > 3 else .22
tempo = dict((k, float(v)) for k, v in (x.split("=") for x in sys.argv[4].split(","))) if len(sys.argv) > 4 else {}
orig = d.rstrip("/") + "_orig"
if not os.path.exists(orig): shutil.copytree(d, orig)
W = json.load(open(os.path.join(orig, "words.json"))); who = {l["id"]: l["who"] for l in json.load(open(lines_p))["lines"]}
out = {}
for f in sorted(os.listdir(orig)):
    if not f.endswith(".wav"): continue
    lid = f[:-4]; y, sr = sf.read(os.path.join(orig, f)); mono = y if y.ndim == 1 else y.mean(1)
    hop = int(sr * .01); e = np.array([np.sqrt(np.mean(mono[i:i + hop] ** 2) + 1e-12) for i in range(0, len(mono) - hop, hop)])
    db = 20 * np.log10(e); sil = db < db.max() - 38; n = len(sil)
    first = int(np.argmax(~sil)); last = n - int(np.argmax(~sil[::-1]))
    cuts = []; i = first   # (start_s, removed_s)
    while i < last:
        if sil[i]:
            j = i
            while j < last and sil[j]: j += 1
            dur = (j - i) * .01
            if dur > mp + .02: cuts.append(((i * .01) + mp / 2, dur - mp))
            i = j
        else: i += 1
    segs = []; pos = 0; xf = int(sr * .02)
    for s0, rm in cuts:
        a, b = int(s0 * sr), int((s0 + rm) * sr); segs.append(y[pos:a]); pos = b
    segs.append(y[pos:]); z = segs[0]
    for s in segs[1:]:
        k = min(xf, len(z), len(s)); ramp = np.linspace(0, 1, k)[:, None] if y.ndim > 1 else np.linspace(0, 1, k)
        z = np.concatenate([z[:len(z) - k], z[len(z) - k:] * (1 - ramp) + s[:k] * ramp, s[k:]])
    def remap(t):
        sh = 0
        for s0, rm in cuts:
            if t >= s0 + rm: sh += rm
            elif t > s0: sh += t - s0
        return t - sh
    ws = [[w, remap(a), remap(b)] for w, a, b in W.get(lid, [])]
    tp = tempo.get(who.get(lid), 1.0); dst = os.path.join(d, f)
    sf.write(dst, z, sr)
    if tp != 1.0:
        tmp = dst + ".t.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", dst, "-filter:a", f"atempo={tp}", tmp], check=True); os.replace(tmp, dst)
        ws = [[w, a / tp, b / tp] for w, a, b in ws]
    if lid in W: out[lid] = [[w, round(a, 3), round(b, 3)] for w, a, b in ws]
    print(lid, round(len(y) / sr, 2), "->", round(sf.info(dst).duration, 2))
json.dump(out, open(os.path.join(d, "words.json"), "w"))
