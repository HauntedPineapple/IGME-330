let audioElement, sourceNode, gainNode;

let audioCtx, analyserNode;
let trebleFilter, bassFilter, distortionFilter;

function setupWebAudio(settings = {}) {
    const NUM_SAMPLES = settings.density;

    audioElement = document.querySelector("#audio-player");

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    loadSoundFile(settings.currentTrack);

    // create a source node that points at the <audio> element
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
    sourceNode = audioCtx.createMediaElementSource(audioElement);

    // create an analyser node
    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = NUM_SAMPLES;

    // create our biquad filters (treble=highshelf and bass=lowshelf)
    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";

    // create distortion filter node
    // https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
    distortionFilter = audioCtx.createWaveShaper();
    // TODO: https://github.com/tonethar/IGME-330-Master/blob/master/notes/demo-web-audio-2.md#vii-creating-the-waveshaper-filter-distortion

    // connect the nodes
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
    sourceNode.connect(trebleFilter);
    trebleFilter.connect(bassFilter);
    bassFilter.connect(distortionFilter);
    distortionFilter.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
}

const loadSoundFile = (filepath) => {
    audioElement.src = filepath;
}

const playCurrentSound = () => {
    audioElement.play();
}

const pauseCurrentSound = () => {
    audioElement.pause();
}

const setVolume = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

export { setupWebAudio, loadSoundFile, playCurrentSound, pauseCurrentSound, setVolume };
export { audioCtx, analyserNode, trebleFilter, bassFilter, distortionFilter };