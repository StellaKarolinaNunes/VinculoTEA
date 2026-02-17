import { useState } from 'react'

import { AtSign, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });


      if (authError) {
        if (authError.message === 'Invalid login credentials') {

          const cleanEmail = email.toLowerCase().trim();
          console.log(' Verificando e-mail na tabela:', cleanEmail);

          const { data: emailExists, error: checkError } = await supabase
            .from('Usuarios')
            .select('Email, Nome, Status')
            .ilike('Email', cleanEmail)
            .maybeSingle();

          console.log(' Resultado da verificação:', emailExists);
          console.log(' Erro (se houver):', checkError);

          if (emailExists) {

            console.log(' E-mail encontrado na tabela. Senha incorreta.');
            setError('E-mail ou senha incorretos.');
          } else {

            console.log(' E-mail NÃO encontrado na tabela Usuarios');
            setError('Esta conta não existe em nosso sistema. Entre em contato para solicitar uma demonstração: instagram.com/vinculotea');
          }
        } else {
          setError(authError.message);
        }
        return;
      }


      if (authData.user) {
        console.log(' Verificando se usuário está cadastrado no sistema...');

        const { data: userProfile, error: profileError } = await supabase
          .from('Usuarios')
          .select('Usuario_ID, Nome, Email, Tipo, Status')
          .eq('auth_uid', authData.user.id)
          .maybeSingle();


        if (profileError || !userProfile) {
          console.log('ACESSO NEGADO: Usuário não encontrado na tabela Usuarios');
          console.log(' Este é um usuário órfão - existe no Auth mas não foi cadastrado corretamente');


          await supabase.auth.signOut();

          setError(' Conta não configurada corretamente. Entre em contato com o suporte para solicitar acesso: instagram.com/vinculotea');
          return;
        }


        if (userProfile.Status !== 'Ativo') {
          console.log('❌ ACESSO NEGADO: Conta inativa');

          await supabase.auth.signOut();
          setError('Sua conta está inativa. Entre em contato com o administrador para reativar seu acesso.');
          return;
        }



      }
    } catch (err) {
      console.error(' Erro no processo de login:', err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div data-testid="login-error" className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>E-mail Institucional</label>
          <div className={styles.inputWrapper}>
            <div className={styles.iconLeft}><AtSign size={18} /></div>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="nome@instituicao.com.br"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Senha de Acesso</label>

          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.iconLeft}><Lock size={18} /></div>
            <input
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.rememberRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={styles.checkbox}
            />
            <span className="ml-2">Lembrar por 30 dias</span>
          </label>
        </div>

        <button disabled={isLoading} type="submit" className={styles.submitBtn}>
          {isLoading ? (
            <Loader2 className={styles.spin} size={20} />
          ) : (
            'Entrar na plataforma'
          )}
        </button>
      </form>
    </div>
  );
};