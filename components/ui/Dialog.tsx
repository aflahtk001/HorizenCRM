'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-950' : 'bg-orange-100 dark:bg-orange-950'}`}>
              <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' : 'text-orange-500'}`} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{description}</p>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={onClose} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                fullWidth
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
