-- Fix RLS for issue_reports
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting or duplicate policies
DROP POLICY IF EXISTS "Issue reports are viewable by everyone" ON public.issue_reports;
DROP POLICY IF EXISTS "Authenticated users can create issue reports" ON public.issue_reports;
DROP POLICY IF EXISTS "Users can update their own issue reports" ON public.issue_reports;
DROP POLICY IF EXISTS "Users can report issues" ON public.issue_reports;

-- Re-create policies ensures clean state
CREATE POLICY "Issue reports are viewable by everyone" 
ON public.issue_reports FOR SELECT 
USING (true);

CREATE POLICY "Users can report issues" 
ON public.issue_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issue reports" 
ON public.issue_reports FOR UPDATE 
USING (auth.uid() = user_id);
