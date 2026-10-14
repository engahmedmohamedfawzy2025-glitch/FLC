import type { PageSection, Locale } from '@/types';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { StatsSection } from '@/components/sections/stats-section';
import { SolutionsSection } from '@/components/sections/solutions-section';
import { ProductsSection } from '@/components/sections/products-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ServicesSection } from '@/components/sections/services-section';
import { ClientsSection } from '@/components/sections/clients-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { NewsSection } from '@/components/sections/news-section';

export function SectionRenderer({ section, locale }: { section: PageSection; locale: Locale }) {
  if (!section.enabled) return null;

  switch (section.type) {
    case 'hero':
      return <HeroSection locale={locale} />;
    case 'about':
      return <AboutSection locale={locale} title={section.title} />;
    case 'stats':
      return <StatsSection locale={locale} />;
    case 'solutions':
      return <SolutionsSection locale={locale} title={section.title} />;
    case 'products':
      return <ProductsSection locale={locale} title={section.title} />;
    case 'projects':
      return <ProjectsSection locale={locale} title={section.title} />;
    case 'services':
      return <ServicesSection locale={locale} title={section.title} />;
    case 'clients':
      return <ClientsSection locale={locale} title={section.title} />;
    case 'testimonials':
      return <TestimonialsSection locale={locale} title={section.title} />;
    case 'news':
      return <NewsSection locale={locale} title={section.title} />;
    default:
      return null;
  }
}
