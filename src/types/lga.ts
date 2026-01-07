// TypeScript types for LGA data structures

export interface ExecutiveRole {
    chairman: {
        name: string;
        party: string;
        title?: string; // Added title
        phone?: string;
        email?: string;
        image_url?: string;
        assumed_office?: string;
    };
    vice_chairman: {
        name: string;
        party: string;
        title?: string; // Added title
        phone?: string;
        image_url?: string;
    };
    secretary: {
        name: string;
        title?: string; // Added title
        assumed_office?: string;
    };
    supervisors: {
        name: string;
        portfolio: string;
    }[];
}

export interface LegislativeRole {
    council_leader: string | { name: string; ward: string; party?: string }; // Allow object or string
    councillors: {
        name: string;
        ward: string;
        party: string;
    }[];
}

export interface TraditionalLeader {
    title: string;
    name: string;
    image_url?: string;
    domain?: string; // Added domain
}

export interface PoliticalParty {
    name: string;
    status: 'Ruling' | 'Opposition';
    chairman?: string;
}

export interface CDA {
    name: string;
    chairman?: string;
    contact?: string;
}

export interface GovernanceStructure {
    executive: ExecutiveRole;
    legislative: LegislativeRole;
    traditional: TraditionalLeader[]; // Changed back to array
    parties: PoliticalParty[];
    cdas?: CDA[];
    oversight?: {
        state_ministry?: string;
        siec?: string;
    };
}

export interface LGA {
    id: string;
    name: string;
    state: string;
    chairman?: string;
    governance?: GovernanceStructure;
    population?: number;
    annual_budget?: number;
    description?: string;
    image_url?: string;
    geopolitical_zone?: 'North Central' | 'North East' | 'North West' | 'South East' | 'South South' | 'South West';
    headquarters?: string;
    contact_phone?: string;
    contact_email?: string;
    website_url?: string;
    office_address?: string;
    last_data_update?: string;
    data_quality_score?: number;
    created_at?: string;
}

export interface LGAImage {
    id: string;
    lga_id: string;
    user_id?: string;
    image_url: string;
    caption?: string;
    category?: 'infrastructure' | 'events' | 'nature' | 'people' | 'development' | 'culture' | 'other';
    likes_count: number;
    is_approved: boolean;
    is_featured: boolean;
    created_at: string;
    approved_at?: string;
    approved_by?: string;
    user?: {
        full_name?: string;
        avatar_url?: string;
    };
    is_liked_by_user?: boolean;
    issue_id?: string;
}

export interface LGAImageLike {
    id: string;
    image_id: string;
    user_id: string;
    created_at: string;
}

export interface BudgetAllocation {
    id: string;
    lga_id: string;
    year: number;
    category: string;
    allocated_amount: number;
    spent_amount: number;
    created_at: string;
}

export interface LGAProject {
    id: string;
    lga_id: string;
    name: string;
    description?: string;
    budget_allocated?: number;
    budget_spent?: number;
    status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
    start_date?: string;
    completion_date?: string;
    category?: 'infrastructure' | 'education' | 'health' | 'environment' | 'agriculture' | 'security' | 'others';
    jobs_created?: number;
    beneficiaries_count?: number;
    created_at: string;
}

// Deprecated: Detailed Politician interface replaced by GovernanceStructure
export interface Politician {
    id: string;
    lga_id: string;
    name: string;
    position: string;
    party?: string;
    phone?: string;
    email?: string;
    image_url?: string;
    created_at: string;
}

export interface IssueReport {
    id: string;
    user_id?: string;
    lga_id: string;
    title: string;
    description?: string;
    category?: string;
    location_lat?: number;
    location_lng?: number;
    location_address?: string;
    image_url?: string;
    status: 'reported' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    resolved_date?: string;
    created_at: string;
}

export interface LGAGalleryStats {
    lga_id: string;
    lga_name: string;
    state: string;
    total_images: number;
    approved_images: number;
    featured_images: number;
    total_likes: number;

}

export interface LGADetails extends LGA {
    budgetAllocations: BudgetAllocation[];
    projects: LGAProject[];
    politicians: Politician[]; // Kept for backward compatibility
    governance?: GovernanceStructure; // NEW: Detailed governance structure
    issues: IssueReport[];
    gallery_stats?: LGAGalleryStats;
}

export interface LGAAllocation {
    id: number;
    lga_id: string;
    source_id?: number;
    period: string;
    amount: number;
    currency: string;
    details?: any;
    raw?: any;
    fetched_at: string;
}

export interface LGASpending {
    id: number;
    lga_id: string;
    source_id?: number;
    date: string;
    amount: number;
    category?: string;
    description?: string;
    contract_or_ref?: string;
    raw?: any;
    fetched_at: string;
}

export interface LGAFinancialSummary {
    lga: {
        id: string;
        name: string;
        state: string;
    };
    allocations: LGAAllocation[];
    spendings: LGASpending[];
    projects: any[];
}
