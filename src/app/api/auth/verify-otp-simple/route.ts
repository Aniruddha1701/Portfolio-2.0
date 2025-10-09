import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';


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
      getJWTSecret(),
      { expiresIn: '7d' }
    );

    // Use a response object to set cookies properly
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      redirect: '/admin/dashboard'
    });
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    };
    
    response.cookies.set('auth-token', token, cookieOptions);
    response.cookies.set('admin-token', token, cookieOptions);
    response.cookies.set('admin-session', token, cookieOptions);

    await OTP.deleteMany({ email, verified: true });

    return response;

  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
