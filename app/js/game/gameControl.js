// Game control functions
import { state } from '../game/state.js';
import { colorLight, colorBlack, colorWhite, canvas, preventDefaultKeys, leaderboard, scoreIncrement } from '../init/constants.js';
import { getAudioContext } from '../audio/audioContext.js';
import { soundScore, soundGameStart, soundGameOver, soundDie } from '../audio/sounds.js';
import { releaseAllKeys, initAllKeys, drawKeysUp, drawKeysDown } from '../rendering/keys.js';
import { row0, row1, row2, row3, row4 } from '../init/keyboard.js';
import { draw } from './draw.js';
import { showSaveModal } from '../ui/modals.js';
import { resetGlobalVars } from '../game/state.js';
import { preSaveOrNot, getLeaderboard } from '../api/api.js';
import { initializeCanvas } from '../rendering/canvas.js';

export function toggleColor() {
  if (state.gameOn === true) {
    state.colorKeyUpStroke = colorBlack;
    state.colorKeyUpFill = colorWhite;
    state.colorKeyFontUp = colorBlack;
  } else if (state.gameOn === false) {
    state.colorKeyUpStroke = colorLight;
    state.colorKeyUpFill = colorWhite;
    state.colorKeyFontUp = colorLight;
  }
}

export function toggleDirectionV() {
  switch (state.directionV) {
    case "north":
      state.directionV = "south";
      break;
    case "south":
      state.directionV = "north";
      break;
    default:
      return null;
  }
}

export function toggleDirectionH() {
  switch (state.directionH) {
    case "east":
      state.directionH = "west";
      break;
    case "west":
      state.directionH = "east";
      break;
    default:
      return null;
  }
}

export function scorePoint() {
  releaseAllKeys(state.KEY_ARRAY);
  soundScore();
  state.score = state.score + scoreIncrement;
  state.scoreNote1 = state.scoreNote1 + 10;
  state.scoreNote2 = state.scoreNote2 + 10;
  state.dx = state.dx * 1.3;
}

export function initNextPlay() {
  if (state.testing) {
    console.log("initNextPlay()");
  }
  state.scoreNote1 = 493.883;
  state.scoreNote2 = 659.255;
  state.x = canvas.width / 2;
  state.y = canvas.height / 2;
  let ranNumX = Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1);
  let ranNumY = Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1);
  
  switch (ranNumX) {
    case 1:
      state.directionH = "east";
      break;
    case -1:
      state.directionH = "west";
      break;
    default:
      return null;
  }
  switch (ranNumY) {
    case 1:
      state.directionV = "south";
      break;
    case -1:
      state.directionV = "north";
      break;
    default:
      return null;
  }
  state.dx = state.speed * ranNumX;
  state.dy = state.speed * ranNumY;
}

export function fail() {
  if (state.testing) {
    console.log("fail()");
  }
  state.lives--;
  soundDie();
  if (!state.lives) {
    endGame();
  } else {
    initNextPlay();
  }
}

export function endGame() {
  if (state.testing) {
    console.log("endGame()");
  }
  state.gameOn = false;
  toggleColor();
  soundGameOver();
  clearInterval(state.interval);
  state.interval = "";
  preSaveOrNot();
}

export function startGame() {
  if (state.testing) {
    console.log(`startGame()`);
  }
  state.gameOn = true;
  toggleColor();
  // Ensure audio context is resumed before playing sounds
  getAudioContext().then(() => {
    soundGameStart();
  }).catch(err => {
    if (state.testing) console.log("Audio context resume error:", err);
  });
  activateKeyListeners();
  initAllKeys(row0, row1, row2, row3, row4);
  state.interval = setInterval(draw, 10);
}

export function activateKeyListeners() {
  if (state.testing) {
    console.log("activateKeyListeners()");
  }
  document.body.addEventListener("keydown", (ev) => captureKeyDown(ev));
  document.body.addEventListener("keyup", (ev) => captureKeyUp(ev));
}

export function captureKeyDown(ev) {
  let keyPressed = ev.code;

  if (preventDefaultKeys[keyPressed]) {
    ev.preventDefault();
  }

  let keyObj = state.KEY_ARRAY.find(({ code }) => code === keyPressed);
  if (keyObj) keyObj.s = 1;

  return false;
}

export function captureKeyUp(ev) {
  let keyReleased = ev.code;
  let keyObj = state.KEY_ARRAY.find(({ code }) => code === keyReleased);
  if (keyObj) keyObj.s = 0;
  return false;
}

export function reloadGame() {
  if (state.testing) {
    console.log(`reloadGame()`);
  }
  resetGlobalVars();
  initializeCanvas();
  leaderboard.innerHTML = "";
  // Re-render gameboard
  initAllKeys(row0, row1, row2, row3, row4);
  drawKeysUp(state.KEY_ARRAY);
  drawKeysDown(state.KEY_ARRAY);
  getLeaderboard();
}

export function skip() {
  if (state.testing) {
    console.log(`skip()`);
  }
  reloadGame();
}

export function saveOrNot() {
  if (state.testing) {
    console.log(`saveOrNot()`);
  }
  if (state.score > 0) {
    showSaveModal();
  } else {
    skip();
  }
}

