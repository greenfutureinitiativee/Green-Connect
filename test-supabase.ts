import { supabase } from './src/lib/supabase';

async function testConnection() {
    console.log('Testing Supabase connection...');

    // Test 1: Check if we can connect
    const { error: authError } = await supabase.auth.getUser();
    console.log('Auth check:', authError ? `Error: ${authError.message}` : 'Connected (no user logged in is expected)');

    // Test 2: Try to fetch from lgas table
    const { data: lgasData, error: lgasError } = await supabase
        .from('lgas')
        .select('*')
        .limit(5);

    if (lgasError) {
        console.error('Error fetching LGAs:', lgasError.message);
        console.log('The lgas table might not exist yet.');
    } else {
        console.log('LGAs found:', lgasData?.length || 0);
        if (lgasData && lgasData.length > 0) {
            console.log('Sample LGA:', lgasData[0]);
        }
    }

    // Test 3: Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
    } else {
        console.log('Profiles table exists, count:', profilesData?.length || 0);
    }

    // Test 4: Check issue_reports table
    const { data: issuesData, error: issuesError } = await supabase
        .from('issue_reports')
        .select('*')
        .limit(1);

    if (issuesError) {
        console.error('Error fetching issues:', issuesError.message);
    } else {
        console.log('Issue reports table exists, count:', issuesData?.length || 0);
    }
}

testConnection();
