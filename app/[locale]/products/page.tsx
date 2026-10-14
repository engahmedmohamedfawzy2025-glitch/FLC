import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { generateSeoMetadata } from '@/config/seo.config';
import { t } from '@/config/i18n.config';
import { ProductsList } from '@/components/lists/products-list';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSeoMetadata({
    locale: params.locale as Locale,
    title: t('products.title', params.locale as Locale),
    path: '/products',
  });
}

export default function ProductsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('products.title', locale)}
          subtitle={t('products.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.products', locale) }]}
        />
        <ProductsList locale={locale} />
      </main>
      <Footer />
    </>
  );
}
