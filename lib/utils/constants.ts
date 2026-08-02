import { CallStatus } from '@/types';

export const CALL_STATUS_OPTIONS: { value: CallStatus; label: string }[] = [
  { value: 'Answered', label: 'Answered' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Busy', label: 'Busy' },
  { value: 'No Answer', label: 'No Answer' },
  { value: 'Switched Off', label: 'Switched Off' },
  { value: 'Call Back Later', label: 'Call Back Later' },
];

export const WEBSITE_DISCUSSED_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const USERS = ['Aflah', 'Anna'] as const;

export const STATUS_COLORS: Record<CallStatus, {
  bg: string;
  text: string;
  border: string;
  dot: string;
  darkBg: string;
  darkText: string;
}> = {
  'Answered': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    darkBg: 'dark:bg-emerald-950/50',
    darkText: 'dark:text-emerald-400',
  },
  'Rejected': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    darkBg: 'dark:bg-red-950/50',
    darkText: 'dark:text-red-400',
  },
  'Busy': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    darkBg: 'dark:bg-orange-950/50',
    darkText: 'dark:text-orange-400',
  },
  'No Answer': {
    bg: 'bg-zinc-50',
    text: 'text-zinc-600',
    border: 'border-zinc-200',
    dot: 'bg-zinc-400',
    darkBg: 'dark:bg-zinc-800/50',
    darkText: 'dark:text-zinc-400',
  },
  'Switched Off': {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
    darkBg: 'dark:bg-slate-800/50',
    darkText: 'dark:text-slate-400',
  },
  'Call Back Later': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    darkBg: 'dark:bg-blue-950/50',
    darkText: 'dark:text-blue-400',
  },
};

export const INDIA_PHONE_CODE = '+91';
export const WHATSAPP_BASE = 'https://wa.me/91';
export const TEL_BASE = 'tel:+91';
