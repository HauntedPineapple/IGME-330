import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as utils from './utils.js';

// main.js is primarily responsible for hooking up the UI to the rest of
// the application and setting up the main event loop

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media//murmurs_from_the_land_forbidden.mp3"
});

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};

let useTrebleFilter = false;
let useBassFilter = false;

function init() {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

    audio.setupWebAudio(DEFAULTS.sound1);
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
} // end init()

function setupUI(canvasElement) {
    console.log("setupUI called");

    // hookup fullscreen button
    const fsButton = document.querySelector("#fs-button");
    fsButton.onclick = e => { // add .onclick event to button
        utils.goFullscreen(canvasElement);
    };

    // hookup play button
    const playButton = document.querySelector("#play-button");
    playButton.onclick = e => { // add .onclick event to button
        console.log(`audioCtx.state BEFORE = ${audio.audioCtx.state}`);
        // check if the context is in a suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state AFTER = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();// if track is currently playing, pause it
            e.target.dataset.playing = "yes"; // our css will set the text to "Pause"
        }
        else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // our css will set the text to "Play"
        }
    };

    // hookup volume slider and label
    let volumeSlider = document.querySelector("#volume-slider");
    let volumeLabel = document.querySelector("#volume-label");
    volumeSlider.oninput = e => { // add .oninput event to slider
        // set the gain
        audio.setVolume(e.target.value);
        // update the value of the label to match the value of the slider
        volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    };
    // set the value of the label to match initial value of the slider
    volumeSlider.dispatchEvent(new Event("input"));

    // hookup track <select>
    let trackSelect = document.querySelector("#track-select");
    trackSelect.onchange = e => { // add .onchange event to <select>
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    let trebleCB = document.querySelector("#treble-checkbox");
    let bassCB = document.querySelector("#bass-checkbox");
    trebleCB.onclick = function (e) {
        useTrebleFilter = e.target.checked;
        if (useTrebleFilter) {
            audio.biquadFilterHighShelf.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
            audio.biquadFilterHighShelf.gain.setValueAtTime(5, audio.audioCtx.currentTime);
        }
        else {
            audio.biquadFilterHighShelf.gain.setValueAtTime(0, audio.audioCtx.currentTime);
        }
    };

    bassCB.onclick = function (e) {
        useBassFilter = e.target.checked;
        if (useBassFilter) {
            audio.biquadFilterLowShelf.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
            audio.biquadFilterLowShelf.gain.setValueAtTime(15, audio.audioCtx.currentTime);
        }
        else {
            audio.biquadFilterLowShelf.gain.setValueAtTime(0, audio.audioCtx.currentTime);
        }
    };
} // end setupUI()

function loop() {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
} // end loop()

export { init };