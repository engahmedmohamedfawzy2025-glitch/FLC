import './globals.css';
import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { LocaleProvider } from '@/components/layout/locale-provider';
import { seoConfig } from '@/config/seo.config';
import { fetchSeoSettings } from '@/lib/content';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  let title = seoConfig.title?.en || 'TechNova';
  let description = seoConfig.description?.en || '';
  let ogImage = seoConfig.ogImage || '/og-image.jpg';

  try {
    const settings = await fetchSeoSettings();
    const s = settings as Record<string, unknown>;
    if (s.title && typeof s.title === 'object' && 'en' in s.title) {
      title = (s.title as { en: string }).en || title;
    }
    if (s.description && typeof s.description === 'object' && 'en' in s.description) {
      description = (s.description as { en: string }).en || description;
    }
    if (typeof s.ogImage === 'string') {
      ogImage = s.ogImage;
    }
  } catch {
    // Fall back to static config
  }

  return {
    title,
    description,
    openGraph: {
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [{ url: ogImage }],
    },
    icons: {
      icon: '/favicon.svg',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} font-sans`}>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
