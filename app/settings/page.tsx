'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Moon, Sun, Phone, Info, Shield, Smartphone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { AddedBy } from '@/types';

const users: { name: AddedBy; emoji: string }[] = [
  { name: 'Aflah', emoji: '👨‍💼' },
  { name: 'Anna', emoji: '👩‍💼' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, login, logout, isLoaded } = useUser();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (isLoaded && !user) router.replace('/login');
  }, [isLoaded, user, router]);

  const handleSwitchUser = (newUser: AddedBy) => {
    login(newUser);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 max-w-2xl mx-auto space-y-4">
      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
          Profile
        </h2>
        <Card padding="md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-glow-sm">
              {user[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{user}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Currently signed in</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Switch User */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
          Switch User
        </h2>
        <Card padding="sm">
          <div className="flex flex-col gap-2 p-1">
            {users.map((u) => (
              <motion.button
                key={u.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSwitchUser(u.name)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-150 ${
                  user === u.name
                    ? 'bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <span className="text-2xl">{u.emoji}</span>
                <span className={`font-medium ${user === u.name ? 'text-primary-700 dark:text-primary-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {u.name}
                </span>
                {user === u.name && (
                  <span className="ml-auto text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
          Appearance
        </h2>
        <Card padding="sm">
          <div className="flex flex-col gap-1 p-1">
            {[
              { key: 'dark', icon: Moon, label: 'Dark Mode' },
              { key: 'light', icon: Sun, label: 'Light Mode' },
              { key: 'system', icon: Smartphone, label: 'System Default' },
            ].map(({ key, icon: Icon, label }) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(key)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-150 ${
                  theme === key
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {theme === key && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* App Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
          About
        </h2>
        <Card padding="md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Horizen CRM</span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Data stored securely</span>
              </div>
              <span className="text-xs text-emerald-500">MongoDB Atlas</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
              <Info className="w-4 h-4" />
              <span className="text-xs">Built for web development agencies</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button
          variant="danger"
          fullWidth
          size="lg"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={handleLogout}
          className="mt-2"
        >
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
