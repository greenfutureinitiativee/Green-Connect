export interface RepresentativeDetail {
    id: string;
    name: string;
    chamber: 'Senate' | 'House of Representatives';
    state: string;
    constituency: string;
    party: string;
    role?: string;
    image_url?: string;
    twitter?: string;
}

export const nationalAssemblyStats = {
    total_seats: 469,
    senate_seats: 109,
    house_seats: 360,
    current_session: "10th National Assembly",
};

export const sampleRepresentatives: RepresentativeDetail[] = [
    // Senate - Sample for major states
    { id: "sen-fct-1", name: "Sen. Ireti Kingibe", chamber: "Senate", state: "FCT", constituency: "Abuja", party: "LP", twitter: "@ireti_kingibe" },
    { id: "sen-akwa-1", name: "Sen. Godswill Akpabio", chamber: "Senate", state: "Akwa Ibom", constituency: "Akwa Ibom North-West", party: "APC", role: "Senate President" },
    { id: "sen-lagos-1", name: "Sen. Tokunbo Abiru", chamber: "Senate", state: "Lagos", constituency: "Lagos East", party: "APC" },
    { id: "sen-lagos-2", name: "Sen. Wasiu Eshinlokun", chamber: "Senate", state: "Lagos", constituency: "Lagos Central", party: "APC" },
    { id: "sen-lagos-3", name: "Sen. Idiat Adebule", chamber: "Senate", state: "Lagos", constituency: "Lagos West", party: "APC" },
    
    // House of Reps - Sample
    { id: "hor-kaduna-1", name: "Hon. Tajudeen Abbas", chamber: "House of Representatives", state: "Kaduna", constituency: "Zaria", party: "APC", role: "Speaker" },
    { id: "hor-lagos-1", name: "Hon. Femi Gbajabiamila", chamber: "House of Representatives", state: "Lagos", constituency: "Surulere I", party: "APC" },
    { id: "hor-lagos-2", name: "Hon. James Faleke", chamber: "House of Representatives", state: "Lagos", constituency: "Ikeja", party: "APC" },
    { id: "hor-kano-1", name: "Hon. Alhassan Doguwa", chamber: "House of Representatives", state: "Kano", constituency: "Doguwa/Tudun Wada", party: "APC" },
    { id: "hor-rivers-1", name: "Hon. Kingsley Chinda", chamber: "House of Representatives", state: "Rivers", constituency: "Obio/Akpor", party: "PDP", role: "Minority Leader" },
];

// Helper to generate a full list for demo purposes if needed, 
// but for now we'll use a robust filtering system and search.
