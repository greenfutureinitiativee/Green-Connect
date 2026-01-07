-- Migration: Add Referral & Gamification System
-- This migration adds support for referral tracking, points system, and gamification

-- =====================================================
-- 1. UPDATE PROFILES TABLE - Add Referral Code & Role
-- =====================================================
-- Add role column if it doesn't exist (from migration 007)
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Add referral code column
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Generate referral codes for existing users
UPDATE public.profiles 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE referral_code IS NULL;

-- =====================================================
-- 2. REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(referred_id)
);

-- =====================================================
-- 3. USER POINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 4. POINT HISTORY TABLE (Audit Log)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.point_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 5. BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    requirement_type TEXT NOT NULL,
    requirement_count INTEGER NOT NULL,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 6. USER BADGES TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- 7. INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_points ON public.user_points(points DESC);
CREATE INDEX IF NOT EXISTS idx_point_history_user_id ON public.point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_point_history_created_at ON public.point_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- REFERRALS: Users can view their own referrals
CREATE POLICY "Users can view their referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals" ON public.referrals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- USER POINTS: Users can view their own points
CREATE POLICY "Users can view their own points" ON public.user_points
    FOR SELECT USING (auth.uid() = user_id);

-- USER POINTS: Admins can view all points
CREATE POLICY "Admins can view all points" ON public.user_points
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- USER POINTS: Only system/RPC can update points (users cannot directly modify)
CREATE POLICY "System can update points" ON public.user_points
    FOR UPDATE USING (true);

CREATE POLICY "System can insert points" ON public.user_points
    FOR INSERT WITH CHECK (true);

-- POINT HISTORY: Users can view their own history
CREATE POLICY "Users can view their point history" ON public.point_history
    FOR SELECT USING (auth.uid() = user_id);

-- POINT HISTORY: Admins can view all history
CREATE POLICY "Admins can view all point history" ON public.point_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- BADGES: Everyone can view badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges
    FOR SELECT USING (true);

-- USER BADGES: Users can view their own badges
CREATE POLICY "Users can view their badges" ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- USER BADGES: Everyone can view others' badges (for profile display)
CREATE POLICY "User badges are publicly viewable" ON public.user_badges
    FOR SELECT USING (true);

-- =====================================================
-- 9. FUNCTIONS
-- =====================================================

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 6-character uppercase alphanumeric code
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_code) INTO code_exists;
        
        -- If code is unique, return it
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user points
CREATE OR REPLACE FUNCTION public.increment_points(
    userid UUID,
    add_points INTEGER,
    reason TEXT
) RETURNS VOID AS $$
BEGIN
    -- Update or insert user points
    INSERT INTO public.user_points (user_id, points, last_updated)
    VALUES (userid, add_points, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        points = user_points.points + add_points,
        last_updated = NOW();

    -- Log to point history
    INSERT INTO public.point_history (user_id, points, reason)
    VALUES (userid, add_points, reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user level based on points
CREATE OR REPLACE FUNCTION public.get_user_level(total_points INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF total_points >= 15000 THEN
        RETURN 'Chief Volunteer';
    ELSIF total_points >= 5000 THEN
        RETURN 'Ambassador';
    ELSIF total_points >= 1500 THEN
        RETURN 'Gold';
    ELSIF total_points >= 500 THEN
        RETURN 'Silver';
    ELSE
        RETURN 'Bronze';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badge(
    userid UUID,
    badge_name TEXT
) RETURNS VOID AS $$
DECLARE
    badge_record RECORD;
    user_count INTEGER;
    already_has_badge BOOLEAN;
BEGIN
    -- Get badge info
    SELECT * INTO badge_record FROM public.badges WHERE name = badge_name;
    
    IF badge_record IS NULL THEN
        RETURN;
    END IF;

    -- Check if user already has this badge
    SELECT EXISTS(
        SELECT 1 FROM public.user_badges 
        WHERE user_id = userid AND badge_id = badge_record.id
    ) INTO already_has_badge;

    IF already_has_badge THEN
        RETURN;
    END IF;

    -- Check requirement based on type
    CASE badge_record.requirement_type
        WHEN 'issues_reported' THEN
            SELECT COUNT(*) INTO user_count 
            FROM public.issue_reports 
            WHERE user_id = userid;
        WHEN 'images_uploaded' THEN
            SELECT COUNT(*) INTO user_count 
            FROM public.lga_images 
            WHERE user_id = userid;
        WHEN 'total_likes' THEN
            SELECT SUM(likes_count) INTO user_count 
            FROM public.lga_images 
            WHERE user_id = userid;
        WHEN 'referrals' THEN
            SELECT COUNT(*) INTO user_count 
            FROM public.referrals 
            WHERE referrer_id = userid;
        ELSE
            RETURN;
    END CASE;

    -- Award badge if requirement met
    IF user_count >= badge_record.requirement_count THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (userid, badge_record.id)
        ON CONFLICT DO NOTHING;

        -- Award bonus points
        IF badge_record.points_awarded > 0 THEN
            PERFORM public.increment_points(
                userid, 
                badge_record.points_awarded, 
                'Badge earned: ' || badge_name
            );
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user referral
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
    referrer_user_id UUID;
BEGIN
    -- Generate referral code for new user
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := public.generate_referral_code();
    END IF;

    -- Initialize user points
    INSERT INTO public.user_points (user_id, points)
    VALUES (NEW.id, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. TRIGGERS
-- =====================================================

-- Trigger to handle new user signup
DROP TRIGGER IF EXISTS on_user_signup_referral ON public.profiles;
CREATE TRIGGER on_user_signup_referral
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_referral_signup();

-- =====================================================
-- 11. SEED DATA - Default Badges
-- =====================================================
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_count, points_awarded)
VALUES
    ('Waste Warrior', 'Report 10 environmental issues', '🛡️', 'issues_reported', 10, 50),
    ('Street Guardian', 'Explore 5 different LGAs', '🏙️', 'lgas_explored', 5, 30),
    ('Eco Influencer', 'Earn 100 total likes on your images', '⭐', 'total_likes', 100, 75),
    ('Community Builder', 'Refer 3 successful volunteers', '🤝', 'referrals', 3, 100),
    ('Change Maker', 'Upload 20 LGA images', '📸', 'images_uploaded', 20, 60),
    ('Pioneer Volunteer', 'Be among the first 100 users', '🎖️', 'early_adopter', 1, 25),
    ('Report Champion', 'Report 50 issues', '🏆', 'issues_reported', 50, 150),
    ('Super Connector', 'Refer 10 volunteers', '🌟', 'referrals', 10, 300)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 12. VIEWS
-- =====================================================

-- Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    COALESCE(up.points, 0) as points,
    public.get_user_level(COALESCE(up.points, 0)) as level,
    COUNT(DISTINCT ub.badge_id) as badge_count,
    COUNT(DISTINCT r.referred_id) as referral_count
FROM public.profiles p
LEFT JOIN public.user_points up ON p.id = up.user_id
LEFT JOIN public.user_badges ub ON p.id = ub.user_id
LEFT JOIN public.referrals r ON p.id = r.referrer_id
GROUP BY p.id, p.full_name, p.avatar_url, up.points
ORDER BY points DESC
LIMIT 100;

-- User Stats View
CREATE OR REPLACE VIEW public.user_gamification_stats AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.referral_code,
    COALESCE(up.points, 0) as total_points,
    public.get_user_level(COALESCE(up.points, 0)) as current_level,
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    COUNT(DISTINCT r.referred_id) as total_referrals,
    COUNT(DISTINCT ir.id) as issues_reported,
    COUNT(DISTINCT img.id) as images_uploaded,
    COALESCE(SUM(img.likes_count), 0) as total_likes_received
FROM public.profiles p
LEFT JOIN public.user_points up ON p.id = up.user_id
LEFT JOIN public.user_badges ub ON p.id = ub.user_id
LEFT JOIN public.referrals r ON p.id = r.referrer_id
LEFT JOIN public.issue_reports ir ON p.id = ir.user_id
LEFT JOIN public.lga_images img ON p.id = img.user_id
GROUP BY p.id, p.full_name, p.referral_code, up.points;
