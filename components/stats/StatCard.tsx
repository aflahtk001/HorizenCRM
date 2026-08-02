'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'red' | 'orange' | 'blue' | 'violet' | 'zinc' | 'pink';
  trend?: string;
  subtitle?: string;
  index?: number;
}

const colorMap = {
  indigo: {
    icon: 'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400',
    badge: 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400',
    text: 'text-primary-600 dark:text-primary-400',
    glow: 'hover:shadow-glow-sm',
  },
  emerald: {
    icon: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
  },
  red: {
    icon: 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400',
    badge: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    text: 'text-red-600 dark:text-red-400',
    glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  },
  orange: {
    icon: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
  },
  blue: {
    icon: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
  },
  violet: {
    icon: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',
  },
  zinc: {
    icon: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    badge: 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400',
    text: 'text-zinc-600 dark:text-zinc-400',
    glow: '',
  },
  pink: {
    icon: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400',
    text: 'text-pink-600 dark:text-pink-400',
    glow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  index = 0,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800',
        'p-4 shadow-soft dark:shadow-dark-soft transition-all duration-300',
        colors.glow,
        'hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', colors.badge)}>
            {trend}
          </span>
        )}
      </div>

      <div className={cn('text-3xl font-bold mb-0.5', colors.text)}>
        <AnimatedCounter end={value} />
      </div>

      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
      {subtitle && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{subtitle}</p>
      )}
    </motion.div>
  );
}
