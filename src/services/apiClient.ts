import {
  AIRecommendationResult,
  CastMember,
  CrewMember,
  Genre,
  MediaItem,
  MediaType,
  RecommendationRequest,
  VideoTrailer,
  User,
  AuthResponse,
  AdminStats,
  CustomMediaPayload
} from '../types';

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const json = await res.json();
      if (json.error) errMsg = json.error;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  // Trending
  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all', window: 'day' | 'week' = 'day'): Promise<MediaItem[]> => {
    const data = await fetchJson<{ results: MediaItem[] }>(`${API_BASE}/movies/trending?type=${type}&window=${window}`);
    return data.results;
  },

  // Popular Movies
  getPopularMovies: async (page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/movies/popular?page=${page}`);
  },

  // Upcoming Movies
  getUpcomingMovies: async (page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/movies/upcoming?page=${page}`);
  },

  // Top Rated Movies
  getTopRatedMovies: async (page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/movies/top-rated?page=${page}`);
  },

  // Movie Details
  getMovieDetails: async (id: number): Promise<MediaItem> => {
    return fetchJson<MediaItem>(`${API_BASE}/movies/${id}`);
  },

  // Popular TV
  getPopularTV: async (page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/tv/popular?page=${page}`);
  },

  // Top Rated TV
  getTopRatedTV: async (page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/tv/top-rated?page=${page}`);
  },

  // TV Details
  getTVDetails: async (id: number): Promise<MediaItem> => {
    return fetchJson<MediaItem>(`${API_BASE}/tv/${id}`);
  },

  // Search
  search: async (query: string, type: 'all' | 'movie' | 'tv' = 'all', page = 1): Promise<PaginatedResponse<MediaItem>> => {
    const encoded = encodeURIComponent(query);
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/search?q=${encoded}&type=${type}&page=${page}`);
  },

  // Genres
  getGenres: async (): Promise<Genre[]> => {
    const data = await fetchJson<{ genres: Genre[] }>(`${API_BASE}/genres`);
    return data.genres;
  },

  // By Genre
  getByGenre: async (genreId: number, type: 'all' | 'movie' | 'tv' = 'all', page = 1): Promise<PaginatedResponse<MediaItem>> => {
    return fetchJson<PaginatedResponse<MediaItem>>(`${API_BASE}/genres/${genreId}?type=${type}&page=${page}`);
  },

  // Recommendations
  getRecommendations: async (type: MediaType, id: number): Promise<MediaItem[]> => {
    const data = await fetchJson<{ results: MediaItem[] }>(`${API_BASE}/media/${type}/${id}/recommendations`);
    return data.results;
  },

  // Credits
  getCredits: async (type: MediaType, id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> => {
    return fetchJson<{ cast: CastMember[]; crew: CrewMember[] }>(`${API_BASE}/media/${type}/${id}/credits`);
  },

  // Trailers
  getTrailers: async (type: MediaType, id: number): Promise<VideoTrailer[]> => {
    const data = await fetchJson<{ trailers: VideoTrailer[] }>(`${API_BASE}/media/${type}/${id}/trailers`);
    return data.trailers;
  },

  // AI Recommendations
  getAiRecommendations: async (req: RecommendationRequest): Promise<AIRecommendationResult[]> => {
    const data = await fetchJson<{ results: AIRecommendationResult[] }>(`${API_BASE}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    return data.results;
  },

  // AI Chat
  sendAiChat: async (
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    message: string
  ) => {
    return fetchJson<{
      id: string;
      role: 'assistant';
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
    }>(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, message })
    });
  },

  // Auth: Login
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    return fetchJson<AuthResponse>(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  // Auth: Register
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    return fetchJson<AuthResponse>(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Auth: Current User
  getCurrentUser: async (token: string): Promise<{ user: User }> => {
    return fetchJson<{ user: User }>(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Auth: Logout
  logout: async (token: string): Promise<{ success: boolean }> => {
    return fetchJson<{ success: boolean }>(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Get all users
  getAdminUsers: async (token: string): Promise<{ users: User[] }> => {
    return fetchJson<{ users: User[] }>(`${API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Delete user
  deleteAdminUser: async (token: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Update user role
  updateUserRole: async (token: string, userId: string, role: 'admin' | 'user'): Promise<{ success: boolean; user: User }> => {
    return fetchJson<{ success: boolean; user: User }>(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
  },

  // Admin: Get platform stats
  getAdminStats: async (token: string): Promise<{ stats: AdminStats }> => {
    return fetchJson<{ stats: AdminStats }>(`${API_BASE}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Get custom media
  getAdminMovies: async (token: string): Promise<{ movies: MediaItem[] }> => {
    return fetchJson<{ movies: MediaItem[] }>(`${API_BASE}/admin/movies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Add custom movie to catalog
  addAdminMovie: async (token: string, payload: CustomMediaPayload): Promise<{ success: boolean; item: MediaItem; message: string }> => {
    return fetchJson<{ success: boolean; item: MediaItem; message: string }>(`${API_BASE}/admin/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  },

  // Admin: Delete custom movie from catalog
  deleteAdminMovie: async (token: string, id: number): Promise<{ success: boolean; message: string }> => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/admin/movies/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
