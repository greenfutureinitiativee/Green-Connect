import { createClient } from '@supabase/supabase-js';
import lgasData from './src/data/lgas.json' assert { type: 'json' };

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Geopolitical zone mapping
const geopoliticalZones: Record<string, string> = {
    // North Central
    'Benue': 'North Central',
    'Kogi': 'North Central',
    'Kwara': 'North Central',
    'Nasarawa': 'North Central',
    'Niger': 'North Central',
    'Plateau': 'North Central',
    'Federal Capital Territory': 'North Central',

    // North East
    'Adamawa': 'North East',
    'Bauchi': 'North East',
    'Borno': 'North East',
    'Gombe': 'North East',
    'Taraba': 'North East',
    'Yobe': 'North East',

    // North West
    'Jigawa': 'North West',
    'Kaduna': 'North West',
    'Kano': 'North West',
    'Kastina': 'North West',
    'Katsina': 'North West',
    'Kebbi': 'North West',
    'Sokoto': 'North West',
    'Zamfara': 'North West',

    // South East
    'Abia': 'South East',
    'Anambra': 'South East',
    'Ebonyi': 'South East',
    'Enugu': 'South East',
    'Imo': 'South East',

    // South South
    'Akwa Ibom': 'South South',
    'Bayelsa': 'South South',
    'Cross River': 'South South',
    'Delta': 'South South',
    'Edo': 'South South',
    'Rivers': 'South South',

    // South West
    'Ekiti': 'South West',
    'Lagos': 'South West',
    'Ogun': 'South West',
    'Ondo': 'South West',
    'Osun': 'South West',
    'Oyo': 'South West',
};

async function populateLGAs() {
    console.log('🚀 Starting LGA population...\n');

    // First, check if LGAs already exist
    const { count: existingCount } = await supabase
        .from('lgas')
        .select('*', { count: 'exact', head: true });

    if (existingCount && existingCount > 0) {
        console.log(`⚠️  Database already has ${existingCount} LGAs.`);
        console.log('   Do you want to continue? This will skip duplicates.\n');
    }

    let totalInserted = 0;
    let totalSkipped = 0;
    let errors = 0;

    // Flatten the LGA data
    const allLGAs: Array<{ name: string; state: string; geopolitical_zone: string }> = [];

    lgasData.forEach((stateData: { state: string; lgas: string[] }) => {
        const zone = geopoliticalZones[stateData.state] || 'Unknown';
        stateData.lgas.forEach((lgaName: string) => {
            allLGAs.push({
                name: lgaName,
                state: stateData.state,
                geopolitical_zone: zone,
            });
        });
    });

    console.log(`📊 Total LGAs to insert: ${allLGAs.length}\n`);

    // Insert in batches of 50 to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < allLGAs.length; i += batchSize) {
        const batch = allLGAs.slice(i, i + batchSize);

        const { data, error } = await supabase
            .from('lgas')
            .insert(batch)
            .select();

        if (error) {
            // Check if it's a duplicate error
            if (error.code === '23505') {
                totalSkipped += batch.length;
                console.log(`⏭️  Batch ${Math.floor(i / batchSize) + 1}: Skipped ${batch.length} duplicates`);
            } else {
                errors++;
                console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
            }
        } else {
            totalInserted += data?.length || 0;
            console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: Inserted ${data?.length || 0} LGAs`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Population complete!');
    console.log(`   ✅ Inserted: ${totalInserted}`);
    console.log(`   ⏭️  Skipped: ${totalSkipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    // Verify final count
    const { count: finalCount } = await supabase
        .from('lgas')
        .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Total LGAs in database: ${finalCount}`);
}

populateLGAs().catch(console.error);
