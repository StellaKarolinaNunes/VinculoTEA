import { useEffect, useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const ReadingGuide = () => {
    const { config } = useAccessibility();
    const [y, setY] = useState(0);

    useEffect(() => {
        if (!config.lineFocus) return;

        const handleMouseMove = (e: MouseEvent) => {
            setY(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [config.lineFocus]);

    if (!config.lineFocus) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <div
                className="absolute w-full h-full bg-black/70 transition-transform duration-75"
                style={{
                    clipPath: `polygon(0% 0%, 100% 0%, 100% ${y - 40}px, 0% ${y - 40}px, 0% ${y + 40}px, 100% ${y + 40}px, 100% 100%, 0% 100%)`
                }}
            />
            <div
                className="absolute w-full h-20 border-y-2 border-yellow-400/50 bg-transparent transition-transform duration-75"
                style={{ top: y - 40 }}
            />
        </div>
    );
};
