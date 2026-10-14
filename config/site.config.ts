import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  identity: {
    companyName: { ar: 'FLC - شركة المستقبل المحدودة', en: 'FLC - Future Limited Company' },
    legalName: { ar: 'شركة المستقبل المحدودة', en: 'Future Limited Company' },
    tagline: {
      ar: 'نبني المستقبل الرقمي للمؤسسات',
      en: 'Building the Digital Future for Enterprises',
    },
    shortDescription: {
      ar: 'شريكك الموثوق في التحول الرقمي والحلول التقنية المتقدمة',
      en: 'Your trusted partner in digital transformation and advanced technology solutions',
    },
    logo: '/logo.svg',
    logoDark: '/logo-dark.svg',
    logoLight: '/logo-light.svg',
    favicon: '/favicon.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    socialSharingImage: '/og-image.jpg',
  },
  contact: {
    email: 'contact@technova.example',
    phone: '+966 11 234 5678',
    whatsapp: '+966 50 123 4567',
    address: {
      ar: 'طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية',
      en: 'King Fahd Road, Al Olaya District, Riyadh, Saudi Arabia',
    },
    googleMapsUrl: 'https://maps.google.com',
    businessHours: {
      ar: 'الأحد - الخميس، 8:00 ص - 5:00 م',
      en: 'Sunday - Thursday, 8:00 AM - 5:00 PM',
    },
  },
  social: {
    linkedin: 'https://linkedin.com/company/technova',
    facebook: 'https://facebook.com/technova',
    instagram: 'https://instagram.com/technova',
    x: 'https://x.com/technova',
    youtube: 'https://youtube.com/@technova',
  },
  features: {
    clients: true,
    testimonials: true,
    projects: true,
    news: true,
    services: true,
    products: true,
    solutions: true,
    whatsapp: true,
    darkMode: false,
  },
  defaultLocale: 'ar',
  locales: ['ar', 'en'],
};
