'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProductBySlug, fetchSolutions } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Locale, LocalizedString, Product, Solution } from '@/types';

export function ProductDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const prefix = `/${locale}`;
  const { getText } = useSiteContent(locale);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedSolutions, setRelatedSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProductBySlug(slug), fetchSolutions()]).then(([fetched, fetchedSolutions]) => {
      if (!fetched) {
        setLoading(false);
        return;
      }

      setProduct(fetched);
      setRelatedSolutions(fetchedSolutions.filter((s) => fetched.relatedSolutions.includes(s.id)));

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

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {localized(product.category, locale)}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white text-balance">
              {localized(product.title, locale)}
            </h1>
            <p className="mt-4 text-lg text-white/70">
              {localized(product.shortDescription, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {getText('detail_overview', { ar: 'نظرة عامة', en: 'Overview' })}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {localized(product.description, locale)}
                </p>

                {product.gallery && product.gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`${localized(product.title, locale)} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {product.detailedContent && (product.detailedContent[locale] || product.detailedContent.en) && (
                  <div className="mt-8 prose prose-lg max-w-none">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {localized(product.detailedContent, locale)}
                    </p>
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                  {getText('detail_features', { ar: 'المميزات', en: 'Features' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((f, i) => (
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
                  {getText('detail_specifications', { ar: 'المواصفات', en: 'Specifications' })}
                </h3>
                <dl className="space-y-3">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between gap-4 text-sm border-b border-border pb-3 last:border-0">
                      <dt className="text-muted-foreground">{localized(spec.key, locale)}</dt>
                      <dd className="font-semibold text-foreground text-end">{localized(spec.value, locale)}</dd>
                    </div>
                  ))}
                </dl>
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

      {relatedSolutions.length > 0 && (
        <section className="py-16 md:py-20 bg-surface">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {getText('detail_related_solutions', { ar: 'حلول ذات صلة', en: 'Related Solutions' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSolutions.map((sol) => (
                <Link
                  key={sol.id}
                  href={`${prefix}/solutions/${sol.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {localized(sol.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {localized(sol.shortDescription, locale)}
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
