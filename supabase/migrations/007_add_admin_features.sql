-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Add admin fields to issue_reports table
ALTER TABLE public.issue_reports
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES public.profiles(id);

-- Create policy for admins to update any issue report
CREATE POLICY "Admins can update any issue report" ON public.issue_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policy for admins to view all profiles (if not already public/viewable)
-- (Existing policy "Users can view their own profile" might be too restrictive for admins)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
