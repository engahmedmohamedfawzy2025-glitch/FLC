import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { generateSeoMetadata } from '@/config/seo.config';
import { t } from '@/config/i18n.config';
import { ServicesList } from '@/components/lists/services-list';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSeoMetadata({
    locale: params.locale as Locale,
    title: t('services.title', params.locale as Locale),
    path: '/services',
  });
}

export default function ServicesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('services.title', locale)}
          subtitle={t('services.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.services', locale) }]}
        />
        <ServicesList locale={locale} />
      </main>
      <Footer />
    </>
  );
}
