// Mock data for LGA details - will be replaced with Supabase data later
import type { GovernanceStructure } from "@/types/lga";

export interface BudgetAllocation {
    category: string;
    allocated: number;
    spent: number;
    percentage: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: "Planning" | "In Progress" | "Completed" | "Cancelled";
    budget: number;
    startDate: string;
    completionDate?: string;
    jobsCreated: number;
    beneficiaries: number;
}

export interface Politician {
    id: string;
    name: string;
    position: string;
    party: string;
    phone?: string;
    email?: string;
    imageUrl?: string;
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: string;
    status: "Reported" | "Verified" | "In Progress" | "Resolved" | "Rejected";
    priority: "Low" | "Medium" | "High" | "Urgent";
    reportedBy: string;
    reportedDate: string;
    imageUrl?: string;
}

export interface LGADetails {
    name: string;
    state: string;
    population: number;
    annualBudget: number;
    chairman?: string; // Kept for backward compatibility
    budgetAllocations: BudgetAllocation[];
    projects: Project[];
    politicians: Politician[];
    governance?: GovernanceStructure; // NEW
    issues: Issue[];
    contactPhone?: string;
    contactEmail?: string;
}

// Sample data for demonstration
export const sampleLGADetails: Record<string, LGADetails> = {
    "Agege": {
        name: "Agege", state: "Lagos", population: 459939, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "High Chief Ganiyu Kola Egunjobi",
        governance: {
            executive: { chairman: { name: "High Chief Ganiyu Kola Egunjobi", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Gbenga Abiola", party: "APC" }, secretary: { name: "Hon. Gbenga Abiola" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Anigbajumo", ward: "Ward A" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Ajeromi-Ifelodun": {
        name: "Ajeromi-Ifelodun", state: "Lagos", population: 684105, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Fatai Adekunle Ayoola",
        governance: {
            executive: { chairman: { name: "Hon. Fatai Adekunle Ayoola", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Lucky Uduikhue", party: "APC" }, secretary: { name: "Hon. Ooh" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Kehinde Arogundade", ward: "Ward B" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Alimosho": {
        name: "Alimosho", state: "Lagos", population: 1288714, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Jelili Sulaimon",
        governance: {
            executive: { chairman: { name: "Hon. Jelili Sulaimon", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Akinpelu Johnson", party: "APC" }, secretary: { name: "Hon. Dara" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Obadina", ward: "Ward C" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Amuwo-Odofin": {
        name: "Amuwo-Odofin", state: "Lagos", population: 318166, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Valentine Oluseyi Buraimoh",
        governance: {
            executive: { chairman: { name: "Hon. Valentine Oluseyi Buraimoh", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Maureen Ashara", party: "APC" }, secretary: { name: "Hon. Abimbola" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Ojo", ward: "Ward D" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Apapa": {
        name: "Apapa", state: "Lagos", population: 217362, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Idowu Adejumoke Senbanjo",
        governance: {
            executive: { chairman: { name: "Hon. Idowu Adejumoke Senbanjo", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Kevin Gabriel", party: "APC" }, secretary: { name: "Hon. Tunde" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Sikiru", ward: "Ward E" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Badagry": {
        name: "Badagry", state: "Lagos", population: 241093, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Olusegun Onilude",
        governance: {
            executive: { chairman: { name: "Hon. Olusegun Onilude", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Akande", party: "APC" }, secretary: { name: "Hon. Setonji" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Hungbo", ward: "Ward F" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Epe": {
        name: "Epe", state: "Lagos", population: 181409, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Princess Surah Animashaun",
        governance: {
            executive: { chairman: { name: "Hon. Princess Surah Animashaun", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Saliu", party: "APC" }, secretary: { name: "Hon. Rahman" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Edu", ward: "Ward G" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Eti Osa": {
        name: "Eti Osa", state: "Lagos", population: 287785, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Saheed Adesegun Bankole",
        governance: {
            executive: { chairman: { name: "Hon. Saheed Adesegun Bankole", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Isiaka", party: "APC" }, secretary: { name: "Hon. Badmus" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Taiwo", ward: "Ward H" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Ibeju-Lekki": {
        name: "Ibeju-Lekki", state: "Lagos", population: 117481, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Abdulahi Sesan Olowa",
        governance: {
            executive: { chairman: { name: "Hon. Abdulahi Sesan Olowa", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Bayo", party: "APC" }, secretary: { name: "Hon. Adewale" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Mojeed", ward: "Ward I" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Ifako-Ijaiye": {
        name: "Ifako-Ijaiye", state: "Lagos", population: 427878, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Usman Akanbi Hamzat",
        governance: {
            executive: { chairman: { name: "Hon. Usman Akanbi Hamzat", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Oludayo", party: "APC" }, secretary: { name: "Hon. Kolawole" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Victor", ward: "Ward J" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Ikeja": {
        name: "Ikeja",
        state: "Lagos",
        population: 313196,
        annualBudget: 5200000000,
        chairman: "Hon. Mojeed Alabi Balogun",
        contactPhone: "+234 1 234 5678",
        contactEmail: "info@ikeja.lg.gov.ng",
        budgetAllocations: [
            { category: "Infrastructure", allocated: 1500000000, spent: 1200000000, percentage: 80 },
            { category: "Education", allocated: 1000000000, spent: 850000000, percentage: 85 },
            { category: "Healthcare", allocated: 800000000, spent: 720000000, percentage: 90 },
            { category: "Environment", allocated: 600000000, spent: 480000000, percentage: 80 },
            { category: "Security", allocated: 500000000, spent: 450000000, percentage: 90 },
            { category: "Agriculture", allocated: 400000000, spent: 320000000, percentage: 80 },
            { category: "Others", allocated: 400000000, spent: 350000000, percentage: 87.5 },
        ],
        projects: [
            {
                id: "1",
                name: "Ikeja Road Rehabilitation Project",
                description: "Rehabilitation of major roads in Ikeja including Allen Avenue and Obafemi Awolowo Way",
                status: "In Progress",
                budget: 850000000,
                startDate: "2024-01-15",
                jobsCreated: 120,
                beneficiaries: 50000,
            },
            {
                id: "2",
                name: "Primary Healthcare Center Upgrade",
                description: "Modernization of 5 primary healthcare centers across Ikeja",
                status: "Completed",
                budget: 320000000,
                startDate: "2023-06-01",
                completionDate: "2024-09-30",
                jobsCreated: 45,
                beneficiaries: 25000,
            },
            {
                id: "3",
                name: "Solar Street Light Installation",
                description: "Installation of 500 solar-powered street lights in residential areas",
                status: "Planning",
                budget: 180000000,
                startDate: "2025-01-01",
                jobsCreated: 30,
                beneficiaries: 15000,
            },
        ],
        politicians: [
            {
                id: "1",
                name: "Hon. Mojeed Alabi Balogun",
                position: "LGA Chairman",
                party: "APC",
                phone: "+234 803 123 4567",
                email: "chairman@ikeja.lg.gov.ng",
            },
            {
                id: "2",
                name: "Hon. Yomi Mayungbe",
                position: "Vice Chairman",
                party: "APC",
                phone: "+234 805 234 5678",
                email: "vice.chairman@ikeja.lg.gov.ng",
            },
        ],
        governance: {
            executive: {
                chairman: {
                    name: "Hon. Mojeed Alabi Balogun",
                    party: "APC",
                    phone: "+234 803 123 4567",
                    email: "chairman@ikeja.lg.gov.ng",
                    assumed_office: "2021-07-24"
                },
                vice_chairman: {
                    name: "Hon. Yomi Mayungbe",
                    party: "APC"
                },
                secretary: {
                    name: "Hon. Akeem"
                },
                supervisors: [
                    { name: "Hon. Chioma Okoye", portfolio: "Education" },
                    { name: "Hon. Babatunde Fashola (Jnr)", portfolio: "Works & Infrastructure" },
                    { name: "Hon. Zainab Ahmed", portfolio: "Health" },
                    { name: "Hon. Segun Odegbami", portfolio: "Youth & Sports" }
                ]
            },
            legislative: {
                council_leader: { name: "Hon. Dauda", ward: "Ward K" },
                councillors: [
                    { name: "Hon. Dauda", ward: "Ward K", party: "APC" }
                ]
            },
            traditional: [
                {
                    title: "The Olu of Ikeja",
                    name: "Oba Rauf Adeniyi Matemi"
                },
                { title: "Baale of Alausa", name: "Chief Tola Solomon" },
                { title: "Baale of Oregun", name: "Chief Olusegun Ojo" }
            ],
            parties: [
                { name: "All Progressives Congress (APC)", status: "Ruling", chairman: "Alhaji Tunde Balogun" },
                { name: "Peoples Democratic Party (PDP)", status: "Opposition" },
                { name: "Labour Party (LP)", status: "Opposition" }
            ],
            cdas: [
                { name: "Ikeja GRA Residents Association" },
                { name: "Alausa Community Development Association" }
            ],
            oversight: {
                state_ministry: "Lagos State Ministry of Local Government & Chieftaincy Affairs",
                siec: "Lagos State Independent Electoral Commission (LASIEC)"
            }
        },
        issues: [
            {
                id: "1",
                title: "Flooding on Allen Avenue",
                description: "Severe flooding occurs during rainy season affecting businesses and residents",
                category: "Environment",
                status: "In Progress",
                priority: "High",
                reportedBy: "John Doe",
                reportedDate: "2024-10-15",
            },
            {
                id: "2",
                title: "Broken Street Lights on Awolowo Way",
                description: "Multiple street lights not functioning, creating security concerns",
                category: "Infrastructure",
                status: "Verified",
                priority: "Medium",
                reportedBy: "Jane Smith",
                reportedDate: "2024-11-01",
            },
            {
                id: "3",
                title: "Waste Disposal Issue at Market",
                description: "Overflowing waste bins at the main market causing health hazards",
                category: "Environment",
                status: "Resolved",
                priority: "Urgent",
                reportedBy: "Ahmed Ibrahim",
                reportedDate: "2024-09-20",
            },
        ],
    },
    "Ikorodu": {
        name: "Ikorodu", state: "Lagos", population: 535619, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Wasiu Adeshina",
        governance: {
            executive: { chairman: { name: "Hon. Wasiu Adeshina", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Folashade", party: "APC" }, secretary: { name: "Hon. Lateef" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Salman", ward: "Ward L" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Kosofe": {
        name: "Kosofe", state: "Lagos", population: 665393, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Moyosore Ogunlewe",
        governance: {
            executive: { chairman: { name: "Hon. Moyosore Ogunlewe", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Sosanya", party: "APC" }, secretary: { name: "Hon. Fatai" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Idowu", ward: "Ward M" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Lagos Island": {
        name: "Lagos Island", state: "Lagos", population: 209437, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Prince Tijani Adetoyese Olusi",
        governance: {
            executive: { chairman: { name: "Prince Tijani Adetoyese Olusi", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Bashir", party: "APC" }, secretary: { name: "Hon. Larinde" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Ismail", ward: "Ward N" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Lagos Mainland": {
        name: "Lagos Mainland", state: "Lagos", population: 317720, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Mrs. Omolola Rashidat Essien",
        governance: {
            executive: { chairman: { name: "Hon. Mrs. Omolola Rashidat Essien", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Jubril", party: "APC" }, secretary: { name: "Hon. Wasiu" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Afeez", ward: "Ward O" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Mushin": {
        name: "Mushin", state: "Lagos", population: 633009, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Emmanuel Bamigboye",
        governance: {
            executive: { chairman: { name: "Hon. Emmanuel Bamigboye", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Tunbosun", party: "APC" }, secretary: { name: "Hon. Toyin" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Oyeleke", ward: "Ward P" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Ojo": {
        name: "Ojo", state: "Lagos", population: 598071, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Rosulu Olusola",
        governance: {
            executive: { chairman: { name: "Hon. Rosulu Olusola", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Edna", party: "APC" }, secretary: { name: "Hon. Job" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Whingan", ward: "Ward Q" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Oshodi-Isolo": {
        name: "Oshodi-Isolo", state: "Lagos", population: 621509, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Otunba Kehinde Almaroof Oloyede",
        governance: {
            executive: { chairman: { name: "Otunba Kehinde Almaroof Oloyede", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Modupe", party: "APC" }, secretary: { name: "Hon. Stephen" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Rasheed", ward: "Ward R" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Shomolu": {
        name: "Shomolu", state: "Lagos", population: 402673, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Abdul Hamed Salawu",
        governance: {
            executive: { chairman: { name: "Hon. Abdul Hamed Salawu", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Olubola", party: "APC" }, secretary: { name: "Hon. Taiwo" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Yomi", ward: "Ward S" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
    "Surulere": {
        name: "Surulere", state: "Lagos", population: 503975, annualBudget: 0, budgetAllocations: [], projects: [], politicians: [], issues: [],
        chairman: "Hon. Bamidele S. Yusuf",
        governance: {
            executive: { chairman: { name: "Hon. Bamidele S. Yusuf", party: "APC", title: "Executive Chairman" }, vice_chairman: { name: "Hon. Muiz", party: "APC" }, secretary: { name: "Hon. Kehinde" }, supervisors: [] },
            legislative: { council_leader: { name: "Hon. Barakat", ward: "Ward T" }, councillors: [] },
            traditional: [], parties: [{ name: "APC", status: "Ruling" }]
        }
    },
};

// Helper function to get LGA details (will query Supabase later)
export const getLGADetails = (lgaName: string, stateName: string): LGADetails | null => {
    // For now, return sample data for Ikeja, or generate basic data for others
    if (sampleLGADetails[lgaName]) {
        return sampleLGADetails[lgaName];
    }

    // Return basic structure for other LGAs
    return {
        name: lgaName,
        state: stateName,
        population: 0,
        annualBudget: 0,
        chairman: "To be updated",
        budgetAllocations: [],
        projects: [],
        politicians: [],
        issues: [],
    };
};
