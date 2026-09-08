import React, { useState, useEffect } from 'react';
import { MediaItem, Genre } from '../types';
import { apiClient } from '../services/apiClient';
import { HeroSection } from '../components/HeroSection';
import { Carousel } from '../components/Carousel';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { AIRecommendationWidget } from '../components/AIRecommendationWidget';
import { AdBanner } from '../components/AdBanner';
import { Flame, Film, Tv, Award, Calendar, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
  onNavigate: (view: string, params?: Record<string, unknown>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovie,
  onPlayTrailer,
  onNavigate
}) => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [trendingWindow, setTrendingWindow] = useState<'day' | 'week'>('day');
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [trendData, popM, popT, upData, topData, genData] = await Promise.all([
          apiClient.getTrending('all', trendingWindow),
          apiClient.getPopularMovies(1),
          apiClient.getPopularTV(1),
          apiClient.getUpcomingMovies(1),
          apiClient.getTopRatedMovies(1),
          apiClient.getGenres()
        ]);

        if (isMounted) {
          setTrending(trendData);
          setPopularMovies(popM.results);
          setPopularTV(popT.results);
          setUpcoming(upData.results);
          setTopRated(topData.results);
          setGenres(genData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [trendingWindow]);

  return (
    <div id="home-page" className="space-y-12 sm:space-y-16">
      {/* Hero Featured Section */}
      <HeroSection
        featuredItems={trending.length > 0 ? trending : popularMovies}
        onSelectMovie={onSelectMovie}
        onPlayTrailer={onPlayTrailer}
      />

      {/* Trending Row with Day / Week Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Flame className="text-amber-500" size={22} />
                Trending Now
              </h2>
            </div>
            <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTrendingWindow('day')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  trendingWindow === 'day' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTrendingWindow('week')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  trendingWindow === 'week' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('trending')}
            className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            Explore All →
          </button>
        </div>

        <Carousel title="" onViewAll={() => onNavigate('trending')}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-44 sm:w-52 shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            : trending.map((item) => (
                <div key={item.id} className="w-44 sm:w-52 shrink-0">
                  <MovieCard
                    item={item}
                    onSelect={onSelectMovie}
                    onPlayTrailer={onPlayTrailer}
                  />
                </div>
              ))}
        </Carousel>
      </div>

      {/* Popular Movies Carousel */}
      <Carousel
        title="Popular Movies"
        subtitle="The most-watched and talked-about feature films right now."
        onViewAll={() => onNavigate('movies')}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-44 sm:w-52 shrink-0">
                <MovieCardSkeleton />
              </div>
            ))
          : popularMovies.map((item) => (
              <div key={item.id} className="w-44 sm:w-52 shrink-0">
                <MovieCard
                  item={item}
                  onSelect={onSelectMovie}
                  onPlayTrailer={onPlayTrailer}
                />
              </div>
            ))}
      </Carousel>

      {/* AI Recommendation Widget Interactive Module */}
      <AIRecommendationWidget
        onSelectMovie={onSelectMovie}
        onPlayTrailer={onPlayTrailer}
      />

      {/* Popular TV Shows Carousel */}
      <Carousel
        title="Binge-Worthy TV Series"
        subtitle="Acclaimed drama, high-stakes thrillers, and award-winning television."
        onViewAll={() => onNavigate('tv')}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-44 sm:w-52 shrink-0">
                <MovieCardSkeleton />
              </div>
            ))
          : popularTV.map((item) => (
              <div key={item.id} className="w-44 sm:w-52 shrink-0">
                <MovieCard
                  item={item}
                  onSelect={onSelectMovie}
                  onPlayTrailer={onPlayTrailer}
                />
              </div>
            ))}
      </Carousel>

      {/* Top Rated Masterpieces Carousel */}
      <Carousel
        title="Top Rated All-Time"
        subtitle="Critical masterworks with exceptional audience acclaim."
        onViewAll={() => onNavigate('movies', { sort: 'rating' })}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-44 sm:w-52 shrink-0">
                <MovieCardSkeleton />
              </div>
            ))
          : topRated.map((item) => (
              <div key={item.id} className="w-44 sm:w-52 shrink-0">
                <MovieCard
                  item={item}
                  onSelect={onSelectMovie}
                  onPlayTrailer={onPlayTrailer}
                />
              </div>
            ))}
      </Carousel>

      {/* Upcoming Releases Carousel */}
      {upcoming.length > 0 && (
        <Carousel
          title="Anticipated Releases"
          subtitle="New cinema arriving in theaters and streaming soon."
          onViewAll={() => onNavigate('movies', { sort: 'releaseDate' })}
        >
          {upcoming.map((item) => (
            <div key={item.id} className="w-44 sm:w-52 shrink-0">
              <MovieCard
                item={item}
                onSelect={onSelectMovie}
                onPlayTrailer={onPlayTrailer}
              />
            </div>
          ))}
        </Carousel>
      )}

      {/* Genre Visual Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
              Explore by Genre
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 ml-3.5">
              Select any mood or style to browse curated collections
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('genres')}
            className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            All Genres →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {genres.slice(0, 12).map((g) => (
            <div
              key={g.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('genre-detail', { genreId: g.id, genreName: g.name })}
              className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer select-none"
            >
              <img
                src={g.backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600'}
                alt={g.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-3.5">
                <span className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                  {g.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monetization Ad Placement */}
      <AdBanner slotId="homepage-bottom" />
    </div>
  );
};
