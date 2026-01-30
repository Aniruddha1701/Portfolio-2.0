import { clsx } from "clsx";
import { Delete, CornerDownLeft } from "lucide-react";

interface KeyboardProps {
    onKey: (key: string) => void;
    usedKeys: { [key: string]: string }; // 'correct', 'present', 'absent'
}

const ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export function Keyboard({ onKey, usedKeys }: KeyboardProps) {
    return (
        <div className="w-full flex flex-col gap-2 mt-4 px-1 md:px-0">
            {ROWS.map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5">
                    {row.map((key) => {
                        const status = usedKeys[key];
                        const isSpecial = key.length > 1;

                        return (
                            <button
                                key={key}
                                onClick={() => onKey(key)}
                                className={clsx(
                                    "flex items-center justify-center rounded font-bold text-sm transition-all active:scale-95 select-none",
                                    isSpecial ? "px-3 md:px-4 py-3 bg-gray-600 text-white text-xs" : "w-8 h-10 md:w-10 md:h-12 bg-gray-700 text-white", // Default
                                    {
                                        "bg-[#538d4e]": status === 'correct',
                                        "bg-[#b59f3b]": status === 'present',
                                        "bg-[#3a3a3c]": status === 'absent' && !isSpecial,
                                    }
                                )}
                            >
                                {key === 'ENTER' ? <CornerDownLeft size={16} /> : key === 'BACKSPACE' ? <Delete size={16} /> : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
