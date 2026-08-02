'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
              'border-zinc-200 dark:border-zinc-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-all duration-150',
              'min-h-[44px] px-4 py-2.5 text-base',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-400 focus:ring-red-400 dark:border-red-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
            'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
            'border-zinc-200 dark:border-zinc-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-150',
            'px-4 py-3 text-base resize-none',
            error && 'border-red-400 focus:ring-red-400 dark:border-red-500',
            className
          )}
          rows={4}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
