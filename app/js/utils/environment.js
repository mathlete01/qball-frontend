// Environment configuration and utilities
import { isLocalHost } from './device.js';
import { state } from '../game/state.js';

// Re-export environment functions that use state
export function getTesting() {
  return state.testing;
}

export function getBaseUrl() {
  return state.BASE_URL;
}

export function getPlayersUrl() {
  return state.PLAYERS_URL;
}

export function getGamesUrl() {
  return state.GAMES_URL;
}

// This is a convenience re-export - the actual reset is in state.js
export { resetGlobalVars } from '../game/state.js';

