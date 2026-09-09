import React, { useState, useEffect, useRef } from 'react';
import { Film, Search, Bookmark, Sparkles, Menu, X, Flame, TrendingUp, Grid, Shield, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth, HARDCODED_ADMIN_EMAIL } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, unknown>) => void;
  onOpenAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiChat
}) => {
  const { count: favoritesCount } = useFavorites();
  const { user, isAuthenticated, isAdmin, toggleAdminAccess, openAuthModal, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'anime', label: 'Anime', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'genres', label: 'Genres', icon: Grid }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    if (currentView === 'admin') {
      onNavigate('home');
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090b10]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-[#090b10]/90 via-[#090b10]/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center font-['Space_Grotesk']">
              MOVIELOT<span className="text-amber-500">.</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold -mt-1 hidden sm:block">
              Cinematic Discovery
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {link.icon && <link.icon size={14} className={isActive ? 'text-amber-400' : 'text-zinc-400'} />}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Portal Shortcut Button (for Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white'
              }`}
              title="Open Admin Operations Console"
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          )}

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={onOpenAiChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer hover:shadow-md hover:shadow-amber-500/10"
            title="Ask MovieLot AI for recommendations"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => handleNavClick('search')}
            aria-label="Search movies and series"
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              currentView === 'search' ? 'border-amber-500/50 text-amber-400' : ''
            }`}
          >
            <Search size={16} />
            <span className="hidden md:inline text-xs text-zinc-400">Search</span>
          </button>

          {/* Watchlist Bookmark */}
          <button
            type="button"
            onClick={() => handleNavClick('favorites')}
            aria-label="View saved watchlist"
            className={`relative p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'favorites' ? 'border-amber-500/50 text-amber-400' : ''
            }`}
          >
            <Bookmark size={16} className={favoritesCount > 0 ? 'fill-amber-500 text-amber-500' : ''} />
            <span className="hidden md:inline text-xs text-zinc-300">Watchlist</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-black">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* AUTHENTICATION / USER PROFILE */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 transition-colors cursor-pointer"
                aria-label="User account menu"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-inner ${
                    isAdmin
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {user.name.substring(0, 1)}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-zinc-400 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/80 py-2 z-50 animate-fadeIn">
                  {/* User info banner */}
                  <div className="px-4 py-2.5 border-b border-zinc-850">
                    <div className="font-bold text-sm text-white truncate">{user.name}</div>
                    <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                    <div className="mt-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-850 text-zinc-300'
                        }`}
                      >
                        {isAdmin && <Shield size={10} />}
                        {isAdmin ? 'Administrator' : 'MovieLot Member'}
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    {user?.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase() && (
                      <button
                        type="button"
                        onClick={toggleAdminAccess}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 flex items-center justify-between transition-colors cursor-pointer border-b border-zinc-850"
                        title="Toggle Admin mode on or off"
                      >
                        <span className="flex items-center gap-2">
                          <Shield size={14} className={isAdmin ? "text-amber-400" : "text-zinc-500"} />
                          <span>Admin Access</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-500'}`}>
                          {isAdmin ? 'ACTIVE' : 'OFF'}
                        </span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Shield size={14} className="text-amber-500" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleNavClick('favorites')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Bookmark size={14} className="text-zinc-400" />
                      <span>My Watchlist ({favoritesCount})</span>
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="pt-1 border-t border-zinc-850">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <UserIcon size={15} className="stroke-[2.5]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d14] border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {/* User state on mobile */}
          <div className="pb-3 mb-2 border-b border-zinc-850">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{user.name}</div>
                  <div className="text-xs text-zinc-400">{user.email}</div>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Administrator
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2"
              >
                <UserIcon size={16} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-colors ${
                currentView === 'admin' ? 'bg-amber-500 text-black' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Shield size={16} />
              <span>Admin Operations Console</span>
            </button>
          )}

          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
