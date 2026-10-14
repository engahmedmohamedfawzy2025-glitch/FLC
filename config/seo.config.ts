import type { SEOData, Locale } from '@/types';

export const seoConfig: SEOData = {
  title: {
    ar: 'تِك نوفا | حلول تقنية متقدمة للمؤسسات',
    en: 'TechNova | Advanced Technology Solutions for Enterprises',
  },
  description: {
    ar: 'نقدم حلولاً متقدمة في التحول الرقمي، الحلول السحابية، الأمن السيبراني، والذكاء الاصطناعي للمؤسسات في السعودية والمنطقة.',
    en: 'We deliver advanced solutions in digital transformation, cloud, cybersecurity, and AI for enterprises in Saudi Arabia and the region.',
  },
  canonical: '',
  ogImage: '/og-image.jpg',
  robots: 'index, follow',
  keywords: {
    ar: 'تحول رقمي, حلول سحابية, أمن سيبراني, ذكاء اصطناعي, السعودية, الرياض',
    en: 'digital transformation, cloud solutions, cybersecurity, AI, Saudi Arabia, Riyadh',
  },
};

export function generateSeoMetadata({
  title,
  description,
  locale,
  path,
  image,
}: {
  title?: string;
  description?: string;
  locale: Locale;
  path?: string;
  image?: string;
}) {
  const defaultTitle = seoConfig.title?.[locale] || 'TechNova';
  const defaultDesc = seoConfig.description?.[locale] || '';
  const finalTitle = title ? `${title} | ${defaultTitle.split('|')[0].trim()}` : defaultTitle;
  const finalDesc = description || defaultDesc;
  const ogImage = image || seoConfig.ogImage || '/og-image.jpg';

  return {
    title: finalTitle,
    description: finalDesc,
    alternates: {
      canonical: path,
      languages: {
        ar: `/ar${path || ''}`,
        en: `/en${path || ''}`,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      images: [{ url: ogImage }],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: finalTitle,
      description: finalDesc,
      images: [ogImage],
    },
  };
}
