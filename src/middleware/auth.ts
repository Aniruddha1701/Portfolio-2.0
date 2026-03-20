import { NextRequest } from 'next/server';
import { verifyAccessToken, getAccessTokenFromCookie, getRefreshTokenFromCookie } from '@/lib/auth/tokens';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = await getAccessTokenFromCookie();
    
    if (!token) {
      return null;
    }
    
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function authenticateWithRefresh(request: NextRequest): Promise<AuthUser | null> {
  try {
    let token = await getAccessTokenFromCookie();
    
    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        return {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
      }
    }

    const refreshToken = await getRefreshTokenFromCookie();
    
    if (!refreshToken) {
      return null;
    }

    const decoded = require('@/lib/auth/tokens').verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return null;
    }

    await dbConnect();

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!storedToken) {
      return null;
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role as 'user' | 'admin' | 'super-admin'
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

type Role = 'user' | 'admin' | 'super-admin';

export function requireAuth() {
  return async (request: NextRequest): Promise<AuthUser | null> => {
    return authenticateWithRefresh(request);
  };
}

export function requireRole(...roles: Role[]) {
  return async (request: NextRequest): Promise<AuthUser | null> => {
    const user = await authenticateWithRefresh(request);
    
    if (!user) {
      return null;
    }
    
    if (!roles.includes(user.role)) {
      return null;
    }
    
    return user;
  };
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  return authenticateWithRefresh(request).then(user => {
    if (!user) return null;
    if (!['admin', 'super-admin'].includes(user.role)) return null;
    return user;
  });
}

export async function requireSuperAdmin(request: NextRequest): Promise<AuthUser | null> {
  return authenticateWithRefresh(request).then(user => {
    if (!user) return null;
    if (user.role !== 'super-admin') return null;
    return user;
  });
}
