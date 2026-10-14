'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchNewsBySlug, fetchNews } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ArticleJsonLd } from '@/components/seo/structured-data';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Locale, LocalizedString, NewsArticle } from '@/types';

export function NewsArticleDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const prefix = `/${locale}`;
  const { getText } = useSiteContent(locale);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [otherArticles, setOtherArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchNewsBySlug(slug), fetchNews()]).then(([fetched, fetchedNews]) => {
      if (!fetched) {
        setLoading(false);
        return;
      }

      setArticle(fetched);
      setOtherArticles(fetchedNews.filter((n) => n.id !== fetched.id && n.status === 'published').slice(0, 3));

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

  if (!article) {
    notFound();
  }

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {localized(article.category, locale)}
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white text-balance">
              {localized(article.title, locale)}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.author}
              </span>
            </div>
          </div>
        </div>
      </section>

      <ArticleJsonLd
        title={localized(article.title, locale)}
        description={localized(article.excerpt, locale)}
        datePublished={article.date}
        author={article.author}
        locale={locale}
      />

      <section className="section-spacing bg-background">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {localized(article.excerpt, locale)}
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  {localized(article.content, locale)}
                </p>
              </div>

              {article.detailedContent && (article.detailedContent[locale] || article.detailedContent.en) && (
                <div className="mt-6 prose prose-lg max-w-none">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                    {localized(article.detailedContent, locale)}
                  </p>
                </div>
              )}

              {article.gallery && article.gallery.length > 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {article.gallery.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-border aspect-video">
                      <img src={img} alt={`${localized(article.title, locale)} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {otherArticles.length > 0 && (
        <section className="py-16 md:py-20 bg-surface border-t border-border">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {getText('detail_other_articles', { ar: 'مقالات أخرى', en: 'Other Articles' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`${prefix}/news/${art.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {localized(art.category, locale)}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {localized(art.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {localized(art.excerpt, locale)}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {t('common.readMore', locale)}
                    {locale === 'ar' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
