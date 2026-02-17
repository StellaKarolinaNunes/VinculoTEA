import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const AutoDetector = () => {
    const { config, activateProfile, setClickDelay, setConfig } = useAccessibility();
    const rageClickCount = useRef(0);
    const lastClickTime = useRef(0);

    
    useEffect(() => {
        if (!config.autoDetect) return;

        const handleReset = () => { rageClickCount.current = 0; };

        const handleClick = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastClickTime.current < 300) { 
                rageClickCount.current++;
            } else {
                rageClickCount.current = 1;
            }
            lastClickTime.current = now;

            if (rageClickCount.current >= 5) {
                
                if (!config.giantButtons) {
                    console.info('Auto-detect: Suggesting Motor Profile due to rage clicks');
                    
                    
                    if (confirm('Detectamos cliques rápidos repetidos. Gostaria de ativar botões maiores e atraso de clique para facilitar?')) {
                        activateProfile('motor');
                        setClickDelay('slow');
                    }
                    rageClickCount.current = 0;
                }
            }
        };

        window.addEventListener('click', handleClick);
        
        const interval = setInterval(handleReset, 2000);

        return () => {
            window.removeEventListener('click', handleClick);
            clearInterval(interval);
        };
    }, [config.autoDetect]);

    
    useEffect(() => {
        if (!config.autoDetect) return;

        const checkZoom = () => {
            const pixelRatio = window.devicePixelRatio;
            if (pixelRatio > 1.5 && !config.baixa_visao) {
                
                if (confirm('Percebemos que você aumentou o zoom. Gostaria de ativar o modo Baixa Visão para otimizar contraste e fontes?')) {
                    activateProfile('baixa_visao');
                }
            }
        };

        
        window.addEventListener('resize', checkZoom);
        return () => window.removeEventListener('resize', checkZoom);
    }, [config.autoDetect]);

    return null;
}
