import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateSeoMetadata } from '@/config/seo.config';
import { fetchSolutionBySlug } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { SolutionDetail } from '@/components/lists/solution-detail';
import type { Locale } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const solution = await fetchSolutionBySlug(params.slug);
  if (!solution) return {};
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    title: localized(solution.title, locale),
    description: localized(solution.shortDescription, locale),
    path: `/solutions/${params.slug}`,
  });
}

export default function SolutionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <SolutionDetail locale={locale} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
