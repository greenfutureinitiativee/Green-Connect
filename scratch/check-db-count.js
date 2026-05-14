import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkCount() {
    const { count, error } = await supabase
        .from('lgas')
        .select('*', { count: 'exact', head: true });
    
    if (error) console.error(error);
    else console.log('Current LGA count:', count);
}

checkCount();
