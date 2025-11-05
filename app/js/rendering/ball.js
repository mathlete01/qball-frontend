// Ball rendering
import { state } from '../game/state.js';
import { colorBallFill, colorBallStroke } from '../init/constants.js';

export function drawBall() {
  state.ctx.beginPath();
  state.ctx.arc(state.x, state.y, state.ballRadius, 0, Math.PI * 2);
  state.ctx.fillStyle = colorBallFill;
  state.ctx.fill();
  state.ctx.closePath();
  state.ctx.strokeStyle = colorBallStroke;
  state.ctx.stroke();
  state.ctx.closePath();
}

