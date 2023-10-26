let values = [
    {letter: "A", beats: [1, 0, 0, 0]},
    {letter: "B", beats: [0, 1, 0, 0]},
    {letter: "C", beats: [0, 0, 1, 0]},
    {letter: "D", beats: [0, 0, 0, 1]},
    {letter: "E", beats: [1, 1, 0, 0]},
    {letter: "F", beats: [0, 1, 1, 0]},
    {letter: "G", beats: [0, 0, 1, 1]},
    {letter: "H", beats: [1, 0, 1, 0]},
    {letter: "I", beats: [0, 1, 0, 1]},
    {letter: "J", beats: [1, 0, 0, 1]},
    {letter: "K", beats: [1, 1, 1, 0]},
    {letter: "L", beats: [0, 1, 1, 1]},
    {letter: "M", beats: [1, 0, 1, 1]},
    {letter: "N", beats: [1, 1, 0, 1]}
];

let groove;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let kickBuffer, snareBuffer, ghostBuffer;

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


const dice_driver = () => {
    let groove = generate_combo();
    visualize_groove(groove);
}

const visualize_groove = (groove) => {
    const canvas = document.getElementById("grooveCanvas");
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
            drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
        }
        
        // Middle row for groove = 0
        if (value === 0) {
            yPos = 2 * rowHeight;
            drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
        }

        if(index % 4 === 0) {
            yPos = 3 * rowHeight;
            drawCircle(ctx, index * spacing + spacing, yPos, circleRadius);
        }
    });

    drawVerticalLines(ctx, canvas); 
}

const drawCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawVerticalLines(ctx, canvas) {

    const barWidth = canvas.width / 4;

    for(let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(barWidth * i, 0);
        ctx.lineTo(barWidth * i, canvas.height);
        ctx.strokeStyle = '#000';  // Black color for the line
        ctx.stroke();
    }
}



const groove_driver = () => {

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const beats_element = document.getElementById('bpm');

    
    const bpm = beats_element && beats_element.value;
    const beatDuration = 60000 / bpm;
    const quarterBeatDuration = beatDuration / 4;

    const delay = 500;

    let pattern = [
        1, 0, 0, 1, 
        1, 0, 0, 1, 
        0, 1, 0, 1, 
        1, 0, 0, 0
    ]

    setTimeout(() => {

        groove.forEach((value, index) => {
            setTimeout(() => {
                // Play the bass drum on every 4th beat
                if (index % 4 === 0) {
                    kick();
                }
        
                if (value === 1) {
                    snare();
                } else if (value === 0) {
                    ghost();
                }
            }, index * quarterBeatDuration);
        });
    }, delay);
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
            combo.push(values[Math.floor(Math.random() * values.length)]);
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

document.getElementById('dice-driver').addEventListener('click', () => {
    console.log("rolling dice");
    dice_driver();
});

document.getElementById('groove-driver').addEventListener('click', () => {
    console.log("playing groove");
    groove_driver();
});

document.getElementById("enableHits").addEventListener("change", function() {
    document.getElementById('minHits').disabled = document.getElementById('enableHits').checked
});

document.getElementById("enableCombo").addEventListener("change", function() {
    document.getElementById('maxCombo').disabled = document.getElementById('enableCombo').checked
});
