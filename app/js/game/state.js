// Central game state management
// This module exports a state object that can be imported and modified by other modules

import { canvas, colorLight, colorWhite } from '../init/constants.js';
import { isLocalHost } from '../utils/device.js';

// Mutable state object - all game state lives here
export const state = {
  // Environment flag
  testing: false,
  
  // Game state variables
  colorKeyUpStroke: undefined,
  colorKeyUpFill: undefined,
  colorKeyFontUp: undefined,
  speed: undefined,
  lives: undefined,
  scoreNote1: undefined,
  scoreNote2: undefined,
  ctx: undefined,
  ballRadius: undefined,
  dx: undefined,
  dy: undefined,
  interval: undefined,
  score: undefined,
  directionV: undefined,
  directionH: undefined,
  gameOn: undefined,
  isMobile: false,

  // API URLs
  BASE_URL: "https://qball-backend-std9.onrender.com",
  PLAYERS_URL: undefined,
  GAMES_URL: undefined,

  // Game entity IDs
  CURRENT_PLAYER: undefined,
  CURRENT_GAME: undefined,

  // Canvas dimensions
  w: undefined,
  h: undefined,
  typeFont: undefined,
  x: undefined,
  y: undefined,
  keyWidth: undefined,
  keyHeight: undefined,

  // Key array for rendering
  KEY_ARRAY: []
};

// Initialize/reset game state
export function resetGlobalVars() {
  const host = window.location.hostname;

  // ----------------------FOR TESTING-------------------------------------
  // robust localhost detection
  state.testing = isLocalHost(host);
  // ----------------------------------------------------------------------

  // Only force HTTPS outside local dev
  if (!state.testing && window.location.protocol === "http:") {
    window.location.href = "https://" + host;
  }

  if (state.testing) {
    console.log(`* * * TESTING = TRUE * * *`);
    state.speed = 1;
    state.lives = 1;
    state.BASE_URL = "http://localhost:3000"; // <-- explicit
  } else {
    state.speed = 0.3;
    state.lives = 3;
    state.BASE_URL = "https://qball-backend-std9.onrender.com"; // <-- explicit
  }
  state.PLAYERS_URL = `${state.BASE_URL}/players`;
  state.GAMES_URL = `${state.BASE_URL}/games`;
  console.log("BASE_URL =", state.BASE_URL);

  state.colorKeyUpStroke = colorLight;
  state.colorKeyUpFill = colorWhite;
  state.colorKeyFontUp = colorLight;
  state.scoreNote1 = 493.883;
  state.scoreNote2 = 659.255;
  state.ctx = canvas.getContext("2d");
  state.ballRadius = 10;
  state.dx = state.speed;
  state.dy = -1 * state.dx;
  state.interval = "";
  state.score = 0;
  state.directionV = "north";
  state.directionH = "east";
  state.gameOn = false;
}

