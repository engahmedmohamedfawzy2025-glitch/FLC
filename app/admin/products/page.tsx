'use client';

import { AdminCard, AdminPageHeader, StatusBadge, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, StatusSelect, inputCls, useCrud, ImageGalleryField, LocalizedTagInput } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/content';
import type { Product } from '@/types';

const empty: Partial<Product> = {
  slug: '', title: { ar: '', en: '' }, shortDescription: { ar: '', en: '' },
  description: { ar: '', en: '' }, detailedContent: { ar: '', en: '' },
  category: { ar: '', en: '' }, features: [], specifications: [],
  images: [], gallery: [], documents: [], relatedSolutions: [], relatedProjects: [],
  seo: {}, status: 'draft', featured: false,
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchProducts, createProduct, updateProduct, deleteProduct
  );

  const filtered = items.filter((p) =>
    (p.title.en || '').toLowerCase().includes(search.toLowerCase()) || (p.title.ar || '').includes(search)
  );

  const set = (field: keyof Product, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="Products" description="Manage your product catalog"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Product</AdminButton>} />

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Product</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                          {(p.title.en || '?').charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{p.title.en || 'Untitled'}</div>
                          <div className="text-xs text-muted-foreground">{p.title.ar || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.category.en || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
        <EditModalShell title={editing.id ? 'Edit Product' : 'Add Product'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Slug" required><input value={editing.slug || ''} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="nova-cloud-platform" /></Field>
            <Field label="Status"><StatusSelect value={editing.status || 'draft'} onChange={(v) => set('status', v)} /></Field>
          </div>
          <LocalizedFields label="Title" value={editing.title} onChange={(v) => set('title', v)} />
          <LocalizedFields label="Category" value={editing.category} onChange={(v) => set('category', v)} />
          <LocalizedFields label="Short Description" value={editing.shortDescription} onChange={(v) => set('shortDescription', v)} textarea />
          <LocalizedFields label="Description" value={editing.description} onChange={(v) => set('description', v)} textarea rows={4} />
          <LocalizedFields label="Detailed Content" value={editing.detailedContent} onChange={(v) => set('detailedContent', v)} textarea rows={8} />
          <LocalizedTagInput label="Feature Tags" tags={editing.features || []} onChange={(tags) => set('features', tags)} />
          <ImageGalleryField images={editing.images || []} onChange={(imgs) => set('images', imgs)} preset="product" label="Main Images" />
          <ImageGalleryField images={editing.gallery || []} onChange={(imgs) => set('gallery', imgs)} preset="product" label="Additional Gallery" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={editing.featured || false} onChange={(e) => set('featured', e.target.checked)} className="rounded" /> Featured product
          </label>
        </EditModalShell>
      )}
    </div>
  );
}
