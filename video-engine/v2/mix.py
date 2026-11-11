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
def snd(tok, s):
    name, _, k = tok.partition("@"); at = ct(s, int(k)) if k else s["t0"]; d = max(s["t1"] - at, .3)
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
for j, (f, a) in enumerate([(36.71, .5), (73.42, .6), (110.0, .35), (146.83, .3), (174.61, .22), (220.0, .12), (293.66, .10), (349.23, .07), (440.0, .06)]):
    lfo = 0.6 + 0.4 * np.sin(TAU * (0.05 + 0.03 * j) * t + j)
    mus[:, 0] += a * lfo * np.sin(TAU * f * 0.9985 * t); mus[:, 1] += a * lfo * np.sin(TAU * f * 1.0015 * t + 0.5)
ten = (t / total) ** 2 * 0.3 * (0.75 + 0.25 * np.sin(TAU * 5 * t))
for f in (155.56, 311.13): mus[:, 0] += ten * np.sin(TAU * f * t); mus[:, 1] += ten * np.sin(TAU * f * 1.002 * t)
p0 = by("alarmGo")[0]["t0"] if by("alarmGo") else total / 4; tp = A.tt(0.16); pulse = np.sin(TAU * 55 * tp) * np.exp(-tp * 22)
quiet = [(s["t0"], s["t1"]) for s in shots if s["scene"] == "silence" or s.get("quiet")]
for at in np.arange(p0, total - 3, 60 / 84):
    if not any(a <= at < b for a, b in quiet): A.place(mus, at, pulse, 0.5 + 0.5 * (at - p0) / max(total - p0, 1))
e = np.minimum(t / 0.3, 1.0)
for a, b in quiet: e[int(a * SR):int(b * SR)] *= 0.05
card = by("card")
if card: a, b = int(card[0]["t0"] * SR), N; e[a:b] *= np.linspace(1, 0, b - a) ** 1.2
k = int(0.1 * SR); e = np.convolve(e, np.ones(k) / k, "same")
mus = mus / np.abs(mus).max() * 0.34 * e[:, None]
# ---- voice + ducking ----
v = np.zeros(N); x = load(voice_path); x = x / np.abs(x).max() * 0.9; v[:min(N, len(x))] = x[:N]
k = int(0.12 * SR); lev = np.sqrt(np.convolve(v ** 2, np.ones(k) / k, "same"))
duck = np.clip(lev / 0.06, 0, 1); k2 = int(0.3 * SR); duck = np.maximum(duck, np.convolve(duck, np.ones(k2) / k2, "same"))
mix = v[:, None] + mus * (0.5 * (1 - 0.6 * duck))[:, None] + sfx * (0.8 * (1 - 0.5 * duck))[:, None]
mix = np.tanh(mix * 1.1); mix = mix / np.abs(mix).max() * 0.84
A.save(out, mix); json.dump(sorted(log), open(out.replace(".wav", ".events.json"), "w"))
print(f"{total:.2f}s mix, {len(log)} sound events:", ", ".join(sorted({n for _, n in log})))
