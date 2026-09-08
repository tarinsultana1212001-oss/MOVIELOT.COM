import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { Flame, Film, Tv } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

interface TrendingPageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const TrendingPage: React.FC<TrendingPageProps> = ({
  onSelectMovie,
  onPlayTrailer
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function fetchTrending() {
      setLoading(true);
      try {
        const data = await apiClient.getTrending(mediaType, timeWindow);
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load trending items:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, [mediaType, timeWindow]);

  return (
    <div id="trending-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame size={18} />
            <span>Real-Time Velocity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Trending Cinema & Series
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            The most watched, searched, and reviewed releases today and throughout this week.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day / Week switch */}
          <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setTimeWindow('day')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeWindow === 'day' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Trending Today
            </button>
            <button
              type="button"
              onClick={() => setTimeWindow('week')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeWindow === 'week' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>

          {/* Media Type switcher */}
          <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMediaType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                mediaType === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setMediaType('movie')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                mediaType === 'movie' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film size={12} />
              <span>Movies</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaType('tv')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                mediaType === 'tv' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tv size={12} />
              <span>TV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid with Ranking badges */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              <div className="absolute -top-2 -left-2 z-20 w-7 h-7 rounded-lg bg-zinc-950/90 border border-amber-500/50 text-amber-400 text-xs font-black flex items-center justify-center shadow-lg font-mono">
                #{index + 1}
              </div>
              <MovieCard
                item={item}
                onSelect={onSelectMovie}
                onPlayTrailer={onPlayTrailer}
              />
            </div>
          ))}
        </div>
      )}

      <AdBanner slotId="trending-bottom" />
    </div>
  );
};
