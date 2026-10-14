'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchClients } from '@/lib/content';
import type { Locale, LocalizedString, Client } from '@/types';

export function ClientsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients().then((data) => {
      setClients([...data].sort((a, b) => a.order - b.order));
    }).catch(() => setClients([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('clients.title', locale);
  const sectionSubtitle = t('clients.subtitle', locale);

  return (
    <section className="section-divider py-16 md:py-20 bg-surface border-y border-border">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {sectionSubtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group flex h-24 flex-col items-center justify-center rounded-xl border border-border bg-card px-3 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
              title={client.name}
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-12 w-auto max-w-full object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-bold text-muted-foreground text-center line-clamp-2">
                  {client.name}
                </span>
              )}
              {client.logo && (
                <span className="mt-1.5 text-[10px] text-muted-foreground/70 text-center line-clamp-1 group-hover:text-muted-foreground transition-colors">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
