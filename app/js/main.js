// Main entry point
import { detectMobile } from './utils/device.js';
import { resetGlobalVars } from './game/state.js';
import { initializeNavigation } from './ui/navigation.js';
import { initializeWindowListener, initializeCanvas } from './rendering/canvas.js';
import { initAllKeys, drawKeysUp, drawKeysDown } from './rendering/keys.js';
import { row0, row1, row2, row3, row4 } from './init/keyboard.js';
import { getLeaderboard } from './api/api.js';
import { state } from './game/state.js';

// Initialize game state
resetGlobalVars();

// Initialize window listener
initializeWindowListener();

// Initialize canvas and render gameboard
function renderGameboard() {
  if (state.testing) {
    console.log(`renderGameboard()`);
  }
  initAllKeys(row0, row1, row2, row3, row4);
  drawKeysUp(state.KEY_ARRAY);
  drawKeysDown(state.KEY_ARRAY);
  getLeaderboard();
}

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", (event) => {
  // Device detection
  if (detectMobile()) {
    state.isMobile = true;
    document.getElementById("mobile-user").style.display = "block";
  }

  // Initialize navigation
  initializeNavigation();

  // Initialize canvas and render
  initializeCanvas();
  renderGameboard();
});

