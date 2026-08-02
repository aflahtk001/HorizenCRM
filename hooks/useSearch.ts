'use client';

import { useState, useEffect, useCallback } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch(initialValue = '') {
  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, 350);

  const clearSearch = useCallback(() => setSearch(''), []);

  return { search, setSearch, debouncedSearch, clearSearch };
}
