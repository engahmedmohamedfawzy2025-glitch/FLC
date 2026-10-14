import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateSeoMetadata } from '@/config/seo.config';
import { fetchProjectBySlug } from '@/lib/content';
import { localized } from '@/config/i18n.config';
import { ProjectDetail } from '@/components/lists/project-detail';
import type { Locale } from '@/types';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) return {};
  const locale = params.locale as Locale;
  return generateSeoMetadata({
    locale,
    title: localized(project.title, locale),
    description: localized(project.description, locale),
    path: `/projects/${params.slug}`,
  });
}

export default function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <ProjectDetail locale={locale} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}
