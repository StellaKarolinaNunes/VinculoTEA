import { supabase } from './supabase';

export interface Plan {
    plano_id?: number;
    nome: string;
    quantidade_alunos: number;
    valor_mensal: number;
    valor_onboarding?: number;
    valor_unitario?: number;
    valor_aluno_excedente?: number;
    status: 'Ativo' | 'Inativo';
}

export const planService = {
    async getAll() {
        const { data, error } = await supabase
            .from('planos')
            .select('*')
            .order('nome', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getById(id: number) {
        const { data, error } = await supabase
            .from('planos')
            .select('*')
            .eq('plano_id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(plan: Omit<Plan, 'plano_id'>) {
        const { data, error } = await supabase
            .from('planos')
            .insert([plan])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: number, updates: Partial<Plan>) {
        const { data, error } = await supabase
            .from('planos')
            .update(updates)
            .eq('plano_id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from('planos')
            .delete()
            .eq('plano_id', id);

        if (error) throw error;
        return true;
    },

    async toggleStatus(id: number, currentStatus: string) {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        return this.update(id, { status: newStatus as 'Ativo' | 'Inativo' });
    }
};
