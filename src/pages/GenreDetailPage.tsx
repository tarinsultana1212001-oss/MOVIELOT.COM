import React, { useState, useEffect } from 'react';
import { ArrowLeft, Film, Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { AdBanner } from '../components/AdBanner';

interface GenreDetailPageProps {
  genreId: number;
  genreName: string;
  onBack: () => void;
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const GenreDetailPage: React.FC<GenreDetailPageProps> = ({
  genreId,
  genreName,
  onBack,
  onSelectMovie,
  onPlayTrailer
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadGenreItems() {
      setLoading(true);
      try {
        const res = await apiClient.getByGenre(genreId, mediaType, page);
        if (isMounted) {
          setItems(res.results);
          setTotalPages(res.totalPages || 1);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load genre items:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadGenreItems();
    return () => {
      isMounted = false;
    };
  }, [genreId, mediaType, page]);

  return (
    <div id={`genre-detail-${genreId}`} className="space-y-8 animate-fadeIn pb-16">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-sm font-medium cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>All Genres</span>
      </button>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <span>Curated Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            {genreName} Titles
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Explore feature films and television series characterized by {genreName.toLowerCase()} themes.
          </p>
        </div>

        {/* Media type toggle */}
        <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMediaType('all');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              mediaType === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('movie');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              mediaType === 'movie' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film size={12} />
            <span>Movies</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType('tv');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              mediaType === 'tv' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv size={12} />
            <span>TV Series</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onSelect={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-zinc-400">
          <p>No titles currently indexed under {genreName} for this filter.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs text-zinc-400 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <AdBanner slotId={`genre-${genreId}-bottom`} />
    </div>
  );
};
