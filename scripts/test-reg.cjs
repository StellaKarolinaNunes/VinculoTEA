
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vyugkgrmabfdjlabixij.supabase.co";
const supabaseAnonKey = "sb_publishable_gO-XgBZgI2xBl_usIt8S7Q_1rtuYog2";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistration() {
    const email = `test_${Date.now()}@exemplo.com`;
    const password = 'password123';

    console.log(`Testing registration with ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error('Registration failed:', error.message);
    } else {
        console.log('Registration successful! User ID:', data.user.id);
    }
}

testRegistration();
