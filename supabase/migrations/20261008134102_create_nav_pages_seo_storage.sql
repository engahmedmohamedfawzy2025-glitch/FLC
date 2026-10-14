/*
# Create navigation_items, pages, and seo_settings tables + Storage bucket

## New Tables

### navigation_items
- Stores header navigation menu items with bilingual labels, ordering, visibility
- Supports parent/child hierarchy via parent_id self-reference

### pages
- Stores custom pages with bilingual title, content, slug, SEO, and publish status
- Supports homepage section ordering via a separate jsonb column

### seo_settings
- Key-value table for global SEO settings (title, description, keywords, OG image, etc.)

## Storage
- Creates a public bucket 'media' for image/file uploads
- Sets storage policies: authenticated admins can upload/delete, public can read

## Security
- navigation_items: public read for enabled items, admin CRUD for all
- pages: public read for published pages, admin CRUD for all
- seo_settings: public read, admin CRUD
- Storage: public read, admin upload/delete
*/

-- ============ NAVIGATION_ITEMS ============
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label jsonb NOT NULL DEFAULT '{}',
  href text NOT NULL DEFAULT '',
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  icon text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  is_external boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nav_public_read" ON navigation_items;
CREATE POLICY "nav_public_read" ON navigation_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "nav_admin_insert" ON navigation_items;
CREATE POLICY "nav_admin_insert" ON navigation_items FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "nav_admin_update" ON navigation_items;
CREATE POLICY "nav_admin_update" ON navigation_items FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "nav_admin_delete" ON navigation_items;
CREATE POLICY "nav_admin_delete" ON navigation_items FOR DELETE
  TO authenticated USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_nav_sort_order ON navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_nav_parent ON navigation_items(parent_id);

-- ============ PAGES ============
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title jsonb NOT NULL DEFAULT '{}',
  content jsonb NOT NULL DEFAULT '{}',
  sections jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'draft',
  seo jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_public_read" ON pages;
CREATE POLICY "pages_public_read" ON pages FOR SELECT
  TO anon, authenticated USING (status = 'published' OR is_admin());

DROP POLICY IF EXISTS "pages_admin_insert" ON pages;
CREATE POLICY "pages_admin_insert" ON pages FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "pages_admin_update" ON pages;
CREATE POLICY "pages_admin_update" ON pages FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "pages_admin_delete" ON pages;
CREATE POLICY "pages_admin_delete" ON pages FOR DELETE
  TO authenticated USING (is_admin());

-- ============ SEO_SETTINGS ============
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_public_read" ON seo_settings;
CREATE POLICY "seo_public_read" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "seo_admin_insert" ON seo_settings;
CREATE POLICY "seo_admin_insert" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "seo_admin_update" ON seo_settings;
CREATE POLICY "seo_admin_update" ON seo_settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "seo_admin_delete" ON seo_settings;
CREATE POLICY "seo_admin_delete" ON seo_settings FOR DELETE
  TO authenticated USING (is_admin());

-- ============ ADD sort_order TO TABLES MISSING IT ============
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE stats ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE news ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin upload/delete
DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_admin_upload" ON storage.objects;
CREATE POLICY "media_admin_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "media_admin_update" ON storage.objects;
CREATE POLICY "media_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND is_admin())
  WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "media_admin_delete" ON storage.objects;
CREATE POLICY "media_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND is_admin());
