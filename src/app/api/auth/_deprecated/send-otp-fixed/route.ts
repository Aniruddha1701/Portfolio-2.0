import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import OTP from '@/models/OTP';

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { email, password } = body;

    // Hardcode admin credentials for reliability
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

    try {
      // Connect to database
      await dbConnect();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      // Continue without database for now
    }

    // Generate new OTP
    const otpCode = generateOTP();
    
    // Log OTP to console (for development)
    console.log('================================================');
    console.log('🔐 ADMIN OTP CODE:', otpCode);
    console.log('For email:', email);
    console.log('Time:', new Date().toLocaleString());
    console.log('================================================');

    try {
      // Try to save OTP to database
      await OTP.deleteMany({ email, verified: false });
      await OTP.create({
        email,
        otp: otpCode,
      });
    } catch (dbError) {
      console.log('Could not save OTP to database, but OTP is:', otpCode);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'OTP generated successfully (check server console)',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      debug: process.env.NODE_ENV === 'development' ? { otp: otpCode } : undefined
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate OTP',
        details: error.message
      },
      { status: 500 }
    );
  }
}
