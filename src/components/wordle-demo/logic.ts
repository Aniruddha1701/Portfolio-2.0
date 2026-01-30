export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface EvaluatedLetter {
    letter: string;
    status: LetterStatus;
}

export function evaluateGuess(target: string, guess: string): LetterStatus[] {
    const result: LetterStatus[] = new Array(5).fill('absent');
    const targetArr = target.split('');
    const guessArr = guess.split('');

    // First pass: Find correct matches (green)
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetArr[i] = ''; // Mark as used
            guessArr[i] = ''; // Mark as processed
        }
    }

    // Second pass: Find present matches (yellow)
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === '') continue; // Already handled (green)

        const indexInTarget = targetArr.indexOf(guessArr[i]);
        if (indexInTarget !== -1) {
            result[i] = 'present';
            targetArr[indexInTarget] = ''; // Mark as used to prevent double counting
        }
    }

    return result;
}

export function isValidWord(word: string): boolean {
    return /^[A-Z]{5}$/.test(word);
}
