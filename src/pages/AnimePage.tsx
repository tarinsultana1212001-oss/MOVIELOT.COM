import React, { useState, useEffect } from 'react';
import { MediaItem, Genre } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { Sparkles, Play, Star, ChevronLeft, ChevronRight, SlidersHorizontal, Flame } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

interface AnimePageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const AnimePage: React.FC<AnimePageProps> = ({
  onSelectMovie,
  onPlayTrailer
}) => {
  const [animeList, setAnimeList] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [subCategory, setSubCategory] = useState<'all' | 'shonen' | 'fantasy' | 'movies' | 'series'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest'>('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [featuredAnime, setFeaturedAnime] = useState<MediaItem | null>(null);

  useEffect(() => {
    apiClient.getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadAnime() {
      setLoading(true);
      try {
        let res;
        if (selectedGenreId) {
          res = await apiClient.getByGenre(selectedGenreId, 'anime', page);
        } else if (sortBy === 'rating') {
          res = await apiClient.getTopRatedAnime(page);
        } else {
          res = await apiClient.getPopularAnime(page);
        }

        if (isMounted) {
          let filtered = res.results;
          if (subCategory === 'movies') {
            filtered = filtered.filter(item => !item.seasonsCount || item.seasonsCount === 0 || item.runtime && item.runtime > 80);
          } else if (subCategory === 'series') {
            filtered = filtered.filter(item => (item.seasonsCount && item.seasonsCount > 0) || (item.episodesCount && item.episodesCount > 1));
          } else if (subCategory === 'shonen') {
            filtered = filtered.filter(item => item.genres.some(g => ['action', 'adventure', 'fantasy'].includes(g.name.toLowerCase())));
          } else if (subCategory === 'fantasy') {
            filtered = filtered.filter(item => item.genres.some(g => ['fantasy', 'sci-fi', 'mystery'].includes(g.name.toLowerCase())));
          }

          setAnimeList(filtered);
          if (filtered.length > 0 && !featuredAnime) {
            setFeaturedAnime(filtered[0]);
          }
          setTotalPages(res.totalPages || 1);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load anime catalog:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadAnime();
    return () => { isMounted = false; };
  }, [page, sortBy, selectedGenreId, subCategory]);

  return (
    <div className="space-y-10 pb-16">
      {/* Featured Anime Billboard */}
      {featuredAnime && (
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredAnime.backdropPath || featuredAnime.posterPath}
              alt={featuredAnime.title}
              className="w-full h-full object-cover object-top opacity-35 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Featured Anime Spotlight
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featuredAnime.title}
            </h1>

            {featuredAnime.originalTitle && featuredAnime.originalTitle !== featuredAnime.title && (
              <p className="text-sm font-medium text-amber-400/90 tracking-wide">
                {featuredAnime.originalTitle}
              </p>
            )}

            <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-2xl">
              {featuredAnime.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-bold text-sm border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {featuredAnime.voteAverage.toFixed(1)}
              </div>

              {featuredAnime.seasonsCount && (
                <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                  {featuredAnime.seasonsCount} Season{featuredAnime.seasonsCount > 1 ? 's' : ''} ({featuredAnime.episodesCount || 12} Eps)
                </span>
              )}

              {featuredAnime.genres.map(g => (
                <span key={g.id} className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-400 text-xs font-medium border border-zinc-700/60">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                id="btn-play-featured-anime"
                onClick={() => onPlayTrailer(featuredAnime)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                Watch Trailer
              </button>
              <button
                id="btn-details-featured-anime"
                onClick={() => onSelectMovie(featuredAnime)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-white font-medium text-sm transition-all border border-zinc-700 hover:scale-[1.02] active:scale-95"
              >
                View Details & Cast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Anime Universe
              </h2>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              Explore acclaimed Japanese animation, Shonen epics, Studio Ghibli films, and dark fantasy series.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
              <span>Sort:</span>
              <select
                id="select-anime-sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="popularity" className="bg-zinc-900 text-zinc-100">Most Popular</option>
                <option value="rating" className="bg-zinc-900 text-zinc-100">Highest Rated (IMDb / MAL)</option>
                <option value="newest" className="bg-zinc-900 text-zinc-100">Release Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Anime' },
            { id: 'series', label: 'TV Series' },
            { id: 'movies', label: 'Feature Films' },
            { id: 'shonen', label: 'Action & Shonen' },
            { id: 'fantasy', label: 'Fantasy & Supernatural' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`tab-anime-${cat.id}`}
              onClick={() => {
                setSubCategory(cat.id as any);
                setSelectedGenreId(null);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                subCategory === cat.id && !selectedGenreId
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Quick genre dropdown */}
          <select
            id="select-anime-genre"
            value={selectedGenreId || ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : null;
              setSelectedGenreId(val);
              setPage(1);
            }}
            className="bg-zinc-900/80 text-zinc-300 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="" className="bg-zinc-900">Genre Filter...</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id} className="bg-zinc-900">
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Anime Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {animeList.map((item) => (
            <MovieCard
              key={item.id}
              movie={item}
              onSelect={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-300">No Anime Found</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Try resetting your filters or check back as the admin team uploads new series and cinematic titles.
          </p>
          <button
            onClick={() => {
              setSubCategory('all');
              setSelectedGenreId(null);
              setSortBy('popularity');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            id="btn-anime-prev-page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-xs text-zinc-400 font-medium px-2">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>
          <button
            id="btn-anime-next-page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ad Banner placeholder for monetization */}
      <AdBanner slot="anime-footer" />
    </div>
  );
};
