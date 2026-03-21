import { NextRequest } from 'next/server';
import { 
  verifyAccessToken, 
  verifyRefreshToken,
  getAccessTokenFromCookie, 
  getRefreshTokenFromCookie 
} from '@/lib/auth/tokens';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
}

/**
 * Quick authentication check (access token only)
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = await getAccessTokenFromCookie();
    if (!token) return null;
    
    const decoded = verifyAccessToken(token);
    if (!decoded) return null;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('[Verify Auth Error]:', error);
    return null;
  }
}

/**
 * Full authentication with refresh token fallback
 */
export async function authenticateWithRefresh(request: NextRequest): Promise<AuthUser | null> {
  try {
    // 1. Try access token
    const token = await getAccessTokenFromCookie();
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

    // 2. Try refresh token
    const refreshToken = await getRefreshTokenFromCookie();
    if (!refreshToken) return null;

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return null;

    await dbConnect();

    // Verify token is in DB and not revoked
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!storedToken) return null;

    // Verify user is still active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) return null;

    return {
      userId: user._id.toString(),
      email: user.email,
      role: user.role as 'user' | 'admin' | 'super-admin'
    };
  } catch (error) {
    console.error('[Auth Refresh Error]:', error);
    return null;
  }
}

type Role = 'user' | 'admin' | 'super-admin';

/**
 * Require a specific role
 */
export async function requireRole(request: NextRequest, ...roles: Role[]): Promise<AuthUser | null> {
  const user = await authenticateWithRefresh(request);
  if (!user) return null;
  
  if (!roles.includes(user.role)) return null;
  
  return user;
}

/**
 * Helper for Admin routes
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  return requireRole(request, 'admin', 'super-admin');
}

/**
 * Helper for SuperAdmin routes
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AuthUser | null> {
  return requireRole(request, 'super-admin');
}
