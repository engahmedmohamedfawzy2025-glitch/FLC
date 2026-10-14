import type { MetadataRoute } from 'next';
import { fetchSolutions, fetchProducts, fetchProjects, fetchServices, fetchNews } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://technova.example';
  const locales = ['ar', 'en'];
  const staticPages = ['', '/about', '/solutions', '/products', '/projects', '/services', '/news', '/contact'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  try {
    const [solutions, products, projects, services, news] = await Promise.all([
      fetchSolutions(), fetchProducts(), fetchProjects(), fetchServices(), fetchNews(),
    ]);

    for (const locale of locales) {
      for (const sol of solutions.filter((s) => s.status === 'published')) {
        entries.push({ url: `${baseUrl}/${locale}/solutions/${sol.slug}`, lastModified: new Date(sol.updatedAt), changeFrequency: 'monthly', priority: 0.6 });
      }
      for (const prod of products.filter((p) => p.status === 'published')) {
        entries.push({ url: `${baseUrl}/${locale}/products/${prod.slug}`, lastModified: new Date(prod.updatedAt), changeFrequency: 'monthly', priority: 0.6 });
      }
      for (const proj of projects.filter((p) => p.status === 'published')) {
        entries.push({ url: `${baseUrl}/${locale}/projects/${proj.slug}`, lastModified: new Date(proj.updatedAt), changeFrequency: 'monthly', priority: 0.6 });
      }
      for (const srv of services.filter((s) => s.status === 'published')) {
        entries.push({ url: `${baseUrl}/${locale}/services/${srv.slug}`, lastModified: new Date(srv.updatedAt), changeFrequency: 'monthly', priority: 0.6 });
      }
      for (const article of news.filter((n) => n.status === 'published')) {
        entries.push({ url: `${baseUrl}/${locale}/news/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: 'monthly', priority: 0.5 });
      }
    }
  } catch {
    // DB fetch failed — return static pages only
  }

  return entries;
}
