
export interface Minister {
    portfolio: string;
    name: string;
    state_of_origin?: string;
    ministry_url?: string;
    image_url?: string;
}

export interface FinancialMetric {
    year: number;
    allocated: number; // Budgeted
    released: number;  // Actually provided to ministry
    spent: number;     // Actually spent by ministry
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'Planned' | 'In Progress' | 'Completed' | 'Stalled' | 'Under Investigation';
    budget: number;
    spent: number;
    completion_percentage?: number; // 0 to 100
    location: string;
    startDate: string;
    completionDate?: string;
    contractor?: string;
}

export interface FederalMinistry {
    name: string;
    minister: Minister;
    minister_of_state?: Minister;
    mandate: string;
    website?: string;
    sector: 'Environment' | 'Health' | 'Infrastructure' | 'Security' | 'Education' | 'Economy' | 'Governance' | 'Other';
    financials: FinancialMetric[];
    total_gap?: number; // (Allocated - Spent)
    projects: Project[];
}

export interface StateCommissioner {
    portfolio: string;
    name: string;
}

export interface StateGovernor {
    name: string;
    party: string;
    deputy: string;
}

export interface StateBudget {
    year: number;
    total_budget: number; // in Naira
    capital_expenditure: number;
    recurrent_expenditure: number;
    status: 'Proposed' | 'Passed' | 'Signed';
    details_url?: string;
}

export interface StateMinistry {
    name: string;
    commissioner: StateCommissioner;
    sector: string;
    financials: FinancialMetric[];
    projects: Project[];
}

export interface StateData {
    name: string;
    capital: string;
    governor: StateGovernor;
    ministries: StateMinistry[];
    commissioners: StateCommissioner[]; // Keep for legacy compatibility
    budget: StateBudget[];
    website?: string;
}

export interface LGADepartment {
    name: string;
    hod: string; // Head of Department
    financials: FinancialMetric[];
    projects: Project[];
}

export interface LGAOverview {
    name: string;
    state: string;
    chairman: string;
    departments: LGADepartment[];
    total_budget?: number;
}
