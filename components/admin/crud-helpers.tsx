'use client';

import { X, Loader2, Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LocalizedString } from '@/types';

export const inputCls = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

export function Field({ label, required, helpText, children }: { label: string; required?: boolean; helpText?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}{required && <span className="text-destructive ms-1">*</span>}
      </label>
      {children}
      {helpText && <p className="mt-1 text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}

export function LocalizedFields({
  label,
  value,
  onChange,
  textarea,
  rows = 2,
}: {
  label: string;
  value: LocalizedString | undefined;
  onChange: (v: LocalizedString) => void;
  textarea?: boolean;
  rows?: number;
}) {
  const current = value || { ar: '', en: '' };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label={`${label} (Arabic)`}>
        {textarea ? (
          <textarea value={current.ar} onChange={(e) => onChange({ ...current, ar: e.target.value })} className={inputCls} rows={rows} dir="rtl" />
        ) : (
          <input value={current.ar} onChange={(e) => onChange({ ...current, ar: e.target.value })} className={inputCls} dir="rtl" />
        )}
      </Field>
      <Field label={`${label} (English)`}>
        {textarea ? (
          <textarea value={current.en} onChange={(e) => onChange({ ...current, en: e.target.value })} className={inputCls} rows={rows} />
        ) : (
          <input value={current.en} onChange={(e) => onChange({ ...current, en: e.target.value })} className={inputCls} />
        )}
      </Field>
    </div>
  );
}

export function EditModalShell({
  title,
  onClose,
  onSave,
  saving,
  error,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border sticky bottom-0 bg-card">
          <button onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors border border-border bg-card text-foreground hover:bg-muted px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
          </button>
        </div>
        {error && <div className="px-5 pb-5 -mt-2"><div className="rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div></div>}
      </div>
    </div>
  );
}

export function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      <option value="draft">Draft (Hidden)</option>
      <option value="published">Published (Visible)</option>
      <option value="archived">Archived</option>
    </select>
  );
}

export function ImageSizeGuide({ preset }: { preset: string }) {
  const guides: Record<string, { dims: string; ratio: string; label: string }> = {
    product: { dims: '1200 x 1200px', ratio: '1:1 (Square)', label: 'Product images' },
    solution: { dims: '1600 x 900px', ratio: '16:9 (Landscape)', label: 'Solution images' },
    service: { dims: '1600 x 1000px', ratio: '16:10 (Landscape)', label: 'Service images' },
    project: { dims: '1600 x 900px', ratio: '16:9 (Landscape)', label: 'Project images' },
    news: { dims: '1200 x 675px', ratio: '16:9 (Landscape)', label: 'News images' },
    logo: { dims: '400 x 160px', ratio: '5:2', label: 'Logo images' },
    avatar: { dims: '200 x 200px', ratio: '1:1 (Square)', label: 'Avatar images' },
  };
  const g = guides[preset];
  if (!g) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
      <span>Recommended: <strong className="text-foreground">{g.dims}</strong> &middot; {g.ratio} &middot; JPG/PNG/WebP</span>
    </div>
  );
}

export function ImageGalleryField({
  images,
  onChange,
  preset,
  label = 'Image Gallery',
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
  preset: string;
  label?: string;
}) {
  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) onChange([...images, url]);
  };
  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };
  const editImage = (index: number) => {
    const url = prompt('Enter new image URL:', images[index]);
    if (url) {
      const updated = [...images];
      updated[index] = url;
      onChange(updated);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <button type="button" onClick={addImage} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add Image
        </button>
      </div>
      <div className="mb-2">
        <ImageSizeGuide preset={preset} />
      </div>
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No images yet. Click &quot;Add Image&quot; to add photos.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-lg overflow-hidden border border-border aspect-square">
              <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => editImage(i)} className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => removeImage(i)} className="p-1.5 rounded-lg bg-destructive/80 text-white hover:bg-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter...',
  dir,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-input bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(i)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
          dir={dir}
        />
      </div>
    </div>
  );
}

export function LocalizedTagInput({
  label,
  tags,
  onChange,
}: {
  label: string;
  tags: LocalizedString[];
  onChange: (tags: LocalizedString[]) => void;
}) {
  const arTags = tags.map((t) => t.ar || '');
  const enTags = tags.map((t) => t.en || '');

  const updateAr = (arValues: string[]) => {
    const maxLen = Math.max(arValues.length, enTags.length);
    const result: LocalizedString[] = [];
    for (let i = 0; i < maxLen; i++) {
      result.push({ ar: arValues[i] || '', en: enTags[i] || '' });
    }
    onChange(result.filter((t) => t.ar || t.en));
  };

  const updateEn = (enValues: string[]) => {
    const maxLen = Math.max(arTags.length, enValues.length);
    const result: LocalizedString[] = [];
    for (let i = 0; i < maxLen; i++) {
      result.push({ ar: arTags[i] || '', en: enValues[i] || '' });
    }
    onChange(result.filter((t) => t.ar || t.en));
  };

  return (
    <div className="space-y-3">
      <TagInput label={`${label} (Arabic)`} tags={arTags} onChange={updateAr} dir="rtl" placeholder="اكتب واضغط Enter..." />
      <TagInput label={`${label} (English)`} tags={enTags} onChange={updateEn} placeholder="Type and press Enter..." />
    </div>
  );
}

export function useCrud<T extends { id?: string }>(
  fetchFn: () => Promise<T[]>,
  createFn: (item: Partial<T>) => Promise<{ error: string | null }>,
  updateFn: (id: string, item: Partial<T>) => Promise<{ error: string | null }>,
  deleteFn: (id: string) => Promise<{ error: string | null }>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setItems([]);
    }
    setLoading(false);
  }, [fetchFn]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const { error } = editing.id
      ? await updateFn(editing.id!, editing)
      : await createFn(editing);
    if (error) {
      setError(error);
      setSaving(false);
    } else {
      setSaving(false);
      setEditing(null);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await deleteFn(id);
    if (error) {
      setError(error);
    } else {
      load();
    }
  };

  useEffect(() => { load(); }, [load]);

  return { items, loading, editing, setEditing, saving, error, load, save, remove, setError };
}
