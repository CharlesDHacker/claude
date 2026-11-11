"""Synthesize a music bed + sound effects for an episode, timed to its beats.
Usage: python3 audio.py episodes/ep01.json outprefix   -> outprefix.music.wav, .sfx.wav, .mix.wav
Per-beat options in the episode JSON: "sfx": [names] overrides the defaults, "quiet": true ducks the music."""
import sys, json, wave
import numpy as np
SR = 44100
rs = np.random.default_rng(7)
TAU = 2 * np.pi

def noise(n): return rs.standard_normal(n)
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    with np.errstate(divide="ignore"):
        m = 1 / (1 + (lo / np.maximum(f, 1e-9)) ** 8) / (1 + (f / hi) ** 8)
    return np.fft.irfft(X * m, len(x))
def norm(x): return x / (np.abs(x).max() + 1e-9)
def tt(d): return np.arange(int(d * SR)) / SR
def fade(x, a=0.005, r=0.02):
    n = len(x); e = np.ones(n); na, nr = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] = np.linspace(1, 0, nr)
    return x * e

def whoosh(d=0.4):
    n = int(d * SR); return norm(bp(noise(n), 400, 5000) * np.hanning(n) ** 2)
def impact():
    t = tt(0.8); f = 35 + 60 * np.exp(-t * 9)
    s = np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 5)
    return norm(s + bp(noise(len(t)), 80, 900) * np.exp(-t * 25) * 0.6)
def braam():
    t = tt(1.4); s = 0
    for f in (55, 55.3, 82.4):
        for k in range(1, 7): s = s + np.sin(TAU * f * k * t) / k
    return norm(fade(s * np.minimum(t / 0.05, 1) * np.exp(-t * 2.2), 0.005, 0.1))
def alarm(d):
    t = tt(d); seg = (t // 0.36).astype(int); f = np.where(seg % 2 == 0, 880.0, 660.0)
    on = ((t % 0.36) < 0.2).astype(float)
    k = int(0.004 * SR); on = np.convolve(on, np.ones(k) / k, "same")
    ph = TAU * np.cumsum(f) / SR
    return norm(fade((np.sin(ph) + 0.3 * np.sin(3 * ph)) * on))
def hiss(d):
    t = tt(d); return norm(fade(bp(noise(len(t)), 2500, 12000) * (1 + 0.15 * np.sin(TAU * 11 * t)), 0.03, 0.15))
def hiss_rise(d):
    t = tt(d); return norm(bp(noise(len(t)), 4000, 12000)) * (t / d) ** 2.5
def spindown(d, stop=0.9):
    t = tt(d); T = max(d * stop, 0.05); k = np.clip(1 - t / T, 0, 1)
    ph = TAU * np.cumsum(150 * k ** 1.5 + 18) / SR
    hum = sum(np.sin(j * ph) / j for j in range(1, 6))
    return norm(fade(hum * k ** 0.8 + norm(bp(noise(len(t)), 200, 2000)) * k ** 2 * 1.5, 0.01, 0.05))
def ambience(d):
    t = tt(d); return norm(np.sin(TAU * 120 * t) * 0.3 + np.sin(TAU * 60 * t) * 0.2 + norm(bp(noise(len(t)), 120, 700)))
def rumble(d):
    t = tt(d); return norm(fade(bp(noise(len(t)), 30, 140) * (0.7 + 0.3 * np.sin(TAU * 0.7 * t)), 0.05, 0.1))
def crackle(d):
    n = int(d * SR); imp = (rs.random(n) < 12 / SR) * rs.random(n)
    k = noise(int(0.006 * SR)) * np.exp(-np.arange(int(0.006 * SR)) / (0.0015 * SR))
    return norm(fade(bp(np.convolve(imp, k, "same"), 1500, 7000), 0.02, 0.05))
def tick():
    t = tt(0.03); return np.sin(TAU * 1500 * t) * np.exp(-t * 160)
def ding():
    t = tt(0.4); return norm((np.sin(TAU * 1320 * t) + 0.5 * np.sin(TAU * 1980 * t)) * np.exp(-t * 12))
def thud():
    t = tt(0.22); f = 45 + 25 * np.exp(-t * 30)
    return norm(np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 18) + bp(noise(len(t)), 1000, 4000) * np.exp(-t * 200) * 0.4)

def place(buf, start, sig, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= len(buf): return
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig), 0] += sig * gain * min(1, 1 - pan)
    buf[i:i + len(sig), 1] += sig * gain * min(1, 1 + pan)

def build(ep):
    beats = ep["beats"]; starts = np.concatenate([[0], np.cumsum([b["d"] for b in beats])]); total = starts[-1]
    N = int(total * SR); t = np.arange(N) / SR
    sfx = np.zeros((N, 2)); events = []
    def ev(name, at, sig, gain, pan=0.0): place(sfx, at, sig, gain, pan); events.append((round(float(at), 2), name))
    fan_idx = next((i for i, b in enumerate(beats) if b["scene"] == "fans"), None)
    amb_end = starts[fan_idx] if fan_idx is not None else total
    place(sfx, 0, fade(ambience(amb_end), 0.3, 0.05), 0.05)
    for i, b in enumerate(beats):
        s, d, sc = starts[i], b["d"], b["scene"]
        if sc == "card":
            ev("boom", s, impact(), 0.5); continue
        if i > 0: ev("whoosh", s - 0.2, whoosh(), 0.16, pan=(-0.4 if i % 2 else 0.4))
        if b.get("cap"): ev("tick", s, tick(), 0.07)
        chip = (b.get("chip") or {}).get("type")
        if chip == "real": ev("ding", s + 0.12, ding(), 0.11, pan=0.2)
        if chip == "rule": ev("thud", s + 0.05, thud(), 0.4)
        if b.get("flash"): ev("impact", s, impact(), 0.7)
        if b.get("partPop"): ev("braam", s, braam(), 0.5); ev("impact", s, impact(), 0.6)
        names = b.get("sfx")
        if names is None:
            names = {"alarm": ["alarm"], "fire": ["rumble", "crackle"], "black": ["hiss"],
                     "fans": ["spindown"] if b.get("stopAt", 0) > 0.05 else []}.get(sc, [])
            if sc == "hatch" and b.get("glow", 0) >= 0.5: names = ["rumble_soft"]
        for nm in names:
            if nm == "alarm": ev(nm, s, alarm(d), 0.26)
            elif nm == "rumble": ev(nm, s, rumble(d), 0.32)
            elif nm == "rumble_soft": ev(nm, s, rumble(d), 0.16)
            elif nm == "crackle": ev(nm, s, crackle(d), 0.14, pan=-0.2)
            elif nm == "hiss": ev(nm, s, hiss(d), 0.55)
            elif nm == "hiss_rise": ev(nm, s, hiss_rise(d), 0.3)
            elif nm == "spindown": ev(nm, s, spindown(d, b.get("stopAt", 0.9)), 0.4)
    # ---- music bed: D minor drone, slow pulse, rising tension ----
    mus = np.zeros((N, 2))
    for j, (f, a) in enumerate([(36.71, .5), (73.42, .6), (110.0, .35), (146.83, .3), (174.61, .22), (220.0, .12),
                              (293.66, .10), (349.23, .07), (440.0, .06)]  # upper notes stay audible on phone speakers):
        lfo = 0.6 + 0.4 * np.sin(TAU * (0.05 + 0.03 * j) * t + j)
        mus[:, 0] += a * lfo * np.sin(TAU * f * 0.9985 * t); mus[:, 1] += a * lfo * np.sin(TAU * f * 1.0015 * t + 0.5)
    ten = (t / total) ** 2 * 0.3 * (0.75 + 0.25 * np.sin(TAU * 5 * t))
    for f in (155.56, 311.13):
        mus[:, 0] += ten * np.sin(TAU * f * t); mus[:, 1] += ten * np.sin(TAU * f * 1.002 * t)
    alarms = [starts[i] for i, b in enumerate(beats) if b["scene"] == "alarm"]
    p0 = alarms[1] if len(alarms) > 1 else min(8.0, total / 4)
    tp = tt(0.16); pulse = np.sin(TAU * 55 * tp) * np.exp(-tp * 22)
    for k, at in enumerate(np.arange(p0, total - 3, 60 / 84)):
        place(mus, at, pulse, 0.5 + 0.5 * (at - p0) / max(total - p0, 1))
    env = np.minimum(t / 0.3, 1.0)
    for i, b in enumerate(beats):
        a, z = int(starts[i] * SR), int(starts[i + 1] * SR)
        if b.get("quiet"): env[a:z] *= 0.06
        if b["scene"] == "card": env[a:z] *= np.linspace(1, 0, z - a) ** 1.5
    k = int(0.08 * SR); env = np.convolve(env, np.ones(k) / k, "same")
    mus = mus / np.abs(mus).max() * 0.34 * env[:, None]
    mix = np.tanh((mus + sfx) * 1.3); mix = mix / np.abs(mix).max() * 0.7
    return mus, sfx, mix, events, total

def save(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())

if __name__ == "__main__":
    ep = json.load(open(sys.argv[1])); pre = sys.argv[2]
    mus, sfx, mix, events, total = build(ep)
    save(pre + ".music.wav", mus); save(pre + ".sfx.wav", np.clip(sfx, -1, 1)); save(pre + ".mix.wav", mix)
    json.dump(events, open(pre + ".audio-events.json", "w"))
    print(f"{total:.1f}s, {len(events)} sound events")
