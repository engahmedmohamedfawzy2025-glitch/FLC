# Admin Credentials

## How Admin Login Works

The admin panel uses Supabase Auth (email/password). Credentials are stored securely in the Supabase Auth system — they are NOT in any source file, environment variable, or JSON file.

## Login Details

- **URL**: `/admin/login`
- **Email**: `admin@technova.local`
- **Password**: `admin123`

## Security

- The password is hashed and stored in Supabase's `auth.users` table.
- No one can see the password by reading the codebase.
- Row Level Security (RLS) ensures only authenticated admins can modify content.
- Visitors can only read published content — they cannot create, edit, or delete anything.

## Changing the Password

To change the admin password:

1. Go to your Supabase Dashboard.
2. Navigate to **Authentication** > **Users**.
3. Find `admin@technova.local`.
4. Click the user and select **"Send password reset"** or update the password directly.

## Changing the Email

To use a different admin email:

1. Go to Supabase Dashboard > **Authentication** > **Users**.
2. Create a new user with your desired email and password.
3. The new user can immediately log in to the admin panel.
