import React, { useState, useEffect } from 'react';
import { MediaItem, Genre } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { Tv, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

interface TVShowsPageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const TVShowsPage: React.FC<TVShowsPageProps> = ({
  onSelectMovie,
  onPlayTrailer
}) => {
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating'>('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadShows() {
      setLoading(true);
      try {
        let res;
        if (selectedGenreId) {
          res = await apiClient.getByGenre(selectedGenreId, 'tv', page);
        } else if (sortBy === 'rating') {
          res = await apiClient.getTopRatedTV(page);
        } else {
          res = await apiClient.getPopularTV(page);
        }

        if (isMounted) {
          setShows(res.results);
          setTotalPages(res.totalPages || 1);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load TV shows:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadShows();
    return () => {
      isMounted = false;
    };
  }, [page, selectedGenreId, sortBy]);

  return (
    <div id="tv-catalog-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Tv size={16} />
            <span>Television Series Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Explore TV Shows
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Immerse yourself in serial narratives, prestige dramas, and comedy favorites across seasons.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
          <span className="text-zinc-500 px-2 flex items-center gap-1">
            <SlidersHorizontal size={13} />
            <span>Sort:</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setSortBy('popularity');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              sortBy === 'popularity' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Popular
          </button>
          <button
            type="button"
            onClick={() => {
              setSortBy('rating');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              sortBy === 'rating' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => {
            setSelectedGenreId(null);
            setPage(1);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedGenreId === null
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          All Genres
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setSelectedGenreId(g.id);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenreId === g.id
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            {g.name}
          </button>
        ))}
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
          {shows.map((item) => (
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

      <AdBanner slotId="tv-catalog-bottom" />
    </div>
  );
};
