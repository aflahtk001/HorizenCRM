'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export function CallCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <div className="flex gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 ${i === 0 ? 'w-32' : i === 1 ? 'w-28' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}
