'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Plus, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/followups', icon: Calendar, label: 'Follow Ups' },
  { href: '/calls/new', icon: Plus, label: 'Add', isCenter: true },
  { href: '/statistics', icon: BarChart2, label: 'Stats' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Glass background */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200/70 dark:border-zinc-800/70 pb-safe">
        <div className="flex items-center justify-around px-2 pt-2 pb-3">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href) && item.href !== '/';
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-6">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-2xl bg-primary-600 shadow-glow flex items-center justify-center"
                  >
                    <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400 font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                      : 'text-zinc-500 dark:text-zinc-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={cn(
                  'text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-zinc-500 dark:text-zinc-400'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
