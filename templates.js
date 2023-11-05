const { StaveNote, Dot } = Vex.Flow;

const KICK = "f/4";
const FLOOR = "a/4";
const SNARE = "c/5";
const RACK = "e/5";
const HIHAT = "g/5/x2";
const REST = "b/4";

const SIXTEENTH = "16";
const EIGHTH = "8";
const EIGHTH_DOT = "8d";
const QUARTER = "q";

const translate = (notation) => {

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
        if(notation.hiHat[i] || notation.kickSnare[i]) {
            pattern += "1";

            if(notation.hiHat[i]) {
                note.push(HIHAT);
            }
            
            if(notation.kickSnare[i] === 1) {
                note.push(KICK);
            }

            if(notation.kickSnare[i] === 2) {
                note.push(SNARE);
            }

            if(notation.kickSnare[i] === 3) {
                note.push(KICK);
                note.push(SNARE);
            }

            notes.push(note);
        }
        else {
            pattern += "0";
        }
    }

    switch (pattern) {
        case '0000': 
            notes = [
                new StaveNote({ keys: [REST], duration: QUARTER, type: "r" })
            ]; 
            break; 
        case '1000':
            notes = [
                new StaveNote({ keys: notes.shift(), duration: QUARTER })
            ];
            break; 
        
        case '0100':
            
            notes = [
                new StaveNote({ keys: [REST], duration:  SIXTEENTH, type: "r" }),
                dotted(new StaveNote({ keys: notes.shift(), duration: EIGHTH_DOT}))
            ];
            break; 
      
        case '0010':
            
            notes = [
                new StaveNote({ keys: [REST], duration:  EIGHTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration:  EIGHTH }),
            ];
            break;    
      
        case '0001':
               
            notes = [
                dotted(new StaveNote({ keys: [REST], duration:  EIGHTH_DOT, type: "r" })),
                new StaveNote({ keys: notes.shift(), duration:  SIXTEENTH })
            ];
            break;
        
        case '1100':
              
            notes = [
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }), 
                dotted(new StaveNote({ keys: notes.shift(), duration: EIGHTH_DOT }))
            ];
            break;

        case '0110':

            notes = [
                new StaveNote({ keys: [REST], duration: SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: EIGHTH })
            ];
            break;

        case '0011':

            notes = [
                new StaveNote({ keys: [REST], duration: EIGHTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;

        case '1001':

            notes = [
                dotted(new StaveNote({ keys: notes.shift(), duration: EIGHTH_DOT })),  
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;
        
        case '1010':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: EIGHTH }), 
                new StaveNote({ keys: notes.shift(), duration: EIGHTH })
            ];
            break;
        
        case '0101':

            notes = [
                new StaveNote({ keys: [REST], duration: SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: [REST], duration: SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;

        case '1110':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH}),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: EIGHTH })
            ];
            break;
        
        case '0111':

            notes = [
                new StaveNote({ keys: [REST], duration: SIXTEENTH, type: "r" }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;
        
        case '1011':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: EIGHTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;

        case '1101':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: EIGHTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;

        case '1111':

            notes = [
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH }),
                new StaveNote({ keys: notes.shift(), duration: SIXTEENTH })
            ];
            break;
        
        default:

    }

    return notes;
}

export const transcribe = (notation) => {
    
    
    let translation = [];

    for(let i = 0; i < 4; i++) {

        let notationSplit = {}
        
        notationSplit.hiHat = notation.hiHat.slice(i * 4, (i + 1) * 4);
        notationSplit.kickSnare = notation.kickSnare.slice(i * 4, (i + 1) * 4);

        translation.push(translate(notationSplit));
    }
    
    return translation;
}