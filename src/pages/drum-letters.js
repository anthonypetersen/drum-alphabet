import constants from "../shared/constants.js";
import { state, drawCircle, drawVerticalLines } from '../shared/common.js';
import { kick, snare, ghost } from '../shared/audio.js';

let kickCircles;
let snareCircles;
let ghostCircles;

let groove;

export const letter_driver = () => {
    let groove = generate_combo();
    state.updateState({groove: groove});
    visualize_groove(groove);
}

export const groove_driver = () => {

    let audioContext = state.getState().audioContext;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
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

const visualize_groove = (groove) => {

    snareCircles = [];
    ghostCircles = [];
    kickCircles = [];

    const canvas = document.getElementById("alphabetCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawings

    const circleRadius = 15;  // Adjust as needed
    const spacing = canvas.width / (groove.length + 1);
    const rowHeight = canvas.height / 4;  // Divided by 4 to center 3 rows within the canvas height

    groove.forEach((value, index) => {
        let yPos;

        // Top row for groove = 1
        if (value === 1) {
            yPos = rowHeight;
            let circle = drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
            snareCircles.push(circle);
        }
        else {
            snareCircles.push(null);
        }
        
        // Middle row for groove = 0
        if (value === 0) {
            yPos = 2 * rowHeight;
            let circle = drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
            ghostCircles.push(circle);
        }
        else {
            ghostCircles.push(null);
        }

        if(index % 4 === 0) {
            yPos = 3 * rowHeight;
            let circle = drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
            kickCircles.push(circle);
        }
    });

    drawVerticalLines(ctx, canvas); 

    state.updateState({
        ghostCircles: ghostCircles,
        kickCircles: kickCircles,
        snareCircles: snareCircles
    });
}

const generate_combo = () => {

    let flag = true;
    let results;
    let combo;

    while(flag) {
        flag = false;

        results = "";
        combo = new Array();
        groove = new Array();

        for(let i = 0; i < 4; i++) {
            combo.push(constants.LETTERS[Math.floor(Math.random() * constants.LETTERS.length)]);
            results += combo[i].letter;
        }

        for(let index of combo) {
            console.log(index);

            for(let num of index.beats) {
                groove.push(num);
            }
        }

        if(groove[0] == 1) {
            console.log(groove);
        }
        else {
            flag = true;
        }

        let streak = 0;
        let longest = 0;

        for(let i = 0; i < groove.length; i++) {
            if(groove[i] === 1) streak++;
            else streak = 0;

            if(streak > longest) longest = streak;
        }

        const combo_element = document.getElementById('maxCombo');
        const maximumCombo = combo_element && !combo_element.disabled && combo_element.value;


        if(maximumCombo && longest > maximumCombo) {
            flag = true;
        }

        const hit_element = document.getElementById('minHits');
        const minimumHits = hit_element && !hit_element.disabled && hit_element.value;

        const actualHits = groove.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        if(minimumHits && actualHits < minimumHits) {
            flag = true;
        }

        
    }

    console.log("FINAL GROOVE");
    console.log(groove);

    return groove;
}