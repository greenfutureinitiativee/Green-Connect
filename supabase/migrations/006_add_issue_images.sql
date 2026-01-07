-- Add columns for multiple images to issue_reports table
ALTER TABLE public.issue_reports 
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Create storage bucket for issue images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage bucket
CREATE POLICY "Issue images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'issue-images' );

CREATE POLICY "Authenticated users can upload issue images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'issue-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own issue images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'issue-images' 
    AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own issue images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'issue-images' 
    AND auth.uid() = owner
);
