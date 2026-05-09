-- Create policy_volunteers table
CREATE TABLE IF NOT EXISTS public.policy_volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    policy_id TEXT NOT NULL,
    skill_area TEXT NOT NULL,
    committed_hours INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, policy_id)
);

-- Create policy_comments table
CREATE TABLE IF NOT EXISTS public.policy_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    policy_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.policy_comments(id) ON DELETE CASCADE,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.policy_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_comments ENABLE ROW LEVEL SECURITY;

-- Policies for volunteers
CREATE POLICY "Users can view volunteer counts" ON public.policy_volunteers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can volunteer" ON public.policy_volunteers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Anyone can view comments" ON public.policy_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post comments" ON public.policy_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.policy_comments FOR UPDATE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.policy_comments;
