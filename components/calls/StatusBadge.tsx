'use client';

import { cn } from '@/lib/utils/cn';
import { CallStatus } from '@/types';
import { STATUS_COLORS } from '@/lib/utils/constants';

interface StatusBadgeProps {
  status: CallStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function StatusBadge({
  status,
  size = 'md',
  showDot = true,
}: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        colors.darkBg,
        colors.darkText,
        'dark:border-transparent',
        sizes[size]
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />
      )}
      {status}
    </span>
  );
}

interface WebsiteBadgeProps {
  discussed: 'Yes' | 'No';
  size?: 'sm' | 'md' | 'lg';
}

export function WebsiteBadge({ discussed, size = 'md' }: WebsiteBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        sizes[size],
        discussed === 'Yes'
          ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-transparent'
          : 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-transparent'
      )}
    >
      {discussed === 'Yes' ? '🌐 Discussed' : '⬜ Not Yet'}
    </span>
  );
}
