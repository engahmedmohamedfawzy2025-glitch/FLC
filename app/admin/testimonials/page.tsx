'use client';

import { AdminCard, AdminPageHeader, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, inputCls, useCrud } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import { useState } from 'react';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/content';
import type { Testimonial, LocalizedString } from '@/types';

const empty: Partial<Testimonial> = {
  author: '', role: { ar: '', en: '' }, company: '',
  content: { ar: '', en: '' }, avatar: '', rating: 5, order: 0,
};

export default function AdminTestimonialsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial
  );

  const filtered = items.filter((t) =>
    (t.author || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const set = (field: keyof Testimonial, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="Testimonials" description="Manage client testimonials"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Testimonial</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search testimonials..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No testimonials found</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-start gap-4 px-4 py-4 hover:bg-muted/30">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {(t.author || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{t.author || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">{t.role.en || ''} — {t.company || ''}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.content.en || t.content.ar || ''}</div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`h-3 w-3 ${i <= t.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {editing && (
        <EditModalShell title={editing.id ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <Field label="Author Name" required><input value={editing.author || ''} onChange={(e) => set('author', e.target.value)} className={inputCls} /></Field>
          <LocalizedFields label="Role / Position" value={editing.role} onChange={(v) => set('role', v)} />
          <Field label="Company"><input value={editing.company || ''} onChange={(e) => set('company', e.target.value)} className={inputCls} /></Field>
          <LocalizedFields label="Testimonial Content" value={editing.content} onChange={(v) => set('content', v)} textarea rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Avatar URL"><input value={editing.avatar || ''} onChange={(e) => set('avatar', e.target.value)} className={inputCls} /></Field>
            <Field label="Rating (1-5)">
              <select value={editing.rating || 5} onChange={(e) => set('rating', parseInt(e.target.value))} className={inputCls}>
                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} stars</option>)}
              </select>
            </Field>
          </div>
          <Field label="Display Order"><input type="number" value={editing.order || 0} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
        </EditModalShell>
      )}
    </div>
  );
}
