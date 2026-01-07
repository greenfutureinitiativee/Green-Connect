import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('🔌 Testing Supabase connection...\n');

    // Test 1: Check if we can connect
    console.log('1️⃣  Testing authentication...');
    const { error: authError } = await supabase.auth.getUser();
    if (authError && authError.message !== 'Auth session missing!') {
        console.log('❌ Auth error:', authError.message);
    } else {
        console.log('✅ Connection successful (no user logged in is expected)\n');
    }

    // Test 2: Try to fetch from lgas table
    console.log('2️⃣  Checking lgas table...');
    const { data: lgasData, error: lgasError, count } = await supabase
        .from('lgas')
        .select('*', { count: 'exact' })
        .limit(3);

    if (lgasError) {
        console.log('❌ Error fetching LGAs:', lgasError.message);
        console.log('   The lgas table might not exist yet.\n');
    } else {
        console.log(`✅ LGAs table exists! Found ${count} total records`);
        if (lgasData && lgasData.length > 0) {
            console.log('   Sample LGA:', JSON.stringify(lgasData[0], null, 2));
        }
        console.log('');
    }

    // Test 3: Check profiles table
    console.log('3️⃣  Checking profiles table...');
    const { error: profilesError, count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .limit(1);

    if (profilesError) {
        console.log('❌ Error:', profilesError.message, '\n');
    } else {
        console.log(`✅ Profiles table exists! Found ${profilesCount} records\n`);
    }

    // Test 4: Check issue_reports table
    console.log('4️⃣  Checking issue_reports table...');
    const { error: issuesError, count: issuesCount } = await supabase
        .from('issue_reports')
        .select('*', { count: 'exact' })
        .limit(1);

    if (issuesError) {
        console.log('❌ Error:', issuesError.message, '\n');
    } else {
        console.log(`✅ Issue reports table exists! Found ${issuesCount} records\n`);
    }

    // Test 5: Check lga_projects table
    console.log('5️⃣  Checking lga_projects table...');
    const { error: projectsError, count: projectsCount } = await supabase
        .from('lga_projects')
        .select('*', { count: 'exact' })
        .limit(1);

    if (projectsError) {
        console.log('❌ Error:', projectsError.message, '\n');
    } else {
        console.log(`✅ LGA projects table exists! Found ${projectsCount} records\n`);
    }

    console.log('🎉 Connection test complete!');
}

testConnection().catch(console.error);
