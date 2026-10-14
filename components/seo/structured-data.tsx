import type { Locale } from '@/types';

export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ar' ? 'تِك نوفا' : 'TechNova',
    description:
      locale === 'ar'
        ? 'شريكك الموثوق في التحول الرقمي والحلول التقنية المتقدمة'
        : 'Your trusted partner in digital transformation and advanced technology solutions',
    url: 'https://technova.example',
    logo: 'https://technova.example/logo.svg',
    sameAs: [
      'https://linkedin.com/company/technova',
      'https://facebook.com/technova',
      'https://x.com/technova',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966112345678',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ar' ? 'تِك نوفا' : 'TechNova',
    url: 'https://technova.example',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://technova.example/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
  locale,
}: {
  items: { name: string; url: string }[];
  locale: Locale;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://technova.example${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  locale,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  author: string;
  locale: Locale;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || 'https://technova.example/og-image.jpg',
    datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: locale === 'ar' ? 'تِك نوفا' : 'TechNova',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
