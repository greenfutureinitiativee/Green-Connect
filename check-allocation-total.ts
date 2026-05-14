import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTYxMjIsImV4cCI6MjA3ODc5MjEyMn0.lIKL7K-vshaBSfG7e7y9L3DnP_tBqCO12c8qDIZPvjo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTotal() {
    const { data: allLgas, error } = await supabase
        .from("lgas")
        .select("name, state, annual_budget");
    
    if (error) {
        console.error("Error:", error);
        return;
    }

    const total = allLgas?.reduce((sum, lga) => sum + (lga.annual_budget || 0), 0) || 0;
    const countWithBudget = allLgas?.filter(lga => (lga.annual_budget || 0) > 0).length || 0;
    
    console.log(`Total LGAs: ${allLgas?.length}`);
    console.log(`LGAs with budget > 0: ${countWithBudget}`);
    console.log(`Total Annual Budget (Global Sum): ₦${(total / 1_000_000_000).toFixed(2)}B`);
    
    if (allLgas && allLgas.length > 0) {
        console.log("\nSample LGAs with budget:");
        console.table(allLgas.filter(lga => (lga.annual_budget || 0) > 0).slice(0, 10));
    }
}

checkTotal();
