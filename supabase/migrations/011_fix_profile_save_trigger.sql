-- Migration: Fix Profile Save Trigger Conflict
-- This migration fixes the 403 Forbidden error when saving profiles
-- Root cause: BEFORE INSERT trigger conflicts with UPSERT operations and RLS policies

-- =====================================================
-- Fix the handle_referral_signup trigger function
-- =====================================================

-- Drop and recreate the trigger function with improved logic
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- Check if this is truly a new record (not an UPSERT update)
    -- We check if a profile with this ID already exists in the table
    -- Note: This runs BEFORE the INSERT, so we need to check the OLD trigger state
    -- For INSERT operations on existing UPSERTs, TG_OP will be 'INSERT' but the record exists
    
    -- Only run initialization logic for brand new profiles
    IF TG_OP = 'INSERT' THEN
        -- Check if a profile with this ID and referral_code already exists
        -- This helps distinguish between new inserts and UPSERT operations
        SELECT EXISTS(
            SELECT 1 FROM public.profiles 
            WHERE id = NEW.id
        ) INTO profile_exists;
        
        -- Only initialize for completely new profiles
        IF NOT profile_exists THEN
            -- Generate referral code if missing
            IF NEW.referral_code IS NULL THEN
                NEW.referral_code := public.generate_referral_code();
            END IF;
            
            -- Initialize user points (wrapped in exception handler to prevent blocking)
            BEGIN
                INSERT INTO public.user_points (user_id, points)
                VALUES (NEW.id, 0)
                ON CONFLICT (user_id) DO NOTHING;
            EXCEPTION
                WHEN OTHERS THEN
                    -- Log error but don't block profile creation
                    RAISE WARNING 'Failed to initialize user_points for user %: %', NEW.id, SQLERRM;
            END;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Additional safety: Ensure RLS policies are correct
-- =====================================================

-- The existing "System can insert points" policy should work, but let's verify
-- it's set up correctly. This policy should already exist from migration 010.

-- Drop and recreate to ensure it's correct
DROP POLICY IF EXISTS "System can insert points" ON public.user_points;
CREATE POLICY "System can insert points" ON public.user_points
    FOR INSERT WITH CHECK (true);

-- Also ensure the system can update points
DROP POLICY IF EXISTS "System can update points" ON public.user_points;
CREATE POLICY "System can update points" ON public.user_points
    FOR UPDATE USING (true);

-- =====================================================
-- Verify the trigger is still attached
-- =====================================================

-- The trigger should already exist, but let's ensure it's properly configured
DROP TRIGGER IF EXISTS on_user_signup_referral ON public.profiles;
CREATE TRIGGER on_user_signup_referral
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_referral_signup();
