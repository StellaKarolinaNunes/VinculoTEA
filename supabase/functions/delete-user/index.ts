import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: { persistSession: false },
            }
        )

        const authHeader = req.headers.get('Authorization')!
        const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))

        if (userError || !caller) {
            throw new Error('Não autorizado: Sessão inválida.')
        }

        // VALIDATION: Check if caller is an Admin in app_metadata (Imutável no cliente)
        const callerRole = caller.app_metadata?.role;
        const callerPlatId = caller.app_metadata?.plataforma_id;

        if (callerRole !== 'Administrador') {
            throw new Error('Acesso inadequado: Apenas administradores podem excluir contas.')
        }

        const { user_id } = await req.json()
        if (!user_id) throw new Error('ID do usuário é obrigatório.')

        // SECURITY CHECK (MTI): Get target user to verify platform match
        const { data: targetUser, error: getTargetError } = await supabaseAdmin.auth.admin.getUserById(user_id)

        if (getTargetError || !targetUser.user) {
            throw new Error('Usuário alvo não encontrado.')
        }

        const targetPlatId = targetUser.user.app_metadata?.plataforma_id;

        // Cross-Tenant IDOR Protection
        if (callerPlatId !== targetPlatId) {
            console.error(`🚨 ALERT: User ${caller.id} from platform ${callerPlatId} tried to delete user from ${targetPlatId}`)
            throw new Error('Violação de Segurança: Você não tem permissão para remover usuários de outras plataformas.')
        }

        console.log(`🗑️ Excluindo usuário ${user_id} da plataforma ${targetPlatId}`)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id)

        if (deleteError) throw deleteError

        return new Response(JSON.stringify({ success: true, message: 'Usuário removido com sucesso.' }), {
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
