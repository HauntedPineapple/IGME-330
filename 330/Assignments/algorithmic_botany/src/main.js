"use strict";
// #region Global Variables
const canvasWidth = 1000, canvasHeight = 600;
let ctx, canvas;
let playButton, pauseButton, resetButton;
let n = 0;
let fps = 120;
let c = 4;
let divergence = 137.3;
let dotRadius = 2;
let isPaused = false;
// #endregion

/*
'P' repesents angle "phi"
'n' represents the number of dots in our pattern
'c' represents the space between the dots
'r' is the radius from the center of the pattern
P = n * 137.5(degrees)
r = c * sqrt(n)
Polar to Cartesian transformation:
cos(P) = x/r
x = r * cos(P)
r = x * sin(P)
*/

window.onload = init;

function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    setupUI();
    loop();
}

function setupUI() {
    playButton = document.querySelector("#play-button");
    pauseButton = document.querySelector("#pause-button");
    resetButton = document.querySelector("#reset-button");

    playButton.onclick = function () {
        if (isPaused) {
            pauseButton.classList.remove("disabled");
            playButton.classList.add("disabled");
            isPaused = false;
            loop();
        }
    };

    pauseButton.onclick = function () {
        isPaused = true;
        pauseButton.classList.add("disabled");
        playButton.classList.remove("disabled");
    };

    resetButton.onclick = clearScreen;
}

function loop() {
    if (isPaused) return;
    setTimeout(loop, 1000 / fps);

    // calculate the 'a' angle and 'r' radius
    let a = n * toRadians(divergence);
    let r = c * Math.sqrt(n);
    // calculate the cartesian coordinates
    let x = r * Math.cos(a) + canvasWidth / 2;
    let y = r * Math.sin(a) + canvasHeight / 2;

    let color = `hsl(${n / 5 % 361},100%,50%)`;

    drawCircle(ctx, x, y, dotRadius, color);
    n++;
    c += 0.001;
    // divergence += 0.001;
    // if (divergence >= 360) divergence = 137;
    if (divergence <= 360) divergence += 0.001;
    else if (divergence >= 137) divergence -= 0.001;
    
    if(r > canvasWidth) isPaused = true;
}

function oldLoop() {
    if (isPaused) return;

    let fps = 30;
    let c = 4;
    let divergence = 137.5;
    let dotRadius = 2;

    setTimeout(loop, 1000 / fps);

    // calculate the 'a' angle and 'r' radius
    let a = n * toRadians(divergence);
    let r = c * Math.sqrt(n);
    // calculate the cartesian coordinates
    let x = r * Math.cos(a) + canvasWidth / 2;
    let y = r * Math.sin(a) + canvasHeight / 2;

    let color = `hsl(${n / 5 % 361},100%,50%)`;

    drawCircle(ctx, x, y, dotRadius, color);
    n++;
}

// #region Helper functions
/** Converts the given number of degrees to radians
 * @param {Number} degrees The number of degrees to be converted
 * @returns The given value in radians */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/** Converts the given number of radians to degrees
 * @param {Number} radians The number of radians to be converted
 * @returns The given value in degrees */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function clearScreen() {
    n = 0;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
// #endregion