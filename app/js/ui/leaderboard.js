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
    // Explicitly unlock audio on PLAY button click (user gesture)
    // Call unlockAudio synchronously - Safari requires this to happen during the gesture
    const unlockPromise = unlockAudio();
    
    // Play the "next" sound and create player after unlock completes
    unlockPromise.then(() => {
      soundNext(); // Play sound now that audio is unlocked
      return getAudioContext();
    }).then(() => {
      createPlayer();
    }).catch(err => {
      if (state.testing) console.log("Audio unlock error:", err);
      createPlayer(); // Still try to create player even if audio fails
    });
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

