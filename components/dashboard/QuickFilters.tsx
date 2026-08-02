'use client';

import { motion } from 'framer-motion';
import { QuickFilter } from '@/types';
import { cn } from '@/lib/utils/cn';

interface QuickFilterItem {
  key: QuickFilter;
  label: string;
  emoji: string;
}

const quickFilters: QuickFilterItem[] = [
  { key: 'today', label: "Today's Calls", emoji: '📅' },
  { key: 'tomorrow', label: 'Tomorrow', emoji: '🗓' },
  { key: 'this-week', label: 'This Week', emoji: '📆' },
  { key: 'this-month', label: 'This Month', emoji: '🗃' },
  { key: 'upcoming', label: 'Upcoming', emoji: '⏳' },
  { key: 'overdue', label: 'Overdue', emoji: '🔴' },
  { key: 'answered', label: 'Answered', emoji: '✅' },
  { key: 'rejected', label: 'Rejected', emoji: '❌' },
  { key: 'website-discussed', label: 'Discussed', emoji: '🌐' },
  { key: 'not-discussed', label: 'Not Discussed', emoji: '⬜' },
  { key: 'aflah', label: 'Aflah', emoji: '👤' },
  { key: 'anna', label: 'Anna', emoji: '👤' },
];

interface QuickFiltersProps {
  activeFilter: QuickFilter;
  onFilterChange: (filter: QuickFilter) => void;
}

export default function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      {quickFilters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <motion.button
            key={filter.key}
            whileTap={{ scale: 0.93 }}
            onClick={() => onFilterChange(isActive ? '' : filter.key)}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap',
              isActive
                ? 'bg-primary-600 text-white border-primary-600 shadow-glow-sm'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            <span>{filter.emoji}</span>
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}
