'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/components/layout/locale-provider';
import { useSiteConfig } from '@/lib/use-site-config';
import { footerConfig } from '@/config/media.config';
import { localized, t } from '@/config/i18n.config';
import { Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: Globe,
};

export function Footer() {
  const { locale } = useLocale();
  const siteConfig = useSiteConfig();
  const prefix = `/${locale}`;
  const year = new Date().getFullYear();
  const companyName = localized(siteConfig.identity.companyName, locale);
  const logoUrl = siteConfig.identity.logo || '/logo.svg';

  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-[#0A1118] via-[#132A43] to-[#1B3B6F] text-white">
      <div className="absolute -top-32 end-0 h-72 w-72 rounded-full bg-[#32E0C4]/10 blur-3xl" />
      <div className="absolute -bottom-40 start-1/4 h-80 w-80 rounded-full bg-[#1B3B6F]/40 blur-3xl" />

      <div className="container-site relative py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <Link href={`${prefix}/`} className="inline-flex items-center gap-3 group">
              {logoUrl && logoUrl !== '/logo.svg' ? (
                <Image
                  src={logoUrl}
                  alt={companyName}
                  width={44}
                  height={44}
                  className="h-11 w-auto rounded-xl object-contain"
                  unoptimized
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#32E0C4] text-lg font-bold text-[#0A1118]">
                  {companyName.charAt(0)}
                </span>
              )}
              <span className="text-xl font-bold tracking-tight group-hover:text-[#32E0C4] transition-colors">
                {companyName}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              {localized(footerConfig.description, locale)}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {siteConfig.social && Object.entries(siteConfig.social).map(([key, url]) => {
                if (!url || key === 'other') return null;
                const Icon = socialIcons[key] || Mail;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-[#32E0C4]/60 hover:bg-[#32E0C4] hover:text-[#0A1118] transition-all"
                    aria-label={key}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-bold text-white">
              {t('footer.contact', locale)}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm leading-6 text-white/60">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#32E0C4]" />
                <span>{localized(siteConfig.contact.address, locale)}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-[#32E0C4]" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[#32E0C4] transition-colors" dir="ltr">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-[#32E0C4]" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#32E0C4] transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-white/45">
            &copy; {year} {companyName}. {localized(footerConfig.copyright, locale)}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/45">
            <span>{locale === 'ar' ? 'تطوير:' : 'Developed by:'}</span>
            <span className="font-semibold text-[#32E0C4]">Ahmed Fawzy</span>
            <span className="text-white/25">|</span>
            <a href="tel:01091848020" className="font-semibold text-[#32E0C4] hover:text-white transition-colors" dir="ltr">
              01091848020
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
