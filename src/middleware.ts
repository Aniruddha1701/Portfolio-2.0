import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

export async function middleware(request: NextRequest) {
  // Protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const adminToken = request.cookies.get('admin-token');
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/portfolio/:path*',
    '/api/auth/:path*'
  ]
};
