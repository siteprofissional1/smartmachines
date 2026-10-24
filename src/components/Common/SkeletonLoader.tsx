import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 4 }) => {
  return (
    <div className="card space-y-4 animate-pulse">
      <div className="h-6 bg-[var(--bg-elevated)] rounded-md w-1/3 mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/6"></div>
          <div className="h-4 bg-[var(--bg-elevated)] rounded w-2/6"></div>
          <div className="h-4 bg-[var(--bg-elevated)] rounded w-1/6"></div>
          <div className="h-4 bg-[var(--bg-elevated)] rounded w-2/6"></div>
        </div>
      ))}
    </div>
  );
};
