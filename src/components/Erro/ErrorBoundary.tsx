import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import styles from './ErrorBoundary.module.css';
import { supabase } from '../../lib/supabase';
import { Logo } from '../Logo';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleLoginRedirect = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.clear();
        } catch (e) {
            console.warn('Failed to sign out on error boundary', e);
        }
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className={styles.container}>
                    {}
                    <div className={styles.leftPane}>
                        <header className={styles.header}>
                            <Logo />
                        </header>

                        <div className={styles.content}>
                            <div className={styles.tag}>
                                <span className={styles.tagDot}></span>
                                Sistema • Erro {(this.state.error as any)?.status || (this.state.error as any)?.code || '500'}
                            </div>

                            <h1 className={styles.title}>
                                Ops! Algo <br /><span className="italic">deu errado.</span>
                            </h1>

                            <p className={styles.message}>
                                Encontramos uma interrupção técnica inesperada. Fique tranquilo, nossa equipe já foi notificada e seus dados estão em segurança.
                            </p>

                            <div className="flex flex-col gap-4 items-start">
                                <button onClick={this.handleReload} className={styles.buttonPrimary}>
                                    <RefreshCw size={20} className="animate-spin-slow" />
                                    Tentar novamente
                                </button>

                                <button onClick={this.handleLoginRedirect} className={styles.buttonSecondary}>
                                    <ArrowLeft size={16} />
                                    Voltar ao início
                                </button>
                            </div>
                        </div>

                        <footer className={styles.footer}>
                            <p className={styles.footerText}>© 2026 Vinculo PEI • Sistema de Inteligência Pedagógica</p>
                        </footer>
                    </div>

                    {}
                    <div className={styles.rightPane}>
                        <div className={styles.rightPaneContent}>
                            <div className={styles.patternOverlay} />

                            <div className={styles.errorGraphic}>
                                <div className={styles.errorIconWrapper}>
                                    <AlertCircle size={64} strokeWidth={1.5} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Status do Sistema</h2>
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-red-500/80 text-[10px] font-bold uppercase tracking-widest">Interrupção Detectada</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-12 text-center w-full">
                                <p className="text-white/10 text-[8px] font-black uppercase tracking-[0.5em]">Segurança e Integridade de Dados Preservada</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

