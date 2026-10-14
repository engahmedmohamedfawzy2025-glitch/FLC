'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/layout/locale-provider';
import { localized } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { Counter } from '@/components/layout/counter';
import { fetchStats } from '@/lib/content';
import * as Icons from 'lucide-react';
import type { Locale, Stat } from '@/types';

export function StatsSection({ locale }: { locale: Locale }) {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats([...data].sort((a, b) => a.order - b.order));
    }).catch(() => setStats([]));
  }, []);

  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground relative overflow-hidden border-y border-primary-foreground/10">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="container-site relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[stat.icon || 'Hash'];
            return (
              <ScrollReveal key={stat.id} delay={i * 100} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold">
                  <Counter value={parseInt(stat.value)} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-primary-foreground/70">
                  {localized(stat.label, locale)}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
