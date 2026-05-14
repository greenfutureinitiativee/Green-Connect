import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllocations() {
    const { data: allocations, error } = await supabase
        .from("lga_allocations")
        .select("*")
        .order("period", { ascending: false });
    
    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(`Total allocation records: ${allocations?.length}`);
    
    const periods = [...new Set(allocations?.map(a => a.period))];
    console.log("Available periods:", periods);

    for (const period of periods) {
        const periodData = allocations?.filter(a => a.period === period);
        const total = periodData?.reduce((sum, a) => sum + (Number(a.amount) || 0), 0) || 0;
        console.log(`Period: ${period} | Total: ₦${(total / 1_000_000_000).toFixed(2)}B | Count: ${periodData?.length}`);
    }

    // Check sum of all periods for 2026
    const total2026 = allocations?.reduce((sum, a) => sum + (Number(a.amount) || 0), 0) || 0;
    console.log(`\nGrand Total Disbursed (All periods): ₦${(total2026 / 1_000_000_000).toFixed(2)}B`);
}

checkAllocations();
