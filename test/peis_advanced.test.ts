import { describe, it, expect, vi, beforeEach } from 'vitest';
import { peisService } from '@/lib/peisService';
import { executionService } from '@/lib/executionService';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
        })),
    },
}));

describe('Advanced PEI Lifecycle & Executions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('PEI Service - Advanced', () => {
        it('should archive a PEI (status update)', async () => {
            const mockData = [{ PEI_ID: 1, Status: 'Arquivado' }];
            (supabase.from as any).mockReturnValue({
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockResolvedValue({ data: mockData, error: null })
            });

            const result = await peisService.update('1', { status: 'Arquivado' });
            expect(result.Status).toBe('Arquivado');
        });

        it('should allow duplicating a PEI (create with existing data)', async () => {
            const existingDados = { metas: ['Meta 1'] };
            const mockData = [{ PEI_ID: 2, Aluno_ID: 10, Status: 'Ativo', Dados: existingDados }];

            (supabase.from as any).mockReturnValue({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockResolvedValue({ data: mockData, error: null })
            });

            const result = await peisService.create('10', existingDados);
            expect(result.Dados).toEqual(existingDados);
            expect(result.Aluno_ID).toBe(10);
        });
    });

    describe('Execution Service (Tasks)', () => {
        it('should register a new task execution', async () => {
            const executionData = {
                student_id: '1',
                disciplina_id: '1',
                data: '2024-02-14',
                atividade: 'Ler texto',
                nivel_suporte: 'parcial' as const,
                tipo_barreira: 'cognitiva' as const,
                status: 'concluido' as const,
                observacoes: 'Foi bem'
            };

            const mockData = [{ id: '100', ...executionData }];

            (supabase.from as any).mockReturnValue({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockResolvedValue({ data: mockData, error: null })
            });

            const result = await executionService.create(executionData);
            expect(result.atividade).toBe('Ler texto');
            expect(result.nivel_suporte).toBe('parcial');
        });

        it('should fetch executions for a student', async () => {
            const mockData = [
                { id: '1', Atividade: 'Ativ 1', Disciplinas: { Nome: 'Mat' } }
            ];

            (supabase.from as any).mockReturnValue({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: mockData, error: null })
            });

            const result = await executionService.getAllByStudent('1');
            expect(result).toHaveLength(1);
            expect(result[0].Atividade).toBe('Ativ 1');
        });
    });
});
