// Audio context management
import { state } from '../game/state.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context = null;

export function getAudioContext() {
  // Always ensure context exists
  if (!context) {
    context = new AudioContext();
  }
  // If context is running, return it immediately
  if (context.state === "running") {
    return Promise.resolve(context);
  }
  // If suspended, try to resume (but this may fail without user gesture)
  if (context.state === "suspended") {
    return context.resume().then(() => context).catch(() => context);
  }
  return Promise.resolve(context);
}

// Track if audio has been unlocked
let audioUnlocked = false;
let unlockPromise = null;

// one-time unlock on first gesture (covers click, keydown, touch)
// Safari requires audio context creation AND resume to happen synchronously in user gesture
export function unlockAudio() {
  // If already unlocked, return resolved promise
  if (audioUnlocked && context && context.state === "running") {
    return Promise.resolve();
  }
  
  // If unlock is in progress, return that promise
  if (unlockPromise) {
    return unlockPromise;
  }
  
  unlockPromise = (async () => {
    try {
      // Create context synchronously during user gesture (critical for Safari)
      if (!context) {
        context = new AudioContext();
      }
      
      // Resume the context synchronously (critical for Safari autoplay policy)
      // The resume() call must happen during the user gesture, even though it returns a promise
      if (context.state === "suspended") {
        // Call resume() synchronously - this is what Safari needs
        await context.resume();
        audioUnlocked = true;
        if (state.testing) console.log("Audio context unlocked and resumed");
      } else if (context.state === "running") {
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
    
    return;
  })();
  
  return unlockPromise;
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

