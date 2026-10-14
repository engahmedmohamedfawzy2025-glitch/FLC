import type { Metadata } from 'next';
import { HomepageView } from '@/components/sections/homepage-view';
import { generateSeoMetadata } from '@/config/seo.config';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/structured-data';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    path: '/',
  });
}

export default function LocaleHomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <WebSiteJsonLd locale={locale} />
      <HomepageView locale={locale} />
    </>
  );
}
