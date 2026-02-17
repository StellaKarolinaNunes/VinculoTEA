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
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{
                top: y - 50, // Center the 100px height window on cursor
                height: '100px'
            }}
        >
            <div
                className="w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] border-y-2 border-yellow-400"
            />
        </div>
    );
};
