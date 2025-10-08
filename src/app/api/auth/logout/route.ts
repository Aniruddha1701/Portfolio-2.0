import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );
  
  // Clear all auth cookies
  const clearCookieOptions = {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };
  
  response.cookies.set('auth-token', '', clearCookieOptions);
  response.cookies.set('admin-token', '', clearCookieOptions);
  response.cookies.set('admin-session', '', clearCookieOptions);
  
  return response;
}
