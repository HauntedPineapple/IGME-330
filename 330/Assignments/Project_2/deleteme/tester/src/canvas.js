/* The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* */

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;

    // create a gradient that runs top to bottom
    let gradStops = [{ percent: 0 / 3, color: "#3366cc" },
    { percent: 1 / 3, color: "#000099" },
    { percent: 2 / 3, color: "#6600ff" },
    { percent: 3 / 3, color: "#9900cc" }];
    gradient = utils.getLinearGradient(ctx, 0, 0, canvasWidth, canvasHeight, gradStops);

    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;

    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.frequencyBinCount);
} // end setupCanvas

function draw(params = {}) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    audioData = new Uint8Array(analyserNode.frequencyBinCount);
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    drawOscilloscope();

} // end draw()

function drawOscilloscope() {
    ctx.save();
    let baselinePosition = canvasHeight / 2;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';

    let sliceWidth = canvasWidth / audioData.length;
    let x = 0;
    let y = 0;
    // ctx.beginPath();
    // for (let i = 0; i < audioData.length; i++) {
    //     y = audioData[i] + (baselinePosition - 128);

    //     if (i === 0) {
    //         ctx.moveTo(x, y);
    //     } else {
    //         ctx.lineTo(x, y);
    //     }
    //     x += sliceWidth;
    // }
    // ctx.stroke();
    // ctx.closePath();

    // x = 0;
    // y = 0;
    // ctx.beginPath();
    // for (let i = 0; i < audioData.length; i++) {
    //     x = audioData[i] + (baselinePosition - 128);
    //     if (i === 0) {
    //         ctx.moveTo(x, y);
    //     } else {
    //         ctx.lineTo(x, y);
    //     }
    //     y += sliceWidth;
    // }
    // ctx.stroke();
    // ctx.restore();

    let bufferSize =  audioData.length;
    // let bufferSize = 12;
    let theta = 0;
    let spacing = 0;
    let delta = 360 / bufferSize + spacing;
    x = 0;
    y = 0;

    let center = { x: canvasWidth / 2, y: canvasHeight / 2 };
    let rectWidth = 5;
    let rectHeight = 25;

    let rotationPoint = { x: 0, y: 0 };
    let rotationRadius = 100;
    let path = { x: rotationRadius * Math.cos(theta), y: rotationRadius * Math.sin(theta) };

    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    drawCircle(ctx, 0, 0, 5, "green"); // center

    // let newX = rotationRadius * Math.cos(theta);
    // let newY = rotationRadius * Math.sin(theta);
    // drawRectangle(ctx, newX, newY - rectWidth / 2, rectHeight, rectWidth, "blue");
    // drawCircle(ctx, newX, newY, 5, "red");
    // theta += 45;
    // newX = rotationRadius * Math.cos(theta);
    // newY = rotationRadius * Math.sin(theta);
    // ctx.save();
    // ctx.translate(newX, newY);
    // ctx.rotate(degreesToRadians(theta));
    // drawRectangle(ctx, 0, 0 - rectWidth / 2, rectHeight, rectWidth, "blue");
    // ctx.restore();
    // drawCircle(ctx, newX, newY, 5, "red");

    // ctx.translate(canvasWidth / 2, canvasHeight / 2);
    // // ctx.rotate(degreesToRadians(theta));

    // drawCircle(ctx, 0, 0, 5, "green"); // center


    // // drawCircle(ctx, 0, -radius, 5, "blue");


    for (let i = 0; i < bufferSize; i++) {
        let newX = rotationRadius * Math.cos(degreesToRadians(theta));      
        let newY = rotationRadius * Math.sin(degreesToRadians(theta));
        ctx.save();
        ctx.translate(newX, newY);
        ctx.rotate(degreesToRadians(theta));
        drawRectangle(ctx, 0, 0 -rectWidth / 2, audioData[i], rectWidth, "blue");
        ctx.restore();
        drawCircle(ctx, newX, newY, 3, "red");
        theta += delta;
        // if (theta >= 360) theta = 0;
    }


    // ctx.beginPath();
    // for (let i = 0; i < audioData.length; i++) {
    //     ctx.translate(radius*Math.cos(degreesToRadians(theta)), radius*Math.sin(degreesToRadians(theta)));
    //     ctx.rotate(degreesToRadians(theta));
    //     y = audioData[i] + (100 - 128);
    //     if (i === 0) {
    //         ctx.moveTo(x, y);
    //     } else {
    //         ctx.lineTo(x, y);
    //     }
    //     x=0;    
    //     theta += delta;
    // }
    // ctx.stroke();
    ctx.restore();
}

export function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
export function drawRectangle(ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
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
    ctx.closePath();
    ctx.restore();
}

export function drawCircle(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
    drawArc(ctx, x, y, radius, fillStyle, lineWidth, strokeStyle);
}

export function drawArc(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2) {
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

export function drawLine(ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") {
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

export { setupCanvas, draw, drawOscilloscope };