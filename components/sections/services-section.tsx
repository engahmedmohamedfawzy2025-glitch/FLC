'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchServices } from '@/lib/content';
import type { Locale, LocalizedString, Service } from '@/types';

export function ServicesSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const prefix = `/${locale}`;
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data.filter((s) => s.status === 'published').sort((a, b) => a.order - b.order).slice(0, 4));
    }).catch(() => setServices([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('services.title', locale);
  const sectionSubtitle = t('services.subtitle', locale);

  return (
    <section className="section-spacing section-divider bg-background">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, i) => {
            return (
              <ScrollReveal key={srv.id} delay={i * 80} className="h-full">
                <Link
                  href={`${prefix}/services/${srv.slug}`}
                  className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  {srv.image && (
                    <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                      <img
                        src={srv.image}
                        alt={localized(srv.title, locale)}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {localized(srv.title, locale)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {localized(srv.shortDescription, locale)}
                    </p>

                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
