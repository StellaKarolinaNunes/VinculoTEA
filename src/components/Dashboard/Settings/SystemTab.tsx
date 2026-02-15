import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Accessibility, EyeOff, EarOff, Brain, Ear, Zap } from 'lucide-react';

export const SystemTab = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const [accessConfig, setAccessConfig] = useState(() => {
        const saved = localStorage.getItem('accessibility_config');
        return saved ? JSON.parse(saved) : {
            autismo: false,
            cego: false,
            surdo: false,
            auditivo: false,
            tdah: false,
            contraste: false
        };
    });

    useEffect(() => {
        localStorage.setItem('accessibility_config', JSON.stringify(accessConfig));
        // Apply global classes for accessibility
        Object.entries(accessConfig).forEach(([key, value]) => {
            if (value) document.documentElement.classList.add(`acc-${key}`);
            else document.documentElement.classList.remove(`acc-${key}`);
        });
    }, [accessConfig]);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-4xl space-y-12">
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight italic">Informações do <span className="text-primary">Sistema</span></h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: 'Versão Atual', value: '2.4.0', status: 'Estável' },
                        { label: 'Ambiente', value: 'Produção', status: 'Online' },
                        { label: 'Sincronização', value: 'Ativa', status: '100%' }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border-[1.5px] border-transparent hover:border-primary/20 transition-all group">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.value}</p>
                            <span className="mt-3 inline-block px-2 py-0.5 bg-success/10 text-success text-[9px] font-black uppercase tracking-widest rounded-full">{item.status}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight italic">Preferências de <span className="text-primary">Interface</span></h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border-[1.5px] border-transparent hover:border-primary/20 transition-all cursor-pointer group" onClick={() => setNotifications(!notifications)}>
                        <div className="flex items-center gap-5">
                            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${notifications ? 'bg-primary text-white shadow-lg shadow-primary-500/20' : 'bg-slate-100 text-slate-400 shadow-inner'}`}>
                                <Bell size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">Notificações Sonoras</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ative alertas auditivos para eventos críticos e agendamentos</p>
                            </div>
                        </div>
                        <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            <div className={`size-5 bg-white rounded-full shadow-md transition-all duration-300 ${notifications ? 'translate-x-7' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight italic">Acessibilidade e <span className="text-primary">Inclusão</span></h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: 'autismo', label: 'Modo Autismo (TEA)', desc: 'Interface simplificada, tons pastéis e baixa estimulação visual.', icon: Accessibility, color: 'bg-blue-100 text-blue-600' },
                        { id: 'cego', label: 'Deficiência Visual / Cego', desc: 'Otimização para leitores de tela e comandos de voz.', icon: EyeOff, color: 'bg-indigo-100 text-indigo-600' },
                        { id: 'surdo', label: 'Surdo / Libras', desc: 'Prioriza sinalização visual e suporte a intérprete virtual.', icon: EarOff, color: 'bg-rose-100 text-rose-600' },
                        { id: 'auditivo', label: 'Dificuldade Auditiva', desc: 'Legendas automáticas e reforço visual para alertas sonoros.', icon: Ear, color: 'bg-emerald-100 text-emerald-600' },
                        { id: 'tdah', label: 'Modo Foco (TDAH)', desc: 'Bloqueio de distrações, timers e redução de animações.', icon: Brain, color: 'bg-orange-100 text-orange-600' },
                        { id: 'contraste', label: 'Alto Contraste', desc: 'Maximiza a distinção entre elementos para melhor leitura.', icon: Zap, color: 'bg-slate-800 text-white' }
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setAccessConfig((prev: any) => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className={`flex items-start gap-4 p-5 rounded-[2rem] border-[1.5px] transition-all cursor-pointer group ${accessConfig[item.id as keyof typeof accessConfig]
                                ? 'bg-white dark:bg-slate-800 border-primary shadow-md shadow-primary/5'
                                : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${item.color}`}>
                                <item.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-black text-slate-900 dark:text-white text-sm">{item.label}</p>
                                    <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${accessConfig[item.id as keyof typeof accessConfig] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <div className={`size-3 bg-white rounded-full shadow-md transition-all duration-300 ${accessConfig[item.id as keyof typeof accessConfig] ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                    <div className="flex gap-4">
                        <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                            <Zap size={20} />
                        </div>
                        <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                            <strong>Dica de Inclusão:</strong> Ativar mais de um modo simultaneamente permite personalizar a plataforma para necessidades específicas de cada profissional ou paciente.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
