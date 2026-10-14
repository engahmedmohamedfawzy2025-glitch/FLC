/*
# Tighten RLS policies on all content tables to use is_admin() function

## Overview
Replaces all existing content table RLS policies with proper admin-authorization checks.
Instead of allowing ANY authenticated user to write, only users with an active admin
profile (checked via the is_admin() SECURITY DEFINER function) can perform writes.

## Tables updated
- products, solutions, services, projects, clients, news, testimonials, stats, site_settings

## Policy pattern
- SELECT: anon + authenticated can read published content (or all if no status column)
- INSERT/UPDATE/DELETE: only authenticated users where is_admin() returns true
*/

-- Helper: drop and recreate policies for a table with a status column
-- We do this manually for each table since dynamic SQL in policies isn't supported

-- ============ PRODUCTS ============
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "products_admin_insert" ON products;
DROP POLICY IF EXISTS "products_admin_update" ON products;
DROP POLICY IF EXISTS "products_admin_delete" ON products;
DROP POLICY IF EXISTS "auth_delete_products" ON products;
DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "public_read_products" ON products;

CREATE POLICY "products_read" ON products FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());
CREATE POLICY "products_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "products_update" ON products FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "products_delete" ON products FOR DELETE
  TO authenticated USING (is_admin());

-- ============ SOLUTIONS ============
DROP POLICY IF EXISTS "solutions_public_read" ON solutions;
DROP POLICY IF EXISTS "solutions_admin_insert" ON solutions;
DROP POLICY IF EXISTS "solutions_admin_update" ON solutions;
DROP POLICY IF EXISTS "solutions_admin_delete" ON solutions;
DROP POLICY IF EXISTS "auth_delete_solutions" ON solutions;
DROP POLICY IF EXISTS "auth_insert_solutions" ON solutions;
DROP POLICY IF EXISTS "auth_update_solutions" ON solutions;
DROP POLICY IF EXISTS "public_read_solutions" ON solutions;

CREATE POLICY "solutions_read" ON solutions FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());
CREATE POLICY "solutions_insert" ON solutions FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "solutions_update" ON solutions FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "solutions_delete" ON solutions FOR DELETE
  TO authenticated USING (is_admin());

-- ============ SERVICES ============
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_insert" ON services;
DROP POLICY IF EXISTS "services_admin_update" ON services;
DROP POLICY IF EXISTS "services_admin_delete" ON services;
DROP POLICY IF EXISTS "auth_delete_services" ON services;
DROP POLICY IF EXISTS "auth_insert_services" ON services;
DROP POLICY IF EXISTS "auth_update_services" ON services;
DROP POLICY IF EXISTS "public_read_services" ON services;

CREATE POLICY "services_read" ON services FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());
CREATE POLICY "services_insert" ON services FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "services_update" ON services FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "services_delete" ON services FOR DELETE
  TO authenticated USING (is_admin());

-- ============ PROJECTS ============
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_admin_insert" ON projects;
DROP POLICY IF EXISTS "projects_admin_update" ON projects;
DROP POLICY IF EXISTS "projects_admin_delete" ON projects;
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
DROP POLICY IF EXISTS "public_read_projects" ON projects;

CREATE POLICY "projects_read" ON projects FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());
CREATE POLICY "projects_insert" ON projects FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "projects_update" ON projects FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "projects_delete" ON projects FOR DELETE
  TO authenticated USING (is_admin());

-- ============ CLIENTS ============
DROP POLICY IF EXISTS "clients_public_read" ON clients;
DROP POLICY IF EXISTS "clients_admin_insert" ON clients;
DROP POLICY IF EXISTS "clients_admin_update" ON clients;
DROP POLICY IF EXISTS "clients_admin_delete" ON clients;
DROP POLICY IF EXISTS "auth_delete_clients" ON clients;
DROP POLICY IF EXISTS "auth_insert_clients" ON clients;
DROP POLICY IF EXISTS "auth_update_clients" ON clients;
DROP POLICY IF EXISTS "public_read_clients" ON clients;

CREATE POLICY "clients_read" ON clients FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "clients_insert" ON clients FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "clients_update" ON clients FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "clients_delete" ON clients FOR DELETE
  TO authenticated USING (is_admin());

-- ============ NEWS ============
DROP POLICY IF EXISTS "news_public_read" ON news;
DROP POLICY IF EXISTS "news_admin_insert" ON news;
DROP POLICY IF EXISTS "news_admin_update" ON news;
DROP POLICY IF EXISTS "news_admin_delete" ON news;
DROP POLICY IF EXISTS "auth_delete_news" ON news;
DROP POLICY IF EXISTS "auth_insert_news" ON news;
DROP POLICY IF EXISTS "auth_update_news" ON news;
DROP POLICY IF EXISTS "public_read_news" ON news;

CREATE POLICY "news_read" ON news FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());
CREATE POLICY "news_insert" ON news FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "news_update" ON news FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "news_delete" ON news FOR DELETE
  TO authenticated USING (is_admin());

-- ============ TESTIMONIALS ============
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
DROP POLICY IF EXISTS "testimonials_admin_insert" ON testimonials;
DROP POLICY IF EXISTS "testimonials_admin_update" ON testimonials;
DROP POLICY IF EXISTS "testimonials_admin_delete" ON testimonials;
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;

CREATE POLICY "testimonials_read" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "testimonials_insert" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "testimonials_update" ON testimonials FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "testimonials_delete" ON testimonials FOR DELETE
  TO authenticated USING (is_admin());

-- ============ STATS ============
DROP POLICY IF EXISTS "stats_public_read" ON stats;
DROP POLICY IF EXISTS "stats_admin_insert" ON stats;
DROP POLICY IF EXISTS "stats_admin_update" ON stats;
DROP POLICY IF EXISTS "stats_admin_delete" ON stats;
DROP POLICY IF EXISTS "auth_delete_stats" ON stats;
DROP POLICY IF EXISTS "auth_insert_stats" ON stats;
DROP POLICY IF EXISTS "auth_update_stats" ON stats;
DROP POLICY IF EXISTS "public_read_stats" ON stats;

CREATE POLICY "stats_read" ON stats FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "stats_insert" ON stats FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "stats_update" ON stats FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "stats_delete" ON stats FOR DELETE
  TO authenticated USING (is_admin());

-- ============ SITE_SETTINGS ============
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_insert" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_update" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_delete" ON site_settings;
DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;

CREATE POLICY "settings_read" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "settings_insert" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "settings_update" ON site_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "settings_delete" ON site_settings FOR DELETE
  TO authenticated USING (is_admin());

-- ============ MEDIA_ITEMS ============
DROP POLICY IF EXISTS "public_read_media_items" ON media_items;
DROP POLICY IF EXISTS "auth_delete_media_items" ON media_items;
DROP POLICY IF EXISTS "auth_insert_media_items" ON media_items;
DROP POLICY IF EXISTS "auth_update_media_items" ON media_items;

CREATE POLICY "media_items_read" ON media_items FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "media_items_insert" ON media_items FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "media_items_update" ON media_items FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "media_items_delete" ON media_items FOR DELETE
  TO authenticated USING (is_admin());
