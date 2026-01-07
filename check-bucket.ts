
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error);
    } else {
        console.log('Buckets:', data.map(b => b.name));
        const issueImages = data.find(b => b.name === 'issue-images');
        if (!issueImages) {
            console.log('Bucket "issue-images" NOT FOUND. Attempting to create...');
            // Note: Creating buckets via client requires admin rights or specific policies. 
            // We might need to just report this.
        } else {
            console.log('Bucket "issue-images" FOUND.');
        }
    }
}

checkBuckets();
