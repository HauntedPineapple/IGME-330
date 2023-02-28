import { getMouse, getRandomUnitVector } from './utilities.js';
export default init;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 600;
const screenHeight = 400;

// fake enum
const GameState = Object.freeze({
	START: Symbol("START"),
	MAIN: Symbol("MAIN"),
	LEVELOVER: Symbol("LEVELOVER"),
	GAMEOVER: Symbol("GAMEOVER")
});

const MyErrors = Object.freeze({
	drawHUDswitch: "Invalid value in drawHUD switch",
	mousedownSwitch: "Invalid value in mousedown switch",
	loadLevelSwitch: "Invalid value in loadLevel switch"
});


let gameState = GameState.START;
let imageData;
let sprites = [];
let currentLevel = 1;


function init(argImageData) {
	imageData = argImageData;
	loadLevel(currentLevel);

	// Load Sounds


	// hook up events
	canvas.onmousedown = doMousedown;
	loop();
}

function loop(timestamp) {
	// schedule a call to loop() in 1/60th of a second
	requestAnimationFrame(loop);


	// draw background
	ctx.fillRect(0, 0, screenWidth, screenHeight)

	// draw game sprites


	// draw rest of UI, depending on current gameState
	drawHUD(ctx);

} // end loop()

function drawHUD(ctx) {
	ctx.save();

	switch (gameState) {
		case GameState.START:
			ctx.save();

			// Draw background


			// Draw Text


			break;

		case GameState.MAIN:
			// draw score
			// fillText(string, x, y, css, color)
			break;

		case GameState.LEVELOVER:
			// draw level results
			break;

		case GameState.GAMEOVER:
			// draw game results
			break;

		default:
			throw new Error(MyErrors.drawHUDswitch);

	}

	ctx.restore();

}

function loadLevel(levelNum) {

}


function doMousedown(e) {
	console.log(e);
	let mouse = getMouse(e);
	console.log(`canvas coordinates: x=${mouse.x} y=${mouse.y}`);
}


