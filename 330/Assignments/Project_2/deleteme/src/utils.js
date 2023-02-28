/** @param {string} url @param {function} callback */
const loadJsonFetch = (url, callback) => {
    fetch(url)
        .then(response => {
            // If the response is successful, return the JSON
            if (response.ok) {
                return response.json();
            }
            // else throw an error that will be caught below
            return response.text().then(text => {
                throw text;
            });
        }) // send the response.json() promise to the next .then()
        .then(json => { // the second promise is resolved, and `json` is a JSON object
            callback(json);
        }).catch(error => { // error
            console.log(error);
        });
};

const setCanvasSize = (canvas, width = 500, height = 500) => {
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}

const clearCanvas = (ctx, canvas, backgroundColor = "black") => {
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return "rgb(" + getByte() + "," + getByte() + "," + getByte() + ")";
}

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

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

export { loadJsonFetch, setCanvasSize, clearCanvas, getRandomInt, getRandomColor, getLinearGradient, goFullscreen };