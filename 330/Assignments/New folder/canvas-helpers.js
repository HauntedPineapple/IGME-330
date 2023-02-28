function canvasClicked(e) {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log("(" + mouseX + ", " + mouseY + ")");
}

function drawRectangle(ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.restore();
}

// #region Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGBAColor(alpha = 0.8) {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return "rgba(" + getByte() + "," + getByte() + "," + getByte() + `, ${alpha})`;
}
// #endregion
export {canvasClicked};