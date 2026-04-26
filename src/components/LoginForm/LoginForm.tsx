import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>E-mail Institucional</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.passwordRow}>
        <div className={styles.fieldGroup} style={{ flex: 1 }}>
          <label className={styles.label}>Senha</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <label className={styles.rememberArea}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Lembre-se
        </label>
      </div>

      <div>
        <button 
          type="button"
          className={styles.forgotLink} 
          onClick={onForgotPassword}
        >
          esqueci a senha
        </button>
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      <div className={styles.submitArea}>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar na plataforma'}
        </button>
      </div>

      <p className={styles.signupText}>
        Ainda não faz parte? <span className={styles.signupLink}>solicite uma demonstração</span>
      </p>
    </form>
  );
};