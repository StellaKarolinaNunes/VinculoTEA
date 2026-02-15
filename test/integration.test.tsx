import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { supabase } from '@/lib/supabase';
import { peisService } from '@/lib/peisService';
import { studentService } from '@/lib/studentService';

// Mock views to avoid complex child rendering
vi.mock('@/components/MarketingSection/MarketingSection', () => ({
    default: () => <div data-testid="marketing-section">Marketing</div>
}));

vi.mock('@/components/Dashboard/Management/ManagementView', () => ({
    ManagementView: () => <div data-testid="management-view">Gestão Administrativa
        <button>Unidades Escolares</button>
        <button>Corpo Docente</button>
        <button>Turmas</button>
    </div>
}));

vi.mock('@/components/Dashboard/Settings/SettingsView', () => ({
    SettingsView: () => <div data-testid="settings-view">
        Configurações do Sistema
        <button>Controle de Usuários</button>
        <div data-testid="users-tab">Novo Usuário</div>
    </div>
}));

describe('VínculoTEAFull Integration Tests', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        // Default mock for useAuth
        vi.mock('@/lib/useAuth', () => ({
            useAuth: () => ({
                user: { id: 'u123', nome: 'Admin User', email: 'admin@test.com', tipo: 'Administrador', plataforma_id: 1 },
                permissions: {
                    canViewStudents: true,
                    canViewManagement: true,
                    canViewDisciplines: true,
                    canViewReports: true,
                    canViewSettings: true
                },
                loading: false
            })
        }));

        // Default mock for Supabase tables
        (supabase.from as any).mockImplementation((table: string) => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            count: vi.fn().mockResolvedValue({ count: 5, error: null }),
            single: vi.fn().mockResolvedValue({ data: {}, error: null })
        }));
    });

    describe('Student Management UI', () => {
        it('opens the Student Registration Wizard', async () => {
            const { Dashboard } = await import('@/components/Dashboard/Dashboard');
            render(<Dashboard user={{ email: 'admin@test.com' }} onLogout={() => { }} />);

            fireEvent.click(screen.getByRole('button', { name: /Alunos/i }));

            // Should see "Novo Aluno" button in StudentsView
            await waitFor(() => {
                const btn = screen.getByText(/Novo Aluno/i);
                fireEvent.click(btn);
            });

            expect(screen.getByText(/Cadastrar Novo Aluno/i)).toBeInTheDocument();
            expect(screen.getByText(/Etapa 1 de 4/i)).toBeInTheDocument();
        });
    });

    describe('PEI Operations UI', () => {
        it('renders PEIs and allows opening the wizard', async () => {
            // Mock peisService.getAllByStudent
            vi.spyOn(peisService, 'getAllByStudent').mockResolvedValue([
                { id: 'p1', student_id: 's1', status: 'Ativo', dados: { nomeCompleto: 'Arthur Silva', anoLetivo: '2024' }, data_criacao: new Date().toISOString() }
            ]);

            const { PEIsTab } = await import('@/components/Dashboard/Students/Tabs/PEIsTab');
            render(<PEIsTab studentId="s1" studentName="Arthur" studentData={{}} onOpenWizard={() => { }} />);

            await waitFor(() => {
                expect(screen.getByText(/PEI —/i)).toBeInTheDocument();
                expect(screen.getByText(/Arthur Silva/i)).toBeInTheDocument();
            });

            // Click "Ver"
            fireEvent.click(screen.getByRole('button', { name: /^Ver$/i }));
            expect(screen.getByText(/PEI COMPLETO/i)).toBeInTheDocument();
        });
    });

    describe('Management & Settings Navigation', () => {
        it('navigates through Management tabs (Schools, Teachers, Classes)', async () => {
            const { Dashboard } = await import('@/components/Dashboard/Dashboard');
            render(<Dashboard user={{ email: 'admin@test.com' }} onLogout={() => { }} />);

            fireEvent.click(screen.getByRole('button', { name: /Gerenciamento/i }));

            await waitFor(() => {
                expect(screen.getByText(/Gestão Administrativa/i)).toBeInTheDocument();
            });

            // Check if tab buttons exist
            expect(screen.getByText(/Unidades Escolares/i)).toBeInTheDocument();
            expect(screen.getByText(/Corpo Docente/i)).toBeInTheDocument();
            expect(screen.getByText(/Turmas/i)).toBeInTheDocument();
        });

        it('navigates to Settings and User Management', async () => {
            const { Dashboard } = await import('@/components/Dashboard/Dashboard');
            render(<Dashboard user={{ email: 'admin@test.com' }} onLogout={() => { }} />);

            fireEvent.click(screen.getByRole('button', { name: /Ajustes/i }));

            // Increase timeout or check for a unique element
            await waitFor(() => {
                expect(screen.getByText(/Configurações do Sistema/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // Navigation within Settings
            const userControlBtn = screen.getByText(/Controle de Usuários/i);
            fireEvent.click(userControlBtn);

            await waitFor(() => {
                expect(screen.getByText(/Novo Usuário/i)).toBeInTheDocument();
            });
        });
    });

    describe('Global Features', () => {
        it('triggers Search Modal with Ctrl+K', async () => {
            const { Dashboard } = await import('@/components/Dashboard/Dashboard');
            render(<Dashboard user={{ email: 'admin@test.com' }} onLogout={() => { }} />);

            fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

            // Check if the state changed or the modal title appears
            // If SearchModal is lazy, we might need to mock it
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/Pesquisar em todo o sistema/i)).toBeInTheDocument();
            });
        });

        it('shows and hides Notification center', async () => {
            const { Dashboard } = await import('@/components/Dashboard/Dashboard');
            (supabase.from as any).mockReturnValue({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [], error: null })
            });

            render(<Dashboard user={{ email: 'admin@test.com' }} onLogout={() => { }} />);

            const bellBtn = screen.getByTestId('notification-bell');
            fireEvent.click(bellBtn);

            expect(screen.getByTestId('notification-panel-title')).toBeInTheDocument();
        });
    });
});
