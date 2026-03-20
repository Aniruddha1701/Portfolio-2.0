import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';

// GET - Verify current authentication status
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin-token');
    
    if (!adminToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    const user = jwt.verify(
      adminToken.value,
      getJWTSecret()
    );
    
    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          email: (user as any).email,
          role: (user as any).role
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Verification failed', details: error.message },
      { status: 500 }
    );
  }
}
