'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchStats } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import type { Locale, Stat } from '@/types';

export function AboutStats({ locale }: { locale: Locale }) {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats(data);
    }).catch(() => setStats([]));
  }, []);

  return (
    <ScrollReveal delay={100}>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {stat.value}{stat.suffix}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {localized(stat.label, locale)}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
