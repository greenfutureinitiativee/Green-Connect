-- Green Future Connect Database Schema
-- This script creates all necessary tables, views, functions, and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. LGAS TABLE (774 Local Government Areas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lgas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    chairman TEXT,
    population INTEGER,
    annual_budget BIGINT,
    description TEXT,
    image_url TEXT,
    geopolitical_zone TEXT CHECK (geopolitical_zone IN ('North Central', 'North East', 'North West', 'South East', 'South South', 'South West')),
    headquarters TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(name, state)
);

-- =====================================================
-- 2. PROFILES TABLE (User Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    lga_id UUID REFERENCES public.lgas(id),
    ward TEXT,
    employment_status TEXT CHECK (employment_status IN ('employed', 'unemployed', 'self-employed', 'student')),
    employer_name TEXT,
    employment_sector TEXT,
    is_lga_employed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 3. ISSUE REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.issue_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lga_id UUID REFERENCES public.lgas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'verified', 'in_progress', 'resolved', 'rejected')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    resolved_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 4. LGA PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lga_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lga_id UUID REFERENCES public.lgas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    budget_allocated BIGINT,
    budget_spent BIGINT DEFAULT 0,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')),
    start_date DATE,
    completion_date DATE,
    category TEXT CHECK (category IN ('infrastructure', 'education', 'health', 'environment', 'agriculture', 'security', 'others')),
    jobs_created INTEGER DEFAULT 0,
    beneficiaries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 5. BUDGET ALLOCATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.budget_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lga_id UUID REFERENCES public.lgas(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    allocated_amount BIGINT NOT NULL,
    spent_amount BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(lga_id, year, category)
);

-- =====================================================
-- 6. POLITICIANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.politicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lga_id UUID REFERENCES public.lgas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    party TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- VIEWS
-- =====================================================

-- LGA Employment Stats View
CREATE OR REPLACE VIEW public.lga_employment_stats AS
SELECT 
    lga_id,
    COUNT(*) as total_residents,
    COUNT(*) FILTER (WHERE employment_status = 'employed') as employed_count,
    COUNT(*) FILTER (WHERE employment_status = 'unemployed') as unemployed_count,
    COUNT(*) FILTER (WHERE employment_status = 'self-employed') as self_employed_count,
    COUNT(*) FILTER (WHERE is_lga_employed = TRUE) as lga_employed_count,
    ROUND(
        (COUNT(*) FILTER (WHERE employment_status = 'employed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
        2
    ) as employment_rate
FROM public.profiles
WHERE lga_id IS NOT NULL
GROUP BY lga_id;

-- LGA Impact Metrics View
CREATE OR REPLACE VIEW public.lga_impact_metrics AS
SELECT 
    l.id as lga_id,
    l.name as lga_name,
    l.state,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') as completed_projects,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'in_progress') as active_projects,
    COALESCE(SUM(p.budget_spent), 0) as total_spent,
    COALESCE(SUM(p.jobs_created), 0) as total_jobs_created,
    COALESCE(SUM(p.beneficiaries_count), 0) as total_beneficiaries,
    COUNT(DISTINCT i.id) as total_issues_reported,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'resolved') as issues_resolved,
    ROUND(
        (COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'resolved')::DECIMAL / NULLIF(COUNT(DISTINCT i.id), 0)) * 100,
        2
    ) as resolution_rate
FROM public.lgas l
LEFT JOIN public.lga_projects p ON l.id = p.lga_id
LEFT JOIN public.issue_reports i ON l.id = i.lga_id
GROUP BY l.id, l.name, l.state;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating profiles timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.lgas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lga_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.politicians ENABLE ROW LEVEL SECURITY;

-- LGAs: Public read access
CREATE POLICY "LGAs are viewable by everyone" ON public.lgas
    FOR SELECT USING (true);

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Issue Reports: Public read, authenticated users can create
CREATE POLICY "Issue reports are viewable by everyone" ON public.issue_reports
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issue reports" ON public.issue_reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own issue reports" ON public.issue_reports
    FOR UPDATE USING (auth.uid() = user_id);

-- LGA Projects: Public read access
CREATE POLICY "LGA projects are viewable by everyone" ON public.lga_projects
    FOR SELECT USING (true);

-- Budget Allocations: Public read access
CREATE POLICY "Budget allocations are viewable by everyone" ON public.budget_allocations
    FOR SELECT USING (true);

-- Politicians: Public read access
CREATE POLICY "Politicians are viewable by everyone" ON public.politicians
    FOR SELECT USING (true);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_lgas_state ON public.lgas(state);
CREATE INDEX IF NOT EXISTS idx_lgas_name ON public.lgas(name);
CREATE INDEX IF NOT EXISTS idx_profiles_lga_id ON public.profiles(lga_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_lga_id ON public.issue_reports(lga_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_status ON public.issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_lga_projects_lga_id ON public.lga_projects(lga_id);
CREATE INDEX IF NOT EXISTS idx_lga_projects_status ON public.lga_projects(status);
CREATE INDEX IF NOT EXISTS idx_budget_allocations_lga_id ON public.budget_allocations(lga_id);
CREATE INDEX IF NOT EXISTS idx_politicians_lga_id ON public.politicians(lga_id);
