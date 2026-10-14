'use client';

import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const { dir, locale } = useLocale();
  const prefix = `/${locale}`;

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/3 end-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container-site relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm text-white/50 mb-4" aria-label="Breadcrumb">
            <Link href={`${prefix}/`} className="hover:text-white transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className={cn('h-3.5 w-3.5', dir === 'rtl' && 'rtl-flip')} />
                {crumb.href ? (
                  <Link href={`${prefix}${crumb.href}`} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
