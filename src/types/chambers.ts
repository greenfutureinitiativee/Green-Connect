export type PolicyStatus = 'Proposed' | 'First Reading' | 'Second Reading' | 'Committee' | 'Third Reading' | 'Passed' | 'Rejected' | 'Assented';

export type Representative = {
    id: string;
    name: string;
    role: string;
    party: string;
    constituency: string;
    image_url?: string;
    email?: string;
    phone?: string;
    twitter?: string;
};

export type LegislativePolicy = {
    id: string;
    title: string;
    description: string;
    status: PolicyStatus;
    proposer: string;
    date_introduced: string;
    last_updated: string;
    level: 'Federal' | 'State' | 'Local';
};

export type Chamber = {
    level: 'Federal' | 'State' | 'Local';
    name: string;
    location: string;
    executive_head: {
        title: string;
        name: string;
        party: string;
    };
    legislative_body: string;
    member_count: number;
    current_policies: LegislativePolicy[];
    representatives: Representative[];
};

export type GovernanceStructure = {
    federal: Chamber;
    states: {
        [stateName: string]: Chamber;
    };
    lgas: {
        [lgaName: string]: Chamber;
    };
};
