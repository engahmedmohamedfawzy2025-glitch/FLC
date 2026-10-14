import type { PageSection } from '@/types';

export const homepageSections: PageSection[] = [
  { id: 'sec-hero', type: 'hero', enabled: true, order: 0 },
  { id: 'sec-about', type: 'about', enabled: true, order: 1, title: { ar: 'من نحن', en: 'About Us' } },
  { id: 'sec-stats', type: 'stats', enabled: true, order: 2 },
  { id: 'sec-solutions', type: 'solutions', enabled: true, order: 3, title: { ar: 'حلولنا', en: 'Our Solutions' } },
  { id: 'sec-products', type: 'products', enabled: true, order: 4, title: { ar: 'منتجاتنا', en: 'Our Products' } },
  { id: 'sec-projects', type: 'projects', enabled: true, order: 5, title: { ar: 'مشاريعنا', en: 'Our Projects' } },
  { id: 'sec-services', type: 'services', enabled: true, order: 6, title: { ar: 'خدماتنا', en: 'Our Services' } },
  { id: 'sec-clients', type: 'clients', enabled: true, order: 7, title: { ar: 'عملاؤنا', en: 'Our Clients' } },
  { id: 'sec-testimonials', type: 'testimonials', enabled: true, order: 8, title: { ar: 'آراء العملاء', en: 'Testimonials' } },
  { id: 'sec-news', type: 'news', enabled: true, order: 9, title: { ar: 'آخر الأخبار', en: 'Latest News' } },
];
