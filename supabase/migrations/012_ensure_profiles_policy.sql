-- Migration: Ensure Profiles RLS Policies
-- This migration ensures that authenticated users can INSERT and UPDATE their own profile.
-- This is necessary for UPSERT operations to work correctly.

-- 1. Ensure INSERT policy exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Ensure UPDATE policy exists (just in case)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. Ensure SELECT policy exists
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
