import type { ThemeConfig } from '@/types';

export const themeConfig: ThemeConfig = {
  branding: {
    primaryColor: '#49D2C2',
    secondaryColor: '#1B3A5C',
    accentColor: '#49D2C2',
    backgroundColor: '#1A2332',
    surfaceColor: '#222D3F',
    textColor: '#E8EDF5',
    mutedColor: '#8B9BB0',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    successColor: '#16A34A',
    warningColor: '#F59E0B',
    errorColor: '#DC2626',
  },
  typography: {
    arabicFont: 'Tajawal',
    englishFont: 'Inter',
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  tokens: {
    borderRadius: '8px',
    buttonRadius: '8px',
    cardRadius: '12px',
    shadowIntensity: 'subtle',
    containerWidth: '1280px',
    sectionSpacing: '96px',
  },
};
