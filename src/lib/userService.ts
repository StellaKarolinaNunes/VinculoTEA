import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Separate client for creating users without logging out the current admin
const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

export interface UserProfile {
    id: string;
    nome: string;
    email: string;
    role: 'Admin' | 'Tutor' | 'Profissional';
    foto?: string;
    escola_id?: number;
}

export const userService = {
    async getAll(plataforma_id?: number) {
        let query = supabase
            .from('Usuarios')
            .select('*');

        if (plataforma_id) {
            query = query.eq('Plataforma_ID', plataforma_id);
        }

        const { data, error } = await query.order('Nome', { ascending: true });

        if (error) throw error;
        // Map 'Tipo' to 'Tipo_Acesso' for frontend consistency
        return data.map(u => ({
            ...u,
            Tipo_Acesso: u.Tipo
        }));
    },

    async create(userData: any) {
        if (!userData.email || typeof userData.email !== 'string') {
            throw new Error('E-mail é obrigatório.');
        }

        const cleanEmail = userData.email.trim().toLowerCase();

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            throw new Error(`Formato de e-mail inválido. Use o formato: nome@dominio.com`);
        }

        // Validate password
        if (!userData.senha || userData.senha.length < 6) {
            throw new Error('A senha deve ter no mínimo 6 caracteres.');
        }

        // VERIFICAÇÃO PRÉVIA: Checar se já existe na tabela Usuarios
        const { data: existingUser } = await supabase
            .from('Usuarios')
            .select('Usuario_ID, Nome, Email')
            .eq('Email', cleanEmail)
            .maybeSingle();

        if (existingUser) {
            throw new Error(`Este e-mail já está cadastrado para o usuário: ${existingUser.Nome}`);
        }

        try {
            // ETAPA ZERO: Mapear papel para o padrão do sistema (PascalCase como em criarPrimeiroAdmin.ts)
            let mappedRole = 'Profissional';
            const roleInput = userData.role || userData.tipo;

            if (roleInput === 'Administrador' || roleInput === 'GESTOR' || roleInput === 'admin') mappedRole = 'Administrador';
            else if (roleInput === 'Tutor' || roleInput === 'FAMILIA' || roleInput === 'familia') mappedRole = 'Tutor';
            else mappedRole = 'Profissional';

            // ETAPA 1: Criar o registro na tabela Usuarios PRIMEIRO (Manual First Pattern)
            // Isso evita dependência de triggers automáticos que podem falhar ao processar metadados
            console.log(`📝 Criando perfil prévio na tabela Usuarios (Role: ${mappedRole})...`);
            const { data: newUserProfile, error: insertError } = await supabase
                .from('Usuarios')
                .insert([{
                    Nome: userData.nome,
                    Email: cleanEmail,
                    Tipo: mappedRole,
                    Foto: userData.avatar,
                    Status: 'Ativo',
                    Plataforma_ID: userData.plataforma_id,
                    auth_uid: null // Será vinculado após o signUp bem-sucedido
                }])
                .select()
                .single();

            if (insertError) {
                console.error('❌ Erro ao criar perfil prévio:', insertError);
                throw new Error(`Erro ao preparar perfil: ${insertError.message}`);
            }

            console.log('✅ Perfil prévio criado. Iniciando Auth...');

            // ETAPA 2: Criar conta de autenticação usando client isolado
            const { data: authData, error: authError } = await authClient.auth.signUp({
                email: cleanEmail,
                password: userData.senha,
                options: {
                    data: {
                        nome: userData.nome,
                        full_name: userData.nome,
                        role: mappedRole
                        // Nota: plataforma_id removido do metadata para evitar falhas em triggers legados
                    }
                }
            });

            if (authError) {
                console.error('❌ Erro no Supabase Auth:', authError.message);

                // Rollback: Deletar o perfil criado na Etapa 1
                console.log('🔄 Executando rollback do perfil...');
                await supabase.from('Usuarios').delete().eq('Usuario_ID', newUserProfile.Usuario_ID);

                if (authError.message.includes('already registered')) {
                    throw new Error('Este e-mail já está sendo utilizado por outro usuário no sistema.');
                }
                throw new Error(`O sistema de segurança recusou o cadastro (Auth): ${authError.message}`);
            }

            console.log('✅ Conta Auth criada. UID:', authData.user?.id);

            // ETAPA 3: Vincular auth_uid ao perfil e criar vínculos extras
            if (authData.user) {
                console.log('🔗 Vinculando auth_uid ao perfil...');
                await supabase
                    .from('Usuarios')
                    .update({ auth_uid: authData.user.id })
                    .eq('Usuario_ID', newUserProfile.Usuario_ID);

                // Se for profissional, criar vínculo com escola
                if (mappedRole === 'Profissional' && userData.escola_id) {
                    console.log('🏫 Criando vínculo com escola...');
                    await supabase
                        .from('Professores')
                        .insert([{
                            Usuario_ID: newUserProfile.Usuario_ID,
                            Nome: userData.nome,
                            Email: cleanEmail,
                            Escola_ID: userData.escola_id ? parseInt(userData.escola_id) : null,
                            Especialidade: 'Educação Regular',
                            Plataforma_ID: userData.plataforma_id
                        }]);
                }
            }

            // Retornar o usuário final
            const { data: finalUser } = await supabase
                .from('Usuarios')
                .select('*')
                .eq('Usuario_ID', newUserProfile.Usuario_ID)
                .single();

            return finalUser;

        } catch (error: any) {
            console.error('❌ Erro geral na criação:', error);
            throw error;
        }
    },

    async update(id: string, updates: any) {
        const { error } = await supabase
            .from('Usuarios')
            .update({
                Nome: updates.nome,
                Tipo: updates.role,
                Foto: updates.avatar
            })
            .eq('Usuario_ID', id);

        if (error) throw error;

        // Update school link if professional
        if (updates.role === 'Profissional' && updates.escola_id) {
            await supabase
                .from('Professores')
                .update({ Escola_ID: updates.escola_id })
                .eq('Usuario_ID', id);
        }

        return true;
    },

    async delete(id: string) {
        // 1. Check if user is a teacher
        const { data: teacher } = await supabase
            .from('Professores')
            .select('Professor_ID')
            .eq('Usuario_ID', id)
            .single();

        if (teacher) {
            const profId = teacher.Professor_ID;

            // 2. Cascade cleanup for teacher dependent data
            // nullify or delete depending on business importance
            await supabase.from('Disponibilidade').delete().eq('Professor_ID', profId);
            await supabase.from('Turmas').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Aulas').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Relatorios_PEI').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Avaliacoes').update({ Professor_ID: null }).eq('Professor_ID', profId);

            // 3. Delete from Professors table
            await supabase.from('Professores').delete().eq('Professor_ID', profId);
        }

        // 4. Cleanup User level data
        await supabase.from('Anotacoes').delete().eq('Usuario_ID', id);

        // 5. Finally delete from Usuarios
        const { error } = await supabase
            .from('Usuarios')
            .delete()
            .eq('Usuario_ID', id);

        if (error) throw error;
        return true;
    }
};
