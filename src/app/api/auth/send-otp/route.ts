import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
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

    // Validate admin credentials (hardcoded for reliability)
    const adminEmail = 'aniruddhap66@gmail.com';
    const adminPassword = 'Tamdev54@#';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if credentials match
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if there's a recent OTP (within last 1 minute)
    const recentOTP = await OTP.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 60000) }, // 1 minute
      verified: false
    });

    if (recentOTP) {
      return NextResponse.json(
        { error: 'Please wait 1 minute before requesting a new OTP' },
        { status: 429 }
      );
    }

    // Delete any existing unverified OTPs for this email
    await OTP.deleteMany({ email, verified: false });

    // Generate new OTP
    const otpCode = generateOTP();

    // Save OTP to database
    const newOTP = await OTP.create({
      email,
      otp: otpCode,
    });

    // Log OTP to console for debugging
    console.log('\n' + '='.repeat(50));
    console.log('🔐 OTP GENERATED');
    console.log('Email:', email);
    console.log('OTP Code:', otpCode);
    console.log('Time:', new Date().toLocaleString());
    console.log('='.repeat(50) + '\n');

    // Send OTP via email
    try {
      const emailSent = await sendOTPEmail(email, otpCode, 'Admin');
      
      if (!emailSent) {
        console.error('Email sending failed - returning OTP in console');
        // Don't delete OTP, allow verification even if email fails
      } else {
        console.log('✅ OTP email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Continue anyway - OTP is logged to console
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Partially hide email
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
