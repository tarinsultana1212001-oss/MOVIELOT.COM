import React, { useState } from 'react';
import { Bookmark, Film, Tv, Play } from 'lucide-react';
import { MediaItem } from '../types';
import { RatingBadge } from './RatingBadge';
import { useFavorites } from '../hooks/useFavorites';

interface MovieCardProps {
  item: MediaItem;
  onSelect?: (item: MediaItem) => void;
  onPlayTrailer?: (item: MediaItem) => void;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  onSelect,
  onPlayTrailer
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorited = isFavorite(item.id);
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : '';
  const primaryGenre = item.genres?.[0]?.name;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(item);
    } else if (onSelect) {
      onSelect(item);
    }
  };

  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600';
  const posterSrc = imgError || !item.posterPath ? fallbackPoster : item.posterPath;

  return (
    <div
      id={`media-card-${item.id}`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${item.title} (${year}), Rating ${item.voteAverage}`}
      className="group relative flex flex-col bg-[#121620] rounded-xl overflow-hidden border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer select-none"
    >
      {/* Poster Media Frame */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-zinc-800/60 flex items-center justify-center">
            {item.mediaType === 'tv' ? <Tv className="text-zinc-600" size={32} /> : <Film className="text-zinc-600" size={32} />}
          </div>
        )}

        <img
          src={posterSrc}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Media Type Pill */}
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
            {item.mediaType === 'tv' ? <Tv size={10} /> : <Film size={10} />}
            {item.mediaType === 'tv' ? 'TV' : 'Movie'}
          </span>

          {/* Rating */}
          <RatingBadge rating={item.voteAverage} size="sm" />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <button
            type="button"
            onClick={handleTrailerClick}
            className="pointer-events-auto p-3.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 transition-transform"
            title="Watch Trailer"
            aria-label="Play Trailer"
          >
            <Play size={20} className="fill-current ml-0.5" />
          </button>
        </div>

        {/* Favorite Bookmark Toggle Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md transition-all duration-200 ${
            favorited
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80 border border-white/10'
          }`}
          title={favorited ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label={favorited ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark size={15} className={favorited ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Card Metadata Footer */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="font-semibold text-sm text-zinc-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            {year && <span>{year}</span>}
            {year && primaryGenre && <span>•</span>}
            {primaryGenre && <span className="line-clamp-1">{primaryGenre}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#121620] rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
      <div className="aspect-[2/3] w-full bg-zinc-800/60" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-850 rounded w-1/2" />
      </div>
    </div>
  );
};
