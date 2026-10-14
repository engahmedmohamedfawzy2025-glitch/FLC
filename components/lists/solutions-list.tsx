'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchSolutions } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { SolutionCard } from '@/components/lists/solution-card';
import type { Locale, Solution } from '@/types';

export function SolutionsList({ locale }: { locale: Locale }) {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    fetchSolutions().then((data) => {
      setSolutions(data.filter((s) => s.status === 'published'));
    }).catch(() => setSolutions([]));
  }, []);

  const categories = Array.from(new Set(solutions.map((s) => localized(s.applications[0] || { ar: '', en: '' }, locale)).filter(Boolean)));

  return (
    <section className="section-spacing bg-background">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, i) => (
            <ScrollReveal key={sol.id} delay={i * 80}>
              <SolutionCard solution={sol} locale={locale} showSlider />
            </ScrollReveal>
          ))}
        </div>

        {solutions.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {locale === 'ar' ? 'لا توجد حلول متاحة' : 'No solutions available'}
          </div>
        )}
      </div>
    </section>
  );
}
