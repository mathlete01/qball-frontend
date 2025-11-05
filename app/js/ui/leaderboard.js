// Leaderboard and score display
import { leaderboard, livesText, scoreText } from '../init/constants.js';
import { state } from '../game/state.js';
import { soundNext } from '../audio/sounds.js';
import { createPlayer } from '../api/api.js';
import { getAudioContext, unlockAudio } from '../audio/audioContext.js';

export function drawScore() {
  scoreText.innerText = "Score: " + state.score;
}

export function drawLives() {
  livesText.innerText = "Lives: " + state.lives;
}

export function getMax(arr, max) {
  if (arr.length < max) {
    return arr.length;
  } else {
    return max;
  }
}

export function renderLeaderboard(arr) {
  if (state.testing) {
    console.log("renderLeaderboard()");
  }
  // Don't play sound here - wait for user interaction (Safari requirement)
  // soundNext();
  let filteredArr = arr.filter((element) => element.player.name !== null);
  let h1 = document.createElement("h1");
  h1.className = "title";
  h1.innerText = "Top Scores";
  filteredArr.sort((a, b) => (a.score < b.score ? 1 : -1));
  let ol = document.createElement("ol");
  for (let i = 0; i < getMax(filteredArr, 10); i++) {
    let li = document.createElement("li");
    li.className = "list-item";
    let element = filteredArr[i];
    if (filteredArr.length > 0) {
      let s = element["score"];
      let p = element["player"]["name"];
      li.innerText = `${s} points......${p}`;
    }
    ol.append(li);
  }

  const btnPlay = document.createElement("a");
  btnPlay.setAttribute("id", "btn-play");
  btnPlay.setAttribute("class", "playBtn");
  btnPlay.innerHTML = "PLAY";
  btnPlay.addEventListener("click", () => {
    // Safari requires audio unlock AND first sound to happen synchronously during user gesture
    // All of this must happen in the same synchronous call stack:
    // 1. Create AudioContext (unlockAudio)
    // 2. Call resume() (unlockAudio)
    // 3. Create audio nodes and start them (soundNext -> playNoteSync)
    unlockAudio();
    soundNext(); // This will use playNoteSync for first sound (synchronous)
    
    // Create player (can be async)
    createPlayer();
  });

  const centerWrapper = document.createElement("div");
  centerWrapper.setAttribute("class", "centerWrapper");
  centerWrapper.append(btnPlay);

  leaderboard.append(h1);
  leaderboard.append(ol);
  leaderboard.append(centerWrapper);
  drawScore();
  drawLives();
}

