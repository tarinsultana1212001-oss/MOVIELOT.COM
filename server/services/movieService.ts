import { CastMember, CrewMember, Genre, MediaItem, MediaType, VideoTrailer, CustomMediaPayload } from '../../src/types';
import { ALL_MEDIA_CATALOG, CURATED_MOVIES, CURATED_TV_SHOWS, CURATED_ANIME, CURATED_DOCUMENTARIES, GENRES_LIST } from '../data/curatedMovies';

export interface PaginatedResult<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface MovieProvider {
  name: string;
  getTrending(mediaType?: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', timeWindow?: 'day' | 'week'): Promise<MediaItem[]>;
  getPopular(mediaType: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page?: number): Promise<PaginatedResult<MediaItem>>;
  getUpcoming(page?: number): Promise<PaginatedResult<MediaItem>>;
  getTopRated(mediaType: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page?: number): Promise<PaginatedResult<MediaItem>>;
  getDetails(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<MediaItem | null>;
  search(query: string, mediaType?: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page?: number): Promise<PaginatedResult<MediaItem>>;
  getGenres(): Promise<Genre[]>;
  getByGenre(genreId: number, mediaType?: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page?: number): Promise<PaginatedResult<MediaItem>>;
  getRecommendations(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<MediaItem[]>;
  getCredits(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<{ cast: CastMember[]; crew: CrewMember[] }>;
  getTrailers(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<VideoTrailer[]>;
}

// In-Memory Cache with TTL
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs = 10 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const movieCache = new MemoryCache();

// Custom Media items added by Admin
export const customMediaCatalog: MediaItem[] = [];

export function getCustomMediaList(): MediaItem[] {
  return customMediaCatalog;
}

export function addCustomMedia(payload: CustomMediaPayload): MediaItem {
  const newId = 900000 + Math.floor(Math.random() * 90000);

  const castList: CastMember[] = (payload.castNames && payload.castNames.length > 0)
    ? payload.castNames.map((name, i) => ({ id: 500 + i, name: name.trim(), character: 'Star' }))
    : [
        { id: 101, name: 'Lead Cast', character: 'Main Role' },
        { id: 102, name: 'Supporting Cast', character: 'Featured Role' }
      ];

  const crewList: CrewMember[] = payload.director 
    ? [{ id: 201, name: payload.director, job: 'Director', department: 'Directing' }]
    : [{ id: 201, name: 'Lead Director', job: 'Director', department: 'Directing' }];

  const normalizedGenres = (payload.genres && payload.genres.length > 0 
    ? payload.genres 
    : (payload.mediaType === 'anime' ? ['Anime', 'Animation', 'Action'] : ['Action', 'Drama'])
  ).map((name, index) => ({ id: 400 + index, name }));

  const defaultTagline = payload.mediaType === 'anime' 
    ? 'Masterpiece Japanese Animation'
    : (payload.mediaType === 'documentary' ? 'Eye-opening True World Exploration' : 'MovieLot Premier Selection');

  const defaultRuntime = payload.mediaType === 'movie' 
    ? (payload.runtime || 120) 
    : (payload.mediaType === 'anime' ? (payload.runtime || 24) : (payload.runtime || 50));

  const mediaItem: MediaItem = {
    id: newId,
    title: payload.title,
    originalTitle: payload.originalTitle || payload.title,
    tagline: payload.tagline || defaultTagline,
    overview: payload.overview,
    posterPath: payload.posterPath,
    backdropPath: payload.backdropPath || payload.posterPath,
    mediaType: payload.mediaType || 'movie',
    releaseDate: payload.releaseDate || new Date().toISOString().split('T')[0],
    voteAverage: Number(payload.voteAverage) || 8.5,
    voteCount: Math.floor(Math.random() * 400) + 120,
    genres: normalizedGenres,
    runtime: defaultRuntime,
    seasonsCount: payload.seasonsCount || (payload.mediaType === 'tv' || payload.mediaType === 'anime' ? 1 : undefined),
    episodesCount: payload.episodesCount || (payload.mediaType === 'tv' || payload.mediaType === 'anime' ? 12 : undefined),
    status: payload.status || 'Released',
    director: payload.director || (payload.mediaType === 'anime' ? 'Studio Chief' : 'Lead Director'),
    creators: payload.creators || (payload.director ? [payload.director] : undefined),
    productionCompanies: payload.studio 
      ? [payload.studio] 
      : (payload.mediaType === 'anime' ? ['Ufotable / MAPPA'] : ['MovieLot Studios']),
    cast: castList,
    crew: crewList,
    trailers: payload.trailerKey ? [
      { id: `tr_${newId}`, key: payload.trailerKey.trim(), name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ] : [],
    language: payload.language || (payload.mediaType === 'anime' ? 'Japanese' : 'English'),
    country: payload.country || (payload.mediaType === 'anime' ? 'Japan' : 'United States')
  };

  customMediaCatalog.unshift(mediaItem);
  movieCache.clear();
  return mediaItem;
}

export function updateCustomMedia(id: number, payload: Partial<CustomMediaPayload>): MediaItem | null {
  const index = customMediaCatalog.findIndex(m => m.id === id);
  if (index === -1) return null;
  const existing = customMediaCatalog[index];

  const updated: MediaItem = {
    ...existing,
    title: payload.title ?? existing.title,
    originalTitle: payload.originalTitle ?? existing.originalTitle,
    tagline: payload.tagline ?? existing.tagline,
    overview: payload.overview ?? existing.overview,
    posterPath: payload.posterPath ?? existing.posterPath,
    backdropPath: payload.backdropPath ?? existing.backdropPath,
    mediaType: (payload.mediaType as MediaType) ?? existing.mediaType,
    releaseDate: payload.releaseDate ?? existing.releaseDate,
    voteAverage: payload.voteAverage !== undefined ? Number(payload.voteAverage) : existing.voteAverage,
    genres: payload.genres ? payload.genres.map((name, i) => ({ id: 400 + i, name })) : existing.genres,
    director: payload.director ?? existing.director,
    runtime: payload.runtime ?? existing.runtime,
    seasonsCount: payload.seasonsCount ?? existing.seasonsCount,
    episodesCount: payload.episodesCount ?? existing.episodesCount,
    language: payload.language ?? existing.language,
    country: payload.country ?? existing.country,
    trailers: payload.trailerKey ? [
      { id: `tr_${id}`, key: payload.trailerKey, name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }
    ] : existing.trailers
  };

  customMediaCatalog[index] = updated;
  movieCache.clear();
  return updated;
}

export function deleteCustomMedia(id: number): boolean {
  const index = customMediaCatalog.findIndex(m => m.id === id);
  if (index !== -1) {
    customMediaCatalog.splice(index, 1);
    movieCache.clear();
    return true;
  }
  return false;
}

function getMoviesPool(): MediaItem[] {
  return [...customMediaCatalog.filter(m => m.mediaType === 'movie'), ...CURATED_MOVIES];
}

function getTvPool(): MediaItem[] {
  return [...customMediaCatalog.filter(m => m.mediaType === 'tv'), ...CURATED_TV_SHOWS];
}

function getAnimePool(): MediaItem[] {
  return [...customMediaCatalog.filter(m => m.mediaType === 'anime'), ...CURATED_ANIME];
}

function getDocumentariesPool(): MediaItem[] {
  return [...customMediaCatalog.filter(m => m.mediaType === 'documentary'), ...CURATED_DOCUMENTARIES];
}

function getPoolByMediaType(mediaType: string = 'all'): MediaItem[] {
  if (mediaType === 'movie') return getMoviesPool();
  if (mediaType === 'tv') return getTvPool();
  if (mediaType === 'anime') return getAnimePool();
  if (mediaType === 'documentary') return getDocumentariesPool();
  if (mediaType === 'animation') {
    return getAllPool().filter(m => m.mediaType === 'animation' || m.genres.some(g => g.name.toLowerCase() === 'animation' || g.name.toLowerCase() === 'anime'));
  }
  return getAllPool();
}

function getAllPool(): MediaItem[] {
  return [...customMediaCatalog, ...ALL_MEDIA_CATALOG];
}

/**
 * Curated Movie Provider:
 * High-reliability, legal, verified cinematic dataset with complete metadata,
 * real cast & crew, high-res poster paths, and official YouTube trailers.
 */
export class CuratedMovieProvider implements MovieProvider {
  name = 'CuratedCatalog';

  async getTrending(mediaType: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> {
    const items = getPoolByMediaType(mediaType);

    // Sort by rating and vote count
    const sorted = [...items].sort((a, b) => {
      if (timeWindow === 'day') {
        return (b.voteAverage * 0.7 + ((b.voteCount || 1000) / 10000) * 0.3) -
               (a.voteAverage * 0.7 + ((a.voteCount || 1000) / 10000) * 0.3);
      }
      return b.voteAverage - a.voteAverage;
    });

    return sorted.slice(0, 16);
  }

  async getPopular(mediaType: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page = 1): Promise<PaginatedResult<MediaItem>> {
    const pool = getPoolByMediaType(mediaType);
    const sorted = [...pool].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    const results = sorted.slice(start, start + pageSize);

    return {
      results,
      page,
      totalPages: Math.max(1, Math.ceil(sorted.length / pageSize)),
      totalResults: sorted.length
    };
  }

  async getUpcoming(page = 1): Promise<PaginatedResult<MediaItem>> {
    const sorted = [...getMoviesPool()].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    const pageSize = 8;
    const start = (page - 1) * pageSize;
    const results = sorted.slice(start, start + pageSize);

    return {
      results,
      page,
      totalPages: Math.max(1, Math.ceil(sorted.length / pageSize)),
      totalResults: sorted.length
    };
  }

  async getTopRated(mediaType: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation', page = 1): Promise<PaginatedResult<MediaItem>> {
    const pool = getPoolByMediaType(mediaType);
    const sorted = [...pool].sort((a, b) => b.voteAverage - a.voteAverage);
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    const results = sorted.slice(start, start + pageSize);

    return {
      results,
      page,
      totalPages: Math.max(1, Math.ceil(sorted.length / pageSize)),
      totalResults: sorted.length
    };
  }

  async getDetails(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<MediaItem | null> {
    if (mediaType && mediaType !== 'all') {
      const pool = getPoolByMediaType(mediaType);
      const found = pool.find((item) => item.id === id);
      if (found) return found;
    }

    // Fallback search across all media items
    const crossFound = getAllPool().find((item) => item.id === id);
    return crossFound || null;
  }

  async search(query: string, mediaType: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' = 'all', page = 1): Promise<PaginatedResult<MediaItem>> {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return { results: [], page: 1, totalPages: 0, totalResults: 0 };
    }

    const pool = getPoolByMediaType(mediaType);

    const filtered = pool.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchOriginal = item.originalTitle?.toLowerCase().includes(q);
      const matchOverview = item.overview.toLowerCase().includes(q);
      const matchDirector = item.director?.toLowerCase().includes(q);
      const matchCast = item.cast?.some((c) => c.name.toLowerCase().includes(q));
      const matchGenre = item.genres.some((g) => g.name.toLowerCase().includes(q));

      return matchTitle || matchOriginal || matchOverview || matchDirector || matchCast || matchGenre;
    });

    const pageSize = 12;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return {
      results,
      page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      totalResults: filtered.length
    };
  }

  async getGenres(): Promise<Genre[]> {
    return GENRES_LIST;
  }

  async getByGenre(genreId: number, mediaType: 'all' | 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' = 'all', page = 1): Promise<PaginatedResult<MediaItem>> {
    const pool = getPoolByMediaType(mediaType);

    const filtered = pool.filter((item) => item.genres.some((g) => g.id === genreId));
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return {
      results,
      page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      totalResults: filtered.length
    };
  }

  async getRecommendations(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<MediaItem[]> {
    const current = await this.getDetails(id, mediaType);
    if (!current) return [];

    const currentGenreIds = current.genres.map((g) => g.id);
    const pool = getPoolByMediaType(current.mediaType);

    const similar = pool
      .filter((item) => item.id !== id)
      .map((item) => {
        const shared = item.genres.filter((g) => currentGenreIds.includes(g.id)).length;
        return { item, shared };
      })
      .filter(({ shared }) => shared > 0)
      .sort((a, b) => b.shared - a.shared || b.item.voteAverage - a.item.voteAverage)
      .map(({ item }) => item);

    return similar.slice(0, 8);
  }

  async getCredits(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
    const item = await this.getDetails(id, mediaType);
    return {
      cast: item?.cast || [],
      crew: item?.crew || []
    };
  }

  async getTrailers(id: number, mediaType?: 'movie' | 'tv' | 'anime' | 'documentary' | 'animation' | string): Promise<VideoTrailer[]> {
    const item = await this.getDetails(id, mediaType);
    return item?.trailers || [];
  }
}

export function parseTmdbKey(rawKey?: string): { key: string; isBearer: boolean } | null {
  if (!rawKey) return null;
  let trimmed = rawKey.trim();

  // If user pasted a full curl command, extract token
  const bearerMatch = trimmed.match(/Bearer\s+([A-Za-z0-9._-]+)/i);
  if (bearerMatch) {
    trimmed = bearerMatch[1];
  } else {
    const apiMatch = trimmed.match(/api_key=([a-f0-9]+)/i);
    if (apiMatch) {
      trimmed = apiMatch[1];
    }
  }

  // Strip surrounding quotes
  trimmed = trimmed.replace(/^['"]|['"]$/g, '').trim();

  // Reject placeholder values
  const upper = trimmed.toUpperCase();
  if (
    upper.includes('TOKEN') ||
    upper.includes('YOUR_') ||
    upper.includes('MY_') ||
    upper.includes('PLACEHOLDER') ||
    upper.includes('EXAMPLE') ||
    upper.includes('CURL')
  ) {
    return null;
  }

  // 32-character hex key (TMDB v3 API Key)
  if (/^[a-f0-9]{32}$/i.test(trimmed)) {
    return { key: trimmed, isBearer: false };
  }

  // JWT token (TMDB v4 Read Access Token)
  if (/^eyJ[A-Za-z0-9._-]{50,}$/.test(trimmed)) {
    return { key: trimmed, isBearer: true };
  }

  return null;
}

/**
 * TMDB Live Provider (Activated if valid MOVIE_API_KEY is configured)
 * Implements the identical MovieProvider interface with fallback to CuratedMovieProvider.
 */
export class TmdbMovieProvider implements MovieProvider {
  name = 'TMDB';
  public static isTmdbDisabled = false;
  private apiKey: string;
  private isBearer: boolean;
  private fallback: CuratedMovieProvider;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(apiKey: string, isBearer = false) {
    this.apiKey = apiKey;
    this.isBearer = isBearer;
    this.fallback = new CuratedMovieProvider();
  }

  private async fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    if (TmdbMovieProvider.isTmdbDisabled) {
      return null;
    }

    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };

      if (this.isBearer) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      } else {
        url.searchParams.set('api_key', this.apiKey);
      }

      url.searchParams.set('language', 'en-US');
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }

      const res = await fetch(url.toString(), {
        headers,
        signal: AbortSignal.timeout(4000)
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // If unauthorized or key is rejected, disable TMDB to prevent cascading errors
          TmdbMovieProvider.isTmdbDisabled = true;
        }
        return null;
      }
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatTmdbMedia(raw: any, type: MediaType): MediaItem {
    return {
      id: raw.id,
      title: raw.title || raw.name || 'Untitled',
      originalTitle: raw.original_title || raw.original_name,
      tagline: raw.tagline || '',
      overview: raw.overview || 'No overview available.',
      posterPath: raw.poster_path ? `https://image.tmdb.org/t/p/w780${raw.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=780',
      backdropPath: raw.backdrop_path ? `https://image.tmdb.org/t/p/w1280${raw.backdrop_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1280',
      mediaType: type,
      releaseDate: raw.release_date || raw.first_air_date || '2024',
      voteAverage: Number((raw.vote_average || 0).toFixed(1)),
      voteCount: raw.vote_count || 0,
      genres: (raw.genres || []).map((g: { id: number; name: string }) => ({ id: g.id, name: g.name })),
      runtime: raw.runtime || (raw.episode_run_time ? raw.episode_run_time[0] : 0),
      seasonsCount: raw.number_of_seasons,
      episodesCount: raw.number_of_episodes,
      status: raw.status,
      director: raw.credits?.crew?.find((c: { job: string; name: string }) => c.job === 'Director')?.name,
      cast: (raw.credits?.cast || []).slice(0, 10).map((c: { id: number; name: string; character: string; profile_path: string | null }) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : undefined
      })),
      crew: (raw.credits?.crew || []).slice(0, 5).map((c: { id: number; name: string; job: string; department: string }) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department
      })),
      trailers: (raw.videos?.results || []).filter((v: { site: string; key: string }) => v.site === 'YouTube').map((v: { id: string; key: string; name: string; type: string; official: boolean }) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: 'YouTube',
        type: v.type,
        official: v.official
      })),
      productionCompanies: (raw.production_companies || []).map((p: { name: string }) => p.name),
      budget: raw.budget,
      revenue: raw.revenue,
      language: raw.original_language,
      country: raw.origin_country ? raw.origin_country[0] : undefined
    };
  }

  async getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(`/trending/${mediaType}/${timeWindow}`);
    if (!data?.results?.length) {
      return this.fallback.getTrending(mediaType, timeWindow);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.results.slice(0, 14).map((r: any) => this.formatTmdbMedia(r, r.media_type || (mediaType === 'all' ? 'movie' : mediaType)));
  }

  async getPopular(mediaType: 'movie' | 'tv', page = 1): Promise<PaginatedResult<MediaItem>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(`/${mediaType}/popular`, { page: String(page) });
    if (!data?.results?.length) {
      return this.fallback.getPopular(mediaType, page);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.results.map((r: any) => this.formatTmdbMedia(r, mediaType)),
      page: data.page,
      totalPages: Math.min(data.total_pages || 1, 50),
      totalResults: data.total_results || 0
    };
  }

  async getUpcoming(page = 1): Promise<PaginatedResult<MediaItem>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>('/movie/upcoming', { page: String(page) });
    if (!data?.results?.length) {
      return this.fallback.getUpcoming(page);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.results.map((r: any) => this.formatTmdbMedia(r, 'movie')),
      page: data.page,
      totalPages: Math.min(data.total_pages || 1, 50),
      totalResults: data.total_results || 0
    };
  }

  async getTopRated(mediaType: 'movie' | 'tv', page = 1): Promise<PaginatedResult<MediaItem>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(`/${mediaType}/top_rated`, { page: String(page) });
    if (!data?.results?.length) {
      return this.fallback.getTopRated(mediaType, page);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.results.map((r: any) => this.formatTmdbMedia(r, mediaType)),
      page: data.page,
      totalPages: Math.min(data.total_pages || 1, 50),
      totalResults: data.total_results || 0
    };
  }

  async getDetails(id: number, mediaType: 'movie' | 'tv'): Promise<MediaItem | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(`/${mediaType}/${id}`, { append_to_response: 'credits,videos,recommendations' });
    if (!data) {
      return this.fallback.getDetails(id, mediaType);
    }
    return this.formatTmdbMedia(data, mediaType);
  }

  async search(query: string, mediaType: 'all' | 'movie' | 'tv' = 'all', page = 1): Promise<PaginatedResult<MediaItem>> {
    const endpoint = mediaType === 'all' ? '/search/multi' : `/search/${mediaType}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(endpoint, { query, page: String(page) });
    if (!data?.results?.length) {
      return this.fallback.search(query, mediaType, page);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.results.map((r: any) => this.formatTmdbMedia(r, r.media_type || (mediaType === 'all' ? 'movie' : mediaType))),
      page: data.page,
      totalPages: Math.min(data.total_pages || 1, 50),
      totalResults: data.total_results || 0
    };
  }

  async getGenres(): Promise<Genre[]> {
    return this.fallback.getGenres();
  }

  async getByGenre(genreId: number, mediaType: 'all' | 'movie' | 'tv' = 'all', page = 1): Promise<PaginatedResult<MediaItem>> {
    const endpoint = mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(endpoint, { with_genres: String(genreId), page: String(page) });
    if (!data?.results?.length) {
      return this.fallback.getByGenre(genreId, mediaType, page);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.results.map((r: any) => this.formatTmdbMedia(r, mediaType === 'tv' ? 'tv' : 'movie')),
      page: data.page,
      totalPages: Math.min(data.total_pages || 1, 50),
      totalResults: data.total_results || 0
    };
  }

  async getRecommendations(id: number, mediaType: 'movie' | 'tv'): Promise<MediaItem[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await this.fetchTmdb<any>(`/${mediaType}/${id}/recommendations`);
    if (!data?.results?.length) {
      return this.fallback.getRecommendations(id, mediaType);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.results.slice(0, 8).map((r: any) => this.formatTmdbMedia(r, mediaType));
  }

  async getCredits(id: number, mediaType: 'movie' | 'tv'): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
    const details = await this.getDetails(id, mediaType);
    return {
      cast: details?.cast || [],
      crew: details?.crew || []
    };
  }

  async getTrailers(id: number, mediaType: 'movie' | 'tv'): Promise<VideoTrailer[]> {
    const details = await this.getDetails(id, mediaType);
    return details?.trailers || [];
  }
}

/**
 * Service Factory: returns active movie provider
 */
export function getMovieProvider(): MovieProvider {
  if (TmdbMovieProvider.isTmdbDisabled) {
    return new CuratedMovieProvider();
  }

  const rawKey = process.env.MOVIE_API_KEY || process.env.TMDB_API_KEY;
  const parsed = parseTmdbKey(rawKey);
  if (parsed) {
    return new TmdbMovieProvider(parsed.key, parsed.isBearer);
  }

  return new CuratedMovieProvider();
}
