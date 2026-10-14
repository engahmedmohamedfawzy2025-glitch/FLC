'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { fetchProducts } from '@/lib/content';
import { localized, t } from '@/config/i18n.config';
import { ProductCard } from '@/components/lists/product-card';
import type { Locale, Product } from '@/types';

export function ProductsList({ locale }: { locale: Locale }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.filter((p) => p.status === 'published'));
    }).catch(() => setProducts([]));
  }, []);

  const categories = Array.from(new Set(products.map((p) => localized(p.category, locale))));

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => localized(p.category, locale) === activeCategory);

  return (
    <section className="section-spacing bg-background">
      <div className="container-site">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {t('common.all', locale)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prod, i) => (
            <ScrollReveal key={prod.id} delay={i * 80}>
              <ProductCard product={prod} locale={locale} showSlider />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {t('common.loading', locale)}
          </div>
        )}
      </div>
    </section>
  );
}
