'use strict';

// #region Global Variables
let ctx, canvas;
let startButton, playButton, pauseButton, resetButton;
let fpsChooser, numChooser, fadeChooser;
let fadeRate = "low";
let canvasWidth = 640, canvasHeight = 480;
let fps = 120;
let isPaused = true;
let walkers = [];
// #endregion

window.onload = init;

function init() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    isPaused = true;
    walkers = [];

    setupUI();
}

function makeWalkers(numWalkers) {
    for (let i = 0; i < numWalkers; i++) {
        walkers.push(new Walker(canvasWidth / 2, canvasHeight / 2, getRandomColor()));
    }
}

function setupUI() {
    startButton = document.querySelector("#start-button");
    playButton = document.querySelector("#play-button");
    pauseButton = document.querySelector("#pause-button");
    resetButton = document.querySelector("#reset-button");
    fpsChooser = document.querySelector("#speed-chooser");
    numChooser = document.querySelector("#walker-chooser");
    //  fadeChooser = document.querySelector("#fade-chooser");

    startButton.classList.remove("disabled");
    playButton.classList.add("disabled");
    pauseButton.classList.add("disabled");
    resetButton.classList.add("disabled");

    startButton.onclick = () => {
        isPaused = false;
        setInterval(drawWalkers, 1000 / fps);
        pauseButton.classList.remove("disabled");
        resetButton.classList.remove("disabled");
        startButton.classList.add("disabled");
    }
    pauseButton.onclick = function () {
        isPaused = true;
        pauseButton.classList.add("disabled");
        playButton.classList.remove("disabled");
    };

    playButton.onclick = function () {
        if (isPaused) {
            isPaused = false;
            pauseButton.classList.remove("disabled");
            playButton.classList.add("disabled");
        }
    };

    resetButton.onclick = () => {
        init();
    }

    fps = fpsChooser.value;
    // fadeRate = fadeChooser.value;
    makeWalkers(numChooser.value);
}


function drawWalkers() {
    if (isPaused) return;
    for (let walker of walkers) {
        ctx.fillStyle = walker.color;
        //	ctx.globalAlpha = 0.2;
        ctx.fillRect(walker.x - walker.width / 2, walker.y - walker.width / 2, walker.width / 2, walker.width / 2);
        walker.move();
    }
}

// UTILS
function getRandomColor() {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ", 1)";
}

function clear() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
