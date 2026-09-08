import React from 'react';

interface GenreBadgeProps {
  name: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({
  name,
  size = 'md',
  onClick,
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40' : ''
      } ${sizeClasses} ${className}`}
    >
      {name}
    </span>
  );
};
