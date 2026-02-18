
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vyugkgrmabfdjlabixij.supabase.co";
const supabaseAnonKey = "sb_publishable_gO-XgBZgI2xBl_usIt8S7Q_1rtuYog2";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
    console.log('Listing all users in Usuarios...');
    const { data, error } = await supabase
        .from('Usuarios')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Users found:', JSON.stringify(data, null, 2));
}

listUsers();
