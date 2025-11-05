// Audio context management
import { state } from '../game/state.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context = null;

export function getAudioContext() {
  if (!context) {
    context = new AudioContext();
  }
  if (context.state === "suspended") {
    // resume returns a promise; we need to await it
    return context.resume().then(() => context);
  }
  return Promise.resolve(context);
}

// one-time unlock on first gesture (covers click, keydown, touch)
export function unlockAudio() {
  try {
    getAudioContext().then(() => {
      // Audio context is now unlocked and ready
    }).catch(err => {
      if (state.testing) console.log("Audio unlock error:", err);
    });
  } catch (_) {}
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

// Initialize audio unlock listeners
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

