import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Play,
  Share2,
  Tv,
  Calendar,
  Layers,
  Star,
  User,
  Film
} from 'lucide-react';
import { MediaItem, TVEpisode, TVSeason } from '../types';
import { apiClient } from '../services/apiClient';
import { useFavorites } from '../hooks/useFavorites';
import { RatingBadge } from '../components/RatingBadge';
import { MovieCard } from '../components/MovieCard';
import { Carousel } from '../components/Carousel';
import { AdBanner } from '../components/AdBanner';

interface TVDetailsPageProps {
  showId: number;
  initialItem?: MediaItem;
  onBack: () => void;
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
  onShare: (item: MediaItem) => void;
  onSelectGenre: (genreId: number, genreName: string) => void;
}

export const TVDetailsPage: React.FC<TVDetailsPageProps> = ({
  showId,
  initialItem,
  onBack,
  onSelectMovie,
  onPlayTrailer,
  onShare,
  onSelectGenre
}) => {
  const [show, setShow] = useState<MediaItem | null>(initialItem || null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [loading, setLoading] = useState(!initialItem);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function fetchDetails() {
      try {
        setLoading(true);
        const [details, recs] = await Promise.all([
          apiClient.getTVDetails(showId),
          apiClient.getRecommendations('tv', showId)
        ]);

        if (isMounted) {
          setShow(details);
          setRecommendations(recs);
          if (details.seasons && details.seasons.length > 0) {
            setSelectedSeasonNumber(details.seasons[0].seasonNumber);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load TV details:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [showId]);

  if (loading && !show) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
        <div className="h-[60vh] bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">TV Show not found</h2>
        <p className="text-zinc-400">The requested series could not be retrieved from our library.</p>
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

  const favorited = isFavorite(show.id);
  const year = show.releaseDate ? show.releaseDate.slice(0, 4) : '';
  const activeSeason = show.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber) || show.seasons?.[0];

  return (
    <div id={`tv-details-${show.id}`} className="space-y-12 animate-fadeIn pb-16">
      {/* Top Action Bar */}
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
            onClick={() => onShare(show)}
            className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Share Series"
          >
            <Share2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(show)}
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
            src={show.backdropPath || show.posterPath}
            alt={show.title}
            className="w-full h-full object-cover filter brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f16] via-[#0c0f16]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f16] via-[#0c0f16]/80 to-transparent" />

          {/* Floating Watch Trailer Hero Trigger */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-10">
            <button
              type="button"
              onClick={() => onPlayTrailer(show)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={18} className="fill-current" />
              <span>Watch Official Trailer</span>
            </button>
          </div>
        </div>

        {/* 2-Column Info Overlay */}
        <div className="px-6 sm:px-10 pb-10 -mt-24 sm:-mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-48 sm:w-60 shrink-0 rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-900">
              <img
                src={show.posterPath}
                alt={show.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-black flex items-center gap-1">
                    <Tv size={12} />
                    Television Series
                  </span>
                  <RatingBadge rating={show.voteAverage} size="md" />
                  {show.status && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {show.status}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
                  {show.title}
                </h1>

                {show.tagline && (
                  <p className="text-base sm:text-lg italic text-amber-400/90 font-medium">
                    &ldquo;{show.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Series Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 pt-1">
                {year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-amber-500" />
                    <span>Premiered {year}</span>
                  </div>
                )}
                {show.seasonsCount ? (
                  <div className="flex items-center gap-1.5">
                    <Layers size={15} className="text-amber-500" />
                    <span>
                      {show.seasonsCount} {show.seasonsCount === 1 ? 'Season' : 'Seasons'}
                      {show.episodesCount ? ` • ${show.episodesCount} Episodes` : ''}
                    </span>
                  </div>
                ) : null}
                {show.director && (
                  <div className="flex items-center gap-1.5">
                    <User size={15} className="text-amber-500" />
                    <span>Creator: <strong className="text-white">{show.director}</strong></span>
                  </div>
                )}
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {show.genres.map((g) => (
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

              {/* Overview */}
              <div className="pt-3 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Series Overview</h3>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-200 max-w-3xl">
                  {show.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seasons & Episodes Browser */}
      {show.seasons && show.seasons.length > 0 && (
        <section className="space-y-6 bg-[#10141d] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Layers className="text-amber-500" size={20} />
                Season & Episode Guide
              </h2>
            </div>

            {/* Season Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {show.seasons.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSeasonNumber === s.seasonNumber
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  Season {s.seasonNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Episode List */}
          {activeSeason?.episodes && activeSeason.episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {activeSeason.episodes.map((ep) => (
                <div
                  key={ep.id}
                  className="p-4 rounded-2xl bg-[#0b0e14] border border-zinc-800/90 hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-amber-500 font-bold uppercase">
                        EPISODE {ep.episodeNumber}
                      </span>
                      <h4 className="text-base font-bold text-zinc-100 mt-0.5">
                        {ep.name}
                      </h4>
                    </div>
                    {ep.voteAverage ? (
                      <RatingBadge rating={ep.voteAverage} size="sm" />
                    ) : null}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {ep.overview || 'Episode synopsis in archive.'}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-zinc-850">
                    {ep.airDate && <span>Aired: {ep.airDate}</span>}
                    {ep.runtime ? <span>Runtime: {ep.runtime}m</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Detailed episode log being indexed.</p>
          )}
        </section>
      )}

      {/* Cast & Crew Grid */}
      {show.cast && show.cast.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Starring Cast
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {show.cast.map((actor) => (
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

      {/* Official Trailers */}
      {show.trailers && show.trailers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Film className="text-amber-500" size={20} />
              Trailers & Promos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {show.trailers.map((trailer) => (
              <div
                key={trailer.id}
                onClick={() => onPlayTrailer(show)}
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

      {/* Recommended Series Carousel */}
      {recommendations.length > 0 && (
        <Carousel
          title="Similar Series You May Love"
          subtitle="Top recommended shows sharing tone and storytelling prestige."
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
      <AdBanner slotId="tv-detail-bottom" />
    </div>
  );
};
