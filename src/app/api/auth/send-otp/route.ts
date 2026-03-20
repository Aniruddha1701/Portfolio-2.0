import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
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

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find admin by email and verify password using bcrypt
    const admin = await Admin.findOne({ email: email.toLowerCase().trim(), isActive: true });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Use bcrypt to compare passwords (Admin password is hashed in the database)
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if there's a recent OTP (within last 1 minute)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase().trim(),
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
    await OTP.deleteMany({ email: email.toLowerCase().trim(), verified: false });

    // Generate new OTP
    const otpCode = generateOTP();

    // Save OTP to database
    const newOTP = await OTP.create({
      email: email.toLowerCase().trim(),
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
