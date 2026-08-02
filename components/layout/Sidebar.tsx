'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  BarChart2,
  Settings,
  Phone,
  Zap,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUser } from '@/hooks/useUser';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/followups', icon: Calendar, label: 'Follow Ups' },
  { href: '/statistics', icon: BarChart2, label: 'Statistics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow-sm">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Horizen
            </span>
            <span className="block text-xs text-zinc-400 dark:text-zinc-500 -mt-0.5">
              CRM
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-3 w-1 h-5 rounded-full bg-primary-600"
                  />
                )}
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}

        {/* Add Call Button */}
        <div className="pt-2">
          <Link href="/calls/new">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-all duration-150 shadow-glow-sm hover:shadow-glow"
            >
              <Plus className="w-4 h-4" />
              Add Call
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user || 'Not logged in'}
              </p>
              <div className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-emerald-500" />
                <p className="text-xs text-emerald-500">Active</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
