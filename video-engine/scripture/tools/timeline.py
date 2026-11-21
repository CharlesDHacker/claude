"""Lay the voiced lines on a timeline and resolve the shot list into a timed episode for the renderer.
Usage: python3 timeline.py episodes/X.lines.json episodes/X.shots.json audio/<ep>/lines OUT.timed.json OUT.voice.wav
- each line is placed after the previous one plus a gap (shots.json "gaps", default 0.32 s; a shot's "lead" opens extra room before its first line)
- caption chunks inside a line are split at the line's own longest internal pauses
- mouth envelopes (30 fps, 0..1) per line drive lip flap
- option values "@L15.1+0.35" resolve to (start of chunk 1 of line L15) + 0.35 s, relative to the shot start"""
import sys, json, re, subprocess, numpy as np
lines_p, shots_p, clip_dir, out_p, voice_p = sys.argv[1:6]
E = json.load(open(lines_p)); S = json.load(open(shots_p)); SR = 44100; FPS = 30
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").astype(np.float64) / 32768
lead_of = {sh["at"]: sh.get("lead", S.get("lead", .35)) for sh in S["shots"] if "atc" not in sh}
gaps = S.get("gaps", {}); t = 0.35; L = []; clips = []
import os
WORDS = json.load(open(os.path.join(clip_dir, "words.json"))) if os.path.exists(os.path.join(clip_dir, "words.json")) else {}
def cap_words(text):  # [(word, colour key)] from caption markup
    out = []
    for m in re.finditer(r"\{(\w+):([^}]*)\}|([^{]+)", text):
        key, body = (m.group(1), m.group(2)) if m.group(1) else ("base", m.group(3))
        for w in body.split():
            if out and not re.search(r"[A-Za-z0-9]", w) and not body.startswith(w + " ") : out[-1] = (out[-1][0] + w, out[-1][1])
            elif out and not re.search(r"[A-Za-z0-9]", w): out[-1] = (out[-1][0] + w, out[-1][1])
            else: out.append((w, key))
    return out
for i, ln in enumerate(E["lines"]):
    y = load(f"{clip_dir}/{ln['id']}.wav")
    if i and ln["id"] in lead_of: t += max(lead_of[ln["id"]] - .15, 0)
    d = len(y) / SR
    # envelope
    hop = SR // FPS; rms = np.array([np.sqrt(np.mean(y[k:k + hop] ** 2) + 1e-12) for k in range(0, len(y), hop)])
    db = 20 * np.log10(rms); env = np.clip((db + 42) / 26, 0, 1); env = np.convolve(env, [.25, .5, .25], "same")
    # caption chunk split at the longest internal pauses
    caps = ln["cap"]; fr = 20 * np.log10(np.array([np.sqrt(np.mean(y[k:k + 441] ** 2) + 1e-12) for k in range(0, len(y), 441)]))
    quiet = fr < fr.max() - 30; runs = []; k = 0
    while k < len(quiet):
        if quiet[k]:
            j = k
            while j < len(quiet) and quiet[j]: j += 1
            if k > 5 and j < len(quiet) - 5: runs.append((j - k, (k + j) / 2 * .01))
            k = j
        else: k += 1
    nb = len(caps) - 1
    acc = []
    for _, m in sorted(runs, reverse=True):
        if len(acc) < nb and .45 < m < d - .45 and all(abs(m - q) > .6 for q in acc): acc.append(m)
    if nb and len(acc) == nb: bounds = sorted(acc)
    else:  # by word count
        w = [len(re.sub(r"\{\w+:([^}]*)\}", r"\1", c).split()) for c in caps]; cw = np.cumsum(w) / sum(w); bounds = [d * x for x in cw[:-1]]
    edges = [0] + bounds + [d]
    sw = WORDS.get(ln["id"])
    if sw: edges = [0] + [sw[min(len(sw) - 1, round(len(sw) * sum(len(cap_words(c)) for c in caps[:j + 1]) / max(1, sum(len(cap_words(c)) for c in caps))))][1] - .05 for j in range(len(caps) - 1)] + [d]
    capl = []; allw = [w for c in caps for w in cap_words(c)]; gi = 0
    for j, c in enumerate(caps):
        cw = cap_words(c); ws = []
        for i, (w, key) in enumerate(cw):
            if sw: tt0 = sw[min(len(sw) - 1, int(gi * len(sw) / max(1, len(allw))))][1]
            else: tt0 = edges[j] + (edges[j + 1] - edges[j]) * i / max(1, len(cw)) * .85
            ws.append([w, key, round(t + max(tt0, edges[j]) - .03, 3)]); gi += 1
        capl.append(dict(text=c, t0=round(t + edges[j], 3), t1=round(t + edges[j + 1], 3), words=ws))
    L.append(dict(id=ln["id"], who=ln["who"], t0=round(t, 3), t1=round(t + d, 3), env=[round(float(v), 2) for v in env], caps=capl))
    clips.append((t, y)); t += d + gaps.get(ln["id"], .32)
total = L[-1]["t1"] + S.get("tail", 2.5)
byid = {l["id"]: l for l in L}
def at(v, base):
    if not isinstance(v, str) or not v.startswith("@"): return v
    m = re.match(r"@(L\d+)\.(\d+)([+-][\d.]+)?$", v); l = byid[m.group(1)]
    return round(l["caps"][int(m.group(2))]["t0"] + float(m.group(3) or 0) - base, 3)
def res(x, base):
    if isinstance(x, dict): return {k: res(v, base) for k, v in x.items()}
    if isinstance(x, list): return [res(v, base) for v in x]
    return at(x, base)
shots = []
for i, sh in enumerate(S["shots"]):
    l = byid[sh["at"]]; t0 = 0.0 if i == 0 else round(l["t0"] - sh.get("lead", S.get("lead", .35)), 3)
    if "atc" in sh: t0 = round(at(sh["atc"], 0), 3)
    shots.append(dict(sh, t0=t0))
for i, sh in enumerate(shots):
    sh["t1"] = shots[i + 1]["t0"] if i + 1 < len(shots) else round(total, 3)
    base = sh["t0"]
    for k in ("o", "sfx"):
        if k in sh: sh[k] = res(sh[k], base)
    for k in ("shakeAt", "labelAt", "kicks", "flashes"):
        if k in sh: sh[k] = [at(v, base) for v in sh[k]] if isinstance(sh[k], list) else at(sh[k], base)
    if "pops" in sh:  # {"L13": [x, y, rot, size?, text?, delay? ("@L13.2" or seconds)]}; "L21:2" = a second pop on L21
        pl = []
        for key, p in sh["pops"].items():
            lid = key.split(":")[0]; d = dict(line=lid, x=p[0], y=p[1], rot=p[2])
            if len(p) > 3 and p[3]: d["size"] = p[3]
            if len(p) > 4 and p[4]: d["text"] = p[4]
            if len(p) > 5: d["delay"] = at(p[5], byid[lid]["t0"]) if isinstance(p[5], str) else p[5]
            pl.append(d)
        sh["pops"] = pl
ti = S.get("title"); title = dict(text=ti["text"], sub=ti["sub"], t0=0.15, t1=byid[ti["until"]]["t1"] + .3) if ti else None
json.dump(dict(total=round(total, 3), title=title, lines=L, shots=shots, loop=S.get("loop", False)), open(out_p, "w"), indent=0)
v = np.zeros(int((total + 1) * SR))
for t0, y in clips: a = int(t0 * SR); v[a:a + len(y)] += y
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", voice_p], input=(np.clip(v, -1, 1) * 32767).astype("<i2").tobytes(), check=True)
print(f"{len(L)} lines, {len(shots)} shots, total {total:.2f}s, mean shot {total / len(shots):.2f}s")
for l in L:
    if len(l["caps"]) > 1: print(l["id"], [(c["t0"], c["text"][:24]) for c in l["caps"]])
