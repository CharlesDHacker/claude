"""Forced alignment of a known script to narration audio with PocketSphinx (offline). Writes [{text,start,end}]."""
import sys, json, wave, os
from pocketsphinx import Decoder, get_model_path
wav, text, out = sys.argv[1], open(sys.argv[2]).read().split(), sys.argv[3]
mp = get_model_path()
extra = {"teo": "T EY OW", "ava": "EY V AH", "mei": "M EY", "butterscotch": "B AH T ER S K AA CH", "phobos": "F OW B AA S", "deimos": "D EY M AH S", "snailfish": "S N EY L F IH SH", "baumgartner": "B AW M G AA R T N ER"}
dic = os.path.join(os.path.dirname(out), "align.dict")
have = {}
for line in open(os.path.join(mp, "en-us", "cmudict-en-us.dict")):
    w, _, p = line.strip().partition(" "); have.setdefault(w, p)
miss = [w for w in set(text) if w not in have and w not in extra]
if miss: sys.exit("words missing from dictionary: " + ", ".join(sorted(miss)))
with open(dic, "w") as f:
    for w in sorted(set(text)): f.write(f"{w} {extra.get(w) or have[w]}\n")
d = Decoder(hmm=os.path.join(mp, "en-us", "en-us"), dict=dic, lm=None, loglevel="FATAL", beam=1e-100, wbeam=1e-80, pbeam=1e-100)
d.set_align_text(" ".join(text))
w = wave.open(wav); assert w.getframerate() == 16000 and w.getnchannels() == 1
d.start_utt(); d.process_raw(w.readframes(w.getnframes()), full_utt=True); d.end_utt()
fr = 0.01
res = [{"text": s.word, "start": round(s.start_frame * fr, 3), "end": round((s.end_frame + 1) * fr, 3)} for s in d.seg() if s.word not in ("<sil>", "<s>", "</s>", "(NULL)") and not s.word.startswith("[")]
json.dump(res, open(out, "w")); print(len(res), "of", len(text), "words aligned; last ends", res[-1]["end"] if res else None)
