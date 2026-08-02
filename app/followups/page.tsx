'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, List } from 'lucide-react';
import { useCalls } from '@/hooks/useCalls';
import { useUser } from '@/hooks/useUser';
import FollowUpCalendar from '@/components/calendar/FollowUpCalendar';
import CallCard from '@/components/calls/CallCard';
import { CallCardSkeleton } from '@/components/ui/Skeleton';
import { getFollowUpStatus } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

type Tab = 'calendar' | 'list';

const sectionColors = {
  overdue: 'text-red-600 dark:text-red-400',
  today: 'text-orange-600 dark:text-orange-400',
  tomorrow: 'text-blue-600 dark:text-blue-400',
  upcoming: 'text-emerald-600 dark:text-emerald-400',
};

const sectionBg = {
  overdue: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900',
  today: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900',
  tomorrow: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900',
  upcoming: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900',
};

export default function FollowUpsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('list');

  useEffect(() => {
    if (isLoaded && !user) router.replace('/login');
  }, [isLoaded, user, router]);

  // Only fetch calls that have follow-up dates
  const { calls, isLoading, deleteCall } = useCalls({});

  const callsWithFollowUp = useMemo(() => {
    return calls.filter((c) => c.followUpDate);
  }, [calls]);

  // Group by status
  const grouped = useMemo(() => {
    const groups: Record<string, typeof callsWithFollowUp> = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
    };

    callsWithFollowUp.forEach((call) => {
      const status = getFollowUpStatus(call.followUpDate);
      if (status !== 'none') {
        groups[status].push(call);
      }
    });

    return groups;
  }, [callsWithFollowUp]);

  if (!isLoaded || !user) return null;

  const tabs = [
    { key: 'list' as Tab, icon: List, label: 'List View' },
    { key: 'calendar' as Tab, icon: Calendar, label: 'Calendar' },
  ];

  const sections = [
    { key: 'overdue', label: '🔴 Overdue', emoji: '⚠️' },
    { key: 'today', label: '🟠 Today', emoji: '📅' },
    { key: 'tomorrow', label: '🔵 Tomorrow', emoji: '📆' },
    { key: 'upcoming', label: '🟢 Upcoming', emoji: '⏳' },
  ];

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 max-w-4xl mx-auto">
      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Follow Ups</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {callsWithFollowUp.length} scheduled follow-ups
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-soft'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {activeTab === 'calendar' ? (
        <FollowUpCalendar calls={callsWithFollowUp} />
      ) : (
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <CallCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            sections.map(({ key, label }) => {
              const sectionCalls = grouped[key as keyof typeof grouped];
              if (!sectionCalls || sectionCalls.length === 0) return null;
              const colorClass = sectionColors[key as keyof typeof sectionColors];
              const bgClass = sectionBg[key as keyof typeof sectionBg];

              return (
                <div key={key}>
                  <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border mb-3', bgClass)}>
                    <span className={cn('text-sm font-semibold', colorClass)}>{label}</span>
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20', colorClass)}>
                      {sectionCalls.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {sectionCalls.map((call, i) => (
                      <CallCard key={call._id} call={call} onDelete={deleteCall} index={i} />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {!isLoading && callsWithFollowUp.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                No follow-ups scheduled
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-600">
                Add follow-up dates when creating call records
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
