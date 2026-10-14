'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalCarousel({
  children,
  itemsCount,
  locale,
}: {
  children: React.ReactNode;
  itemsCount: number;
  locale: string;
}) {
  const isRtl = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth - 1;
    setCanScrollPrev(isRtl ? el.scrollLeft < 1 : el.scrollLeft > 1);
    setCanScrollNext(isRtl ? el.scrollLeft > -maxScroll : el.scrollLeft < maxScroll);
  }, [isRtl]);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, itemsCount]);

  const scroll = useCallback((direction: 'prev' | 'next') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    const delta = direction === 'next' ? amount : -amount;
    el.scrollBy({ left: isRtl ? -delta : delta, behavior: 'smooth' });
  }, [isRtl]);

  if (itemsCount === 0) return null;

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <button
        type="button"
        onClick={() => scroll('prev')}
        disabled={!canScrollPrev}
        className="absolute top-1/2 -translate-y-1/2 -start-4 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#132030] border border-white/10 text-white shadow-lg hover:bg-[#1B3B6F] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={() => scroll('next')}
        disabled={!canScrollNext}
        className="absolute top-1/2 -translate-y-1/2 -end-4 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#132030] border border-white/10 text-white shadow-lg hover:bg-[#1B3B6F] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
        style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
      >
        {children}
      </div>
    </div>
  );
}
