"""Check an episode script against the voice budget and the target length BEFORE spending any credits.
Usage: python3 tools/voice_budget.py episodes/X.lines.json
Reads episodes/budget.json: {"elevenlabs_chars_per_video": N, "target_seconds": S, "tolerance_seconds": T, "offline_speakers": [...]}
- counts the characters ElevenLabs will bill (the full `say` text, tags included) per speaker; speakers listed as offline cost 0
- estimates runtime from the words (measured pace of past episodes) plus the gaps between lines
Exits 1 if the script is over the character cap or outside the target length, and says by how much."""
import sys, json, re, os
lines_p = sys.argv[1]; B = json.load(open(os.path.join(os.path.dirname(lines_p), "budget.json")))
E = json.load(open(lines_p)); offline = set(B.get("offline_speakers", []))
per, words = {}, {}
for l in E["lines"]:
    spoken = re.sub(r"\[[^\]]*\]", "", l["say"]); w = len(re.findall(r"[A-Za-z0-9']+", spoken))
    per[l["who"]] = per.get(l["who"], 0) + (0 if l["who"] in offline or l["who"] == "text" else len(l["say"])); words[l["who"]] = words.get(l["who"], 0) + w
# pace measured on JP05/JP06 after tightening: about 2.55 spoken words per second, plus ~0.14 s between lines
est = sum(v for k, v in words.items() if k != "text") / 2.55 + sum(.65 + 0 for l in E["lines"] if l["who"] == "text") + words.get("text", 0) / 3.2 + 0.14 * len(E["lines"]) + 0.5
cap, tgt, tol = B["elevenlabs_chars_per_video"], B["target_seconds"], B.get("tolerance_seconds", 5)
# each speaker is recorded as one take with " [long pause] " (14 billed characters) between lines
nlines = {}
for l in E["lines"]:
    if l["who"] != "text" and l["who"] not in offline: nlines[l["who"]] = nlines.get(l["who"], 0) + 1
for k, n in nlines.items(): per[k] += 14 * (n - 1)
total = sum(per.values()); ok = True
print(f"{'speaker':10} {'chars':>6} {'words':>6}")
for k in per: print(f"{k:10} {per[k]:6} {words[k]:6}" + ("   (caption only, free)" if k == "text" else "   (offline, free)" if k in offline else ""))
print(f"ElevenLabs characters: {total} / cap {cap}" + ("  OK" if total <= cap else f"  OVER by {total - cap}"))
print(f"estimated length: {est:.0f} s / target {tgt} +- {tol} s" + ("  OK" if abs(est - tgt) <= tol else f"  {'LONG' if est > tgt else 'SHORT'} by {abs(est - tgt):.0f} s"))
ok = total <= cap and abs(est - tgt) <= tol
sys.exit(0 if ok else 1)
