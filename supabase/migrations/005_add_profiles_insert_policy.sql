-- Add INSERT policy for profiles table to allow users to create their own profile
-- This is required for upsert operations and when the trigger fails to create the profile

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
