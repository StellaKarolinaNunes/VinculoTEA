
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vyugkgrmabfdjlabixij.supabase.co";
const supabaseAnonKey = "sb_publishable_gO-XgBZgI2xBl_usIt8S7Q_1rtuYog2";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function register() {
    console.log('Registering adm@vinculotea.com...');
    const { data, error } = await supabase.auth.signUp({
        email: 'adm@vinculotea.com',
        password: '123456'
    });
    if (error) console.log('ERROR:', error.message);
    else console.log('SUCCESS:', data.user.id);
}

register();
