import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import Session from '@/models/Session';
import AuditLog from '@/models/AuditLog';
import { generateTokenPair, verifyRefreshToken } from '@/lib/auth/tokens';
import { getAccessTokenCookieConfig, getRefreshTokenCookieConfig } from '@/lib/auth/cookie-config';
import { authRateLimit } from '@/middleware/rate-limit';

function getDeviceInfo(userAgent: string): string {
  if (!userAgent) return 'Unknown Device';
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = authRateLimit()(request);
    if (rateLimitResponse) return rateLimitResponse;

    await dbConnect();

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: 'user',
      isEmailVerified: false,
      isActive: true
    });

    const { accessToken, refreshToken } = generateTokenPair(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
      isRevoked: false,
      deviceInfo: getDeviceInfo(request.headers.get('user-agent') || ''),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || ''
    });

    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + 7);

    await Session.create({
      user: user._id,
      deviceInfo: getDeviceInfo(request.headers.get('user-agent') || ''),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      isActive: true,
      expiresAt: sessionExpiresAt
    });

    await AuditLog.create({
      user: user._id,
      action: 'register',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      deviceInfo: getDeviceInfo(request.headers.get('user-agent') || ''),
      email: user.email
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 201 }
    );

    response.cookies.set('access-token', accessToken, getAccessTokenCookieConfig());
    response.cookies.set('refresh-token', refreshToken, getRefreshTokenCookieConfig());

    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
