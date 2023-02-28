// MODULE SCOPED VARIABLES
let canvas = null,
    ctx = null,
    dragging = false,
    lineWidth = null,
    strokeStyle = null;

let drawBackgroundGrid = true;

// CONSTANTS
const defaultLineWidth = 3;
const defaultStrokeStyle = "red";

// HELPER FUNCTION(s)
/** returns mouse position in local coordinate system of element */
const getMouse = (evt) => {
    const mouse = {};
    mouse.x = evt.pageX - evt.target.offsetLeft;
    mouse.y = evt.pageY - evt.target.offsetTop;
    return mouse;
};

// EVENT CALLBACK FUNCTIONS
const doMousedown = (evt) => {
    // console.log(evt.type);
    dragging = true;

    // get the location of the cursor in canvas coordinates
    const mouse = getMouse(evt);

    // PENCIL TOOL
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y); // move pen to (x,y) of cursor
};

const doMouseup = (evt) => {
    // console.log(evt.type);
    dragging = false;

};

const doMousemove = (evt) => {
    if (dragging === false) return; // bail if the mouse button isn't down

    // get the location of the cursor in canvas coordinates
    const mouse = getMouse(evt);

    // PENCIL TOOL
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineTo(mouse.x, mouse.y); // draw line to (x,y) of cursor
    ctx.stroke();
};


/** if the user drags out of the canvas */
const doMouseout = (evt) => {
    // console.log(evt.type);
    dragging = false;
};

const doClear = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 0.5;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (drawBackgroundGrid) drawGrid(ctx, "lightgray", 10, 10);
};

/** convert the canvas to a JPEG and download it */
const doExport = () => {
    // https://daily-dev-tips.com/posts/vanilla-javascript-save-canvas-as-an-image/
    const data = canvas.toDataURL("image/jpg", 1.0);
    const link = document.createElement("a");
    link.download = "exported-image.jpg";
    link.href = data;
    link.click();
    link.remove();
};

const doLineWidthChange = (e) => {
    console.log("Line Width: ", e.target.value);
    lineWidth = e.target.value;
}
const doColorChange = (e) => {
    console.log("Stroke Color: ", e.target.value);
    strokeStyle = e.target.value.toLowerCase();
}

// UTILITY FUNCTIONS
/*
These utility functions do not depend on any global variables being in existence, 
and produce no "side effects" such as changing ctx state variables.
They are "pure functions" - see: http://en.wikipedia.org/wiki/Pure_function
*/

/** Fills the entire canvas with a grid
 * @param {*} ctx The drawing context
 * @param {string} color Color to make the lines
 * @param {Number} cellWidth Width of grid cells
 * @param {Number} cellHeight Height of grid cells
 */
const drawGrid = (ctx, color, cellWidth, cellHeight) => {
    // save the current drawing state as it existed before this function was called
    ctx.save();

    // set some drawing state variables
    ctx.strokeStyle = color;

    // vertical lines
    for (let x = cellWidth + 0.5; x < ctx.canvas.width; x += cellWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = cellHeight + 0.5; y < ctx.canvas.height; y += cellHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();
    }

    // restore the drawing state
    ctx.restore();
};

const init = () => {
    // initialize some variables
    canvas = document.querySelector("#main-canvas");
    ctx = canvas.getContext("2d");
    lineWidth = defaultLineWidth;
    strokeStyle = defaultStrokeStyle;

    // set initial properties of the graphics context
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawGrid(ctx, "lightgray", 10, 10);

    // Hook up event listeners
    canvas.onmousedown = doMousedown;
    canvas.onmouseup = doMouseup;
    canvas.onmousemove = doMousemove;
    canvas.onmouseout = doMouseout;
    document.querySelector("#color-chooser").onchange = doColorChange;
    document.querySelector("#linewidth-chooser").onchange = doLineWidthChange;
    document.querySelector("#btn-clear").onclick = doClear;
    document.querySelector("#btn-export").onclick = doExport;

    doClear();
};

init();