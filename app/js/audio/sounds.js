// Sound effects
import { getAudioContext } from './audioContext.js';
import { state } from '../game/state.js';

const vol = 0.05;

function playNote(frequency, offsetSec, durationSec, waveType = "square") {
  getAudioContext().then(ctx => {
    if (!ctx) return;
    
    // If suspended, try to resume (this may fail if no user gesture)
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        // Retry playing the note after resuming
        playNote(frequency, offsetSec, durationSec, waveType);
      }).catch(() => {
        // Failed to resume - audio requires user interaction
        if (state.testing) console.log("Audio context suspended and resume failed");
      });
      return;
    }

    const startAt = ctx.currentTime + (offsetSec || 0);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const volume = ctx.createGain();

    osc1.type = waveType;
    osc2.type = waveType;
    volume.gain.value = vol;

    osc1.connect(volume);
    osc2.connect(volume);
    volume.connect(ctx.destination);

    // slight detune for chorus
    osc1.frequency.value = frequency + 1;
    osc2.frequency.value = frequency - 2;

    // envelope
    volume.gain.setValueAtTime(vol, startAt);
    const endAt = startAt + durationSec;
    volume.gain.setValueAtTime(vol, endAt - 0.05);
    volume.gain.linearRampToValueAtTime(0, endAt);

    osc1.start(startAt);
    osc2.start(startAt);
    osc1.stop(endAt);
    osc2.stop(endAt);
  }).catch(err => {
    if (state.testing) console.log("playNote error:", err);
  });
}

export function soundScore() {
  playNote(state.scoreNote1, 0, 0.116, "square");
  playNote(state.scoreNote2, 0.116, 0.232, "square");
}

export function soundGameStart() {
  playNote(391.995, 0, 0.116, "square"); // G4
  playNote(391.995, 0.116, 0.116, "square"); // G4
  playNote(523.251, 0.232, 0.232, "square"); // C5
}

export function soundGameOver() {
  if (state.testing) {
    console.log(`soundGameOver()`);
  }
  playNote(207.652, 0, 0.116, "square"); // G#3
  playNote(174.614, 0.116, 0.116, "square"); // F3
  playNote(146.832, 0.232, 0.232, "square"); // D3
}

export function soundNext() {
  playNote(174.614, 0, 0.116, "square"); // F3
  playNote(195.998, 0.116, 0.116, "square"); // G3
  playNote(220.0, 0.232, 0.232, "square"); // A3
}

export function soundDie() {
  playNote(82.407, 0, 0.116, "square"); // E2
  playNote(77.782, 0.116, 0.116, "square"); // D#2
  playNote(69.296, 0.232, 0.232, "square"); // C#2
}

