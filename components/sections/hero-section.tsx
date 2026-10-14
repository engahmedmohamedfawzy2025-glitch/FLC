'use client';

import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { useSiteConfig } from '@/lib/use-site-config';
import { useSiteContent } from '@/hooks/use-site-content';
import { localized, t } from '@/config/i18n.config';
import { ArrowRight, ShieldCheck, Award, Globe } from 'lucide-react';
import type { Locale } from '@/types';

export function HeroSection({ locale }: { locale: Locale }) {
  const { dir } = useLocale();
  const siteConfig = useSiteConfig();
  const { getText } = useSiteContent(locale);
  const prefix = `/${locale}`;
  const companyName = localized(siteConfig.identity.companyName, locale);
  const tagline = localized(siteConfig.identity.tagline, locale);
  const description = localized(siteConfig.identity.shortDescription, locale);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-secondary">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1118] via-[#132030] to-[#1B3B6F]/40" />
        <div className="absolute top-1/4 end-0 h-96 w-96 rounded-full bg-[#32E0C4]/10 blur-3xl" />
        <div className="absolute bottom-1/4 start-0 h-72 w-72 rounded-full bg-[#32E0C4]/8 blur-3xl" />
        <div className="absolute top-0 start-1/3 h-64 w-64 rounded-full bg-[#1B3B6F]/30 blur-3xl" />
      </div>

      <div className="container-site relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 mb-6 animate-fade-down">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            {getText('hero_badge', { ar: 'شريك موثوق لأكثر من 200 مؤسسة', en: 'Trusted by 200+ enterprises' })}
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] text-balance animate-fade-up">
            {tagline}
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {description}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href={`${prefix}/solutions`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              {t('hero.explore', locale)}
              {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              {t('hero.contact', locale)}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <TrustIndicator icon={ShieldCheck} label={getText('hero_trust_1', { ar: 'آمن وموثوق', en: 'Secure & Trusted' })} />
            <TrustIndicator icon={Award} label={getText('hero_trust_2', { ar: 'معايير عالمية', en: 'Global Standards' })} />
            <TrustIndicator icon={Globe} label={getText('hero_trust_3', { ar: 'حضور إقليمي', en: 'Regional Presence' })} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1.5">
          <div className="h-2 w-1 rounded-full bg-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function TrustIndicator({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-white/60">
      <Icon className="h-5 w-5 text-accent" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
