import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getJWTSecret } from './jwt-secret';

const JWT_SECRET = getJWTSecret();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || `${getJWTSecret()}_refresh`;

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'super-admin';
  type: 'refresh';
  tokenId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'type' | 'tokenId'>): string {
  const tokenId = crypto.randomUUID();
  return jwt.sign(
    { ...payload, type: 'refresh', tokenId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function generateTokenPair(user: { _id: string; email: string; role: string }): TokenPair {
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as 'user' | 'admin' | 'super-admin'
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as 'user' | 'admin' | 'super-admin'
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAccessTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access-token')?.value || null;
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh-token')?.value || null;
}
