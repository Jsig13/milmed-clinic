'use client';

interface GlassSkeletonProps {
  className?: string;
}

export default function GlassSkeleton({ className = 'h-4 w-full' }: GlassSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`}
    />
  );
}
