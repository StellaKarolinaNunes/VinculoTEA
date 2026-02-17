import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { X, Delete, ArrowUp, Space, ChevronDown } from 'lucide-react';

export const VirtualKeyboard = () => {
    const { config, toggleMode } = useAccessibility();
    const [shift, setShift] = useState(false);
    const [caps, setCaps] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: window.innerHeight - 300 });
    const [isDragging, setIsDragging] = useState(false);

    if (!config.virtualKeyboard) return null;

    const keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', 'Enter'],
        ['Space']
    ];

    const handleKeyPress = (key: string) => {
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart || 0;
            const end = activeElement.selectionEnd || 0;
            const value = activeElement.value;

            let char = key;
            if (key === 'Space') char = ' ';
            if (key === 'Backspace') {
                activeElement.value = value.substring(0, start - 1) + value.substring(end);
                activeElement.setSelectionRange(start - 1, start - 1);
                return;
            }
            if (key === 'Enter') char = '\n';
            if (key === 'Shift') {
                setShift(!shift);
                return;
            }

            if (shift || caps) char = char.toUpperCase();

            activeElement.value = value.substring(0, start) + char + value.substring(end);
            activeElement.setSelectionRange(start + 1, start + 1);

            if (shift) setShift(false); // Auto release shift

            // Dispatch input event for React/hooks to pick up change
            const event = new Event('input', { bubbles: true });
            activeElement.dispatchEvent(event);
        }
    };

    return (
        <div
            className="fixed z-[10000] bg-slate-100 dark:bg-slate-800 shadow-2xl rounded-t-3xl border-t border-slate-300 dark:border-slate-600 p-4 transition-all w-full max-w-4xl left-1/2 -translate-x-1/2"
            style={{ bottom: 0 }}
        >
            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Teclado Virtual</span>
                </div>
                <button
                    onClick={() => toggleMode('virtualKeyboard')}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500"
                >
                    <ChevronDown size={20} />
                </button>
            </div>

            <div className="flex flex-col gap-2 select-none">
                {keys.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1.5">
                        {row.map((key) => {
                            let label: any = key;
                            let width = 'w-10 sm:w-14';
                            let bg = 'bg-white dark:bg-slate-700';

                            if (key === 'Space') {
                                width = 'w-64 sm:w-96';
                                label = <Space size={18} />;
                            }
                            if (key === 'Backspace') {
                                width = 'w-20';
                                label = <Delete size={18} />;
                                bg = 'bg-red-50 text-red-500 dark:bg-red-900/20';
                            }
                            if (key === 'Shift') {
                                width = 'w-20';
                                label = <ArrowUp size={18} className={shift ? 'text-primary' : ''} />;
                                bg = shift ? 'bg-primary/10 border-primary' : 'bg-slate-200 dark:bg-slate-600';
                            }
                            if (key === 'Enter') {
                                width = 'w-20';
                                bg = 'bg-primary text-white';
                            }

                            return (
                                <button
                                    key={key}
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent losing focus
                                        handleKeyPress(key);
                                    }}
                                    onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
                                    className={`${width} h-12 rounded-xl shadow-sm border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-lg active:scale-95 active:border-b-0 transition-all ${bg}`}
                                >
                                    {(shift || caps) && key.length === 1 ? key.toUpperCase() : label}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
