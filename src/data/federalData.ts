import type { FederalMinistry, StateData, LGAOverview } from "@/types/federal";

export const federalMinistries: FederalMinistry[] = [
    {
        name: "Ministry of Finance",
        minister: { portfolio: "Coordinating Minister of the Economy", name: "Taiwo Oyedele", state_of_origin: "Oyo" },
        mandate: "Manage the nation's finances, revenue mobilization, and economic coordination.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 520000000000, released: 480000000000, spent: 450000000000 },
            { year: 2023, allocated: 450000000000, released: 420000000000, spent: 410000000000 }
        ],
        projects: [
            {
                id: "fed-fin-001",
                name: "Digital Revenue Mobilization System",
                description: "Integration of all federal revenue collections into a single digital platform to reduce leakages.",
                status: "In Progress",
                budget: 15000000000,
                spent: 8500000000,
                completion_percentage: 65,
                location: "Abuja (FCT)",
                startDate: "2023-06-01",
                contractor: "SystemSpecs Nigeria"
            }
        ]
    },
    {
        name: "Ministry of Works",
        minister: { portfolio: "Minister of Works", name: "David Umahi", state_of_origin: "Ebonyi" },
        mandate: "Construction and rehabilitation of federal roads and infrastructure.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 950000000000, released: 720000000000, spent: 680000000000 },
            { year: 2023, allocated: 850000000000, released: 650000000000, spent: 580000000000 }
        ],
        projects: [
            {
                id: "fed-work-001",
                name: "Lagos-Ibadan Expressway Completion",
                description: "Final phase of the reconstruction and expansion of the Lagos-Ibadan Expressway.",
                status: "In Progress",
                budget: 310000000000,
                spent: 285000000000,
                completion_percentage: 92,
                location: "Lagos/Ogun/Oyo",
                startDate: "2018-01-01",
                contractor: "Julius Berger"
            },
            {
                id: "fed-work-002",
                name: "Second Niger Bridge Maintenance",
                description: "Ongoing structural maintenance and auxiliary road construction for the Second Niger Bridge.",
                status: "In Progress",
                budget: 45000000000,
                spent: 12000000000,
                completion_percentage: 15,
                location: "Anambra/Delta",
                startDate: "2023-10-01",
                contractor: "RCC Nigeria"
            }
        ]
    },
    {
        name: "Ministry of Health and Social Welfare",
        minister: { portfolio: "Minister of Health", name: "Muhammad Ali Pate", state_of_origin: "Bauchi" },
        minister_of_state: { portfolio: "Minister of State, Health", name: "Tunji Alausa" },
        mandate: "Coordination of national health policy and social welfare systems.",
        sector: "Health",
        financials: [
            { year: 2024, allocated: 1350000000000, released: 1100000000000, spent: 950000000000 },
            { year: 2023, allocated: 1200000000000, released: 1000000000000, spent: 850000000000 }
        ],
        projects: [
            {
                id: "fed-health-001",
                name: "National Cancer Centre Upgrade",
                description: "Procurement of advanced radiotherapy machines and renovation of the oncology ward.",
                status: "Stalled",
                budget: 12000000000,
                spent: 4500000000,
                location: "Abuja",
                startDate: "2022-03-01",
                contractor: "HealthTech Solutions"
            }
        ]
    },
    {
        name: "Ministry of Education",
        minister: { portfolio: "Minister of Education", name: "Tahir Mamman", state_of_origin: "Adamawa" },
        minister_of_state: { portfolio: "Minister of State, Education", name: "Yusuf Sununu" },
        mandate: "Formulation of national education policy and oversight of federal institutions.",
        sector: "Education",
        financials: [
            { year: 2024, allocated: 1600000000000, released: 1400000000000, spent: 1250000000000 },
            { year: 2023, allocated: 1500000000000, released: 1300000000000, spent: 1100000000000 }
        ],
        projects: [
            {
                id: "fed-edu-001",
                name: "Federal University Smart Campus Initiative",
                description: "Installation of high-speed fiber optics and digital learning hubs across 12 federal universities.",
                status: "In Progress",
                budget: 8500000000,
                spent: 2100000000,
                location: "Nationwide",
                startDate: "2024-01-15",
                contractor: "TETFund Partners"
            }
        ]
    },
    {
        name: "Ministry of Aviation and Aerospace Development",
        minister: { portfolio: "Minister of Aviation", name: "Festus Keyamo", state_of_origin: "Delta" },
        mandate: "Aviation safety, infrastructure development, and aerospace policy.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 150000000000, released: 110000000000, spent: 95000000000 },
            { year: 2023, allocated: 120000000000, released: 90000000000, spent: 85000000000 }
        ],
        projects: [
            {
                id: "fed-avi-001",
                name: "Abuja Second Runway Construction",
                description: "Construction of a second independent runway to improve safety and capacity at Nnamdi Azikiwe International Airport.",
                status: "In Progress",
                budget: 92000000000,
                spent: 34000000000,
                location: "Abuja",
                startDate: "2023-02-01",
                contractor: "CCECC Nigeria"
            }
        ]
    },
    {
        name: "Ministry of Communications, Innovation and Digital Economy",
        minister: { portfolio: "Minister of Communications", name: "Bosun Tijani", state_of_origin: "Ogun" },
        mandate: "Digital economy, communications infrastructure, and innovation policy.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 280000000000, released: 250000000000, spent: 235000000000 },
            { year: 2023, allocated: 250000000000, released: 230000000000, spent: 220000000000 }
        ],
        projects: [
            {
                id: "fed-comm-001",
                name: "3 Million Technical Talent (3MTT) Hubs",
                description: "Establishment of technical training centers and digital workspace equipment nationwide.",
                status: "In Progress",
                budget: 4500000000,
                spent: 1800000000,
                location: "Nationwide",
                startDate: "2023-11-01",
                contractor: "NITDA / Private Partners"
            }
        ]
    },
    {
        name: "Ministry of Defence",
        minister: { portfolio: "Minister of Defence", name: "Mohammed Badaru Abubakar", state_of_origin: "Jigawa" },
        mandate: "National defense, military oversight, and veteran affairs.",
        sector: "Security",
        financials: [
            { year: 2024, allocated: 2400000000000, released: 2300000000000, spent: 2250000000000 },
            { year: 2023, allocated: 2200000000000, released: 2100000000000, spent: 2050000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Environment",
        minister: { portfolio: "Minister of Environment", name: "Balarabe Abbas Lawal", state_of_origin: "Kaduna" },
        mandate: "Environmental protection, climate action, and natural resource management.",
        sector: "Environment",
        financials: [
            { year: 2024, allocated: 95000000000, released: 85000000000, spent: 78000000000 },
            { year: 2023, allocated: 85000000000, released: 75000000000, spent: 70000000000 }
        ],
        projects: [
            {
                id: "fed-env-001",
                name: "Great Green Wall Afforestation Project",
                description: "Planting of shelterbelts across 11 frontline states to combat desertification.",
                status: "In Progress",
                budget: 15000000000,
                spent: 9200000000,
                location: "Northern Nigeria",
                startDate: "2022-05-01",
                contractor: "Great Green Wall Agency"
            }
        ]
    },
    {
        name: "Ministry of Power",
        minister: { portfolio: "Minister of Power", name: "Adebayo Adelabu", state_of_origin: "Oyo" },
        mandate: "Generation, transmission, and distribution of electricity.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 380000000000, released: 330000000000, spent: 310000000000 },
            { year: 2023, allocated: 340000000000, released: 300000000000, spent: 280000000000 }
        ],
        projects: [
            {
                id: "fed-power-001",
                name: "Presidential Power Initiative (Siemens Project) Phase 1",
                description: "Upgrade of transmission substations and distribution equipment across major urban centers.",
                status: "In Progress",
                budget: 120000000000,
                spent: 65000000000,
                location: "Nationwide",
                startDate: "2021-06-01",
                contractor: "Siemens AG"
            }
        ]
    },
    {
        name: "Ministry of Agriculture and Food Security",
        minister: { portfolio: "Minister of Agriculture", name: "Abubakar Kyari", state_of_origin: "Borno" },
        mandate: "Food security, agricultural development, and rural transformation.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 650000000000, released: 600000000000, spent: 540000000000 },
            { year: 2023, allocated: 600000000000, released: 550000000000, spent: 500000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Police Affairs",
        minister: { portfolio: "Minister of Police Affairs", name: "Ibrahim Gaidam", state_of_origin: "Yobe" },
        mandate: "Internal security, police management, and law enforcement oversight.",
        sector: "Security",
        financials: [
            { year: 2024, allocated: 850000000000, released: 800000000000, spent: 750000000000 },
            { year: 2023, allocated: 800000000000, released: 750000000000, spent: 700000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Interior",
        minister: { portfolio: "Minister of Interior", name: "Olubunmi Tunji-Ojo", state_of_origin: "Ondo" },
        mandate: "Internal security, immigration, prisons, and fire services.",
        sector: "Security",
        financials: [
            { year: 2024, allocated: 420000000000, released: 390000000000, spent: 375000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Foreign Affairs",
        minister: { portfolio: "Minister of Foreign Affairs", name: "Yusuf Tuggar", state_of_origin: "Bauchi" },
        mandate: "Implementation of Nigeria's foreign policy and international relations.",
        sector: "Governance",
        financials: [
            { year: 2024, allocated: 180000000000, released: 170000000000, spent: 165000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Federal Capital Territory (FCT)",
        minister: { portfolio: "Minister of FCT", name: "Nyesom Wike", state_of_origin: "Rivers" },
        mandate: "Administration and development of the Federal Capital Territory.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 1100000000000, released: 950000000000, spent: 880000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Industry, Trade and Investment",
        minister: { portfolio: "Minister of Trade", name: "Doris Anite", state_of_origin: "Imo" },
        mandate: "Industrialization, promotion of trade, and investment attraction.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 210000000000, released: 195000000000, spent: 180000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Solid Minerals Development",
        minister: { portfolio: "Minister of Solid Minerals", name: "Dele Alake", state_of_origin: "Ekiti" },
        mandate: "Development of Nigeria's solid mineral resources.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 120000000000, released: 105000000000, spent: 92000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Housing and Urban Development",
        minister: { portfolio: "Minister of Housing", name: "Muttaqha Rabe Darma", state_of_origin: "Katsina" },
        mandate: "Provision of affordable housing and urban planning.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 350000000000, released: 280000000000, spent: 240000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Water Resources and Sanitation",
        minister: { portfolio: "Minister of Water Resources", name: "Joseph Utsev", state_of_origin: "Benue" },
        mandate: "Management of water resources and sanitation services.",
        sector: "Environment",
        financials: [
            { year: 2024, allocated: 280000000000, released: 240000000000, spent: 215000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Transportation",
        minister: { portfolio: "Minister of Transportation", name: "Sa'idu Alkali", state_of_origin: "Gombe" },
        mandate: "National transportation policy and infrastructure.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 320000000000, released: 280000000000, spent: 260000000000 }
        ],
        projects: [
            {
                id: "fed-trans-001",
                name: "Kano-Maradi Rail Line Link",
                description: "Construction of a standard gauge rail line connecting Kano to Maradi.",
                status: "In Progress",
                budget: 180000000000,
                spent: 45000000000,
                location: "Kano/Jigawa/Katsina",
                startDate: "2021-03-01",
                contractor: "Mota-Engil"
            }
        ]
    },
    {
        name: "Ministry of Budget and Economic Planning",
        minister: { portfolio: "Minister of Budget", name: "Abubakar Atiku Bagudu", state_of_origin: "Kebbi" },
        mandate: "National budget preparation and economic planning.",
        sector: "Governance",
        financials: [
            { year: 2024, allocated: 85000000000, released: 80000000000, spent: 78000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Justice",
        minister: { portfolio: "Attorney General of the Federation", name: "Lateef Fagbemi", state_of_origin: "Kwara" },
        mandate: "Administration of justice and legal oversight.",
        sector: "Governance",
        financials: [
            { year: 2024, allocated: 165000000000, released: 155000000000, spent: 150000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Marine and Blue Economy",
        minister: { portfolio: "Minister of Marine Economy", name: "Adegboyega Oyetola", state_of_origin: "Osun" },
        mandate: "Development of maritime resources and the blue economy.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 95000000000, released: 80000000000, spent: 72000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Art, Culture and Creative Economy",
        minister: { portfolio: "Minister of Culture", name: "Hannatu Musawa", state_of_origin: "Katsina" },
        mandate: "Promotion of art, culture, and the creative economy.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 45000000000, released: 40000000000, spent: 35000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Steel Development",
        minister: { portfolio: "Minister of Steel", name: "Shuaibu Audu", state_of_origin: "Kogi" },
        mandate: "Development of the steel industry.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 65000000000, released: 55000000000, spent: 48000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Tourism",
        minister: { portfolio: "Minister of Tourism", name: "Lola Ade-John", state_of_origin: "Lagos" },
        mandate: "Promotion of tourism and hospitality.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 35000000000, released: 30000000000, spent: 25000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Information and National Orientation",
        minister: { portfolio: "Minister of Information", name: "Mohammed Idris", state_of_origin: "Niger" },
        mandate: "Management of government information and national orientation.",
        sector: "Governance",
        financials: [
            { year: 2024, allocated: 95000000000, released: 90000000000, spent: 88000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Labour and Employment",
        minister: { portfolio: "Minister of Labour", name: "Nkeiruka Onyejeocha", state_of_origin: "Abia" },
        mandate: "Management of labour relations and employment policies.",
        sector: "Governance",
        financials: [
            { year: 2024, allocated: 75000000000, released: 70000000000, spent: 68000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Women Affairs",
        minister: { portfolio: "Minister of Women Affairs", name: "Uju Kennedy Ohanenye", state_of_origin: "Anambra" },
        mandate: "Promotion of women's rights and social development.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 55000000000, released: 50000000000, spent: 45000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Youth Development",
        minister: { portfolio: "Minister of Youth", name: "Jamila Bio Ibrahim", state_of_origin: "Kwara" },
        mandate: "Promotion of youth development and empowerment.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 65000000000, released: 60000000000, spent: 55000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Sports Development",
        minister: { portfolio: "Minister of Sports", name: "John Enoh", state_of_origin: "Cross River" },
        mandate: "Promotion of sports and athletic excellence.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 85000000000, released: 80000000000, spent: 78000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Niger Delta Development",
        minister: { portfolio: "Minister of Niger Delta", name: "Abubakar Momoh", state_of_origin: "Edo" },
        mandate: "Development of the Niger Delta region.",
        sector: "Infrastructure",
        financials: [
            { year: 2024, allocated: 350000000000, released: 280000000000, spent: 240000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Humanitarian Affairs and Poverty Alleviation",
        minister: { portfolio: "Minister of Humanitarian Affairs", name: "Betta Edu", state_of_origin: "Cross River" },
        mandate: "Coordination of humanitarian interventions and poverty alleviation.",
        sector: "Other",
        financials: [
            { year: 2024, allocated: 450000000000, released: 380000000000, spent: 340000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Petroleum Resources",
        minister: { portfolio: "Minister of State, Petroleum", name: "Heineken Lokpobiri", state_of_origin: "Bayelsa" },
        mandate: "Management of Nigeria's petroleum resources.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 150000000000, released: 140000000000, spent: 135000000000 }
        ],
        projects: []
    },
    {
        name: "Ministry of Innovation, Science and Technology",
        minister: { portfolio: "Minister of Science", name: "Uche Nnaji", state_of_origin: "Enugu" },
        mandate: "Promotion of science, technology, and innovation.",
        sector: "Economy",
        financials: [
            { year: 2024, allocated: 110000000000, released: 95000000000, spent: 88000000000 }
        ],
        projects: []
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
        ministries: [
            { name: "Ministry of Justice", commissioner: { portfolio: "Attorney General", name: "Lawal Pedro" }, sector: "Governance", financials: [{ year: 2024, allocated: 45000000000, released: 42000000000, spent: 40000000000 }], projects: [] },
            { name: "Ministry of Finance", commissioner: { portfolio: "Commissioner", name: "Abayomi Oluyomi" }, sector: "Economy", financials: [{ year: 2024, allocated: 120000000000, released: 110000000000, spent: 105000000000 }], projects: [] },
            { name: "Ministry of Health", commissioner: { portfolio: "Commissioner", name: "Prof. Akin Abayomi" }, sector: "Health", financials: [{ year: 2024, allocated: 150000000000, released: 130000000000, spent: 120000000000 }], projects: [{ id: "lag-health-001", name: "General Hospital Upgrade", description: "Upgrade of facilities.", status: "In Progress", budget: 5000000000, spent: 2000000000, location: "Ikeja", startDate: "2023-01-01" }] },
            { name: "Ministry of Education", commissioner: { portfolio: "Commissioner", name: "Jamiu Alli-Balogun" }, sector: "Education", financials: [{ year: 2024, allocated: 180000000000, released: 160000000000, spent: 150000000000 }], projects: [] },
            { name: "Ministry of Works and Infrastructure", commissioner: { portfolio: "Commissioner", name: "Adeyoye Oyakojo" }, sector: "Infrastructure", financials: [{ year: 2024, allocated: 350000000000, released: 280000000000, spent: 260000000000 }], projects: [] },
            { name: "Ministry of Agriculture", commissioner: { portfolio: "Commissioner", name: "Abisola Olusanya" }, sector: "Economy", financials: [{ year: 2024, allocated: 25000000000, released: 22000000000, spent: 20000000000 }], projects: [] },
            { name: "Ministry of Environment", commissioner: { portfolio: "Commissioner", name: "Tokunbo Wahab" }, sector: "Environment", financials: [{ year: 2024, allocated: 65000000000, released: 60000000000, spent: 58000000000 }], projects: [] },
            { name: "Ministry of Housing", commissioner: { portfolio: "Commissioner", name: "Moruf Akinderu-Fatai" }, sector: "Infrastructure", financials: [{ year: 2024, allocated: 85000000000, released: 75000000000, spent: 70000000000 }], projects: [] },
            { name: "Ministry of Transportation", commissioner: { portfolio: "Commissioner", name: "Oluwaseun Osiyemi" }, sector: "Infrastructure", financials: [{ year: 2024, allocated: 110000000000, released: 100000000000, spent: 95000000000 }], projects: [] }
        ],
        commissioners: [],
        website: "https://lagosstate.gov.ng"
    }
];

export const lgaData: LGAOverview[] = [
    {
        name: "Ikeja",
        state: "Lagos",
        chairman: "Mojeed Balogun",
        departments: [
            { name: "Department of Administration", hod: "Alhaji Suleiman", financials: [{ year: 2024, allocated: 25000000, released: 22000000, spent: 21000000 }], projects: [] },
            { name: "Department of Finance and Supplies", hod: "Mrs. Adebayo", financials: [{ year: 2024, allocated: 15000000, released: 14000000, spent: 13500000 }], projects: [] },
            { name: "Department of Primary Health Care", hod: "Dr. Sarah Johnson", financials: [{ year: 2024, allocated: 45000000, released: 40000000, spent: 38000000 }], projects: [{ id: "lga-phc-001", name: "Immunization Drive", description: "LGA wide drive.", status: "Completed", budget: 5000000, spent: 4800000, location: "Ikeja", startDate: "2024-01-01" }] },
            { name: "Department of Education and Social Development", hod: "Mr. Okafor", financials: [{ year: 2024, allocated: 35000000, released: 30000000, spent: 28000000 }], projects: [] },
            { name: "Department of Works and Housing", hod: "Engr. Mike Okoro", financials: [{ year: 2024, allocated: 65000000, released: 55000000, spent: 52000000 }], projects: [] },
            { name: "Department of Agriculture and Natural Resources", hod: "Mr. Yusuf", financials: [{ year: 2024, allocated: 20000000, released: 18000000, spent: 17000000 }], projects: [] },
            { name: "Department of Budget and Statistics", hod: "Mrs. Williams", financials: [{ year: 2024, allocated: 12000000, released: 11000000, spent: 10500000 }], projects: [] }
        ],
        total_budget: 217000000
    }
];
