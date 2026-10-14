import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { generateSeoMetadata } from '@/config/seo.config';
import { t } from '@/config/i18n.config';
import { ProjectsList } from '@/components/lists/projects-list';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSeoMetadata({
    locale: params.locale as Locale,
    title: t('projects.title', params.locale as Locale),
    path: '/projects',
  });
}

export default function ProjectsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('projects.title', locale)}
          subtitle={t('projects.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.projects', locale) }]}
        />
        <ProjectsList locale={locale} />
      </main>
      <Footer />
    </>
  );
}
