import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  className?: string;
}

/**
 * Reusable monetization containers ready for ad-network integration (AdSense, sponsor placements).
 * Styled tastefully with clean subtle border and label without cluttering or disrupting content.
 */
export const AdBanner: React.FC<AdPlaceholderProps> = ({ slotId = 'banner-top', className = '' }) => {
  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`w-full max-w-5xl mx-auto my-6 p-4 rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/30 flex flex-col items-center justify-center text-center transition-all ${className}`}
    >
      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Advertisement</span>
      <div className="text-xs text-zinc-600 font-mono">Sponsored Showcase Slot • {slotId}</div>
    </div>
  );
};

export const AdRectangle: React.FC<AdPlaceholderProps> = ({ slotId = 'rect-sidebar', className = '' }) => {
  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`w-full aspect-[4/3] p-4 rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/30 flex flex-col items-center justify-center text-center ${className}`}
    >
      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">Sponsored Partner</span>
      <div className="text-xs text-zinc-600 font-mono">Spotlight Placement • {slotId}</div>
    </div>
  );
};

export const AdBetweenContent: React.FC<AdPlaceholderProps> = ({ slotId = 'between-content', className = '' }) => {
  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`w-full my-8 py-4 px-6 rounded-2xl border border-zinc-800/50 bg-gradient-to-r from-zinc-950 via-[#121622] to-zinc-950 flex items-center justify-between gap-4 ${className}`}
    >
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/80">MovieLot Insider</span>
        <h4 className="text-sm font-semibold text-zinc-200">Discover Exclusive IMAX Screenings & Pre-releases</h4>
      </div>
      <span className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 font-medium">Partner Feature</span>
    </div>
  );
};
