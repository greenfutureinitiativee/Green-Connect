export interface Profile {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    lga_id?: string;
    role?: 'user' | 'admin';
    avatar_url?: string;
}

export interface IssueReport {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'reported' | 'verified' | 'in_progress' | 'resolved' | 'rejected';
    location_address?: string;
    lga_id: string;
    user_id: string;
    images?: string[];
    image_urls?: string[];
    created_at: string;
    admin_notes?: string;
    resolved_by?: string;
    profiles?: Profile; // Joined profile data
    lgas?: { name: string; state: string }; // Joined LGA data
}

export interface DashboardStats {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    criticalReports: number;
}
