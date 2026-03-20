import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';
import { getAuthCookieConfig } from '@/lib/auth/cookie-config';


export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await dbConnect();

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Increment attempts for any unverified OTP for this email
      await OTP.updateMany(
        { email: normalizedEmail, verified: false },
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

    // Find admin by email
    const admin = await Admin.findOne({ email: normalizedEmail });

    // Get admin's actual role from database, default to 'admin' if not found
    const userRole = admin?.role || 'admin';

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: admin?._id?.toString() || normalizedEmail,
        email: normalizedEmail,
        role: userRole,
        type: 'access'
      },
      getJWTSecret(),
      { expiresIn: '15m' }
    );

    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      redirect: '/admin/dashboard'
    });
    
    // Use centralized cookie configuration for consistency
    const cookieOptions = getAuthCookieConfig();
    
    response.cookies.set('access-token', token, cookieOptions);

    // Clean up verified OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail, verified: true });

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
