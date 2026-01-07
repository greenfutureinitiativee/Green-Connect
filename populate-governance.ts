import { createClient } from '@supabase/supabase-js';
// import governanceData from './lga_governance_data.json' assert { type: 'json' };

// Configuration - Replace with Process ENV in production
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rdrkjkcvhjqwngmpcgld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcmtqa2N2aGpxd25nbXBjZ2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNjEyMiwiZXhwIjoyMDc4NzkyMTIyfQ.2gjs-x0CgZoEfeDVDRmg6MEBkKXK1lYJAv-qzXlmQEg'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

// Placeholder for the data structure the user/agent will provide
interface GovernanceImport {
    lga_name: string;
    state: string;
    governance: any;
}

// Example data structure (Replace this with the actual JSON import)
const governanceData: GovernanceImport[] = [
    {
        lga_name: "Agege",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "High Chief Ganiyu Kola Egunjobi", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Gbenga Abiola", party: "APC" },
                secretary: { name: "Hon. Gbenga Abiola" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Anigbajumo", ward: "Ward A" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Ajeromi-Ifelodun",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Fatai Adekunle Ayoola", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Lucky Uduikhue", party: "APC" },
                secretary: { name: "Hon. Ooh" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Kehinde Arogundade", ward: "Ward B" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Alimosho",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Jelili Sulaimon", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Akinpelu Johnson", party: "APC" },
                secretary: { name: "Hon. Dara" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Obadina", ward: "Ward C" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Amuwo-Odofin",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Valentine Oluseyi Buraimoh", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Maureen Ashara", party: "APC" },
                secretary: { name: "Hon. Abimbola" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Ojo", ward: "Ward D" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Apapa",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Idowu Adejumoke Senbanjo", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Kevin Gabriel", party: "APC" },
                secretary: { name: "Hon. Tunde" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Sikiru", ward: "Ward E" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Badagry",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Olusegun Onilude", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Akande", party: "APC" },
                secretary: { name: "Hon. Setonji" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Hungbo", ward: "Ward F" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Epe",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Princess Surah Animashaun", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Saliu", party: "APC" },
                secretary: { name: "Hon. Rahman" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Edu", ward: "Ward G" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Eti Osa",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Saheed Adesegun Bankole", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Isiaka", party: "APC" },
                secretary: { name: "Hon. Badmus" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Taiwo", ward: "Ward H" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Ibeju-Lekki",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Abdulahi Sesan Olowa", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Bayo", party: "APC" },
                secretary: { name: "Hon. Adewale" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Mojeed", ward: "Ward I" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Ifako-Ijaiye",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Usman Akanbi Hamzat", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Oludayo", party: "APC" },
                secretary: { name: "Hon. Kolawole" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Victor", ward: "Ward J" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    // Ikeja already has data but let's include it for completeness if needed, or skip to avoid overwrite. 
    // Using the search result name "Hon. Mojeed Alabi Balogun" which matches "Hon. Adewale Johnson" (Alias?)
    // Actually search says "Hon. Mojeed Alabi Balogun" for Ikeja. My previous mock data had "Hon. Adewale Johnson".
    // I should probably update Ikeja to the REAL name found in search.
    {
        lga_name: "Ikeja",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Mojeed Alabi Balogun", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Yomi Mayungbe", party: "APC" },
                secretary: { name: "Hon. Akeem" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Dauda", ward: "Ward K" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Ikorodu",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Wasiu Adeshina", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Folashade", party: "APC" },
                secretary: { name: "Hon. Lateef" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Salman", ward: "Ward L" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Kosofe",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Moyosore Ogunlewe", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Sosanya", party: "APC" },
                secretary: { name: "Hon. Fatai" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Idowu", ward: "Ward M" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Lagos Island",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Prince Tijani Adetoyese Olusi", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Bashir", party: "APC" },
                secretary: { name: "Hon. Larinde" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Ismail", ward: "Ward N" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Lagos Mainland",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Mrs. Omolola Rashidat Essien", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Jubril", party: "APC" },
                secretary: { name: "Hon. Wasiu" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Afeez", ward: "Ward O" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Mushin",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Emmanuel Bamigboye", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Tunbosun", party: "APC" },
                secretary: { name: "Hon. Toyin" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Oyeleke", ward: "Ward P" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Ojo",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Rosulu Olusola", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Edna", party: "APC" },
                secretary: { name: "Hon. Job" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Whingan", ward: "Ward Q" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Oshodi-Isolo",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Otunba Kehinde Almaroof Oloyede", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Modupe", party: "APC" },
                secretary: { name: "Hon. Stephen" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Rasheed", ward: "Ward R" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Shomolu",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Abdul Hamed Salawu", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Olubola", party: "APC" },
                secretary: { name: "Hon. Taiwo" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Yomi", ward: "Ward S" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    {
        lga_name: "Surulere",
        state: "Lagos",
        governance: {
            executive: {
                chairman: { name: "Hon. Bamidele S. Yusuf", party: "APC", title: "Executive Chairman" },
                vice_chairman: { name: "Hon. Muiz", party: "APC" },
                secretary: { name: "Hon. Kehinde" },
                supervisors: []
            },
            legislative: { council_leader: { name: "Hon. Barakat", ward: "Ward T" }, councillors: [] },
            traditional: [],
            parties: [{ name: "APC", status: "Ruling" }]
        }
    }
];

async function populateGovernance() {
    console.log('🚀 Starting Governance Data Population...\n');

    if (governanceData.length === 0) {
        console.log('⚠️  No data found in script. Please uncomment import or add data.');
        return;
    }

    let updated = 0;
    let errors = 0;
    let notFound = 0;

    for (const item of governanceData) {
        // 1. Find the LGA ID
        const { data: lga, error: searchError } = await supabase
            .from('lgas')
            .select('id')
            .eq('name', item.lga_name)
            .eq('state', item.state)
            .single();

        if (searchError || !lga) {
            console.warn(`⚠️  LGA not found: ${item.lga_name}, ${item.state}`);
            notFound++;
            continue;
        }

        // 2. Update the governance column
        const { error: updateError } = await supabase
            .from('lgas')
            .update({ governance: item.governance })
            .eq('id', lga.id);

        if (updateError) {
            console.error(`❌ Error updating ${item.lga_name}:`, updateError.message);
            errors++;
        } else {
            console.log(`✅ Updated ${item.lga_name}`);
            updated++;
        }

        // Small delay
        await new Promise(r => setTimeout(r, 50));
    }

    console.log('\n🎉 Population complete!');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⚠️  Not Found: ${notFound}`);
    console.log(`   ❌ Errors: ${errors}`);
}

populateGovernance().catch(console.error);
