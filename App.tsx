import React, { useEffect, useState, lazy, Suspense } from 'react'
import { supabase } from "./src/lib/supabase";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const LoginNew = lazy(() => import('./src/components/Login/LoginNew').then(m => ({ default: m.LoginNew })));
const Dashboard = lazy(() => import('./src/components/Dashboard').then(m => ({ default: m.Dashboard })));
const ErrorPage = lazy(() => import('./src/components/ErrorPage/ErrorPage').then(m => ({ default: m.ErrorPage })));

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
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/dashboard');
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loadingAuth) return null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={
        <Suspense fallback={null}>
          <LoginNew />
        </Suspense>
      } />

      <Route path="/dashboard/*" element={
        user ? (
          <Suspense fallback={null}>
            <Dashboard user={user} onLogout={() => navigate('/login')} />
          </Suspense>
        ) : <Navigate to="/login" replace />
      } />

      <Route path="*" element={
        <Suspense fallback={null}>
          <ErrorPage />
        </Suspense>
      } />
    </Routes>
  );
};

export default App;

