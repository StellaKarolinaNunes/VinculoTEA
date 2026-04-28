import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import styles from '../Login/LoginNew.module.css'; // Reusing the same split-screen style
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* LADO ESQUERDO */}
            <div className={styles.leftSide}>
                <div className={styles.logoArea}>
                    <Logo />
                </div>

                <div className={styles.formWrapper}>
                    <div className={styles.tag} style={{ background: '#fff5f5', color: '#e53e3e' }}>
                        <div className={styles.tagDot} />
                        Sistema • Erro 500
                    </div>

                    <h1 className={styles.title}>
                        Ops! Algo <span>deu errado.</span>
                    </h1>

                    <p className={styles.description}>
                        Encontramos uma interrupção técnica inesperada. Fique tranquilo, nossa equipe já foi notificada e seus dados estão em segurança.
                    </p>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#0f172a',
                                color: 'white',
                                border: 'none',
                                padding: '1.25rem 2.5rem',
                                borderRadius: '1.25rem',
                                fontWeight: 900,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                        >
                            <RotateCcw size={18} />
                            Tentar Novamente
                        </button>

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
                                transition: 'all 0.2s',
                                alignSelf: 'flex-start',
                                padding: '0.5rem 0'
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

            {/* LADO DIREITO */}
            <div className={styles.rightSide}>
                <div className={styles.grid} />
                
                <div className={styles.statusContainer}>
                    <div className={styles.pulseIcon} style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <AlertCircle size={32} color="#ef4444" />
                    </div>
                    
                    <div className={styles.statusText}>
                        <span className={styles.statusLabel}>Status do Sistema</span>
                        <div className={styles.statusValue} style={{ color: '#ef4444' }}>
                            <div className={styles.statusDot} style={{ background: '#ef4444', boxShadow: '0 0 15px #ef4444' }} />
                            Interrupção Detectada
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
