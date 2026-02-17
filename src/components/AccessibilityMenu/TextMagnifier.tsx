import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const TextMagnifier = () => {
    const { config } = useAccessibility();
    const [text, setText] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!config.smartMagnifier) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const content = target.innerText || target.getAttribute('aria-label') || target.getAttribute('alt');

            if (content && content.length > 0 && content.length < 200) {
                setText(content);
                setPosition({ x: e.clientX, y: e.clientY });
                setShow(true);
            } else {
                setShow(false);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (show) setPosition({ x: e.clientX, y: e.clientY });
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [config.smartMagnifier, show]);

    if (!show || !config.smartMagnifier) return null;

    return (
        <div
            className="fixed z-[10000] bg-white text-black p-4 rounded-xl shadow-2xl border-4 border-yellow-400 font-extrabold text-2xl max-w-md pointer-events-none"
            style={{
                top: position.y + 20,
                left: position.x + 20,
                transform: 'translate(-10%, -100%)'
            }}
        >
            {text}
        </div>
    );
};
