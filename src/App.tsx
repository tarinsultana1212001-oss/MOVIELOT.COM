import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem, VideoTrailer } from './types';
import { apiClient } from './services/apiClient';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { AnimePage } from './pages/AnimePage';
import { TrendingPage } from './pages/TrendingPage';
import { PopularPage } from './pages/PopularPage';
import { GenresPage } from './pages/GenresPage';
import { GenreDetailPage } from './pages/GenreDetailPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { TVDetailsPage } from './pages/TVDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LegalPages } from './pages/LegalPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TrailerModal } from './components/TrailerModal';
import { ShareModal } from './components/ShareModal';
import { AIChatModal } from './components/AIChatModal';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, unknown>>({});

  // Active Trailer Modal State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailerTitle, setTrailerTitle] = useState('');
  const [activeTrailers, setActiveTrailers] = useState<VideoTrailer[]>([]);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string; url: string } | null>(null);

  // AI Chat Assistant Modal State
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Synchronize hash routing with state for back/forward browser support and shareable links
  const navigateTo = useCallback((view: string, params: Record<string, unknown> = {}, updateHash = true) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash) {
      if (view === 'movie-detail' && params.movieId) {
        window.location.hash = `#/movie/${params.movieId}`;
      } else if (view === 'tv-detail' && params.showId) {
        window.location.hash = `#/tv/${params.showId}`;
      } else if (view === 'genre-detail' && params.genreId) {
        window.location.hash = `#/genre/${params.genreId}/${encodeURIComponent(String(params.genreName || ''))}`;
      } else if (view === 'home') {
        window.location.hash = '#/';
      } else {
        window.location.hash = `#/${view}`;
      }
    }
  }, []);

  // Parse location hash on load and popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === '/') {
        setCurrentView('home');
        setViewParams({});
        return;
      }

      const parts = hash.split('/');
      const root = parts[0];

      if (root === 'movie' && parts[1]) {
        setCurrentView('movie-detail');
        setViewParams({ movieId: parseInt(parts[1]) });
      } else if (root === 'tv' && parts[1]) {
        setCurrentView('tv-detail');
        setViewParams({ showId: parseInt(parts[1]) });
      } else if (root === 'genre' && parts[1]) {
        setCurrentView('genre-detail');
        setViewParams({
          genreId: parseInt(parts[1]),
          genreName: decodeURIComponent(parts[2] || 'Genre')
        });
      } else if (['movies', 'tv', 'anime', 'trending', 'popular', 'genres', 'search', 'favorites', 'legal', 'admin'].includes(root)) {
        setCurrentView(root);
        setViewParams({});
      } else {
        setCurrentView('home');
        setViewParams({});
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Universal Media Click Handler (Routes to Movie or TV details)
  const handleSelectMedia = useCallback((item: MediaItem) => {
    if (item.mediaType === 'tv') {
      navigateTo('tv-detail', { showId: item.id, initialItem: item });
    } else {
      navigateTo('movie-detail', { movieId: item.id, initialItem: item });
    }
  }, [navigateTo]);

  // Universal Trailer Play Handler
  const handlePlayTrailer = useCallback(async (item: MediaItem) => {
    setTrailerTitle(item.title);
    if (item.trailers && item.trailers.length > 0) {
      setActiveTrailers(item.trailers);
      setTrailerModalOpen(true);
      return;
    }

    try {
      const trailers = await apiClient.getTrailers(item.mediaType, item.id);
      setActiveTrailers(trailers);
    } catch {
      setActiveTrailers([]);
    }
    setTrailerModalOpen(true);
  }, []);

  // Universal Share Handler
  const handleShare = useCallback((item: MediaItem) => {
    const url = `${window.location.origin}/#/${item.mediaType}/${item.id}`;
    setShareItem({ title: item.title, url });
    setShareModalOpen(true);
  }, []);

  // Genre selection handler
  const handleSelectGenre = useCallback((genreId: number, genreName: string) => {
    navigateTo('genre-detail', { genreId, genreName });
  }, [navigateTo]);

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500 selection:text-black">
      {/* Top Fixed Header */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenAiChat={() => setAiChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        {currentView === 'home' && (
          <HomePage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'movies' && (
          <MoviesPage
            initialSort={(viewParams.sort as any) || 'popularity'}
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'tv' && (
          <TVShowsPage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'anime' && (
          <AnimePage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'trending' && (
          <TrendingPage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'popular' && (
          <PopularPage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'genres' && (
          <GenresPage onSelectGenre={handleSelectGenre} />
        )}

        {currentView === 'genre-detail' && (
          <GenreDetailPage
            genreId={(viewParams.genreId as number) || 28}
            genreName={(viewParams.genreName as string) || 'Action'}
            onBack={() => navigateTo('genres')}
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'movie-detail' && (
          <MovieDetailsPage
            movieId={(viewParams.movieId as number) || 693134}
            initialItem={viewParams.initialItem as MediaItem | undefined}
            onBack={() => window.history.back()}
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
            onShare={handleShare}
            onSelectGenre={handleSelectGenre}
          />
        )}

        {currentView === 'tv-detail' && (
          <TVDetailsPage
            showId={(viewParams.showId as number) || 1399}
            initialItem={viewParams.initialItem as MediaItem | undefined}
            onBack={() => window.history.back()}
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
            onShare={handleShare}
            onSelectGenre={handleSelectGenre}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            initialQuery={(viewParams.query as string) || ''}
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
          />
        )}

        {currentView === 'favorites' && (
          <FavoritesPage
            onSelectMovie={handleSelectMedia}
            onPlayTrailer={handlePlayTrailer}
            onExplore={() => navigateTo('home')}
          />
        )}

        {currentView === 'legal' && (
          <LegalPages
            initialSection={(viewParams.section as string) || 'privacy'}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Modals */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={trailerTitle}
        trailers={activeTrailers}
      />

      {shareItem && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title={shareItem.title}
          url={shareItem.url}
        />
      )}

      <AIChatModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onSelectMovie={handleSelectMedia}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
