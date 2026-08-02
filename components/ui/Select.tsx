'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
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
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
              'border-zinc-200 dark:border-zinc-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-all duration-150',
              'min-h-[44px] px-4 pr-10 py-2.5 text-base',
              error && 'border-red-400 focus:ring-red-400 dark:border-red-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
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

Select.displayName = 'Select';

export default Select;
