import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;


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
    async getAll(plataforma_id?: number, escola_id?: number) {
        let query = supabase
            .from('Usuarios')
            .select('*');

        if (plataforma_id) {
            query = query.eq('Plataforma_ID', plataforma_id);
        }

        if (escola_id) {
            query = query.eq('escola_id', escola_id);
        }

        const { data, error } = await query.order('Nome', { ascending: true });

        if (error) throw error;

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


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(cleanEmail)) {
            throw new Error(`O e-mail "${cleanEmail}" não segue o padrão aceito pelo sistema (ex: usuario@dominio.com).`);
        }


        if (!userData.senha || userData.senha.length < 6) {
            throw new Error('A senha deve ter no mínimo 6 caracteres.');
        }


        const { data: existingUser } = await supabase
            .from('Usuarios')
            .select('Usuario_ID, Nome, Email')
            .eq('Email', cleanEmail)
            .maybeSingle();

        if (existingUser) {
            throw new Error(`Este e-mail já está cadastrado para o usuário: ${existingUser.Nome}`);
        }

        try {

            let mappedRole = 'Profissional';
            const roleInput = userData.role || userData.tipo;

            if (roleInput === 'Administrador' || roleInput === 'admin') mappedRole = 'Administrador';
            else if (roleInput === 'GESTOR' || roleInput === 'escola') mappedRole = 'GESTOR';
            else if (roleInput === 'Tutor') mappedRole = 'Tutor';
            else if (roleInput === 'FAMILIA' || roleInput === 'familia' || roleInput === 'Família') mappedRole = 'Família';
            else mappedRole = 'Profissional';



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
                    auth_uid: null
                }])
                .select()
                .single();

            if (insertError) {
                console.error('❌ Erro ao criar perfil prévio:', insertError);
                throw new Error(`Erro ao preparar perfil: ${insertError.message}`);
            }

            console.log('✅ Perfil prévio criado. Iniciando Auth...');


            const { data: authData, error: authError } = await authClient.auth.signUp({
                email: cleanEmail,
                password: userData.senha,
                options: {
                    data: {
                        nome: userData.nome,
                        full_name: userData.nome,
                        role: mappedRole

                    }
                }
            });

            if (authError) {
                console.error('❌ Erro no Supabase Auth:', authError.message);


                console.log('🔄 Executando rollback do perfil...');
                await supabase.from('Usuarios').delete().eq('Usuario_ID', newUserProfile.Usuario_ID);

                if (authError.message.includes('already registered')) {
                    throw new Error('Este e-mail já está sendo utilizado por outro usuário no sistema.');
                }
                throw new Error(`O sistema de segurança recusou o cadastro (Auth): ${authError.message}`);
            }

            console.log('✅ Conta Auth criada. UID:', authData.user?.id);


            if (authData.user) {
                console.log('🔗 Vinculando auth_uid ao perfil...');
                await supabase
                    .from('Usuarios')
                    .update({ auth_uid: authData.user.id })
                    .eq('Usuario_ID', newUserProfile.Usuario_ID);


                if ((mappedRole === 'Profissional' || mappedRole === 'GESTOR') && userData.escola_id) {
                    console.log(`🏫 Criando vínculo com escola para role ${mappedRole}...`);
                    await supabase
                        .from('Professores')
                        .insert([{
                            Usuario_ID: newUserProfile.Usuario_ID,
                            Nome: userData.nome,
                            Email: cleanEmail,
                            Escola_ID: userData.escola_id ? parseInt(userData.escola_id) : null,
                            Especialidade: mappedRole === 'GESTOR' ? 'Administração Escolar' : 'Educação Regular',
                            Plataforma_ID: userData.plataforma_id,
                            Categoria: mappedRole === 'GESTOR' ? 'Profissional de Saúde' : 'Professor'
                        }]);
                }
            }


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


        if ((updates.role === 'Profissional' || updates.role === 'GESTOR') && updates.escola_id) {
            await supabase
                .from('Professores')
                .update({ Escola_ID: updates.escola_id })
                .eq('Usuario_ID', id);
        }

        return true;
    },

    async delete(id: string) {
        // 1. Get user details to see if we have an auth_uid
        const { data: userProfile } = await supabase
            .from('Usuarios')
            .select('auth_uid, Nome')
            .eq('Usuario_ID', id)
            .single();

        // 2. Handle linked teacher role and sub-data
        const { data: teacher } = await supabase
            .from('Professores')
            .select('Professor_ID')
            .eq('Usuario_ID', id)
            .maybeSingle();

        if (teacher) {
            const profId = teacher.Professor_ID;

            await supabase.from('Disponibilidade').delete().eq('Professor_ID', profId);
            await supabase.from('Turmas').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Aulas').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Relatorios_PEI').update({ Professor_ID: null }).eq('Professor_ID', profId);
            await supabase.from('Avaliacoes').update({ Professor_ID: null }).eq('Professor_ID', profId);

            await supabase.from('Professores').delete().eq('Professor_ID', profId);
        }

        await supabase.from('Anotacoes').delete().eq('Usuario_ID', id);

        // 3. Delete from Supabase Auth if linked
        if (userProfile?.auth_uid) {
            console.log(`🌐 Chamando Edge Function para apagar ${userProfile.Nome} do Auth...`);
            try {
                const { error: functionError } = await supabase.functions.invoke('delete-user', {
                    body: { user_id: userProfile.auth_uid }
                });

                if (functionError) {
                    console.warn('⚠️ Falha ao apagar do Auth (pode ser necessário implantar a Edge Function):', functionError);
                    // We continue anyway to at least clean up the DB
                }
            } catch (err) {
                console.error('❌ Erro na Edge Function:', err);
            }
        }

        // 4. Finally delete from Usuarios table
        const { error } = await supabase
            .from('Usuarios')
            .delete()
            .eq('Usuario_ID', id);

        if (error) throw error;
        return true;
    }
};
