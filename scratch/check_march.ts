import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMarchAllocations() {
    const { data: allocations, error } = await supabase
        .from("lga_allocations")
        .select(`
            amount,
            period,
            lgas (
                name,
                state
            )
        `)
        .eq("period", "2026-03-01")
        .limit(50);
    
    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(JSON.stringify(allocations, null, 2));
}

checkMarchAllocations();
