'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-glow-sm hover:shadow-glow',
  secondary: 'bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100',
  ghost: 'hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white',
  outline: 'border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg min-h-[28px]',
  sm: 'px-3 py-1.5 text-sm rounded-xl min-h-[36px]',
  md: 'px-4 py-2 text-sm rounded-xl min-h-[44px]',
  lg: 'px-5 py-2.5 text-base rounded-xl min-h-[48px]',
  xl: 'px-6 py-3.5 text-base rounded-2xl min-h-[56px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      onClick,
      type,
      form,
      name,
      value,
      ...rest
    },
    ref
  ) => {
    const buttonClass = cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed select-none',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    );

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ duration: 0.1 }}
        className={buttonClass}
        disabled={disabled || isLoading}
        onClick={onClick}
        type={type}
        form={form}
        name={name}
        value={value as string | number | readonly string[] | undefined}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
