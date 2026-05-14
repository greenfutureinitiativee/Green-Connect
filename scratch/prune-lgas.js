import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const lgasData = JSON.parse(readFileSync('src/data/lgas.json', 'utf8'));
const masterList = new Set();
lgasData.forEach(s => s.lgas.forEach(l => masterList.add(`${s.state}:${l}`)));

console.log('Master list size:', masterList.size);

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function prune() {
    console.log('Fetching all LGAs from DB...');
    const { data: dbLgas, error } = await supabase
        .from('lgas')
        .select('id, name, state');
    
    if (error) {
        console.error(error);
        return;
    }

    console.log('Found', dbLgas.length, 'LGAs in DB.');
    const extra = dbLgas.filter(l => !masterList.has(`${l.state}:${l.name}`));
    console.log('Extra LGAs to delete:', extra.length);
    console.log(extra);

    if (extra.length > 0) {
        const idsToDelete = extra.map(l => l.id);
        console.log('Deleting extra LGAs...');
        const { error: deleteError } = await supabase
            .from('lgas')
            .delete()
            .in('id', idsToDelete);
        
        if (deleteError) console.error('Delete error:', deleteError);
        else console.log('Successfully pruned extra LGAs.');
    } else {
        console.log('Nothing to prune.');
    }

    const { count } = await supabase
        .from('lgas')
        .select('*', { count: 'exact', head: true });
    console.log('Final LGA count:', count);
}

prune();
