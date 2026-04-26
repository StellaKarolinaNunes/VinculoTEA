import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Users,
  FileText,
  Settings,
  Calendar,
  Search,
  Bell,
  TrendingUp,
  CheckCircle,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  BookOpen,
  PieChart,
  Moon,
  Sun,
  ChevronRight,
  Clock,
  Layout,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Dashboard.module.css';
import logotipoHorizontal from '@/assets/images/logotipo_Horizontal.svg';
import darkLogo from '@/assets/images/dark.svg';

// Lazy loading sub-views
const StudentsView = lazy(() => import('./Students/StudentsView').then(m => ({ default: m.StudentsView })));
const ManagementView = lazy(() => import('./Management/ManagementView').then(m => ({ default: m.ManagementView })));
const DisciplineView = lazy(() => import('./Discipline/DisciplineView').then(m => ({ default: m.DisciplineView })));
const SettingsView = lazy(() => import('./Settings/SettingsView').then(m => ({ default: m.SettingsView })));
const ReportsView = lazy(() => import('./Reports/ReportsView').then(m => ({ default: m.ReportsView })));

type ViewState = 'dashboard' | 'students' | 'management' | 'discipline' | 'reports' | 'settings';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realStats, setRealStats] = useState({
    alunosAtivos: 0,
    PEIsGerados: 0,
    atendimentosHoje: 0,
    peisConcluidos: 0,
    taxaAtivos: 100
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: alunosCount } = await supabase
        .from('alunos')
        .select('*', { count: 'exact', head: true });

      const { count: peisCount } = await supabase
        .from('peis')
        .select('*', { count: 'exact', head: true });

      setRealStats(prev => ({
        ...prev,
        alunosAtivos: alunosCount || 0,
        PEIsGerados: peisCount || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };


  const sidebarItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'students', label: 'Alunos', icon: GraduationCap },
    { id: 'management', label: 'Gestão SaaS', icon: Layout },
    { id: 'discipline', label: 'Disciplinas', icon: BookOpen },
    { id: 'reports', label: 'Relatórios', icon: PieChart },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className={styles.dashboardContainer}>
      <div className={styles.topBar}>
        <div className={styles.pageInfo}>
          <h1 className={styles.welcomeTitle}>Seja bem vindo(a) ao VinculoTEA</h1>
          <p className={styles.welcomeSub}>Visão geral completa do sistema educacional.</p>
        </div>

        <div className={styles.topActions}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Pesquisar em todo o sistema..." className={styles.searchInput} />
          </div>

          <button className={styles.iconBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.notifBadge} />
          </button>

          <div className={styles.userBadge}>
            <div className={styles.avatarCircle}>S</div>
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user?.email}</span>
              <span className={styles.userPlan}>PREMIUM PLAN</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statsStrip}>
        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(150, 210, 104, 0.15)', color: '#96d268' }}>
            <Users size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>ALUNOS ATIVOS</span>
            <span className={styles.miniValue}>{realStats.alunosAtivos.toString().padStart(2, '0')}</span>
          </div>
          <span className={styles.miniTag}>Total</span>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(150, 210, 104, 0.15)', color: '#96d268' }}>
            <CheckCircle size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>PEIS CONCLUÍDOS</span>
            <span className={styles.miniValue}>00</span>
          </div>
          <span className={styles.miniTag}>0% do total</span>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(252, 206, 64, 0.15)', color: '#fcce40' }}>
            <Clock size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>ATENDIMENTOS HOJE</span>
            <span className={styles.miniValue}>00</span>
          </div>
          <span className={styles.miniTag}>Hoje</span>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(69, 90, 133, 0.15)', color: '#455a85' }}>
            <Layout size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>MÉDIA ALUNOS/TURMA</span>
            <span className={styles.miniValue}>00</span>
          </div>
          <span className={styles.miniTag}>Estável</span>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(150, 210, 104, 0.15)', color: '#96d268' }}>
            <TrendingUp size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>TAXA DE ATIVOS</span>
            <span className={styles.miniValue}>100%</span>
          </div>
          <span className={styles.miniTag}>3/3 Alunos</span>
        </div>

        <div className={styles.miniStatCard}>
          <div className={styles.miniIcon} style={{ background: 'rgba(252, 206, 64, 0.15)', color: '#fcce40' }}>
            <AlertCircle size={16} />
          </div>
          <div className={styles.miniInfo}>
            <span className={styles.miniLabel}>PENDÊNCIA</span>
            <span className={styles.miniValue}>00</span>
          </div>
          <span className={styles.miniTag}>Atenção</span>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainCard}>
          <h2 className={styles.cardTitle}>Atividades Pendentes</h2>
          <div className={styles.emptyState}>
            <p>Nenhuma atividade pendente.</p>
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.sideIconBox}>
            <TrendingUp size={20} />
          </div>
          <h2 className={styles.sideTitle}>Engajamento Semanal</h2>
          <div className={styles.sideChartInfo}>
            <span className={styles.sideSmallLabel}>MÉDIA</span>
            <span className={styles.sideBigValue}>0%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.dashboardWrapper} ${isDarkMode ? styles.dark : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src={isDarkMode ? darkLogo : logotipoHorizontal} alt="VinculoTEA" />
        </div>

        <div className={styles.sidebarNav}>
          <p className={styles.navCategory}>NAVEGAÇÃO</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewState)}
              className={`${styles.sidebarItem} ${activeView === item.id ? styles.sidebarItemActive : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button className={styles.sidebarFooter} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Encerrar Sessão</span>
        </button>
      </aside>

      <main className={styles.mainArea}>
        {activeView === 'dashboard' ? renderDashboard() : (
          <Suspense fallback={<div className={styles.loading}>Carregando...</div>}>
            {activeView === 'students' && <StudentsView />}
            {activeView === 'management' && <ManagementView />}
            {activeView === 'discipline' && <DisciplineView />}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'settings' && <SettingsView />}
          </Suspense>
        )}
      </main>
    </div>
  );
};