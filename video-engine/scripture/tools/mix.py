"""Music bed + story sound effects + voice, timed to a timed episode.
Usage: python3 mix.py build/X.timed.json build/X.voice.wav build/X.mix.wav
Music moods switch at shots carrying "music": warm (present day), story, tense, wonder, glory. Everything is synthesised:
a soft pad in a Hijaz-flavoured mode, plucked lyre (Karplus-Strong), frame drum, wordless choir swells.
Shot "sfx": [[name, seconds into shot]] places boom / sword / sparkle / shimmer / hit / crunch / thump / choir.
"amb": "wind" adds desert air under that shot. Music is ducked under the voice, then the mix is loudness-normalised."""
import sys, json, subprocess, numpy as np
ep = json.load(open(sys.argv[1])); voice_p, out_p = sys.argv[2], sys.argv[3]
SR = 44100; TAU = 2 * np.pi; rs = np.random.default_rng(3)
total = ep["total"]; N = int(total * SR)
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<i2").astype(np.float64) / 32768
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, fc):  # one-pole low-pass, run twice
    a = np.exp(-TAU * fc / SR)
    from scipy.signal import lfilter
    return lfilter([1 - a], [1, -a], lfilter([1 - a], [1, -a], x))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = 1 / (1 + (lo / np.maximum(f, 1e-9)) ** 6) / (1 + (f / hi) ** 6); return np.fft.irfft(X * m, len(x))
def norm(x): return x / (np.abs(x).max() + 1e-9)
def place(buf, at, sig, g):
    a = int(at * SR)
    if a >= len(buf): return
    if a < 0: sig = sig[-a:]; a = 0
    n = min(len(sig), len(buf) - a); buf[a:a + n] += sig[:n] * g
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
# ---------- instruments ----------
def pluck(f, d=2.2, bright=.5):
    n = int(d * SR); p = max(2, int(SR / f)); buf = rs.uniform(-1, 1, p); out = np.zeros(n); k = 0
    for i in range(n):
        out[i] = buf[k]; nk = (k + 1) % p; buf[k] = .5 * (buf[k] + buf[nk]) * (.994 + .004 * bright); k = nk
    return out * np.exp(-tt(d) * 1.4)
PL = {}
def pl(m):
    if m not in PL: PL[m] = pluck(mtof(m))
    return PL[m]
def pad(notes, d, bright=600, a=1.2):
    t = tt(d); s = np.zeros(len(t))
    for m in notes:
        f = mtof(m)
        for det in (-.15, .15): s += np.sin(TAU * f * (1 + det / 100) * t + rs.uniform(0, 6)) + .3 * np.sin(TAU * 2 * f * t) + .12 * np.sin(TAU * 3 * f * t)
    env = np.minimum(t / a, 1) * np.minimum((d - t) / 1.0, 1).clip(0, 1)
    return lp(s, bright) * env / len(notes)
def choir(notes, d):
    t = tt(d); s = np.zeros(len(t))
    for m in notes:
        f = mtof(m); vib = 1 + .006 * np.sin(TAU * 5.2 * t + rs.uniform(0, 6)); ph = TAU * np.cumsum(f * vib) / SR
        saw = sum(np.sin(k * ph) / k for k in range(1, 14)); s += saw
    s = bp(s, 350, 1300) + .6 * bp(s, 2200, 3200)  # 'aah' formants
    env = np.minimum(t / 1.2, 1) * np.clip((d - t) / 1.6, 0, 1)
    return norm(s) * env
def drum(low=True):
    t = tt(.6); f = (70 if low else 180) + 60 * np.exp(-t * 30)
    return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * (9 if low else 20)) + bp(rs.standard_normal(len(t)), 300, 3000) * np.exp(-t * 60) * (.25 if low else .6))
def boom():
    t = tt(2.5); f = 32 + 40 * np.exp(-t * 6)
    return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 1.6) + .4 * lp(rs.standard_normal(len(t)), 200) * np.exp(-t * 3))
def sword():
    t = tt(1.6); s = sum(np.sin(TAU * f * t + rs.uniform(0, 6)) * np.exp(-t * (2 + i)) for i, f in enumerate([2100, 3170, 4420, 5650]))
    sw = bp(rs.standard_normal(len(t)), 2000, 9000) * np.exp(-((t - .08) / .07) ** 2)
    return norm(s * np.minimum(t / .03, 1) + sw * 1.5)
def chimes(n=7, up=True, d=2.2):
    out = np.zeros(int(d * SR)); notes = [86, 88, 91, 93, 95, 98, 100][:n]
    for i, m in enumerate(notes if up else notes[::-1]):
        t = tt(1.4); s = (np.sin(TAU * mtof(m) * t) + .3 * np.sin(TAU * mtof(m) * 2.76 * t)) * np.exp(-t * 3); place(out, i * .09, s, 1)
    return norm(out)
def hit():
    t = tt(.5); return norm(bp(rs.standard_normal(len(t)), 600, 4000) * np.exp(-t * 40) + np.sin(TAU * np.cumsum(90 + 80 * np.exp(-t * 40)) / SR) * np.exp(-t * 14) * 1.2)
def crunch():
    t = tt(.7); g = bp(rs.standard_normal(len(t)), 200, 2500) * (np.exp(-t * 10) * (1 + .8 * np.sign(np.sin(TAU * 38 * t))))
    return norm(g + hit()[:len(t)] * .8 if len(hit()) >= len(t) else g)
def thump():
    t = tt(.8); return norm(np.sin(TAU * np.cumsum(55 + 50 * np.exp(-t * 20)) / SR) * np.exp(-t * 8) + lp(rs.standard_normal(len(t)), 400) * np.exp(-t * 12) * .6 + bp(rs.standard_normal(len(t)), 1000, 6000) * np.exp(-((t - .1) / .2) ** 2) * .15)
# ---------- music, mood by mood ----------
shots = ep["shots"]; segs = []; mood = "warm"; start = 0.0
for s in shots:
    m = s.get("music")
    if m and m != mood: segs.append((mood, start, s["t0"])); mood, start = m, s["t0"]
segs.append((mood, start, total))
MOOD = {  # root (midi), pad chord, pluck scale, pluck rate, drum, level
    "warm":   dict(pad=[50, 57, 62, 66], scale=[62, 64, 66, 69, 71, 74, 76, 78], rate=.55, drum=False, bright=900, lvl=.9),
    "story":  dict(pad=[50, 57, 62], scale=[62, 63, 66, 67, 69, 70, 72, 74], rate=.7, drum=True, bright=700, lvl=.95),
    "tense":  dict(pad=[38, 45, 51], scale=[62, 63, 66, 67], rate=.45, drum=True, bright=380, lvl=1.0),
    "wonder": dict(pad=[62, 66, 69, 74, 78], scale=[74, 76, 78, 81, 83, 86], rate=.9, drum=False, bright=1600, lvl=.8),
    "glory":  dict(pad=[50, 62, 66, 69, 74], scale=[74, 78, 81, 86], rate=1.2, drum=False, bright=2400, lvl=1.0),
}
music = np.zeros(N + SR * 4)
for mood, a, b in segs:
    M = MOOD[mood]; d = b - a + 1.6
    place(music, a - .4, pad(M["pad"], d, M["bright"]) * .5 * M["lvl"], 1)
    place(music, a - .4, pad([n - 12 for n in M["pad"][:1]], d, 200) * .5 * M["lvl"], 1)
    t = a + .2; i = 0; r = np.random.default_rng(int(a * 10))
    while t < b - .3:
        m = M["scale"][int(r.integers(0, len(M["scale"])))] if i % 4 else M["scale"][0]
        place(music, t, pl(m) * (.22 if i % 4 else .3), M["lvl"])
        if M["drum"] and i % 2 == 0: place(music, t, drum(i % 4 == 0) * (.18 if mood == "story" else .26), 1)
        t += M["rate"] * (1 if i % 3 else 1.5); i += 1
sfx = np.zeros(N + SR * 4)
LIB = {"boom": (boom, .9), "sword": (sword, .35), "sparkle": (lambda: chimes(5), .22), "shimmer": (lambda: chimes(7), .2), "hit": (hit, .55), "crunch": (crunch, .55), "thump": (thump, .6)}
for s in shots:
    for name, at in s.get("sfx", []):
        T = s["t0"] + at
        if name == "choir": place(sfx, T - .3, choir([62, 66, 69, 74, 78], 5.0), .32)
        else: fn, g = LIB[name]; place(sfx, T, fn(), g)
    if s.get("amb") == "wind":
        d = s["t1"] - s["t0"] + 1; w = lp(rs.standard_normal(int(d * SR)), 500) * (0.7 + .3 * np.sin(TAU * .2 * tt(d))); place(sfx, s["t0"] - .5, w / (np.abs(w).max() + 1e-9) * np.minimum(tt(d) / .8, 1) * np.clip((d - tt(d)) / .8, 0, 1), .12)
    if s["scene"] == "court":
        d = s["t1"] - s["t0"]; c = np.zeros(int(d * SR))
        for k in range(int(d * 14)): place(c, rs.uniform(0, d), bp(rs.standard_normal(400), 1500, 7000) * np.exp(-np.arange(400) / 60), rs.uniform(.1, .4))
        place(sfx, s["t0"], c, .25)
voice = load(voice_p); voice = np.pad(voice, (0, max(0, len(music) - len(voice))))[:len(music)]
env = np.convolve(np.abs(voice), np.ones(2205) / 2205, "same"); env = lp(env, 3); duck = 1 - .55 * np.clip(env / (env.max() * .15 + 1e-9), 0, 1)
rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2) + 1e-12)
vr = rms(voice); music *= vr / rms(music) * 10 ** (-13 / 20); sfx *= vr / (np.abs(sfx).max() + 1e-9) * 10 ** (2 / 20)  # bed 13 dB under the voice; effect peaks a touch above voice RMS
mix = voice * 1.0 + music * duck + sfx
mix = mix[:int(total * SR)]; fo = int(.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
mix = mix / (np.abs(mix).max() + 1e-9) * .9
tmp = out_p + ".pre.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=(mix * 32767).astype("<i2").tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "2", out_p], check=True)
import os; os.remove(tmp); print("mix", out_p, f"{total:.2f}s; moods:", [(m, round(a, 1)) for m, a, _ in segs])
