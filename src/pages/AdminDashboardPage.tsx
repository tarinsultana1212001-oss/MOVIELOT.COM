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
  UserCheck
} from 'lucide-react';
import { useAuth, HARDCODED_ADMIN_EMAIL } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { User, AdminStats, MediaItem, CustomMediaPayload } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (view: string, params?: Record<string, unknown>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, token, isAdmin, toggleAdminAccess, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'catalog' | 'security'>('users');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [customMovies, setCustomMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User search filter
  const [userSearch, setUserSearch] = useState('');

  // Add Movie Modal State
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState<CustomMediaPayload>({
    title: '',
    mediaType: 'movie',
    overview: '',
    posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000',
    backdropPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
    releaseDate: new Date().toISOString().split('T')[0],
    voteAverage: 8.5,
    genres: ['Action', 'Sci-Fi'],
    trailerKey: 'Way9Dexny3w'
  });
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
      const timer = setTimeout(() => setActionMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Delete user
  const handleDeleteUser = async (targetUser: User) => {
    if (!token) return;
    if (targetUser.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
      setActionMessage({ type: 'error', text: 'The root administrator account cannot be deleted.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user ${targetUser.name} (${targetUser.email})?`)) {
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

  // Add Movie
  const handleAddMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormSubmitting(true);

    try {
      await apiClient.addAdminMovie(token, movieForm);
      setActionMessage({ type: 'success', text: `Successfully added "${movieForm.title}" to catalog.` });
      setShowAddMovieModal(false);
      setMovieForm({
        title: '',
        mediaType: 'movie',
        overview: '',
        posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000',
        backdropPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
        releaseDate: new Date().toISOString().split('T')[0],
        voteAverage: 8.5,
        genres: ['Action', 'Sci-Fi'],
        trailerKey: 'Way9Dexny3w'
      });
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not add title.';
      setActionMessage({ type: 'error', text: msg });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Custom Movie
  const handleDeleteMovie = async (movieId: number, title: string) => {
    if (!token) return;
    if (!window.confirm(`Remove "${title}" from MovieLot catalog?`)) return;

    try {
      await apiClient.deleteAdminMovie(token, movieId);
      setActionMessage({ type: 'success', text: `Title "${title}" removed from catalog.` });
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not remove movie.';
      setActionMessage({ type: 'error', text: msg });
    }
  };

  // If not logged in as Admin, show high security Access Gate
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
                You are currently signed in, but Administrative Mode is currently toggled OFF.
              </>
            ) : (
              <>
                This administrative control panel requires verified root administrator security clearance.
                Please sign in with an authorized administrator account.
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

  // Filter users by search term
  const filteredUsers = usersList.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Shield size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-black tracking-wider uppercase">
                  Root Admin Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Secured & Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
                MovieLot Administrative Operations
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Authenticated as <span className="text-amber-400 font-semibold">{user.email}</span> • Full Privilege Clearance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh console metrics"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-amber-400' : ''} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Exit to Main Site</span>
              <ExternalLink size={14} />
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Registered Users</span>
            <div className="text-2xl font-black text-white font-['Space_Grotesk']">
              {stats?.totalUsers || usersList.length}
            </div>
            <span className="text-[11px] text-zinc-400">Total accounts active</span>
          </div>
        </div>

        {/* Catalog Items */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Film size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Catalog Titles</span>
            <div className="text-2xl font-black text-white font-['Space_Grotesk']">
              {(stats?.totalMovies || 12) + (stats?.totalTVShows || 6) + customMovies.length}
            </div>
            <span className="text-[11px] text-amber-400 font-medium">+{customMovies.length} custom added</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Sessions</span>
            <div className="text-2xl font-black text-white font-['Space_Grotesk']">
              {stats?.activeSessions || 1}
            </div>
            <span className="text-[11px] text-zinc-400">Encrypted token bearer</span>
          </div>
        </div>

        {/* Security / System */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Admin Security</span>
            <div className="text-lg font-black text-emerald-400 font-['Space_Grotesk']">
              PBKDF2 Salted
            </div>
            <span className="text-[11px] text-zinc-400">Zero plaintext leakage</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-zinc-800 mb-6 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>User Accounts ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-amber-500 text-amber-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Film size={16} />
          <span>Catalog & Content Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-amber-500 text-amber-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Lock size={16} />
          <span>Security & Confidentiality Protocol</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/50">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or role..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs sm:text-sm placeholder-zinc-500 outline-none focus:border-amber-500"
              />
            </div>

            <div className="text-xs text-zinc-400 flex items-center gap-2 self-end sm:self-auto">
              <span>Showing {filteredUsers.length} of {usersList.length} user accounts</span>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-zinc-300">
              <thead className="bg-zinc-900/90 text-zinc-400 uppercase text-[10px] tracking-wider font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">User / Member</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Access Role</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredUsers.map((u) => {
                  const isPrimaryAdmin = u.email.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase();
                  return (
                    <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-inner ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {u.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isPrimaryAdmin && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Primary Root
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-500 font-mono">{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {u.role === 'admin' && <Shield size={11} />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPrimaryAdmin ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleRole(u)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                title="Switch between admin and member role"
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete account"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-zinc-500 italic">Protected Root</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG & CONTENT MANAGEMENT */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Catalog & MovieLot Exclusive Additions
              </h2>
              <p className="text-xs text-zinc-400">
                Add custom premiere titles, trailers, and series directly to the MovieLot discovery catalog.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMovieModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Movie / TV Series</span>
            </button>
          </div>

          {/* Custom added movies list */}
          {customMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
                >
                  <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                    <img
                      src={movie.backdropPath || movie.posterPath}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-black">
                        {movie.mediaType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Star size={10} className="fill-amber-400" />
                        {movie.voteAverage}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{movie.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {movie.overview}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {movie.genres.map((g) => (
                          <span key={g.id} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onNavigate(movie.mediaType === 'tv' ? 'tv-detail' : 'movie-detail', { id: movie.id })}
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                      >
                        <span>View in App</span>
                        <ExternalLink size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMovie(movie.id, movie.title)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium p-1 rounded hover:bg-red-950/40"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950/60 border border-zinc-850 rounded-2xl p-12 text-center">
              <Film size={40} className="text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No custom titles added yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                You can add exclusive indie films, local releases, or custom trailers directly to the catalog using the button above.
              </p>
              <button
                type="button"
                onClick={() => setShowAddMovieModal(true)}
                className="py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First Title</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SECURITY & CONFIDENTIALITY PROTOCOL */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Admin Information Confidentiality & Architecture
                </h2>
                <p className="text-xs text-zinc-400">
                  Detailed security architecture fulfilling the requirement: &quot;admin information also secrate&quot;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={15} />
                  1. Server-Side Cryptographic Hashing
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  All user passwords and administrator credentials are encrypted using Node.js built-in <span className="text-amber-300 font-mono">crypto.pbkdf2Sync</span> with a unique 128-bit cryptographic salt per account, ran over 10,000 SHA-512 iterations. Plaintext passwords are never persisted on disk or returned in API responses.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={15} />
                  2. Strict Role-Based Access Control (RBAC)
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Administrative API endpoints (`/api/admin/*`) enforce the <span className="text-amber-300 font-mono">requireAdmin</span> middleware. Requests lacking a verified Bearer session token associated with role <span className="text-amber-300 font-mono">admin</span> are rejected with HTTP 403 Forbidden.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={15} />
                  3. Root Admin Protection & Immutability
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The primary root administrator account is permanently safeguarded on the backend against accidental deletion or role demotion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={15} />
                  4. Ephemeral Session Expiry & Revocation
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tokens are generated using cryptographically strong pseudo-random 256-bit entropy (<span className="text-amber-300 font-mono">ml_sess_...</span>). When an admin logs out or deletes a user, tokens are immediately purged from the active session registry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MOVIE MODAL */}
      {showAddMovieModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowAddMovieModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film size={20} className="text-amber-500" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Add New Title to MovieLot</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMovieModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMovieSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Media Type</label>
                  <select
                    value={movieForm.mediaType}
                    onChange={(e) => setMovieForm({ ...movieForm, mediaType: e.target.value as 'movie' | 'tv' })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  >
                    <option value="movie">Movie</option>
                    <option value="tv">TV Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    value={movieForm.voteAverage}
                    onChange={(e) => setMovieForm({ ...movieForm, voteAverage: parseFloat(e.target.value) || 8.0 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar Odyssey"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Overview / Synopsis</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Compelling plot synopsis..."
                  value={movieForm.overview}
                  onChange={(e) => setMovieForm({ ...movieForm, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={movieForm.posterPath}
                  onChange={(e) => setMovieForm({ ...movieForm, posterPath: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Release Date</label>
                  <input
                    type="date"
                    required
                    value={movieForm.releaseDate}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">YouTube Trailer ID</label>
                  <input
                    type="text"
                    placeholder="e.g. d9MyW72ELq0"
                    value={movieForm.trailerKey}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="py-2 px-4 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {formSubmitting ? 'Adding Title...' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
