import { state } from "./src/shared/common.js";
import { letter_driver } from './src/pages/drum-letters.js';
import { cube_driver } from './src/pages/groove-cubes.js';

let kickBuffer, snareBuffer, ghostBuffer;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

Promise.all([
    loadAudioFile('audio/kick.wav').then(buffer => { kickBuffer = buffer; }),
    loadAudioFile('audio/snare.wav').then(buffer => { snareBuffer = buffer; }),
    loadAudioFile('audio/ghost.wav').then(buffer => { ghostBuffer = buffer; })
]).then(() => {
    console.log('All audio files preloaded');
});

function loadAudioFile(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioCtx.decodeAudioData(data));
}


function playBuffer(buffer) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
}

function kick() {
    playBuffer(kickBuffer);
}

function snare() {
    playBuffer(snareBuffer);
}

function ghost() {
    playBuffer(ghostBuffer);
}







const groove_driver = () => {

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const beats_element = document.getElementById('bpm');
    const canvas = document.getElementById("alphabetCanvas");
    const ctx = canvas.getContext("2d");

    
    const bpm = beats_element && beats_element.value;
    const beatDuration = 60000 / bpm;
    const quarterBeatDuration = beatDuration / 4;

    const delay = 500;

    setTimeout(() => {

        state.getState().groove.forEach((value, index) => {
            setTimeout(() => {

                const { ghostCircles, kickCircles, snareCircles } = state.getState();
                // Play the bass drum on every 4th beat
                if (index % 4 === 0) {
                    kickCircles[index / 4].setColor("red");
                    kickCircles[index / 4].draw(ctx);
                    kick();
                }
        
                if (value === 1) {
                    snare();
                    snareCircles[index].setColor("red");
                    snareCircles[index].draw(ctx);
                } else if (value === 0) {
                    ghostCircles[index].setColor("red");
                    ghostCircles[index].draw(ctx);
                    ghost();
                }
            }, index * quarterBeatDuration);
        });
    }, delay);
}


document.getElementById('dice-driver').addEventListener('click', letter_driver);
document.getElementById('groove-driver').addEventListener('click', groove_driver);
document.getElementById("cubes-driver").addEventListener('click', cube_driver);

document.getElementById("enableHits").addEventListener("change", function() {
    document.getElementById('minHits').disabled = document.getElementById('enableHits').checked
});

document.getElementById("enableCombo").addEventListener("change", function() {
    document.getElementById('maxCombo').disabled = document.getElementById('enableCombo').checked
});

