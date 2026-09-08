import React from 'react';
import { Film, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, unknown>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="footer" className="mt-20 border-t border-zinc-850 bg-[#07090e] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Manifesto */}
          <div className="space-y-4 md:col-span-1">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold">
                <Film size={18} />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-['Space_Grotesk']">
                MOVIELOT<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              The premier destination for cinematic discovery. Find top-rated films, binge-worthy series, and intelligent AI-powered recommendations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>100% Legal & Safe Discovery Catalog</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('trending')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Trending Now
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('movies')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Explore Movies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tv')}
                  className="hover:text-amber-400 transition-colors"
                >
                  TV Shows & Series
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('popular')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Popular Hits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('genres')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Browse Genres
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('favorites')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Watchlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Advanced Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  AI Recommendations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Compliance Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Legal & Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', { section: 'privacy' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', { section: 'terms' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', { section: 'dmca' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  DMCA / Content Notice
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', { section: 'about' })}
                  className="hover:text-amber-400 transition-colors"
                >
                  About MovieLot
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-850/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            MovieLot does not host or distribute pirated files or media streams. All trailers are streamed via YouTube official embeds and API specifications.
          </p>
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} MovieLot.com</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart size={10} className="text-red-500 fill-current" /> for film lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
