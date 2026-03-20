import { NextRequest, NextResponse } from 'next/server';
import { getClearCookieConfig } from '@/lib/auth/cookie-config';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );
  
  // Use centralized cookie clear configuration
  const clearCookieOptions = getClearCookieConfig();
  
  response.cookies.set('auth-token', '', clearCookieOptions);
  response.cookies.set('admin-token', '', clearCookieOptions);
  response.cookies.set('admin-session', '', clearCookieOptions);
  
  return response;
}
