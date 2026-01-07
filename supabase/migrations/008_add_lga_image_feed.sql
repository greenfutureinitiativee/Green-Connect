-- Migration: Add LGA Image Feed & Enhanced Contact Fields
-- This migration adds support for TikTok-style image feeds per LGA
-- and additional contact/metadata fields for LGA information

-- =====================================================
-- 1. LGA IMAGES TABLE (Feed/Gallery)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lga_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lga_id UUID NOT NULL REFERENCES public.lgas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT CHECK (category IN ('infrastructure', 'events', 'nature', 'people', 'development', 'culture', 'other')),
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.profiles(id)
);

-- =====================================================
-- 2. IMAGE LIKES TABLE (Track who liked what)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lga_image_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES public.lga_images(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(image_id, user_id)
);

-- =====================================================
-- 3. UPDATE LGAS TABLE - Add Contact & Metadata Fields
-- =====================================================
ALTER TABLE public.lgas 
    ADD COLUMN IF NOT EXISTS contact_phone TEXT,
    ADD COLUMN IF NOT EXISTS contact_email TEXT,
    ADD COLUMN IF NOT EXISTS website_url TEXT,
    ADD COLUMN IF NOT EXISTS office_address TEXT,
    ADD COLUMN IF NOT EXISTS last_data_update TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    ADD COLUMN IF NOT EXISTS data_quality_score INTEGER DEFAULT 0 CHECK (data_quality_score BETWEEN 0 AND 100);

-- =====================================================
-- 4. INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_lga_images_lga_id ON public.lga_images(lga_id);
CREATE INDEX IF NOT EXISTS idx_lga_images_user_id ON public.lga_images(user_id);
CREATE INDEX IF NOT EXISTS idx_lga_images_approved ON public.lga_images(is_approved);
CREATE INDEX IF NOT EXISTS idx_lga_images_featured ON public.lga_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_lga_images_created_at ON public.lga_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lga_image_likes_image_id ON public.lga_image_likes(image_id);
CREATE INDEX IF NOT EXISTS idx_lga_image_likes_user_id ON public.lga_image_likes(user_id);

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.lga_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lga_image_likes ENABLE ROW LEVEL SECURITY;

-- LGA Images: Everyone can view approved images
CREATE POLICY "Approved LGA images are viewable by everyone" ON public.lga_images
    FOR SELECT USING (is_approved = true);

-- LGA Images: Authenticated users can insert (pending approval)
CREATE POLICY "Authenticated users can upload LGA images" ON public.lga_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- LGA Images: Users can update their own pending images
CREATE POLICY "Users can update their own pending images" ON public.lga_images
    FOR UPDATE USING (auth.uid() = user_id AND is_approved = false);

-- LGA Images: Users can delete their own pending images
CREATE POLICY "Users can delete their own pending images" ON public.lga_images
    FOR DELETE USING (auth.uid() = user_id AND is_approved = false);

-- Image Likes: Everyone can view
CREATE POLICY "Image likes are viewable by everyone" ON public.lga_image_likes
    FOR SELECT USING (true);

-- Image Likes: Authenticated users can like
CREATE POLICY "Authenticated users can like images" ON public.lga_image_likes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Image Likes: Users can unlike (delete their likes)
CREATE POLICY "Users can unlike images" ON public.lga_image_likes
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. FUNCTIONS
-- =====================================================

-- Function to update likes count when a like is added/removed
CREATE OR REPLACE FUNCTION public.update_image_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lga_images
        SET likes_count = likes_count + 1
        WHERE id = NEW.image_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lga_images
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.image_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Trigger to update likes count
DROP TRIGGER IF EXISTS on_image_like_change ON public.lga_image_likes;
CREATE TRIGGER on_image_like_change
    AFTER INSERT OR DELETE ON public.lga_image_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_image_likes_count();

-- =====================================================
-- 8. STORAGE BUCKET (Supabase Storage)
-- =====================================================
-- Note: This needs to be created in Supabase Dashboard or via API
-- Bucket name: 'lga-images'
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- =====================================================
-- 9. VIEWS
-- =====================================================

-- View for LGA gallery statistics
CREATE OR REPLACE VIEW public.lga_gallery_stats AS
SELECT 
    l.id as lga_id,
    l.name as lga_name,
    l.state,
    COUNT(img.id) as total_images,
    COUNT(img.id) FILTER (WHERE img.is_approved = true) as approved_images,
    COUNT(img.id) FILTER (WHERE img.is_featured = true) as featured_images,
    COALESCE(SUM(img.likes_count), 0) as total_likes
FROM public.lgas l
LEFT JOIN public.lga_images img ON l.id = img.lga_id
GROUP BY l.id, l.name, l.state;
