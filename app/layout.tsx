import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/Providers';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import FAB from '@/components/layout/FAB';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Horizen CRM',
    template: '%s | Horizen CRM',
  },
  description: 'Professional CRM for web development agencies to manage cold calls, follow-ups, and client discussions.',
  keywords: ['CRM', 'sales', 'cold calling', 'web development', 'follow-up'],
  authors: [{ name: 'Horizen' }],
  creator: 'Horizen',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'Horizen CRM',
    description: 'Professional CRM for managing cold calls and follow-ups',
    siteName: 'Horizen CRM',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Providers>
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="md:ml-64 flex flex-col min-h-screen">
            {/* Mobile Top Bar */}
            <TopBar />

            {/* Page Content */}
            <main className="flex-1 pb-24 md:pb-8">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <BottomNav />

          {/* Desktop FAB */}
          <FAB />
        </Providers>
      </body>
    </html>
  );
}
