import React, { useEffect } from 'react';
import { X, Film, AlertCircle } from 'lucide-react';
import { VideoTrailer } from '../types';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailers?: VideoTrailer[];
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  title,
  trailers = []
}) => {
  // Pick the best official trailer or first available trailer
  const activeTrailer = trailers.find((t) => t.type === 'Trailer' && t.official) ||
    trailers.find((t) => t.type === 'Trailer') ||
    trailers[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer for ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121620] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#0d1017]">
          <div className="flex items-center gap-2">
            <Film className="text-amber-500" size={18} />
            <h3 className="font-semibold text-sm sm:text-base text-zinc-100 line-clamp-1">
              {title} {activeTrailer ? `— ${activeTrailer.name}` : ''}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trailer dialog"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Player Viewport */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {activeTrailer?.key ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 gap-3">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                <AlertCircle size={28} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-zinc-200">Trailer unavailable</h4>
                <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                  An official preview for this title is currently not distributed on YouTube. Check back soon!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
              >
                Return to details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
