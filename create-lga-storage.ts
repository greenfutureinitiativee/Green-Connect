// Script to create the Supabase storage bucket for LGA images
// Run this with: npx tsx create-lga-storage.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createLGAImagesBucket() {
    console.log('Creating lga-images storage bucket...');

    try {
        // Create the bucket
        const { data, error } = await supabase.storage.createBucket('lga-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });

        if (error) {
            // Check if bucket already exists
            if (error.message.includes('already exists')) {
                console.log('✓ Bucket already exists');
                return true;
            }
            throw error;
        }

        console.log('✓ Bucket created successfully:', data);
        return true;
    } catch (error) {
        console.error('✗ Error creating bucket:', error);
        return false;
    }
}

async function setBucketPolicy() {
    console.log('Setting bucket policy...');

    try {
        // The bucket policies are set via RLS in the migration file
        // This function is kept for reference or manual setup if needed
        console.log('✓ Bucket policy will be managed via RLS policies');
        return true;
    } catch (error) {
        console.error('✗ Error setting bucket policy:', error);
        return false;
    }
}

async function main() {
    console.log('=== Supabase LGA Images Storage Setup ===\n');

    const bucketCreated = await createLGAImagesBucket();
    if (!bucketCreated) {
        process.exit(1);
    }

    await setBucketPolicy();

    console.log('\n=== Setup Complete ===');
    console.log('\nNext steps:');
    console.log('1. Run the database migration: supabase migration up');
    console.log('2. Verify the bucket exists in Supabase Dashboard > Storage');
    console.log('3. Test image upload functionality in the app');
}

main();
