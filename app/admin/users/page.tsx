'use client';

import { AdminCard, AdminPageHeader, AdminButton, StatusBadge } from '@/components/admin/ui';
import { EditModalShell, Field, inputCls } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2, X, ShieldCheck, UserCog, KeyRound } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser, resetUserPassword } from '@/lib/content';
import { getAuthState, type AuthState } from '@/lib/auth';
import type { UserProfile, UserRole } from '@/types';

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<UserProfile> | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ authenticated: false, profile: null, loading: true });
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => { getAuthState().then(setAuthState); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((u) =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.fullName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const { error } = await updateUser(editing.id!, {
      fullName: editing.fullName,
      role: editing.role,
      isActive: editing.isActive,
    });
    if (error) { setError(error); setSaving(false); }
    else { setSaving(false); setEditing(null); load(); }
  };

  const handleDelete = async (id: string, userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    const { error } = await deleteUser(id, userId);
    if (error) { setError(error); return; }
    load();
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password (minimum 6 characters):');
    if (!newPassword) return;
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setResetting(userId);
    const { error } = await resetUserPassword(userId, newPassword);
    if (error) { setError(error); }
    setResetting(null);
  };

  if (authState.loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (authState.profile?.role !== 'super_admin') {
    return (
      <div>
        <AdminPageHeader title="Users" description="Manage admin users" />
        <AdminCard>
          <div className="py-12 text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Only Super Admins can manage users.</p>
          </div>
        </AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Users" description="Manage admin users and roles"
        action={<AdminButton onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add User</AdminButton>} />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">User</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Role</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Status</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Last Login</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 text-sm">
                          {(u.fullName || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{u.fullName || '—'}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${u.role === 'super_admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {u.role === 'super_admin' && <ShieldCheck className="h-3 w-3" />}
                        {u.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.isActive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleResetPassword(u.userId)} disabled={resetting === u.userId} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Reset password">
                          {resetting === u.userId ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setEditing(u)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {u.userId !== authState.profile?.userId && (
                          <button onClick={() => handleDelete(u.id, u.userId)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Edit User Modal */}
      {editing && (
        <EditModalShell title="Edit User" onClose={() => setEditing(null)} onSave={handleSave} saving={saving} error={error}>
          <Field label="Full Name"><input value={editing.fullName || ''} onChange={(e) => setEditing({ ...editing, fullName: e.target.value })} className={inputCls} /></Field>
          <Field label="Email"><input value={editing.email || ''} disabled className={inputCls + ' opacity-60'} /></Field>
          <Field label="Role">
            <select value={editing.role || 'admin'} onChange={(e) => setEditing({ ...editing, role: e.target.value as UserRole })} className={inputCls}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded" /> Active
          </label>
        </EditModalShell>
      )}

      {/* Create User Modal */}
      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password || !fullName) { setError('All fields are required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setSaving(true);
    const { error } = await createUser(email, password, fullName, role);
    if (error) { setError(error); setSaving(false); }
    else { setSaving(false); onCreated(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground">Add User</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Full Name" required><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} /></Field>
          <Field label="Email" required><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></Field>
          <Field label="Password" required><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} /></Field>
          <Field label="Confirm Password" required><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} /></Field>
          <Field label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={inputCls}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </Field>
          {error && <div className="rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border sticky bottom-0 bg-card">
          <button onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors border border-border bg-card text-foreground hover:bg-muted px-4 py-2 text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
