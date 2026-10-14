# TechNova CMS — Complete Database Schema Reference

This document consolidates all SQL migrations applied to the Supabase database for the TechNova CMS. The actual migrations were applied via the Supabase MCP tool and are recorded in `supabase/migrations/`. This file is a reference for fresh setups and documentation.

## Migration Files (in order of application)

1. `00000000000000_initial_schema.sql` — Full schema (tables, RLS, functions, storage, seed)
2. `20261008134029_upgrade_admin_profiles_add_roles.sql` — Added role/full_name/is_active columns, is_admin() and is_super_admin() functions
3. `20261008134102_create_nav_pages_seo_storage.sql` — Created navigation_items, pages, seo_settings, media_items tables + Storage bucket
4. `20261008134137_tighten_rls_policies_is_admin.sql` — Replaced all content table RLS policies to use is_admin() function
5. `20261008134205_seed_nav_seo_branding.sql` — Seeded initial navigation, SEO, and branding data

## Tables

### admin_profiles
Links `auth.users` to admin roles. Only super_admin users can manage this table.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Profile ID |
| user_id | uuid | References auth.users(id) |
| is_admin | boolean | Legacy flag (kept for compatibility) |
| role | text | 'super_admin' or 'admin' |
| full_name | text | Display name |
| is_active | boolean | Whether the user can access the admin panel |
| last_login_at | timestamptz | Last login timestamp |
| created_at | timestamptz | Creation timestamp |

### products
Product catalog with bilingual content, multi-image gallery, specifications.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Product ID |
| slug | text UNIQUE | URL slug |
| title | jsonb | { "ar": "...", "en": "..." } |
| short_description | jsonb | Bilingual short description |
| description | jsonb | Bilingual full description |
| category | jsonb | Bilingual category |
| features | jsonb | Array of bilingual strings |
| specifications | jsonb | Array of { key, value } bilingual pairs |
| images | jsonb | Array of image URLs |
| documents | jsonb | Array of { name, url } |
| related_solutions | jsonb | Array of solution IDs |
| related_projects | jsonb | Array of project IDs |
| seo | jsonb | SEO metadata |
| status | text | 'draft', 'published', or 'archived' |
| featured | boolean | Show on homepage |
| sort_order | integer | Display order |
| created_at, updated_at | timestamptz | Timestamps |

### solutions
Solution offerings with features, benefits, and applications.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Solution ID |
| slug | text UNIQUE | URL slug |
| title, short_description, description | jsonb | Bilingual content |
| features, benefits, applications | jsonb | Arrays of bilingual strings |
| images | jsonb | Array of image URLs |
| icon | text | Lucide icon name |
| related_products, related_projects | jsonb | Arrays of IDs |
| seo | jsonb | SEO metadata |
| status | text | 'draft', 'published', 'archived' |
| featured | boolean | Show on homepage |
| sort_order | integer | Display order |

### services
Service offerings with features and icons. Same pattern as solutions.

### projects
Case studies with client info, scope, and results.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Project ID |
| slug | text UNIQUE | URL slug |
| title | jsonb | Bilingual title |
| client | text | Client name |
| category, location | jsonb | Bilingual |
| year | text | Project year |
| description | jsonb | Bilingual description |
| scope, results | jsonb | Arrays of bilingual strings |
| images, gallery | jsonb | Arrays of image URLs |
| featured | boolean | Show on homepage |
| status, sort_order | - | Same as other tables |

### clients
Client logos and descriptions for the clients section.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Client ID |
| name | text | Client name |
| logo | text | Logo URL |
| website | text | Client website |
| description | jsonb | Bilingual description |
| category | text | Industry category |
| sort_order | integer | Display order |

### news
News articles with categories, featured images, and SEO.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Article ID |
| slug | text UNIQUE | URL slug |
| title, excerpt, content | jsonb | Bilingual content |
| featured_image | text | Hero image URL |
| gallery | jsonb | Array of image URLs |
| author | text | Author name |
| date | date | Publication date |
| category | jsonb | Bilingual category |
| featured | boolean | Show as featured |
| status | text | 'draft', 'published', 'archived' |

### testimonials
Client testimonials with star ratings.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Testimonial ID |
| author | text | Author name |
| role | jsonb | Bilingual job title |
| company | text | Company name |
| content | jsonb | Bilingual testimonial text |
| avatar | text | Avatar URL |
| rating | integer | 1-5 star rating |
| sort_order | integer | Display order |

### stats
Homepage statistics counters.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Stat ID |
| label | jsonb | Bilingual label |
| value | text | Numeric value as string |
| suffix | text | Suffix (e.g., "+", "%") |
| icon | text | Lucide icon name |
| sort_order | integer | Display order |

### site_settings
Key-value store for site identity, contact info, social links, and branding.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Setting ID |
| key | text UNIQUE | Setting key (e.g., 'branding', 'identity') |
| value | jsonb | Setting value (JSON object) |
| updated_at | timestamptz | Last update |

### navigation_items
Header navigation menu items with parent/child hierarchy.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Nav item ID |
| label | jsonb | Bilingual label |
| href | text | URL path |
| parent_id | uuid | Parent item ID (null = top-level) |
| icon | text | Lucide icon name |
| enabled | boolean | Visible in header |
| sort_order | integer | Display order |
| is_external | boolean | External link flag |

### pages
Custom pages with sections and SEO (for future page builder feature).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Page ID |
| slug | text UNIQUE | URL slug |
| title | jsonb | Bilingual title |
| content | jsonb | Bilingual content |
| sections | jsonb | Section configuration |
| status | text | 'draft' or 'published' |
| seo | jsonb | SEO metadata |
| sort_order | integer | Display order |

### seo_settings
Key-value store for global SEO settings.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Setting ID |
| key | text UNIQUE | Setting key (title, description, keywords, ogImage, robots, canonical) |
| value | jsonb | Setting value |
| updated_at | timestamptz | Last update |

### media_items
Media library metadata. Files are stored in Supabase Storage 'media' bucket.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Media item ID |
| url | text | Storage URL |
| name | text | Original filename |
| format | text | File format (jpg, png, pdf, etc.) |
| width, height | integer | Image dimensions |
| size | bigint | File size in bytes |
| category | text | Category tag |
| created_at | timestamptz | Upload timestamp |

## Security: RLS Policies

All tables have RLS enabled. The pattern:

- **Public tables** (clients, testimonials, stats, site_settings, navigation_items, seo_settings, media_items): `anon, authenticated` can SELECT all rows; only `is_admin()` can INSERT/UPDATE/DELETE.
- **Content tables** (products, solutions, services, projects, news, pages): `anon, authenticated` can SELECT rows where `status = 'published'` OR `is_admin()`; only `is_admin()` can INSERT/UPDATE/DELETE.
- **admin_profiles**: Only `is_admin()` can SELECT; only `is_super_admin()` can INSERT/UPDATE/DELETE (and cannot delete themselves).

### SECURITY DEFINER Functions

- `is_admin()` — Returns true if `auth.uid()` has an active admin_profiles row with role 'admin' or 'super_admin'.
- `is_super_admin()` — Returns true if `auth.uid()` has an active admin_profiles row with role 'super_admin'.

## Storage

- Bucket: `media` (public, 10MB limit)
- Allowed types: JPEG, PNG, WebP, GIF, SVG, PDF
- Policies: public read, admin upload/update/delete

## Edge Function: user-management

Deployed at `supabase/functions/user-management/index.ts`. Handles:
- GET: List all users (super_admin only)
- POST: Create user or reset password (super_admin only)
- PUT: Update user profile (super_admin only)
- DELETE: Delete user (super_admin only)

The edge function uses the service role key (server-side only) to call `supabase.auth.admin` API. The browser frontend calls this edge function instead of using auth.admin directly.

## Creating the First Super Admin

After applying the schema, create the first admin user:

1. Sign up a user through Supabase Auth (or the admin login page if sign-up is enabled)
2. Insert a profile row:
```sql
INSERT INTO admin_profiles (user_id, role, full_name, is_active, is_admin)
VALUES ('<auth-user-uuid>', 'super_admin', 'Admin Name', true, true);
```
3. Log in at `/admin/login`
