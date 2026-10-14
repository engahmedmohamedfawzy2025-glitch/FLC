'use client';

import { AdminCard, AdminPageHeader, AdminButton } from '@/components/admin/ui';
import { LocalizedFields, inputCls, useCrud } from '@/components/admin/crud-helpers';
import { Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchSiteContentList, updateSiteContent } from '@/lib/content';
import type { LocalizedString } from '@/types';

interface ContentItem {
  id: string;
  key: string;
  value: LocalizedString;
  category: string;
  label: string;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  hero: 'Hero Section',
  about: 'About Page',
  contact: 'Contact Page',
  detail_headings: 'Detail Page Headings',
  general: 'General',
};

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('hero');
  const [edits, setEdits] = useState<Record<string, LocalizedString>>({});

  useEffect(() => {
    fetchSiteContentList().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => i.category === activeCategory);

  const updateField = (key: string, value: LocalizedString) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  const saveItem = async (key: string) => {
    setSavingKey(key);
    await updateSiteContent(key, edits[key] || items.find((i) => i.key === key)!.value);
    setSavingKey(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Site Content" description="Edit all text that appears on your public pages" />

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item) => {
          const value = edits[item.key] || item.value;
          return (
            <AdminCard key={item.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{item.key}</p>
                </div>
                <AdminButton
                  onClick={() => saveItem(item.key)}
                  disabled={savingKey === item.key}
                  variant="secondary"
                  size="sm"
                >
                  {savingKey === item.key ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save
                </AdminButton>
              </div>
              <LocalizedFields
                label="Text"
                value={value}
                onChange={(v) => updateField(item.key, v)}
                textarea={value.ar?.length > 100 || value.en?.length > 100}
                rows={value.ar?.length > 100 ? 4 : 1}
              />
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
