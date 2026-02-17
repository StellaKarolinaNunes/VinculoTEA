import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const SpatialAudio = () => {
    const { config } = useAccessibility();
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!config.spatialAudio) {
            audioContextRef.current?.close();
            audioContextRef.current = null;
            return;
        }

        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }

        const handleInteraction = (e: MouseEvent | FocusEvent) => {
            if (!audioContextRef.current) return;
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            const target = e.target as HTMLElement;
            
            if (!target.matches('button, a, input, select, textarea, [role="button"]')) return;

            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;

            
            const panX = (centerX / window.innerWidth) * 2 - 1;

            playSound(panX);
        };

        window.addEventListener('mouseover', handleInteraction);
        window.addEventListener('focusin', handleInteraction);

        return () => {
            window.removeEventListener('mouseover', handleInteraction);
            window.removeEventListener('focusin', handleInteraction);
            audioContextRef.current?.close();
        };
    }, [config.spatialAudio]);

    const playSound = (pan: number) => {
        if (!audioContextRef.current) return;

        try {
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const panner = ctx.createStereoPanner();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime); 
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            panner.pan.setValueAtTime(pan, ctx.currentTime);

            osc.connect(gain);
            gain.connect(panner);
            panner.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (err) {
            console.error('Audio play error', err);
        }
    };

    return null;
};
