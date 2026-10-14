'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProjects } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { ProjectCard } from '@/components/lists/project-card';
import type { Locale, Project } from '@/types';

export function ProjectsList({ locale }: { locale: Locale }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data.filter((p) => p.status === 'published'));
    }).catch(() => setProjects([]));
  }, []);

  const categories = Array.from(new Set(projects.map((p) => localized(p.category, locale))));

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => localized(p.category, locale) === activeCategory);

  return (
    <section className="section-spacing bg-background">
      <div className="container-site">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {t('common.all', locale)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj, i) => (
            <ScrollReveal key={proj.id} delay={i * 80}>
              <ProjectCard project={proj} locale={locale} showSlider />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {t('common.loading', locale)}
          </div>
        )}
      </div>
    </section>
  );
}
