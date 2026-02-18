import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import {
    Eye, BookOpen, Hand, Volume2,
    ChevronRight, ChevronLeft, Check, X,
    Wind, Type, Target, AppWindow
} from 'lucide-react';
import styles from './OnboardingWizard.module.css';

const steps = [
    {
        id: 'welcome',
        title: 'Olá! Vamos configurar sua experiência?',
        description: 'Queremos que o VinculoTEA seja perfeito para você. Este guia rápido (1 min) vai adaptar o site às suas preferências.',
        icon: <Wind className="size-10" />
    },
    {
        id: 'profile',
        title: 'Escolha seu Perfil',
        description: 'Selecione uma base para começarmos. Você poderá ajustar tudo depois.',
        icon: <Target className="size-8" />,
        options: [
            { id: 'autismo', label: 'Autismo (Cores Suaves)', profile: 'autismo' },
            { id: 'tdah', label: 'TDAH (Foco Máximo)', profile: 'tdah' },
            { id: 'visual', label: 'Baixa Visão (Contraste)', profile: 'baixa_visao' },
            { id: 'idoso', label: 'Idoso (Simplicidade)', profile: 'idoso' },
            { id: 'dislexia', label: 'Leitura (Dislexia)', profile: 'leitura' },
            { id: 'none', label: 'Padrão / Nenhum', profile: 'none' },
        ]
    },
    {
        id: 'visual-options',
        title: 'Visual & Leitura',
        description: 'Como você prefere ler e ver o conteúdo?',
        icon: <Type className="size-8" />,
        toggles: [
            { id: 'darkMode', label: 'Modo Escuro (Dark Mode)' },
            { id: 'readableFont', label: 'Fonte para Dislexia' },
            { id: 'underlineLinks', label: 'Sublinhar Links' },
            { id: 'highlightHeaders', label: 'Destacar Títulos' },
        ]
    },
    {
        id: 'environment',
        title: 'Foco & Ambiente',
        description: 'Reduza distrações para uma navegação tranquila.',
        icon: <AppWindow className="size-8" />,
        toggles: [
            { id: 'pauseAnimations', label: 'Pausar Animações' },
            { id: 'distractionFree', label: 'Modo Sem Distração' },
            { id: 'lineFocus', label: 'Guia de Leitura' }
        ]
    },
    {
        id: 'motor-audio',
        title: 'Navegação & Som',
        description: 'Facilite o uso do mouse e teclado.',
        icon: <Hand className="size-8" />,
        toggles: [
            { id: 'giantButtons', label: 'Botões Grandes' },
            { id: 'keyboardFocus', label: 'Realce de Teclado' },
            { id: 'vlibras', label: 'Widget de Libras' }
        ]
    },
    {
        id: 'conclusion',
        title: 'Tudo pronto!',
        description: 'Suas preferências foram salvas e serão aplicadas automaticamente sempre que você entrar.',
        icon: <Check className="size-12 text-success" />
    }
];

export const OnboardingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { config, setTutorialCompleted, activateProfile, toggleMode } = useAccessibility();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setTutorialCompleted(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleDarkMode = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme('light');
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        }
    };

    const isDarkMode = theme === 'dark';

    const step = steps[currentStep];

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>VínculoTEA</div>
                    <button
                        onClick={() => setTutorialCompleted(true)}
                        className={styles.skipBtn}
                    >
                        Pular configuração
                    </button>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {step.icon && <div className={styles.iconCircle}>{step.icon}</div>}
                    <h2 className={styles.title}>{step.title}</h2>
                    <p className={styles.description}>{step.description}</p>

                    {/* Step Specific Options */}
                    <div className={styles.optionsArea}>
                        {step.options && (
                            <div className={styles.optionsGrid}>
                                {step.options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => activateProfile(opt.profile as any)}
                                        className={`${styles.optionCard} ${config.activeProfile === opt.profile ? styles.activeOption : ''}`}
                                    >
                                        <div className={styles.checkRing}>
                                            {config.activeProfile === opt.profile && <Check size={14} />}
                                        </div>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step.toggles && (
                            <div className={styles.togglesList}>
                                {step.toggles.map(t => {
                                    const isActive = t.id === 'darkMode'
                                        ? isDarkMode
                                        : config[t.id as keyof typeof config];

                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => t.id === 'darkMode' ? toggleDarkMode() : toggleMode(t.id as any)}
                                            className={`${styles.toggleItem} ${isActive ? styles.activeToggle : ''}`}
                                        >
                                            <span>{t.label}</span>
                                            <div className={styles.switch}>
                                                <div className={styles.switchKnob} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button
                        onClick={handleBack}
                        className={`${styles.navBtn} ${currentStep === 0 ? 'invisible' : ''}`}
                    >
                        <ChevronLeft size={20} /> Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        className={styles.primaryBtn}
                    >
                        {currentStep === 0 ? 'Começar' : currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
