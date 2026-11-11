"""Turn an episode into a timed episode: every caption chunk and shot gets start times.
Usage: python3 timing.py episodes/ep01.json out.timed.json [words.json]
Without words.json the times are estimated from word lengths (for previews). With it (a list of
{"text","start","end"} from a speech-to-text pass over the narration) chunks are aligned to the real voice."""
import sys, json, re, difflib
ep = json.load(open(sys.argv[1]))
tok = lambda s: re.findall(r"[a-z0-9']+", re.sub(r"\{[grb]:([^}]*)\}", r"\1", s).lower())
chunks = [(si, ci, ch) for si, s in enumerate(ep["shots"]) for ci, ch in enumerate(s["chunks"])]
script = []  # (token, chunk index)
for k, (_, _, ch) in enumerate(chunks):
    said = ch.get("say", ch.get("cap", ""))
    ch["_n"] = len(tok(said)); script += [(w, k) for w in tok(said)]
if len(sys.argv) > 3:
    words = [w for w in json.load(open(sys.argv[3])) if re.search(r"[A-Za-z0-9]", w["text"])]
    heard = [tok(w["text"])[0] if tok(w["text"]) else "" for w in words]
    sm = difflib.SequenceMatcher(a=[w for w, _ in script], b=heard, autojunk=False)
    at = {}
    for blk in sm.get_matching_blocks():
        for j in range(blk.size): at[blk.a + j] = words[blk.b + j]["start"]
    known = sorted(at); starts = {}
    ends = {}
    for blk in sm.get_matching_blocks():
        for j in range(blk.size): ends[script[blk.a + j][1]] = words[blk.b + j]["end"]
    first = {}
    for i, (_, k) in enumerate(script): first.setdefault(k, i)
    for k, i in first.items():
        if i in at: starts[k] = at[i]; continue
        lo = max([q for q in known if q < i], default=None); hi = min([q for q in known if q > i], default=None)
        if lo is None: starts[k] = max(at[hi] - .3 * (hi - i), 0)
        elif hi is None: starts[k] = at[lo] + .3 * (i - lo)
        else: starts[k] = at[lo] + (at[hi] - at[lo]) * (i - lo) / (hi - lo)
    end = words[-1]["end"]; matched = len(at) / max(len(script), 1)
    print(f"aligned {len(at)}/{len(script)} script words ({matched:.0%}) to {len(words)} spoken words")
else:
    t = .25; starts = {}; ends = {}
    for k, (_, _, ch) in enumerate(chunks):
        starts[k] = t; said = ch.get("say", ch.get("cap", ""))
        for w in re.findall(r"\S+", re.sub(r"\{[grb]:([^}]*)\}", r"\1", said)):
            t += .17 + .026 * len(re.sub(r"\W", "", w))
            ends[k] = t
            t += .42 if re.search(r"(\.\.\.|…)", w) else .34 if re.search(r"[.?!]", w) else .16 if "," in w else 0
    end = t
prev = -1
for k, (si, ci, ch) in enumerate(chunks):
    ch["t0"] = round(max(starts.get(k, prev + .2) - .04, prev + .05), 3); prev = ch["t0"]; ch.pop("_n", None)
    if k in ends: ch["te"] = round(ends[k], 3)
shots = ep["shots"]
for i, s in enumerate(shots): s["t0"] = 0.0 if i == 0 else round(s["chunks"][0]["t0"] - .05, 3)
for i, s in enumerate(shots): s["t1"] = shots[i + 1]["t0"] if i + 1 < len(shots) else round(end + ep.get("tail", 1.2), 3)
ep["total"] = shots[-1]["t1"]
json.dump(ep, open(sys.argv[2], "w"), indent=1)
print(f"{len(shots)} shots, {len(chunks)} caption chunks, total {ep['total']:.2f}s, mean shot {ep['total']/len(shots):.2f}s")
