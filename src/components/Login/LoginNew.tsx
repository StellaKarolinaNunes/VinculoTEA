import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import { LoginForm } from '../LoginForm/LoginForm';
import styles from './LoginNew.module.css';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginNew: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* LADO ESQUERDO: CONTEÚDO E FORMULÁRIO */}
            <div className={styles.leftSide}>
                <div className={styles.logoArea}>
                    <Logo />
                </div>

                <div className={styles.formWrapper}>
                    <div className={styles.tag}>
                        <div className={styles.tagDot} />
                        Acesso Restrito • VínculoTEA
                    </div>

                    <h1 className={styles.title}>
                        Bem-vindo <span>ao seu ecossistema.</span>
                    </h1>

                    <p className={styles.description}>
                        Conectando educação e terapia em uma plataforma inteligente para o desenvolvimento atípico.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <LoginForm onForgotPassword={() => navigate('/forgot-password')} />
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = '#0f172a')}
                            onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                        >
                            <ArrowLeft size={16} />
                            Voltar ao Início
                        </button>
                    </div>
                </div>

                <footer className={styles.footer}>
                    © 2026 VINCULO PEI • SISTEMA DE INTELIGÊNCIA PEDAGÓGICA
                </footer>
            </div>

            {/* LADO DIREITO: DESIGN TECH/STATUS */}
            <div className={styles.rightSide}>
                <div className={styles.grid} />
                
                <div className={styles.statusContainer}>
                    <div className={styles.pulseIcon}>
                        <AlertCircle size={32} color="rgba(255,255,255,0.2)" />
                    </div>
                    
                    <div className={styles.statusText}>
                        <span className={styles.statusLabel}>Status do Sistema</span>
                        <div className={styles.statusValue}>
                            <div className={styles.statusDot} />
                            Conexão Segura Ativa
                        </div>
                    </div>
                </div>

                <div className={styles.bottomNote}>
                    Segurança e Integridade de Dados Preservada
                </div>
            </div>
        </div>
    );
};
