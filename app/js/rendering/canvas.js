// Canvas initialization and resize handling
import { canvas, keySegments, factor } from '../init/constants.js';
import { state } from '../game/state.js';
import { initAllKeys, drawKeysUp, drawKeysDown } from './keys.js';
import { row0, row1, row2, row3, row4 } from '../init/keyboard.js';

export function initializeCanvas() {
  if (state.testing) {
    console.log(`initializeCanvas()`);
  }
  state.w = window.innerWidth;
  state.h = window.innerHeight;
  state.typeFont = window.innerWidth / 100 + "px Courier New";
  canvas.width = state.w;
  canvas.height = factor * state.w;
  state.x = canvas.width / 2;
  state.y = canvas.height / 2;
  state.keyWidth = state.w / keySegments;
  state.keyHeight = state.keyWidth;
}

export function resizeCanvas() {
  state.w = window.innerWidth;
  state.h = window.innerHeight;
  state.typeFont = window.innerWidth / 100 + "px Courier New";
  canvas.width = state.w;
  canvas.height = factor * state.w;
  state.x = canvas.width / 2;
  state.y = canvas.height / 2;
  state.keyWidth = state.w / keySegments;
  state.keyHeight = state.keyWidth;
  initAllKeys(row0, row1, row2, row3, row4);
  drawKeysUp(state.KEY_ARRAY);
  drawKeysDown(state.KEY_ARRAY);
}

export function initializeWindowListener() {
  if (state.testing) {
    console.log(`initializeWindowListener()`);
  }
  window.addEventListener("resize", resizeCanvas, false);
}

