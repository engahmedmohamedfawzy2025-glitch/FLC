'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/layout/locale-provider';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProducts } from '@/lib/content';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/lists/product-card';
import { HorizontalCarousel } from '@/components/ui/horizontal-carousel';
import type { Locale, LocalizedString, Product } from '@/types';

export function ProductsSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const { dir } = useLocale();
  const prefix = `/${locale}`;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.filter((p) => p.status === 'published'));
    }).catch(() => setProducts([]));
  }, []);
  const sectionTitle = title ? localized(title, locale) : t('products.title', locale);
  const sectionSubtitle = t('products.subtitle', locale);

  return (
    <section className="section-spacing section-divider bg-background">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionSubtitle}
          </p>
        </ScrollReveal>

        {products.length > 0 && (
          <HorizontalCarousel itemsCount={products.length} locale={locale}>
            {products.map((prod) => (
              <div key={prod.id} className="snap-start h-full shrink-0 w-[300px] sm:w-[340px]">
                <ProductCard product={prod} locale={locale} />
              </div>
            ))}
          </HorizontalCarousel>
        )}

        <div className="text-center mt-10">
          <Link
            href={`${prefix}/products`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {t('common.viewAll', locale)}
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4 rtl-flip" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
