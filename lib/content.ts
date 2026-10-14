import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site.config';
import { themeConfig } from '@/config/theme.config';
import type {
  Product,
  Solution,
  Service,
  Project,
  Client,
  NewsArticle,
  Testimonial,
  Stat,
  SiteConfig,
  LocalizedString,
  BrandingConfig,
  TypographyConfig,
  DesignTokens,
  NavigationItemDB,
  UserProfile,
  UserRole,
  MediaItem,
  PageConfig,
  PageSection,
  SectionType,
} from '@/types';

// ============ DB row types (snake_case) ============

interface DbProduct {
  id: string; slug: string; title: LocalizedString; short_description: LocalizedString;
  description: LocalizedString; detailed_content: LocalizedString; category: LocalizedString; features: LocalizedString[];
  specifications: { key: LocalizedString; value: LocalizedString }[]; images: string[]; gallery: string[];
  documents: { name: string; url: string }[]; related_solutions: string[];
  related_projects: string[]; seo: Record<string, unknown>; status: string;
  featured: boolean; sort_order: number; created_at: string; updated_at: string;
}

interface DbSolution {
  id: string; slug: string; title: LocalizedString; short_description: LocalizedString;
  description: LocalizedString; detailed_content: LocalizedString; features: LocalizedString[]; benefits: LocalizedString[];
  applications: LocalizedString[]; images: string[]; gallery: string[]; icon: string;
  related_products: string[]; related_projects: string[]; seo: Record<string, unknown>;
  status: string; featured: boolean; sort_order: number; created_at: string; updated_at: string;
}

interface DbService {
  id: string; slug: string; title: LocalizedString; short_description: LocalizedString;
  description: LocalizedString; detailed_content: LocalizedString; features: LocalizedString[]; icon: string; image: string;
  gallery: string[]; sort_order: number; seo: Record<string, unknown>; status: string;
  created_at: string; updated_at: string;
}

interface DbProject {
  id: string; slug: string; title: LocalizedString; client: string; category: LocalizedString;
  location: LocalizedString; year: string; description: LocalizedString; detailed_content: LocalizedString; scope: LocalizedString[];
  results: LocalizedString[]; images: string[]; gallery: string[]; featured: boolean;
  seo: Record<string, unknown>; status: string; sort_order: number; created_at: string; updated_at: string;
}

interface DbClient {
  id: string; name: string; logo: string; website: string; description: LocalizedString;
  category: string; sort_order: number; created_at: string;
}

interface DbNews {
  id: string; slug: string; title: LocalizedString; excerpt: LocalizedString; content: LocalizedString;
  detailed_content: LocalizedString; featured_image: string; gallery: string[]; author: string; date: string; category: LocalizedString;
  featured: boolean; seo: Record<string, unknown>; status: string; sort_order: number;
  created_at: string; updated_at: string;
}

interface DbTestimonial {
  id: string; author: string; role: LocalizedString; company: string; content: LocalizedString;
  avatar: string; rating: number; sort_order: number; created_at: string;
}

interface DbStat {
  id: string; label: LocalizedString; value: string; suffix: string; icon: string;
  sort_order: number; created_at: string;
}

interface DbNavItem {
  id: string; label: LocalizedString; href: string; parent_id: string | null; icon: string;
  enabled: boolean; sort_order: number; is_external: boolean;
}

interface DbMediaItem {
  id: string; url: string; name: string; format: string; width: number; height: number;
  size: number; category: string; created_at: string;
}

interface DbProfile {
  id: string; user_id: string; full_name: string; role: string; is_active: boolean;
  created_at: string; last_login_at: string | null;
}

// ============ Mappers: DB -> App ============

function mapProduct(r: DbProduct): Product {
  return {
    id: r.id, slug: r.slug, title: r.title, shortDescription: r.short_description,
    description: r.description, detailedContent: r.detailed_content || { ar: '', en: '' },
    category: r.category, features: r.features || [],
    specifications: r.specifications || [], images: r.images || [], gallery: r.gallery || [],
    documents: r.documents || [], relatedSolutions: r.related_solutions || [],
    relatedProjects: r.related_projects || [],
    seo: r.seo as Product['seo'], status: r.status as Product['status'],
    featured: r.featured, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapSolution(r: DbSolution): Solution {
  return {
    id: r.id, slug: r.slug, title: r.title, shortDescription: r.short_description,
    description: r.description, detailedContent: r.detailed_content || { ar: '', en: '' },
    features: r.features || [], benefits: r.benefits || [],
    applications: r.applications || [], images: r.images || [], gallery: r.gallery || [],
    icon: r.icon,
    relatedProducts: r.related_products || [], relatedProjects: r.related_projects || [],
    seo: r.seo as Solution['seo'], status: r.status as Solution['status'],
    featured: r.featured, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapService(r: DbService): Service {
  return {
    id: r.id, slug: r.slug, title: r.title, shortDescription: r.short_description,
    description: r.description, detailedContent: r.detailed_content || { ar: '', en: '' },
    features: r.features || [], icon: r.icon,
    image: r.image, gallery: r.gallery || [], order: r.sort_order,
    seo: r.seo as Service['seo'], status: r.status as Service['status'],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapProject(r: DbProject): Project {
  return {
    id: r.id, slug: r.slug, title: r.title, client: r.client,
    category: r.category, location: r.location, year: r.year,
    description: r.description, detailedContent: r.detailed_content || { ar: '', en: '' },
    scope: r.scope || [], results: r.results || [],
    images: r.images || [], gallery: r.gallery || [], featured: r.featured,
    seo: r.seo as Project['seo'], status: r.status as Project['status'],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapClient(r: DbClient): Client {
  return {
    id: r.id, name: r.name, logo: r.logo, website: r.website,
    description: r.description, category: r.category, order: r.sort_order,
  };
}

function mapNews(r: DbNews): NewsArticle {
  return {
    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
    content: r.content, detailedContent: r.detailed_content || { ar: '', en: '' },
    featuredImage: r.featured_image, gallery: r.gallery || [],
    author: r.author, date: r.date, category: r.category, featured: r.featured,
    seo: r.seo as NewsArticle['seo'], status: r.status as NewsArticle['status'],
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapTestimonial(r: DbTestimonial): Testimonial {
  return {
    id: r.id, author: r.author, role: r.role, company: r.company,
    content: r.content, avatar: r.avatar, rating: r.rating, order: r.sort_order,
  };
}

function mapStat(r: DbStat): Stat {
  return {
    id: r.id, label: r.label, value: r.value, suffix: r.suffix,
    icon: r.icon, order: r.sort_order,
  };
}

function mapNavItem(r: DbNavItem): NavigationItemDB {
  return {
    id: r.id, label: r.label, href: r.href, parentId: r.parent_id,
    icon: r.icon, enabled: r.enabled, sortOrder: r.sort_order, isExternal: r.is_external,
  };
}

function mapMediaItem(r: DbMediaItem): MediaItem {
  return {
    id: r.id, url: r.url, name: r.name, format: r.format, width: r.width,
    height: r.height, size: r.size, category: r.category, uploadedAt: r.created_at,
  };
}

function mapProfile(r: DbProfile, email: string): UserProfile {
  return {
    id: r.id, userId: r.user_id, email, fullName: r.full_name,
    role: r.role as UserRole, isActive: r.is_active,
    createdAt: r.created_at, lastLoginAt: r.last_login_at,
  };
}

// ============ Mappers: App -> DB ============

function toDbProduct(p: Partial<Product>): Partial<DbProduct> {
  return {
    slug: p.slug, title: p.title, short_description: p.shortDescription,
    description: p.description, detailed_content: p.detailedContent,
    category: p.category, features: p.features,
    specifications: p.specifications, images: p.images, gallery: p.gallery,
    documents: p.documents,
    related_solutions: p.relatedSolutions, related_projects: p.relatedProjects,
    seo: p.seo as Record<string, unknown>, status: p.status, featured: p.featured,
  };
}

function toDbSolution(s: Partial<Solution>): Partial<DbSolution> {
  return {
    slug: s.slug, title: s.title, short_description: s.shortDescription,
    description: s.description, detailed_content: s.detailedContent,
    features: s.features, benefits: s.benefits,
    applications: s.applications, images: s.images, gallery: s.gallery, icon: s.icon,
    related_products: s.relatedProducts, related_projects: s.relatedProjects,
    seo: s.seo as Record<string, unknown>, status: s.status, featured: s.featured,
  };
}

function toDbService(s: Partial<Service>): Partial<DbService> {
  return {
    slug: s.slug, title: s.title, short_description: s.shortDescription,
    description: s.description, detailed_content: s.detailedContent,
    features: s.features, icon: s.icon,
    image: s.image, gallery: s.gallery, sort_order: s.order,
    seo: s.seo as Record<string, unknown>, status: s.status,
  };
}

function toDbProject(p: Partial<Project>): Partial<DbProject> {
  return {
    slug: p.slug, title: p.title, client: p.client, category: p.category,
    location: p.location, year: p.year, description: p.description,
    detailed_content: p.detailedContent,
    scope: p.scope, results: p.results, images: p.images, gallery: p.gallery,
    featured: p.featured, seo: p.seo as Record<string, unknown>, status: p.status,
  };
}

function toDbClient(c: Partial<Client>): Partial<DbClient> {
  return {
    name: c.name, logo: c.logo, website: c.website,
    description: c.description, category: c.category, sort_order: c.order,
  };
}

function toDbNews(n: Partial<NewsArticle>): Partial<DbNews> {
  return {
    slug: n.slug, title: n.title, excerpt: n.excerpt, content: n.content,
    detailed_content: n.detailedContent,
    featured_image: n.featuredImage, gallery: n.gallery, author: n.author,
    date: n.date, category: n.category, featured: n.featured,
    seo: n.seo as Record<string, unknown>, status: n.status,
  };
}

function toDbTestimonial(t: Partial<Testimonial>): Partial<DbTestimonial> {
  return {
    author: t.author, role: t.role, company: t.company,
    content: t.content, avatar: t.avatar, rating: t.rating, sort_order: t.order,
  };
}

function toDbStat(s: Partial<Stat>): Partial<DbStat> {
  return {
    label: s.label, value: s.value, suffix: s.suffix,
    icon: s.icon, sort_order: s.order,
  };
}

function toDbNavItem(n: Partial<NavigationItemDB>): Partial<DbNavItem> {
  return {
    label: n.label, href: n.href, parent_id: n.parentId, icon: n.icon,
    enabled: n.enabled, sort_order: n.sortOrder, is_external: n.isExternal,
  };
}

function genId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// ============ Products ============

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbProduct[]).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapProduct(data as DbProduct);
}

export async function createProduct(product: Partial<Product>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').insert({
    id: genId(), ...toDbProduct(product), sort_order: 0,
    created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products')
    .update({ ...toDbProduct(product), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Solutions ============

export async function fetchSolutions(): Promise<Solution[]> {
  const { data, error } = await supabase.from('solutions').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbSolution[]).map(mapSolution);
}

export async function fetchSolutionBySlug(slug: string): Promise<Solution | null> {
  const { data } = await supabase.from('solutions').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapSolution(data as DbSolution);
}

export async function createSolution(s: Partial<Solution>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('solutions').insert({
    id: genId(), ...toDbSolution(s), sort_order: 0, created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateSolution(id: string, s: Partial<Solution>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('solutions')
    .update({ ...toDbSolution(s), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteSolution(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('solutions').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Services ============

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbService[]).map(mapService);
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const { data } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapService(data as DbService);
}

export async function createService(s: Partial<Service>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('services').insert({
    id: genId(), ...toDbService(s), created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateService(id: string, s: Partial<Service>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('services')
    .update({ ...toDbService(s), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteService(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Projects ============

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbProject[]).map(mapProject);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapProject(data as DbProject);
}

export async function createProject(p: Partial<Project>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects').insert({
    id: genId(), ...toDbProject(p), sort_order: 0, created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateProject(id: string, p: Partial<Project>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects')
    .update({ ...toDbProject(p), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Clients ============

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbClient[]).map(mapClient);
}

export async function createClient(c: Partial<Client>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('clients').insert({
    id: genId(), ...toDbClient(c), created_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateClient(id: string, c: Partial<Client>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('clients').update(toDbClient(c)).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteClient(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ News ============

export async function fetchNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbNews[]).map(mapNews);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const { data } = await supabase.from('news').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapNews(data as DbNews);
}

export async function createNews(n: Partial<NewsArticle>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('news').insert({
    id: genId(), ...toDbNews(n), sort_order: 0, created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateNews(id: string, n: Partial<NewsArticle>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('news')
    .update({ ...toDbNews(n), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteNews(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Testimonials ============

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbTestimonial[]).map(mapTestimonial);
}

export async function createTestimonial(t: Partial<Testimonial>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('testimonials').insert({
    id: genId(), ...toDbTestimonial(t), created_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateTestimonial(id: string, t: Partial<Testimonial>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('testimonials').update(toDbTestimonial(t)).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteTestimonial(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Stats ============

export async function fetchStats(): Promise<Stat[]> {
  const { data, error } = await supabase.from('stats').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbStat[]).map(mapStat);
}

export async function createStat(s: Partial<Stat>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('stats').insert({
    id: genId(), ...toDbStat(s), created_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateStat(id: string, s: Partial<Stat>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('stats').update(toDbStat(s)).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteStat(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('stats').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ Site Settings ============

export async function fetchSiteSettings(): Promise<Partial<SiteConfig> | null> {
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error || !data || data.length === 0) return null;

  const settings: Record<string, unknown> = {};
  for (const row of data as { key: string; value: unknown }[]) {
    settings[row.key] = row.value;
  }

  return {
    identity: settings.identity as Partial<SiteConfig['identity']> | undefined,
    contact: settings.contact as Partial<SiteConfig['contact']> | undefined,
    social: settings.social as Partial<SiteConfig['social']> | undefined,
    features: settings.features as Partial<SiteConfig['features']> | undefined,
  } as Partial<SiteConfig>;
}

export async function fetchSetting(key: string): Promise<unknown | null> {
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (!data) return null;
  return (data as { value: unknown }).value;
}

export async function saveSetting(key: string, value: unknown): Promise<{ error: string | null }> {
  const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).maybeSingle();

  if (existing) {
    const { error } = await supabase.from('site_settings')
      .update({ value, updated_at: now() }).eq('key', key);
    return { error: error?.message || null };
  }

  const { error } = await supabase.from('site_settings').insert({
    key, value, updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function saveSettings(newSettings: Record<string, unknown>): Promise<{ error: string | null }> {
  for (const [key, value] of Object.entries(newSettings)) {
    const { error } = await saveSetting(key, value);
    if (error) return { error };
  }
  return { error: null };
}

// ============ Branding ============

export interface BrandingData {
  branding: BrandingConfig;
  typography: TypographyConfig;
  tokens: DesignTokens;
}

export async function fetchBranding(): Promise<BrandingData> {
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'branding').maybeSingle();
  if (!data) return themeConfig;
  const val = (data as { value: Record<string, string> }).value;
  return {
    branding: {
      primaryColor: val.primaryColor || themeConfig.branding.primaryColor,
      secondaryColor: val.secondaryColor || themeConfig.branding.secondaryColor,
      accentColor: val.accentColor || themeConfig.branding.accentColor,
      backgroundColor: val.backgroundColor || themeConfig.branding.backgroundColor,
      surfaceColor: val.surfaceColor || themeConfig.branding.surfaceColor,
      textColor: val.textColor || themeConfig.branding.textColor,
      mutedColor: val.mutedColor || themeConfig.branding.mutedColor,
      borderColor: val.borderColor || themeConfig.branding.borderColor,
      successColor: val.successColor || themeConfig.branding.successColor,
      warningColor: val.warningColor || themeConfig.branding.warningColor,
      errorColor: val.errorColor || themeConfig.branding.errorColor,
    },
    typography: {
      arabicFont: val.arabicFont || themeConfig.typography.arabicFont,
      englishFont: val.englishFont || themeConfig.typography.englishFont,
      headingFont: val.headingFont || themeConfig.typography.headingFont,
      bodyFont: val.bodyFont || themeConfig.typography.bodyFont,
    },
    tokens: {
      borderRadius: val.borderRadius || themeConfig.tokens.borderRadius,
      buttonRadius: val.buttonRadius || themeConfig.tokens.buttonRadius,
      cardRadius: val.cardRadius || themeConfig.tokens.cardRadius,
      shadowIntensity: (val.shadowIntensity as DesignTokens['shadowIntensity']) || themeConfig.tokens.shadowIntensity,
      containerWidth: val.containerWidth || themeConfig.tokens.containerWidth,
      sectionSpacing: val.sectionSpacing || themeConfig.tokens.sectionSpacing,
    },
  };
}

export async function saveBranding(data: BrandingData): Promise<{ error: string | null }> {
  const flat = {
    ...data.branding,
    ...data.typography,
    ...data.tokens,
  };
  return saveSetting('branding', flat);
}

// ============ Navigation ============

export async function fetchNavigationItems(): Promise<NavigationItemDB[]> {
  const { data, error } = await supabase.from('navigation_items').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbNavItem[]).map(mapNavItem);
}

export async function fetchEnabledNavItems(): Promise<NavigationItemDB[]> {
  const { data, error } = await supabase.from('navigation_items')
    .select('*').eq('enabled', true).order('sort_order', { ascending: true });
  if (error) return [];
  return (data as DbNavItem[]).map(mapNavItem);
}

export async function createNavigationItem(n: Partial<NavigationItemDB>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('navigation_items').insert({
    id: genId(), ...toDbNavItem(n), created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updateNavigationItem(id: string, n: Partial<NavigationItemDB>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('navigation_items')
    .update({ ...toDbNavItem(n), updated_at: now() }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteNavigationItem(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('navigation_items').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ SEO ============

export async function fetchSeoSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from('seo_settings').select('key, value');
  if (error || !data) return {};
  const result: Record<string, unknown> = {};
  for (const row of data as { key: string; value: unknown }[]) {
    result[row.key] = row.value;
  }
  return result;
}

export async function saveSeoSetting(key: string, value: unknown): Promise<{ error: string | null }> {
  const { data: existing } = await supabase.from('seo_settings').select('id').eq('key', key).maybeSingle();
  if (existing) {
    const { error } = await supabase.from('seo_settings')
      .update({ value, updated_at: now() }).eq('key', key);
    return { error: error?.message || null };
  }
  const { error } = await supabase.from('seo_settings').insert({
    key, value, updated_at: now(),
  });
  return { error: error?.message || null };
}

// ============ Media Library ============

export async function fetchMediaItems(): Promise<MediaItem[]> {
  const { data, error } = await supabase.from('media_items').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbMediaItem[]).map(mapMediaItem);
}

export async function uploadMediaFile(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${genId()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
  if (uploadError) return { url: null, error: uploadError.message };

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
  const url = urlData.publicUrl;

  const { error: dbError } = await supabase.from('media_items').insert({
    id: genId(), url, name: file.name, format: ext,
    width: 0, height: 0, size: file.size, category: 'image',
    created_at: now(),
  });
  if (dbError) return { url: null, error: dbError.message };

  return { url, error: null };
}

export async function deleteMediaItem(id: string, url: string): Promise<{ error: string | null }> {
  const fileName = url.split('/media/').pop();
  if (fileName) {
    await supabase.storage.from('media').remove([fileName]);
  }
  const { error } = await supabase.from('media_items').delete().eq('id', id);
  return { error: error?.message || null };
}

// ============ User Management (via edge function — needs service role) ============

function getEdgeFunctionUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return `${baseUrl}/functions/v1/user-management`;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

async function edgeFetch(path: string, init?: RequestInit): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${getEdgeFunctionUrl()}${path}`, { ...init, headers });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: (json as { error?: string }).error || `Request failed (${res.status})` };
    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function fetchUsers(): Promise<UserProfile[]> {
  const result = await edgeFetch('');
  if (!result.ok) throw new Error(result.error || 'Failed to fetch users');
  const data = result.data as { users: UserProfile[] };
  return data.users || [];
}

export async function createUser(email: string, password: string, fullName: string, role: UserRole): Promise<{ error: string | null }> {
  const result = await edgeFetch('', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, role }),
  });
  return { error: result.ok ? null : result.error || 'Failed to create user' };
}

export async function updateUser(id: string, updates: { fullName?: string; role?: UserRole; isActive?: boolean }): Promise<{ error: string | null }> {
  const result = await edgeFetch('', {
    method: 'PUT',
    body: JSON.stringify({ id, fullName: updates.fullName, role: updates.role, isActive: updates.isActive }),
  });
  return { error: result.ok ? null : result.error || 'Failed to update user' };
}

export async function deleteUser(id: string, userId: string): Promise<{ error: string | null }> {
  const result = await edgeFetch('', {
    method: 'DELETE',
    body: JSON.stringify({ id, userId }),
  });
  return { error: result.ok ? null : result.error || 'Failed to delete user' };
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<{ error: string | null }> {
  const result = await edgeFetch('?action=reset-password', {
    method: 'POST',
    body: JSON.stringify({ userId, newPassword }),
  });
  return { error: result.ok ? null : result.error || 'Failed to reset password' };
}

// ============ Pages & Sections ============

interface DbPage {
  id: string; slug: string; title: LocalizedString; content: Record<string, unknown>;
  sections: PageSectionDB[]; status: string; seo: Record<string, unknown>;
  sort_order: number; created_at: string; updated_at: string;
}

interface PageSectionDB {
  id: string; type: string; enabled: boolean; order: number;
  title?: LocalizedString; subtitle?: LocalizedString; config?: Record<string, unknown>;
}

export async function fetchPages(): Promise<PageConfig[]> {
  const { data, error } = await supabase.from('pages').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as DbPage[]).map(mapPage);
}

export async function fetchPageBySlug(slug: string): Promise<PageConfig | null> {
  const { data } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return mapPage(data as DbPage);
}

export async function createPage(page: Partial<PageConfig>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('pages').insert({
    id: genId(), slug: page.slug, title: page.title, content: {},
    sections: (page.sections || []).map(sectionToDb),
    status: 'published', seo: page.seo as Record<string, unknown> || {},
    sort_order: 0, created_at: now(), updated_at: now(),
  });
  return { error: error?.message || null };
}

export async function updatePage(id: string, page: Partial<PageConfig>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('pages').update({
    slug: page.slug, title: page.title,
    sections: (page.sections || []).map(sectionToDb),
    seo: page.seo as Record<string, unknown>,
    updated_at: now(),
  }).eq('id', id);
  return { error: error?.message || null };
}

export async function deletePage(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  return { error: error?.message || null };
}

export async function updatePageSections(id: string, sections: PageSection[]): Promise<{ error: string | null }> {
  const { error } = await supabase.from('pages').update({
    sections: sections.map(sectionToDb),
    updated_at: now(),
  }).eq('id', id);
  return { error: error?.message || null };
}

function sectionToDb(s: PageSection): PageSectionDB {
  return {
    id: s.id, type: s.type, enabled: s.enabled, order: s.order,
    title: s.title, subtitle: s.subtitle, config: s.config,
  };
}

function mapPage(r: DbPage): PageConfig {
  return {
    id: r.id, slug: r.slug, title: r.title,
    sections: (r.sections || []).map((s) => ({
      id: s.id, type: s.type as SectionType, enabled: s.enabled, order: s.order,
      title: s.title, subtitle: s.subtitle, config: s.config,
    })),
    seo: r.seo as PageConfig['seo'], enabled: r.status === 'published',
  };
}

// ============ Site Content (editable text blocks) ============

export async function fetchAllSiteContent(): Promise<Record<string, LocalizedString>> {
  const { data } = await supabase.from('site_content').select('*');
  if (!data) return {};
  const map: Record<string, LocalizedString> = {};
  for (const row of data) {
    map[row.key] = row.value as LocalizedString;
  }
  return map;
}

export async function fetchSiteContentByCategory(category: string): Promise<Record<string, LocalizedString>> {
  const { data } = await supabase.from('site_content').select('*').eq('category', category).order('sort_order', { ascending: true });
  if (!data) return {};
  const map: Record<string, LocalizedString> = {};
  for (const row of data) {
    map[row.key] = row.value as LocalizedString;
  }
  return map;
}

export async function fetchSiteContentItem(key: string): Promise<LocalizedString | null> {
  const { data } = await supabase.from('site_content').select('*').eq('key', key).maybeSingle();
  if (!data) return null;
  return data.value as LocalizedString;
}

export async function updateSiteContent(key: string, value: LocalizedString): Promise<{ error: string | null }> {
  const { error } = await supabase.from('site_content').update({ value, updated_at: now() }).eq('key', key);
  return { error: error?.message || null };
}

export async function fetchSiteContentList(): Promise<{ id: string; key: string; value: LocalizedString; category: string; label: string; sort_order: number }[]> {
  const { data } = await supabase.from('site_content').select('*').order('category', { ascending: true }).order('sort_order', { ascending: true });
  if (!data) return [];
  return data.map((r) => ({
    id: r.id, key: r.key, value: r.value as LocalizedString,
    category: r.category, label: r.label, sort_order: r.sort_order,
  }));
}

// ============ Helper ============

export function emptyLocalizedString(): LocalizedString {
  return { ar: '', en: '' };
}
