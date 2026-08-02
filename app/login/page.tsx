'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Zap, Users } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { AddedBy } from '@/types';
const users: { name: AddedBy; emoji: string; color: string }[] = [
  { name: 'Aflah', emoji: '👨‍💼', color: 'from-primary-500 to-primary-700' },
  { name: 'Anna', emoji: '👩‍💼', color: 'from-pink-500 to-rose-600' },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace('/');
    }
  }, [isLoaded, user, router]);

  const handleLogin = (selectedUser: AddedBy) => {
    login(selectedUser);
    router.replace('/');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <Phone className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Horizen CRM
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Web development agency call tracker
          </p>
        </div>

        {/* User Selection */}
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-dark-lg">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Who are you?</span>
          </div>

          <div className="space-y-3">
            {users.map((u, i) => (
              <motion.button
                key={u.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLogin(u.name)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-700 hover:border-primary-500 bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                  {u.emoji}
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">{u.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <p className="text-xs text-emerald-400">Ready to make calls</p>
                  </div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-600 mt-4">
            Your session is saved locally
          </p>
        </div>
      </motion.div>
    </div>
  );
}
