import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
        email,
        role: 'admin',
        loginAt: new Date().toISOString()
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      redirect: '/admin/dashboard'
    });

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
