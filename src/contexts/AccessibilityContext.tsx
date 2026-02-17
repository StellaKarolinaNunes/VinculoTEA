import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

type AccessibilityProfile = 'none' | 'autismo' | 'visual' | 'auditivo' | 'motor' | 'tdah' | 'leitura';

type AccessibilityConfig = {
    // Core
    activeProfile: AccessibilityProfile;

    autismo: boolean;
    cego: boolean;
    surdo: boolean;
    auditivo: boolean;
    tdah: boolean;
    contraste: boolean;
    grayscale: boolean;
    negative: boolean;
    underlineLinks: boolean;
    readableFont: boolean;
    fontSize: number; // Percentage

    // Extended Phase 1
    screenReader: boolean;
    voiceControl: boolean;
    vlibras: boolean;
    handTalk: boolean;
    pauseAnimations: boolean;
    bigCursor: boolean;
    colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    keyboardFocus: boolean;

    // Cognitive & Reading (Phase 2)
    dyslexia: boolean;
    spacing: 'normal' | 'wide' | 'extra-wide';
    lineFocus: boolean;
    simplified: boolean;
    ttsSpeed: number; // 0.5 to 2.0

    // Visual & Motor (Phase 3)
    giantButtons: boolean;
    smartMagnifier: boolean; // Just a toggle for now
    brightness: number; // 100% default (down to 20%)
    focusMode: boolean; // Dim background
    antiAnxiety: boolean;

    // Auditory (Phase 4)
    visualNotifications: boolean; // Flash
    adaptiveVibration: boolean;
    audioDescription: boolean;
};

type AccessibilityContextType = {
    config: AccessibilityConfig;
    toggleMode: (mode: keyof Omit<AccessibilityConfig, 'fontSize' | 'colorBlindness' | 'spacing' | 'ttsSpeed' | 'brightness' | 'activeProfile'>) => void;
    activateProfile: (profile: AccessibilityProfile) => void;
    setColorBlindness: (mode: AccessibilityConfig['colorBlindness']) => void;
    setSpacing: (mode: AccessibilityConfig['spacing']) => void;
    setTTSSpeed: (speed: number) => void;
    setBrightness: (level: number) => void;
    setFontSize: (size: number) => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    reset: () => void;
};

const defaultConfig: AccessibilityConfig = {
    activeProfile: 'none',

    autismo: false,
    cego: false,
    surdo: false,
    auditivo: false,
    tdah: false,
    contraste: false,
    grayscale: false,
    negative: false,
    underlineLinks: false,
    readableFont: false,
    fontSize: 100,
    screenReader: false,
    voiceControl: false,
    vlibras: false,
    handTalk: false,
    pauseAnimations: false,
    bigCursor: false,
    colorBlindness: 'none',
    keyboardFocus: false,

    dyslexia: false,
    spacing: 'normal',
    lineFocus: false,
    simplified: false,
    ttsSpeed: 1.0,

    giantButtons: false,
    smartMagnifier: false,
    brightness: 100,
    focusMode: false,
    antiAnxiety: false,

    visualNotifications: false,
    adaptiveVibration: false,
    audioDescription: false
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<AccessibilityConfig>(() => {
        const saved = localStorage.getItem('accessibility_config_v5'); // V5 for profiles
        return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    });

    useEffect(() => {
        localStorage.setItem('accessibility_config_v5', JSON.stringify(config));

        const root = document.documentElement;

        // Reset and Re-apply classes
        root.className = '';
        if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');

        // Boolean toggles
        Object.entries(config).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value === true) {
                root.classList.add(`acc-${key}`);
            }
        });

        // Enums
        if (config.colorBlindness !== 'none') root.classList.add(`acc-${config.colorBlindness}`);
        if (config.spacing !== 'normal') root.classList.add(`acc-spacing-${config.spacing}`);
        if (config.activeProfile !== 'none') root.classList.add(`acc-profile-${config.activeProfile}`);

        // Values
        root.style.fontSize = `${config.fontSize}%`;
        root.style.setProperty('--acc-brightness', `${config.brightness}%`);

    }, [config]);

    // TTS Logic with Speed
    useEffect(() => {
        if (!config.screenReader) {
            window.speechSynthesis.cancel();
            return;
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            let text = target.innerText || target.getAttribute('aria-label') || target.getAttribute('alt');

            if (target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3' || target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'LI') {
                if (text && text.trim().length > 0) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'pt-BR';
                    utterance.rate = config.ttsSpeed;
                    window.speechSynthesis.speak(utterance);
                }
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            window.speechSynthesis.cancel();
        };
    }, [config.screenReader, config.ttsSpeed]);

    // Vibration Logic
    const triggerVibration = (pattern: number | number[]) => {
        if (config.adaptiveVibration && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    // Generic toggle
    const toggleMode = (mode: keyof Omit<AccessibilityConfig, 'fontSize' | 'colorBlindness' | 'spacing' | 'ttsSpeed' | 'brightness' | 'activeProfile'>) => {
        setConfig(prev => {
            const newValue = !prev[mode];
            if (mode === 'adaptiveVibration' && newValue) triggerVibration(200);

            // If manual toggle, we might want to unset active profile if it conflicts, but let's keep it simple for now
            return { ...prev, [mode]: newValue };
        });
    };

    const activateProfile = (profile: AccessibilityProfile) => {
        if (profile === config.activeProfile) {
            // Deactivate if already active
            setConfig(defaultConfig);
            return;
        }

        // Reset first to avoid conflicts, then apply profile settings
        const newConfig = { ...defaultConfig, activeProfile: profile };

        switch (profile) {
            case 'autismo':
                newConfig.autismo = true;
                newConfig.simplified = true;
                newConfig.antiAnxiety = true;
                newConfig.pauseAnimations = true;
                newConfig.visualNotifications = false; // Reduce noise
                break;
            case 'visual': // Cego/Deficiência Visual
                newConfig.cego = true;
                newConfig.screenReader = true;
                newConfig.voiceControl = true;
                newConfig.adaptiveVibration = true;
                break;
            case 'auditivo': // Surdo/Libras
                newConfig.surdo = true;
                newConfig.vlibras = true;
                newConfig.visualNotifications = true;
                break;
            case 'motor':
                newConfig.giantButtons = true;
                newConfig.keyboardFocus = true;
                newConfig.simplified = true; // Bigger click areas often mean simplified UI
                break;
            case 'tdah': // Foco
                newConfig.tdah = true;
                newConfig.focusMode = true;
                newConfig.pauseAnimations = true;
                newConfig.lineFocus = false; // Optional
                break;
            case 'leitura': // Dislexia + Melhor Leitura
                newConfig.dyslexia = true;
                newConfig.spacing = 'wide';
                newConfig.readableFont = true;
                newConfig.lineFocus = true;
                break;
        }

        setConfig(newConfig);
        triggerVibration([100, 50, 100]); // Confirmation vibe
    };

    // Setters
    const setColorBlindness = (mode: AccessibilityConfig['colorBlindness']) => setConfig(prev => ({ ...prev, colorBlindness: mode }));
    const setSpacing = (mode: AccessibilityConfig['spacing']) => setConfig(prev => ({ ...prev, spacing: mode }));
    const setTTSSpeed = (speed: number) => setConfig(prev => ({ ...prev, ttsSpeed: speed }));
    const setBrightness = (level: number) => setConfig(prev => ({ ...prev, brightness: level }));

    const setFontSize = (size: number) => setConfig(prev => ({ ...prev, fontSize: size }));
    const increaseFontSize = () => setConfig(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 200) }));
    const decreaseFontSize = () => setConfig(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 70) }));

    const reset = () => setConfig(defaultConfig);

    return (
        <AccessibilityContext.Provider value={{ config, toggleMode, activateProfile, setColorBlindness, setSpacing, setTTSSpeed, setBrightness, setFontSize, increaseFontSize, decreaseFontSize, reset }}>
            {children}

            {/* Filters */}
            <svg style={{ display: 'none' }}>
                <defs>
                    <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" /></filter>
                    <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" /></filter>
                    <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" /></filter>
                </defs>
            </svg>

            {/* Overlays */}
            <div
                className="fixed inset-0 pointer-events-none z-[10000]"
                style={{
                    backgroundColor: 'black',
                    opacity: (100 - config.brightness) / 100
                }}
            />

        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
