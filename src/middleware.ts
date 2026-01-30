import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

export async function middleware(request: NextRequest) {
  // Protect admin routes (except login pages)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to all login pages
    if (request.nextUrl.pathname.includes('/login')) {
      // If user is already logged in, redirect to dashboard
      const adminToken = request.cookies.get('admin-token');
      const adminSession = request.cookies.get('admin-session');

      if (adminToken || adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Check for any valid admin session cookie
    const adminToken = request.cookies.get('admin-token');
    const authToken = request.cookies.get('auth-token');
    const adminSession = request.cookies.get('admin-session');

    if (!adminToken && !authToken && !adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
