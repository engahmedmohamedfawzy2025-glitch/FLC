# TechNova CMS — Enterprise Bilingual Website

A white-label enterprise CMS website with full Arabic/English (RTL/LTR) support, an admin panel for managing all content, and a PostgreSQL database backend (Supabase).

---

## Table of Contents

1. [Features Overview](#features-overview)
2. [Tech Stack](#tech-stack)
3. [Admin Access & User Roles](#admin-access--user-roles)
4. [Local Development Setup](#local-development-setup)
5. [Deploying to Vercel](#deploying-to-vercel)
6. [Connecting a GoDaddy Domain](#connecting-a-godaddy-domain)
7. [Environment Variables](#environment-variables)
8. [Security Notes](#security-notes)
9. [Managing Content](#managing-content)
10. [Product Image Gallery](#product-image-gallery)
11. [Media Library & File Uploads](#media-library--file-uploads)
12. [Branding & Theme Customization](#branding--theme-customization)
13. [Navigation Management](#navigation-management)
14. [SEO Settings](#seo-settings)
15. [User Management](#user-management)
16. [Database Schema](#database-schema)

---

## Features Overview

- **Bilingual**: Arabic (default, RTL) and English (LTR) with instant language switching
- **Admin Panel**: Full CRUD for all content entities — products, solutions, services, projects, clients, news, testimonials, stats
- **Role-Based Access**: Two admin roles — `super_admin` and `admin` — with different permissions
- **User Management**: Super admins can create, edit, delete, and reset passwords for admin users
- **Site Settings**: Editable company identity, contact info, social links, and feature flags
- **Branding**: Customize theme colors, typography, and design tokens from the admin panel
- **Navigation**: Manage header menu items with parent/child hierarchy from the admin panel
- **SEO**: Global SEO settings (title, description, keywords, OG image, robots, canonical)
- **Media Library**: Upload and manage images and files via Supabase Storage
- **Product Gallery**: Each product can have multiple images with add/remove/edit UI
- **Sticky Header**: Dark glass-morphism header that stays visible on scroll
- **Responsive**: Optimized for mobile, tablet, and desktop
- **SEO Ready**: Sitemap, robots.txt, structured data (JSON-LD)
- **Database-Backed**: All admin changes are saved to the database and visible to all visitors instantly — no redeployment needed

---

## Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 13.5 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (email/password) |
| File Storage | Supabase Storage (media bucket) |
| Edge Functions | Supabase Edge Functions (user management) |
| Hosting | Vercel |

---

## Admin Access & User Roles

The admin panel is at `/admin/login`.

### Default Admin Account
An initial super admin account is created during setup. The credentials are stored in Supabase Auth — they are NOT visible in the code or any file in the repository.

### Two Admin Roles

| Role | Can do everything an admin can | Can manage users | Can delete other super admins |
|---|---|---|---|
| **super_admin** | Yes | Yes (create, edit, delete, reset passwords) | Yes |
| **admin** | Yes | No | No |

Both roles can manage all content (products, solutions, services, etc.). Only `super_admin` users can access the Users management page.

### Creating the First Super Admin

After setting up the database, you need to create the first admin user:

1. Go to your Supabase Dashboard > Authentication > Users
2. Click "Add user" and create a user with email and password
3. Note the user's UUID
4. Run this SQL in the Supabase SQL Editor:
   ```sql
   INSERT INTO admin_profiles (user_id, role, full_name, is_active, is_admin)
   VALUES ('<the-user-uuid>', 'super_admin', 'Your Name', true, true);
   ```
5. You can now log in at `/admin/login` with the email and password you set

After that, you can create additional admin users directly from the admin panel's Users page (no SQL needed).

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- A Supabase project with the database schema applied (see [Database Schema](#database-schema))

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public key for browser access
   - `SUPABASE_SERVICE_ROLE_KEY` — server-side key for edge function (auto-configured in Supabase)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the website.

5. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the admin panel.

---

## Deploying to Vercel

### Step 1: Push to GitHub

1. Create a new repository on GitHub.
2. Push your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Select your repository from the list.
4. Vercel will auto-detect Next.js — no configuration needed.

### Step 3: Add Environment Variables

In the Vercel project settings, go to **Settings** > **Environment Variables** and add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is automatically available to edge functions in the Supabase environment — do NOT add it to Vercel.

### Step 4: Deploy

1. Click **"Deploy"**.
2. Wait 2-3 minutes for the build to complete.
3. Vercel will give you a URL like `https://your-project.vercel.app`.
4. Your website is now live!

---

## Connecting a GoDaddy Domain

### Step 1: Add Domain in Vercel

1. Go to your Vercel project > **Settings** > **Domains**.
2. Click **"Add"** and enter your domain (e.g., `www.technova.com`).
3. Also add the apex domain (`technova.com`).
4. Vercel will show you DNS records to add.

### Step 2: Configure DNS in GoDaddy

1. Log in to [godaddy.com](https://godaddy.com).
2. Go to **My Products** > your domain > **DNS** > **Manage DNS**.

**For the apex domain (`technova.com`):**

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 600 |

> **Note**: Vercel will show you the exact A record IP. Use the value Vercel displays.

**For `www`:**

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `cname.vercel-dns.com` | 600 |

3. Save the DNS records.
4. Go back to Vercel — it will verify the DNS within a few minutes.
5. Vercel automatically provisions an SSL certificate (HTTPS).

### Step 3: Verify

1. Wait 15-30 minutes for DNS propagation.
2. Visit your domain — the website should be live with HTTPS.
3. Test the admin panel at `https://yourdomain.com/admin/login`.

---

## Environment Variables

| Variable | Where to find it | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Project Settings > API | Yes (safe for browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Project Settings > API | Yes (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Project Settings > API | No (server-side only, auto-configured for edge functions) |

**Never commit the `.env` file to git.** It is already in `.gitignore`.

---

## Security Notes

- **Admin credentials** are stored in Supabase Auth — not in any code file.
- **Row Level Security (RLS)** is enabled on all database tables:
  - Visitors (anon) can only **read** published content
  - Only authenticated admins can **create, update, and delete** content
  - The `is_admin()` SECURITY DEFINER function checks the user's role in `admin_profiles`
  - Only `super_admin` users can manage admin user accounts
- **No service role key in the browser**: User management operations (create/delete/reset password) go through a Supabase Edge Function (`user-management`) that uses the service role key server-side. The browser never has access to the service role key.
- **Content tables** are protected: even if someone discovers your Supabase URL, they cannot write to the database without an authenticated admin session.

---

## Managing Content

All content management happens through the admin panel at `/admin`.

### What you can manage:

| Section | What you can do |
|---|---|
| **Dashboard** | View content counts and quick links |
| **Website Identity** | Company name, tagline, description, logos, contact info, social links |
| **Branding** | Theme colors, typography, and design tokens |
| **Navigation** | Header menu items with parent/child hierarchy, ordering, enable/disable |
| **Pages** | Homepage section builder (future) |
| **Products** | Add/edit/delete products with multi-image gallery |
| **Solutions** | Add/edit/delete solutions |
| **Services** | Add/edit/delete services |
| **Projects** | Add/edit/delete project case studies |
| **Clients** | Add/edit/delete client logos |
| **Testimonials** | Add/edit/delete client testimonials with star ratings |
| **Statistics** | Add/edit/delete homepage stat counters |
| **News** | Add/edit/delete news articles |
| **Media Library** | Upload, browse, and delete images and files |
| **SEO** | Global SEO settings (title, description, keywords, OG image, robots) |
| **Users** | Create/edit/delete admin users and reset passwords (super_admin only) |
| **Settings** | Enable/disable website sections (feature flags) |

### How changes appear on the website:

When you save any change in the admin panel, it is written to the database immediately. All visitors to the website will see the updated content — you do not need to rebuild or redeploy.

---

## Product Image Gallery

Each product supports multiple images (gallery). In the admin panel:

1. Go to **Products** > click **Add Product** or edit an existing one.
2. In the **Image Gallery** section, click **"Add Image"**.
3. Enter the image URL and confirm.
4. Repeat to add more images.
5. Hover over any image to edit or remove it.
6. Click **Save** to persist the gallery to the database.

The first image in the gallery is used as the main product image. All images appear in the product detail page on the website.

---

## Media Library & File Uploads

The Media Library (`/admin/media`) lets you upload and manage images and files:

- **Drag and drop** files into the upload zone, or click to browse
- Supported formats: JPEG, PNG, WebP, GIF, SVG, PDF (max 10MB each)
- Files are stored in Supabase Storage (`media` bucket)
- Copy image URLs to use in product galleries, news articles, etc.
- Delete files to remove them from storage

Uploaded files are public — visitors can view them on the website. Only admins can upload or delete files.

---

## Branding & Theme Customization

The Branding page (`/admin/branding`) lets you customize:

- **Color Palette**: Primary, secondary, accent, background, surface, text, muted, border, success, warning, and error colors
- **Typography**: Arabic and English font families, heading and body fonts
- **Design Tokens**: Border radius, button radius, card radius, shadow intensity, container width, section spacing

Changes are saved to the `site_settings` table and applied to the website via CSS custom properties on page load. The website reads branding from the database and overrides the default theme automatically.

---

## Navigation Management

The Navigation page (`/admin/navigation`) lets you manage header menu items:

- **Add menu items** with bilingual labels (Arabic + English)
- **Create parent/child hierarchy** — top-level items can have child items (shown in mega menu dropdown)
- **Set URLs** for internal links (`/about`) or external links (`https://...`)
- **Reorder items** using the sort order field
- **Enable/disable** individual items
- **Set icons** (Lucide icon names) for child items in the mega menu

The website header reads navigation items from the database on every page load, so changes appear immediately.

---

## SEO Settings

The SEO page (`/admin/seo`) lets you configure:

- **Site Title** (bilingual) — appears in browser tabs and search results
- **Meta Description** (bilingual) — shown in search engine results
- **Keywords** (bilingual) — comma-separated keywords
- **Open Graph Image** — social sharing preview image
- **Robots Directive** — control search engine indexing
- **Canonical URL** — set the canonical URL for SEO

These settings are saved to the `seo_settings` table and consumed by the website's metadata generation on every page.

---

## User Management

The Users page (`/admin/users`) is only accessible to `super_admin` users. It lets you:

- **Create new admin users** — specify email, password, full name, and role (admin or super_admin)
- **Edit users** — change name, role, or active status
- **Delete users** — removes the user from both the database and Supabase Auth
- **Reset passwords** — set a new password for any user
- **Deactivate users** — disable access without deleting the account

User management operations go through a Supabase Edge Function (`user-management`) that verifies the caller is a super_admin before performing any action. This ensures the service role key is never exposed to the browser.

---

## Database Schema

The complete database schema is documented in [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md). Migration files are in `supabase/migrations/`. Key points:

- **14 tables** with RLS enabled
- **SECURITY DEFINER functions** `is_admin()` and `is_super_admin()` for role checks
- **Supabase Storage** `media` bucket for file uploads
- **Edge Function** `user-management` for auth admin operations
- **JSONB columns** for bilingual content (`{ "ar": "...", "en": "..." }`)
- **snake_case** database columns mapped to **camelCase** TypeScript types
