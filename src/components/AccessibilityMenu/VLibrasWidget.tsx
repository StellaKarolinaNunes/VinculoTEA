import { useEffect } from 'react';

export const VLibrasWidget = ({ active }: { active: boolean }) => {
    useEffect(() => {
        if (active) {
            if (!document.getElementById('vlibras-script')) {
                const script = document.createElement('script');
                script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                script.id = 'vlibras-script';
                script.async = true;
                script.onload = () => {
                    // @ts-ignore
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                };
                document.body.appendChild(script);
            } else {
                // If script exists, just make sure widget is visible if previously hidden
                const widget = document.querySelector('[vp-box]');
                if (widget) (widget as HTMLElement).style.display = 'block';
            }
        } else {
            // Ideally we would unmount/destroy, but VLibras doesn't have a clean destroy method
            // So we just hide it via CSS if possible or rely on the user closing it
            const widget = document.querySelector('[vp-box]');
            if (widget) (widget as HTMLElement).style.display = 'none';
        }
    }, [active]);

    if (!active) return null;

    return (
        <div className="vlibras-widget">
            <div className="enabled">
                <div role="button" tabIndex={0} className="vp-enabled">
                    <div className="vp-main-guide">
                        <div className="vp-guide">
                            {/* VLibras injects structure here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
