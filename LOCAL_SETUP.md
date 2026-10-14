# Local Setup Guide

This guide explains how to run the TechNova CMS project locally from a fresh machine.

## Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18.x or 20.x | Required by Next.js 13.5 |
| npm | 10.x | Comes with Node.js |
| Git | 2.x | For cloning the repository |
| Supabase CLI | 2.x | For local Supabase (optional — you can use cloud Supabase) |
| Docker | latest | Required by `supabase start` for local Supabase |

## Step 1: Clone & Install

```bash
git clone <your-repo-url> technova-cms
cd technova-cms
npm install
```

## Step 2: Configure Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can use either **cloud Supabase** (easiest) or **local Supabase** (offline development).

### Option A: Cloud Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Go to Project Settings → API to find your URL and anon key.
3. Paste them into `.env.local`.

### Option B: Local Supabase

```bash
# Install Supabase CLI (macOS)
brew install supabase/tap/supabase

# Or via npm
npm install -g supabase

# Start local Supabase (Docker must be running)
supabase start

# Get local credentials
supabase status
```

Use the local URL (`http://localhost:54321`) and the local anon key in your `.env.local`.

## Step 3: Apply Database Migrations

The project includes a Supabase migration that creates all content tables (products, solutions, services, projects, clients, news, testimonials, stats, site_settings, media_items, admin_profiles).

### With Cloud Supabase

Run the migration SQL in the Supabase Dashboard → SQL Editor:

```sql
-- Paste the contents of supabase/migrations/*.sql here
```

Or link your project and push:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### With Local Supabase

```bash
supabase db reset
```

This applies all migrations in `supabase/migrations/`.

## Step 4: Create Admin Account

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for full instructions.

Quick version:

1. Go to Supabase Dashboard → Authentication → Users → **Add user**.
2. Set email + password, enable auto-confirm.
3. Run in SQL Editor:

```sql
INSERT INTO admin_profiles (user_id, is_admin)
VALUES ('YOUR-USER-UUID', true);
```

## Step 5: Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/ar` (Arabic homepage).

To access the admin panel, go to [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with your admin email and password.

## Supabase Storage (Media Library)

If the admin panel uploads images via Supabase Storage:

1. Go to Supabase Dashboard → Storage → Create a bucket named `media`.
2. Set the bucket to **public** (for public website images).
3. Add a storage policy allowing authenticated users to upload, and public read access.

Allowed file types: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`.
Recommended max file size: 5 MB.

## Database Tables Overview

| Table | Purpose |
|-------|---------|
| `products` | Product catalog with localized fields |
| `solutions` | Solutions catalog |
| `services` | Service offerings |
| `projects` | Project portfolio |
| `clients` | Client logos and info |
| `news` | News articles |
| `testimonials` | Client testimonials |
| `stats` | Homepage statistics |
| `site_settings` | Key-value store for site config |
| `media_items` | Media library entries |
| `admin_profiles` | Admin authorization (links to auth.users) |

All content tables use JSONB columns for localized content (`{ar: "", en: ""}`) and support `draft`/`published`/`archived` status.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Troubleshooting

### Port already in use

```bash
npm run dev -- -p 3001
```

### Supabase connection issues

- Verify your `.env.local` values are correct
- Ensure your Supabase project is running
- Check that migrations have been applied (tables exist)

### Build errors

```bash
rm -rf .next
npm run build
```
