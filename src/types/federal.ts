
export interface Minister {
    portfolio: string;
    name: string;
    state_of_origin?: string;
    ministry_url?: string;
    image_url?: string;
}

export interface FederalMinistry {
    name: string;
    minister: Minister;
    minister_of_state?: Minister;
    mandate: string;
    website?: string;
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

export interface StateData {
    name: string;
    capital: string;
    governor: StateGovernor;
    commissioners: StateCommissioner[];
    budget: StateBudget[];
    website?: string;
}
