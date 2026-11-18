"""Split one batch TTS take into per-line clips by forced alignment (PocketSphinx), and keep per-word timings.
Usage: python3 align_split.py take.mp3 episodes/X.lines.json SPEAKER OUT_DIR
Writes OUT_DIR/<id>.wav for each of SPEAKER's lines (in script order) and OUT_DIR/words.json {id: [[word, start, end], ...]}
with times relative to each clip. Cut points sit in the middle of the silence between lines, so nothing is clipped."""
import sys, json, re, os, subprocess, wave, numpy as np
from pocketsphinx import Decoder, get_model_path
take, lines_p, who, out = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
EXTRA = {"ishbi": "IH SH B AY", "benob": "B IY N AA B", "sibbecai": "S IH B AH K AY", "elhanan": "EH L HH EY N AH N", "saph": "S AE F",
         "abishai": "AH B IH SH AY", "gath": "G AE TH", "spearhead": "S P IH R HH EH D", "selah": "S IY L AH", "sackcloth": "S AE K K L AO TH", "nineveh": "N IH N AH V AH", "jonah": "JH OW N AH", "ewwww": "IY UW", "tarshish": "T AA R SH IH SH", "balaam": "B EY L AH M",
         "balak": "B EY L AE K", "toby": "T OW B IY", "goliath's": "G AH L AY AH TH S", "philistines": "F IH L AH S T IY N Z"}
IPA = {"/ˈɪʃbaɪ ˈbiːnɒb/": "ishbi benob", "/ˈsɪbəkaɪ/": "sibbecai", "/ɛlˈheɪnən/": "elhanan"}
def words_of(say):
    for k, v in IPA.items(): say = say.replace(k, v)
    say = re.sub(r"\[[^\]]*\]", " ", say).replace("TWENTY-FOUR", "twenty four").replace("-", " ")
    return [w for w in re.findall(r"[a-z']+", say.lower()) if w.strip("'")]
E = json.load(open(lines_p)); L = [l for l in E["lines"] if l["who"] == who]
script = [(w, l["id"]) for l in L for w in words_of(l["say"])]
mp = get_model_path(); have = {}
for line in open(os.path.join(mp, "en-us", "cmudict-en-us.dict")):
    w, _, p = line.strip().partition(" "); have.setdefault(w, p)
miss = sorted({w for w, _ in script if w not in have and w not in EXTRA})
if miss: sys.exit("missing pronunciations: " + ", ".join(miss))
dic = os.path.join(out, "align.dict")
with open(dic, "w") as f:
    for w in sorted({w for w, _ in script}): f.write(f"{w} {EXTRA.get(w) or have[w]}\n")
SR = 16000; raw = subprocess.run(["ffmpeg", "-v", "error", "-i", take, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
d = Decoder(hmm=os.path.join(mp, "en-us", "en-us"), dict=dic, lm=None, loglevel="FATAL", beam=1e-100, wbeam=1e-80, pbeam=1e-100)
d.set_align_text(" ".join(w for w, _ in script)); d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
segs = [(s.word, s.start_frame * .01, (s.end_frame + 1) * .01) for s in d.seg() if s.word not in ("<sil>", "<s>", "</s>", "(NULL)") and not s.word.startswith("[")]
if len(segs) != len(script):
    if len({l for _, l in script}) > 1: sys.exit(f"aligned {len(segs)} of {len(script)} words: alignment failed")
    # single line: spread the words over the voiced span instead
    y0 = np.frombuffer(raw, "<i2").astype(np.float64) / 32768; env = np.convolve(np.abs(y0), np.ones(160) / 160, "same"); on = np.where(env > env.max() * .05)[0]
    a0, a1 = on[0] / SR, on[-1] / SR; ws = [w for w, _ in script]; tot = sum(len(w) + 1 for w in ws); acc = 0; segs = []
    for w in ws: s0 = a0 + (a1 - a0) * acc / tot; acc += len(w) + 1; segs.append((w, s0, a0 + (a1 - a0) * acc / tot))
per = {}
for (w, lid), (_, a, b) in zip(script, segs): per.setdefault(lid, []).append([w, a, b])
ids = [l["id"] for l in L]; y = np.frombuffer(raw, "<i2").astype(np.float64) / 32768
# hi-res source for the clips
SR2 = 44100; y2 = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", take, "-ac", "1", "-ar", str(SR2), "-f", "s16le", "-"], capture_output=True, check=True).stdout, "<i2").astype(np.float64) / 32768
def quiet_point(a, b):  # quietest 50 ms window between a and b (seconds)
    if b - a < .06: return (a + b) / 2
    best, bt = 1e9, (a + b) / 2
    for t in np.arange(a, b - .05, .01):
        e = np.mean(y[int(t * SR):int((t + .05) * SR)] ** 2)
        if e < best: best, bt = e, t + .025
    return bt
cuts = [max(0, per[ids[0]][0][1] - .15)] + [quiet_point(per[ids[i]][-1][2], per[ids[i + 1]][0][1]) for i in range(len(ids) - 1)] + [min(len(y) / SR, per[ids[-1]][-1][2] + .4)]
words = {}
for i, lid in enumerate(ids):
    a, b = cuts[i], cuts[i + 1]
    # trim leading/trailing silence inside [a, b] but keep breaths short
    seg = y2[int(a * SR2):int(b * SR2)]; env = np.convolve(np.abs(seg), np.ones(441) / 441, "same"); thr = env.max() * .03
    on = np.where(env > thr)[0]; s0 = max(0, on[0] - int(.06 * SR2)); s1 = min(len(seg), on[-1] + int(.12 * SR2)); clip = seg[s0:s1].copy()
    f = int(.008 * SR2); clip[:f] *= np.linspace(0, 1, f); clip[-f:] *= np.linspace(1, 0, f)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR2), "-ac", "1", "-i", "-", os.path.join(out, lid + ".wav")], input=(clip * 32767).astype("<i2").tobytes(), check=True)
    off = a + s0 / SR2; words[lid] = [[w, round(st - off, 3), round(en - off, 3)] for w, st, en in per[lid]]
    print(f"{lid} {len(clip) / SR2:5.2f}s  {' '.join(w for w, _, _ in per[lid])[:70]}")
json.dump(words, open(os.path.join(out, "words.json"), "w"))
