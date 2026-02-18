import { useState, useEffect } from 'react';
import {
    Settings, Shield, Bell, Zap,
    Lock, Eye, Database, Globe,
    Save, AlertCircle, RefreshCw, Server
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';

export const GlobalSettingsTab = () => {
    const { user: currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        publicRegistration: true,
        globalAnnouncement: '',
        aiAutoGeneratePei: true,
        sessionTimeout: 60,
        enableDebugLogs: false,
        dailyBackup: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            if (!currentUser?.plataforma_id) return;

            try {
                const { data, error } = await supabase
                    .from('Plataformas')
                    .select('*')
                    .eq('Plataforma_ID', currentUser.plataforma_id)
                    .single();

                if (data) {
                    // Mapping DB fields to UI state
                    const config = data.Configuracoes || {};
                    setSettings(prev => ({
                        ...prev,
                        maintenanceMode: data.Status === 'Manutenção',
                        globalAnnouncement: config.notificacao_global || '',
                        publicRegistration: config.registro_publico ?? true,
                        aiAutoGeneratePei: config.ai_enabled ?? true,
                        sessionTimeout: config.session_timeout ?? 60,
                        enableDebugLogs: config.debug_logs ?? false,
                        dailyBackup: config.daily_backup ?? true
                    }));
                }
            } catch (err) {
                console.error('Erro ao carregar configurações:', err);
            }
        };

        fetchSettings();
    }, [currentUser]);

    const handleToggle = (key: keyof typeof settings) => {
        if (currentUser?.tipo !== 'Administrador') return;
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        if (currentUser?.tipo !== 'Administrador') {
            alert('Apenas administradores podem alterar configurações globais.');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('Plataformas')
                .update({
                    Status: settings.maintenanceMode ? 'Manutenção' : 'Ativo',
                    Configuracoes: {
                        notificacao_global: settings.globalAnnouncement,
                        registro_publico: settings.publicRegistration,
                        ai_enabled: settings.aiAutoGeneratePei,
                        session_timeout: settings.sessionTimeout,
                        debug_logs: settings.enableDebugLogs,
                        daily_backup: settings.dailyBackup,
                        updated_at: new Date().toISOString()
                    }
                })
                .eq('Plataforma_ID', currentUser?.plataforma_id);

            if (error) throw error;
            alert('Configurações globais salvas com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isReadOnly = currentUser?.tipo !== 'Administrador';

    const SettingCard = ({ icon: Icon, title, description, children }: any) => (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{title}</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">{description}</p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );

    const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            disabled={isReadOnly}
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'} ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className={`size-6 bg-white rounded-full shadow-md transition-transform duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Configurações <span className="text-primary italic">Globais</span></h3>
                    <p className="text-sm text-slate-500 font-medium">Controle os parâmetros de alto nível do ecossistema VínculoTEA.</p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Salvar Alterações
                    </button>
                )}
                {isReadOnly && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 font-black text-[10px] uppercase tracking-widest">
                        <Lock size={14} />
                        Modo Leitura
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SettingCard
                    icon={Shield}
                    title="Modo de Manutenção"
                    description="Bloqueia o acesso de usuários comuns para manutenção programada."
                >
                    <Toggle active={settings.maintenanceMode} onClick={() => handleToggle('maintenanceMode')} />
                </SettingCard>

                <SettingCard
                    icon={Globe}
                    title="Cadastro Público"
                    description="Permite que novos usuários se cadastrem livremente na plataforma."
                >
                    <Toggle active={settings.publicRegistration} onClick={() => handleToggle('publicRegistration')} />
                </SettingCard>

                <SettingCard
                    icon={Zap}
                    title="IA de Geração PEI"
                    description="Habilita o motor de IA para sugestões automáticas nos relatórios."
                >
                    <Toggle active={settings.aiAutoGeneratePei} onClick={() => handleToggle('aiAutoGeneratePei')} />
                </SettingCard>

                <SettingCard
                    icon={Eye}
                    title="Logs de Depuração"
                    description="Ativa logs detalhados no sistema para análise técnica."
                >
                    <Toggle active={settings.enableDebugLogs} onClick={() => handleToggle('enableDebugLogs')} />
                </SettingCard>

                <SettingCard
                    icon={Lock}
                    title="Timeout de Sessão"
                    description="Tempo de inatividade em minutos antes do logout automático."
                >
                    <input
                        type="number"
                        value={settings.sessionTimeout}
                        disabled={isReadOnly}
                        onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                        className={`w-20 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                    />
                </SettingCard>

                <SettingCard
                    icon={Database}
                    title="Backup Diário"
                    description="Executa backup completo das tabelas em intervalos de 24h."
                >
                    <Toggle active={settings.dailyBackup} onClick={() => handleToggle('dailyBackup')} />
                </SettingCard>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800">
                <div className="flex gap-4 mb-8">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Comunicado Global</h4>
                        <p className="text-xs text-slate-500 font-medium">Esta mensagem aparecerá no topo de todos os dashboards.</p>
                    </div>
                </div>
                <textarea
                    value={settings.globalAnnouncement}
                    disabled={isReadOnly}
                    onChange={(e) => setSettings(prev => ({ ...prev, globalAnnouncement: e.target.value }))}
                    placeholder="Ex: Teremos manutenção preventiva no próximo domingo às 02h..."
                    className={`w-full h-32 bg-white dark:bg-slate-800 border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-none shadow-sm ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2.5rem] flex gap-6">
                    <div className="size-14 rounded-3xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h5 className="font-black text-amber-900 dark:text-amber-500 tracking-tight mb-2 uppercase text-xs tracking-[0.2em]">Zona de Perigo</h5>
                        <p className="text-sm text-amber-700 dark:text-amber-600 font-medium leading-relaxed">
                            Alterações nessas configurações afetam o comportamento central de toda a infraestrutura SaaS. Tenha cautela ao modificar estes valores.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Status do Servidor</h5>
                        </div>
                        <p className="text-2xl font-black">Cluster Central</p>
                        <p className="text-xs text-white/50 font-medium mt-1 italic group-hover:text-primary transition-colors hover:cursor-pointer">Ver Relatórios Detalhados →</p>
                    </div>
                    <Server size={80} className="text-white/5 absolute -right-4 -bottom-4 group-hover:text-white/10 group-hover:scale-110 transition-all duration-700" />
                </div>
            </div>
        </div>
    );
};
