'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import CallForm from '@/components/calls/CallForm';
import { ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';

export default function NewCallPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/login');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 md:bg-transparent md:min-h-0">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 md:hidden">
        <Link
          href="/"
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Call Record</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center gap-3 px-6 pt-6 pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
          <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Add New Call Record</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Record a new cold call or follow-up</p>
        </div>
      </div>

      {/* Form - full screen on mobile, max-width on desktop */}
      <div className="md:max-w-2xl md:mx-auto md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:bg-white md:dark:bg-zinc-900 md:rounded-2xl md:border md:border-zinc-100 md:dark:border-zinc-800 md:shadow-soft"
        >
          <CallForm user={user} />
        </motion.div>
      </div>
    </div>
  );
}
