#!/usr/bin/env python3
"""
Generate seamlessly-looping brown noise MP3 for Alexa Echo Noise skill.

Approach: FFT-based spectral shaping. Generate white noise, FFT, apply
1/f^exponent amplitude envelope (brown = 2.0), inverse FFT. Output is
mathematically circular → loops perfectly with zero seam.

Output spec (Alexa AudioPlayer):
- MP3, 48 kbps+, 44.1 kHz, stereo
- Default: 10 minutes, 128 kbps

Usage:
    python3 generate_noise.py [--minutes 10] [--depth 2.0] [--out brown_noise.mp3]
    # depth: spectral slope. 1.0=pink, 2.0=brown, 2.5=deeper/darker
"""
import argparse
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SAMPLE_RATE = 44100


def generate_brown_noise(
    duration_sec: float,
    sample_rate: int = SAMPLE_RATE,
    depth: float = 2.0,
) -> np.ndarray:
    """Return stereo float32 in [-1, 1], circular (loops seamlessly)."""
    n = int(duration_sec * sample_rate)
    # Force even length so rfft/irfft round-trip cleanly
    if n % 2:
        n += 1
    rng = np.random.default_rng(seed=42)

    # Frequency bins for rfft
    freqs = np.fft.rfftfreq(n, d=1.0 / sample_rate)
    # Avoid div-by-zero at DC
    freqs_safe = freqs.copy()
    freqs_safe[0] = 1.0
    # 1/f^depth amplitude envelope
    envelope = 1.0 / (freqs_safe ** depth)
    # High-pass at 30 Hz — kills inaudible subsonic that would dominate peak
    hp_cutoff = 30.0
    hp = (freqs / hp_cutoff) ** 2 / (1.0 + (freqs / hp_cutoff) ** 2)
    envelope *= hp
    # Low-pass at 2 kHz — removes harsh hiss
    lp_cutoff = 2000.0
    lp = 1.0 / (1.0 + (freqs / lp_cutoff) ** 2)
    envelope *= lp
    envelope[0] = 0.0  # kill DC

    def one_channel() -> np.ndarray:
        # White noise in freq domain = random phase + unit magnitude
        # Generating in time-domain and FFT-ing gives equivalent result,
        # but direct freq-domain construction is faster and cleaner.
        phases = rng.uniform(0, 2 * np.pi, size=freqs.shape)
        spectrum = envelope * np.exp(1j * phases)
        spectrum[0] = 0.0  # DC = 0
        # Real-valued nyquist bin
        spectrum[-1] = np.abs(spectrum[-1])
        signal = np.fft.irfft(spectrum, n=n).astype(np.float32)
        return signal

    left = one_channel()
    right = one_channel()

    # Peak-normalize to 0.98
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    if peak > 0:
        scale = np.float32(0.98 / peak)
        left *= scale
        right *= scale

    return np.stack([left, right], axis=1)


def write_wav(path: Path, samples: np.ndarray, sample_rate: int = SAMPLE_RATE) -> None:
    pcm = np.clip(samples * 32767, -32768, 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(pcm.shape[1])
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        w.writeframes(pcm.tobytes())


def wav_to_mp3(wav_path: Path, mp3_path: Path, bitrate_kbps: int = 128) -> None:
    # -ar 44100 -ac 2 enforces Alexa-friendly output regardless of source
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(wav_path),
            "-ar", "44100", "-ac", "2",
            "-codec:a", "libmp3lame",
            "-b:a", f"{bitrate_kbps}k",
            str(mp3_path),
        ],
        check=True,
    )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--minutes", type=float, default=10.0)
    ap.add_argument("--depth", type=float, default=2.0, help="1=pink, 2=brown, 2.5=deeper")
    ap.add_argument("--out", type=Path, default=Path(__file__).parent / "brown_noise.mp3")
    args = ap.parse_args()

    duration = args.minutes * 60
    print(f"Generating {args.minutes} min brown noise (depth={args.depth})...", file=sys.stderr)
    samples = generate_brown_noise(duration, depth=args.depth)

    wav_tmp = args.out.with_suffix(".wav")
    print(f"Writing WAV: {wav_tmp}", file=sys.stderr)
    write_wav(wav_tmp, samples)

    print(f"Encoding MP3: {args.out}", file=sys.stderr)
    wav_to_mp3(wav_tmp, args.out)
    wav_tmp.unlink()

    size_mb = args.out.stat().st_size / 1e6
    print(f"Done. {args.out} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
