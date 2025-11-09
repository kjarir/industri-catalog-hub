-- ============================================
-- Create Admin User for FlowraValves
-- Email: flowravalves@gmail.com
-- Password: noneofyourbusiness
-- ============================================
-- 
-- QUICK START (Recommended):
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/qtaarndtwyxdsqlkepir/auth/users
-- 2. Click "Add User"
-- 3. Enter:
--    - Email: flowravalves@gmail.com
--    - Password: noneofyourbusiness
--    - Auto Confirm User: ✅ Yes
-- 4. Click "Create User"
-- 5. Copy the User ID (UUID) - it looks like: 12345678-1234-1234-1234-123456789abc
-- 6. Replace 'YOUR_USER_ID_HERE' in the SQL below with that User ID
-- 7. Run this SQL script in Supabase SQL Editor
--
-- ============================================

-- Step 1: Insert or update profile
-- ⚠️ REPLACE 'YOUR_USER_ID_HERE' with the actual User ID from Supabase Dashboard
INSERT INTO public.profiles (id, email, full_name, created_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- ← Replace this with the User ID from step 5 above
  'flowravalves@gmail.com',
  'FlowraValves Admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Step 2: Assign admin role
-- ⚠️ REPLACE 'YOUR_USER_ID_HERE' with the same User ID from above
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- ← Replace this with the same User ID from step 5 above
  'admin',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';

-- ============================================
-- VERIFICATION (Run these to verify setup)
-- ============================================
-- Check if profile was created:
-- SELECT * FROM public.profiles WHERE email = 'flowravalves@gmail.com';

-- Check if admin role was assigned:
-- SELECT ur.*, p.email 
-- FROM public.user_roles ur
-- JOIN public.profiles p ON ur.user_id = p.id
-- WHERE p.email = 'flowravalves@gmail.com' AND ur.role = 'admin';

-- ============================================
-- ALTERNATIVE: One-liner after getting User ID
-- ============================================
-- If you already have the User ID, you can run this single query:
-- (Replace 'USER_ID' with your actual User ID)
/*
DO $$
DECLARE
  user_id uuid := 'USER_ID';  -- Replace with your User ID
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (user_id, 'flowravalves@gmail.com', 'FlowraValves Admin', NOW())
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, full_name = EXCLUDED.full_name;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (user_id, 'admin', NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'admin';
END $$;
*/

