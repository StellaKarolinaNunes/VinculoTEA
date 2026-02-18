
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vyugkgrmabfdjlabixij.supabase.co";
const supabaseAnonKey = "sb_publishable_gO-XgBZgI2xBl_usIt8S7Q_1rtuYog2";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerAdmin() {
    const email = 'adm@vinculotea.com';
    const password = '123456';
    const name = 'Administrador Geral';

    console.log(`Starting registration for ${email}...`);

    // Step 1: Sign Up in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nome: name,
                role: 'Administrador'
            }
        }
    });

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log('User already exists in Auth. This is likely an orphan user.');
        } else {
            console.error('Auth Error:', authError.message);
            return;
        }
    } else {
        console.log('Auth user created successfully!');
    }

    // Step 2: Try to insert into Usuarios if possible (this might fail due to RLS, but if the user just signed up they might have permission depending on RLS)
    // Actually, usually RLS prevents inserting into Usuarios unless logged in or using Service Role.
    // But let's check if there's a trigger.

    console.log('Checking if Usuarios entry was created via trigger...');
    const { data: userExists } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('Email', email)
        .maybeSingle();

    if (userExists) {
        console.log('Usuarios entry already exists! Trigger is working.');
    } else {
        console.log('Usuarios entry NOT found. Attempting manual insert (might fail)...');
        // Manual insert as the user themselves (we need to be signed in)
        if (authData?.session) {
            console.log('Session found, using session to insert...');
            const { error: insertError } = await supabase
                .from('Usuarios')
                .insert([{
                    Nome: name,
                    Email: email,
                    Tipo: 'Administrador',
                    Status: 'Ativo',
                    auth_uid: authData.user.id
                }]);
            if (insertError) console.error('Manual insert error:', insertError.message);
            else console.log('Manual insert successful!');
        } else {
            console.log('No session (check email confirmation settings). If email confirmation is required, manual insert will fail.');
        }
    }
}

registerAdmin();
