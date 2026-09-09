import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Users,
  Film,
  Lock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Tv,
  Star,
  Activity,
  UserCheck,
  Sparkles,
  Clapperboard,
  Video,
  Edit,
  Play,
  Layers,
  Building2,
  Clock,
  Eye
} from 'lucide-react';
import { useAuth, HARDCODED_ADMIN_EMAIL } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { User, AdminStats, MediaItem, CustomMediaPayload, MediaType } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (view: string, params?: Record<string, unknown>) => void;
}

const ALL_GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Anime', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
  'Shonen', 'Seinen', 'Supernatural', 'Cyberpunk', 'Slice of Life'
];

const QUICK_PRESETS: Array<{ label: string; data: CustomMediaPayload }> = [
  {
    label: '✨ Anime: Attack on Titan (Final Season)',
    data: {
      title: 'Attack on Titan: The Final Season',
      originalTitle: '進撃の巨人 The Final Season',
      mediaType: 'anime',
      overview: 'After years of fierce war against Titans, the Survey Corps journeys across the sea to Marley, uncovering the true truth of Eldia and humanity\'s tragic cycle of freedom and sacrifice.',
      posterPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000',
      backdropPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
      releaseDate: '2023-11-04',
      voteAverage: 9.2,
      voteCount: 145000,
      runtime: 24,
      seasonsCount: 4,
      episodesCount: 89,
      director: 'Yuichiro Hayashi',
      studio: 'MAPPA',
      castNames: ['Yuki Kaji', 'Yui Ishikawa', 'Marina Inoue', 'Hiroshi Kamiya'],
      genres: ['Anime', 'Action', 'Dark Fantasy', 'Mystery'],
      trailerKey: 'M_OauHnAFc8'
    }
  },
  {
    label: '✨ Anime: Demon Slayer: Infinity Castle',
    data: {
      title: 'Demon Slayer: Kimetsu no Yaiba - Infinity Castle',
      originalTitle: '鬼滅の刃 無限城編',
      mediaType: 'anime',
      overview: 'The Demon Slayer Corps plunge directly into Muzan Kibutsuji\'s multidimensional Infinity Castle for the final climactic confrontation between Hashira and the Upper Rank demons.',
      posterPath: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000',
      backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
      releaseDate: '2025-04-15',
      voteAverage: 9.3,
      voteCount: 98000,
      runtime: 110,
      director: 'Haruo Sotozaki',
      studio: 'Ufotable',
      castNames: ['Natsuki Hanae', 'Akari Kito', 'Hiro Shimono', 'Yoshitsugu Matsuoka'],
      genres: ['Anime', 'Action', 'Supernatural', 'Shonen'],
      trailerKey: 'dQw4w9WgXcQ'
    }
  },
  {
    label: '🎬 Movie: Interstellar Remastered',
    data: {
      title: 'Interstellar: IMAX Special Edition',
      originalTitle: 'Interstellar',
      mediaType: 'movie',
      overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      posterPath: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000',
      backdropPath: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
      releaseDate: '2024-11-07',
      voteAverage: 8.7,
      voteCount: 34000,
      runtime: 169,
      director: 'Christopher Nolan',
      studio: 'Syncopy / Warner Bros.',
      castNames: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
      genres: ['Sci-Fi', 'Drama', 'Adventure'],
      trailerKey: 'zSWdZVtXT7E'
    }
  },
  {
    label: '🌿 Documentary: Planet Earth III',
    data: {
      title: 'Planet Earth III: Natural Wonders',
      originalTitle: 'Planet Earth III',
      mediaType: 'documentary',
      overview: 'Sir David Attenborough narrates groundbreaking footage across extraordinary ecosystems, unveiling animal resilience in our rapidly transforming world.',
      posterPath: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000',
      backdropPath: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
      releaseDate: '2023-10-22',
      voteAverage: 9.4,
      voteCount: 18000,
      runtime: 58,
      seasonsCount: 1,
      episodesCount: 8,
      director: 'Michael Gunton',
      studio: 'BBC Studios Natural History Unit',
      castNames: ['Sir David Attenborough'],
      genres: ['Documentary', 'Nature', 'Science'],
      trailerKey: '7nN6G_n3h2k'
    }
  }
];

const DEFAULT_FORM_STATE: CustomMediaPayload = {
  title: '',
  originalTitle: '',
  mediaType: 'anime',
  overview: '',
  posterPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000',
  backdropPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
  releaseDate: new Date().toISOString().split('T')[0],
  voteAverage: 8.8,
  voteCount: 1200,
  runtime: 24,
  seasonsCount: 1,
  episodesCount: 12,
  director: '',
  studio: '',
  castNames: ['Main Character', 'Supporting Actor'],
  genres: ['Anime', 'Action'],
  trailerKey: '',
  streamUrl: ''
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, token, isAdmin, toggleAdminAccess, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'users' | 'security'>('catalog');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [customMovies, setCustomMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filters
  const [catalogFilterType, setCatalogFilterType] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Add & Edit Media Modal State
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [mediaForm, setMediaForm] = useState<CustomMediaPayload>(DEFAULT_FORM_STATE);
  const [castInput, setCastInput] = useState('Main Character, Supporting Actor');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch admin data
  const fetchData = useCallback(async () => {
    if (!token || !isAdmin) return;
    setLoading(true);
    try {
      const [statsRes, usersRes, moviesRes] = await Promise.all([
        apiClient.getAdminStats(token),
        apiClient.getAdminUsers(token),
        apiClient.getAdminMovies(token)
      ]);
      setStats(statsRes.stats);
      setUsersList(usersRes.users);
      setCustomMovies(moviesRes.movies);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load administrative information.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Flash message timeout
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Handle open modal for creating new title
  const handleOpenAddModal = (preset?: CustomMediaPayload) => {
    setEditingMediaId(null);
    if (preset) {
      setMediaForm({ ...preset });
      setCastInput(Array.isArray(preset.castNames) ? preset.castNames.join(', ') : (preset.castNames || ''));
    } else {
      setMediaForm({ ...DEFAULT_FORM_STATE });
      setCastInput('Main Voice Actor, Supporting Character');
    }
    setShowMediaModal(true);
  };

  // Handle open modal for editing title
  const handleOpenEditModal = (item: MediaItem) => {
    setEditingMediaId(item.id);
    const existingGenres = item.genres.map(g => g.name);
    const existingCast = item.cast ? item.cast.map(c => c.name) : [];

    setMediaForm({
      title: item.title,
      originalTitle: item.originalTitle || item.title,
      mediaType: item.mediaType,
      overview: item.overview,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath || item.posterPath,
      releaseDate: item.releaseDate || new Date().toISOString().split('T')[0],
      voteAverage: item.voteAverage,
      voteCount: item.voteCount,
      runtime: item.runtime || 24,
      seasonsCount: item.seasonsCount,
      episodesCount: item.episodesCount,
      director: item.director || '',
      studio: item.studio || '',
      castNames: existingCast,
      genres: existingGenres.length > 0 ? existingGenres : ['Anime'],
      trailerKey: item.trailers && item.trailers.length > 0 ? item.trailers[0].key : '',
      streamUrl: item.streamUrl || ''
    });
    setCastInput(existingCast.join(', '));
    setShowMediaModal(true);
  };

  // Helper to extract clean youtube key
  const sanitizeTrailerKey = (val?: string): string => {
    if (!val) return '';
    const clean = val.trim();
    if (clean.includes('watch?v=')) {
      const match = clean.match(/v=([^&]+)/);
      return match ? match[1] : clean;
    }
    if (clean.includes('youtu.be/')) {
      const match = clean.match(/youtu\.be\/([^?&]+)/);
      return match ? match[1] : clean;
    }
    return clean;
  };

  // Handle Add/Edit Media Submit
  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormSubmitting(true);

    try {
      const parsedCast = castInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload: CustomMediaPayload = {
        ...mediaForm,
        castNames: parsedCast,
        trailerKey: sanitizeTrailerKey(mediaForm.trailerKey)
      };

      if (editingMediaId) {
        await apiClient.updateAdminMovie(token, editingMediaId, payload);
        setActionMessage({ type: 'success', text: `Successfully updated "${payload.title}".` });
      } else {
        await apiClient.addAdminMovie(token, payload);
        setActionMessage({
          type: 'success',
          text: `Successfully uploaded ${payload.mediaType.toUpperCase()}: "${payload.title}" to catalog!`
        });
      }

      setShowMediaModal(false);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save media item.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Custom Movie
  const handleDeleteMedia = async (movieId: number, title: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to remove "${title}" from the MovieLot catalog?`)) return;

    try {
      await apiClient.deleteAdminMovie(token, movieId);
      setActionMessage({ type: 'success', text: `"${title}" has been removed from the catalog.` });
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not remove media.';
      setActionMessage({ type: 'error', text: msg });
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUser: User) => {
    if (!token) return;
    if (targetUser.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
      setActionMessage({ type: 'error', text: 'The root administrator account cannot be deleted.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account ${targetUser.name} (${targetUser.email})?`)) {
      return;
    }

    try {
      await apiClient.deleteAdminUser(token, targetUser.id);
      setActionMessage({ type: 'success', text: `User ${targetUser.email} has been removed.` });
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete user.';
      setActionMessage({ type: 'error', text: msg });
    }
  };

  // Toggle user role
  const handleToggleRole = async (targetUser: User) => {
    if (!token) return;
    if (targetUser.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
      setActionMessage({ type: 'error', text: 'Root admin role cannot be modified.' });
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await apiClient.updateUserRole(token, targetUser.id, newRole);
      setActionMessage({
        type: 'success',
        text: `Role for ${targetUser.name} updated to ${newRole.toUpperCase()}.`
      });
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update role.';
      setActionMessage({ type: 'error', text: msg });
    }
  };

  // Toggle Genre in Form
  const handleToggleGenre = (genreName: string) => {
    setMediaForm(prev => {
      const exists = prev.genres.includes(genreName);
      if (exists) {
        return { ...prev, genres: prev.genres.filter(g => g !== genreName) };
      } else {
        return { ...prev, genres: [...prev.genres, genreName] };
      }
    });
  };

  // Access Gate for Non-Admins
  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
            Admin Portal Access Restricted
          </h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            {user?.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase() ? (
              <>
                You are currently signed in, but Administrative Mode is toggled OFF.
              </>
            ) : (
              <>
                This administrative operations dashboard requires verified root administrator privileges.
              </>
            )}
          </p>
          <div className="space-y-3">
            {user?.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase() ? (
              <button
                type="button"
                onClick={toggleAdminAccess}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield size={16} />
                <span>Toggle Admin Mode ON</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Sign In as Administrator
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Return to Discovery Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Filter custom catalog
  const filteredCatalog = customMovies.filter(item => {
    const matchesType = catalogFilterType === 'all' || item.mediaType === catalogFilterType;
    const matchesSearch =
      item.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (item.originalTitle && item.originalTitle.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      (item.studio && item.studio.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      (item.director && item.director.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Filter users by search term
  const filteredUsers = usersList.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Shield size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-black tracking-wider uppercase">
                  Root Administrator
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Privileged Operations Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
                Media & Platform Control Center
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Upload & manage Movies, TV Shows, Anime series, and Documentaries across MovieLot.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto">
            <button
              type="button"
              id="btn-upload-new-media-header"
              onClick={() => handleOpenAddModal()}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus size={16} />
              <span>Upload Title</span>
            </button>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh console metrics"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-amber-400' : ''} />
            </button>
          </div>
        </div>

        {/* Action Flash Message */}
        {actionMessage && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {/* Total Movies */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Film size={20} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Movies</span>
            <div className="text-xl font-black text-white font-['Space_Grotesk']">
              {stats?.totalMovies || 12}
            </div>
            <span className="text-[10px] text-zinc-500">Feature Films</span>
          </div>
        </div>

        {/* Total Anime */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-amber-500/20 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Anime</span>
            <div className="text-xl font-black text-white font-['Space_Grotesk']">
              {stats?.totalAnime || 8}
            </div>
            <span className="text-[10px] text-zinc-500">Series & Films</span>
          </div>
        </div>

        {/* Total TV Shows */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Tv size={20} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">TV Series</span>
            <div className="text-xl font-black text-white font-['Space_Grotesk']">
              {stats?.totalTVShows || 6}
            </div>
            <span className="text-[10px] text-zinc-500">Shows & Miniseries</span>
          </div>
        </div>

        {/* Custom Uploads */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Admin Uploads</span>
            <div className="text-xl font-black text-white font-['Space_Grotesk']">
              {customMovies.length}
            </div>
            <span className="text-[10px] text-zinc-500">Custom Titles</span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Total Users</span>
            <div className="text-xl font-black text-white font-['Space_Grotesk']">
              {stats?.totalUsers || usersList.length}
            </div>
            <span className="text-[10px] text-zinc-500">Accounts Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6">
        <button
          type="button"
          id="tab-admin-catalog"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <Clapperboard size={15} />
          <span>Catalog & Upload Management ({customMovies.length})</span>
        </button>

        <button
          type="button"
          id="tab-admin-users"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <Users size={15} />
          <span>User Accounts ({usersList.length})</span>
        </button>

        <button
          type="button"
          id="tab-admin-security"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <Lock size={15} />
          <span>Security Protocol</span>
        </button>
      </div>

      {/* TAB 1: CATALOG & MEDIA UPLOADS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Action & Filter Toolbar */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Upload & Manage Titles (Movies, Anime, TV, Documentaries)
                </h2>
                <p className="text-xs text-zinc-400">
                  Add full-length movies, anime series, documentaries, studio information, and trailer players.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-add-title-modal-trigger"
                  onClick={() => handleOpenAddModal()}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Upload New Media Title</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Test Seeder Templates */}
            <div className="pt-3 border-t border-zinc-900">
              <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                ⚡ Quick-Fill Preset Upload Templates (1-Click Test Seeding):
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenAddModal(preset.data)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Pills and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-900">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Media' },
                  { id: 'movie', label: 'Movies' },
                  { id: 'anime', label: 'Anime' },
                  { id: 'tv', label: 'TV Shows' },
                  { id: 'documentary', label: 'Documentaries' },
                  { id: 'animation', label: 'Animation' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setCatalogFilterType(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      catalogFilterType === type.id
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search catalog by title, studio, or director..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full sm:w-72 pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-amber-500/40 transition-all"
                >
                  <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                    <img
                      src={item.backdropPath || item.posterPath}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        item.mediaType === 'anime'
                          ? 'bg-purple-500 text-white'
                          : item.mediaType === 'movie'
                          ? 'bg-amber-500 text-black'
                          : item.mediaType === 'documentary'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {item.mediaType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Star size={10} className="fill-amber-400" />
                        {item.voteAverage.toFixed(1)}
                      </span>
                    </div>

                    {item.studio && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-zinc-700 text-[10px] font-semibold text-zinc-200">
                        {item.studio}
                      </div>
                    )}

                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-base font-bold text-white truncate drop-shadow-md">
                        {item.title}
                      </h3>
                      {item.originalTitle && item.originalTitle !== item.title && (
                        <p className="text-[11px] text-amber-400 truncate drop-shadow">
                          {item.originalTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {item.overview}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {item.seasonsCount && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
                            {item.seasonsCount} Season{item.seasonsCount > 1 ? 's' : ''} ({item.episodesCount || 12} Eps)
                          </span>
                        )}
                        {item.runtime && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                            <Clock size={10} />
                            {item.runtime}m
                          </span>
                        )}
                        {item.director && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            Dir: {item.director}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.genres.map((g) => (
                          <span key={g.id} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800/80 text-zinc-400">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.mediaType === 'anime') {
                              onNavigate('anime');
                            } else if (item.mediaType === 'tv') {
                              onNavigate('tv-detail', { showId: item.id, initialItem: item });
                            } else {
                              onNavigate('movie-detail', { movieId: item.id, initialItem: item });
                            }
                          }}
                          className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                        >
                          <Edit size={12} />
                          <span>Edit</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id, item.title)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950/60 border border-zinc-850 rounded-2xl p-12 text-center">
              <Film size={44} className="text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">
                {customMovies.length === 0 ? 'No custom titles uploaded yet' : 'No titles match current filter'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
                You can upload anime series, movies, and documentaries directly into the MovieLot discovery universe.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Plus size={15} />
                <span>Upload First Title</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
            <div>
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Registered Platform Users ({usersList.length})
              </h2>
              <p className="text-xs text-zinc-400">Manage privileges, authentication roles, and account security.</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredUsers.map((u) => {
                    const isPrimary = u.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase();
                    return (
                      <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white flex items-center gap-2">
                            {u.name}
                            {isPrimary && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-black">
                                ROOT
                              </span>
                            )}
                          </div>
                          <div className="text-zinc-400 text-[11px]">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!isPrimary ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleRole(u)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-500 italic">Protected Root Account</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY PROTOCOL */}
      {activeTab === 'security' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Confidentiality & Administrator Protection Architecture
              </h2>
              <p className="text-xs text-zinc-400">
                Administrative security protocols, token authentication, and role validation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <CheckCircle size={15} />
                1. Cryptographic Password Hashing
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                All credentials are encrypted using PBKDF2 SHA-512 with unique cryptographic salt per user over 10,000 rounds. Plaintext secrets are never stored or logged.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <CheckCircle size={15} />
                2. Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                All `/api/admin/*` endpoints strictly verify Bearer session tokens with the <span className="text-amber-300 font-mono">requireAdmin</span> middleware.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <CheckCircle size={15} />
                3. Root Admin Protection
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                The primary administrator is permanently protected from deletion, downgrade, or unauthorized modifications.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <CheckCircle size={15} />
                4. Multi-Media Universal Catalog
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Admins have full capability to upload, modify, and stream Movies, Anime, TV Shows, and Documentaries with custom trailers and metadata.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEDIA MODAL */}
      {showMediaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowMediaModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clapperboard size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                    {editingMediaId ? `Edit Title: ${mediaForm.title}` : 'Upload Title to Catalog'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Upload full metadata for Movies, Anime, TV Series, or Documentaries.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleMediaSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Media Type & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Media Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    id="select-media-type"
                    value={mediaForm.mediaType}
                    onChange={(e) => setMediaForm({ ...mediaForm, mediaType: e.target.value as MediaType })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-medium outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="anime">Anime (Series / Film)</option>
                    <option value="movie">Feature Film</option>
                    <option value="tv">TV Series</option>
                    <option value="documentary">Documentary</option>
                    <option value="animation">Western Animation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Rating (1-10) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="input-media-rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    value={mediaForm.voteAverage}
                    onChange={(e) => setMediaForm({ ...mediaForm, voteAverage: parseFloat(e.target.value) || 8.0 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Release Date <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="input-media-release-date"
                    type="date"
                    required
                    value={mediaForm.releaseDate}
                    onChange={(e) => setMediaForm({ ...mediaForm, releaseDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Title & Native/Original Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    English / Main Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="input-media-title"
                    type="text"
                    required
                    placeholder="e.g. Attack on Titan / Dune: Part Two"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Original / Native Title (Kanji/Romaji)
                  </label>
                  <input
                    id="input-media-original-title"
                    type="text"
                    placeholder="e.g. 進撃の巨人 / Kimetsu no Yaiba"
                    value={mediaForm.originalTitle || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, originalTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Overview */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Synopsis / Storyline Overview <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="input-media-overview"
                  rows={3}
                  required
                  placeholder="Provide an engaging synopsis describing the plot, characters, and narrative tension..."
                  value={mediaForm.overview}
                  onChange={(e) => setMediaForm({ ...mediaForm, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Poster and Backdrop URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Poster Image URL <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="input-media-poster"
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={mediaForm.posterPath}
                    onChange={(e) => setMediaForm({ ...mediaForm, posterPath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Backdrop / Hero Banner URL
                  </label>
                  <input
                    id="input-media-backdrop"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={mediaForm.backdropPath || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, backdropPath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Studio, Director & Episode Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Studio / Production
                  </label>
                  <input
                    id="input-media-studio"
                    type="text"
                    placeholder="e.g. MAPPA, Ufotable, A24"
                    value={mediaForm.studio || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, studio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Director / Creator
                  </label>
                  <input
                    id="input-media-director"
                    type="text"
                    placeholder="e.g. Hayao Miyazaki"
                    value={mediaForm.director || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, director: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Seasons (if series)
                  </label>
                  <input
                    id="input-media-seasons"
                    type="number"
                    min="0"
                    placeholder="e.g. 4"
                    value={mediaForm.seasonsCount || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, seasonsCount: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Runtime / Episodes
                  </label>
                  <input
                    id="input-media-runtime"
                    type="number"
                    min="1"
                    placeholder="e.g. 24 or 120"
                    value={mediaForm.runtime || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, runtime: parseInt(e.target.value) || 24 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cast Members */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Cast / Voice Actors (Comma separated)
                </label>
                <input
                  id="input-media-cast"
                  type="text"
                  placeholder="Yuki Kaji, Yui Ishikawa, Hiroshi Kamiya"
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                />
              </div>

              {/* Genres Multi-Select Pills */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Genres (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                  {ALL_GENRE_OPTIONS.map((g) => {
                    const active = mediaForm.genres.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleToggleGenre(g)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          active
                            ? 'bg-amber-500 text-black shadow-sm'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trailer ID and Streaming Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    YouTube Trailer (Video ID or Full URL)
                  </label>
                  <input
                    id="input-media-trailer"
                    type="text"
                    placeholder="e.g. M_OauHnAFc8 or https://youtu.be/..."
                    value={mediaForm.trailerKey || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, trailerKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Stream / Official Platform URL (Optional)
                  </label>
                  <input
                    id="input-media-stream"
                    type="url"
                    placeholder="https://..."
                    value={mediaForm.streamUrl || ''}
                    onChange={(e) => setMediaForm({ ...mediaForm, streamUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-media-upload"
                  disabled={formSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Saving Title...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      <span>{editingMediaId ? 'Save Changes' : 'Publish to Catalog'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
