#!/usr/bin/env python3
"""Baut den Ton für Operation Jackpot: Stimmen, Musik, Geräusche und die Zeitachse.

Liest drehbuch.json und schreibt nach build/:
  ton.wav       Stereo, 44,1 kHz, die komplette Tonspur
  timeline.js   Szenen- und Satzzeiten mit Mundbewegung für film.html

Stimmen kommen von Piper (pip install piper-tts). Fehlende Stimmmodelle lädt
das Skript von Hugging Face nach build/voices oder nimmt sie aus $PIPER_VOICES.
Musik und Geräusche entstehen hier im Skript, es gibt keine fremden Aufnahmen.
"""
import hashlib
import json
import os
import unicodedata
import urllib.request
import wave
from pathlib import Path

import numpy as np

HIER = Path(__file__).resolve().parent
BUILD = HIER / "build"
STIMMEN_DIR = Path(os.environ.get("PIPER_VOICES", BUILD / "voices"))
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE"
SR = 44100
LUECKE = 0.35  # Pause vor jedem Satz, wenn das Drehbuch keine eigene nennt

rng = np.random.default_rng(31102026)


# ---------------------------------------------------------------- Werkzeuge

def sek(n):
    return int(round(n * SR))


def zeit(d):
    return np.arange(sek(d)) / SR


def rauschen(n):
    return rng.standard_normal(n)


def filter_fft(x, maske):
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(np.fft.rfft(x) * maske(f), len(x))


def tiefpass(x, fc):
    return filter_fft(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** 4))


def hochpass(x, fc):
    return filter_fft(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** 4))


def bandpass(x, lo, hi):
    return hochpass(tiefpass(x, hi), lo)


def sinus_sweep(f):
    """Sinus mit zeitlich veränderlicher Frequenz (Array in Hz)."""
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def abkling(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def rampe(n, an=0.005, aus=0.01):
    e = np.ones(n)
    a, b = min(n, sek(an)), min(n, sek(aus))
    if a:
        e[:a] = np.linspace(0, 1, a)
    if b:
        e[n - b:] *= np.linspace(1, 0, b)
    return e


def norm(x, spitze=0.9):
    m = np.max(np.abs(x))
    return x * (spitze / m) if m > 0 else x


def resample(x, n_neu):
    """Bandbegrenztes Umrechnen auf n_neu Samples per FFT."""
    X = np.fft.rfft(x)
    Y = np.zeros(n_neu // 2 + 1, dtype=complex)
    k = min(len(X), len(Y))
    Y[:k] = X[:k]
    return np.fft.irfft(Y, n_neu) * (n_neu / len(x))


def box(x, d):
    """Gleitender Mittelwert über d Sekunden, für weiche Hüllkurven."""
    n = max(1, sek(d))
    c = np.cumsum(np.concatenate([np.zeros(n), x, np.full(n, x[-1])]))
    return ((c[n:] - c[:-n]) / n)[n // 2:n // 2 + len(x)]


def hall_ir(dauer, dichte=1.0):
    n = sek(dauer)
    t = np.arange(n) / SR
    ir = np.stack([tiefpass(rauschen(n), 5000) * np.exp(-t / (dauer / 5)) for _ in range(2)], axis=1)
    ir[0] = 0
    return ir / np.sqrt((ir ** 2).sum(axis=0)) * dichte


def falten(x, ir):
    """Faltung eines Mono- oder Stereosignals mit einer Stereo-Impulsantwort."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    n = len(x) + len(ir) - 1
    m = 1 << (n - 1).bit_length()
    out = np.fft.irfft(np.fft.rfft(x, m, axis=0) * np.fft.rfft(ir, m, axis=0), m, axis=0)
    return out[:n]


def mit_hall(x, dauer, nass, dichte=1.0):
    """Trockenes Signal plus Hallfahne; das Ergebnis ist um die Fahne länger."""
    trocken = np.stack([x, x], axis=1) if x.ndim == 1 else x
    out = falten(trocken, hall_ir(dauer, dichte)) * nass
    out[:len(trocken)] += trocken
    return out


def pan_stereo(x, pan):
    if x.ndim == 2:
        return x
    w = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(w), x * np.sin(w)], axis=1) * np.sqrt(2)


def legen(spur, sig, t0, gain=1.0, pan=0.0):
    """Legt ein Signal ab Sekunde t0 in die Stereospur."""
    s = pan_stereo(sig, pan) * gain
    a = sek(t0)
    if a < 0:
        s, a = s[-a:], 0
    b = min(len(spur), a + len(s))
    if b > a:
        spur[a:b] += s[:b - a]


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- Stimmen

_geladen = {}


def stimmmodell(name):
    if name not in _geladen:
        from piper import PiperVoice
        _, sprecher, qualitaet = name.split("-")
        STIMMEN_DIR.mkdir(parents=True, exist_ok=True)
        for endung in (".onnx", ".onnx.json"):
            ziel = STIMMEN_DIR / f"{name}{endung}"
            if not ziel.exists():
                print(f"  lade {ziel.name}")
                urllib.request.urlretrieve(f"{HF}/{sprecher}/{qualitaet}/{name}{endung}", ziel)
        stimme = PiperVoice.load(STIMMEN_DIR / f"{name}.onnx")
        # espeak liefert das ch in "ich" als c plus Cedille; die low-Modelle kennen nur das fertige ç
        roh = stimme.phonemize
        stimme.phonemize = lambda text: [list(unicodedata.normalize("NFC", "".join(p))) for p in roh(text)]
        _geladen[name] = stimme
    return _geladen[name]


def sprechen(satz, stimme):
    """Gibt den Satz als Mono-Array mit 44,1 kHz zurück, mit Cache in build/stimmen."""
    from piper import SynthesisConfig
    text = satz.get("say", satz["text"])
    schluessel = json.dumps([stimme["modell"], stimme.get("sprecher"), stimme["tempo"], text, "nfc"])
    cache = BUILD / "stimmen" / (hashlib.sha1(schluessel.encode()).hexdigest()[:16] + ".npz")
    if cache.exists():
        d = np.load(cache)
        roh, sr = d["audio"], int(d["sr"])
    else:
        cfg = SynthesisConfig(speaker_id=stimme.get("sprecher"), length_scale=stimme["tempo"])
        teile = list(stimmmodell(stimme["modell"]).synthesize(text, syn_config=cfg))
        roh = np.concatenate([t.audio_float_array for t in teile]).astype(np.float64)
        sr = teile[0].sample_rate
        cache.parent.mkdir(parents=True, exist_ok=True)
        np.savez(cache, audio=roh, sr=sr)

    # Stille an den Rändern weg, damit die Zeitachse eng sitzt
    laut = np.flatnonzero(np.abs(roh) > 0.02 * np.max(np.abs(roh)))
    rand = int(0.04 * sr)
    roh = roh[max(0, laut[0] - rand):laut[-1] + rand]

    # Umrechnen auf 44,1 kHz; "hoehe" unter 1 macht die Stimme tiefer und langsamer
    x = resample(roh, int(len(roh) * SR / sr / stimme["hoehe"]))
    return norm(x * rampe(len(x), 0.01, 0.03), 0.9)


def stimm_effekt(wer, x):
    if wer == "navi":  # Autolautsprecher
        x = bandpass(x, 280, 5500)
        return pan_stereo(norm(np.tanh(x * 1.4), 0.85), 0)
    if wer == "erzaehler":
        return mit_hall(x, 1.8, 0.2)
    if wer == "croupier":
        return mit_hall(x, 1.2, 0.18)
    if wer == "tuersteher":
        return mit_hall(x, 0.8, 0.12)
    return x


def huellkurve(x, fps):
    """Lautstärke pro Videobild zwischen 0 und 1, für die Mundbewegung."""
    m = x.mean(axis=1) if x.ndim == 2 else x
    n = sek(1 / fps)
    k = int(np.ceil(len(m) / n))
    m = np.pad(m, (0, k * n - len(m)))
    rms = np.sqrt((m.reshape(k, n) ** 2).mean(axis=1))
    ref = np.percentile(rms, 90) or 1
    return [round(float(v), 2) for v in np.clip(rms / ref, 0, 1) ** 0.7]


# ---------------------------------------------------------------- Geräusche

def g_boom(_=None):
    t = zeit(3.2)
    s = sinus_sweep(32 + 60 * np.exp(-t / 0.22)) * np.exp(-t / 0.6)
    s += tiefpass(rauschen(len(t)), 260) * np.exp(-t / 0.12) * 0.15
    return mit_hall(norm(s), 1.8, 0.3)


def g_whoosh(_=None):
    t = zeit(1.0)
    n = rauschen(len(t))
    p = t / t[-1]
    s = tiefpass(n, 900) * (1 - p) * 0.15 + bandpass(n, 1500, 6000) * p * 0.4
    return norm(s * np.sin(np.pi * p) ** 2, 0.7)


def g_pop(_=None):
    t = zeit(0.14)
    return norm(sinus_sweep(500 + 1000 * t / t[-1]) * np.exp(-t / 0.035) * rampe(len(t), 0.002), 0.6)


def g_flip(_=None):
    t = zeit(0.45)
    n = hochpass(rauschen(len(t)), 1800)
    e = np.exp(-((t - 0.06) / 0.04) ** 2) + 0.7 * np.exp(-((t - 0.2) / 0.06) ** 2)
    return norm(n * e, 0.5)


def g_motor(dauer):
    t = zeit(dauer)
    f0 = 41 * (1 + 0.03 * np.sin(2 * np.pi * 0.37 * t))
    phase = 2 * np.pi * np.cumsum(f0) / SR
    s = sum(np.sin(k * phase) / k for k in range(1, 9))
    s *= 0.75 + 0.25 * np.sin(2 * phase)
    s = tiefpass(s, 320) + tiefpass(rauschen(len(t)), 220) * 0.6
    return norm(s * rampe(len(t), 0.6, 0.6), 0.5)


def g_gong(_=None):
    t = zeit(1.6)
    s = np.zeros(len(t))
    for start, f in ((0.0, 659.25), (0.38, 523.25)):
        tt = np.clip(t - start, 0, None)
        an = t >= start
        ton = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt) + 0.12 * np.sin(2 * np.pi * 3.01 * f * tt)
        s += ton * np.exp(-tt / 0.6) * an * np.minimum(1, tt / 0.004)
    return norm(s, 0.55)


def g_neon(dauer):
    """Neonsurren mit Aussetzern; die Aussetzer stehen in NEON, damit das Schild im Bild mitflackert."""
    t = zeit(dauer)
    brumm = sum(np.sin(2 * np.pi * 100 * k * t) / k ** 1.3 for k in range(1, 7))
    huelle = np.ones(len(t))
    knistern = np.zeros(len(t))
    zeitpunkte = []
    z = 0.9
    while z < dauer - 0.4:
        lang = rng.uniform(0.06, 0.22)
        zeitpunkte.append([round(z, 3), round(lang, 3)])
        a, b = sek(z), sek(z + lang)
        huelle[a:b] = 0.15
        knistern[a:b] = hochpass(rauschen(b - a), 2500) * 0.5
        z += rng.uniform(1.1, 2.6)
    NEON.extend(zeitpunkte)
    return norm(brumm * box(huelle, 0.01) * 0.25 + knistern, 0.35)


def g_schritte(_=None):
    t = zeit(2.4)
    s = np.zeros(len(t))
    for wer, versatz in ((0, 0.0), (1, 0.21)):
        for k in range(5):
            z = versatz + k * 0.44
            n = sek(0.12)
            tt = np.arange(n) / SR
            tritt = tiefpass(rauschen(n), 200 + 60 * wer) * np.exp(-tt / 0.03) + 0.5 * np.sin(2 * np.pi * 68 * tt) * np.exp(-tt / 0.04)
            a = sek(z)
            s[a:a + n] += tritt[:len(s) - a]
    return norm(s, 0.45)


def g_drehtuer(_=None):
    """Drehtür: weiches Rauschen der Glasflügel und ein dumpfer Anschlag pro Flügel."""
    t = zeit(1.8)
    s = bandpass(rauschen(len(t)), 300, 2400) * np.sin(np.pi * t / t[-1]) ** 2 * 0.25
    for z in (0.35, 0.95, 1.5):
        tt = np.clip(t - z, 0, None)
        s += tiefpass(rauschen(len(t)), 220) * np.exp(-tt / 0.05) * (t >= z) * 0.8
    return norm(s, 0.45)


def ping(f, dauer, tau):
    t = zeit(dauer)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2.76 * f * t) + 0.25 * np.sin(2 * np.pi * 5.4 * f * t)
    return s * np.exp(-t / tau) * rampe(len(t), 0.001, 0.002)


def g_casino(dauer):
    t = zeit(dauer)
    murmeln = bandpass(rauschen(len(t)), 220, 1400) * (0.6 + 0.4 * box(np.abs(rauschen(len(t))), 0.6))
    s = pan_stereo(murmeln * 0.25, 0)
    z = 0.3
    while z < dauer:
        legen(s, ping(rng.uniform(2400, 5200), 0.3, 0.06), z, rng.uniform(0.05, 0.14), rng.uniform(-0.8, 0.8))
        z += rng.exponential(0.7)
    for z in np.arange(1.2, dauer, 2.9):  # Spielautomaten in der Ferne
        for i, m in enumerate((84, 88, 91, 96)):
            legen(s, ping(mtof(m), 0.25, 0.08) * 0.3, z + i * 0.08, 0.12, -0.6)
    return s * rampe(len(s), 0.5, 0.5)[:, None]


def g_touch(_=None):
    t = zeit(0.12)
    return norm(np.sin(2 * np.pi * 1320 * t) * np.exp(-t / 0.025) + 0.5 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t / 0.015), 0.4)


def walze_lauf(dauer):
    """Eine drehende Walze: schnelles Ticken mit leisem Surren."""
    t = zeit(dauer)
    s = bandpass(rauschen(len(t)), 600, 3000) * 0.08
    for z in np.arange(0.0, dauer - 0.02, 1 / 24):
        a = sek(z)
        n = min(sek(0.012), len(s) - a)
        s[a:a + n] += bandpass(rauschen(sek(0.012)), 1500, 6000)[:n] * abkling(sek(0.012), 0.003)[:n] * 0.5
    return s * rampe(len(s), 0.02, 0.02)


def walze_stopp(_=None):
    t = zeit(0.18)
    return norm(tiefpass(rauschen(len(t)), 500) * np.exp(-t / 0.03) + 0.6 * np.sin(2 * np.pi * 110 * t) * np.exp(-t / 0.05), 0.6)


def klee_glocke(n):
    """Glockenton für ein neues Kleeblatt; mit jedem weiteren Kleeblatt einen Ton höher."""
    leiter = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96]
    return norm(ping(mtof(leiter[min(n, len(leiter) - 1)]) / 2, 0.9, 0.35), 0.6)


def grand_glocke(_=None):
    t = zeit(2.0)
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in ((261.6, 1.2), (523.3, 0.9), (659.3, 0.7), (784.0, 0.6), (1568, 0.3)))
    return mit_hall(norm(s * rampe(len(t), 0.003, 0.1), 0.7), 1.4, 0.25)


def g_feature(_=None):
    """Kurzer Jingle, wenn das Clover Feature startet."""
    s = np.zeros(sek(1.4))
    for i, m in enumerate((72, 76, 79, 84, 88, 91)):
        legen_mono = ping(mtof(m), 0.6, 0.18)
        a = sek(i * 0.09)
        s[a:a + len(legen_mono)] += legen_mono[:len(s) - a]
    return norm(s, 0.6)


def g_klingel(_=None):
    """Jackpot-Klingel: eine Alarmglocke, die drei Sekunden durchläutet."""
    t = zeit(3.2)
    s = np.zeros(len(t))
    for z in np.arange(0, 3.0, 1 / 18):
        a = sek(z)
        p = ping(2100, 0.12, 0.04)
        s[a:a + len(p)] += p[:len(s) - a]
    return norm(s * rampe(len(s), 0.01, 0.4), 0.45)


def g_xkah(_=None):
    """Der Xkah Pro schaltet ein: zwei Pieptöne und ein aufsteigender Ton."""
    s = np.zeros(sek(1.4))
    for z, f in ((0.0, 1760), (0.18, 1760)):
        t = zeit(0.09)
        b = np.sign(np.sin(2 * np.pi * f * t)) * 0.3 * rampe(len(t), 0.003, 0.01)
        s[sek(z):sek(z) + len(b)] += b
    t = zeit(0.8)
    s[sek(0.5):sek(0.5) + len(t)] += sinus_sweep(np.linspace(600, 1400, len(t))) * np.sin(np.pi * t / t[-1]) * 0.25
    return norm(tiefpass(s, 5000), 0.4)


def g_trommel(dauer):
    t = zeit(dauer)
    s = np.zeros(len(t))
    z = 0.0
    while z < dauer - 0.05:
        p = z / dauer
        n = sek(0.05)
        tt = np.arange(n) / SR
        schlag = hochpass(rauschen(n), 1200) * np.exp(-tt / 0.02) + 0.4 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt / 0.02)
        a = sek(z)
        s[a:a + n] += schlag[:len(s) - a] * (0.2 + 0.8 * p ** 1.5) * rng.uniform(0.8, 1.0)
        z += 1 / (12 + 16 * p)
    return norm(s, 0.55)


def saege(f, t):
    phase = 2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR
    return sum(np.sin(k * phase) / k for k in range(1, 16))


def g_fanfare(_=None):
    t = zeit(2.4)
    s = np.zeros(len(t))
    for start, lang in ((0.0, 0.14), (0.17, 0.14), (0.34, 1.6)):
        an = (t >= start) & (t < start + lang + 0.25)
        tt = np.clip(t - start, 0, None)
        e = np.minimum(1, tt / 0.02) * np.where(tt < lang, 1, np.exp(-(tt - lang) / 0.08)) * an
        vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt) * (tt > 0.3)
        for m in (62, 66, 69, 74):
            s += saege(mtof(m) * vib, t) * e
    s = tiefpass(s, 2600)
    tt = t
    crash = hochpass(rauschen(len(t)), 3500) * np.exp(-tt / 0.9) * 0.6
    return mit_hall(norm(s, 0.7) + crash * 0.5, 1.6, 0.25)


def g_muenzen(_=None):
    dauer = 3.4
    s = np.zeros((sek(dauer + 0.4), 2))
    for _ in range(110):
        z = dauer * rng.random() ** 1.8
        legen(s, ping(rng.uniform(2500, 6500), 0.4, rng.uniform(0.05, 0.22)), z, rng.uniform(0.15, 0.5), rng.uniform(-0.9, 0.9))
    return s * (0.8 / np.max(np.abs(s)))


def g_blubbern(dauer):
    t = zeit(dauer)
    s = tiefpass(rauschen(len(t)), 110) * 0.15 * (0.5 + 0.5 * box(np.abs(rauschen(len(t))), 0.4))
    z = 0.2
    while z < dauer - 1:
        for k in range(rng.integers(4, 10)):
            n = sek(0.07)
            tt = np.arange(n) / SR
            blub = sinus_sweep(170 * np.exp(tt / 0.07 * np.log(3.2))) * np.sin(np.pi * tt / tt[-1]) ** 2
            a = sek(z + k * rng.uniform(0.06, 0.13))
            if a + n < len(s):
                s[a:a + n] += blub * rng.uniform(0.4, 1.0)
        BLUBB.append(round(z, 3))
        z += rng.uniform(1.4, 3.2)
    return norm(s * rampe(len(s), 0.5, 1.0), 0.5)


NEON = []   # Aussetzer des Neonschilds: [Sekunde, Dauer]
BLUBB = []  # Blubberstöße der Shisha
GERAEUSCHE = {
    # Name: (Funktion, Lautstärke, Stereoposition)
    "boom": (g_boom, 0.8, 0), "whoosh": (g_whoosh, 0.5, 0), "pop": (g_pop, 0.35, -0.2),
    "flip": (g_flip, 0.5, -0.2), "motor": (g_motor, 0.45, 0), "gong": (g_gong, 0.45, 0),
    "neon": (g_neon, 0.35, 0.1), "schritte": (g_schritte, 0.55, -0.3), "drehtuer": (g_drehtuer, 0.55, 0.15),
    "casino": (g_casino, 0.5, 0), "touch": (g_touch, 0.4, 0.2), "feature": (g_feature, 0.55, 0.2),
    "trommel": (g_trommel, 0.5, 0), "fanfare": (g_fanfare, 0.55, 0), "klingel": (g_klingel, 0.35, 0.2),
    "muenzen": (g_muenzen, 0.6, 0), "blubbern": (g_blubbern, 0.55, 0.05), "xkah": (g_xkah, 0.4, 0),
}


# ---------------------------------------------------------------- Musik

def vibes(f, dauer):
    t = zeit(dauer)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.15)
    return s * np.exp(-t / 1.0) * (1 + 0.25 * np.sin(2 * np.pi * 5 * t)) * rampe(len(t), 0.003, 0.05)


def bass(f, dauer, tau=0.35):
    t = zeit(dauer)
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) + 0.15 * np.sin(6 * np.pi * f * t)
    return s * np.exp(-t / tau) * rampe(len(t), 0.004, 0.04)


def kick(dauer=0.3):
    t = zeit(dauer)
    return sinus_sweep(42 + 50 * np.exp(-t / 0.03)) * np.exp(-t / 0.12)


def besen(dauer=0.25):
    n = sek(dauer)
    return bandpass(rauschen(n), 900, 7000) * abkling(n, 0.07) * rampe(n, 0.01, 0.02)


def becken(dauer=0.5):
    t = zeit(dauer)
    s = sum(np.sin(2 * np.pi * f * t) for f in (3150, 4730, 5910, 7340)) * 0.15 + hochpass(rauschen(len(t)), 6000) * 0.6
    return s * np.exp(-t / 0.18)


def theremin(noten, beat, dauer):
    """Spuk-Melodie: Sinus mit Vibrato und Gleiten zwischen den Tönen."""
    t = zeit(dauer)
    f = np.zeros(len(t))
    amp = np.zeros(len(t))
    for m, b0, lang in noten:
        a, b = sek(b0 * beat), sek((b0 + lang) * beat)
        f[a:] = mtof(m)
        amp[a:max(a, b - sek(0.04))] = 1
    f = box(f, 0.07) * (1 + 0.008 * np.sin(2 * np.pi * 6 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * box(amp, 0.08)


def musik_heist(dauer):
    bpm = 112
    beat = 60 / bpm
    takt = 4 * beat
    s = np.zeros((sek(dauer) + SR * 3, 2))
    akkorde = [  # Grundton für den Bass, Töne für das Vibraphon
        ([38, 41, 45, 41], [62, 65, 69, 72]),
        ([38, 33, 36, 37], [62, 65, 69, 73]),
        ([34, 38, 41, 44], [58, 62, 65, 68]),
        ([33, 37, 40, 43], [57, 61, 64, 67]),
    ]
    melodie = [(69, 0, 2), (74, 2, 2), (77, 4, 1.5), (76, 5.5, 0.5), (74, 6, 2),
               (73, 8, 2), (74, 10, 1), (76, 11, 1), (69, 12, 3.5)]
    i = 0
    while i * takt < dauer + takt:
        t0 = i * takt
        basslauf, akkord = akkorde[i % 4]
        for b in range(4):
            legen(s, bass(mtof(basslauf[b]), beat * 1.1), t0 + b * beat, 0.5, 0)
            legen(s, becken(), t0 + b * beat, 0.08, 0.4)
            if b in (1, 3):
                legen(s, besen(), t0 + b * beat, 0.25, -0.1)
                legen(s, becken(), t0 + (b + 2 / 3) * beat, 0.05, 0.4)
            if b in (0, 2):
                legen(s, kick(), t0 + b * beat, 0.45, 0)
        for m in akkord:
            legen(s, vibes(mtof(m), 2.0), t0, 0.07, -0.35)
        if i % 2:
            for m in akkord[1:3]:
                legen(s, vibes(mtof(m + 12), 1.0), t0 + 2.67 * beat, 0.04, -0.35)
        if i % 8 == 4:  # jede zweite Phrase: Theremin
            legen(s, theremin(melodie, beat, 4 * takt), t0, 0.09, 0.3)
        i += 1
    return s


def musik_lounge(dauer):
    bpm = 76
    beat = 60 / bpm
    takt = 4 * beat
    s = np.zeros((sek(dauer) + SR * 4, 2))
    akkorde = [(38, [62, 65, 69, 72, 76]), (43, [62, 65, 67, 70, 74]),
               (34, [62, 65, 69, 70, 74]), (33, [61, 64, 67, 69, 74])]
    i = 0
    while i * takt < dauer + takt:
        t0 = i * takt
        grund, akkord = akkorde[i % 4]
        legen(s, bass(mtof(grund), takt * 0.5, 0.6), t0, 0.45, 0)
        legen(s, bass(mtof(grund + 7), takt * 0.5, 0.6), t0 + 2 * beat, 0.35, 0)
        for k, m in enumerate(akkord):
            legen(s, vibes(mtof(m), takt), t0 + k * 0.025, 0.06, -0.3 + 0.15 * k)
        for b in range(8):
            legen(s, becken(0.2), t0 + (b // 2 + (2 / 3 if b % 2 else 0)) * beat, 0.025, 0.4)
        legen(s, besen(), t0 + beat, 0.12, -0.1)
        legen(s, besen(), t0 + 3 * beat, 0.12, -0.1)
        for k in rng.choice(5, 2, replace=False):
            legen(s, vibes(mtof(akkord[k] + 12), 1.2), t0 + rng.choice([1.5, 2.5, 3.5]) * beat, 0.035, 0.35)
        i += 1
    return s


# ---------------------------------------------------------------- Zeitachse

def anker(szene, name):
    """Zeitpunkt zu einem Anker: start, ende, S3 (Satzbeginn), S3e (Satzende), W2 (Walzenstart), W2e (letzter Walzenstopp)."""
    if name == "start":
        return szene["start"]
    if name == "ende":
        return szene["ende"]
    if name.startswith("W"):
        w = szene["walzen"][int(name[1:].rstrip("e"))]
        return max(w["stopps"]) if name.endswith("e") else w["t0"]
    if name.endswith("e"):
        return szene["saetze"][int(name[1:-1])]["ende"]
    return szene["saetze"][int(name[1:])]["start"]


def main():
    buch = json.loads((HIER / "drehbuch.json").read_text())
    fps = buch["fps"]
    stimmen = buch["stimmen"]
    BUILD.mkdir(exist_ok=True)

    print("Stimmen …")
    t = 0.0
    szenen = []
    for sz in buch["szenen"]:
        szene = {"id": sz["id"], "start": round(t, 3), "saetze": []}
        cursor = t + sz["vorlauf"]
        for i, satz in enumerate(sz["saetze"]):
            stimme = stimmen[satz.get("stimme", satz["wer"])]
            trocken = sprechen(satz, stimme)
            cursor += satz.get("pause", 0 if i == 0 else LUECKE)
            dauer = len(trocken) / SR  # die Hallfahne zählt nicht zur Satzlänge
            szene["saetze"].append({
                "wer": satz["wer"], "name": stimme["name"], "text": satz["text"],
                "start": round(cursor, 3), "ende": round(cursor + dauer, 3),
                "_audio": stimm_effekt(satz["wer"], trocken), "env": huellkurve(trocken, fps),
            })
            cursor += dauer
        t = cursor + sz["nachlauf"]
        szene["ende"] = round(t, 3)
        if "walzen" in sz:
            szene["walzen"] = []
            for w in sz["walzen"]:
                t0 = anker(szene, w["anker"]) + w["versatz"]
                stopps = [t0 + w["lauf"] + i * w.get("abstand", 0.2) for i in range(5)]
                stopps[4] += w.get("spannung", 0)
                szene["walzen"].append({"t0": round(t0, 3), "stopps": [round(x, 3) for x in stopps], "neu": w["neu"]})
        szenen.append(szene)
    gesamt = t
    n = sek(gesamt)
    print(f"  Länge {gesamt:.1f} s")

    stimmspur = np.zeros((n, 2))
    sprache = np.zeros(n)
    for szene in szenen:
        for satz in szene["saetze"]:
            audio = satz.pop("_audio")
            legen(stimmspur, audio, satz["start"], 1.0, stimmen[satz["wer"]]["pan"])
            a, b = sek(satz["start"]), min(n, sek(satz["ende"]))
            sprache[a:b] = 1

    print("Geräusche …")
    geraeuschspur = np.zeros((n, 2))
    cues = []
    for sz, szene in zip(buch["szenen"], szenen):
        for cue in sz["geraeusche"]:
            name, ank, versatz = cue[:3]
            t0 = anker(szene, ank) + versatz
            t1 = anker(szene, cue[3]) if len(cue) > 3 else None
            fn, gain, pan = GERAEUSCHE[name]
            NEON.clear()
            BLUBB.clear()
            sig = fn(t1 - t0 if t1 else None)
            legen(geraeuschspur, sig, t0, gain, pan)
            eintrag = {"name": name, "szene": szene["id"], "t0": round(t0, 3), "t1": round(t0 + len(sig) / SR, 3)}
            if NEON:
                eintrag["aussetzer"] = [[round(t0 + a, 3), d] for a, d in NEON]
            if BLUBB:
                eintrag["stoesse"] = [round(t0 + z, 3) for z in BLUBB]
            cues.append(eintrag)
    for szene in szenen:
        gehalten, anzahl = set(), 0
        for i, w in enumerate(szene.get("walzen", [])):
            for walze in range(5):
                # Im Clover Feature drehen nur Walzen, auf denen noch ein Feld frei ist
                if i > 0 and all((walze, reihe) in gehalten for reihe in range(3)):
                    continue
                stopp = w["stopps"][walze]
                legen(geraeuschspur, walze_lauf(stopp - w["t0"]), w["t0"], 0.3, (walze - 2) * 0.2)
                legen(geraeuschspur, walze_stopp(), stopp, 0.5, (walze - 2) * 0.2)
                for k, (_, reihe, wert) in enumerate(x for x in w["neu"] if x[0] == walze):
                    legen(geraeuschspur, klee_glocke(anzahl), stopp + k * 0.07, 0.5, (walze - 2) * 0.2)
                    if wert == "GRAND":
                        legen(geraeuschspur, grand_glocke(), stopp, 0.45, (walze - 2) * 0.2)
                    gehalten.add((walze, reihe))
                    anzahl += 1

    print("Musik …")
    spuren = {"heist": musik_heist(gesamt)}
    spuren["gedaempft"] = np.stack([tiefpass(spuren["heist"][:, k], 550) for k in range(2)], axis=1) * 0.9
    spuren["lounge"] = musik_lounge(gesamt)
    musik = np.zeros((n, 2))
    for stil, spur in spuren.items():
        gewicht = np.zeros(n)
        for sz, szene in zip(buch["szenen"], szenen):
            if sz["musik"] == stil:
                gewicht[sek(szene["start"]):sek(szene["ende"])] = 1
        musik += spur[:n] * box(gewicht, 1.2)[:, None]
    pegel = np.ones(n)
    for sz, szene in zip(buch["szenen"], szenen):
        if "musik_pause" in sz:
            a1, v1, a2, v2 = sz["musik_pause"]
            pegel[sek(anker(szene, a1) + v1):sek(anker(szene, a2) + v2)] = 0
    pegel = box(pegel, 0.4)
    pegel *= 1 - 0.7 * box(sprache, 0.35)  # leiser, wenn jemand spricht
    pegel *= np.clip((gesamt - np.arange(n) / SR) / 5, 0, 1)  # am Ende ausblenden
    musik = mit_hall(musik * pegel[:, None], 1.4, 0.2)[:n] * 0.5

    print("Mischen …")
    mix = stimmspur + geraeuschspur + musik
    mix *= 0.9 / np.percentile(np.abs(mix), 99.98)
    mix = np.tanh(mix)
    mix *= 0.95 / np.max(np.abs(mix))
    with wave.open(str(BUILD / "ton.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())

    timeline = {"titel": buch["titel"], "fps": fps, "dauer": round(gesamt, 3), "szenen": szenen, "cues": cues}
    (BUILD / "timeline.js").write_text("window.TIMELINE = " + json.dumps(timeline, ensure_ascii=False) + ";\n")
    print(f"Fertig: build/ton.wav und build/timeline.js ({gesamt:.1f} s)")


if __name__ == "__main__":
    main()
