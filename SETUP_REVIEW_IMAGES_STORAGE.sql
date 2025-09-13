-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the review-images bucket
CREATE POLICY "Users can upload review images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'review-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Review images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'review-images');

CREATE POLICY "Users can update their own review images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'review-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own review images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'review-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add image_urls column to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN reviews.image_urls IS 'Array of image URLs uploaded by users for their reviews';

-- Update RLS policies to include the new column (if needed)
-- The existing RLS policies should automatically include the new column