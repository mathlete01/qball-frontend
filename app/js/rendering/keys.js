// Key rendering functions
import { state } from '../game/state.js';
import {
  colorKeyDownStroke,
  colorKeyDownFill,
  colorKeyFontDown,
  colorKeyGrayFill,
  strokeThickness,
} from '../init/constants.js';

export function initKeys(keys) {
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i].name;
    let c = keys[i].code;
    let w = Math.round(keys[i].segments * state.keyWidth);
    let h = state.keyHeight;
    let x = keys[i].position * state.keyWidth;
    let y = keys[i].row * state.keyHeight;
    let s = keys[i].status;
    state.KEY_ARRAY.push({ name: k, code: c, x: x, y: y, w: w, h: h, s: s });
  }
}

export function initAllKeys(row0, row1, row2, row3, row4) {
  if (state.testing) {
    console.log("initAllKeys()");
  }
  state.KEY_ARRAY = [];
  initKeys(row0);
  initKeys(row1);
  initKeys(row2);
  initKeys(row3);
  initKeys(row4);
}

export function drawKeysUp(array) {
  for (let i = 0; i < array.length; i++) {
    let key = array[i];
    drawSingleKeyUp(key.name, key.code, key.x, key.y, key.w, key.h);
  }
}

export function drawKeysDown(array) {
  for (let i = 0; i < array.length; i++) {
    let key = array[i];
    if (key.s == 1) {
      drawSingleKeyDown(key.name, key.code, key.x, key.y, key.w, key.h);
    }
  }
}

export function drawSingleKeyUp(name, code, keyX, keyY, keyWidth, keyHeight) {
  state.ctx.beginPath();
  state.ctx.rect(keyX, keyY, keyWidth, keyHeight);
  state.ctx.strokeStyle = state.colorKeyUpStroke;
  state.ctx.lineWidth = strokeThickness;
  state.ctx.stroke();
  state.ctx.closePath();
  state.ctx.fillStyle = state.colorKeyUpFill;
  state.ctx.fill();
  state.ctx.closePath();
  state.ctx.id = code;
  state.ctx.font = state.typeFont;
  state.ctx.fillStyle = state.colorKeyFontUp;
  let capName = name.toUpperCase();
  state.ctx.textAlign = "center";
  state.ctx.fillText(capName, keyX + keyWidth / 2, keyY + keyHeight / 2 + 4);
}

export function drawSingleKeyDown(name, code, keyX, keyY, keyWidth, keyHeight) {
  state.ctx.beginPath();
  state.ctx.rect(keyX, keyY, keyWidth, keyHeight);
  state.ctx.strokeStyle = colorKeyDownStroke;
  state.ctx.lineWidth = strokeThickness;
  state.ctx.stroke();
  state.ctx.closePath();
  state.ctx.fillStyle = colorKeyDownFill;
  state.ctx.fill();
  state.ctx.closePath();
  state.ctx.id = code;
  state.ctx.font = state.typeFont;
  state.ctx.fillStyle = colorKeyFontDown;
  let capName = name.toUpperCase();
  state.ctx.textAlign = "center";
  state.ctx.fillText(capName, keyX + keyWidth / 2, keyY + keyHeight / 2 + 4);
}

export function drawSingleKeyGray(name, code, keyX, keyY, keyWidth, keyHeight) {
  state.ctx.beginPath();
  state.ctx.rect(keyX, keyY, keyWidth, keyHeight);
  state.ctx.strokeStyle = colorKeyDownStroke;
  state.ctx.lineWidth = strokeThickness;
  state.ctx.stroke();
  state.ctx.closePath();
  state.ctx.fillStyle = colorKeyGrayFill;
  state.ctx.fill();
  state.ctx.closePath();
  state.ctx.id = code;
  state.ctx.font = state.typeFont;
  state.ctx.fillStyle = colorKeyFontDown;
  let capName = name.toUpperCase();
  state.ctx.textAlign = "center";
  state.ctx.fillText(capName, keyX + keyWidth / 2, keyY + keyHeight / 2 + 4);
}

export function releaseAllKeys(array) {
  for (let key of array) {
    key.s = 0;
  }
}

