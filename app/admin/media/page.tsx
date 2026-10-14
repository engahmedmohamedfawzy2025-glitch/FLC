'use client';

import { AdminCard, AdminPageHeader, AdminButton } from '@/components/admin/ui';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Upload, Trash2, Copy, Search, X, Check } from 'lucide-react';
import { fetchMediaItems, uploadMediaFile, deleteMediaItem } from '@/lib/content';
import type { MediaItem } from '@/types';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMediaItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const { error } = await uploadMediaFile(file);
      if (error) { setError(error); break; }
    }
    setUploading(false);
    load();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    const { error } = await deleteMediaItem(item.id, item.url);
    if (error) { setError(error); return; }
    load();
  };

  const handleCopy = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = items.filter((m) => (m.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images and files"
        action={
          <AdminButton onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Files</>}
          </AdminButton>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div
        className="mb-4 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary'); }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary'); handleUpload(e.dataTransfer.files); }}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Click to browse or drag and drop files here</p>
        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP, GIF, SVG, PDF — max 10MB</p>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <AdminCard>
          <div className="py-12 text-center text-muted-foreground text-sm">
            No media files yet. Upload files using the button above or by dragging them into the drop zone.
          </div>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <AdminCard key={item.id} className="p-3 group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                {item.format === 'pdf' ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-xs font-medium">PDF</span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopy(item)} className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30" title="Copy URL">
                    {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-2 rounded-lg bg-destructive/80 text-white hover:bg-destructive" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs font-medium text-foreground truncate" title={item.name}>{item.name}</div>
              <div className="text-xs text-muted-foreground">{(item.size / 1024).toFixed(0)} KB</div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
