'use client';

import { AdminCard, AdminPageHeader, AdminButton, HelpNote } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, inputCls, useCrud } from '@/components/admin/crud-helpers';
import { Plus, Search, Pencil, Trash2, Loader2, GripVertical, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { fetchNavigationItems, createNavigationItem, updateNavigationItem, deleteNavigationItem } from '@/lib/content';
import type { NavigationItemDB, LocalizedString } from '@/types';

const empty: Partial<NavigationItemDB> = {
  label: { ar: '', en: '' }, href: '', parentId: null, icon: '',
  enabled: true, sortOrder: 0, isExternal: false,
};

const COMMON_ICONS = [
  'Home', 'Info', 'Cloud', 'ShieldCheck', 'BrainCircuit', 'Server', 'Database',
  'Cpu', 'Network', 'Lock', 'Smartphone', 'Laptop', 'Workflow', 'Boxes',
  'Package', 'Layers', 'Wrench', 'Settings', 'CloudCog', 'Terminal',
  'Zap', 'Rocket', 'TrendingUp', 'BarChart3', 'Users', 'Building2',
  'Briefcase', 'FolderKanban', 'Newspaper', 'Phone', 'Mail', 'MapPin',
  'Globe', 'Github', 'Linkedin', 'Twitter', 'Facebook', 'Youtube',
  'Star', 'Award', 'CheckCircle2', 'Target', 'Eye', 'Activity',
];

export default function AdminNavigationPage() {
  const [search, setSearch] = useState('');
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchNavigationItems, createNavigationItem, updateNavigationItem, deleteNavigationItem
  );

  const filtered = items.filter((n) =>
    (n.label.en || '').toLowerCase().includes(search.toLowerCase()) || (n.label.ar || '').includes(search)
  );

  const parents = items.filter((n) => !n.parentId);
  const childrenByParent = items.reduce<Record<string, NavigationItemDB[]>>((acc, n) => {
    if (n.parentId) {
      (acc[n.parentId] = acc[n.parentId] || []).push(n);
    }
    return acc;
  }, {});

  const set = (field: keyof NavigationItemDB, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  const toggleEnabled = async (item: NavigationItemDB) => {
    await updateNavigationItem(item.id, { enabled: !item.enabled });
    window.location.reload();
  };

  return (
    <div>
      <AdminPageHeader title="Navigation" description="Manage website header menu items — changes appear on the live site after saving"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Menu Item</AdminButton>} />

      <HelpNote>
        The navigation menu is the bar at the top of every page. Top-level items show as main buttons.
        Items with a parent appear as a dropdown under the parent. Use the Enabled toggle to show/hide items without deleting them.
      </HelpNote>

      <div className="mt-4 mb-4 relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu items..."
          className="w-full rounded-lg border border-input bg-background ps-10 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No navigation items found. Click "Add Menu Item" to create one.</div>
        ) : (
          <div className="divide-y divide-border">
            {parents.filter((p) => !search || (p.label.en || '').toLowerCase().includes(search.toLowerCase())).map((parent) => (
              <div key={parent.id}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      {parent.label.en || 'Untitled'}
                      {parent.isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{parent.label.ar || ''} — {parent.href}</div>
                  </div>
                  <button
                    onClick={() => toggleEnabled(parent)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${parent.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    title={parent.enabled ? 'Click to hide from website' : 'Click to show on website'}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${parent.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  <span className="text-xs text-muted-foreground w-12 text-center">#{parent.sortOrder}</span>
                  <button onClick={() => setEditing(parent)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(parent.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                {(childrenByParent[parent.id] || []).map((child) => (
                  <div key={child.id} className="flex items-center gap-3 px-8 py-2.5 hover:bg-muted/20 border-t border-border/50">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground flex items-center gap-2">
                        {child.label.en || 'Untitled'}
                        {child.isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{child.label.ar || ''} — {child.href}</div>
                    </div>
                    <button
                      onClick={() => toggleEnabled(child)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${child.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      title={child.enabled ? 'Click to hide from website' : 'Click to show on website'}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${child.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                    <button onClick={() => setEditing(child)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(child.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {editing && (
        <EditModalShell title={editing.id ? 'Edit Menu Item' : 'Add Menu Item'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <LocalizedFields label="Label" value={editing.label} onChange={(v) => set('label', v)} />
          <HelpNote>The label is the text shown on the menu button. Fill both Arabic and English.</HelpNote>

          <Field label="URL / Link" required>
            <input value={editing.href || ''} onChange={(e) => set('href', e.target.value)} className={inputCls} placeholder="/about or https://external-site.com" />
          </Field>
          <HelpNote>
            Internal links start with / (e.g. /about, /products, /solutions/cloud-solutions).
            Check "External link" below if the URL goes to another website.
          </HelpNote>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Parent Menu (optional)">
              <select value={editing.parentId || ''} onChange={(e) => set('parentId', e.target.value || null)} className={inputCls}>
                <option value="">None (top-level menu button)</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>{p.label.en || p.label.ar || p.id}</option>
                ))}
              </select>
            </Field>
            <Field label="Display Order">
              <input type="number" value={editing.sortOrder || 0} onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)} className={inputCls} />
            </Field>
          </div>
          <HelpNote>Lower numbers appear first. Use 0 for the first position, 1 for the second, etc.</HelpNote>

          <IconPicker value={editing.icon || ''} onChange={(v) => set('icon', v)} />

          <div className="flex items-end gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={editing.enabled ?? true} onChange={(e) => set('enabled', e.target.checked)} className="rounded" /> Enabled (visible on website)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={editing.isExternal ?? false} onChange={(e) => set('isExternal', e.target.checked)} className="rounded" /> External link (opens another website)
            </label>
          </div>
        </EditModalShell>
      )}
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div>
      <Field label="Icon (optional)">
        <div className="flex items-center gap-2">
          <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder="e.g. Cloud, ShieldCheck, Server" />
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            {showPicker ? 'Hide' : 'Browse'}
          </button>
        </div>
      </Field>
      <HelpNote>
        Icons appear in dropdown menus next to child items. Type a Lucide icon name or click Browse to pick from common icons.
        Leave empty if you don't need an icon.
      </HelpNote>
      {showPicker && (
        <div className="mt-3 rounded-lg border border-border bg-card p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            <button
              type="button"
              onClick={() => { onChange(''); setShowPicker(false); }}
              className={`rounded-lg p-2 text-xs flex items-center justify-center border transition-colors ${!value ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
            >
              None
            </button>
            {COMMON_ICONS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(name); setShowPicker(false); }}
                className={`rounded-lg p-2 text-xs flex flex-col items-center gap-1 border transition-colors ${value === name ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}
                title={name}
              >
                <IconPreview name={name} />
                <span className="truncate max-w-full">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IconPreview({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return <span className="h-4 w-4" />;
  return <Icon className="h-4 w-4" />;
}
