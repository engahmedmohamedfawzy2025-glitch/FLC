'use client';

import { supabase } from '@/lib/supabase';
import type { UserProfile, UserRole } from '@/types';

export interface AuthState {
  authenticated: boolean;
  profile: UserProfile | null;
  loading: boolean;
}

export async function getAuthState(): Promise<AuthState> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { authenticated: false, profile: null, loading: false };
  }

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select(`
      id,
      user_id,
      full_name,
      role,
      is_active,
      created_at,
      last_login_at
    `)
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    return { authenticated: false, profile: null, loading: false };
  }

  return {
    authenticated: true,
    profile: {
      id: profile.id,
      userId: profile.user_id,
      email: session.user.email || '',
      fullName: profile.full_name,
      role: profile.role as UserRole,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      lastLoginAt: profile.last_login_at,
    },
    loading: false,
  };
}

export async function login(email: string, password: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Authentication failed' };

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active, role')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!profile || !profile.is_active) {
      await supabase.auth.signOut();
      return { error: 'Your account has been disabled. Contact the administrator.' };
    }

    await supabase
      .from('admin_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', session.user.id);

    return { error: null };
  } catch {
    return { error: 'Login failed. Please try again.' };
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export function isAuthenticated(): boolean {
  return true; // Real check is async via getAuthState
}
