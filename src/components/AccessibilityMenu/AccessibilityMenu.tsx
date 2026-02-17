import { useState, useEffect } from 'react';
import {
    Accessibility, Type, Minus, Plus, Eye, Underline, RefreshCcw, Contrast,
    MousePointer2, PauseCircle, Mic, Volume2, Keyboard, Languages,
    BookOpen, Move, AlignJustify, Brain, Sun, Zap, Fingerprint, Activity, VolumeX,
    User, Ear, HeartHandshake, Layout, Compass, FileText, Subtitles, Grid3x3, Highlighter, Palette, Search,
    Cloud, Sparkles, Headphones, Settings
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { VLibrasWidget } from './VLibrasWidget';
import { SmartTools } from './SmartTools';
import { AccessibilityTutorial } from './AccessibilityTutorial';
import { ReadingGuide } from './ReadingGuide';

import { ComplianceReport } from './ComplianceReport';
import { VoiceCommander } from './VoiceCommander';
import { SpatialAudio } from './SpatialAudio';
import { CloudSync } from './CloudSync';
import { AutoDetector } from './AutoDetector';

export const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [activeTab, setActiveTab] = useState<'perfis' | 'cognitivo' | 'visual' | 'motor' | 'auditivo' | 'ajustes'>('perfis');



    const {
        config, toggleMode, activateProfile, setColorBlindness, setSpacing, setTTSSpeed, setBrightness,
        increaseFontSize, decreaseFontSize, setContrastTheme, setSaturation, setCursorColor,
        setFontFamily, setClickDelay, reset, setTutorialCompleted
    } = useAccessibility();

    const tabs = [
        { id: 'perfis', label: 'Perfis', icon: User },
        { id: 'visual', label: 'Visual', icon: Eye },
        { id: 'cognitivo', label: 'Leitura', icon: Brain },
        { id: 'motor', label: 'Motor', icon: Fingerprint },
        { id: 'auditivo', label: 'Auditivo', icon: Ear },
        { id: 'ajustes', label: 'Ajustes', icon: Settings },
    ];

    const profiles = [
        { id: 'autismo', label: 'Modo Autismo (TEA)', icon: HeartHandshake, color: 'bg-blue-100 dark:bg-blue-900', text: 'Simplificado, Calmo' },
        { id: 'visual', label: 'Deficiência Visual', icon: Eye, color: 'bg-green-100 dark:bg-green-900', text: 'Leitor de Tela, Voz' },
        { id: 'baixa_visao', label: 'Baixa Visão', icon: Eye, color: 'bg-emerald-100 dark:bg-emerald-900', text: 'Zoom, Alto Contraste' },
        { id: 'daltonismo', label: 'Daltonismo', icon: Palette, color: 'bg-teal-100 dark:bg-teal-900', text: 'Filtros de Cor' },
        { id: 'auditivo', label: 'Surdo / Libras', icon: Languages, color: 'bg-yellow-100 dark:bg-yellow-900', text: 'VLibras, Avisos' },
        { id: 'tdah', label: 'Modo Foco (TDAH)', icon: Zap, color: 'bg-purple-100 dark:bg-purple-900', text: 'Sem Distrações' },
        { id: 'dislexia', label: 'Dislexia / Leitura', icon: BookOpen, color: 'bg-orange-100 dark:bg-orange-900', text: 'Fonte Especial, Régua' },
        { id: 'alfabetizacao', label: 'Alfabetização', icon: Type, color: 'bg-indigo-100 dark:bg-indigo-900', text: 'Apoio Visual' },
        { id: 'motor', label: 'Motor / Idoso', icon: MousePointer2, color: 'bg-pink-100 dark:bg-pink-900', text: 'Botões Grandes' },
        { id: 'epilepsia', label: 'Modo Epilepsia', icon: Activity, color: 'bg-slate-200 dark:bg-slate-700', text: 'Seguro, Sem Flash' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end print:hidden font-sans">
            <div dangerouslySetInnerHTML={{ __html: `<div widget-vlibras></div>` }} />
            {config.vlibras && <VLibrasWidget active={config.vlibras} />}

            <SmartTools />
            <ReadingGuide />
            <AccessibilityTutorial />

            <VoiceCommander />
            <SpatialAudio />
            <CloudSync />
            <AutoDetector />

            {isOpen && (
                <div className="mb-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-200 overflow-hidden flex flex-col max-h-[85vh]">

                    { }
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setTutorialCompleted(false)}
                                className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors text-primary"
                                title="Reiniciar Tutorial"
                            >
                                <Brain size={16} />
                            </button>
                            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                                <Accessibility className="text-primary" />
                                Acessibilidade
                            </h3>
                        </div>
                        <button onClick={reset} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-red-50 rounded-lg">
                            <RefreshCcw size={14} /> Redefinir
                        </button>
                    </div>

                    { }
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

                    { }
                    <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                        { }
                        {activeTab === 'perfis' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <p className="text-xs text-slate-500 text-center mb-3">Selecione um perfil para ativar configurações recomendadas</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {profiles.map(profile => (
                                        <button
                                            key={profile.id}
                                            onClick={() => activateProfile(profile.id as any)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 text-center group relative overflow-hidden min-h-[120px]
                                                ${config.activeProfile === profile.id
                                                    ? 'bg-primary border-primary shadow-lg ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 scale-[1.02]'
                                                    : `${profile.color} border-transparent hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5`
                                                }
                                            `}
                                        >
                                            <div className={`p-2.5 rounded-full mb-2 transition-colors ${config.activeProfile === profile.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-white/60 dark:bg-black/20 text-slate-700 dark:text-slate-200'
                                                }`}>
                                                <profile.icon size={28} strokeWidth={1.5} />
                                            </div>

                                            <span className={`font-bold text-xs leading-tight mb-1 ${config.activeProfile === profile.id ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                                                }`}>
                                                {profile.label}
                                            </span>

                                            <span className={`text-[9px] leading-tight ${config.activeProfile === profile.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                                                }`}>
                                                {profile.text}
                                            </span>

                                            {config.activeProfile === profile.id && (
                                                <div className="absolute top-2 right-2 flex">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        { }
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
                                    <MenuToggle active={config.structureMap} onClick={() => toggleMode('structureMap')} icon={Layout} label="Estrutura do Site" />
                                    <MenuToggle active={config.smartNavigation} onClick={() => toggleMode('smartNavigation')} icon={Compass} label="Nav. Inteligente" />
                                    <MenuToggle active={config.pageSummary} onClick={() => toggleMode('pageSummary')} icon={FileText} label="Resumir Página" />
                                    <MenuToggle active={config.syllableHighlight} onClick={() => toggleMode('syllableHighlight')} icon={Type} label="Destaque Sílabas" />
                                    <MenuToggle active={config.dictionary} onClick={() => toggleMode('dictionary')} icon={BookOpen} label="Dicionário" />
                                    <MenuToggle active={config.distractionFree} onClick={() => toggleMode('distractionFree')} icon={Zap} label="Sem Distrações" />
                                </div>



                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Fonte</label>
                                    <select className="w-full p-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700" value={config.fontFamily} onChange={(e) => setFontFamily(e.target.value as any)}>
                                        <option value="default">Padrão</option>
                                        <option value="opendyslexic">OpenDyslexic</option>
                                        <option value="arial">Arial</option>
                                        <option value="comicsans">Comic Sans (Amigável)</option>
                                    </select>
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

                        { }
                        {activeTab === 'visual' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.highlightLinks} onClick={() => toggleMode('highlightLinks')} icon={Underline} label="Destacar Links" />
                                    <MenuToggle active={config.highlightHeaders} onClick={() => toggleMode('highlightHeaders')} icon={Layout} label="Destacar Cabeçalhos" />
                                    <MenuToggle active={config.bigCursor} onClick={() => toggleMode('bigCursor')} icon={MousePointer2} label="Cursor Maior" />
                                    <MenuToggle active={config.pauseAnimations} onClick={() => toggleMode('pauseAnimations')} icon={PauseCircle} label="Parar Animações" />
                                    <MenuToggle active={config.focusMode} onClick={() => toggleMode('focusMode')} icon={Zap} label="Modo Foco" />
                                    <MenuToggle active={config.hideImages} onClick={() => toggleMode('hideImages')} icon={Eye} label="Ocultar Imagens" />
                                    <MenuToggle active={config.smartMagnifier} onClick={() => toggleMode('smartMagnifier')} icon={Search} label="Lupa Inteligente" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Tema de Contraste</label>
                                    <select className="w-full p-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700" value={config.contrastTheme} onChange={(e) => setContrastTheme(e.target.value as any)}>
                                        <option value="default">Padrão</option>
                                        <option value="high-contrast-light">Alto Contraste Claro</option>
                                        <option value="high-contrast-dark">Alto Contraste Escuro</option>
                                        <option value="yellow-on-black">Amarelo em Preto</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Saturação</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        {['normal', 'low', 'high', 'monochrome'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSaturation(s as any)}
                                                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${config.saturation === s ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}
                                            >
                                                {s === 'normal' ? 'Norm' : s === 'low' ? 'Baixa' : s === 'high' ? 'Alta' : 'Mono'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Cor do Cursor</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-x-auto no-scrollbar">
                                        {['default', 'white', 'black', 'yellow', 'cyan'].map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setCursorColor(c as any)}
                                                className={`flex-1 py-1 px-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${config.cursorColor === c ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}
                                            >
                                                {c === 'default' ? 'Padrão' : c === 'white' ? 'BR' : c === 'black' ? 'PT' : c === 'yellow' ? 'AM' : 'CI'}
                                            </button>
                                        ))}
                                    </div>
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

                        { }
                        {activeTab === 'motor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.keyboardFocus} onClick={() => toggleMode('keyboardFocus')} icon={Keyboard} label="Foco Teclado" />
                                    <MenuToggle active={config.giantButtons} onClick={() => toggleMode('giantButtons')} icon={MousePointer2} label="Botões Gigantes" />
                                    <MenuToggle active={config.mouseGrid} onClick={() => toggleMode('mouseGrid')} icon={Grid3x3} label="Grade de Mouse" />
                                    <MenuToggle active={config.highlightElement} onClick={() => toggleMode('highlightElement')} icon={Highlighter} label="Destacar Elemento" />
                                    <MenuToggle active={config.voiceControl} onClick={() => toggleMode('voiceControl')} icon={Mic} label="Comando de Voz" />
                                    <MenuToggle active={config.virtualKeyboard} onClick={() => toggleMode('virtualKeyboard')} icon={Keyboard} label="Teclado Virtual" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Atraso de Clique</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        {['normal', 'slow', 'very-slow'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setClickDelay(s as any)}
                                                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${config.clickDelay === s ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}
                                            >
                                                {s === 'normal' ? 'Normal' : s === 'slow' ? 'Lento' : 'M. Lento'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        { }
                        {activeTab === 'auditivo' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-2">
                                    <MenuToggle active={config.vlibras} onClick={() => toggleMode('vlibras')} icon={Languages} label="Ativar VLibras" />
                                    <MenuToggle active={config.screenReader} onClick={() => toggleMode('screenReader')} icon={Volume2} label="Leitura de Tela" />
                                    <MenuToggle active={config.voiceControl} onClick={() => toggleMode('voiceControl')} icon={Mic} label="Comando de Voz" />
                                    <MenuToggle active={config.spatialAudio} onClick={() => toggleMode('spatialAudio')} icon={Headphones} label="Áudio 3D (Espacial)" />
                                    <MenuToggle active={config.captions} onClick={() => toggleMode('captions')} icon={Subtitles} label="Legendas (Simulado)" />
                                    <MenuToggle active={config.muteMedia} onClick={() => toggleMode('muteMedia')} icon={VolumeX} label="Silenciar Mídia" />
                                    <MenuToggle active={config.visualNotifications} onClick={() => toggleMode('visualNotifications')} icon={Eye} label="Notificações Visuais" />
                                    <MenuToggle active={config.adaptiveVibration} onClick={() => toggleMode('adaptiveVibration')} icon={Activity} label="Vibração Adaptativa" />
                                    <MenuToggle active={config.stopAutoPlay} onClick={() => toggleMode('stopAutoPlay')} icon={PauseCircle} label="Parar Reprodução Auto" />
                                    <MenuToggle active={config.audioDescription} onClick={() => toggleMode('audioDescription')} icon={Volume2} label="Descrição de Imagem" />
                                </div>
                            </div>
                        )}

                        { }
                        {activeTab === 'ajustes' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <p className="text-xs text-slate-500 text-center mb-3">Sistemas Inteligentes & Nuvem</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <MenuToggle active={config.autoDetect} onClick={() => toggleMode('autoDetect')} icon={Sparkles} label="Detecção Inteligente (Auto-Sugestão)" />
                                    <MenuToggle active={config.syncToCloud} onClick={() => toggleMode('syncToCloud')} icon={Cloud} label="Sincronizar na Nuvem (Perfil Único)" />
                                </div>
                                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
                                    <p>O VinculoTEA aprende com seu uso para sugerir adaptações. Seus dados de acessibilidade são salvos no seu perfil.</p>
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
