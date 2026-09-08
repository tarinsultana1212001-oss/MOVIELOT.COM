import React, { useState } from 'react';
import { Bookmark, Film, Tv, Trash2, AlertTriangle, ArrowRight, Share2 } from 'lucide-react';
import { FavoriteItem, MediaItem, MediaType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { RatingBadge } from '../components/RatingBadge';

interface FavoritesPageProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer?: (item: MediaItem) => void;
  onExplore: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectMovie,
  onExplore
}) => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredFavorites = favorites.filter((item) => {
    if (filterType === 'all') return true;
    return item.mediaType === filterType;
  });

  const handleOpenItem = (fav: FavoriteItem) => {
    onSelectMovie({
      id: fav.id,
      title: fav.title,
      mediaType: fav.mediaType,
      overview: '',
      posterPath: fav.posterPath || '',
      backdropPath: fav.backdropPath || '',
      releaseDate: fav.releaseDate,
      voteAverage: fav.voteAverage,
      genres: fav.genres.map((g, i) => ({ id: i, name: g }))
    });
  };

  return (
    <div id="watchlist-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark size={16} className="fill-current" />
            <span>Personal Queue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            My Watchlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Saved movies and series safely preserved on your device for future movie nights.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({favorites.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('movie')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  filterType === 'movie' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film size={12} />
                <span>Movies</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('tv')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  filterType === 'tv' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv size={12} />
                <span>TV</span>
              </button>
            </div>

            {/* Clear All Button */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-900 border border-zinc-800 transition-colors"
              title="Clear all watchlist items"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Watchlist Grid or Empty State */}
      {favorites.length === 0 ? (
        <div className="py-20 text-center space-y-5 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-amber-500 mx-auto shadow-2xl">
            <Bookmark size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Your watchlist is empty</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Explore our curated library, discover trending films, or use MovieLot AI to curate your viewing queue. Tap the bookmark icon on any title to save it here.
            </p>
          </div>
          <button
            type="button"
            onClick={onExplore}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Explore Movies & Series
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 space-y-2">
          <p>No {filterType === 'movie' ? 'movies' : 'TV shows'} in your saved watchlist.</p>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className="text-xs text-amber-400 hover:underline"
          >
            Show all watchlist items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-[#121620] rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300"
            >
              {/* Poster Frame */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleOpenItem(item)}
                className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 cursor-pointer"
              >
                <img
                  src={item.posterPath || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-black/40" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <RatingBadge rating={item.voteAverage} size="sm" />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(item.id);
                  }}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-black/70 hover:bg-red-500 text-zinc-300 hover:text-white transition-all backdrop-blur-md"
                  title="Remove from Watchlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Info */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleOpenItem(item)}
                className="p-3 flex flex-col gap-1 cursor-pointer"
              >
                <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>{item.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                  {item.releaseDate && <span>• {item.releaseDate.slice(0, 4)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#121620] rounded-2xl border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg text-white">Clear Watchlist?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This will remove all {favorites.length} saved movies and TV shows from your local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFavorites();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
