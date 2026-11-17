// Browser Web Speech API helpers — STT (speech recognition) + TTS (speech synthesis)

type SR = any;

export function getSpeechRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function isVoiceSupported(): boolean {
  if (typeof window === "undefined") return false;
  const hasSR = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const hasTTS = "speechSynthesis" in window;
  return hasSR && hasTTS;
}

let cachedVoice: SpeechSynthesisVoice | null = null;
function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a natural English voice
  const preferred = voices.find(v => /en[-_]?(US|GB|IN)/i.test(v.lang) && /natural|google|samantha|aria|jenny/i.test(v.name))
    || voices.find(v => /en[-_]?(US|GB|IN)/i.test(v.lang))
    || voices[0];
  cachedVoice = preferred;
  return preferred;
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = 1; u.pitch = 1; u.volume = 1;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  // Some browsers load voices async — try once more after a tick if missing
  if (!v) setTimeout(() => { const v2 = pickVoice(); if (v2) u.voice = v2; window.speechSynthesis.speak(u); }, 200);
  else window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
