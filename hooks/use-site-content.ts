'use client';

import { useState, useEffect } from 'react';
import { fetchAllSiteContent } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import type { LocalizedString, Locale } from '@/types';

export function useSiteContent(locale: Locale) {
  const [content, setContent] = useState<Record<string, LocalizedString>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSiteContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  const getText = (key: string, fallback: LocalizedString): string => {
    const val = content[key];
    if (!val || (!val.ar && !val.en)) {
      return localized(fallback, locale);
    }
    return localized(val, locale);
  };

  return { content, loading, getText };
}
