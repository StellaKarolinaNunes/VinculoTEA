import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { auth: { persistSession: false } }
        )

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Acesso negado: Token ausente.')

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: caller }, error: callerError } = await supabaseAdmin.auth.getUser(token)

        if (callerError || !caller) {
            throw new Error('Sessão inválida. Por favor, faça login novamente.')
        }

        let callerRole = caller.app_metadata?.role
        let callerPlatId = caller.app_metadata?.plataforma_id

        if (!callerRole) {
            const { data: profile } = await supabaseAdmin
                .from('Usuarios')
                .select('Tipo, Plataforma_ID')
                .eq('auth_uid', caller.id)
                .single()
            if (profile) {
                callerRole = profile.Tipo
                callerPlatId = profile.Plataforma_ID
            }
        }

        if (callerRole !== 'Administrador' && callerRole !== 'GESTOR') {
            throw new Error(`Permissão insuficiente (${callerRole}). Apenas Administradores e Gestores podem criar novos usuários.`)
        }

        const { email, senha, nome, role, plataforma_id, plano_id, escola_id } = await req.json()

        if (!email || !senha || !nome || !plataforma_id) {
            throw new Error('E-mail, senha, nome e plataforma são obrigatórios.')
        }

        // --- VALIDAÇÕES DE TENANT ---
        if (callerRole === 'GESTOR' && Number(callerPlatId) !== Number(plataforma_id)) {
            throw new Error('Erro de Segurança: Gestores só podem criar usuários para sua própria plataforma.')
        }

        // --- CRIAR NO AUTH ---
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: senha,
            email_confirm: true,
            user_metadata: { nome, plataforma_id, escola_id },
            app_metadata: {
                role: role || 'Profissional',
                plataforma_id: plataforma_id,
                plano_id: role === 'Administrador' ? 15 : (plano_id || 15),
                escola_id: escola_id || null
            }
        })

        if (authError) throw authError

        if (authData.user) {
            // 1. Criar na tabela Usuarios (Referência Central)
            const { error: profileError } = await supabaseAdmin
                .from('Usuarios')
                .insert([{
                    Nome: nome,
                    Email: email.toLowerCase(),
                    Tipo: role || 'Profissional',
                    Status: 'Ativo',
                    Plataforma_ID: plataforma_id,
                    Plano_ID: role === 'Administrador' ? 15 : (plano_id || 15),
                    Escola_ID: escola_id || null,
                    auth_uid: authData.user.id
                }])

            if (profileError) {
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
                throw profileError
            }

            // 2. Criar na tabela Professores (Para GESTOR ou PROFISSIONAL aparecerem nas listagens pedagógicas)
            if (role === 'GESTOR' || role === 'Profissional' || role === 'PROFISSIONAL') {
                const { error: profError } = await supabaseAdmin
                    .from('Professores')
                    .insert([{
                        Nome: nome,
                        Email: email.toLowerCase(),
                        Tipo: role,
                        Categoria: role === 'GESTOR' ? 'Professor' : 'Profissional de Saúde',
                        Usuario_ID: null, // Pode ser preenchido se houver Usuario_ID numérico
                        Plataforma_ID: plataforma_id,
                        Escola_ID: escola_id || null,
                        Status: 'Ativo'
                    }])

                if (profError) {
                    console.warn('⚠️ Usuário criado no Usuarios, mas falha ao criar registro em Professores:', profError.message);
                }
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
