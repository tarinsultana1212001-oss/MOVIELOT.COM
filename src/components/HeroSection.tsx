import React, { useState, useEffect } from 'react';
import { Play, Info, Bookmark, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { MediaItem } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { RatingBadge } from './RatingBadge';

interface HeroSectionProps {
  featuredItems: MediaItem[];
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredItems,
  onSelectMovie,
  onPlayTrailer
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const items = featuredItems.slice(0, 5);
  const activeItem = items[currentIndex] || items[0];

  useEffect(() => {
    if (items.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [items.length, isHovered]);

  if (!activeItem) {
    return (
      <div className="w-full h-[65vh] min-h-[500px] bg-zinc-900 animate-pulse rounded-3xl" />
    );
  }

  const favorited = isFavorite(activeItem.id);
  const year = activeItem.releaseDate ? activeItem.releaseDate.slice(0, 4) : '';

  return (
    <div
      id="hero-banner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[70vh] min-h-[550px] max-h-[750px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group select-none"
    >
      {/* Dynamic Cinematic Backdrop */}
      <div className="absolute inset-0 bg-black">
        <img
          key={activeItem.id}
          src={activeItem.backdropPath || activeItem.posterPath}
          alt={activeItem.title}
          className="w-full h-full object-cover object-center filter brightness-[0.75] transition-all duration-1000 ease-out scale-105 group-hover:scale-100 animate-fadeIn"
        />
        {/* Layered Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b10] via-[#090b10]/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-black">
              Featured {activeItem.mediaType === 'tv' ? 'Series' : 'Movie'}
            </span>
            <RatingBadge rating={activeItem.voteAverage} size="md" />
            {year && <span className="text-xs font-semibold text-zinc-300">{year}</span>}
            {activeItem.runtime ? (
              <span className="text-xs text-zinc-400">{activeItem.runtime} min</span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md font-['Space_Grotesk']">
            {activeItem.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
            {activeItem.genres.map((g) => (
              <span
                key={g.id}
                className="px-2.5 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-xl">
            {activeItem.overview}
          </p>

          {/* Prominent Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onPlayTrailer(activeItem)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={17} className="fill-current" />
              <span>Watch Trailer</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMovie(activeItem)}
              className="px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm flex items-center gap-2 border border-zinc-700 backdrop-blur-md hover:border-zinc-500 transition-all cursor-pointer"
            >
              <Info size={17} />
              <span>Full Details</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(activeItem)}
              title={favorited ? 'In Watchlist' : 'Add to Watchlist'}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                favorited
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              {favorited ? <Check size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Rotation Indicator Tabs & Arrows */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-20 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous featured movie"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1 px-1">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-6 bg-amber-500' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next featured movie"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
