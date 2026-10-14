'use client';

import { AdminCard, AdminPageHeader, AdminButton, HelpNote } from '@/components/admin/ui';
import { siteConfig } from '@/config/site.config';
import { fetchSiteSettings, saveSetting } from '@/lib/content';
import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import type { FeatureFlags } from '@/types';

export default function AdminSettingsPage() {
  const [features, setFeatures] = useState<FeatureFlags>(siteConfig.features);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      if (settings?.features) {
        setFeatures({ ...siteConfig.features, ...(settings.features as Partial<FeatureFlags>) });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error } = await saveSetting('features', features);
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const featureLabels: Record<string, { en: string; ar: string }> = {
    clients: { en: 'Clients Section', ar: 'قسم العملاء' },
    testimonials: { en: 'Testimonials', ar: 'آراء العملاء' },
    projects: { en: 'Projects', ar: 'المشاريع' },
    news: { en: 'News', ar: 'الأخبار' },
    services: { en: 'Services', ar: 'الخدمات' },
    products: { en: 'Products', ar: 'المنتجات' },
    solutions: { en: 'Solutions', ar: 'الحلول' },
    whatsapp: { en: 'WhatsApp Chat', ar: 'واتساب' },
    darkMode: { en: 'Dark Mode', ar: 'الوضع الليلي' },
  };

  return (
    <div>
      <AdminPageHeader
        title="System Settings"
        description="Feature flags and system configuration"
        action={
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Changes'}
          </AdminButton>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div className="space-y-6">
        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Feature Flags</h2>
          <p className="text-sm text-muted-foreground mb-4">Enable or disable features without deleting code</p>
          <HelpNote>You can enable or disable any section of the site without deleting code.</HelpNote>
          <div className="mt-4 space-y-3">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{featureLabels[key]?.en || key}</div>
                  <div className="text-xs text-muted-foreground" dir="rtl">{featureLabels[key]?.ar}</div>
                </div>
                <button
                  onClick={() => setFeatures({ ...features, [key]: !value })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}
                  aria-label={key}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? 'start-5' : 'start-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Locale Settings</h2>
          <p className="text-sm text-muted-foreground mb-4">Supported languages</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-2">
              <span className="text-sm font-medium">العربية (Arabic)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-2">
              <span className="text-sm font-medium">English</span>
              <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">Active</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
