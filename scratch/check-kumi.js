import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkKumi() {
    const { data, error } = await supabase
        .from('lgas')
        .select('id, name, state')
        .or('name.eq.Kumi,name.eq.Kurmi');
    
    if (error) console.error(error);
    else console.log('LGAs found:', data);
}

checkKumi();
