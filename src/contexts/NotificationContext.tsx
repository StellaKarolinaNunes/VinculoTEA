import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
    removeNotification: (id: string) => void;
    playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('vinculo_notifications');
        return saved ? JSON.parse(saved) : [];
    });
    const [toast, setToast] = useState<Notification | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        localStorage.setItem('vinculo_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const playNotificationSound = () => {
        if (localStorage.getItem('sound_notifications') === 'false') return;

        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio context not supported or blocked:', e);
        }
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'time'>) => {
        const newNotif: Notification = {
            ...notif,
            id: Math.random().toString(36).substr(2, 9),
            read: false,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep last 50
        setToast(newNotif);
        setTimeout(() => setToast(current => current?.id === newNotif.id ? null : current), 5000);
        playNotificationSound();
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        if (!user) return;

        // Real-time subscriptions
        const channels = [
            supabase.channel('global-peis').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'PEIs'
            }, () => {
                addNotification({
                    title: 'Novo PEI Detectado',
                    description: 'Um novo plano individual foi iniciado.',
                    type: 'success'
                });
            }).subscribe(),

            supabase.channel('global-notes').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Anotacoes'
            }, () => {
                addNotification({
                    title: 'Nova Anotação',
                    description: 'Uma nova observação foi registrada.',
                    type: 'info'
                });
            }).subscribe(),

            supabase.channel('global-reports').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Relatorios_PEI'
            }, () => {
                addNotification({
                    title: 'Novo Relatório',
                    description: 'Um novo relatório de progresso foi enviado.',
                    type: 'info'
                });
            }).subscribe(),

            supabase.channel('global-students').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Alunos'
            }, () => {
                addNotification({
                    title: 'Novo Aluno',
                    description: 'Um novo aluno foi cadastrado na plataforma.',
                    type: 'success'
                });
            }).subscribe()
        ];

        return () => {
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            clearAll,
            removeNotification,
            playNotificationSound
        }}>
            {children}

            {/* Global Toast Overlay */}
            {toast && (
                <div
                    className="fixed bottom-6 right-6 z-[99999] animate-in slide-in-from-right-10 duration-500"
                    onClick={() => setToast(null)}
                >
                    <div className={`p-4 rounded-2xl shadow-2xl border flex gap-4 max-w-sm cursor-pointer transition-all hover:scale-[1.02] ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                        toast.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                            toast.type === 'error' ? 'bg-rose-50 border-rose-100' :
                                'bg-white border-slate-100'
                        }`}>
                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500 text-white' :
                            toast.type === 'warning' ? 'bg-amber-500 text-white' :
                                toast.type === 'error' ? 'bg-rose-500 text-white' :
                                    'bg-primary text-white'
                            }`}>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-sm">{toast.title}</p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{toast.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
