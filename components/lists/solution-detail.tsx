'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchSolutionBySlug, fetchProducts } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Locale, LocalizedString, Solution, Product } from '@/types';

export function SolutionDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const prefix = `/${locale}`;
  const { getText } = useSiteContent(locale);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSolutionBySlug(slug), fetchProducts()]).then(([fetched, fetchedProducts]) => {
      if (!fetched) {
        setLoading(false);
        return;
      }

      setSolution(fetched);
      setRelatedProducts(fetchedProducts.filter((p) => fetched.relatedProducts.includes(p.id)));

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

  if (!solution) {
    notFound();
  }

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[solution.icon || 'Lightbulb'];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-6">
              {IconComponent && <IconComponent className="h-8 w-8" />}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
              {localized(solution.title, locale)}
            </h1>
            <p className="mt-4 text-lg text-white/70">
              {localized(solution.shortDescription, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="section-spacing bg-background">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {getText('detail_overview', { ar: 'نظرة عامة', en: 'Overview' })}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {localized(solution.description, locale)}
                </p>

                {solution.gallery && solution.gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {solution.gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`${localized(solution.title, locale)} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {solution.detailedContent && (solution.detailedContent[locale] || solution.detailedContent.en) && (
                  <div className="mt-8 prose prose-lg max-w-none">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {localized(solution.detailedContent, locale)}
                    </p>
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                  {getText('detail_key_features', { ar: 'المميزات الرئيسية', en: 'Key Features' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {solution.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      {localized(f, locale)}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">
                  {getText('detail_benefits', { ar: 'الفوائد', en: 'Benefits' })}
                </h3>
                <ul className="space-y-3">
                  {solution.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {localized(b, locale)}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">
                    {getText('detail_applications', { ar: 'التطبيقات', en: 'Applications' })}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.applications.map((a, i) => (
                      <span key={i} className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {localized(a, locale)}
                      </span>
                    ))}
                  </div>
                </div>
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-surface">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {getText('detail_related_products', { ar: 'منتجات ذات صلة', en: 'Related Products' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`${prefix}/products/${prod.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {localized(prod.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {localized(prod.shortDescription, locale)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
