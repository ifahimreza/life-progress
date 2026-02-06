let audioContext: AudioContext | null = null;
let isUnlocked = false;
let lastPlayTime = 0;
const SOUND_STORAGE_KEY = "dotspan-menu-sound";
const LEGACY_SOUND_KEY = "life-dots-menu-sound";

export type MenuSoundMode = "off" | "soft" | "bright";
let soundMode: MenuSoundMode = "soft";

function playTone(ctx: AudioContext, mode: MenuSoundMode) {
  const now = ctx.currentTime;
  if (now - lastPlayTime < 0.06) return;
  lastPlayTime = now;

  const gain = ctx.createGain();
  const gainPeak = mode === "soft" ? 0.05 : 0.085;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  const baseFreq = mode === "soft" ? 620 : 760;
  const peakFreq = mode === "soft" ? 860 : 1120;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

function loadSoundMode() {
  if (typeof window === "undefined") return soundMode;
  const stored =
    window.localStorage.getItem(SOUND_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_SOUND_KEY);
  if (stored === "off" || stored === "soft" || stored === "bright") {
    soundMode = stored;
  }
  return soundMode;
}

export function getMenuSoundMode() {
  return loadSoundMode();
}

export function setMenuSoundMode(mode: MenuSoundMode) {
  soundMode = mode;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SOUND_STORAGE_KEY, mode);
}

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioCtx = window.AudioContext || (window as typeof window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
  audioContext = AudioCtx ? new AudioCtx() : null;
  return audioContext;
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  isUnlocked = true;
}

export function playMenuSoundFromGesture() {
  if (typeof window === "undefined") return;
  const mode = loadSoundMode();
  const ctx = getAudioContext();
  if (!ctx) return;

  isUnlocked = true;
  if (mode === "off") return;

  const attemptPlay = () => {
    if (ctx.state !== "running") return;
    playTone(ctx, mode);
  };

  if (ctx.state === "suspended") {
    void ctx.resume().then(attemptPlay).catch(() => {});
    return;
  }

  attemptPlay();
}

export function playHoverSound() {
  if (typeof window === "undefined") return;
  const mode = loadSoundMode();
  if (mode === "off") return;
  const ctx = getAudioContext();
  if (!ctx || !isUnlocked) return;
  if (ctx.state !== "running") return;
  playTone(ctx, mode);
}
