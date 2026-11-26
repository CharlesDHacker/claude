"""Remove baked-in room echo from voice clips (late-reverberation spectral suppression, Lebart/Habets style).
Usage: python3 dereverb.py IN.wav OUT.wav [T60_seconds] [strength]
The late reverb power at frame t is predicted from the signal power Td earlier, decayed by the room's T60; that
prediction is subtracted with a smoothed gain (floored, so speech never gets gated). A gentle downward expander then
tucks the quiet tails between words. Speech onsets and consonants pass untouched."""
import sys, numpy as np, wave
from scipy.signal import stft, istft
def load(p):
    w = wave.open(p); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    if w.getnchannels() > 1: x = x.reshape(-1, w.getnchannels()).mean(1)
    return x, sr
def save(p, x, sr):
    with wave.open(p, 'w') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
def dereverb(x, sr, t60=.7, strength=1.0):
    n, hop = 1024, 256; f, t, X = stft(x, sr, nperseg=n, noverlap=n - hop); P = np.abs(X) ** 2
    Ps = np.copy(P); a = .55
    for k in range(1, P.shape[1]): Ps[:, k] = a * Ps[:, k - 1] + (1 - a) * P[:, k]   # smoothed power
    Td = .05; Nd = max(1, int(round(Td * sr / hop))); delta = 3 * np.log(10) / t60
    Pl = np.zeros_like(P); Pl[:, Nd:] = np.exp(-2 * delta * Td) * Ps[:, :-Nd] * strength
    G = np.clip(1 - Pl / (P + 1e-12), .12, 1)
    for k in range(1, G.shape[1]): G[:, k] = .5 * G[:, k - 1] + .5 * G[:, k]
    G = np.minimum(1, G * 1.05)
    _, y = istft(X * G, sr, nperseg=n, noverlap=n - hop); y = y[:len(x)]
    # downward expander on the tails (10 ms frames)
    w = int(.01 * sr); env = np.array([np.sqrt(np.mean(y[i:i + w] ** 2)) + 1e-9 for i in range(0, len(y), w)]); pk = np.percentile(env, 95)
    db = 20 * np.log10(env / pk); g = np.where(db < -32, 10 ** ((db + 32) * .6 / 20), 1.0); g = np.convolve(g, np.ones(5) / 5, 'same')
    y = y * np.repeat(g, w)[:len(y)]
    return y * (np.max(np.abs(x)) / (np.max(np.abs(y)) + 1e-9))
if __name__ == '__main__':
    x, sr = load(sys.argv[1]); t60 = float(sys.argv[3]) if len(sys.argv) > 3 else .7; st = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
    save(sys.argv[2], dereverb(x, sr, t60, st), sr)
