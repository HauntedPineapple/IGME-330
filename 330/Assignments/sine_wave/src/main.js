"use strict";
// #region Global Variables
const canvasWidth = 500, canvasHeight = 480;
let ctx, canvas, playButton, pauseButton;
let x = 0, y = 0, theta = 0;
let delta = 0.3; // radians
let yMultiplier = 100;
let isPaused = true;
let waveType = 1; // 1 = Sine, 2 = Cosine, 3 = Tangent
let fps = 12;
let waveColor = "black";
let dotRadius = 3;
// #endregion

window.onload = init;

function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "#e3e5e8";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    setupUI();

    loop();
}

function setupUI() {
    playButton = document.querySelector("#play-button");
    pauseButton = document.querySelector("#pause-button");
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

    document.querySelector("#color-dropdown").onchange = (e) => { waveColor = e.target.value };
    document.querySelector("#fps-dropdown").onchange = (e) => { fps = e.target.value; };

    //const waveSelectors = document.querySelectorAll('input[name="wave_type"]');
    document.querySelector("#sin").checked = true; // default value    
    document.querySelector("#sin").onchange = () => { waveType = 1; };
    document.querySelector("#cos").onchange = () => { waveType = 2; };
    document.querySelector("#tan").onchange = () => { waveType = 3; };

    waveColor = document.querySelector("#color-dropdown").value;
    fps = document.querySelector("#fps-dropdown").value;
}

function loop() {
    if (isPaused) return;

    setTimeout(loop, 1000 / fps); // 1000ms/# = #fps
    ctx.save();
    ctx.globalAlpha = 1 / fps*2;
    ctx.fillStyle = "#e3e5e8";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    x += 10;
    theta += delta; // radians

    switch (waveType) {
        default:
        case 1: // Sine
            y = canvasHeight / 2 + (Math.sin(theta) * 100);
            break;
        case 2: // Cosine
            y = canvasHeight / 2 + (Math.cos(theta) * 100);
            break;
        case 3: // Tangent
            y = canvasHeight / 2 + (Math.tan(theta) * 100);
            break;
    }

    drawCircle(ctx, x, y, dotRadius, waveColor);

    if (x >= canvasWidth) {
        x = 0;
    }

    // let isNormalized = true;
    // theta = 0;
    // delta = Math.PI * 2 / 100;
    // for (let i = 0; i < 1; i += 0.01) {
    //     x = i;
    //     if (isNormalized) { y = Math.sin(theta) / 2 + 0.5; }
    //     else { y = Math.sin(theta); }
    //    console.log(`(${x}, ${y})`);

    //     drawCircle(ctx, x * canvasWidth, canvasHeight / 2 + (y * yMultiplier), 2, "white");
    //     theta += delta;
    // }
}

// Helper functions
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