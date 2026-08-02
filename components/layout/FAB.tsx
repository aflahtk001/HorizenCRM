'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB() {
  return (
    <Link href="/calls/new" className="hidden md:block fixed bottom-8 right-8 z-40">
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-glow hover:shadow-glow text-white flex items-center justify-center transition-colors"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </motion.div>
    </Link>
  );
}
