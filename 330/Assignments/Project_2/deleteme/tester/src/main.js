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
    showBars: false,
    showCircles: false,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};

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

    // // hookup checkboxes
    // let gradientCB = document.querySelector("#gradient-checkbox");
    // gradientCB.onclick = function (e) {
    //     drawParams.showGradient = e.target.checked;
    // };
    // let barsCB = document.querySelector("#bars-checkbox");
    // barsCB.onclick = function (e) {
    //     drawParams.showBars = e.target.checked;
    // };
    // let circlesCB = document.querySelector("#circles-checkbox");
    // circlesCB.onclick = function (e) {
    //     drawParams.showCircles = e.target.checked;
    // };
    // let noiseCB = document.querySelector("#noise-checkbox");
    // noiseCB.onclick = function (e) {
    //     drawParams.showNoise = e.target.checked;
    // };
    // let invertCB = document.querySelector("#invert-checkbox");
    // invertCB.onclick = function (e) {
    //     drawParams.showInvert = e.target.checked;
    // };
    // let embossCB = document.querySelector("#emboss-checkbox");
    // embossCB.onclick = function (e) {
    //     drawParams.showEmboss = e.target.checked;
    // };
    // // set up defaults
    // gradientCB.checked = drawParams.showGradient;
    // barsCB.checked = drawParams.showBars;
    // circlesCB.checked = drawParams.showCircles;
    // noiseCB.checked = drawParams.showNoise;
    // invertCB.checked = drawParams.showInvert;
    // embossCB.checked = drawParams.showEmboss;
} // end setupUI()

function loop() {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);

    /* Testing code
    // 1) create a byte array (values of 0-255) to hold the audio data
     // normally, we do this once when the program starts up, NOT every frame
     let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);
 
     // 2) populate the array of audio data *by reference* (i.e. by its address)
     audio.analyserNode.getByteFrequencyData(audioData);
 
     // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
     console.log(audioData);
 
     console.log("-----Audio Stats-----");
     let totalLoudness = audioData.reduce((total, num) => total + num);
     let averageLoudness = totalLoudness / (audio.analyserNode.fftSize / 2);
     let minLoudness = Math.min(...audioData); // ooh - the ES6 spread operator is handy!
     let maxLoudness = Math.max(...audioData); // ditto!
     // Now look at loudness in a specific bin
     // 22050 kHz divided by 128 bins = 172.23 kHz per bin
     // the 12th element in array represents loudness at 2.067 kHz
     let loudnessAt2K = audioData[11];
     console.log(`averageLoudness = ${averageLoudness}`);
     console.log(`minLoudness = ${minLoudness}`);
     console.log(`maxLoudness = ${maxLoudness}`);
     console.log(`loudnessAt2K = ${loudnessAt2K}`);
     console.log("---------------------");
     */
} // end loop()

export { init };