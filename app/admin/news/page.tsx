'use client';

import { AdminCard, AdminPageHeader, StatusBadge, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, StatusSelect, inputCls, useCrud, ImageGalleryField } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchNews, createNews, updateNews, deleteNews } from '@/lib/content';
import type { NewsArticle } from '@/types';
import Link from 'next/link';

const empty: Partial<NewsArticle> = {
  slug: '', title: { ar: '', en: '' }, excerpt: { ar: '', en: '' },
  content: { ar: '', en: '' }, detailedContent: { ar: '', en: '' },
  featuredImage: '', gallery: [],
  author: '', date: new Date().toISOString().split('T')[0],
  category: { ar: '', en: '' }, featured: false, seo: {},
  status: 'draft',
};

export default function AdminNewsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchNews, createNews, updateNews, deleteNews
  );

  const filtered = items.filter((n) =>
    (n.title.en || '').toLowerCase().includes(search.toLowerCase()) || (n.title.ar || '').includes(search)
  );

  const set = (field: keyof NewsArticle, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="News" description="Manage your news articles"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Article</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..."
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
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Article</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Date</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Status</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">{n.title.en || 'Untitled'}</div>
                      <div className="text-xs text-muted-foreground">{n.title.ar || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{n.date || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/ar/news/${n.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-muted"><Eye className="h-4 w-4" /></Link>
                        <button onClick={() => setEditing(n)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(n.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
        <EditModalShell title={editing.id ? 'Edit Article' : 'Add Article'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Slug" required><input value={editing.slug || ''} onChange={(e) => set('slug', e.target.value)} className={inputCls} /></Field>
            <Field label="Date"><input type="date" value={editing.date || ''} onChange={(e) => set('date', e.target.value)} className={inputCls} /></Field>
            <Field label="Status"><StatusSelect value={editing.status || 'draft'} onChange={(v) => set('status', v)} /></Field>
          </div>
          <LocalizedFields label="Title" value={editing.title} onChange={(v) => set('title', v)} />
          <LocalizedFields label="Excerpt" value={editing.excerpt} onChange={(v) => set('excerpt', v)} textarea />
          <LocalizedFields label="Content" value={editing.content} onChange={(v) => set('content', v)} textarea rows={4} />
          <LocalizedFields label="Detailed Content" value={editing.detailedContent} onChange={(v) => set('detailedContent', v)} textarea rows={8} />
          <LocalizedFields label="Category" value={editing.category} onChange={(v) => set('category', v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Author"><input value={editing.author || ''} onChange={(e) => set('author', e.target.value)} className={inputCls} /></Field>
            <Field label="Featured Image URL" helpText="Recommended: 1200 x 675px (16:9)"><input value={editing.featuredImage || ''} onChange={(e) => set('featuredImage', e.target.value)} className={inputCls} /></Field>
          </div>
          <ImageGalleryField images={editing.gallery || []} onChange={(imgs) => set('gallery', imgs)} preset="news" label="Image Gallery" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={editing.featured || false} onChange={(e) => set('featured', e.target.checked)} className="rounded" /> Featured
          </label>
        </EditModalShell>
      )}
    </div>
  );
}
