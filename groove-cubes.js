import { renderNotation } from './common.js';

const fillDice = [
    { pattern: [1, 0, 0, 0], description: 'Fill 1' },
    { pattern: [0, 0, 1, 0], description: 'Fill 2' },
    { pattern: [1, 0, 1, 0], description: 'Fill 3' },
    { pattern: [1, 1, 1, 0], description: 'Fill 4' },
    { pattern: [1, 0, 1, 1], description: 'Fill 5' },
    { pattern: [1, 1, 1, 1], description: 'Fill 6' }
  ];


const hiHatSimpleDice = [
    { pattern: [1, 0, 0, 0], description: 'Hi-Hat 1' },
    { pattern: [0, 1, 0, 0], description: 'Hi-Hat 2' },
    { pattern: [1, 0, 1, 0], description: 'Hi-Hat 3' }
];

const hiHatComplexDice = [
    { pattern: [1, 0, 0, 0], description: 'Hi-Hat 1' },
    { pattern: [0, 1, 0, 0], description: 'Hi-Hat 2' },
    { pattern: [1, 0, 1, 0], description: 'Hi-Hat 3' },
    { pattern: [1, 1, 1, 0], description: 'Hi-Hat 4' },
    { pattern: [1, 0, 1, 1], description: 'Hi-Hat 5' },
    { pattern: [1, 1, 1, 1], description: 'Hi-Hat 6' }
];
  
const kickSnareDice = [
    { pattern: [1, 0, 2, 0], description: 'Kick / Snare 1' },
    { pattern: [1, 0, 2, 1], description: 'Kick / Snare 2' },
    { pattern: [1, 0, 3, 0], description: 'Kick / Snare 3' },
    { pattern: [1, 1, 2, 0], description: 'Kick / Snare 4' },
    { pattern: [1, 1, 2, 1], description: 'Kick / Snare 5' },
    { pattern: [0, 1, 2, 0], description: 'Kick / Snare 6' },
];

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

    let kickSnare = rollDice(kickSnareDice);
    console.log("Kick Snare Pattern (1/8th notes) - " + kickSnare.pattern);

    for(let i = 0; i < 2; i++) {
        pushBeats(groove.kickSnare, kickSnare.pattern);
    }

    for (let i = 0; i < groove.kickSnare.length; i += 2) {
        groove.kickSnare.splice(i + 1, 0, 0);
    }
    
    let hiHat = rollDice(hiHatSimpleDice);
    console.log("Hi-Hat Pattern (1/16th notes) - " + hiHat.pattern);

    for(let i = 0; i < 4; i++) {
        pushBeats(groove.hiHat, hiHat.pattern);
    }

    let fill1 = rollDice(fillDice);
    console.log("Fill 1 Pattern (1/16th notes) - " + fill1.pattern);
    pushBeats(groove.fill, fill1.pattern);

    let fill2 = rollDice(fillDice);
    console.log("Fill 2 Pattern (1/16th notes) - " + fill2.pattern);
    pushBeats(groove.fill, fill2.pattern);

    let fill3 = rollDice(fillDice);
    console.log("Fill 3 Pattern (1/16th notes) - " + fill3.pattern);
    pushBeats(groove.fill, fill3.pattern);

    let fill4 = rollDice(fillDice);
    console.log("Fill 4 Pattern (1/16th notes) - " + fill4.pattern);
    pushBeats(groove.fill, fill4.pattern);

    console.log(groove);


    renderNotation(groove, 'grooveResults');
}