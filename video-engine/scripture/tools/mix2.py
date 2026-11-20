"""Continuous score + ambience + story SFX + voice for a timed episode. Nothing ever drops to silence.
Usage: python3 mix2.py build/X.timed.json build/X.voice.wav build/X.mix.wav
Shot keys used: "music" (warm|legend|dread|battle|hope|glory, carried forward), "sfx" [[name, t]], "amb" (fire), "tr" (whip -> big whoosh),
scene (elah -> brook + birds; stage -> wind). Everything sits on one 92 bpm grid so moods change without the beat stumbling."""
import sys, json, subprocess, numpy as np
from scipy.signal import lfilter
ep = json.load(open(sys.argv[1])); voice_p, out_p = sys.argv[2], sys.argv[3]
SR = 44100; TAU = 2 * np.pi; R = np.random.default_rng(11); total = ep["total"]; N = int((total + 2) * SR)
BPM = 92; BEAT = 60 / BPM
def tt(d): return np.arange(int(d * SR)) / SR
def noise(n): return R.standard_normal(n)
def lp(x, fc): a = np.exp(-TAU * fc / SR); return lfilter([1 - a], [1, -a], lfilter([1 - a], [1, -a], x))
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return hp(lp(x, hi), lo)
def norm(x): return x / (np.abs(x).max() + 1e-9)
def place(buf, at, sig, g=1.0):
    a = int(at * SR)
    if a < 0: sig = sig[-a:]; a = 0
    n = min(len(sig), len(buf) - a)
    if n > 0: buf[a:a + n] += sig[:n] * g
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").astype(np.float64) / 32768
# ---------------- instruments ----------------
_pl = {}
def pluck(m, d=1.8, damp=.996):
    key = (m, d, damp)
    if key not in _pl:
        n = int(d * SR); p = max(2, int(SR / mtof(m))); buf = R.uniform(-1, 1, p); out = np.zeros(n); k = 0
        for i in range(n): out[i] = buf[k]; nk = (k + 1) % p; buf[k] = .5 * (buf[k] + buf[nk]) * damp; k = nk
        _pl[key] = lp(out, 3500) * np.exp(-tt(d) * 1.6)
    return _pl[key]
def taiko(big=1.0):
    t = tt(1.2); f = 46 + 70 * np.exp(-t * 18)
    return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 3.2) + lp(noise(len(t)), 900) * np.exp(-t * 30) * .5) * big
def tom(f0=110):
    t = tt(.5); f = f0 + 60 * np.exp(-t * 25); return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 9) + bp(noise(len(t)), 200, 2000) * np.exp(-t * 40) * .3)
def tak():
    t = tt(.12); return norm(bp(noise(len(t)), 1500, 6000) * np.exp(-t * 70) + np.sin(TAU * 900 * t) * np.exp(-t * 60) * .5)
def shaker():
    t = tt(.09); return norm(hp(noise(len(t)), 5000) * np.sin(np.pi * t / .09) ** 2)
def frame_drum(low=True):
    t = tt(.6); f = (75 if low else 190) + 50 * np.exp(-t * 30)
    return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * (8 if low else 18)) + bp(noise(len(t)), 300, 3000) * np.exp(-t * 50) * (.25 if low else .6))
def saw(f, t): ph = (f * t) % 1; return 2 * ph - 1
def brass(m, d):
    t = tt(d); f = mtof(m); s = saw(f, t) + saw(f * 1.004, t) + .5 * saw(f / 2, t)
    env = np.minimum(t / .06, 1) * np.exp(-t * .8) * np.clip((d - t) / .08, 0, 1)
    out = np.zeros(len(t)); cut = 400 + 2600 * np.exp(-t * 4)
    # crude moving cutoff: blend two filtered copies
    a, b = lp(s, 500), lp(s, 2600); w = (cut - 400) / 2600; out = a * (1 - w) + b * w
    return out * env
def pad(notes, d, bright=900):
    t = tt(d); s = np.zeros(len(t))
    for m in notes:
        f = mtof(m)
        for det in (-.12, .12): s += saw(f * (1 + det / 100), t + R.uniform(0, 1)) * .5 + np.sin(TAU * f * t)
    return lp(s, bright) / len(notes)
def choir(notes, d):
    t = tt(d); s = np.zeros(len(t))
    for m in notes:
        f = mtof(m); ph = TAU * np.cumsum(f * (1 + .006 * np.sin(TAU * 5.1 * t + R.uniform(0, 6)))) / SR
        s += sum(np.sin(k * ph) / k for k in range(1, 12))
    return norm(bp(s, 300, 1300) + .5 * bp(s, 2100, 3200))
def drone(m, d): t = tt(d); f = mtof(m); return lp(saw(f, t) + saw(f * 1.003, t) + .7 * np.sin(TAU * f / 2 * t), 300)
# ---------------- moods ----------------
HIJAZ = [62, 63, 66, 67, 69, 70, 72, 74]
MOODS = {
    "warm":   dict(pad=[50, 57, 62, 66, 69], bright=1100, arp=[62, 66, 69, 74, 69, 66], arpEvery=.5, drum="frame", shaker=True, bass=38, lvl=1.0),
    "legend": dict(pad=[50, 57, 62], bright=800, arp=[62, 63, 66, 67, 69, 67, 66, 63], arpEvery=.5, drum="frame", shaker=True, bass=38, drone=38, lvl=1.0),
    "dread":  dict(pad=[38, 45, 51, 56], bright=420, arp=[50, 51, 50, 51], arpEvery=.25, drum="taiko2", shaker=False, bass=26, drone=26, lvl=1.05),
    "battle": dict(pad=[38, 45, 50, 57], bright=900, arp=[50, 50, 57, 50, 51, 50, 57, 55], arpEvery=.25, drum="battle", shaker=True, bass=26, brass=[50, 50, 53, 55], lvl=1.15),
    "hope":   dict(pad=[50, 57, 62, 66, 69, 74], bright=1300, arp=[74, 69, 66, 62], arpEvery=1.0, drum="soft", shaker=False, bass=38, choir=[62, 66, 69], lvl=.9),
    "glory":  dict(pad=[50, 57, 62, 66, 69, 74, 78], bright=2200, arp=[74, 78, 81, 86], arpEvery=.5, drum="glory", shaker=True, bass=26, brass=[62, 66, 69, 74], choir=[62, 66, 69, 74], lvl=1.2),
}
ALIAS = {"story": "legend", "tense": "dread", "wonder": "hope"}
for _s in ep["shots"]:
    if "music" in _s: _s["music"] = ALIAS.get(_s["music"], _s["music"])
shots = ep["shots"]; segs = []; mood = None
for s in shots:
    m = s.get("music", mood or "warm")
    if m != mood: segs.append([m, s["t0"]]); mood = m
for i, sg in enumerate(segs): sg.append(segs[i + 1][1] if i + 1 < len(segs) else total + 1)
music = np.zeros(N)
for mood, a, b in segs:
    M = MOODS[mood]; d = b - a + .8; buf = np.zeros(int((d + 2) * SR)); base = a - .3
    buf[:int(d * SR)] += pad(M["pad"], d, M["bright"]) * .55
    if "drone" in M: buf[:int(d * SR)] += drone(M["drone"], d) * .35
    if "choir" in M: buf[:int(d * SR)] += choir(M["choir"], d) * .12
    k0 = int(np.ceil(base / (BEAT / 4))); k1 = int(b / (BEAT / 4))
    for k in range(k0, k1 + 1):  # 16th-note grid, global so it never stumbles between moods
        T = k * BEAT / 4; rel = T - base; q = k % 16  # q: 16th within the bar
        if rel < 0: continue
        if q % int(M["arpEvery"] / .25) == 0 if M["arpEvery"] >= .25 else True:
            idx = (k // max(1, int(M["arpEvery"] / .25))) % len(M["arp"]); place(buf, rel, pluck(M["arp"][idx]), .22 if q % 4 else .3)
        if q == 0 and "bass" in M: place(buf, rel, pluck(M["bass"], 2.4, .998), .7); place(buf, rel, lp(saw(mtof(M["bass"]), tt(BEAT * 3.5)), 200) * np.exp(-tt(BEAT * 3.5) * .8), .28)
        dr = M["drum"]
        if dr == "frame":
            if q in (0, 10): place(buf, rel, frame_drum(True), .5)
            if q in (4, 12): place(buf, rel, frame_drum(False), .35)
            if q in (7, 14): place(buf, rel, frame_drum(False), .2)
        elif dr == "soft":
            if q in (0, 8): place(buf, rel, frame_drum(True), .3)
        elif dr == "taiko2":
            if q in (0, 8): place(buf, rel, taiko(), .7)
            if q % 2 == 1: place(buf, rel, tak(), .06)
        elif dr == "battle":
            if q in (0, 3, 6, 8, 11): place(buf, rel, taiko(), .75 if q in (0, 8) else .45)
            if q in (4, 12): place(buf, rel, tom(150), .45)
            if q in (14, 15): place(buf, rel, tom(110), .35)
            if q % 2 == 0: place(buf, rel, tak(), .12)
        elif dr == "glory":
            if q in (0, 8): place(buf, rel, taiko(), .8)
            if q in (6, 14): place(buf, rel, tom(120), .4)
        if M.get("shaker") and q % 2 == 0: place(buf, rel, shaker(), .08 if q % 4 else .12)
        if "brass" in M and q % 8 == 0: place(buf, rel, brass(M["brass"][(k // 8) % len(M["brass"])], BEAT * 1.9), .22)
    env = np.ones(len(buf)); fi, fo = int(.35 * SR), int(.6 * SR); env[:fi] = np.linspace(0, 1, fi); e1 = int(d * SR); env[e1 - fo:e1] = np.linspace(1, 0, fo); env[e1:] = 0
    place(music, base, buf * env * M["lvl"])
# ---------------- ambience: never silent ----------------
amb = np.zeros(N)
for s in shots:
    a, b = s["t0"], s["t1"]; d = b - a + .6; t = tt(d); env = np.minimum(t / .3, 1) * np.clip((d - t) / .3, 0, 1)
    if s["scene"] == "elah":
        w = bp(noise(len(t)), 600, 4000) * (0.6 + .4 * np.abs(np.sin(TAU * 1.3 * t) * np.sin(TAU * .37 * t)))
        place(amb, a - .3, w * env * .25)
        for _ in range(int(d * .8)):
            at = R.uniform(0, d - .4); tc = tt(.12); f0 = R.uniform(2800, 4200); place(amb, a + at, np.sin(TAU * np.cumsum(f0 + 900 * np.sin(TAU * 18 * tc)) / SR) * np.exp(-tc * 25), .08)
    else:
        wnd = lp(noise(len(t)), 350) * (.6 + .4 * np.sin(TAU * .15 * t + a)); place(amb, a - .3, wnd * env * .5)
    if s.get("amb") == "storm":
        st = lp(noise(len(t)), 900) * (.7 + .3 * np.sin(TAU * .3 * t)) + hp(noise(len(t)), 4000) * .25
        place(amb, a - .3, st * env * 1.4)
    if s.get("amb") == "belly":
        place(amb, a - .3, lp(noise(len(t)), 120) * (1 + .5 * np.sin(TAU * 1.1 * t)) * env * 1.2)
    if s["scene"] == "beach":
        surf = lp(noise(len(t)), 1200) * (0.4 + .6 * np.clip(np.sin(TAU * .14 * t + a), 0, 1) ** 2); place(amb, a - .3, surf * env * .8)
    if s.get("amb") == "fire":
        c = np.zeros(len(t))
        for _ in range(int(d * 18)): k = int(R.uniform(0, len(t) - 600)); c[k:k + 400] += bp(noise(400), 1200, 6000) * np.exp(-np.arange(400) / 50) * R.uniform(.2, 1)
        place(amb, a - .3, (c + lp(noise(len(t)), 200) * .4) * env * .5)
# ---------------- sfx ----------------
def whoosh(d=.45, big=False):
    t = tt(d); n = bp(noise(len(t)), 300, 6000 if big else 3500); return norm(n * np.sin(np.pi * t / d) ** 3)
def boom(): t = tt(2.6); f = 30 + 45 * np.exp(-t * 5); return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 1.5) + lp(noise(len(t)), 180) * np.exp(-t * 2.5) * .5)
def braam():
    t = tt(2.2); s = sum(lp(saw(mtof(m), t), 700) for m in (26, 33, 38)); return norm(s * np.minimum(t / .04, 1) * np.exp(-t * 1.1))
def crack(): t = tt(.35); return norm(bp(noise(len(t)), 800, 8000) * np.exp(-t * 35) + np.sin(TAU * np.cumsum(180 + 400 * np.exp(-t * 40)) / SR) * np.exp(-t * 18))
def hit(): t = tt(.5); return norm(bp(noise(len(t)), 500, 5000) * np.exp(-t * 40) + np.sin(TAU * np.cumsum(90 + 90 * np.exp(-t * 40)) / SR) * np.exp(-t * 12) * 1.3)
def clash():
    t = tt(1.4); s = sum(np.sin(TAU * f * t + R.uniform(0, 6)) * np.exp(-t * (3 + i * 1.5)) for i, f in enumerate([1820, 2730, 3910, 5230, 6480]))
    return norm(s + bp(noise(len(t)), 2000, 9000) * np.exp(-t * 25) * 2)
def crowd(d=2.6):
    t = tt(d); s = np.zeros(len(t))
    for _ in range(12): f = R.uniform(140, 320); s += bp(saw(f * (1 + .02 * np.sin(TAU * R.uniform(3, 6) * t)), t), 400, 2200) * R.uniform(.5, 1)
    s += bp(noise(len(t)), 300, 2500) * 1.5
    return norm(s * np.minimum(t / .5, 1) * np.clip((d - t) / 1.2, 0, 1))
def horn(d=1.8):
    t = tt(d); f = mtof(57) * (1 + .5 * np.minimum(t / .25, 1) - .5) + 0; f = mtof(57) * 2 ** (np.minimum(t / .3, 1) * 5 / 12)
    ph = TAU * np.cumsum(f) / SR; s = sum(np.sin(k * ph) / k ** .8 for k in range(1, 14)); s = bp(s, 200, 3000)
    return norm(s * np.minimum(t / .08, 1) * np.clip((d - t) / .4, 0, 1))
def roar(d=1.8):
    t = tt(d); f = 70 + 30 * np.sin(np.pi * t / d); ph = TAU * np.cumsum(f) / SR; s = sum(np.sin(k * ph) / k for k in range(1, 20)) + bp(noise(len(t)), 200, 1500) * 1.2
    s = bp(s, 150, 1400) * (1 + .4 * np.sin(TAU * 23 * t)); return norm(s * np.minimum(t / .15, 1) * np.clip((d - t) / .6, 0, 1))
def stomp(): t = tt(1.0); return norm(np.sin(TAU * np.cumsum(38 + 50 * np.exp(-t * 20)) / SR) * np.exp(-t * 5) + lp(noise(len(t)), 300) * np.exp(-t * 9) * .7)
def heartbeat():
    out = np.zeros(int(.9 * SR)); t = tt(.25)
    for at, g in ((0, 1), (.28, .7)): place(out, at, np.sin(TAU * np.cumsum(50 + 30 * np.exp(-t * 30)) / SR) * np.exp(-t * 18), g)
    return norm(out)
def riser(d=1.4): t = tt(d); s = bp(noise(len(t)), 800, 8000) * (t / d) ** 2 + np.sin(TAU * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * (t / d) ** 2 * .4; return norm(s)
def thunder(d=3.0): t = tt(d); s = lp(noise(len(t)), 600) * (np.exp(-t * 1.5) + .5 * np.exp(-((t - .4) / .3) ** 2)); s += bp(noise(len(t)), 1000, 6000) * np.exp(-t * 20) * .4; return norm(s)
def clank(): t = tt(.8); return norm(sum(np.sin(TAU * f * t) * np.exp(-t * 6) for f in (620, 1480, 2210)) + bp(noise(len(t)), 1000, 5000) * np.exp(-t * 40))
def tickn(n=6, d=2.0):
    out = np.zeros(int((d + .4) * SR)); t = tt(.3)
    for i in range(n): place(out, i * d / n, (np.sin(TAU * mtof(74 + [0, 2, 4, 7, 9, 12][i % 6]) * t) * np.exp(-t * 14)), 1)
    return norm(out)
def sparkle():
    out = np.zeros(int(2.2 * SR)); t = tt(1.2)
    for i, m in enumerate([86, 90, 93, 98, 102]): place(out, i * .08, np.sin(TAU * mtof(m) * t) * np.exp(-t * 4), 1)
    return norm(out)
def sling(d=2.4):
    t = tt(d); s = bp(noise(len(t)), 400, 3000) * (np.abs(np.sin(TAU * 2.6 * t)) ** 4); return norm(s * np.minimum(t / .3, 1))
def march(d=2.8):
    out = np.zeros(int(d * SR))
    for k in range(int(d / (BEAT / 2))): place(out, k * BEAT / 2, stomp(), .5); place(out, k * BEAT / 2, bp(noise(int(.15 * SR)), 300, 2000) * np.exp(-tt(.15) * 30), .4)
    return norm(out)
def splash(d=1.4): t = tt(d); return norm(bp(noise(len(t)), 300, 7000) * np.exp(-t * 4) * np.minimum(t / .02, 1) + lp(noise(len(t)), 200) * np.exp(-t * 6) * .8)
def gulp(): t = tt(.7); f = 140 * np.exp(-t * 3); return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 4) + lp(noise(len(t)), 300) * np.exp(-t * 5) * .6)
def spit(): t = tt(.8); return norm(bp(noise(len(t)), 200, 3000) * np.exp(-t * 6) * np.minimum(t / .05, 1) + np.sin(TAU * np.cumsum(90 + 200 * np.exp(-t * 8)) / SR) * np.exp(-t * 5))
def thump(): t = tt(.7); return norm(np.sin(TAU * np.cumsum(55 + 50 * np.exp(-t * 20)) / SR) * np.exp(-t * 8) + lp(noise(len(t)), 400) * np.exp(-t * 12) * .6)
def moo(d=1.6): t = tt(d); f = 140 - 30 * (t / d); ph = TAU * np.cumsum(f) / SR; s = sum(np.sin(k * ph) / k for k in range(1, 12)); return norm(bp(s, 200, 1500) * np.minimum(t / .2, 1) * np.clip((d - t) / .5, 0, 1))
def snore(d=2.4): t = tt(d); return norm(bp(noise(len(t)), 100, 900) * np.clip(np.sin(TAU * t / 2.4), 0, 1) ** 2)
def underwater(d=4.5): t = tt(d); return norm(lp(noise(len(t)), 250) * (1 + .3 * np.sin(TAU * .5 * t)) * np.minimum(t / .5, 1) * np.clip((d - t) / .5, 0, 1))
def stone_roll(d=1.8): t = tt(d); return norm(lp(noise(len(t)), 300) * (1 + np.sin(TAU * 7 * t) * .5) * np.minimum(t / .2, 1) * np.clip((d - t) / .4, 0, 1))
LIB = dict(splash=(splash, .7), gulp=(gulp, .9), spit=(spit, .7), thump=(thump, .7), moo=(moo, .55), snore=(snore, .3), underwater=(underwater, .6), stone=(stone_roll, .7),
           boom=(boom, 1.0), braam=(braam, .8), crack=(crack, .8), hit=(hit, .8), clash=(clash, .6), crowd=(crowd, .35), horn=(horn, .45), roar=(roar, .65), stomp=(stomp, .75),
           heartbeat=(heartbeat, .8), riser=(riser, .4), thunder=(thunder, .7), clank=(clank, .5), tick6=(tickn, .35), sparkle=(sparkle, .3), sling=(sling, .4), march=(march, .45),
           whoosh=(whoosh, .5), choir=(lambda: choir([62, 66, 69, 74], 4.0) * np.minimum(tt(4.0) / .8, 1) * np.clip((4.0 - tt(4.0)) / 1.5, 0, 1), .35))
def oink(): t = tt(.5); f = 300 + 80 * np.sin(TAU * 18 * t); ph = TAU * np.cumsum(f) / SR; return norm(bp(sum(np.sin(k * ph) / k for k in range(1, 10)) + noise(len(t)) * .4, 300, 2500) * np.exp(-t * 6) * np.minimum(t / .02, 1))
def stomach(d=1.4): t = tt(d); f = 70 + 40 * np.sin(TAU * 1.5 * t); return norm(lp(np.sin(TAU * np.cumsum(f) / SR) + noise(len(t)) * .3, 300) * np.sin(np.pi * t / d) ** 2)
def wind(d=4.0): t = tt(d); return norm(bp(noise(len(t)), 200, 1200) * (0.6 + .4 * np.sin(TAU * .4 * t)) * np.minimum(t / .6, 1) * np.clip((d - t) / .8, 0, 1))
def stamp(): t = tt(.5); return norm(lp(noise(len(t)), 900) * np.exp(-t * 30) + np.sin(TAU * np.cumsum(120 + 80 * np.exp(-t * 40)) / SR) * np.exp(-t * 18))
def lionroar(d=2.4):
    t = tt(d); f = 95 + 35 * np.sin(np.pi * t / d) - 20 * (t / d); ph = TAU * np.cumsum(f) / SR; s = sum(np.sin(k * ph) / k for k in range(1, 26)) + bp(noise(len(t)), 150, 2000) * 1.6
    s = bp(s, 80, 1800) * (1 + .5 * np.sin(TAU * 31 * t)); return norm(s * np.minimum(t / .12, 1) * np.clip((d - t) / .9, 0, 1) ** 1.5)
LIB.update(oink=(oink, .55), stomach=(stomach, .5), wind=(wind, .4), stamp=(stamp, .7))
LIB["roar"] = (lionroar, .8)
LIB.update(sword=LIB["clash"], shimmer=LIB["sparkle"], crunch=LIB["hit"])  # names used by episode 1
sfx = np.zeros(N)
for i, s in enumerate(shots):
    if i: place(sfx, s["t0"] - .22, whoosh(.5, s.get("tr") == "whip"), .55 if s.get("tr") == "whip" else .18)
    if s.get("tr") == "flash": place(sfx, s["t0"], hit(), .35)
    for name, at in s.get("sfx", []):
        fn, g = LIB[name]; place(sfx, s["t0"] + at, fn(), g)
# ---------------- mix ----------------
voice = load(voice_p); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2) + 1e-12)
vr = rms(voice)
music *= vr / rms(music) * 10 ** (-9.5 / 20)
amb *= vr / rms(amb) * 10 ** (-22 / 20)
sfx *= vr / (np.percentile(np.abs(sfx[np.abs(sfx) > 1e-3]), 99.5) + 1e-9) * 10 ** (4 / 20)
env = lfilter([1 - .9995], [1, -.9995], np.abs(voice)); env = env / (env.max() + 1e-9); duck = 1 - .35 * np.clip(env * 6, 0, 1)
mix = voice + music * duck + amb + sfx * (1 - .25 * np.clip(env * 6, 0, 1))
mix = mix[:int(total * SR)]
if ep.get("loop"):  # seamless loop: no long fades, just 30 ms to avoid clicks at the wrap
    f3 = int(.03 * SR); mix[:f3] *= np.linspace(0, 1, f3); mix[-f3:] *= np.linspace(1, 0, f3)
else:
    fo = int(.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo); mix[:int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * .92  # gentle saturation glues the bed
tmp = out_p + ".pre.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=(mix * 32767).astype("<i2").tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.2:LRA=9", "-ar", str(SR), "-ac", "2", out_p], check=True)
import os; os.remove(tmp)
# report silence: share of 100 ms windows quieter than -45 dBFS
y = mix[:int(total * SR)]; w = int(.1 * SR); lv = [20 * np.log10(np.sqrt(np.mean(y[i:i + w] ** 2)) + 1e-9) for i in range(0, len(y) - w, w)]
print(f"mix {out_p} {total:.1f}s  moods {[(m, round(a, 1)) for m, a, _ in segs]}  quiet windows: {sum(l < -45 for l in lv)}/{len(lv)}")
