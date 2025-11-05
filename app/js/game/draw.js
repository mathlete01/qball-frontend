// Main game loop draw function
import { canvas, strokeThickness } from '../init/constants.js';
import { state } from '../game/state.js';
import { drawKeysUp, drawKeysDown } from '../rendering/keys.js';
import { drawBall } from '../rendering/ball.js';
import { collisionDetection } from './collision.js';
import { drawScore, drawLives } from '../ui/leaderboard.js';
import { fail } from './gameControl.js';

export function draw() {
  state.ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.ctx.lineWidth = strokeThickness;
  state.ctx.strokeStyle = state.colorKeyUpStroke;
  state.ctx.strokeRect(0, 0, canvas.width, canvas.height);
  drawKeysUp(state.KEY_ARRAY);
  drawKeysDown(state.KEY_ARRAY);
  drawScore();
  drawLives();
  collisionDetection(state.KEY_ARRAY);
  drawBall();

  if (state.lives < 1) {
    fail();
  }

  if (state.x + state.dx > canvas.width - state.ballRadius || state.x + state.dx < state.ballRadius) {
    fail();
  }

  if (state.y + state.dy > canvas.height - state.ballRadius || state.y + state.dy < state.ballRadius) {
    fail();
  }

  state.x += state.dx;
  state.y += state.dy;
}

