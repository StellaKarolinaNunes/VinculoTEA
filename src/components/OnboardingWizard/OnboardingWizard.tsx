import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import {
    Eye, BookOpen, Hand, Volume2,
    ChevronRight, ChevronLeft, Check, X
} from 'lucide-react';
import styles from './OnboardingWizard.module.css';

const steps = [
    {
        id: 'welcome',
        title: 'Olá! Vamos configurar sua experiência?',
        description: 'Queremos que o VinculoTEA seja perfeito para você. Este guia rápido (1 min) vai adaptar o site às suas preferências.',
        icon: null
    },
    {
        id: 'visual',
        title: 'Visual',
        description: 'Como você prefere ver o conteúdo?',
        icon: <Eye className="size-6" />,
        options: [
            { id: 'none', label: 'Padrão', profile: 'none' },
            { id: 'autismo', label: 'Perfil Autismo (Cores Suaves)', profile: 'autismo' },
            { id: 'visual', label: 'Baixa Visão (Alto Contraste)', profile: 'baixa_visao' },
        ]
    },
    {
        id: 'reading',
        title: 'Leitura & Foco',
        description: 'Ferramentas para facilitar a leitura.',
        icon: <BookOpen className="size-6" />,
        toggles: [
            { id: 'lineFocus', label: 'Guia de Leitura' },
            { id: 'readableFont', label: 'Fonte Amigável' }
        ]
    },
    {
        id: 'motor',
        title: 'Motor',
        description: 'Facilite a navegação e cliques.',
        icon: <Hand className="size-6" />,
        toggles: [
            { id: 'giantButtons', label: 'Botões Grandes' },
            { id: 'keyboardFocus', label: 'Foco de Teclado' }
        ]
    },
    {
        id: 'audio',
        title: 'Auditivo',
        description: 'Suporte para comunicação e alertas.',
        icon: <Volume2 className="size-6" />,
        toggles: [
            { id: 'vlibras', label: 'Widget Libras' },
            { id: 'visualNotifications', label: 'Alertas Visuais' }
        ]
    },
    {
        id: 'conclusion',
        title: 'Tudo pronto!',
        description: 'Suas preferências foram salvas e serão aplicadas em todos os seus dispositivos.',
        icon: <Check className="size-8 text-success" />
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
                                {step.toggles.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => toggleMode(t.id as any)}
                                        className={`${styles.toggleItem} ${config[t.id as keyof typeof config] ? styles.activeToggle : ''}`}
                                    >
                                        <div className={styles.switch}>
                                            <div className={styles.switchKnob} />
                                        </div>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
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
                        {currentStep === 0 ? 'Começar' : currentStep === steps.length - 1 ? 'Concluir' : 'Continuar'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
