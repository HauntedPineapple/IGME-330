import * as utility from "./utils.js";
import * as audioJS from "./audio.js";
import * as canvasJS from "./canvas.js";

let ctx, canvasElement, audioElement;
let playButton, volumeSlider, volumeValueDisplay;
let musicSelector, fileUploader, fileNameLabel;
let presetSelector;
let modeRadios, displayAsRadios;
let bgColorPicker, fillColorPicker, lineColorPicker;
let lineWidthSlider, lineWidthValueDisplay;
let barWidthSlider, barWidthValueDisplay;
let baselinePositionSlider, baselineValueDisplay;
let spacingSlider, spacingValueDisplay;
let densitySlider, densityValueDisplay;
let placementRadios, orientationRadios;
let trebleCB, bassCB, distortionCB;
let trebleSlider, bassSlider, distortionSlider;
let trebleValueDisplay, bassValueDisplay, distortionValueDisplay;

let presets = [];
let currentSettings = {
    isPlaying: false,
    currentTrack: "./data/audio/New Adventure Theme.mp3",
    mode: "", // "radial", "linear"
    displayAs: "", // "lines", "bars", "waves"
    placement: "", // "top"/"right", "bottom"/"left", "middle"
    orientation: "", // "horizontal", "vertical"
    backgroundColor: "#000000",
    fillColor: "#000000",
    lineColor: "#000000", // aka Outline color when applicable
    density: 128,
    spacing: 0,
    barWidth: 0,
    barHeight: 0,
    baselinePosition: 0,
    lineWidth: 0,
    trebleOn: false,
    trebleGain: 0,
    bassOn: false,
    bassGain: 0,
    distortionOn: false,
    distortionGain: 0,
    bitCrusherOn: false,
    bitCrusherGain: 0
};

window.onload = init;

/** Initializes the app */
function init() {
    utility.loadJsonFetch("./data/presets/presets.json", function dataLoaded(json) {
        presets = json.presets || ["No 'presets' found"];
        // console.log(presets);       
        createPresetSelector(presets);
        loadPreset(0);
        setupUI();
    });

    canvasElement = document.querySelector("canvas");
    ctx = canvasElement.getContext("2d");

    utility.setCanvasSize(canvasElement, window.innerWidth);
    ctx.fillStyle = currentSettings.backgroundColor;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    audioJS.setupWebAudio(currentSettings);
    canvasJS.setUpCanvas(canvasElement, audioJS.analyserNode);
    loop();
}

/**
 * Loads the preset with the given index from the preset file
 * @param {Number} index 
 */
function loadPreset(index) {
    const currentPreset = presets[index];
    // console.log("currentPreset: ", currentPreset);
    // console.log("currentPreset['title']: ", currentPreset["title"]);
    // console.log("currentPreset['settings']: ", currentPreset["settings"]);

    for (let property of Object.keys(currentSettings)) {
        if (currentPreset["settings"][property] != "SKIP") {
            currentSettings[property] = currentPreset["settings"][property];
        }
        //console.log(`${property} = ${currentSettings[property]}`);
    }
    // for (let property of Object.keys(currentPreset["settings"])) {console.log(`${property} = ${currentPreset["settings"][property]}`);}
    setupUI();
}

/** Creates the dropdown html for the preset selector based on what is in the file */
function createPresetSelector() {
    presetSelector = document.querySelector("#preset-selector");

    // create the dropdowns
    let selectorHTML = `<option class="placeholder" selected disabled="disabled" value="">Select Preset</option>`;
    for (let i = 0; i < Object.keys(presets).length; i++) {
        selectorHTML += `<option value="${i}">${presets[i].title}</option>`;
    }
    presetSelector.innerHTML = selectorHTML;

    // set up event handling
    presetSelector.onchange = (e) => {
        loadPreset(e.target.value);
    }
}

/** Sets up the UI and the events to be attached to them */
function setupUI() {
    audioElement = document.querySelector("audio");
    // Chrome autoplay fix: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    audioElement.onplay = (e) => {
        if (audioJS.audioCtx.state == "suspended") {
            audioJS.audioCtx.resume();
        }
        currentSettings.isPlaying = true;
    }
    audioElement.onpause = (e) => currentSettings.isPlaying = false;

    // playButton = document.querySelector("#play-button");
    // volumeSlider = document.querySelector("#volume-slider input[type='range']");
    // volumeValueDisplay = document.querySelector("#volume-label");

    // File Upload Input
    fileUploader = document.querySelector("#file-uploader");
    fileNameLabel = document.querySelector("#file-name");
    fileUploader.onchange = (e) => {
        fileNameLabel.innerHTML = e.target.files[0].name;
        musicSelector.value = "upload";
    }

    // Track Selector
    musicSelector = document.querySelector("#track-selector");
    currentSettings.currentTrack = musicSelector.value;
    musicSelector.onchange = (e) => {
        if (e.target.value == "upload") { // use the uploaded file (if it exists)
            if (fileUploader.files.length > 0) {
                currentSettings.currentTrack = URL.createObjectURL(fileUploader.files[0]);
            }
            else {
                currentSettings.currentTrack = "";
            }
        }
        else {
            currentSettings.currentTrack = e.target.value;
        }
        audioJS.loadSoundFile(currentSettings.currentTrack);
    }

    // Mode Chooser
    modeRadios = document.querySelectorAll("input[name='mode']");
    for (let radioBtn of modeRadios) {
        if (radioBtn.value == currentSettings.mode) {
            radioBtn.checked = true;
        }
        radioBtn.onchange = (e) => {
            if (e.target.checked) {
                currentSettings.mode = e.target.value;
            }
            // disable baseline position if radial
            if (currentSettings.mode == "radial") {
                document.querySelector("#baselineposition-slider").classList.add("hidden");
            }
            else if (currentSettings.mode == "linear") {
                document.querySelector("#baselineposition-slider").classList.remove("hidden");
            }
        }
    }

    // Display As Chooser
    displayAsRadios = document.querySelectorAll("input[name='display']");
    for (let radioBtn of displayAsRadios) {
        if (radioBtn.value == currentSettings.displayAs) {
            radioBtn.checked = true;
        }
        radioBtn.onchange = (e) => {
            if (e.target.checked) {
                currentSettings.displayAs = e.target.value;
            }
        }
    }

    // Color Selectors
    bgColorPicker = document.querySelector("#background-color-picker");
    bgColorPicker.value = currentSettings.backgroundColor;
    bgColorPicker.onchange = (e) => {
        currentSettings.backgroundColor = e.target.value;
        ctx.fillStyle = currentSettings.backgroundColor;
        reset();
    }
    fillColorPicker = document.querySelector("#fill-color-picker");
    fillColorPicker.value = currentSettings.fillColor;
    fillColorPicker.onchange = (e) => {
        currentSettings.fillColor = e.target.value;
        reset();
    }
    lineColorPicker = document.querySelector("#line-color-picker");
    lineColorPicker.value = currentSettings.lineColor;
    lineColorPicker.onchange = (e) => {
        currentSettings.lineColor = e.target.value;
        reset();
    }

    // Line Width Slider
    lineWidthSlider = document.querySelector("#linewidth-slider input[type='range']");
    lineWidthValueDisplay = document.querySelector("#linewidth-label");
    lineWidthSlider.value = currentSettings.lineWidth;
    lineWidthValueDisplay.innerHTML = lineWidthSlider.value;
    lineWidthSlider.oninput = (e) => {
        currentSettings.lineWidth = e.target.value;
        lineWidthValueDisplay.innerHTML = currentSettings.lineWidth;
        reset();
    }

    // Bar Width Slider
    barWidthSlider = document.querySelector("#barwidth-slider input[type='range']");
    barWidthValueDisplay = document.querySelector("#barwidth-label");
    barWidthSlider.value = currentSettings.barWidth;
    barWidthValueDisplay.innerHTML = barWidthSlider.value;
    barWidthSlider.oninput = (e) => {
        currentSettings.barWidth = e.target.value;
        barWidthValueDisplay.innerHTML = currentSettings.barWidth;
        reset();
    }

    // Baseline Position Slider
    baselinePositionSlider = document.querySelector("#baselineposition-slider input[type='range']");
    baselineValueDisplay = document.querySelector("#baselineposition-label");
    baselinePositionSlider.value = currentSettings.baselinePosition;
    baselineValueDisplay.innerHTML = baselinePositionSlider.value;
    baselinePositionSlider.oninput = (e) => {
        currentSettings.baselinePosition = e.target.value;
        baselineValueDisplay.innerHTML = currentSettings.baselinePosition;
    }

    // Spacing Slider
    spacingSlider = document.querySelector("#spacing-slider input[type='range']");
    spacingValueDisplay = document.querySelector("#spacing-label");
    spacingSlider.value = currentSettings.spacing;
    spacingValueDisplay.innerHTML = spacingSlider.value;
    spacingSlider.oninput = (e) => {
        currentSettings.spacing = e.target.value;
        spacingValueDisplay.innerHTML = currentSettings.spacing;
        reset();
    }

    // Density Slider
    densitySlider = document.querySelector("#density-slider input[type='range']");
    densityValueDisplay = document.querySelector("#density-label");
    densityValueDisplay.innerHTML = currentSettings.density;
    densitySlider.oninput = (e) => {
        currentSettings.density = Math.pow(2, Number(e.target.value) + 5);
        densityValueDisplay.innerHTML = currentSettings.density;
        audioJS.analyserNode.fftSize = currentSettings.density;
        reset();
    }

    // Placement Chooser
    placementRadios = document.querySelectorAll("#placement-radios input[name='placement']");
    for (let radioBtn of placementRadios) {
        if (radioBtn.value == currentSettings.placement) {
            radioBtn.checked = true;
        }
        radioBtn.onchange = (e) => {
            if (e.target.checked) {
                currentSettings.placement = e.target.value;
            }
            resetLabels();
        }
    }

    // Orientation Chooser
    orientationRadios = document.querySelectorAll("#orientation-radios input[name='orientation']");
    for (let radioBtn of orientationRadios) {
        if (radioBtn.value == currentSettings.orientation) {
            radioBtn.checked = true;
        }
        radioBtn.onchange = (e) => {
            if (e.target.checked) {
                currentSettings.orientation = e.target.value;
            }
            resetLabels();
        }
    }

    // change the canvas to fit the window size
    window.onresize = () => {
        reset();
        resetLabels();
    }
}

/** Creates the animation loop */
function loop() {
    requestAnimationFrame(loop);
    canvasJS.draw(currentSettings);
}

/** Resets the canvas to be the width of the window and re-sets-up the canvas JS */
function reset() {
    utility.setCanvasSize(canvasElement, window.innerWidth);
    canvasJS.setUpCanvas(canvasElement, audioJS.analyserNode);
    resetLabels();
}

/** Changes the slider labels to have the appropriate min and max values */
function resetLabels() {
    let newMin = 0;
    let newMax = 1;
    if (currentSettings.orientation == "horizontal") {
        switch (currentSettings.placement) {
            case "top":
                newMin = 0;
                newMax = Math.round(canvasElement.height / 2);
                break;
            case "bottom":
                newMin = 0;
                newMax = Math.round(canvasElement.height / 2);
                break;
            case "middle":
                newMin = 0;
                newMax = canvasElement.height;
                break;
        }
        document.querySelector("#placement-radios #top").innerHTML = '<input type="radio" name="placement" value="top"> Top';
        document.querySelector("#placement-radios #bottom").innerHTML = '<input type="radio" name="placement" value="bottom"> Bottom';
    }
    else if (currentSettings.orientation == "vertical") {
        switch (currentSettings.placement) {
            case "top":
                newMin = 0;
                newMax = Math.round(canvasElement.width / 2);
                break;
            case "bottom":
                newMin = 0;
                newMax = Math.round(canvasElement.width / 2);
                break;
            case "middle":
                newMin = 0;
                newMax = canvasElement.width;
                break;
        }
        document.querySelector("#placement-radios #top").innerHTML = '<input type="radio" name="placement" value="top"> Left';
        document.querySelector("#placement-radios #bottom").innerHTML = '<input type="radio" name="placement" value="bottom"> Right';
    }

    placementRadios = document.querySelectorAll("#placement-radios input[name='placement']");
    for (let radioBtn of placementRadios) {
        if (radioBtn.value == currentSettings.placement) {
            radioBtn.checked = true;
        }
        radioBtn.onchange = (e) => {
            if (e.target.checked) {
                currentSettings.placement = e.target.value;
            }
            resetLabels();
        }
    }

    baselinePositionSlider.setAttribute("min", newMin);
    document.querySelector("#baselineposition-slider .min-label").innerHTML = newMin;
    baselinePositionSlider.setAttribute("max", newMax);
    document.querySelector("#baselineposition-slider .max-label").innerHTML = newMax;

    // if (currentSettings.placement == "middle") {
    //     currentSettings.baselinePosition = Math.round(newMax / 2);
    //     baselinePositionSlider.value = currentSettings.baselinePosition;
    //     baselineValueDisplay.innerHTML = currentSettings.baselinePosition;
    // }
}