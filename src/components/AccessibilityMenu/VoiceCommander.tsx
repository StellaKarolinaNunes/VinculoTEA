import { useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';



declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export const VoiceCommander = () => {
    const { config, toggleMode, increaseFontSize, decreaseFontSize, reset } = useAccessibility();

    useEffect(() => {
        if (!config.voiceControl) return;

        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Web Speech API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim().toLowerCase();

            console.log('Voice Command:', command);
            processCommand(command);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
        };

        
        recognition.onend = () => {
            if (config.voiceControl) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Already started');
                }
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error('Error starting recognition:', e);
        }

        return () => {
            recognition.abort();
        };
    }, [config.voiceControl]);

    const processCommand = (command: string) => {
        
        if (command.includes('início') || command.includes('home')) {
            window.location.href = '/';
            feedback('Indo para a página inicial');
        }
        else if (command.includes('perfil') || command.includes('conta')) {
            
            console.log('Navigating to profile');
            feedback('Abrindo perfil');
        }
        else if (command.includes('voltar')) {
            window.history.back();
            feedback('Voltando');
        }

        
        else if (command.includes('descer') || command.includes('rolar para baixo')) {
            window.scrollBy({ top: 300, behavior: 'smooth' });
        }
        else if (command.includes('subir') || command.includes('rolar para cima')) {
            window.scrollBy({ top: -300, behavior: 'smooth' });
        }
        else if (command.includes('aumentar fonte') || command.includes('texto maior')) {
            increaseFontSize();
            feedback('Aumentando fonte');
        }
        else if (command.includes('diminuir fonte') || command.includes('texto menor')) {
            decreaseFontSize();
            feedback('Diminuindo fonte');
        }
        else if (command.includes('alto contraste')) {
            
            
            feedback('Comando de alto contraste reconhecido');
        }
        else if (command.includes('redefinir') || command.includes('resetar')) {
            reset();
            feedback('Configurações redefinidas');
        }
    };

    const feedback = (text: string) => {
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    };

    return null; 
};
