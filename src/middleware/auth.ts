import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-this-in-production'
    ) as JWTPayload;
    
    return decoded;
  } catch (error) {
    return null;
  }
}
