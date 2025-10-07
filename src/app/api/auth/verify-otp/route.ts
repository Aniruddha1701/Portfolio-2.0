import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Increment attempts for any unverified OTP for this email
      await OTP.updateMany(
        { email, verified: false },
        { $inc: { attempts: 1 } }
      );

      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: 'Maximum attempts exceeded. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        email,
        role: 'admin',
        verifiedAt: new Date().toISOString()
      },
      process.env.JWT_SECRET || 'your-secret-key',
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

    // Clean up verified OTPs for this email
    await OTP.deleteMany({ email, verified: true });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      redirect: '/admin/dashboard'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
