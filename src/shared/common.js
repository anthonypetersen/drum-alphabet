import Circle from './circle.js';
import constants from './constants.js';
import State from './state.js';

const { StaveNote, Dot } = Vex.Flow;
export const state = new State({});

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

    let translation = transcribe(notation, "groove");

    
    let firstNotes = translation[0];
    let secondNotes = translation[1];
    let thirdNotes = translation[2];
    let fourthNotes = translation[3];

    let notes = [...firstNotes, ...secondNotes, ...thirdNotes, ...fourthNotes];
    

    // generate beams
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
    
    console.log(notation.hiHat);
    console.log(notation.kickSnare);
    

    const voices = [
        new Voice({
            num_beats: 4,
            beat_value: 4,
        }).addTickables(notes)
    ];

    state.updateState({ cubeGroove: voices });
    
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







    const verticalSpace = 100;
    const secondStaveYPosition = stave.getYForLine(5) + verticalSpace;

    const secondStave = new Stave(10, secondStaveYPosition, 400);
    secondStave.addClef('percussion').addTimeSignature('4/4');
    secondStave.setContext(context).draw();


    console.log(notation.fill);

    // Transcribe the notation for the second measure
    
    let secondMeasureTranslation = transcribe(notation, "fill"); // Adjust this line as needed

    let firstFill = secondMeasureTranslation[0];
    let secondFill = secondMeasureTranslation[1];
    let thirdFill = secondMeasureTranslation[2];
    let fourthFill = secondMeasureTranslation[3];


    let fillBeam1;
    let fillBeam2;
    let fillBeam3;
    let fillBeam4;

    if (firstFill.filter(note => !note.isRest()).length > 1) {
        fillBeam1 = new Beam(firstFill.filter(note => !note.isRest()));
    }

    if (secondFill.filter(note => !note.isRest()).length > 1) {
        fillBeam2 = new Beam(secondFill.filter(note => !note.isRest()));
    }

    if (thirdFill.filter(note => !note.isRest()).length > 1) {
        fillBeam3 = new Beam(thirdFill.filter(note => !note.isRest()));
    }

    if (fourthFill.filter(note => !note.isRest()).length > 1) {
        fillBeam4 = new Beam(fourthFill.filter(note => !note.isRest()));
    }

    // Create a second voice and add the notes from the second measure

    // Combine the notes from the second measure
    let secondMeasureNotes = [
        ...firstFill,
        ...secondFill,
        ...thirdFill,
        ...fourthFill
        ];
    
    const secondVoice = new Voice({
        num_beats: 4,
        beat_value: 4,
    }).addTickables(secondMeasureNotes);

    state.updateState({ cubeFill: [secondVoice] });

    // You might need to create beams for the second measure too, similar to how you did for the first measure

    // Format and justify the notes for the second voice to the second stave's width
    new Formatter().joinVoices([secondVoice]).format([secondVoice], 330);

    // Render the second voice to the second stave
    secondVoice.draw(context, secondStave);

    if(fillBeam1) fillBeam1.setContext(context).draw();
    if(fillBeam2) fillBeam2.setContext(context).draw();
    if(fillBeam3) fillBeam3.setContext(context).draw();
    if(fillBeam4) fillBeam4.setContext(context).draw();
    
    console.log();
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

const translate = (notation, flag = false) => {

    const dotted = (staveNote, noteIndex = -1) => {
        if (noteIndex < 0) {
            Dot.buildAndAttach([staveNote], {
                all: true
            });
        } 
        else {
            Dot.buildAndAttach([staveNote], {
                index: noteIndex
            });
        }
        return staveNote;
    }

    let pattern = "";
    let notes = [];

    for(let i = 0; i < 4; i++) {
        let note = [];
        
        if(notation.hiHat && notation.kickSnare) {
            if(notation.hiHat[i] || notation.kickSnare[i]) {
                pattern += "1";
    
                if(notation.hiHat[i]) {
                    note.push(constants.HIHAT);
                }
                
                if(notation.kickSnare[i] === 1) {
                    note.push(constants.KICK);
                }
    
                if(notation.kickSnare[i] === 2) {
                    note.push(constants.SNARE);
                }
    
                if(notation.kickSnare[i] === 3) {
                    note.push(constants.KICK);
                    note.push(constants.SNARE);
                }
    
                notes.push(note);
            }
            else {
                pattern += "0";
            }
        }

        if(notation.fill) {
            if(notation.fill[i]) {
                pattern += "1";
                if(flag) {
                    note.push(constants.RACK);
                }
                else {
                    note.push(constants.FLOOR);
                }
                notes.push(note);
            }
            else {
                pattern += "0";
            }
        
        } 
    }

    switch (pattern) {
        case '0000': 
            notes = [
                new StaveNote({ keys: [constants.REST], duration: constants.QUARTER, type: "r" })
            ]; 
            break; 
        case '1000':
            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.QUARTER })
            ];
            break; 
        
        case '0100':
            
            notes = [
                new StaveNote({ keys: [constants.REST], duration:  constants.SIXTEENTH, type: "r" }),
                dotted(new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH_DOT}))
            ];
            break; 
      
        case '0010':
            
            notes = [
                new StaveNote({ keys: [constants.REST], duration:  constants.EIGHTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration:  constants.EIGHTH }),
            ];
            break;    
      
        case '0001':
               
            notes = [
                dotted(new StaveNote({ keys: [constants.REST], duration:  constants.EIGHTH_DOT, type: "r" })),
                new StaveNote({ keys: notes.shift(), duration:  constants.SIXTEENTH })
            ];
            break;
        
        case '1100':
              
            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }), 
                dotted(new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH_DOT }))
            ];
            break;

        case '0110':

            notes = [
                new StaveNote({ keys: [constants.REST], duration: constants.SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH })
            ];
            break;

        case '0011':

            notes = [
                new StaveNote({ keys: [constants.REST], duration: constants.EIGHTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;

        case '1001':

            notes = [
                dotted(new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH_DOT })),  
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;
        
        case '1010':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH }), 
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH })
            ];
            break;
        
        case '0101':

            notes = [
                new StaveNote({ keys: [constants.REST], duration: constants.SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: [constants.REST], duration: constants.SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;

        case '1110':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH}),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH })
            ];
            break;
        
        case '0111':

            notes = [
                new StaveNote({ keys: [constants.REST], duration: constants.SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;
        
        case '1011':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;

        case '1101':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.EIGHTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;

        case '1111':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: constants.SIXTEENTH })
            ];
            break;
        
        default:

    }

    return notes;
}

export const transcribe = (notation, type) => {
    
    
    let translation = [];

    for(let i = 0; i < 4; i++) {

        let notationSplit = {}

        if(type === "groove") {
            notationSplit.hiHat = notation.hiHat.slice(i * 4, (i + 1) * 4);
            notationSplit.kickSnare = notation.kickSnare.slice(i * 4, (i + 1) * 4);
        }

        if(type === "fill") {
            notationSplit.fill = notation.fill.slice(i * 4, (i + 1) * 4);
        }
        if(i == 0 || i == 1) {
            translation.push(translate(notationSplit, true));
        
        }
        else {
            translation.push(translate(notationSplit));
        
        }
    }
    
    return translation;
}