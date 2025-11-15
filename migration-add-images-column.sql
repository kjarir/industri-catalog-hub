-- ============================================
-- Migration: Add images column to products table
-- ============================================
-- This migration adds support for multiple product images by adding an images column
-- to the products table.
--
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql/new
--
-- ============================================

-- Step 1: Add images column (nullable JSONB array)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT NULL;

-- Step 2: Add comment to document the column
COMMENT ON COLUMN public.products.images IS 
'Array of image URLs for product gallery. Stored as JSONB array of strings. Example: ["url1", "url2", "url3"]';

-- Step 3: Add index for better query performance (optional, but recommended)
CREATE INDEX IF NOT EXISTS idx_products_images 
ON public.products USING GIN (images);

-- ============================================
-- Verification Queries (optional - run to verify)
-- ============================================

-- Check if the column was added successfully
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'products'
--   AND column_name = 'images';

-- ============================================
-- Rollback (if needed)
-- ============================================
-- If you need to rollback this migration, run:
-- DROP INDEX IF EXISTS idx_products_images;
-- ALTER TABLE public.products DROP COLUMN IF EXISTS images;

