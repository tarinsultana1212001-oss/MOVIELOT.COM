import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showStar?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  size = 'md',
  showStar = true,
  className = ''
}) => {
  const score = Number((rating || 0).toFixed(1));

  let colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (score < 6.5) {
    colorClasses = 'bg-zinc-800 text-zinc-300 border-zinc-700';
  } else if (score < 8.0) {
    colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2 py-1 gap-1.5',
    lg: 'text-sm font-bold px-2.5 py-1.5 gap-2'
  }[size];

  const starSizes = {
    sm: 10,
    md: 12,
    lg: 14
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border backdrop-blur-md ${colorClasses} ${sizeClasses} ${className}`}
      title={`Rating: ${score} / 10`}
    >
      {showStar && <Star size={starSizes} className="fill-current" />}
      <span>{score > 0 ? score.toFixed(1) : 'NR'}</span>
    </span>
  );
};
