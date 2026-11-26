import sys, numpy as np, librosa
for p in sys.argv[1:]:
    y, sr = librosa.load(p, sr=16000); f0, v, pr = librosa.pyin(y, fmin=90, fmax=800, sr=sr); f = f0[v & (pr > .4)]
    print(f"{p:28s} {len(y)/sr:4.2f}s rms {20*np.log10(np.sqrt(np.mean(y**2))+1e-9):6.1f}dB  F0 {np.nanmedian(f) if len(f) else 0:4.0f}  range {np.nanpercentile(f,90)-np.nanpercentile(f,10) if len(f) else 0:4.0f}")
