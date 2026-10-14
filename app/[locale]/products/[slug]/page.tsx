import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateSeoMetadata } from '@/config/seo.config';
import { fetchProductBySlug } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { ProductDetail } from '@/components/lists/product-detail';
import type { Locale } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return {};
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    title: localized(product.title, locale),
    description: localized(product.shortDescription, locale),
    path: `/products/${params.slug}`,
  });
}

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <ProductDetail locale={locale} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
