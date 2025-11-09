-- ============================================
-- Migration: Add parent_id to product_categories
-- ============================================
-- This migration adds support for subcategories by adding a parent_id column
-- to the product_categories table.
--
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qtaarndtwyxdsqlkepir/sql/new
--
-- ============================================

-- Step 1: Add parent_id column (nullable, allows NULL for main categories)
ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE;

-- Step 2: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id 
ON public.product_categories(parent_id);

-- Step 3: Add comment to document the column
COMMENT ON COLUMN public.product_categories.parent_id IS 
'References the parent category ID. NULL for main categories, UUID for subcategories.';

-- ============================================
-- Verification Queries (optional - run to verify)
-- ============================================

-- Check if the column was added successfully
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'product_categories'
--   AND column_name = 'parent_id';

-- Check existing categories (should show NULL for all existing categories)
-- SELECT id, name, parent_id, created_at
-- FROM public.product_categories
-- ORDER BY name;

-- ============================================
-- Rollback (if needed)
-- ============================================
-- If you need to rollback this migration, run:
-- DROP INDEX IF EXISTS idx_product_categories_parent_id;
-- ALTER TABLE public.product_categories DROP COLUMN IF EXISTS parent_id;

