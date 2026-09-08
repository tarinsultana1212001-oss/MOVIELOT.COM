import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { TrendingUp, Film, Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

interface PopularPageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const PopularPage: React.FC<PopularPageProps> = ({
  onSelectMovie,
  onPlayTrailer
}) => {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function fetchPopular() {
      setLoading(true);
      try {
        const res = activeTab === 'movie'
          ? await apiClient.getPopularMovies(page)
          : await apiClient.getPopularTV(page);

        if (isMounted) {
          setItems(res.results);
          setTotalPages(res.totalPages || 1);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load popular titles:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, [activeTab, page]);

  return (
    <div id="popular-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingUp size={18} />
            <span>Audience Sensation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Popular Right Now
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Discover the most widely streamed, reviewed, and recommended titles worldwide.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('movie');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'movie' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film size={14} />
            <span>Popular Movies</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('tv');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'tv' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv size={14} />
            <span>Popular TV Shows</span>
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
      ) : (
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

      <AdBanner slotId="popular-bottom" />
    </div>
  );
};
