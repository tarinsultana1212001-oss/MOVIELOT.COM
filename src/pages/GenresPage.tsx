import React, { useState, useEffect } from 'react';
import { Genre } from '../types';
import { apiClient } from '../services/apiClient';
import { Grid, ArrowRight } from 'lucide-react';

interface GenresPageProps {
  onSelectGenre: (genreId: number, genreName: string) => void;
}

export const GenresPage: React.FC<GenresPageProps> = ({ onSelectGenre }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getGenres()
      .then((data) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load genres:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="genres-directory-page" className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
          <Grid size={16} />
          <span>Cinematic Categories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Browse by Genre
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Find your next binge or cinematic experience filtered by emotional tone, narrative structure, and thematic depth.
        </p>
      </div>

      {/* Genres Visual Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <div
              key={genre.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectGenre(genre.id, genre.name)}
              className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/60 shadow-xl transition-all duration-300 cursor-pointer select-none"
            >
              {/* Genre Backdrop Art */}
              <img
                src={genre.backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=700'}
                alt={genre.name}
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.5] transition-all duration-500"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 flex flex-col justify-end">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>{genre.name}</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all text-amber-400" />
                  </h3>
                  {genre.description && (
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {genre.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
