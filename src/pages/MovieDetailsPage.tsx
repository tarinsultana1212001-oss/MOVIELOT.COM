import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Play,
  Share2,
  Clock,
  Calendar,
  DollarSign,
  Building,
  User,
  Film
} from 'lucide-react';
import { MediaItem } from '../types';
import { apiClient } from '../services/apiClient';
import { useFavorites } from '../hooks/useFavorites';
import { RatingBadge } from '../components/RatingBadge';
import { MovieCard } from '../components/MovieCard';
import { Carousel } from '../components/Carousel';
import { AdBanner } from '../components/AdBanner';

interface MovieDetailsPageProps {
  movieId: number;
  initialItem?: MediaItem;
  onBack: () => void;
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
  onShare: (item: MediaItem) => void;
  onSelectGenre: (genreId: number, genreName: string) => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movieId,
  initialItem,
  onBack,
  onSelectMovie,
  onPlayTrailer,
  onShare,
  onSelectGenre
}) => {
  const [movie, setMovie] = useState<MediaItem | null>(initialItem || null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(!initialItem);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function fetchDetails() {
      try {
        setLoading(true);
        const [details, recs] = await Promise.all([
          apiClient.getMovieDetails(movieId),
          apiClient.getRecommendations('movie', movieId)
        ]);

        if (isMounted) {
          setMovie(details);
          setRecommendations(recs);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (loading && !movie) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
        <div className="h-[60vh] bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Movie not found</h2>
        <p className="text-zinc-400">The requested film could not be retrieved from our library.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold"
        >
          Return to previous page
        </button>
      </div>
    );
  }

  const favorited = isFavorite(movie.id);
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : '';

  return (
    <div id={`movie-details-${movie.id}`} className="space-y-12 animate-fadeIn pb-16">
      {/* Back Button Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-sm font-medium cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onShare(movie)}
            className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Share Movie"
          >
            <Share2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(movie)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              favorited
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
            }`}
          >
            {favorited ? <Check size={18} /> : <Bookmark size={18} />}
            <span>{favorited ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Hero Backdrop Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#0c0f16] shadow-2xl">
        <div className="relative h-[45vh] sm:h-[55vh] min-h-[350px] w-full">
          <img
            src={movie.backdropPath || movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f16] via-[#0c0f16]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f16] via-[#0c0f16]/80 to-transparent" />

          {/* Floating Watch Trailer Hero Trigger */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-10">
            <button
              type="button"
              onClick={() => onPlayTrailer(movie)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={18} className="fill-current" />
              <span>Watch Official Trailer</span>
            </button>
          </div>
        </div>

        {/* 2-Column Details Layout */}
        <div className="px-6 sm:px-10 pb-10 -mt-24 sm:-mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-60 shrink-0 rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-900">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {/* Core Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-black">
                    Feature Film
                  </span>
                  <RatingBadge rating={movie.voteAverage} size="md" />
                  {movie.voteCount && (
                    <span className="text-xs text-zinc-400 font-mono">
                      ({movie.voteCount.toLocaleString()} votes)
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
                  {movie.title}
                </h1>

                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="text-xs text-zinc-400">Original Title: {movie.originalTitle}</p>
                )}

                {movie.tagline && (
                  <p className="text-base sm:text-lg italic text-amber-400/90 font-medium">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Quick Specs Pill Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 pt-1">
                {year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-amber-500" />
                    <span>{movie.releaseDate}</span>
                  </div>
                )}
                {movie.runtime ? (
                  <div className="flex items-center gap-1.5">
                    <Clock size={15} className="text-amber-500" />
                    <span>{movie.runtime} minutes ({Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m)</span>
                  </div>
                ) : null}
                {movie.director && (
                  <div className="flex items-center gap-1.5">
                    <User size={15} className="text-amber-500" />
                    <span>Director: <strong className="text-white">{movie.director}</strong></span>
                  </div>
                )}
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onSelectGenre(g.id, g.name)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-800/90 text-zinc-200 border border-zinc-700/80 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
                  >
                    {g.name}
                  </button>
                ))}
              </div>

              {/* Synopsis */}
              <div className="pt-3 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Synopsis</h3>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-200 max-w-3xl">
                  {movie.overview}
                </p>
              </div>

              {/* Financials & Production details */}
              {(movie.budget || movie.revenue || movie.productionCompanies?.length) && (
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800/80 text-xs">
                  {movie.budget ? (
                    <div>
                      <span className="text-zinc-500 block">Production Budget</span>
                      <span className="text-zinc-200 font-semibold text-sm">
                        ${(movie.budget / 1000000).toFixed(0)} Million
                      </span>
                    </div>
                  ) : null}
                  {movie.revenue ? (
                    <div>
                      <span className="text-zinc-500 block">Box Office Gross</span>
                      <span className="text-emerald-400 font-semibold text-sm">
                        ${(movie.revenue / 1000000).toFixed(0)} Million
                      </span>
                    </div>
                  ) : null}
                  {movie.productionCompanies && movie.productionCompanies.length > 0 ? (
                    <div>
                      <span className="text-zinc-500 block">Studio</span>
                      <span className="text-zinc-200 font-semibold text-sm line-clamp-1">
                        {movie.productionCompanies.join(', ')}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Billed Cast Grid */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Principal Cast
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {movie.cast.map((actor) => (
              <div
                key={actor.id}
                className="p-3 rounded-2xl bg-[#121620] border border-zinc-800 flex flex-col items-center text-center gap-2 group hover:border-zinc-700 transition-colors"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 group-hover:border-amber-500/50 transition-colors">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <User size={28} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-100 line-clamp-1">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Crew Members */}
      {movie.crew && movie.crew.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Key Crew & Creative Team
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {movie.crew.map((member, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#121620] border border-zinc-800"
              >
                <span className="text-[11px] uppercase tracking-wider text-amber-500 font-bold block">
                  {member.job}
                </span>
                <span className="text-sm font-semibold text-zinc-100 block mt-1">
                  {member.name}
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  {member.department}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Official Trailers Gallery */}
      {movie.trailers && movie.trailers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Film className="text-amber-500" size={20} />
              Trailers & Previews
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movie.trailers.map((trailer) => (
              <div
                key={trailer.id}
                onClick={() => onPlayTrailer(movie)}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer"
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                  alt={trailer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={20} className="fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h4 className="text-xs font-semibold text-zinc-100 line-clamp-1">{trailer.name}</h4>
                  <span className="text-[10px] text-zinc-400">{trailer.type} • YouTube</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Titles Carousel */}
      {recommendations.length > 0 && (
        <Carousel
          title="Recommended If You Liked This"
          subtitle="Hand-picked similar masterworks sharing creative DNA and genre depth."
        >
          {recommendations.map((item) => (
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

      {/* Monetization Slot */}
      <AdBanner slotId="movie-detail-bottom" />
    </div>
  );
};
