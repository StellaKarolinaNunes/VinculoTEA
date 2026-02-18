import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    persistSession: false,
                },
            }
        )

        // Get the caller's JWT to verify administration rights if necessary
        // However, since we want this to be simple for the user to deploy,
        // we assume the frontend sends a valid auth token which the edge function can verify.
        // By default, Supabase functions have the 'auth' context if the client passes the JWT.

        const authHeader = req.headers.get('Authorization')!
        const userClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: { headers: { Authorization: authHeader } },
            }
        )

        const { data: { user }, error: userError } = await userClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Não autorizado')
        }

        // Optional: Check if the user is an Admin in your Usuarios table
        const { data: profile } = await supabaseClient
            .from('Usuarios')
            .select('Tipo')
            .eq('auth_uid', user.id)
            .single()

        if (profile?.Tipo !== 'Administrador') {
            throw new Error('Apenas administradores podem excluir contas.')
        }

        const { user_id } = await req.json()

        if (!user_id) {
            throw new Error('ID do usuário é obrigatório.')
        }

        console.log(`🗑️ Excluindo usuário do Auth: ${user_id}`)
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user_id)

        if (deleteError) {
            throw deleteError
        }

        return new Response(JSON.stringify({ success: true, message: 'Usuário removido do Supabase Auth com sucesso.' }), {
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
