'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  press?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, press = false, glass = false, padding = 'md', className, ...props }, ref) => {
    const baseClass = cn(
      'rounded-2xl border transition-all duration-200',
      glass
        ? 'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm border-white/20 dark:border-zinc-700/50'
        : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800',
      hover && 'hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer',
      'shadow-soft dark:shadow-dark-soft',
      paddings[padding],
      className
    );

    if (press) {
      return (
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={baseClass}
          onClick={props.onClick}
          style={props.style}
          id={props.id}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClass}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
