import React, { useState } from 'react';
import { Sparkles, Compass, Check, Bookmark, Play, AlertCircle, ArrowRight } from 'lucide-react';
import { AIRecommendationResult, MediaItem, MediaType, RecommendationRequest } from '../types';
import { apiClient } from '../services/apiClient';
import { useFavorites } from '../hooks/useFavorites';
import { RatingBadge } from './RatingBadge';

interface AIRecommendationWidgetProps {
  onSelectMovie: (item: MediaItem) => void;
  onPlayTrailer?: (item: MediaItem) => void;
}

const MOODS = [
  'Adrenaline & Action',
  'Mind-Bending & Deep',
  'Feel-Good & Cozy',
  'Dark & Gritty',
  'Epic & Cinematic',
  'Romantic & Charming',
  'Suspenseful & Tense'
];

const DECADES = ['Any Era', '2020s', '2010s', '2000s', '1990s', 'Classics'];
const RUNTIMES = ['Any Length', 'Quick (< 95 min)', 'Standard (95 - 130 min)', 'Epic (> 130 min)'];

export const AIRecommendationWidget: React.FC<AIRecommendationWidgetProps> = ({
  onSelectMovie,
  onPlayTrailer
}) => {
  const [mood, setMood] = useState('Adrenaline & Action');
  const [favoriteMovies, setFavoriteMovies] = useState('');
  const [decade, setDecade] = useState('Any Era');
  const [runtime, setRuntime] = useState('Any Length');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIRecommendationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: RecommendationRequest = {
      mood,
      favoriteMovies: favoriteMovies.trim() || undefined,
      decade: decade !== 'Any Era' ? decade : undefined,
      runtimePreference: runtime !== 'Any Length' ? runtime : undefined,
      freeformPrompt: customPrompt.trim() || undefined
    };

    try {
      const recs = await apiClient.getAiRecommendations(payload);
      setResults(recs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Recommendation engine error. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-recommender" className="w-full my-12 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#121622] border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Cinema Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>AI Taste Curator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What should you watch tonight?
        </h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Tell MovieLot AI your mood, reference titles, or time limits. Our engine pairs deep story intelligence with verified catalog metadata.
        </p>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleGenerate} className="space-y-6 relative">
        {/* Mood Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
            1. Select Your Current Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  mood === m
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-750 border border-zinc-700/60'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reference movies */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              2. Similar To Movies You Love (Optional)
            </label>
            <input
              type="text"
              value={favoriteMovies}
              onChange={(e) => setFavoriteMovies(e.target.value)}
              placeholder="e.g., Blade Runner 2049, Arrival, Shutter Island"
              className="w-full bg-zinc-900/90 border border-zinc-750 focus:border-amber-500 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
            />
          </div>

          {/* Era & Runtime */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Decade
              </label>
              <select
                value={decade}
                onChange={(e) => setDecade(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-750 focus:border-amber-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer"
              >
                {DECADES.map((d) => (
                  <option key={d} value={d} className="bg-zinc-900">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Runtime
              </label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-750 focus:border-amber-500 text-zinc-100 text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer"
              >
                {RUNTIMES.map((r) => (
                  <option key={r} value={r} className="bg-zinc-900">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Freeform Prompt */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            3. Specific Instructions or Plot Twist Preference (Optional)
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'Looking for a neo-noir with a shocking finale that keeps you guessing'"
            className="w-full bg-zinc-900/90 border border-zinc-750 focus:border-amber-500 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Consulting Gemini 3.8 AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Curated Recommendations</span>
              </>
            )}
          </button>

          {results && (
            <button
              type="button"
              onClick={() => setResults(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline"
            >
              Clear Results
            </button>
          )}
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Results Grid */}
      {results && results.length > 0 && (
        <div className="mt-10 pt-8 border-t border-zinc-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="text-amber-400" size={20} />
                Hand-Picked For Your Mood
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Recommended based on &ldquo;{mood}&rdquo;
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {results.length} Matches Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((rec, idx) => {
              const matchedId = rec.matchedId || idx + 9990;
              const mediaType = rec.matchedMediaType || 'movie';
              const favorited = isFavorite(matchedId);

              const mediaItem: MediaItem = {
                id: matchedId,
                title: rec.title,
                mediaType,
                overview: rec.reason,
                posterPath: rec.posterPath || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600',
                backdropPath: rec.backdropPath || '',
                releaseDate: rec.year || '2024',
                voteAverage: rec.rating || 8.0,
                genres: rec.genre.split('/').map((g, i) => ({ id: i, name: g.trim() }))
              };

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0a0d14] border border-zinc-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex gap-3">
                    <img
                      src={mediaItem.posterPath}
                      alt={rec.title}
                      className="w-16 h-24 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {rec.title}
                        </h4>
                        <RatingBadge rating={rec.rating} size="sm" />
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {rec.year} • {rec.genre}
                      </div>
                      <p className="text-xs text-zinc-300 mt-2 line-clamp-3 leading-relaxed">
                        &ldquo;{rec.reason}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                    <button
                      type="button"
                      onClick={() => onSelectMovie(mediaItem)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Details</span>
                      <ArrowRight size={12} />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {onPlayTrailer && (
                        <button
                          type="button"
                          onClick={() => onPlayTrailer(mediaItem)}
                          title="Watch Trailer"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        >
                          <Play size={13} className="fill-current" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (favorited) removeFavorite(matchedId);
                          else addFavorite(mediaItem);
                        }}
                        title={favorited ? 'In Watchlist' : 'Add to Watchlist'}
                        className={`p-1.5 rounded-lg border transition-all ${
                          favorited
                            ? 'bg-amber-500 text-black border-amber-500'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {favorited ? <Check size={13} /> : <Bookmark size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
