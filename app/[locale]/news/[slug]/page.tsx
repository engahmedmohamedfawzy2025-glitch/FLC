import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateSeoMetadata } from '@/config/seo.config';
import { fetchNewsBySlug } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { NewsArticleDetail } from '@/components/lists/news-article-detail';
import type { Locale } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await fetchNewsBySlug(params.slug);
  if (!article) return {};
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    title: localized(article.title, locale),
    description: localized(article.excerpt, locale),
    path: `/news/${params.slug}`,
  });
}

export default function NewsArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <NewsArticleDetail locale={locale} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
