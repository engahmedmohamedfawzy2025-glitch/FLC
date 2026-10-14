'use client';

import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/types';

export function CtaSection({ locale }: { locale: Locale }) {
  const { dir } = useLocale();
  const prefix = `/${locale}`;

  return (
    <section className="py-20 md:py-28">
      <div className="container-site">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-primary/30 px-6 py-16 md:px-16 md:py-20 text-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute top-0 end-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 start-0 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
                {t('cta.title', locale)}
              </h2>
              <p className="mt-4 text-lg text-white/70">
                {t('cta.subtitle', locale)}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                  {t('cta.button', locale)}
                  {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
                <Link
                  href={`${prefix}/solutions`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  {t('hero.explore', locale)}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
