import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Search, Loader2, X, Mic } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { NumericNavigation } from './NumericNavigation';
import { TextMagnifier } from './TextMagnifier';
import { DictionaryTool } from './DictionaryTool';
import { VLibrasWidget } from './VLibrasWidget';

export const SmartTools = () => {
    const { config } = useAccessibility();

    return (
        <>
            {config.smartMagnifier && <TextMagnifier />}
            {config.pageSummary && <PageSummary />}
            {config.voiceControl && <VoiceControlOverlay />}
            {config.virtualKeyboard && <VirtualKeyboard />}
            {config.smartNavigation && <NumericNavigation />}
            {config.dictionary && <DictionaryTool />}
            {config.captions && <CaptionsOverlay />}
            {config.vlibras && <VLibrasWidget active={config.vlibras} />}
        </>
    );
};

const CaptionsOverlay = () => {
    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9990] bg-black/80 text-yellow-400 px-6 py-4 rounded-xl text-xl font-medium shadow-2xl backdrop-blur-sm pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-500 text-center max-w-2xl border border-white/10">
            <p>[Legendas] Simulação de legendas em tempo real ativada...</p>
        </div>
    );
};

const PageSummary = () => {
    const [summary, setSummary] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { toggleMode } = useAccessibility();

    useEffect(() => {

        const extractContent = () => {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent || '');
            const paragraphs = Array.from(document.querySelectorAll('p')).slice(0, 3).map(p => p.textContent || '');


            const content = [...headings, ...paragraphs]
                .filter(t => t.length > 20)
                .slice(0, 5);

            setSummary(content.length > 0 ? content : ['Nenhum conteúdo principal detectado.']);
            setLoading(false);
        };


        const timer = setTimeout(extractContent, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-primary/10 p-2 rounded-lg text-primary">📑</span>
                        Resumo da Página
                    </h3>
                    <button onClick={() => toggleMode('pageSummary')} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center text-slate-400">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p>Analisando conteúdo...</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {summary.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <span className="font-black text-primary/50 text-sm">{(idx + 1).toString().padStart(2, '0')}</span>
                                <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400">Gerado automaticamente pela Acessibilidade Inteligente</p>
                </div>
            </div>
        </div>
    );
};

const VoiceControlOverlay = () => {

    return (
        <div className="fixed top-4 right-4 z-[9995] bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Mic size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Ouvindo...</span>
        </div>
    );
};
