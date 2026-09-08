export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  backdropUrl?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface VideoTrailer {
  id: string;
  key: string; // YouTube video ID
  name: string;
  site: string; // 'YouTube'
  type: string; // 'Trailer' | 'Teaser' | 'Featurette'
  official: boolean;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  runtime?: number;
  stillPath?: string;
  airDate?: string;
  voteAverage?: number;
}

export type TVEpisode = Episode;

export interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  episodeCount: number;
  posterPath?: string;
  airDate?: string;
  episodes?: Episode[];
}

export type TVSeason = Season;

export interface MediaItem {
  id: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  mediaType: MediaType;
  releaseDate: string; // YYYY-MM-DD or year
  voteAverage: number;
  voteCount?: number;
  genres: Genre[];
  runtime?: number; // minutes for movie
  seasonsCount?: number;
  episodesCount?: number;
  status?: string;
  director?: string;
  creators?: string[];
  cast?: CastMember[];
  crew?: CrewMember[];
  trailers?: VideoTrailer[];
  seasons?: Season[];
  productionCompanies?: string[];
  budget?: number;
  revenue?: number;
  language?: string;
  country?: string;
}

export interface FavoriteItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  addedAt: number;
}

export interface RecommendationRequest {
  mood?: string;
  genre?: string;
  favoriteMovies?: string;
  decade?: string;
  language?: string;
  runtimePreference?: string;
  ratingPreference?: string;
  freeformPrompt?: string;
}

export interface AIRecommendationResult {
  title: string;
  year?: string;
  rating?: number;
  genre?: string;
  reason: string;
  matchedId?: number;
  matchedMediaType?: MediaType;
  posterPath?: string;
  backdropPath?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestedMovies?: Array<{
    id: number;
    title: string;
    mediaType: MediaType;
    year: string;
    rating: number;
    posterPath?: string;
  }>;
}

export interface SearchFilterState {
  query: string;
  mediaType: 'all' | 'movie' | 'tv';
  genreId?: number | 'all';
  year?: string | 'all';
  minRating?: number;
  sortBy?: 'popularity' | 'rating' | 'newest' | 'title';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  avatar?: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalTVShows: number;
  activeSessions: number;
  serverUptimeSeconds: number;
  adminEmail: string;
  systemStatus: string;
}

export interface CustomMediaPayload {
  title: string;
  mediaType: MediaType;
  overview: string;
  posterPath: string;
  backdropPath?: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  trailerKey?: string;
}
