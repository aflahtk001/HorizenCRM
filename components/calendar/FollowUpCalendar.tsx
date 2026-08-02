'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isTomorrow,
  isPast,
  getDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Call } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/formatters';

interface FollowUpCalendarProps {
  calls: Call[];
}

export default function FollowUpCalendar({ calls }: FollowUpCalendarProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start with empty days for correct weekday alignment
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);

  const getCallsForDay = (day: Date): Call[] => {
    return calls.filter((call) => {
      if (!call.followUpDate) return false;
      try {
        return isSameDay(parseISO(call.followUpDate), day);
      } catch {
        return false;
      }
    });
  };

  const getDayStatus = (day: Date, dayCalls: Call[]): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none' => {
    if (dayCalls.length === 0) return 'none';
    if (isToday(day)) return 'today';
    if (isTomorrow(day)) return 'tomorrow';
    if (isPast(day)) return 'overdue';
    return 'upcoming';
  };

  const dayStatusColors = {
    overdue: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    today: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    tomorrow: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    upcoming: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    none: 'hover:bg-zinc-50 dark:hover:bg-zinc-800',
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-soft overflow-hidden">
      {/* Month Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="h-16 border-b border-r border-zinc-50 dark:border-zinc-800/50" />
        ))}

        {days.map((day, i) => {
          const dayCalls = getCallsForDay(day);
          const status = getDayStatus(day, dayCalls);
          const isCurrentDay = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              whileTap={dayCalls.length > 0 ? { scale: 0.97 } : {}}
              onClick={() => {
                if (dayCalls.length === 1) {
                  router.push(`/calls/${dayCalls[0]._id}`);
                }
              }}
              className={cn(
                'h-16 border-b border-r border-zinc-50 dark:border-zinc-800/50 p-1.5 flex flex-col relative transition-colors',
                dayCalls.length > 0 && 'cursor-pointer',
                status !== 'none' && dayStatusColors[status]
              )}
            >
              <span className={cn(
                'text-xs font-medium leading-none mb-1',
                isCurrentDay
                  ? 'w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center'
                  : 'text-zinc-600 dark:text-zinc-400'
              )}>
                {format(day, 'd')}
              </span>

              {dayCalls.length > 0 && (
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {dayCalls.slice(0, 2).map((call) => (
                    <div
                      key={call._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/calls/${call._id}`);
                      }}
                      className="text-[9px] leading-tight font-medium truncate cursor-pointer"
                    >
                      {call.shopName}
                    </div>
                  ))}
                  {dayCalls.length > 2 && (
                    <div className="text-[9px] opacity-60">+{dayCalls.length - 2} more</div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-6 py-3 border-t border-zinc-100 dark:border-zinc-800">
        {[
          { label: 'Overdue', color: 'bg-red-400' },
          { label: 'Today', color: 'bg-orange-400' },
          { label: 'Tomorrow', color: 'bg-blue-400' },
          { label: 'Upcoming', color: 'bg-emerald-400' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-sm', item.color)} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
