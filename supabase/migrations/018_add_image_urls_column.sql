-- Add image_urls column to issue_reports table to support multiple images
ALTER TABLE public.issue_reports ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Migrate existing image_url data to image_urls
UPDATE public.issue_reports 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_urls IS NULL;

-- Make image_url optional (if not already) or drop it later. For now, keep it valid.
ALTER TABLE public.issue_reports ALTER COLUMN image_url DROP NOT NULL;
