import { FC, useState, useEffect, lazy, Suspense } from 'react'
import {
  LogOut, LayoutDashboard, Users, BookOpen,
  Calendar, Bell, Search, Settings, CheckCircle2,
  ChevronRight, TrendingUp, Menu, X, Filter,
  ArrowUpRight, Clock, MessageSquare, Briefcase,
  ChevronLeft, ClipboardList, Lightbulb, Target,
  Sun, Moon, Mic, MicOff, School, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import { syncOfflineActions } from '@/lib/offlineService';
import { OnboardingWizard } from '../OnboardingWizard/OnboardingWizard';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useNotifications } from '@/contexts/NotificationContext';
import styles from './Dashboard.module.css';
import logotipoHorizontal from '@/assets/images/logotipo_Horizontal.svg';
import darkLogo from '@/assets/images/dark.svg';

const StudentsView = lazy(() => import('./Students/StudentsView').then(m => ({ default: m.StudentsView })));
const ManagementView = lazy(() => import('./Management/ManagementView').then(m => ({ default: m.ManagementView })));
const DisciplineView = lazy(() => import('./Discipline/DisciplineView').then(m => ({ default: m.DisciplineView })));
const SettingsView = lazy(() => import('./Settings/SettingsView').then(m => ({ default: m.SettingsView })));
const ReportsView = lazy(() => import('./Reports/ReportsView').then(m => ({ default: m.ReportsView })));
const SuperAdminView = lazy(() => import('./SuperAdmin/SuperAdminView').then(m => ({ default: m.SuperAdminView })));
const SearchModal = lazy(() => import('./SearchModal').then(m => ({ default: m.SearchModal })));
const HelpCenter = lazy(() => import('./HelpCenter').then(m => ({ default: m.HelpCenter })));

interface DashboardProps {
  user: {
    id: string;
    email?: string;
    role?: string;
    user_metadata?: any;
    plataforma_id?: string;
  };
  onLogout: () => void;
}

interface RealStats {
  alunosAtivos: number;
  totalAlunos: number;
  peisConcluidos: number;
  totalPeis: number;
  atendimentosHoje: number;
  mediaAlunosTurma: number;
  taxaAtivos: number;
  pendencia: number;
}

type ViewState = 'dashboard' | 'students' | 'management' | 'discipline' | 'reports' | 'settings' | 'help' | 'system_admin';

export const Dashboard: FC<DashboardProps> = ({ user, onLogout }) => {
  const { user: authUser, permissions } = useAuth();
  const { tutorialCompleted } = useAccessibility();

  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const { notifications, unreadCount, clearAll, removeNotification, markAsRead, playNotificationSound } = useNotifications();
  const [realStats, setRealStats] = useState<RealStats>({
    alunosAtivos: 0,
    totalAlunos: 0,
    peisConcluidos: 0,
    totalPeis: 0,
    atendimentosHoje: 0,
    mediaAlunosTurma: 0,
    taxaAtivos: 0,
    pendencia: 0
  });

  const [pendingActivities, setPendingActivities] = useState<any[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<number[]>([40, 60, 45, 80, 100]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isSuperAdmin = authUser?.tipo === 'Administrador';
        const queryPlataforma = authUser?.plataforma_id;
        const queryEscola = isSuperAdmin ? undefined : authUser?.escola_id;

        const qAlunosAtivos = supabase.from('Alunos').select('*', { count: 'exact', head: true }).eq('Status', 'Ativo');
        const qPeisConcluidos = supabase.from('PEIs').select('*', { count: 'exact', head: true }).eq('Status', 'Concluído');
        const qPeisTotal = supabase.from('PEIs').select('*', { count: 'exact', head: true });
        const qTurmas = supabase.from('Turmas').select('*', { count: 'exact', head: true });
        const qAlunosTurmas = supabase.from('Alunos_Turmas').select('*', { count: 'exact', head: true });
        const qAlunosTotal = supabase.from('Alunos').select('*', { count: 'exact', head: true });
        const qPendencias = supabase.from('Relatorios_PEI').select('*', { count: 'exact', head: true });

        const today = new Date().toISOString().split('T')[0];
        const qAtendimentosHojeTotal = supabase.from('Aulas')
          .select('*', { count: 'exact', head: true })
          .gte('Data_hora_inicio', `${today}T00:00:00`)
          .lte('Data_hora_inicio', `${today}T23:59:59`);

        const applyFilters = (q: any, useEscola = true) => {
          let filtered = q;
          if (queryPlataforma) filtered = filtered.eq('Plataforma_ID', queryPlataforma);
          if (useEscola && queryEscola) filtered = filtered.eq('Escola_ID', queryEscola);
          return filtered;
        };

        const [
          { count: resAlunosAtivos },
          { count: resPeisConcluidos },
          { count: resTotalPeis },
          { count: resTotalTurmas },
          { count: resTotalAlunosTurmas },
          { count: resTotalAlunos },
          { count: resPendencia },
          { count: resAtendimentosHoje }
        ] = await Promise.all([
          applyFilters(qAlunosAtivos),
          applyFilters(qPeisConcluidos),
          applyFilters(qPeisTotal),
          applyFilters(qTurmas),
          applyFilters(qAlunosTurmas, false), // Alunos_Turmas might not have Escola_ID directly in some schemas
          applyFilters(qAlunosTotal),
          applyFilters(qPendencias),
          applyFilters(qAtendimentosHojeTotal)
        ]);

        let qAgenda = supabase
          .from('Agenda')
          .select('*, Alunos!inner (Nome, Escola_ID)')
          .eq('Data', today);

        if (queryPlataforma) qAgenda = qAgenda.eq('Plataforma_ID', queryPlataforma);
        if (queryEscola) qAgenda = qAgenda.eq('Alunos.Escola_ID', queryEscola);

        const { data: agendaHoje } = await qAgenda.order('Horario', { ascending: true });

        if (agendaHoje && agendaHoje.length > 0) {
          setPendingActivities(agendaHoje.map((item: any) => ({
            name: item.Alunos?.Nome || item.Titulo || 'Atendimento',
            type: item.Tipo_Evento || 'Sessão Terapêutica',
            time: item.Horario?.substring(0, 5) || '--:--',
            status: item.Status || 'Agendado',
            priority: item.Status === 'Pendente' ? 'high' : 'medium'
          })));
        } else {
          let qRecentPeis = supabase
            .from('Relatorios_PEI')
            .select('*, Alunos(Nome)')
            .limit(3)
            .order('Relatorio_ID', { ascending: false });

          if (queryPlataforma) qRecentPeis = qRecentPeis.eq('Plataforma_ID', queryPlataforma);
          if (queryEscola) qRecentPeis = qRecentPeis.eq('Escola_ID', queryEscola);

          const { data: pendingData } = await qRecentPeis;

          if (pendingData) {
            setPendingActivities(pendingData.map((item: any) => ({
              name: item.Alunos?.Nome || 'N/A',
              type: item.Tipo || 'Relatório de Progresso',
              time: new Date(item.Created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              status: item.Status || 'Pendente',
              priority: 'medium'
            })));
          }
        }

        const last5Days = [...Array(5)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (4 - i));
          return d.toISOString().split('T')[0];
        });

        const engagementCounts = await Promise.all(
          last5Days.map(async (day) => {
            let qEng = supabase
              .from('Aulas')
              .select('*', { count: 'exact', head: true })
              .gte('Data_hora_inicio', `${day}T00:00:00`)
              .lte('Data_hora_inicio', `${day}T23:59:59`);

            if (queryPlataforma) qEng = qEng.eq('Plataforma_ID', queryPlataforma);
            const { count } = await qEng;
            return count || 0;
          })
        );

        const maxCount = Math.max(...engagementCounts, 1);
        setEngagementMetrics(engagementCounts.map(c => Math.round((c / maxCount) * 100)));

        setRealStats({
          alunosAtivos: resAlunosAtivos || 0,
          totalAlunos: resTotalAlunos || 0,
          peisConcluidos: resPeisConcluidos || 0,
          totalPeis: resTotalPeis || 0,
          atendimentosHoje: resAtendimentosHoje || 0,
          mediaAlunosTurma: resTotalTurmas && resTotalTurmas > 0 ? Math.round((resTotalAlunosTurmas || 0) / resTotalTurmas) : 0,
          taxaAtivos: resTotalAlunos && resTotalAlunos > 0 ? Math.round(((resAlunosAtivos || 0) / resTotalAlunos) * 100) : 0,
          pendencia: resPendencia || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [authUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        setActiveView('students');
        playNotificationSound();
      }
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        toggleVoiceControl();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVoiceActive, playNotificationSound]);

  const toggleVoiceControl = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta controle de voz.");
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onend = () => setIsVoiceActive(false);
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes('buscar') || command.includes('pesquisar')) setIsSearchModalOpen(true);
      else if (command.includes('aluno')) setActiveView('students');
      else if (command.includes('gestão')) setActiveView('management');
      else if (command.includes('disciplina')) setActiveView('discipline');
      else if (command.includes('relatório')) setActiveView('reports');
      else if (command.includes('ajuste')) setActiveView('settings');
      else if (command.includes('admin')) setActiveView('system_admin');
    };
    recognition.start();
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleSync = () => syncOfflineActions(supabase);
    window.addEventListener('request-sync' as any, handleSync);
    const interval = setInterval(() => { if (navigator.onLine) handleSync(); }, 5 * 60 * 1000);
    return () => {
      window.removeEventListener('request-sync' as any, handleSync);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) onLogout();
  };

  const handleSelectSearchResult = (result: any) => {
    setIsSearchModalOpen(false);
    switch (result.type) {
      case 'Alunos': case 'PEIs': case 'Atendimentos': case 'Notas': setActiveView('students'); break;
      case 'Disciplinas': setActiveView('discipline'); break;
      case 'Turmas': case 'Professores': case 'Escolas': setActiveView('management'); break;
      case 'Usuarios': setActiveView('system_admin'); break;
      default: break;
    }
  };

  const statsList = [
    { label: 'Alunos Ativos', value: realStats.alunosAtivos.toString().padStart(2, '0'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Total' },
    { label: 'PEIs Concluídos', value: realStats.peisConcluidos.toString().padStart(2, '0'), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: `${realStats.totalPeis > 0 ? Math.round((realStats.peisConcluidos / realStats.totalPeis) * 100) : 0}% do total` },
    { label: 'Atendimentos Hoje', value: realStats.atendimentosHoje.toString().padStart(2, '0'), icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', trend: 'Hoje' },
    { label: 'Média Alunos/Turma', value: realStats.mediaAlunosTurma.toString().padStart(2, '0'), icon: LayoutDashboard, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Estável' },
    { label: 'Taxa de Ativos', value: `${realStats.taxaAtivos}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5', trend: `${realStats.alunosAtivos}/${realStats.totalAlunos} Alunos` },
    { label: 'Pendência', value: realStats.pendencia.toString().padStart(2, '0'), icon: Bell, color: 'text-red-500', bg: 'bg-red-50', trend: 'Atenção' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'students': return <StudentsView />;
      case 'management': return <ManagementView />;
      case 'discipline': return <DisciplineView />;
      case 'settings': return <SettingsView />;
      case 'reports': return <ReportsView />;
      case 'help': return <HelpCenter />;
      case 'system_admin': return <SuperAdminView />;
      default:
        return (
          <div className="animate-in fade-in duration-700">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  Seja bem vindo(a) ao VinculoTEA
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2">
                  Visão geral completa do sistema educacional.
                </p>
              </div>
              <div className="flex items-center gap-6 w-full xl:w-auto">
                <div className="relative group flex-1 xl:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    readOnly
                    onClick={() => setIsSearchModalOpen(true)}
                    placeholder="Pesquisar em todo o sistema..."
                    className="w-full xl:w-80 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium dark:text-white cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-black text-slate-900 dark:text-white">Notificações</h4>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Recentes</span>
                      </div>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group relative ${n.read ? 'bg-slate-50/50 dark:bg-slate-700/10' : 'bg-primary/5 dark:bg-primary/10 border-primary/10'}`}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all"
                            >
                              <X size={12} className="text-slate-400" />
                            </button>
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-sm font-bold ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{n.title}</p>
                              {!n.read && <span className="size-1.5 bg-primary rounded-full" />}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{n.description}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                          </div>
                        )) : <p className="text-center text-xs text-slate-400 font-medium py-8">Nenhuma notificação</p>}
                      </div>
                      {notifications.length > 0 && (
                        <button onClick={clearAll} className="w-full mt-4 py-2 text-xs font-black text-slate-400 hover:text-primary transition-colors text-center border-t border-slate-50 dark:border-slate-700 pt-3">
                          Limpar todas as notificações
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-4 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center font-black">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col pr-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px]">{user?.email}</p>
                    <p className="text-[10px] font-bold text-success uppercase tracking-widest">Premium Plan</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
              {statsList.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} dark:bg-slate-700/50 flex items-center justify-center`}>
                      <stat.icon size={22} />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">{stat.label}</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8">Atividades Pendentes</h2>
                <div className="space-y-3">
                  {pendingActivities.length > 0 ? pendingActivities.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-700/20 hover:bg-white dark:hover:bg-slate-700/40 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-black text-primary">{item.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-all">{item.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /><span className="text-sm font-medium">{item.time}</span></div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{item.status}</div>
                        <ChevronRight size={18} className="text-slate-300" />
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400 font-medium text-center py-8">Nenhuma atividade pendente.</p>}
                </div>
              </div>
              <div className="bg-primary dark:bg-primary/80 p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/10"><TrendingUp size={28} /></div>
                  <h3 className="text-2xl font-black text-white leading-tight mb-4">Engajamento Semanal</h3>
                  <div className="pt-8 mt-12 border-t border-white/10 flex justify-between items-end gap-4">
                    <div className="h-24 flex-1 flex items-end gap-1.5">
                      {engagementMetrics.map((h, i) => (
                        <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Média</p>
                      <p className="text-4xl font-black text-white tracking-tighter">
                        {engagementMetrics.length > 0 ? Math.round(engagementMetrics.reduce((a, b) => a + b, 0) / engagementMetrics.length) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboard}>
      {!tutorialCompleted && <OnboardingWizard />}
      <div className={styles.mobileHeader}>
        <img src={isDarkMode ? darkLogo : logotipoHorizontal} alt="Logo" className="h-12 w-auto object-contain" />
        <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl"><Menu size={22} /></button>
      </div>
      <div className={`${styles.overlay} ${isSidebarOpen ? styles.overlayVisible : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-10">
            <img src={isDarkMode ? darkLogo : logotipoHorizontal} alt="Logo" className="h-16 w-auto object-contain" />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Navegação</p>
          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', requiresPermission: null },
              { id: 'system_admin', icon: Briefcase, label: 'Painel SaaS', requiresPermission: 'canViewAllSchools' },
              { id: 'students', icon: Users, label: 'Alunos', requiresPermission: 'canViewStudents' },
              { id: 'management', icon: Briefcase, label: 'Gerenciamento', requiresPermission: 'canViewManagement' },
              { id: 'discipline', icon: BookOpen, label: 'Disciplinas', requiresPermission: 'canViewDisciplines' },
              { id: 'reports', icon: TrendingUp, label: 'Relatórios', requiresPermission: 'canViewReports' },
              { id: 'settings', icon: Settings, label: 'Ajustes', requiresPermission: null },
            ].filter(item => !item.requiresPermission || (permissions as any)?.[item.requiresPermission]).map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id as ViewState); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl font-bold text-sm transition-all ${activeView === item.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 font-bold text-sm hover:text-red-500 transition-all w-full p-3 rounded-2xl mt-auto">
            <LogOut size={18} /> Encerrar Sessão
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
          {renderContent()}
        </Suspense>
      </main>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} onSelectResult={handleSelectSearchResult} />
    </div>
  );
};