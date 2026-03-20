// Simple session management for admin
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-this-in-production';
const SESSION_NAME = 'admin-session';

export interface SessionData {
  isLoggedIn: boolean;
  email: string;
  id: string;
}

export async function createSession(data: SessionData): Promise<void> {
  const token = jwt.sign(data, JWT_SECRET, { expiresIn: '15m' });
  
  cookies().set(SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes
    path: '/'
  });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const token = cookies().get(SESSION_NAME)?.value;
    
    if (!token) {
      console.log('No session token found');
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
    return decoded;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  cookies().delete(SESSION_NAME);
}
