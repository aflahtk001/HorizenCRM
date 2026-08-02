'use client';

import { useState, useCallback } from 'react';
import { CallFilters, QuickFilter } from '@/types';

const defaultFilters: CallFilters = {
  search: '',
  callStatus: '',
  websiteDiscussed: '',
  addedBy: '',
  followUpDate: '',
  startDate: '',
  endDate: '',
  quickFilter: '',
};

export function useFilters() {
  const [filters, setFilters] = useState<CallFilters>(defaultFilters);

  const updateFilter = useCallback(<K extends keyof CallFilters>(
    key: K,
    value: CallFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const setQuickFilter = useCallback((filter: QuickFilter) => {
    setFilters(prev => ({
      ...defaultFilters,
      search: prev.search,
      quickFilter: prev.quickFilter === filter ? '' : filter,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'search' && value !== ''
  );

  return {
    filters,
    updateFilter,
    setQuickFilter,
    resetFilters,
    hasActiveFilters,
  };
}
