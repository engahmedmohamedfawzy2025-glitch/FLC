'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProjects } from '@/lib/content';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/lists/project-card';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import type { Locale, LocalizedString, Project } from '@/types';

export function ProjectsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const { dir } = useLocale();
  const prefix = `/${locale}`;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data.filter((p) => p.status === 'published'));
    }).catch(() => setProjects([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('projects.title', locale);
  const sectionSubtitle = t('projects.subtitle', locale);

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

        {projects.length > 0 && (
          <HorizontalCarousel itemsCount={projects.length} locale={locale}>
            {projects.map((proj) => (
              <div key={proj.id} className="snap-start h-full shrink-0 w-[320px] sm:w-[360px]">
                <ProjectCard project={proj} locale={locale} showSlider />
              </div>
            ))}
          </HorizontalCarousel>
        )}

        <div className="text-center mt-10">
          <Link
            href={`${prefix}/projects`}
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
