'use client';

import { AdminCard, AdminPageHeader, AdminButton, HelpNote } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, inputCls } from '@/components/admin/crud-helpers';
import {
  Plus, GripVertical, Eye, EyeOff, Pencil, Trash2, Loader2, Save, ArrowUp, ArrowDown, ExternalLink,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { fetchPageBySlug, updatePageSections } from '@/lib/content';
import { homepageSections } from '@/config/pages.config';
import type { PageSection, SectionType, LocalizedString, Locale } from '@/types';

const sectionLabels: Record<SectionType, { ar: string; en: string }> = {
  hero: { ar: 'البطل', en: 'Hero' },
  about: { ar: 'من نحن', en: 'About' },
  stats: { ar: 'الإحصائيات', en: 'Statistics' },
  solutions: { ar: 'الحلول', en: 'Solutions' },
  products: { ar: 'المنتجات', en: 'Products' },
  projects: { ar: 'المشاريع', en: 'Projects' },
  clients: { ar: 'العملاء', en: 'Clients' },
  services: { ar: 'الخدمات', en: 'Services' },
  testimonials: { ar: 'آراء العملاء', en: 'Testimonials' },
  news: { ar: 'الأخبار', en: 'News' },
  cta: { ar: 'دعوة للتواصل', en: 'Call to Action' },
  contact: { ar: 'تواصل معنا', en: 'Contact' },
  custom: { ar: 'محتوى مخصص', en: 'Custom Content' },
};

const sectionDescriptions: Record<SectionType, string> = {
  hero: 'Main banner with title, description, and call-to-action buttons',
  about: 'Company introduction with short description and key info',
  stats: 'Animated counter showing company achievements (clients, projects, years)',
  solutions: 'Grid of solution cards pulled from the Solutions database',
  products: 'Grid of product cards pulled from the Products database',
  projects: 'Showcase of projects pulled from the Projects database',
  clients: 'Logos of clients pulled from the Clients database',
  services: 'List of services pulled from the Services database',
  testimonials: 'Customer quotes pulled from the Testimonials database',
  news: 'Latest news articles pulled from the News database',
  cta: 'Call-to-action banner prompting visitors to contact you',
  contact: 'Contact form section',
  custom: 'Custom HTML or markdown content',
};

const availableSectionTypes: SectionType[] = [
  'hero', 'about', 'stats', 'solutions', 'products', 'projects',
  'clients', 'services', 'testimonials', 'news', 'cta',
];

export default function AdminPagesPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<Partial<PageSection> | null>(null);
  const [addingSection, setAddingSection] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await fetchPageBySlug('home');
      if (page && page.sections && page.sections.length > 0) {
        setSections(page.sections.sort((a, b) => a.order - b.order));
      } else {
        setSections([...homepageSections].sort((a, b) => a.order - b.order));
      }
    } catch {
      setSections([...homepageSections].sort((a, b) => a.order - b.order));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error } = await updatePageSections('home', sections);
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === id);
    if (index < 0) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const tmp = sorted[index].order;
    sorted[index].order = sorted[swapIndex].order;
    sorted[swapIndex].order = tmp;
    setSections([...sorted]);
  };

  const deleteSection = (id: string) => {
    if (!confirm('Are you sure you want to remove this section from the homepage?')) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const addSection = (type: SectionType) => {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.order)) : -1;
    const newSection: PageSection = {
      id: `sec-${type}-${Date.now()}`,
      type,
      enabled: true,
      order: maxOrder + 1,
    };
    setSections([...sections, newSection]);
    setAddingSection(false);
  };

  const saveEditedSection = () => {
    if (!editingSection) return;
    setSections(sections.map((s) => s.id === editingSection.id ? { ...s, ...editingSection } as PageSection : s));
    setEditingSection(null);
  };

  const set = (field: keyof PageSection, value: unknown) =>
    editingSection && setEditingSection({ ...editingSection, [field]: value });

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Manage your homepage layout — reorder sections, show/hide them, and add new ones"
        action={
          <AdminButton onClick={handleSave} disabled={saving || loading}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><Save className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Layout</>}
          </AdminButton>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <HelpNote>
        This page controls the order and visibility of sections on your homepage.
        Toggle the eye icon to show/hide a section without deleting it.
        Use the arrows to reorder sections. Click Save Layout when you're happy with the arrangement.
      </HelpNote>

      <div className="mt-4 space-y-6">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Homepage Builder</h2>
              <p className="text-sm text-muted-foreground">Reorder and toggle sections to customize your homepage</p>
            </div>
            <AdminButton variant="secondary" size="sm" onClick={() => setAddingSection(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Section
            </AdminButton>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : sorted.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">No sections. Click "Add Section" to build your homepage.</div>
          ) : (
            <div className="space-y-2">
              {sorted.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sorted.length - 1}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {sectionLabels[section.type]?.en || section.type}
                      </span>
                      <span className="text-xs text-muted-foreground">#{section.order}</span>
                      {!section.enabled && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Hidden</span>
                      )}
                    </div>
                    {section.title && section.title.en && (
                      <span className="text-xs text-muted-foreground">{section.title.en}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                      title={section.enabled ? 'Hide from website' : 'Show on website'}
                    >
                      {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Edit section title"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      title="Remove section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <HelpNote>
          <strong>Tip:</strong> Don't forget to click "Save Layout" after making changes.
          Your changes won't appear on the live website until you save.
        </HelpNote>
      </div>

      {/* Add Section Modal */}
      {addingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">Add a Section</h2>
              <button onClick={() => setAddingSection(false)} className="p-2 rounded-lg hover:bg-muted text-sm">Cancel</button>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Choose a section type to add to your homepage:</p>
              {availableSectionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="w-full text-start rounded-lg border border-border p-3 hover:border-primary/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{sectionLabels[type].en}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{sectionDescriptions[type]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <EditModalShell
          title={`Edit ${sectionLabels[editingSection.type as SectionType]?.en || 'Section'}`}
          onClose={() => setEditingSection(null)}
          onSave={saveEditedSection}
          saving={false}
          error={null}
        >
          <HelpNote>
            The section title is shown as a heading on the website. If you leave it empty, the default title will be used.
            Not all sections show a title (e.g. Hero and CTA sections don't display one).
          </HelpNote>
          <LocalizedFields
            label="Section Title"
            value={editingSection.title}
            onChange={(v) => set('title', v)}
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={editingSection.enabled ?? true}
                onChange={(e) => set('enabled', e.target.checked)}
                className="rounded"
              />
              Visible on website
            </label>
          </div>
        </EditModalShell>
      )}
    </div>
  );
}
