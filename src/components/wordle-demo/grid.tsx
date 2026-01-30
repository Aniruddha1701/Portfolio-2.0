import { motion } from "framer-motion";
import { LetterStatus } from "./logic";
import { clsx } from "clsx";

interface GridProps {
    guesses: string[];
    currentGuess: string;
    statuses: LetterStatus[][]; // 2D array of statuses for completed guesses
    turn: number; // Current attempt (0-5)
    isShaking: boolean; // Added
}

const Row = ({ guess, status, isCurrent, isCompleted, isShaking }: { guess: string, status?: LetterStatus[], isCurrent?: boolean, isCompleted?: boolean, isShaking?: boolean }) => {
    return (
        <div className="flex gap-2 mb-2 justify-center">
            <motion.div
                className="flex gap-2"
                animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {Array.from({ length: 5 }).map((_, i) => {
                    const letter = guess[i] || "";
                    const letterStatus = status ? status[i] : 'empty';

                    // Dynamic styles based on status
                    const bgClass = clsx(
                        "w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase select-none transition-colors duration-500 rounded-lg", // rounded-lg for softer look
                        {
                            "border-gray-700 bg-transparent text-white": letterStatus === 'empty' && !letter,
                            "border-gray-500 bg-transparent text-white animate-pulse-short": letterStatus === 'empty' && letter && isCurrent, // Typing pop
                            "bg-[#538d4e] border-[#538d4e] text-white": letterStatus === 'correct',
                            "bg-[#b59f3b] border-[#b59f3b] text-white": letterStatus === 'present',
                            "bg-[#3a3a3c] border-[#3a3a3c] text-white": letterStatus === 'absent',
                        }
                    );

                    return (
                        <motion.div
                            key={i}
                            className={bgClass}
                            initial={isCompleted ? { rotateX: 0 } : false}
                            animate={isCompleted ? { rotateX: 360 } : { scale: letter && isCurrent ? 1.1 : 1 }}
                            transition={{
                                duration: 0.6,
                                delay: isCompleted ? i * 0.1 : 0,
                                type: isCurrent ? "spring" : "tween"
                            }}
                            aria-label={letterStatus !== 'empty' ? `${letter} ${letterStatus}` : "Empty"}
                            role="img"
                        >
                            {letter}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export function Grid({ guesses, currentGuess, statuses, turn, isShaking }: GridProps) {
    // Empty rows to fill up to 6
    const empties = Array.from({ length: Math.max(0, 5 - turn) });

    return (
        <div className="w-full flex flex-col">
            {/* Completed/Active Rows */}
            {guesses.slice(0, 6).map((guess, i) => (
                <Row
                    key={i}
                    guess={guess}
                    status={statuses[i]}
                    isCompleted={true}
                />
            ))}

            {/* Current Row (if game not over and turns < 6) */}
            {turn < 6 && (
                <Row
                    guess={currentGuess}
                    status={undefined}
                    isCurrent={true}
                    isShaking={isShaking}
                />
            )}

            {/* Empty Rows */}
            {empties.map((_, i) => (
                <Row key={`empty-${i}`} guess="" isCompleted={false} />
            ))}
        </div>
    );
}
