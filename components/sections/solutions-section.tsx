'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchSolutions } from '@/lib/content';
import { ArrowRight } from 'lucide-react';
import { SolutionCard } from '@/components/lists/solution-card';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import type { Locale, LocalizedString, Solution } from '@/types';

export function SolutionsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const { dir } = useLocale();
  const prefix = `/${locale}`;
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    fetchSolutions().then((data) => {
      setSolutions(data.filter((s) => s.status === 'published'));
    }).catch(() => setSolutions([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('solutions.title', locale);
  const sectionSubtitle = t('solutions.subtitle', locale);

  return (
    <section className="section-spacing section-divider bg-surface">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionSubtitle}
          </p>
        </ScrollReveal>

        {solutions.length > 0 && (
          <HorizontalCarousel itemsCount={solutions.length} locale={locale}>
            {solutions.map((sol) => (
              <div key={sol.id} className="snap-start h-full shrink-0 w-[320px] sm:w-[360px]">
                <SolutionCard solution={sol} locale={locale} />
              </div>
            ))}
          </HorizontalCarousel>
        )}

        <div className="text-center mt-10">
          <Link
            href={`${prefix}/solutions`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {t('common.viewAll', locale)}
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
