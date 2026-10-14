// ============== Core Type System ==============

/** A localized string that supports multiple languages */
export type LocalizedString = Record<string, string>;

/** Supported locale codes */
export type Locale = 'ar' | 'en';

/** Content status lifecycle */
export type ContentStatus = 'draft' | 'published' | 'archived';

/** Generic SEO metadata attached to any content entity */
export interface SEOData {
  title?: LocalizedString;
  description?: LocalizedString;
  canonical?: string;
  ogImage?: string;
  robots?: 'index, follow' | 'noindex, nofollow' | 'index, nofollow' | 'noindex, follow';
  keywords?: LocalizedString;
}

// ============== Site Identity ==============

export interface SiteIdentity {
  companyName: LocalizedString;
  legalName: LocalizedString;
  tagline: LocalizedString;
  shortDescription: LocalizedString;
  logo: string;
  logoDark: string;
  logoLight: string;
  favicon: string;
  appleTouchIcon: string;
  socialSharingImage: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: LocalizedString;
  googleMapsUrl: string;
  businessHours: LocalizedString;
}

export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

// ============== Branding / Theme ==============

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export interface TypographyConfig {
  arabicFont: string;
  englishFont: string;
  headingFont: string;
  bodyFont: string;
}

export interface DesignTokens {
  borderRadius: string;
  buttonRadius: string;
  cardRadius: string;
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  containerWidth: string;
  sectionSpacing: string;
}

export interface ThemeConfig {
  branding: BrandingConfig;
  typography: TypographyConfig;
  tokens: DesignTokens;
}

// ============== Navigation ==============

export interface NavItem {
  id: string;
  label: LocalizedString;
  type: 'internal' | 'external' | 'cta';
  url?: string;
  enabled: boolean;
  order: number;
  icon?: string;
  description?: LocalizedString;
  children?: NavChild[];
}

export interface NavChild {
  id: string;
  label: LocalizedString;
  description?: LocalizedString;
  url: string;
  icon?: string;
  order: number;
}

// ============== Content Entities ==============

export interface Product {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  category: LocalizedString;
  features: LocalizedString[];
  specifications: { key: LocalizedString; value: LocalizedString }[];
  images: string[];
  gallery: string[];
  documents: { name: string; url: string }[];
  detailedContent: LocalizedString;
  relatedSolutions: string[];
  relatedProjects: string[];
  seo: SEOData;
  status: ContentStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Solution {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  features: LocalizedString[];
  benefits: LocalizedString[];
  applications: LocalizedString[];
  images: string[];
  gallery: string[];
  detailedContent: LocalizedString;
  icon?: string;
  relatedProducts: string[];
  relatedProjects: string[];
  seo: SEOData;
  status: ContentStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  features: LocalizedString[];
  icon?: string;
  image?: string;
  gallery: string[];
  detailedContent: LocalizedString;
  order: number;
  seo: SEOData;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  client: string;
  category: LocalizedString;
  location: LocalizedString;
  year: string;
  description: LocalizedString;
  scope: LocalizedString[];
  results: LocalizedString[];
  images: string[];
  gallery: string[];
  detailedContent: LocalizedString;
  featured: boolean;
  seo: SEOData;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: LocalizedString;
  category: string;
  order: number;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  detailedContent: LocalizedString;
  featuredImage: string;
  gallery: string[];
  author: string;
  date: string;
  category: LocalizedString;
  featured: boolean;
  seo: SEOData;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Stat {
  id: string;
  label: LocalizedString;
  value: string;
  suffix: string;
  icon?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: LocalizedString;
  company: string;
  content: LocalizedString;
  avatar?: string;
  rating: number;
  order: number;
}

// ============== Page Builder ==============

export type SectionType =
  | 'hero'
  | 'about'
  | 'stats'
  | 'solutions'
  | 'products'
  | 'projects'
  | 'clients'
  | 'services'
  | 'testimonials'
  | 'news'
  | 'cta'
  | 'contact'
  | 'custom';

export interface PageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  title?: LocalizedString;
  subtitle?: LocalizedString;
  config?: Record<string, unknown>;
}

export interface PageConfig {
  id: string;
  slug: string;
  title: LocalizedString;
  sections: PageSection[];
  seo: SEOData;
  enabled: boolean;
}

// ============== Feature Flags ==============

export interface FeatureFlags {
  clients: boolean;
  testimonials: boolean;
  projects: boolean;
  news: boolean;
  services: boolean;
  products: boolean;
  solutions: boolean;
  whatsapp: boolean;
  darkMode: boolean;
}

// ============== Media ==============

export interface MediaPreset {
  name: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatio: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  format: string;
  width: number;
  height: number;
  size: number;
  category: string;
  uploadedAt: string;
}

// ============== Contact Form ==============

export interface ContactFormField {
  id: string;
  name: string;
  label: LocalizedString;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  enabled: boolean;
  placeholder?: LocalizedString;
  options?: string[];
  order: number;
}

export interface ContactFormConfig {
  fields: ContactFormField[];
  successMessage: LocalizedString;
  errorMessage: LocalizedString;
  destinationEmail: string;
}

// ============== Full Site Config ==============

export interface SiteConfig {
  identity: SiteIdentity;
  contact: ContactInfo;
  social: SocialLinks;
  features: FeatureFlags;
  defaultLocale: Locale;
  locales: Locale[];
}

// ============== User Management ==============

export type UserRole = 'super_admin' | 'admin';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

// ============== DB Navigation Item ==============

export interface NavigationItemDB {
  id: string;
  label: LocalizedString;
  href: string;
  parentId: string | null;
  icon: string;
  enabled: boolean;
  sortOrder: number;
  isExternal: boolean;
}

// ============== Footer ==============

export interface FooterConfig {
  description: LocalizedString;
  columns: {
    id: string;
    title: LocalizedString;
    links: { label: LocalizedString; url: string }[];
  }[];
  legalLinks: { label: LocalizedString; url: string }[];
  copyright: LocalizedString;
}
