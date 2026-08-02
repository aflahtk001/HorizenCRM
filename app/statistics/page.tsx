'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Phone,
  CheckCircle,
  XCircle,
  PhoneOff,
  Globe,
  Calendar,
  Clock,
  AlertCircle,
  User,
  Users,
  TrendingUp,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { useUser } from '@/hooks/useUser';
import StatCard from '@/components/stats/StatCard';
import { StatCardSkeleton } from '@/components/ui/Skeleton';

export default function StatisticsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { stats, isLoading, error, refetch } = useStats();

  useEffect(() => {
    if (isLoaded && !user) router.replace('/login');
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) return null;

  const statCards = stats
    ? [
        {
          title: 'Total Calls',
          value: stats.total,
          icon: Phone,
          color: 'indigo' as const,
          subtitle: 'All time records',
        },
        {
          title: 'Answered',
          value: stats.answered,
          icon: CheckCircle,
          color: 'emerald' as const,
          subtitle: stats.total > 0 ? `${Math.round((stats.answered / stats.total) * 100)}% success rate` : 'No calls yet',
        },
        {
          title: 'Rejected',
          value: stats.rejected,
          icon: XCircle,
          color: 'red' as const,
        },
        {
          title: 'Busy / No Answer',
          value: stats.busy,
          icon: PhoneOff,
          color: 'orange' as const,
        },
        {
          title: 'Website Discussed',
          value: stats.websiteDiscussed,
          icon: Globe,
          color: 'violet' as const,
          subtitle: 'Potential leads',
        },
        {
          title: "Today's Follow Ups",
          value: stats.followUpsToday,
          icon: Calendar,
          color: 'orange' as const,
          subtitle: "Due today",
        },
        {
          title: 'Upcoming Follow Ups',
          value: stats.upcomingFollowUps,
          icon: Clock,
          color: 'blue' as const,
        },
        {
          title: 'Overdue Follow Ups',
          value: stats.overdueFollowUps,
          icon: AlertCircle,
          color: 'red' as const,
          subtitle: 'Needs attention',
        },
        {
          title: "Aflah's Calls",
          value: stats.callsByAflah,
          icon: User,
          color: 'indigo' as const,
        },
        {
          title: "Anna's Calls",
          value: stats.callsByAnna,
          icon: User,
          color: 'pink' as const,
        },
        {
          title: 'Calls This Week',
          value: stats.callsThisWeek,
          icon: TrendingUp,
          color: 'emerald' as const,
        },
        {
          title: 'Calls This Month',
          value: stats.callsThisMonth,
          icon: BarChart2,
          color: 'indigo' as const,
        },
      ]
    : [];

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Statistics</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Overview of your calling activity
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-5 md:hidden">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Overview of calling activity
        </p>
        <button
          onClick={refetch}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-4 text-sm text-red-600 dark:text-red-400">
          Failed to load statistics. <button onClick={refetch} className="underline font-medium">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card, i) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                subtitle={card.subtitle}
                index={i}
              />
            ))}
      </div>

      {/* Team comparison */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Team Activity</h2>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Aflah', calls: stats.callsByAflah, color: 'bg-primary-500' },
              { name: 'Anna', calls: stats.callsByAnna, color: 'bg-pink-500' },
            ].map((member) => {
              const percentage = stats.total > 0
                ? Math.round((member.calls / stats.total) * 100)
                : 0;

              return (
                <div key={member.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{member.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{member.calls}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${member.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
