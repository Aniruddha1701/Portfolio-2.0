import { NextRequest, NextResponse } from 'next/server';

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

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'aniruddhap66@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Tamdev54@#';

    console.log('Testing login with:');
    console.log('Received email:', email);
    console.log('Expected email:', adminEmail);
    console.log('Password match:', password === adminPassword);

    // Validate credentials
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

    // If credentials are correct, return success
    return NextResponse.json({
      success: true,
      message: 'Credentials are valid',
      email: email,
      note: 'This is a test endpoint - OTP functionality bypassed'
    });

  } catch (error: any) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { 
        error: 'Server error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Test login endpoint is working',
    adminEmail: process.env.ADMIN_EMAIL || 'Not set in environment',
    timestamp: new Date().toISOString()
  });
}
