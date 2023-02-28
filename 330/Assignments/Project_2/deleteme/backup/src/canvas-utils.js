import * as utility from "./utils.js";

function setCanvasSize(canvas, width = 400, height = 400) {
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}

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
    ctx.closePath();
    ctx.restore();
}

export { setCanvasSize };