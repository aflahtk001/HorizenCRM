'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Phone, Filter, X, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { useCalls } from '@/hooks/useCalls';
import { useUser } from '@/hooks/useUser';
import { useSearch } from '@/hooks/useSearch';
import { useFilters } from '@/hooks/useFilters';
import CallCard from '@/components/calls/CallCard';
import CallTable from '@/components/calls/CallTable';
import SearchBar from '@/components/dashboard/SearchBar';
import QuickFilters from '@/components/dashboard/QuickFilters';
import { CallCardSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { CALL_STATUS_OPTIONS } from '@/lib/utils/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { search, setSearch, debouncedSearch, clearSearch } = useSearch();
  const { filters, updateFilter, setQuickFilter, resetFilters, hasActiveFilters } = useFilters();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showFilters, setShowFilters] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/login');
    }
  }, [isLoaded, user, router]);

  const activeFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch]);

  const { calls, isLoading, error, refetch, deleteCall } = useCalls(activeFilters);

  if (!isLoaded || !user) return null;

  const skeletonCount = 6;

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto">
      {/* Header (desktop only) */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Call Records
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {isLoading ? 'Loading...' : `${calls.length} records`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title={viewMode === 'cards' ? 'Switch to table' : 'Switch to cards'}
          >
            {viewMode === 'cards' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
          <button
            onClick={refetch}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={clearSearch}
        className="mb-3"
      />

      {/* Filters Row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 overflow-hidden">
          <QuickFilters
            activeFilter={filters.quickFilter || ''}
            onFilterChange={setQuickFilter}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Filter className="w-3 h-3" />
          Filters
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-3"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select
                  id="filterStatus"
                  label="Call Status"
                  value={filters.callStatus || ''}
                  onChange={(e) => updateFilter('callStatus', e.target.value as any)}
                  options={CALL_STATUS_OPTIONS}
                  placeholder="All statuses"
                />
                <Select
                  id="filterWebsite"
                  label="Website Discussed"
                  value={filters.websiteDiscussed || ''}
                  onChange={(e) => updateFilter('websiteDiscussed', e.target.value as any)}
                  options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                  placeholder="All"
                />
                <Select
                  id="filterAddedBy"
                  label="Added By"
                  value={filters.addedBy || ''}
                  onChange={(e) => updateFilter('addedBy', e.target.value)}
                  options={[{ value: 'Aflah', label: 'Aflah' }, { value: 'Anna', label: 'Anna' }]}
                  placeholder="Anyone"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Follow Up Date</label>
                  <input
                    type="date"
                    value={filters.followUpDate || ''}
                    onChange={(e) => updateFilter('followUpDate', e.target.value)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">From Date</label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => updateFilter('startDate', e.target.value)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">To Date</label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => updateFilter('endDate', e.target.value)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<X className="w-3 h-3" />}>
                  Clear filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record count */}
      {!isLoading && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3 md:hidden">
          {calls.length} {calls.length === 1 ? 'record' : 'records'}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-4 text-sm text-red-600 dark:text-red-400">
          {error} —{' '}
          <button onClick={refetch} className="underline font-medium">
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <>
          {/* Mobile skeletons */}
          <div className="space-y-3 md:hidden">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <CallCardSkeleton key={i} />
            ))}
          </div>
          {/* Desktop skeleton table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                  {['Shop Name', 'Phone', 'Status', 'Website', 'Follow Up', 'Added By', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-50 dark:divide-zinc-800">
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : calls.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            {debouncedSearch || hasActiveFilters ? 'No records match' : 'No call records yet'}
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-6">
            {debouncedSearch || hasActiveFilters
              ? 'Try different search terms or filters'
              : 'Start by adding your first cold call'}
          </p>
          {hasActiveFilters && (
            <Button variant="secondary" onClick={resetFilters}>
              Clear all filters
            </Button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Mobile: Card View */}
          <div className="space-y-3 md:hidden">
            <AnimatePresence>
              {calls.map((call, i) => (
                <CallCard key={call._id} call={call} onDelete={deleteCall} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop: Table or Card view based on toggle */}
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              <CallTable calls={calls} onDelete={deleteCall} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {calls.map((call, i) => (
                    <CallCard key={call._id} call={call} onDelete={deleteCall} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
