'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import ThemeToggle from './ThemeToggle';
import { Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/followups': 'Follow Ups',
  '/statistics': 'Statistics',
  '/settings': 'Settings',
  '/calls/new': 'Add Call',
};

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useUser();

  const title = pageTitles[pathname] ?? 'Record';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/70 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {title}
          </h1>
          {user && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Hey, {user} 👋
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
