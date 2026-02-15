import { supabase } from './supabase';

export interface Discipline {
    id: string;
    nome: string;
    descricao?: string;
    status: string;
    professores?: string[]; // IDs of linked teachers
}

export const disciplinesService = {
    async getAll(plataforma_id?: number) {
        let query = supabase
            .from('Disciplinas')
            .select(`
                *,
                Professores_Disciplinas (Professor_ID)
            `);

        if (plataforma_id) {
            query = query.eq('Plataforma_ID', plataforma_id);
        }

        const { data, error } = await query.order('Nome', { ascending: true });

        if (error) throw error;
        return data.map(d => ({
            id: d.Disciplina_ID.toString(),
            nome: d.Nome,
            descricao: d.Descricao,
            status: d.Status,
            professores: d.Professores_Disciplinas?.map((pd: any) => pd.Professor_ID.toString()) || []
        }));
    },

    async create(discipline: { nome: string; descricao?: string; plataforma_id?: number; professores?: string[] }) {
        const { data, error } = await supabase
            .from('Disciplinas')
            .insert([{
                Nome: discipline.nome,
                Descricao: discipline.descricao,
                Status: 'Ativo',
                Plataforma_ID: discipline.plataforma_id
            }])
            .select();

        if (error) throw error;
        const newDiscipline = data[0];

        // Save teacher relationships if provided
        if (discipline.professores && discipline.professores.length > 0) {
            const relationships = discipline.professores.map(pId => ({
                Professor_ID: parseInt(pId),
                Disciplina_ID: newDiscipline.Disciplina_ID
            }));
            const { error: relError } = await supabase
                .from('Professores_Disciplinas')
                .insert(relationships);
            if (relError) console.error('Erro ao salvar vínculos de professores:', relError);
        }

        return newDiscipline;
    },

    async update(id: string, discipline: { nome: string; descricao?: string; status?: string; plataforma_id?: number; professores?: string[] }) {
        const { data, error } = await supabase
            .from('Disciplinas')
            .update({
                Nome: discipline.nome,
                Descricao: discipline.descricao,
                Status: discipline.status,
                Plataforma_ID: discipline.plataforma_id
            })
            .eq('Disciplina_ID', id)
            .select();

        if (error) throw error;

        // Update teacher relationships
        if (discipline.professores) {
            // First remove existing
            await supabase
                .from('Professores_Disciplinas')
                .delete()
                .eq('Disciplina_ID', id);

            // Then insert new ones
            if (discipline.professores.length > 0) {
                const relationships = discipline.professores.map(pId => ({
                    Professor_ID: parseInt(pId),
                    Disciplina_ID: parseInt(id)
                }));
                const { error: relError } = await supabase
                    .from('Professores_Disciplinas')
                    .insert(relationships);
                if (relError) console.error('Erro ao atualizar vínculos de professores:', relError);
            }
        }

        return data[0];
    },

    async delete(id: string) {
        // 1. Clean up dependencies
        // Clean Professores_Disciplinas (though ON DELETE CASCADE should handle it, we'll be explicit)
        await supabase.from('Professores_Disciplinas').delete().eq('Disciplina_ID', id);

        // Clean Acompanhamentos
        await supabase.from('Acompanhamentos').delete().eq('Disciplina_ID', id);

        // Clean Aulas
        await supabase.from('Aulas').delete().eq('Disciplina_ID', id);

        // 2. Delete the discipline
        const { error } = await supabase
            .from('Disciplinas')
            .delete()
            .eq('Disciplina_ID', id);

        if (error) throw error;
    },

    async fetchCount(plataforma_id?: number) {
        let query = supabase
            .from('Disciplinas')
            .select('*', { count: 'exact', head: true });

        if (plataforma_id) {
            query = query.eq('Plataforma_ID', plataforma_id);
        }

        const { count, error } = await query;

        if (error) throw error;
        return count || 0;
    }
};

