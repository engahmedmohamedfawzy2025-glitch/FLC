'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { homepageSections } from '@/config/pages.config';
import { fetchPageBySlug } from '@/lib/content';
import type { PageSection, Locale } from '@/types';

export function HomepageView({ locale }: { locale: Locale }) {
  const [sections, setSections] = useState<PageSection[]>([]);

  useEffect(() => {
    fetchPageBySlug('home').then((page) => {
      if (page && page.sections && page.sections.length > 0) {
        setSections(page.sections.filter((section) => section.type !== 'cta').sort((a, b) => a.order - b.order));
      } else {
        setSections([...homepageSections].sort((a, b) => a.order - b.order));
      }
    }).catch(() => {
      setSections([...homepageSections].sort((a, b) => a.order - b.order));
    });
  }, []);

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      <Header />
      <main>
        {sorted.map((section) => (
          <SectionRenderer key={section.id} section={section} locale={locale} />
        ))}
      </main>
      <Footer />
    </>
  );
}
