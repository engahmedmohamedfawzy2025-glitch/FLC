import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateSeoMetadata } from '@/config/seo.config';
import { fetchServiceBySlug } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { ServiceDetail } from '@/components/lists/service-detail';
import type { Locale } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const service = await fetchServiceBySlug(params.slug);
  if (!service) return {};
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    title: localized(service.title, locale),
    description: localized(service.shortDescription, locale),
    path: `/services/${params.slug}`,
  });
}

export default function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <ServiceDetail locale={locale} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
