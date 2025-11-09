-- SQL Script to Setup Admin User for FlowraValves
-- 
-- IMPORTANT: This script assumes you've already created the user in Supabase Auth.
-- 
-- To create the user in Supabase Auth, you can either:
-- 1. Use the Supabase Dashboard: Authentication > Users > Add User
-- 2. Use the Supabase API (see instructions below)
-- 3. Use the Supabase CLI
--
-- After the user is created in auth.users, run this script to:
-- 1. Insert the user profile
-- 2. Assign admin role to the user

-- ============================================
-- STEP 1: Create User in Supabase Auth (DO THIS FIRST)
-- ============================================
-- Option A: Via Supabase Dashboard
-- Go to: https://supabase.com/dashboard/project/qtaarndtwyxdsqlkepir/auth/users
-- Click "Add User" and create:
--   Email: flowravalves@gmail.com
--   Password: noneofyourbusiness
--   Auto Confirm User: Yes
--
-- Option B: Via SQL (requires service_role key - run in Supabase SQL Editor)
-- Note: This requires elevated privileges. You'll need to use the Supabase SQL Editor
-- with service_role access, or create the user via the dashboard first.

-- ============================================
-- STEP 2: Get the User ID
-- ============================================
-- After creating the user, you need to get their user ID (UUID) from auth.users table.
-- You can find it in the Supabase Dashboard or by running:
-- SELECT id, email FROM auth.users WHERE email = 'flowravalves@gmail.com';

-- ============================================
-- STEP 3: Insert Profile and Admin Role
-- ============================================
-- Replace 'USER_ID_HERE' with the actual user ID from Step 2

-- Insert into profiles table
INSERT INTO public.profiles (id, email, full_name, created_at)
VALUES (
  'USER_ID_HERE',  -- Replace with actual user ID from auth.users
  'flowravalves@gmail.com',
  'FlowraValves Admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

-- Insert into user_roles table
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
  'USER_ID_HERE',  -- Replace with actual user ID from auth.users
  'admin',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';

-- ============================================
-- ALTERNATIVE: Complete Script with User Creation
-- ============================================
-- If you have service_role access, you can use this extension function:
-- Note: This requires the Supabase Auth extension to be enabled
-- and proper permissions. This is typically done in the Supabase SQL Editor.

-- Create the user in auth schema (requires service_role)
-- This is a simplified version - actual implementation may vary based on Supabase version
/*
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'flowravalves@gmail.com',
    crypt('noneofyourbusiness', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (new_user_id, 'flowravalves@gmail.com', 'FlowraValves Admin', NOW())
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name;

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (new_user_id, 'admin', NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'admin';

  RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;
*/

-- ============================================
-- RECOMMENDED APPROACH: Use Supabase Dashboard
-- ============================================
-- The easiest way is to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Enter email: flowravalves@gmail.com
-- 4. Enter password: noneofyourbusiness
-- 5. Enable "Auto Confirm User"
-- 6. Click "Create User"
-- 7. Copy the User ID (UUID)
-- 8. Run the INSERT statements above with the actual User ID

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After setup, verify with these queries:

-- Check if user exists in auth.users
-- SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'flowravalves@gmail.com';

-- Check if profile exists
-- SELECT * FROM public.profiles WHERE email = 'flowravalves@gmail.com';

-- Check if admin role is assigned
-- SELECT ur.*, p.email 
-- FROM public.user_roles ur
-- JOIN public.profiles p ON ur.user_id = p.id
-- WHERE p.email = 'flowravalves@gmail.com' AND ur.role = 'admin';

