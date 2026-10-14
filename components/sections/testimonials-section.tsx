'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchTestimonials } from '@/lib/content';
import { Star, Quote } from 'lucide-react';
import type { Locale, LocalizedString, Testimonial } from '@/types';

export function TestimonialsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials().then((data) => {
      setTestimonials([...data].sort((a, b) => a.order - b.order).slice(0, 3));
    }).catch(() => setTestimonials([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('testimonials.title', locale);
  const sectionSubtitle = t('testimonials.subtitle', locale);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, i) => (
            <ScrollReveal key={test.id} delay={i * 100} className="h-full">
              <div className="relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-6">
                <Quote className="absolute top-4 end-4 h-12 w-12 text-primary/10" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: test.rating }).map((_, ri) => (
                    <Star key={ri} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed relative z-10">
                  &ldquo;{localized(test.content, locale)}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{test.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {localized(test.role, locale)} · {test.company}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
