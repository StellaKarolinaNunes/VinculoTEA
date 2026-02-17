import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Book, Loader2, Volume2, X } from 'lucide-react';

export const DictionaryTool = () => {
    const { config } = useAccessibility();
    const [selection, setSelection] = useState('');
    const [definition, setDefinition] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!config.dictionary) return;

        const handleSelection = () => {
            const text = window.getSelection()?.toString().trim();
            if (text && text.length > 1 && text.split(' ').length === 1 && /^[a-zA-Z]+$/.test(text)) {
                const range = window.getSelection()?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();
                if (rect) {
                    setPosition({ x: rect.left, y: rect.bottom + window.scrollY });
                    setSelection(text);
                    fetchDefinition(text);
                }
            } else {
                setSelection('');
                setDefinition(null);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, [config.dictionary]);

    const fetchDefinition = async (word: string) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setDefinition(data[0]);
            } else {
                setDefinition(null);
            }
        } catch (e) {
            setDefinition(null);
        }
        setLoading(false);
    };

    if (!config.dictionary || !selection) return null;

    return (
        <div
            className="absolute z-[10000] bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 w-72 animate-in zoom-in-95 duration-200"
            style={{ top: position.y + 10, left: Math.min(position.x, window.innerWidth - 300) }}
        >
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg capitalize text-primary flex items-center gap-2">
                        {selection}
                        {definition?.phonetics?.[0]?.audio && (
                            <button
                                onClick={() => new Audio(definition.phonetics[0].audio).play()}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-primary transition-colors"
                            >
                                <Volume2 size={14} />
                            </button>
                        )}
                    </h4>
                    {definition?.phonetic && <span className="text-xs text-slate-400 font-mono">{definition.phonetic}</span>}
                </div>
                <button onClick={() => setSelection('')} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
            </div>

            <div className="p-3 max-h-48 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-4 text-slate-400"><Loader2 className="animate-spin" /></div>
                ) : definition ? (
                    <div className="space-y-3">
                        {definition.meanings?.map((meaning: any, i: number) => (
                            <div key={i}>
                                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{meaning.partOfSpeech}</span>
                                <ul className="mt-1 space-y-1">
                                    {meaning.definitions?.slice(0, 2).map((def: any, j: number) => (
                                        <li key={j} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">• {def.definition}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2">Definição não encontrada.</p>
                )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2 text-[10px] text-slate-400 text-center rounded-b-xl border-t border-slate-100 dark:border-slate-800">
                Oxford English Dictionary (Free API)
            </div>
        </div>
    );
};
