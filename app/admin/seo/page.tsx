'use client';

import { AdminCard, AdminPageHeader, AdminButton, AdminInput, AdminTextarea } from '@/components/admin/ui';
import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { fetchSeoSettings, saveSeoSetting } from '@/lib/content';
import { seoConfig } from '@/config/seo.config';
import type { LocalizedString } from '@/types';

export default function AdminSeoPage() {
  const [title, setTitle] = useState<LocalizedString>(seoConfig.title || { ar: '', en: '' });
  const [description, setDescription] = useState<LocalizedString>(seoConfig.description || { ar: '', en: '' });
  const [keywords, setKeywords] = useState<LocalizedString>(seoConfig.keywords || { ar: '', en: '' });
  const [ogImage, setOgImage] = useState(seoConfig.ogImage || '');
  const [robots, setRobots] = useState<string>(seoConfig.robots || 'index, follow');
  const [canonical, setCanonical] = useState(seoConfig.canonical || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeoSettings().then((s) => {
      const settings = s as Record<string, unknown>;
      if (settings.title) setTitle(settings.title as LocalizedString);
      if (settings.description) setDescription(settings.description as LocalizedString);
      if (settings.keywords) setKeywords(settings.keywords as LocalizedString);
      if (typeof settings.ogImage === 'string') setOgImage(settings.ogImage);
      if (typeof settings.robots === 'string') setRobots(settings.robots);
      if (typeof settings.canonical === 'string') setCanonical(settings.canonical);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const settings: Record<string, unknown> = { title, description, keywords, ogImage, robots, canonical };
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await saveSeoSetting(key, value);
      if (error) { setError(error); setSaving(false); return; }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO Settings"
        description="Manage global search engine optimization settings"
        action={
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Changes'}
          </AdminButton>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div className="space-y-6">
        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Site Title</h2>
          <p className="text-sm text-muted-foreground mb-4">Appears in browser tabs and search results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Arabic Title" value={title.ar} onChange={(v) => setTitle({ ...title, ar: v })} />
            <AdminInput label="English Title" value={title.en} onChange={(v) => setTitle({ ...title, en: v })} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Meta Description</h2>
          <p className="text-sm text-muted-foreground mb-4">Short description shown in search results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextarea label="Arabic Description" value={description.ar} onChange={(v) => setDescription({ ...description, ar: v })} rows={3} />
            <AdminTextarea label="English Description" value={description.en} onChange={(v) => setDescription({ ...description, en: v })} rows={3} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Keywords</h2>
          <p className="text-sm text-muted-foreground mb-4">Comma-separated keywords for search engines</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextarea label="Arabic Keywords" value={keywords.ar} onChange={(v) => setKeywords({ ...keywords, ar: v })} rows={2} />
            <AdminTextarea label="English Keywords" value={keywords.en} onChange={(v) => setKeywords({ ...keywords, en: v })} rows={2} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Open Graph & Robots</h2>
          <p className="text-sm text-muted-foreground mb-4">Social sharing and crawler settings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Open Graph Image URL" value={ogImage} onChange={setOgImage} placeholder="/og-image.jpg" />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Robots Directive</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, follow">No Index, Follow</option>
              </select>
            </div>
            <AdminInput label="Canonical URL" value={canonical} onChange={setCanonical} placeholder="https://yoursite.com" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
