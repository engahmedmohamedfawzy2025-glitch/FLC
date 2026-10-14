'use client';

import { AdminCard, AdminPageHeader, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, inputCls, useCrud } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchClients, createClient, updateClient, deleteClient } from '@/lib/content';
import type { Client, LocalizedString } from '@/types';

const empty: Partial<Client> = {
  name: '', logo: '', website: '', description: { ar: '', en: '' },
  category: '', order: 0,
};

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchClients, createClient, updateClient, deleteClient
  );

  const filtered = items.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const set = (field: keyof Client, value: unknown) => editing && setEditing({ ...editing, [field]: value });
  const setLoc = (lang: 'ar' | 'en', value: string) => {
    const current = editing?.description || { ar: '', en: '' };
    set('description', { ...current, [lang]: value } as LocalizedString);
  };

  return (
    <div>
      <AdminPageHeader title="Clients" description="Manage your client logos and info"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Client</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Client</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Category</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Order</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.logo && <img src={c.logo} alt={c.name} className="h-8 w-12 rounded object-cover" />}
                        <div className="text-sm font-medium text-foreground">{c.name || 'Untitled'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.category || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {editing && (
        <EditModalShell title={editing.id ? 'Edit Client' : 'Add Client'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" required><input value={editing.name || ''} onChange={(e) => set('name', e.target.value)} className={inputCls} /></Field>
            <Field label="Category"><input value={editing.category || ''} onChange={(e) => set('category', e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Logo URL"><input value={editing.logo || ''} onChange={(e) => set('logo', e.target.value)} className={inputCls} /></Field>
            <Field label="Website"><input value={editing.website || ''} onChange={(e) => set('website', e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Description (Arabic)"><textarea value={editing.description?.ar || ''} onChange={(e) => setLoc('ar', e.target.value)} className={inputCls} rows={2} dir="rtl" /></Field>
            <Field label="Description (English)"><textarea value={editing.description?.en || ''} onChange={(e) => setLoc('en', e.target.value)} className={inputCls} rows={2} /></Field>
          </div>
          <Field label="Order"><input type="number" value={editing.order || 0} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
        </EditModalShell>
      )}
    </div>
  );
}
