'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';
import { localized } from '@/config/i18n.config';
import type { Locale, Project } from '@/types';

const ACCENT = '#32E0C4';

export function ProjectCard({
  project,
  locale,
  showSlider = false,
}: {
  project: Project;
  locale: Locale;
  showSlider?: boolean;
}) {
  const prefix = `/${locale}`;
  const isRtl = locale === 'ar';

  const allImages = showSlider
    ? [...(project.images || []), ...(project.gallery || [])]
    : (project.images && project.images.length > 0 ? [project.images[0]] : []);

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

  const title = localized(project.title, locale);
  const hasImages = allImages.length > 0;
  const showArrows = showSlider && allImages.length > 1;
  const showDots = showSlider && allImages.length > 1;

  return (
    <Link
      href={`${prefix}/projects/${project.slug}`}
      className="group flex h-full min-h-[470px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#132030] hover:border-[#32E0C4]/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Media header */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1B3B6F]/30 to-[#0A1118]">
            <span className="text-4xl font-bold" style={{ color: ACCENT, opacity: 0.3 }}>
              {title.charAt(0)}
            </span>
          </div>
        )}

        {/* Year badge - top-left */}
        <span className="absolute top-3 start-3 z-10 text-lg font-bold text-white drop-shadow-lg">
          {project.year}
        </span>

        {/* Category badge - bottom-right */}
        <span className="absolute bottom-3 end-3 z-10 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/10">
          {localized(project.category, locale)}
        </span>

        {/* Slider arrows */}
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

        {/* Dot indicators */}
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

      {/* Content area */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-white/90 line-clamp-2">
          {title}
        </h3>

        {/* Client row */}
        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
          <Building2 className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
          {project.client}
        </div>

        {/* Location row */}
        <div className="mt-1.5 flex items-center gap-2 text-sm text-neutral-400">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
          {localized(project.location, locale)}
        </div>

        {/* Summary description */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-400 line-clamp-2">
          {localized(project.description, locale)}
        </p>

        {/* Results / Impact tags */}
        {project.results && project.results.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {project.results.slice(0, 3).map((r, i) => (
              <span
                key={i}
                className="rounded-lg border border-teal-500/30 bg-teal-950/40 px-3 py-1.5 text-xs font-semibold text-teal-300"
              >
                {localized(r, locale)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
