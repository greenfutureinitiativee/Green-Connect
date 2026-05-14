import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const lgasData = JSON.parse(readFileSync('src/data/lgas.json', 'utf8'));
const masterList = new Set();
lgasData.forEach(s => s.lgas.forEach(l => masterList.add(`${s.state}:${l}`)));

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function findExtra() {
    const { data: dbLgas, error } = await supabase
        .from('lgas')
        .select('name, state');
    
    if (error) {
        console.error(error);
        return;
    }

    const extra = dbLgas.filter(l => !masterList.has(`${l.state}:${l.name}`));
    console.log('Extra LGAs found:', extra);
}

findExtra();
