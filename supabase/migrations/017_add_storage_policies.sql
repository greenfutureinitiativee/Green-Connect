-- Add RLS policies for storage objects
-- Ensure specific policies for issue-images

-- Allow public access to view images (SELECT)
CREATE POLICY "Public Access to Issue Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'issue-images' );

-- Allow authenticated users to upload images (INSERT)
CREATE POLICY "Authenticated Users can Upload Issue Images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'issue-images'
    AND auth.role() = 'authenticated'
);

-- Allow users to update their own images (UPDATE)
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'issue-images'
    AND auth.uid() = owner
);

-- Allow users to delete their own images (DELETE)
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'issue-images'
    AND auth.uid() = owner
);

-- Repeat for lga-images if needed (though usually admin only, but for now let's ensure it works if user needs it)
-- For lga-images, maybe restricted? But let's fix issue-images first.
