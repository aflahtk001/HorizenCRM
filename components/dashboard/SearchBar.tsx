'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search shops, numbers, remarks...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base transition-all duration-150 min-h-[44px]"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
