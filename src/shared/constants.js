export default {
    KICK: "f/4",
    FLOOR: "a/4",
    SNARE: "c/5",
    RACK: "e/5",
    HIHAT: "g/5/x2",
    REST: "b/4",

    SIXTEENTH: "16",
    EIGHTH: "8",
    EIGHTH_DOT: "8d",
    QUARTER: "q",

    FILL_PATTERNS: [
        { pattern: [1, 0, 0, 0], description: 'Fill 1' },
        { pattern: [0, 0, 1, 0], description: 'Fill 2' },
        { pattern: [1, 0, 1, 0], description: 'Fill 3' },
        { pattern: [1, 1, 1, 0], description: 'Fill 4' },
        { pattern: [1, 0, 1, 1], description: 'Fill 5' },
        { pattern: [1, 1, 1, 1], description: 'Fill 6' }
    ],

    HIHAT_PATTERNS_COMPLEX: [
        { pattern: [1, 0, 0, 0], description: 'Hi-Hat 1' },
        { pattern: [0, 1, 0, 0], description: 'Hi-Hat 2' },
        { pattern: [1, 0, 1, 0], description: 'Hi-Hat 3' },
        { pattern: [1, 1, 1, 0], description: 'Hi-Hat 4' },
        { pattern: [1, 0, 1, 1], description: 'Hi-Hat 5' },
        { pattern: [1, 1, 1, 1], description: 'Hi-Hat 6' }
    ],

    HIHAT_PATTERNS_SIMPLE: [
        { pattern: [1, 0, 0, 0], description: 'Hi-Hat 1' },
        { pattern: [0, 1, 0, 0], description: 'Hi-Hat 2' },
        { pattern: [1, 0, 1, 0], description: 'Hi-Hat 3' }
    ],

    KICK_SNARE_PATTERNS: [
        { pattern: [1, 0, 2, 0], description: 'Kick / Snare 1' },
        { pattern: [1, 0, 2, 1], description: 'Kick / Snare 2' },
        { pattern: [1, 0, 3, 0], description: 'Kick / Snare 3' },
        { pattern: [1, 1, 2, 0], description: 'Kick / Snare 4' },
        { pattern: [1, 1, 2, 1], description: 'Kick / Snare 5' },
        { pattern: [0, 1, 2, 0], description: 'Kick / Snare 6' },
    ],

    LETTERS: [
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
    ]
}