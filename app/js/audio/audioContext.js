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

// Track if audio has been unlocked
let audioUnlocked = false;

// one-time unlock on first gesture (covers click, keydown, touch)
export function unlockAudio() {
  if (audioUnlocked) return;
  
  try {
    // Create context if it doesn't exist
    if (!context) {
      context = new AudioContext();
    }
    
    // Resume the context (this unlocks it)
    if (context.state === "suspended") {
      context.resume().then(() => {
        audioUnlocked = true;
        if (state.testing) console.log("Audio context unlocked and resumed");
      }).catch(err => {
        console.error("Audio unlock error:", err);
      });
    } else {
      audioUnlocked = true;
      if (state.testing) console.log("Audio context already running");
    }
  } catch (err) {
    console.error("Audio unlock exception:", err);
  }
  
  // Remove listeners after first unlock attempt
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

// Initialize audio unlock listeners when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });
  });
} else {
  // DOM is already ready
  document.addEventListener("click", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });
  document.addEventListener("touchstart", unlockAudio, { once: true });
}

