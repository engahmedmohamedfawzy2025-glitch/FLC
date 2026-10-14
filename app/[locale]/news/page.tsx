import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { generateSeoMetadata } from '@/config/seo.config';
import { t } from '@/config/i18n.config';
import { NewsList } from '@/components/lists/news-list';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSeoMetadata({
    locale: params.locale as Locale,
    title: t('news.title', params.locale as Locale),
    path: '/news',
  });
}

export default function NewsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('news.title', locale)}
          subtitle={t('news.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.news', locale) }]}
        />
        <NewsList locale={locale} />
      </main>
      <Footer />
    </>
  );
}
