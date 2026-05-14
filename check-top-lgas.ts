import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTop() {
    const { data: topLgas, error } = await supabase
        .from("lgas")
        .select("name, state, annual_budget")
        .order("annual_budget", { ascending: false })
        .limit(20);
    
    if (error) {
        console.error("Error:", error);
        return;
    }

    console.table(topLgas.map(lga => ({
        ...lga,
        budget_formatted: `₦${(lga.annual_budget / 1_000_000_000).toFixed(2)}B`
    })));
}

checkTop();
