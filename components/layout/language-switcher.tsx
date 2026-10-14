'use client';

import { useLocale } from '@/components/layout/locale-provider';
import { getEnabledLanguages, getLanguageByCode } from '@/config/i18n.config';
import type { Locale } from '@/types';
import { Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ compact = false, scrolled = false }: { compact?: boolean; scrolled?: boolean }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const enabledLanguages = getEnabledLanguages();
  const shouldHide = enabledLanguages.length <= 1;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (shouldHide) return null;

  const currentLang = getLanguageByCode(locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          scrolled
            ? 'hover:bg-muted text-foreground/80 hover:text-foreground'
            : 'hover:bg-white/10 text-white/80 hover:text-white',
          compact && 'px-2'
        )}
        aria-expanded={open}
      >
        {currentLang?.flagUrl ? (
          <img
            src={currentLang.flagUrl}
            alt={currentLang.name}
            className="h-4 w-6 rounded-sm object-cover"
          />
        ) : (
          <span className="flex h-4 w-5 items-center justify-center rounded-sm bg-white/15 text-[8px] font-bold text-white">
            {currentLang?.code.toUpperCase().slice(0, 2)}
          </span>
        )}
        <span className="hidden sm:inline">{currentLang?.name}</span>
      </button>
      {open && (
        <div className="absolute end-0 top-full mt-2 w-44 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 animate-scale-in">
          {enabledLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code as Locale);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-muted',
                lang.code === locale && 'bg-muted font-semibold'
              )}
            >
              <span className="flex items-center gap-2">
                {lang.flagUrl ? (
                  <img
                    src={lang.flagUrl}
                    alt={lang.name}
                    className="h-3.5 w-5 rounded-sm object-cover"
                  />
                ) : (
                  <span className="flex h-3.5 w-5 items-center justify-center rounded-sm bg-muted text-[8px] font-bold text-muted-foreground">
                    {lang.code.toUpperCase().slice(0, 2)}
                  </span>
                )}
                {lang.name}
              </span>
              {lang.code === locale && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
