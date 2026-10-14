'use client';

import { AdminCard, AdminPageHeader, StatusBadge, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, StatusSelect, inputCls, useCrud, ImageGalleryField, LocalizedTagInput } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchSolutions, createSolution, updateSolution, deleteSolution } from '@/lib/content';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { Solution } from '@/types';

const ACCENT = '#32E0C4';

const SUGGESTED_ICONS = ['Cloud', 'ShieldCheck', 'Cpu', 'Server', 'Database', 'Lock', 'Network', 'Layers', 'Zap', 'Code', 'GitBranch', 'Terminal', 'HardDrive', 'Wifi', 'Globe', 'Activity'];

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">Icon (Lucide)</label>
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          placeholder="Cloud"
        />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/95 shadow-md">
          <DynamicIcon name={value} className="h-5 w-5" style={{ color: ACCENT }} />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUGGESTED_ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              value === icon
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            }`}
            title={icon}
          >
            <DynamicIcon
              name={icon}
              className="h-4 w-4"
              style={{ color: value === icon ? ACCENT : undefined }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const empty: Partial<Solution> = {
  slug: '', title: { ar: '', en: '' }, shortDescription: { ar: '', en: '' },
  description: { ar: '', en: '' }, detailedContent: { ar: '', en: '' },
  features: [], benefits: [], applications: [],
  images: [], gallery: [], icon: '', relatedProducts: [], relatedProjects: [],
  seo: {}, status: 'draft', featured: false,
};

export default function AdminSolutionsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchSolutions, createSolution, updateSolution, deleteSolution
  );

  const filtered = items.filter((s) =>
    (s.title.en || '').toLowerCase().includes(search.toLowerCase()) || (s.title.ar || '').includes(search)
  );

  const set = (field: keyof Solution, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="Solutions" description="Manage your solutions catalog"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Solution</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search solutions..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No solutions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Solution</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Icon</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Status</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Featured</th>
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
                    <td className="px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90">
                        <DynamicIcon name={s.icon} className="h-4 w-4" style={{ color: ACCENT }} />
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-sm">{s.featured ? 'Yes' : 'No'}</td>
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
        <EditModalShell title={editing.id ? 'Edit Solution' : 'Add Solution'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Slug" required><input value={editing.slug || ''} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="cloud-solutions" /></Field>
            <Field label="Status"><StatusSelect value={editing.status || 'draft'} onChange={(v) => set('status', v)} /></Field>
          </div>
          <LocalizedFields label="Title" value={editing.title} onChange={(v) => set('title', v)} />
          <LocalizedFields label="Short Description" value={editing.shortDescription} onChange={(v) => set('shortDescription', v)} textarea />
          <LocalizedFields label="Description" value={editing.description} onChange={(v) => set('description', v)} textarea rows={4} />
          <LocalizedFields label="Detailed Content" value={editing.detailedContent} onChange={(v) => set('detailedContent', v)} textarea rows={8} />
          <IconPicker value={editing.icon || ''} onChange={(v) => set('icon', v)} />
          <LocalizedTagInput label="Feature Tags" tags={editing.features || []} onChange={(tags) => set('features', tags)} />
          <ImageGalleryField images={editing.images || []} onChange={(imgs) => set('images', imgs)} preset="solution" label="Main Images" />
          <ImageGalleryField images={editing.gallery || []} onChange={(imgs) => set('gallery', imgs)} preset="solution" label="Additional Gallery" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={editing.featured || false} onChange={(e) => set('featured', e.target.checked)} className="rounded" /> Featured
          </label>
        </EditModalShell>
      )}
    </div>
  );
}
