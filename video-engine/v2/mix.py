"""Mix the narration with sound effects and a synthesized music bed, timed to a timed episode.
Usage: python3 mix.py timed.json voice.(mp3|wav) SFX_DIR out.wav
SFX_DIR may hold alarm.mp3, hiss1.mp3, hiss2.mp3, fan.mp3 (ElevenLabs); anything missing is synthesized.
No whooshes and no caption ticks: only sounds that belong to the story."""
import sys, os, json, wave, subprocess
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import audio as A
SR, TAU = A.SR, A.TAU
ep = json.load(open(sys.argv[1])); voice_path, sfx_dir, out = sys.argv[2:5]
shots = ep["shots"]; total = ep["total"]; N = int(total * SR)

def load(path, tempo=None):
    af = ["-af", f"atempo={tempo}"] if tempo else []
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, *af, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").astype(np.float64) / 32768
def clip_or(name, synth):
    p = os.path.join(sfx_dir, name)
    return (A.norm(load(p)), True) if os.path.exists(p) else (synth(), False)
def loop(x, d, xf=0.15):
    n, k = int(d * SR), int(xf * SR); y = np.zeros(n + len(x)); i = 0
    while i < n:
        seg = x.copy(); seg[:k] *= np.linspace(0, 1, k); seg[-k:] *= np.linspace(1, 0, k)
        y[i:i + len(seg)] += seg; i += len(x) - k
    return y[:n]
def env(x, a=0.05, r=0.3):
    x = x.copy(); na, nr = min(int(a * SR), len(x) // 2), min(int(r * SR), len(x) // 2)
    x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr); return x

sfx = np.zeros((N, 2)); log = []
def ev(name, at, sig, gain, pan=0.0):
    A.place(sfx, max(at, 0), sig, gain, pan); log.append((round(float(at), 2), name))
alarm, el_alarm = clip_or("alarm.mp3", lambda: A.alarm(3.0))
fanclip = os.path.join(sfx_dir, "fan.mp3")
hisses = [A.norm(load(os.path.join(sfx_dir, f))) for f in ("hiss1.mp3", "hiss2.mp3") if os.path.exists(os.path.join(sfx_dir, f))]
by = lambda scene: [s for s in shots if s["scene"] == scene]
ct = lambda s, k: s["chunks"][min(k, len(s["chunks"]) - 1)]["t0"]
def knock():
    t = A.tt(0.4); return A.norm(np.sin(TAU * 150 * t) * np.exp(-t * 24) + .5 * np.sin(TAU * 410 * t) * np.exp(-t * 40) + .25 * np.sin(TAU * 980 * t) * np.exp(-t * 70) + A.norm(A.bp(A.noise(len(t)), 300, 2500)) * np.exp(-t * 90) * .5)
def tape():
    t = A.tt(0.5); return A.norm(A.norm(A.bp(A.noise(len(t)), 1200, 6000)) * np.minimum(t / .02, 1) * np.exp(-t * 6) * (1 + .5 * np.sin(TAU * 45 * t)))
def leak(d):
    x = loop(np.concatenate(hisses), d, .12) if hisses else A.hiss(d); tt_ = np.arange(len(x)) / SR
    return x * (.8 + .2 * np.sin(TAU * .37 * tt_))
def ding_hi():
    t = A.tt(.6); return A.norm((np.sin(TAU * 1760 * t) + .5 * np.sin(TAU * 2637 * t)) * np.exp(-t * 7))
def blast():
    t = A.tt(3.2); n = len(t); body = A.norm(A.bp(A.noise(n), 50, 2600)) * np.minimum(t / .03, 1) * np.exp(-t * 1.5)
    low = np.sin(TAU * np.cumsum(70 * np.exp(-t * .9) + 24) / SR) * np.exp(-t * 1.2); air = A.norm(A.bp(A.noise(n), 2500, 9000)) * np.exp(-t * 3) * .5
    return A.norm(body + .8 * low + air)
def clunk():
    t = A.tt(0.35); return A.norm(np.sin(TAU * np.cumsum(60 + 80 * np.exp(-t * 40)) / SR) * np.exp(-t * 16) + .6 * np.sin(TAU * 1250 * t) * np.exp(-t * 60) + A.norm(A.bp(A.noise(len(t)), 800, 5000)) * np.exp(-t * 70) * .6)
def creak():
    t = A.tt(1.3); f = 160 + 90 * np.sin(TAU * 1.4 * t) + 60 * t; s1 = np.sin(TAU * np.cumsum(f) / SR) * (.6 + .4 * np.sin(TAU * 23 * t))
    return A.norm((s1 + .5 * A.norm(A.bp(A.noise(len(t)), 300, 1800))) * np.minimum(t / .08, 1) * np.exp(-t * 1.6) + A.norm(A.bp(A.noise(len(t)), 3000, 9000)) * np.exp(-t * 2.5) * .5)
def beep(f=880):
    t = A.tt(0.14); return A.fade(np.sin(TAU * f * t) + .3 * np.sin(TAU * f * 2 * t), .004, .03)
def spark():
    t = A.tt(0.45); return A.norm(A.norm(A.crackle(.45)) * np.exp(-t * 4) + A.norm(A.bp(A.noise(len(t)), 4000, 12000)) * np.exp(-t * 30) * .7)
def snd(tok, s):
    if tok.startswith("hitword@"):
        key = tok.split("@", 1)[1].lower(); w = next((x for x in ep.get("words", []) if x["text"].lower().startswith(key) and s["t0"] - .05 <= x["start"] < s["t1"]), None)
        if w:
            ev("slam riser", w["start"] - .45, env(A.hiss_rise(.45), .01, .02), .12); ev("slam hit", w["start"], A.impact(), .55); ev("slam ring", w["start"], ding_hi(), .12)
        return
    name, _, k = tok.partition("@"); use_end = k.endswith("e"); k = k.rstrip("e")
    at = (s["chunks"][int(k)].get("te", ct(s, int(k)) + .4) if use_end else ct(s, int(k))) if k else s["t0"]; d = max(s["t1"] - at, .3)
    if name == "launch":
        t = A.tt(2.2); x = A.norm(A.bp(A.noise(len(t)), 300, 6000)) * np.minimum(t / .25, 1) * np.exp(-t * 1.2) + .7 * np.sin(TAU * np.cumsum(60 + 140 * t) / SR) * np.exp(-t * 1.0)
        ev("launch", at, A.norm(x), .5); return
    if name == "boings":
        k = 0
        while at + k * .95 < s["t1"] - .1:
            t = A.tt(.32); x = np.sin(TAU * np.cumsum(220 + 520 * t / .32) / SR) * np.exp(-t * 9); ev("boing", at + k * .95, A.norm(x), .22); k += 1
        return
    if name == "party":
        t = A.tt(.7); horn = np.sign(np.sin(TAU * np.cumsum(420 + 160 * np.sin(TAU * 3 * t)) / SR)) * np.exp(-t * 2.5) * .5
        ev("party horn", at + .1, A.norm(A.bp(horn, 300, 4000)), .25)
        for j in range(5):
            tt_ = A.tt(.25); ev("cheer", at + .3 + j * .12, A.norm(A.bp(A.noise(len(tt_)), 600, 3000)) * np.exp(-tt_ * 8), .08)
        return
    if name == "airlock":
        hs = A.hiss(1.4) if not hisses else A.norm(np.concatenate(hisses))[:int(1.4 * SR)]
        ev("airlock clunk", at, clunk(), .5); ev("airlock hiss", at + .15, env(hs, .05, .6), .3); return
    if name == "ui":
        for j, fq in enumerate((880, 1175, 1568)): ev("call beep", at + .2 + j * .12, beep(fq), .16)
        return
    if name == "wind":
        x = A.norm(A.bp(A.noise(int(d * SR)), 120, 1400)); tt_ = np.arange(len(x)) / SR
        ev("storm wind", at, env(x * (.6 + .4 * np.sin(TAU * .35 * tt_)) * np.minimum(tt_ / 1.2, 1), .5, .6), .35); return
    if name in ("crowd", "cheer"):
        dd = d if name == "crowd" else min(d, 3.5); n = int(dd * SR); tt_ = np.arange(n) / SR; x = np.zeros(n); rr = np.random.default_rng(7)
        for j in range(18):   # many voices: formant-ish band noise with slow syllable rhythm
            f0 = 300 + rr.random() * 900; m = .5 + .5 * np.sin(TAU * (2 + rr.random() * 3) * tt_ + rr.random() * 6)
            x += A.norm(A.bp(A.noise(n), f0, f0 * 2.2)) * m ** 2
        x = A.norm(x) * np.minimum(tt_ / (.8 if name == "crowd" else .15), 1)
        if name == "cheer": x *= np.exp(-tt_ * .5) * 1.4
        ev(name, at, env(x, .1, .8), .16 if name == "crowd" else .22); return
    if name == "splash":
        t = A.tt(1.6); x = A.norm(A.bp(A.noise(len(t)), 200, 5000)) * np.minimum(t / .01, 1) * np.exp(-t * 4) + .6 * A.norm(A.bp(A.noise(len(t)), 80, 600)) * np.exp(-t * 1.5)
        ev("splash", at, A.norm(x), .5)
        for j in range(10):
            tb = A.tt(.12); f0 = 500 + 900 * np.random.default_rng(j).random(); ev("bubble", at + .4 + j * .09, np.sin(TAU * np.cumsum(f0 + 3000 * tb) / SR) * np.exp(-tb * 30), .06)
        return
    if name == "bubbles":
        rr = np.random.default_rng(4); j = 0
        while at + j * .23 < s["t1"] - .2:
            tb = A.tt(.1); f0 = 400 + 700 * rr.random(); ev("bubble", at + j * .23 + rr.random() * .1, np.sin(TAU * np.cumsum(f0 + 2500 * tb) / SR) * np.exp(-tb * 35), .07); j += 1
        return
    if name == "whale":
        rr = np.random.default_rng(9); t0_ = at; k2 = 0
        while t0_ < s["t1"] - .2:
            tb = A.tt(.03); ev("sperm whale click", t0_, A.norm(A.bp(A.noise(len(tb)), 800, 6000)) * np.exp(-tb * 200), .25); t0_ += .18 + .05 * rr.random(); k2 += 1
        return
    if name == "boil":
        dd = max(s["t1"] - at, .5); ev("boil rumble", at, env(A.rumble(dd), .2, .8), .45); ev("boil crackle", at, env(A.crackle(dd), .3, .8), .2); ev("steam hiss", at + .3, env(A.hiss(dd - .3), .5, .8), .3); return
    if name == "rocket":
        ev("rocket idle", at, env(A.rumble(d), .6, .5), .25); return
    if name == "knock3":
        for off in (.15, .5, .85): ev("knock", at + off, knock(), .85)
        return
    if name == "knock2":
        for off in (.05, .33): ev("knock", at + off, knock(), .8)
        return
    if name == "blast": ev("vent blast", at, blast(), .95); return
    if name == "clunk": ev("valve clunk", at, clunk(), .7); return
    if name == "creak": ev("hatch opening", at, creak(), .5); return
    if name == "beep": ev("countdown beep", at, beep(1320 if k == "3" else 880), .22); return
    if name == "spark": ev("sparks", at, spark(), .4); return
    if name == "cough":
        p = os.path.join(sfx_dir, "cough.mp3")
        if os.path.exists(p): ev("cough", at, A.norm(load(p)), .6)
        else:   # synthesized stand-in: two short breathy bursts
            for off, g in ((0, .5), (.24, .38)):
                t = A.tt(0.17); x = A.norm(A.bp(A.noise(len(t)), 350, 2600)) * np.minimum(t / .008, 1) * np.exp(-t * 22) + .4 * np.sin(TAU * np.cumsum(240 - 500 * t) / SR) * np.exp(-t * 30)
                ev("cough (synth)", at + off, A.norm(x), g)
        return
    if name == "impact": ev("impact", at, A.impact(), .55)
    elif name == "stamp": ev("stamp", at + .05, A.thud(), .4)
    elif name == "rumble": ev("fire rumble", at, env(A.rumble(d), .15, .4), .28); ev("fire crackle", at, env(A.crackle(d), .15, .4), .09, -.2)
    elif name == "hiss": ev("hiss", at, env(leak(d + .3), .01, .3), .42)
    elif name == "leak": ev("leak", at, env(leak(d), .1, .2), .16)
    elif name == "tape": ev("tape", at, tape(), .5)
    elif name == "knocks":
        ch = s["chunks"][int(k or 0)]; base = ch.get("te", ch["t0"] + .6)
        for off in (.12, .46, .8): ev("knock", base + off, knock(), .85)
for b in ep.get("beds", []):
    a = next(x for x in shots if x.get("id") == b["from"]); z = next(x for x in shots if x.get("id") == b["to"])
    t0b, t1b = a["t0"], ct(z, b.get("toChunk", 0)) + .25
    ev("leak bed", t0b, env(leak(t1b - t0b), .4, .25), b.get("gain", .06))
for i, s in enumerate(shots):
    sc, t0, t1 = s["scene"], s["t0"], s["t1"]; d = t1 - t0
    if "snd" in s:
        for tok in s["snd"]: snd(tok, s)
        continue
    if sc == "alarmUnit": ev("alarm", t0 + .25, env(loop(alarm, d - .25), .02, .25), .2)
    elif sc == "title": ev("impact", t0, A.impact(), .6)
    elif sc == "alarmGo": ev("impact", t0, A.impact(), .6); ev("alarm", t0 + .1, env(loop(alarm, d + .7), .02, .8), .24)
    elif sc == "hatchGlow":
        g = ct(s, 1); end = shots[i + 1]["t1"] if shots[i + 1]["scene"] == "rule1" else t1
        ev("impact", g, A.impact(), .5); ev("fire rumble", g, env(A.rumble(end - g), .15, .5), .3); ev("fire crackle", g, env(A.crackle(end - g), .15, .5), .1, -.2)
    elif sc in ("rule1", "rule2"): ev("stamp", t0 + .05, A.thud(), .4)
    elif sc == "flame": ev("candle crackle", t0, env(A.crackle(ct(s, 2) - t0), .1, .3), .09)
    elif sc == "mapFire": ev("impact", t0, A.impact(), .32)
    elif sc == "mapRoute": ev("stamp", ct(s, 2) + .15, A.thud(), .35)
    elif sc == "seats" and s.get("stage") == 2: ev("stamp", ct(s, 1), A.thud(), .35)
    elif sc == "reach":
        end = shots[i + 1]["t1"] if shots[i + 1]["scene"] == "grab" else t1
        ev("fire rumble", t0, env(A.rumble(end - t0), .2, .4), .26); ev("fire crackle", t0, env(A.crackle(end - t0), .2, .4), .08, .2)
    elif sc == "grab": ev("impact", ct(s, 1), A.impact(), .7)
    elif sc == "fanDown":
        if os.path.exists(fanclip):
            base = load(fanclip); x = A.norm(load(fanclip, tempo=max(0.5, min(1.0, len(base) / SR / (d * .95)))))
            ev("fan spin-down", t0, env(x, .03, .2), .5)
        ev("fan spin-down (synth layer)", t0, A.spindown(d, .9), .22 if os.path.exists(fanclip) else .45)
    elif sc == "hiss":
        ev("impact", t0, A.impact(), .4); at = t0 + .72; dur = min(3.6, total - at - .05)
        h = env(loop(np.concatenate(hisses), dur, .1), .01, min(2.4, dur * .7)) if hisses else A.hiss(dur)
        ev("hiss", at, h, .5)
# station room tone from the first interior scene until the fans stop
ava, fd = by("ava"), by("fanDown")
if ava and fd: ev("room tone", ava[0]["t0"], env(A.ambience(fd[0]["t1"] - ava[0]["t0"]), 1.0, fd[0]["t1"] - fd[0]["t0"]), .04)
# ---- music bed: D minor drone, slow pulse, rising tension ----
t = np.arange(N) / SR; mus = np.zeros((N, 2))
WONDER = ep.get("mood") == "wonder"
CH = [(65.41, 130.81, 164.81, 196.0, 246.94), (55.0, 110.0, 130.81, 164.81, 196.0), (43.65, 87.31, 130.81, 174.61, 220.0), (49.0, 98.0, 146.83, 196.0, 246.94)]
if WONDER:
    seg = 4.0
    for i0 in range(int(np.ceil(total / seg))):
        a0, a1 = int(i0 * seg * SR), min(int((i0 + 1) * seg * SR) + int(.8 * SR), N)
        if a0 >= N: break
        tt_ = np.arange(a1 - a0) / SR; e_ = np.minimum(tt_ / .8, 1) * np.minimum((len(tt_) / SR - tt_) / .8, 1)
        for j, f in enumerate(CH[i0 % 4]):
            g_ = (.5 if j == 0 else .28) * (0.75 + .25 * np.sin(TAU * .2 * tt_ + j))
            mus[a0:a1, 0] += g_ * e_ * np.sin(TAU * f * .999 * tt_); mus[a0:a1, 1] += g_ * e_ * np.sin(TAU * f * 1.001 * tt_ + .7)
        for j, f in enumerate(CH[i0 % 4][2:]):   # soft bell arpeggio
            tb = A.tt(1.6); A.place(mus, i0 * seg + j * .5 + .25, np.sin(TAU * f * 2 * tb) * np.exp(-tb * 3) * .5, .5, (-.3, 0, .3)[j])
TENDER = ep.get("mood") in ("tender", "deep")
if TENDER:   # soft piano + pad, I-V-vi-IV in C, louder at the sunset and the sunrise, sparse in the long night
    def note(f, d=3.0, v=1.0):
        tn = A.tt(d); y = sum((.6 / h) * np.sin(TAU * f * h * tn) * np.exp(-tn * (1.6 + h * .9)) for h in (1, 2, 3, 4)); return y * np.minimum(tn / .006, 1) * v
    PROG = [(261.63, 329.63, 392.0), (196.0, 246.94, 293.66), (220.0, 261.63, 329.63), (174.61, 220.0, 261.63)]
    def sect(t_):
        for sh_ in shots:
            if sh_["t0"] <= t_ < sh_["t1"]: return sh_["scene"]
        return ""
    beat = 60 / 72; t_ = .6; i0 = 0; rr = np.random.default_rng(3)
    while t_ < total - .5:
        sc_ = sect(t_); bar = int(t_ / (beat * 4)); ch = PROG[bar % 4]
        loud = {"usunset": 1.25, "ugather": 1.1, "urise": 1.3, "ubday": 1.25, "uend": 1.0, "unight": .55, "udeep": .55, "omid": .5, "owhale": .5, "otitanic": .5, "ovent": .55, "osnail": .5, "obottom": .8, "oanswer": 1.2, "oboil": 1.3, "oend": 1.0}.get(sc_, .8)
        if i0 % 4 == 0: A.place(mus, t_, note(ch[0] / 2, 4.0, .9 * loud), .5, 0); A.place(mus, t_, note(ch[0] / 4, 4.0, .6 * loud), .5, 0)
        if sc_ in ("unight", "udeep", "omid", "owhale", "otitanic", "ovent", "osnail"):
            if i0 % 2 == 0: A.place(mus, t_, note(ch[(i0 // 2) % 3] * 2, 3.0, .45), .5, (-.4, .4)[(i0 // 2) % 2])
        else:
            pat = [0, 1, 2, 1]; A.place(mus, t_, note(ch[pat[i0 % 4]] * (2 if i0 % 8 >= 4 else 1), 2.5, (.55 + .1 * rr.random()) * loud), .5, (-.25, 0, .25, 0)[i0 % 4])
            if sc_ in ("usunset", "urise", "ubday") and i0 % 4 == 2: A.place(mus, t_, note(ch[2] * 2, 3.5, .5 * loud), .5, .3)
        t_ += beat; i0 += 1
    pad = np.zeros(N)
    for bi in range(int(total / (beat * 4)) + 1):
        a0 = int(bi * beat * 4 * SR); a1 = min(a0 + int(beat * 4.5 * SR), N)
        if a0 >= N: break
        tn = np.arange(a1 - a0) / SR; e_ = np.minimum(tn / .6, 1) * np.minimum((len(tn) / SR - tn) / .6, 1)
        for f in PROG[bi % 4]: pad[a0:a1] += .12 * e_ * np.sin(TAU * f * tn) * (.8 + .2 * np.sin(TAU * .3 * tn))
    mus[:, 0] += pad; mus[:, 1] += pad
for j, (f, a) in enumerate([] if (WONDER or TENDER) else [(36.71, .5), (73.42, .6), (110.0, .35), (146.83, .3), (174.61, .22), (220.0, .12), (293.66, .10), (349.23, .07), (440.0, .06)]):
    lfo = 0.6 + 0.4 * np.sin(TAU * (0.05 + 0.03 * j) * t + j)
    mus[:, 0] += a * lfo * np.sin(TAU * f * 0.9985 * t); mus[:, 1] += a * lfo * np.sin(TAU * f * 1.0015 * t + 0.5)
ten = (0 if (WONDER or TENDER) else 1) * (t / total) ** 2 * 0.3 * (0.75 + 0.25 * np.sin(TAU * 5 * t))
for f in (155.56, 311.13): mus[:, 0] += ten * np.sin(TAU * f * t); mus[:, 1] += ten * np.sin(TAU * f * 1.002 * t)
p0 = by("alarmGo")[0]["t0"] if by("alarmGo") else total / 4; tp = A.tt(0.16); pulse = np.sin(TAU * 55 * tp) * np.exp(-tp * 22)
quiet = [(s["t0"], s["t1"]) for s in shots if s["scene"] == "silence" or s.get("quiet")]
for at in ([] if (WONDER or TENDER) else np.arange(p0, total - 3, 60 / 84)):
    if not any(a <= at < b for a, b in quiet): A.place(mus, at, pulse, 0.5 + 0.5 * (at - p0) / max(total - p0, 1))
e = np.minimum(t / 0.3, 1.0)
for a, b in quiet: e[int(a * SR):int(b * SR)] *= 0.05
card = by("card") or by("uend")
if card: a, b = (int(card[0]["t0"] * SR) if card[0]["scene"] == "card" else max(N - int(2.2 * SR), 0)), N; e[a:b] *= np.linspace(1, 0, b - a) ** 1.2
k = int(0.1 * SR); e = np.convolve(e, np.ones(k) / k, "same")
mus = mus / np.abs(mus).max() * 0.34 * e[:, None]
if ep.get("mood") == "deep":
    under = [x for x in shots if x["scene"] not in ("ospace", "obeam", "oanswer", "oboil")]
    for x in under:
        dd = x["t1"] - x["t0"]; n = int(dd * SR); tn = np.arange(n) / SR; amb = A.norm(A.bp(A.noise(n), 40, 260)) * (.8 + .2 * np.sin(TAU * .15 * tn))
        A.place(sfx, x["t0"], env(amb, .3, .3), .12, 0)
# ---- voice + ducking ----
v = np.zeros(N); x = load(voice_path); x = x / np.abs(x).max() * 0.9; v[:min(N, len(x))] = x[:N]
k = int(0.12 * SR); lev = np.sqrt(np.convolve(v ** 2, np.ones(k) / k, "same"))
duck = np.clip(lev / 0.06, 0, 1); k2 = int(0.3 * SR); duck = np.maximum(duck, np.convolve(duck, np.ones(k2) / k2, "same"))
mix = v[:, None] + mus * ((0.9 * (1 - 0.72 * duck)) if ep.get("mood") == "tender" else (0.5 * (1 - 0.6 * duck)))[:, None] + sfx * (0.8 * (1 - 0.5 * duck))[:, None]
mix = np.tanh(mix * 1.1); mix = mix / np.abs(mix).max() * 0.84
A.save(out, mix); json.dump(sorted(log), open(out.replace(".wav", ".events.json"), "w"))
print(f"{total:.2f}s mix, {len(log)} sound events:", ", ".join(sorted({n for _, n in log})))
