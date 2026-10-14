'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { useNavigation } from '@/lib/use-navigation';
import { useSiteConfig } from '@/lib/use-site-config';
import { localized, t } from '@/config/i18n.config';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import * as Icons from 'lucide-react';
import Image from 'next/image';
import type { NavItem } from '@/types';

export function Header() {
  const { locale, dir } = useLocale();
  const siteConfig = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = useNavigation().filter((n) => n.enabled).sort((a, b) => a.order - b.order);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const prefix = `/${locale}`;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-border shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="container-site">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href={`${prefix}/`} className="flex items-center gap-2 shrink-0">
              <Logo scrolled={scrolled} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <DesktopNavItem
                  key={item.id}
                  item={item}
                  locale={locale}
                  prefix={prefix}
                  onMegaMenuOpen={setMegaMenuOpen}
                  megaMenuOpen={megaMenuOpen}
                  renderIcon={renderIcon}
                  scrolled={scrolled}
                />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher scrolled={scrolled} />
              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors',
                  scrolled ? 'hover:bg-muted text-foreground' : 'hover:bg-white/10 text-white'
                )}
                aria-label={t('menu.open', locale)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <MobileDrawer
          navItems={navItems}
          locale={locale}
          prefix={prefix}
          onClose={() => setMobileOpen(false)}
          renderIcon={renderIcon}
        />
      )}
    </>
  );
}

function Logo({ scrolled }: { scrolled: boolean }) {
  const { locale } = useLocale();
  const siteConfig = useSiteConfig();
  const name = localized(siteConfig.identity.companyName, locale);
  const logoUrl = siteConfig.identity.logo;
  const hasCustomLogo = logoUrl && logoUrl !== '/logo.svg';

  return (
    <div className="flex items-center gap-2">
      {hasCustomLogo ? (
        <Image
          src={logoUrl}
          alt={name}
          width={44}
          height={44}
          className="h-11 w-auto rounded-xl object-contain"
          unoptimized
        />
      ) : (
        <div className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl font-bold text-xl transition-colors',
          scrolled
            ? 'bg-primary text-primary-foreground'
            : 'bg-white/15 text-white backdrop-blur-sm'
        )}>
          {name.charAt(0)}
        </div>
      )}
      <span className={cn(
        'font-bold text-lg transition-colors hidden sm:block',
        scrolled ? 'text-foreground' : 'text-white'
      )}>
        {name}
      </span>
    </div>
  );
}

function DesktopNavItem({
  item,
  locale,
  prefix,
  onMegaMenuOpen,
  megaMenuOpen,
  renderIcon,
  scrolled,
}: {
  item: NavItem;
  locale: 'ar' | 'en';
  prefix: string;
  onMegaMenuOpen: (id: string | null) => void;
  megaMenuOpen: string | null;
  renderIcon: (name?: string) => React.ReactNode;
  scrolled: boolean;
}) {
  const { dir } = useLocale();
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = megaMenuOpen === item.id;

  if (item.type === 'cta') {
    return (
      <Link
        href={`${prefix}${item.url || ''}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {localized(item.label, locale)}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && onMegaMenuOpen(item.id)}
      onMouseLeave={() => hasChildren && onMegaMenuOpen(null)}
    >
      <Link
        href={`${prefix}${item.url || ''}`}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:text-primary',
          scrolled ? 'text-foreground/80' : 'text-white/80 hover:text-white'
        )}
        onClick={() => hasChildren && onMegaMenuOpen(isOpen ? null : item.id)}
      >
        {localized(item.label, locale)}
        {hasChildren && <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />}
      </Link>

      {/* Mega Menu */}
      {hasChildren && isOpen && (
        <div className="absolute top-full pt-3 start-0 w-[520px] z-50">
          <div className="rounded-2xl border border-border bg-popover shadow-xl p-4 animate-scale-in">
            <div className="grid grid-cols-2 gap-2">
              {item.children!
                .sort((a, b) => a.order - b.order)
                .map((child) => (
                  <Link
                    key={child.id}
                    href={`${prefix}${child.url}`}
                    className="group flex items-start gap-3 rounded-xl p-3 hover:bg-muted transition-colors"
                    onClick={() => onMegaMenuOpen(null)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {renderIcon(child.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {localized(child.label, locale)}
                      </div>
                      {child.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {localized(child.description, locale)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link
                href={`${prefix}${item.url || ''}`}
                className="flex items-center justify-between text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                onClick={() => onMegaMenuOpen(null)}
              >
                {t('common.viewAll', locale)}
                {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDrawer({
  navItems,
  locale,
  prefix,
  onClose,
  renderIcon,
}: {
  navItems: NavItem[];
  locale: 'ar' | 'en';
  prefix: string;
  onClose: () => void;
  renderIcon: (name?: string) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { dir } = useLocale();
  const siteConfig = useSiteConfig();

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn(
        'absolute top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col border-e border-border',
        dir === 'rtl' ? 'left-0 animate-slide-in-left' : 'right-0 animate-slide-in-right'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg text-foreground">{localized(siteConfig.identity.companyName, locale)}</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-foreground" aria-label={t('menu.close', locale)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expanded === item.id;
            return (
              <div key={item.id}>
                <div className="flex items-center">
                  <Link
                    href={`${prefix}${item.url || ''}`}
                    onClick={onClose}
                    className="flex-1 rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-foreground"
                  >
                    {localized(item.label, locale)}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="p-3 rounded-lg hover:bg-muted"
                      aria-label="toggle"
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform text-foreground', isExpanded && 'rotate-180')} />
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <div className="ms-4 mt-1 space-y-1 animate-accordion-down">
                    {item.children!.map((child) => (
                      <Link
                        key={child.id}
                        href={`${prefix}${child.url}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {renderIcon(child.icon)}
                        </div>
                        {localized(child.label, locale)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <Link
            href={`${prefix}/contact`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t('common.contactUs', locale)}
          </Link>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
