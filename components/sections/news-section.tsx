'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchNews } from '@/lib/content';
import { ArrowRight, Calendar, User } from 'lucide-react';
import type { Locale, LocalizedString, NewsArticle } from '@/types';

export function NewsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const { dir } = useLocale();
  const prefix = `/${locale}`;
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchNews().then((data) => {
      setArticles(data.filter((n) => n.status === 'published').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3));
    }).catch(() => setArticles([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('news.title', locale);
  const sectionSubtitle = t('news.subtitle', locale);

  return (
    <section className="section-spacing section-divider bg-surface">
      <div className="container-site">
        <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
              {sectionTitle}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {sectionSubtitle}
            </p>
          </div>
          <Link
            href={`${prefix}/news`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors shrink-0"
          >
            {t('common.viewAll', locale)}
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ScrollReveal key={article.id} delay={i * 100}>
              <Link
                href={`${prefix}/news/${article.slug}`}
                className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                  {article.featuredImage ? (
                    <>
                      <img
                        src={article.featuredImage}
                        alt={localized(article.title, locale)}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/8 to-secondary/20 flex items-center justify-center">
                      <span className="text-5xl font-bold text-primary/20">
                        {localized(article.title, locale).charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                    {localized(article.category, locale)}
                  </span>
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {article.author}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {localized(article.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {localized(article.excerpt, locale)}
                  </p>

                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
