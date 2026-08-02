'use client';

import { useState, useEffect } from 'react';
import { AddedBy } from '@/types';

const USER_KEY = 'horizen_crm_user';

export function useUser() {
  const [user, setUser] = useState<AddedBy | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY) as AddedBy | null;
    setUser(stored);
    setIsLoaded(true);
  }, []);

  const login = (selectedUser: AddedBy) => {
    localStorage.setItem(USER_KEY, selectedUser);
    setUser(selectedUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return { user, login, logout, isLoaded };
}
