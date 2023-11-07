import { renderNotation } from './../shared/common.js';
import constants from "../shared/constants.js";

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