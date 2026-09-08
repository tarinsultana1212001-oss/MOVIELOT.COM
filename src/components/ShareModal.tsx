import React, { useState } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url = window.location.href
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — MovieLot`,
          text: `Check out ${title} on MovieLot!`,
          url
        });
        onClose();
      } catch {
        // user cancelled or share failed
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share movie"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121620] rounded-2xl border border-zinc-800 p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-lg">
            <Share2 className="text-amber-500" size={20} />
            <span>Share {title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-zinc-400">
          Share this discovery page with fellow film buffs or copy the link below.
        </p>

        {/* URL Box with Copy Button */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-300 px-2 outline-none font-mono select-all"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-500 text-black'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Native Web Share button if available */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            <span>Open System Share Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
