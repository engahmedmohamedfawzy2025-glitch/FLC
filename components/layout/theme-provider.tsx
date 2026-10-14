'use client';

import { ReactNode, useEffect } from 'react';
import { themeConfig } from '@/config/theme.config';
import { fetchBranding, type BrandingData } from '@/lib/content';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const applyBranding = (data: BrandingData) => {
      const root = document.documentElement;
      const { branding, tokens } = data;

      root.style.setProperty('--color-primary', branding.primaryColor);
      root.style.setProperty('--color-secondary', branding.secondaryColor);
      root.style.setProperty('--color-accent', branding.accentColor);
      root.style.setProperty('--color-background', branding.backgroundColor);
      root.style.setProperty('--color-surface', branding.surfaceColor);
      root.style.setProperty('--color-text', branding.textColor);
      root.style.setProperty('--color-muted', branding.mutedColor);
      root.style.setProperty('--color-border', branding.borderColor);
      root.style.setProperty('--color-success', branding.successColor);
      root.style.setProperty('--color-warning', branding.warningColor);
      root.style.setProperty('--color-error', branding.errorColor);

      root.style.setProperty('--radius-card', tokens.cardRadius);
      root.style.setProperty('--radius-button', tokens.buttonRadius);
      root.style.setProperty('--radius-general', tokens.borderRadius);
      root.style.setProperty('--container-width', tokens.containerWidth);
      root.style.setProperty('--section-spacing', tokens.sectionSpacing);
    };

    applyBranding(themeConfig);

    fetchBranding().then((data) => {
      applyBranding(data);
    }).catch(() => {});
  }, []);

  return <>{children}</>;
}
