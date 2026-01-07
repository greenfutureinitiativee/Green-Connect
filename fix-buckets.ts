
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBuckets() {
    const buckets = ['issue-images', 'lga-images', 'chat-images'];

    for (const bucket of buckets) {
        console.log(`Checking bucket: ${bucket}`);
        const { data, error } = await supabase.storage.getBucket(bucket);

        if (error && error.message.includes('not found')) {
            console.log(`Creating bucket: ${bucket}`);
            const { error: createError } = await supabase.storage.createBucket(bucket, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            });
            if (createError) console.error(`Error creating ${bucket}:`, createError);
            else console.log(`Created ${bucket}`);
        } else if (data) {
            console.log(`Bucket ${bucket} exists.`);
        } else {
            console.error(`Error checking ${bucket}:`, error);
        }
    }
}

createBuckets();
