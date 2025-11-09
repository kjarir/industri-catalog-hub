# ⚠️ IMPORTANT: Run Database Migration First

## Issue
You're seeing errors because the `parent_id` column doesn't exist in your `product_categories` table yet.

## Solution
You need to run the migration script to add the `parent_id` column to your database.

### Steps:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/qtaarndtwyxdsqlkepir/sql/new
   - Or navigate to: SQL Editor > New Query

2. **Copy and paste the migration script**
   - Open the file: `migration-add-parent-id-to-categories.sql`
   - Copy all the SQL code

3. **Run the migration**
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

4. **Verify it worked**
   - You should see a success message
   - The `parent_id` column should now exist in your `product_categories` table

### Migration Script Location
The migration script is located at:
```
migration-add-parent-id-to-categories.sql
```

### What the migration does:
- Adds a `parent_id` column to `product_categories` table
- Makes it nullable (NULL for main categories, UUID for subcategories)
- Adds a foreign key reference to itself (for parent-child relationship)
- Adds an index for better performance
- Adds ON DELETE CASCADE (deleting a parent will delete its children)

### After running the migration:
- Refresh your browser
- Try creating categories and subcategories again
- Everything should work now! ✅

### Quick Migration SQL (Copy this):

```sql
-- Add parent_id column
ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE;

-- Add index
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id 
ON public.product_categories(parent_id);

-- Add comment
COMMENT ON COLUMN public.product_categories.parent_id IS 
'References the parent category ID. NULL for main categories, UUID for subcategories.';
```

