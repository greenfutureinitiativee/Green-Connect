-- 1. Create the policy_volunteers table
CREATE TABLE IF NOT EXISTS public.policy_volunteers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    policy_id TEXT NOT NULL,
    skill_area TEXT NOT NULL,
    committed_hours INTEGER NOT NULL CHECK (committed_hours > 0 AND committed_hours <= 168),
    
    -- Ensure a user can only volunteer for a specific policy once
    UNIQUE(user_id, policy_id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.policy_volunteers ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Allow users to view their own volunteer records
CREATE POLICY "Users can view their own volunteer entries" 
ON public.policy_volunteers 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own volunteer records
CREATE POLICY "Users can insert their own volunteer entries" 
ON public.policy_volunteers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
