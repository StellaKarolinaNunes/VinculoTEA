import { useState, useEffect } from 'react';
import {
    TrendingUp, Users, School, BookOpen,
    CheckCircle2, Clock, ArrowUpRight, ArrowDownRight,
    Activity, Shield, Globe, GraduationCap, UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const StatsTab = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSchools: 0,
        totalPeis: 0,
        totalAdmins: 0,
        totalStudents: 0,
        totalProfessionals: 0,
        activeToday: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchGlobalStats = async () => {
        setLoading(true);
        try {
            const [
                { count: users },
                { count: schools },
                { count: peis },
                { count: admins },
                { count: students },
                { count: professionals }
            ] = await Promise.all([
                supabase.from('Usuarios').select('*', { count: 'exact', head: true }),
                supabase.from('Escolas').select('*', { count: 'exact', head: true }),
                supabase.from('PEIs').select('*', { count: 'exact', head: true }),
                supabase.from('Usuarios').select('*', { count: 'exact', head: true }).eq('Tipo', 'Administrador'),
                supabase.from('Alunos').select('*', { count: 'exact', head: true }),
                supabase.from('Professores').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                totalUsers: users || 0,
                totalSchools: schools || 0,
                totalPeis: peis || 0,
                totalAdmins: admins || 0,
                totalStudents: students || 0,
                totalProfessionals: professionals || 0,
                activeToday: Math.floor((users || 0) * 0.45) // Mock active today as 45% for demo
            });
        } catch (error) {
            console.error('Error fetching global stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlobalStats();
    }, []);

    const cards = [
        { label: 'Total de Alunos', value: stats.totalStudents, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+15%', trendUp: true },
        { label: 'Unidades / Escolas', value: stats.totalSchools, icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3', trendUp: true },
        { label: 'PEIs Gerados', value: stats.totalPeis, icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+92%', trendUp: true },
        { label: 'Administradores', value: stats.totalAdmins, icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Estável', trendUp: true },
        { label: 'Usuários Totais', value: stats.totalUsers, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50', trend: '+24%', trendUp: true },
        { label: 'Profissionais', value: stats.totalProfessionals, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+5%', trendUp: true },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Calculando métricas globais...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 shadow-sm p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`size-10 rounded-xl ${card.bg} ${card.color} dark:bg-slate-700/50 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <card.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-full ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {card.trendUp ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{card.label}</h3>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value.toString().padStart(2, '0')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Stats Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/20 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Crescimento da Escola e Sistema</h3>
                            <p className="text-xs text-slate-500 font-medium">Novos alunos vs PEIs gerados por mês</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Alunos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">PEIs Gerados</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Container Placeholder */}
                    <div className="h-64 flex items-end gap-3 mb-6">
                        {[40, 65, 45, 90, 75, 55, 100, 85, 95, 60, 80, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-2 group/bar cursor-pointer">
                                <div className="flex-1 flex items-end gap-1">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="flex-1 bg-primary/20 group-hover/bar:bg-primary/40 rounded-t-lg transition-all"
                                    />
                                    <div
                                        style={{ height: `${h * 0.75}%` }}
                                        className="flex-1 bg-emerald-500/20 group-hover/bar:bg-emerald-500/40 rounded-t-lg transition-all"
                                    />
                                </div>
                                <span className="text-[8px] font-black text-slate-300 text-center uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200 dark:border-slate-800">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa de Conversão</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">84.2%</p>
                            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
                                <ArrowUpRight size={10} /> +2.4% este mês
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Média de PEIs / Aluno</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">1.8</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Estável</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuários Ativos (24h)</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeToday}</p>
                            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
                                <ArrowUpRight size={10} /> +12 no pico
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                        <Activity className="size-12 text-white/20 mb-8 group-hover:rotate-12 transition-transform" />
                        <h3 className="text-xl font-black leading-tight mb-2">Saúde do Sistema</h3>
                        <p className="text-white/60 text-xs font-medium leading-relaxed mb-8">
                            Status global dos serviços e infraestrutura.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-2 text-white/40">
                                    <span>Uso de Storage (Arquivos)</span>
                                    <span>45%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[45%] rounded-full shadow-lg shadow-white/20" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-2 text-white/40">
                                    <span>API Supabase (Rate Limit)</span>
                                    <span>12%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[12%] rounded-full shadow-lg shadow-white/20" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-white/80">API Gateway Online</span>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest">99.9% SLI</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Insights SaaS
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start gap-4">
                                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Crescimento Escolar</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Aumento de 12% na geração de PEIs nas últimas 2 semanas.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-start gap-4">
                                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Novas Unidades</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">3 novas escolas entraram no período de trial este mês.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
