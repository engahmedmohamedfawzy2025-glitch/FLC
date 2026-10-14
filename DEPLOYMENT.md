# Deployment Guide — Vercel + GoDaddy

This guide explains how to deploy the TechNova CMS website to Vercel and connect a GoDaddy domain.

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- Your Supabase project URL and anon key
- A domain registered on [GoDaddy](https://godaddy.com)

---

## Step 1: Push Your Code to GitHub

Vercel deploys from a Git repository, so your code needs to be on GitHub first.

### If you don't have a repo yet:

1. Go to [github.com](https://github.com) and create a new repository
2. On your computer, in the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### If you already have a repo:

Just push your latest changes:

```bash
git add .
git commit -m "Production ready"
git push
```

---

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New** → **Project**
3. Select your repository from the list
4. Vercel auto-detects Next.js — you don't need to change any build settings

### Configure Environment Variables

Before clicking Deploy, expand the **Environment Variables** section and add:

| Name | Value | Where to find it |
|------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (long string) | Supabase Dashboard → Settings → API |

> **Important**: Only add variables that start with `NEXT_PUBLIC_`. These are safe for the browser. Never add the Supabase service role key to Vercel — it's a secret that bypasses all database security.

5. Click **Deploy**
6. Wait 2-5 minutes for the build to complete
7. Vercel gives you a temporary URL like `your-project.vercel.app` — your site is now live!

---

## Step 3: Connect Your GoDaddy Domain

### In Vercel:

1. Open your project on Vercel
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Type your domain (e.g., `yoursite.com`)
5. Click **Add**
6. Vercel shows you DNS records to add — keep this page open

### In GoDaddy:

1. Log in to [godaddy.com](https://dcc.godaddy.com)
2. Go to **My Products** → find your domain → click **DNS** (or **Manage DNS**)
3. You need to add or update these records:

#### A Record (for the root domain, e.g., `yoursite.com`)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | 600 |
| A | `@` | `76.76.21.21` | 600 |

> Vercel will show you the exact IP address — use what Vercel displays.

#### CNAME Record (for `www`)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `cname.vercel-dns.com` | 600 |

4. Save each record
5. Go back to Vercel — click **Verify** or **Refresh**
6. DNS propagation can take 5 minutes to 48 hours (usually under 30 minutes)

### Force HTTPS

Once the domain is connected:
1. In Vercel → Settings → Domains
2. Click your domain
3. Enable **Enforce HTTPS** — Vercel provides a free SSL certificate automatically

---

## Step 4: Verify Your Deployment

After DNS propagates:

1. Visit `https://yoursite.com` — you should see the Arabic homepage
2. Visit `https://yoursite.com/en` — English homepage
3. Visit `https://yoursite.com/admin` — admin login page
4. Log in with:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## Step 5: Set Up Supabase Auth for Production

Your Supabase project needs to allow your Vercel domain for auth redirects:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Under **Site URL**, add: `https://yoursite.com`
3. Under **Redirect URLs**, add:
   - `https://yoursite.com/**`
   - `https://your-project.vercel.app/**`

---

## Automatic Deployments

Once connected, every `git push` to your `main` branch triggers a new deployment on Vercel automatically. You don't need to do anything else — just push code and Vercel handles the rest.

### Preview Deployments

Vercel creates a preview deployment for every branch and pull request. Share the preview URL with your team to review changes before going live.

---

## Troubleshooting

### Build fails on Vercel

- Check that all environment variables are set correctly
- Look at the build logs in Vercel → your project → **Deployments** → click the failed one
- Common cause: missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Domain not working

- DNS propagation takes time — wait 30 minutes, then check again
- Use [dnschecker.org](https://dnschecker.org) to verify DNS is propagating
- Make sure GoDaddy records match exactly what Vercel showed you
- Remove any old A records or CNAME records that conflict

### Admin login not working

- Verify your Supabase project is accessible (not paused)
- Check that the `admin_profiles` migration was applied
- The admin user must have `is_admin = true` in the `admin_profiles` table

### Images not loading

- If using Supabase Storage, ensure the bucket is set to public
- Check that storage policies allow public read access

---

## Quick Reference

| Item | Value |
|------|-------|
| Hosting | Vercel |
| Database | Supabase |
| Domain registrar | GoDaddy |
| DNS propagation | 5 min – 48 hours |
| SSL certificate | Free, automatic via Vercel |
| Deploy trigger | `git push` to `main` |
| Admin URL | `https://yoursite.com/admin` |
| Admin username | `admin` |
| Admin password | `admin123` |
