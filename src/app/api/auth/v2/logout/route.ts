import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import RefreshToken from '@/models/RefreshToken';
import Session from '@/models/Session';
import AuditLog from '@/models/AuditLog';
import { verifyRefreshToken, getRefreshTokenFromCookie, getAccessTokenFromCookie } from '@/lib/auth/tokens';
import { getClearCookieConfig } from '@/lib/auth/cookie-config';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const refreshTokenValue = await getRefreshTokenFromCookie();
    const accessTokenValue = await getAccessTokenFromCookie();

    let userId: string | null = null;

    if (refreshTokenValue) {
      const decoded = verifyRefreshToken(refreshTokenValue);
      if (decoded) {
        userId = decoded.userId;

        await RefreshToken.updateOne(
          { token: refreshTokenValue },
          { isRevoked: true }
        );

        await Session.updateMany(
          { user: userId, isActive: true },
          { isActive: false }
        );

        await AuditLog.create({
          user: userId,
          action: 'logout',
          status: 'success',
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || ''
        });
      }
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set('access-token', '', getClearCookieConfig());
    response.cookies.set('refresh-token', '', getClearCookieConfig());
    response.cookies.set('auth-token', '', getClearCookieConfig());
    response.cookies.set('admin-token', '', getClearCookieConfig());
    response.cookies.set('admin-session', '', getClearCookieConfig());

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set('access-token', '', getClearCookieConfig());
    response.cookies.set('refresh-token', '', getClearCookieConfig());
    response.cookies.set('auth-token', '', getClearCookieConfig());
    response.cookies.set('admin-token', '', getClearCookieConfig());
    response.cookies.set('admin-session', '', getClearCookieConfig());

    return response;
  }
}
