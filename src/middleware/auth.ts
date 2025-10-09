import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getJWTSecret } from '@/lib/auth/jwt-secret';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Check for any valid auth token in different cookie names
    const authToken = request.cookies.get('auth-token')?.value;
    const adminToken = request.cookies.get('admin-token')?.value;
    const adminSession = request.cookies.get('admin-session')?.value;
    
    const token = authToken || adminToken || adminSession;
    
    if (!token) {
      console.log('No valid auth token found in cookies');
      return null;
    }
    
    const decoded = jwt.verify(
      token,
      getJWTSecret()
    ) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
