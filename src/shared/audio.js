import { state } from './common.js';
let kickBuffer, snareBuffer, ghostBuffer;

export const audio_driver = () => {
    Promise.all([
        loadAudioFile('audio/kick.wav').then(buffer => { kickBuffer = buffer; }),
        loadAudioFile('audio/snare.wav').then(buffer => { snareBuffer = buffer; }),
        loadAudioFile('audio/ghost.wav').then(buffer => { ghostBuffer = buffer; })
    ]).then(() => {
        console.log('All audio files preloaded');
    });
}

const loadAudioFile = (url) => {

    let audioContext = state.getState().audioContext;
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data));
}

const playBuffer = (buffer) => {

    let audioContext = state.getState().audioContext;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
}

export const kick = () => {
    playBuffer(kickBuffer);
}

export const snare = () => {
    playBuffer(snareBuffer);
}

export const ghost = () => {
    playBuffer(ghostBuffer);
}