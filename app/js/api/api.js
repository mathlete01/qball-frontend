// Backend API calls
import { state } from '../game/state.js';
import { leaderboard } from '../init/constants.js';
import { startGame, reloadGame, saveOrNot } from '../game/gameControl.js';
import { renderLeaderboard } from '../ui/leaderboard.js';

export function createPlayer() {
  const playerData = { name: "Anonymous" };

  fetch(state.PLAYERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ player: playerData }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`POST /players failed: ${res.status}`);
      return res.json();
    })
    .then((player) => {
      if (!player?.id) throw new Error("Player response missing id");
      state.CURRENT_PLAYER = player.id;
      return createGame(state.CURRENT_PLAYER);
    })
    .catch((e) => console.log(`createPlayer: ${e}`));
}

export function createGame(playerId) {
  const payload = { game: { player_id: playerId } };
  if (state.testing) console.log("createGame payload", payload);

  leaderboard.innerHTML = "";

  return fetch(state.GAMES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`POST /games failed: ${res.status}`);
      return res.json();
    })
    .then((game) => {
      if (!game?.id) throw new Error("Game response missing id");
      state.CURRENT_GAME = game.id;
      startGame();
    })
    .catch((e) => console.log(`createGame Failed: ${e}`));
}

export function getLeaderboard() {
  if (state.testing) {
    console.log("getLeaderboard()");
    console.log("GAMES_URL:", state.GAMES_URL);
  }
  if (!state.GAMES_URL) {
    console.error("GAMES_URL is not set. Make sure resetGlobalVars() has been called.");
    return;
  }
  fetch(state.GAMES_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`GET ${state.GAMES_URL} failed: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((json) => {
      const objs = json;
      renderLeaderboard(objs);
    })
    .catch((err) => {
      console.error("getLeaderboard failed:", err);
      if (state.testing) {
        console.log("GAMES_URL was:", state.GAMES_URL);
        console.log("BASE_URL was:", state.BASE_URL);
      }
    });
}

export function preSaveOrNot() {
  if (state.testing) console.log("preSaveOrNot()");

  if (!state.CURRENT_GAME) {
    console.error("No CURRENT_GAME; cannot save score. Check POST /games.");
    return saveOrNot();
  }

  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ game: { score: state.score } }),
  };

  fetch(`${state.GAMES_URL}/${state.CURRENT_GAME}`, configObj)
    .then((res) => {
      if (!res.ok)
        throw new Error(`PATCH /games/${state.CURRENT_GAME} failed: ${res.status}`);
      return res.json();
    })
    .then(() => saveOrNot())
    .catch((err) => console.log(`endGame PATCH: ${err}`));
}

export function savePlayer(name) {
  if (state.testing) console.log(`savePlayer:name = ${name}`);

  const clean = (name || "").trim();
  if (!clean) {
    console.log("Empty name; skipping save.");
    return reloadGame();
  }

  const configOb = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ player: { name: clean } }),
  };

  fetch(`${state.PLAYERS_URL}/${state.CURRENT_PLAYER}`, configOb)
    .then((res) => {
      if (!res.ok)
        throw new Error(
          `PATCH /players/${state.CURRENT_PLAYER} failed: ${res.status}`
        );
      return res.json();
    })
    .then(() => reloadGame())
    .catch((err) => console.log(`savePlayer: ${err}`));
}

