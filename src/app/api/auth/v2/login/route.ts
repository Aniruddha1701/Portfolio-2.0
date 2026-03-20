import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import Session from '@/models/Session';
import AuditLog from '@/models/AuditLog';
import { generateTokenPair } from '@/lib/auth/tokens';
import { getAccessTokenCookieConfig, getRefreshTokenCookieConfig } from '@/lib/auth/cookie-config';
import { authRateLimit } from '@/middleware/rate-limit';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

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

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      await AuditLog.create({
        action: 'failed_login',
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
        email: email.toLowerCase(),
        metadata: { reason: 'User not found' }
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      await AuditLog.create({
        user: user._id,
        action: 'failed_login',
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
        email: user.email,
        metadata: { reason: 'Account disabled' }
      });

      return NextResponse.json(
        { error: 'Account is disabled. Contact administrator.' },
        { status: 403 }
      );
    }

    if (user.isLocked()) {
      await AuditLog.create({
        user: user._id,
        action: 'account_locked',
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
        email: user.email,
        metadata: { lockUntil: user.lockUntil }
      });

      return NextResponse.json(
        { error: 'Account is temporarily locked. Try again later.' },
        { status: 429 }
      );
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
        await AuditLog.create({
          user: user._id,
          action: 'account_locked',
          status: 'failure',
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || '',
          email: user.email,
          metadata: { reason: 'Max failed attempts reached' }
        });
      }
      
      await user.save();

      await AuditLog.create({
        user: user._id,
        action: 'failed_login',
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
        email: user.email,
        metadata: { attempts: user.failedLoginAttempts }
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

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
      action: 'login',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      deviceInfo: getDeviceInfo(request.headers.get('user-agent') || ''),
      email: user.email
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set('access-token', accessToken, getAccessTokenCookieConfig());
    response.cookies.set('refresh-token', refreshToken, getRefreshTokenCookieConfig());

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
