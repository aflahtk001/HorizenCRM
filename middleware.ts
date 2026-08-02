import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const headers = new Headers();
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return NextResponse.next({
    headers,
  });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
