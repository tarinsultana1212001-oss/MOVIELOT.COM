import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getMovieProvider, addCustomMedia, updateCustomMedia, deleteCustomMedia, getCustomMediaList } from './server/services/movieService';
import { chatWithAssistant, generateRecommendations } from './server/services/geminiService';
import { AuthService } from './server/services/authService';
import { User } from './src/types';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Simple in-memory IP rate limiter for expensive AI endpoints
const aiRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const AI_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const AI_MAX_REQUESTS_PER_WINDOW = 25;

function checkAiRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientLimit = aiRateLimitMap.get(ip);

  if (!clientLimit || now > clientLimit.resetAt) {
    aiRateLimitMap.set(ip, { count: 1, resetAt: now + AI_RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientLimit.count >= AI_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientLimit.count += 1;
  return true;
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MovieLot API',
    provider: getMovieProvider().name,
    timestamp: new Date().toISOString()
  });
});

// 2. Trending Media
app.get('/api/movies/trending', async (req: Request, res: Response) => {
  try {
    const mediaType = (req.query.type as 'all' | 'movie' | 'tv') || 'all';
    const timeWindow = (req.query.window as 'day' | 'week') || 'day';
    const provider = getMovieProvider();
    const data = await provider.getTrending(mediaType, timeWindow);
    res.json({ results: data });
  } catch (error) {
    console.error('Trending fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve trending titles.' });
  }
});

// 3. Popular Movies
app.get('/api/movies/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getPopular('movie', page);
    res.json(data);
  } catch (error) {
    console.error('Popular movies fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve popular movies.' });
  }
});

// 4. Upcoming Movies
app.get('/api/movies/upcoming', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getUpcoming(page);
    res.json(data);
  } catch (error) {
    console.error('Upcoming movies fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve upcoming movies.' });
  }
});

// 5. Top Rated Movies
app.get('/api/movies/top-rated', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getTopRated('movie', page);
    res.json(data);
  } catch (error) {
    console.error('Top rated movies fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve top rated movies.' });
  }
});

// 6. Movie Details
app.get('/api/movies/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid movie ID format.' });
      return;
    }
    const provider = getMovieProvider();
    const movie = await provider.getDetails(id, 'movie');
    if (!movie) {
      res.status(404).json({ error: 'Movie not found.' });
      return;
    }
    res.json(movie);
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ error: 'Failed to retrieve movie details.' });
  }
});

// 7. Popular TV
app.get('/api/tv/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getPopular('tv', page);
    res.json(data);
  } catch (error) {
    console.error('Popular TV fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve popular TV shows.' });
  }
});

// 8. Top Rated TV
app.get('/api/tv/top-rated', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getTopRated('tv', page);
    res.json(data);
  } catch (error) {
    console.error('Top rated TV fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve top rated TV shows.' });
  }
});

// 9. TV Show Details
app.get('/api/tv/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid TV show ID format.' });
      return;
    }
    const provider = getMovieProvider();
    const show = await provider.getDetails(id, 'tv');
    if (!show) {
      res.status(404).json({ error: 'TV show not found.' });
      return;
    }
    res.json(show);
  } catch (error) {
    console.error('TV details error:', error);
    res.status(500).json({ error: 'Failed to retrieve TV show details.' });
  }
});

// 9b. Anime Endpoints (Popular, Trending, Top-Rated)
app.get('/api/anime/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getPopular('anime', page);
    res.json(data);
  } catch (error) {
    console.error('Popular Anime fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve anime titles.' });
  }
});

app.get('/api/anime/trending', async (_req: Request, res: Response) => {
  try {
    const provider = getMovieProvider();
    const results = await provider.getTrending('anime', 'week');
    res.json({ results });
  } catch (error) {
    console.error('Trending Anime fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve trending anime.' });
  }
});

app.get('/api/anime/top-rated', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getTopRated('anime', page);
    res.json(data);
  } catch (error) {
    console.error('Top Rated Anime fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve top rated anime.' });
  }
});

// 9c. Documentaries
app.get('/api/documentaries', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getPopular('documentary', page);
    res.json(data);
  } catch (error) {
    console.error('Documentaries fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve documentaries.' });
  }
});

// 9d. Universal Media Details
app.get('/api/media/details/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid media ID.' });
      return;
    }
    const type = (req.query.type as string) || 'all';
    const provider = getMovieProvider();
    const item = await provider.getDetails(id, type);
    if (!item) {
      res.status(404).json({ error: 'Media title not found.' });
      return;
    }
    res.json(item);
  } catch (error) {
    console.error('Universal details error:', error);
    res.status(500).json({ error: 'Failed to retrieve media details.' });
  }
});

// 10. Search
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const mediaType = (req.query.type as 'all' | 'movie' | 'tv') || 'all';
    const page = parseInt(req.query.page as string) || 1;

    if (!q.trim()) {
      res.json({ results: [], page: 1, totalPages: 0, totalResults: 0 });
      return;
    }

    if (q.length > 100) {
      res.status(400).json({ error: 'Search query too long.' });
      return;
    }

    const provider = getMovieProvider();
    const data = await provider.search(q, mediaType, page);
    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search is temporarily unavailable.' });
  }
});

// 11. Genres List
app.get('/api/genres', async (req: Request, res: Response) => {
  try {
    const provider = getMovieProvider();
    const genres = await provider.getGenres();
    res.json({ genres });
  } catch (error) {
    console.error('Genres fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve genres.' });
  }
});

// 12. Browse by Genre
app.get('/api/genres/:id', async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.id);
    const mediaType = (req.query.type as 'all' | 'movie' | 'tv') || 'all';
    const page = parseInt(req.query.page as string) || 1;
    const provider = getMovieProvider();
    const data = await provider.getByGenre(genreId, mediaType, page);
    res.json(data);
  } catch (error) {
    console.error('Genre browse error:', error);
    res.status(500).json({ error: 'Failed to retrieve titles for this genre.' });
  }
});

// 13. Recommendations
app.get('/api/media/:type/:id/recommendations', async (req: Request, res: Response) => {
  try {
    const mediaType = req.params.type as 'movie' | 'tv';
    const id = parseInt(req.params.id);
    const provider = getMovieProvider();
    const recs = await provider.getRecommendations(id, mediaType);
    res.json({ results: recs });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to retrieve recommendations.' });
  }
});

// 14. Cast & Credits
app.get('/api/media/:type/:id/credits', async (req: Request, res: Response) => {
  try {
    const mediaType = req.params.type as 'movie' | 'tv';
    const id = parseInt(req.params.id);
    const provider = getMovieProvider();
    const credits = await provider.getCredits(id, mediaType);
    res.json(credits);
  } catch (error) {
    console.error('Credits error:', error);
    res.status(500).json({ error: 'Failed to retrieve credits.' });
  }
});

// 15. Trailers
app.get('/api/media/:type/:id/trailers', async (req: Request, res: Response) => {
  try {
    const mediaType = req.params.type as 'movie' | 'tv';
    const id = parseInt(req.params.id);
    const provider = getMovieProvider();
    const trailers = await provider.getTrailers(id, mediaType);
    res.json({ trailers });
  } catch (error) {
    console.error('Trailers error:', error);
    res.status(500).json({ error: 'Failed to retrieve trailers.' });
  }
});

// 16. AI Recommendation Engine (POST /api/ai/recommend)
app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkAiRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment before asking MovieLot AI again.' });
    return;
  }

  try {
    const payload = req.body || {};
    const results = await generateRecommendations(payload);
    res.json({ results });
  } catch (error: unknown) {
    console.error('AI Recommendation endpoint error:', error);
    const message = error instanceof Error ? error.message : 'MovieLot AI recommendation engine encountered an issue.';
    res.status(500).json({ error: message });
  }
});

// 17. AI Chat Assistant (POST /api/ai/chat)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkAiRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment before sending another message.' });
    return;
  }

  try {
    const { messages = [], message = '' } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    if (message.length > 500) {
      res.status(400).json({ error: 'Message must be under 500 characters.' });
      return;
    }

    const aiResponse = await chatWithAssistant(messages, message.trim());
    res.json(aiResponse);
  } catch (error: unknown) {
    console.error('AI Chat endpoint error:', error);
    const message = error instanceof Error ? error.message : 'MovieLot AI is taking a short break. Please try again.';
    res.status(500).json({ error: message });
  }
});

// ==========================================
// AUTHENTICATION & ADMIN ENDPOINTS
// ==========================================

// Token extraction helper
function extractBearerToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return '';
}

// Middleware: Require signed in user
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in to continue.' });
    return;
  }

  const user = AuthService.verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session has expired or is invalid. Please sign in again.' });
    return;
  }

  (req as Request & { user: User }).user = user;
  next();
}

// Middleware: Require admin privileges
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as Request & { user: User }).user;
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Administrative security clearance required.' });
      return;
    }
    next();
  });
}

// 18. Register New User (POST /api/auth/register)
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body || {};
    const result = AuthService.register({ name, email, password });
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed.';
    res.status(400).json({ error: message });
  }
});

// 19. User Login (POST /api/auth/login)
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    const result = AuthService.login({ email, password });
    res.json({
      success: true,
      message: 'Signed in successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed.';
    res.status(401).json({ error: message });
  }
});

// 20. Current User Profile (GET /api/auth/me)
app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as Request & { user: User }).user;
  res.json({ user });
});

// 21. User Logout (POST /api/auth/logout)
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = extractBearerToken(req);
  if (token) {
    AuthService.revokeToken(token);
  }
  res.json({ success: true, message: 'Signed out successfully.' });
});

// 22. Admin: Get all registered users (GET /api/admin/users)
app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
  try {
    const users = AuthService.getAllUsers();
    res.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not fetch users list.';
    res.status(500).json({ error: message });
  }
});

// 23. Admin: Delete a user (DELETE /api/admin/users/:id)
app.delete('/api/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    AuthService.deleteUser(userId);
    res.json({ success: true, message: 'User removed successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete user.';
    res.status(400).json({ error: message });
  }
});

// 24. Admin: Change user role (POST /api/admin/users/:id/role)
app.post('/api/admin/users/:id/role', requireAdmin, (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body || {};
    if (role !== 'admin' && role !== 'user') {
      res.status(400).json({ error: 'Role must be either "admin" or "user".' });
      return;
    }
    const updated = AuthService.updateUserRole(userId, role);
    res.json({ success: true, user: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user role.';
    res.status(400).json({ error: message });
  }
});

// 25. Admin: Dashboard Stats (GET /api/admin/stats)
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  try {
    const stats = AuthService.getStats();
    res.json({ stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to compile admin stats.';
    res.status(500).json({ error: message });
  }
});

// 26. Admin: Get custom media list (GET /api/admin/movies)
app.get('/api/admin/movies', requireAdmin, (_req: Request, res: Response) => {
  try {
    const movies = getCustomMediaList();
    res.json({ movies });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch catalog.';
    res.status(500).json({ error: message });
  }
});

// 27. Admin: Add custom title to catalog (POST /api/admin/movies)
app.post('/api/admin/movies', requireAdmin, (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.title || !payload.overview || !payload.posterPath) {
      res.status(400).json({ error: 'Title, overview, and poster URL are required.' });
      return;
    }
    const item = addCustomMedia(payload);
    res.status(201).json({ success: true, item, message: `"${item.title}" successfully added to catalog.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add media item.';
    res.status(500).json({ error: message });
  }
});

// 27b. Admin: Update custom title in catalog (PUT /api/admin/movies/:id)
app.put('/api/admin/movies/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const payload = req.body;
    const updated = updateCustomMedia(id, payload);
    if (!updated) {
      res.status(404).json({ error: 'Custom title not found to update.' });
      return;
    }
    res.json({ success: true, item: updated, message: `"${updated.title}" updated successfully.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update media item.';
    res.status(500).json({ error: message });
  }
});

// 28. Admin: Delete custom title from catalog (DELETE /api/admin/movies/:id)
app.delete('/api/admin/movies/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = deleteCustomMedia(id);
    if (!success) {
      res.status(404).json({ error: 'Custom media item not found.' });
      return;
    }
    res.json({ success: true, message: 'Media title removed from catalog.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete media item.';
    res.status(500).json({ error: message });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Note: express 4 uses '*'
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MovieLot.com Server running on http://localhost:${PORT}`);
  });
}

startServer();
