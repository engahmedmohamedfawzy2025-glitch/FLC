'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { localized } from '@/config/i18n.config';
import type { Locale, Solution } from '@/types';

const ACCENT = '#32E0C4';

export function SolutionCard({
  solution,
  locale,
  showSlider = false,
}: {
  solution: Solution;
  locale: Locale;
  showSlider?: boolean;
}) {
  const prefix = `/${locale}`;
  const isRtl = locale === 'ar';

  const allImages = showSlider
    ? [...(solution.images || []), ...(solution.gallery || [])]
    : (solution.images && solution.images.length > 0 ? [solution.images[0]] : []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    const len = allImages.length;
    if (len === 0) return;
    setCurrentSlide((index + len) % len);
  }, [allImages.length]);

  const nextSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToSlide(isRtl ? currentSlide + 1 : currentSlide - 1);
      else goToSlide(isRtl ? currentSlide - 1 : currentSlide + 1);
    }
    touchStartX.current = null;
  };

  const title = localized(solution.title, locale);
  const subtitle = localized(solution.shortDescription, locale);
  const hasImages = allImages.length > 0;
  const showArrows = showSlider && allImages.length > 1;
  const showDots = showSlider && allImages.length > 1;

  return (
    <Link
      href={`${prefix}/solutions/${solution.slug}`}
      className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 hover:border-[#32E0C4]/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden bg-[#0A1118]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasImages ? (
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${isRtl ? currentSlide : -currentSlide}00%)` }}
          >
            {allImages.map((img, i) => (
              <div key={i} className="relative h-full w-full shrink-0">
                <img
                  src={img}
                  alt={`${title} ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1B3B6F]/30 to-[#0A1118]" />
        )}

        {showArrows && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 start-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              aria-label="Previous image"
            >
              {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 end-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              aria-label="Next image"
            >
              {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </>
        )}

        {showDots && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentSlide(i);
                }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? 18 : 6,
                  backgroundColor: i === currentSlide ? ACCENT : 'rgba(255,255,255,0.4)',
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white transition-colors group-hover:text-white/90">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-neutral-400 line-clamp-2">{subtitle}</p>

        {solution.features && solution.features.length > 0 && (
          <ul className="mt-auto space-y-2 pt-4">
            {solution.features.slice(0, 4).map((f, fi) => (
              <li key={fi} className="flex items-center gap-2 text-sm text-neutral-300">
                <Check className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                {localized(f, locale)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
