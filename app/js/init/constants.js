// ----------------------Declare Global Constants--------------------------
export const colorLight = "#dfdfdf";
export const colorDark = "#808080";
export const colorWhite = "#ffffff";
export const colorBlack = "#000000";
export const canvas = document.getElementById("myCanvas");

// Canvas and rendering constants
export const scoreIncrement = 1000;
export const keySegments = 15;
export const factor = 5 / keySegments;
export const strokeThickness = 1;

// Key color constants
export const colorKeyDownStroke = colorBlack;
export const colorKeyDownFill = colorBlack;
export const colorKeyFontDown = colorWhite;
export const colorKeyGrayFill = colorDark;
export const colorBallFill = colorBlack;
export const colorBallStroke = colorBlack;

// DOM elements
export const leaderboard = document.getElementById("leaderboard");
export const livesText = document.getElementById("livesText");
export const scoreText = document.getElementById("scoreText");

// Prevent default keys
export const preventDefaultKeys = {
  Tab: true,
  Enter: true,
};

