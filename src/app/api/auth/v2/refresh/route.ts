import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import AuditLog from '@/models/AuditLog';
import { generateTokenPair, verifyRefreshToken, getRefreshTokenFromCookie } from '@/lib/auth/tokens';
import { getAccessTokenCookieConfig, getRefreshTokenCookieConfig, getClearCookieConfig } from '@/lib/auth/cookie-config';

function getDeviceInfo(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: 'Refresh token has been revoked or expired' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or account is disabled' },
        { status: 401 }
      );
    }

    await RefreshToken.updateOne(
      { _id: storedToken._id },
      { isRevoked: true }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt,
      isRevoked: false,
      deviceInfo: getDeviceInfo(request.headers.get('user-agent') || ''),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || ''
    });

    await AuditLog.create({
      user: user._id,
      action: 'refresh_token',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || ''
    });

    const response = NextResponse.json(
      {
        message: 'Token refreshed successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set('access-token', newAccessToken, getAccessTokenCookieConfig());
    response.cookies.set('refresh-token', newRefreshToken, getRefreshTokenCookieConfig());

    return response;

  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
