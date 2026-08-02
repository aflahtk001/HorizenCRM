import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
        <Phone className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
      </div>
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Page Not Found</h2>
      <p className="text-zinc-400 dark:text-zinc-600 mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-glow-sm hover:shadow-glow"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
