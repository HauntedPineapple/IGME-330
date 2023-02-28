'use strict';

let WIDTH = 100;
let HEIGHT = 100;
let ctx;
let playButton, pauseButton, clearButton, canvas;
let isPaused = true;
let createRectangles = true;
let createCircles = true;
let createArcs = true;
let createLines = true;

window.onload = init;

function init() {
    console.log("page loaded!");

    playButton = document.querySelector("#play-button");
    pauseButton = document.querySelector("#pause-button");
    clearButton = document.querySelector("#clear-button");
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    WIDTH = canvas.getAttribute("width");
    console.log("Canvas width: ", WIDTH);
    HEIGHT = canvas.getAttribute("height");
    console.log("Canvas height: ", HEIGHT);

    setupUI();

    update();
}

function setupUI() {
    canvas.onclick = canvasClicked;

    pauseButton.onclick = function () {
        isPaused = true;
        pauseButton.classList.add("disabled");
        playButton.classList.remove("disabled");
    };

    playButton.onclick = function () {
        if (isPaused) {
            pauseButton.classList.remove("disabled");
            playButton.classList.add("disabled");
            isPaused = false;
            update();
        }
    };

    clearButton.onclick = function () {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    };

    document.querySelector("#rectangles-checkbox").onclick = function (e) {
        createRectangles = e.target.checked;
    };

    document.querySelector("#circles-checkbox").onclick = function (e) {
        createCircles = e.target.checked;
    };

    document.querySelector("#arcs-checkbox").onclick = function (e) {
        createArcs = e.target.checked;
    };

    document.querySelector("#lines-checkbox").onclick = function (e) {
        createLines = e.target.checked;
    };
}

function update() {
    if (isPaused) return;
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    requestAnimationFrame(update);

    let rand = getRandomInt(0, 100);
    if (rand <= 25) {
        if (createRectangles) {
            drawRandomRectangle();
        }
    }
    else if (rand <= 50) {
        if (createCircles) drawRandomCircle();
    }
    else if (rand <= 75) {
        if (createArcs) drawRandomArc();
    }
    else if (rand <= 100) {
        if (createLines) drawRandomLine();
    }
}

function canvasClicked(e) {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log("(" + mouseX + ", " + mouseY + ")");

    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(10, 100);
        let startAngle = getRandomInt(0, Math.PI * 2);
        let endAngle = getRandomInt(0, Math.PI * 2);
        let fillColor = getRandomColor();
        let lineWidth = getRandomInt(0, 30);
        let strokeColor = getRandomColor();
        drawArc(ctx, x, y, radius, fillColor, lineWidth, strokeColor, startAngle, endAngle);
        // let x = getRandomInt(-100, 100) + mouseX;
        // let y = getRandomInt(-100, 100) + mouseY;
        // let width = getRandomInt(10, 100);
        // let height = getRandomInt(10, 100);
        // let fillColor = getRandomColor();
        // let lineWidth = getRandomInt(0, 30);
        // let strokeColor = getRandomColor();
        // drawRectangle(ctx, x, y, width, height, fillColor);
        // drawRectangle(ctx, x, y, width, height, fillColor, lineWidth, strokeColor);
    }
}

// #region Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
}

function drawRandomRectangle() {
    drawRectangle(ctx,
        getRandomInt(0, WIDTH), getRandomInt(0, HEIGHT),
        getRandomInt(10, 100), getRandomInt(10, 100),
        getRandomColor(), getRandomInt(0, 30), getRandomColor());
}

function drawRandomCircle() {
    drawCircle(ctx,
        getRandomInt(0, WIDTH), getRandomInt(0, HEIGHT),
        getRandomInt(10, 100),
        getRandomColor(), getRandomInt(0, 30), getRandomColor());
}

function drawRandomArc() {
    drawArc(ctx,
        getRandomInt(0, WIDTH), getRandomInt(0, HEIGHT),
        getRandomInt(10, 100),
        getRandomColor(), getRandomInt(0, 30), getRandomColor(),
        getRandomInt(0, Math.PI * 2), getRandomInt(0, Math.PI * 2));
}

function drawRandomLine() {
    drawLine(ctx,
        getRandomInt(0, WIDTH), getRandomInt(0, HEIGHT),
        getRandomInt(0, WIDTH), getRandomInt(0, HEIGHT),
        getRandomInt(1, 50), getRandomColor());
}
// #endregion

// #region Canvas Helper Functions
function drawRectangle(ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    // ctx.fill(); 
    // If fill is called AFTER stroke, we would see only a fraction 
    //of the stroked border's line width
    ctx.closePath();
    ctx.restore();
}

function drawCircle(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
    drawArc(ctx, x, y, radius, fillStyle, lineWidth, strokeStyle);
}

function drawArc(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

function drawLine(ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
// #endregion