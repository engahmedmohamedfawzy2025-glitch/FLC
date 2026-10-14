'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProjectBySlug } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { Check, MapPin, Building2, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Locale, LocalizedString, Project } from '@/types';

export function ProjectDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const prefix = `/${locale}`;
  const { getText } = useSiteContent(locale);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectBySlug(slug).then((fetched) => {
      setProject(fetched);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="section-spacing bg-background">
        <div className="container-site">
          <div className="animate-pulse text-muted-foreground">{t('common.loading', locale)}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {localized(project.category, locale)}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white text-balance">
              {localized(project.title, locale)}
            </h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {project.client}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {localized(project.location, locale)}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {getText('detail_project_details', { ar: 'تفاصيل المشروع', en: 'Project Details' })}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {localized(project.description, locale)}
                </p>

                {project.gallery && project.gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`${localized(project.title, locale)} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {project.detailedContent && (project.detailedContent[locale] || project.detailedContent.en) && (
                  <div className="mt-8 prose prose-lg max-w-none">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {localized(project.detailedContent, locale)}
                    </p>
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                  {getText('detail_scope_of_work', { ar: 'نطاق العمل', en: 'Scope of Work' })}
                </h3>
                <div className="space-y-3">
                  {project.scope.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      {localized(s, locale)}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">
                  {getText('detail_results', { ar: 'النتائج', en: 'Results' })}
                </h3>
                <ul className="space-y-3">
                  {project.results.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      {localized(r, locale)}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${prefix}/contact`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t('common.contactUs', locale)}
                  {locale === 'ar' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
