"use client"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type CommandOutput = {
    type: 'command' | 'response' | 'error';
    content: React.ReactNode;
    id: string;
};

export function Terminal({ onClose, onAction }: { onClose?: () => void, onAction?: (action: string) => void }) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<CommandOutput[]>([
        { type: 'response', content: "Welcome to Portfolio OS v2.0. Type 'help' to start.", id: 'init' }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    // Focus input on click
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        const newHistory = [...history, { type: 'command' as const, content: cmd, id: Date.now().toString() }];

        let response: React.ReactNode = "";
        let type: 'response' | 'error' = 'response';

        switch (trimmed) {
            case 'help':
                response = (
                    <div className="space-y-1 text-emerald-400">
                        <div>Available commands:</div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 pl-4">
                            <span className="text-white">about</span> <span>Who am I?</span>
                            <span className="text-white">skills</span> <span>Technical capability matrix</span>
                            <span className="text-white">projects</span> <span>View key projects</span>
                            <span className="text-white">contact</span> <span>Connect with me</span>
                            <span className="text-white">matrix</span> <span>Enter the Matrix</span>
                            <span className="text-white">clear</span> <span>Clear terminal</span>
                            <span className="text-white">exit</span> <span>Close terminal</span>
                        </div>
                    </div>
                );
                break;
            case 'about':
                response = "I am a Full Stack Developer passionate about scalable systems, refined UI/UX, and performance optimization.";
                break;
            case 'skills':
                response = (
                    <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'Tailwind'].map(s => (
                            <span key={s} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">{s}</span>
                        ))}
                    </div>
                );
                break;
            case 'contact':
                response = (
                    <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Linkedin className="w-4 h-4" /> <span>/in/aniruddhapatil</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <Github className="w-4 h-4" /> <span>/Aniruddha1701</span>
                        </div>
                    </div>
                );
                break;
            case 'projects':
                response = "Navigating to Projects...";
                break;
            case 'matrix':
                if (onAction) {
                    onAction('matrix');
                    response = "Wake up, Neo...";
                } else {
                    response = "Matrix mode not available in this environment.";
                }
                break;
            case 'clear':
                setHistory([]);
                setInput("");
                return;
            case 'exit':
                if (onClose) onClose();
                return;
            case '':
                response = "";
                break;
            default:
                response = `Command not found: ${trimmed}. Type 'help' for available commands.`;
                type = 'error';
        }

        if (response) {
            setHistory([...newHistory, { type, content: response, id: (Date.now() + 1).toString() }]);
        } else {
            setHistory(newHistory);
        }
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        }
    };

    return (
        <div className="flex flex-col w-full h-[600px] max-w-3xl bg-black/90 rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm md:text-base relative" onClick={() => inputRef.current?.focus()}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/10 select-none">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 group">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors" />
                    </div>
                    <span className="ml-4 text-xs text-zinc-500 flex items-center gap-1">
                        <TerminalIcon className="w-3 h-3" />
                        guest@portfolio:~
                    </span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-gray-300 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {history.map((item) => (
                    <div key={item.id} className="space-y-1">
                        {item.type === 'command' && (
                            <div className="flex items-center gap-2 text-white">
                                <span className="text-emerald-500">➜</span>
                                <span className="text-cyan-400">~</span>
                                <span>{item.content}</span>
                            </div>
                        )}
                        {item.type === 'response' && (
                            <div className="pl-6 text-gray-300 leading-relaxed">{item.content}</div>
                        )}
                        {item.type === 'error' && (
                            <div className="pl-6 text-red-400">{item.content}</div>
                        )}
                    </div>
                ))}

                {/* Active Input Line */}
                <div className="flex items-center gap-2 text-white pt-2">
                    <span className="text-emerald-500">➜</span>
                    <span className="text-cyan-400">~</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
