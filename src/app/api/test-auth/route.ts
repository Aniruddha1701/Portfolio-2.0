import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

// GET - Test authentication status
export async function GET(request: NextRequest) {
  try {
    console.log('Testing authentication...');
    
    // Check cookies
    const cookies = request.cookies.getAll();
    console.log('All cookies:', cookies);
    
    const authToken = request.cookies.get('auth-token');
    console.log('Auth token cookie:', authToken);
    
    // Verify auth
    const user = await verifyAuth(request);
    console.log('Verified user:', user);
    
    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'No valid authentication found',
          hasCookie: !!authToken
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          email: user.email,
          id: user.id,
          role: user.role
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        error: 'Authentication check failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
