/*
# Upgrade admin_profiles to support roles and active status

## Overview
Upgrades the existing admin_profiles table to support a proper role-based access control system.
Adds role, full_name, and is_active columns. Creates an is_admin SECURITY DEFINER function
for use in RLS policies.

## Changes to admin_profiles
- Add `role` text column (values: 'super_admin', 'admin'; default 'admin')
- Add `full_name` text column
- Add `is_active` boolean column (default true)
- Add `last_login_at` timestamptz column (nullable)

## New Functions
- `is_admin()` — SECURITY DEFINER function that checks if the current auth user has an active admin profile
  Used in RLS policies so only authenticated admins can write CMS content.

## Security
- The is_admin() function is SECURITY DEFINER so it can read admin_profiles during RLS checks.
- Only super_admin users can modify admin_profiles rows.
- Admin users can read admin_profiles but cannot modify them.
*/

-- ============ UPGRADE admin_profiles ============
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin';
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS full_name text NOT NULL DEFAULT '';
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- Set existing admin to super_admin
UPDATE admin_profiles SET role = 'super_admin' WHERE is_admin = true;

-- ============ is_admin() SECURITY DEFINER function ============
-- Returns true if the current auth user has an active admin or super_admin profile
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Grant execute to authenticated and anon
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- ============ is_super_admin() function ============
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role = 'super_admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon;

-- ============ Update admin_profiles RLS policies ============
-- Drop old policies
DROP POLICY IF EXISTS "admin_delete_admin_profile" ON admin_profiles;
DROP POLICY IF EXISTS "admin_insert_admin_profile" ON admin_profiles;
DROP POLICY IF EXISTS "admin_update_admin_profile" ON admin_profiles;
DROP POLICY IF EXISTS "read_own_admin_profile" ON admin_profiles;
DROP POLICY IF EXISTS "auth_select_admin_profiles" ON admin_profiles;
DROP POLICY IF EXISTS "auth_insert_admin_profiles" ON admin_profiles;
DROP POLICY IF EXISTS "auth_update_admin_profiles" ON admin_profiles;
DROP POLICY IF EXISTS "auth_delete_admin_profiles" ON admin_profiles;

-- Authenticated admins can read all profiles
CREATE POLICY "profiles_admin_read"
ON admin_profiles FOR SELECT
TO authenticated
USING (is_admin());

-- Only super_admin can insert profiles
CREATE POLICY "profiles_super_insert"
ON admin_profiles FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

-- Only super_admin can update profiles
CREATE POLICY "profiles_super_update"
ON admin_profiles FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- Only super_admin can delete profiles (but not themselves)
CREATE POLICY "profiles_super_delete"
ON admin_profiles FOR DELETE
TO authenticated
USING (is_super_admin() AND user_id != auth.uid());
