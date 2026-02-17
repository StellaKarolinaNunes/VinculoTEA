import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const NumericNavigation = () => {
    const { config } = useAccessibility();
    const [links, setLinks] = useState<{ id: string, element: HTMLElement, top: number, left: number }[]>([]);

    useEffect(() => {
        if (!config.smartNavigation) {
            setLinks([]);
            return;
        }

        const scan = () => {
            const items = document.querySelectorAll('a, button, input, [role="button"]');
            const found: any[] = [];

            items.forEach((item: HTMLElement, index) => {
                const rect = item.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    found.push({
                        id: (index + 1).toString(),
                        element: item,
                        top: rect.top + window.scrollY,
                        left: rect.left + window.scrollX
                    });
                }
            });
            setLinks(found);
        };

        scan();
        window.addEventListener('scroll', scan);
        window.addEventListener('resize', scan);

        const handleKeys = (e: KeyboardEvent) => {
            if (!config.smartNavigation) return;
            const key = e.key;
            const target = links.find(l => l.id === key);
            if (target) {
                target.element.click();
                target.element.focus();
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeys);

        return () => {
            window.removeEventListener('scroll', scan);
            window.removeEventListener('resize', scan);
            window.removeEventListener('keydown', handleKeys);
        };
    }, [config.smartNavigation]);

    if (!config.smartNavigation) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {links.map((link) => (
                <div
                    key={link.id}
                    className="absolute bg-yellow-400 text-black font-bold text-xs px-1 rounded-sm shadow-sm border border-black"
                    style={{
                        top: link.top - 10,
                        left: link.left - 10,
                    }}
                >
                    {link.id}
                </div>
            ))}
        </div>
    );
};
