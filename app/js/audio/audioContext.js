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

// one-time unlock on first gesture (covers click, keydown, touch)
// Safari requires audio context creation AND resume to happen synchronously in user gesture
// This function must be called synchronously during the user gesture (no async/await here)
export function unlockAudio() {
  if (audioUnlocked) return Promise.resolve();
  
  try {
    // Create context synchronously during user gesture (critical for Safari)
    if (!context) {
      context = new AudioContext();
    }
    
    // Resume the context synchronously (critical for Safari autoplay policy)
    // The resume() call must happen during the user gesture, even though it returns a promise
    // We call it synchronously but don't await it - Safari just needs the call to happen
    let resumePromise = null;
    if (context.state === "suspended") {
      // Call resume() synchronously - this is what Safari needs
      resumePromise = context.resume();
      resumePromise.then(() => {
        audioUnlocked = true;
        if (state.testing) console.log("Audio context unlocked and resumed");
      }).catch(err => {
        console.error("Audio unlock error:", err);
      });
    } else if (context.state === "running") {
      audioUnlocked = true;
      if (state.testing) console.log("Audio context already running");
      return Promise.resolve();
    }
    
    // Remove listeners after first unlock attempt
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
    
    // Return the resume promise if we started a resume, otherwise resolved promise
    return resumePromise || Promise.resolve();
  } catch (err) {
    console.error("Audio unlock exception:", err);
    return Promise.reject(err);
  }
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

