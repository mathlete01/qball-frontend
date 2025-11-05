// Collision detection
import { state } from '../game/state.js';
import { drawSingleKeyGray, releaseAllKeys } from '../rendering/keys.js';
import { scorePoint, toggleDirectionV, toggleDirectionH } from './gameControl.js';

export function collisionDetection(KEY_ARRAY) {
  for (let i = 0; i < KEY_ARRAY.length; i++) {
    let thisKey = KEY_ARRAY[i];
    let leftSide = Math.round(thisKey.x);
    let rightSide = Math.round(thisKey.x + thisKey.w);
    let topSide = Math.round(thisKey.y);
    let bottomSide = Math.round(thisKey.y + thisKey.h);
    let ballDiameter = state.ballRadius;
    
    if (thisKey.s == 1) {
      // if ball is overlapping middle of a key, that key can't be depressed
      if (
        state.y > topSide + ballDiameter &&
        state.y < bottomSide - ballDiameter &&
        state.x > leftSide + ballDiameter &&
        state.x < rightSide - ballDiameter
      ) {
        thisKey.s = 0;
        drawSingleKeyGray(
          thisKey.name,
          thisKey.code,
          thisKey.x,
          thisKey.y,
          thisKey.w,
          thisKey.h
        );
      }
      // If ball is within the vertical bounds of the key
      if (state.y > topSide - ballDiameter && state.y < bottomSide + ballDiameter) {
        // if ball is traveling EAST and overlaps LEFT side
        if (
          state.x > leftSide - ballDiameter &&
          state.x < leftSide + ballDiameter &&
          state.directionH === "east"
        ) {
          state.dx = -state.dx;
          toggleDirectionH();
          scorePoint();
        }
        // if ball is traveling WEST and overlaps RIGHT side
        if (
          state.x > rightSide - ballDiameter &&
          state.x < rightSide + ballDiameter &&
          state.directionH === "west"
        ) {
          state.dx = -state.dx;
          toggleDirectionH();
          scorePoint();
        }
      }
      // If ball is within the horizontal bounds of the key
      if (state.x > leftSide - ballDiameter && state.x < rightSide + ballDiameter) {
        // if ball is traveling SOUTH and overlaps TOP side
        if (
          state.y > topSide - ballDiameter &&
          state.y < topSide + ballDiameter &&
          state.directionV === "south"
        ) {
          state.dy = -state.dy;
          toggleDirectionV();
          scorePoint();
        }
        // if ball is traveling NORTH and overlaps BOTTOM side
        if (
          state.y > bottomSide - ballDiameter &&
          state.y < bottomSide + ballDiameter &&
          state.directionV === "north"
        ) {
          state.dy = -state.dy;
          toggleDirectionV();
          scorePoint();
        }
      }
    }
  }
}

// toggleDirectionV and toggleDirectionH are imported from gameControl

