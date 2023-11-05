import Circle from './circle.js';
import { transcribe } from './templates.js';

let renderer;

export const drawCircle = (ctx, x, y, radius) => {
    const circle = new Circle(x, y, radius, 'black');
    circle.draw(ctx);
    return circle;
}

export const  drawVerticalLines = (ctx, canvas) => {

    const barWidth = canvas.width / 4;

    for(let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(barWidth * i, 0);
        ctx.lineTo(barWidth * i, canvas.height);
        ctx.strokeStyle = '#000';  // Black color for the line
        ctx.stroke();
    }
}

export const renderNotation = (notation, element) => {

    console.log("Rendering notation...");

    const { Renderer, Stave, Voice, Formatter, Beam, StaveNote } = Vex.Flow;

    const div = document.getElementById(element);

    if(!renderer) {
        renderer = new Renderer(div, Renderer.Backends.SVG);
    }

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    const svg = context.svg;
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Create a stave of width 400 at position 10, 40.
    const stave = new Stave(10, 40, 400);
    stave.addClef('percussion').addTimeSignature('4/4');
    stave.setContext(context).draw();

    let translation = transcribe(notation);

    
    let firstNotes = translation[0];
    let secondNotes = translation[1];
    let thirdNotes = translation[2];
    let fourthNotes = translation[3];
    
    let beam1;
    let beam2;
    let beam3;
    let beam4;

    if (firstNotes.filter(note => !note.isRest()).length > 1) {
        beam1 = new Beam(firstNotes.filter(note => !note.isRest()));
    }

    if (secondNotes.filter(note => !note.isRest()).length > 1) {
        beam2 = new Beam(secondNotes.filter(note => !note.isRest()));
    }

    if (thirdNotes.filter(note => !note.isRest()).length > 1) {
        beam3 = new Beam(thirdNotes.filter(note => !note.isRest()));
    }

    if (fourthNotes.filter(note => !note.isRest()).length > 1) {
        beam4 = new Beam(fourthNotes.filter(note => !note.isRest()));
    }


    let notes = [...firstNotes, ...secondNotes, ...thirdNotes, ...fourthNotes];
    
    console.log(notation.hiHat);
    console.log(notation.kickSnare);
    

    const voices = [
        new Voice({
            num_beats: 4,
            beat_value: 4,
        }).addTickables(notes)
    ];

    
    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices(voices).format(voices, 330);
    
    // Render voices.
    voices.forEach(function (voice) {
        voice.draw(context, stave);
    });

    if(beam1) beam1.setContext(context).draw();
    if(beam2) beam2.setContext(context).draw();
    if(beam3) beam3.setContext(context).draw();
    if(beam4) beam4.setContext(context).draw();
}

export const showGroove = (groove) => {
    console.log("Displaying groove...");

    console.log(groove);

    const canvas = document.getElementById("grooveCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawings
    canvas.style.border = '2px solid #000000';


    const canvas2 = document.getElementById("fillCanvas");
    const ctx2 = canvas2.getContext("2d");
    ctx2.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawings
    canvas2.style.border = '2px solid #000000';


    const circleRadius = 8;  // Adjust as needed
    const spacing = canvas.width / (groove.fill.length + 1);
    const rowHeight = canvas.height / 4;  // Divided by 4 to center 3 rows within the canvas height

    const hiHatPosition = 1 * rowHeight;
    const snarePosition = 2 * rowHeight;
    const kickPosition = 3 * rowHeight;

    for(let i = 0; i < groove.hiHat.length; i++) {
        if(groove.hiHat[i] === 1) {
            drawCircle(ctx, i * spacing + spacing, hiHatPosition, circleRadius);
        }

        if(groove.kickSnare[i] === 1) {
            drawCircle(ctx, i * spacing + spacing, kickPosition, circleRadius);
        }
        if(groove.kickSnare[i] === 2) {
            drawCircle(ctx, i * spacing + spacing, snarePosition, circleRadius);
        }
        if(groove.kickSnare[i] === 3) {
            drawCircle(ctx, i * spacing + spacing, kickPosition, circleRadius);
            drawCircle(ctx, i * spacing + spacing, snarePosition, circleRadius);
        }

        if(groove.fill[i] === 1) {
            drawCircle(ctx2, i * spacing + spacing, hiHatPosition, circleRadius);
        }
    }

    // drawVerticalLines(ctx, canvas);    
}