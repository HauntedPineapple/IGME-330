import * as utility from "./utils.js";
import * as audioJS from "./audio.js";
import * as canvasJS from "./canvas.js";

let ctx, canvas;

window.onload = init;

function init() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    utility.setCanvasSize(canvas, window.innerWidth);
    // ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.onresize = () => {
        utility.setCanvasSize(canvas, window.innerWidth);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    testingFunction();
    setupUI();
}

function testingFunction() {
    let backgroundColor = "black";
    let barFill = "#878787";
    let lineColor = "white";
    

    const bgColorPicker = document.querySelector("#background-picker");
    const fillColorPicker = document.querySelector("#fill-picker");
    const lineColorPicker = document.querySelector("#outline-picker");
    bgColorPicker.onchange = (e) => {
        backgroundColor = e.target.value;
        // console.log(e.target.value);
    }
    fillColorPicker.onchange = (e) => {
        barFill = e.target.value;
        // console.log(e.target.value);
    }
    lineColorPicker.onchange = (e) => {
        lineColor = e.target.value;
        // console.log(e.target.value);
    }

    const lineWidthSlider = document.querySelector("#linewidth-slider");
    const lineWidthDisplay = document.querySelector("#linewidth-display");
    let lineWidth = lineWidthSlider.value;
    lineWidthDisplay.innerHTML = lineWidth;
    lineWidthSlider.oninput = (e) => {
        lineWidth = e.target.value;
        lineWidthDisplay.innerHTML = lineWidth;
        createLine();
    }

    const barWidthSlider = document.querySelector("#barwidth-slider");
    const barWidthDisplay = document.querySelector("#barwidth-display");
    let barWidth = barWidthSlider.value;
    barWidthDisplay.innerHTML - barWidth;
    barWidthSlider.oninput = (e) => {
        barWidth = e.target.value;
        barWidthDisplay.innerHTML = barWidth;
        createBar();
    }

    function createLine() {
        utility.clearCanvas(ctx, canvas, backgroundColor);
        utility.drawLine(ctx, canvas.width / 2, canvas.height / 5, canvas.width / 2, (canvas.height / 4) * 3, lineWidth, lineColor);
    }

    function createBar() {
        utility.clearCanvas(ctx, canvas, backgroundColor);
        utility.drawRectangle(ctx, canvas.width / 4, canvas.height / 2, barWidth, 100, barFill, lineWidth, lineColor);
    }
}

function setupUI() {
    // const fsButton = document.querySelector("#fs-button");
    // fsButton.onclick = e => { // add .onclick event to button
    //     utility.goFullscreen(canvas);
    // };

}
