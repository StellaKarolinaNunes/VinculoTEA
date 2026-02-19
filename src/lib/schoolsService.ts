import { supabase } from './supabase';

export interface SchoolData {
    id?: string;
    nome: string;
    razao_social?: string;
    cnpj?: string;
    telefone?: string;
    endereco?: string;
    status?: string;
    logo?: string;
    configuracoes?: any;
    plataforma_id?: number;
}

export const schoolsService = {
    async getAll(plataforma_id?: number, escola_id?: number) {
        let query = supabase
            .from('Escolas')
            .select('*');

        if (plataforma_id) {
            query = query.eq('Plataforma_ID', plataforma_id);
        }

        if (escola_id) {
            query = query.eq('Escola_ID', escola_id);
        }

        const { data, error } = await query.order('Nome', { ascending: true });

        if (error) {
            console.error('Erro ao buscar escolas:', error);
            throw error;
        }


        return data.map((item: any) => ({
            id: item.Escola_ID.toString(),
            nome: item.Nome,
            razao_social: item.Razao_Social,
            cnpj: item.CNPJ,
            telefone: item.Telefone,
            endereco: item.Endereco,
            logo: item.Logo,
            configuracoes: item.Configuracoes || {},
            status: item.Status || 'Ativo'
        }));
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('Escolas')
            .select('*')
            .eq('Escola_ID', id)
            .single();

        if (error) throw error;

        return {
            id: data.Escola_ID.toString(),
            nome: data.Nome,
            razao_social: data.Razao_Social,
            cnpj: data.CNPJ,
            telefone: data.Telefone,
            endereco: data.Endereco,
            logo: data.Logo,
            configuracoes: data.Configuracoes || {},
            status: data.Status
        };
    },

    async create(school: SchoolData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado. Faça login novamente.');


        const { data, error } = await supabase
            .from('Escolas')
            .insert([{
                Nome: school.nome,
                Razao_Social: school.razao_social || null,
                CNPJ: school.cnpj || null,
                Telefone: school.telefone || null,
                Endereco: school.endereco,
                Status: 'Ativo',
                Plataforma_ID: school.plataforma_id
            }])
            .select();

        if (error) {
            console.error('Erro ao criar escola:', error);
            throw error;
        }
        return data ? data[0] : null;
    },

    async update(id: string, school: Partial<SchoolData>) {
        const { data, error } = await supabase
            .from('Escolas')
            .update({
                Nome: school.nome,
                Razao_Social: school.razao_social,
                CNPJ: school.cnpj,
                Telefone: school.telefone,
                Endereco: school.endereco,
                Logo: school.logo,
                Configuracoes: school.configuracoes,
                Status: school.status,
            })
            .eq('Escola_ID', id)
            .select();

        if (error) {
            console.error('Erro ao atualizar escola:', error);
            throw error;
        }
        return data ? data[0] : null;
    },

    async delete(id: string) {
        try {
            // 1. Buscar todos os alunos desta escola para limpeza profunda
            const { data: students } = await supabase
                .from('Alunos')
                .select('Aluno_ID')
                .eq('Escola_ID', id);

            if (students && students.length > 0) {
                const studentIds = students.map(s => s.Aluno_ID);

                // 2. Limpar dependências dos alunos (Agenda, PEIs, etc.) em massa
                await Promise.all([
                    supabase.from('Agenda').delete().in('Aluno_ID', studentIds),
                    supabase.from('PEIs').delete().in('Aluno_ID', studentIds),
                    supabase.from('Anotacoes').delete().in('Aluno_ID', studentIds),
                    supabase.from('Acompanhamentos').delete().in('Aluno_ID', studentIds),
                    supabase.from('Aulas_Alunos').delete().in('Aluno_ID', studentIds),
                    supabase.from('Alunos_Turmas').delete().in('Aluno_ID', studentIds),
                    supabase.from('Relatorios_PEI').delete().in('Aluno_ID', studentIds)
                ]);

                // 3. Deletar os alunos (necessário pois Escola_ID em Alunos não permite NULL)
                await supabase.from('Alunos').delete().in('Aluno_ID', studentIds);
            }

            // 4. Limpar outras referências vinculadas à escola
            await Promise.all([
                supabase.from('Professores').update({ Escola_ID: null }).eq('Escola_ID', id),
                supabase.from('Turmas').update({ Escola_ID: null }).eq('Escola_ID', id),
                supabase.from('Relatorios_PEI').delete().eq('Escola_ID', id)
            ]);

            // 5. Finalmente deletar a escola
            const { error } = await supabase
                .from('Escolas')
                .delete()
                .eq('Escola_ID', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao excluir escola e suas dependências:', error);
            throw error;
        }
    }
};
