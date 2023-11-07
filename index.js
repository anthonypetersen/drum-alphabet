import { letter_driver, groove_driver } from './src/pages/drum-letters.js';
import { cube_driver } from './src/pages/groove-cubes.js';
import { audio_driver } from './src/shared/audio.js';
import { state } from './src/shared/common.js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
state.updateState({audioContext: audioContext});

audio_driver();


document.getElementById('dice-driver').addEventListener('click', letter_driver);
document.getElementById('groove-driver').addEventListener('click', groove_driver);
document.getElementById("cubes-driver").addEventListener('click', cube_driver);

document.getElementById("enableHits").addEventListener("change", function() {
    document.getElementById('minHits').disabled = document.getElementById('enableHits').checked
});

document.getElementById("enableCombo").addEventListener("change", function() {
    document.getElementById('maxCombo').disabled = document.getElementById('enableCombo').checked
});

