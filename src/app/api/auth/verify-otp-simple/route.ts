import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log('Verifying OTP:', { email, otp });

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const otpRecord = await OTP.findOne({
      email,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    console.log('OTP Record found:', !!otpRecord);

    if (!otpRecord) {
      await OTP.updateMany(
        { email, verified: false },
        { $inc: { attempts: 1 } }
      );

      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: 'Maximum attempts exceeded. Please request a new OTP.' },
        { status: 429 }
      );
    }

    otpRecord.verified = true;
    await otpRecord.save();

    const token = jwt.sign(
      { 
        email,
        role: 'admin',
        verifiedAt: new Date().toISOString()
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    await OTP.deleteMany({ email, verified: true });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      redirect: '/admin/dashboard'
    });

  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
