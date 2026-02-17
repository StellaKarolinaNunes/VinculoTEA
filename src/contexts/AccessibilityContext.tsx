import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { usersService } from '../lib/usersService';
import { supabase } from '../lib/supabase';

type AccessibilityProfile = 'none' | 'autismo' | 'visual' | 'auditivo' | 'motor' | 'tdah' | 'leitura' | 'dislexia' | 'epilepsia' | 'baixa_visao' | 'idoso' | 'alfabetizacao' | 'daltonismo';

type AccessibilityConfig = {

    activeProfile: AccessibilityProfile;

    autismo: boolean;
    cego: boolean;
    surdo: boolean;
    auditivo: boolean;
    tdah: boolean;
    baixa_visao: boolean;


    contraste: boolean;
    contrastTheme: 'default' | 'high-contrast-light' | 'high-contrast-dark' | 'yellow-on-black';
    grayscale: boolean;
    saturation: 'normal' | 'low' | 'high' | 'monochrome';
    negative: boolean;

    underlineLinks: boolean;
    highlightLinks: boolean;
    highlightHeaders: boolean;
    readableFont: boolean;
    fontFamily: 'default' | 'opendyslexic' | 'arial' | 'comicsans';
    fontSize: number;


    screenReader: boolean;
    voiceControl: boolean;
    vlibras: boolean;
    handTalk: boolean;
    pauseAnimations: boolean;
    hideImages: boolean;

    bigCursor: boolean;
    cursorColor: 'default' | 'white' | 'black' | 'yellow' | 'cyan';

    colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    keyboardFocus: boolean;


    dyslexia: boolean;
    spacing: 'normal' | 'wide' | 'extra-wide';
    lineFocus: boolean;
    simplified: boolean;
    ttsSpeed: number;
    textToSpeech: boolean;
    syllableHighlight: boolean;
    dictionary: boolean;


    structureMap: boolean;
    smartNavigation: boolean;
    pageSummary: boolean;
    distractionFree: boolean;


    giantButtons: boolean;
    smartMagnifier: boolean;
    magnifierFixed: boolean;
    brightness: number;
    focusMode: boolean;
    antiAnxiety: boolean;


    mouseGrid: boolean;
    highlightElement: boolean;
    clickDelay: 'normal' | 'slow' | 'very-slow';
    virtualKeyboard: boolean;


    visualNotifications: boolean;
    adaptiveVibration: boolean;
    audioDescription: boolean;


    captions: boolean;
    muteMedia: boolean;
    stopAutoPlay: boolean;
    spatialAudio: boolean;
    soundVolume: number;


    autoDetect: boolean;
    syncToCloud: boolean;
};

type AccessibilityContextType = {
    config: AccessibilityConfig;
    setConfig: React.Dispatch<React.SetStateAction<AccessibilityConfig>>;
    toggleMode: (mode: keyof Omit<AccessibilityConfig, 'fontSize' | 'colorBlindness' | 'spacing' | 'ttsSpeed' | 'brightness' | 'activeProfile' | 'contrastTheme' | 'saturation' | 'cursorColor' | 'fontFamily' | 'clickDelay' | 'soundVolume'>) => void;
    activateProfile: (profile: AccessibilityProfile) => void;
    setColorBlindness: (mode: AccessibilityConfig['colorBlindness']) => void;
    setSpacing: (mode: AccessibilityConfig['spacing']) => void;
    setTTSSpeed: (speed: number) => void;
    setBrightness: (level: number) => void;
    setFontSize: (size: number) => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;


    setContrastTheme: (theme: AccessibilityConfig['contrastTheme']) => void;
    setSaturation: (level: AccessibilityConfig['saturation']) => void;
    setCursorColor: (color: AccessibilityConfig['cursorColor']) => void;
    setFontFamily: (font: AccessibilityConfig['fontFamily']) => void;
    setClickDelay: (delay: AccessibilityConfig['clickDelay']) => void;

    reset: () => void;
    tutorialCompleted: boolean;
    setTutorialCompleted: (completed: boolean) => void;
};

const defaultConfig: AccessibilityConfig = {
    activeProfile: 'none',

    autismo: false,
    cego: false,
    surdo: false,
    auditivo: false,
    tdah: false,
    baixa_visao: false,
    contraste: false,
    contrastTheme: 'default',
    grayscale: false,
    saturation: 'normal',
    negative: false,
    underlineLinks: false,
    highlightLinks: false,
    highlightHeaders: false,
    readableFont: false,
    fontFamily: 'default',
    fontSize: 100,
    screenReader: false,
    voiceControl: false,
    vlibras: false,
    handTalk: false,
    pauseAnimations: false,
    hideImages: false,
    bigCursor: false,
    cursorColor: 'default',
    colorBlindness: 'none',
    keyboardFocus: false,

    dyslexia: false,
    spacing: 'normal',
    lineFocus: false,
    simplified: false,
    ttsSpeed: 1.0,
    textToSpeech: false,
    syllableHighlight: false,
    dictionary: false,

    structureMap: false,
    smartNavigation: false,
    pageSummary: false,
    distractionFree: false,

    giantButtons: false,
    smartMagnifier: false,
    magnifierFixed: false,
    brightness: 100,
    focusMode: false,
    antiAnxiety: false,

    mouseGrid: false,
    highlightElement: false,
    clickDelay: 'normal',
    virtualKeyboard: false,

    visualNotifications: false,
    adaptiveVibration: false,
    audioDescription: false,
    captions: false,
    muteMedia: false,
    stopAutoPlay: false,

    spatialAudio: false,
    soundVolume: 80,
    autoDetect: true,
    syncToCloud: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<AccessibilityConfig>(() => {
        const saved = localStorage.getItem('accessibility_config_v7');
        return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    });

    const [tutorialCompleted, setTutorialCompletedState] = useState<boolean>(true); // Default to true to avoid flash
    const [isLoadingPrefs, setIsLoadingPrefs] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Get current user on mount
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                setUserId(session.user.id);
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load from DB when user changes
    useEffect(() => {
        if (!userId) {
            // If no user, fallback to local storage or defaults
            const saved = localStorage.getItem('accessibility_config_v7');
            if (saved) setConfig({ ...defaultConfig, ...JSON.parse(saved) });
            setTutorialCompletedState(localStorage.getItem('accessibility_tutorial_completed') === 'true');
            setIsLoadingPrefs(false);
            return;
        }

        const loadPrefs = async () => {
            try {
                const prefs = await usersService.getPreferences(userId);
                if (prefs) {
                    if (prefs.config) setConfig(prev => ({ ...prev, ...prefs.config }));
                    setTutorialCompletedState(prefs.onboarding_completed || false);
                } else {
                    // If no prefs in DB, check local storage
                    const saved = localStorage.getItem('accessibility_tutorial_completed');
                    setTutorialCompletedState(saved === 'true');
                }
            } catch (err) {
                console.error('Falha ao carregar preferências do DB:', err);
            } finally {
                setIsLoadingPrefs(false);
            }
        };
        loadPrefs();
    }, [userId]);

    const setTutorialCompleted = async (completed: boolean) => {
        setTutorialCompletedState(completed);
        localStorage.setItem('accessibility_tutorial_completed', String(completed));

        if (userId) {
            try {
                await usersService.updatePreferences(userId, {
                    onboarding_completed: completed,
                    config: config
                });
            } catch (err) {
                console.error('Falha ao salvar onboarding no DB:', err);
            }
        }
    };

    // Save to DB when config changes
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        localStorage.setItem('accessibility_config_v7', JSON.stringify(config));

        if (userId) {
            const timer = setTimeout(async () => {
                try {
                    await usersService.updatePreferences(userId, {
                        onboarding_completed: tutorialCompleted,
                        config: config
                    });
                } catch (err) {
                    console.error('Falha ao salvar config no DB:', err);
                }
            }, 1000); // Debounce saves
            return () => clearTimeout(timer);
        }

        const root = document.documentElement;


        root.className = '';
        if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');


        Object.entries(config).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value === true) {
                root.classList.add(`acc-${key}`);
            }
        });


        if (config.colorBlindness !== 'none') root.classList.add(`acc-${config.colorBlindness}`);
        if (config.spacing !== 'normal') root.classList.add(`acc-spacing-${config.spacing}`);
        if (config.activeProfile !== 'none') root.classList.add(`acc-profile-${config.activeProfile}`);


        if (config.contrastTheme !== 'default') root.classList.add(`acc-contrast-${config.contrastTheme}`);
        if (config.saturation !== 'normal') root.classList.add(`acc-saturation-${config.saturation}`);
        if (config.cursorColor !== 'default') root.classList.add(`acc-cursor-${config.cursorColor}`);
        if (config.fontFamily !== 'default') root.classList.add(`acc-font-${config.fontFamily}`);
        if (config.clickDelay !== 'normal') root.classList.add(`acc-delay-${config.clickDelay}`);


        root.style.fontSize = `${config.fontSize}%`;
        root.style.setProperty('--acc-brightness', `${config.brightness}%`);

    }, [config]);


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


    const triggerVibration = (pattern: number | number[]) => {
        if (config.adaptiveVibration && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };


    const toggleMode = (mode: keyof Omit<AccessibilityConfig, 'fontSize' | 'colorBlindness' | 'spacing' | 'ttsSpeed' | 'brightness' | 'activeProfile' | 'contrastTheme' | 'saturation' | 'cursorColor' | 'fontFamily' | 'clickDelay' | 'soundVolume'>) => {
        setConfig(prev => {
            const newValue = !prev[mode];
            if (mode === 'adaptiveVibration' && newValue) triggerVibration(200);


            return { ...prev, [mode]: newValue };
        });
    };

    const activateProfile = (profile: AccessibilityProfile) => {
        if (profile === config.activeProfile) {

            setConfig(defaultConfig);
            return;
        }


        const newConfig = { ...defaultConfig, activeProfile: profile };

        switch (profile) {
            case 'autismo':
                newConfig.autismo = true;
                newConfig.simplified = true;
                newConfig.antiAnxiety = true;
                newConfig.pauseAnimations = true;
                newConfig.visualNotifications = false;
                newConfig.saturation = 'low';
                newConfig.stopAutoPlay = true;
                break;
            case 'visual':
                newConfig.cego = true;
                newConfig.screenReader = true;
                newConfig.voiceControl = true;
                newConfig.adaptiveVibration = true;
                newConfig.highlightHeaders = true;
                newConfig.structureMap = true;
                break;
            case 'baixa_visao':
                newConfig.contrastTheme = 'yellow-on-black';
                newConfig.fontSize = 150;
                newConfig.bigCursor = true;
                newConfig.cursorColor = 'white';
                newConfig.smartMagnifier = true;
                break;
            case 'auditivo':
                newConfig.surdo = true;
                newConfig.vlibras = true;
                newConfig.visualNotifications = true;
                newConfig.captions = true;
                break;
            case 'motor':
                newConfig.giantButtons = true;
                newConfig.keyboardFocus = true;
                newConfig.simplified = true;
                newConfig.mouseGrid = true;
                newConfig.clickDelay = 'slow';
                break;
            case 'tdah':
                newConfig.tdah = true;
                newConfig.focusMode = true;
                newConfig.pauseAnimations = true;
                newConfig.lineFocus = false;
                newConfig.highlightLinks = true;
                newConfig.distractionFree = true;
                break;
            case 'leitura':
            case 'dislexia':
                newConfig.dyslexia = true;
                newConfig.spacing = 'wide';
                newConfig.fontFamily = 'opendyslexic';
                newConfig.readableFont = true;
                newConfig.lineFocus = true;
                newConfig.syllableHighlight = true;
                newConfig.contrastTheme = 'high-contrast-light';
                break;
            case 'epilepsia':
                newConfig.pauseAnimations = true;
                newConfig.stopAutoPlay = true;
                newConfig.muteMedia = true;
                newConfig.saturation = 'low';
                newConfig.brightness = 80;
                break;
            case 'idoso':
                newConfig.fontSize = 125;
                newConfig.contrastTheme = 'high-contrast-light';
                newConfig.giantButtons = true;
                newConfig.clickDelay = 'slow';
                newConfig.simplified = true;
                newConfig.voiceControl = true;
                break;
            case 'alfabetizacao':
                newConfig.lineFocus = true;
                newConfig.syllableHighlight = true;
                newConfig.highlightElement = true;
                newConfig.fontFamily = 'comicsans';
                newConfig.textToSpeech = true;
                newConfig.dictionary = true;
                break;
            case 'daltonismo':
                newConfig.saturation = 'high';
                newConfig.colorBlindness = 'protanopia';
                newConfig.highlightLinks = true;
                break;
        }

        setConfig(newConfig);
        triggerVibration([100, 50, 100]);
    };


    const setColorBlindness = (mode: AccessibilityConfig['colorBlindness']) => setConfig(prev => ({ ...prev, colorBlindness: mode }));
    const setSpacing = (mode: AccessibilityConfig['spacing']) => setConfig(prev => ({ ...prev, spacing: mode }));
    const setTTSSpeed = (speed: number) => setConfig(prev => ({ ...prev, ttsSpeed: speed }));
    const setBrightness = (level: number) => setConfig(prev => ({ ...prev, brightness: level }));

    const setFontSize = (size: number) => setConfig(prev => ({ ...prev, fontSize: size }));
    const increaseFontSize = () => setConfig(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 200) }));
    const decreaseFontSize = () => setConfig(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 70) }));

    const setContrastTheme = (theme: AccessibilityConfig['contrastTheme']) => setConfig(prev => ({ ...prev, contrastTheme: theme }));
    const setSaturation = (level: AccessibilityConfig['saturation']) => setConfig(prev => ({ ...prev, saturation: level }));
    const setCursorColor = (color: AccessibilityConfig['cursorColor']) => setConfig(prev => ({ ...prev, cursorColor: color }));

    const setFontFamily = (font: AccessibilityConfig['fontFamily']) => setConfig(prev => ({ ...prev, fontFamily: font }));
    const setClickDelay = (delay: AccessibilityConfig['clickDelay']) => setConfig(prev => ({ ...prev, clickDelay: delay }));

    const reset = () => setConfig(defaultConfig);

    return (
        <AccessibilityContext.Provider value={{
            config,
            setConfig,
            toggleMode,
            activateProfile,
            setColorBlindness,
            setSpacing,
            setTTSSpeed,
            setBrightness,
            setFontSize,
            increaseFontSize,
            decreaseFontSize,
            setContrastTheme,
            setSaturation,
            setCursorColor,
            setFontFamily,
            setClickDelay,
            reset,
            tutorialCompleted: isLoadingPrefs ? true : tutorialCompleted, // Hide during load
            setTutorialCompleted
        }}>
            {children}

            { }
            <svg style={{ display: 'none' }}>
                <defs>
                    <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" /></filter>
                    <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" /></filter>
                    <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" /></filter>
                </defs>
            </svg>

            { }
            <div
                className="fixed inset-0 pointer-events-none z-[10000]"
                style={{
                    backgroundColor: 'black',
                    opacity: (100 - config.brightness) / 100
                }}
            />

        </AccessibilityContext.Provider >
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
