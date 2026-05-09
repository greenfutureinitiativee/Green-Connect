import type { Chamber, LegislativePolicy, Representative } from "@/types/chambers";

export const federalChamber: Chamber = {
    level: 'Federal',
    name: "National Assembly of Nigeria",
    location: "Three Arms Zone, Abuja",
    executive_head: {
        title: "President",
        name: "Bola Ahmed Tinubu",
        party: "APC"
    },
    legislative_body: "National Assembly (Senate & House of Reps)",
    member_count: 469,
    current_policies: [
        {
            id: "fed-pol-001",
            title: "Police Reform & Accountability Act",
            description: "A bill to restructure the Nigeria Police Force, focusing on state coordination and anti-corruption measures.",
            status: 'Committee',
            proposer: "Sen. Mohammed Monguno",
            date_introduced: "2024-01-15",
            last_updated: "2024-03-10",
            level: 'Federal'
        },
        {
            id: "fed-pol-002",
            title: "Clean Air & Industrial Emissions Control Bill",
            description: "Setting national standards for air quality and penalizing high-emission industrial zones.",
            status: 'Second Reading',
            proposer: "Hon. Bamidele Salam",
            date_introduced: "2024-02-05",
            last_updated: "2024-04-12",
            level: 'Federal'
        },
        {
            id: "fed-pol-003",
            title: "EFCC 2.0 (Autonomy) Amendment",
            description: "Strengthening the financial and operational autonomy of the EFCC to investigate high-level governance fraud.",
            status: 'Proposed',
            proposer: "Sen. Solomon Adeola",
            date_introduced: "2024-04-20",
            last_updated: "2024-04-20",
            level: 'Federal'
        }
    ],
    representatives: [
        {
            id: "rep-fed-001",
            name: "Sen. Godswill Akpabio",
            role: "Senate President",
            party: "APC",
            constituency: "Akwa Ibom North-West",
            twitter: "@godswill_akpabio"
        },
        {
            id: "rep-fed-002",
            name: "Hon. Tajudeen Abbas",
            role: "Speaker, House of Reps",
            party: "APC",
            constituency: "Zaria, Kaduna",
            twitter: "@Speaker_Abbas"
        }
    ]
};

export const lagosChamber: Chamber = {
    level: 'State',
    name: "Lagos State House of Assembly",
    location: "Alausa, Ikeja",
    executive_head: {
        title: "Governor",
        name: "Babajide Sanwo-Olu",
        party: "APC"
    },
    legislative_body: "House of Assembly",
    member_count: 40,
    current_policies: [
        {
            id: "lag-pol-001",
            title: "Plastic Waste (Zero Injection) Regulation",
            description: "A bill to ban single-use plastics in all public government facilities and major event centers.",
            status: 'Passed',
            proposer: "Hon. Gbolahan Yishawu",
            date_introduced: "2023-11-10",
            last_updated: "2024-03-05",
            level: 'State'
        },
        {
            id: "lag-pol-002",
            title: "Lagos State Healthcare Welfare Scheme",
            description: "Establishing a mandatory health insurance subsidy for low-income residents.",
            status: 'Committee',
            proposer: "Hon. Segun Olulade",
            date_introduced: "2024-01-20",
            last_updated: "2024-04-01",
            level: 'State'
        }
    ],
    representatives: [
        {
            id: "rep-lag-001",
            name: "Hon. Mudashiru Obasa",
            role: "Speaker",
            party: "APC",
            constituency: "Agege I",
            twitter: "@mudashiru_obasa"
        }
    ]
};

export const ikejaChamber: Chamber = {
    level: 'Local',
    name: "Ikeja LGA Legislative Council",
    location: "Ikeja Secretarial",
    executive_head: {
        title: "Chairman",
        name: "Mojeed Balogun",
        party: "APC"
    },
    legislative_body: "Legislative Council",
    member_count: 10,
    current_policies: [
        {
            id: "lga-pol-001",
            title: "Drainage Maintenance & Penalty Bylaw",
            description: "Mandatory monthly drainage clearance for residents with spot-fines for blockages.",
            status: 'Assented',
            proposer: "Hon. Abiodun Ogungbo",
            date_introduced: "2023-09-01",
            last_updated: "2024-01-10",
            level: 'Local'
        }
    ],
    representatives: [
        {
            id: "rep-ikeja-001",
            name: "Hon. Wale Alausa",
            role: "Leader of House",
            party: "APC",
            constituency: "Ward F, Ikeja",
        }
    ]
};
