import { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Eye, Volume2, MousePointer2, Brain, ChevronRight, Check, X, ArrowRight, Accessibility } from 'lucide-react';

type Step = 'welcome' | 'vision' | 'cognitive' | 'motor' | 'auditivo' | 'complete';

export const AccessibilityTutorial = () => {
    const {
        config,
        tutorialCompleted, setTutorialCompleted,
        activateProfile,
        increaseFontSize, decreaseFontSize,
        setContrastTheme,
        setClickDelay,
        toggleMode
    } = useAccessibility();

    const [isOpen, setIsOpen] = useState(!tutorialCompleted);
    const [step, setStep] = useState<Step>('welcome');

    if (!isOpen) return null;

    const handleComplete = () => {
        setTutorialCompleted(true);
        setIsOpen(false);
    };

    const skipTutorial = () => {
        setTutorialCompleted(true);
        setIsOpen(false);
    };

    const nextStep = (next: Step) => {
        setStep(next);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row min-h-[500px]">

                {}
                <div className="bg-slate-50 dark:bg-slate-800 p-6 md:w-64 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-8 text-primary font-bold">
                            <Accessibility size={24} />
                            <span>VinculoTEA</span>
                        </div>

                        <nav className="space-y-2">
                            <StepIndicator current={step} target="welcome" label="Bem-vindo" icon={Accessibility} />
                            <StepIndicator current={step} target="vision" label="Visual" icon={Eye} />
                            <StepIndicator current={step} target="cognitive" label="Leitura & Foco" icon={Brain} />
                            <StepIndicator current={step} target="motor" label="Motor" icon={MousePointer2} />
                            <StepIndicator current={step} target="auditivo" label="Auditivo" icon={Volume2} />
                            <StepIndicator current={step} target="complete" label="Conclusão" icon={Check} />
                        </nav>
                    </div>

                    <button onClick={skipTutorial} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        Pular configuração
                    </button>
                </div>

                {}
                <div className="flex-1 p-8 md:p-10 flex flex-col">

                    {step === 'welcome' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Accessibility size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Olá! Vamos configurar sua experiência?</h2>
                            <p className="text-slate-600 dark:text-slate-300 max-w-md text-lg leading-relaxed">
                                Queremos que o VinculoTEA seja perfeito para você. Este guia rápido (1 min) vai adaptar o site às suas preferências.
                            </p>
                            <button
                                onClick={() => nextStep('vision')}
                                className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-primary/30"
                            >
                                Começar <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'vision' && (
                        <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Eye className="text-primary" /> Como você prefere visualizar?
                            </h3>

                            <div className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-700 dark:text-slate-200">Tamanho do Texto</label>
                                    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                        <p style={{ fontSize: `${config.fontSize}%` }} className="transition-all duration-300">
                                            O VinculoTEA se adapta a você.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={decreaseFontSize} className="btn-tutorial-option flex-1">Diminuir</button>
                                        <button onClick={increaseFontSize} className="btn-tutorial-option flex-1">Aumentar</button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-slate-700 dark:text-slate-200">Contraste</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setContrastTheme('default')}
                                            className={`p-3 rounded-lg border-2 ${config.contrastTheme === 'default' ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700'}`}
                                        >Normal</button>
                                        <button
                                            onClick={() => setContrastTheme('high-contrast-dark')}
                                            className={`p-3 rounded-lg border-2 bg-black text-white ${config.contrastTheme === 'high-contrast-dark' ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
                                        >Escuro</button>
                                        <button
                                            onClick={() => setContrastTheme('high-contrast-light')}
                                            className={`p-3 rounded-lg border-2 bg-white text-black ${config.contrastTheme === 'high-contrast-light' ? 'border-primary ring-2 ring-primary' : 'border-slate-200'}`}
                                        >Claro</button>
                                        <button
                                            onClick={() => setContrastTheme('yellow-on-black')}
                                            className={`p-3 rounded-lg border-2 bg-black text-yellow-400 ${config.contrastTheme === 'yellow-on-black' ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
                                        >Amarelo</button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={() => nextStep('cognitive')} className="btn-tutorial-next">Próximo <ChevronRight /></button>
                            </div>
                        </div>
                    )}

                    {step === 'cognitive' && (
                        <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Brain className="text-primary" /> Leitura e Foco
                            </h3>

                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-1 gap-3">
                                    <TutorialToggle
                                        active={config.distractionFree}
                                        onToggle={() => toggleMode('distractionFree')}
                                        label="Modo Sem Distrações"
                                        desc="Oculta menus laterais e foca no conteúdo principal."
                                    />
                                    <TutorialToggle
                                        active={config.dyslexia}
                                        onToggle={() => activateProfile(config.dyslexia ? 'none' : 'dislexia')}
                                        label="Tenho Dislexia"
                                        desc="Usa fontes especiais e espaçamento aumentado."
                                    />
                                    <TutorialToggle
                                        active={config.lineFocus}
                                        onToggle={() => toggleMode('lineFocus')}
                                        label="Guia de Leitura"
                                        desc="Destaca a linha onde o mouse passa."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={() => nextStep('vision')} className="text-slate-400 hover:text-primary">Voltar</button>
                                <button onClick={() => nextStep('motor')} className="btn-tutorial-next">Próximo <ChevronRight /></button>
                            </div>
                        </div>
                    )}

                    {step === 'motor' && (
                        <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <MousePointer2 className="text-primary" /> Controle Motor
                            </h3>

                            <div className="space-y-4 flex-1">
                                <p className="text-slate-600 dark:text-slate-300">Você sente dificuldade em usar o mouse ou clicar em botões pequenos?</p>

                                <div className="grid grid-cols-1 gap-3">
                                    <TutorialToggle
                                        active={config.giantButtons}
                                        onToggle={() => toggleMode('giantButtons')}
                                        label="Botões Maiores"
                                        desc="Aumenta a área de clique de todos os botões."
                                    />
                                    <div className="space-y-2">
                                        <label className="font-bold text-sm">Velocidade do Clique (Tremor)</label>
                                        <div className="flex gap-2">
                                            {['normal', 'slow', 'very-slow'].map(delay => (
                                                <button
                                                    key={delay}
                                                    onClick={() => setClickDelay(delay as any)}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm border-2 transition-all ${config.clickDelay === delay
                                                            ? 'bg-primary/10 border-primary text-primary font-bold'
                                                            : 'border-slate-200 dark:border-slate-700'
                                                        }`}
                                                >
                                                    {delay === 'normal' ? 'Normal' : delay === 'slow' ? 'Lento' : 'M. Lento'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={() => nextStep('cognitive')} className="text-slate-400 hover:text-primary">Voltar</button>
                                <button onClick={() => nextStep('auditivo')} className="btn-tutorial-next">Próximo <ChevronRight /></button>
                            </div>
                        </div>
                    )}

                    {step === 'auditivo' && (
                        <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Volume2 className="text-primary" /> Audição
                            </h3>

                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-1 gap-3">
                                    <TutorialToggle
                                        active={config.vlibras}
                                        onToggle={() => toggleMode('vlibras')}
                                        label="Ativar VLibras"
                                        desc="Avatar virtual para tradução em Libras."
                                    />
                                    <TutorialToggle
                                        active={config.visualNotifications}
                                        onToggle={() => toggleMode('visualNotifications')}
                                        label="Alertas Visuais"
                                        desc="Piscar a tela ao invés de sons."
                                    />
                                    <TutorialToggle
                                        active={config.screenReader}
                                        onToggle={() => toggleMode('screenReader')}
                                        label="Leitor de Tela Simples"
                                        desc="Ler textos ao passar o mouse."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button onClick={() => nextStep('motor')} className="text-slate-400 hover:text-primary">Voltar</button>
                                <button onClick={() => nextStep('complete')} className="btn-tutorial-next">Finalizar <Check /></button>
                            </div>
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 fade-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Check size={40} strokeWidth={4} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Tudo Pronto!</h2>
                            <p className="text-slate-600 dark:text-slate-300 max-w-md text-lg leading-relaxed">
                                Suas preferências foram salvas. Você pode alterá-las a qualquer momento no menu de acessibilidade.
                            </p>
                            <button
                                onClick={handleComplete}
                                className="mt-8 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-green-600/30 transition-all hover:scale-105"
                            >
                                Usar o VinculoTEA
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StepIndicator = ({ current, target, label, icon: Icon }: any) => {
    const isActive = current === target;
    
    

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500'}`}>
            <Icon size={20} />
            <span className="text-sm">{label}</span>
        </div>
    );
}

const TutorialToggle = ({ active, onToggle, label, desc }: any) => (
    <button
        onClick={onToggle}
        className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${active
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
    >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'border-primary bg-primary text-white' : 'border-slate-300'
            }`}>
            {active && <Check size={14} strokeWidth={3} />}
        </div>
        <div>
            <div className={`font-bold ${active ? 'text-primary' : 'text-slate-700 dark:text-white'}`}>{label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
        </div>
    </button>
);
