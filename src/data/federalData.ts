import type { FederalMinistry, StateData } from "@/types/federal";

export const federalMinistries: FederalMinistry[] = [
    {
        name: "Ministry of Finance",
        minister: { portfolio: "Minister of Finance", name: "Wale Edun", state_of_origin: "Ogun" },
        mandate: "Manage the nation's finances and economic stability."
    },
    {
        name: "Ministry of Works",
        minister: { portfolio: "Minister of Works", name: "Dave Umahi", state_of_origin: "Ebonyi" },
        mandate: "Construction and rehabilitation of federal roads and infrastructure."
    },
    {
        name: "Ministry of Aviation",
        minister: { portfolio: "Minister of Aviation", name: "Festus Keyamo", state_of_origin: "Delta" },
        mandate: "Oversight of air transportation and airport management."
    },
    {
        name: "Ministry of Power",
        minister: { portfolio: "Minister of Power", name: "Adebayo Adelabu", state_of_origin: "Oyo" },
        mandate: "Generation, transmission and distribution of electricity."
    },
    {
        name: "Ministry of Education",
        minister: { portfolio: "Minister of Education", name: "Tahir Mamman", state_of_origin: "Adamawa" },
        minister_of_state: { portfolio: "Minister of State, Education", name: "Yusuf Sununu" },
        mandate: "Formulation of national education policy."
    },
    {
        name: "Ministry of Health",
        minister: { portfolio: "Minister of Health", name: "Ali Pate", state_of_origin: "Bauchi" },
        minister_of_state: { portfolio: "Minister of State, Health", name: "Tunji Alausa" },
        mandate: "Coordination of national health policy."
    },
    {
        name: "Ministry of Communications, Innovation and Digital Economy",
        minister: { portfolio: "Minister of Communications", name: "Bosun Tijani", state_of_origin: "Ogun" },
        mandate: "Promotion of digital economy and technology."
    },
    {
        name: "Ministry of Marine and Blue Economy",
        minister: { portfolio: "Minister of Marine", name: "Gboyega Oyetola", state_of_origin: "Osun" },
        mandate: "Development of maritime resources."
    },
    {
        name: "Ministry of Solid Minerals",
        minister: { portfolio: "Minister of Solid Minerals", name: "Dele Alake", state_of_origin: "Ekiti" },
        mandate: "Regulation of mining and mineral resources."
    },
    {
        name: "Ministry of Federal Capital Territory (FCT)",
        minister: { portfolio: "Minister of FCT", name: "Nyesom Wike", state_of_origin: "Rivers" },
        mandate: "Administration of Abuja."
    }
];

export const stateData: StateData[] = [
    {
        name: "Lagos",
        capital: "Ikeja",
        governor: { name: "Babajide Sanwo-Olu", party: "APC", deputy: "Kadri Hamzat" },
        budget: [
            { year: 2024, total_budget: 2246000000000, capital_expenditure: 1224000000000, recurrent_expenditure: 1022000000000, status: 'Signed' }
        ],
        commissioners: [
            { portfolio: "Environment", name: "Tokunbo Wahab" },
            { portfolio: "Health", name: "Prof. Akin Abayomi" },
            { portfolio: "Information", name: "Gbenga Omotoso" },
            { portfolio: "Finance", name: "Abayomi Oluyomi" },
            { portfolio: "Education", name: "Jamiu Alli-Balogun" }

        ]
    },
    {
        name: "Rivers",
        capital: "Port Harcourt",
        governor: { name: "Siminalayi Fubara", party: "PDP", deputy: "Ngozi Odu" },
        budget: [
            { year: 2024, total_budget: 800000000000, capital_expenditure: 412000000000, recurrent_expenditure: 360000000000, status: 'Signed' }
        ],
        commissioners: [
            { portfolio: "Works", name: "George-Kelly Alabo" },
            { portfolio: "Education", name: "Chinedu Mmom" }
        ]
    },
    {
        name: "Abuja (FCT)",
        capital: "Abuja",
        governor: { name: "Nyesom Wike (Minister)", party: "APC/PDP", deputy: "" },
        budget: [
            { year: 2024, total_budget: 1147000000000, capital_expenditure: 726000000000, recurrent_expenditure: 421000000000, status: 'Passed' }
        ],
        commissioners: [] // Mandate Secretaries
    },
    {
        name: "Kano",
        capital: "Kano",
        governor: { name: "Abba Kabir Yusuf", party: "NNPP", deputy: "Aminu Abdussalam Gwarzo" },
        budget: [
            { year: 2024, total_budget: 350000000000, capital_expenditure: 215000000000, recurrent_expenditure: 135000000000, status: 'Signed' }
        ],
        commissioners: [
            { portfolio: "Information", name: "Baba Halilu Dantiye" }
        ]
    }
];
