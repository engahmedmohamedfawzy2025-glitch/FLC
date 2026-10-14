'use client';

import { AdminCard, AdminPageHeader, StatusBadge, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, StatusSelect, inputCls, useCrud, ImageGalleryField } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchServices, createService, updateService, deleteService } from '@/lib/content';
import type { Service } from '@/types';

const empty: Partial<Service> = {
  slug: '', title: { ar: '', en: '' }, shortDescription: { ar: '', en: '' },
  description: { ar: '', en: '' }, detailedContent: { ar: '', en: '' },
  features: [], icon: '', image: '', gallery: [],
  order: 0, seo: {}, status: 'draft',
};

export default function AdminServicesPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchServices, createService, updateService, deleteService
  );

  const filtered = items.filter((s) =>
    (s.title.en || '').toLowerCase().includes(search.toLowerCase()) || (s.title.ar || '').includes(search)
  );

  const set = (field: keyof Service, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="Services" description="Manage your service offerings"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Service</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..."
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
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Service</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Order</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Status</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">{s.title.en || 'Untitled'}</div>
                      <div className="text-xs text-muted-foreground">{s.title.ar || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s.order}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
        <EditModalShell title={editing.id ? 'Edit Service' : 'Add Service'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Slug" required><input value={editing.slug || ''} onChange={(e) => set('slug', e.target.value)} className={inputCls} /></Field>
            <Field label="Status"><StatusSelect value={editing.status || 'draft'} onChange={(v) => set('status', v)} /></Field>
            <Field label="Order"><input type="number" value={editing.order || 0} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
          </div>
          <LocalizedFields label="Title" value={editing.title} onChange={(v) => set('title', v)} />
          <LocalizedFields label="Short Description" value={editing.shortDescription} onChange={(v) => set('shortDescription', v)} textarea />
          <LocalizedFields label="Description" value={editing.description} onChange={(v) => set('description', v)} textarea rows={4} />
          <LocalizedFields label="Detailed Content" value={editing.detailedContent} onChange={(v) => set('detailedContent', v)} textarea rows={8} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Icon (Lucide)"><input value={editing.icon || ''} onChange={(e) => set('icon', e.target.value)} className={inputCls} placeholder="Lightbulb" /></Field>
            <Field label="Cover Image URL"><input value={editing.image || ''} onChange={(e) => set('image', e.target.value)} className={inputCls} /></Field>
          </div>
          <ImageGalleryField images={editing.gallery || []} onChange={(imgs) => set('gallery', imgs)} preset="service" label="Image Gallery" />
        </EditModalShell>
      )}
    </div>
  );
}
