'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site.config';
import { fetchSiteSettings } from '@/lib/content';
import type { SiteConfig } from '@/types';

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(siteConfig);

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      if (!settings) return;
      setConfig({
        identity: { ...siteConfig.identity, ...(settings.identity as Partial<typeof siteConfig.identity> | undefined) },
        contact: { ...siteConfig.contact, ...(settings.contact as Partial<typeof siteConfig.contact> | undefined) },
        social: { ...siteConfig.social, ...(settings.social as Partial<typeof siteConfig.social> | undefined) },
        features: { ...siteConfig.features, ...(settings.features as Partial<typeof siteConfig.features> | undefined) },
        defaultLocale: siteConfig.defaultLocale,
        locales: siteConfig.locales,
      });
    });
  }, []);

  return config;
}
