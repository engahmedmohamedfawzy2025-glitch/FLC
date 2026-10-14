'use client';

import { AdminCard, AdminPageHeader, AdminButton } from '@/components/admin/ui';
import { EditModalShell, Field, LocalizedFields, inputCls, useCrud } from '@/components/admin/crud-helpers';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { fetchStats, createStat, updateStat, deleteStat } from '@/lib/content';
import type { Stat } from '@/types';

const empty: Partial<Stat> = {
  label: { ar: '', en: '' }, value: '', suffix: '', icon: '', order: 0,
};

export default function AdminStatsPage() {
  const { items, loading, editing, setEditing, saving, error, save, remove } = useCrud(
    fetchStats, createStat, updateStat, deleteStat
  );

  const set = (field: keyof Stat, value: unknown) => editing && setEditing({ ...editing, [field]: value });

  return (
    <div>
      <AdminPageHeader title="Statistics" description="Manage homepage statistics counters"
        action={<AdminButton onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add Statistic</AdminButton>} />

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No statistics found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Label</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Value</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Icon</th>
                  <th className="text-start text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Order</th>
                  <th className="text-end text-xs font-semibold text-muted-foreground uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">{s.label.en || 'Untitled'}</div>
                      <div className="text-xs text-muted-foreground">{s.label.ar || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-foreground">{s.value}{s.suffix}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s.icon || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
        <EditModalShell title={editing.id ? 'Edit Statistic' : 'Add Statistic'} onClose={() => setEditing(null)} onSave={save} saving={saving} error={error}>
          <LocalizedFields label="Label" value={editing.label} onChange={(v) => set('label', v)} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Value" required><input value={editing.value || ''} onChange={(e) => set('value', e.target.value)} className={inputCls} placeholder="500" /></Field>
            <Field label="Suffix"><input value={editing.suffix || ''} onChange={(e) => set('suffix', e.target.value)} className={inputCls} placeholder="+" /></Field>
            <Field label="Icon (Lucide)"><input value={editing.icon || ''} onChange={(e) => set('icon', e.target.value)} className={inputCls} placeholder="Briefcase" /></Field>
          </div>
          <Field label="Display Order"><input type="number" value={editing.order || 0} onChange={(e) => set('order', parseInt(e.target.value) || 0)} className={inputCls} /></Field>
        </EditModalShell>
      )}
    </div>
  );
}
