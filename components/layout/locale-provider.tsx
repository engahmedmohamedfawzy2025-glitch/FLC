'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { i18nConfig, getDir } from '@/config/i18n.config';
import type { Locale } from '@/types';

interface LocaleContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18nConfig.defaultLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      if (i18nConfig.locales.includes(segments[0] as Locale)) {
        segments[0] = newLocale;
      } else {
        segments.unshift(newLocale);
      }
      window.location.href = '/' + segments.join('/');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      const detected = segments[0] as Locale;
      if (i18nConfig.locales.includes(detected)) {
        setLocaleState(detected);
      }
    }
  }, []);

  const dir = getDir(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LocaleContext.Provider value={{ locale, dir, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: i18nConfig.defaultLocale,
      dir: getDir(i18nConfig.defaultLocale) as 'rtl' | 'ltr',
      setLocale: () => {},
    };
  }
  return ctx;
}
