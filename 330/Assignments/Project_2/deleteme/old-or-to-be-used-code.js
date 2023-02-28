import * as utility from "./utils.js";
import * as audioJS from "./audio.js";
import * as canvasJS from "./canvas.js";


// // Treble Checkbox and Slider
// trebleCB = document.querySelector("#treble-checkbox");
// trebleCB.checked = currentSettings.trebleOn;
// trebleSlider = document.querySelector("#treble-slider");
// trebleSlider.value = currentSettings.trebleGain;
// trebleValueDisplay = document.querySelector("#treble-label");
// trebleValueDisplay.innerHTML = trebleSlider.value;
// trebleCB.checked = currentSettings.trebleOn;
// trebleCB.onclick = (e) => {
//     currentSettings.trebleOn = e.target.checked;
// }
// trebleSlider.onchange = (e) => {
//     currentSettings.trebleGain = e.target.value;
//     trebleValueDisplay.innerHTML = currentSettings.trebleGain;
// }

// // Bass Checkbox and Slider
// bassCB = document.querySelector("#bass-checkbox");
// bassCB.checked = currentSettings.trebleOn;
// bassSlider = document.querySelector("#bass-slider");
// bassSlider.value = currentSettings.trebleGain;
// bassValueDisplay = document.querySelector("#bass-label");
// bassValueDisplay.innerHTML = bassSlider.value;
// bassCB.onclick = (e) => {
//     currentSettings.bassOn = e.target.checked;
// }
// bassSlider.onchange = (e) => {
//     currentSettings.bassGain = e.target.value;
//     bassValueDisplay.innerHTML = currentSettings.bassGain;
// }

// // Distortion Checkbox and Slider
// distortionCB = document.querySelector("#distortion-checkbox");
// distortionCB.checked = currentSettings.trebleOn;
// distortionSlider = document.querySelector("#distortion-slider");
// distortionSlider.value = currentSettings.trebleGain;
// distortionValueDisplay = document.querySelector("#distortion-label");
// distortionValueDisplay.innerHTML = distortionSlider.value;
// distortionCB.onclick = (e) => {
//     currentSettings.distortionOn = e.target.checked;
// }
// distortionSlider.onchange = (e) => {
//     currentSettings.distortionGain = e.target.value;
//     distortionValueDisplay.innerHTML = currentSettings.distortionGain;
// }

// BitCrusher Checkbox and Slider
// TODO

// const fsButton = document.querySelector("#fs-button");
// fsButton.onclick = e => { // add .onclick event to button
//     utility.goFullscreen(canvas);
// };

function drawWaves(isLinear = true) {
    ctx.save();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.lineWidth = drawSettings.lineWidth;
    let x = 0;
    let y = 0;
    if (isLinear) {
        ctx.beginPath();
        for (let i = 0; i < audioData.length; i++) {
            if (drawSettings.orientation == "horizontal") {
                y = audioData[i] + (drawSettings.baselinePosition - 128);
            }
            else if (drawSettings.orientation == "vertical") { x = audioData[i] + (drawSettings.baselinePosition - 128); }

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            if (drawSettings.orientation == "horizontal") {
                x += sliceWidth;
            }
            else if (drawSettings.orientation == "vertical") { y += sliceWidth; }
        }
        ctx.stroke();
    }
    else { // Radial
        return; // TODO
    }
    ctx.restore();
}