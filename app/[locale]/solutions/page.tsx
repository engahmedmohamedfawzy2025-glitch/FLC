import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { generateSeoMetadata } from '@/config/seo.config';
import { t } from '@/config/i18n.config';
import { SolutionsList } from '@/components/lists/solutions-list';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSeoMetadata({
    locale: params.locale as Locale,
    title: t('solutions.title', params.locale as Locale),
    path: '/solutions',
  });
}

export default function SolutionsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('solutions.title', locale)}
          subtitle={t('solutions.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.solutions', locale) }]}
        />
        <SolutionsList locale={locale} />
      </main>
      <Footer />
    </>
  );
}
