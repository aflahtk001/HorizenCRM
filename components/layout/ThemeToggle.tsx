'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 dark:hidden" />
    </motion.button>
  );
}
