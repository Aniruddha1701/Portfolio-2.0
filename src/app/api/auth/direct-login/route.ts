import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';


export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Hardcode the correct credentials for now
    const adminEmail = 'aniruddhap66@gmail.com';
    const adminPassword = 'Tamdev54@#';

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'admin',
        email,
        role: 'admin',
        loginAt: new Date().toISOString()
      },
      getJWTSecret(),
      { expiresIn: '7d' }
    );

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      redirect: '/admin/dashboard'
    });
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    };
    
    response.cookies.set('auth-token', token, cookieOptions);
    response.cookies.set('admin-token', token, cookieOptions);
    response.cookies.set('admin-session', token, cookieOptions);

    return response;

  } catch (error: any) {
    console.error('Direct login error:', error);
    return NextResponse.json(
      { 
        error: 'Server error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
