import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Logo } from "./src/components/Logo"
import { supabase } from "./src/lib/supabase";
import styles from "./styles/App.module.css";

const LoginForm = lazy(() => import('./src/components/LoginForm/LoginForm').then(m => ({ default: m.LoginForm })));
const ForgotPassword = lazy(() => import('./src/components/ForgotPassword/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./src/components/ResetPassword/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Dashboard = lazy(() => import('./src/components/Dashboard').then(m => ({ default: m.Dashboard })));
const MarketingSection = lazy(() => import('./src/components/MarketingSection/MarketingSection'));




import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

type View = 'login' | 'forgot-password' | 'reset-password' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else {
        setUser(null);
        if (location.pathname !== '/marketing') {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loadingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="font-black text-primary text-[10px] uppercase tracking-widest">
            Carregando VínculoTEA...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/marketing" element={
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><div className="animate-spin size-8 border-4 border-primary/20 border-t-primary rounded-full" /></div>}>
          <div className="h-screen w-screen overflow-auto">
            <MarketingSection />
          </div>
        </Suspense>
      } />

      <Route path="/login" element={
        <div className={styles.container}>
          <main className={styles.mainPane}>
            <header className="mb-6 text-center">
              <Logo />
            </header>
            <div className="flex flex-col max-w-md mx-auto w-full gap-8">
              <div className="flex flex-col gap-6">
                <div className="text-left">
                  <div className={styles.badge}>
                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                    Gestão Multidisciplinar
                  </div>
                  <h1 className="text-3xl font-black tracking-tight mt-2 text-primary">
                    Bem-vindo de volta!
                  </h1>
                  <p className="mt-2 text-slate-500 text-sm">
                    Potencialize o ensino com nossa plataforma inteligente.
                  </p>
                </div>
                <LoginForm onForgotPassword={() => navigate('/forgot-password')} />
              </div>

              <div className="text-center mt-6">
                <p className="text-slate-400 text-xs font-semibold">
                  Ainda não faz parte?{' '}
                  <a href="https://instagram.com/vinculotea" className="text-primary font-black underline underline-offset-4">
                    solicite uma demonstração
                  </a>
                </p>
              </div>
            </div>
            <footer className="mt-auto pt-6 text-center">
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                © 2026 VínculoTEA
              </p>
            </footer>
          </main>
          <div className={styles.marketingPane}>
            <Suspense fallback={null}>
              <MarketingSection />
            </Suspense>
          </div>
        </div>
      } />

      <Route path="/forgot-password" element={
        <div className={styles.container}>
          <main className={styles.mainPane}>
            <header className="mb-6 text-center">
              <Logo />
            </header>
            <div className="flex flex-col max-w-md mx-auto w-full gap-8">
              <Suspense fallback={<div className="animate-spin size-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />}>
                <ForgotPassword onBack={() => navigate('/login')} onSuccess={() => navigate('/reset-password')} />
              </Suspense>
            </div>
          </main>
          <div className={styles.marketingPane}>
            <Suspense fallback={null}>
              <MarketingSection />
            </Suspense>
          </div>
        </div>
      } />

      <Route path="/reset-password" element={
        <div className={styles.container}>
          <main className={styles.mainPane}>
            <header className="mb-6 text-center">
              <Logo />
            </header>
            <div className="flex flex-col max-w-md mx-auto w-full gap-8">
              <Suspense fallback={<div className="animate-spin size-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />}>
                <ResetPassword onSuccess={() => navigate('/login')} />
              </Suspense>
            </div>
          </main>
          <div className={styles.marketingPane}>
            <Suspense fallback={null}>
              <MarketingSection />
            </Suspense>
          </div>
        </div>
      } />

      <Route path="/dashboard/*" element={
        user ? (
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-slate-900">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-black text-primary uppercase tracking-[0.2em] animate-pulse">Iniciando Ambiente...</p>
              </div>
            </div>
          }>
            <Dashboard user={user} onLogout={() => navigate('/login')} />
          </Suspense>
        ) : <Navigate to="/login" replace />
      } />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
