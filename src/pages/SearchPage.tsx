import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter, SlidersHorizontal, Film, Tv, Star, AlertCircle } from 'lucide-react';
import { MediaItem, Genre } from '../types';
import { apiClient } from '../services/apiClient';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';

interface SearchPageProps {
  initialQuery?: string;
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onSelectMovie,
  onPlayTrailer
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenreId, setSelectedGenreId] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'releaseDate' | 'title'>('popularity');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load genres
  useEffect(() => {
    apiClient.getGenres().then(setGenres).catch(console.error);
  }, []);

  // Debounced search trigger
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // If query is empty, show top trending as discover state
      setLoading(true);
      apiClient.getTrending(mediaType, 'week').then((items) => {
        setResults(items);
        setLoading(false);
        setHasSearched(false);
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiClient.search(trimmed, mediaType, 1);
        setResults(data.results);
        setHasSearched(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, mediaType]);

  // Client-side refinement: filter by genre, year, rating, and sort
  const filteredResults = useMemo(() => {
    return results
      .filter((item) => {
        if (selectedGenreId !== 'all') {
          if (!item.genres?.some((g) => g.id === selectedGenreId)) return false;
        }
        if (selectedYear !== 'all') {
          if (!item.releaseDate?.startsWith(selectedYear)) return false;
        }
        if (minRating > 0) {
          if (item.voteAverage < minRating) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.voteAverage - a.voteAverage;
        if (sortBy === 'releaseDate') {
          return new Date(b.releaseDate || '').getTime() - new Date(a.releaseDate || '').getTime();
        }
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default popularity / vote count
        return (b.voteCount || 0) - (a.voteCount || 0);
      });
  }, [results, selectedGenreId, selectedYear, minRating, sortBy]);

  const handleResetFilters = () => {
    setSelectedGenreId('all');
    setSelectedYear('all');
    setMinRating(0);
    setSortBy('popularity');
  };

  const yearsList = ['2026', '2025', '2024', '2023', '2022', '2020', '2019', '2015', '2010', '2000'];

  return (
    <div id="search-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Search Header Banner */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Search Discovery Catalog
        </h1>
        <p className="text-sm text-zinc-400">
          Find movies, TV shows, actors, and directors across verified cinematic libraries.
        </p>
      </div>

      {/* Main Search Input Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center bg-[#10141d] border border-zinc-750 focus-within:border-amber-500 rounded-2xl p-2 shadow-2xl transition-all">
          <Search size={22} className="text-zinc-400 ml-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, director, actor, genre (e.g. 'Dune', 'Nolan', 'Sci-Fi')..."
            className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-[#0f131a] border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        {/* Media Type Filter Tabs */}
        <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMediaType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              mediaType === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Titles
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
            <span>TV Series</span>
          </button>
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Genre */}
          <select
            value={selectedGenreId}
            onChange={(e) => setSelectedGenreId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-zinc-700"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-zinc-700"
          >
            <option value="all">All Years</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Rating */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-zinc-700"
          >
            <option value={0}>Any Rating</option>
            <option value={8}>8.0+ ⭐ Exceptional</option>
            <option value={7}>7.0+ ⭐ Good</option>
            <option value={6}>6.0+ ⭐ Decent</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-zinc-700"
          >
            <option value="popularity">Sort: Most Popular</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="releaseDate">Sort: Newest Release</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          {(selectedGenreId !== 'all' || selectedYear !== 'all' || minRating > 0 || sortBy !== 'popularity') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header / Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          {hasSearched ? `Found ${filteredResults.length} matches for "${query}"` : `Discovering Top Picks (${filteredResults.length})`}
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredResults.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onSelect={onSelectMovie}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-200">No titles found</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
              We couldn&apos;t find any movies or TV series matching &ldquo;{query}&rdquo; with your current filter criteria.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              handleResetFilters();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};
