import * as utility from "./utils.js";

let ctx, analyserNode, audioData, canvas, drawSettings;

/** Sets up the canvas script with references to need elements and data */
function setUpCanvas(canvasElement, analyserNodeRef) {
    ctx = canvasElement.getContext("2d");
    canvas = canvasElement;
    analyserNode = analyserNodeRef;// keep a reference to the analyser node
    audioData = new Uint8Array(analyserNode.fftSize / 2); // where the analyser data will be stored
}

/** Draws the visualization to the screen based on the current settings */
function draw(settings = {}) {
    drawSettings = settings;

    // Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = drawSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // populate the audioData array with the frequency data from the analyserNode
    if (drawSettings.displayAs == "waves") { // waveform data
        analyserNode.getByteTimeDomainData(audioData);
    }
    else { // frequency data
        analyserNode.getByteFrequencyData(audioData);
    }

    // Draw visualizations
    if (drawSettings.mode == "linear") {
        switch (drawSettings.displayAs) {
            case "lines":
                drawLines(true);
                break;
            case "bars":
                drawBars(true);
                break;
            case "waves":
                drawWaves(true);
                break;
            default:
                console.error("Invalid displayAs value in settings");
                break;
        }
    }
    else if (drawSettings.mode == "radial") {
        switch (drawSettings.displayAs) {
            case "lines":
                drawLines(false);
                break;
            case "bars":
                drawBars(false);
                break;
            case "waves":
                drawWaves(true);
                break;
            default:
                console.error("Invalid displayAs value in settings");
                break;
        }
    }
} // end of draw()

/** Draws the bars linearly or radially */
function drawBars(isLinear = true) {
    ctx.save();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.lineWidth = drawSettings.lineWidth;
    ctx.fillStyle = drawSettings.fillColor;
    let barSpacing = drawSettings.spacing;
    let margin = 1;

    if (isLinear) {
        let x, y, width, height;
        let screenWidthForBars = canvas.width - margin * 2;
        let screenHeightForBars = canvas.height - margin * 2;
        let barWidth = (screenWidthForBars / audioData.length) - barSpacing;
        let barHeight = (screenHeightForBars / audioData.length) - barSpacing;
        for (let i = 0; i < audioData.length; i++) {
            switch (drawSettings.placement) {
                case "top": // top/left
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = drawSettings.baselinePosition;
                        width = barWidth;
                        height = audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition;
                        y = (i * barWidth) + (barSpacing * i);
                        width = audioData[i];
                        height = barWidth;
                    }
                    break;
                case "bottom": // bottom/right
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = canvas.height - drawSettings.baselinePosition;
                        width = barWidth;
                        height = -audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = canvas.width - drawSettings.baselinePosition;
                        y = (i * barWidth) + (barSpacing * i);
                        width = -audioData[i];
                        height = barHeight;
                    }
                    break;
                case "middle":
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = drawSettings.baselinePosition - audioData[i];
                        width = barWidth;
                        height = audioData[i] * 2;
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition - audioData[i];
                        y = (i * barWidth) + (barSpacing * i);
                        width = audioData[i] * 2;
                        height = barWidth;
                    }
                    break;
            }
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    else { // Radial
        const rotationCenter = { x: 0, y: 0 };
        let rotationRadius = 50;
        let theta = 0;
        let delta = 360 / audioData.length * barSpacing;
        let barWidth = (360 / audioData.length) - barSpacing;

        if (drawSettings.orientation == "horizontal") {
            switch (drawSettings.placement) {
                case "top": // top
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 4;
                    break;
                case "bottom": // bottom
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = (canvas.height / 4) * 3;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        else if (drawSettings.orientation == "vertical") {
            switch (drawSettings.placement) {
                case "top": // left
                    rotationCenter.x = canvas.width / 4;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "bottom": // right
                    rotationCenter.x = (canvas.width / 4) * 3;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        ctx.translate(rotationCenter.x, rotationCenter.y); // set the center to the center of the screen
        for (let i = 0; i < audioData.length; i++) { // loop through the circle
            let newX = rotationRadius * Math.cos(utility.degreesToRadians(theta));
            let newY = rotationRadius * Math.sin(utility.degreesToRadians(theta));
            ctx.save();
            ctx.translate(newX, newY); // put the center at the point on the circle the bar will come from
            ctx.rotate(utility.degreesToRadians(theta)); // rotate so the bar is at the correct angle

            ctx.beginPath();
            ctx.rect(0, -barWidth / 2, audioData[i], barWidth);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
            theta += delta;
        }
    }
    ctx.restore();
} // end drawBars()

/** Draws the lines linearly or radially */
function drawLines(isLinear = true) {
    ctx.save();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.lineWidth = drawSettings.lineWidth;
    let lineSpacing = drawSettings.spacing;
    let margin = 1;

    if (isLinear) {
        let x, y, width, height;
        let screenWidthForLines = canvas.width - margin * 2;
        let screenHeightForLines = canvas.height - margin * 2;
        let lineWidth = (screenWidthForLines / audioData.length) - lineSpacing;
        let lineHeight = (screenHeightForLines / audioData.length) - lineSpacing;
        for (let i = 0; i < audioData.length; i++) {
            switch (drawSettings.placement) {
                case "top": // top/left
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * lineWidth) + (lineSpacing * i);
                        y = drawSettings.baselinePosition;
                        width = lineWidth;
                        height = audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition;
                        y = (i * lineWidth) + (lineSpacing * i);
                        width = audioData[i];
                        height = lineWidth;
                    }
                    break;
                case "bottom": // bottom/right
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * lineWidth) + (lineSpacing * i);
                        y = canvas.height - drawSettings.baselinePosition;
                        width = lineWidth;
                        height = -audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = canvas.width - drawSettings.baselinePosition;
                        y = (i * lineWidth) + (lineSpacing * i);
                        width = -audioData[i];
                        height = lineHeight;
                    }
                    break;
                case "middle":
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * lineWidth) + (lineSpacing * i);
                        y = drawSettings.baselinePosition - audioData[i];
                        width = lineWidth;
                        height = audioData[i] * 2;
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition - audioData[i];
                        y = (i * lineWidth) + (lineSpacing * i);
                        width = audioData[i] * 2;
                        height = lineWidth;
                    }
                    break;
            }
            ctx.beginPath();
            ctx.moveTo(x, y);
            if (drawSettings.orientation == "horizontal") {
                ctx.lineTo(x, Number(y) + Number(height))
            }
            else if (drawSettings.orientation == "vertical") {
                ctx.lineTo(Number(x) + Number(width), y)
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    else { // Radial
        const rotationCenter = { x: 0, y: 0 };
        let rotationRadius = 50;
        let theta = 0;
        let delta = 360 / audioData.length * lineSpacing;
        let lineWidth = (360 / audioData.length) - lineSpacing;

        if (drawSettings.orientation == "horizontal") {
            switch (drawSettings.placement) {
                case "top": // top
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 4;
                    break;
                case "bottom": // bottom
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = (canvas.height / 4) * 3;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        else if (drawSettings.orientation == "vertical") {
            switch (drawSettings.placement) {
                case "top": // left
                    rotationCenter.x = canvas.width / 4;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "bottom": // right
                    rotationCenter.x = (canvas.width / 4) * 3;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        ctx.translate(rotationCenter.x, rotationCenter.y);

        for (let i = 0; i < audioData.length; i++) {
            let newX = rotationRadius * Math.cos(utility.degreesToRadians(theta));
            let newY = rotationRadius * Math.sin(utility.degreesToRadians(theta));
            ctx.save();
            ctx.translate(newX, newY);
            ctx.rotate(utility.degreesToRadians(theta));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Number(audioData[i]), 0)
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            theta += delta;
        }
    }
    ctx.restore();
} // end drawLines()

function drawWaves(isLinear = true) {
    // TODO
} // end drawWaves()

export { draw, setUpCanvas };