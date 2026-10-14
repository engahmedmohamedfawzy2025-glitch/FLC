'use client';

import { AdminCard, AdminPageHeader, AdminButton, AdminInput, HelpNote } from '@/components/admin/ui';
import { useState, useEffect, useRef } from 'react';
import { Loader2, Check } from 'lucide-react';
import { fetchBranding, saveBranding, type BrandingData } from '@/lib/content';
import { themeConfig } from '@/config/theme.config';

export default function AdminBrandingPage() {
  const [data, setData] = useState<BrandingData>(themeConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranding().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error } = await saveBranding(data);
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      applyBrandingToDOM(data);
    }
    setSaving(false);
  };

  const setBrand = (key: keyof typeof data.branding, value: string) =>
    setData({ ...data, branding: { ...data.branding, [key]: value } });
  const setType = (key: keyof typeof data.typography, value: string) =>
    setData({ ...data, typography: { ...data.typography, [key]: value } });
  const setToken = (key: keyof typeof data.tokens, value: string) =>
    setData({ ...data, tokens: { ...data.tokens, [key]: value } });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Branding"
        description="Manage colors, typography, and design tokens — changes appear instantly on the live website after saving"
        action={
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Changes'}
          </AdminButton>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div className="space-y-6">
        {/* Live Preview */}
        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Live Preview</h2>
          <p className="text-sm text-muted-foreground mb-4">See how your colors affect the website layout. Each colored area is labeled with the setting it comes from.</p>
          <BrandingPreview data={data} />
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Color Palette</h2>
          <p className="text-sm text-muted-foreground mb-2">Primary brand colors used across the website</p>
          <HelpNote>Each color controls a specific part of the website. Check the preview above to see exactly where each one appears.</HelpNote>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[
              { key: 'primaryColor', label: 'Primary Color', desc: 'Buttons, links, highlights' },
              { key: 'secondaryColor', label: 'Secondary Color', desc: 'Footer, dark sections' },
              { key: 'accentColor', label: 'Accent Color', desc: 'Decorative accents, badges' },
              { key: 'backgroundColor', label: 'Background Color', desc: 'Page background' },
              { key: 'surfaceColor', label: 'Surface Color', desc: 'Cards, panels, inputs' },
              { key: 'textColor', label: 'Text Color', desc: 'Main body text' },
              { key: 'mutedColor', label: 'Muted Color', desc: 'Secondary text, captions' },
              { key: 'borderColor', label: 'Border Color', desc: 'Dividers, card outlines' },
              { key: 'successColor', label: 'Success Color', desc: 'Success messages, badges' },
              { key: 'warningColor', label: 'Warning Color', desc: 'Warning indicators' },
              { key: 'errorColor', label: 'Error Color', desc: 'Error messages, delete buttons' },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                <p className="text-xs text-muted-foreground mb-2">{desc}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.branding[key as keyof typeof data.branding] || '#000000'}
                    onChange={(e) => setBrand(key as keyof typeof data.branding, e.target.value)}
                    className="h-9 w-12 rounded border border-border cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={data.branding[key as keyof typeof data.branding] || ''}
                    onChange={(e) => setBrand(key as keyof typeof data.branding, e.target.value)}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Typography</h2>
          <p className="text-sm text-muted-foreground mb-2">Font family settings for different languages</p>
          <HelpNote>Use Google Fonts names (e.g. Tajawal, Inter, Cairo, Amiri). Arabic font applies to Arabic content, English font to English content.</HelpNote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <AdminInput label="Arabic Font" value={data.typography.arabicFont} onChange={(v) => setType('arabicFont', v)} helpText="Used for all Arabic content" />
            <AdminInput label="English Font" value={data.typography.englishFont} onChange={(v) => setType('englishFont', v)} helpText="Used for all English content" />
            <AdminInput label="Heading Font" value={data.typography.headingFont} onChange={(v) => setType('headingFont', v)} helpText="Used for titles and headings" />
            <AdminInput label="Body Font" value={data.typography.bodyFont} onChange={(v) => setType('bodyFont', v)} helpText="Used for paragraphs and body text" />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Design Tokens</h2>
          <p className="text-sm text-muted-foreground mb-2">Spacing, radius, and layout measurements</p>
          <HelpNote>Values should include units (e.g. 8px, 12px, 1280px). Shadow intensity controls the depth of shadows on cards and panels.</HelpNote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <AdminInput label="Border Radius" value={data.tokens.borderRadius} onChange={(v) => setToken('borderRadius', v)} helpText="General corner roundness (e.g. 8px)" />
            <AdminInput label="Button Radius" value={data.tokens.buttonRadius} onChange={(v) => setToken('buttonRadius', v)} helpText="Button corner roundness (e.g. 8px)" />
            <AdminInput label="Card Radius" value={data.tokens.cardRadius} onChange={(v) => setToken('cardRadius', v)} helpText="Card corner roundness (e.g. 12px)" />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Shadow Intensity</label>
              <select
                value={data.tokens.shadowIntensity}
                onChange={(e) => setToken('shadowIntensity', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="none">None</option>
                <option value="subtle">Subtle</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </select>
            </div>
            <AdminInput label="Container Width" value={data.tokens.containerWidth} onChange={(v) => setToken('containerWidth', v)} helpText="Max content width (e.g. 1280px)" />
            <AdminInput label="Section Spacing" value={data.tokens.sectionSpacing} onChange={(v) => setToken('sectionSpacing', v)} helpText="Vertical gap between sections (e.g. 96px)" />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function applyBrandingToDOM(data: BrandingData) {
  const root = document.documentElement;
  const { branding, tokens } = data;
  root.style.setProperty('--color-primary', branding.primaryColor);
  root.style.setProperty('--color-secondary', branding.secondaryColor);
  root.style.setProperty('--color-accent', branding.accentColor);
  root.style.setProperty('--color-background', branding.backgroundColor);
  root.style.setProperty('--color-surface', branding.surfaceColor);
  root.style.setProperty('--color-text', branding.textColor);
  root.style.setProperty('--color-muted', branding.mutedColor);
  root.style.setProperty('--color-border', branding.borderColor);
  root.style.setProperty('--color-success', branding.successColor);
  root.style.setProperty('--color-warning', branding.warningColor);
  root.style.setProperty('--color-error', branding.errorColor);
  root.style.setProperty('--radius-card', tokens.cardRadius);
  root.style.setProperty('--radius-button', tokens.buttonRadius);
  root.style.setProperty('--radius-general', tokens.borderRadius);
  root.style.setProperty('--container-width', tokens.containerWidth);
  root.style.setProperty('--section-spacing', tokens.sectionSpacing);
}

function BrandingPreview({ data }: { data: BrandingData }) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      const el = previewRef.current;
      el.style.setProperty('--pv-primary', data.branding.primaryColor);
      el.style.setProperty('--pv-secondary', data.branding.secondaryColor);
      el.style.setProperty('--pv-accent', data.branding.accentColor);
      el.style.setProperty('--pv-bg', data.branding.backgroundColor);
      el.style.setProperty('--pv-surface', data.branding.surfaceColor);
      el.style.setProperty('--pv-text', data.branding.textColor);
      el.style.setProperty('--pv-muted', data.branding.mutedColor);
      el.style.setProperty('--pv-border', data.branding.borderColor);
      el.style.setProperty('--pv-success', data.branding.successColor);
      el.style.setProperty('--pv-warning', data.branding.warningColor);
      el.style.setProperty('--pv-error', data.branding.errorColor);
    }
  }, [data]);

  return (
    <div ref={previewRef} className="rounded-xl overflow-hidden border border-border" style={{ background: 'var(--pv-bg)' }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--pv-surface)', borderBottom: `1px solid var(--pv-border)` }}>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--pv-primary)', color: 'var(--pv-bg)' }}>T</div>
          <span className="text-sm font-bold" style={{ color: 'var(--pv-text)' }}>TechNova</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded" style={{ color: 'var(--pv-muted)' }}>Home</span>
          <span className="text-xs px-2 py-1 rounded" style={{ color: 'var(--pv-muted)' }}>About</span>
          <span className="text-xs px-3 py-1 rounded font-medium" style={{ background: 'var(--pv-primary)', color: 'var(--pv-bg)' }}>Contact</span>
        </div>
      </div>

      {/* Hero section */}
      <div className="px-6 py-8 text-center" style={{ borderBottom: `1px solid var(--pv-border)` }}>
        <div className="inline-block text-xs px-2 py-0.5 rounded-full mb-3" style={{ background: 'var(--pv-accent)', color: 'var(--pv-bg)' }}>Badge</div>
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--pv-text)' }}>Your Company Title</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--pv-muted)' }}>Short description text appears here</p>
        <div className="flex gap-2 justify-center">
          <span className="text-xs px-3 py-1.5 rounded font-medium" style={{ background: 'var(--pv-primary)', color: 'var(--pv-bg)' }}>Primary Button</span>
          <span className="text-xs px-3 py-1.5 rounded font-medium border" style={{ color: 'var(--pv-text)', borderColor: 'var(--pv-border)' }}>Secondary</span>
        </div>
      </div>

      {/* Cards row */}
      <div className="px-6 py-6 grid grid-cols-3 gap-3">
        {['Card 1', 'Card 2', 'Card 3'].map((label, i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: 'var(--pv-surface)', border: `1px solid var(--pv-border)` }}>
            <div className="h-8 w-8 rounded-lg mb-2 flex items-center justify-center text-xs font-bold" style={{ background: 'var(--pv-primary)', color: 'var(--pv-bg)' }}>{i + 1}</div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--pv-text)' }}>{label}</div>
            <div className="text-xs" style={{ color: 'var(--pv-muted)' }}>Body text sample</div>
          </div>
        ))}
      </div>

      {/* Status badges */}
      <div className="px-6 pb-4 flex gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--pv-success)', color: 'var(--pv-bg)' }}>Success</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--pv-warning)', color: 'var(--pv-bg)' }}>Warning</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--pv-error)', color: 'var(--pv-bg)' }}>Error</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--pv-muted)', color: 'var(--pv-bg)' }}>Muted</span>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--pv-secondary)', borderTop: `1px solid var(--pv-border)` }}>
        <span className="text-xs" style={{ color: 'var(--pv-muted)' }}>Footer text</span>
        <span className="text-xs" style={{ color: 'var(--pv-text)' }}>Links here</span>
      </div>
    </div>
  );
}
