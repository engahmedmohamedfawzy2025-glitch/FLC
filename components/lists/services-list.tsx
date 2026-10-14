'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchServices } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import * as Icons from 'lucide-react';
import { Check } from 'lucide-react';
import type { Locale, Service } from '@/types';

export function ServicesList({ locale }: { locale: Locale }) {
  const prefix = `/${locale}`;
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data.filter((s) => s.status === 'published').sort((a, b) => a.order - b.order));
    }).catch(() => setServices([]));
  }, []);

  return (
    <section className="section-spacing bg-background">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv, i) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[srv.icon || 'Settings'];
            return (
              <ScrollReveal key={srv.id} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      {IconComponent && <IconComponent className="h-7 w-7" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {localized(srv.title, locale)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {localized(srv.description, locale)}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {srv.features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-foreground/80">
                            <Check className="h-4 w-4 text-accent shrink-0" />
                            {localized(f, locale)}
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
