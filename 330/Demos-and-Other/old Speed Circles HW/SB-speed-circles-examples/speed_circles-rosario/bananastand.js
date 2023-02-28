"use strict";

// global variables
var canvas, ctx, MOUSEDOWN,
// app settings
_OPACITY, // int
_MIRROR, // boolean
_SIZE, // int
_SIZE_CHOICE, // int
_SIZE_CUSTOM; //int
// --
var lastX;
var lastY;

/* init() is called when the page loads */
function init(){
	canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");
	_OPACITY = 1;
	_SIZE_CHOICE = "speed";
	_SIZE_CUSTOM = 40;
	// canvas event listeners
	canvas.addEventListener("mouseup", doMouseup);
	canvas.addEventListener("mousedown", doMousedown);
	canvas.addEventListener("mousemove", doMousemove);
	// set up UI
	setupUI();
}




/* Hook up UI widgets to canvas */
function setupUI(){
	/* clear button */
	document.querySelector("#clearButton").addEventListener("click", clearCanvas);

	/* save button */
	document.querySelector("#saveButton").addEventListener("click", function(e){
		// http://www.w3schools.com/jsref/met_win_open.asp
		var data = canvas.toDataURL();
		var windowName = "canvasImage";
		var windowOptions = "left=0,top=0,width=" + canvas.width + ",height=" + canvas.height +",toolbar=0,resizable=0";
		window.open(data,windowName,windowOptions);
	});

	/* opacity slider */
	document.querySelector("#opacity_slider").addEventListener("change", function(e){
		_OPACITY = e.target.value;
		document.getElementById('opacity_setting').innerHTML = _OPACITY;
	});

	/* mirror checkbox */
	document.getElementById('mirror_checkbox').addEventListener("change",function(e){
		_MIRROR = ( e.target.checked) ? true : false;
	});

	/* radio buttons */
	var size_options = document.getElementById('size_choice_setting').getElementsByTagName('input');
	for (var i = 0; i < size_options.length; i++) {
		size_options[i].addEventListener("change", function(e) {
			_SIZE_CHOICE = e.target.value;
		});
	}

	/* size slider */
	document.getElementById('size_slider').addEventListener("change", function(e) {
		_SIZE_CUSTOM = e.target.value;
		document.getElementById('size_setting').innerHTML = _SIZE_CUSTOM;
	});
	/*
		Newer browsers have an event architecture similar to what we see in AS3.
		Here we're telling the slider to update the <span> with its value when the page first loads.
		This event creation and dispatching code will definitely fail in older browsers,
		so we'll do a quick "feature test" before we use it.
	*/
	if(document.createEvent){ // Only call the function if it exists. 
		// document.createEvent(type);
		// event.initUIEvent(type, canBubble, cancelable, view, detail) 
		// element.dispatchEvent(event)
		var e = document.createEvent("UIEvents");
		e.initUIEvent("change", true, false, window, 1);
		document.querySelector("#opacity_slider").dispatchEvent(e);
		document.getElementById('mirror_checkbox').dispatchEvent(e);
	}
} // end function setupUI



/* MOUSE EVENTS */
function doMouseup(e){ MOUSEDOWN = false; }
function doMousedown(e){
	MOUSEDOWN = true;
	var mouse = getMouse(e);
	lastX = mouse.x;
	lastY = mouse.y;
}
function doMousemove(e){
	if (MOUSEDOWN) {
		var mouse = getMouse(e);
		var x = mouse.x,
				y = mouse.y;
		var color = getRandomColor(_OPACITY);

    if (_SIZE_CHOICE == "speed") {
			var speedX = Math.abs(x - lastX),
					speedY = Math.abs(y - lastY),
					speedAve = ((speedX + speedY) / 2) * 2; // speedAve = radius
			lastX = x;
			lastY = y;
			// --
			_SIZE = speedAve;
    }
    else if (_SIZE_CHOICE == "random") {
			_SIZE = Math.round(Math.random()*40+1);
    }
    else if (_SIZE_CHOICE == "custom") {
    	_SIZE = _SIZE_CUSTOM;
    }
    else { _SIZE = 40; }

		// FIGHT!
		// drawCircle(x, y, radius, color);
		// drawCircle(x, y, speedAve, color);
		drawCircle(x, y, _SIZE, color);
		if (_MIRROR) drawMirror(x, y, _SIZE, color);
	}
}

/* CANVAS DRAWING CODE */
//  ctx.arc(_x, _y, _radius,startAngle,endAngle, clockwise)
function drawCircle(_x, _y, _radius, _fillColor){
	ctx.fillStyle = _fillColor;
	ctx.beginPath();
	ctx.arc(_x, _y, _radius, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawMirror(_x2, _y2, _radius2, _fillColor2) {
		var mirrorX = canvas.width - _x2;
	drawCircle(mirrorX, _y2, _radius2, _fillColor2);
}

function  clearCanvas(){
	canvas.width = canvas.width;
	// OR
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
}




/* HELPER FUNCTIONS */

// adjusts coordinates of mouse over the window, to local mouse coordinates over the canvas
function getMouse(e){
	var mouse = {};
			mouse.x = e.pageX - canvas.offsetLeft;
			mouse.y = e.pageY - canvas.offsetTop;
	return mouse;
}

// returns a random color of alpha 1.0
// http://paulirish.com/2009/random-hex-color-code-snippets/
function getRandomColor(alpha){
	var red = Math.round(Math.random()*254+1);
	var green = Math.round(Math.random()*254+1);
	var blue=Math.round(Math.random()*254+1);
	// var color='rgb('+red+','+green+','+blue+')';
	var color='rgba('+red+','+green+','+blue+','+_OPACITY+')'; // 0.50 alpha
	return color;
}

// used to calculate how fast the mouse is moving
function distanceBetween(x1,y1,x2,y2){
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.sqrt(dx*dx + dy*dy);
}



window.addEventListener("load",init);