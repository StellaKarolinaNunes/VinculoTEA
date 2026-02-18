import { useState } from 'react';
import { Users, TrendingUp, Settings as SettingsIcon, Shield } from 'lucide-react';
import { UsersTab } from '@/components/Dashboard/SuperAdmin/tabs/UsersTab';
import { StatsTab } from '@/components/Dashboard/SuperAdmin/tabs/StatsTab';
import { GlobalSettingsTab } from '@/components/Dashboard/SuperAdmin/tabs/GlobalSettingsTab';

type Tab = 'users' | 'stats' | 'settings';

export const SuperAdminView = () => {
    const [activeTab, setActiveTab] = useState<Tab>('users');

    return (
        <div className="animate-in fade-in duration-700 space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
                        Painel <span className="text-primary">Administrativo</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Shield size={16} className="text-primary" />
                        Gestão Global do Ecossistema VínculoTEA
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl border-[1.5px] border-slate-100 dark:border-slate-700 shadow-sm inline-flex flex-wrap gap-2">
                {[
                    { id: 'users' as const, label: 'Contas de Usuários', icon: Users },
                    { id: 'stats' as const, label: 'Estatísticas SaaS', icon: TrendingUp },
                    { id: 'settings' as const, label: 'Configurações Globais', icon: SettingsIcon },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary'
                                }`}
                        >
                            <tab.icon size={18} strokeWidth={isActive ? 3 : 2} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700/50 shadow-sm min-h-[600px] overflow-hidden">
                <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'stats' && <StatsTab />}
                    {activeTab === 'settings' && <GlobalSettingsTab />}
                </div>
            </div>
        </div>
    );
};
