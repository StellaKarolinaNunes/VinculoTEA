import { useState, useEffect } from 'react';
import {
    Accessibility, Type, Minus, Plus, Eye, Underline, RefreshCcw, Contrast,
    MousePointer2, PauseCircle, Mic, Volume2, Keyboard, Languages,
    BookOpen, Move, AlignJustify, Brain, Sun, Zap, Fingerprint, Activity, VolumeX,
    User, Ear, HeartHandshake
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { VLibrasWidget } from './VLibrasWidget';
import { ReadingGuide } from './ReadingGuide';

export const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'perfis' | 'cognitivo' | 'visual' | 'motor' | 'auditivo'>('perfis');

    // Auto-open menu on first visit could be annoying, so we skip it.

    const {
        config, toggleMode, activateProfile, setColorBlindness, setSpacing, setTTSSpeed, setBrightness,
        increaseFontSize, decreaseFontSize, reset
    } = useAccessibility();

    const tabs = [
        { id: 'perfis', label: 'Perfis', icon: User },
        { id: 'cognitivo', label: 'Leitura', icon: Brain },
        { id: 'visual', label: 'Visual', icon: Eye },
        { id: 'motor', label: 'Motor', icon: Fingerprint },
        { id: 'auditivo', label: 'Auditivo', icon: Ear },
    ];

    const profiles = [
        { id: 'autismo', label: 'Modo Autismo (TEA)', icon: HeartHandshake, color: 'bg-blue-100 dark:bg-blue-900', text: 'Simplificado, Calmo' },
        { id: 'visual', label: 'Deficiência Visual', icon: Eye, color: 'bg-green-100 dark:bg-green-900', text: 'Leitor de Tela, Voz' },
        { id: 'auditivo', label: 'Surdo / Libras', icon: Languages, color: 'bg-yellow-100 dark:bg-yellow-900', text: 'VLibras, Avisos Visuais' },
        { id: 'tdah', label: 'Modo Foco (TDAH)', icon: Zap, color: 'bg-purple-100 dark:bg-purple-900', text: 'Sem Distrações' },
        { id: 'leitura', label: 'Dislexia / Leitura', icon: BookOpen, color: 'bg-orange-100 dark:bg-orange-900', text: 'Fonte Especial, Régua' },
        { id: 'motor', label: 'Motor / Idoso', icon: MousePointer2, color: 'bg-pink-100 dark:bg-pink-900', text: 'Botões Grandes' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end print:hidden font-sans">

            <div dangerouslySetInnerHTML={{ __html: `<div widget-vlibras></div>` }} />
            {config.vlibras && <VLibrasWidget active={config.vlibras} />}
            <ReadingGuide />

            {isOpen && (
                <div className="mb-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-200 overflow-hidden flex flex-col max-h-[85vh]">

                    {/* Header */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                        <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                            <Accessibility className="text-primary" />
                            Acessibilidade <span className="text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full">Pro</span>
                        </h3>
                        <button onClick={reset} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-red-50 rounded-lg">
                            <RefreshCcw size={14} /> Redefinir
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 shrink-0 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all min-w-[60px] ${activeTab === tab.id
                                        ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                <tab.icon size={18} className="mb-1" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                        {/* PERFIS (HOME) */}
                        {activeTab === 'perfis' && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                <p className="text-xs text-slate-500 text-center mb-1">Selecione um perfil para ativar configurações recomendadas</p>
                                {profiles.map(profile => (
                                    <button
                                        key={profile.id}
                                        onClick={() => activateProfile(profile.id as any)}
                                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all border-2 text-left group
                                            ${config.activeProfile === profile.id
                                                ? 'bg-primary text-white border-primary shadow-lg scale-[1.02]'
                                                : `${profile.color} border-transparent hover:border-slate-300 dark:hover:border-slate-600`
                                            }
                                        `}
                                    >
                                        <div className={`p-3 rounded-full bg-white/20 ${config.activeProfile === profile.id ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                            <profile.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${config.activeProfile === profile.id ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{profile.label}</h4>
                                            <p className={`text-[10px] ${config.activeProfile === profile.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>{profile.text}</p>
                                        </div>
                                        {config.activeProfile === profile.id && (
                                            <div className="ml-auto bg-white text-primary text-[10px] font-bold px-2 py-1 rounded-full">ATIVO</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* COGNITIVO & LEITURA */}
                        {activeTab === 'cognitivo' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Tamanho Texto ({config.fontSize}%)</label>
                                    <div className="flex gap-2">
                                        <button onClick={decreaseFontSize} className="btn-access flex-1"><Minus /> A-</button>
                                        <button onClick={increaseFontSize} className="btn-access flex-1"><Plus /> A+</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.dyslexia} onClick={() => toggleMode('dyslexia')} icon={BookOpen} label="Modo Dislexia" />
                                    <MenuToggle active={config.readableFont} onClick={() => toggleMode('readableFont')} icon={Type} label="Fonte Legível" />
                                    <MenuToggle active={config.lineFocus} onClick={() => toggleMode('lineFocus')} icon={Move} label="Guia de Leitura" />
                                    <MenuToggle active={config.simplified} onClick={() => toggleMode('simplified')} icon={AlignJustify} label="Modo Simplificado" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Espaçamento</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        {['normal', 'wide', 'extra-wide'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSpacing(s as any)}
                                                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${config.spacing === s ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}
                                            >
                                                {s === 'normal' ? '1x' : s === 'wide' ? '1.5x' : '2x'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Velocidade Voz ({config.ttsSpeed}x)</label>
                                    <input type="range" min="0.5" max="2" step="0.25" value={config.ttsSpeed} onChange={(e) => setTTSSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>
                            </div>
                        )}

                        {/* VISUAL */}
                        {activeTab === 'visual' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.contraste} onClick={() => toggleMode('contraste')} icon={Contrast} label="Alto Contraste" />
                                    <MenuToggle active={config.negative} onClick={() => toggleMode('negative')} icon={Contrast} label="Inverter Cores" />
                                    <MenuToggle active={config.grayscale} onClick={() => toggleMode('grayscale')} icon={Eye} label="Escala Cinza" />
                                    <MenuToggle active={config.bigCursor} onClick={() => toggleMode('bigCursor')} icon={MousePointer2} label="Cursor Maior" />
                                    <MenuToggle active={config.pauseAnimations} onClick={() => toggleMode('pauseAnimations')} icon={PauseCircle} label="Parar Animações" />
                                    <MenuToggle active={config.focusMode} onClick={() => toggleMode('focusMode')} icon={Zap} label="Modo Foco" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Filtro de Daltonismo</label>
                                    <select className="w-full p-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700" value={config.colorBlindness} onChange={(e) => setColorBlindness(e.target.value as any)}>
                                        <option value="none">Nenhum</option>
                                        <option value="protanopia">Protanopia (Vermelho)</option>
                                        <option value="deuteranopia">Deuteranopia (Verde)</option>
                                        <option value="tritanopia">Tritanopia (Azul)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Brilho ({config.brightness}%)</label>
                                    <input type="range" min="20" max="100" step="10" value={config.brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>
                            </div>
                        )}

                        {/* MOTOR */}
                        {activeTab === 'motor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.keyboardFocus} onClick={() => toggleMode('keyboardFocus')} icon={Keyboard} label="Foco Teclado" />
                                    <MenuToggle active={config.giantButtons} onClick={() => toggleMode('giantButtons')} icon={Fingerprint} label="Botões Gigantes" />
                                    <MenuToggle active={config.voiceControl} onClick={() => toggleMode('voiceControl')} icon={Mic} label="Comando de Voz" />
                                    <MenuToggle active={config.smartMagnifier} onClick={() => toggleMode('smartMagnifier')} icon={Sun} label="Lupa Inteligente" />
                                </div>
                            </div>
                        )}

                        {/* AUDITIVO */}
                        {activeTab === 'auditivo' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.screenReader} onClick={() => toggleMode('screenReader')} icon={Volume2} label="Leitor de Tela" />
                                    <MenuToggle active={config.vlibras} onClick={() => toggleMode('vlibras')} icon={Languages} label="VLibras Widget" />
                                    <MenuToggle active={config.visualNotifications} onClick={() => toggleMode('visualNotifications')} icon={Zap} label="Alertas Visuais" />
                                    <MenuToggle active={config.adaptiveVibration} onClick={() => toggleMode('adaptiveVibration')} icon={Activity} label="Vibração" />
                                    <MenuToggle active={config.antiAnxiety} onClick={() => toggleMode('antiAnxiety')} icon={VolumeX} label="Modo Calmo" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[9px] text-slate-400">VinculoTEA Accessibility Suite v5.0 (Perfis)</p>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 z-[9001]
                    ${isOpen
                        ? 'bg-slate-800 text-white rotate-90 scale-110 ring-4 ring-white dark:ring-slate-700'
                        : 'bg-primary text-white hover:scale-110 hover:shadow-primary/40'
                    }
                `}
                aria-label="Menu de Acessibilidade"
            >
                <Accessibility size={28} strokeWidth={2} />
            </button>
        </div>
    );
};

const MenuToggle = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 text-center min-h-[80px] border-2
            ${active
                ? 'bg-primary/5 border-primary text-primary shadow-sm font-bold'
                : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400'
            }
        `}
    >
        <Icon size={24} strokeWidth={2} className={active ? "text-primary fill-primary/20" : "text-slate-400"} />
        <span className="text-[10px] leading-tight">{label}</span>
    </button>
);
