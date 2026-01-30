"use client"

import { useState, useEffect, useCallback } from "react";
import { Grid } from "./grid";
import { Keyboard } from "./keyboard";
import { SOLUTIONS, VALID_GUESSES } from "./dictionary";
import { evaluateGuess, isValidWord, LetterStatus } from "./logic";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, RefreshCcw, Trophy, AlertCircle, Code, Book, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Only select a new word on client mount to avoid hydration mismatch
const getRandomWord = () => SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)];

// O(1) Lookup for validation
const VALID_GUESSES_SET = new Set(VALID_GUESSES);

export function WordleGame({ onClose }: { onClose?: () => void }) {
    const [solution, setSolution] = useState<string>("");
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [isGameWon, setIsGameWon] = useState(false);
    const [isGameLost, setIsGameLost] = useState(false);
    const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0 });
    const [showExplanation, setShowExplanation] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // Initialize game on client side only
    useEffect(() => {
        setSolution(getRandomWord());
        // Load stats
        const savedStats = localStorage.getItem("wordle-stats");
        if (savedStats) setStats(JSON.parse(savedStats));
    }, []);

    const onKey = useCallback((key: string) => {
        if (isGameWon || isGameLost) return;

        if (key === "BACKSPACE") {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }

        if (key === "ENTER") {
            if (currentGuess.length !== 5) {
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
                return;
            }

            if (!VALID_GUESSES_SET.has(currentGuess)) {
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
                return;
            }

            // Submit guess
            const newGuesses = [...guesses, currentGuess];
            setGuesses(newGuesses);
            setCurrentGuess("");

            if (currentGuess === solution) {
                setIsGameWon(true);
                updateStats(true);
                setShowExplanation(true); // Auto-show explanation on win
            } else if (newGuesses.length >= 6) {
                setIsGameLost(true);
                updateStats(false);
                setShowExplanation(true); // Auto-show explanation on loss
            }
            return;
        }

        if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
            setCurrentGuess((prev) => prev + key);
        }
    }, [currentGuess, guesses, isGameWon, isGameLost, solution]);

    // Handle physical keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const key = e.key.toUpperCase();
            if (key === "BACKSPACE" || key === "ENTER") {
                onKey(key);
            } else if (/^[A-Z]$/.test(key)) {
                onKey(key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onKey]);

    const updateStats = (win: boolean) => {
        setStats((prev) => {
            const newStats = {
                played: prev.played + 1,
                wins: win ? prev.wins + 1 : prev.wins,
                streak: win ? prev.streak + 1 : 0
            };
            localStorage.setItem("wordle-stats", JSON.stringify(newStats));
            return newStats;
        });
    };

    const resetGame = () => {
        setSolution(getRandomWord());
        setGuesses([]);
        setCurrentGuess("");
        setIsGameWon(false);
        setIsGameLost(false);
        setShowExplanation(false);
    };

    // Derive statuses for display
    const guessStatuses = guesses.map(guess => evaluateGuess(solution, guess));

    // Calculate used key statuses
    const usedKeys: { [key: string]: string } = {};
    guesses.forEach((guess, i) => {
        const statuses = guessStatuses[i];
        guess.split('').forEach((letter, j) => {
            const status = statuses[j];
            const currentStatus = usedKeys[letter];

            if (status === 'correct') {
                usedKeys[letter] = 'correct';
            } else if (status === 'present' && currentStatus !== 'correct') {
                usedKeys[letter] = 'present';
            } else if (status === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
                usedKeys[letter] = 'absent';
            }
        });
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full max-w-5xl mx-auto p-4 md:p-8">

            {/* Game Area */}
            <div className="flex-1 w-full max-w-md bg-zinc-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-emerald-400" />
                                Constraint Logic Demo
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                                An interactive constraint-based guessing system demonstrating state management, edge-case handling, and feedback-driven UX.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {/* Explanation Toggle */}
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white/50 hover:text-white" onClick={() => setShowExplanation(!showExplanation)} title="Explain Logic">
                                <HelpCircle className="w-5 h-5" />
                            </Button>
                            {/* Reset Button */}
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white/50 hover:text-white" onClick={resetGame} title="Reset">
                                <RefreshCcw className="w-5 h-5" />
                            </Button>
                            {/* Close Button (if in Modal) */}
                            {onClose && (
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400/50 hover:text-rose-400" onClick={onClose} title="Close Demo">
                                    <X className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <Grid
                    guesses={guesses}
                    currentGuess={currentGuess}
                    statuses={guessStatuses}
                    turn={guesses.length}
                    isShaking={isShaking}
                />

                <Keyboard onKey={onKey} usedKeys={usedKeys} />
            </div>

            {/* Logic / Explanation Panel */}
            <AnimatePresence>
                {(showExplanation || isGameWon || isGameLost) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full lg:w-80 bg-zinc-900/80 p-6 rounded-2xl border border-white/10 space-y-6"
                    >
                        {/* Game Over Status */}
                        {(isGameWon || isGameLost) && (
                            <div className="text-center pb-6 border-b border-white/10">
                                {isGameWon ? (
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="text-emerald-400 font-bold text-2xl mb-2"
                                    >
                                        System Optimized! 🚀
                                    </motion.div>
                                ) : (
                                    <div className="text-rose-400 font-bold text-2xl mb-2">
                                        Optimization Failed
                                    </div>
                                )}
                                <div className="text-gray-400">
                                    Target Term: <span className="font-mono text-white font-bold tracking-widest">{solution}</span>
                                </div>
                                <Button onClick={resetGame} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                                    Run New Diagnostics
                                </Button>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl text-center">
                                <div className="text-2xl font-bold text-white">{stats.played}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Runs</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl text-center">
                                <div className="text-2xl font-bold text-emerald-400">{stats.streak}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Streak</div>
                            </div>
                        </div>

                        {/* Explanation of Algorithm */}
                        <div className="space-y-3 text-sm text-gray-300">
                            <h4 className="font-semibold text-white flex items-center gap-2">
                                <Code className="w-4 h-4 text-cyan-400" />
                                Developer Insight: O(n) Evaluation
                            </h4>
                            <p className="font-medium text-white/90">
                                "The core challenge in Wordle is correctly handling repeated letters and evaluation order, which requires a two-pass matching algorithm."
                            </p>

                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px] sm:text-xs text-gray-400 overflow-x-auto">
                                <pre>{`// Pass 1: Green (Exact)
for i in 0..4:
  if guess[i] == target[i]:
    mark GREEN
    decrement targetLetterCount[guess[i]]

// Pass 2: Yellow (Present)
for i in 0..4:
  if not GREEN:
    // ... mark yellow/gray based on remaining count`}</pre>
                            </div>

                            <div className="space-y-3 pt-2">
                                <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
                                    <Book className="w-4 h-4 text-purple-400" />
                                    Two-Dictionary System
                                </h4>
                                <p className="text-xs text-gray-300">
                                    To ensure meaningful gameplay, guesses are validated against a large dictionary (O(1) Set lookup), while solutions are picked from a curated list of technical terms.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
