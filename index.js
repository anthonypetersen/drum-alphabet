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
    document.getElementById("results").innerText = generate_combo();
}

const groove_driver = () => {

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const bpm = 80;  // for example
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

        pattern.forEach((value, index) => {
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
    let groove;

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

        if(longest <= 2) {
            console.log(groove);
        }
        else {
            flag = true;
        }
    }

    return results;
}

document.getElementById('dice-driver').addEventListener('click', () => {
    console.log("rolling dice");
    dice_driver();
});

document.getElementById('groove-driver').addEventListener('click', () => {
    console.log("playing groove");
    groove_driver();
});
