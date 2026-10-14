'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchNews } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Locale, NewsArticle } from '@/types';

export function NewsList({ locale }: { locale: Locale }) {
  const prefix = `/${locale}`;
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchNews().then((data) => {
      setArticles(data.filter((n) => n.status === 'published').sort((a, b) => b.date.localeCompare(a.date)));
    }).catch(() => setArticles([]));
  }, []);

  const categories = Array.from(new Set(articles.map((a) => localized(a.category, locale))));

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => localized(a.category, locale) === activeCategory);

  return (
    <section className="section-spacing bg-background">
      <div className="container-site">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
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
        )}

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <ScrollReveal key={article.id} delay={i * 80}>
              <Link
                href={`${prefix}/news/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
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
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-accent/8 to-secondary/20">
                      <span className="text-5xl font-bold text-primary/20">
                        {localized(article.title, locale).charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Category badge */}
                  <span className="absolute top-3 start-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                    {localized(article.category, locale)}
                  </span>
                  {/* Featured star */}
                  {article.featured && (
                    <span className="absolute top-3 end-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      ★
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span dir="ltr">{article.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {localized(article.title, locale)}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {localized(article.excerpt, locale)}
                  </p>

                  {/* Read more */}
                  <div className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                    {t('common.readMore', locale)}
                    {locale === 'ar'
                      ? <ArrowRight className="h-4 w-4 rtl-flip" />
                      : <ArrowRight className="h-4 w-4" />}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            {t('common.loading', locale)}
          </div>
        )}
      </div>
    </section>
  );
}
