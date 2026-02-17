import { useEffect } from 'react';

declare global {
    interface Window {
        VLibras: any;
    }
}

export const VLibrasWidget = ({ active }: { active: boolean }) => {
    useEffect(() => {
        if (active) {
            if (!document.getElementById('vlibras-script')) {
                const script = document.createElement('script');
                script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                script.id = 'vlibras-script';
                script.async = true;
                script.onload = () => {

                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                };
                document.body.appendChild(script);
            } else {

                const widget = document.querySelector('[vp-box]');
                if (widget) (widget as HTMLElement).style.display = 'block';
            }
        } else {


            const widget = document.querySelector('[vp-box]');
            if (widget) (widget as HTMLElement).style.display = 'none';
        }
    }, [active]);

    if (!active) return null;

    return (
        <div className="vlibras-widget">
            <div className="enabled">
                <div dangerouslySetInnerHTML={{ __html: '<div widget-vlibras></div>' }} />
            </div>
        </div>
    );
};
