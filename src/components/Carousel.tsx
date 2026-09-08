import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  children: React.ReactNode;
  id?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  onViewAll,
  viewAllLabel = 'View All',
  children,
  id
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  };

  return (
    <section id={id} className="w-full relative group/section">
      {/* Header Bar */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 ml-3.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors mr-2 cursor-pointer"
            >
              {viewAllLabel} →
            </button>
          )}

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`p-2 rounded-full border border-zinc-700/80 bg-[#151922] transition-all duration-150 ${
                canScrollLeft
                  ? 'text-zinc-200 hover:bg-zinc-800 hover:border-zinc-500 cursor-pointer active:scale-95'
                  : 'text-zinc-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`p-2 rounded-full border border-zinc-700/80 bg-[#151922] transition-all duration-150 ${
                canScrollRight
                  ? 'text-zinc-200 hover:bg-zinc-800 hover:border-zinc-500 cursor-pointer active:scale-95'
                  : 'text-zinc-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Scroller */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  );
};
