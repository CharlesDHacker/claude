"""Produce one WAV per script line in audio/<ep>/lines/.
Usage: python3 voice_lines.py episodes/ep01-balaam.lines.json audio/ep01 KOKORO_DIR
Lines whose speaker has an ElevenLabs take on disk (audio/<ep>/<take dir>/<id>.wav, see "takes" below) use it;
every other line is synthesised offline with Kokoro, then shaped per character (pitch, pace, reverb).
Re-run after dropping new ElevenLabs clips into a take dir: only the lines.json ids are needed."""
import sys, os, re, json, subprocess, shutil
import numpy as np
ep_path, adir, kdir = sys.argv[1:4]
ep = json.load(open(ep_path))
out = os.path.join(adir, "lines"); os.makedirs(out, exist_ok=True)
# ElevenLabs takes already split per line (tools/split_takes.py), by speaker
takes = {who: os.path.join(adir, d) for who, d in ep.get("takes", {}).items() if os.path.isdir(os.path.join(adir, d))}
words = {}
for d in takes.values():
    wp = os.path.join(d, "words.json")
    if os.path.exists(wp): words.update(json.load(open(wp)))
json.dump(words, open(os.path.join(out, "words.json"), "w"))
# Offline cast: kokoro voice, speed, pitch shift (semitones), extra ffmpeg filter
KOKORO = {
    "selah":  dict(voice="af_heart", speed=0.92, semi=0.0, fx=""),
    "balaam": dict(voice="bm_george", speed=0.95, semi=-1.5, fx=""),
    "donkey": dict(voice="bf_emma", speed=0.86, semi=-1.0, fx=""),
    "angel":  dict(voice="am_onyx", speed=0.80, semi=-3.0, fx="aecho=0.8:0.7:90|180:0.35|0.22,"),
    "toby":   dict(voice="af_nicole", speed=1.05, semi=3.0, fx=""),  # only used if no ElevenLabs take
    "jonah":  dict(voice="bm_lewis", speed=1.0, semi=-1.0, fx=""),
    "father": dict(voice="bm_george", speed=0.92, semi=-1.0, fx=""),
    "son":    dict(voice="am_puck", speed=1.0, semi=0.0, fx=""),
    "darius": dict(voice="am_michael", speed=0.95, semi=-1.0, fx=""),
    "daniel": dict(voice="bm_george", speed=0.88, semi=-1.5, fx=""),
    "official": dict(voice="bm_fable", speed=1.0, semi=0.0, fx=""),
}
k = None
def kokoro():
    global k
    if k is None:
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(kdir, "kokoro-v1.0.onnx"), os.path.join(kdir, "voices-v1.0.bin"))
    return k
def plain(say):  # drop ElevenLabs audio tags, keep punctuation for pacing
    s = re.sub(r"\[[^\]]*\]", " ", say); s = re.sub(r"\s+", " ", s).strip()
    return s[0].upper() + s[1:] if s and s[0] != "." else s
for ln in ep["lines"]:
    dst = os.path.join(out, ln["id"] + ".wav"); who = ln["who"]
    src = os.path.join(os.path.join(adir, ln["take"]) if ln.get("take") else takes.get(who, "/nonexistent"), ln["id"] + ".wav")
    if os.path.exists(src):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "44100", dst], check=True)
        print(f"{ln['id']} {who:7s} elevenlabs"); continue
    c = KOKORO[who]; text = plain(ln["say"])
    samples, sr = kokoro().create(text, voice=c["voice"], speed=c["speed"], lang="en-us" if c["voice"][0] == "a" else "en-gb")
    tmp = dst + ".raw.wav"
    import soundfile as sf; sf.write(tmp, samples, sr)
    r = 2 ** (c["semi"] / 12)
    af = f"asetrate={sr}*{r:.5f},aresample=44100,atempo={1 / r:.5f}," if c["semi"] else "aresample=44100,"
    af += c["fx"] + "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.12"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True); os.remove(tmp)
    print(f"{ln['id']} {who:7s} kokoro:{c['voice']}  \"{text}\"")
