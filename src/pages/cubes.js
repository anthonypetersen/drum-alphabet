import { renderNotation } from './../shared/common.js';
import constants from "../shared/constants.js";
import { snare } from '../shared/audio.js';
import { state } from '../shared/common.js';

const rollDice = (dice) => {
    const roll = Math.floor(Math.random() * dice.length);
    return dice[roll];
}

const pushBeats = (groove, dice) => {
    for(let i = 0; i < dice.length; i++) {
        groove.push(dice[i]);
    }
} 

export const cube_driver = () => {

    snare();
    console.log("Creating new groove...");

    let groove = {
        kickSnare: [],
        hiHat: [],
        fill: []
    };

    let kickSnare = rollDice(constants.KICK_SNARE_PATTERNS);

    for(let i = 0; i < 2; i++) {
        pushBeats(groove.kickSnare, kickSnare.pattern);
    }

    for (let i = 0; i < groove.kickSnare.length; i += 2) {
        groove.kickSnare.splice(i + 1, 0, 0);
    }
    
    let hiHat = rollDice(constants.HIHAT_PATTERNS_SIMPLE);

    for(let i = 0; i < 4; i++) {
        pushBeats(groove.hiHat, hiHat.pattern);
    }

    let fill1 = rollDice(constants.FILL_PATTERNS);
    pushBeats(groove.fill, fill1.pattern);

    let fill2 = rollDice(constants.FILL_PATTERNS);
    pushBeats(groove.fill, fill2.pattern);

    let fill3 = rollDice(constants.FILL_PATTERNS);
    pushBeats(groove.fill, fill3.pattern);

    let fill4 = rollDice(constants.FILL_PATTERNS);
    pushBeats(groove.fill, fill4.pattern);

    console.log(groove);

    renderNotation(groove, 'grooveResults');
}

export const cube_player = () => {

    let groove = [
        ...state.getState().cubeGroove[0].tickables,
        ...state.getState().cubeFill[0].tickables
    ];


    play(groove);
}

const play = (groove) => {

    let audioCtx = state.getState().audioContext;

    const bpm = 90;
    const secondsPerBeat = 60 / bpm;
    const ticksPerQuarterNote = Vex.Flow.RESOLUTION / 4; // Default is 4096 ticks per quarter note
    console.log(Vex.Flow.RESOLUTION);
    const secondsPerTick = secondsPerBeat / ticksPerQuarterNote;

    function playBufferAtTime(buffer, time) {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(time);
    }
    function getBufferForNoteName(noteName) {
        // Add your logic to return the correct buffer based on the note name
        // For example:
        switch (noteName) {
            case constants.KICK:
                return state.getState().kickBuffer;
            case constants.SNARE:
                return state.getState().snareBuffer;
            case constants.HIHAT:
                return state.getState().hiHatBuffer;
            case constants.RACK:
                return state.getState().midTomBuffer;
          default:
            return null; // Return null or undefined if there's no buffer for the note
        }
      }

    let currentTime = audioCtx.currentTime;
    console.log(currentTime);


    groove.forEach((note) => {
        // Determine the note's duration in seconds
        const noteDurationSeconds = note.ticks.value() * secondsPerTick;

        // If it's a chord, note.keys will have multiple notes
        note.keys.forEach((key) => {
            // Retrieve the buffer for this particular note
            const bufferToPlay = getBufferForNoteName(key);

            // If we have a buffer to play, schedule it
            if (bufferToPlay) {
                playBufferAtTime(bufferToPlay, currentTime);
            }
        });

        // Increment the current time by the note's duration
        currentTime += noteDurationSeconds;
    });

}