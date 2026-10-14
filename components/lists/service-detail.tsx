'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchServiceBySlug } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Locale, LocalizedString, Service } from '@/types';

export function ServiceDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const prefix = `/${locale}`;
  const { getText } = useSiteContent(locale);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceBySlug(slug).then((fetched) => {
      setService(fetched);
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

  if (!service) {
    notFound();
  }

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[service.icon || 'Settings'];

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container-site relative z-10">
          <div className="max-w-3xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-6">
              {IconComponent && <IconComponent className="h-8 w-8" />}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
              {localized(service.title, locale)}
            </h1>
            <p className="mt-4 text-lg text-white/70">
              {localized(service.shortDescription, locale)}
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
                  {localized(service.description, locale)}
                </p>

                {service.gallery && service.gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {service.gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`${localized(service.title, locale)} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {service.detailedContent && (service.detailedContent[locale] || service.detailedContent.en) && (
                  <div className="mt-8 prose prose-lg max-w-none">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {localized(service.detailedContent, locale)}
                    </p>
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                  {getText('detail_what_we_offer', { ar: 'ماذا نقدم', en: 'What We Offer' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f, i) => (
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
                <h3 className="font-bold text-foreground mb-2">
                  {getText('detail_need_service_title', { ar: 'هل تحتاج هذه الخدمة؟', en: 'Need This Service?' })}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {getText('detail_need_service_desc', { ar: 'تواصل معنا اليوم لمناقشة احتياجاتك.', en: 'Get in touch today to discuss your needs.' })}
                </p>
                <Link
                  href={`${prefix}/contact`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
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
