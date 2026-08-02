'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Call, CallFilters } from '@/types';
import toast from 'react-hot-toast';

export function useCalls(filters?: CallFilters) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const buildQueryString = useCallback((f?: CallFilters): string => {
    if (!f) return '';
    const params = new URLSearchParams();
    if (f.search) params.set('search', f.search);
    if (f.callStatus) params.set('callStatus', f.callStatus);
    if (f.websiteDiscussed) params.set('websiteDiscussed', f.websiteDiscussed);
    if (f.addedBy) params.set('addedBy', f.addedBy);
    if (f.followUpDate) params.set('followUpDate', f.followUpDate);
    if (f.startDate) params.set('startDate', f.startDate);
    if (f.endDate) params.set('endDate', f.endDate);
    if (f.quickFilter) params.set('quickFilter', f.quickFilter);
    return params.toString() ? `?${params.toString()}` : '';
  }, []);

  const fetchCalls = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const qs = buildQueryString(filters);
      const response = await fetch(`/api/calls${qs}`, {
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed to fetch calls');

      const data = await response.json();
      setCalls(data.data || []);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError('Failed to load calls');
    } finally {
      setIsLoading(false);
    }
  }, [filters, buildQueryString]);

  useEffect(() => {
    fetchCalls();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchCalls]);

  const deleteCall = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/calls/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setCalls(prev => prev.filter(c => c._id !== id));
      toast.success('Call record deleted');
      return true;
    } catch {
      toast.error('Failed to delete record');
      return false;
    }
  };

  return { calls, isLoading, error, refetch: fetchCalls, deleteCall };
}

export function useCall(id: string) {
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCall = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/calls/${id}`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      setCall(data.data);
    } catch {
      setError('Failed to load call record');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchCall();
  }, [id, fetchCall]);

  return { call, isLoading, error, refetch: fetchCall };
}
